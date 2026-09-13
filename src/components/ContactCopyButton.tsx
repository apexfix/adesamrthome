"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Check, CircleAlert, Copy, LoaderCircle } from "lucide-react";

const subscribe = () => () => {};
const clientSnapshot = () => true;
const serverSnapshot = () => false;

export function ContactCopyButton({ value, label }: { value: string; label: string }) {
  const enhanced = useSyncExternalStore(subscribe, clientSnapshot, serverSnapshot);
  const [state, setState] = useState<"idle" | "pending" | "copied" | "error">("idle");
  const pending = useRef(false);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; };
  }, []);

  async function copy() {
    if (pending.current) return;
    pending.current = true;
    setState("pending");
    try {
      if (typeof navigator.clipboard?.writeText !== "function") throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(value);
      if (mounted.current) setState("copied");
    } catch {
      if (mounted.current) setState("error");
    } finally {
      pending.current = false;
    }
  }

  const message = state === "copied" ? `${label} copied.`
    : state === "error" ? `Copy unavailable. ${label}: ${value}`
    : state === "pending" ? `Copying ${label.toLowerCase()}.` : "";
  const tooltip = state === "copied" ? "Copied" : state === "error" ? "Copy unavailable" : `Copy ${label.toLowerCase()}`;
  const Icon = state === "copied" ? Check : state === "error" ? CircleAlert : state === "pending" ? LoaderCircle : Copy;

  return (
    <span className="contact-copy">
      <button type="button" onClick={copy} disabled={!enhanced || state === "pending"}
        className="contact-copy-button" aria-label={`Copy ${label.toLowerCase()}`} aria-busy={state === "pending"}>
        <Icon aria-hidden="true" className="h-5 w-5" />
      </button>
      <span className="contact-copy-tooltip" aria-hidden="true">{tooltip}</span>
      <span className="sr-only" role="status">{message}</span>
    </span>
  );
}
