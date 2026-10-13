"use client";

import { useEffect, useRef } from "react";

// 单公式渲染组件（使用 better-react-mathjax）
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

  useEffect(() => {
    if (!ref.current) return;

    const render = async () => {
      if (!window.MathJax) {
        // 如果 MathJax 未加载，尝试 typeset 整个文档
        try {
          window.MathJax = {
            tex: { inlineMath: [["$", "$"]], displayMath: [["$$", "$$"]] },
            svg: { fontCache: "global" },
            startup: { pageReady: () => window.MathJax.typesetPromise() },
          };
        } catch {}
      }
      // 已在 Layout 中全局加载 MathJax 脚本，直接 typeset Promise
      if (ref.current && (window as any).MathJax?.typesetPromise) {
        try {
          await (window as any).MathJax.typesetPromise([ref.current]);
        } catch {}
      }
    };
    render();
  }, [tex, display]);

  const content = display ? `\\[${tex}\\]` : `\\(${tex}\\)`;
  return (
    <span
      ref={ref}
      className={className}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}

// 多行文本 + 混合公式渲染（自动识别 $...$ 和 $$...$$）
export function MathText({ text, className = "" }: { text: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    if ((window as any).MathJax?.typesetPromise) {
      (window as any).MathJax.typesetPromise([ref.current]).catch(() => {});
    }
  }, [text]);

  // 直接把内容交给 MathJax 处理（用 dangerouslySetInnerHTML 因为 text 来自内部数据）
  return (
    <div
      ref={ref}
      className={className}
      dangerouslySetInnerHTML={{ __html: text }}
    />
  );
}
