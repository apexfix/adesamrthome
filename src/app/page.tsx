"use client";

import { useState } from "react";
import Image from "next/image";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MapPin, CheckCircle2, Camera } from "lucide-react";

// 这里是你未来的作品数据中心，每次做完漂亮的活儿就往里加一条
const projects = [
  {
    id: 1,
    title: "Philips DDL720 Installation",
    suburb: "Mawson Lakes",
    description: "Full mortise replacement on a modern timber door. Achieved a perfect flush finish with zero gap.",
    image: "https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=800", // 替换为你真实的现场图
    category: "Philips"
  },
  {
    id: 2,
    title: "Samsung Push-Pull Upgrade",
    suburb: "Glenelg",
    description: "Replaced an old mechanical deadbolt with high-tech biometric security. Custom plate used for a clean look.",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800",
    category: "Samsung"
  },
  {
    id: 3,
    title: "EZVIZ DL05 Smart Setup",
    suburb: "Burnside",
    description: "Weather-resistant smart lock installation for a front gate entry. Integrated with home Wi-Fi.",
    image: "https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=800",
    category: "EZVIZ"
  },
  // ... 更多作品
];

const categories = ["All", "Philips", "Samsung", "EZVIZ", "Other"];

export default function GalleryPage() {
  const [filter, setFilter] = useState("All");

  const filteredProjects = filter === "All" 
    ? projects 
    : projects.filter(p => p.category === filter);

  return (
    <div className="flex flex-col min-h-screen bg-zinc-950">
      <Header />
      
      <main className="flex-1 pt-32 pb-20">
        <div className="container mx-auto px-4 md:px-6">
          
          {/* 页面头部 */}
          <div className="max-w-3xl mb-16">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Our <span className="text-[#c5a47e]">Craftsmanship</span>
            </h1>
            <p className="text-zinc-400 text-lg font-light leading-relaxed">
              Explore our portfolio of professional smart lock installations across Adelaide. 
              We take pride in every cut, every screw, and every seamless finish.
            </p>
          </div>

          {/* 分类筛选器 */}
          <div className="flex flex-wrap gap-4 mb-12">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
                  filter === cat 
                    ? "bg-[#c5a47e] text-black shadow-[0_0_20px_rgba(197,164,126,0.3)]" 
                    : "bg-zinc-900 text-zinc-500 hover:text-white border border-zinc-800"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* 作品网格 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <div 
                key={project.id} 
                className="group bg-zinc-900/40 rounded-3xl overflow-hidden border border-zinc-800/50 hover:border-[#c5a47e]/30 transition-all duration-500"
              >
                {/* 图片容器 */}
                <div className="aspect-[4/3] relative overflow-hidden">
                  <Image 
                    src={project.image} 
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-2 text-[10px] font-bold text-[#c5a47e] uppercase tracking-widest">
                    <Camera className="w-3 h-3" /> {project.category}
                  </div>
                </div>

                {/* 文字内容 */}
                <div className="p-8">
                  <div className="flex items-center gap-2 text-[#c5a47e] text-xs font-bold mb-3 uppercase tracking-tighter">
                    <MapPin className="w-3 h-3" /> {project.suburb}, Adelaide
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4 group-hover:text-[#c5a47e] transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-zinc-400 text-sm leading-relaxed font-light mb-6">
                    {project.description}
                  </p>
                  <div className="flex items-center gap-2 text-zinc-500 text-xs italic border-t border-zinc-800 pt-6">
                    <CheckCircle2 className="w-4 h-4 text-green-900" />
                    Verified ADE Installation
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 底部引导 */}
          <div className="mt-20 p-12 rounded-3xl bg-zinc-900 border border-zinc-800 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-[#c5a47e]" />
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Want a similar result for your home?</h2>
            <p className="text-zinc-400 mb-8 max-w-xl mx-auto font-light">
              Our specialists are ready to provide the same level of precision and care to your security upgrade.
            </p>
            <a 
              href="/contact" 
              className="inline-flex h-14 items-center justify-center rounded-full bg-[#c5a47e] px-10 text-sm font-bold text-black hover:shadow-[0_0_30px_rgba(197,164,126,0.4)] transition-all"
            >
              Get a Free Quote
            </a>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
