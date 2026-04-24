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
    question: "How much does smart lock installation cost in Adelaide?",
    answer:
      "The installation cost depends on the lock type, door material, existing lock structure and whether extra cutting or modification is required. A simple installation is usually cheaper, while a full mortise smart lock or complex retrofit will cost more. Send us door photos for a more accurate quote.",
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
    <section className="bg-neutral-50 px-6 py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="mx-auto max-w-5xl">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-neutral-950 text-white">
            <HelpCircle className="h-6 w-6" />
          </div>

          <h2 className="text-3xl font-bold tracking-tight text-neutral-950 md:text-4xl">
            Smart Lock Installation FAQ
          </h2>

          <p className="mt-4 leading-7 text-neutral-600">
            Common questions about smart lock installation, door compatibility,
            imported smart locks, security screen doors and local Adelaide support.
          </p>
        </div>

        <div className="mt-10 divide-y divide-neutral-200 rounded-3xl bg-white shadow-sm ring-1 ring-neutral-200">
          {faqs.map((faq, index) => {
            const isOpen = activeIndex === index;

            return (
              <div key={faq.question}>
                <button
                  type="button"
                  onClick={() => setActiveIndex(isOpen ? null : index)}
                  className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left"
                >
                  <span className="text-base font-semibold text-neutral-950 md:text-lg">
                    {faq.question}
                  </span>

                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-neutral-950">
                    {isOpen ? (
                      <Minus className="h-4 w-4" />
                    ) : (
                      <Plus className="h-4 w-4" />
                    )}
                  </span>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6">
                    <p className="leading-7 text-neutral-700">{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-10 rounded-3xl bg-neutral-950 p-8 text-center text-white">
          <h3 className="text-2xl font-bold">
            Not sure if your door can fit a smart lock?
          </h3>
          <p className="mx-auto mt-4 max-w-2xl leading-7 text-neutral-200">
            Send us photos of your door, current lock and door frame. We will
            check the door type and recommend a suitable installation option.
          </p>

          <div className="mt-6">
            <Link
              href="/contact"
              className="inline-flex rounded-full bg-white px-6 py-3 font-semibold text-neutral-950 transition hover:bg-neutral-200"
            >
              Send Door Photos for Free Check
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
