import type { Metadata } from "next";
import Link from "next/link";
import { TrackOrderForm } from "@/components/checkout/TrackOrderForm";
import { HelpBand } from "@/components/content/HelpBand";

export const metadata: Metadata = {
  title: "Track Your Order",
  description: "Check the status of a Diamentory order with your order number and email or mobile number.",
  alternates: { canonical: "/track-order" },
};

export default function Page() {
  return (
    <>
      <div className="wrap pt-2 pb-[var(--section-y-sm)]">
        <div className="h-11" aria-hidden="true" />
        <div className="grid-12 mt-4 gap-y-12 lg:mt-8">
          <header className="reveal col-span-12 lg:col-span-6">
            <p className="eyebrow text-stone">Client care</p>
            <h1 className="t-h1 mt-4">
              Track your <em>order</em>
            </h1>
            <p className="mt-5 max-w-[40ch] text-graphite lg:mt-6">
              Enter your order number with the email or mobile number used at checkout.
            </p>
            <p className="mt-4 max-w-[40ch] text-sm leading-relaxed text-stone">
              Delivery timelines are explained on our{" "}
              <Link href="/shipping" className="underline underline-offset-4 hover:text-obsidian">
                shipping page
              </Link>
              .
            </p>
          </header>
          <div className="col-span-12 lg:col-span-5 lg:col-start-8">
            <TrackOrderForm />
          </div>
        </div>
      </div>
      <HelpBand />
    </>
  );
}
