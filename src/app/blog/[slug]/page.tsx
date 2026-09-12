import fs from "fs";
import path from "path";
import matter from "gray-matter";
import ReactMarkdown from "react-markdown";
import { Calendar, MapPin, ChevronRight, BookOpen, ShieldCheck, UserRound } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { siteUrl } from "@/lib/seoData";

type PostData = {
  title?: string;
  seoTitle?: string;
  description?: string;
  date?: string;
  updated?: string;
  suburb?: string;
  category?: string;
  coverImage?: string;
  contentType?: "guide" | "project";
  author?: string;
};

type PostSummary = PostData & {
  slug: string;
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

function getAllPosts(): PostSummary[] {
  const postsDirectory = path.join(process.cwd(), "content/posts");
  if (!fs.existsSync(postsDirectory)) return [];

  return fs
    .readdirSync(postsDirectory)
    .filter((fileName) => fileName.endsWith(".md"))
    .map((fileName) => {
      const fileContent = fs.readFileSync(path.join(postsDirectory, fileName), "utf8");
      const { data } = matter(fileContent);
      return {
        slug: fileName.replace(/\.md$/, ""),
        ...(data as PostData),
      };
    })
    .sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime());
}

function plainText(value: string) {
  return value
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/[#>*_`\[\]()\-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
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
    : `${siteUrl}/img/og/ade-smart-home-adelaide.jpg`;

  return {
    title: post.data.seoTitle || post.data.title || "Smart Lock Installation Guide",
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
    : `${siteUrl}/img/og/ade-smart-home-adelaide.jpg`;
  const isGuide = data.contentType === "guide" || data.category === "Buyer Guide";
  const isCameraGuide = data.category === "CCTV Guide";
  const isDoorGuide = slug === "smart-lock-door-compatibility-check";
  const location = data.suburb && !data.suburb.toLowerCase().includes("adelaide")
    ? `${data.suburb}, Adelaide` : data.suburb || "Adelaide";
  const author = data.author || "ADE Smart Home Installation Team";
  const allPosts = getAllPosts();
  const relatedPosts = allPosts.filter(item => item.slug !== slug).sort((a, b) =>
    Number(b.category === data.category) - Number(a.category === data.category),
  ).slice(0, 3);

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
    author: { "@type": "Organization", name: author, url: siteUrl },
    publisher: { "@id": `${siteUrl}/#business` },
    articleSection: data.category || "Smart Lock Installation",
    about: isCameraGuide ? "Security camera equipment in Adelaide" : "Smart locks and installation in Adelaide",
    inLanguage: "en-AU",
    spatialCoverage: { "@type": "Place", name: location },
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
    <main className="min-h-screen bg-zinc-950 pt-32 pb-20 text-white">
      <article>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
      <div className="container mx-auto max-w-3xl px-5 md:px-8">
        <nav aria-label="Breadcrumb" className="mb-8 flex flex-wrap items-center gap-2 text-sm text-zinc-400">
          <Link href="/" className="inline-flex min-h-11 items-center hover:text-white">Home</Link>
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
          <Link href="/blog" className="inline-flex min-h-11 items-center hover:text-white">Guides &amp; projects</Link>
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
          <span aria-current="page" className="text-[#d9b98f]">{data.category || "Installation"}</span>
        </nav>
        
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[#c5a47e] text-xs mb-6 font-bold uppercase tracking-widest text-shadow-sm">
          {data.date && <span className="flex items-center gap-1"><Calendar className="w-4 h-4" aria-hidden="true" /> Published <time dateTime={data.date}>{data.date}</time></span>}
          {data.updated && data.updated !== data.date && (
            <span>Updated <time dateTime={data.updated}>{data.updated}</time></span>
          )}
          <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {location}</span>
          <span className="flex items-center gap-1"><UserRound className="w-4 h-4" /> {author}</span>
        </div>

        <h1 className="text-3xl md:text-5xl font-bold mb-8 leading-[1.15]">
          {data.title}
        </h1>

        <div className="mb-10 flex items-start gap-4 border-y border-zinc-800 py-6">
          {isGuide ? <BookOpen className="mt-1 h-6 w-6 shrink-0 text-[#c5a47e]" aria-hidden="true" /> : <ShieldCheck className="mt-1 h-6 w-6 shrink-0 text-[#c5a47e]" aria-hidden="true" />}
          <div>
            <p className="text-white font-bold text-sm mb-1 uppercase tracking-widest">
              {isCameraGuide ? "CCTV Equipment Guide" : isDoorGuide ? "Door Compatibility Guide" : isGuide ? "Smart Lock Buying Guide" : "ADE Installation Project"}
            </p>
            <p className="text-zinc-400 text-base leading-7">
              {isCameraGuide
                ? "Plan your camera views, cabling and recording needs. Final equipment suitability depends on the property layout and the complete system configuration."
                : isDoorGuide
                ? "Use this guide to prepare useful photos and measurements. Final suitability depends on the exact lock model, door, frame and site conditions."
                : isGuide
                ? "Compare access features, installed prices and door requirements before choosing your smart lock."
                : "This project was completed by the ADE team. All images represent actual field work in South Australia."}
            </p>
          </div>
        </div>

        {/* 【核心修改】使用 ReactMarkdown 渲染内容 */}
        <div className="article-content">
          <ReactMarkdown 
            components={{
              // 让 Markdown 里的图片自动适配样式
              img: ({node, ...props}) => {
                void node;
                if (typeof props.src !== "string") return null;
                return (
                  <Image
                    src={props.src}
                    alt={props.alt || "ADE Smart Home installation in Adelaide"}
                    width={1400}
                    height={900}
                    sizes="(max-width: 767px) calc(100vw - 40px), 704px"
                    className="my-10 h-auto w-full rounded-md border border-zinc-800"
                  />
                );
              }
            }}
          >
            {content}
          </ReactMarkdown>
        </div>

        {relatedPosts.length > 0 && (
          <section className="mt-20 border-t border-zinc-800 pt-14" aria-labelledby="continue-reading">
            <div className="flex items-end justify-between gap-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#c5a47e]">More from ADE</p>
                <h2 id="continue-reading" className="mt-3 text-2xl font-bold text-white md:text-3xl">
                  Continue reading
                </h2>
              </div>
              <Link href="/blog" className="hidden text-sm font-bold text-zinc-400 hover:text-[#c5a47e] sm:inline-flex">
                View all stories
              </Link>
            </div>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.slug}
                  href={`/blog/${relatedPost.slug}`}
                  className="group overflow-hidden rounded-md border border-zinc-800 bg-zinc-900/50 transition-colors hover:border-[#c5a47e]/60"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-zinc-900">
                    <Image
                      src={relatedPost.coverImage || "/img/og/ade-smart-home-adelaide.jpg"}
                      alt={relatedPost.title || "ADE Smart Home Adelaide installation story"}
                      fill
                      sizes="(max-width: 767px) 100vw, 260px"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-5">
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#c5a47e]">
                      {relatedPost.category || "Smart Lock Guide"}
                    </p>
                    <h3 className="mt-2 line-clamp-3 text-base font-bold leading-6 text-white group-hover:text-[#c5a47e]">
                      {relatedPost.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        <div className="mt-14 border-t border-zinc-700 py-10 text-center">
          <h3 className="text-2xl font-bold mb-4">
            {isCameraGuide ? "Planning your camera setup?" : isGuide ? "Ready for a door check?" : "Need a similar upgrade?"}
          </h3>
          <p className="text-zinc-400 mb-7 max-w-lg mx-auto text-base leading-7">
            {isCameraGuide
              ? "Send your suburb, property layout and the areas you want to monitor. We will reply by SMS or email with the next step."
              : isGuide
              ? "Send your suburb, preferred timing and four clear door photos. We will reply by SMS or email with the next step."
              : "Contact Adelaide's smart lock specialists for a clean, reliable retrofit."}
          </p>
          <Link href={isCameraGuide ? "/contact?service=security-camera-kit#quote" : "/contact#quote"} className="inline-flex min-h-14 items-center justify-center rounded-sm bg-[#c5a47e] px-6 py-3 text-sm font-bold text-black transition-colors hover:bg-[#e8d0a9]">
            {isCameraGuide ? "Enquire About Camera Kits" : isGuide ? "Send Door Photos" : "Get a Free Quote"}
          </Link>
        </div>
      </div>
      </article>
    </main>
  );
}
