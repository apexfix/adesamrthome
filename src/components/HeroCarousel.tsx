import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  LockKeyhole,
  MessageSquareText,
  Wrench,
} from "lucide-react";

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
    <div className="absolute inset-0 overflow-hidden bg-black">
      <Image
        src="/img/hero1.avif"
        alt="Smart lock installation completed by ADE Smart Home in Adelaide"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-black/60" />

      <div className="relative z-10 mx-auto flex h-full w-full max-w-[1500px] items-start px-5 pb-6 pt-24 sm:items-center sm:px-8 sm:py-10 lg:px-12 xl:px-16">
        <div className="w-full max-w-6xl">
          <p className="mb-2 text-xs font-semibold uppercase text-[#d9b98f] sm:mb-4 sm:text-base">
            Adelaide smart lock installation
          </p>

          <h1 className="max-w-5xl text-4xl font-bold leading-[1.08] text-white sm:text-6xl lg:text-7xl">
            Smart Locks,
            <span className="block text-[#d9b98f]">Installed Properly</span>
          </h1>

          <p className="mt-3 max-w-4xl text-base leading-7 text-zinc-100 sm:mt-6 sm:text-xl sm:leading-8 lg:text-[1.35rem]">
            Choose a supplied-and-installed smart lock, or book professional
            installation for a compatible lock you already own. We check your
            door and confirm the scope before booking.
          </p>

          <div className="mt-5 grid grid-cols-2 gap-3 sm:mt-8 sm:flex sm:flex-row sm:flex-wrap sm:gap-4">
            <Link
              href="/blog/smart-lock-door-compatibility-check"
              className="col-span-2 inline-flex min-h-12 items-center justify-center gap-2 rounded-sm bg-[#d9b98f] px-6 text-sm font-bold text-black transition-colors hover:bg-white sm:col-span-1 sm:min-h-14 sm:px-8 sm:text-base"
            >
              Check Your Door
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              href="/contact?service=not-sure"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-sm border border-white/50 bg-black/30 px-6 text-sm font-bold text-white transition-colors hover:border-white hover:bg-white hover:text-black sm:min-h-14 sm:px-8 sm:text-base"
            >
              Get a Quote
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <a
              href="sms:+61431060390?body=Hi%20ADE%20Smart%20Home%2C%20I%20would%20like%20a%20smart%20lock%20quote."
              className="inline-flex min-h-12 items-center justify-center gap-2 px-3 text-sm font-semibold text-white transition-colors hover:text-[#d9b98f] sm:min-h-14 sm:px-5 sm:text-base"
            >
              <MessageSquareText className="h-4 w-4" aria-hidden="true" />
              Text us
            </a>
          </div>

          <div className="mt-4 grid max-w-6xl gap-2 border-t border-white/25 pt-3 sm:mt-9 sm:grid-cols-2 sm:gap-8 sm:pt-6">
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
