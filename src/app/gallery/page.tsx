"use client";

import { useState } from "react";
import Image from "next/image";
import { MapPin } from "lucide-react";

const projects = [
  {
    id: 1,
    title: "Lockin S50M Pro Installation",
    suburb: "Adelaide",
    description: "Camera smart lock fitted neatly beside a pull handle on a modern entry door.",
    image: "/img/products/lockin-s50m-pro/real-install-01.jpg",
    category: "S50M Pro"
  },
  {
    id: 2,
    title: "Lockin V5 Max Installation",
    suburb: "Adelaide",
    description: "Face-recognition smart lock installed with an indoor screen for visitor viewing.",
    image: "/img/products/lockin-v5-max/real-install-02.jpg",
    category: "V5 Max"
  },
  {
    id: 3,
    title: "Lockin SV40 Installation",
    suburb: "Adelaide",
    description: "Slim finger-vein smart lock installed on a residential timber entry door.",
    image: "/img/products/lockin-sv40/real-install-03.jpg",
    category: "SV40"
  },
  {
    id: 4,
    title: "Lockin S6 Max Installation",
    suburb: "Adelaide",
    description: "Premium camera smart lock fitted to a narrow timber door stile after a compatibility check.",
    image: "/img/products/lockin-s6-max/real-install-04.jpg",
    category: "S6 Max"
  },
  {
    id: 5,
    title: "Lockin X9 Installation",
    suburb: "Adelaide",
    description: "Compact fingerprint and passcode smart lock installed on a modern front door.",
    image: "/img/products/lockin-x9/real-install-02.jpg",
    category: "X9"
  }
];

const categories = ["All", "S50M Pro", "V5 Max", "SV40", "S6 Max", "X9"];

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
            <p className="text-zinc-400 text-lg font-light leading-relaxed">Real smart lock installations completed across Adelaide.</p>
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
