"use client";

import Link from "next/link";
import Image from "next/image";
import { MapPin, ChevronRight } from "lucide-react";

interface Story {
  slug: string;
  title: string;
  coverImage: string;
  category: string;
  suburb: string;
}

export default function StoryCarousel({ stories }: { stories: Story[] }) {
  if (!stories.length) return null;

  return (
    <div className="relative group">
      {/* Horizontal Scroll Container */}
      <div className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory hide-scrollbar">
        {stories.map((story) => (
          <Link 
            key={story.slug}
            href={`/blog/${story.slug}`}
            className="min-w-[300px] md:min-w-[450px] aspect-[16/10] relative rounded-3xl overflow-hidden snap-start group/card border border-zinc-800/50"
          >
            {/* Image Layer */}
            <Image 
              src={story.coverImage} 
              alt={story.title}
              fill
              className="object-cover transition-transform duration-700 group-hover/card:scale-105"
            />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover/card:opacity-100 transition-opacity" />

            {/* Content Layer */}
            <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full">
              <div className="flex items-center gap-3 text-[#c5a47e] text-[10px] font-bold uppercase tracking-[0.2em] mb-3">
                <span className="bg-[#c5a47e] text-black px-2 py-0.5 rounded-sm">{story.category}</span>
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {story.suburb}</span>
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-white mb-4 line-clamp-1 group-hover/card:text-[#c5a47e] transition-colors">
                {story.title}
              </h3>
              <div className="flex items-center text-white/50 text-[10px] font-bold uppercase tracking-widest group-hover/card:text-white transition-colors">
                View Details <ChevronRight className="w-4 h-4 ml-1" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* CSS to hide scrollbar while keeping functionality */}
      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
