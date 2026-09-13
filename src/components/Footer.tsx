import Link from "next/link";
import Image from "next/image";
import { MessageSquareText, Mail, MapPin, Facebook, Instagram, Link2 } from "lucide-react";
import { businessInfo, serviceAreas, socialProfiles } from "@/lib/seoData";
import { VisualEffectsControl } from "@/components/VisualEffectsControl";
import { ContactCopyButton } from "@/components/ContactCopyButton";

const serviceLinks = [
  ["/smart-lock-supply-installation-adelaide", "Lock + Installation Packages"],
  ["/smart-lock-installation-only-adelaide", "Installation Only"],
  ["/products/security-camera-kits", "Security Camera Kits"],
  ["/blog/smart-lock-door-compatibility-check", "Door Compatibility Check"],
];
const specialistLinks = [
  ["/smart-lock-installation-adelaide", "Smart Lock Installation"],
  ["/digital-door-lock-adelaide", "Digital Door Lock Services"],
  ["/smart-lock-installer-adelaide", "Smart Lock Installer"],
  ["/airbnb-smart-lock-installation-adelaide", "Airbnb & Short-Stay Properties"],
  ["/apartment-smart-lock-installation-adelaide", "Apartments & Units"],
  ["/property-manager-smart-lock-installation-adelaide", "Property Managers"],
  ["/new-home-smart-lock-installation-adelaide", "New Homes & Renovations"],
];
const exploreLinks = [
  ["/products", "All Products"],
  ["/gallery", "Installation Gallery"],
  ["/brands", "Smart Lock Brands"],
  ["/blog", "Installation Guides"],
  ["/about", "About ADE Smart Home"],
];
const moreLinks = [
  ["/", "Home"],
  ["/brands/lockin", "Lockin Smart Locks"],
  ["/brands/kaadas", "Kaadas Smart Locks"],
  ["/service-areas", "Adelaide Service Areas"],
  ["/contact#quote", "Contact & Support"],
];
const socialNames = ["Facebook", "Instagram", "TikTok", "Xiaohongshu"];

function FooterLinks({ links }: { links: string[][] }) {
  return (
    <ul>
      {links.map(([href, label]) => (
        <li key={href}><Link href={href}>{label}</Link></li>
      ))}
    </ul>
  );
}

export function Footer() {
  const currentYear = new Date().getFullYear();
  const textSmsHref = `sms:${businessInfo.phoneInternational}?body=${encodeURIComponent("Hi ADE Smart Home, I would like a product quote.")}`;

  return (
    <footer className="site-footer border-t border-zinc-800 bg-zinc-950 text-zinc-400">
      <div className="container mx-auto max-w-[1500px] px-5 py-12 md:px-8 xl:px-10">
        <div className="footer-columns grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="min-w-0">
            <Link href="/" className="relative inline-block h-12 w-40">
              <Image src="/img/logo.png" alt="ADE Smart Home Logo" fill sizes="160px" className="object-contain object-left" />
            </Link>
            <p className="mt-4 text-sm leading-6">
              Adelaide smart security products, smart lock installation and practical local support for homes and small businesses.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {socialProfiles.map((href, index) => (
                <a key={href} href={href} target="_blank" rel="noopener noreferrer"
                  aria-label={`ADE Smart Home on ${socialNames[index]}`} title={socialNames[index]}
                  className="flex h-11 w-11 items-center justify-center rounded-md border border-zinc-800">
                  {index === 0 ? <Facebook className="h-4 w-4" aria-hidden="true" />
                    : index === 1 ? <Instagram className="h-4 w-4" aria-hidden="true" />
                    : <Link2 className="h-4 w-4" aria-hidden="true" />}
                </a>
              ))}
            </div>
          </div>

          <section aria-labelledby="footer-contact" className="min-w-0 lg:order-last">
            <h2 id="footer-contact">Contact Us</h2>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <a href={textSmsHref} className="min-w-0 flex-1 gap-3">
                  <MessageSquareText className="h-5 w-5 shrink-0 text-[#c5a47e]" aria-hidden="true" />
                  <span><span className="block font-semibold text-zinc-200">Text / SMS</span>{businessInfo.phone}</span>
                </a>
                <ContactCopyButton value={businessInfo.phone} label="Phone number" />
              </li>
              <li className="flex items-center gap-2">
                <a href={`mailto:${businessInfo.email}`} className="min-w-0 flex-1 gap-3">
                  <Mail className="h-5 w-5 shrink-0 text-[#c5a47e]" aria-hidden="true" />
                  <span className="min-w-0 break-words"><span className="block font-semibold text-zinc-200">Email</span>{businessInfo.email}</span>
                </a>
                <ContactCopyButton value={businessInfo.email} label="Email address" />
              </li>
              <li className="flex items-center gap-3 py-2">
                <MapPin className="h-5 w-5 shrink-0 text-[#c5a47e]" aria-hidden="true" />
                <span>Adelaide, South Australia</span>
              </li>
              <li><Link href="/contact#quote" className="font-semibold text-[#d9b98f]">Request a Quote</Link></li>
            </ul>
          </section>

          <nav aria-labelledby="footer-services">
            <h2 id="footer-services">Products & Services</h2>
            <FooterLinks links={serviceLinks} />
            <details className="mt-2 border-t border-zinc-800">
              <summary>Specialist Installation</summary>
              <FooterLinks links={specialistLinks} />
            </details>
          </nav>

          <nav aria-labelledby="footer-explore">
            <h2 id="footer-explore">Explore</h2>
            <FooterLinks links={exploreLinks} />
            <Link href="/zh" lang="zh-CN">中文服务</Link>
            <details className="mt-2 border-t border-zinc-800">
              <summary>More Links</summary>
              <FooterLinks links={moreLinks} />
            </details>
          </nav>
        </div>

        <nav aria-label="Adelaide service areas" className="mt-8 border-t border-zinc-800 pt-4">
          <details>
            <summary>Areas We Serve</summary>
            <Link href="/service-areas" className="font-semibold text-[#d9b98f]">All Adelaide Service Areas</Link>
            <ul className="grid grid-cols-2 gap-x-5 md:grid-cols-4 lg:grid-cols-6">
              {serviceAreas.map((area) => (
                <li key={area.slug}><Link href={`/smart-lock-installation/${area.slug}`}>{area.name}</Link></li>
              ))}
            </ul>
          </details>
        </nav>

        <div className="mt-4 border-t border-zinc-800 pt-3"><VisualEffectsControl /></div>
        <div className="mt-2 flex flex-col gap-2 text-xs md:flex-row md:items-center md:justify-between">
          <p>© {currentYear} ADE Smart Home. All rights reserved.</p>
          <div className="flex flex-wrap gap-x-5">
            <Link href="/privacy-policy">Privacy Policy</Link>
            <Link href="/delivery-and-returns">Delivery & Returns</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
