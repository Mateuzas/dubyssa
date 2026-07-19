import Link from "next/link";

import { Logo } from "./logo";
import { NewsletterForm } from "./newsletter-form";

// Flat utility links — category browsing already lives in the header nav,
// so the footer only needs to carry site-utility/help/about routes. Internal
// placeholder routes — pages don't exist yet, add them when the
// corresponding content/phase is built.
const FOOTER_LINKS = [
  { label: "Contact", href: "/help/contact" },
  { label: "Shipping & Returns", href: "/help/shipping" },
  { label: "FAQ", href: "/help/faq" },
  { label: "Our Story", href: "/about" },
] as const;

const SOCIAL_LINKS = [
  { label: "Instagram", href: "https://www.instagram.com/dubyssa/" },
  { label: "Facebook", href: "https://www.facebook.com/DUBYSSA/" },
] as const;

export function Footer() {
  return (
    <footer className="border-t border-border pb-safe">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-3 py-3 pl-3 pr-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:py-4 sm:pl-4 sm:pr-6 lg:pl-6 lg:pr-10 xl:pl-8 xl:pr-14">
        {/* flex-nowrap so the logo and input always stay on one line,
            at the same vertical level — a smaller gap + a narrower input
            on mobile (see NewsletterForm) keeps the pair from overflowing
            onto two lines on narrow phones. */}
        <div className="flex flex-nowrap items-center gap-x-4 sm:gap-x-10">
          <Logo className="h-9 shrink-0 sm:h-12" />
          <NewsletterForm compact />
        </div>

        <nav className="flex flex-wrap items-center gap-x-5 gap-y-2">
          {FOOTER_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="kicker text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
          {SOCIAL_LINKS.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="kicker text-muted-foreground transition-colors hover:text-foreground"
            >
              {social.label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
