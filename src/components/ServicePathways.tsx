import Link from "next/link";
import { ArrowRight, Camera, PackageCheck, Wrench } from "lucide-react";

const pathways = [
  {
    icon: PackageCheck,
    label: "Supply & Install",
    title: "Choose an installed smart lock",
    description:
      "Compare installed-price packages from $650. We check your door before confirming the model and booking.",
    href: "/products?category=SMART+LOCK",
    action: "View smart locks",
  },
  {
    icon: Wrench,
    label: "Installation Only",
    title: "Already bought a smart lock?",
    description:
      "Send the lock model and door photos. We will check compatibility and quote the installation scope first.",
    href: "/contact?service=installation-only",
    action: "Request installation quote",
  },
  {
    icon: Camera,
    label: "CCTV Installation",
    title: "Security cameras for your property",
    description:
      "Tailored CCTV installation for Adelaide homes and small businesses, based on coverage and site requirements.",
    href: "/contact?service=cctv",
    action: "Request CCTV quote",
  },
];

export function ServicePathways() {
  return (
    <section className="border-b border-zinc-800 bg-zinc-950 text-white">
      <div className="container mx-auto px-4 py-16 md:px-6 md:py-20">
        <div className="mb-10 max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#c5a47e]">
            How We Can Help
          </p>
          <h2 className="mt-3 text-3xl font-bold md:text-4xl">
            Start with the service you need
          </h2>
          <p className="mt-4 leading-7 text-zinc-400">
            No online checkout or upfront payment. We confirm compatibility,
            scope and price with you before a booking is made.
          </p>
        </div>

        <div className="grid border-y border-zinc-800 md:grid-cols-3">
          {pathways.map((pathway, index) => {
            const Icon = pathway.icon;

            return (
              <article
                key={pathway.label}
                className={`py-8 md:px-8 ${
                  index > 0
                    ? "border-t border-zinc-800 md:border-l md:border-t-0"
                    : ""
                }`}
              >
                <Icon className="h-7 w-7 text-[#c5a47e]" strokeWidth={1.6} />
                <p className="mt-6 text-xs font-bold uppercase tracking-[0.18em] text-[#c5a47e]">
                  {pathway.label}
                </p>
                <h3 className="mt-3 text-xl font-bold">{pathway.title}</h3>
                <p className="mt-3 min-h-20 text-sm leading-6 text-zinc-400">
                  {pathway.description}
                </p>
                <Link
                  href={pathway.href}
                  className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-white transition-colors hover:text-[#c5a47e]"
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
