import Link from "next/link";
import { ArrowRight, Building2, HardHat, Home, Users } from "lucide-react";

const audiences = [
  {
    icon: Building2,
    title: "Apartments",
    detail: "Door hardware, building requirements and suitability checked before installation.",
    href: "/apartment-smart-lock-installation-adelaide",
  },
  {
    icon: Users,
    title: "Property Managers",
    detail: "One-property pilots, repeatable door-photo checks and multi-property planning.",
    href: "/property-manager-smart-lock-installation-adelaide",
  },
  {
    icon: HardHat,
    title: "New Homes",
    detail: "Plan smart-lock compatibility before the door and hardware choices are finalised.",
    href: "/new-home-smart-lock-installation-adelaide",
  },
  {
    icon: Home,
    title: "Airbnb & Rentals",
    detail: "Guest and cleaner access for suitable short-stay and rental-property doors.",
    href: "/airbnb-smart-lock-installation-adelaide",
  },
];

export function AudiencePathways() {
  return (
    <section className="border-y border-zinc-900 bg-black py-20 text-white md:py-24">
      <div className="mx-auto max-w-[1500px] px-5 md:px-8 xl:px-10">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#c5a47e]">
          Choose your property type
        </p>
        <h2 className="mt-3 max-w-3xl text-3xl font-bold md:text-5xl">
          Smart-lock planning for the door you actually have
        </h2>
        <p className="mt-5 max-w-2xl text-sm leading-7 text-zinc-400 md:text-base">
          Different properties have different access, approval and door-hardware requirements.
          Start with the route that matches your project.
        </p>

        <div className="mt-12 grid border-y border-zinc-800 md:grid-cols-2 lg:grid-cols-4">
          {audiences.map(({ icon: Icon, title, detail, href }, index) => (
            <Link
              key={href}
              href={href}
              className={`group py-8 md:px-7 ${
                index > 0 ? "border-t border-zinc-800 md:border-l md:border-t-0" : ""
              }`}
            >
              <Icon className="h-7 w-7 text-[#c5a47e]" strokeWidth={1.6} aria-hidden="true" />
              <h3 className="mt-5 text-lg font-bold">{title}</h3>
              <p className="mt-3 min-h-16 text-sm leading-6 text-zinc-400">{detail}</p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#c5a47e]">
                View service
                <ArrowRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
