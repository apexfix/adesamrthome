import Image from "next/image";
import Link from "next/link";
import { PackageCheck, ShieldCheck, Wrench } from "lucide-react";

const collections = [
  {
    eyebrow: "SMART LOCKS",
    title: "Smart locks, installed locally",
    description: "Browse installed-price smart locks for Adelaide homes. We check your door before confirming a booking.",
    image: "/img/products/orvibo-s2/orvibo-s2-official-pair.png",
    alt: "ORVIBO S2 smart lock front and rear product image",
    href: "/products?category=smart-lock",
    action: "Browse smart locks",
  },
  {
    eyebrow: "INSTALLATION SERVICE",
    title: "Already have a smart lock?",
    description: "Professional installation for compatible customer-supplied locks, with a free remote door compatibility check.",
    image: "/img/products/lockin-x9/real-install-01.jpg",
    alt: "Smart lock installed on an Adelaide home door",
    href: "/smart-lock-installation-only-adelaide",
    action: "Explore installation",
  },
  {
    eyebrow: "HOME SECURITY",
    title: "Security camera kits",
    description: "Explore Dahua PoE camera and recorder packages for homes and small businesses.",
    image: "/img/products/dahua-2-camera-kit/dahua-2-camera-kit-poster-v1.png",
    alt: "Dahua two-camera PoE security kit",
    href: "/products/security-camera-kits",
    action: "View camera kits",
  },
];

export function ServicePathways() {
  return (
    <section id="services" className="home-collections scroll-mt-24 bg-[#f4f3f0] text-zinc-950">
      <div className="mx-auto max-w-[1500px] px-5 py-10 md:px-8 md:py-14 xl:px-10">
        <div className="grid gap-5 border-b border-zinc-300 pb-8 text-sm font-semibold md:grid-cols-3">
          <p className="flex items-center gap-3"><PackageCheck className="h-5 w-5 text-[#8a683f]" aria-hidden="true" /> Local Adelaide installation</p>
          <p className="flex items-center gap-3"><Wrench className="h-5 w-5 text-[#8a683f]" aria-hidden="true" /> Free remote door compatibility check</p>
          <p className="flex items-center gap-3"><ShieldCheck className="h-5 w-5 text-[#8a683f]" aria-hidden="true" /> Setup support before we leave</p>
        </div>

        <div className="mb-8 mt-12 flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#8a683f]">Find what you need</p>
            <h2 className="mt-2 text-3xl font-bold md:text-5xl">Collections</h2>
          </div>
          <p className="max-w-xl text-base leading-7 text-zinc-600">Smart locks, professional installation and home security, all in one place.</p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {collections.map((collection) => (
            <Link key={collection.title} href={collection.href} className="collection-card group overflow-hidden border border-zinc-200 bg-white transition-shadow hover:shadow-xl focus-visible:shadow-xl">
              <div className="relative aspect-[4/3] bg-[#e8e7e3]">
                <Image src={collection.image} alt={collection.alt} fill sizes="(max-width: 767px) 100vw, 33vw" className="object-contain p-5 transition-transform duration-300 group-hover:scale-[1.04]" />
              </div>
              <div className="p-6">
                <p className="text-xs font-bold tracking-[0.16em] text-[#8a683f]">{collection.eyebrow}</p>
                <h3 className="mt-2 text-xl font-bold md:text-2xl">{collection.title}</h3>
                <p className="mt-3 min-h-20 text-base leading-6 text-zinc-600">{collection.description}</p>
                <span className="mt-5 inline-flex min-h-11 items-center border-b-2 border-[#8a683f] text-sm font-bold">{collection.action}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
