import Link from "next/link";
import type { ExamType } from "@/lib/types";
import { ExamExplorer } from "@/components/ExamExplorer";

// ======== 考试配置 ========
interface ExamPageConfig {
  exam: ExamType;
  title: string;
  emoji: string;
  countLabel: string;
  titleClass: string;
}

const GAOKAO_CONFIG: ExamPageConfig = {
  exam: "gaokao",
  title: "高考物理系统",
  emoji: "🎓",
  countLabel: "15 个核心模型",
  titleClass: "",
};

const ZHONGKAO_CONFIG: ExamPageConfig = {
  exam: "zhongkao",
  title: "中考物理系统",
  emoji: "🏫",
  countLabel: "8 个高频模型",
  titleClass: "text-accent-orange",
};

export function getExamPageConfig(exam: ExamType): ExamPageConfig {
  return exam === "gaokao" ? GAOKAO_CONFIG : ZHONGKAO_CONFIG;
}

// ======== 共享页面框架 ========
export function ExamPageShell({ config }: { config: ExamPageConfig }) {
  return (
    <main className="min-h-screen">
      <TopBar config={config} />
      <ExamExplorer exam={config.exam} />
    </main>
  );
}

function TopBar({ config }: { config: ExamPageConfig }) {
  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-dark-card/80 backdrop-blur border-b border-gray-200 dark:border-dark-border">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-sm text-gray-500 dark:text-dark-muted hover:underline">
            ← IlluPhy 首页
          </Link>
          <h1 className={`text-xl font-bold ${config.titleClass}`}>
            {config.emoji} {config.title}
          </h1>
        </div>
        <div className="text-sm text-gray-500 dark:text-dark-muted">
          {config.countLabel}
        </div>
      </div>
    </header>
  );
}
