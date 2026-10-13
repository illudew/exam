import type { Question } from "../types";

export const zhongkaoQuestions: Question[] = [
  // ========== 杠杆 ==========
  {
    id: "zk_lever_001",
    exam: "zhongkao",
    model: "lever",
    title: "杠杆平衡的动力臂阻力臂",
    stem: "一根轻质杠杆（重忽略不计）长 $L=1$ m，支点距左端 $L_1=0.4$ m。在左端挂一个质量为 $m_1=2$ kg 的物体。要让杠杆在水平位置平衡，右端需要挂多大质量 $m_2$ 的物体？（$g$ 取 $10$ m/s²）",
    keywords: ["轻质", "平衡", "力臂", "支点"],
    causalChain: {
      correct: "找支点 → 找动力臂/阻力臂 → 杠杆平衡条件 F1L1=F2L2",
      distractors: ["把杠杆总长度当成力臂", "忘记支点在杠杆中间还是端点（影响L2）"],
      options: [
        { id: "A", text: "支点在杠杆内某处（距左0.4m），L2 = 1-0.4 = 0.6 m", correct: true, feedback: "对！先确定支点位置，然后量支点到两个力作用点的距离作为力臂。" },
        { id: "B", text: "L2 = 0.4 m（和左边一样）", correct: false, feedback: "错！支点到右端的距离才是右端的力臂。" },
        { id: "C", text: "F1 + F2 = 0（误以为要考虑杠杆重）", correct: false, feedback: "轻质杠杆自重忽略不计，所以只需要 F1L1 = F2L2。" },
      ],
    },
    steps: [
      { step: 1, name: "读题", fullGuide: { question: "支点距左端多少？右端离支点多远？", options: [{ text: "右力臂 = 1 - 0.4 = 0.6 m", correct: true }, { text: "右力臂 = 1 m" }], answerIndex: 0 } },
      { step: 2, name: "选对象" },
      { step: 3, name: "分过程" },
      { step: 4, name: "画图", drawHints: ["画杠杆，标支点 △", "画左端物体（mg向下）", "画右端物体（mg向下）", "画 L1 和 L2（支点到力作用线的垂直距离）"] },
      { step: 5, name: "选规律" },
      {
        step: 6,
        name: "列方程",
        equations: {
          unknowns: ["m2"],
          equationCount: 1,
          equations: [
            { id: 1, object: "杠杆", process: "水平平衡", law: "杠杆平衡条件", expr: "m1*g*L1 - m2*g*L2", latex: "m_1 g L_1 = m_2 g L_2" },
          ],
          solutions: [
            { id: "A", name: "直接平衡条件", equations: [{ id: 1, law: "杠杆平衡条件", expr: "m1*g*L1 - m2*g*L2" }] },
            { id: "B", name: "力F=mg 先算出力再代", equations: [{ id: 1, law: "F=mg", expr: "F1 - m1*g" }, { id: 2, law: "杠杆平衡", expr: "F1*L1 - F2*L2" }, { id: 3, law: "F=mg", expr: "F2 - m2*g" }] },
          ],
        },
      },
      { step: 7, name: "解方程", fullGuide: { question: "g 约掉，得 m2 = m1 * L1 / L2 = ?", options: [{ text: "m2 = 2 × 0.4 / 0.6 ≈ 1.33 kg", correct: true }, { text: "m2 = 2 × 0.4 / 1 = 0.8 kg" }], answerIndex: 0 } },
      { step: 8, name: "检验", fullGuide: { question: "动力臂短（0.4）阻力臂长（0.6），所以动力应该更大还是更小？", options: [{ text: "动力臂短需要更大的动力，左边2kg > 右边1.33kg，合理 ✓", correct: true }, { text: "说不准" }], answerIndex: 0 } },
    ],
    variants: [
      { stem: "把支点移到杠杆正中间，左边加一个 3kg 物体挂在距支点 0.1 m 处。右边挂 2kg 物体，它离支点应该多远才能平衡？", answer: "L = 0.15 m" },
      { stem: "如果杠杆自重不能忽略（重心在中点），左端挂 20N 物体，右端什么都不挂，杠杆就已经水平平衡。说明杠杆重多少？", answer: "杠杆自重 = 0（因为自重重心就在支点上，力臂为零不影响平衡）" },
    ],
  },

  // ========== 浮力密度 ==========
  {
    id: "zk_archimedes_001",
    exam: "zhongkao",
    model: "density",
    title: "阿基米德原理",
    stem: "一个实心铁块质量 $m=7.9$ kg，完全浸没在水中。求：(1) 铁块体积；(2) 它受到的浮力；(3) 弹簧秤拉力（在水中称量）。（$\\rho_\\text{铁}=7.9×10^3$ kg/m³, $\\rho_\\text{水}=1.0×10^3$ kg/m³, $g=10$）",
    keywords: ["完全浸没", "阿基米德", "浮力", "弹簧秤"],
    causalChain: {
      correct: "由密度定义求体积 → 阿基米德原理 F浮=ρ水gV排=ρ水gV → 弹簧秤示重 = 重力 - 浮力",
      distractors: ["直接用 m铁g 当浮力（错！浮力和重力不是一回事）", "V排 ≠ V（漂浮时才≠，完全浸没时 V排=V物）"],
      options: [
        { id: "A", text: "V = m/ρ铁 = 1×10⁻³ m³; F浮 = ρ水gV = 10 N; 示数 = 79-10 = 69 N", correct: true, feedback: "对！密度先算体积（完全浸没 V排=V物），然后阿基米德原理，最后弹簧秤 F示=G-F浮。" },
        { id: "B", text: "F浮 = m铁g = 79 N", correct: false, feedback: "大错！浮力是排开液体的重量，不是物体本身的重量。物体如果比水重，浮力比重力小。" },
        { id: "C", text: "V排 = 0.5 V（以为半浮半沉）", correct: false, feedback: "明确说了“完全浸没”，V排=V物。只有漂浮时才 V排<V物。" },
      ],
    },
    steps: [
      { step: 1, name: "读题" },
      { step: 2, name: "选对象" },
      { step: 3, name: "分过程", fullGuide: { question: "铁块静止完全浸没在水中，合力为零吗？", options: [{ text: "对！弹簧秤拉力 + 浮力 = 重力", correct: true }, { text: "合力不为零，铁块下沉" }], answerIndex: 0 } },
      { step: 4, name: "画图", drawHints: ["画铁块浸没在水中", "画三个力：G 向下、F浮 向上、F示 向上"] },
      { step: 5, name: "选规律" },
      {
        step: 6,
        name: "列方程",
        equations: {
          unknowns: ["V", "F浮", "F示"],
          equationCount: 3,
          equations: [
            { id: 1, object: "铁块", process: "密度定义", law: "密度公式", expr: "rho_iron*V - m", latex: "\\rho_\\text{铁} V = m" },
            { id: 2, object: "铁块（完全浸没）", process: "浮力", law: "阿基米德原理", expr: "F_buoy - rho_water*g*V", latex: "F_\\text{浮} = \\rho_\\text{水} g V" },
            { id: 3, object: "铁块（平衡）", process: "三力平衡", law: "合力为零", expr: "F_spring + F_buoy - m*g", latex: "F_\\text{示} + F_\\text{浮} = mg" },
          ],
          solutions: [{ id: "A", name: "密度+阿基米德+三力平衡", equations: [
            { id: 1, law: "密度公式", expr: "rho_iron*V - m" },
            { id: 2, law: "阿基米德原理", expr: "F_buoy - rho_water*g*V" },
            { id: 3, law: "三力平衡", expr: "F_spring + F_buoy - m*g" },
          ] }],
        },
      },
      { step: 7, name: "解方程", fullGuide: { question: "代入数值结果是？", options: [{ text: "V=10⁻³ m³, F浮=10N, F示=69N", correct: true }, { text: "F浮=79N, F示=0N" }], answerIndex: 0 } },
      { step: 8, name: "检验", fullGuide: { question: "如果换用酒精（ρ酒精=0.8×10³），浮力会？", options: [{ text: "变小，F浮=ρ酒精gV < ρ水gV", correct: true }, { text: "不变" }], answerIndex: 0 } },
    ],
    variants: [
      { stem: "把这个铁块换成木块（ρ木=0.6×10³），它能浮在水面上。木块露出水面体积占总体积的多少？", answer: "漂浮时 F浮=G → ρ水gV排=ρ木gV → V排/V = ρ木/ρ水 = 60%；露出 40%" },
      { stem: "弹簧秤挂着铁块从水面上方缓慢放入水中（完全浸没），示数如何变化？浮力如何变化？", answer: "随着浸入深度增加，V排增大 → F示 减小、F浮增大；完全浸没后不再变化。" },
    ],
  },

  // ========== 压强 ==========
  {
    id: "zk_pressure_001",
    exam: "zhongkao",
    model: "pressure",
    title: "固体压强与液体压强",
    stem: "一个长方体砖块，长宽高分别为 $a=40$ cm, $b=20$ cm, $c=10$ cm，重 $G=20$ N。把它平放在水平地面上，求：(1) 对地面的压力；(2) 对地面的压强；(3) 若把它竖放（以 20×10 面为底），压强又多大？",
    keywords: ["水平地面", "平放/竖放", "压强", "受力面积"],
    causalChain: {
      correct: "水平地面压力=重力 → 压强 p=F/S = G/S → 平放和竖放 S 不同所以 p 不同",
      distractors: ["把底面积 S 和砖块的体积搞混", "把三个面的面积算错", "忘记压强的定义 p=F/S"],
      options: [
        { id: "A", text: "平放 S=0.4×0.2=0.08 m², p=20/0.08=250 Pa；竖放 S=0.2×0.1=0.02 m², p=1000 Pa", correct: true, feedback: "对！竖放受力面积小 4 倍，压强大 4 倍。" },
        { id: "B", text: "F 不应该等于 G，要考虑形状", correct: false, feedback: "水平静止在地面上的物体，竖直方向合力为零：地面对物的支持力 N=G，反过来物对地面的压力 F=N=G。" },
        { id: "C", text: "压强和放法无关", correct: false, feedback: "错！F=G 不变，但 S 变了，所以 p=F/S 也变。" },
      ],
    },
    steps: [
      { step: 1, name: "读题" },
      { step: 2, name: "选对象" },
      { step: 3, name: "分过程" },
      { step: 4, name: "画图", drawHints: ["画砖块平放（大面接触地面）", "画砖块竖放（小面接触）", "标注 S 与 G"] },
      { step: 5, name: "选规律" },
      {
        step: 6,
        name: "列方程",
        equations: {
          unknowns: ["F", "p_平放", "p_竖放"],
          equationCount: 4,
          equations: [
            { id: 1, object: "砖块", process: "水平静止", law: "受力平衡", expr: "F - G", latex: "F = G" },
            { id: 2, object: "砖块平放", process: "接触面积", law: "面积公式", expr: "S_flat - a*b", latex: "S_\\text{平} = ab" },
            { id: 3, object: "砖块平放", process: "压强", law: "压强定义", expr: "p_flat - F/S_flat", latex: "p_\\text{平} = F/S_\\text{平}" },
            { id: 4, object: "砖块竖放", process: "压强", law: "压强定义", expr: "p_tall - F/(b*c)", latex: "p_\\text{竖} = F/(bc)" },
          ],
          solutions: [{ id: "A", name: "力平衡+面积+压强", equations: [
            { id: 1, law: "力平衡", expr: "F - G" },
            { id: 2, law: "面积", expr: "S_flat - a*b" },
            { id: 3, law: "压强定义", expr: "p_flat - F/S_flat" },
            { id: 4, law: "压强定义", expr: "p_tall - F/(b*c)" },
          ] }],
        },
      },
      { step: 7, name: "解方程", fullGuide: { question: "单位换算都换成米，结果是？", options: [{ text: "p平=250 Pa, p竖=1000 Pa", correct: true }, { text: "p平=2500 Pa" }], answerIndex: 0 } },
      { step: 8, name: "检验", fullGuide: { question: "液体压强公式 p=ρgh 和这里的固体压强 p=F/S 有什么区别？", options: [{ text: "液体压强只与密度和深度有关，固体压强必须用 p=F/S 对具体受力面积分析", correct: true }, { text: "都一样" }], answerIndex: 0 } },
    ],
    variants: [
      { stem: "把砖放到 100 m 深的水底，砖上表面受到的水的压强是多少？", answer: "p = ρ水gh = 1e3 × 10 × 100 = 1e6 Pa" },
      { stem: "一个质量为 60 kg 的人，双脚站立时对地面的压强约 1.5×10⁴ Pa。估测一只脚的面积。", answer: "S脚 ≈ G/(2p) = 600/(2×1.5e4) ≈ 2e-2 m² = 200 cm²" },
    ],
  },

  // ========== 欧姆定律 ==========
  {
    id: "zk_ohm_001",
    exam: "zhongkao",
    model: "ohm_law",
    title: "混联电路",
    stem: "电源电压 $U=12$ V，R₁=4 Ω 和 R₂=6 Ω 并联，然后与 R₃=2 Ω 串联。求：(1) 电路总电阻；(2) 总电流；(3) R₁ 上的电流。",
    keywords: ["并联", "串联", "总电阻", "分流"],
    causalChain: {
      correct: "先算 R1R2 并联总电阻 R并 → 再算串联总 R总 = R并 + R3 → 总电流 I = U/R总 → 并联部分电压 U并 = U - IR3 → 分流得 I1",
      distractors: ["忘了并联先算再串的步骤，直接把三个加起来", "并联公式搞成 R1R2/(R1+R2) 的倒数不会算", "并联电压相等，U1 = U并 ≠ 总U"],
      options: [
        { id: "A", text: "R并=R1R2/(R1+R2)=24/10=2.4Ω; R总=4.4Ω; I总≈2.73A; U并≈6.54V; I1=U并/4≈1.63A", correct: true, feedback: "对！混联电路从局部到整体再到局部，一层一层算。" },
        { id: "B", text: "R总 = 4 + 6 + 2 = 12Ω", correct: false, feedback: "错！R1 和 R2 是并联关系，不是串联。并联总电阻一定比最小的那个还小（2.4 < 4）。" },
        { id: "C", text: "I1 = U/R1 = 12/4 = 3A", correct: false, feedback: "错！并联部分的电压不是电源电压（因为 R3 也要分压），U并 ≠ 12V。" },
      ],
    },
    steps: [
      { step: 1, name: "读题" },
      { step: 2, name: "选对象" },
      { step: 3, name: "分过程" },
      { step: 4, name: "画图", drawHints: ["画电路图：电源、R3 在干路，R1 与 R2 并联", "标各节点电压", "标电流方向"] },
      { step: 5, name: "选规律" },
      {
        step: 6,
        name: "列方程",
        equations: {
          unknowns: ["R_parallel", "R_total", "I_total", "U_parallel", "I1"],
          equationCount: 5,
          equations: [
            { id: 1, object: "R1, R2", process: "并联", law: "并联电阻公式", expr: "R_parallel - R1*R2/(R1+R2)", latex: "R_\\text{并} = \\frac{R_1 R_2}{R_1 + R_2}" },
            { id: 2, object: "整个电路", process: "串联", law: "串联电阻求和", expr: "R_total - R_parallel - R3", latex: "R_\\text{总} = R_\\text{并} + R_3" },
            { id: 3, object: "整个电路", process: "总电流", law: "欧姆定律", expr: "U - I_total*R_total", latex: "U = I_\\text{总} R_\\text{总}" },
            { id: 4, object: "R3", process: "分压", law: "欧姆定律", expr: "U_parallel - U + I_total*R3", latex: "U_\\text{并} = U - I_\\text{总} R_3" },
            { id: 5, object: "R1", process: "电流", law: "欧姆定律", expr: "U_parallel - I1*R1", latex: "U_\\text{并} = I_1 R_1" },
          ],
          solutions: [{ id: "A", name: "局部→整体→局部", equations: [
            { id: 1, law: "并联电阻", expr: "R_parallel - R1*R2/(R1+R2)" },
            { id: 2, law: "串联求和", expr: "R_total - R_parallel - R3" },
            { id: 3, law: "欧姆定律", expr: "U - I_total*R_total" },
            { id: 4, law: "分压", expr: "U_parallel - U + I_total*R3" },
            { id: 5, law: "欧姆定律", expr: "U_parallel - I1*R1" },
          ] }],
        },
      },
      { step: 7, name: "解方程", fullGuide: { question: "逐步代入数值：R总=4.4Ω, I总=12/4.4≈2.73A, I1≈1.63A，对吗？", options: [{ text: "对，验证 I2=U并/6≈1.09A, I1+I2≈2.72≈I总 ✓", correct: true }, { text: "不对，I总=3A" }], answerIndex: 0 } },
      { step: 8, name: "检验", fullGuide: { question: "若 R3=0（短路），此时并联部分电压=12V，I1=3A, I2=2A, I总=5A。合理吗？", options: [{ text: "合理，因为 R3 不起作用了", correct: true }, { text: "不合理" }], answerIndex: 0 } },
    ],
    variants: [
      { stem: "把 R3 换成灯泡，额定电压 6V 额定功率 3W。R1=12Ω, R2=8Ω。灯正常发光时，干路电流是多少？", answer: "灯正常→U_L=6V → 并联部分电压=6V，R1电流=0.5A，R2电流=0.75A，干路=2.25A（灯电流=0.5A）" },
      { stem: "两个用电器并联，电源电压不变。其中一个电阻变大，总电流怎么变？", answer: "并联总电阻变大→总电流变小。分流：R大的支路电流变小，R小的不变。" },
    ],
  },

  // ========== 比热容 ==========
  {
    id: "zk_specific_heat_001",
    exam: "zhongkao",
    model: "heat_transfer",
    title: "比热容吸放热",
    stem: "质量 $m_\\text{水}=2$ kg、初温 $t_1=20$ ℃ 的水，用一个功率 $P=1000$ W 的电加热器加热 $\\Delta t=420$ s。若加热器放出的热量全部被水吸收，求水的末温。（$c_\\text{水}=4.2×10^3$ J/(kg·℃)）",
    keywords: ["全部吸收", "功率", "时间", "末温"],
    causalChain: {
      correct: "加热器放热 Q放 = P·Δt → 水吸热 Q吸 = c水m水Δt' → Q放 = Q吸 → 解出 Δt' → t末 = t1 + Δt'",
      distractors: ["把时间 Δt 当成温度变化量（同名变量！这里 Δt 是加热时间，Δt' 是温度变化）", "忘记 P 的单位是 W=J/s，P·Δt 才是焦耳"],
      options: [
        { id: "A", text: "Q放=1000W×420s=420000J; Δt'=Q/(cm)=420000/(4.2e3×2)=50℃; t末=20+50=70℃", correct: true, feedback: "对！能量守恒：电功全部转化为内能被水吸收。" },
        { id: "B", text: "Δt'=420℃（把时间直接当温度变化）", correct: false, feedback: "大错特错！Δt 在题目里是“加热时间 420 秒”，不是温度变化。要分清物理量符号。" },
        { id: "C", text: "Q=cmΔt 中的 Δt 取 420，直接算", correct: false, feedback: "同上，物理意义混淆。加热时间和温度变化是完全不同的物理量。" },
      ],
    },
    steps: [
      { step: 1, name: "读题", fullGuide: { question: "题目中“Δt=420”这个量是什么物理意义？", options: [{ text: "加热时间 420 秒", correct: true }, { text: "温度变化 420 ℃" }], answerIndex: 0 } },
      { step: 2, name: "选对象" },
      { step: 3, name: "分过程" },
      { step: 4, name: "画图", drawHints: ["画加热器 → 水（热传导）", "标 m水, c水, t1, P, 时间 Δt_时间, 温度变化 Δt_温度"] },
      { step: 5, name: "选规律" },
      {
        step: 6,
        name: "列方程",
        equations: {
          unknowns: ["Q_放", "Δt_温", "t_末"],
          equationCount: 3,
          equations: [
            { id: 1, object: "加热器", process: "加热", law: "电功公式", expr: "Q_heat - P*time", latex: "Q_\\text{放} = P \\cdot \\Delta t_\\text{时间}" },
            { id: 2, object: "水", process: "吸热", law: "比热容公式", expr: "Q_heat - c_water*m_water*delta_T", latex: "Q_\\text{吸} = c m \\Delta T" },
            { id: 3, object: "水", process: "末温", law: "温度变化", expr: "t_final - t_initial - delta_T", latex: "t_\\text{末} = t_1 + \\Delta T" },
          ],
          solutions: [{ id: "A", name: "电功+比热容+温度", equations: [
            { id: 1, law: "电功", expr: "Q_heat - P*time" },
            { id: 2, law: "比热容", expr: "Q_heat - c_water*m_water*delta_T" },
            { id: 3, law: "温度变化", expr: "t_final - t_initial - delta_T" },
          ] }],
        },
      },
      { step: 7, name: "解方程", fullGuide: { question: "结果是？", options: [{ text: "t末 = 20 + Q/(cm) = 20 + 420000/(4.2e3×2) = 70℃", correct: true }, { text: "t末 = 440℃" }], answerIndex: 0 } },
      { step: 8, name: "检验", fullGuide: { question: "如果效率只有 50%（Q吸=0.5 Q放），末温会怎样？", options: [{ text: "ΔT=25℃, t末=45℃", correct: true }, { text: "还是 70℃" }], answerIndex: 0 } },
    ],
    variants: [
      { stem: "把水换成 2 kg 煤油（c煤油=2.1×10³），其他条件不变，末温会？", answer: "ΔT 会变成 100℃（Q/cm 中 c 减半 → ΔT 翻倍），但考虑沸点可能达不到。" },
      { stem: "将 1 kg 100℃ 的热水倒入 2 kg 20℃ 的冷水，不计热量损失，混合后的末温？", answer: "c水×1×(100-t末) = c水×2×(t末-20) → t末≈46.7℃" },
    ],
  },

  // ========== 光学 ==========
  {
    id: "zk_optics_001",
    exam: "zhongkao",
    model: "optics_reflection",
    title: "凸透镜成像规律",
    stem: "一个凸透镜焦距 $f=10$ cm。将蜡烛放在距透镜 $u=25$ cm 处，光屏在另一侧。(1) 在光屏上能不能接到像？为什么？(2) 像的性质（倒立/正立、放大/缩小、实像/虚像）；(3) 若把蜡烛移到 $u=8$ cm 处，光屏上能不能接到像？此时眼睛在另一侧能看到什么？",
    keywords: ["凸透镜", "成像规律", "实像虚像", "焦距"],
    causalChain: {
      correct: "u>2f → 成倒立缩小实像（v 在 f~2f 间），能在光屏承接 → u<f → 成正立放大虚像，不能承接，是放大镜原理",
      distractors: ["把成像规律搞反（倒立和正立）", "v 的位置与 f、2f 的关系搞混", "u<f 时误以为光屏还能承接"],
      options: [
        { id: "A", text: "u=25cm>2f(20cm)：倒立缩小实像，能光屏承接；u=8cm<f：正立放大虚像，不能承接（放大镜）", correct: true, feedback: "对！记住凸透镜成像口诀：一倍焦距分虚实，二倍焦距分大小。" },
        { id: "B", text: "u=25cm：正立放大实像", correct: false, feedback: "错！u>2f 是缩小实像，f<u<2f 才是放大实像。" },
        { id: "C", text: "u=8cm 时光屏能接到像", correct: false, feedback: "错！u<f 时是虚像，虚像由光线反向延长线形成，不是实际光线会聚，所以光屏接不到。" },
      ],
    },
    steps: [
      { step: 1, name: "读题" },
      { step: 2, name: "选对象" },
      { step: 3, name: "分过程" },
      { step: 4, name: "画图", drawHints: ["画透镜主光轴 + F/2F 标记（焦距f=10cm）", "画两条特殊光线：①过光心直线传播；②平行于主光轴经透镜过焦点", "由光线交点确定像的位置"] },
      { step: 5, name: "选规律" },
      {
        step: 6,
        name: "列方程",
        equations: {
          unknowns: ["v1", "性质1", "v2", "性质2"],
          equationCount: 2,
          equations: [
            { id: 1, object: "凸透镜成像(一)", process: "u=25cm>2f", law: "成像公式 1/u+1/v=1/f", expr: "1/25 + 1/v1 - 1/10", latex: "\\tfrac{1}{u} + \\tfrac{1}{v} = \\tfrac{1}{f}" },
            { id: 2, object: "凸透镜成像(二)", process: "u=8cm<f", law: "成像公式（v为负表示虚像）", expr: "1/8 + 1/v2 - 1/10", latex: "\\tfrac{1}{u} + \\tfrac{1}{v} = \\tfrac{1}{f} \\quad(v_2<0)" },
          ],
          solutions: [{ id: "A", name: "成像公式+定性规律", equations: [
            { id: 1, law: "成像公式", expr: "1/25 + 1/v1 - 1/10" },
            { id: 2, law: "成像公式", expr: "1/8 + 1/v2 - 1/10" },
          ] }],
        },
      },
      { step: 7, name: "解方程", fullGuide: { question: "v1 和 v2 分别是多少？", options: [{ text: "v1=16.7cm（倒立缩小实像，v≈17cm 在 10~20 间对 ✓）；v2=-40cm（正立放大虚像）", correct: true }, { text: "v1=-40cm, v2=16.7cm" }], answerIndex: 0 } },
      { step: 8, name: "检验", fullGuide: { question: "相机、幻灯机、放大镜分别对应哪种成像情况？", options: [{ text: "相机→u>2f, 幻灯机→f<u<2f, 放大镜→u<f", correct: true }, { text: "都一样" }], answerIndex: 0 } },
    ],
    variants: [
      { stem: "蜡烛从 u=30cm 缓慢靠近透镜直到 u=5cm，始终成实像的阶段？光屏应该向哪个方向移动？", answer: "只有 u>f 时才成实像（u>10cm）；成实像时物靠近→像远离，所以光屏要远离透镜。" },
      { stem: "把透镜换成凹透镜（发散），还能成实像吗？", answer: "凹透镜无论物体放哪都只能成正立缩小虚像（近视眼镜原理）。" },
    ],
  },

  // ========== 简单电磁现象 ==========
  {
    id: "zk_em_simple_001",
    exam: "zhongkao",
    model: "em_induction_simple",
    title: "电动机 vs 发电机",
    stem: "下列关于电动机和发电机的说法，正确的是（  ）",
    keywords: ["电动机", "发电机", "能量转化", "原理"],
    causalChain: {
      correct: "记住：电动机有电源→通电导体在磁场中受力→电能→机械能；发电机无电源→电磁感应→机械能→电能",
      distractors: ["把两者的能量转化搞反", "以为都需要电源", "把电流的磁效应（奥斯特）与电磁感应（法拉第）混淆"],
      options: [
        { id: "A", text: "电动机将电能转化为机械能，发电机将机械能转化为电能", correct: true, feedback: "对！这是两者最本质的区别。" },
        { id: "B", text: "电动机和发电机都是电能→机械能", correct: false, feedback: "错！发电机相反，是机械能→电能。" },
        { id: "C", text: "两者工作原理相同，只是输入输出不同", correct: false, feedback: "原理不同：电动机是通电导体在磁场中受力；发电机是导体切割磁感线产生感应电流。" },
      ],
    },
    steps: [
      { step: 1, name: "读题" },
      { step: 2, name: "选对象" },
      { step: 3, name: "分过程" },
      { step: 4, name: "画图", drawHints: ["画电动机示意图：有电源 + 磁场 + 线圈 + 换向器", "画发电机示意图：无电源 + 磁场 + 线圈 + 集电环"] },
      { step: 5, name: "选规律" },
      {
        step: 6,
        name: "列方程",
        equations: {
          unknowns: ["原理区分", "能量形式"],
          equationCount: 2,
          equations: [
            { id: 1, object: "电动机", process: "通电受力", law: "安培力定律 F=BIL", expr: "E_in - W_out", latex: "E_\\text{电} \\rightarrow E_\\text{机}" },
            { id: 2, object: "发电机", process: "电磁感应", law: "法拉第 E=nΔΦ/Δt", expr: "W_in - E_out", latex: "E_\\text{机} \\rightarrow E_\\text{电}" },
          ],
          solutions: [{ id: "A", name: "原理对比", equations: [
            { id: 1, law: "安培力", expr: "E_in - W_out" },
            { id: 2, law: "法拉第", expr: "W_in - E_out" },
          ] }],
        },
      },
      { step: 7, name: "解方程", fullGuide: { question: "日常生活中哪些是电动机，哪些是发电机？", options: [{ text: "电风扇、洗衣机是电动机；风力发电、水电站是发电机", correct: true }, { text: "都一样" }], answerIndex: 0 } },
      { step: 8, name: "检验", fullGuide: { question: "线圈为什么要换向器/集电环？", options: [{ text: "直流电动机需要换向器让受力方向保持旋转方向；发电机集电环只是引出交流电流", correct: true }, { text: "无所谓" }], answerIndex: 0 } },
    ],
    variants: [
      { stem: "奥斯特实验（通电导线使小磁针偏转）说明了什么？", answer: "电流周围存在磁场（电流的磁效应），是电生磁，不同于电磁感应（磁生电）。" },
      { stem: "右手定则：闭合电路的一部分导体做切割磁感线运动时，感应电流方向怎么判？", answer: "伸开右手，让磁感线穿手心，大拇指指向导体运动方向，弯曲的四指就是感应电流方向。" },
    ],
  },
];
