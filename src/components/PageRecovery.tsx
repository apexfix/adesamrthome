"use client";

import type { CSSProperties } from "react";
import { ArrowLeft, ArrowRight, Mail, MessageSquareText, RefreshCw } from "lucide-react";
import { businessInfo } from "@/lib/seoData";

const actionStyle: CSSProperties = {
  display: "inline-flex", alignItems: "center", gap: 10, minHeight: 48,
  minWidth: 0, maxWidth: "100%", padding: "12px 16px", boxSizing: "border-box",
  border: "1px solid #71717a", borderRadius: 6, color: "#fff",
  fontSize: "1rem", fontWeight: 700, lineHeight: 1.4, textDecoration: "none",
};
const iconStyle: CSSProperties = { flexShrink: 0 };
const labelStyle: CSSProperties = { minWidth: 0 };

export function PageRecovery() {
  return (
    <main className="page-recovery" data-page-recovery style={{ boxSizing: "border-box", minHeight: "100svh", display: "grid", alignContent: "center", padding: "max(120px, var(--site-header-clearance, 0px)) 24px 80px", background: "#111214", color: "#fff", fontFamily: "Arial, sans-serif", fontSize: "1rem", letterSpacing: 0, overflowWrap: "anywhere" }}>
      <style>{".page-recovery a:focus-visible { outline: 2px solid #d9b98f; outline-offset: 4px; }"}</style>
      <div style={{ width: "100%", maxWidth: 600, minWidth: 0, margin: "0 auto" }}>
        <p style={{ color: "#d9b98f", fontWeight: 700 }}>{businessInfo.name.toUpperCase()}</p>
        <h1 style={{ fontSize: "2rem", fontWeight: 700, lineHeight: 1.2, margin: "20px 0" }}>Let&apos;s get you back to the website</h1>
        <p style={{ color: "#c9cbd0", lineHeight: 1.7 }}>This page could not finish loading. Reload it, return home or contact us directly for a quote.</p>
        {/* Full document links also work if recovery scripts fail and reset a failed router. */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 24 }}>
          <a href="" style={{ ...actionStyle, background: "#d9b98f", borderColor: "#d9b98f", color: "#111" }}><RefreshCw size={18} style={iconStyle} aria-hidden="true" /><span style={labelStyle}>Reload page</span></a>
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- A full navigation resets the failed router and translated DOM. */}
          <a href="/" style={actionStyle}><ArrowLeft size={18} style={iconStyle} aria-hidden="true" /><span style={labelStyle}>Back to home</span></a>
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- Keep recovery independent of client navigation. */}
          <a href="/products" style={actionStyle}><span style={labelStyle}>Browse products</span><ArrowRight size={18} style={iconStyle} aria-hidden="true" /></a>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 28, paddingTop: 20, borderTop: "1px solid #3f3f46" }}>
          <a href={`sms:${businessInfo.phoneInternational}`} style={actionStyle}><MessageSquareText size={18} style={iconStyle} aria-hidden="true" /><span style={labelStyle}>Text {businessInfo.phone}</span></a>
          <a href={`mailto:${businessInfo.email}`} style={actionStyle}><Mail size={18} style={iconStyle} aria-hidden="true" /><span style={labelStyle}>Email us</span></a>
        </div>
      </div>
    </main>
  );
}
