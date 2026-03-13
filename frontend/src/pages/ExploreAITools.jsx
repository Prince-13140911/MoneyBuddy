import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  Brain, TrendingUp, Heart, Sparkles, BarChart3, BookOpen,
  DollarSign, Star, ArrowRight, Zap, Lock,
} from 'lucide-react'

const TOOLS = [
  {
    icon: Brain,
    color: '#8B5CF6',
    glow: 'rgba(139,92,246,0.3)',
    title: 'Spending Personality Analysis',
    desc: 'Discover your spending habits and personality type based on your transaction patterns.',
    tag: 'AI Powered',
    available: true,
    route: '/ai-spending',
  },
  {
    icon: TrendingUp,
    color: '#10B981',
    glow: 'rgba(16,185,129,0.3)',
    title: 'Financial Future Simulator',
    desc: 'Predict your savings at 6 months, 1 year and 5 years. Compare current vs improved habits.',
    tag: 'AI Powered',
    available: true,
    route: '/simulator',
  },
  {
    icon: Sparkles,
    color: '#0EA5E9',
    glow: 'rgba(14,165,233,0.3)',
    title: 'Budget Optimisation',
    desc: 'AI analyses your budgets and suggests optimal allocations to meet your goals faster.',
    tag: 'AI Powered',
    available: true,
    route: '/smart-budget',
  },
  {
    icon: Heart,
    color: '#F43F5E',
    glow: 'rgba(244,63,94,0.3)',
    title: 'Financial Health Score',
    desc: 'Get a comprehensive score (0–100) measuring your overall financial wellness.',
    tag: 'Coming Soon',
    available: false,
  },
  {
    icon: DollarSign,
    color: '#14B8A6',
    glow: 'rgba(20,184,166,0.3)',
    title: 'Affordability Checker',
    desc: 'Tell the AI what you want to buy — it checks your finances and tells you if you can afford it.',
    tag: 'AI Powered',
    available: true,
    route: '/ai-advisor',
  },
  {
    icon: BarChart3,
    color: '#6366F1',
    glow: 'rgba(99,102,241,0.3)',
    title: 'Weekly Spending Report',
    desc: 'Auto-generated weekly digest of your spending with trends, alerts and AI insights.',
    tag: 'Coming Soon',
    available: false,
  },
  {
    icon: Star,
    color: '#F59E0B',
    glow: 'rgba(245,158,11,0.3)',
    title: 'AI Investment Journey Builder',
    desc: 'Answer 4 questions — get a personalized SIP roadmap with asset allocation and 5-year growth chart.',
    tag: 'AI Powered',
    available: true,
    route: '/investment-journey',
  },
  {
    icon: BookOpen,
    color: '#EC4899',
    glow: 'rgba(236,72,153,0.3)',
    title: 'Learning Hub',
    desc: 'Bite-sized financial literacy lessons curated by AI based on your spending behaviour.',
    tag: 'Coming Soon',
    available: false,
  },
]

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }
const stagger = { visible: { transition: { staggerChildren: 0.07 } } }

export default function ExploreAITools() {
  const navigate = useNavigate()

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg,#6366F1,#14B8A6)', boxShadow: '0 0 20px rgba(99,102,241,0.4)' }}>
            <Zap size={19} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-100">Explore AI Tools</h1>
            <p className="text-xs text-slate-500">Powered by MoneyBuddy AI · GPT-4 Enabled</p>
          </div>
        </div>
        <p className="text-slate-400 text-sm max-w-xl">
          All the intelligent tools you need to take control of your finances. Click any available tool to get started.
        </p>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { val: '8', label: 'AI Tools', color: '#6366F1' },
          { val: '3', label: 'Available Now', color: '#10B981' },
          { val: '5', label: 'Coming Soon', color: '#F59E0B' },
        ].map(({ val, label, color }) => (
          <div key={label} className="glass-card px-5 py-4 flex items-center gap-4">
            <p className="text-3xl font-black" style={{ color }}>{val}</p>
            <p className="text-sm text-slate-400 font-medium">{label}</p>
          </div>
        ))}
      </div>

      {/* Tools grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5"
        initial="hidden"
        animate="visible"
        variants={stagger}
      >
        {TOOLS.map(({ icon: Icon, color, glow, title, desc, tag, available, route }) => (
          <motion.div
            key={title}
            variants={fadeUp}
            className={`shimmer-card card-shine p-5 flex flex-col gap-4 relative overflow-hidden transition-all duration-300 ${
              available ? 'cursor-pointer hover:-translate-y-1' : 'opacity-70 cursor-default'
            }`}
            onClick={() => available && route && navigate(route)}
          >
            {/* glow blob */}
            <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full pointer-events-none"
              style={{ background: `radial-gradient(circle, ${glow}, transparent)`, filter: 'blur(20px)' }} />

            <div className="flex items-start justify-between">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: `${color}20`, border: `1px solid ${color}35`, boxShadow: `0 0 16px ${glow}` }}>
                <Icon size={20} style={{ color }} />
              </div>
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full"
                style={
                  available
                    ? { background: `${color}20`, color, border: `1px solid ${color}35` }
                    : { background: 'rgba(255,255,255,0.05)', color: '#6B7280', border: '1px solid rgba(255,255,255,0.08)' }
                }>
                {available ? (
                  <span className="flex items-center gap-1"><Sparkles size={9} />{tag}</span>
                ) : (
                  <span className="flex items-center gap-1"><Lock size={9} />{tag}</span>
                )}
              </span>
            </div>

            <div className="flex-1">
              <h3 className="font-bold text-slate-100 mb-1.5 text-sm">{title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{desc}</p>
            </div>

            {available && (
              <div className="flex items-center gap-1.5 text-xs font-semibold" style={{ color }}>
                Try it now <ArrowRight size={12} />
              </div>
            )}
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  )
}
