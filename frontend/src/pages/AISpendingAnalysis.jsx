import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell,
} from 'recharts'
import {
  Brain, Sparkles, TrendingDown, ShoppingBag, Coffee,
  Car, Zap, Target, AlertTriangle, CheckCircle,
  RefreshCw, IndianRupee, Lightbulb, Activity,
  ArrowUpRight, ArrowDownRight,
} from 'lucide-react'
import GlassCard from '../components/ui/GlassCard'
import useExpenseStore from '../store/useExpenseStore'
import { formatCurrency } from '../utils/formatCurrency'

// ─── Personality definitions ─────────────────────────────────────
const PERSONALITIES = {
  smart_saver: {
    title: 'Smart Saver',
    emoji: '🎯',
    color: '#22C55E',
    gradient: 'from-green-500/20 to-emerald-500/10',
    border: 'border-green-500/30',
    desc: 'You prioritize savings and make thoughtful spending decisions. Financial discipline is your superpower.',
    traits: ['Low impulse spending', 'High savings rate', 'Goal-oriented mindset'],
    tip: 'Consider moving 10% more into index funds to accelerate wealth building.',
  },
  balanced_spender: {
    title: 'Balanced Spender',
    emoji: '⚖️',
    color: '#6366F1',
    gradient: 'from-indigo-500/20 to-violet-500/10',
    border: 'border-indigo-500/30',
    desc: 'You maintain a healthy balance between spending and saving. Small optimizations can yield big results.',
    traits: ['Moderate savings habit', 'Balanced priorities', 'Consistent patterns'],
    tip: 'Automate ₹500/month extra into savings to upgrade to Smart Saver status.',
  },
  food_lover: {
    title: 'Food Lover',
    emoji: '🍜',
    color: '#F59E0B',
    gradient: 'from-amber-500/20 to-orange-500/10',
    border: 'border-amber-500/30',
    desc: 'Food is your biggest spend category. You enjoy dining out and food experiences.',
    traits: ['High food expenditure', 'Social spender', 'Experience-focused'],
    tip: 'Cooking at home 3 days/week could save ₹1,500/month — ₹18,000/year.',
  },
  impulse_shopper: {
    title: 'Impulse Shopper',
    emoji: '🛍️',
    color: '#F43F5E',
    gradient: 'from-rose-500/20 to-pink-500/10',
    border: 'border-rose-500/30',
    desc: 'Unplanned purchases are your Achilles heel. Your wallet often takes surprise hits.',
    traits: ['High shopping spend', 'Reactive decisions', 'Low savings buffer'],
    tip: 'Try the 24-hour rule: wait a day before any non-essential purchase.',
  },
  lifestyle_spender: {
    title: 'Lifestyle Spender',
    emoji: '✨',
    color: '#EC4899',
    gradient: 'from-pink-500/20 to-purple-500/10',
    border: 'border-pink-500/30',
    desc: 'You invest heavily in experiences and lifestyle. Short-term joy sometimes costs long-term gains.',
    traits: ['High entertainment spend', 'YOLO mindset', 'Low emergency fund'],
    tip: 'Building a ₹10,000 emergency fund takes just ₹833/month over 12 months.',
  },
}

const CATS = [
  { key: 'Food',          icon: Coffee,      color: '#F59E0B', impulse: 0.30, recommended: 0.20 },
  { key: 'Transport',     icon: Car,         color: '#3B82F6', impulse: 0.10, recommended: 0.10 },
  { key: 'Shopping',      icon: ShoppingBag, color: '#F97316', impulse: 0.90, recommended: 0.08 },
  { key: 'Entertainment', icon: Zap,         color: '#EC4899', impulse: 0.80, recommended: 0.07 },
  { key: 'Bills',         icon: Target,      color: '#8B5CF6', impulse: 0.05, recommended: 0.20 },
  { key: 'Other',         icon: Sparkles,    color: '#06B6D4', impulse: 0.50, recommended: 0.05 },
]

// Ideal spend % of income per category (for comparison table)
const IDEAL_PCT = { Food: 20, Transport: 10, Shopping: 8, Entertainment: 7, Bills: 20, Other: 5 }

const stagger = { visible: { transition: { staggerChildren: 0.06 } } }
const fadeUp  = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } }

function clampScore(value) {
  return Math.max(0, Math.min(100, Math.round(value)))
}

function getSavingsScore(income, totalSpent) {
  if (income <= 0) return 0

  const savingsRate = Math.max(0, (income - totalSpent) / income)
  let baseScore = 0

  if (savingsRate <= 0.05) baseScore = (savingsRate / 0.05) * 20
  else if (savingsRate <= 0.1) baseScore = 20 + ((savingsRate - 0.05) / 0.05) * 20
  else if (savingsRate <= 0.2) baseScore = 40 + ((savingsRate - 0.1) / 0.1) * 25
  else if (savingsRate <= 0.3) baseScore = 65 + ((savingsRate - 0.2) / 0.1) * 20
  else if (savingsRate <= 0.4) baseScore = 85 + ((savingsRate - 0.3) / 0.1) * 15
  else baseScore = 100

  const coverageRatio = Math.min(1, totalSpent / Math.max(income * 0.35, 1))
  const confidenceFactor = 0.35 + (Math.max(0.45, coverageRatio) * 0.65)

  return clampScore(baseScore * confidenceFactor)
}

function getBudgetControlScore(spending, income, totalSpent) {
  if (income <= 0) return 0

  const recommendedTotal = CATS.reduce((sum, category) => sum + (income * category.recommended), 0)
  const overshootTotal = CATS.reduce(
    (sum, category) => sum + Math.max(0, (spending[category.key] || 0) - (income * category.recommended)),
    0
  )
  const absoluteDeviation = CATS.reduce(
    (sum, category) => sum + Math.abs((spending[category.key] || 0) - (income * category.recommended)),
    0
  )

  const deviationPenalty = Math.min(55, (absoluteDeviation / Math.max(recommendedTotal, 1)) * 35)
  const overshootPenalty = Math.min(35, (overshootTotal / Math.max(recommendedTotal, 1)) * 70)

  const expectedTrackedSpend = income * 0.4
  const coverageGap = expectedTrackedSpend > 0 && totalSpent < expectedTrackedSpend
    ? (expectedTrackedSpend - totalSpent) / expectedTrackedSpend
    : 0
  const coveragePenalty = Math.min(18, coverageGap * 18)

  return clampScore(100 - deviationPenalty - overshootPenalty - coveragePenalty)
}

// ─── Custom tooltip ───────────────────────────────────────────────
function ChartTip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl px-3 py-2 text-xs shadow-xl"
      style={{ background: 'var(--dropdown-bg)', border: '1px solid var(--border)', color: 'var(--body-text)' }}>
      <p className="text-slate-400 mb-1">{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2 mb-0.5">
          <div className="w-2 h-2 rounded-full" style={{ background: p.fill }} />
          <span className="text-slate-400">{p.name}:</span>
          <span className="font-bold" style={{ color: p.fill }}>{formatCurrency(Number(p.value))}</span>
        </div>
      ))}
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────
export default function AISpendingAnalysis() {
  const { transactions, summary, loadTransactions, loadSummary } = useExpenseStore()

  const [income, setIncome]     = useState(30000)
  const [analyzed, setAnalyzed] = useState(false)
  const [loading, setLoading]   = useState(false)

  // Load real transaction data on mount
  useEffect(() => {
    loadTransactions()
    loadSummary()
  }, [])

  // Auto-populate income slider from income transactions
  useEffect(() => {
    const detected = transactions
      .filter((t) => t.type === 'income')
      .reduce((s, t) => s + t.amount, 0)
    if (detected > 0) setIncome(detected)
  }, [transactions])

  // Compute spending from real store data
  const spending = useMemo(() => {
    const out = {}
    CATS.forEach((c) => { out[c.key] = summary[c.key] || 0 })
    return out
  }, [summary])

  const totalSpent = Object.values(spending).reduce((s, v) => s + v, 0)

  // Determine personality
  const personality = useMemo(() => {
    if (!analyzed) return null
    const foodPct  = income > 0 ? (spending.Food || 0) / income : 0
    const shopPct  = income > 0 ? (spending.Shopping || 0) / income : 0
    const entPct   = income > 0 ? (spending.Entertainment || 0) / income : 0
    const savePct  = income > 0 ? Math.max(0, (income - totalSpent) / income) : 0

    if (savePct >= 0.3)  return PERSONALITIES.smart_saver
    if (shopPct >= 0.2)  return PERSONALITIES.impulse_shopper
    if (foodPct >= 0.25) return PERSONALITIES.food_lover
    if (entPct  >= 0.15) return PERSONALITIES.lifestyle_spender
    return PERSONALITIES.balanced_spender
  }, [analyzed, spending, income, totalSpent])

  // Behavioral metrics
  const impulseScore = useMemo(() => {
    const impulseSpend = CATS.reduce((s, c) => s + (spending[c.key] || 0) * c.impulse, 0)
    return Math.min(100, Math.round((impulseSpend / (income || 1)) * 300))
  }, [spending, income])

  const savingsScore = useMemo(
    () => getSavingsScore(income, totalSpent),
    [income, totalSpent]
  )

  const lifestyleScore = Math.min(100, Math.round(((spending.Entertainment || 0) + (spending.Shopping || 0)) / (income || 1) * 300))

  const controlScore = useMemo(
    () => getBudgetControlScore(spending, income, totalSpent),
    [spending, income, totalSpent]
  )

  // Radar chart data
  const radarData = useMemo(() => [
    { subject: 'Savings',    value: Math.min(100, Math.round(Math.max(0, (income - totalSpent) / (income || 1)) * 100)) },
    { subject: 'Discipline', value: Math.min(100, 100 - impulseScore) },
    { subject: 'Control',    value: controlScore },
    { subject: 'Consistency', value: analyzed ? 75 : 40 },
    { subject: 'Planning',   value: Math.min(100, savingsScore + 10) },
  ], [income, totalSpent, impulseScore, controlScore, savingsScore, analyzed])

  // Actual vs AI-recommended comparison (unique — not in Budget or Expense pages)
  const comparisonData = useMemo(() => CATS.map((c) => {
    const actual      = spending[c.key] || 0
    const recommended = Math.round(income * c.recommended)
    const gap         = actual - recommended
    const status      = actual === 0 ? 'none' : gap > recommended * 0.2 ? 'over' : gap < -recommended * 0.2 ? 'under' : 'ok'
    return { name: c.key, actual, recommended, gap, status, color: c.color, idealPct: IDEAL_PCT[c.key] }
  }), [spending, income])

  // AI narrative insights generated from real data
  const insights = useMemo(() => {
    const list = []
    const saved = Math.max(0, income - totalSpent)

    comparisonData.forEach((d) => {
      if (d.status === 'over' && d.gap > 200) {
        list.push({
          color: '#F59E0B', icon: AlertTriangle,
          text: `Your ${d.name} spend (${formatCurrency(d.actual)}) is ${formatCurrency(d.gap)} above the AI-recommended ${formatCurrency(d.recommended)} (${d.idealPct}% of income). Cutting ₹500/month saves ₹6,000/year.`,
        })
      }
    })

    if (saved < income * 0.1 && income > 0) {
      list.push({
        color: '#F43F5E', icon: TrendingDown,
        text: `You're saving only ${formatCurrency(saved)}/month (${Math.round((saved / income) * 100)}% of income). Financial experts recommend at least 20%. Consider reducing your top 2 expense categories.`,
      })
    } else if (saved >= income * 0.2) {
      list.push({
        color: '#22C55E', icon: CheckCircle,
        text: `Excellent! You saved ${formatCurrency(saved)} this month (${Math.round((saved / income) * 100)}% of income). Consider routing this into an SIP — at 12% annual return it could grow to ${formatCurrency(Math.round(saved * 12 * 1.12))} in a year.`,
      })
    }

    const topCat = comparisonData.reduce((a, b) => (a.actual > b.actual ? a : b), comparisonData[0])
    if (topCat?.actual > 0) {
      list.push({
        color: '#6366F1', icon: Activity,
        text: `${topCat.name} is your highest expense at ${formatCurrency(topCat.actual)} (${Math.round((topCat.actual / (income || 1)) * 100)}% of income). Reducing it 20% saves ${formatCurrency(Math.round(topCat.actual * 0.2))} monthly.`,
      })
    }

    const impulseCategories = comparisonData.filter((d) => {
      const cat = CATS.find((c) => c.key === d.name)
      return cat && cat.impulse > 0.6 && d.actual > 0
    })
    if (impulseCategories.length > 0) {
      const impTotal = impulseCategories.reduce((s, d) => s + d.actual, 0)
      list.push({
        color: '#EC4899', icon: ShoppingBag,
        text: `You spent ${formatCurrency(impTotal)} on impulse-prone categories (Shopping, Entertainment). Applying a 48-hour rule before purchases could reduce this by 30%, freeing ${formatCurrency(Math.round(impTotal * 0.3))}/month.`,
      })
    }

    if (list.length === 0) {
      list.push({
        color: '#14B8A6', icon: Sparkles,
        text: 'Add some expenses to unlock your personalized AI insights. The more transactions you log, the smarter this analysis becomes.',
      })
    }

    return list.slice(0, 5)
  }, [comparisonData, income, totalSpent])

  // Weekly spending pattern — last 4 weeks (unique to this page)
  const weekPattern = useMemo(() => {
    const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    const totals = Object.fromEntries(DAYS.map((d) => [d, 0]))
    const cutoff = new Date(); cutoff.setDate(cutoff.getDate() - 28)
    transactions
      .filter((t) => t.type === 'expense' && new Date(t.date) >= cutoff)
      .forEach((t) => {
        const day = new Date(t.date).getDay()
        const key = DAYS[day === 0 ? 6 : day - 1]
        totals[key] += t.amount
      })
    return DAYS.map((d) => ({ day: d, amount: totals[d] }))
  }, [transactions])

  const peakDay = weekPattern.reduce((a, b) => (a.amount > b.amount ? a : b), weekPattern[0])

  const handleAnalyze = () => {
    setLoading(true)
    setTimeout(() => { setLoading(false); setAnalyzed(true) }, 1400)
  }

  return (
    <motion.div className="space-y-6" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>

      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)' }}>
              <Brain size={16} className="text-primary" />
            </div>
            <h1 className="text-xl font-bold" style={{ color: 'var(--body-text)' }}>AI Spending Analysis</h1>
          </div>
          <p className="text-sm text-slate-500 ml-10">Financial personality, behavioral scores &amp; AI-generated insights</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          onClick={handleAnalyze} disabled={loading}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white"
          style={{ background: 'linear-gradient(135deg, #6366F1, #8B5CF6)', boxShadow: '0 4px 20px rgba(99,102,241,0.4)' }}>
          {loading ? <RefreshCw size={14} className="animate-spin" /> : <Sparkles size={14} />}
          {loading ? 'Analyzing…' : analyzed ? 'Re-analyze' : 'Analyze My Spending'}
        </motion.button>
      </div>

      {/* Income input */}
      <GlassCard>
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'rgba(34,197,94,0.1)' }}>
              <IndianRupee size={15} className="text-green-400" />
            </div>
            <span className="text-sm font-semibold" style={{ color: 'var(--body-text)' }}>Monthly Income</span>
          </div>
          <input type="range" min={5000} max={150000} step={1000} value={income}
            onChange={(e) => setIncome(Number(e.target.value))}
            className="flex-1 min-w-48 h-1.5 rounded-full appearance-none cursor-pointer"
            style={{
              accentColor: '#22C55E',
              background: `linear-gradient(to right, #22C55E 0%, #22C55E ${((income - 5000) / (150000 - 5000)) * 100}%, rgba(100,116,139,0.3) ${((income - 5000) / (150000 - 5000)) * 100}%, rgba(100,116,139,0.3) 100%)`,
            }} />
          <kbd className="px-4 py-1.5 rounded-xl font-bold text-green-400 text-sm"
            style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)' }}>
            {formatCurrency(income)}
          </kbd>
        </div>
      </GlassCard>

      {/* Personality card — shown after analysis */}
      <AnimatePresence>
        {personality && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10 }}
            className={`rounded-2xl p-5 bg-gradient-to-br ${personality.gradient} border ${personality.border}`}>
            <div className="flex items-start gap-4 flex-wrap">
              <div className="text-4xl">{personality.emoji}</div>
              <div className="flex-1">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Your Financial Personality</p>
                <h2 className="text-xl font-black mb-1" style={{ color: personality.color }}>{personality.title}</h2>
                <p className="text-sm text-slate-400 mb-3">{personality.desc}</p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {personality.traits.map((t) => (
                    <span key={t} className="text-[11px] px-2.5 py-1 rounded-full font-medium"
                      style={{ background: `${personality.color}18`, color: personality.color, border: `1px solid ${personality.color}35` }}>
                      {t}
                    </span>
                  ))}
                </div>
                <div className="flex items-start gap-2 px-3 py-2.5 rounded-xl"
                  style={{ background: 'rgba(255,255,255,0.06)' }}>
                  <Lightbulb size={13} className="text-amber-400 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-slate-300">{personality.tip}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4 Behavioral score cards */}
      <motion.div className="grid grid-cols-2 xl:grid-cols-4 gap-4" initial="hidden" animate="visible" variants={stagger}>
        {[
          { label: 'Impulse Score',      value: impulseScore,   icon: ShoppingBag,
            color: impulseScore   > 60 ? '#F43F5E' : impulseScore   > 30 ? '#F59E0B' : '#22C55E',
            desc:  impulseScore   > 60 ? 'High risk'    : impulseScore   > 30 ? 'Moderate'   : 'Controlled' },
          { label: 'Savings Discipline', value: savingsScore,   icon: Target,
            color: savingsScore   > 60 ? '#22C55E' : savingsScore   > 30 ? '#F59E0B' : '#F43F5E',
            desc:  savingsScore   > 60 ? 'Excellent'    : savingsScore   > 30 ? 'Improving'  : 'Needs work' },
          { label: 'Lifestyle Ratio',    value: lifestyleScore, icon: Zap,
            color: lifestyleScore > 50 ? '#F43F5E' : lifestyleScore > 25 ? '#F59E0B' : '#6366F1',
            desc:  lifestyleScore > 50 ? 'Over-spending': lifestyleScore > 25 ? 'Balanced'   : 'Minimal' },
          { label: 'Budget Control',     value: controlScore,   icon: Activity,
            color: controlScore   > 60 ? '#22C55E' : controlScore   > 35 ? '#F59E0B' : '#F43F5E',
            desc:  controlScore   > 60 ? 'Well managed' : controlScore   > 35 ? 'On track'   : 'Over budget' },
        ].map((m) => (
          <motion.div key={m.label} variants={fadeUp}>
            <GlassCard>
              <div className="flex items-center justify-between mb-3">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${m.color}15` }}>
                  <m.icon size={14} style={{ color: m.color }} />
                </div>
                <span className="text-[10px] font-bold" style={{ color: m.color }}>{m.desc}</span>
              </div>
              <p className="text-[11px] text-slate-400 mb-1">{m.label}</p>
              <p className="text-2xl font-black mb-2" style={{ color: m.color }}>
                {m.value}<span className="text-slate-600 text-xs font-normal">/100</span>
              </p>
              <div className="w-full h-1.5 rounded-full" style={{ background: 'var(--border)' }}>
                <motion.div className="h-full rounded-full" initial={{ width: 0 }}
                  animate={{ width: `${m.value}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
                  style={{ background: `linear-gradient(90deg, ${m.color}70, ${m.color})` }} />
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Radar chart */}
        <GlassCard>
          <h3 className="font-semibold text-sm mb-1" style={{ color: 'var(--body-text)' }}>Financial Health Radar</h3>
          <p className="text-[11px] text-slate-500 mb-3">Multi-dimensional behavioral score</p>
          <ResponsiveContainer width="100%" height={260}>
            <RadarChart data={radarData} cx="50%" cy="50%" outerRadius={90}>
              <PolarGrid stroke="rgba(99,102,241,0.15)" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748B', fontSize: 11 }} />
              <Radar name="Score" dataKey="value" stroke="#6366F1" fill="#6366F1" fillOpacity={0.25}
                dot={{ fill: '#6366F1', r: 4 }} />
            </RadarChart>
          </ResponsiveContainer>
        </GlassCard>

        {/* Weekly spending pattern — unique to this page */}
        <GlassCard>
          <h3 className="font-semibold text-sm mb-1" style={{ color: 'var(--body-text)' }}>Weekly Spending Pattern</h3>
          <p className="text-[11px] text-slate-500 mb-3">
            When you spend the most — last 4 weeks
            {peakDay?.amount > 0 && (
              <span className="ml-2 font-semibold" style={{ color: '#F59E0B' }}>
                Peak: {peakDay.day} ({formatCurrency(peakDay.amount)})
              </span>
            )}
          </p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={weekPattern} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,116,139,0.1)" />
              <XAxis dataKey="day" tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748B', fontSize: 10 }} axisLine={false} tickLine={false}
                tickFormatter={(v) => v >= 1000 ? `₹${(v / 1000).toFixed(0)}k` : `₹${v}`} />
              <Tooltip content={<ChartTip />} cursor={{ fill: 'rgba(99,102,241,0.06)' }} />
              <Bar dataKey="amount" name="Spent" radius={[6, 6, 0, 0]} animationDuration={700}>
                {weekPattern.map((d, i) => (
                  <Cell key={i}
                    fill={d.day === peakDay?.day ? '#F59E0B' : '#6366F1'}
                    opacity={d.day === peakDay?.day ? 1 : 0.65} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>
      </div>

      {/* Actual vs AI-Recommended — not in any other page */}
      <GlassCard>
        <h3 className="font-semibold text-sm mb-1" style={{ color: 'var(--body-text)' }}>Actual vs AI-Recommended Budget</h3>
        <p className="text-[11px] text-slate-500 mb-4">
          How your actual spend compares to the ideal allocation for a {formatCurrency(income)}/month income
        </p>
        <div className="space-y-3">
          {comparisonData.map((d) => {
            const cat     = CATS.find((c) => c.key === d.name)
            const isOver  = d.status === 'over'
            const isNone  = d.status === 'none'
            const maxBar  = Math.max(d.actual, d.recommended, 1)
            return (
              <div key={d.name} className="rounded-xl p-3"
                style={{
                  background: isOver ? 'rgba(244,63,94,0.04)' : 'var(--surface)',
                  border: `1px solid ${isOver ? 'rgba(244,63,94,0.2)' : 'var(--border)'}`,
                }}>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: `${d.color}18` }}>
                    <cat.icon size={12} style={{ color: d.color }} />
                  </div>
                  <span className="text-xs font-semibold flex-1" style={{ color: 'var(--body-text)' }}>{d.name}</span>
                  <div className="flex items-center gap-3 text-[11px]">
                    <span className="text-slate-500">Actual: <strong style={{ color: d.color }}>{formatCurrency(d.actual)}</strong></span>
                    <span className="text-slate-500">Ideal: <strong className="text-slate-400">{formatCurrency(d.recommended)}</strong></span>
                    {!isNone && d.gap !== 0 && (
                      <span className={`flex items-center gap-0.5 font-bold ${isOver ? 'text-red-400' : 'text-green-400'}`}>
                        {isOver ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
                        {formatCurrency(Math.abs(d.gap))} {isOver ? 'over' : 'under'}
                      </span>
                    )}
                  </div>
                </div>
                <div className="relative h-2 rounded-full" style={{ background: 'var(--border)' }}>
                  <div className="absolute top-0 h-full w-0.5 rounded-full bg-slate-400/50"
                    style={{ left: `${Math.min((d.recommended / maxBar) * 100, 100)}%` }} />
                  <motion.div className="h-full rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${isNone ? 0 : Math.min((d.actual / maxBar) * 100, 100)}%` }}
                    transition={{ duration: 0.7, ease: 'easeOut' }}
                    style={{ background: isOver ? '#F43F5E' : isNone ? '#64748B' : d.color, opacity: isNone ? 0.3 : 1 }} />
                </div>
                <div className="flex justify-between text-[9px] mt-0.5">
                  <span className="text-slate-600">₹0</span>
                  <span className="text-slate-500">● ideal: {d.idealPct}% of income</span>
                  <span className="text-slate-600">{formatCurrency(maxBar)}</span>
                </div>
              </div>
            )
          })}
        </div>
      </GlassCard>

      {/* AI Insight Feed — data-driven, unique to this page */}
      <GlassCard>
        <div className="flex items-center gap-2 mb-4">
          <Brain size={15} className="text-primary" />
          <h3 className="font-semibold text-sm" style={{ color: 'var(--body-text)' }}>AI Insight Feed</h3>
          <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full font-semibold"
            style={{ background: 'rgba(99,102,241,0.12)', color: '#818CF8', border: '1px solid rgba(99,102,241,0.25)' }}>
            {insights.length} insights
          </span>
        </div>
        <motion.div className="space-y-3" initial="hidden" animate="visible" variants={stagger}>
          {insights.map((ins, i) => (
            <motion.div key={i} variants={fadeUp}
              className="flex items-start gap-3 p-3 rounded-xl"
              style={{ background: `${ins.color}07`, border: `1px solid ${ins.color}22` }}>
              <div className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ background: `${ins.color}18` }}>
                <ins.icon size={13} style={{ color: ins.color }} />
              </div>
              <p className="text-xs leading-relaxed text-slate-300">{ins.text}</p>
            </motion.div>
          ))}
        </motion.div>
        {!analyzed && (
          <p className="text-[11px] text-slate-500 text-center mt-3">
            Click "Analyze My Spending" to unlock deeper personality-based insights
          </p>
        )}
      </GlassCard>
    </motion.div>
  )
}
