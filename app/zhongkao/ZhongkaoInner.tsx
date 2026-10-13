"use client";

import { useState } from "react";
import Link from "next/link";
import { KnowledgeMap } from "@/components/KnowledgeMap";
import { getModelsByExam } from "@/lib/data/models";
import { getModelMastery } from "@/lib/store";
import type { KnowledgeNode } from "@/lib/types";
import { zhongkaoQuestions } from "@/lib/data/zhongkao-questions";
import { MathJax } from "@/components/MathJax";

export function ZhongkaoInner() {
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const models = getModelsByExam("zhongkao");
  const questionsByModel = (mId: string) => zhongkaoQuestions.filter((q) => q.model === mId);
  const selected = selectedModel ? models.find((m) => m.id === selectedModel) : null;
  const mastery = selectedModel ? getModelMastery(selectedModel) : null;
  const modelQuestions = selectedModel ? questionsByModel(selectedModel) : [];

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
      {/* Tabs */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setSelectedModel(null)}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
            !selectedModel
              ? "bg-accent-orange text-white"
              : "bg-gray-100 dark:bg-dark-border hover:bg-gray-200"
          }`}
        >
          🗺 知识地图
        </button>
        {models.map((m) => {
          const mm = getModelMastery(m.id);
          const fullness = mm.masteryLevel;
          const color = fullness >= 70 ? "bg-accent-green" : fullness >= 40 ? "bg-accent-orange" : "bg-accent-red";
          return (
            <button
              key={m.id}
              onClick={() => setSelectedModel(m.id)}
              className={`px-3 py-2 rounded-lg font-medium text-sm transition flex items-center gap-2 ${
                selectedModel === m.id
                  ? "bg-accent-orange text-white"
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
          <h2 className="text-xl font-bold mb-4">📚 中考物理 · 因果知识地图</h2>
          <div className="h-[550px] border border-gray-200 dark:border-dark-border rounded-lg bg-gray-50 dark:bg-dark-bg">
            <KnowledgeMap
              exam="zhongkao"
              onNodeClick={(node: KnowledgeNode) => {
                if (node.type === "model") {
                  const target = models.find((m) => m.nodeId === node.id);
                  if (target) setSelectedModel(target.id);
                }
              }}
            />
          </div>
          <div className="mt-4 text-xs text-gray-500 dark:text-dark-muted">
            💡 拖拽节点 / 滚轮缩放 / 悬停看描述 / 点击模型节点进入学习
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          {selected && (
            <>
              <div className="card">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-xs text-gray-500 dark:text-dark-muted mb-1">
                      {selected.category} · 物理模型
                    </div>
                    <h2 className="text-2xl font-bold text-accent-orange">{selected.name}</h2>
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
                <div className="mt-5">
                  <div className="font-medium mb-2 text-sm">🔗 因果链</div>
                  {selected.causalChains.map((c, i) => (
                    <div
                      key={i}
                      className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-3 border border-orange-200 dark:border-orange-800 text-sm mb-2"
                    >
                      <div className="font-medium text-accent-orange mb-1">{c.name}</div>
                      <div className="flex flex-wrap gap-1.5">
                        {c.steps.map((s, j) => (
                          <span
                            key={j}
                            className="inline-flex items-center gap-1 px-2 py-1 bg-white dark:bg-dark-card rounded border border-gray-200 dark:border-dark-border text-xs"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-5">
                  <div className="font-medium mb-2 text-sm">⚠ 常见陷阱</div>
                  {selected.tips.map((t, i) => (
                    <div
                      key={i}
                      className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3 border border-red-200 dark:border-red-800 text-sm mb-2"
                    >
                      <div className="font-medium text-red-700 dark:text-red-300 mb-1">Q: {t.q}</div>
                      <div className="text-xs">{t.idea}</div>
                      <ul className="text-xs mt-1 space-y-0.5 list-disc list-inside">
                        {t.errors.map((e, j) => (
                          <li key={j} className="text-red-600 dark:text-red-400">{e}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card">
                <div className="font-bold text-lg mb-3">📝 本模型题目（点击开始解题）</div>
                {modelQuestions.length === 0 ? (
                  <div className="text-gray-500 dark:text-dark-muted text-sm text-center py-8">
                    此模型暂无题目数据
                  </div>
                ) : (
                  <div className="space-y-2">
                    {modelQuestions.map((q, i) => (
                      <Link
                        key={q.id}
                        href={`/zhongkao/solve/${q.id}`}
                        className="block p-4 rounded-lg border border-gray-200 dark:border-dark-border hover:border-accent-orange hover:shadow-md transition group"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 shrink-0 rounded-full bg-accent-orange/10 text-accent-orange flex items-center justify-center text-sm font-bold group-hover:bg-accent-orange group-hover:text-white transition">
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
                                  className="text-[10px] px-2 py-0.5 rounded-full bg-orange-100 dark:bg-orange-900 text-accent-orange"
                                >
                                  {k}
                                </span>
                              ))}
                            </div>
                          </div>
                          <span className="text-accent-orange group-hover:translate-x-1 transition shrink-0 mt-2">
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
