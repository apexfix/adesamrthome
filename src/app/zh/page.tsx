
import type { Metadata } from "next";
import Link from "next/link";
import { businessInfo, serviceAreas, siteUrl } from "@/lib/seoData";

export const metadata: Metadata = {
  title: "阿德莱德智能锁安装 | 电子锁 指纹锁 监控安装",
  description:
    "ADE Smart Home 提供阿德莱德智能锁安装、电子锁安装、指纹锁安装、可视门铃、监控和智能家居安装服务。400+ 本地安装案例，支持 Philips、EZVIZ、Samsung、Aqara 及进口智能锁，提供免费门型评估和本地售后。",
  keywords: [
    "阿德莱德智能锁安装",
    "阿德莱德电子锁安装",
    "阿德莱德指纹锁安装",
    "阿德莱德智能门锁",
    "阿德莱德换锁",
    "阿德莱德监控安装",
    "阿德莱德智能家居",
    "Adelaide smart lock installation",
    "Adelaide digital door lock",
  ],
  alternates: {
    canonical: `${siteUrl}/zh`,
    languages: {
      "en-AU": siteUrl,
      "zh-CN": `${siteUrl}/zh`,
    },
  },
  openGraph: {
    title: "阿德莱德智能锁安装 | ADE Smart Home",
    description:
      "阿德莱德智能锁、电子锁、指纹锁、可视门铃和监控安装。400+ 本地安装案例，免费门型评估，本地售后支持。",
    url: `${siteUrl}/zh`,
    siteName: "ADE Smart Home",
    images: [
      {
        url: "/img/hero1.jpg",
        width: 1200,
        height: 630,
        alt: "阿德莱德智能锁安装 ADE Smart Home",
      },
    ],
    locale: "zh_CN",
    type: "website",
  },
};

export default function ChineseLandingPage() {
  const pageUrl = `${siteUrl}/zh`;

  const chineseServiceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${pageUrl}#service`,
    name: "阿德莱德智能锁安装",
    alternateName: "Smart Lock Installation Adelaide",
    serviceType: "Smart Lock Installation",
    provider: {
      "@type": ["LocalBusiness", "Locksmith"],
      "@id": `${siteUrl}/#business`,
      name: businessInfo.name,
      telephone: businessInfo.phoneInternational,
      email: businessInfo.email,
      url: siteUrl,
    },
    areaServed: {
      "@type": "City",
      name: "Adelaide",
      addressRegion: "SA",
      addressCountry: "AU",
    },
    description:
      "ADE Smart Home 提供阿德莱德智能锁安装、电子锁安装、指纹锁安装、可视门铃和监控安装服务，支持 Philips、EZVIZ、Samsung、Aqara 及进口智能锁。",
  };

  return (
    <main className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(chineseServiceSchema) }}
      />

      <section className="bg-neutral-950 text-white">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-neutral-300">
            ADE Smart Home · Adelaide Local Installer
          </p>

          <h1 className="max-w-4xl text-4xl font-bold tracking-tight md:text-6xl">
            阿德莱德智能锁安装
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-neutral-200">
            提供智能门锁、电子锁、指纹锁、可视门铃、监控和智能家居安装服务。
            我们专注于阿德莱德本地安装，已完成 400+ 本地安装案例，支持木门、铝合金门及部分防盗纱门的门型评估与安装。
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/contact"
              className="rounded-full bg-white px-6 py-3 text-center font-semibold text-neutral-950 transition hover:bg-neutral-200"
            >
              发送门的照片，免费评估
            </Link>
            <a
              href={`tel:${businessInfo.phone}`}
              className="rounded-full border border-white px-6 py-3 text-center font-semibold text-white transition hover:bg-white hover:text-neutral-950"
            >
              电话咨询 {businessInfo.phone}
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-10 md:grid-cols-3">
          <div className="rounded-3xl border border-neutral-200 p-8 shadow-sm">
            <h2 className="text-xl font-bold text-neutral-950">
              智能锁安装
            </h2>
            <p className="mt-4 leading-7 text-neutral-700">
              安装指纹锁、密码锁、人脸识别智能锁、可视智能锁和 App 控制智能门锁。安装前可先看门型，判断是否适合安装。
            </p>
          </div>

          <div className="rounded-3xl border border-neutral-200 p-8 shadow-sm">
            <h2 className="text-xl font-bold text-neutral-950">
              监控与门铃安装
            </h2>
            <p className="mt-4 leading-7 text-neutral-700">
              提供家庭监控、智能门铃、太阳能摄像头、NVR 录像机和基础智能安防系统安装服务。
            </p>
          </div>

          <div className="rounded-3xl border border-neutral-200 p-8 shadow-sm">
            <h2 className="text-xl font-bold text-neutral-950">
              本地售后支持
            </h2>
            <p className="mt-4 leading-7 text-neutral-700">
              提供阿德莱德本地售后支持，包括 App 设置、用户添加、密码设置、基础故障排查和使用指导。
            </p>
          </div>
        </div>
      </section>

      <section className="bg-neutral-50">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-bold text-neutral-950">
              为什么安装前一定要先看门型？
            </h2>
            <p className="mt-5 leading-8 text-neutral-700">
              智能锁不是所有门都能直接安装。不同门的厚度、原锁体位置、门框距离、开孔大小和锁舌结构都会影响安装效果。
              如果没有提前检查，可能会出现锁体不匹配、门框间隙不足、锁舌无法正常弹出、外观不平整等问题。
            </p>
            <p className="mt-5 leading-8 text-neutral-700">
              所以我们建议客户先发送门的正面照片、原锁照片、门侧边照片和门框照片。我们会先判断是否适合安装，再推荐合适的智能锁型号和安装方案。
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-10 md:grid-cols-[1fr_1fr]">
          <div>
            <h2 className="text-3xl font-bold text-neutral-950">
              支持的常见品牌
            </h2>
            <ul className="mt-6 grid gap-3 text-neutral-700 sm:grid-cols-2">
              {[
                "Philips 飞利浦智能锁",
                "EZVIZ 萤石智能锁",
                "Samsung 三星电子锁",
                "Aqara 绿米智能锁",
                "Eufy 智能锁",
                "Yale 智能锁",
                "Kaadas 凯迪仕",
                "部分中国进口智能锁",
              ].map((item) => (
                <li key={item} className="rounded-2xl bg-neutral-50 px-4 py-3">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-3xl font-bold text-neutral-950">
              服务区域
            </h2>
            <p className="mt-5 leading-8 text-neutral-700">
              我们主要服务阿德莱德及周边区域，包括市区、东区、西区、南区、北区和东北区。
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {serviceAreas.map((area) => (
                <Link
                  key={area.slug}
                  href={`/smart-lock-installation/${area.slug}`}
                  className="rounded-2xl border border-neutral-200 px-4 py-3 text-neutral-800 transition hover:border-neutral-950"
                >
                  {area.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-neutral-950 text-white">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="text-3xl font-bold">
            想知道你家门能不能装智能锁？
          </h2>
          <p className="mt-5 max-w-3xl leading-8 text-neutral-200">
            可以直接发送门的照片给我们。建议包含：门正面、原来的锁、门侧边锁舌、门框位置。
            我们会根据门型判断适合的智能锁和安装方式。
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/contact"
              className="rounded-full bg-white px-6 py-3 text-center font-semibold text-neutral-950 transition hover:bg-neutral-200"
            >
              获取免费报价
            </Link>
            <a
              href={`mailto:${businessInfo.email}`}
              className="rounded-full border border-white px-6 py-3 text-center font-semibold text-white transition hover:bg-white hover:text-neutral-950"
            >
              邮件发送照片
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
