import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
};

// Stub — the real inspirations/principles copy for this page is being
// written separately. Keeping a minimal real route here so the "About Us"
// link from the homepage doesn't 404 in the meantime.
export default function AboutPage() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 px-6 py-20 sm:px-10 sm:py-28">
      <span className="kicker text-muted-foreground">Our Story</span>
      <h1 className="heading-display">About Dubyssa</h1>
      <p className="text-muted-foreground">
        More on our inspirations and principles is coming soon.
      </p>
    </div>
  );
}
