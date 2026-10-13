"use client";

import { useState } from "react";
import { MathJax } from "./MathJax";
import { useAppStore } from "@/lib/store";

export function CausalChainAnalysis({
  causalChain,
  questionTitle,
  questionStem,
  onComplete,
  onSkip,
}: {
  causalChain: {
    correct: string;
    distractors: string[];
    options: { id: string; text: string; correct: boolean; feedback: string }[];
  };
  questionTitle: string;
  questionStem: string;
  onComplete: (correct: boolean) => void;
  onSkip: () => void;
}) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const submitCausalChain = useAppStore((s) => s.submitCausalChain);

  const selected = causalChain.options.find((o) => o.id === selectedId);
  const isCorrect = selected?.correct ?? false;

  function submit() {
    if (!selectedId) return;
    submitCausalChain(isCorrect);
    setRevealed(true);
  }

  return (
    <div className="bg-gradient-to-br from-primary-50 to-white dark:from-primary-950/40 dark:to-dark-card rounded-xl border-2 border-primary-200 dark:border-primary-900 p-5 space-y-4">
      <div className="flex items-start gap-3">
        <div className="shrink-0 w-10 h-10 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold">
          🔗
        </div>
        <div>
          <h3 className="font-bold text-lg text-primary-800 dark:text-primary-200">
            ⚠ 强制因果链分析
          </h3>
          <p className="text-sm text-gray-600 dark:text-dark-muted mt-1">
            先别急着选选项。物理做题的<b>第一性原理</b>是判断"本题该选什么规律"。
            选错主线，哪怕答案算对了也算<b>模型错误</b>。
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-dark-bg rounded-lg p-4 border border-gray-200 dark:border-dark-border">
        <div className="text-xs text-gray-500 dark:text-dark-muted mb-1">题目</div>
        <div className="font-medium text-base">
          {questionTitle}
        </div>
        <div className="text-sm mt-2 leading-relaxed">
          <MathJax tex={questionStem} />
        </div>
      </div>

      <div>
        <div className="font-medium mb-2">这道题的解题主线应该是哪一条？</div>
        <div className="space-y-2">
          {causalChain.options.map((opt) => {
            const isSel = selectedId === opt.id;
            let border = "border-gray-200 dark:border-dark-border hover:border-primary-400";
            if (revealed && isSel && opt.correct) border = "border-accent-green bg-green-50 dark:bg-green-900/20";
            if (revealed && isSel && !opt.correct) border = "border-accent-red bg-red-50 dark:bg-red-900/20";
            if (revealed && !isSel && opt.correct) border = "border-accent-green/50 bg-green-50/50";
            return (
              <label
                key={opt.id}
                className={`flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer transition ${border}`}
              >
                <input
                  type="radio"
                  name="causal"
                  checked={isSel}
                  disabled={revealed}
                  onChange={() => setSelectedId(opt.id)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="text-sm leading-relaxed">{opt.text}</div>
                  {revealed && (
                    <div
                      className={`text-xs mt-1 font-medium ${
                        opt.correct ? "text-accent-green" : "text-accent-red"
                      }`}
                    >
                      {opt.correct ? "✓ 正确主线" : "✗ 错误主线"}
                    </div>
                  )}
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {revealed && selected && (
        <div
          className={`p-4 rounded-lg border-l-4 ${
            selected.correct
              ? "bg-green-50 dark:bg-green-900/20 border-accent-green"
              : "bg-red-50 dark:bg-red-900/20 border-accent-red"
          }`}
        >
          <div className="font-medium mb-1">💡 反馈</div>
          <div className="text-sm">{selected.feedback}</div>
          {!selected.correct && (
            <div className="mt-3 pt-3 border-t border-red-200 dark:border-red-800 text-sm">
              <div className="font-medium text-red-700 dark:text-red-400">正确主线</div>
              <div className="mt-1">{causalChain.correct}</div>
              {causalChain.distractors.length > 0 && (
                <div className="mt-2">
                  <div className="text-xs text-gray-500 dark:text-dark-muted">迷惑项</div>
                  <ul className="list-disc list-inside text-xs mt-1 space-y-0.5">
                    {causalChain.distractors.map((d, i) => (
                      <li key={i}>{d}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <div className="flex gap-3">
        {!revealed ? (
          <>
            <button onClick={submit} disabled={!selectedId} className="btn-primary">
              确认主线，进入解题
            </button>
            <button onClick={onSkip} className="btn-secondary">
              跳过（不推荐）
            </button>
          </>
        ) : (
          <button
            onClick={() => onComplete(isCorrect)}
            className={isCorrect ? "btn-success" : "btn-primary"}
          >
            {isCorrect ? "开始解题 →" : "我知道了，开始解题 →"}
          </button>
        )}
      </div>
    </div>
  );
}
