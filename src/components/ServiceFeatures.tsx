import { Wrench, Home, ShieldCheck } from "lucide-react";

export function ServiceFeatures() {
  return (
    <section className="bg-[#1a1a1a] text-white py-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          
          {/* Feature 1 */}
          <div className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 flex items-center justify-center border-2 border-[#c5a47e] rounded-lg mb-2 text-[#c5a47e]">
              <Wrench className="w-8 h-8" strokeWidth={1.5} />
            </div>
            <h3 className="text-[#c5a47e] font-bold tracking-widest text-sm uppercase">
              Premium Smart Lock Solutions
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Backed by significant industry experience, our specialists deliver flawless lock installations designed for long-term reliability and peace of mind.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 flex items-center justify-center border-2 border-[#c5a47e] rounded-lg mb-2 text-[#c5a47e]">
              <Home className="w-8 h-8" strokeWidth={1.5} />
            </div>
            <h3 className="text-[#c5a47e] font-bold tracking-widest text-sm uppercase">
              Smart Lock Sales
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Designed for modern homes. Weather-resistant. Long-lasting. Professional installation available. 2-year replacement warranty.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 flex items-center justify-center border-2 border-[#c5a47e] rounded-lg mb-2 text-[#c5a47e]">
              <ShieldCheck className="w-8 h-8" strokeWidth={1.5} />
            </div>
            <h3 className="text-[#c5a47e] font-bold tracking-widest text-sm uppercase">
              Reliable After-Sales Support
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              All our smart locks come with a 2-year warranty. We provide lifetime technical support for all our customers.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
