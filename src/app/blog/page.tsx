import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Link from "next/link";
import Image from "next/image";
import { Calendar, MapPin, ChevronRight } from "lucide-react";

export default function BlogListPage() {
  const postsDirectory = path.join(process.cwd(), "content/posts");
  
  let posts: any[] = [];
  
  if (fs.existsSync(postsDirectory)) {
    const filenames = fs.readdirSync(postsDirectory);
    
    posts = filenames
      .filter((filename) => {
        // 【核心修复】保险 1：必须是以 .md 结尾的文件
        // 保险 2：排除掉文件夹，只读取真正的文件
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
          ...data,
        };
      })
      .sort((a, b) => (new Date(b.date as string).getTime() - new Date(a.date as string).getTime()));
  }

  return (
    <div className="min-h-screen bg-zinc-950 pt-32 pb-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Our <span className="text-[#c5a47e]">Stories</span>
          </h1>
          <p className="text-zinc-400 text-lg font-light">Real work, real results from across Adelaide.</p>
        </div>

        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {posts.map((post: any) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="group relative bg-zinc-900/40 rounded-3xl overflow-hidden border border-zinc-800/50 hover:border-[#c5a47e]/30 transition-all duration-500">
                <div className="aspect-[16/9] relative overflow-hidden">
                  <Image src={post.coverImage || "/img/placeholder.jpg"} alt={post.title} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                </div>
                <div className="p-8">
                  <div className="flex items-center gap-4 text-zinc-500 text-xs mb-4 uppercase tracking-widest">
                    <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {post.date}</span>
                    <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {post.suburb}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-[#c5a47e] transition-colors line-clamp-2">{post.title}</h3>
                  <div className="flex items-center text-[#c5a47e] text-sm font-bold">
                    View Case Study <ChevronRight className="w-4 h-4 ml-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-zinc-500 border border-dashed border-zinc-800 rounded-3xl">
            <p>Our latest installation stories are being prepared...</p>
          </div>
        )}
      </div>
    </div>
  );
}
