"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Camera, MapPin } from "lucide-react";
import { siteUrl } from "@/lib/seoData";

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
  const gallerySchema = {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    "@id": `${siteUrl}/gallery#gallery`,
    name: "Adelaide Smart Lock Installation Gallery",
    url: `${siteUrl}/gallery`,
    associatedMedia: projects.map((project) => ({
      "@type": "ImageObject",
      name: project.title,
      description: project.description,
      contentUrl: `${siteUrl}${project.image}`,
      representativeOfPage: project.id === 1,
    })),
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Installation Gallery", item: `${siteUrl}/gallery` },
    ],
  };

  return (
    // 这里的 bg-zinc-950 确保背景颜色一致
    <div className="flex flex-col min-h-screen bg-zinc-950">
      {/* ❌ 删掉这里的 <Header /> */}
      
      <main className="flex-1 pt-32 pb-20">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(gallerySchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
        <div className="container mx-auto max-w-[1500px] px-5 md:px-8 xl:px-10">
          <div className="mb-12 max-w-3xl border-b border-zinc-800 pb-12">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#c5a47e]">Real Adelaide work</p>
            <h1 className="mb-6 mt-3 text-4xl font-bold text-white md:text-6xl">Our <span className="text-[#c5a47e]">Gallery</span></h1>
            <p className="text-zinc-400 text-lg font-light leading-relaxed">Real smart lock installations completed across Adelaide.</p>
          </div>
          
          <div className="mb-12 flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button type="button" key={cat} onClick={() => setFilter(cat)} aria-pressed={filter === cat} className={`min-h-11 border px-5 text-sm font-bold transition-colors ${filter === cat ? "border-[#c5a47e] bg-[#c5a47e] text-black" : "liquid-glass-soft border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-white"}`}>
                {cat}
              </button>
            ))}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <article key={project.id} className="liquid-glass-soft group overflow-hidden rounded-md border transition-colors hover:border-[#c5a47e]/40">
                <div className="aspect-[4/3] relative">
                  <Image src={project.image} alt={project.title} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                </div>
                <div className="p-8">
                  <div className="flex items-center gap-2 text-[#c5a47e] text-xs font-bold mb-3 uppercase tracking-widest"><MapPin className="w-3 h-3" /> {project.suburb}, SA</div>
                  <h3 className="text-xl font-bold text-white mb-4 group-hover:text-[#c5a47e]">{project.title}</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed font-light">{project.description}</p>
                </div>
              </article>
            ))}
          </div>

          <section className="mt-16 grid gap-10 border-y border-zinc-800 py-12 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p className="text-xs font-bold uppercase text-[#c5a47e]">Real Adelaide work</p>
              <h2 className="mt-3 text-3xl font-black text-white">What These Installations Show</h2>
              <p className="mt-5 max-w-3xl leading-8 text-zinc-400">
                A smart lock must suit the door, existing hardware and available clearance. These completed Adelaide installations show different lock sizes and entry styles, but every new job still starts with its own compatibility check. A model that fits one timber or aluminium door may need different preparation on another.
              </p>
              <p className="mt-4 max-w-3xl leading-8 text-zinc-400">
                Send the outside, inside, door edge and frame before booking. We use those photos to recommend a supplied package or confirm whether a customer-purchased lock is likely to fit.
              </p>
            </div>
            <div className="flex flex-col justify-center gap-4">
              <Link href="/contact#quote" className="inline-flex min-h-14 items-center justify-center gap-3 bg-[#c5a47e] px-5 font-bold text-black hover:bg-white">
                <Camera className="h-5 w-5" aria-hidden="true" /> Send Door Photos
              </Link>
              <Link href="/blog/smart-lock-door-compatibility-check" className="inline-flex min-h-14 items-center justify-center gap-3 border border-zinc-700 px-5 font-bold text-white hover:border-[#c5a47e] hover:text-[#c5a47e]">
                View Compatibility Guide <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </section>
        </div>
      </main>

      {/* ❌ 删掉这里的 <Footer /> */}
    </div>
  );
}
