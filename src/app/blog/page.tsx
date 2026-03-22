import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Link from "next/link";
import Image from "next/image";
import { Calendar, MapPin, ChevronRight, TrendingUp, ShieldCheck } from "lucide-react";

interface Post {
  slug: string;
  title?: string;
  date?: string;
  description?: string;
  coverImage?: string;
  category?: string;
  suburb?: string;
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
        const dateA = new Date(a.date || 0).getTime();
        const dateB = new Date(b.date || 0).getTime();
        return dateB - dateA;
      });
  }

  return (
    <div className="min-h-screen bg-zinc-950 pt-32 pb-20">
      <div className="container mx-auto px-4 md:px-6 text-white">
        
        {/* Header Section */}
        <div className="max-w-4xl mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Installation <span className="text-[#c5a47e]">Stories</span>
          </h1>
          <p className="text-zinc-400 text-lg font-light leading-relaxed max-w-2xl">
            Real craftsmanship, real security upgrades. Explore our latest work across Adelaide.
          </p>

          {/* Achievement Badge (English Only) */}
          <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-4 p-6 rounded-3xl bg-zinc-900/50 border border-[#c5a47e]/20 backdrop-blur-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#c5a47e]/5 blur-3xl rounded-full" />
            
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#c5a47e] flex items-center justify-center shadow-[0_0_20px_rgba(197,164,126,0.3)]">
                <ShieldCheck className="w-6 h-6 text-black" />
              </div>
              <div>
                <p className="text-2xl font-black text-[#c5a47e] tracking-tighter">400+</p>
                <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Successful Installs</p>
              </div>
            </div>

            <div className="h-px sm:h-10 w-full sm:w-px bg-zinc-800" />

            <div className
