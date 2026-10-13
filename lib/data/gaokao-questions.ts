import type { Question } from "../types";

export const gaokaoQuestions: Question[] = [
  // ========== 斜面模型 ==========
  {
    id: "gaokao_inclined_001",
    exam: "gaokao",
    model: "inclined_plane",
    title: "光滑斜面上的滑块",
    stem: "质量为 $m$ 的滑块从倾角为 $\\theta$ 的光滑斜面顶端由静止下滑，斜面高为 $h$。求滑块到达底端时的速度大小。",
    keywords: ["光滑", "静止", "求速度", "斜面"],
    causalChain: {
      correct: "受力分析 → 只有重力做功 → 机械能守恒/动能定理 → 求速度",
      distractors: ["动量守恒（合外力不为零，不适用）", "牛顿第二定律+运动学（可行但麻烦）"],
      options: [
        {
          id: "A",
          text: "受力分析 → 只有重力做功 → 机械能守恒/动能定理 → 求速度",
          correct: true,
          feedback: "对！光滑斜面只有重力和支持力，支持力不做功，机械能守恒。",
        },
        {
          id: "B",
          text: "受力分析 → 只有重力 → 动量守恒 → 求速度",
          correct: false,
          feedback: "动量守恒需要合外力为零。这里重力沿斜面有分量，合外力不为零，动量不守恒。",
        },
        {
          id: "C",
          text: "受力分析 → 写牛二 → 用运动学 v=at 求速度",
          correct: false,
          feedback: "虽然可行但属于“麻烦解法”，而且过程中容易算错加速度。更重要的是本题核心主线是能量方法。",
        },
      ],
    },
    steps: [
      {
        step: 1,
        name: "读题与关键词",
        fullGuide: {
          question: "关键词「光滑」意味着什么？",
          options: [
            { text: "有摩擦力" },
            { text: "无摩擦力，机械能守恒可能", correct: true },
            { text: "与摩擦力无关" },
          ],
          answerIndex: 1,
        },
      },
      {
        step: 2,
        name: "选对象",
        fullGuide: {
          question: "本题的研究对象应该是？",
          options: [
            { text: "斜面" },
            { text: "滑块", correct: true },
            { text: "滑块+斜面组成的系统" },
          ],
          answerIndex: 1,
        },
      },
      {
        step: 3,
        name: "分过程",
        semiGuide: { title: "划分运动阶段", prompts: ["滑块的运动是几个过程？", "初末状态各是什么？"] },
      },
      {
        step: 4,
        name: "画图",
        drawHints: ["画斜面轮廓", "画滑块的受力图（重力、支持力）", "标注 h、θ 等已知量"],
      },
      {
        step: 5,
        name: "选规律",
        fullGuide: {
          question: "为什么本题适合用动能定理/机械能守恒？",
          options: [
            { text: "因为时间未知，求速度用能量法直接" },
            { text: "因为只有重力做功，支持力不做功，机械能守恒", correct: true },
            { text: "因为牛顿第二定律不能用" },
          ],
          answerIndex: 1,
        },
      },
      {
        step: 6,
        name: "列方程",
        equations: {
          unknowns: ["v"],
          equationCount: 1,
          equations: [
            {
              id: 1,
              object: "滑块",
              process: "下滑到底端",
              law: "动能定理",
              expr: "m*g*h - 0.5*m*v^2",
              latex: "mgh - \\frac{1}{2}mv^2 = 0",
              symbolVariants: ["+v"],
            },
          ],
          solutions: [
            {
              id: "A",
              name: "动能定理主线",
              equations: [{ id: 1, law: "动能定理", expr: "m*g*h - 0.5*m*v^2" }],
            },
            {
              id: "B",
              name: "机械能守恒主线",
              equations: [{ id: 1, law: "机械能守恒", expr: "m*g*h - 0.5*m*v^2" }],
            },
            {
              id: "C",
              name: "牛二+运动学",
              equations: [
                { id: 1, law: "牛顿第二定律", expr: "m*g*sin(theta) - m*a" },
                { id: 2, law: "运动学公式", expr: "v^2 - 2*a*(h/sin(theta))" },
              ],
            },
          ],
        },
      },
      {
        step: 7,
        name: "解方程",
        fullGuide: {
          question: "由 mgh = ½mv² 解得 v = ?",
          options: [
            { text: "\\sqrt{gh}" },
            { text: "\\sqrt{2gh}", correct: true },
            { text: "2gh" },
          ],
          answerIndex: 1,
        },
      },
      {
        step: 8,
        name: "检验",
        fullGuide: {
          question: "单位检查：\\sqrt{2gh} 的单位是？",
          options: [
            { text: "m/s", correct: true },
            { text: "m" },
            { text: "s" },
          ],
          answerIndex: 0,
        },
      },
    ],
    variants: [
      {
        stem: "质量为 $m$ 的滑块从倾角为 $\\theta$ 的粗糙斜面顶端由静止下滑，斜面高为 $h$，动摩擦因数为 $\\mu$。求滑块到达底端时的速度大小。",
        answer: "v = \\sqrt{2gh - 2\\mu g\\cos\\theta \\cdot \\frac{h}{\\sin\\theta}}",
      },
      {
        stem: "质量为 $m$ 的滑块以初速度 $v_0$ 沿倾角为 $\\theta$ 的光滑斜面上滑，斜面足够长。求滑块能到达的最大高度 $h$。",
        answer: "h = \\frac{v_0^2}{2g}",
      },
    ],
  },

  // ========== 连接体模型 ==========
  {
    id: "gaokao_connected_001",
    exam: "gaokao",
    model: "connected_body",
    title: "定滑轮连接两物块",
    stem: "如图，光滑水平面上放置质量为 $m_1$ 的物块 A，通过定滑轮用不可伸长的轻绳与质量为 $m_2$ 的物块 B 相连（B 悬挂在滑轮下方）。设滑轮和绳的质量不计，摩擦力不计。求：(1) 两物块的共同加速度；(2) 绳中的拉力。",
    keywords: ["光滑", "共同加速度", "绳拉力", "定滑轮"],
    causalChain: {
      correct: "先整体法求共同加速度 → 再隔离法对 A 或 B 列牛二求拉力",
      distractors: ["先对 A 再对 B 隔离法（可做但没必要先整体）", "直接对 A 列牛二，绳子拉力未知所以解不出来"],
      options: [
        {
          id: "A",
          text: "整体法 F合=m2g=(m1+m2)a 求a → 对A隔离 T=m1a",
          correct: true,
          feedback: "对！两物体加速度相同，整体法一步求出a，再隔离任意一个求T。",
        },
        {
          id: "B",
          text: "对A隔离：T=m1a；对B隔离：m2g-T=m2a；联立解方程组",
          correct: true,
          feedback: "也对，但方程更多一些。整体法是更高效的主线。",
        },
        {
          id: "C",
          text: "先对A列 T=m1a，然后就卡住了，求不出 a",
          correct: false,
          feedback: "只隔离一个物体有两个未知量（T和a），需要再找一个方程或先用整体法。",
        },
      ],
    },
    steps: [
      { step: 1, name: "读题" },
      { step: 2, name: "选对象", semiGuide: { title: "确定研究对象", prompts: ["整体法 vs 隔离法，先选哪个？"] } },
      { step: 3, name: "分过程", fullGuide: { question: "本题涉及几个物理过程？", options: [{ text: "一个：由静止开始匀加速", correct: true }, { text: "两个：先加速后匀速" }], answerIndex: 0 } },
      { step: 4, name: "画图", drawHints: ["画两个物体的受力图", "标注绳的方向", "标注加速度方向"] },
      { step: 5, name: "选规律", fullGuide: { question: "本题为什么用整体法+隔离法组合？", options: [{ text: "整体法可以直接消去T，一个方程求a", correct: true }, { text: "隔离法一定比整体法简单" }], answerIndex: 0 } },
      {
        step: 6,
        name: "列方程",
        equations: {
          unknowns: ["a", "T"],
          equationCount: 2,
          equations: [
            { id: 1, object: "A+B整体", process: "同时加速", law: "牛顿第二定律", expr: "m2*g - (m1+m2)*a", latex: "m_2 g = (m_1 + m_2) a" },
            { id: 2, object: "A", process: "水平方向加速", law: "牛顿第二定律", expr: "T - m1*a", latex: "T = m_1 a" },
          ],
          solutions: [
            { id: "A", name: "整体+隔离A", equations: [
              { id: 1, law: "牛顿第二定律", expr: "m2*g - (m1+m2)*a" },
              { id: 2, law: "牛顿第二定律", expr: "T - m1*a" },
            ] },
            { id: "B", name: "隔离A+隔离B", equations: [
              { id: 1, law: "牛顿第二定律", expr: "T - m1*a" },
              { id: 2, law: "牛顿第二定律", expr: "m2*g - T - m2*a" },
            ] },
          ],
        },
      },
      { step: 7, name: "解方程", fullGuide: { question: "解得 a = ?  T = ?", options: [{ text: "a = m2*g/(m1+m2),  T = m1*m2*g/(m1+m2)", correct: true }, { text: "a = m2*g/m1" }], answerIndex: 0 } },
      { step: 8, name: "检验", fullGuide: { question: "量纲检查：a 和 T 的单位分别是？", options: [{ text: "a: m/s², T: N", correct: true }, { text: "a: m, T: kg" }], answerIndex: 0 } },
    ],
    variants: [
      { stem: "将水平面换成倾角为 $\\theta$ 的光滑斜面，A 在斜面上，其他条件不变。求共同加速度和绳拉力。", answer: "a = m2*g(1-sinθ)/(m1+m2),  T = m1*g(m2+m1*sinθ)/(m1+m2)" },
      { stem: "用一根质量不计的光滑圆柱轮代替定滑轮，使两物体对称挂在滑轮两侧（阿特伍德机）。证明 a = g(m1-m2)/(m1+m2)。", answer: "a = g(m1-m2)/(m1+m2)" },
    ],
  },

  // ========== 传送带 ==========
  {
    id: "gaokao_belt_001",
    exam: "gaokao",
    model: "belt_transport",
    title: "水平传送带",
    stem: "水平传送带长为 $L=20$ m，以速度 $v_带=10$ m/s 匀速运行。将质量为 $m=2$ kg 的小物块以 $v_0=0$ 的初速度轻放在传送带左端，物块与传送带间的动摩擦因数为 $\\mu=0.5$。求：(1) 物块从左端运动到右端的时间；(2) 此过程中系统产生的内能。",
    keywords: ["水平", "初速度为零", "动摩擦因数", "相对位移"],
    causalChain: {
      correct: "物块加速阶段 → 判定是否能加速到v带 → 算加速时间和匀速时间 → Q=μmg·Δs",
      distractors: ["直接假设物块能加速到v带，没先算加速位移", "直接用Q=μmg·L 忘了相对位移"],
      options: [
        { id: "A", text: "先算加速位移 s=v带²/(2μg)=10m<20m，说明会加速到10m/s再匀速", correct: true, feedback: "对！必须先判断加速到v带时物块走了多远，能否在带上完成加速。" },
        { id: "B", text: "物块一定能加速到v带，直接用 v带 = v0 + at 算时间", correct: false, feedback: "先别假设一定能加速到v带。如果L=3m，物块根本到不了10m/s就滑出去了！" },
        { id: "C", text: "生热 Q = μmg·L 直接代入", correct: false, feedback: "错！生热看的是**相对位移** Δs，不是物块对地面的位移L。Δs = s带 - s物（加速阶段）。" },
      ],
    },
    steps: [
      { step: 1, name: "读题" },
      { step: 2, name: "选对象", semiGuide: { title: "研究对象", prompts: ["物块：求运动时间", "物块+传送带系统：求生热"] } },
      { step: 3, name: "分过程", fullGuide: { question: "物块的运动分几个阶段？", options: [{ text: "加速阶段（相对滑动） + 匀速阶段（共速无摩擦）", correct: true }, { text: "一直加速到右端" }], answerIndex: 0 } },
      { step: 4, name: "画图", drawHints: ["画 v-t 图（物块是直线上升然后水平）", "画传送带 v 随 t 是水平线 v=10m/s"] },
      { step: 5, name: "选规律" },
      {
        step: 6,
        name: "列方程",
        equations: {
          unknowns: ["t", "Q"],
          equationCount: 4,
          equations: [
            { id: 1, object: "物块", process: "加速阶段", law: "牛顿第二定律", expr: "mu*m*g - m*a", latex: "\\mu mg = ma" },
            { id: 2, object: "物块", process: "加速阶段", law: "运动学", expr: "v_belt - a*t1", latex: "v_带 = a t_1" },
            { id: 3, object: "系统", process: "加速阶段", law: "能量守恒", expr: "mu*m*g*(v_belt*t1 - 0.5*v_belt*t1) - Q", latex: "Q = \\mu mg \\cdot \\Delta s" },
            { id: 4, object: "物块", process: "总过程", law: "运动学", expr: "L - (0.5*v_belt*t1 + v_belt*t2)", latex: "L = \\frac{1}{2}v_带 t_1 + v_带 t_2" },
          ],
          solutions: [{ id: "A", name: "牛二+运动学+能量法", equations: [
            { id: 1, law: "牛顿第二定律", expr: "mu*m*g - m*a" },
            { id: 2, law: "运动学", expr: "v_belt - a*t1" },
            { id: 3, law: "能量守恒", expr: "mu*m*g*(v_belt*t1 - 0.5*v_belt*t1) - Q" },
            { id: 4, law: "运动学", expr: "L - (0.5*v_belt*t1 + v_belt*t2)" },
          ] }],
        },
      },
      { step: 7, name: "解方程", fullGuide: { question: "代入数值 μ=0.5, g=10 m/s², v带=10m/s, L=20m，结果是？", options: [{ text: "a=5m/s², t1=2s, s1=10m, t2=1s, t总=3s, Q=50J", correct: true }, { text: "t总=2s, Q=100J" }], answerIndex: 0 } },
      { step: 8, name: "检验", fullGuide: { question: "极限思维：若 L→∞，物块最终速度？", options: [{ text: "趋近于 v带=10m/s", correct: true }, { text: "继续加速超过 10m/s" }], answerIndex: 0 } },
    ],
    variants: [
      { stem: "把传送带改成倾斜向下，倾角 $\\theta=37°$，其他条件不变。判断物块能否加速到传送带速度，以及最终能否从下端滑出。($\\sin37°=0.6, \\cos37°=0.8$)", answer: "a=10m/s²>5m/s²=g sinθ+μg cosθ=10，刚好能；若 v带很大则一直加速。" },
      { stem: "物块以 $v_0=15$ m/s 水平冲上传送带（v带=10m/s），其他不变。求物块在带上的运动情况。", answer: "先减速到10m/s再匀速；或L很短一直减速离开。" },
    ],
  },

  // ========== 圆周运动 ==========
  {
    id: "gaokao_circle_001",
    exam: "gaokao",
    model: "uniform_circle",
    title: "竖直圆周运动的临界",
    stem: "长为 $L$ 的轻绳一端系质量为 $m$ 的小球，以另一端为圆心在竖直平面内做圆周运动。(1) 求小球能过最高点的最小速度；(2) 若以最小速度的 $\\sqrt{2}$ 倍过最高点，求此时绳拉力。",
    keywords: ["竖直圆周", "最高点", "临界速度", "绳拉力"],
    causalChain: {
      correct: "最高点：重力+拉力提供向心力 → 临界时T=0 → mg=mv²/L",
      distractors: ["忘记临界条件T=0直接硬算", "把向心力方向搞反"],
      options: [
        { id: "A", text: "最高点 T=0 时是临界，mg=mv²/L → v_min=√(gL)", correct: true, feedback: "对！轻绳模型中最高点速度有最小值，低于此值会掉下来。" },
        { id: "B", text: "用机械能守恒算最低点速度", correct: false, feedback: "虽然机械能守恒是好的，但本题第一问直接用圆周运动临界条件即可，不需要能量。" },
        { id: "C", text: "向心力方向沿半径向外", correct: false, feedback: "向心力方向永远指向圆心。在最高点圆心在小球下方，所以合力应该指向下方（mg+T 一起向下）。" },
      ],
    },
    steps: [
      { step: 1, name: "读题" },
      { step: 2, name: "选对象", semiGuide: { title: "研究对象", prompts: ["小球", "只考虑最高点这一状态"] } },
      { step: 3, name: "分过程" },
      { step: 4, name: "画图", drawHints: ["画竖直圆，小球在最高点", "画受力：mg 向下、T 向下（或临界时T=0）", "画 v 的方向（切线水平）"] },
      { step: 5, name: "选规律" },
      {
        step: 6,
        name: "列方程",
        equations: {
          unknowns: ["v_min", "T"],
          equationCount: 2,
          equations: [
            { id: 1, object: "小球", process: "最高点临界", law: "牛顿第二定律（法向）", expr: "m*g - m*v_min^2/L", latex: "mg = \\frac{m v_\\text{min}^2}{L} \\quad(T=0)" },
            { id: 2, object: "小球", process: "最高点（一般情况）", law: "牛顿第二定律（法向）", expr: "m*g + T - m*v^2/L", latex: "mg + T = \\frac{m v^2}{L}" },
          ],
          solutions: [{ id: "A", name: "法向牛二直接", equations: [
            { id: 1, law: "牛顿第二定律", expr: "m*g - m*v_min^2/L" },
            { id: 2, law: "牛顿第二定律", expr: "m*g + T - m*v^2/L" },
          ] }],
        },
      },
      { step: 7, name: "解方程", fullGuide: { question: "v_min=√(gL)，当 v=√2·√(gL) 时，由 mg+T=mv²/L 得 T=?", options: [{ text: "T = mg", correct: true }, { text: "T = 2mg" }], answerIndex: 0 } },
      { step: 8, name: "检验", fullGuide: { question: "若速度v=0小球会怎样？", options: [{ text: "会掉下来（轻绳不能支撑）", correct: true }, { text: "能平衡在最高点" }], answerIndex: 0 } },
    ],
    variants: [
      { stem: "把轻绳换成轻杆（杆能支撑），其他不变。求最高点最小速度和对应杆的作用力方向。", answer: "v_min=0, 杆给小球向上的支持力N=mg" },
      { stem: "把绳换成光滑圆管（管能压能撑），小球在管内运动。临界速度？", answer: "轻管内 v_min=0；外轨道临界 v_min=√(gL)" },
    ],
  },

  // ========== 碰撞 ==========
  {
    id: "gaokao_collision_001",
    exam: "gaokao",
    model: "collision",
    title: "完全弹性碰撞",
    stem: "在光滑水平面上，质量 $m_1=1$ kg 的小球 A 以 $v_1=4$ m/s 向右运动，与静止的质量 $m_2=3$ kg 的小球 B 发生完全弹性正碰。求碰后两球的速度。",
    keywords: ["光滑", "完全弹性", "正碰", "静止"],
    causalChain: {
      correct: "动量守恒方程 + 完全弹性碰撞动能守恒方程 → 两方程两未知量 → 解方程组",
      distractors: ["只写动量守恒一个方程，不知道弹性碰撞还需要能量守恒", "误以为静止物体碰后速度也为零"],
      options: [
        { id: "A", text: "动量守恒 m1v1=m1v1'+m2v2' + 动能守恒 ½m1v1²=½m1v1'²+½m2v2'²", correct: true, feedback: "对！完全弹性碰撞同时满足动量守恒和动能守恒，两个方程联立。" },
        { id: "B", text: "只用动量守恒一个方程解", correct: false, feedback: "一个方程两个未知量解不出来！完全弹性碰撞的“弹性”就意味着要再加上动能守恒。" },
        { id: "C", text: "直接套 v1'=(m1-m2)/(m1+m2)·v1 的公式", correct: true, feedback: "这是完全弹性碰撞的结论公式，但你得先证明理解了它来自哪里，否则易忘。" },
      ],
    },
    steps: [
      { step: 1, name: "读题" },
      { step: 2, name: "选对象", semiGuide: { title: "研究对象", prompts: ["A+B 组成的系统（动量守恒）"] } },
      { step: 3, name: "分过程", fullGuide: { question: "碰撞的时间特征？", options: [{ text: "时间极短，外力冲量可忽略", correct: true }, { text: "持续很久，要考虑摩擦力" }], answerIndex: 0 } },
      { step: 4, name: "画图", drawHints: ["画碰前 A→ B (静止)", "画碰后 A'←(或→)  B→"] },
      { step: 5, name: "选规律" },
      {
        step: 6,
        name: "列方程",
        equations: {
          unknowns: ["v1'", "v2'"],
          equationCount: 2,
          equations: [
            { id: 1, object: "A+B系统", process: "碰撞", law: "动量守恒", expr: "m1*v1 - m1*v1_prime - m2*v2_prime", latex: "m_1 v_1 = m_1 v_1' + m_2 v_2'" },
            { id: 2, object: "A+B系统", process: "碰撞（完全弹性）", law: "动能守恒", expr: "0.5*m1*v1^2 - 0.5*m1*v1_prime^2 - 0.5*m2*v2_prime^2", latex: "\\tfrac{1}{2}m_1 v_1^2 = \\tfrac{1}{2}m_1 v_1'^2 + \\tfrac{1}{2}m_2 v_2'^2" },
          ],
          solutions: [{ id: "A", name: "动量+动能守恒", equations: [
            { id: 1, law: "动量守恒", expr: "m1*v1 - m1*v1_prime - m2*v2_prime" },
            { id: 2, law: "动能守恒", expr: "0.5*m1*v1^2 - 0.5*m1*v1_prime^2 - 0.5*m2*v2_prime^2" },
          ] }],
        },
      },
      { step: 7, name: "解方程", fullGuide: { question: "代入数据解得？", options: [{ text: "v1' = -2 m/s（反向）, v2' = 2 m/s", correct: true }, { text: "v1' = 3 m/s, v2' = 1 m/s" }], answerIndex: 0 } },
      { step: 8, name: "检验", fullGuide: { question: "代入 v1' 和 v2' 验证动能是否守恒？", options: [{ text: "碰前 ½·1·16 = 8J; 碰后 ½·1·4 + ½·3·4 = 2+6=8J ✓", correct: true }, { text: "不守恒" }], answerIndex: 0 } },
    ],
    variants: [
      { stem: "若两球碰后粘在一起（完全非弹性碰撞），求共同速度及动能损失。", answer: "v_共 = m1v1/(m1+m2) = 1 m/s;  ΔE = ½m1v1² - ½(m1+m2)v_共² = 8 - 2 = 6 J" },
      { stem: "质量相同的两球弹性正碰，A 静止 B 以 v 撞来，碰后速度各为？", answer: "交换速度：v_B'=0, v_A'=v" },
    ],
  },

  // ========== 万有引力 ==========
  {
    id: "gaokao_gravity_001",
    exam: "gaokao",
    model: "gravity_universe",
    title: "同步卫星与黄金代换",
    stem: "地球质量 $M$、半径 $R$、表面重力加速度 $g$。求地球同步卫星的轨道半径 $r$（用 $g、R、T$ 表示，$T=24$ 小时为地球自转周期）。",
    keywords: ["同步卫星", "万有引力=向心力", "黄金代换"],
    causalChain: {
      correct: "卫星做圆周运动：GMm/r² = m·(4π²/T²)·r + 黄金代换 GM=gR² 消去M",
      distractors: ["忘了用黄金代换，方程里保留了M", "误以为同步卫星高度=R（近地）", "把T用错单位"],
      options: [
        { id: "A", text: "GM/r² = 4π²r/T²  +  GM=gR²", correct: true, feedback: "对！万有引力提供向心力，再用黄金代换把 GM 换成 gR²，消去未知的 M。" },
        { id: "B", text: "直接用 T=2π√(r³/GM) 保留 GM", correct: false, feedback: "没有做完，题目要求用 g、R、T 表示，GM 是中间量，应该消掉。" },
        { id: "C", text: "把 r 和 R 搞混，用 R 代替轨道半径", correct: false, feedback: "近地卫星轨道半径≈R，同步卫星远得多，r=42000km >> R=6400km。" },
      ],
    },
    steps: [
      { step: 1, name: "读题" },
      { step: 2, name: "选对象", semiGuide: { title: "研究对象", prompts: ["地球同步卫星（质量m）", "地球（质量M）"] } },
      { step: 3, name: "分过程" },
      { step: 4, name: "画图", drawHints: ["画地球 + 卫星 + 轨道圆", "标注 r（中心到卫星）"] },
      { step: 5, name: "选规律", fullGuide: { question: "为什么可以用黄金代换 GM=gR²？", options: [{ text: "近地时重力≈万有引力：mg=GMm/R²，消去m得 GM=gR²", correct: true }, { text: "这是凭空想出来的公式" }], answerIndex: 0 } },
      {
        step: 6,
        name: "列方程",
        equations: {
          unknowns: ["r"],
          equationCount: 2,
          equations: [
            { id: 1, object: "卫星", process: "圆周运动", law: "万有引力=向心力", expr: "G*M*m/r^2 - m*4*pi^2/T^2*r", latex: "\\frac{GMm}{r^2} = m\\frac{4\\pi^2}{T^2} r" },
            { id: 2, object: "地球近地", process: "重力近似", law: "黄金代换", expr: "G*M - g*R^2", latex: "GM = g R^2" },
          ],
          solutions: [{ id: "A", name: "万有引力+黄金代换", equations: [
            { id: 1, law: "万有引力", expr: "G*M*m/r^2 - m*4*pi^2/T^2*r" },
            { id: 2, law: "黄金代换", expr: "G*M - g*R^2" },
          ] }],
        },
      },
      { step: 7, name: "解方程", fullGuide: { question: "联立解得 r = ?", options: [{ text: "r = \\sqrt[3]{g R^2 T^2 / (4\\pi^2)}", correct: true }, { text: "r = gR²T²/(4π²)" }], answerIndex: 0 } },
      { step: 8, name: "检验", fullGuide: { question: "代入数值（g≈10, R≈6.4×10⁶, T=86400s），r≈?", options: [{ text: "≈ 4.2×10⁷ m（正确）", correct: true }, { text: "≈ 6.4×10⁶ m（等于地球半径，错）" }], answerIndex: 0 } },
    ],
    variants: [
      { stem: "月球绕地球做匀速圆周运动，周期 $T_0$。用 $T_0、R、g$ 表示月球轨道半径 $r_0$。", answer: "r_0 = ∛(g R² T_0²/(4π²))" },
      { stem: "第一宇宙速度（近地）由谁决定？v₁ = √(gR) 的推导？", answer: "mg = mv²/R → v=√(gR) ≈ 7.9 km/s" },
    ],
  },

  // ========== 带电粒子在磁场中 ==========
  {
    id: "gaokao_bfield_001",
    exam: "gaokao",
    model: "charged_particle_bfield",
    title: "洛伦兹力圆周运动",
    stem: "带电量为 $q$、质量为 $m$ 的正电荷粒子以速度 $v$ 垂直射入磁感应强度为 $B$ 的匀强磁场中。求：(1) 轨道半径；(2) 周期；(3) 若粒子在磁场中偏转了 $90°$，求运动时间。",
    keywords: ["垂直射入", "洛伦兹力", "圆周运动", "时间"],
    causalChain: {
      correct: "洛伦兹力=向心力 → qvB=mv²/r → r=mv/(qB)；周期 T=2πr/v=2πm/(qB) 与速度无关；时间 t=θ·T/(2π)",
      distractors: ["周期写成与v有关（错！v增大r也等比例增大，所以T与v无关）", "偏转90°误以为t=T", "负电荷没注意方向"],
      options: [
        { id: "A", text: "qvB = mv²/r  →  r=mv/(qB)  T=2πr/v=2πm/(qB)", correct: true, feedback: "对！T 与速度无关是粒子回旋加速器的核心原理。" },
        { id: "B", text: "T 与 v 成正比", correct: false, feedback: "错！v 变大 r 也按 v 变大，两者相消。T = 2πm/(qB) 只与比荷 q/m 和 B 有关。" },
        { id: "C", text: "t=T/4（90°=2π/4）", correct: true, feedback: "对！时间 = 圆心角×m/(qB)，或 t = (90/360)×T。" },
      ],
    },
    steps: [
      { step: 1, name: "读题" },
      { step: 2, name: "选对象" },
      { step: 3, name: "分过程", fullGuide: { question: "洛伦兹力是否做功？", options: [{ text: "不做功（力⊥速度），速率不变", correct: true }, { text: "做功，动能增加" }], answerIndex: 0 } },
      { step: 4, name: "画图", drawHints: ["画磁场方向（×表示垂直纸面向里）", "画粒子速度（水平向右）", "画洛伦兹力方向（正电荷：上，用左手定则确认）", "画圆心和圆周"] },
      { step: 5, name: "选规律" },
      {
        step: 6,
        name: "列方程",
        equations: {
          unknowns: ["r", "T", "t"],
          equationCount: 3,
          equations: [
            { id: 1, object: "带电粒子", process: "圆周运动", law: "洛伦兹力=向心力", expr: "q*v*B - m*v^2/r", latex: "qvB = \\frac{mv^2}{r}" },
            { id: 2, object: "带电粒子", process: "圆周运动", law: "周期定义", expr: "T - 2*pi*r/v", latex: "T = \\frac{2\\pi r}{v}" },
            { id: 3, object: "带电粒子", process: "偏转90°", law: "时间=角度×m/(qB)", expr: "t - (pi/2)/(2*pi) * 2*pi*m/(q*B)", latex: "t = \\frac{\\theta}{2\\pi} T" },
          ],
          solutions: [{ id: "A", name: "洛伦兹力+运动学", equations: [
            { id: 1, law: "洛伦兹力", expr: "q*v*B - m*v^2/r" },
            { id: 2, law: "周期定义", expr: "T - 2*pi*r/v" },
            { id: 3, law: "时间", expr: "t - (pi/2)/(2*pi) * 2*pi*m/(q*B)" },
          ] }],
        },
      },
      { step: 7, name: "解方程", fullGuide: { question: "结果是？", options: [{ text: "r=mv/(qB), T=2πm/(qB), t=πm/(2qB)", correct: true }, { text: "r=mv²/(qB)" }], answerIndex: 0 } },
      { step: 8, name: "检验", fullGuide: { question: "极限思维：B→0 时 r→?", options: [{ text: "r→∞（几乎直线运动）", correct: true }, { text: "r→0" }], answerIndex: 0 } },
    ],
    variants: [
      { stem: "如果粒子不是垂直射入磁场，而是有一个与磁场成 $\\alpha$ 角的入射方向，会是什么运动？", answer: "螺旋运动：v 分解为平行磁场 v∥（匀速直线）和垂直 v⊥（圆周），合成螺旋。" },
      { stem: "粒子在磁场中做匀速圆周运动，轨迹弦长 $L$，磁感应强度 $B$，比荷已知。证明 $\\sin(\\theta/2) = LBq/(2mv)$ （θ 为偏转角）。", answer: "几何作图：弦长 L = 2r sin(θ/2)，代入 r=mv/(qB) 即可。" },
    ],
  },

  // ========== 电磁感应 ==========
  {
    id: "gaokao_emind_001",
    exam: "gaokao",
    model: "em_induction",
    title: "导体棒切割",
    stem: "光滑 U 形金属导轨宽 $L=1$ m，电阻可忽略，左端接有 $R=2$ Ω 电阻。匀强磁场 $B=0.5$ T 垂直导轨平面向里。长金属棒垂直置于导轨上，电阻 $r=1$ Ω。用水平恒力 $F=1$ N 从静止拉动金属棒，求棒的稳定速度和稳定时的功率分配。",
    keywords: ["光滑导轨", "切割磁感线", "安培力", "稳定速度"],
    causalChain: {
      correct: "初始：F拉 → 棒加速 → 有速度 → 产生E=BLv → 电流I=E/(R+r) → 安培力F安=BIL 阻碍F拉 → 当 F拉=F安 时稳定 → 速度不再增大",
      distractors: ["误以为安培力做负功，总功为零就停了（不对，稳定时仍有动能变化吗？不！稳定时 a=0，速度不变，动能不变，拉力的功全部转化为电能/热量）"],
      options: [
        { id: "A", text: "当 F拉 = F安 = BIL = B·BLv/(R+r)·L 时，a=0 速度稳定", correct: true, feedback: "对！稳定条件是合外力为零：F = B²L²v/(R+r)，直接解 v。" },
        { id: "B", text: "直接列 F=ma + ma=mdv/dt + 积分求 v(t) 再令 t→∞", correct: true, feedback: "也可以，但稳定状态没必要解微分方程。" },
        { id: "C", text: "稳定时动能最大，安培力不做功", correct: false, feedback: "稳定时动能**不变**（匀速），安培力一直做负功把电能转成热。拉力的功等于电路发热量。" },
      ],
    },
    steps: [
      { step: 1, name: "读题" },
      { step: 2, name: "选对象", semiGuide: { title: "研究对象", prompts: ["金属棒：动力学分析", "棒+导轨+电阻：能量分析"] } },
      { step: 3, name: "分过程", fullGuide: { question: "运动分几个阶段？", options: [{ text: "加速阶段 + 匀速稳定阶段", correct: true }, { text: "一直加速下去" }], answerIndex: 0 } },
      { step: 4, name: "画图", drawHints: ["画 U 形导轨 + 棒 + 外力 F + 磁场方向", "画感应电流方向（右手定则）", "画安培力方向（左手定则：与F反向）"] },
      { step: 5, name: "选规律" },
      {
        step: 6,
        name: "列方程",
        equations: {
          unknowns: ["v_稳定", "I", "P_热"],
          equationCount: 4,
          equations: [
            { id: 1, object: "棒", process: "稳定时", law: "力的平衡", expr: "F - B*I*L", latex: "F = B I L" },
            { id: 2, object: "回路", process: "稳定时", law: "法拉第定律", expr: "E - B*L*v", latex: "\\mathcal{E} = B L v" },
            { id: 3, object: "回路", process: "稳定时", law: "欧姆定律", expr: "I - E/(R+r)", latex: "I = \\frac{E}{R+r}" },
            { id: 4, object: "整个系统", process: "稳定时", law: "能量守恒", expr: "F*v - I^2*(R+r)", latex: "Fv = I^2(R+r)" },
          ],
          solutions: [{ id: "A", name: "力平衡+法拉第+欧姆", equations: [
            { id: 1, law: "力平衡", expr: "F - B*I*L" },
            { id: 2, law: "法拉第定律", expr: "E - B*L*v" },
            { id: 3, law: "欧姆定律", expr: "I - E/(R+r)" },
          ] }],
        },
      },
      { step: 7, name: "解方程", fullGuide: { question: "代入数值 B=0.5, L=1, R=2, r=1, F=1：v=?", options: [{ text: "v = F(R+r)/(B²L²) = 1×3/(0.25×1) = 12 m/s", correct: true }, { text: "v = F/(BL) = 2 m/s" }], answerIndex: 0 } },
      { step: 8, name: "检验", fullGuide: { question: "此时功率 P=Fv=12W，电阻和内阻各分多少？", options: [{ text: "内阻：P_r = I²r, 外阻 P_R = I²R，R:r = 2:1 所以 P_R=8W, P_r=4W", correct: true }, { text: "各 6W" }], answerIndex: 0 } },
    ],
    variants: [
      { stem: "外力F撤去（断开电源），棒会怎样运动？用动量定理和能量法分别分析。", answer: "减速到0；∫F安dt = -mv0；½mv0² = Q = ∫I²(R+r)dt" },
      { stem: "把导轨间距变成可变（导体棒斜着切），角度α与导轨成夹角。E还等于BLv吗？", answer: "有效长度 L' = L/sinα？不，E = B·L·v·sin(⊥)，三者要两两垂直。E = B L v 要求 B⊥L 且 L⊥v。" },
    ],
  },
];
