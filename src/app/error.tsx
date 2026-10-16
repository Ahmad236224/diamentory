"use client";

import Link from "next/link";
import { useEffect } from "react";
import { IconArrow } from "@/components/ui/icons";

export default function Error({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="wrap pt-2 pb-[var(--section-y)]">
      <div className="h-11" aria-hidden="true" />
      <div className="mt-4 max-w-3xl lg:mt-8">
        <p className="eyebrow text-stone">Something went wrong</p>
        <h1 className="t-h1 mt-4">
          A small <em>interruption.</em>
        </h1>
        <p className="mt-7 max-w-[42ch] text-graphite">
          This page didn&rsquo;t load as it should. Your bag is safe — please try again.
        </p>
        {error.digest && <p className="mt-3 text-xs text-stone">Reference: {error.digest}</p>}
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => retry()}
            className="btn btn-dark"
          >
            Try again
          </button>
          <Link href="/" className="btn btn-outline">
            Home <IconArrow size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
