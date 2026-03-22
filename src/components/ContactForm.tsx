"use client";

import { useState, useEffect } from "react"; // 增加 useEffect
import { Mail, Phone, MapPin, Send, Clock, ShieldCheck, CheckCircle2 } from "lucide-react";

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // 修复建议：组件卸载时清理定时器，防止内存泄漏
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (submitted) {
      timer = setTimeout(() => setSubmitted(false), 5000);
    }
    return () => clearTimeout(timer);
  }, [submitted]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return; // 防止重复点击

    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      // 无论后端返回什么 JSON，只要 status 是 200 系列就执行成功逻辑
      if (response.ok) {
        setSubmitted(true);
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        // 如果后端返回了错误码（比如 500），至少我们能捕获它而不是崩溃
        const errorData = await response.json().catch(() => ({}));
        console.error('Server error:', errorData);
        alert("Server is busy. Please try again or call us directly.");
      }
    } catch (error) {
      // 捕获网络层面的错误
      console.error('Network error:', error);
      alert("Network error. Please check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <section className="bg-zinc-900 py-20 md:py-32 relative overflow-hidden">
      <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-[#c5a47e]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="flex flex-col items-center justify-center text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-white">
            Ready to <span className="text-[#c5a47e]">Upgrade?</span>
          </h2>
          <p className="text-zinc-400 max-w-2xl text-lg font-light">
            Expert advice and precision installation are just a message away.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 max-w-6xl mx-auto">
          {/* 左侧信息区保持不变... */}
          <div className="lg:col-span-2 space-y-6">
             {/* ... 你的联系信息代码 ... */}
             <div className="bg-black/50 p-8 rounded-3xl border border-zinc-800 h-full flex flex-col justify-center">
               <h3 className="text-2xl font-bold mb-8 text-white">Get in Touch</h3>
               <div className="space-y-8">
                 <div className="flex items-start gap-4 group">
                   <div className="w-12 h-12 rounded-2xl bg-zinc-900 flex items-center justify-center text-[#c5a47e] shrink-0 border border-zinc-800 transition-all group-hover:bg-[#c5a47e] group-hover:text-black shadow-lg">
                     <Phone className="w-5 h-5" />
                   </div>
                   <div>
                     <h4 className="font-bold text-zinc-200">Phone</h4>
                     <p className="text-zinc-400 mt-1 text-sm">0493343981</p>
                   </div>
                 </div>
                 <div className="flex items-start gap-4 group">
                   <div className="w-12 h-12 rounded-2xl bg-zinc-900 flex items-center justify-center text-[#c5a47e] shrink-0 border border-zinc-800 transition-all group-hover:bg-[#c5a47e] group-hover:text-black shadow-lg">
                     <Mail className="w-5 h-5" />
                   </div>
                   <div>
                     <h4 className="font-bold text-zinc-200">Email</h4>
                     <p className="text-zinc-400 mt-1 text-sm break-all">smarthomeade@gmail.com</p>
                   </div>
                 </div>
                 <div className="pt-6 border-t border-zinc-800 flex items-center gap-3">
                    <ShieldCheck className="w-5 h-5 text-[#c5a47e]" />
                    <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">Licensed & Insured in Adelaide</p>
                 </div>
               </div>
             </div>
          </div>

          {/* 右侧表单区 */}
          <div className="lg:col-span-3 relative">
            <div className="bg-white p-8 md:p-10 rounded-[2rem] shadow-2xl border border-slate-100 relative overflow-hidden h-full">
              
              {/* 【核心优化】：成功状态的覆盖层 */}
              {submitted && (
                <div className="absolute inset-0 z-50 bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center text-center p-8 animate-in fade-in duration-500">
                  <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-2">Message Received!</h3>
                  <p className="text-slate-500 max-w-xs">
                    Thanks for reaching out, John. Our team will get back to you within 2 hours.
                  </p>
                  <button 
                    onClick={() => setSubmitted(false)}
                    className="mt-8 text-[#c5a47e] text-xs font-bold uppercase tracking-widest hover:underline"
                  >
                    Send another message
                  </button>
                </div>
              )}

              <h3 className="text-2xl font-bold mb-2 text-slate-900 tracking-tight">Send a Message</h3>
              <p className="text-slate-500 mb-8 text-sm font-light">Response time: Usually under 2 hours.</p>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
                    <input
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full h-12 px-4 bg-slate-50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#c5a47e]/20 focus:border-[#c5a47e] transition-all outline-none text-slate-900"
                      placeholder="Your Name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Email</label>
                    <input
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full h-12 px-4 bg-slate-50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#c5a47e]/20 focus:border-[#c5a47e] transition-all outline-none text-slate-900"
                      placeholder="email@example.com"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Subject</label>
                  <input
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full h-12 px-4 bg-slate-50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#c5a47e]/20 focus:border-[#c5a47e] transition-all outline-none text-slate-900"
                    placeholder="e.g. Philips DDL720 Installation"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Message</label>
                  <textarea
                    name="message"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#c5a47e]/20 focus:border-[#c5a47e] transition-all outline-none text-slate-900 resize-none"
                    placeholder="Tell us about your door..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-14 bg-black text-white font-black uppercase tracking-[0.2em] text-xs rounded-xl hover:bg-[#c5a47e] hover:text-black transition-all duration-500 disabled:opacity-50 flex items-center justify-center gap-3 shadow-xl"
                >
                  {isSubmitting ? "Processing..." : <>Send Message <Send className="w-4 h-4" /></>}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
