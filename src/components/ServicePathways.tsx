import Link from "next/link";
import { ArrowRight, Cctv, MapPin, PackageCheck, Wrench } from "lucide-react";

const pathways = [
  {
    icon: PackageCheck,
    label: "Supply & Install",
    title: "Smart locks supplied and installed in Adelaide",
    description:
      "Compare installed-price packages from $699. We check your door before confirming the model and booking.",
    href: "/smart-lock-supply-installation-adelaide",
    action: "View smart locks",
  },
  {
    icon: Wrench,
    label: "Installation Only",
    title: "Smart lock installation only in Adelaide",
    description:
      "Customer-supplied compact lock installation is $200; full-size standard 6068 mortise installation is $350 after compatibility confirmation.",
    href: "/smart-lock-installation-only-adelaide",
    action: "Request installation quote",
  },
  {
    icon: Cctv,
    label: "Security Cameras",
    title: "Dahua camera kits for homes and small businesses",
    description:
      "Start with a practical 5MP PoE camera and recorder package from $443, with local advice and installation quotes available.",
    href: "/products/security-camera-kits",
    action: "View camera kits",
  },
];

export function ServicePathways() {
  return (
    <section id="services" className="scroll-mt-20 border-b border-zinc-800 bg-zinc-950 text-white">
      <div className="container mx-auto max-w-[1500px] px-5 py-8 md:px-8 md:py-10 xl:px-10">
        <div className="sr-only">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#c5a47e]">
            How We Can Help
          </p>
          <h2 className="mt-3 text-3xl font-bold leading-tight md:text-5xl">
            Start with the service you need
          </h2>
          <p className="mt-5 max-w-3xl text-base leading-7 text-zinc-300 md:text-lg md:leading-8">
            No online checkout or upfront payment. We confirm compatibility,
            scope and price with you before a booking is made.
          </p>
        </div>

        <div className="grid border-y border-zinc-800 lg:grid-cols-3">
          {pathways.map((pathway, index) => {
            const Icon = pathway.icon;

            return (
              <article
                key={pathway.label}
                className={`py-6 lg:px-7 ${
                  index > 0
                    ? "border-t border-zinc-800 lg:border-l lg:border-t-0"
                    : ""
                }`}
              >
                <Icon className="h-6 w-6 text-[#c5a47e]" strokeWidth={1.6} />
                <p className="mt-4 text-sm font-bold text-[#c5a47e]">
                  {pathway.label}
                </p>
                <h3 className="mt-2 text-xl font-bold">{pathway.title}</h3>
                <p className="mt-3 max-w-xl text-base leading-7 text-zinc-300 lg:min-h-28">
                  {pathway.description}
                </p>
                <Link
                  href={pathway.href}
                  className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-white transition-colors hover:text-[#c5a47e]"
                >
                  {pathway.action}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </article>
            );
          })}
        </div>

        <Link
          href="/service-areas"
          className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-zinc-300 transition-colors hover:text-[#c5a47e]"
        >
          <MapPin className="h-4 w-4 text-[#c5a47e]" aria-hidden="true" />
          View Adelaide service areas
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
