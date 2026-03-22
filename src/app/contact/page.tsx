import { ContactForm } from "@/components/ContactForm";
import { ShieldCheck, Mail, Phone, Clock } from "lucide-react";

export default function ContactPage() {
  return (
    // 1. 全局背景统一为 zinc-950
    <div className="min-h-screen bg-zinc-950 text-white pt-32">
      
      {/* 2. 精简后的 Hero 头部：去除白底，直接进入暗色模式 */}
      <div className="container mx-auto px-4 md:px-6 mb-16 md:mb-24 relative">
        {/* 背景光晕装饰 */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-[#c5a47e]/10 blur-[120px] rounded-full pointer-events-none -z-10" />

        <div className="max-w-4xl">
          <p className="text-[#c5a47e] font-bold uppercase tracking-[0.4em] text-[10px] mb-6 animate-in fade-in slide-in-from-bottom-2 duration-700">
            Adelaide's Smart Security Experts
          </p>
          <h1 className="text-5xl md:text-7xl font-black mb-8 leading-tight tracking-tight animate-in fade-in slide-in-from-bottom-4 duration-1000">
            Let's Secure <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#c5a47e] via-[#e8d0a9] to-[#c5a47e]">Your Home.</span>
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
              <h4 className="font-bold text-lg">Licensed & Professional</h4>
              <p className="text-zinc-500 text-sm leading-relaxed">Full public liability insurance and specialized tools for every smart lock installation in South Australia.</p>
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
