"use client";

import { useState } from "react";
import { MathJax } from "./MathJax";

export function LaTeXInput({
  value,
  onChange,
  placeholder = "在这里写 LaTeX 方程，如  m g h - 0.5 m v^2",
  label,
  hint,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  label?: string;
  hint?: string;
}) {
  const [focused, setFocused] = useState(false);

  const snippets: { label: string; tex: string }[] = [
    { label: "分式", tex: "\\frac{a}{b}" },
    { label: "根号", tex: "\\sqrt{x}" },
    { label: "上标", tex: "x^2" },
    { label: "下标", tex: "x_1" },
    { label: "希腊 θ", tex: "\\theta" },
    { label: "希腊 π", tex: "\\pi" },
    { label: "小于", tex: "\\leq" },
    { label: "向量", tex: "\\vec{v}" },
    { label: "点积", tex: "\\cdot" },
    { label: "Δ", tex: "\\Delta" },
  ];

  return (
    <div className="flex flex-col gap-2">
      {label && <label className="font-medium text-sm">{label}</label>}
      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          rows={3}
          className="input font-mono text-sm resize-y"
          spellCheck={false}
        />
        {hint && (
          <div className="text-xs text-gray-500 dark:text-dark-muted mt-1">
            {hint}
          </div>
        )}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {snippets.map((s) => (
          <button
            key={s.label}
            type="button"
            onClick={() => onChange(value + s.tex)}
            className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 dark:bg-dark-border dark:hover:bg-gray-700 rounded border border-gray-200 dark:border-gray-600"
          >
            <MathJax tex={s.tex} />
          </button>
        ))}
      </div>
      {(focused || value.trim()) && (
        <div className="p-3 bg-gray-50 dark:bg-dark-bg rounded border border-gray-200 dark:border-dark-border">
          <div className="text-xs text-gray-500 dark:text-dark-muted mb-1">实时预览：</div>
          <div className="text-base">
            {value.trim() ? <MathJax tex={value} /> : <span className="text-gray-400">(空)</span>}
          </div>
        </div>
      )}
    </div>
  );
}

// 多方程输入（方程归属矩阵）
export function EquationBuilder({
  equations,
  onChange,
  unknowns,
  required,
}: {
  equations: { id: number; object: string; process: string; law: string; expr: string }[];
  onChange: (eqs: typeof equations) => void;
  unknowns: string[];
  required: number;
}) {
  function updateField(idx: number, field: string, val: string) {
    const next = equations.map((e, i) => (i === idx ? { ...e, [field]: val } : e));
    onChange(next);
  }
  function add() {
    const newId = Math.max(0, ...equations.map((e) => e.id)) + 1;
    onChange([...equations, { id: newId, object: "", process: "", law: "", expr: "" }]);
  }
  function remove(idx: number) {
    onChange(equations.filter((_, i) => i !== idx));
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="text-sm">
          <span className="font-medium">未知量：</span>
          <span className="font-mono text-primary-700">{unknowns.join(", ")}</span>
          <span className="ml-4 font-medium">需要方程数：</span>
          <span className={`font-bold ${equations.length === required ? "text-accent-green" : "text-accent-orange"}`}>
            {equations.length} / {required}
          </span>
        </div>
        <button onClick={add} className="btn-secondary text-xs">
          + 添加方程
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border border-gray-200 dark:border-dark-border rounded">
          <thead className="bg-gray-50 dark:bg-dark-bg text-xs">
            <tr>
              <th className="p-2 border-r border-gray-200 dark:border-dark-border">#</th>
              <th className="p-2 border-r border-gray-200 dark:border-dark-border min-w-[80px]">对象</th>
              <th className="p-2 border-r border-gray-200 dark:border-dark-border min-w-[100px]">过程</th>
              <th className="p-2 border-r border-gray-200 dark:border-dark-border min-w-[100px]">物理规律</th>
              <th className="p-2 border-r border-gray-200 dark:border-dark-border">方程内容（LaTeX）</th>
              <th className="p-2"></th>
            </tr>
          </thead>
          <tbody>
            {equations.map((eq, idx) => (
              <tr key={eq.id} className="border-t border-gray-200 dark:border-dark-border">
                <td className="p-2 text-center font-mono text-gray-500">{idx + 1}</td>
                <td className="p-1">
                  <input
                    className="input text-xs"
                    value={eq.object}
                    placeholder="如 滑块"
                    onChange={(e) => updateField(idx, "object", e.target.value)}
                  />
                </td>
                <td className="p-1">
                  <input
                    className="input text-xs"
                    value={eq.process}
                    placeholder="如 下滑到底端"
                    onChange={(e) => updateField(idx, "process", e.target.value)}
                  />
                </td>
                <td className="p-1">
                  <select
                    className="input text-xs"
                    value={eq.law}
                    onChange={(e) => updateField(idx, "law", e.target.value)}
                  >
                    <option value="">选择规律</option>
                    <option>牛顿第二定律</option>
                    <option>动量守恒</option>
                    <option>动能定理</option>
                    <option>机械能守恒</option>
                    <option>能量守恒</option>
                    <option>欧姆定律</option>
                    <option>法拉第电磁感应</option>
                    <option>万有引力</option>
                    <option>运动学公式</option>
                    <option>阿基米德原理</option>
                    <option>杠杆平衡</option>
                    <option>比热容</option>
                  </select>
                </td>
                <td className="p-1">
                  <input
                    className="input text-xs font-mono"
                    value={eq.expr}
                    placeholder="如 m*g*h - 0.5*m*v^2 = 0"
                    onChange={(e) => updateField(idx, "expr", e.target.value)}
                  />
                </td>
                <td className="p-1 text-center">
                  {equations.length > 1 && (
                    <button
                      onClick={() => remove(idx)}
                      className="text-accent-red hover:underline text-xs"
                    >
                      删除
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
