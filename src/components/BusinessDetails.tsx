import { Clock, Mail, MapPin, MessageSquareText, Phone, ShieldCheck } from "lucide-react";
import {
  BUSINESS_ABN,
  BUSINESS_HOURS,
  SERVICE_AREA_LABEL,
  SERVICE_AREA_LABEL_ZH,
  WARRANTY_SUMMARY,
  WARRANTY_SUMMARY_ZH,
  businessInfo,
  mailHref,
  smsHref,
  telHref,
} from "@/lib/seoData";

type Lang = "en" | "zh";

const copy = {
  en: {
    call: "Call",
    sms: "Text / SMS",
    email: "Email",
    area: "Service area",
    areaValue: `${SERVICE_AREA_LABEL}, South Australia`,
    hours: "Hours",
    hoursValue: BUSINESS_HOURS.label,
    warranty: "Warranty",
    warrantyValue: WARRANTY_SUMMARY,
    smsBody: "Hi ADE Smart Home, I would like a smart lock quote.",
  },
  zh: {
    call: "打电话",
    sms: "发短信",
    email: "邮箱",
    area: "服务范围",
    areaValue: SERVICE_AREA_LABEL_ZH,
    hours: "营业时间",
    hoursValue: BUSINESS_HOURS.labelZh,
    warranty: "保修",
    warrantyValue: WARRANTY_SUMMARY_ZH,
    smsBody: "你好，我想咨询智能锁安装。",
  },
};

/**
 * Phone, SMS, email, service area, hours, warranty and ABN in one list.
 * Values come from seoData so the footer, contact page and Chinese page never drift apart.
 */
export function BusinessDetails({ lang = "en", className = "" }: { lang?: Lang; className?: string }) {
  const t = copy[lang];
  const row = "flex min-h-11 items-start gap-3 py-1";
  const icon = "mt-0.5 h-5 w-5 shrink-0 text-[#c5a47e]";
  const label = "block font-semibold text-zinc-200";

  return (
    <ul className={`space-y-1 text-sm leading-6 ${className}`}>
      <li>
        <a href={telHref} className={row} data-contact="phone">
          <Phone className={icon} aria-hidden="true" />
          <span><span className={label}>{t.call}</span> {businessInfo.phoneDisplay}</span>
        </a>
      </li>
      <li>
        <a href={smsHref(t.smsBody)} className={row}>
          <MessageSquareText className={icon} aria-hidden="true" />
          <span><span className={label}>{t.sms}</span> {businessInfo.phoneDisplay}</span>
        </a>
      </li>
      <li>
        <a href={mailHref()} className={row}>
          <Mail className={icon} aria-hidden="true" />
          <span className="min-w-0 break-words"><span className={label}>{t.email}</span> {businessInfo.email}</span>
        </a>
      </li>
      <li className={row}>
        <MapPin className={icon} aria-hidden="true" />
        <span><span className={label}>{t.area}</span> {t.areaValue}</span>
      </li>
      <li className={row}>
        <Clock className={icon} aria-hidden="true" />
        <span><span className={label}>{t.hours}</span> {t.hoursValue}</span>
      </li>
      <li className={row}>
        <ShieldCheck className={icon} aria-hidden="true" />
        <span><span className={label}>{t.warranty}</span> {t.warrantyValue}</span>
      </li>
      {BUSINESS_ABN && (
        <li className="pl-8 text-xs text-zinc-500">ABN {BUSINESS_ABN}</li>
      )}
    </ul>
  );
}
