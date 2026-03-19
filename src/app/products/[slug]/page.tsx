import { getProduct } from "@/lib/api";
import { notFound } from "next/navigation";
import { ShieldCheck, Wrench, Phone, Mail } from "lucide-react";
import { ServiceFeatures } from "@/components/ServiceFeatures";
import { ProductGallery } from "@/components/ProductGallery";
import Link from "next/link";

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  let product = null;
  try {
    product = await getProduct(slug);
  } catch (error) {
    console.error("Failed to fetch product", error);
  }

  if (!product) {
    notFound();
  }

  // Helper to extract data safely
  const price = product.prices?.price ? (parseInt(product.prices.price) / 100).toFixed(2) : product.price;
  const currency = product.prices?.currency_code || "CNY";
  
  // Use product.images for gallery, fallback if empty
  const galleryImages = product.images && product.images.length > 0 
    ? product.images 
    : [{ src: "/placeholder.jpg", alt: product.name }];

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="container mx-auto px-4 md:px-6 py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start mb-20">
          {/* Product Image Section */}
          <div className="relative">
            <ProductGallery images={galleryImages} />
          </div>

          {/* Product Details Section */}
          <div className="space-y-8 pt-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-4">
                {product.name}
              </h1>
              <div className="flex items-center gap-4">
                 <span className="text-3xl font-bold text-slate-900">
                   {currency === "CNY" ? "¥" : currency} {price}
                 </span>
                 {product.on_sale && (
                   <span className="px-4 py-1.5 bg-black text-white rounded-full text-sm font-medium">
                     On Sale
                   </span>
                 )}
              </div>
            </div>

            {/* Short Description */}
            <div 
              className="prose prose-lg text-slate-600 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: product.short_description || "" }} 
            />

            {/* Attributes */}
            {product.attributes && product.attributes.length > 0 && (
              <div className="py-6 border-t border-slate-200">
                <h3 className="font-semibold mb-4 text-slate-900">Specifications</h3>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4 text-sm">
                  {product.attributes.map((attr: any) => (
                    <div key={attr.id} className="grid grid-cols-2">
                      <dt className="text-slate-500">{attr.name}</dt>
                      <dd className="font-medium text-slate-900">{attr.options.join(", ")}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            {/* Actions */}
            <div className="space-y-4 pt-6 border-t border-slate-200">
              <div className="flex items-center gap-2 text-green-600 font-medium mb-4">
                <div className="w-2 h-2 rounded-full bg-green-600 animate-pulse" />
                <span>In Stock & Ready to Install</span>
              </div>
              
              <div className="flex flex-col gap-4">
                <Link 
                  href="/contact"
                  className="w-full h-16 bg-black text-white hover:bg-gray-800 rounded-full font-bold text-lg flex items-center justify-center gap-3 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <Mail className="w-5 h-5" />
                  Contact Sales
                </Link>
                <Link 
                  href="/contact"
                  className="w-full h-16 bg-white text-black border-2 border-slate-200 hover:border-black rounded-full font-bold text-lg flex items-center justify-center gap-3 transition-all"
                >
                  <Phone className="w-5 h-5" />
                  Book Installation Service
                </Link>
              </div>
            </div>

            {/* Trust Signals */}
            <div className="grid grid-cols-2 gap-6 pt-8">
               <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-900 shrink-0">
                     <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">2 Year Warranty</h4>
                    <p className="text-xs text-slate-500 mt-1">Full coverage replacement</p>
                  </div>
               </div>
               <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-900 shrink-0">
                     <Wrench className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Professional Install</h4>
                    <p className="text-xs text-slate-500 mt-1">Expert team available</p>
                  </div>
               </div>
            </div>
          </div>
        </div>

        {/* Detailed Description Section */}
        {product.description && (
          <div className="bg-white rounded-[2rem] p-8 md:p-16 shadow-sm border border-slate-100 mb-20">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-slate-900">Product Details</h2>
            <div 
              className="prose prose-lg max-w-none text-slate-600 prose-headings:font-bold prose-headings:text-slate-900 prose-img:rounded-xl prose-img:shadow-md"
              dangerouslySetInnerHTML={{ __html: product.description }} 
            />
          </div>
        )}
      </div>
      
      {/* Service Features Footer */}
      <ServiceFeatures />
    </div>
  );
}
