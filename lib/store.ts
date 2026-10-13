"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  ExamType,
  GuideMode,
  ModelMastery,
  PersistedState,
  SolveSession,
} from "./types";
import { gaokaoQuestions } from "./data/gaokao-questions";
import { zhongkaoQuestions } from "./data/zhongkao-questions";

const QUESTIONS = {
  gaokao: gaokaoQuestions,
  zhongkao: zhongkaoQuestions,
};

interface AppState extends PersistedState {
  // UI
  currentExam: ExamType;
  currentModel?: string;
  // 当前解题
  activeSession?: SolveSession;
  // Actions
  setTheme: (t: "light" | "dark") => void;
  setGuideMode: (m: GuideMode) => void;
  setExam: (e: ExamType) => void;
  setModel: (m?: string) => void;
  startSession: (questionId: string) => void;
  submitCausalChain: (correct: boolean) => void;
  submitStep: (step: number, answer: string, correct: boolean, feedback: string) => void;
  finishSession: (score: number) => void;
  incrementMastery: (modelId: string, correct: boolean) => void;
  updateModelFullness: (modelId: string, fullness: number) => void;
  scheduleReview: (modelId: string, questionId: string) => void;
  getGuideModeForModel: (modelId: string) => GuideMode;
}

function defaultState(): PersistedState {
  return {
    theme: "light",
    guideMode: "full",
    modelMastery: {},
    solveHistory: [],
    reviewQueue: [],
  };
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      ...defaultState(),
      currentExam: "gaokao",

      setTheme: (t) => set({ theme: t }),
      setGuideMode: (m) => set({ guideMode: m }),
      setExam: (e) => set({ currentExam: e }),
      setModel: (m) => set({ currentModel: m }),

      startSession: (questionId) => {
        const question = [
          ...gaokaoQuestions,
          ...zhongkaoQuestions,
        ].find((q) => q.id === questionId);
        const guideMode = question
          ? get().getGuideModeForModel(question.model)
          : "full";
        set({
          activeSession: {
            questionId,
            guideMode,
            answers: new Map(),
            causalChainCorrect: null,
            startAt: Date.now(),
          },
        });
      },

      submitCausalChain: (correct) => {
        const s = get().activeSession;
        if (!s) return;
        const session = { ...s, causalChainCorrect: correct };
        set({ activeSession: session });
      },

      submitStep: (step, answer, correct, feedback) => {
        const s = get().activeSession;
        if (!s) return;
        const answers = new Map(s.answers);
        answers.set(step, {
          step,
          mode: s.guideMode,
          answer,
          correct,
          feedback,
          timestamp: Date.now(),
        });
        set({ activeSession: { ...s, answers } });
      },

      finishSession: (score) => {
        const s = get().activeSession;
        if (!s) return;
        // 更新掌握度
        const question = [
          ...gaokaoQuestions,
          ...zhongkaoQuestions,
        ].find((q) => q.id === s.questionId);
        if (question) {
          get().incrementMastery(question.model, score >= 0.8);
          get().scheduleReview(question.model, question.id);
        }
        // 更新历史
        const history = [
          { sessionId: `${s.questionId}_${s.startAt}`, questionId: s.questionId, score, ts: Date.now() },
          ...get().solveHistory,
        ].slice(0, 100);
        set({ activeSession: undefined, solveHistory: history });
      },

      incrementMastery: (modelId, correct) => {
        const mm = { ...get().modelMastery };
        const prev: ModelMastery = mm[modelId] || {
          modelId,
          questionsDone: 0,
          causalChainCorrectRate: 0,
          stepCorrectRate: 0,
          lastPracticeAt: 0,
          masteryLevel: 0,
        };
        const newDone = prev.questionsDone + 1;
        const newStepRate = (prev.stepCorrectRate * prev.questionsDone + (correct ? 1 : 0)) / newDone;
        const newMastery = Math.min(100, prev.masteryLevel + (correct ? 12 : -4));
        mm[modelId] = {
          ...prev,
          questionsDone: newDone,
          stepCorrectRate: newStepRate,
          lastPracticeAt: Date.now(),
          masteryLevel: newMastery,
        };
        set({ modelMastery: mm });
      },

      updateModelFullness: (modelId, fullness) => {
        // fullness 在知识地图节点中，暂时存到 mastery 里
        get().incrementMastery(modelId, fullness >= 70);
      },

      scheduleReview: (modelId, questionId) => {
        const now = Date.now();
        // 简单间隔：1天、3天、7天
        const intervals = [1, 3, 7].map((d) => now + d * 24 * 60 * 60 * 1000);
        const queue = [
          ...get().reviewQueue.filter((r) => r.modelId !== modelId),
          ...intervals.map((dueAt) => ({ questionId, modelId, dueAt })),
        ].slice(0, 50);
        set({ reviewQueue: queue });
      },

      getGuideModeForModel: (modelId) => {
        const mm = get().modelMastery[modelId];
        const done = mm?.questionsDone ?? 0;
        if (done < 3) return "full";
        if (done < 6) return "semi";
        return "bare";
      },
    }),
    {
      name: "illuphy-state",
      partialize: (state) => ({
        theme: state.theme,
        modelMastery: state.modelMastery,
        solveHistory: state.solveHistory,
        reviewQueue: state.reviewQueue,
      }),
    }
  )
);

export function getModelMastery(modelId: string): ModelMastery {
  return (
    useAppStore.getState().modelMastery[modelId] || {
      modelId,
      questionsDone: 0,
      causalChainCorrectRate: 0,
      stepCorrectRate: 0,
      lastPracticeAt: 0,
      masteryLevel: 0,
    }
  );
}

export function getDueReviews() {
  const now = Date.now();
  return useAppStore
    .getState()
    .reviewQueue.filter((r) => r.dueAt <= now);
}

export { QUESTIONS };
