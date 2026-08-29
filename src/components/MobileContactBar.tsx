import Link from "next/link";
import { MessageSquareText } from "lucide-react";

export function MobileContactBar() {
  return (
    <>
      <div className="h-16 md:hidden" aria-hidden="true" />
      <div className="fixed inset-x-0 bottom-0 z-[70] grid grid-cols-2 border-t border-zinc-700 bg-black p-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] md:hidden">
        <a
          href="sms:+61431060390?body=Hi%20ADE%20Smart%20Home%2C%20I%20would%20like%20a%20smart%20lock%20quote."
          className="flex h-12 items-center justify-center gap-2 border-r border-zinc-700 text-sm font-bold text-white"
        >
          <MessageSquareText className="h-4 w-4 text-[#c5a47e]" />
          Text us
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
