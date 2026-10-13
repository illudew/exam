"use client";

import { useEffect } from "react";
import { useAppStore } from "@/lib/store";

export function AppThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useAppStore((s) => s.theme);
  const setTheme = useAppStore((s) => s.setTheme);

  useEffect(() => {
    // 初始化：如果无持久化主题，跟随系统
    if (!localStorage.getItem("illuphy-state")) {
      const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
      setTheme(prefersDark ? "dark" : "light");
    }
  }, [setTheme]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return (
    <div className="min-h-screen">
      {children}
      <button
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="fixed bottom-4 right-4 z-40 w-12 h-12 rounded-full bg-white dark:bg-dark-card shadow-lg border border-gray-200 dark:border-dark-border flex items-center justify-center text-xl hover:scale-110 transition"
        title={theme === "dark" ? "切换浅色" : "切换深色"}
      >
        {theme === "dark" ? "🌙" : "☀️"}
      </button>
    </div>
  );
}
