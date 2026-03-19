import { ContactForm } from "@/components/ContactForm";

export default function ContactPage() {
  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="pt-12 md:pt-20">
        <div className="container mx-auto px-4 md:px-6 text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-6">
            Get in Touch
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            We're here to help with all your smart lock needs. Whether you need installation, support, or product advice, reach out to us.
          </p>
        </div>
      </div>
      
      <ContactForm />
    </div>
  );
}
