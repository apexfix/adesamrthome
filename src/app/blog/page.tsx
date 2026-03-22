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

          {/* Achievement Badge (English) */}
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

            <div className="flex-1">
              <p className="text-zinc-300 text-sm font-light leading-relaxed">
                <span className="text-white font-bold">Experience Matters:</span> We have completed over <span className="text-[#c5a47e] font-bold">400+</span> smart lock installations in Adelaide, with the number growing daily. This portfolio is being updated with our extensive project history.
              </p>
              <div className="flex items-center gap-2 mt-2 text-[#c5a47e] text-[10px] font-bold uppercase tracking-widest">
                <TrendingUp className="w-3 h-3 animate-pulse" /> Growing Daily in Adelaide
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
                className="group relative bg-zinc-900/40 rounded-3xl overflow-hidden border border-zinc-800/50 hover:border-[#c5a47e]/30 transition-all duration-500 flex flex-col"
              >
                {/* 封面图容器：改为 contain 模式防止裁剪 */}
                <div className="aspect-[16/9] relative overflow-hidden bg-zinc-900/80 border-b border-zinc-800 flex items-center justify-center">
                  <Image 
                    src={post.coverImage || "https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=800"} 
                    alt={post.title || "Case Study"} 
                    fill 
                    className="object-contain p-6 transition-transform duration-700 group-hover:scale-105" 
                  />
                  <div className="absolute top-4 left-4 bg-[#c5a47e] text-black text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest z-10">
                    {post.category || "Installation"}
                  </div>
                </div>
                
                <div className="p-8 flex-1">
                  <div className="flex items-center gap-4 text-zinc-500 text-[10px] mb-4 font-bold uppercase tracking-widest">
                    <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {post.date}</span>
                    <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {post.suburb}</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 group-hover:text-[#c5a47e] transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <div className="pt-6 border-t border-zinc-800/50 mt-4 flex items-center text-[#c5a47e] text-sm font-bold">
                    View Project Details <ChevronRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 border border-dashed border-zinc-800 rounded-3xl">
            <p className="text-zinc-500">Our latest project stories are being prepared...</p>
          </div>
        )}
      </div>
    </div>
  );
}
