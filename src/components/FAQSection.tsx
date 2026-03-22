"use client";

import { useState } from "react";
import { Plus, Minus, HelpCircle } from "lucide-react";

const faqs = [
  {
    question: "Will a smart lock fit my existing door?",
    answer: "Most timber and aluminum doors in Adelaide are compatible. We specialize in retrofitting various door types, including those with security screens. We recommend sending us a photo of your current door for a free compatibility assessment before booking."
  },
  {
    question: "What happens if the smart lock battery dies?",
    answer: "Our premium locks, like the M2 Pro and EZVIZ series, feature low-battery alerts weeks in advance. If it completely dies, you can use a portable power bank via the emergency USB-C port to power it up, or use the provided physical backup mechanical keys."
  },
  {
    question: "Is the 3D Face Recognition secure at night?",
    answer: "Yes. The M2 Pro uses infrared structured light technology, which works perfectly in total darkness. It is 'financial-grade' security, meaning it cannot be fooled by photos or videos of your face."
  },
  {
    question: "How long does the professional installation take?",
    answer: "A standard professional installation typically takes between 1 to 2 hours. Our team ensures a 'Neat-Clean-Flushed' finish, meaning no messy wires or gaps, and we will provide a full tutorial on how to use the app before we leave."
  },
  {
    question: "What kind of warranty do you provide?",
    answer: "We offer a 24-month comprehensive warranty on both the hardware and our installation workmanship. If you encounter any technical issues, our local Adelaide support team is just a phone call away."
  },
  {
    question: "Can I manage access for multiple users or rentals?",
    answer: "Absolutely. Through the mobile app, you can add multiple family members, manage permissions, and even generate time-limited temporary PIN codes for guests, cleaners, or Airbnb tenants."
  }
];

export function FAQSection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <section className="bg-black py-24 border-t border-zinc-900">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto">
          
          <div className="text-center mb-16">
            <h2 className="text-[#c5a47e] font-bold uppercase tracking-[0.3em] text-[10px] mb-4">
              Common Inquiries
            </h2>
            <h3 className="text-4xl md:text-5xl font-black text-white tracking-tight">
              Frequently Asked <span className="text-[#c5a47e]">Questions</span>
            </h3>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index}
                className="group border border-zinc-800 rounded-[1.5rem] bg-zinc-900/30 overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                >
                  <span className={`text-lg font-bold transition-colors ${activeIndex === index ? "text-[#c5a47e]" : "text-white"}`}>
                    {faq.question}
                  </span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all ${
                    activeIndex === index 
                    ? "bg-[#c5a47e] border-[#c5a47e] text-black" 
                    : "border-zinc-700 text-zinc-500 group-hover:border-zinc-500"
                  }`}>
                    {activeIndex === index ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </div>
                </button>

                <div className={`transition-all duration-500 ease-in-out overflow-hidden ${
                  activeIndex === index ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                }`}>
                  <div className="p-6 pt-0 text-zinc-400 font-light leading-relaxed border-t border-zinc-800/50 mt-2">
                    {faq.answer}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 p-8 rounded-[2rem] bg-zinc-900/50 border border-zinc-800 border-dashed text-center">
            <p className="text-zinc-500 text-sm mb-4">Still have questions about your specific door?</p>
            <a 
              href="/contact" 
              className="text-[#c5a47e] font-bold uppercase tracking-widest text-xs hover:underline inline-flex items-center gap-2"
            >
              Contact Our Adelaide Experts <HelpCircle className="w-4 h-4" />
            </a>
          </div>

        </div>
      </div>
    </section>
  );
}
