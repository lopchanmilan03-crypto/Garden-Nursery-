import Image from "next/image";
import Link from "next/link";
import { PhoneNav, PhoneShell } from "@/components/phone-nav";
import { marketingAboutImage, restaurant } from "@/lib/demo-data";

export default function AboutPage() {
  return (
    <PhoneShell footer={<PhoneNav />}>
      <div className="relative h-40 overflow-hidden text-white">
        <Image
          src={marketingAboutImage}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[var(--garden-deep)]/55" />
        <div className="relative z-10 flex h-full flex-col justify-end px-4 pb-4">
          <h1 className="font-[family-name:var(--font-display)] text-2xl">
            {restaurant.name}
          </h1>
          <p className="mt-1 text-sm text-white/80">{restaurant.tagline}</p>
        </div>
      </div>
      <div className="space-y-4 px-4 pb-24 pt-5">
        <p className="text-[15px] leading-relaxed text-[var(--garden-ink)]/80">
          {restaurant.storyLead}
        </p>
        <p className="text-sm text-[var(--garden-deep)]">{restaurant.address}</p>
        <p className="text-sm text-[var(--garden-ink)]/65">
          {restaurant.hoursWeekday}
        </p>
        <Link
          href="/order"
          className="flex min-h-14 w-full items-center justify-center rounded-2xl bg-[var(--garden-deep)] text-base font-semibold text-white"
        >
          Order
        </Link>
      </div>
    </PhoneShell>
  );
}
