// 判定引擎：nerdamer 符号等价 + 二分图最大匹配

import nerdamer from "nerdamer";

// 预处理表达式：去除 LaTeX 风格，转换为 nerdamer 能解析的格式
function toNerdamerExpr(raw: string): string {
  let s = raw.trim();
  // 处理等号：移项到左边
  if (s.includes("=")) {
    const [lhs, rhs] = s.split("=").map((x) => x.trim());
    s = `(${lhs}) - (${rhs})`;
  }
  // 常见物理量符号替换：theta -> theta, alpha -> alpha, omega -> omega, m1 -> m1 等保留
  // \\sin(...) -> sin(...)（如果有 LaTeX 残留）
  s = s.replace(/\\sin/g, "sin").replace(/\\cos/g, "cos").replace(/\\tan/g, "tan");
  s = s.replace(/\\sqrt/g, "sqrt");
  // \frac{a}{b} -> (a)/(b)
  s = s.replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, "($1)/($2)");
  // 清理多余花括号
  s = s.replace(/\{([^}]*)\}/g, "($1)");
  return s;
}

// 尝试把 LaTeX 方程转成 nerdamer 可解析的表达式
export function latexToNerdamer(latex: string): string {
  // 基础的 LaTeX → 数学表达式转换
  let s = latex.trim();
  // 移到左边
  if (s.includes("=")) {
    const [lhs, rhs] = s.split("=").map((x) => x.trim());
    s = `(${lhs}) - (${rhs})`;
  }
  s = s.replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, "($1)/($2)");
  s = s.replace(/\\sin/g, "sin").replace(/\\cos/g, "cos").replace(/\\tan/g, "tan");
  s = s.replace(/\\sqrt/g, "sqrt").replace(/\\Delta/g, "");
  s = s.replace(/\\cdot/g, "*").replace(/\\times/g, "*");
  s = s.replace(/\\pi/g, "pi").replace(/\\theta/g, "theta").replace(/\\alpha/g, "alpha").replace(/\\omega/g, "omega");
  s = s.replace(/\{([^}]*)\}/g, "($1)");
  // 清理空格
  s = s.replace(/\s+/g, "");
  return s;
}

// 判断两个方程是否代数等价（允许常数因子差异）
export function equationsAlgebraicallyEquivalent(exprA: string, exprB: string): boolean {
  try {
    const a = nerdamer(toNerdamerExpr(exprA));
    const b = nerdamer(toNerdamerExpr(exprB));
    // 尝试化简 a/b，如果结果为常数（不含字母），则等价
    const ratio = nerdamer(`(${a.text()}) / (${b.text()})`).simplify();
    const ratioText = ratio.text();
    // 如果 ratio 中没有字母，就是纯数字，等价
    if (/^[0-9/.\-+\s*()]+$/.test(ratioText) || ratioText === "1") return true;
    // 或者直接 a-b 化简为零
    const diff = nerdamer(`${a.text()} - (${b.text()})`).simplify();
    if (diff.text() === "0") return true;
    return false;
  } catch {
    // 解析失败就用字符串归一化后比较
    const na = nerdamer(toNerdamerExpr(exprA)).simplify().text();
    const nb = nerdamer(toNerdamerExpr(exprB)).simplify().text();
    return na === nb;
  }
}

// 尝试所有符号变体（+/-号翻转）来匹配标准方程
export function matchWithSymbolVariants(
  studentExpr: string,
  standardExprs: string[]
): { match: boolean; matchedExpr?: string } {
  // 基础尝试
  for (const s of standardExprs) {
    if (equationsAlgebraicallyEquivalent(studentExpr, s))
      return { match: true, matchedExpr: s };
  }
  // 负号变体（整体取反）
  try {
    const negStudent = nerdamer(toNerdamerExpr(studentExpr)).multiply("(-1)").text();
    for (const s of standardExprs) {
      if (equationsAlgebraicallyEquivalent(negStudent, s))
        return { match: true, matchedExpr: s };
    }
  } catch {}
  return { match: false };
}

// ======== 二分图最大匹配（匈牙利算法，BFS 版本） ========
// studentEquations: 学生方程列表
// solutionEquations: 某个解法的标准方程列表
// 返回: 最大匹配数

export function bipartiteMaxMatch(
  studentEquations: string[],
  solutionEquations: string[]
): { size: number; studentToSolution: number[] } {
  const n = studentEquations.length;
  const m = solutionEquations.length;

  // 学生方程 -> 标准方程 的邻接表（能等价匹配就连边）
  const adj: number[][] = [];
  for (let i = 0; i < n; i++) {
    adj.push([]);
    for (let j = 0; j < m; j++) {
      const { match } = matchWithSymbolVariants(studentEquations[i], [
        solutionEquations[j],
      ]);
      if (match) adj[i].push(j);
    }
  }

  // BFS 增广路算法（Kuhn）
  const matchToStudent = new Array(m).fill(-1); // 标准方程 j 匹配到哪个学生
  const visited = new Array(n).fill(false);

  function tryAugment(u: number): boolean {
    for (const v of adj[u]) {
      if (visited[v]) continue;
      visited[v] = true;
      if (matchToStudent[v] === -1 || tryAugment(matchToStudent[v])) {
        matchToStudent[v] = u;
        return true;
      }
    }
    return false;
  }

  let size = 0;
  for (let i = 0; i < n; i++) {
    // 重置 visited：对每个标准方程节点是否被访问过
    const usedByJ = new Array(m).fill(false);
    // 用一个新的 visited 标记标准方程
    void visited;
    // 重新实现：用 per-solution-visited
    const stdVisited = new Array(m).fill(false);
    function augment(u: number): boolean {
      for (const v of adj[u]) {
        if (stdVisited[v]) continue;
        stdVisited[v] = true;
        if (matchToStudent[v] === -1 || augment(matchToStudent[v])) {
          matchToStudent[v] = u;
          return true;
        }
      }
      return false;
    }
    if (augment(i)) size++;
  }

  void tryAugment; // 避免未使用警告
  void usedByJ;

  // studentToSolution[i] = 学生方程i匹配到的标准方程j，-1表示没匹配
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

  // 判定：匹配数 == 学生方程数 且 匹配数 >= 解法所需最小独立方程数的比例
  // 简单标准：所有学生方程都能匹配上
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

export { toNerdamerExpr };
