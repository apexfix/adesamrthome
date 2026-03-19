import { WORDPRESS_URL } from "./constants";

// Use Plain Permalinks format since /wp-json/ is not working
const STORE_API_BASE = "/?rest_route=/wc/store/v1";

export async function fetchStoreAPI(path: string, options: RequestInit = {}) {
  // Handle query parameters for Plain Permalinks
  // If path contains '?', we need to convert it to '&' because the base URL already has a '?'
  const [pathPart, queryPart] = path.split('?');
  
  let url = `${WORDPRESS_URL}${STORE_API_BASE}${pathPart}`;
  if (queryPart) {
    url += `&${queryPart}`;
  }

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
    },
    next: { revalidate: 60 }, // Revalidate every 60 seconds
    ...options,
  });

  if (!response.ok) {
    console.error("API Error:", response.status, response.statusText);
    throw new Error(`Failed to fetch from ${url}`);
  }

  return response.json();
}

export async function getProducts(page = 1, perPage = 20) {
  // Store API uses 'page' and 'per_page'
  return fetchStoreAPI(`/products?page=${page}&per_page=${perPage}`);
}

export async function getProduct(slug: string) {
  // Store API allows filtering by slug? 
  // /products?slug=abc
  const products = await fetchStoreAPI(`/products?slug=${slug}`);
  if (products && products.length > 0) {
    return products[0];
  }
  return null;
}

export async function getCategories() {
  return fetchStoreAPI("/products/categories");
}
