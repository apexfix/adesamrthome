import { Wrench, ShieldCheck, Award } from "lucide-react";

export function ServiceFeatures() {
  return (
    // 使用深灰色背景，与 Hero 的纯黑和后续内容的白色形成层次感过渡
    <section className="bg-zinc-950 text-white py-24 relative overflow-hidden">
      
      {/* 增加一点背景光晕特效，提升高级科技感 */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-[#c5a47e]/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          
          {/* Feature 1: 安装服务 (强调无损和专业) */}
          <div className="group flex flex-col items-center text-center p-8 rounded-2xl transition-all duration-500 hover:bg-zinc-900 border border-transparent hover:border-zinc-800">
            <div className="w-20 h-20 flex items-center justify-center rounded-2xl mb-6 bg-zinc-900 transition-all duration-500 group-hover:bg-[#c5a47e] group-hover:shadow-[0_0_30px_rgba(197,164,126,0.3)]">
              <Wrench className="w-10 h-10 text-[#c5a47e] transition-colors duration-500 group-hover:text-black" strokeWidth={1.5} />
            </div>
            <h3 className="text-white font-bold tracking-wider text-base uppercase mb-4 transition-colors duration-300 group-hover:text-[#c5a47e]">
              Precision Installation
            </h3>
            <p className="text-zinc-400 text-sm leading-relaxed max-w-sm">
              Over 350+ flawless installations across Adelaide. We guarantee a neat, clean, and flushed finish without compromising your door's structural integrity.
            </p>
          </div>

          {/* Feature 2: 产品质量 (强调品牌和耐用) */}
          <div className="group flex flex-col items-center text-center p-8 rounded-2xl transition-all duration-500 hover:bg-zinc-900 border border-transparent hover:border-zinc-800">
            <div className="w-20 h-20 flex items-center justify-center rounded-2xl mb-6 bg-zinc-900 transition-all duration-500 group-hover:bg-[#c5a47e] group-hover:shadow-[0_0_30px_rgba(197,164,126,0.3)]">
              <ShieldCheck className="w-10 h-10 text-[#c5a47e] transition-colors duration-500 group-hover:text-black" strokeWidth={1.5} />
            </div>
            <h3 className="text-white font-bold tracking-wider text-base uppercase mb-4 transition-colors duration-300 group-hover:text-[#c5a47e]">
              Top-Tier Security
            </h3>
            <p className="text-zinc-400 text-sm leading-relaxed max-w-sm">
              We supply only the best: Philips, EZVIZ, and Samsung. Weather-resistant and built for modern homes to ensure your family's ultimate protection.
            </p>
          </div>

          {/* Feature 3: 售后保障 (强调质保和本地支持) */}
          <div className="group flex flex-col items-center text-center p-8 rounded-2xl transition-all duration-500 hover:bg-zinc-900 border border-transparent hover:border-zinc-800">
            <div className="w-20 h-20 flex items-center justify-center rounded-2xl mb-6 bg-zinc-900 transition-all duration-500 group-hover:bg-[#c5a47e] group-hover:shadow-[0_0_30px_rgba(197,164,126,0.3)]">
              <Award className="w-10 h-10 text-[#c5a47e] transition-colors duration-500 group-hover:text-black" strokeWidth={1.5} />
            </div>
            <h3 className="text-white font-bold tracking-wider text-base uppercase mb-4 transition-colors duration-300 group-hover:text-[#c5a47e]">
              Local 2-Year Warranty
            </h3>
            <p className="text-zinc-400 text-sm leading-relaxed max-w-sm">
              No overseas call centers. We provide a full 24-month replacement warranty and lifetime local technical support right here in Adelaide.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
