"use client";

import { useState } from "react";
import Image from "next/image";
// ❌ 删掉 Header 和 Footer 的 import
import { MapPin, Camera } from "lucide-react";

const projects = [
  {
    id: 1,
    title: "Philips DDL720 Installation",
    suburb: "Mawson Lakes",
    description: "Professional installation with zero gap. Integrated video doorbell and face unlock.",
    image: "https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=800",
    category: "Philips"
  },
  {
    id: 2,
    title: "Samsung Biometric Setup",
    suburb: "Glenelg",
    description: "Replaced deadbolt with clean, modern finish. Enhanced security for coastal home.",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800",
    category: "Samsung"
  }
];

const categories = ["All", "Philips", "Samsung", "EZVIZ", "Other"];

export default function GalleryPage() {
  const [filter, setFilter] = useState("All");
  const filteredProjects = filter === "All" ? projects : projects.filter(p => p.category === filter);

  return (
    // 这里的 bg-zinc-950 确保背景颜色一致
    <div className="flex flex-col min-h-screen bg-zinc-950">
      {/* ❌ 删掉这里的 <Header /> */}
      
      <main className="flex-1 pt-32 pb-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mb-16">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">Our <span className="text-[#c5a47e]">Gallery</span></h1>
            <p className="text-zinc-400 text-lg font-light leading-relaxed">Adelaide's trusted smart lock specialists. Real photos, real results.</p>
          </div>
          
          <div className="flex flex-wrap gap-4 mb-12">
            {categories.map((cat) => (
              <button key={cat} onClick={() => setFilter(cat)} className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${filter === cat ? "bg-[#c5a47e] text-black shadow-lg" : "bg-zinc-900 text-zinc-500 hover:text-white"}`}>
                {cat}
              </button>
            ))}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <div key={project.id} className="group bg-zinc-900/40 rounded-3xl overflow-hidden border border-zinc-800/50 hover:border-[#c5a47e]/30 transition-all">
                <div className="aspect-[4/3] relative">
                  <Image src={project.image} alt={project.title} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                </div>
                <div className="p-8">
                  <div className="flex items-center gap-2 text-[#c5a47e] text-xs font-bold mb-3 uppercase tracking-widest"><MapPin className="w-3 h-3" /> {project.suburb}, SA</div>
                  <h3 className="text-xl font-bold text-white mb-4 group-hover:text-[#c5a47e]">{project.title}</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed font-light">{project.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* ❌ 删掉这里的 <Footer /> */}
    </div>
  );
}
