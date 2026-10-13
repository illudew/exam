"use client";

import { useMemo, useState } from "react";
import type { Question, QuestionStep, GuideMode } from "@/lib/types";
import { MathJax, MathText } from "./MathJax";
import { HandwritingPad } from "./HandwritingPad";
import { LaTeXInput, EquationBuilder } from "./LaTeXInput";
import { judgeSolutionMatch, generateEquationFeedback } from "@/lib/judge";
import { useAppStore } from "@/lib/store";

const STEP_NAMES = [
  "读题",
  "选对象",
  "分过程",
  "画图",
  "选规律",
  "列方程",
  "解方程",
  "检验",
];

interface Props {
  question: Question;
  guideMode: GuideMode;
  onFinish: (score: number) => void;
}

export function StepSolver({ question, guideMode, onFinish }: Props) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [stepResults, setStepResults] = useState<Record<number, { correct: boolean; feedback: string } | null>>({});
  const [showFinal, setShowFinal] = useState(false);
  const submitStep = useAppStore((s) => s.submitStep);
  const finishSession = useAppStore((s) => s.finishSession);

  const step: QuestionStep = question.steps[currentStep];
  const isFirst = currentStep === 0;
  const isLast = currentStep === question.steps.length - 1;

  const guideModeInfo = {
    full: { name: "全引导模式", icon: "🟢", desc: "每一步给出选项/填空" },
    semi: { name: "半引导模式", icon: "🟡", desc: "只给标题，自己写答案" },
    bare: { name: "裸题模式", icon: "🔴", desc: "独立解题 + 步骤归因" },
  };

  function handleNext() {
    if (currentStep < question.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // 提交最终分数
      const results = Object.values(stepResults).filter(Boolean) as { correct: boolean }[];
      const score = results.length
        ? results.filter((r) => r.correct).length / results.length
        : 0.5;
      finishSession(score);
      onFinish(score);
      setShowFinal(true);
    }
  }

  function handlePrev() {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  }

  function submitStepAnswer(stepNum: number, answer: any, correct: boolean, feedback: string) {
    submitStep(stepNum, typeof answer === "string" ? answer : JSON.stringify(answer), correct, feedback);
    setAnswers((p) => ({ ...p, [stepNum]: answer }));
    setStepResults((p) => ({ ...p, [stepNum]: { correct, feedback } }));
  }

  function getStepStatus(idx: number) {
    if (idx < currentStep) {
      const r = stepResults[idx];
      if (!r) return "done";
      return r.correct ? "done" : "error";
    }
    if (idx === currentStep) return "active";
    return "pending";
  }

  if (showFinal) {
    return <FinalReview question={question} results={stepResults} onClose={() => setShowFinal(false)} onFinish={onFinish} />;
  }

  return (
    <div className="flex flex-col lg:flex-row gap-5 w-full">
      {/* 左侧步骤面板 */}
      <div className="lg:w-64 shrink-0">
        <div className="card">
          <div className="text-xs font-medium text-gray-500 dark:text-dark-muted mb-3">
            当前引导模式
          </div>
          <div className="mb-4 p-2 rounded-lg bg-gray-50 dark:bg-dark-bg text-sm">
            {guideModeInfo[guideMode].icon} {guideModeInfo[guideMode].name}
            <div className="text-xs text-gray-500 dark:text-dark-muted mt-0.5">
              {guideModeInfo[guideMode].desc}
            </div>
          </div>

          <div className="space-y-1">
            {STEP_NAMES.map((name, idx) => {
              const status = getStepStatus(idx);
              const cls =
                status === "active"
                  ? "step-active"
                  : status === "done"
                  ? "step-done"
                  : status === "error"
                  ? "step-error"
                  : "step-pending";
              return (
                <button
                  key={idx}
                  onClick={() => idx <= currentStep && setCurrentStep(idx)}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition ${cls} ${
                    idx <= currentStep ? "cursor-pointer" : "cursor-not-allowed opacity-50"
                  }`}
                >
                  <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">
                    {idx + 1}
                  </span>
                  <span>{name}</span>
                  {status === "done" && <span className="ml-auto text-xs">✓</span>}
                  {status === "error" && <span className="ml-auto text-xs">✗</span>}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 右侧答题面板 */}
      <div className="flex-1 min-w-0 space-y-4">
        {/* 题干提示 */}
        {currentStep <= 1 && (
          <div className="card bg-primary-50/50 dark:bg-primary-950/30">
            <div className="text-xs text-gray-500 dark:text-dark-muted mb-1">题目</div>
            <div className="font-medium">{question.title}</div>
            <div className="mt-2 text-sm">
              <MathJax tex={question.stem} />
            </div>
            <div className="flex gap-1 mt-2 flex-wrap">
              {question.keywords.map((k) => (
                <span
                  key={k}
                  className="text-xs px-2 py-0.5 rounded-full bg-accent-orange/20 text-accent-orange font-medium"
                >
                  ⚡ {k}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 步骤渲染 */}
        <div className="card">
          <StepPanel
            step={step}
            stepIndex={currentStep}
            question={question}
            guideMode={guideMode}
            answer={answers[currentStep]}
            onSubmit={(a, correct, feedback) => submitStepAnswer(currentStep + 1, a, correct, feedback)}
            existingResult={stepResults[currentStep]}
          />
        </div>

        {/* 导航 */}
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={handlePrev}
            disabled={isFirst}
            className="btn-secondary"
          >
            ← 上一步
          </button>
          <div className="text-xs text-gray-500 dark:text-dark-muted">
            {currentStep + 1} / {question.steps.length}
          </div>
          <button
            onClick={handleNext}
            disabled={!stepResults[currentStep] && currentStep < question.steps.length - 1}
            className="btn-primary"
          >
            {isLast ? "完成解题 →" : "下一步 →"}
          </button>
        </div>
      </div>
    </div>
  );
}

function StepPanel({
  step,
  stepIndex,
  question,
  guideMode,
  answer,
  onSubmit,
  existingResult,
}: {
  step: QuestionStep;
  stepIndex: number;
  question: Question;
  guideMode: GuideMode;
  answer: any;
  onSubmit: (a: any, correct: boolean, feedback: string) => void;
  existingResult: { correct: boolean; feedback: string } | null;
}) {
  const [localAnswer, setLocalAnswer] = useState<any>(answer ?? (guideMode === "full" ? null : ""));
  const [submitted, setSubmitted] = useState(!!existingResult);

  function doSubmit() {
    setSubmitted(true);
  }

  const isStep6 = stepIndex === 5; // 第6步列方程

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-primary-600 text-white flex items-center justify-center text-sm font-bold">
          {step.step}
        </div>
        <h3 className="font-bold text-lg">
          第 {step.step} 步：{step.name}
        </h3>
      </div>

      {/* 第6步特殊：列方程 4 层子步骤 */}
      {isStep6 && step.equations && (
        <div className="space-y-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 text-sm">
            <b>6.1 方程数量判定：</b> 未知量 ={" "}
            <span className="font-mono font-bold">
              {step.equations.unknowns.join(", ")}
            </span>
            ，需要独立方程数 = {step.equations.equationCount}。
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
            <div className="font-medium text-sm mb-2">6.2+6.3 方程归属矩阵</div>
            <EquationBuilder
              equations={localAnswer || step.equations.equations.map((e) => ({ ...e, expr: "" }))}
              onChange={setLocalAnswer}
              unknowns={step.equations.unknowns}
              required={step.equations.equationCount}
            />
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
            <div className="font-medium text-sm mb-2">6.5 方程组闭合检查 & 6.4 每个方程的独立判定</div>
            {!submitted ? (
              <button
                onClick={() => {
                  // 判定学生方程与所有标准解法的匹配
                  const studentExprs = (localAnswer || []).map((e: any) => e.expr).filter(Boolean);
                  const stdExprs = step.equations.solutions.flatMap((s) => s.equations.map((e) => e.expr));
                  const result = judgeSolutionMatch(studentExprs, step.equations.solutions);
                  const feedback = generateEquationFeedback(
                    result.perEquation,
                    step.equations.equationCount,
                    result.matchedSolution
                  );
                  const score = result.score;
                  setSubmitted(true);
                  onSubmit(studentExprs, result.passed, feedback + ` (匹配度 ${Math.round(score * 100)}%)`);
                }}
                disabled={!localAnswer || localAnswer.length < 1}
                className="btn-primary"
              >
                提交方程组，判定
              </button>
            ) : (
              <StepFeedback result={existingResult!} />
            )}
          </div>

          {/* 标准解法展示（提交后） */}
          {submitted && step.equations && (
            <div className="mt-3">
              <div className="text-xs font-medium text-gray-500 dark:text-dark-muted mb-2">
                📚 多解法参考（至少有 {step.equations.solutions.length} 种）：
              </div>
              <div className="grid md:grid-cols-2 gap-3">
                {step.equations.solutions.map((sol) => (
                  <details
                    key={sol.id}
                    className="border border-gray-200 dark:border-dark-border rounded-lg p-2 bg-gray-50 dark:bg-dark-bg"
                  >
                    <summary className="cursor-pointer font-medium text-sm">
                      解法 {sol.id}：{sol.name}
                    </summary>
                    <div className="mt-2 space-y-2">
                      {sol.equations.map((eq, i) => (
                        <div key={i} className="text-xs font-mono bg-white dark:bg-dark-card p-2 rounded border">
                          <MathJax tex={eq.expr} />
                        </div>
                      ))}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 第4步画图：强制手写板 */}
      {stepIndex === 3 && (
        <div className="space-y-3">
          {step.drawHints && (
            <div className="bg-gray-50 dark:bg-dark-bg rounded-lg p-3 text-sm">
              <div className="font-medium mb-1">🎯 画图提示：</div>
              <ul className="list-disc list-inside space-y-0.5 text-gray-700 dark:text-dark-muted">
                {step.drawHints.map((h, i) => (
                  <li key={i}>{h}</li>
                ))}
              </ul>
            </div>
          )}
          <HandwritingPad width={520} height={360} hint="在下方画板上手动画受力图、电路图或轨迹图" />
          {!submitted ? (
            <button
              onClick={() => {
                setSubmitted(true);
                onSubmit("handdrawn", true, "👍 画图是物理思维的外显。记得画：受力 + 坐标/方向标 + 已知量标注。");
              }}
              className="btn-primary"
            >
              ✅ 画好了，提交
            </button>
          ) : (
            <StepFeedback result={existingResult!} />
          )}
        </div>
      )}

      {/* 常规步骤 1-5, 7-8 的引导 */}
      {!isStep6 && stepIndex !== 3 && (
        <RegularStep
          step={step}
          guideMode={guideMode}
          localAnswer={localAnswer}
          setLocalAnswer={setLocalAnswer}
          submitted={submitted}
          result={existingResult}
          onSubmit={(a, c, f) => {
            setSubmitted(true);
            onSubmit(a, c, f);
          }}
        />
      )}
    </div>
  );
}

function RegularStep({
  step,
  guideMode,
  localAnswer,
  setLocalAnswer,
  submitted,
  result,
  onSubmit,
}: {
  step: QuestionStep;
  guideMode: GuideMode;
  localAnswer: any;
  setLocalAnswer: (v: any) => void;
  submitted: boolean;
  result: { correct: boolean; feedback: string } | null;
  onSubmit: (a: any, correct: boolean, feedback: string) => void;
}) {
  if (submitted && result) return <StepFeedback result={result} />;

  // ==== 全引导模式 ====
  if (guideMode === "full" && step.fullGuide) {
    const g = step.fullGuide;
    return (
      <div className="space-y-3">
        <div className="font-medium">{g.question}</div>
        {g.options ? (
          <div className="space-y-2">
            {g.options.map((opt, i) => (
              <label
                key={i}
                className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition ${
                  localAnswer === i
                    ? "border-primary-500 bg-primary-50 dark:bg-primary-950/40"
                    : "border-gray-200 dark:border-dark-border hover:border-primary-300"
                }`}
              >
                <input
                  type="radio"
                  checked={localAnswer === i}
                  onChange={() => setLocalAnswer(i)}
                  className="w-4 h-4"
                />
                <span className="text-sm">
                  <MathJax tex={opt.text} />
                </span>
              </label>
            ))}
          </div>
        ) : (
          <input
            className="input"
            value={localAnswer ?? ""}
            onChange={(e) => setLocalAnswer(e.target.value)}
            placeholder="填写你的答案"
          />
        )}
        {g.hint && <div className="text-xs text-gray-500 dark:text-dark-muted">💡 {g.hint}</div>}
        <button
          onClick={() => {
            const correct = g.answerIndex !== undefined
              ? localAnswer === g.answerIndex
              : g.answerText !== undefined
              ? (localAnswer ?? "").trim().toLowerCase().includes(g.answerText.toLowerCase())
              : true;
            const feedback = correct
              ? "✓ 正确！"
              : "✗ 不对，再想想。";
            onSubmit(localAnswer, correct, feedback);
          }}
          disabled={localAnswer === null || localAnswer === ""}
          className="btn-primary"
        >
          提交答案
        </button>
      </div>
    );
  }

  // ==== 半引导模式 ====
  if (guideMode === "semi" && step.semiGuide) {
    const sg = step.semiGuide;
    return (
      <div className="space-y-3">
        <div className="font-medium">{sg.title}</div>
        <div className="text-sm text-gray-600 dark:text-dark-muted space-y-1">
          {sg.prompts.map((p, i) => (
            <div key={i}>• {p}</div>
          ))}
        </div>
        <textarea
          rows={4}
          className="input font-mono text-sm"
          value={localAnswer}
          onChange={(e) => setLocalAnswer(e.target.value)}
          placeholder="自己写出你的思考过程…可以混合使用 LaTeX 如 mgh = ½mv²"
        />
        <button
          onClick={() => {
            onSubmit(localAnswer, true, "✓ 已记录。下一步将与标准解法对比归因。");
          }}
          disabled={!localAnswer || localAnswer.trim().length < 5}
          className="btn-primary"
        >
          提交我的思考
        </button>
      </div>
    );
  }

  // ==== 裸题模式 ====
  if (guideMode === "bare") {
    return (
      <div className="space-y-3">
        <div className="text-sm text-gray-600 dark:text-dark-muted">
          🔴 裸题模式：这一步你完全独立完成。提交后系统会做<b>步骤级归因</b>。
        </div>
        <textarea
          rows={5}
          className="input font-mono text-sm"
          value={localAnswer}
          onChange={(e) => setLocalAnswer(e.target.value)}
          placeholder="详细写出这一步的思考和结果…"
        />
        <button
          onClick={() => {
            // 裸题模式没有自动判定，直接通过但反馈指出可能的漏洞
            const hints: Record<number, string> = {
              0: "🔍 标准：标记所有关键词（光滑、静止、缓慢、刚好等）；区分已知量和未知量。",
              1: "🔍 标准：明确写出研究对象（是单个还是系统？），说明选择理由。",
              2: "🔍 标准：列出所有物理过程（阶段1、阶段2…），说明分界条件。",
              3: "🔍 标准：这一步必须手动画图（左侧画板），列出受力/状态量。",
              4: "🔍 标准：说明选这条规律的理由（为什么能量定理而不是牛二？）。",
              6: "🔍 标准：代入数值、解方程，写出完整步骤。",
              7: "🔍 标准：单位检查、方向检查、极限思维检验合理性。",
            };
            const feedback = hints[step.step] || "✓ 已记录。";
            onSubmit(localAnswer, true, feedback);
          }}
          disabled={!localAnswer || localAnswer.trim().length < 5}
          className="btn-primary"
        >
          提交独立思考 →
        </button>
      </div>
    );
  }

  // fallback
  return (
    <div className="space-y-3">
      <textarea
        rows={4}
        className="input font-mono text-sm"
        value={localAnswer ?? ""}
        onChange={(e) => setLocalAnswer(e.target.value)}
        placeholder="请填写这一步的答案"
      />
      <button
        onClick={() => onSubmit(localAnswer ?? "", true, "已提交")}
        disabled={!localAnswer}
        className="btn-primary"
      >
        提交
      </button>
    </div>
  );
}

function StepFeedback({ result }: { result: { correct: boolean; feedback: string } }) {
  return (
    <div
      className={`p-4 rounded-lg border-l-4 ${
        result.correct
          ? "bg-green-50 dark:bg-green-900/20 border-accent-green"
          : "bg-red-50 dark:bg-red-900/20 border-accent-red"
      }`}
    >
      <div className="font-medium mb-1">
        {result.correct ? "✓ 正确！" : "✗ 不对"}
      </div>
      <div className="text-sm">{result.feedback}</div>
    </div>
  );
}

function FinalReview({
  question,
  results,
  onClose,
  onFinish,
}: {
  question: Question;
  results: Record<number, { correct: boolean; feedback: string } | null>;
  onClose: () => void;
  onFinish: (score: number) => void;
}) {
  const entries = Object.entries(results).filter(([, r]) => r);
  const correctCount = entries.filter(([, r]) => r!.correct).length;
  const total = entries.length;
  const score = total ? correctCount / total : 0.5;

  const model = question.model;

  return (
    <div className="card space-y-6">
      <div className="text-center">
        <div className="text-5xl mb-3">{score >= 0.8 ? "🎉" : score >= 0.5 ? "💪" : "📚"}</div>
        <h2 className="text-2xl font-bold">解题完成！</h2>
        <div className="text-gray-600 dark:text-dark-muted mt-2">{question.title}</div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <StatBox label="总步骤" value={`${total}`} />
        <StatBox label="正确" value={`${correctCount}`} color="text-accent-green" />
        <StatBox
          label="正确率"
          value={`${Math.round(score * 100)}%`}
          color={score >= 0.8 ? "text-accent-green" : score >= 0.5 ? "text-accent-orange" : "text-accent-red"}
        />
      </div>

      <div>
        <div className="font-medium mb-2">步骤级反馈</div>
        <div className="space-y-2">
          {Object.entries(results)
            .filter(([, r]) => r)
            .map(([idx, r]) => (
              <div
                key={idx}
                className={`p-3 rounded border-l-2 ${
                  r!.correct
                    ? "bg-green-50 dark:bg-green-900/20 border-accent-green"
                    : "bg-red-50 dark:bg-red-900/20 border-accent-red"
                }`}
              >
                <div className="text-sm font-medium">
                  {r!.correct ? "✓" : "✗"} 第{idx}步
                </div>
                <div className="text-xs text-gray-700 dark:text-dark-muted mt-0.5">
                  {r!.feedback}
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* 变式推荐 */}
      {question.variants?.length > 0 && (
        <div>
          <div className="font-medium mb-2">🔁 变式推荐（表面不同，因果链相同）</div>
          <div className="space-y-2">
            {question.variants.map((v, i) => (
              <details
                key={i}
                className="border border-gray-200 dark:border-dark-border rounded-lg p-3 text-sm"
              >
                <summary className="cursor-pointer font-medium">变式 {i + 1}</summary>
                <div className="mt-2">
                  <MathJax tex={v.stem} />
                </div>
                <div className="mt-2 text-xs text-gray-500 dark:text-dark-muted">
                  参考答案：<MathJax tex={v.answer} />
                </div>
              </details>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-3 justify-center">
        <button onClick={onClose} className="btn-secondary">
          重新查看本题
        </button>
        <button
          onClick={() => {
            onClose();
            onFinish(score);
          }}
          className="btn-primary"
        >
          返回学习中心 →
        </button>
      </div>
    </div>
  );
}

function StatBox({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div className="text-center p-4 bg-gray-50 dark:bg-dark-bg rounded-lg">
      <div className={`text-2xl font-bold ${color || ""}`}>{value}</div>
      <div className="text-xs text-gray-500 dark:text-dark-muted mt-1">{label}</div>
    </div>
  );
}
