import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
  ResponsiveContainer, ReferenceLine,
} from 'recharts'
import {
  Map, Sparkles, Target, Brain, Lightbulb, TrendingUp, CheckCircle,
  IndianRupee, Laptop, Globe, Shield, Star, BookOpen,
  ChevronRight, ArrowRight, Zap, RefreshCw, Lock,
} from 'lucide-react'
import confetti from 'canvas-confetti'
import GlassCard from '../components/ui/GlassCard'
import { formatCurrency } from '../utils/formatCurrency'

const fadeUp  = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } }
const stagger = { visible: { transition: { staggerChildren: 0.1 } } }

// ─── Goal presets ────────────────────────────────────────────────
const GOALS = [
  { id: 'emergency', label: 'Emergency Fund', icon: Shield,  color: '#22C55E', targetMonths: 6,
    desc: 'Build a 3–6 month expense cushion', amount: (income) => income * 3, journeyType: 'safety' },
  { id: 'laptop',    label: 'Buy a Laptop',   icon: Laptop,  color: '#6366F1', targetMonths: 8,
    desc: 'Save up for a quality laptop/gadget', amount: () => 60000, journeyType: 'short-term' },
  { id: 'travel',    label: 'Travel Fund',    icon: Globe,   color: '#14B8A6', targetMonths: 12,
    desc: 'Plan your dream trip', amount: () => 80000, journeyType: 'short-term' },
  { id: 'wealth',    label: 'Long-term Wealth', icon: TrendingUp, color: '#F59E0B', targetMonths: 60,
    desc: 'Build wealth through SIP & investments', amount: (income) => income * 12, journeyType: 'wealth' },
  { id: 'custom',    label: 'Custom Goal',    icon: Star,    color: '#EC4899', targetMonths: 12,
    desc: 'Define your own financial goal', amount: () => 50000, journeyType: 'short-term' },
]

// ─── Risk levels ─────────────────────────────────────────────────
const RISK = [
  { id: 'low',      label: 'Conservative', color: '#22C55E', allocation: { fd: 60, debt: 30, equity: 10 },
    returnRate: 7,  desc: 'Fixed deposits, debt funds' },
  { id: 'medium',   label: 'Moderate',     color: '#F59E0B', allocation: { fd: 30, debt: 30, equity: 40 },
    returnRate: 12, desc: 'Balanced mutual funds' },
  { id: 'high',     label: 'Aggressive',   color: '#F43F5E', allocation: { fd: 10, debt: 20, equity: 70 },
    returnRate: 16, desc: 'Equity & index funds' },
]

// ─── Tooltip ─────────────────────────────────────────────────────
function ChartTip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl px-3 py-2 text-xs shadow-xl"
      style={{ background: 'var(--dropdown-bg)', border: '1px solid var(--border)', color: 'var(--body-text)' }}>
      <p className="text-slate-400 mb-1.5 font-medium">{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2 mb-0.5">
          <div className="w-2 h-2 rounded-full" style={{ background: p.stroke }} />
          <span className="text-slate-400">{p.name}:</span>
          <span className="font-bold" style={{ color: p.stroke }}>{formatCurrency(p.value)}</span>
        </div>
      ))}
    </div>
  )
}

// ─── Roadmap step ─────────────────────────────────────────────────
function RoadmapStep({ step, total, icon: Icon, color, title, subtitle, detail, locked, completed, active }) {
  return (
    <motion.div variants={fadeUp} className="flex gap-4">
      {/* Connector + icon */}
      <div className="flex flex-col items-center">
        <motion.div
          className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 relative z-10"
          style={{
            background: completed ? `${color}20` : active ? `${color}15` : 'var(--surface)',
            border: `2px solid ${completed || active ? color : 'var(--border)'}`,
            boxShadow: active ? `0 0 20px ${color}40` : 'none',
          }}
          animate={active ? { boxShadow: [`0 0 12px ${color}30`, `0 0 24px ${color}50`, `0 0 12px ${color}30`] } : {}}
          transition={{ repeat: Infinity, duration: 2 }}>
          {completed ? <CheckCircle size={18} style={{ color }} /> :
           locked    ? <Lock size={16} className="text-slate-600" /> :
                       <Icon size={18} style={{ color: active ? color : '#64748B' }} />}
        </motion.div>
        {step < total && (
          <div className="w-0.5 flex-1 my-1"
            style={{ background: completed ? `linear-gradient(to bottom, ${color}, ${color}40)` : 'var(--border)', minHeight: 32 }} />
        )}
      </div>

      {/* Content */}
      <div className={`flex-1 pb-6 ${step < total ? '' : ''}`}>
        <div className="rounded-2xl p-4 transition-all"
          style={{
            background: active ? `${color}08` : 'var(--surface)',
            border: `1px solid ${active ? `${color}30` : 'var(--border)'}`,
          }}>
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider"
                style={{ color: completed ? color : '#64748B' }}>
                Step {step}
              </span>
              {active && (
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full animate-pulse"
                  style={{ background: `${color}20`, color, border: `1px solid ${color}40` }}>
                  Current
                </span>
              )}
              {completed && (
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full"
                  style={{ background: 'rgba(34,197,94,0.1)', color: '#22C55E', border: '1px solid rgba(34,197,94,0.3)' }}>
                  ✓ Done
                </span>
              )}
            </div>
          </div>
          <h4 className="font-bold text-sm" style={{ color: active || completed ? 'var(--body-text)' : '#64748B' }}>
            {title}
          </h4>
          <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
          {!locked && detail && (
            <div className="mt-2.5 flex items-start gap-2 px-3 py-2 rounded-xl"
              style={{ background: `${color}0C`, border: `1px solid ${color}20` }}>
              <Lightbulb size={11} style={{ color }} className="mt-0.5 flex-shrink-0" />
              <p className="text-[11px]" style={{ color: '#94A3B8' }}>{detail}</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

// ─── Main page ────────────────────────────────────────────────────
export default function InvestmentJourney() {
  const [step, setStep]                   = useState(0) // 0 = quiz, 1 = roadmap
  const [income, setIncome]               = useState(25000)
  const [savings, setSavings]             = useState(3000)
  const [riskId, setRiskId]               = useState('medium')
  const [goalId, setGoalId]               = useState('emergency')
  const [customAmt, setCustomAmt]         = useState(50000)
  const [generating, setGenerating]       = useState(false)
  const [completedSteps, setCompletedSteps] = useState(0)

  const risk = RISK.find((r) => r.id === riskId)
  const goal = GOALS.find((g) => g.id === goalId)
  const targetAmount = goalId === 'custom' ? customAmt : goal.amount(income)
  const monthsNeeded = savings > 0 ? Math.ceil(targetAmount / savings) : 999
  const emergencyAmount = income * 3
  const emergencyMonthlySave = Math.max(500, Math.min(savings, 2000))
  const emergencyMonths = Math.ceil(emergencyAmount / emergencyMonthlySave)
  const isShortTermGoal = goal.journeyType === 'short-term'
  const targetTimelineMonths = goalId === 'emergency'
    ? emergencyMonths
    : isShortTermGoal
      ? emergencyMonths + monthsNeeded
      : monthsNeeded

  // SIP growth curve
  const sipData = useMemo(() => {
    const r = risk.returnRate / 100 / 12
    return Array.from({ length: 61 }, (_, i) => {
      const sipOnly  = savings * i
      const sipComp  = r > 0 ? savings * ((Math.pow(1 + r, i) - 1) / r) : sipOnly
      return { month: i === 0 ? 'Now' : i <= 12 ? `M${i}` : i === 24 ? '2yr' : i === 36 ? '3yr' : i === 48 ? '4yr' : i === 60 ? '5yr' : `M${i}`, plain: Math.round(sipOnly), compounded: Math.round(sipComp) }
    }).filter((_, i) => i % (i < 12 ? 2 : 6) === 0 || i === 60)
  }, [savings, risk.returnRate])

  const sipIn5y = useMemo(() => {
    const r = risk.returnRate / 100 / 12
    return r > 0 ? Math.round(savings * ((Math.pow(1 + r, 60) - 1) / r)) : savings * 60
  }, [savings, risk.returnRate])

  const fireGoalConfetti = () => {
    confetti({ particleCount: 140, spread: 90, startVelocity: 45, origin: { y: 0.7 } })
    window.setTimeout(() => {
      confetti({ particleCount: 90, spread: 120, startVelocity: 35, origin: { x: 0.2, y: 0.7 } })
      confetti({ particleCount: 90, spread: 120, startVelocity: 35, origin: { x: 0.8, y: 0.7 } })
    }, 180)
  }

  const handleGenerate = () => {
    setGenerating(true)
    setTimeout(() => {
      setGenerating(false)
      setStep(1)
      setCompletedSteps(0)
    }, 1600)
  }

  const handleCompleteStep = () => {
    if (completedSteps >= roadmapSteps.length) return
    const nextCompletedSteps = completedSteps + 1
    setCompletedSteps(nextCompletedSteps)
    if (nextCompletedSteps === roadmapSteps.length) {
      fireGoalConfetti()
    }
  }

  // Build roadmap steps
  const roadmapSteps = useMemo(() => {
    const steps = []
    const shouldAddWealthSteps = goal.journeyType === 'wealth' || goal.journeyType === 'safety'

    steps.push({
      icon: Shield, color: '#22C55E',
      title: `Build Emergency Fund → ${formatCurrency(emergencyAmount)}`,
      subtitle: `Save ${formatCurrency(emergencyMonthlySave)}/month · ~${emergencyMonths} months`,
      detail: 'Keep this in a high-interest savings account or liquid fund for quick access.',
    })

    if (goalId !== 'emergency') {
      steps.push({
        icon: goal.icon, color: goal.color,
        title: `${goal.label} → ${formatCurrency(targetAmount)}`,
        subtitle: isShortTermGoal
          ? `Save ${formatCurrency(savings)}/month · ~${monthsNeeded} months after your safety fund`
          : `Save ${formatCurrency(savings)}/month · ~${monthsNeeded} months`,
        detail: `Allocate a dedicated SIP or RD for this goal. Separate it from your emergency fund.`,
      })
    }

    if (shouldAddWealthSteps) {
      steps.push({
        icon: TrendingUp, color: '#6366F1',
        title: `Start SIP → ${formatCurrency(savings)}/month`,
        subtitle: `${risk.desc} at ~${risk.returnRate}% expected return`,
        detail: `₹${savings.toLocaleString('en-IN')}/month SIP grows to approx. ${formatCurrency(sipIn5y)} in 5 years with compounding.`,
      })

      steps.push({
        icon: BookOpen, color: '#F59E0B',
        title: riskId === 'high' ? 'Diversify into Index Funds & ETFs' : riskId === 'medium' ? 'Invest in Balanced Mutual Funds' : 'Ladder Fixed Deposits & Debt Funds',
        subtitle: risk.allocation.equity > 30 ? 'Nifty 50 index + 2–3 diversified equity funds' : 'Mix of FD, debt mutual funds, and PPF',
        detail: `Allocation: ${risk.allocation.equity}% equity · ${risk.allocation.debt}% debt · ${risk.allocation.fd}% FD/cash`,
      })

      if (riskId !== 'low') {
        steps.push({
          icon: Star, color: '#EC4899',
          title: 'Build Long-term Wealth Portfolio',
          subtitle: 'After 1 year of regular SIP — add index funds & ELSS',
          detail: 'ELSS also saves tax under Section 80C (up to ₹1.5 lakh/year). Start with ₹500/month.',
        })
      }
    }

    return steps
  }, [income, savings, riskId, goalId, goal, targetAmount, monthsNeeded, risk, sipIn5y])

  return (
    <motion.div className="space-y-6" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>

      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center mt-0.5"
          style={{ background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)' }}>
          <Map size={16} className="text-amber-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold" style={{ color: 'var(--body-text)' }}>AI Investment Journey Builder</h1>
          <p className="text-sm text-slate-500 mt-0.5">Answer 4 quick questions — get your personalized investment roadmap</p>
        </div>
      </div>

      {/* Quiz / Roadmap toggle */}
      <AnimatePresence mode="wait">
        {step === 0 ? (
          <motion.div key="quiz" className="space-y-5"
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>

            {/* Q1 — Income */}
            <GlassCard>
              <div className="flex items-center gap-2 mb-4">
                <span className="w-6 h-6 rounded-full text-xs font-black flex items-center justify-center"
                  style={{ background: 'rgba(99,102,241,0.2)', color: '#818CF8' }}>1</span>
                <h3 className="font-semibold text-sm" style={{ color: 'var(--body-text)' }}>What is your monthly income?</h3>
              </div>
              <input type="range" min={5000} max={150000} step={500} value={income}
                onChange={(e) => setIncome(Number(e.target.value))}
                className="w-full h-2 rounded-full appearance-none cursor-pointer mb-2"
                style={{
                  accentColor: '#6366F1',
                  background: `linear-gradient(to right, #6366F1 0%, #6366F1 ${((income - 5000) / (150000 - 5000)) * 100}%, rgba(100,116,139,0.3) ${((income - 5000) / (150000 - 5000)) * 100}%, rgba(100,116,139,0.3) 100%)`,
                }} />
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">₹5,000</span>
                <span className="font-black text-primary text-base">{formatCurrency(income)}</span>
                <span className="text-slate-500">₹1,50,000</span>
              </div>
            </GlassCard>

            {/* Q2 — Savings */}
            <GlassCard>
              <div className="flex items-center gap-2 mb-4">
                <span className="w-6 h-6 rounded-full text-xs font-black flex items-center justify-center"
                  style={{ background: 'rgba(34,197,94,0.2)', color: '#22C55E' }}>2</span>
                <h3 className="font-semibold text-sm" style={{ color: 'var(--body-text)' }}>How much can you save/invest monthly?</h3>
              </div>
              <input type="range" min={500} max={income * 0.7} step={500} value={savings}
                onChange={(e) => setSavings(Number(e.target.value))}
                className="w-full h-2 rounded-full appearance-none cursor-pointer mb-2"
                style={{
                  accentColor: '#22C55E',
                  background: `linear-gradient(to right, #22C55E 0%, #22C55E ${((savings - 500) / (income * 0.7 - 500)) * 100}%, rgba(100,116,139,0.3) ${((savings - 500) / (income * 0.7 - 500)) * 100}%, rgba(100,116,139,0.3) 100%)`,
                }} />
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">₹500</span>
                <span className="font-black text-green-400 text-base">{formatCurrency(savings)}</span>
                <span className="text-slate-500">{formatCurrency(income * 0.7)}</span>
              </div>
              <p className="text-[10px] text-slate-500 mt-1">{Math.round((savings / income) * 100)}% of your income</p>
            </GlassCard>

            {/* Q3 — Risk Tolerance */}
            <GlassCard>
              <div className="flex items-center gap-2 mb-4">
                <span className="w-6 h-6 rounded-full text-xs font-black flex items-center justify-center"
                  style={{ background: 'rgba(245,158,11,0.2)', color: '#F59E0B' }}>3</span>
                <h3 className="font-semibold text-sm" style={{ color: 'var(--body-text)' }}>What is your risk tolerance?</h3>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {RISK.map((r) => (
                  <button key={r.id}
                    onClick={() => setRiskId(r.id)}
                    className="p-3 rounded-xl text-left transition-all"
                    style={riskId === r.id
                      ? { background: `${r.color}15`, border: `2px solid ${r.color}`, boxShadow: `0 0 16px ${r.color}25` }
                      : { background: 'var(--surface)', border: '1px solid var(--border)' }
                    }>
                    <p className="text-xs font-bold mb-1" style={{ color: riskId === r.id ? r.color : 'var(--body-text)' }}>{r.label}</p>
                    <p className="text-[10px] text-slate-500">{r.desc}</p>
                    <p className="text-[10px] font-semibold mt-1" style={{ color: r.color }}>~{r.returnRate}% return</p>
                  </button>
                ))}
              </div>
            </GlassCard>

            {/* Q4 — Goal */}
            <GlassCard>
              <div className="flex items-center gap-2 mb-4">
                <span className="w-6 h-6 rounded-full text-xs font-black flex items-center justify-center"
                  style={{ background: 'rgba(236,72,153,0.2)', color: '#EC4899' }}>4</span>
                <h3 className="font-semibold text-sm" style={{ color: 'var(--body-text)' }}>What is your primary financial goal?</h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3">
                {GOALS.map((g) => (
                  <button key={g.id}
                    onClick={() => setGoalId(g.id)}
                    className="p-3 rounded-xl text-left transition-all"
                    style={goalId === g.id
                      ? { background: `${g.color}15`, border: `2px solid ${g.color}`, boxShadow: `0 0 16px ${g.color}25` }
                      : { background: 'var(--surface)', border: '1px solid var(--border)' }
                    }>
                    <g.icon size={18} style={{ color: goalId === g.id ? g.color : '#64748B' }} className="mb-1.5" />
                    <p className="text-xs font-semibold" style={{ color: goalId === g.id ? g.color : 'var(--body-text)' }}>{g.label}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">{g.desc}</p>
                  </button>
                ))}
              </div>
              {goalId === 'custom' && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                  className="mt-4">
                  <p className="text-xs text-slate-400 mb-2">Custom target amount</p>
                  <input type="range" min={5000} max={500000} step={5000} value={customAmt}
                    onChange={(e) => setCustomAmt(Number(e.target.value))}
                    className="w-full h-2 rounded-full appearance-none cursor-pointer"
                    style={{
                      accentColor: '#EC4899',
                      background: `linear-gradient(to right, #EC4899 0%, #EC4899 ${((customAmt - 5000) / (500000 - 5000)) * 100}%, rgba(100,116,139,0.3) ${((customAmt - 5000) / (500000 - 5000)) * 100}%, rgba(100,116,139,0.3) 100%)`,
                    }} />
                  <div className="flex justify-between text-xs mt-1">
                    <span className="text-slate-500">₹5,000</span>
                    <span className="font-black text-pink-400">{formatCurrency(customAmt)}</span>
                    <span className="text-slate-500">₹5,00,000</span>
                  </div>
                </motion.div>
              )}
            </GlassCard>

            {/* Generate button */}
            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              onClick={handleGenerate}
              disabled={generating}
              className="w-full py-3.5 rounded-2xl font-bold text-sm text-white flex items-center justify-center gap-2 transition-all"
              style={{ background: 'linear-gradient(135deg, #F59E0B, #F97316)', boxShadow: '0 4px 24px rgba(245,158,11,0.4)' }}>
              {generating ? <><RefreshCw size={16} className="animate-spin" /> Building your journey…</> : <><Sparkles size={16} /> Generate My Investment Journey</>}
            </motion.button>
          </motion.div>

        ) : (
          <motion.div key="roadmap" className="space-y-6"
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>

            {/* Summary card */}
            <div className="rounded-2xl p-5 bg-gradient-to-br from-amber-500/10 to-orange-500/5"
              style={{ border: '1px solid rgba(245,158,11,0.3)' }}>
              <div className="flex items-start gap-4 flex-wrap">
                <div className="text-3xl">🗺️</div>
                <div className="flex-1">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Your Personalized Journey</p>
                  <h2 className="text-lg font-black text-amber-400 mb-1">
                    {goal.label} → {formatCurrency(targetAmount)}
                  </h2>
                  <div className="flex flex-wrap gap-3 text-xs">
                    <span className="text-slate-400">Income: <strong style={{ color: 'var(--body-text)' }}>{formatCurrency(income)}</strong></span>
                    <span className="text-slate-400">Monthly SIP: <strong className="text-green-400">{formatCurrency(savings)}</strong></span>
                    <span className="text-slate-400">Risk: <strong style={{ color: risk.color }}>{risk.label}</strong></span>
                    <span className="text-slate-400">Target time: <strong className="text-amber-400">~{targetTimelineMonths} months</strong></span>
                  </div>
                </div>
                <button onClick={() => setStep(0)}
                  className="text-xs px-3 py-1.5 rounded-xl font-semibold text-slate-400 hover:text-primary transition-colors"
                  style={{ border: '1px solid var(--border)' }}>
                  Edit inputs
                </button>
              </div>
            </div>

            {/* Roadmap */}
            <GlassCard>
              <h3 className="font-semibold text-sm mb-5" style={{ color: 'var(--body-text)' }}>
                Your Investment Roadmap
              </h3>
              <motion.div initial="hidden" animate="visible" variants={stagger}>
                {roadmapSteps.map((s, i) => (
                  <RoadmapStep key={i}
                    step={i + 1}
                    total={roadmapSteps.length}
                    {...s}
                    locked={false}
                    completed={i < completedSteps}
                    active={i === completedSteps && completedSteps < roadmapSteps.length}
                  />
                ))}
              </motion.div>
              <div className="flex items-center gap-3 mt-2 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
                <button
                  onClick={handleCompleteStep}
                  disabled={completedSteps >= roadmapSteps.length}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-40"
                  style={{ background: completedSteps >= roadmapSteps.length ? 'linear-gradient(135deg, #22C55E, #4ADE80)' : 'linear-gradient(135deg, #22C55E, #16A34A)' }}>
                  {completedSteps >= roadmapSteps.length ? 'Journey Complete ✓' : `Mark Step ${completedSteps + 1} Complete ✓`}
                </button>
                {completedSteps > 0 && (
                  <button onClick={() => setCompletedSteps((value) => Math.max(value - 1, 0))}
                    className="px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors"
                    style={{ border: '1px solid var(--border)', color: '#64748B' }}>
                    Undo
                  </button>
                )}
              </div>
            </GlassCard>

            {/* SIP growth chart */}
            <GlassCard>
              <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                <h3 className="font-semibold text-sm" style={{ color: 'var(--body-text)' }}>
                  SIP Growth Projection
                </h3>
                <div className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-xl"
                  style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)', color: '#818CF8' }}>
                  <TrendingUp size={11} />
                  ₹{savings.toLocaleString('en-IN')}/month @ {risk.returnRate}% → {formatCurrency(sipIn5y)} in 5yr
                </div>
              </div>
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={sipData} margin={{ top: 8, right: 8, left: -5, bottom: 0 }}>
                  <defs>
                    <linearGradient id="sipPlain" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#64748B" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#64748B" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="sipComp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor={risk.color} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={risk.color} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,116,139,0.12)" />
                  <XAxis dataKey="month" tick={{ fill: '#64748B', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#64748B', fontSize: 10 }} axisLine={false} tickLine={false}
                    tickFormatter={(v) => v >= 100000 ? `₹${(v/100000).toFixed(1)}L` : v >= 1000 ? `₹${(v/1000).toFixed(0)}k` : `₹${v}`} />
                  <Tooltip content={<ChartTip />} />
                  <Area type="monotone" dataKey="plain" name="Simple savings" stroke="#64748B" strokeWidth={2} fill="url(#sipPlain)" dot={false} />
                  <Area type="monotone" dataKey="compounded" name="With investment returns" stroke={risk.color} strokeWidth={2.5} fill="url(#sipComp)" dot={false} animationDuration={800} />
                </AreaChart>
              </ResponsiveContainer>
            </GlassCard>

            {/* Asset allocation */}
            <GlassCard>
              <h3 className="font-semibold text-sm mb-4" style={{ color: 'var(--body-text)' }}>
                Recommended Asset Allocation ({risk.label})
              </h3>
              <div className="space-y-3">
                {[
                  { label: 'Equity / Mutual Funds', pct: risk.allocation.equity, color: risk.color,  desc: riskId === 'low' ? 'Large-cap index funds only' : riskId === 'medium' ? 'Nifty 50 + flexi-cap funds' : 'Mid-cap, small-cap, sectoral' },
                  { label: 'Debt Funds / Bonds',    pct: risk.allocation.debt,   color: '#6366F1',   desc: 'Government bonds, short-term debt funds' },
                  { label: 'FD / Liquid / Cash',    pct: risk.allocation.fd,     color: '#22C55E',   desc: 'Emergency fund + high-interest savings' },
                ].map((a) => (
                  <div key={a.label}>
                    <div className="flex justify-between text-xs mb-1">
                      <div>
                        <span className="font-semibold" style={{ color: 'var(--body-text)' }}>{a.label}</span>
                        <span className="text-slate-500 ml-2">{a.desc}</span>
                      </div>
                      <span className="font-black" style={{ color: a.color }}>{a.pct}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full" style={{ background: 'var(--border)' }}>
                      <motion.div className="h-full rounded-full" initial={{ width: 0 }}
                        animate={{ width: `${a.pct}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        style={{ background: `linear-gradient(90deg, ${a.color}80, ${a.color})` }} />
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>

            {/* AI Insights */}
            <GlassCard>
              <div className="flex items-center gap-2 mb-3">
                <Brain size={15} className="text-primary" />
                <h3 className="font-semibold text-sm" style={{ color: 'var(--body-text)' }}>AI Financial Tips</h3>
              </div>
              <motion.div className="space-y-2" initial="hidden" animate="visible" variants={stagger}>
                {[
                  { icon: Zap,       color: '#6366F1', text: `Start with ₹${Math.min(savings, 2000).toLocaleString('en-IN')}/month SIP and increase by 10% every year — this habit alone builds significant wealth.` },
                  { icon: Shield,    color: '#22C55E', text: `Never invest before building a ${formatCurrency(income * 3)} emergency fund. It protects your investments from panic selling.` },
                  { icon: Lightbulb, color: '#F59E0B', text: `ELSS mutual funds save up to ₹46,800/year in taxes (Section 80C) with similar returns to equity funds — perfect for beginners.` },
                  { icon: TrendingUp,color: risk.color, text: `At ${risk.returnRate}% annual return, your ₹${savings.toLocaleString('en-IN')}/month SIP grows to ${formatCurrency(sipIn5y)} in 5 years — ${formatCurrency(sipIn5y - savings * 60)} earned purely from compounding.` },
                ].map((tip, i) => (
                  <motion.div key={i} variants={fadeUp}
                    className="flex items-start gap-2.5 p-3 rounded-xl"
                    style={{ background: `${tip.color}08`, border: `1px solid ${tip.color}20` }}>
                    <div className="w-5 h-5 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: `${tip.color}18` }}>
                      <tip.icon size={11} style={{ color: tip.color }} />
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">{tip.text}</p>
                  </motion.div>
                ))}
              </motion.div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
