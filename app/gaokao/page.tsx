import { ExamPageShell, getExamPageConfig } from "@/components/ExamPageShell";

export default function GaokaoPage() {
  return <ExamPageShell config={getExamPageConfig("gaokao")} />;
}
