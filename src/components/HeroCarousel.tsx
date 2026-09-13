import Link from "next/link";
import { ArrowRight, LockKeyhole, Tag } from "lucide-react";
import { HeroMediaCarousel } from "@/components/HeroMediaCarousel";
import type { HeroSlide } from "@/lib/heroCarousel";

const slides: HeroSlide[] = [
  {
    id: "supply-install", title: "Smart locks, supplied & installed.",
    description: "Local product advice and installation.",
    href: "/contact?service=supply-install#quote",
    src: "/img/hero/kaadas-product-composition-v1.webp",
    alt: "Product composition of Kaadas K70 SE front and rear smart lock panels",
  },
  {
    id: "installation-only", title: "Already have a smart lock?",
    description: "We fit compatible locks you already own.",
    href: "/contact?service=installation-only#quote",
    src: "/img/installations/auslock-old-door-adelaide/auslock-smart-lock-side-view.jpg",
    alt: "Open timber door showing a fitted Auslock smart lock and mortise cutout",
  },
  {
    id: "camera-kits", title: "CCTV camera kits.",
    description: "Equipment supply only.",
    href: "/products/security-camera-kits",
    src: "/img/hero/cctv-equipment-composition-v1.webp",
    alt: "Product composition of two Dahua turret cameras and one recorder",
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
