import type { Metadata } from "next";
import "./globals.css";
import { AppThemeProvider } from "@/components/AppThemeProvider";

export const metadata: Metadata = {
  title: "IlluPhy · 物理模型模拟实验室",
  description:
    "初高中物理模型学习平台 - 知识地图、强制因果链分析、8步解题器、多解法判定引擎",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <head>
        {/* MathJax 3 全局加载 - 使用稳定 CDN */}
        <script>
          {`
            window.MathJax = {
              tex: {
                inlineMath: [['$', '$'], ['\\\\(', '\\\\)']],
                displayMath: [['$$', '$$'], ['\\\\[', '\\\\]']],
                processEscapes: true,
                processEnvironments: true,
                strict: false,
              },
              svg: { fontCache: 'global' },
              startup: {
                ready: function() {
                  MathJax.startup.defaultReady();
                }
              }
            };
          `}
        </script>
        <script
          defer
          src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js"
          async
        />
      </head>
      <body>
        <AppThemeProvider>{children}</AppThemeProvider>
      </body>
    </html>
  );
}
