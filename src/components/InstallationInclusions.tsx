import Link from "next/link";
import { ArrowRight, Camera, Fingerprint, Sparkles, Wrench } from "lucide-react";

const inclusions = [
  { icon: Camera, title: "Free door check and lock advice", text: "Send door photos and your lock model before booking. We assess likely fit remotely, help you choose a suitable model and confirm it on site." },
  { icon: Wrench, title: "Careful fitting with dedicated tools", text: "We use specialist tools and fitting jigs for neat preparation, accurate alignment and a clean finish." },
  { icon: Sparkles, title: "On-site vacuum clean-up", text: "We vacuum up installation dust and debris around the work area before the handover." },
  { icon: Fingerprint, title: "Set up, test and learn before we leave", text: "We help you enrol your PIN and fingerprints, connect the supported app where your phone and network allow, and test unlocking with you before we leave." },
];

export function InstallationInclusions({ quoteHref = "/contact#quote" }: { quoteHref?: string }) {
  return (
    <section id="installation-inclusions" aria-labelledby="installation-inclusions-title" className="scroll-mt-28 border-y border-zinc-800 bg-zinc-950 py-10 text-white md:py-14">
      <div className="container mx-auto max-w-[1500px] px-5 md:px-8 xl:px-10">
        <h2 id="installation-inclusions-title" className="text-2xl font-bold leading-tight md:text-3xl">Included with every smart lock installation</h2>
        <p className="mt-4 max-w-[65ch] text-base leading-7 text-zinc-300">Fitted neatly, set up with you and ready to use. These come with every installation-only job and every supply-and-install package, at no separate charge.</p>
        <ul className="mt-7 grid gap-x-10 gap-y-7 md:grid-cols-2 xl:grid-cols-4">
          {inclusions.map(({ icon: Icon, title, text }) => (
            <li key={title} className="flex items-start gap-4">
              <Icon className="mt-1 h-6 w-6 shrink-0 text-[#d9b98f]" aria-hidden="true" />
              <div className="min-w-0">
                <h3 className="text-base font-semibold leading-6">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-300">{text}</p>
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-7 flex flex-col items-start gap-3 border-t border-zinc-800 pt-5">
          <p className="max-w-[65ch] text-sm leading-6 text-zinc-400">Installation-only prices exclude the lock. Any non-standard door work or extra parts are discussed and quoted before booking. You enter and keep your own access codes.</p>
          <Link href={quoteHref} className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#d9b98f] hover:text-white">Get a quote <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
        </div>
      </div>
    </section>
  );
}
