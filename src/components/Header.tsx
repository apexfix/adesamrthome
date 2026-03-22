"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, Phone, Mail, X } from "lucide-react";

// 优化 1: 将导航数据抽离，降低代码冗余，后续加新页面只需改这里
const navLinks = [
  { name: "Home", href: "/" },
  { name: "Products", href: "/products" },
  { name: "Contact", href: "/contact" },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black text-white">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        
        <div className="flex items-center gap-8">
          {/* Logo 区域优化: 调整了响应式尺寸，并增加了 priority 以提升 SEO 首屏加载速度 */}
          <Link href="/" className="flex items-center gap-2">
            <div className="relative w-40 h-10 md:w-48 md:h-12">
              <Image 
                src="/img/logo.png" 
                alt="ADE Smart Home Logo" 
                fill 
                priority
                className="object-contain object-left"
              />
            </div>
          </Link>
          
          {/* 桌面端导航优化: Hover 状态统一使用品牌金色 */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href} 
                className="transition-colors hover:text-[#c5a47e] text-white/80"
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-6">
          {/* 桌面端联系方式优化: 同样接入品牌金色，并在屏幕变窄时自动隐藏过长的邮箱地址 */}
          <div className="hidden md:flex items-center gap-6 text-sm text-white/80">
             <a href="tel:0493343981" className="flex items-center gap-2 hover:text-[#c5a47e] transition-colors">
               <Phone className="h-4 w-4" />
               <span>0493343981</span>
             </a>
             <a href="mailto:smarthomeade@gmail.com" className="flex items-center gap-2 hover:text-[#c5a47e] transition-colors">
               <Mail className="h-4 w-4" />
               <span className="hidden lg:inline">smarthomeade@gmail.com</span>
             </a>
          </div>
          
          {/* 移动端菜单按钮优化: 增加无障碍阅读属性 aria-expanded */}
          <button 
            className="md:hidden p-2 hover:bg-white/10 hover:text-[#c5a47e] rounded-md transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-expanded={isMenuOpen}
            aria-label="Toggle Menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* 移动端下拉菜单优化: 扩大了点击热区 (padding)，优化了弹出动画和背景反馈 */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-black absolute w-full left-0 top-16 shadow-2xl animate-in slide-in-from-top-2 fade-in duration-200">
          <div className="container mx-auto flex flex-col p-4 gap-2">
            <nav className="flex flex-col gap-1 text-sm font-medium">
              {navLinks.map((link) => (
                <Link 
                  key={link.name}
                  href={link.href} 
                  className="p-3 hover:bg-white/5 hover:text-[#c5a47e] rounded-md transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
            <div className="border-t border-white/10 mt-2 pt-4 flex flex-col gap-2">
               <a href="tel:0493343981" className="flex items-center gap-3 text-white/80 hover:text-[#c5a47e] p-3 hover:bg-white/5 rounded-md transition-colors">
                 <Phone className="h-5 w-5" />
                 <span>0493343981</span>
               </a>
               <a href="mailto:smarthomeade@gmail.com" className="flex items-center gap-3 text-white/80 hover:text-[#c5a47e] p-3 hover:bg-white/5 rounded-md transition-colors">
                 <Mail className="h-5 w-5" />
                 <span>smarthomeade@gmail.com</span>
               </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
