"use client";

import { useState } from "react";
import Link from "next/link";
import { HelpCircle, Minus, Plus } from "lucide-react";

const faqs = [
  {
    question: "Will a smart lock fit my existing door?",
    answer:
      "Most timber and aluminium doors in Adelaide are compatible with smart locks, but the correct model depends on your door thickness, current lock position, door frame clearance and lock body structure. We recommend sending photos of your door for a free compatibility check before booking.",
  },
  {
    question: "Can you install a smart lock on an aluminium door?",
    answer:
      "Yes, many aluminium doors can support smart lock installation. However, aluminium doors usually require more careful checking because the frame, lock cavity and door thickness may limit which smart lock models can be installed.",
  },
  {
    question: "Can you install a smart lock with a security screen door?",
    answer:
      "In some cases, yes. It depends on the distance between the main door and the security screen door, the handle position and whether there is enough clearance for the smart lock body. Please send us photos first so we can check it properly.",
  },
  {
    question: "Do I need a locksmith or a smart lock installer?",
    answer:
      "For normal lock replacement, a locksmith may be enough. For smart locks, you need someone who understands both door hardware and smart lock setup. ADE Smart Home focuses on smart lock installation, app setup, user management and clean flush-finish workmanship.",
  },
  {
    question: "Can you replace my old digital lock?",
    answer:
      "Yes. We can replace many old digital locks with newer fingerprint, keypad, video or app-controlled smart locks. The replacement depends on the old cut-out size and whether the new lock can cover or fit the existing holes.",
  },
  {
    question: "Can I use a smart lock for Airbnb or rental property?",
    answer:
      "Yes. Many smart locks allow temporary passcodes, scheduled access and app-based user management. This can be useful for Airbnb hosts, rental properties, cleaners and family access. We can help set up the basic user access after installation.",
  },
  {
    question: "Which smart lock is best for Adelaide weather?",
    answer:
      "The best option depends on whether the lock is fully exposed to rain, sun and wind. For external doors, we recommend choosing a model with suitable weather resistance and stable local support. We can recommend options after checking your door and installation location.",
  },
  {
    question: "Can you install imported Chinese smart locks in Adelaide?",
    answer:
      "Yes, we install many imported smart locks. However, imported locks often require more careful fitting because the lock body, mortise size, language settings and app compatibility may differ from standard Australian lock setups.",
  },
  {
    question: "Can you install a smart lock that I bought elsewhere?",
    answer:
      "Yes, we offer installation-only service for suitable customer-supplied smart locks. Send us the exact model, photos of the lock and photos of both sides and the edge of your door. We will check compatibility and quote the installation scope before booking.",
  },
  {
    question: "How much does smart lock installation cost in Adelaide?",
    answer:
      "For a compatible customer-supplied lock, standard installation is $200 for a compact smart lock or small lock body and $350 for a full-size smart lock using a standard 6068 mortise. Extra parts, repairs, unusual door preparation or non-standard work are quoted before booking. Supplied-and-installed lock packages start from $699.",
  },
  {
    question: "What happens if the smart lock battery dies?",
    answer:
      "Most smart locks provide low-battery alerts before the battery runs out. Many models also support emergency power through USB-C or micro-USB and include backup mechanical keys. We will explain the emergency access method after installation.",
  },
  {
    question: "How long does a professional smart lock installation take?",
    answer:
      "A standard smart lock installation usually takes around 1 to 2 hours. More complex installations, imported locks, mortise lock conversions or doors requiring extra modification may take longer.",
  },
  {
    question: "What warranty do you provide?",
    answer:
      "We provide local Adelaide after-sales support and warranty support depending on the product and installation package. For supplied products, we offer local support and help with troubleshooting, app setup and installation-related issues.",
  },
];

export function FAQSection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <section id="faq" className="scroll-mt-20 border-y border-zinc-900 bg-black py-20 text-white md:py-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="container mx-auto max-w-[1500px] px-5 md:px-8 xl:px-10">
        <div className="max-w-3xl">
          <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-[#c5a47e]">
            <HelpCircle className="h-5 w-5" aria-hidden="true" />
            Before you book
          </p>
          <h2 className="mt-3 text-3xl font-bold md:text-5xl">
            Smart Lock Installation FAQ
          </h2>

          <p className="mt-5 text-base leading-7 text-zinc-400 md:text-lg">
            Common questions about smart lock installation, door compatibility,
            imported smart locks, security screen doors and local Adelaide support.
          </p>
        </div>

        <div className="mt-10 divide-y divide-zinc-800 border-y border-zinc-800">
          {faqs.map((faq, index) => {
            const isOpen = activeIndex === index;

            return (
              <div
                key={faq.question}
                className={isOpen ? "bg-white/[0.035]" : "transition-colors hover:bg-white/[0.02]"}
              >
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${index}`}
                  onClick={() => setActiveIndex(isOpen ? null : index)}
                  className="flex w-full items-center justify-between gap-6 py-6 text-left"
                >
                  <span className="text-base font-semibold text-white md:text-lg">
                    {faq.question}
                  </span>

                  <span className="glass-control flex h-9 w-9 shrink-0 items-center justify-center rounded-md border text-[#d9b98f]" aria-hidden="true">
                    {isOpen ? (
                      <Minus className="h-4 w-4" />
                    ) : (
                      <Plus className="h-4 w-4" />
                    )}
                  </span>
                </button>

                  <div id={`faq-answer-${index}`} hidden={!isOpen} className="max-w-4xl pb-6 pr-12">
                    <p className="leading-7 text-zinc-400">{faq.answer}</p>
                  </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 grid gap-7 border-l-2 border-[#c5a47e] pl-6 md:grid-cols-[1fr_auto] md:items-center md:pl-8">
          <div>
            <h3 className="text-2xl font-bold">Not sure if your door can fit a smart lock?</h3>
            <p className="mt-3 max-w-2xl leading-7 text-zinc-400">
              Send photos of your door, current lock and frame. We will check the door type
              and recommend a suitable installation option.
            </p>
          </div>
          <div>
            <Link
              href="/contact#quote"
              className="inline-flex min-h-12 items-center bg-[#c5a47e] px-6 font-bold text-black transition-colors hover:bg-white"
            >
              Send Door Photos for Free Check
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
