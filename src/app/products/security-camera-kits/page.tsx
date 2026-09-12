import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, MessageSquareText } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { localProducts } from "@/lib/localProducts";
import { isSecurityCameraKit } from "@/lib/productType";
import { businessInfo, siteUrl } from "@/lib/seoData";

const pageUrl = `${siteUrl}/products/security-camera-kits`;

export const metadata: Metadata = {
  title: "Security Camera Kits Adelaide",
  description:
    "Shop Dahua PoE security camera equipment packages for Adelaide homes and small businesses from ADE Smart Home.",
  alternates: { canonical: pageUrl },
  openGraph: {
    title: "Security Camera Kits Adelaide | ADE Smart Home",
    description:
      "Dahua PoE camera and recorder packages for Adelaide homes and small businesses.",
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
  const smsBody = encodeURIComponent(
    "Hi ADE Smart Home, I am interested in a security camera kit.",
  );

  return (
    <main className="min-h-screen bg-black pb-24 pt-28 text-white md:pt-32">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <div className="container mx-auto px-4 md:px-6">
        <nav className="mb-10 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
          <Link href="/" className="hover:text-white">Home</Link>
          <ChevronRight className="h-3 w-3" aria-hidden="true" />
          <Link href="/products" className="hover:text-white">Products</Link>
          <ChevronRight className="h-3 w-3" aria-hidden="true" />
          <span className="text-[#c5a47e]">Security Camera Kits</span>
        </nav>

        <header className="border-b border-zinc-800 pb-12">
          <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#c5a47e]">
            Adelaide smart security
          </p>
          <h1 className="mt-4 text-4xl font-black tracking-tight md:text-6xl">
            Security Camera Kits
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-zinc-400 md:text-lg">
            Practical Dahua PoE camera and recorder packages for key areas around homes,
            shops, offices and small commercial properties.
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
              className="inline-flex min-h-12 items-center justify-center gap-2 border border-zinc-700 px-6 text-sm font-bold text-white transition-colors hover:border-[#c5a47e] hover:text-[#c5a47e]"
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
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {cameraKits.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
