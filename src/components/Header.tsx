"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ArrowUpRight, ChevronDown, Menu, MessageSquareText, X } from "lucide-react";
import { businessInfo } from "@/lib/seoData";

const navLinks = [
  { name: "Gallery", href: "/gallery" },
  { name: "Stories", href: "/blog" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];
const productLinks = [
  { name: "All Products", href: "/products" },
  { name: "Smart Locks", href: "/products?category=smart-lock" },
  { name: "Security Camera Kits", href: "/products/security-camera-kits" },
  { name: "Installation Only", href: "/smart-lock-installation-only-adelaide" },
];

export function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const productsButton = useRef<HTMLButtonElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const closeMenus = () => { setIsMenuOpen(false); setProductsOpen(false); };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (isMenuOpen) menuButton.current?.focus();
      else if (productsOpen) productsButton.current?.focus();
      setIsMenuOpen(false);
      setProductsOpen(false);
    };
    const onPointerDown = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) {
        setIsMenuOpen(false);
        setProductsOpen(false);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [isMenuOpen, productsOpen]);

  const smsHref = `sms:${businessInfo.phoneInternational}?body=${encodeURIComponent("Hi ADE Smart Home, I would like a smart security quote.")}`;

  return (
    <header ref={headerRef} className="site-header text-white" data-scrolled={scrolled}>
      <a href="#site-content" className="skip-link">Skip to content</a>
      <div className="header-surface">
        <Link href="/" onClick={closeMenus} className="flex min-w-0 shrink-0 items-center gap-3" aria-label="ADE Smart Home home">
          <Image src="/img/logo.png" alt="" width={44} height={44} className="h-11 w-11 object-contain" />
          <span className="flex flex-col">
            <span className="text-sm font-bold sm:text-base">ADE SMART HOME</span>
            <span className="text-xs text-white/70">Adelaide smart security</span>
          </span>
        </Link>
        <nav aria-label="Main navigation" className="desktop-navigation items-center gap-1">
          <Link href="/" className="header-link" aria-current={pathname === "/" ? "page" : undefined}>Home</Link>
          <div className="relative" onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) setProductsOpen(false);
          }}>
            <button ref={productsButton} type="button" className="header-link flex items-center gap-2" aria-expanded={productsOpen} aria-controls="product-navigation" onClick={() => setProductsOpen(!productsOpen)}>
              Products <ChevronDown className={`h-4 w-4 transition-transform ${productsOpen ? "rotate-180" : ""}`} aria-hidden="true" />
            </button>
            {productsOpen && (
              <div id="product-navigation" className="liquid-glass absolute left-0 top-[calc(100%+16px)] w-64 rounded-lg border p-2">
                {productLinks.map((link) => (
                  <Link key={link.href} href={link.href} onClick={closeMenus} className="flex min-h-12 items-center justify-between gap-3 rounded-md px-3 text-sm text-white/90 hover:bg-white/10">
                    {link.name}<ArrowUpRight className="h-4 w-4 text-[#d9b98f]" aria-hidden="true" />
                  </Link>
                ))}
              </div>
            )}
          </div>
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="header-link" aria-current={pathname.startsWith(link.href) ? "page" : undefined}>{link.name}</Link>
          ))}
        </nav>
        <a href={smsHref} className="header-text-button glass-control hidden min-h-11 items-center gap-2 rounded-md border px-4 text-sm font-semibold sm:inline-flex">
          <MessageSquareText className="h-4 w-4 text-[#d9b98f]" aria-hidden="true" /><span>Text us</span>
        </a>
        <button ref={menuButton} type="button" aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"} aria-expanded={isMenuOpen} aria-controls="mobile-navigation" className="mobile-menu-button glass-control h-11 w-11 shrink-0 items-center justify-center rounded-md border" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {isMenuOpen && (
        <nav id="mobile-navigation" aria-label="Mobile navigation" className="liquid-glass mobile-navigation mt-2 overflow-y-auto rounded-lg border p-4">
          <Link href="/" onClick={closeMenus} className="block rounded-md px-3 py-3 font-semibold">Home</Link>
          <div className="my-2 border-y border-white/15 py-2">
            {productLinks.map((link) => (
              <Link key={link.href} href={link.href} onClick={closeMenus} className="flex items-center justify-between rounded-md px-3 py-3 text-white/90 hover:bg-white/10">
                {link.name}<ArrowUpRight className="h-4 w-4 text-[#d9b98f]" aria-hidden="true" />
              </Link>
            ))}
          </div>
          {navLinks.map((link) => <Link key={link.href} href={link.href} onClick={closeMenus} className="block rounded-md px-3 py-3 hover:bg-white/10">{link.name}</Link>)}
          <a href={smsHref} className="mt-2 flex items-center gap-2 border-t border-white/15 px-3 pt-4 font-semibold text-[#d9b98f]"><MessageSquareText className="h-4 w-4" />Text {businessInfo.phone}</a>
        </nav>
      )}
    </header>
  );
}
