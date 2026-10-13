"use client";

import { useEffect, useRef, useState } from "react";

// MathJax 渲染组件 —— 关键修复：SSR/客户端首次渲染都返回空 span，
// 避免 MathJax typeset 后 DOM 变化触发 Next.js hydration 报错。
// 只在客户端 useEffect 之后才插入公式内容。

export function MathJax({
  tex,
  display = false,
  className = "",
}: {
  tex: string;
  display?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !ref.current) return;

    const content = display ? `\\[${tex}\\]` : `\\(${tex}\\)`;
    // 先把 LaTeX 文本插入 DOM
    ref.current.textContent = content;

    // 等待 MathJax 加载完成再 typeset
    const typeset = async () => {
      const MJ = (window as any).MathJax;
      if (!MJ?.typesetPromise) {
        // 如果 MathJax 还没加载，等它一会
        await new Promise((r) => setTimeout(r, 500));
        return typeset();
      }
      try {
        await MJ.typesetPromise([ref.current]);
      } catch {
        // 忽略 MathJax 内部错误（比如 URL 里带 & 的 LaTeX）
      }
    };
    typeset();
  }, [mounted, tex, display]);

  return <span ref={ref} className={className} />;
}

// 多行文本 + 混合公式渲染
export function MathText({ text, className = "" }: { text: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !ref.current) return;

    ref.current.innerHTML = text;

    const MJ = (window as any).MathJax;
    if (MJ?.typesetPromise) {
      MJ.typesetPromise([ref.current]).catch(() => {});
    }
  }, [mounted, text]);

  return <div ref={ref} className={className} />;
}
