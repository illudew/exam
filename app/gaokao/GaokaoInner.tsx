"use client";

import { useState } from "react";
import Link from "next/link";
import { KnowledgeMap } from "@/components/KnowledgeMap";
import { getModelsByExam, gaokaoNodes, gaokaoEdges } from "@/lib/data/models";
import { getModelMastery } from "@/lib/store";
import type { KnowledgeNode } from "@/lib/types";
import { gaokaoQuestions } from "@/lib/data/gaokao-questions";
import { MathJax } from "@/components/MathJax";

export function GaokaoInner() {
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const models = getModelsByExam("gaokao");
  const questionsByModel = (mId: string) => gaokaoQuestions.filter((q) => q.model === mId);

  const selected = selectedModel ? models.find((m) => m.id === selectedModel) : null;
  const mastery = selectedModel ? getModelMastery(selectedModel) : null;
  const modelQuestions = selectedModel ? questionsByModel(selectedModel) : [];

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
      {/* Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setSelectedModel(null)}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
            !selectedModel
              ? "bg-primary-600 text-white"
              : "bg-gray-100 dark:bg-dark-border hover:bg-gray-200"
          }`}
        >
          🗺 知识地图
        </button>
        {models.slice(0, 6).map((m) => {
          const mm = getModelMastery(m.id);
          const fullness = mm.masteryLevel;
          const color = fullness >= 70 ? "bg-accent-green" : fullness >= 40 ? "bg-accent-orange" : "bg-accent-red";
          return (
            <button
              key={m.id}
              onClick={() => setSelectedModel(m.id)}
              className={`px-3 py-2 rounded-lg font-medium text-sm transition flex items-center gap-2 ${
                selectedModel === m.id
                  ? "bg-primary-600 text-white"
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
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">📚 高考物理 · 因果知识地图</h2>
            <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-dark-muted">
              <Legend color="#22c55e" label="模型完整度 >70%" />
              <Legend color="#eab308" label="40-70%" />
              <Legend color="#ef4444" label="<40%" />
            </div>
          </div>
          <div className="h-[600px] border border-gray-200 dark:border-dark-border rounded-lg bg-gray-50 dark:bg-dark-bg">
            <KnowledgeMap
              exam="gaokao"
              onNodeClick={(node: KnowledgeNode) => {
                if (node.type === "model") {
                  // 先尝试 model.id，再尝试去除前缀
                  const target = models.find((m) => m.nodeId === node.id);
                  if (target) setSelectedModel(target.id);
                }
              }}
            />
          </div>
          <div className="mt-4 text-xs text-gray-500 dark:text-dark-muted">
            💡 提示：拖拽节点 / 滚轮缩放 / 悬停看描述 / 点击模型节点进入学习
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          {/* 模型详情 */}
          {selected && (
            <>
              <div className="card">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-xs text-gray-500 dark:text-dark-muted mb-1">
                      {selected.category} · 物理模型
                    </div>
                    <h2 className="text-2xl font-bold">{selected.name}</h2>
                    <p className="text-sm text-gray-600 dark:text-dark-muted mt-2 leading-relaxed">
                      {selected.description}
                    </p>
                  </div>
                  {mastery && (
                    <div className="shrink-0 text-center">
                      <div
                        className={`w-20 h-20 rounded-full border-4 flex items-center justify-center font-bold text-xl ${
                          mastery.masteryLevel >= 70
                            ? "border-accent-green text-accent-green"
                            : mastery.masteryLevel >= 40
                            ? "border-accent-orange text-accent-orange"
                            : "border-accent-red text-accent-red"
                        }`}
                      >
                        {mastery.masteryLevel}%
                      </div>
                      <div className="text-xs mt-1 text-gray-500 dark:text-dark-muted">
                        已做 {mastery.questionsDone} 题
                      </div>
                    </div>
                  )}
                </div>
                {/* 核心公式 */}
                <div className="mt-5">
                  <div className="font-medium mb-2 text-sm">📐 核心公式</div>
                  <div className="grid md:grid-cols-2 gap-3">
                    {selected.coreFormulas.map((f, i) => (
                      <div
                        key={i}
                        className="bg-gray-50 dark:bg-dark-bg rounded-lg p-3 border border-gray-200 dark:border-dark-border"
                      >
                        <div className="font-mono text-lg">
                          <MathJax tex={f.tex} />
                        </div>
                        <div className="text-xs text-gray-500 dark:text-dark-muted mt-1">
                          {f.note}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {/* 因果链 */}
                <div className="mt-5">
                  <div className="font-medium mb-2 text-sm">🔗 因果链</div>
                  <div className="space-y-2">
                    {selected.causalChains.map((c, i) => (
                      <div
                        key={i}
                        className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-800 text-sm"
                      >
                        <div className="font-medium text-blue-700 dark:text-blue-300 mb-1">
                          {c.name}
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {c.steps.map((s, j) => (
                            <span
                              key={j}
                              className="inline-flex items-center gap-1 px-2 py-1 bg-white dark:bg-dark-card rounded border border-gray-200 dark:border-dark-border text-xs"
                            >
                              {s}
                              {j < c.steps.length - 1 && <span className="text-primary-500">→</span>}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {/* 常见陷阱 */}
                <div className="mt-5">
                  <div className="font-medium mb-2 text-sm">⚠ 常见陷阱 & 错因</div>
                  <div className="space-y-2">
                    {selected.tips.map((t, i) => (
                      <div
                        key={i}
                        className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3 border border-red-200 dark:border-red-800 text-sm"
                      >
                        <div className="font-medium text-red-700 dark:text-red-300 mb-1">
                          Q: {t.q}
                        </div>
                        <div className="text-xs">
                          <b className="text-gray-700 dark:text-dark-muted">想法：</b>
                          {t.idea}
                        </div>
                        <ul className="text-xs mt-1 space-y-0.5 list-disc list-inside">
                          {t.errors.map((e, j) => (
                            <li key={j} className="text-red-600 dark:text-red-400">
                              {e}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 题目列表 */}
              <div className="card">
                <div className="flex items-center justify-between mb-3">
                  <div className="font-bold text-lg">📝 本模型题目</div>
                  <div className="text-xs text-gray-500 dark:text-dark-muted">
                    共 {modelQuestions.length} 道，每道含多解法、因果链分析
                  </div>
                </div>
                {modelQuestions.length === 0 ? (
                  <div className="text-gray-500 dark:text-dark-muted text-sm text-center py-8">
                    此模型暂无题目数据
                  </div>
                ) : (
                  <div className="space-y-2">
                    {modelQuestions.map((q, i) => (
                      <Link
                        key={q.id}
                        href={`/gaokao/solve/${q.id}`}
                        className="block p-4 rounded-lg border border-gray-200 dark:border-dark-border hover:border-primary-400 hover:shadow-md transition group"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 shrink-0 rounded-full bg-primary-100 dark:bg-primary-900 text-primary-700 flex items-center justify-center text-sm font-bold group-hover:bg-primary-600 group-hover:text-white transition">
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
                                  className="text-[10px] px-2 py-0.5 rounded-full bg-primary-100 dark:bg-primary-900 text-primary-700"
                                >
                                  {k}
                                </span>
                              ))}
                            </div>
                          </div>
                          <span className="text-primary-500 group-hover:translate-x-1 transition shrink-0 mt-2">
                            开始 →
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
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
