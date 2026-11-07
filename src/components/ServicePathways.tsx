import Link from "next/link";
import { RevealGroup } from "@/components/RevealGroup";
import { ArrowRight, Cctv, MapPin, PackageCheck, Wrench } from "lucide-react";
import { INSTALL_ONLY_PRICES, PACKAGE_FROM_PRICE } from "@/lib/seoData";

const pathways = [
  {
    icon: PackageCheck,
    label: "Supply + Install",
    title: `Supply + install packages from ${PACKAGE_FROM_PRICE}`,
    description:
      "Lock, fitting and on-site setup in one price. Free remote door check first, no deposit, and we teach you the app, fingerprints and PINs before we leave.",
    href: "/smart-lock-supply-installation-adelaide",
    action: "See supply + install packages",
  },
  {
    icon: Wrench,
    label: "Installation Only",
    title: "Installation only, for a lock you already own",
    description:
      "Bought a lock online or overseas? Send us the model and door photos and we confirm it suits your door before booking.",
    href: "/smart-lock-installation-only-adelaide",
    action: "View installation-only service",
  },
  {
    icon: Cctv,
    label: "Security Cameras",
    title: "Dahua camera kits for homes and small businesses",
    description:
      "Two-camera kits with a recorder from $443, connected by a single cable per camera (PoE). Ask us about contents and availability.",
    href: "/products/security-camera-kits",
    action: "View camera kits",
  },
];

export function ServicePathways() {
  return (
    <section id="services" className="scroll-mt-20 border-b border-zinc-800 bg-zinc-950 text-white">
      <div className="container mx-auto max-w-[1500px] px-5 py-10 md:px-8 md:py-14 xl:px-10">
        <div className="mb-8 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
          <h2 className="text-2xl font-bold leading-tight md:text-4xl">
            Start with the service you need
          </h2>
          <p className="max-w-[56ch] text-base leading-7 text-zinc-300">
            Supplied or customer-supplied, every lock gets the same free door check,
            careful fitting and setup with you before we leave.
          </p>
        </div>

        <RevealGroup className="grid border-y border-zinc-800 lg:grid-cols-3">
          {pathways.map((pathway, index) => {
            const Icon = pathway.icon;

            return (
              <article
                key={pathway.label}
                className={`py-6 lg:px-7 ${index === 0 ? "lg:bg-white/[0.03]" : ""} ${
                  index > 0
                    ? "border-t border-zinc-800 lg:border-l lg:border-t-0"
                    : ""
                }`}
              >
                <Icon className="h-6 w-6 text-[#c5a47e]" strokeWidth={1.6} aria-hidden="true" />
                <h3 className="mt-4 text-xl font-bold">{pathway.title}</h3>
                <p className="mt-3 max-w-xl text-base leading-7 text-zinc-300 lg:min-h-28">
                  {pathway.description}
                </p>
                <Link
                  href={pathway.href}
                  className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-white transition-colors hover:text-[#c5a47e]"
                >
                  {pathway.action}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </article>
            );
          })}
        </RevealGroup>

        <p className="mt-6 text-sm leading-6 text-zinc-400">
          Installation-only pricing: ${INSTALL_ONLY_PRICES.compact} for a compact lock, ${INSTALL_ONLY_PRICES.mortise} for a full-size mortise lock (standard 6068). Lock not included.{" "}
          <Link href="/smart-lock-installation-only-adelaide" className="font-semibold text-zinc-200 underline underline-offset-4 hover:text-[#c5a47e]">Installation-only details</Link>
        </p>

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
