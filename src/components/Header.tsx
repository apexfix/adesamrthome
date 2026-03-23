"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, Phone, X, Instagram, Facebook, ChevronDown } from "lucide-react";

// 顶层导航链路
const navLinks = [
  { name: "Home", href: "/" },
  { name: "Products", href: "/products" },
  { name: "Stories", href: "/blog" }, 
  { name: "Contact", href: "/contact" },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 z-50 w-full transition-all duration-500 border-b ${
        scrolled 
          ? "bg-black/90 backdrop-blur-md border-white/10 py-2 shadow-lg" 
          : "bg-black/40 backdrop-blur-sm border-transparent py-4"
      } text-white`}
    >
      <div className="container mx-auto max-w-7xl flex items-center justify-between px-6 md:px-8">
        
        <div className="flex items-center gap-10">
          {/* Logo 区域 */}
          <Link href="/" className="flex items-center gap-2 relative group">
            <div className={`relative transition-all duration-500 ${scrolled ? "w-36 h-10" : "w-44 h-12"}`}>
              <Image 
                src="/img/logo.png" 
                alt="ADE Smart Home Logo" 
                fill 
                priority
                className="object-contain object-left group-hover:opacity-80 transition-opacity"
              />
            </div>
          </Link>
          
          {/* 桌面端导航 */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium tracking-wide">
            {navLinks.map((link) => (
              link.name === "Products" ? (
                /* 产品下拉菜单 - 纯 CSS 悬浮逻辑 */
                <div key={link.name} className="relative group py-4">
                  <Link 
                    href={link.href} 
                    className="flex items-center gap-1 text-white/80 hover:text-[#c5a47e] transition-colors"
                  >
                    {link.name} <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
                  </Link>
                  
                  {/* 下拉菜单实体 */}
                  <div className="absolute left-0 top-full mt-0 w-48 bg-zinc-950 border border-zinc-800 rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 shadow-2xl z-50 overflow-hidden">
                    <Link 
                      href="/products?category=SMART+LOCK" 
                      className="block px-5 py-4 text-sm font-medium text-zinc-300 hover:text-white hover:bg-zinc-900 border-b border-zinc-800/50 transition-colors"
                    >
                      Smart Locks (智能锁)
                    </Link>
                    <Link 
                      href="/products?category=CCTV" 
                      className="block px-5 py-4 text-sm font-medium text-zinc-300 hover:text-white hover:bg-zinc-900 transition-colors"
                    >
                      CCTV Systems (监控)
                    </Link>
                  </div>
                </div>
              ) : (
                /* 普通菜单结构 */
                <Link 
                  key={link.name} 
                  href={link.href} 
                  className="relative py-2 text-white/80 hover:text-[#c5a47e] transition-colors group"
                >
                  {link.name}
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#c5a47e] scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
                </Link>
              )
            ))}
          </nav>
        </div>

        {/* 右侧联系方式与社交媒体 */}
        <div className="flex items-center gap-6 md:gap-8">
          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-5 border-r border-white/10 pr-6 mr-2">
              <a href="https://www.facebook.com/profile.php?id=61571291020457" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-[#c5a47e] transition-colors" title="Facebook">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="https://www.instagram.com/adesmarthome/" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-[#c5a47e] transition-colors" title="Instagram">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="https://www.tiktok.com/@adesmarthome" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-[#c5a47e] transition-colors" title="TikTok">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>
              </a>
              <a href="https://xhslink.com/m/6Bv1zW0ClyZ" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-[#c5a47e] transition-colors" title="Xiaohongshu">
                <span className="text-[11px] font-bold tracking-tighter">小红书</span>
              </a>
            </div>

            <div className="hidden lg:flex items-center gap-6 text-sm text-white/90">
               <a href="tel:0493343981" className="flex items-center gap-2 hover:text-[#c5a47e] transition-colors group">
                 <Phone className="h-4 w-4 text-[#c5a47e]" />
                 <span className="font-medium tracking-wide">0493343981</span>
               </a>
            </div>
          </div>
          
          {/* 移动端菜单按钮 */}
          <button 
            className="md:hidden p-2 text-white/80 hover:text-[#c5a47e] transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* 移动端菜单下拉 - 支持子菜单 */}
      {isMenuOpen && (
        <div className="md:hidden bg-black/95 backdrop-blur-xl absolute w-full left-0 top-full border-t border-white/10 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2">
          <div className="container mx-auto p-6 flex flex-col gap-8">
            <nav className="flex flex-col gap-4 text-lg font-medium">
              {navLinks.map((link) => (
                link.name === "Products" ? (
                  <div key={link.name} className="flex flex-col gap-3">
                    <Link href={link.href} className="hover:text-[#c5a47e]" onClick={() => setIsMenuOpen(false)}>
                      {link.name}
                    </Link>
                    {/* 子菜单入口 */}
                    <Link href="/products?category=SMART+LOCK" className="pl-4 text-zinc-400 hover:text-[#c5a47e] text-base" onClick={() => setIsMenuOpen(false)}>
                      └ Smart Locks
                    </Link>
                    <Link href="/products?category=CCTV" className="pl-4 text-zinc-400 hover:text-[#c5a47e] text-base" onClick={() => setIsMenuOpen(false)}>
                      └ CCTV Systems
                    </Link>
                  </div>
                ) : (
                  <Link key={link.name} href={link.href} className="hover:text-[#c5a47e]" onClick={() => setIsMenuOpen(false)}>
                    {link.name}
                  </Link>
                )
              ))}
            </nav>
            {/* 移动端联系方式 */}
            <div className="flex flex-wrap gap-6 py-4 border-y border-white/5">
              <a href="https://www.facebook.com/profile.php?id=61571291020457" target="_blank" className="text-white/60 hover:text-[#c5a47e]">Facebook</a>
              <a href="https://www.instagram.com/adesmarthome/" target="_blank" className="text-white/60 hover:text-[#c5a47e]">Instagram</a>
              <a href="https://www.tiktok.com/@adesmarthome" target="_blank" className="text-white/60 hover:text-[#c5a47e]">TikTok</a>
              <a href="https://xhslink.com/m/6Bv1zW0ClyZ" target="_blank" className="text-sm font-bold text-[#c5a47e]">小红书</a>
            </div>
            <a href="tel:0493343981" className="flex items-center gap-3 text-[#c5a47e] font-bold text-lg">
              <Phone className="h-5 w-5" /> 0493343981
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
