"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, Phone, Mail, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black text-white">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <div className="relative w-40 h-14">
              <Image 
                src="/img/logo.jpg" 
                alt="SmartLock Logo" 
                fill 
                className="object-contain object-left"
              />
            </div>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link href="/" className="transition-colors hover:text-white text-white/70">
              Home
            </Link>
            <Link href="/products" className="transition-colors hover:text-white text-white/70">
              Products
            </Link>
            <Link href="/contact" className="transition-colors hover:text-white text-white/70">
              Contact
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-6 text-sm text-white/80">
             <a href="tel:0493343981" className="flex items-center gap-2 hover:text-white transition-colors">
               <Phone className="h-4 w-4" />
               <span>0493343981</span>
             </a>
             <a href="mailto:smarthomeade@gmail.com" className="flex items-center gap-2 hover:text-white transition-colors">
               <Mail className="h-4 w-4" />
               <span>smarthomeade@gmail.com</span>
             </a>
          </div>
          <button 
            className="md:hidden p-2 hover:bg-white/10 hover:text-white rounded-full transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            <span className="sr-only">Toggle Menu</span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-black absolute w-full left-0 top-16 shadow-2xl animate-in slide-in-from-top-5 fade-in duration-200">
          <div className="container flex flex-col p-4 gap-4">
            <nav className="flex flex-col gap-4 text-sm font-medium">
              <Link 
                href="/" 
                className="p-2 hover:bg-white/10 rounded-md transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                href="/products" 
                className="p-2 hover:bg-white/10 rounded-md transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Products
              </Link>
              <Link 
                href="/contact" 
                className="p-2 hover:bg-white/10 rounded-md transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
            </nav>
            <div className="border-t border-white/10 pt-4 flex flex-col gap-4">
               <a href="tel:0493343981" className="flex items-center gap-2 text-white/80 hover:text-white p-2">
                 <Phone className="h-4 w-4" />
                 <span>0493343981</span>
               </a>
               <a href="mailto:smarthomeade@gmail.com" className="flex items-center gap-2 text-white/80 hover:text-white p-2">
                 <Mail className="h-4 w-4" />
                 <span>smarthomeade@gmail.com</span>
               </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
