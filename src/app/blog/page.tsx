import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Link from "next/link";
import Image from "next/image";
import { Calendar, MapPin, ChevronRight } from "lucide-react";

// 1. 【核心修复】定义文章的“形状”，告诉编译器每篇文章包含哪些字段
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
  
  // 2. 明确告诉编译器这是一个 Post 类型的数组
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
        
        // 3. 将解析出的数据强制转换为 Post 类型
        return {
          slug: filename.replace(".md", ""),
          ...(data as Omit<Post, 'slug'>),
        };
      })
      // 4. 现在可以安全地进行日期排序了
      .sort((a, b) => {
        const dateA = new Date(a.date || 0).getTime();
        const dateB = new Date(b.date || 0).getTime();
        return dateB - dateA;
      });
  }

  return (
    <div className="min-h-screen bg-zinc-950 pt-32 pb-20">
      <div className="container mx-auto px-4 md:px-6 text-white">
        
        <div className="max-w-3xl mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Installation <span className="text-[#c5a47e]">Stories</span>
          </h1>
          <p className="text-zinc-400 text-lg font-light leading-relaxed">
            Real craftsmanship, real security upgrades. Explore our latest work across Adelaide.
          </p>
        </div>

        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {posts.map((post) => (
              <Link 
                key={post.slug} 
                href={`/blog/${post.slug}`} 
                className="group relative bg-zinc-900/40 rounded-3xl overflow-hidden border border-zinc-800/50 hover:border-[#c5a47e]/30 transition-all duration-500 flex flex-col"
              >
                <div className="aspect-[16/9] relative overflow-hidden">
                  <Image 
                    src={post.coverImage || "https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=800"} 
                    alt={post.title || "Case Study"} 
                    fill 
                    className="object-cover transition-transform duration-700 group-hover:scale-105" 
                  />
                  <div className="absolute top-4 left-4 bg-[#c5a47e] text-black text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
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
          <div className="text-center py-24 border border-dashed border-zinc-900 rounded-3xl">
            <p className="text-zinc-500">More stories are coming soon...</p>
          </div>
        )}
      </div>
    </div>
  );
}
