import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin, Facebook, Instagram, ShieldCheck, Link2 } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-zinc-950 border-t border-zinc-900 text-zinc-400">
      <div className="container mx-auto px-4 md:px-6 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          
          {/* 品牌与介绍区 */}
          <div className="space-y-6 lg:pr-8">
            <Link href="/" className="inline-block relative w-40 h-10">
              <Image 
                src="/img/logo.png" 
                alt="ADE Smart Home Logo" 
                fill 
                className="object-contain object-left opacity-90 hover:opacity-100 transition-opacity"
              />
            </Link>
            <p className="text-sm leading-relaxed">
              Adelaide's premier smart lock installation specialists. We combine cutting-edge security technology with flawless, flush-finish installations to protect what matters most.
            </p>
            
            {/* 社交媒体真实链接接入 */}
            <div className="flex flex-wrap gap-3 pt-2">
              <a 
                href="https://www.facebook.com/profile.php?id=61571291020457" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center hover:bg-[#c5a47e] hover:text-black transition-all duration-300 group"
                aria-label="Visit our Facebook page"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a 
                href="https://www.instagram.com/adesmarthome/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center hover:bg-[#c5a47e] hover:text-black transition-all duration-300"
                aria-label="Visit our Instagram page"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a 
                href="https://www.tiktok.com/@adesmarthome" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center hover:bg-[#c5a47e] hover:text-black transition-all duration-300"
                aria-label="Visit our TikTok page"
              >
                {/* 使用 SVG 替代缺少的 TikTok 图标，保持风格一致 */}
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
              </a>
              <a 
                href="https://xhslink.com/m/6Bv1zW0ClyZ" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center hover:bg-[#c5a47e] hover:text-black transition-all duration-300 relative group"
                aria-label="Visit our Little Red Book (Xiaohongshu) page"
              >
                <Link2 className="w-4 h-4" />
                {/* 增加一个细致的 Tooltip 提示这是小红书 */}
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-zinc-800 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  Xiaohongshu
                </span>
              </a>
            </div>
          </div>

          {/* 核心服务区 */}
          <div>
            <h4 className="text-white font-bold tracking-wider text-sm uppercase mb-6 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#c5a47e]" />
              Our Services
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/products" className="hover:text-[#c5a47e] transition-colors flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-zinc-700 rounded-full group-hover:bg-[#c5a47e] transition-colors" />
                  Philips Smart Locks
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-[#c5a47e] transition-colors flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-zinc-700 rounded-full group-hover:bg-[#c5a47e] transition-colors" />
                  EZVIZ Security Systems
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-[#c5a47e] transition-colors flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-zinc-700 rounded-full group-hover:bg-[#c5a47e] transition-colors" />
                  Samsung Digital Locks
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#c5a47e] transition-colors flex items-center gap-2 group mt-4 font-semibold text-zinc-300">
                  <span className="w-1 h-1 bg-[#c5a47e] rounded-full" />
                  Book Professional Installation
                </Link>
              </li>
            </ul>
          </div>

          {/* 快速导航区 */}
          <div>
            <h4 className="text-white font-bold tracking-wider text-sm uppercase mb-6">
              Quick Links
            </h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/" className="hover:text-[#c5a47e] transition-colors">Home</Link></li>
              <li><Link href="/products" className="hover:text-[#c5a47e] transition-colors">All Products</Link></li>
              <li><Link href="/contact" className="hover:text-[#c5a47e] transition-colors">Contact & Support</Link></li>
            </ul>
          </div>

          {/* 联系方式区 */}
          <div>
            <h4 className="text-white font-bold tracking-wider text-sm uppercase mb-6">
              Contact Us
            </h4>
            <ul className="space-y-4 text-sm">
              <li>
                <a href="tel:0493343981" className="flex items-start gap-3 hover:text-[#c5a47e] transition-colors group">
                  <Phone className="w-5 h-5 text-zinc-500 group-hover:text-[#c5a47e] transition-colors mt-0.5" />
                  <div>
                    <div className="font-semibold text-zinc-300 group-hover:text-white transition-colors">Phone</div>
                    <div>0493343981</div>
                  </div>
                </a>
              </li>
              <li>
                <a href="mailto:smarthomeade@gmail.com" className="flex items-start gap-3 hover:text-[#c5a47e] transition-colors group">
                  <Mail className="w-5 h-5 text-zinc-500 group-hover:text-[#c5a47e] transition-colors mt-0.5" />
                  <div className="overflow-hidden">
                    <div className="font-semibold text-zinc-300 group-hover:text-white transition-colors">Email</div>
                    <div className="truncate">smarthomeade@gmail.com</div>
                  </div>
                </a>
              </li>
              <li className="flex items-start gap-3 text-zinc-400">
                <MapPin className="w-5 h-5 text-zinc-500 mt-0.5" />
                <div>
                  <div className="font-semibold text-zinc-300">Service Area</div>
                  <div>Adelaide, South Australia</div>
                </div>
              </li>
            </ul>
          </div>

        </div>

        <div className="mt-16 pt-8 border-t border-zinc-900 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-zinc-600">
          <p>© {currentYear} ADE Smart Home. All rights reserved.</p>
          <div className="flex gap-4">
            <span className="hover:text-zinc-400 transition-colors cursor-pointer">Privacy Policy</span>
            <span className="hover:text-zinc-400 transition-colors cursor-pointer">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
