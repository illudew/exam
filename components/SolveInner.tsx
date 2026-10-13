"use client";

import { useState } from "react";
import type { ExamType, Question } from "@/lib/types";
import { CausalChainAnalysis } from "./CausalChainAnalysis";
import { StepSolver } from "./StepSolver";
import { useAppStore } from "@/lib/store";
import Link from "next/link";

export function SolveInner({ question, exam }: { question: Question; exam: ExamType }) {
  const [chainDone, setChainDone] = useState(false);
  const [guideMode, setGuideMode] = useState(question ? useAppStore.getState().getGuideModeForModel(question.model) : "full");
  const [showModePicker, setShowModePicker] = useState(false);
  const startSession = useAppStore((s) => s.startSession);

  // 初始化 session
  useState(() => {
    startSession(question.id);
  });

  function handleChainComplete(correct: boolean) {
    setChainDone(true);
  }

  function onFinish(_score: number) {
    // 可以跳转到下一题或返回模型页
  }

  return (
    <div>
      {/* 引导模式切换 */}
      <div className="flex items-center gap-2 mb-4 text-xs">
        <span className="text-gray-500 dark:text-dark-muted">当前引导：</span>
        {(["full", "semi", "bare"] as const).map((m) => {
          const label = m === "full" ? "全引导" : m === "semi" ? "半引导" : "裸题";
          const icon = m === "full" ? "🟢" : m === "semi" ? "🟡" : "🔴";
          const active = guideMode === m;
          return (
            <button
              key={m}
              onClick={() => setGuideMode(m)}
              className={`px-3 py-1 rounded-full font-medium transition ${
                active
                  ? "bg-primary-600 text-white"
                  : "bg-gray-100 dark:bg-dark-border hover:bg-gray-200"
              }`}
            >
              {icon} {label}
            </button>
          );
        })}
        <span className="ml-auto text-gray-400">
          系统推荐：{guideMode === "full" ? "前 3 道题（建模期）" : guideMode === "semi" ? "4-6 道题（巩固期）" : "7 道起（迁移期）"}
        </span>
      </div>

      {!chainDone ? (
        <CausalChainAnalysis
          causalChain={question.causalChain}
          questionTitle={question.title}
          questionStem={question.stem}
          onComplete={handleChainComplete}
          onSkip={() => setChainDone(true)}
        />
      ) : (
        <StepSolver question={question} guideMode={guideMode} onFinish={onFinish} />
      )}
    </div>
  );
}
