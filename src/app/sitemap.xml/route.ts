import { getProducts } from "@/lib/api";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { serviceAreas, siteUrl } from "@/lib/seoData";

export const dynamic = "force-dynamic";

function xmlUrl(
  loc: string,
  lastmod: string,
  changefreq: "daily" | "weekly" | "monthly" | "yearly",
  priority: string
) {
  return `
  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

export async function GET() {
  const now = new Date().toISOString();

  const staticPages = [
    xmlUrl(`${siteUrl}/`, now, "weekly", "1.0"),
    xmlUrl(`${siteUrl}/products`, now, "weekly", "0.9"),
    xmlUrl(`${siteUrl}/blog`, now, "weekly", "0.8"),
    xmlUrl(`${siteUrl}/gallery`, now, "monthly", "0.7"),
    xmlUrl(`${siteUrl}/contact`, now, "monthly", "0.8"),
    xmlUrl(`${siteUrl}/zh`, now, "weekly", "0.9"),
  ].join("");

  const suburbPages = serviceAreas
    .map((area) =>
      xmlUrl(
        `${siteUrl}/smart-lock-installation/${area.slug}`,
        now,
        "monthly",
        "0.85"
      )
    )
    .join("");

  let productPages = "";

  try {
    const products = await getProducts(1, 100);

    productPages = products
      .map((product: any) => {
        const slug = product.slug || product.id;
        return xmlUrl(`${siteUrl}/products/${slug}`, now, "monthly", "0.8");
      })
      .join("");
  } catch (error) {
    console.error("Sitemap product fetch error:", error);
  }

  let blogPages = "";
  const postsDirectory = path.join(process.cwd(), "content/posts");

  if (fs.existsSync(postsDirectory)) {
    const files = fs.readdirSync(postsDirectory);

    blogPages = files
      .filter((fileName) => fileName.endsWith(".md"))
      .map((fileName) => {
        const fileContent = fs.readFileSync(
          path.join(postsDirectory, fileName),
          "utf8"
        );

        const { data } = matter(fileContent);
        const slug = fileName.replace(".md", "");
        const lastmod = new Date(data.date || now).toISOString();

        return xmlUrl(`${siteUrl}/blog/${slug}`, lastmod, "monthly", "0.7");
      })
      .join("");
  }

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset 
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
>
${staticPages}
${suburbPages}
${productPages}
${blogPages}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=86400, stale-while-revalidate",
    },
  });
}
