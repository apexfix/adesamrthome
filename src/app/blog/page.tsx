import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Link from "next/link";
import Image from "next/image";
import { Calendar, MapPin, ChevronRight, TrendingUp, ShieldCheck } from "lucide-react";
import type { Metadata } from "next";
import { siteUrl } from "@/lib/seoData";

export const metadata: Metadata = {
  title: "Smart Lock & CCTV Guides | Adelaide Projects",
  description:
    "Explore Adelaide smart lock projects, door compatibility advice and CCTV camera kit buying guides from ADE Smart Home.",
  alternates: { canonical: `${siteUrl}/blog` },
  openGraph: {
    title: "Adelaide Smart Lock & CCTV Guides",
    description:
      "Real Adelaide installations, smart lock advice and practical PoE camera kit guidance from ADE Smart Home.",
    url: `${siteUrl}/blog`,
    siteName: "ADE Smart Home",
    images: [{ url: "/img/og/ade-smart-home-adelaide.jpg", width: 1200, height: 630, alt: "ADE Smart Home Adelaide installation guides and projects" }],
    locale: "en_AU",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Smart Lock & CCTV Guides | Adelaide Projects",
    description:
      "Real Adelaide installations, smart lock advice and practical PoE camera kit guidance from ADE Smart Home.",
    images: ["/img/og/ade-smart-home-adelaide.jpg"],
  },
};

interface Post {
  slug: string;
  title?: string;
  date?: string;
  updated?: string;
  description?: string;
  coverImage?: string;
  category?: string;
  suburb?: string;
  pinned?: boolean;
  author?: string;
}

export default function BlogListPage() {
  const postsDirectory = path.join(process.cwd(), "content/posts");
  
  let posts: Post[] = [];
  
  if (fs.existsSync(postsDirectory)) {
    const filenames = fs.readdirSync(postsDirectory);
    
    posts = filenames
      .filter((filename) => {
        const filePath = path.join(postsDirectory, filename);
        const isFile = fs.statSync(filePath).isFile();
        return filename.endsWith(".md") && isFile;
      })
      .map((filename) => {
        const filePath = path.join(postsDirectory, filename);
        const fileContent = fs.readFileSync(filePath, "utf8");
        const { data } = matter(fileContent);
        return {
          slug: filename.replace(".md", ""),
          ...(data as Omit<Post, 'slug'>),
        };
      })
      .sort((a, b) => {
        if (a.pinned !== b.pinned) {
          return a.pinned ? -1 : 1;
        }
        const dateA = new Date(a.date || 0).getTime();
        const dateB = new Date(b.date || 0).getTime();
        return dateB - dateA;
      });
  }

  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": `${siteUrl}/blog#blog`,
    url: `${siteUrl}/blog`,
    name: "ADE Smart Home Installation Guides & Projects",
    publisher: { "@id": `${siteUrl}/#business` },
    blogPost: posts.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      url: `${siteUrl}/blog/${post.slug}`,
      datePublished: post.date,
      dateModified: post.updated || post.date,
      description: post.description,
      mainEntityOfPage: `${siteUrl}/blog/${post.slug}`,
      author: {
        "@type": "Organization",
        name: post.author || "ADE Smart Home Installation Team",
        url: siteUrl,
      },
      image: post.coverImage
        ? new URL(post.coverImage, siteUrl).toString()
        : undefined,
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${siteUrl}/blog` },
    ],
  };

  return (
    <main className="min-h-screen bg-zinc-950 pb-24 pt-28 md:pt-32">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <div className="container mx-auto max-w-[1500px] px-5 text-white md:px-8 xl:px-10">
        
        {/* Header Section */}
        <div className="mb-14 max-w-4xl border-b border-zinc-800 pb-12">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#c5a47e]">Advice and real work</p>
          <h1 className="mb-6 mt-3 text-4xl font-bold md:text-6xl">
            Smart Lock &amp; CCTV <span className="text-[#c5a47e]">Guides</span>
          </h1>
          <p className="max-w-2xl text-lg leading-relaxed text-zinc-400">
            Door compatibility advice, security camera kit buying guides and real project notes for Adelaide homes and businesses.
          </p>

          {/* Achievement Badge */}
          <div className="mt-8 flex flex-col items-start gap-5 border-l-2 border-[#c5a47e] pl-6 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-sm bg-[#c5a47e]">
                <ShieldCheck className="w-6 h-6 text-black" />
              </div>
              <div>
                <p className="text-2xl font-black text-[#c5a47e]">400+</p>
                <p className="text-xs font-bold uppercase tracking-[0.1em] text-zinc-500">Successful installs</p>
              </div>
            </div>

            <div className="h-px sm:h-10 w-full sm:w-px bg-zinc-800" />

            <div className="flex-1">
              <p className="text-sm leading-relaxed text-zinc-300">
                <span className="text-white font-bold">Experience Matters:</span> We have completed more than <span className="text-[#c5a47e] font-bold">400</span> smart lock installations in Adelaide, with the number growing daily. This portfolio is being updated with our extensive project history.
              </p>
              <div className="mt-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.1em] text-[#c5a47e]">
                <TrendingUp className="h-3.5 w-3.5" /> Growing daily in Adelaide
              </div>
            </div>
          </div>
        </div>

        {/* Stories Grid */}
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {posts.map((post) => (
              <Link 
                key={post.slug} 
                href={`/blog/${post.slug}`} 
                className="liquid-glass-soft group relative flex flex-col overflow-hidden rounded-md border transition-colors hover:border-[#c5a47e]/50"
              >
                {/* 封面图容器：恢复为 object-cover 模式 */}
                <div className="aspect-[16/9] relative overflow-hidden bg-zinc-900">
                  <Image 
                    src={post.coverImage || "https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=800"} 
                    alt={post.title || "Case Study"} 
                    fill 
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105" 
                  />
                  <div className="absolute left-4 top-4 z-10 bg-[#c5a47e] px-3 py-1.5 text-xs font-bold uppercase tracking-[0.1em] text-black">
                    {post.category || "Installation"}
                  </div>
                </div>
                
                <div className="p-8 flex-1">
                  <div className="mb-4 flex flex-wrap items-center gap-4 text-xs font-bold uppercase tracking-[0.1em] text-zinc-500">
                    <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {post.date}</span>
                    <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {post.suburb}</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 group-hover:text-[#c5a47e] transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <div className="pt-6 border-t border-zinc-800/50 mt-4 flex items-center text-[#c5a47e] text-sm font-bold">
                    {post.category === "Buyer Guide" ? "Read Guide" : "View Project Details"}
                    <ChevronRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-md border border-dashed border-zinc-800 py-24 text-center">
            <p className="text-zinc-500">Our latest project stories are being prepared...</p>
          </div>
        )}
      </div>
    </main>
  );
}
