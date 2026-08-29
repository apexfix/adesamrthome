import Link from "next/link";
import { MessageSquareText, Phone } from "lucide-react";

export function MobileContactBar() {
  return (
    <>
      <div className="h-16 md:hidden" aria-hidden="true" />
      <div className="fixed inset-x-0 bottom-0 z-[70] grid grid-cols-2 border-t border-zinc-700 bg-black p-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] md:hidden">
        <a
          href="tel:0431060390"
          className="flex h-12 items-center justify-center gap-2 border-r border-zinc-700 text-sm font-bold text-white"
        >
          <Phone className="h-4 w-4 text-[#c5a47e]" />
          Call
        </a>
        <Link
          href="/contact?service=not-sure"
          className="flex h-12 items-center justify-center gap-2 bg-[#c5a47e] text-sm font-bold text-black"
        >
          <MessageSquareText className="h-4 w-4" />
          Get Quote
        </Link>
      </div>
    </>
  );
}
