import Link from "next/link";
import { MapPin, ChevronRight } from "lucide-react";
import { GalleryImage } from "@/components/GalleryImage";
import { StoryRail } from "@/components/StoryRail";

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
    <StoryRail key={stories.map(story => story.slug).join("|")} count={stories.length}>
        {stories.map((story) => (
          <Link 
            key={story.slug}
            href={`/blog/${story.slug}`}
            prefetch={false}
            className="story-card gallery-snap-item liquid-glass-soft motion-card group/card relative flex min-w-0 flex-col overflow-hidden rounded-md border"
          >
            <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden bg-zinc-900">
              <GalleryImage key={story.coverImage} photo={{ src: story.coverImage, alt: story.title }}
                sizes="(max-width: 640px) 88vw, 450px" className="object-contain" />
            </div>
            <div data-glass-highlight className="flex flex-1 flex-col p-5 md:p-6">
              <div className="mb-3 flex flex-wrap gap-x-4 gap-y-2 text-xs font-semibold text-[#c5a47e]">
                {story.category && <span className="break-words">{story.category}</span>}
                {story.suburb && <span className="flex min-w-0 items-center gap-1"><MapPin className="h-3 w-3 shrink-0" aria-hidden="true" /><span className="break-words">{story.suburb}</span></span>}
              </div>
              <h3 className="mb-5 break-words text-lg font-bold leading-7 text-white transition-colors group-hover/card:text-[#c5a47e] md:text-xl">
                {story.title}
              </h3>
              <div className="mt-auto flex items-center text-sm font-semibold text-[#d9b98f]">
                View Details <ChevronRight className="ml-1 h-4 w-4" aria-hidden="true" />
              </div>
            </div>
          </Link>
        ))}
    </StoryRail>
  );
}
