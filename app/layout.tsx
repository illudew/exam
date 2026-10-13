import type { Metadata } from "next";
import "./globals.css";
import { AppThemeProvider } from "@/components/AppThemeProvider";
import { MathJaxBootstrap } from "@/components/MathJaxBootstrap";

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
      <body>
        <MathJaxBootstrap />
        <AppThemeProvider>{children}</AppThemeProvider>
      </body>
    </html>
  );
}
