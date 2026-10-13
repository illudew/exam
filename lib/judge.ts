// 判定引擎：nerdamer 符号等价 + 二分图最大匹配

import nerdamer from "nerdamer";

// ======== LaTeX → nerdamer 统一转换器 ========
// 将 LaTeX 数学表达式归一化为 nerdamer 可解析的形式
function normalizeMathExpr(raw: string): string {
  let s = raw.trim();
  // 等号移到左边：a = b → a - b
  if (s.includes("=")) {
    const [lhs, rhs] = s.split("=").map((x) => x.trim());
    s = `(${lhs}) - (${rhs})`;
  }
  // LaTeX 命令 → nerdamer 函数/符号
  s = s.replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, "($1)/($2)");
  s = s.replace(/\\sqrt/g, "sqrt");
  s = s.replace(/\\sin/g, "sin").replace(/\\cos/g, "cos").replace(/\\tan/g, "tan");
  s = s.replace(/\\Delta/g, "").replace(/\\cdot/g, "*").replace(/\\times/g, "*");
  s = s.replace(/\\pi/g, "pi").replace(/\\theta/g, "theta")
       .replace(/\\alpha/g, "alpha").replace(/\\omega/g, "omega");
  // 清理多余花括号（保守替换）
  s = s.replace(/\{([^{}]*)\}/g, "($1)");
  // 空格清理
  s = s.replace(/\s+/g, "");
  return s;
}

// 统一导出（向后兼容别名）
export const toNerdamerExpr = normalizeMathExpr;
export const latexToNerdamer = normalizeMathExpr;

// 判断两个方程是否代数等价（允许常数因子差异）
export function equationsAlgebraicallyEquivalent(exprA: string, exprB: string): boolean {
  try {
    const a = nerdamer(normalizeMathExpr(exprA));
    const b = nerdamer(normalizeMathExpr(exprB));
    // 尝试化简 a/b，如果结果为常数（不含字母），则等价
    const ratio = (nerdamer(`(${a.text()}) / (${b.text()})`) as any).simplify() as any;
    const ratioText = ratio.text();
    if (/^[0-9/.\-+\s*()]+$/.test(ratioText) || ratioText === "1") return true;
    // 或者直接 a-b 化简为零
    const diff = (nerdamer(`${a.text()} - (${b.text()})`) as any).simplify() as any;
    if (diff.text() === "0") return true;
    return false;
  } catch {
    try {
      const na = (nerdamer(normalizeMathExpr(exprA)) as any).simplify().text();
      const nb = (nerdamer(normalizeMathExpr(exprB)) as any).simplify().text();
      return na === nb;
    } catch {
      return false;
    }
  }
}

// 尝试所有符号变体（+/-号翻转）来匹配标准方程
export function matchWithSymbolVariants(
  studentExpr: string,
  standardExprs: string[]
): { match: boolean; matchedExpr?: string } {
  for (const s of standardExprs) {
    if (equationsAlgebraicallyEquivalent(studentExpr, s))
      return { match: true, matchedExpr: s };
  }
  // 负号变体（整体取反）
  try {
    const negStudent = (nerdamer(normalizeMathExpr(studentExpr)) as any).multiply("(-1)").text();
    for (const s of standardExprs) {
      if (equationsAlgebraicallyEquivalent(negStudent, s))
        return { match: true, matchedExpr: s };
    }
  } catch {}
  return { match: false };
}

// ======== 二分图最大匹配（Kuhn 增广路算法） ========

export function bipartiteMaxMatch(
  studentEquations: string[],
  solutionEquations: string[]
): { size: number; studentToSolution: number[] } {
  const n = studentEquations.length;
  const m = solutionEquations.length;

  // 学生方程 → 标准方程 的邻接表（能等价匹配就连边）
  const adj: number[][] = [];
  for (let i = 0; i < n; i++) {
    adj.push([]);
    for (let j = 0; j < m; j++) {
      const { match } = matchWithSymbolVariants(studentEquations[i], [solutionEquations[j]]);
      if (match) adj[i].push(j);
    }
  }

  // matchToStudent[j] = 标准方程 j 当前匹配到的学生方程 i，-1 表示未匹配
  const matchToStudent = new Array(m).fill(-1);

  // DFS 找增广路：从学生方程 u 出发，尝试给它找一个未占用的标准方程
  function augment(u: number, visited: boolean[]): boolean {
    for (const v of adj[u]) {
      if (visited[v]) continue;
      visited[v] = true;
      if (matchToStudent[v] === -1 || augment(matchToStudent[v], visited)) {
        matchToStudent[v] = u;
        return true;
      }
    }
    return false;
  }

  let size = 0;
  for (let i = 0; i < n; i++) {
    const visited = new Array(m).fill(false);
    if (augment(i, visited)) size++;
  }

  // studentToSolution[i] = 学生方程 i 匹配到的标准方程 j
  const studentToSolution = new Array(n).fill(-1);
  for (let j = 0; j < m; j++) {
    if (matchToStudent[j] !== -1) {
      studentToSolution[matchToStudent[j]] = j;
    }
  }

  return { size, studentToSolution };
}

// 判定学生的方程组是否能匹配到某个解法
export function judgeSolutionMatch(
  studentExprs: string[],
  solutions: { name: string; equations: { expr: string }[] }[]
): { passed: boolean; matchedSolution?: string; score: number; perEquation: boolean[] } {
  let best = { size: 0, matchedSolution: "", perEquation: [] as boolean[], passed: false };

  for (const sol of solutions) {
    const stdExprs = sol.equations.map((e) => e.expr);
    const { size, studentToSolution } = bipartiteMaxMatch(studentExprs, stdExprs);
    const perEq = studentExprs.map((_, i) => studentToSolution[i] !== -1);
    if (size > best.size) {
      best = { size, matchedSolution: sol.name, perEquation: perEq, passed: false };
    }
  }

  const allMatched = best.perEquation.every((p) => p);
  return {
    passed: allMatched && studentExprs.length > 0,
    matchedSolution: best.matchedSolution || undefined,
    score: best.perEquation.reduce((s, p) => s + (p ? 1 : 0), 0) / Math.max(1, studentExprs.length),
    perEquation: best.perEquation,
  };
}

// 综合反馈生成
export function generateEquationFeedback(
  perEquation: boolean[],
  standardCount: number,
  solutionName?: string
): string {
  const correctCount = perEquation.filter((p) => p).length;
  const total = perEquation.length;
  if (correctCount === total && total >= standardCount * 0.8) {
    return `完美！你列出的 ${total} 个方程全部匹配，解法主线与「${solutionName}」一致。`;
  }
  if (correctCount >= Math.ceil(standardCount * 0.6)) {
    const wrongIdx = perEquation
      .map((p, i) => (!p ? i + 1 : -1))
      .filter((i) => i !== -1)
      .join("、");
    return `大部分正确，第 ${wrongIdx || "？"} 号方程结构或物理量可能有误，请重新检查。你已匹配到「${solutionName}」解法主线。`;
  }
  if (correctCount === 0) {
    return `方程结构完全没对上。请先确认每个方程的对象、过程、物理规律。`;
  }
  return `匹配度偏低（${correctCount}/${total}）。请回到因果链重新确认：你选对规律了吗？`;
}
