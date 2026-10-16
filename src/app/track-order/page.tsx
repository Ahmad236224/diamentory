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
      <div className="gutter mx-auto grid max-w-[1800px] gap-y-12 pt-12 pb-20 sm:pt-16 lg:grid-cols-12 lg:gap-x-8 lg:pt-24 lg:pb-28">
        <header className="lg:col-span-6">
          <p className="eyebrow text-stone">Client care</p>
          <h1 className="display mt-6 text-[clamp(2.9rem,12vw,7rem)]">
            Track your <em>order</em>
          </h1>
          <p className="mt-7 max-w-[40ch] text-[1.0625rem] leading-relaxed text-graphite">
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
        <div className="lg:col-span-5 lg:col-start-8 lg:pt-4">
          <TrackOrderForm />
        </div>
      </div>
      <HelpBand />
    </>
  );
}
