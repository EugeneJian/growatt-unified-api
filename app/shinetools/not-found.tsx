import Link from "next/link";

export default function ShineToolsNotFound() {
  return (
    <main className="shinetools-not-found">
      <p className="shinetools-eyebrow">ShineTools Energy Management</p>
      <h1>没有找到该文档</h1>
      <p>文档可能已经移动，或尚未加入受控发布清单。</p>
      <Link href="/shinetools">返回 ShineTools 总览</Link>
    </main>
  );
}
