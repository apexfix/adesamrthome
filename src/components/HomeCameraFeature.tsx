import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Cctv, Cable, HardDrive } from "lucide-react";
import type { Product } from "@/types";

export function HomeCameraFeature({ product }: { product: Product }) {
  const poster = product.images?.[0];
  const prices = product.prices;
  if (!poster || !prices || !Number.isFinite(Number(prices.price))) return null;
  const price = Number(prices.price) / 10 ** (prices.currency_minor_unit ?? 2);
  return (
    <section id="camera-kits" className="scroll-mt-28 border-y border-zinc-800 bg-[#f2f4f5] py-16 text-zinc-950 md:py-24">
      <div className="mx-auto max-w-[1500px] px-5 md:px-8 xl:px-10">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-5">
          <div><p className="text-sm font-semibold text-[#755536]">CCTV &amp; PoE camera packages</p><h2 className="mt-3 text-3xl font-bold md:text-5xl">Security camera kits in Adelaide</h2></div>
          <Link href="/products/security-camera-kits" className="inline-flex min-h-11 items-center gap-2 text-sm font-bold">Explore camera kits <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
        </div>
        <div className="grid items-center gap-8 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
          <Link href={`/products/${product.slug}`} className="relative block aspect-square w-full overflow-hidden rounded-lg bg-white" aria-label={`View ${product.name}`}>
            <Image src={poster.src} alt="Dahua CCTV kit: two white 5MP turret cameras and a four-channel PoE network recorder" fill sizes="(max-width: 1023px) 100vw, 700px" className="object-contain" />
          </Link>
          <div>
            <p className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-800"><span className="h-2 w-2 rounded-full bg-emerald-700" aria-hidden="true" />Available from ADE Smart Home</p>
            <h3 className="mt-4 text-3xl font-bold leading-tight md:text-4xl">Dahua 5MP<br />Two-camera PoE kit</h3>
            <p className="mt-5 max-w-xl text-base leading-7 text-zinc-600 md:text-lg">A practical wired camera package for your entry, driveway or small business. Two cameras and one recorder, with room to add compatible cameras later.</p>
            <dl className="mt-7 divide-y divide-zinc-300 border-y border-zinc-300">
              {[
                { icon: Cctv, label: "2 x 5MP cameras", detail: "DH-IPC-HDW2541EMP-AS-ANZ" },
                { icon: HardDrive, label: "4-channel recorder", detail: "DHI-NVR4104HS-P-4KS2/L" },
                { icon: Cable, label: "Wired PoE connection", detail: "Power and video through network cabling" },
              ].map(({ icon: Icon, label, detail }) => <div key={label} className="flex gap-4 py-4"><Icon className="mt-1 h-5 w-5 shrink-0 text-[#755536]" aria-hidden="true" /><div className="min-w-0"><dt className="font-bold">{label}</dt><dd className="mt-1 break-words text-sm text-zinc-600">{detail}</dd></div></div>)}
            </dl>
            <div className="mt-7 flex flex-wrap items-end gap-x-4 gap-y-2"><p className="text-4xl font-bold">A${price.toLocaleString("en-AU")}</p><p className="pb-1 text-sm text-zinc-600">Equipment package</p></div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href={`/products/${product.slug}`} className="inline-flex min-h-12 items-center gap-2 rounded-md bg-zinc-950 px-6 text-sm font-bold text-white">View kit details <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
              <Link href="/contact?service=security-camera-kit#quote" className="inline-flex min-h-12 items-center rounded-md border border-zinc-400 px-6 text-sm font-bold">Enquire about this kit</Link>
            </div>
            <Link href="/blog/security-camera-kits-adelaide-buying-guide" className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#755536]">Read the camera kit buying guide <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
          </div>
        </div>
      </div>
    </section>
  );
}
