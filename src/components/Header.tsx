"use client";

import { Suspense, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";
import { ArrowUpRight, ChevronDown, Clock, Languages, Menu, MessageSquareText, Phone, X } from "lucide-react";
import { BUSINESS_HOURS, SERVICE_AREA_LABEL, SERVICE_AREA_LABEL_ZH, businessInfo, smsHref as buildSmsHref, telHref } from "@/lib/seoData";
import { activeNavigationHref, type ProductNavigationRoutes } from "@/lib/navigation";

const navLinks = [
  { name: "Gallery", href: "/gallery" },
  { name: "Stories", href: "/blog" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];
const productLinks = [
  { name: "All Products", href: "/products" },
  { name: "Smart Locks", href: "/products?category=smart-lock" },
  { name: "Browse Lock Brands", href: "/brands" },
  { name: "Security Camera Kits", href: "/products/security-camera-kits" },
  { name: "Installation Only", href: "/smart-lock-installation-only-adelaide" },
];
const primaryLinks = [
  { name: "Smart Locks", href: "/products?category=smart-lock" },
  { name: "Installation Only", href: "/smart-lock-installation-only-adelaide" },
  { name: "CCTV Kits", href: "/products/security-camera-kits" },
];
const moreLinks = [productLinks[0], productLinks[2], ...navLinks.filter(link => link.href !== "/gallery")];
// Chinese page sections; the /zh page is one long page with these anchors.
const zhLinks = [
  { name: "服务", href: "/zh#fuwu" },
  { name: "套餐价格", href: "/zh#jiage" },
  { name: "安装流程", href: "/zh#liucheng" },
  { name: "常见问题", href: "/zh#wenti" },
  { name: "联系我们", href: "/zh#lianxi" },
];

function NavigationLocation({ onChange }: { onChange: (path: string, category: string | null) => void }) {
  const pathname = usePathname();
  const query = useSearchParams().toString();
  useEffect(() => { onChange(pathname, new URLSearchParams(query).get("category")); }, [pathname, query, onChange]);
  return null;
}

export function Header({ productNavigation, lang = "en" }: { productNavigation: ProductNavigationRoutes; lang?: "en" | "zh" }) {
  const zh = lang === "zh";
  const pathname = usePathname();
  const [location, setLocation] = useState<{ path: string; category: string | null } | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const productsButton = useRef<HTMLButtonElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const navigationRef = useRef<HTMLElement>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);
  const focusedNavigation = useRef<"mobile" | "desktop" | null>(null);
  const closeMenus = () => { setIsMenuOpen(false); setProductsOpen(false); };
  const onLocationChange = useCallback((path: string, category: string | null) => {
    setLocation({ path, category });
    setIsMenuOpen(false);
    setProductsOpen(false);
  }, []);
  const activeHref = activeNavigationHref(pathname, location?.path === pathname ? location.category : undefined, productNavigation);
  const moreActive = moreLinks.some(link => link.href === activeHref);
  const current = (href: string) => activeHref === href ? pathname === href.split("?")[0] ? "page" as const : "location" as const : undefined;

  useLayoutEffect(() => {
    const header = headerRef.current;
    const surface = header?.querySelector<HTMLElement>('.header-surface');
    if (!header || !surface) return;
    const root = document.documentElement;
    const measure = () => {
      const style = getComputedStyle(surface);
      const headerStyle = getComputedStyle(header);
      // Reserve the expanded header height even while its padding contracts on scroll.
      const contentHeight = surface.getBoundingClientRect().height - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom);
      const restHeight = Math.max(parseFloat(headerStyle.getPropertyValue('--header-rest-height')), contentHeight + 2 * parseFloat(headerStyle.getPropertyValue('--header-rest-padding')));
      const clearance = Math.ceil(restHeight + parseFloat(headerStyle.top) + 16);
      root.style.setProperty('--site-header-clearance', `${clearance}px`);
    };
    measure();
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(measure);
    observer?.observe(surface);
    window.addEventListener('resize', measure);
    return () => { observer?.disconnect(); window.removeEventListener('resize', measure); root.style.removeProperty('--site-header-clearance'); };
  }, []);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    let cancelled = false;
    const finish = () => { if (!cancelled) header.dataset.entered = "true"; };
    const entry = header.getAnimations?.().find(animation => (animation as CSSAnimation).animationName === "header-enter");
    if (entry) entry.finished.then(finish, finish);
    else finish();
    return () => { cancelled = true; };
  }, []);

  useLayoutEffect(() => {
    const nav = navigationRef.current;
    const indicator = indicatorRef.current;
    if (!nav || !indicator) return;
    if (typeof ResizeObserver === "undefined") {
      nav.dataset.indicatorReady = "false";
      return;
    }
    let cancelled = false;
    const measure = () => {
      if (cancelled) return;
      const selected = nav.querySelector<HTMLElement>('[data-nav-active="true"]');
      if (!selected || !nav.getBoundingClientRect().width) { nav.dataset.indicatorReady = "false"; return; }
      const bounds = nav.getBoundingClientRect();
      const target = selected.getBoundingClientRect();
      indicator.style.width = `${target.width}px`;
      indicator.style.height = `${target.height}px`;
      indicator.style.transform = `translate(${target.left - bounds.left}px, ${target.top - bounds.top}px)`;
      nav.dataset.indicatorReady = "true";
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(nav);
    nav.querySelectorAll('.header-link').forEach(link => observer.observe(link));
    document.fonts.ready.then(measure);
    return () => { cancelled = true; observer.disconnect(); };
  }, [activeHref]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1100px)");
    const onBreakpoint = () => {
      const focused = document.activeElement;
      // Browsers can blur display:none controls before matchMedia fires.
      const previousFocus = focused === document.body ? focusedNavigation.current : null;
      const focusWasInHiddenMenu = desktop.matches
        ? previousFocus === "mobile" || focused === menuButton.current || Boolean(focused?.closest('#mobile-navigation'))
        : previousFocus === "desktop" || Boolean(focused?.closest('.desktop-navigation'));
      setIsMenuOpen(false);
      setProductsOpen(false);
      if (focusWasInHiddenMenu) {
        if (desktop.matches) (navigationRef.current?.querySelector<HTMLElement>('[data-nav-active="true"]') ?? navigationRef.current?.querySelector<HTMLElement>('a'))?.focus();
        else menuButton.current?.focus();
      }
    };
    desktop.addEventListener("change", onBreakpoint);
    return () => desktop.removeEventListener("change", onBreakpoint);
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
        focusedNavigation.current = null;
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

  const smsHref = buildSmsHref(zh ? "你好，我想咨询智能锁安装。" : "Hi ADE Smart Home, I would like a smart security quote.");
  const languageSwitch = zh
    ? { href: "/", label: "EN", title: "English", hrefLang: "en-AU" }
    : { href: "/zh", label: "中文", title: "简体中文", hrefLang: "zh-CN" };

  return (
    <header ref={headerRef} className="site-header text-white" data-scrolled={scrolled} data-menu-open={isMenuOpen}
      onFocusCapture={event => {
        const target = event.target as HTMLElement;
        focusedNavigation.current = target.closest('.desktop-navigation') ? "desktop"
          : target === menuButton.current || target.closest('#mobile-navigation') ? "mobile" : null;
      }}
      onBlur={event => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          if (event.relatedTarget || event.target.getClientRects().length) focusedNavigation.current = null;
          closeMenus();
        }
      }}>
      <Suspense fallback={null}><NavigationLocation onChange={onLocationChange} /></Suspense>
      <a href="#site-content" className="skip-link">Skip to content</a>
      <div className="header-surface">
        <Link href={zh ? "/zh" : "/"} onClick={closeMenus} className="header-brand flex min-w-0 items-center" aria-label={zh ? "ADE Smart Home 中文首页" : "ADE Smart Home home"}>
          <Image src="/img/logo.png" alt="" width={44} height={44} className="header-brand-logo object-contain" />
          <span className="header-brand-copy flex min-w-0 flex-col">
            <span className="text-sm font-bold sm:text-base">ADE SMART HOME</span>{" "}
            <span className="text-xs text-white/70">{zh ? "阿德莱德智能锁安装" : "Adelaide smart lock installers"}</span>
          </span>
        </Link>
        <nav ref={navigationRef} aria-label={zh ? "主导航" : "Main navigation"} className="desktop-navigation items-center gap-1">
          <span ref={indicatorRef} className="header-active-indicator" aria-hidden="true" />
          {zh ? zhLinks.map(link => (
            <Link key={link.href} href={link.href} onClick={closeMenus} className="header-link whitespace-nowrap">{link.name}</Link>
          )).flatMap(link => [link, " "]) : <>
          {primaryLinks.map(link => (
            <Link key={link.href} href={link.href} onClick={closeMenus} className="header-link whitespace-nowrap" data-nav-active={activeHref === link.href} aria-current={current(link.href)}>{link.name}</Link>
          )).flatMap(link => [link, " "])}
          <Link href="/gallery" onClick={closeMenus} className="header-link" data-nav-active={activeHref === "/gallery"} aria-current={current("/gallery")}>Gallery</Link>{" "}
          <div className="relative" onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) setProductsOpen(false);
          }}>
            <button ref={productsButton} type="button" className="header-link flex items-center gap-2" data-nav-active={moreActive} aria-expanded={productsOpen} aria-controls="product-navigation" onClick={() => setProductsOpen(!productsOpen)}>
              <span>More</span><ChevronDown className={`h-4 w-4 transition-transform ${productsOpen ? "rotate-180" : ""}`} aria-hidden="true" />
            </button>{" "}
            {productsOpen && (
              <div id="product-navigation" className="liquid-glass absolute right-0 top-[calc(100%+16px)] w-64 rounded-lg border p-2">
                {moreLinks.map((link) => (
                  <Link key={link.href} href={link.href} onClick={closeMenus} aria-current={current(link.href)} className="secondary-header-link flex min-h-12 items-center justify-between gap-3 rounded-md px-3 text-sm text-white/90 hover:bg-white/10">
                    <span>{link.name}</span><ArrowUpRight className="h-4 w-4 text-[#d9b98f]" aria-hidden="true" />
                  </Link>
                ))}
              </div>
            )}
          </div>
          </>}
        </nav>
        <div className="header-contact flex shrink-0 items-center gap-2">
        <Link href={languageSwitch.href} hrefLang={languageSwitch.hrefLang} lang={zh ? "en" : "zh-CN"} title={languageSwitch.title} onClick={closeMenus}
          className="header-lang glass-control inline-flex min-h-11 items-center gap-1.5 rounded-md border px-3 text-sm font-semibold">
          <Languages className="h-4 w-4 text-[#d9b98f]" aria-hidden="true" /><span>{languageSwitch.label}</span>
        </Link>{" "}
        <a href={telHref} className="header-call glass-control inline-flex min-h-11 items-center gap-2 rounded-md border px-3 text-sm font-semibold" aria-label={zh ? `打电话 ${businessInfo.phoneDisplay}` : `Call ${businessInfo.phoneDisplay}`}>
          <Phone className="h-4 w-4 text-[#d9b98f]" aria-hidden="true" /><span className="header-call-number">{businessInfo.phoneDisplay}</span>
        </a>{" "}
        <a href={smsHref} className="header-text-button glass-control hidden min-h-11 items-center gap-2 rounded-md border px-4 text-sm font-semibold sm:inline-flex">
          <MessageSquareText className="h-4 w-4 text-[#d9b98f]" aria-hidden="true" /><span>{zh ? "短信" : "Text us"}</span>
        </a>
        </div>
        <button ref={menuButton} type="button" aria-label={isMenuOpen ? (zh ? "关闭菜单" : "Close navigation menu") : (zh ? "打开菜单" : "Open navigation menu")} aria-expanded={isMenuOpen} aria-controls="mobile-navigation" className="mobile-menu-button glass-control h-12 w-12 shrink-0 items-center justify-center rounded-md border" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {isMenuOpen && (
        <nav id="mobile-navigation" aria-label={zh ? "手机导航" : "Mobile navigation"} className="liquid-glass mobile-navigation mt-2 overflow-y-auto rounded-lg border p-4">
          {zh ? <>
          <Link href="/zh" onClick={closeMenus} className="block rounded-md px-3 py-3 font-semibold">首页</Link>{" "}
          {zhLinks.map(link => <Link key={link.href} href={link.href} onClick={closeMenus} className="block rounded-md px-3 py-3 hover:bg-white/10">{link.name}</Link>)}
          </> : <>
          <Link href="/" onClick={closeMenus} aria-current={current("/")} className="block rounded-md px-3 py-3 font-semibold">Home</Link>
          <div className="my-2 border-y border-white/15 py-2">
            {productLinks.map((link) => (
              <Link key={link.href} href={link.href} onClick={closeMenus} aria-current={current(link.href)} className="flex items-center justify-between rounded-md px-3 py-3 text-white/90 hover:bg-white/10">
                {link.name}<ArrowUpRight className="h-4 w-4 text-[#d9b98f]" aria-hidden="true" />
              </Link>
            ))}
          </div>
          {navLinks.map((link) => <Link key={link.href} href={link.href} onClick={closeMenus} aria-current={current(link.href)} className="block rounded-md px-3 py-3 hover:bg-white/10">{link.name}</Link>)}
          </>}
          <Link href={languageSwitch.href} hrefLang={languageSwitch.hrefLang} onClick={closeMenus} className="flex items-center gap-2 rounded-md px-3 py-3 hover:bg-white/10"><Languages className="h-4 w-4 text-[#d9b98f]" aria-hidden="true" />{zh ? "English site" : "中文页面"}</Link>
          <div className="mt-2 space-y-1 border-t border-white/15 pt-3">
            <a href={telHref} className="flex min-h-11 items-center gap-2 px-3 font-semibold text-[#d9b98f]"><Phone className="h-4 w-4" aria-hidden="true" />{zh ? "打电话" : "Call"} {businessInfo.phoneDisplay}</a>{" "}
            <a href={smsHref} className="flex min-h-11 items-center gap-2 px-3 font-semibold text-[#d9b98f]"><MessageSquareText className="h-4 w-4" aria-hidden="true" />{zh ? "发短信" : "Text"} {businessInfo.phoneDisplay}</a>
            <p className="flex items-center gap-2 px-3 py-2 text-sm text-white/70"><Clock className="h-4 w-4 shrink-0" aria-hidden="true" />{zh ? BUSINESS_HOURS.labelZh : BUSINESS_HOURS.label} · {zh ? SERVICE_AREA_LABEL_ZH : SERVICE_AREA_LABEL}</p>
          </div>
        </nav>
      )}
    </header>
  );
}
