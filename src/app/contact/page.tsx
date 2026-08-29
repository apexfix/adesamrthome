import { ContactForm } from "@/components/ContactForm";
import { ShieldCheck, Phone, Clock } from "lucide-react";
import type { Metadata } from "next";
import { businessInfo, siteUrl } from "@/lib/seoData";

export const metadata: Metadata = {
  title: "Contact Adelaide Smart Lock Installers",
  description:
    "Send door photos for a free smart lock compatibility check and installed quote in Adelaide. Call 0431 060 390 or email info@adesmarthome.com.au.",
  alternates: { canonical: `${siteUrl}/contact` },
  openGraph: {
    title: "Contact ADE Smart Home Adelaide",
    description:
      "Request a free door compatibility check and installed smart lock quote from our Adelaide team.",
    url: `${siteUrl}/contact`,
    siteName: "ADE Smart Home",
    images: [{ url: "/img/hero1.avif", width: 1200, height: 630 }],
    locale: "en_AU",
    type: "website",
  },
};

export default function ContactPage() {
  const contactSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "@id": `${siteUrl}/contact#contact`,
    url: `${siteUrl}/contact`,
    name: "Contact ADE Smart Home",
    mainEntity: {
      "@id": `${siteUrl}/#business`,
      telephone: businessInfo.phoneInternational,
      email: businessInfo.email,
    },
  };

  return (
    // 1. 全局背景统一为 zinc-950
    <div className="min-h-screen bg-zinc-950 text-white pt-32">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }}
      />
      
      {/* 2. 精简后的 Hero 头部：去除白底，直接进入暗色模式 */}
      <div className="container mx-auto px-4 md:px-6 mb-16 md:mb-24 relative">
        {/* 背景光晕装饰 */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-[#c5a47e]/10 blur-[120px] rounded-full pointer-events-none -z-10" />

        <div className="max-w-4xl">
          <p className="text-[#c5a47e] font-bold uppercase tracking-[0.4em] text-[10px] mb-6 animate-in fade-in slide-in-from-bottom-2 duration-700">
            Adelaide&apos;s Smart Security Experts
          </p>
          <h1 className="text-5xl md:text-7xl font-black mb-8 leading-tight tracking-tight animate-in fade-in slide-in-from-bottom-4 duration-1000">
            Let&apos;s Secure <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#c5a47e] via-[#e8d0a9] to-[#c5a47e]">Your Home.</span>
          </h1>
          <p className="text-zinc-400 text-lg md:text-xl font-light leading-relaxed max-w-2xl animate-in fade-in slide-in-from-bottom-6 duration-1000">
            Whether you need a custom quote for a complex retrofit or have a simple technical question, our Adelaide team is standing by to provide expert guidance.
          </p>
        </div>
      </div>

      {/* 3. 引入你的 ContactForm 组件：它自带 zinc-900 背景，能产生完美的层级感 */}
      <div className="border-t border-zinc-900">
        <ContactForm />
      </div>

      {/* 4. 底部信任背书区 */}
      <div className="py-20 bg-black border-t border-zinc-900/50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
            <div className="space-y-4">
              <ShieldCheck className="w-10 h-10 text-[#c5a47e] mx-auto md:mx-0" />
              <h4 className="font-bold text-lg">Professional Installation</h4>
              <p className="text-zinc-500 text-sm leading-relaxed">Specialized tools, careful door preparation and clean finishing for smart lock installations across Adelaide.</p>
            </div>
            <div className="space-y-4">
              <Clock className="w-10 h-10 text-[#c5a47e] mx-auto md:mx-0" />
              <h4 className="font-bold text-lg">Fast Response</h4>
              <p className="text-zinc-500 text-sm leading-relaxed">We respect your time. Expect a response to your digital inquiries within 2 business hours.</p>
            </div>
            <div className="space-y-4">
              <Phone className="w-10 h-10 text-[#c5a47e] mx-auto md:mx-0" />
              <h4 className="font-bold text-lg">Local Support</h4>
              <p className="text-zinc-500 text-sm leading-relaxed">No offshore call centers. You deal directly with our expert installers based right here in Adelaide.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
