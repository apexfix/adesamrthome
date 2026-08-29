import fs from "fs";
import path from "path";
import matter from "gray-matter";
import ReactMarkdown from "react-markdown";
import { Calendar, MapPin, ArrowLeft, ShieldCheck } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { siteUrl } from "@/lib/seoData";

type PostData = {
  title?: string;
  description?: string;
  date?: string;
  updated?: string;
  suburb?: string;
  category?: string;
  coverImage?: string;
};

function getPost(slug: string) {
  const filePath = path.join(process.cwd(), "content/posts", `${slug}.md`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const fileContent = fs.readFileSync(filePath, "utf8");
  const parsed = matter(fileContent);

  return { data: parsed.data as PostData, content: parsed.content };
}

function plainText(value: string) {
  return value
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/[#>*_`\[\]()\-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function generateStaticParams() {
  const postsDirectory = path.join(process.cwd(), "content/posts");

  if (!fs.existsSync(postsDirectory)) return [];

  return fs
    .readdirSync(postsDirectory)
    .filter((fileName) => fileName.endsWith(".md"))
    .map((fileName) => ({ slug: fileName.replace(/\.md$/, "") }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);

  if (!post) {
    return { title: "Article Not Found", robots: { index: false, follow: false } };
  }

  const url = `${siteUrl}/blog/${slug}`;
  const description = (
    post.data.description || plainText(post.content).slice(0, 155)
  ).slice(0, 160);
  const image = post.data.coverImage
    ? new URL(post.data.coverImage, siteUrl).toString()
    : `${siteUrl}/img/hero1.avif`;

  return {
    title: post.data.title || "Smart Lock Installation Guide",
    description,
    alternates: { canonical: url },
    openGraph: {
      title: post.data.title,
      description,
      url,
      siteName: "ADE Smart Home",
      images: [{ url: image, alt: post.data.title || "ADE Smart Home article" }],
      locale: "en_AU",
      type: "article",
      publishedTime: post.data.date,
      modifiedTime: post.data.updated || post.data.date,
    },
    twitter: {
      card: "summary_large_image",
      title: post.data.title,
      description,
      images: [image],
    },
  };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);

  if (!post) notFound();

  const { data, content } = post;
  const articleUrl = `${siteUrl}/blog/${slug}`;
  const description = data.description || plainText(content).slice(0, 155);
  const coverImage = data.coverImage
    ? new URL(data.coverImage, siteUrl).toString()
    : `${siteUrl}/img/hero1.avif`;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${articleUrl}#article`,
    headline: data.title,
    description,
    image: coverImage,
    datePublished: data.date,
    dateModified: data.updated || data.date,
    mainEntityOfPage: articleUrl,
    author: { "@type": "Organization", name: "ADE Smart Home", url: siteUrl },
    publisher: { "@id": `${siteUrl}/#business` },
    articleSection: data.category || "Smart Lock Installation",
    about: data.suburb ? `${data.suburb}, Adelaide` : "Adelaide",
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${siteUrl}/blog` },
      { "@type": "ListItem", position: 3, name: data.title, item: articleUrl },
    ],
  };

  return (
    <article className="min-h-screen bg-zinc-950 pt-32 pb-20 text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <div className="container mx-auto px-4 max-w-3xl">
        <Link href="/blog" className="inline-flex items-center text-zinc-500 hover:text-[#c5a47e] mb-12 transition-colors text-xs font-bold uppercase tracking-widest">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Stories
        </Link>
        
        <div className="flex items-center gap-4 text-[#c5a47e] text-xs mb-6 font-bold uppercase tracking-widest text-shadow-sm">
          <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {data.date}</span>
          <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {data.suburb}, Adelaide</span>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold mb-10 leading-[1.1] tracking-tight">
          {data.title}
        </h1>

        <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8 mb-12 flex items-start gap-4 shadow-2xl">
            <ShieldCheck className="w-6 h-6 text-[#c5a47e] mt-1 flex-shrink-0" />
            <div>
                <p className="text-white font-bold text-sm mb-1 uppercase tracking-widest">Verified ADE Installation</p>
                <p className="text-zinc-500 text-sm font-light leading-relaxed">This project was completed by the ADE team. All images represent actual field work in South Australia.</p>
            </div>
        </div>

        {/* 【核心修改】使用 ReactMarkdown 渲染内容 */}
        <div className="prose prose-invert prose-gold max-w-none">
          <ReactMarkdown 
            components={{
              // 让 Markdown 里的图片自动适配样式
              img: ({node, ...props}) => {
                void node;
                return <img {...props} className="rounded-3xl border border-zinc-800 my-10 shadow-2xl w-full" alt={props.alt || "Installation Photo"} />;
              },
              // 让标题更好看
              h2: ({node, ...props}) => {
                void node;
                return <h2 {...props} className="text-[#c5a47e] text-2xl font-bold mt-16 mb-6 uppercase tracking-tight" />;
              },
              // 让段落更有呼吸感
              p: ({node, ...props}) => {
                void node;
                return <p {...props} className="text-zinc-300 text-lg leading-relaxed font-light mb-8" />;
              }
            }}
          >
            {content}
          </ReactMarkdown>
        </div>

        <div className="mt-20 p-10 rounded-3xl bg-zinc-900 border border-zinc-800 text-center relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-[#c5a47e]" />
          <h3 className="text-2xl font-bold mb-4">Need a similar upgrade?</h3>
          <p className="text-zinc-500 mb-8 max-w-md mx-auto text-sm font-light">Contact Adelaide&apos;s smart lock specialists for a clean, reliable retrofit.</p>
          <Link href="/contact" className="inline-flex h-14 items-center justify-center rounded-full bg-[#c5a47e] px-10 text-sm font-bold text-black hover:shadow-[0_0_30px_rgba(197,164,126,0.4)] transition-all active:scale-95">
            Get a Free Quote
          </Link>
        </div>
      </div>
    </article>
  );
}
