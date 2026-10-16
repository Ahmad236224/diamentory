"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { createContext, useContext, useTransition } from "react";
import clsx from "clsx";

type Nav = { pending: boolean; go: (href: string) => void };
const NavCtx = createContext<Nav | null>(null);

export function useListingNav(): Nav {
  const router = useRouter();
  const ctx = useContext(NavCtx);
  return ctx ?? { pending: false, go: (href) => router.push(href, { scroll: false }) };
}

/** Wraps toolbar + grid so filter navigation shows a calm pending state instead of a jump. */
export function ListingFrame({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const go = (href: string) => start(() => router.push(href, { scroll: false }));
  return (
    <NavCtx.Provider value={{ pending, go }}>
      <div data-pending={pending || undefined} className="group/listing">
        {children}
      </div>
    </NavCtx.Provider>
  );
}

/** Area that dims while a filter navigation is in flight. */
export function PendingArea({ children, className }: { children: React.ReactNode; className?: string }) {
  const { pending } = useListingNav();
  return (
    <div aria-busy={pending || undefined} className={clsx("transition-opacity duration-300", pending && "opacity-45", className)}>
      {children}
    </div>
  );
}

/** A real, crawlable link that navigates inside the listing transition. */
export function FilterLink({
  href,
  children,
  className,
  ...rest
}: React.ComponentProps<typeof Link> & { href: string }) {
  const { go } = useListingNav();
  return (
    <Link
      href={href}
      scroll={false}
      prefetch={false}
      className={className}
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
        e.preventDefault();
        go(href);
      }}
      {...rest}
    >
      {children}
    </Link>
  );
}
