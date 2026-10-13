"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { KnowledgeMap } from "@/components/KnowledgeMap";
import { getModelsByExam } from "@/lib/data/models";
import { gaokaoQuestions } from "@/lib/data/gaokao-questions";
import { zhongkaoQuestions } from "@/lib/data/zhongkao-questions";
import { getModelMastery } from "@/lib/store";
import type { ExamType, KnowledgeNode, Question } from "@/lib/types";
import { MathJax } from "@/components/MathJax";

// ======== 考试配置 ========
interface ExamConfig {
  exam: ExamType;
  title: string;
  titleEmoji: string;
  accentClass: string; // tailwind 颜色类，如 "text-accent-orange" / "bg-primary-600"
  accentBg: string; // hover/active 背景色
  accentLabel: string; // 知识地图标题前缀
  modelCountLabel: string; // 如 "15 个核心模型"
  questions: Question[];
  questionPrefix: string; // 路由前缀，如 "/gaokao"
}

const EXAM_CONFIGS: Record<ExamType, ExamConfig> = {
  gaokao: {
    exam: "gaokao",
    title: "高考物理系统",
    titleEmoji: "🎓",
    accentClass: "bg-primary-600",
    accentBg: "bg-primary-600 text-white",
    accentLabel: "高考物理",
    modelCountLabel: "15 个核心模型",
    questions: gaokaoQuestions,
    questionPrefix: "/gaokao",
  },
  zhongkao: {
    exam: "zhongkao",
    title: "中考物理系统",
    titleEmoji: "🏫",
    accentClass: "bg-accent-orange",
    accentBg: "bg-accent-orange text-white",
    accentLabel: "中考物理",
    modelCountLabel: "8 个高频模型",
    questions: zhongkaoQuestions,
    questionPrefix: "/zhongkao",
  },
};

function masteryColor(level: number): string {
  if (level >= 70) return "bg-accent-green";
  if (level >= 40) return "bg-accent-orange";
  return "bg-accent-red";
}

export function ExamExplorer({ exam }: { exam: ExamType }) {
  const config = EXAM_CONFIGS[exam];
  const [selectedModel, setSelectedModel] = useState<string | null>(null);

  const models = useMemo(() => getModelsByExam(exam), [exam]);
  const selected = selectedModel ? models.find((m) => m.id === selectedModel) : null;
  const mastery = selectedModel ? getModelMastery(selectedModel) : null;
  const modelQuestions = useMemo(
    () => config.questions.filter((q) => q.model === selectedModel),
    [config.questions, selectedModel]
  );

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
      {/* Tabs */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setSelectedModel(null)}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
            !selectedModel
              ? config.accentBg
              : "bg-gray-100 dark:bg-dark-border hover:bg-gray-200"
          }`}
        >
          🗺 知识地图
        </button>
        {models.map((m) => {
          const mm = getModelMastery(m.id);
          const color = masteryColor(mm.masteryLevel);
          return (
            <button
              key={m.id}
              onClick={() => setSelectedModel(m.id)}
              className={`px-3 py-2 rounded-lg font-medium text-sm transition flex items-center gap-2 ${
                selectedModel === m.id
                  ? config.accentBg
                  : "bg-gray-100 dark:bg-dark-border hover:bg-gray-200"
              }`}
            >
              <span className={`inline-block w-2.5 h-2.5 rounded-full ${color}`} />
              {m.name}
            </button>
          );
        })}
      </div>

      {!selectedModel ? (
        <MapView config={config} onNodeClick={(node) => {
          if (node.type === "model") {
            const target = models.find((m) => m.nodeId === node.id);
            if (target) setSelectedModel(target.id);
          }
        }} />
      ) : (
        <ModelDetailView
          config={config}
          selected={selected!}
          mastery={mastery}
          modelQuestions={modelQuestions}
        />
      )}
    </div>
  );
}

// ============ 知识地图视图 ============
function MapView({
  config,
  onNodeClick,
}: {
  config: ExamConfig;
  onNodeClick: (node: KnowledgeNode) => void;
}) {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">📚 {config.accentLabel} · 因果知识地图</h2>
        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-dark-muted">
          <Legend color="#22c55e" label="完整度 >70%" />
          <Legend color="#eab308" label="40-70%" />
          <Legend color="#ef4444" label="<40%" />
        </div>
      </div>
      <div className={`border border-gray-200 dark:border-dark-border rounded-lg bg-gray-50 dark:bg-dark-bg ${
        config.exam === "gaokao" ? "h-[600px]" : "h-[550px]"
      }`}>
        <KnowledgeMap exam={config.exam} onNodeClick={onNodeClick} />
      </div>
      <div className="mt-4 text-xs text-gray-500 dark:text-dark-muted">
        💡 拖拽节点 / 滚轮缩放 / 悬停看描述 / 点击模型节点进入学习
      </div>
    </div>
  );
}

// ============ 模型详情视图 ============
function ModelDetailView({
  config,
  selected,
  mastery,
  modelQuestions,
}: {
  config: ExamConfig;
  selected: ReturnType<typeof getModelsByExam>[number];
  mastery: ReturnType<typeof getModelMastery> | null;
  modelQuestions: Question[];
}) {
  const accentTextClass = config.exam === "gaokao" ? "" : "text-accent-orange";

  return (
    <div className="space-y-5">
      {/* 模型详情卡 */}
      <div className="card">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-xs text-gray-500 dark:text-dark-muted mb-1">
              {selected.category} · 物理模型
            </div>
            <h2 className={`text-2xl font-bold ${accentTextClass}`}>{selected.name}</h2>
            <p className="text-sm text-gray-600 dark:text-dark-muted mt-2 leading-relaxed">
              {selected.description}
            </p>
          </div>
          {mastery && (
            <div className="shrink-0 text-center">
              <MasteryCircle level={mastery.masteryLevel} />
              <div className="text-xs mt-1 text-gray-500 dark:text-dark-muted">
                已做 {mastery.questionsDone} 题
              </div>
            </div>
          )}
        </div>

        {/* 核心公式 */}
        <Section title="📐 核心公式">
          <div className="grid md:grid-cols-2 gap-3">
            {selected.coreFormulas.map((f, i) => (
              <div
                key={i}
                className="bg-gray-50 dark:bg-dark-bg rounded-lg p-3 border border-gray-200 dark:border-dark-border"
              >
                <div className="font-mono text-lg"><MathJax tex={f.tex} /></div>
                <div className="text-xs text-gray-500 dark:text-dark-muted mt-1">{f.note}</div>
              </div>
            ))}
          </div>
        </Section>

        {/* 因果链 */}
        <Section title="🔗 因果链">
          <div className="space-y-2">
            {selected.causalChains.map((c, i) => (
              <div
                key={i}
                className={`rounded-lg p-3 border text-sm ${
                  config.exam === "gaokao"
                    ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
                    : "bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800"
                }`}
              >
                <div className={`font-medium mb-1 ${config.exam === "gaokao" ? "text-blue-700 dark:text-blue-300" : "text-accent-orange"}`}>
                  {c.name}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {c.steps.map((s, j) => (
                    <span
                      key={j}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-white dark:bg-dark-card rounded border border-gray-200 dark:border-dark-border text-xs"
                    >
                      {s}
                      {j < c.steps.length - 1 && (
                        <span className="text-primary-500">→</span>
                      )}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* 常见陷阱 */}
        <Section title="⚠ 常见陷阱 & 错因">
          <div className="space-y-2">
            {selected.tips.map((t, i) => (
              <div
                key={i}
                className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3 border border-red-200 dark:border-red-800 text-sm"
              >
                <div className="font-medium text-red-700 dark:text-red-300 mb-1">Q: {t.q}</div>
                <div className="text-xs">
                  <b className="text-gray-700 dark:text-dark-muted">想法：</b>
                  {t.idea}
                </div>
                <ul className="text-xs mt-1 space-y-0.5 list-disc list-inside">
                  {t.errors.map((e, j) => (
                    <li key={j} className="text-red-600 dark:text-red-400">{e}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Section>
      </div>

      {/* 题目列表 */}
      <QuestionList config={config} questions={modelQuestions} />
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-5">
      <div className="font-medium mb-2 text-sm">{title}</div>
      {children}
    </div>
  );
}

function MasteryCircle({ level }: { level: number }) {
  const color =
    level >= 70
      ? "border-accent-green text-accent-green"
      : level >= 40
      ? "border-accent-orange text-accent-orange"
      : "border-accent-red text-accent-red";
  return (
    <div className={`w-20 h-20 rounded-full border-4 flex items-center justify-center font-bold text-xl ${color}`}>
      {level}%
    </div>
  );
}

function QuestionList({ config, questions }: { config: ExamConfig; questions: Question[] }) {
  const isGaokao = config.exam === "gaokao";

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <div className="font-bold text-lg">📝 本模型题目</div>
        <div className="text-xs text-gray-500 dark:text-dark-muted">
          共 {questions.length} 道，每道含多解法、因果链分析
        </div>
      </div>
      {questions.length === 0 ? (
        <div className="text-gray-500 dark:text-dark-muted text-sm text-center py-8">
          此模型暂无题目数据
        </div>
      ) : (
        <div className="space-y-2">
          {questions.map((q, i) => (
            <Link
              key={q.id}
              href={`${config.questionPrefix}/solve/${q.id}`}
              className={`block p-4 rounded-lg border border-gray-200 dark:border-dark-border transition group hover:shadow-md ${
                isGaokao ? "hover:border-primary-400" : "hover:border-accent-orange"
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center text-sm font-bold transition ${
                    isGaokao
                      ? "bg-primary-100 dark:bg-primary-900 text-primary-700 group-hover:bg-primary-600 group-hover:text-white"
                      : "bg-accent-orange/10 text-accent-orange group-hover:bg-accent-orange group-hover:text-white"
                  }`}
                >
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium">{q.title}</div>
                  <div className="text-sm text-gray-600 dark:text-dark-muted mt-1 line-clamp-2">
                    <MathJax tex={q.stem} />
                  </div>
                  <div className="flex gap-1 mt-2 flex-wrap">
                    {q.keywords.map((k) => (
                      <span
                        key={k}
                        className={`text-[10px] px-2 py-0.5 rounded-full ${
                          isGaokao
                            ? "bg-primary-100 dark:bg-primary-900 text-primary-700"
                            : "bg-orange-100 dark:bg-orange-900 text-accent-orange"
                        }`}
                      >
                        {k}
                      </span>
                    ))}
                  </div>
                </div>
                <span
                  className={`shrink-0 mt-2 group-hover:translate-x-1 transition ${
                    isGaokao ? "text-primary-500" : "text-accent-orange"
                  }`}
                >
                  开始 →
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className="inline-block w-3 h-3 rounded-full" style={{ background: color }} />
      {label}
    </span>
  );
}
