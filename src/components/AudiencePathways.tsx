import Link from "next/link";
import { ArrowRight, HardHat, Home, KeyRound, Users } from "lucide-react";

const audiences = [
  {
    icon: Home,
    title: "Homeowners",
    detail: "Stop hiding spare keys. Fingerprint, PIN and app entry for your front door, fitted and set up in one visit.",
    href: "/smart-lock-supply-installation-adelaide",
  },
  {
    icon: KeyRound,
    title: "Airbnb hosts",
    detail: "Send guests and cleaners their own code, change it between stays and never meet anyone for a key handover.",
    href: "/airbnb-smart-lock-installation-adelaide",
  },
  {
    icon: Users,
    title: "Property managers",
    detail: "Start with one property, then roll the same lock and door-photo check out across your portfolio.",
    href: "/property-manager-smart-lock-installation-adelaide",
  },
  {
    icon: HardHat,
    title: "New home builders",
    detail: "Plan the smart lock before doors and hardware are ordered, so it fits cleanly at handover.",
    href: "/new-home-smart-lock-installation-adelaide",
  },
];

export function AudiencePathways() {
  return (
    <section aria-labelledby="who-we-help" className="border-y border-zinc-900 bg-black py-12 text-white md:py-16">
      <div className="mx-auto max-w-[1500px] px-5 md:px-8 xl:px-10">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-14">
          <div>
            <h2 id="who-we-help" className="max-w-xl text-2xl font-bold leading-tight md:text-4xl">
              Who we help
            </h2>
            <p className="mt-4 max-w-[52ch] text-base leading-7 text-zinc-400">
              Most of our jobs are family homes, but rentals, short stays and new builds each need a
              slightly different setup. Pick yours for the details.
            </p>
          </div>

          <ul className="grid border-t border-zinc-800 sm:grid-cols-2">
            {audiences.map(({ icon: Icon, title, detail, href }) => (
              <li key={href} className="border-b border-zinc-800 sm:odd:border-r sm:odd:pr-6 sm:even:pl-6">
                <Link href={href} className="group flex items-start gap-4 py-5">
                  <Icon className="mt-0.5 h-6 w-6 shrink-0 text-[#c5a47e]" strokeWidth={1.6} aria-hidden="true" />
                  <span className="min-w-0">
                    <span className="flex items-center gap-2 text-base font-bold transition-colors group-hover:text-[#d9b98f]">
                      {title}
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                    </span>{" "}
                    <span className="mt-1 block text-sm leading-6 text-zinc-400">{detail}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
