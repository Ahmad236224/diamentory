"use client";

import Link from "next/link";
import { useEffect } from "react";
import { IconArrow } from "@/components/ui/icons";

export default function Error({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="gutter mx-auto max-w-[1800px] pt-14 pb-24 lg:pt-24 lg:pb-32">
      <div className="max-w-3xl">
        <p className="eyebrow text-stone">Something went wrong</p>
        <h1 className="display mt-6 text-[clamp(2.9rem,12vw,7rem)]">
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
            className="eyebrow inline-flex min-h-12 items-center justify-center gap-3 bg-obsidian px-7 text-ivory"
          >
            Try again
          </button>
          <Link href="/" className="eyebrow inline-flex min-h-12 items-center justify-center gap-3 border border-obsidian px-7">
            Home <IconArrow size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
