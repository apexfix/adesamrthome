import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { Calendar, MapPin, ArrowLeft, ShieldCheck } from "lucide-react";
import Link from "next/link";

// 注意这里：改成了 async function，并正确处理了 params
export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  const filePath = path.join(process.cwd(), "content/posts", `${slug}.md`);
  
  // 增加一个安全检查，防止文件不存在时报错
  if (!fs.existsSync(filePath)) {
    return <div className="min-h-screen bg-zinc-950 pt-32 text-white text-center">Post not found.</div>;
  }

  const fileContent = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(fileContent);

  return (
    <article className="min-h-screen bg-zinc-950 pt-32 pb-20 text-white">
      <div className="container mx-auto px-4 max-w-3xl">
        <Link href="/blog" className="inline-flex items-center text-zinc-500 hover:text-[#c5a47e] mb-12 transition-colors text-xs font-bold uppercase tracking-widest">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Stories
        </Link>
        
        <div className="flex items-center gap-4 text-[#c5a47e] text-xs mb-6 font-bold uppercase tracking-widest">
          <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {data.date}</span>
          <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {data.suburb}, Adelaide</span>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold mb-10 leading-[1.1]">
          {data.title}
        </h1>

        <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8 mb-12 flex items-start gap-4">
            <ShieldCheck className="w-6 h-6 text-[#c5a47e] mt-1 flex-shrink-0" />
            <div>
                <p className="text-white font-bold text-sm mb-1 uppercase tracking-widest">Verified ADE Installation</p>
                <p className="text-zinc-500 text-sm font-light leading-relaxed">This project was completed by the ADE team. All images represent actual field work in South Australia.</p>
            </div>
        </div>

        <div className="whitespace-pre-wrap text-zinc-300 text-lg leading-relaxed font-light mb-16">
          {content}
        </div>

        <div className="mt-20 p-10 rounded-3xl bg-zinc-900 border border-zinc-800 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-[#c5a47e]" />
          <h3 className="text-2xl font-bold mb-4">Need a similar installation?</h3>
          <p className="text-zinc-500 mb-8 max-w-md mx-auto text-sm font-light">Get in touch for a free site assessment and quote for your home.</p>
          <Link href="/contact" className="inline-flex h-14 items-center justify-center rounded-full bg-[#c5a47e] px-10 text-sm font-bold text-black hover:shadow-[0_0_30px_rgba(197,164,126,0.4)] transition-all">
            Get a Free Quote
          </Link>
        </div>
      </div>
    </article>
  );
}
