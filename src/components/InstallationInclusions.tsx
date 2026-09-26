import Link from "next/link";
import { ArrowRight, Camera, Fingerprint, MessageSquareText, Smartphone, Sparkles, Wrench } from "lucide-react";

const inclusions = [
  { icon: Camera, title: "Free remote door compatibility check", text: "Send door photos and your lock model before booking. We assess likely fit remotely and confirm it on site." },
  { icon: MessageSquareText, title: "Free smart lock advice", text: "Get help choosing a suitable model and understanding the features that matter to you." },
  { icon: Wrench, title: "Careful fitting with dedicated tools", text: "We use specialist tools and fitting jigs for neat preparation, accurate alignment and a clean finish." },
  { icon: Sparkles, title: "On-site vacuum clean-up", text: "We vacuum up installation dust and debris around the work area before the handover." },
  { icon: Smartphone, title: "App setup, where supported", text: "We help connect the lock to its supported mobile app, subject to your phone, network and the model's requirements." },
  { icon: Fingerprint, title: "Set up, test and learn before we leave", text: "We help you enrol your PIN and fingerprints where supported, test unlocking with you and make sure you can operate the lock before we leave." },
];

export function InstallationInclusions() {
  return (
    <section id="installation-inclusions" aria-labelledby="installation-inclusions-title" className="scroll-mt-28 border-y border-zinc-800 bg-zinc-950 py-10 text-white md:py-14">
      <div className="container mx-auto max-w-[1500px] px-5 md:px-8 xl:px-10">
        <p className="text-sm font-semibold text-[#d9b98f]">Included with every smart lock installation</p>
        <h2 id="installation-inclusions-title" className="mt-3 text-2xl font-bold leading-tight md:text-3xl">Fitted neatly. Set up with you. Ready to use.</h2>
        <p className="mt-4 max-w-3xl text-base leading-7 text-zinc-300">All of the following are included in our A$200 compact-lock and A$350 standard 6068 mortise installation fees, and in our smart lock supply-and-install packages. No separate charge for these inclusions.</p>
        <ul className="mt-7 grid gap-x-10 gap-y-7 md:grid-cols-2 xl:grid-cols-3">
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
          <p className="max-w-3xl text-sm leading-6 text-zinc-400">Installation-only prices exclude the lock. Any non-standard door work or extra parts are discussed and quoted before booking. You enter and keep your own access codes.</p>
          <Link href="/contact" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#d9b98f] hover:text-white">Ask about your door and lock <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
        </div>
      </div>
    </section>
  );
}
