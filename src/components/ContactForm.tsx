"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Send, Clock, ShieldCheck } from "lucide-react";

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitted(true);
        setFormData({ name: "", email: "", subject: "", message: "" });
        // Reset success message after 3 seconds
        setTimeout(() => setSubmitted(false), 3000);
      } else {
        console.error('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    // 使用深灰色背景，与前后的模块完美承接
    <section className="bg-zinc-900 py-20 md:py-32 relative overflow-hidden">
      {/* 底部点缀一点品牌色的暗光 */}
      <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-[#c5a47e]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        
        {/* 头部标题 */}
        <div className="flex flex-col items-center justify-center text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-white">
            Ready to Upgrade?
          </h2>
          <p className="text-zinc-400 max-w-2xl text-lg">
            Whether you need a quote, expert advice, or are ready to book an installation, our Adelaide team is here to help.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 max-w-6xl mx-auto">
          
          {/* 左侧：联系信息区 (占据 2 列) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-black/50 p-8 rounded-2xl border border-zinc-800 h-full flex flex-col justify-center">
              <h3 className="text-2xl font-bold mb-8 text-white">Get in Touch</h3>
              
              <div className="space-y-8">
                {/* 电话 */}
                <div className="flex items-start gap-4 group">
                  <div className="w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center text-[#c5a47e] shrink-0 border border-zinc-800 transition-colors group-hover:bg-[#c5a47e] group-hover:text-black">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-zinc-200">Phone</h4>
                    <p className="text-zinc-400 mt-1">0493343981</p>
                  </div>
                </div>
                
                {/* 邮箱 */}
                <div className="flex items-start gap-4 group">
                  <div className="w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center text-[#c5a47e] shrink-0 border border-zinc-800 transition-colors group-hover:bg-[#c5a47e] group-hover:text-black">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-zinc-200">Email</h4>
                    <p className="text-zinc-400 mt-1 break-all">smarthomeade@gmail.com</p>
                  </div>
                </div>

                {/* 地址 */}
                <div className="flex items-start gap-4 group">
                  <div className="w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center text-[#c5a47e] shrink-0 border border-zinc-800 transition-colors group-hover:bg-[#c5a47e] group-hover:text-black">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-zinc-200">Service Area</h4>
                    <p className="text-zinc-400 mt-1">Adelaide, South Australia<br/>(Covering the greater metro area)</p>
                  </div>
                </div>

                {/* 营业时间 (新增，增强本地信任) */}
                <div className="flex items-start gap-4 group pt-6 border-t border-zinc-800">
                  <div className="w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center text-[#c5a47e] shrink-0 border border-zinc-800 transition-colors group-hover:bg-[#c5a47e] group-hover:text-black">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-zinc-200">Business Hours</h4>
                    <p className="text-zinc-400 mt-1">Mon - Sat: 8:00 AM - 6:00 PM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 右侧：表单区 (占据 3 列) */}
          <div className="lg:col-span-3">
            <div className="bg-white p-8 md:p-10 rounded-2xl shadow-xl border border-slate-100 relative overflow-hidden">
              {/* 表单内的小点缀 */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-full -z-10" />
              
              <h3 className="text-2xl font-bold mb-2 text-slate-900">Send a Message</h3>
              <p className="text-slate-500 mb-8 text-sm">We aim to respond to all inquiries within 2 hours during business hours.</p>
              
              <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* 输入框：点击时边框变成金色 (focus:ring-[#c5a47e]) */}
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-semibold text-slate-700">Full Name *</label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full h-12 px-4 bg-slate-50 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#c5a47e]/50 focus:border-[#c5a47e] transition-all"
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-semibold text-slate-700">Email Address *</label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full h-12 px-4 bg-slate-50 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#c5a47e]/50 focus:border-[#c5a47e] transition-all"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="subject" className="text-sm font-semibold text-slate-700">How can we help? *</label>
                  <input
                    id="subject"
                    name="subject"
                    type="text"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full h-12 px-4 bg-slate-50 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#c5a47e]/50 focus:border-[#c5a47e] transition-all"
                    placeholder="e.g., Quote for Philips DDL720, Installation Service"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-semibold text-slate-700">Message Details *</label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full p-4 bg-slate-50 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#c5a47e]/50 focus:border-[#c5a47e] transition-all resize-none"
                    placeholder="Please provide your suburb and any details about your current door..."
                  />
                </div>

                {/* 提交按钮：品牌金高亮 */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-14 bg-black text-white font-bold tracking-wide rounded-lg hover:bg-[#c5a47e] transition-colors duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                >
                  {isSubmitting ? (
                    "Sending Request..."
                  ) : submitted ? (
                    "Message Sent Successfully!"
                  ) : (
                    <>
                      Send Message <Send className="w-5 h-5 ml-1" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
