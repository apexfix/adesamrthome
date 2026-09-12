import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, Cctv, LockKeyhole, Wrench } from "lucide-react";

export function HeroCarousel() {
  return (
    <div className="relative h-full overflow-hidden bg-black">
      <Image src="/img/hero1-optimized.avif" alt="Modern home exterior with an entrance and driveway" fill priority fetchPriority="high" quality={65} sizes="100vw" className="object-cover object-center" />
      <div className="absolute inset-0 bg-black/55" />
      <div className="relative z-10 mx-auto flex h-full max-w-[1500px] items-center px-5 pb-10 pt-28 sm:px-8 sm:pb-12 sm:pt-32 xl:px-10">
        <div className="w-full max-w-5xl">
          <p className="mb-4 text-sm font-bold text-[#e5c59f] sm:text-base">ADE SMART HOME · ADELAIDE</p>
          <h1 className="max-w-5xl text-3xl font-bold leading-[1.08] text-white min-[375px]:text-4xl sm:text-6xl lg:text-7xl">
            Smart Locks &amp;<span className="block text-[#e5c59f]">Security Camera Kits</span>
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-100 sm:text-xl sm:leading-8">
            Smarter entry. A clearer view of home. Explore installed smart locks,
            installation-only services and Dahua CCTV camera kits in Adelaide.
          </p>
          <div className="mt-7 grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:gap-4">
            <Link href="#smart-locks" className="flex min-h-12 items-center justify-center gap-2 rounded-md bg-[#d9b98f] px-4 text-sm font-bold text-black transition-colors hover:bg-white sm:min-h-14 sm:px-7 sm:text-base"><LockKeyhole className="h-4 w-4 shrink-0" aria-hidden="true" /><span>Smart locks</span></Link>
            <Link href="#camera-kits" className="liquid-glass flex min-h-12 items-center justify-center gap-2 rounded-md border px-4 text-sm font-bold text-white hover:border-white sm:min-h-14 sm:px-7 sm:text-base"><Cctv className="h-4 w-4 shrink-0" aria-hidden="true" /><span>Camera kits</span></Link>
          </div>
          <Link href="/smart-lock-installation-only-adelaide" className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-white hover:text-[#e5c59f]"><Wrench className="h-4 w-4 shrink-0" aria-hidden="true" /><span>Already have a smart lock? We fit it.</span><ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" /></Link>
          <div className="mt-8 hidden flex-wrap gap-x-7 gap-y-3 border-t border-white/25 pt-6 text-sm text-zinc-100 sm:flex">
            {["Adelaide local support", "Clear product & installation prices", "SMS & email enquiries"].map(item => <span key={item} className="inline-flex items-center gap-2"><Check className="h-4 w-4 text-[#e5c59f]" aria-hidden="true" />{item}</span>)}
          </div>
        </div>
      </div>
    </div>
  );
}
