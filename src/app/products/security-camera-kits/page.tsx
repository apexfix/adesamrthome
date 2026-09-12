import type { Metadata } from "next";
import Link from "next/link";
import { ChevronDown, ChevronRight, MessageSquareText } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { localProducts } from "@/lib/localProducts";
import { isSecurityCameraKit } from "@/lib/productType";
import { businessInfo, siteUrl } from "@/lib/seoData";
import { cameraKitFaqs } from "@/lib/cameraContent";

const pageUrl = `${siteUrl}/products/security-camera-kits`;
const pageDescription = "Dahua CCTV kits in Adelaide: 5MP for A$443 or 6MP Smart Dual Light for A$590. Each includes two cameras and a four-channel PoE recorder. Compare packages.";

export const metadata: Metadata = {
  title: "CCTV & Security Camera Kits Adelaide | Dahua PoE",
  description: pageDescription,
  alternates: { canonical: pageUrl },
  twitter: {
    card: "summary_large_image",
    title: "Dahua CCTV & Security Camera Kits Adelaide",
    description: pageDescription,
    images: ["/img/products/dahua-2-camera-kit/dahua-2-camera-kit-poster-v1.png"],
  },
  openGraph: {
    title: "Security Camera Kits Adelaide | ADE Smart Home",
    description: pageDescription,
    url: pageUrl,
    siteName: "ADE Smart Home",
    images: [
      {
        url: "/img/products/dahua-2-camera-kit/dahua-2-camera-kit-poster-v1.png",
        width: 1254,
        height: 1254,
        alt: "Dahua 5MP security camera kit",
      },
    ],
    locale: "en_AU",
    type: "website",
  },
};

export default function SecurityCameraKitsPage() {
  const cameraKits = localProducts.filter(isSecurityCameraKit);
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${pageUrl}#collection`,
    url: pageUrl,
    name: "Security Camera Kits Adelaide",
    description:
      "PoE security camera equipment packages available from ADE Smart Home in Adelaide.",
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: cameraKits.length,
      itemListElement: cameraKits.map((product, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: product.name,
        url: `${siteUrl}/products/${product.slug}`,
      })),
    },
  };
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: cameraKitFaqs.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Products", item: `${siteUrl}/products` },
      { "@type": "ListItem", position: 3, name: "Security Camera Kits Adelaide", item: pageUrl },
    ],
  };
  const smsBody = encodeURIComponent(
    "Hi ADE Smart Home, I am interested in a security camera kit.",
  );

  return (
    <main className="min-h-screen bg-black pb-24 pt-28 text-white md:pt-32">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="container mx-auto max-w-[1500px] px-5 md:px-8 xl:px-10">
        <nav className="mb-10 flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-zinc-500">
          <Link href="/" className="hover:text-white">Home</Link>
          <ChevronRight className="h-3 w-3" aria-hidden="true" />
          <Link href="/products" className="hover:text-white">Products</Link>
          <ChevronRight className="h-3 w-3" aria-hidden="true" />
          <span className="text-[#c5a47e]">Security Camera Kits</span>
        </nav>

        <header className="border-b border-zinc-800 pb-12">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#c5a47e]">
            Adelaide smart security
          </p>
          <h1 className="mt-4 text-4xl font-black tracking-tight md:text-6xl">
            Security Camera Kits Adelaide
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-zinc-400 md:text-lg">
            Dahua 5MP and 6MP Smart Dual Light camera and recorder packages for key areas around homes,
            shops, offices and small commercial properties, with local advice in Adelaide.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/contact?service=security-camera-kit"
              className="inline-flex min-h-12 items-center justify-center bg-[#c5a47e] px-6 text-sm font-bold text-black transition-colors hover:bg-white"
            >
              Request a Quote
            </Link>
            <a
              href={`sms:${businessInfo.phoneInternational}?body=${smsBody}`}
              className="glass-control inline-flex min-h-12 items-center justify-center gap-2 rounded-md border px-6 text-sm font-bold text-white hover:text-[#d9b98f]"
            >
              <MessageSquareText className="h-4 w-4" aria-hidden="true" />
              Text {businessInfo.phone}
            </a>
          </div>
        </header>

        <section className="pt-12" aria-labelledby="available-kits">
          <h2 id="available-kits" className="mb-8 text-2xl font-bold">
            Available <span className="text-[#c5a47e]">Packages</span>
          </h2>
          <div className="grid max-w-5xl grid-cols-1 gap-8 sm:grid-cols-2">
            {cameraKits.map((product, index) => (
              <ProductCard key={product.id} product={product} priority={index === 0} imageSizes="(max-width: 639px) 100vw, (max-width: 1100px) 50vw, 500px" />
            ))}
          </div>
        </section>

        <section className="mt-14 max-w-5xl" aria-labelledby="compare-kits">
          <h2 id="compare-kits" className="text-2xl font-bold md:text-3xl">Compare the camera packages</h2>
          <p className="mt-4 max-w-3xl leading-7 text-zinc-400">Both packages pair two cameras with the same four-channel PoE recorder. Compare resolution and night lighting to choose the equipment for your property.</p>
          <table className="mt-7 w-full table-fixed border-collapse text-left text-sm md:text-base">
            <caption className="sr-only">Dahua camera kit specifications and equipment prices in Australian dollars</caption>
            <thead>
              <tr className="border-b border-zinc-700">
                <th scope="col" className="w-[28%] py-4 pr-3 font-semibold">Package</th>
                {cameraKits.map(product => <th key={product.id} scope="col" className="break-words px-2 py-4 font-bold text-[#d9b98f]">
                  {product.attributes?.find(attribute => attribute.name === "Camera Resolution")?.options?.[0]?.split(" ")[0]} kit
                  <span className="mt-1 block text-lg text-white">A${Number(product.prices.price) / 10 ** product.prices.currency_minor_unit}</span>
                </th>)}
              </tr>
            </thead>
            <tbody className="text-zinc-300">
              {["Camera Resolution", "Night Vision"].map(label => <tr key={label} className="border-b border-zinc-800">
                <th scope="row" className="py-4 pr-3 font-medium">{label === "Camera Resolution" ? "Resolution" : "Night lighting"}</th>
                {cameraKits.map(product => <td key={product.id} className="break-words px-2 py-4 align-top leading-6">{product.attributes?.find(attribute => attribute.name === label)?.options?.join("; ")}</td>)}
              </tr>)}
              <tr className="border-b border-zinc-800">
                <th scope="row" className="py-4 pr-3 font-medium">Details</th>
                {cameraKits.map(product => <td key={product.id} className="px-2 py-3"><Link href={`/products/${product.slug}`} className="inline-flex min-h-11 items-center text-[#d9b98f] underline underline-offset-4" aria-label={`View ${product.name}`}>View kit</Link></td>)}
              </tr>
            </tbody>
          </table>
          <p className="mt-4 text-sm leading-6 text-zinc-400">Night-time detail depends on lighting, placement and lens choice. Extra cameras must be compatible with the recorder and remain within its bandwidth and PoE power limits.</p>
        </section>

        <section className="mt-16 grid gap-10 border-t border-zinc-800 pt-12 lg:grid-cols-2" aria-labelledby="camera-planning">
          <div>
            <h2 id="camera-planning" className="text-3xl font-bold">Plan the views you actually need</h2>
            <p className="mt-5 text-base leading-7 text-zinc-300">A two-camera CCTV kit can be a useful starting point when you have two priority areas. Think about the activity you want to see before choosing camera positions.</p>
            <dl className="mt-6 divide-y divide-zinc-800">
              {[
                ["Home entrance & driveway", "Check visitors at the front door and movement around vehicle access. Consider door recesses, trees and parked cars when choosing the view."],
                ["Shop entrance & stock area", "Choose views around customer access and stock movement. Tell us about the room layout and the distance to the recorder."],
                ["Side access & rear entry", "Compare sightlines and lighting along each route. A corner or a fence may create a blind spot that needs a different camera position."],
              ].map(([label, detail]) => <div key={label} className="py-5"><dt className="font-bold text-[#d9b98f]">{label}</dt><dd className="mt-2 leading-7 text-zinc-400">{detail}</dd></div>)}
            </dl>
          </div>
          <div>
            <h2 className="text-3xl font-bold">Local product advice in Adelaide</h2>
            <p className="mt-5 leading-7 text-zinc-300">Ask ADE Smart Home about camera packages for a house, shop, office or workshop. We discuss the equipment, the areas you want covered and your preferred timing before you order.</p>
            <p className="mt-4 leading-7 text-zinc-400">Send your suburb with your enquiry, whether you are in Adelaide CBD, Glenelg, Norwood, Mawson Lakes, Modbury, Marion or another Adelaide suburb.</p>
            <p className="mt-4 leading-7 text-zinc-400">Useful details include the two main areas to monitor, a simple property layout, existing network cabling and where you would like to keep the recorder.</p>
            <Link href="/blog/security-camera-kits-adelaide-buying-guide" className="glass-control mt-7 inline-flex min-h-12 items-center rounded-md border px-5 text-sm font-bold">Read our Adelaide camera kit buying guide</Link>
            <p className="mt-6 leading-7 text-zinc-400">Upgrading your entry too? Compare our <Link href="/products?category=smart-lock" className="text-[#d9b98f] underline underline-offset-4">smart locks</Link> and <Link href="/smart-lock-installation-only-adelaide" className="text-[#d9b98f] underline underline-offset-4">installation-only service</Link>.</p>
          </div>
        </section>

        <section className="pt-16" aria-labelledby="camera-kit-faq">
          <h2 id="camera-kit-faq" className="text-3xl font-bold md:text-4xl">
            Security Camera Kit FAQ
          </h2>
          <div className="mt-8 divide-y divide-zinc-800 border-y border-zinc-800">
            {cameraKitFaqs.map((item) => (
              <details key={item.question} className="group py-6">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-5 text-lg font-bold text-white marker:content-none">
                  <span>{item.question}</span>
                  <ChevronDown className="h-5 w-5 shrink-0 text-[#c5a47e] transition-transform group-open:rotate-180" aria-hidden="true" />
                </summary>
                <p className="mt-4 max-w-3xl text-base leading-7 text-zinc-400">{item.answer}</p>
              </details>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
