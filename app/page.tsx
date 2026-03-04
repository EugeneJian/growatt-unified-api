import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f2f7ff] text-[#10203a] px-6 py-16">
      <main className="max-w-3xl mx-auto rounded-2xl border border-[#cfe0f5] bg-white p-8 sm:p-10 shadow-[0_10px_30px_rgba(16,32,58,0.08)]">
        <p className="text-sm tracking-[0.08em] uppercase text-[#44638a]">
          Growatt API Documentation
        </p>
        <h1 className="mt-3 text-3xl sm:text-4xl font-semibold leading-tight">
          Growatt OpenAPI HTML 文档站
        </h1>
        <p className="mt-4 text-base text-[#3c5370] leading-7">
          该项目已移除代理服务能力，仅保留 Growatt OpenAPI 的静态文档展示。
          文档内容源自 <code>Growatt API/OPENAPI/*.md</code>，并可部署到 Cloudflare Pages。
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            className="rounded-full bg-[#0d4da3] text-white px-5 py-2.5 text-sm font-medium hover:bg-[#0a4088]"
            href="/growatt-openapi"
          >
            打开文档站
          </Link>
          <a
            className="rounded-full border border-[#bfd3ee] px-5 py-2.5 text-sm font-medium text-[#173a68] hover:bg-[#edf4ff]"
            href="https://developers.cloudflare.com/pages/framework-guides/nextjs/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Cloudflare Pages 指南
          </a>
        </div>
      </main>
    </div>
  );
}
