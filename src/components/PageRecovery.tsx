"use client";

import { Mail, MessageSquareText, RefreshCw } from "lucide-react";

export function PageRecovery() {
  return (
    <main style={{ minHeight: "100svh", display: "grid", alignContent: "center", padding: "120px 24px", background: "#111214", color: "#fff", fontFamily: "Arial, sans-serif" }}>
      <div style={{ width: "100%", maxWidth: 540, margin: "0 auto" }}>
        <p style={{ color: "#d9b98f", fontWeight: 700 }}>ADE SMART HOME</p>
        <h1 style={{ fontSize: 32, lineHeight: 1.2, margin: "20px 0" }}>Let&apos;s get you back to the website</h1>
        <p style={{ color: "#c9cbd0", lineHeight: 1.7 }}>This page could not finish loading. Reload the page or contact us directly for a quote.</p>
        <button type="button" onClick={() => window.location.reload()} style={{ display: "inline-flex", alignItems: "center", gap: 8, marginTop: 20, padding: "14px 20px", border: 0, borderRadius: 6, background: "#d9b98f", color: "#111", fontSize: 16, fontWeight: 700, cursor: "pointer" }}><RefreshCw size={18} aria-hidden="true" /><span>Reload page</span></button>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 24, marginTop: 28 }}>
          <a href="sms:+61431060390" style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "#fff", padding: "12px 0" }}><MessageSquareText size={18} aria-hidden="true" /><span>Text 0431060390</span></a>
          <a href="mailto:info@adesmarthome.com.au" style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "#fff", padding: "12px 0" }}><Mail size={18} aria-hidden="true" /><span>Email us</span></a>
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- A full navigation resets the failed router and translated DOM. */}
          <a href="/products" style={{ color: "#d9b98f", padding: "12px 0" }}>Browse products</a>
        </div>
      </div>
    </main>
  );
}
