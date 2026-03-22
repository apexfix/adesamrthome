import { MetadataRoute } from 'next';
import { getProducts } from '@/lib/api';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.adesmarthome.com.au';

  // 1. 基础静态页面
  const staticRoutes = [
    '',
    '/products',
    '/blog',
    '/contact',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 1.0,
  }));

  // 2. 动态产品页面 (从 WooCommerce API 获取)
  let productRoutes: any[] = [];
  try {
    const products = await getProducts(1, 100);
    productRoutes = products.map((product: any) => ({
      url: `${baseUrl}/products/${product.slug || product.id}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }));
  } catch (error) {
    console.error('Sitemap: Failed to fetch products', error);
  }

  // 3. 动态安装案例页面 (从本地 Markdown 获取)
  const postsDirectory = path.join(process.cwd(), 'content/posts');
  let storyRoutes: any[] = [];
  
  if (fs.existsSync(postsDirectory)) {
    const filenames = fs.readdirSync(postsDirectory);
    storyRoutes = filenames
      .filter((fn) => fn.endsWith('.md'))
      .map((filename) => {
        const filePath = path.join(postsDirectory, filename);
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const { data } = matter(fileContent);
        return {
          url: `${baseUrl}/blog/${filename.replace('.md', '')}`,
          lastModified: new Date(data.date || new Date()),
          changeFrequency: 'monthly' as const,
          priority: 0.6,
        };
      });
  }

  return [...staticRoutes, ...productRoutes, ...storyRoutes];
}
