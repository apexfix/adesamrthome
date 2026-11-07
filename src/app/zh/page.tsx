import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Camera, Check, Fingerprint, MessageSquareText, Phone, Wrench } from "lucide-react";
import { BusinessDetails } from "@/components/BusinessDetails";
import {
  BUSINESS_HOURS,
  INSTALL_ONLY_PRICES,
  PACKAGE_FROM_PRICE,
  SERVICE_AREA_LABEL_ZH,
  businessInfo,
  mailHref,
  serviceAreas,
  siteUrl,
  smsHref,
  telHref,
} from "@/lib/seoData";

const pageUrl = `${siteUrl}/zh`;

export const metadata: Metadata = {
  title: { absolute: "阿德莱德智能锁安装 | 含锁上门安装 $699 起 | ADE Smart Home" },
  description:
    `阿德莱德智能锁供货加安装，$${PACKAGE_FROM_PRICE} 起含锁含安装。先看门的照片免费评估，不收预付款，装完现场教你用 App、录指纹、设密码。电话 ${businessInfo.phoneDisplay}。`,
  alternates: {
    canonical: pageUrl,
    languages: {
      "x-default": siteUrl,
      "en-AU": siteUrl,
      "zh-CN": pageUrl,
    },
  },
  openGraph: {
    title: "阿德莱德智能锁安装 | ADE Smart Home",
    description: `含锁上门安装 $${PACKAGE_FROM_PRICE} 起，免费远程看门型，不收预付款，装完现场教学。`,
    url: pageUrl,
    siteName: "ADE Smart Home",
    images: [{ url: "/img/og/ade-smart-home-adelaide.jpg", width: 1200, height: 630, alt: "阿德莱德智能锁安装 ADE Smart Home" }],
    locale: "zh_CN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "阿德莱德智能锁安装 | ADE Smart Home",
    description: `含锁上门安装 $${PACKAGE_FROM_PRICE} 起，免费远程看门型，不收预付款。`,
    images: ["/img/og/ade-smart-home-adelaide.jpg"],
  },
};

const packages = [
  { name: "Lockin X9", price: 699, note: "入门款：指纹、密码、App、NFC 卡都能开，性价比最高", href: "/products/lockin-x9-smart-lock" },
  { name: "Lockin OLA Slim", price: 899, note: "窄款机身，适合门边比较窄的门（单买锁 $559）", href: "/products/lockin-ola-slim-smart-lock" },
  { name: "Lockin Veno Pro", price: 999, note: "掌静脉 + 指纹，带 2K 可视门铃和本地存储", href: "/products/lockin-veno-pro-smart-lock" },
  { name: "Lockin S6 Max", price: 1199, note: "带摄像头，3D 人脸识别，站门口就开", href: "/products/lockin-s6-max-smart-lock" },
  { name: "Lockin V5 Max", price: 1350, note: "旗舰推拉款：掌静脉、3D 人脸、摄像头，室内有显示屏", href: "/products/lockin-v5-max-smart-lock" },
];

const steps = [
  { title: "发几张门的照片", text: "门外侧、门内侧、门侧边锁舌、门框各一张，短信或邮件发过来就行。" },
  { title: "我们远程看门型、报价", text: "一般当天回复：哪几款能装、要不要额外改动、总共多少钱，全部说清楚。不收定金。" },
  { title: "约时间上门安装", text: "标准安装一般 1 到 2 小时。我们用专用工具和开孔模板，装完把粉尘吸干净。" },
  { title: "现场教你用", text: "陪你录指纹、设密码、连 App，家里人都试一遍开门，没问题我们再走。" },
  { title: "售后找得到人", text: `安装工艺保修 12 个月，锁具按厂家保修。用着有问题直接打 ${businessInfo.phoneDisplay}。` },
];

const faqs = [
  {
    q: "我家的门能装智能锁吗？",
    a: "大部分木门和不少铝门都能装，但门厚、原来的锁体、门框间隙都会影响。最省事的办法是先发照片给我们看，免费的，看完再决定。",
  },
  {
    q: "要先付钱或者交定金吗？",
    a: "不用。我们看完照片确认能装、报好价，你同意了才约时间。装好、试好、你满意了再付款。",
  },
  {
    q: `$${PACKAGE_FROM_PRICE} 都包括什么？`,
    a: "包括锁本身、标准上门安装、现场设置和教学。如果你的门需要额外改动或配件，我们会提前说明并单独报价，不会装到一半加钱。",
  },
  {
    q: "我自己网上买了锁（包括国内带过来的），你们能装吗？",
    a: `可以。把锁的型号和门的照片发给我们，确认能装再约。纯安装 $${INSTALL_ONLY_PRICES.compact}（小锁体）或 $${INSTALL_ONLY_PRICES.mortise}（全尺寸 6068 锁体），不含锁。`,
  },
  {
    q: "租的房子能装吗？",
    a: "建议先征得房东或中介同意。很多情况下可以保留原来的锁，搬走时换回去。物业经理和 Airbnb 房东我们也经常合作。",
  },
  {
    q: "没电了怎么办？",
    a: "电量低时锁会提前提醒，大多数型号也支持应急供电或机械钥匙开门。安装时我们会现场演示给你看。",
  },
  {
    q: "可以用中文沟通吗？",
    a: "可以，打电话、发短信、发邮件都可以用中文。",
  },
];

export default function ChineseHomePage() {
  const smsLink = smsHref("你好，我想咨询智能锁安装，门的照片稍后发给你。");

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    inLanguage: "zh-CN",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${pageUrl}#service`,
    name: "阿德莱德智能锁供货与安装",
    alternateName: "Smart Lock Supply and Installation Adelaide",
    inLanguage: "zh-CN",
    provider: { "@id": `${siteUrl}/#business` },
    areaServed: { "@type": "City", name: "Adelaide" },
    offers: { "@type": "Offer", price: PACKAGE_FROM_PRICE, priceCurrency: "AUD" },
  };

  return (
    <main className="min-h-screen bg-black text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* 首屏 */}
      <section className="border-b border-zinc-900 bg-zinc-950">
        <div className="mx-auto max-w-6xl px-5 pb-16 pt-[calc(var(--site-header-clearance,120px)+24px)] md:px-8 md:pb-24">
          <h1 className="max-w-4xl text-4xl font-bold leading-tight md:text-6xl">
            阿德莱德智能锁上门安装{" "}
            <span className="block text-[#e5c59f]">含锁含安装 ${PACKAGE_FROM_PRICE} 起</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-300">
            选锁、安装、设置一次搞定。我们先看你家门的照片，推荐装得上、用得顺的型号，装好之后手把手教你用。
          </p>
          <ul className="mt-6 grid gap-2 text-base text-zinc-200">
            {["发照片免费远程看门型", "不收定金，不用先付钱", "装完现场教你用 App、录指纹、设密码"].map((t) => (
              <li key={t} className="flex items-start gap-2">
                <Check className="mt-1 h-4 w-4 shrink-0 text-[#d9b98f]" aria-hidden="true" />
                <span>{t}</span>
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href={telHref} data-primary-quote data-contact="phone" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-[#d9b98f] px-6 py-3 font-semibold text-black transition-colors hover:bg-white">
              <Phone className="h-5 w-5" aria-hidden="true" />
              <span>打电话 {businessInfo.phoneDisplay}</span>
            </a>{" "}
            <a href={smsLink} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-zinc-600 px-6 py-3 font-semibold transition-colors hover:bg-zinc-800">
              <MessageSquareText className="h-5 w-5" aria-hidden="true" />
              <span>发短信咨询</span>
            </a>
          </div>
          <p className="mt-4 text-sm text-zinc-400">
            {BUSINESS_HOURS.labelZh}接电话 · 服务{SERVICE_AREA_LABEL_ZH}
          </p>
        </div>
      </section>

      {/* 服务 */}
      <section id="fuwu" aria-labelledby="fuwu-title" className="scroll-mt-28 mx-auto max-w-6xl px-5 py-16 md:px-8">
        <h2 id="fuwu-title" className="text-3xl font-bold">我们能帮你做什么</h2>
        <div className="mt-8 grid gap-8 md:grid-cols-3">
          <div className="border-t border-zinc-800 pt-6">
            <Fingerprint className="h-7 w-7 text-[#c5a47e]" aria-hidden="true" />
            <h3 className="mt-4 text-xl font-bold">含锁上门安装</h3>
            <p className="mt-3 leading-7 text-zinc-300">
              不知道买哪款？我们按你家的门和预算推荐，锁我们带来，装好、设置好、教会你，一口价 ${PACKAGE_FROM_PRICE} 起。
            </p>
          </div>
          <div className="border-t border-zinc-800 pt-6">
            <Wrench className="h-7 w-7 text-[#c5a47e]" aria-hidden="true" />
            <h3 className="mt-4 text-xl font-bold">自购锁代安装</h3>
            <p className="mt-3 leading-7 text-zinc-300">
              网上买的、国内带过来的都行。先发锁的型号和门的照片，确认能装再约时间，省得白跑。
            </p>
          </div>
          <div className="border-t border-zinc-800 pt-6">
            <Camera className="h-7 w-7 text-[#c5a47e]" aria-hidden="true" />
            <h3 className="mt-4 text-xl font-bold">装完有人管</h3>
            <p className="mt-3 leading-7 text-zinc-300">
              加家人指纹、改密码、App 连不上，打个电话就行。安装工艺保修 12 个月，锁具按厂家保修。
            </p>
          </div>
        </div>
        <p className="mt-8 text-sm leading-6 text-zinc-400">
          常帮这些客户：自住房的家庭、Airbnb 房东（每位房客单独密码，不用见面交钥匙）、物业经理（多套房统一管理）、新房业主（装修前先规划好锁）。
        </p>
      </section>

      {/* 套餐价格 */}
      <section id="jiage" aria-labelledby="jiage-title" className="scroll-mt-28 border-y border-zinc-800 bg-zinc-950">
        <div className="mx-auto max-w-6xl px-5 py-16 md:px-8">
          <h2 id="jiage-title" className="text-3xl font-bold">套餐价格（含锁 + 标准安装）</h2>
          <p className="mt-4 max-w-2xl leading-7 text-zinc-300">
            价格都是澳元，含锁、标准上门安装和现场教学。门需要额外改动的话，我们看照片时就会告诉你，不会临时加价。
          </p>
          <ul className="mt-8 divide-y divide-zinc-800 border-y border-zinc-800">
            {packages.map((p) => (
              <li key={p.name}>
                <Link href={p.href} lang="en" className="group flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-5">
                  <span className="min-w-0">
                    <span className="block text-lg font-bold group-hover:text-[#d9b98f]">{p.name}</span>{" "}
                    <span lang="zh-CN" className="mt-1 block text-sm text-zinc-400">{p.note}</span>
                  </span>{" "}
                  <span className="text-2xl font-bold text-[#e5c59f]">${p.price.toLocaleString("en-AU")}</span>
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm leading-6 text-zinc-400">
            已经有锁、只要安装：小锁体 ${INSTALL_ONLY_PRICES.compact}，全尺寸 6068 锁体 ${INSTALL_ONLY_PRICES.mortise}，不含锁。{" "}
            <Link href="/smart-lock-installation-only-adelaide" lang="en" className="font-semibold text-zinc-200 underline underline-offset-4">纯安装详情（英文）</Link>
          </p>
        </div>
      </section>

      {/* 安装流程 */}
      <section id="liucheng" aria-labelledby="liucheng-title" className="scroll-mt-28 mx-auto max-w-6xl px-5 py-16 md:px-8">
        <h2 id="liucheng-title" className="text-3xl font-bold">安装流程</h2>
        <ol className="mt-8 grid gap-6 md:grid-cols-5">
          {steps.map((s, i) => (
            <li key={s.title} className="border-t border-zinc-800 pt-5">
              <span className="text-sm font-bold text-[#d9b98f]">第 {i + 1} 步</span>{" "}
              <h3 className="mt-2 text-lg font-bold">{s.title}</h3>
              <p className="mt-2 text-sm leading-6 text-zinc-300">{s.text}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* 常见问题 */}
      <section id="wenti" aria-labelledby="wenti-title" className="scroll-mt-28 border-y border-zinc-800 bg-zinc-950">
        <div className="mx-auto max-w-4xl px-5 py-16 md:px-8">
          <h2 id="wenti-title" className="text-3xl font-bold">常见问题</h2>
          <div className="mt-8 divide-y divide-zinc-800 border-y border-zinc-800">
            {faqs.map((f, i) => (
              <details key={f.q} open={i === 0} className="group py-1">
                <summary className="flex min-h-14 cursor-pointer items-center justify-between gap-4 py-3 text-base font-semibold md:text-lg">
                  <span>{f.q}</span>{" "}
                  <ArrowRight className="h-4 w-4 shrink-0 transition-transform group-open:rotate-90" aria-hidden="true" />
                </summary>
                <p className="pb-5 leading-7 text-zinc-300">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* 服务区域 */}
      <section aria-labelledby="quyu-title" className="mx-auto max-w-6xl px-5 py-16 md:px-8">
        <h2 id="quyu-title" className="text-3xl font-bold">服务区域</h2>
        <p className="mt-4 max-w-2xl leading-7 text-zinc-300">
          阿德莱德市区和周边都跑，东南西北区都去。下面是常去的区，不在列表里也可以问。
        </p>
        <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {serviceAreas.map((area) => (
            <li key={area.slug}>
              <Link href={`/smart-lock-installation/${area.slug}`} lang="en" className="flex min-h-12 items-center rounded-md border border-zinc-800 px-4 text-zinc-200 transition-colors hover:border-[#d9b98f] hover:text-[#d9b98f]">
                {area.name}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* 联系我们 */}
      <section id="lianxi" aria-labelledby="lianxi-title" className="quote-section scroll-mt-28 border-t border-zinc-800 bg-zinc-950">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-2 md:px-8">
          <div>
            <h2 id="lianxi-title" className="text-3xl font-bold">联系我们，先免费看看</h2>
            <p className="mt-4 leading-7 text-zinc-300">
              最快的方式：拍 4 张照片（门外侧、门内侧、门侧边、门框）短信或邮件发给我们，写上你在哪个区。我们看完回复能装哪几款、多少钱。
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <a href={telHref} data-contact="phone" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-[#d9b98f] px-6 py-3 font-semibold text-black transition-colors hover:bg-white">
                <Phone className="h-5 w-5" aria-hidden="true" />
                <span>打电话</span>
              </a>{" "}
              <a href={mailHref("智能锁安装咨询（附门的照片）")} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-zinc-600 px-6 py-3 font-semibold transition-colors hover:bg-zinc-800">
                <span>邮件发照片</span>
              </a>
            </div>
            <p className="mt-4 text-sm text-zinc-400">
              想填表格？可以用{" "}
              <Link href="/contact#quote" lang="en" className="font-semibold text-zinc-200 underline underline-offset-4">英文报价表</Link>
              ，中文填写也没问题。
            </p>
          </div>
          <BusinessDetails lang="zh" />
        </div>
      </section>
    </main>
  );
}
