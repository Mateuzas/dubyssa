"use client";

import { useState } from "react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function NewsletterForm({ compact = false }: { compact?: boolean }) {
  const [email, setEmail] = useState("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        // TODO: wire up to a real subscriber list (e.g. via Resend) — this
        // is placeholder-only for now.
        toast.success("You're on the list.");
        setEmail("");
      }}
      className={cn(
        "flex w-full min-w-0 items-end gap-2",
        compact ? "max-w-[150px] sm:max-w-[220px]" : "max-w-sm"
      )}
    >
      {compact ? (
        // Just an underline, not a boxed field — matches the pared-back
        // footer treatment. Built from a plain <input> rather than the
        // shadcn Input wrapper so there's no border/rounded-corner/padding
        // box styling to fight with.
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email address"
          aria-label="Email address"
          className="h-7 w-full min-w-0 border-0 border-b border-input bg-transparent px-0 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-foreground"
        />
      ) : (
        <Input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email address"
          aria-label="Email address"
          className="h-11"
        />
      )}
      <Button
        type="submit"
        size={compact ? "sm" : "cta"}
        className="shrink-0 px-4"
      >
        Join
      </Button>
    </form>
  );
}
