import { getProducts } from "@/lib/api";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { serviceAreas, siteLastModified, siteUrl } from "@/lib/seoData";

export const revalidate = 86400;

function xmlUrl(loc: string, lastmod: string) {
  return `
  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
  </url>`;
}

export async function GET() {
  const staticPages = [
    xmlUrl(`${siteUrl}/`, siteLastModified),
    xmlUrl(`${siteUrl}/products`, siteLastModified),
    xmlUrl(`${siteUrl}/smart-lock-supply-installation-adelaide`, siteLastModified),
    xmlUrl(`${siteUrl}/smart-lock-installation-only-adelaide`, siteLastModified),
    xmlUrl(`${siteUrl}/smart-lock-installation-adelaide`, siteLastModified),
    xmlUrl(`${siteUrl}/digital-door-lock-adelaide`, siteLastModified),
    xmlUrl(`${siteUrl}/smart-lock-installer-adelaide`, siteLastModified),
    xmlUrl(`${siteUrl}/airbnb-smart-lock-installation-adelaide`, siteLastModified),
    xmlUrl(`${siteUrl}/apartment-smart-lock-installation-adelaide`, siteLastModified),
    xmlUrl(`${siteUrl}/property-manager-smart-lock-installation-adelaide`, siteLastModified),
    xmlUrl(`${siteUrl}/new-home-smart-lock-installation-adelaide`, siteLastModified),
    xmlUrl(`${siteUrl}/blog`, siteLastModified),
    xmlUrl(`${siteUrl}/gallery`, siteLastModified),
    xmlUrl(`${siteUrl}/contact`, siteLastModified),
    xmlUrl(`${siteUrl}/privacy-policy`, siteLastModified),
    xmlUrl(`${siteUrl}/delivery-and-returns`, siteLastModified),
    xmlUrl(`${siteUrl}/zh`, siteLastModified),
  ].join("");

  const suburbPages = serviceAreas
    .map((area) =>
      xmlUrl(`${siteUrl}/smart-lock-installation/${area.slug}`, siteLastModified)
    )
    .join("");

  let productPages = "";

  try {
    const products = await getProducts(1, 100);

    productPages = products
      .map((product) => {
        const slug = product.slug || product.id;
        return xmlUrl(`${siteUrl}/products/${slug}`, siteLastModified);
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
        const lastmod = new Date(
          data.updated || data.date || siteLastModified
        ).toISOString();

        return xmlUrl(`${siteUrl}/blog/${slug}`, lastmod);
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
