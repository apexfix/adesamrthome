import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Link2 } from "lucide-react";
import { BUSINESS_ABN, serviceAreas, socialProfiles } from "@/lib/seoData";
import { VisualEffectsControl } from "@/components/VisualEffectsControl";
import { BusinessDetails } from "@/components/BusinessDetails";

const serviceLinks = [
  ["/smart-lock-supply-installation-adelaide", "Lock + Installation Packages"],
  ["/smart-lock-installation-only-adelaide", "Installation Only"],
  ["/blog/smart-lock-door-compatibility-check", "Door Compatibility Check"],
];
const specialistLinks = [
  ["/smart-lock-installation-adelaide", "Smart Lock Installation"],
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

export function Footer({ lang = "en" }: { lang?: "en" | "zh" }) {
  const currentYear = new Date().getFullYear();
  const zh = lang === "zh";

  return (
    <footer className="site-footer border-t border-zinc-800 bg-zinc-950 text-zinc-400">
      <div className="container mx-auto max-w-[1500px] px-5 py-12 md:px-8 xl:px-10">
        <div className="footer-columns grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="min-w-0">
            <Link href="/" className="relative inline-block h-12 w-40">
              <Image src="/img/logo.png" alt="ADE Smart Home Logo" fill sizes="160px" className="object-contain object-left" />
            </Link>
            <p className="mt-4 text-sm leading-6">
              {zh ? "阿德莱德本地智能锁供货和安装，装完现场教你用，售后找得到人。" : "Smart lock supply and installation across Adelaide metro, with setup on site and local after-sales support."}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {socialProfiles.map((href, index) => (
                <a key={href} href={href} target="_blank" rel="noopener noreferrer"
                  aria-label={`ADE Smart Home on ${socialNames[index]}`} title={socialNames[index]}
                  className="flex h-11 w-11 items-center justify-center rounded-md border border-zinc-800">
                  {index === 0 ? <Facebook className="h-4 w-4" aria-hidden="true" />
                    : index === 1 ? <Instagram className="h-4 w-4" aria-hidden="true" />
                    : <Link2 className="h-4 w-4" aria-hidden="true" />}
                {" "}</a>
              ))}
            </div>
          </div>

          <section aria-labelledby="footer-contact" className="min-w-0 lg:order-last">
            <h2 id="footer-contact">{zh ? "联系我们" : "Contact Us"}</h2>
            <BusinessDetails lang={lang} />
            <Link href={zh ? "/zh#lianxi" : "/contact#quote"} className="mt-1 font-semibold text-[#d9b98f]">{zh ? "免费报价" : "Request a Quote"}</Link>
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
            {zh ? <Link href="/" hrefLang="en-AU" lang="en">English site</Link> : <Link href="/zh" hrefLang="zh-CN" lang="zh-CN">中文服务</Link>}
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
          <p>© {currentYear} ADE Smart Home.{BUSINESS_ABN ? ` ABN ${BUSINESS_ABN}.` : ""} {zh ? "版权所有。" : "All rights reserved."}</p>
          <div className="flex flex-wrap gap-x-5">
            <Link href="/privacy-policy">Privacy Policy</Link>{" "}
            <Link href="/delivery-and-returns">Delivery & Returns</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
