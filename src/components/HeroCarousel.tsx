import Image from "next/image";
import {
  Check,
  LockKeyhole,
  Wrench,
} from "lucide-react";
import { TrackingCTAs } from "@/components/cta/TrackingCTAs";

const services = [
  {
    icon: LockKeyhole,
    title: "Smart lock supply & installation",
    detail: "Installed-price options from trusted brands",
  },
  {
    icon: Wrench,
    title: "Installation-only service",
    detail: "For compatible smart locks you already own",
  },
];

export function HeroCarousel() {
  return (
    <div className="relative h-full overflow-hidden bg-black">
      <Image
        src="/img/hero1-optimized.avif"
        alt="Smart lock installation completed by ADE Smart Home in Adelaide"
        fill
        priority
        fetchPriority="high"
        quality={65}
        sizes="100vw"
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-black/50" />

      <div className="relative z-10 mx-auto flex h-full w-full max-w-[1500px] items-center px-5 pb-10 pt-28 sm:px-8 sm:pb-12 sm:pt-32 xl:px-10">
        <div className="w-full max-w-6xl">
          <p className="mb-2 text-sm font-semibold uppercase text-[#d9b98f] sm:mb-4 sm:text-base">
            Supply &amp; install or installation only
          </p>

          <h1 className="max-w-5xl text-3xl font-bold leading-[1.08] text-white min-[375px]:text-4xl sm:text-6xl lg:text-7xl">
            Smart Lock Installation
            <span className="block text-[#d9b98f]">Across Adelaide</span>
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-100 sm:mt-6 sm:text-xl sm:leading-8">
            Your new smart lock, supplied and fitted. Already have one? We install
            compatible locks too. Send your door photos for a local quote.
          </p>

          <TrackingCTAs context="hero" />

          <div className="mt-9 hidden max-w-6xl grid-cols-2 gap-8 border-t border-white/25 pt-6 sm:grid">
            {services.map(({ icon: Icon, title, detail }) => (
              <div key={title} className="flex min-w-0 items-start gap-3">
                <Icon
                  className="mt-0.5 h-5 w-5 shrink-0 text-[#d9b98f] sm:h-6 sm:w-6"
                  aria-hidden="true"
                />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white sm:text-base">{title}</p>
                  <p className="mt-1 hidden text-sm leading-6 text-zinc-300 sm:block">{detail}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 hidden flex-wrap gap-x-6 gap-y-2 text-sm text-zinc-200 sm:flex">
            {["Adelaide-wide service", "Installed-price options", "Local after-sales support"].map(
              (item) => (
                <span key={item} className="inline-flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5 text-emerald-400" aria-hidden="true" />
                  {item}
                </span>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
