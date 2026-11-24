import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { INSTALL_ONLY_PRICES, PACKAGE_FROM_PRICE } from "@/lib/seoData";

const pathways = [
  {
    from: `$${PACKAGE_FROM_PRICE}`,
    title: "Supply + install packages",
    description:
      "Lock, fitting and on-site setup in one price. Free remote door check first, no deposit, and we teach you the app, fingerprints and PINs before we leave.",
    href: "/smart-lock-supply-installation-adelaide",
    action: "See supply + install packages",
  },
  {
    from: `$${INSTALL_ONLY_PRICES.compact}`,
    title: "Installation only, for a lock you already own",
    description:
      `Bought a lock online or overseas? Send us the model and door photos and we confirm it suits your door before booking. $${INSTALL_ONLY_PRICES.compact} for a compact lock, $${INSTALL_ONLY_PRICES.mortise} for a full-size mortise lock (standard 6068). Lock not included.`,
    href: "/smart-lock-installation-only-adelaide",
    action: "View installation-only service",
  },
];

export function ServicePathways() {
  return (
    <section id="services" className="scroll-mt-20 border-b border-zinc-800 bg-zinc-950 text-white">
      <div className="container mx-auto max-w-[1500px] px-5 py-14 md:px-8 md:py-20 xl:px-10">
        <h2 className="text-2xl font-bold leading-tight md:text-4xl">
          Start with the service you need
        </h2>

        {/* A price list, not three cards: the number is what people scan for. */}
        <ul className="mt-8 border-t border-zinc-800">
          {pathways.map((pathway) => (
            <li key={pathway.href} className="border-b border-zinc-800">
              <Link
                href={pathway.href}
                className="group grid gap-x-10 gap-y-3 py-7 md:grid-cols-[11rem_minmax(0,1fr)_auto] md:items-center md:py-9"
              >
                <p className="leading-none">
                  <span className="block text-sm font-semibold text-zinc-400">from</span>{" "}
                  <span className="service-price mt-1 block text-5xl font-bold tabular-nums text-[#d9b98f] md:text-6xl">{pathway.from}</span>
                </p>
                <div>
                  <h3 className="text-xl font-bold transition-colors group-hover:text-[#d9b98f] md:text-2xl">{pathway.title}</h3>
                  <p className="mt-2 max-w-[68ch] text-base leading-7 text-zinc-300">{pathway.description}</p>
                </div>
                <span className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-white">
                  {pathway.action}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <Link
          href="/service-areas"
          className="mt-8 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-zinc-300 transition-colors hover:text-[#c5a47e]"
        >
          <MapPin className="h-4 w-4 text-[#c5a47e]" aria-hidden="true" />
          View Adelaide service areas
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
