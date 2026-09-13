"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Copy, Link as LinkIcon, Share2 } from "lucide-react";

const subscribe = () => () => {};
const clientSnapshot = () => true;
const serverSnapshot = () => false;

// The server supplies the public canonical article URL, never the current query string.
export function ArticleShare({ url, title }: { url: string; title: string }) {
  const enhanced = useSyncExternalStore(subscribe, clientSnapshot, serverSnapshot);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const pending = useRef(false);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; };
  }, []);

  async function act(action: "share" | "copy") {
    if (pending.current) return;
    pending.current = true;
    setBusy(true);
    setMessage("");
    try {
      if (action === "share" && typeof navigator.share === "function") {
        try {
          await navigator.share({ title, url });
          // Resolution does not prove that a post or message was actually sent.
          return;
        } catch (error) {
          if (error instanceof Error && error.name === "AbortError") return;
        }
      }
      if (!mounted.current) return;
      if (!navigator.clipboard?.writeText) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(url);
      if (mounted.current) setMessage("Link copied.");
    } catch {
      if (mounted.current) setMessage("Copy unavailable. Article link remains available.");
    } finally {
      pending.current = false;
      if (mounted.current) setBusy(false);
    }
  }

  return (
    <div data-article-share className="mb-6">
      <div className="flex min-h-11 flex-wrap items-center gap-3" aria-label="Article sharing" role="group">
        {enhanced && <>
          <button type="button" disabled={busy} onClick={() => act("share")} title="Share article" aria-label="Share article"
            className="glass-control flex h-11 w-11 shrink-0 items-center justify-center rounded-md border disabled:opacity-50"><Share2 size={20} aria-hidden="true" /></button>
          <button type="button" disabled={busy} onClick={() => act("copy")} title="Copy article link" aria-label="Copy article link"
            className="glass-control flex h-11 w-11 shrink-0 items-center justify-center rounded-md border disabled:opacity-50"><Copy size={20} aria-hidden="true" /></button>
        </>}
        <a href={url} className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#d9b98f] underline underline-offset-4">
          <LinkIcon size={18} aria-hidden="true" />Article link
        </a>
      </div>
      <p role="status" aria-live="polite" aria-atomic="true" className="mt-2 min-h-6 text-sm leading-6 text-zinc-300">{message}</p>
    </div>
  );
}
