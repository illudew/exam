import { notFound } from "next/navigation";
import Link from "next/link";
import { zhongkaoQuestions } from "@/lib/data/zhongkao-questions";
import { SolveInner } from "@/components/SolveInner";

export default function ZhongkaoSolvePage({ params }: { params: { id: string } }) {
  const question = zhongkaoQuestions.find((q) => q.id === params.id);
  if (!question) notFound();
  return (
    <main className="min-h-screen">
      <header className="sticky top-0 z-30 bg-white/80 dark:bg-dark-card/80 backdrop-blur border-b border-gray-200 dark:border-dark-border">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between text-sm">
          <div className="flex items-center gap-3">
            <Link href="/zhongkao" className="text-gray-500 dark:text-dark-muted hover:underline">
              ← 返回中考物理
            </Link>
            <span className="text-gray-400">|</span>
            <span className="font-medium">{question.title}</span>
          </div>
          <div className="text-gray-500 dark:text-dark-muted">强制因果链 → 8 步解题</div>
        </div>
      </header>
      <div className="max-w-6xl mx-auto px-6 py-6">
        <SolveInner question={question} exam="zhongkao" />
      </div>
    </main>
  );
}
