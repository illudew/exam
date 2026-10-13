"use client";

import { useEffect } from "react";

// 在客户端挂载 MathJax —— 完全避免 SSR 参与，
// 这样就不会有 hydration 不一致的问题（MathJax 所有加载都只在浏览器里发生）
export function MathJaxBootstrap() {
  useEffect(() => {
    if ((window as any).MathJax?.typesetPromise) return; // 已经加载过

    // 1. 先注入配置（注意这里是纯 JS，不需要额外转义）
    (window as any).MathJax = {
      tex: {
        inlineMath: [["$", "$"], ["\\(", "\\)"]],
        displayMath: [["$$", "$$"], ["\\[", "\\]"]],
        processEscapes: true,
        processEnvironments: true,
        strict: false,
      },
      svg: { fontCache: "global" },
      startup: {
        ready: function () {
          // @ts-ignore
          MathJax.startup.defaultReady();
        },
      },
    };

    // 2. 动态创建 script 标签加载 MathJax
    const s = document.createElement("script");
    s.src = "https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js";
    s.async = true;
    document.head.appendChild(s);
  }, []);

  return null;
}
