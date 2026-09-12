import { getProducts } from "@/lib/api";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { serviceAreas, siteLastModified, siteUrl } from "@/lib/seoData";

export const revalidate = 86400;

function escapeXml(value: string) {
  return value.replace(/[<>&'\"]/g, (character) => {
    const entities: Record<string, string> = {
      "<": "&lt;",
      ">": "&gt;",
      "&": "&amp;",
      "'": "&apos;",
      '"': "&quot;",
    };

    return entities[character];
  });
}

function toSiteImageUrl(value: string) {
  const url = new URL(value, siteUrl);
  return url.origin === new URL(siteUrl).origin ? url.toString() : null;
}

function xmlUrl(
  loc: string,
  lastmod: string,
  images: string[] = [],
  languages: { lang: string; href: string }[] = [],
) {
  const imageEntries = Array.from(
    new Set(images.map(toSiteImageUrl).filter((value): value is string => Boolean(value))),
  )
    .slice(0, 100)
    .map(
      (image) => `
    <image:image>
      <image:loc>${escapeXml(image)}</image:loc>
    </image:image>`,
    )
    .join("");
  const languageEntries = languages
    .map(
      ({ lang, href }) => `
    <xhtml:link rel="alternate" hreflang="${escapeXml(lang)}" href="${escapeXml(href)}" />`,
    )
    .join("");

  return `
  <url>
    <loc>${escapeXml(loc)}</loc>
    <lastmod>${escapeXml(lastmod)}</lastmod>
    ${languageEntries}${imageEntries}
  </url>`;
}

const homeLanguages = [
  { lang: "x-default", href: siteUrl },
  { lang: "en-AU", href: siteUrl },
  { lang: "zh-CN", href: `${siteUrl}/zh` },
];

const installationImages = {
  x9: "/img/products/lockin-x9/real-install-02.jpg",
  s6Max: "/img/products/lockin-s6-max/real-install-04.jpg",
  v5Max: "/img/products/lockin-v5-max/real-install-04.jpg",
  s50m: "/img/products/lockin-s50m-pro/real-install-01.jpg",
  sv40: "/img/products/lockin-sv40/real-install-03.jpg",
};

const productInstallationImages: Record<string, string[]> = {
  "smart-lock-installation-only-service": [
    installationImages.x9,
    installationImages.s50m,
    "/img/products/lockin-ola-slim/real-install-edge.jpg",
  ],
  "lockin-ola-slim-smart-lock": [
    "/img/products/lockin-ola-slim/real-install-gate.jpg",
    "/img/products/lockin-ola-slim/real-install-edge.jpg",
  ],
  "lockin-s50m-pro-smart-lock": Array.from(
    { length: 8 },
    (_, index) => `/img/products/lockin-s50m-pro/real-install-${String(index + 1).padStart(2, "0")}.jpg`,
  ),
  "lockin-v5-max-smart-lock": Array.from(
    { length: 6 },
    (_, index) => `/img/products/lockin-v5-max/real-install-${String(index + 1).padStart(2, "0")}.jpg`,
  ),
  "lockin-sv40-smart-lock": Array.from(
    { length: 6 },
    (_, index) => `/img/products/lockin-sv40/real-install-${String(index + 1).padStart(2, "0")}.jpg`,
  ),
  "lockin-s6-max-smart-lock": Array.from(
    { length: 4 },
    (_, index) => `/img/products/lockin-s6-max/real-install-${String(index + 1).padStart(2, "0")}.jpg`,
  ),
  "lockin-x9-smart-lock": Array.from(
    { length: 6 },
    (_, index) => `/img/products/lockin-x9/real-install-${String(index + 1).padStart(2, "0")}.jpg`,
  ),
};

export async function GET() {
  const staticPages = [
    xmlUrl(
      `${siteUrl}/`,
      siteLastModified,
      ["/img/hero1-optimized.avif", installationImages.x9, installationImages.s6Max, installationImages.v5Max],
      homeLanguages,
    ),
    xmlUrl(`${siteUrl}/products`, siteLastModified, [installationImages.x9, installationImages.s6Max, installationImages.v5Max]),
    xmlUrl(`${siteUrl}/products/security-camera-kits`, siteLastModified, ["/img/products/dahua-2-camera-kit/dahua-hdw2541emp-camera-product.jpg", "/img/products/dahua-2-camera-kit/dahua-nvr4104hs-p-4ks2-l.webp"]),
    xmlUrl(`${siteUrl}/about`, siteLastModified, [installationImages.v5Max]),
    xmlUrl(`${siteUrl}/brands`, siteLastModified),
    xmlUrl(`${siteUrl}/brands/lockin`, siteLastModified, [installationImages.x9, installationImages.s6Max, installationImages.v5Max]),
    xmlUrl(`${siteUrl}/brands/kaadas`, siteLastModified, ["/img/products/kaadas-k70-se/product/kaadas-k70-se-product-01.png"]),
    xmlUrl(`${siteUrl}/service-areas`, siteLastModified),
    xmlUrl(`${siteUrl}/smart-lock-supply-installation-adelaide`, siteLastModified, [installationImages.x9, installationImages.s6Max, installationImages.v5Max]),
    xmlUrl(`${siteUrl}/smart-lock-installation-only-adelaide`, siteLastModified, [installationImages.x9, "/img/products/lockin-ola-slim/real-install-edge.jpg"]),
    xmlUrl(`${siteUrl}/smart-lock-installation-adelaide`, siteLastModified, [installationImages.x9]),
    xmlUrl(`${siteUrl}/digital-door-lock-adelaide`, siteLastModified, [installationImages.v5Max]),
    xmlUrl(`${siteUrl}/smart-lock-installer-adelaide`, siteLastModified, ["/img/products/lockin-x9/real-install-03.jpg"]),
    xmlUrl(`${siteUrl}/airbnb-smart-lock-installation-adelaide`, siteLastModified, ["/img/products/lockin-x9/real-install-03.jpg"]),
    xmlUrl(`${siteUrl}/apartment-smart-lock-installation-adelaide`, siteLastModified, ["/img/products/lockin-x9/real-install-01.jpg"]),
    xmlUrl(`${siteUrl}/property-manager-smart-lock-installation-adelaide`, siteLastModified, [installationImages.s50m]),
    xmlUrl(`${siteUrl}/new-home-smart-lock-installation-adelaide`, siteLastModified, ["/img/products/lockin-v5-max/real-install-02.jpg"]),
    xmlUrl(`${siteUrl}/blog`, siteLastModified),
    xmlUrl(`${siteUrl}/gallery`, siteLastModified, Object.values(installationImages)),
    xmlUrl(`${siteUrl}/contact`, siteLastModified),
    xmlUrl(`${siteUrl}/privacy-policy`, siteLastModified),
    xmlUrl(`${siteUrl}/delivery-and-returns`, siteLastModified),
    xmlUrl(`${siteUrl}/zh`, siteLastModified, ["/img/hero1-optimized.avif", installationImages.x9], homeLanguages),
  ].join("");

  const suburbPages = serviceAreas
    .map((area, index) =>
      xmlUrl(
        `${siteUrl}/smart-lock-installation/${area.slug}`,
        siteLastModified,
        [Object.values(installationImages)[index % Object.values(installationImages).length]],
      )
    )
    .join("");

  let productPages = "";

  try {
    const products = await getProducts(1, 100);

    productPages = products
      .map((product) => {
        const slug = product.slug || product.id;
        const productImages = [
          ...(productInstallationImages[String(slug)] || []),
          ...(product.images || []).map((image) => image.src),
          ...(product.detail_images || []).map((image) => image.src),
        ];

        return xmlUrl(`${siteUrl}/products/${slug}`, siteLastModified, productImages);
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

        const { data, content } = matter(fileContent);
        const slug = fileName.replace(".md", "");
        const lastmod = new Date(
          data.updated || data.date || siteLastModified
        ).toISOString();
        const markdownImages = Array.from(
          content.matchAll(/!\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g),
          (match) => match[1],
        );

        return xmlUrl(
          `${siteUrl}/blog/${slug}`,
          lastmod,
          [data.coverImage, ...markdownImages].filter(Boolean),
        );
      })
      .join("");
  }

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
  xmlns:xhtml="http://www.w3.org/1999/xhtml"
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
