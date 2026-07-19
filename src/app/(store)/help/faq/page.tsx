import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ",
};

// Stub — real FAQ content is being written separately. Keeping a minimal
// real route here so the footer "FAQ" link doesn't 404 in the meantime.
export default function FaqPage() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 px-6 py-20 sm:px-10 sm:py-28">
      <span className="kicker text-muted-foreground">Help</span>
      <h1 className="heading-display">FAQ</h1>
      <p className="text-muted-foreground">
        Frequently asked questions are coming soon.
      </p>
    </div>
  );
}
