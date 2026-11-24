import Link from "next/link";
import { ArrowRight } from "lucide-react";

// In the order they happen, so the list reads as the visit itself.
const inclusions = [
  { when: "Before you book", title: "Free door check and lock advice", text: "Send door photos and your lock model before booking. We assess likely fit remotely, help you choose a suitable model and confirm it on site." },
  { when: "On the day", title: "Careful fitting with dedicated tools", text: "We use specialist tools and fitting jigs for neat preparation, accurate alignment and a clean finish." },
  { when: "Before we leave", title: "Set up, test and learn together", text: "We help you enrol your PIN and fingerprints, connect the supported app where your phone and network allow, and test unlocking with you before we leave." },
  { when: "Last thing", title: "On-site vacuum clean-up", text: "We vacuum up installation dust and debris around the work area before the handover." },
];

export function InstallationInclusions({ quoteHref = "/contact#quote" }: { quoteHref?: string }) {
  return (
    <section id="installation-inclusions" aria-labelledby="installation-inclusions-title" className="scroll-mt-28 border-y border-zinc-800 bg-zinc-950 py-14 text-white md:py-20">
      <div className="container mx-auto grid max-w-[1500px] gap-x-16 gap-y-10 px-5 md:px-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] xl:px-10">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <h2 id="installation-inclusions-title" className="max-w-[14ch] text-3xl font-bold leading-[1.05] md:text-5xl">Included with every smart lock installation</h2>
          <p className="mt-5 max-w-[46ch] text-base leading-7 text-zinc-300">Fitted neatly, set up with you and ready to use. These come with every installation-only job and every supply-and-install package, at no separate charge.</p>
          <Link href={quoteHref} className="mt-6 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#d9b98f] hover:text-white">Get a quote <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
        </div>

        <div>
          <ol className="border-l border-zinc-700">
            {inclusions.map(({ when, title, text }) => (
              <li key={title} className="relative pb-9 pl-8 last:pb-0">
                <span className="absolute -left-[5px] top-2 h-[9px] w-[9px] rounded-full bg-[#d9b98f]" aria-hidden="true" />
                <p className="text-sm font-semibold text-[#d9b98f]">{when}</p>
                <h3 className="mt-1 text-xl font-bold leading-7">{title}</h3>
                <p className="mt-2 max-w-[60ch] text-base leading-7 text-zinc-300">{text}</p>
              </li>
            ))}
          </ol>
          <p className="mt-9 max-w-[65ch] border-t border-zinc-800 pt-5 text-sm leading-6 text-zinc-400">Installation-only prices exclude the lock. Any non-standard door work or extra parts are discussed and quoted before booking. You enter and keep your own access codes.</p>
        </div>
      </div>
    </section>
  );
}
