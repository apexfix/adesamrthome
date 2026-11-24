import Link from "next/link";
import { ArrowRight, Check, MessageSquareText, Star, Tag } from "lucide-react";
import { INSTALL_ONLY_PRICES, PACKAGE_FROM_PRICE, businessInfo, smsHref } from "@/lib/seoData";
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
    description: "A$599 with standard installation.",
    href: "/products/lockin-x9-smart-lock",
    src: "/img/hero/lockin-x9-composition-v1.webp",
    alt: "Lockin X9 black smart lock front and rear product composition",
  },
];

export function HeroCarousel() {
  return (
    <HeroMediaCarousel slides={slides}>
      <div className="hero-intro">
        <h1>Smart lock supply + install{" "}<span>in Adelaide, from ${PACKAGE_FROM_PRICE}</span></h1>
        <p className="hero-description">One price covers the lock, professional fitting and setup. Already bought one? We fit the locks other installers turn down: imported models, odd lock bodies, doors with an old cut-out.</p>
        <ul className="hero-promises">
          <li><Check size={16} aria-hidden="true" /><span>Free remote door check from your photos</span></li>
          <li><Check size={16} aria-hidden="true" /><span>No deposit or upfront payment</span></li>
          <li><Check size={16} aria-hidden="true" /><span>App, fingerprint and PIN set up with you on site</span></li>
        </ul>
        <div className="hero-primary-actions">
          <Link href="#quote" data-primary-quote className="hero-primary-cta"><Tag size={18} aria-hidden="true" /><span>Get a free quote</span></Link>{" "}
          <a href={smsHref("Hi ADE Smart Home, I would like a smart lock quote.")} data-contact="sms" className="hero-browse-cta"><MessageSquareText size={18} aria-hidden="true" /><span>Text {businessInfo.phoneDisplay}</span></a>
        </div>
        <div className="hero-secondary-links">
          <Link href="#reviews" className="hero-trust">
            <span className="flex gap-0.5 text-[#d9b98f]" aria-hidden="true">
              {[1, 2, 3, 4, 5].map(star => <Star key={star} size={14} className="fill-current" />)}
            </span>{" "}
            <span>5-star Google reviews</span>
          </Link>{" "}
          <Link href="/smart-lock-installation-only-adelaide" className="hero-install-link">Already have a lock? Installation only from ${INSTALL_ONLY_PRICES.compact}<ArrowRight size={16} aria-hidden="true" /></Link>
        </div>
      </div>
    </HeroMediaCarousel>
  );
}
