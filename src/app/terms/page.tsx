import Link from "next/link";
import { MarketingNav } from "@/components/marketing/marketing-nav";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { restaurant } from "@/lib/demo-data";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[var(--garden-paper)]">
      <MarketingNav />
      <article className="mx-auto max-w-3xl px-5 py-14 md:px-10 md:py-20">
        <p className="text-xs uppercase tracking-[0.28em] text-[var(--garden-leaf)]">
          Legal
        </p>
        <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl text-[var(--garden-deep)] md:text-5xl">
          Terms & conditions
        </h1>
        <div className="mt-8 space-y-4 leading-relaxed text-[var(--garden-ink)]/75">
          <p>
            {restaurant.name} provides this website as a demonstration of a cafe
            marketing site plus ops tools. Menu prices, hours, and imagery are
            sample data in Nepalese Rupees (NPR) and may change in Admin.
          </p>
          <p>
            Online reservation and guest QR order flows are demos. They do not
            create a binding booking or payment obligation. Real table holds
            require confirmation by phone ({restaurant.phone}).
          </p>
          <p>
            Staff tools (/dashboard, /kitchen, /admin, /demo) are for authorised
            demo use only. Do not enter real card numbers or personal data you
            are not comfortable storing locally.
          </p>
          <p>
            Imagery is sourced from Unsplash for placeholder use and is not
            owned by {restaurant.name}. Replace with your own photography before
            production.
          </p>
        </div>
        <Link
          href="/"
          className="mt-10 inline-flex text-sm font-semibold text-[var(--garden-leaf)] underline-offset-4 hover:underline"
        >
          ← Back home
        </Link>
      </article>
      <MarketingFooter />
    </main>
  );
}
