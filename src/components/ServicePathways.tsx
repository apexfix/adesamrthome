import Link from "next/link";
import { ArrowRight, PackageCheck, Wrench } from "lucide-react";

const pathways = [
  {
    icon: PackageCheck,
    label: "Supply & Install",
    title: "Smart locks supplied and installed in Adelaide",
    description:
      "Compare installed-price packages from $650. We check your door before confirming the model and booking.",
    href: "/smart-lock-supply-installation-adelaide",
    action: "View smart locks",
  },
  {
    icon: Wrench,
    label: "Installation Only",
    title: "Smart lock installation only in Adelaide",
    description:
      "Send the lock model and door photos. We will check compatibility and quote the installation scope first.",
    href: "/smart-lock-installation-only-adelaide",
    action: "Request installation quote",
  },
];

export function ServicePathways() {
  return (
    <section className="border-b border-zinc-800 bg-zinc-950 text-white">
      <div className="container mx-auto max-w-[1500px] px-5 py-16 md:px-8 md:py-24 xl:px-10">
        <div className="mb-12 max-w-4xl">
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

        <div className="grid border-y border-zinc-800 md:grid-cols-2">
          {pathways.map((pathway, index) => {
            const Icon = pathway.icon;

            return (
              <article
                key={pathway.label}
                className={`py-10 md:px-10 md:py-12 ${
                  index > 0
                    ? "border-t border-zinc-800 md:border-l md:border-t-0"
                    : ""
                }`}
              >
                <Icon className="h-8 w-8 text-[#c5a47e]" strokeWidth={1.6} />
                <p className="mt-7 text-sm font-bold uppercase tracking-[0.15em] text-[#c5a47e]">
                  {pathway.label}
                </p>
                <h3 className="mt-3 text-2xl font-bold md:text-[1.7rem]">{pathway.title}</h3>
                <p className="mt-4 min-h-20 max-w-xl text-base leading-7 text-zinc-300 md:text-lg md:leading-8">
                  {pathway.description}
                </p>
                <Link
                  href={pathway.href}
                  className="mt-7 inline-flex items-center gap-2 text-base font-semibold text-white transition-colors hover:text-[#c5a47e]"
                >
                  {pathway.action}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
