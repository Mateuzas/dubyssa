import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipping & Returns",
};

// Stub — real shipping/returns policy copy is being written separately.
// Keeping a minimal real route here so the footer "Shipping & Returns" link
// doesn't 404 in the meantime.
export default function ShippingPage() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 px-6 py-20 sm:px-10 sm:py-28">
      <span className="kicker text-muted-foreground">Help</span>
      <h1 className="heading-display">Shipping &amp; Returns</h1>
      <p className="text-muted-foreground">
        Our shipping and returns policy is coming soon.
      </p>
    </div>
  );
}
