// ==================== 类型定义 ====================

export type NodeType = "concept" | "law" | "model" | "method" | "experiment" | "pitfall";
export type ExamType = "zhongkao" | "gaokao";
export type GuideMode = "full" | "semi" | "bare";

// 知识地图节点
export interface KnowledgeNode {
  id: string;
  label: string;
  type: NodeType;
  group: string;
  description?: string;
  fullness?: number; // 0-100 模型完整度
  prerequisites?: string[];
}

// 知识地图边
export interface KnowledgeEdge {
  source: string;
  target: string;
  type: "causes" | "uses" | "contradicts";
  label?: string;
}

// 物理模型定义
export interface PhysicsModel {
  id: string;
  exam: ExamType;
  name: string;
  category: string;
  description: string;
  coreFormulas: { tex: string; note: string }[];
  causalChains: CausalChain[];
  tips: { q: string; idea: string; errors: string[] }[];
  nodeId: string; // 关联知识地图节点
}

export interface CausalChain {
  id: string;
  name: string;
  steps: string[];
  correctness: number; // 学生在这条链上的历史正确率
}

// 题目
export interface StepGuideOption {
  text: string;
  correct?: boolean;
}

export interface StepFullGuide {
  question: string;
  options?: StepGuideOption[];
  answerIndex?: number;
  answerText?: string;
  hint?: string;
}

export interface StepSemiGuide {
  title: string;
  prompts: string[];
}

export interface Equation {
  id: number;
  object: string;
  process: string;
  law: string;
  expr: string; // nerdamer 可解析的表达式
  latex?: string;
  symbolVariants?: string[]; // 允许的符号组合
}

export interface Solution {
  id: string;
  name: string;
  equations: Omit<Equation, "object" | "process" | "symbolVariants">[];
}

export interface Step6Data {
  unknowns: string[];
  equationCount: number;
  equations: Equation[];
  solutions: Solution[];
}

export interface QuestionStep {
  step: number;
  name: string;
  fullGuide?: StepFullGuide;
  semiGuide?: StepSemiGuide;
  // 第6步列方程
  equations?: Step6Data;
  // 画图提示
  drawHints?: string[];
}

export interface QuestionVariant {
  stem: string;
  answer: string;
}

export interface Question {
  id: string;
  exam: ExamType;
  model: string; // 对应 PhysicsModel.id
  title: string;
  stem: string;
  keywords: string[];
  causalChain: {
    correct: string;
    distractors: string[];
    options: { id: string; text: string; correct: boolean; feedback: string }[];
  };
  steps: QuestionStep[];
  variants: QuestionVariant[];
}

// 学生作答记录
export interface StepAnswer {
  step: number;
  mode: GuideMode;
  answer: string; // 学生的答案 (LaTeX / 选择编号 / 文本)
  correct: boolean | null;
  feedback: string;
  timestamp: number;
}

export interface SolveSession {
  questionId: string;
  guideMode: GuideMode;
  answers: Map<number, StepAnswer>;
  causalChainCorrect: boolean | null;
  startAt: number;
  completedAt?: number;
}

// 学生模型掌握度
export interface ModelMastery {
  modelId: string;
  questionsDone: number;
  causalChainCorrectRate: number;
  stepCorrectRate: number;
  lastPracticeAt: number;
  masteryLevel: number; // 0-100
}

// 存储结构
export interface PersistedState {
  theme: "light" | "dark";
  guideMode: GuideMode;
  modelMastery: Record<string, ModelMastery>;
  solveHistory: { sessionId: string; questionId: string; score: number; ts: number }[];
  reviewQueue: { questionId: string; modelId: string; dueAt: number }[];
}
