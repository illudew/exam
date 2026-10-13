import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-700 to-primary-600 text-white">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="grid" width="8" height="8" patternUnits="userSpaceOnUse">
                <path d="M 8 0 L 0 0 0 8" fill="none" stroke="white" strokeWidth="0.4" />
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#grid)" />
          </svg>
        </div>
        <div className="max-w-6xl mx-auto px-6 py-20 relative z-10">
          <div className="text-xs tracking-widest text-primary-200 mb-3 uppercase">
            🧠 IlluPhy · 物理模型模拟实验室
          </div>
          <h1 className="text-5xl md:text-6xl font-black leading-tight mb-5">
            从"死算答案"到<br />
            <span className="bg-gradient-to-r from-accent-green to-accent-orange bg-clip-text text-transparent">
              真正建立物理模型
            </span>
          </h1>
          <p className="text-lg md:text-xl text-primary-100 max-w-3xl mb-10 leading-relaxed">
            融合主动提取、生成式学习、多模态具身认知、因果结构与框架网络。
            <br />
            高考 <b>15 个核心模型</b>，中考 <b>8 个高频模型</b>，每道题配多解法判定、
            强制因果链分析、手写受力图、8 步解题器。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-xl">
            <Link
              href="/gaokao"
              className="group bg-white text-primary-700 px-8 py-4 rounded-xl font-bold text-lg hover:bg-primary-50 transition shadow-xl hover:shadow-2xl flex items-center justify-center gap-3"
            >
              <span className="text-2xl">🎓</span>
              高考物理系统
              <span className="group-hover:translate-x-1 transition">→</span>
            </Link>
            <Link
              href="/zhongkao"
              className="group bg-accent-orange text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-orange-600 transition shadow-xl hover:shadow-2xl flex items-center justify-center gap-3"
            >
              <span className="text-2xl">🏫</span>
              中考物理系统
              <span className="group-hover:translate-x-1 transition">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 架构亮点 */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold mb-2 text-center">⚙ 核心架构亮点</h2>
        <p className="text-gray-500 dark:text-dark-muted text-center mb-10">
          把物理学习从"答案对了就行"升级为"模型真的理解了"
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="card hover:-translate-y-0.5 transition"
            >
              <div className="text-3xl mb-3">{f.icon}</div>
              <div className="font-bold text-lg mb-1">{f.title}</div>
              <div className="text-sm text-gray-600 dark:text-dark-muted leading-relaxed">
                {f.desc}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 工作流 */}
      <section className="bg-gray-50 dark:bg-dark-bg py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-2 text-center">🔁 解题工作流</h2>
          <p className="text-gray-500 dark:text-dark-muted text-center mb-10">
            强制因果链 → 8 步解题 → 多解法判定 → 变式训练 → 间隔复习
          </p>
          <div className="grid md:grid-cols-5 gap-3">
            {WORKFLOW.map((w, i) => (
              <div
                key={w.title}
                className="relative bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-xl p-4 text-center"
              >
                <div className="w-8 h-8 rounded-full bg-primary-600 text-white font-bold flex items-center justify-center mx-auto mb-2 text-sm">
                  {i + 1}
                </div>
                <div className="font-bold text-sm mb-1">{w.title}</div>
                <div className="text-xs text-gray-500 dark:text-dark-muted">{w.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto px-6 py-10 text-center text-sm text-gray-500 dark:text-dark-muted">
        IlluPhy · 让物理学习真正有画面 · 完全离线 · 无外部 CDN
      </footer>
    </div>
  );
}

const FEATURES = [
  {
    icon: "🗺",
    title: "知识地图",
    desc: "D3 力导向因果网络，节点颜色反映掌握度（红<40% / 黄40-70% / 绿>70%），力导向自动布局，可拖拽缩放。",
  },
  {
    icon: "🔗",
    title: "强制因果链",
    desc: "进入解题器前必须先选主线：为什么用动能定理而不是动量守恒？选错主线哪怕答案对也判定模型错误。",
  },
  {
    icon: "📋",
    title: "8 步解题器",
    desc: "读题→选对象→分过程→画图→选规律→列方程(4层子步骤)→解方程→检验。每步独立判定。",
  },
  {
    icon: "🧮",
    title: "多解法判定",
    desc: "nerdamer 符号等价 + 二分图最大匹配判定。每个解法集合做二分图匹配，有匹配即整题对。",
  },
  {
    icon: "✍",
    title: "手写板",
    desc: "强制手动画受力图、轨迹图、电路图。支持颜色/粗细调整、清除、保存。",
  },
  {
    icon: "📈",
    title: "引导渐隐",
    desc: "同一模型前 3 题全引导、4-6 半引导、7 起裸题。裸题错误多自动回退并推送复习。",
  },
  {
    icon: "🔁",
    title: "变式训练",
    desc: "每道题后推荐因果链相同的 3-5 道变式，还有交错训练强制识别模型边界。",
  },
  {
    icon: "⏰",
    title: "间隔复习",
    desc: "基于遗忘曲线的 1/3/7 天间隔推送，到期自动提醒，强化长期记忆。",
  },
  {
    icon: "📊",
    title: "LocalStorage 持久化",
    desc: "所有认知数据（掌握度、正确率、复习队列）存浏览器本地，隐私安全，跨会话累积。",
  },
];

const WORKFLOW = [
  { title: "知识地图", desc: "浏览因果网络，定位薄弱模型" },
  { title: "因果链分析", desc: "选对主线才是关键第一步" },
  { title: "8 步解题", desc: "逐层引导，逐步归因" },
  { title: "多解法判定", desc: "符号层 + 物理层 + 路径层" },
  { title: "变式+复习", desc: "交错训练 + 间隔推送" },
];
