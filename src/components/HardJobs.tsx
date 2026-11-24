import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

// Real jobs from content/posts. Each line says what was wrong with the door, not what the lock can do.
const jobs = [
  {
    href: "/blog/dessmann-imported-chinese-smart-lock-adelaide",
    lock: "Dessmann face-recognition lock, brought from overseas",
    problem: "Its mortise body was bigger than the pocket in the door, so we re-cut the timber until it sat flush and lined up.",
  },
  {
    href: "/blog/philips-easykey-bunnings-special-cnc-solution",
    lock: "Philips EasyKey, bought on special at Bunnings",
    problem: "The door frame was too narrow for the strike plate in the box. We machined a plate to suit the frame.",
  },
  {
    href: "/blog/ezviz-dl05-retrofit-adelaide",
    lock: "EZVIZ DL05, replacing a builder’s keypad lock",
    problem: "The lock that came with the house kept failing. We swapped it out and set up fingerprints and the app.",
  },
];

export function HardJobs() {
  return (
    <section aria-labelledby="hard-jobs-title" className="border-b border-zinc-900 bg-black text-white">
      <div className="mx-auto grid max-w-[1500px] lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <figure className="relative min-h-[320px] overflow-hidden lg:min-h-[640px]">
          <Image
            src="https://res.cloudinary.com/dheogdojt/image/upload/c_pad,h_800,w_1200,b_gen_fill/v1774183064/758dc062c7c3c32b461feb81d2e657a5_sgld5w.jpg"
            alt="Imported Dessmann smart lock fitted to a timber front door in Adelaide after the door edge was re-cut"
            fill
            sizes="(max-width: 1023px) 100vw, 48vw"
            className="object-cover"
          />
          <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent px-5 pb-5 pt-16 text-sm leading-6 text-zinc-200 md:px-8">
            Imported Dessmann on a timber door. The door edge was re-cut to take the larger lock body.
          </figcaption>
        </figure>

        <div className="px-5 py-14 md:px-8 lg:py-20 xl:px-14">
          <h2 id="hard-jobs-title" className="max-w-[16ch] text-4xl font-bold leading-[1.02] md:text-6xl">
            The locks other installers turn down
          </h2>
          <p className="mt-6 max-w-[56ch] text-base leading-7 text-zinc-300 md:text-lg md:leading-8">
            A lock from overseas or an online store rarely matches an Adelaide door out of the box.
            Send photos first: we tell you what has to change on the door and what it costs before anything is booked.
          </p>

          <ul className="mt-10 border-t border-zinc-800">
            {jobs.map((job) => (
              <li key={job.href} className="border-b border-zinc-800">
                <Link href={job.href} className="group grid gap-x-6 gap-y-1 py-5 sm:grid-cols-[1fr_auto] sm:items-center">
                  <span>
                    <span className="block text-lg font-bold leading-7 transition-colors group-hover:text-[#d9b98f]">{job.lock}</span>{" "}
                    <span className="mt-1 block max-w-[60ch] text-base leading-7 text-zinc-400">{job.problem}</span>
                  </span>
                  <ArrowRight className="hidden h-5 w-5 text-[#d9b98f] transition-transform group-hover:translate-x-1 sm:block" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>

          <Link href="#quote" className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-md bg-[#d9b98f] px-6 font-bold text-black transition-colors hover:bg-[#f0d7b9]">
            Send photos of your door
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
