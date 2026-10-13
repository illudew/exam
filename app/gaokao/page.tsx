import Link from "next/link";
import { GaokaoInner } from "./GaokaoInner";

export default function GaokaoPage() {
  return (
    <main className="min-h-screen">
      <TopBar title="高考物理系统" exam="gaokao" />
      <GaokaoInner />
    </main>
  );
}

function TopBar({ title, exam }: { title: string; exam: "gaokao" | "zhongkao" }) {
  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-dark-card/80 backdrop-blur border-b border-gray-200 dark:border-dark-border">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-sm text-gray-500 dark:text-dark-muted hover:underline">
            ← IlluPhy 首页
          </Link>
          <h1 className="text-xl font-bold">{title}</h1>
        </div>
        <div className="text-sm text-gray-500 dark:text-dark-muted">
          {exam === "gaokao" ? "15 个核心模型" : "8 个高频模型"}
        </div>
      </div>
    </header>
  );
}
