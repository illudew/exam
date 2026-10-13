// 变式训练 + 交错训练 + 间隔复习引擎

import { gaokaoQuestions } from "./data/gaokao-questions";
import { zhongkaoQuestions } from "./data/zhongkao-questions";
import type { ExamType, Question } from "./types";
import { useAppStore } from "./store";

const ALL: Record<ExamType, Question[]> = {
  gaokao: gaokaoQuestions,
  zhongkao: zhongkaoQuestions,
};

// 根据已做题目推荐同模型的变式
export function getVariantsFor(modelId: string, exam: ExamType, doneIds: string[]): Question[] {
  return ALL[exam].filter((q) => q.model === modelId && !doneIds.includes(q.id));
}

// 交错训练：强制插入不同模型的题目
export function getInterleavedQuestions(exam: ExamType, currentModelId: string, excludeIds: string[]): Question[] {
  const others = ALL[exam].filter(
    (q) => q.model !== currentModelId && !excludeIds.includes(q.id)
  );
  if (others.length === 0) return [];
  // 随机选 1-2 道不同模型的题
  const shuffled = [...others].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 2);
}

// 获取到期的间隔复习题
export function getDueReviewQuestions(exam: ExamType): (Question & { dueAt: number })[] {
  const state = useAppStore.getState();
  const now = Date.now();
  return state.reviewQueue
        .filter((r) => r.dueAt <= now)
    .map((r) => {
      const q = ALL[exam].find((q) => q.id === r.questionId);
      return q ? { ...q, dueAt: r.dueAt } : null;
    })
    .filter(Boolean) as (Question & { dueAt: number })[];
}

// 简单复习推送：返回前 3 个到期题
export function getReviewPush(exam: ExamType): (Question & { dueAt: number })[] {
  return getDueReviewQuestions(exam).slice(0, 3);
}

// 为"推荐下一题"混合模型：60% 同模型变式 + 40% 跨模型交错
export function getNextQuestion(exam: ExamType, currentModelId: string, doneIds: string[]): Question | null {
  const variants = getVariantsFor(currentModelId, exam, doneIds);
  const interleaved = getInterleavedQuestions(exam, currentModelId, doneIds);

  if (variants.length === 0 && interleaved.length === 0) return null;
  if (variants.length === 0) return interleaved[0];
  if (interleaved.length === 0) return variants[0];

  // 60/40
  return Math.random() < 0.6 ? variants[0] : interleaved[0];
}
