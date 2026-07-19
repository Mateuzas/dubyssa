import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  mockConstructEvent,
  mockUpdateWhere,
  mockUpdateSet,
  mockSelectResult,
  headerState,
} = vi.hoisted(() => ({
  mockConstructEvent: vi.fn(),
  mockUpdateWhere: vi.fn(),
  mockUpdateSet: vi.fn(),
  mockSelectResult: { current: [] as { id: string; totalCents: number; status: string }[] },
  headerState: { signature: null as string | null },
}));

vi.mock("next/headers", () => ({
  headers: async () => ({
    get: (name: string) =>
      name === "stripe-signature" ? headerState.signature : null,
  }),
}));

vi.mock("@/lib/stripe", () => ({
  getStripe: () => ({
    webhooks: { constructEvent: mockConstructEvent },
  }),
}));

vi.mock("@/lib/db", () => ({
  getDb: () => ({
    select: () => ({
      from: () => ({
        where: async () => mockSelectResult.current,
      }),
    }),
    update: () => ({
      set: (vals: unknown) => {
        mockUpdateSet(vals);
        return { where: mockUpdateWhere };
      },
    }),
  }),
}));

const { POST } = await import("./route");

function makeRequest() {
  return new Request("http://localhost/api/webhooks/stripe", {
    method: "POST",
    body: "raw-stripe-payload",
  });
}

beforeEach(() => {
  vi.clearAllMocks();
  headerState.signature = "valid-signature";
  mockUpdateWhere.mockResolvedValue(undefined);
  mockSelectResult.current = [];
});

describe("POST /api/webhooks/stripe", () => {
  it("returns 400 when the stripe-signature header is missing", async () => {
    headerState.signature = null;
    const res = await POST(makeRequest());
    expect(res.status).toBe(400);
    expect(mockConstructEvent).not.toHaveBeenCalled();
  });

  it("returns 400 when signature verification fails", async () => {
    mockConstructEvent.mockImplementation(() => {
      throw new Error("bad signature");
    });
    const res = await POST(makeRequest());
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toMatch(/invalid signature/i);
  });

  it("marks the order paid on payment_intent.succeeded when the amount matches", async () => {
    mockSelectResult.current = [
      { id: "order-2", totalCents: 4500, status: "pending" },
    ];
    mockConstructEvent.mockReturnValue({
      type: "payment_intent.succeeded",
      data: {
        object: { id: "pi_456", amount: 4500, metadata: { orderId: "order-2" } },
      },
    });

    await POST(makeRequest());

    expect(mockUpdateSet).toHaveBeenCalledWith(
      expect.objectContaining({ status: "paid", stripePaymentId: "pi_456" })
    );
  });

  it("does not mark the order paid when the charged amount doesn't match the order total", async () => {
    mockSelectResult.current = [
      { id: "order-2", totalCents: 4500, status: "pending" },
    ];
    mockConstructEvent.mockReturnValue({
      type: "payment_intent.succeeded",
      data: {
        object: { id: "pi_456", amount: 100, metadata: { orderId: "order-2" } },
      },
    });

    await POST(makeRequest());

    expect(mockUpdateSet).not.toHaveBeenCalled();
  });

  it("does not mark anything paid when the order doesn't exist", async () => {
    mockSelectResult.current = [];
    mockConstructEvent.mockReturnValue({
      type: "payment_intent.succeeded",
      data: {
        object: { id: "pi_456", amount: 4500, metadata: { orderId: "order-missing" } },
      },
    });

    await POST(makeRequest());

    expect(mockUpdateSet).not.toHaveBeenCalled();
  });

  it("marks the order cancelled on payment_intent.payment_failed", async () => {
    mockConstructEvent.mockReturnValue({
      type: "payment_intent.payment_failed",
      data: {
        object: { id: "pi_789", metadata: { orderId: "order-3" } },
      },
    });

    await POST(makeRequest());

    expect(mockUpdateSet).toHaveBeenCalledWith(
      expect.objectContaining({ status: "cancelled" })
    );
  });

  it("acknowledges unhandled event types without touching the DB", async () => {
    mockConstructEvent.mockReturnValue({
      type: "customer.created",
      data: { object: {} },
    });

    const res = await POST(makeRequest());

    expect(res.status).toBe(200);
    expect(mockUpdateSet).not.toHaveBeenCalled();
  });
});
