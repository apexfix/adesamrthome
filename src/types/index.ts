export interface ProductImage {
  id?: number;
  src: string;
  name?: string;
  alt: string;
}

export interface ProductTaxonomyItem {
  id?: number;
  name: string;
  slug: string;
}

export interface ProductAttributeTerm {
  name?: string;
  slug?: string;
}

export interface ProductAttribute {
  id?: number;
  name: string;
  options?: string[];
  terms?: ProductAttributeTerm[];
}

export interface ProductPrices {
  price: string;
  regular_price?: string;
  sale_price?: string;
  currency_code?: string;
  currency_symbol?: string;
  currency_minor_unit?: number;
}

export interface Product {
  id: number | string;
  name: string;
  slug: string;
  sku?: string;
  short_description?: string;
  description?: string;
  categories?: ProductTaxonomyItem[];
  tags?: ProductTaxonomyItem[];
  brands?: ProductTaxonomyItem[];
  prices?: ProductPrices;
  images?: ProductImage[];
  attributes?: ProductAttribute[];
}
