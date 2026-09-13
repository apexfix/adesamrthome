import Link from "next/link";
import { ArrowRight, LockKeyhole, Tag } from "lucide-react";
import { HeroMediaCarousel } from "@/components/HeroMediaCarousel";
import type { HeroSlide } from "@/lib/heroCarousel";

const slides: HeroSlide[] = [
  {
    id: "v5max", title: "Lockin V5 MAX",
    description: "A$1,350 with standard installation.",
    href: "/products/lockin-v5-max-smart-lock",
    src: "/img/hero/lockin-v5max-composition-v1.webp",
    alt: "Lockin V5 MAX black smart lock product composition",
  },
  {
    id: "x9", title: "Lockin X9",
    description: "A$699 with standard installation.",
    href: "/products/lockin-x9-smart-lock",
    src: "/img/hero/lockin-x9-composition-v1.webp",
    alt: "Lockin X9 black smart lock front and rear product composition",
  },
  {
    id: "dahua-5mp", title: "Dahua 5MP Camera Kit",
    description: "A$443 equipment package. Two cameras and one recorder.",
    href: "/products/dahua-5mp-2-camera-poe-security-kit",
    src: "/img/products/dahua-2-camera-kit/dahua-2-camera-kit-poster-v1.png",
    alt: "Dahua 5MP CCTV equipment package: two cameras and one four-channel PoE recorder, A$443",
  },
];

export function HeroCarousel() {
  return (
    <HeroMediaCarousel slides={slides}>
      <div className="hero-intro">
        <p className="hero-brand">ADE SMART HOME</p>
        <h1>Smart Lock Supply &amp;<span>Installation in Adelaide</span></h1>
        <p className="hero-description">Choose a lock supplied and installed locally, or have a compatible lock you already own fitted. We also supply CCTV camera kits.</p>
        <div className="hero-primary-actions">
          <Link href="/contact?service=supply-install#quote" data-primary-quote className="hero-primary-cta"><Tag size={18} aria-hidden="true" /><span>Get a Quote</span></Link>
          <Link href="#smart-locks" className="hero-browse-cta"><LockKeyhole size={18} aria-hidden="true" /><span>Browse Smart Locks</span></Link>
        </div>
        <Link href="/smart-lock-installation-only-adelaide" className="hero-install-link">Installation-only service<ArrowRight size={16} aria-hidden="true" /></Link>
      </div>
    </HeroMediaCarousel>
  );
}
