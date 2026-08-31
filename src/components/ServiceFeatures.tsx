import { CircleCheck, Headphones, Wrench } from "lucide-react";

export function ServiceFeatures() {
  return (
    <section className="border-y border-zinc-900 bg-black py-20 text-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          <div className="flex flex-col items-center border-zinc-800 p-6 text-center md:border-r md:px-10">
            <div className="mb-6 flex h-14 w-14 items-center justify-center border border-zinc-800 bg-zinc-950">
              <Wrench className="h-7 w-7 text-[#c5a47e]" strokeWidth={1.5} />
            </div>
            <h3 className="mb-4 text-lg font-bold uppercase tracking-wider text-white">
              Precision Installation
            </h3>
            <p className="text-zinc-400 text-base leading-relaxed max-w-sm">
              Over 400 local installations across Adelaide. We focus on a neat, clean, flush finish while protecting your door&apos;s structural integrity.
            </p>
          </div>

          <div className="flex flex-col items-center border-zinc-800 p-6 text-center md:border-r md:px-10">
            <div className="mb-6 flex h-14 w-14 items-center justify-center border border-zinc-800 bg-zinc-950">
              <CircleCheck className="h-7 w-7 text-[#c5a47e]" strokeWidth={1.5} />
            </div>
            <h3 className="mb-4 text-lg font-bold uppercase tracking-wider text-white">
              Compatibility First
            </h3>
            <p className="text-zinc-400 text-base leading-relaxed max-w-sm">
              We check the door, frame, existing lock and any screen-door clearance before confirming the right model or installation scope.
            </p>
          </div>

          <div className="flex flex-col items-center p-6 text-center md:px-10">
            <div className="mb-6 flex h-14 w-14 items-center justify-center border border-zinc-800 bg-zinc-950">
              <Headphones className="h-7 w-7 text-[#c5a47e]" strokeWidth={1.5} />
            </div>
            <h3 className="mb-4 text-lg font-bold uppercase tracking-wider text-white">
              Local After-Sales Support
            </h3>
            <p className="text-zinc-400 text-base leading-relaxed max-w-sm">
              Get local help with setup and installation-related questions. Product warranty terms are confirmed for the selected model and package.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
