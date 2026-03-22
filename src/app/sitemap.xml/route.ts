import { getProducts } from "@/lib/api";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

// 强制此路由为动态渲染，确保数据最新
export const dynamic = 'force-dynamic';

export async function GET() {
  const baseUrl = "https://www.adesmarthome.com.au";

  // 1. 获取产品数据
  let productXml = "";
  try {
    const products = await getProducts(1, 100);
    productXml = products
      .map((p: any) => `
  <url>
    <loc>${baseUrl}/products/${p.slug || p.id}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`).join("");
  } catch (e) {
    console.error("Sitemap API Error:", e);
  }

  // 2. 获取案例数据 (Markdown)
  let storyXml = "";
  const postsDir = path.join(process.cwd(), "content/posts");
  if (fs.existsSync(postsDir)) {
    const files = fs.readdirSync(postsDir);
    storyXml = files
      .filter((fn) => fn.endsWith(".md"))
      .map((fn) => {
        const fileContent = fs.readFileSync(path.join(postsDir, fn), "utf8");
        const { data } = matter(fileContent);
        return `
  <url>
    <loc>${baseUrl}/blog/${fn.replace(".md", "")}</loc>
    <lastmod>${new Date(data.date || new Date()).toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`;
      }).join("");
  }

  // 3. 组合最终的 XML
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/products</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/blog</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${baseUrl}/contact</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  ${productXml}
  ${storyXml}
</urlset>`;

  // 4. 返回响应，并强制设置 Content-Type 为 XML
  return new Response(sitemap, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=86400, stale-while-revalidate",
    },
  });
}
