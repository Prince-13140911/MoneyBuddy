import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts'
import {
  Brain, Sparkles, AlertTriangle, CheckCircle, IndianRupee,
  Sliders, Lightbulb, TrendingDown, TrendingUp, PiggyBank,
  ShoppingBag, Zap, Target, RefreshCw,
} from 'lucide-react'
import toast from 'react-hot-toast'
import GlassCard from '../components/ui/GlassCard'
import useExpenseStore from '../store/useExpenseStore'
import { formatCurrency } from '../utils/formatCurrency'
import { currentMonth } from '../utils/formatDate'

// ─── Category config ───────────────────────────────────────────────
const CATS = [
  { key: 'Food',          group: 'needs',   base: 0.20, color: '#F59E0B', icon: '🍽️' },
  { key: 'Transport',     group: 'needs',   base: 0.10, color: '#3B82F6', icon: '🚗' },
  { key: 'Bills',         group: 'needs',   base: 0.20, color: '#8B5CF6', icon: '🏠' },
  { key: 'Entertainment', group: 'wants',   base: 0.10, color: '#EC4899', icon: '🎬' },
  { key: 'Shopping',      group: 'wants',   base: 0.12, color: '#F97316', icon: '🛍️' },
  { key: 'Other',         group: 'wants',   base: 0.08, color: '#06B6D4', icon: '📦' },
  { key: 'Savings',       group: 'savings', base: 0.20, color: '#22C55E', icon: '💰' },
]

const GROUPS = {
  needs:   { label: 'Needs',   color: '#6366F1', pct: 50, desc: 'Essentials — food, rent, transport' },
  wants:   { label: 'Wants',   color: '#14B8A6', pct: 30, desc: 'Lifestyle & entertainment' },
  savings: { label: 'Savings', color: '#22C55E', pct: 20, desc: 'Building your safety net' },
}

const month = currentMonth()

// ─── Custom tooltip for recharts ──────────────────────────────────
function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl px-3 py-2 text-xs shadow-xl"
      style={{ background: 'var(--dropdown-bg)', border: '1px solid var(--border)', color: 'var(--body-text)', backdropFilter: 'blur(12px)' }}>
      <p className="font-semibold mb-1" style={{ color: 'var(--body-text)' }}>{payload[0]?.payload?.name || payload[0]?.name}</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ color: p.color }}>
          {p.name}: {typeof p.value === 'number' ? formatCurrency(p.value) : p.value}
        </p>
      ))}
    </div>
  )
}

// ─── Animated stat number ─────────────────────────────────────────
function StatNumber({ value, prefix = '₹', suffix = '' }) {
  return (
    <motion.span
      key={value}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {prefix}{Number(value).toLocaleString('en-IN')}{suffix}
    </motion.span>
  )
}

// ─── Category slider card ─────────────────────────────────────────
function CategoryCard({ cat, limit, spent, income, onChange }) {
  const pct = limit > 0 ? Math.min((spent / limit) * 100, 100) : 0
  const remaining = limit - spent
  const isOver = spent > limit
  const isWarning = pct >= 80 && !isOver
  const barColor = isOver ? '#F43F5E' : isWarning ? '#F59E0B' : cat.color

  return (
    <motion.div
      variants={{ hidden: { opacity: 0, x: -16 }, visible: { opacity: 1, x: 0 } }}
      className="rounded-2xl p-4 transition-all duration-200 group hover:scale-[1.01]"
      style={{
        background: 'var(--surface)',
        border: `1px solid ${isOver ? 'rgba(244,63,94,0.3)' : isWarning ? 'rgba(245,158,11,0.3)' : 'var(--border)'}`,
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <span className="text-xl">{cat.icon}</span>
          <div>
            <p className="text-sm font-semibold" style={{ color: 'var(--body-text)' }}>{cat.key}</p>
            <p className="text-[10px]" style={{ color: GROUPS[cat.group].color }}>
              {GROUPS[cat.group].label} · {Math.round(cat.base * 100)}% base
            </p>
          </div>
        </div>
        <div className="text-right">
          {isOver ? (
            <span className="flex items-center gap-1 text-[10px] font-bold text-red-400 bg-red-500/10 px-2 py-1 rounded-full border border-red-500/20">
              <AlertTriangle size={10} /> Over budget
            </span>
          ) : isWarning ? (
            <span className="flex items-center gap-1 text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-1 rounded-full border border-amber-500/20">
              <AlertTriangle size={10} /> {Math.round(pct)}% used
            </span>
          ) : (
            <span className="text-[10px] text-slate-500">{Math.round(pct)}% used</span>
          )}
        </div>
      </div>

      {/* Amounts row */}
      <div className="grid grid-cols-3 text-center mb-3">
        <div>
          <p className="text-[10px] text-slate-500 mb-0.5">Budget</p>
          <p className="text-xs font-bold" style={{ color: cat.color }}>{formatCurrency(limit)}</p>
        </div>
        <div>
          <p className="text-[10px] text-slate-500 mb-0.5">Spent</p>
          <p className={`text-xs font-bold ${isOver ? 'text-red-400' : ''}`} style={isOver ? {} : { color: 'var(--body-text)' }}>{formatCurrency(spent)}</p>
        </div>
        <div>
          <p className="text-[10px] text-slate-500 mb-0.5">Remaining</p>
          <p className={`text-xs font-bold ${remaining < 0 ? 'text-red-400' : 'text-success'}`}>{formatCurrency(Math.abs(remaining))}</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1.5 rounded-full mb-3" style={{ background: 'var(--border)' }}>
        <motion.div
          className="h-full rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          style={{ background: `linear-gradient(90deg, ${barColor}cc, ${barColor})` }}
        />
      </div>

      {/* Slider */}
      <div className="flex items-center gap-3">
        <Sliders size={11} className="text-slate-600 flex-shrink-0" />
        <input
          type="range"
          min={0}
          max={Math.round(income * 0.6)}
          step={100}
          value={limit}
          onChange={(e) => onChange(cat.key, Number(e.target.value))}
          className="flex-1 h-1 rounded-full appearance-none cursor-pointer"
          style={{
            accentColor: cat.color,
            background: `linear-gradient(to right, ${cat.color} 0%, ${cat.color} ${(limit / Math.round(income * 0.6)) * 100}%, rgba(100,116,139,0.3) ${(limit / Math.round(income * 0.6)) * 100}%, rgba(100,116,139,0.3) 100%)`,
          }}
        />
        <span className="text-[10px] text-slate-500 w-16 text-right">{formatCurrency(limit)}</span>
      </div>
    </motion.div>
  )
}

// ─── AI Suggestion card ───────────────────────────────────────────
function SuggestionCard({ icon: Icon, iconColor, iconBg, title, desc, saving }) {
  return (
    <motion.div
      variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
      className="flex items-start gap-3 p-4 rounded-2xl"
      style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
    >
      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: iconBg }}>
        <Icon size={16} style={{ color: iconColor }} />
      </div>
      <div className="flex-1">
        <p className="text-sm font-semibold mb-0.5" style={{ color: 'var(--body-text)' }}>{title}</p>
        <p className="text-xs text-slate-400 leading-relaxed">{desc}</p>
        {saving && (
          <p className="text-xs font-bold mt-1.5" style={{ color: '#22C55E' }}>
            💡 Save {formatCurrency(saving)}/year
          </p>
        )}
      </div>
    </motion.div>
  )
}

// ─── Main Component ───────────────────────────────────────────────
const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }
const stagger = { visible: { transition: { staggerChildren: 0.07 } } }

export default function SmartBudgetAssistant() {
  const { summary, loadSummary } = useExpenseStore()
  const [incomeInput, setIncomeInput] = useState('30000')
  const [income, setIncome] = useState(30000)
  const [limits, setLimits] = useState({})
  const [activeTab, setActiveTab] = useState('overview')
  const [chartView, setChartView] = useState('distribution')

  useEffect(() => { loadSummary({ month }) }, [])

  // Initialize limits from 50/30/20 rule when income changes
  useEffect(() => {
    const newLimits = {}
    CATS.forEach((c) => { newLimits[c.key] = Math.round(income * c.base) })
    setLimits(newLimits)
  }, [income])

  function applyIncome() {
    const val = parseFloat(incomeInput)
    if (!val || val < 100) { toast.error('Enter a valid monthly income'); return }
    setIncome(val)
    toast.success('Budget recalculated with 50/30/20 rule! 🎯')
  }

  function updateLimit(key, val) {
    setLimits((prev) => ({ ...prev, [key]: val }))
  }

  function resetToAI() {
    const newLimits = {}
    CATS.forEach((c) => { newLimits[c.key] = Math.round(income * c.base) })
    setLimits(newLimits)
    toast.success('Reset to AI 50/30/20 recommendation')
  }

  // Derived data
  const spent = useMemo(() => {
    const s = { ...summary }
    CATS.forEach((c) => { if (!s[c.key]) s[c.key] = 0 })
    s.Savings = 0 // virtual
    return s
  }, [summary])

  const totalBudgeted = useMemo(
    () => CATS.reduce((s, c) => s + (limits[c.key] || 0), 0),
    [limits]
  )
  const totalSpent = useMemo(
    () => CATS.filter((c) => c.key !== 'Savings').reduce((s, c) => s + (spent[c.key] || 0), 0),
    [spent]
  )
  const projectedSavings = income - totalSpent
  const savingsPct = income > 0 ? Math.round((projectedSavings / income) * 100) : 0

  // Group summaries
  const groupTotals = useMemo(() => {
    const g = { needs: { limit: 0, spent: 0 }, wants: { limit: 0, spent: 0 }, savings: { limit: 0, spent: 0 } }
    CATS.forEach((c) => {
      g[c.group].limit += limits[c.key] || 0
      g[c.group].spent += spent[c.key] || 0
    })
    return g
  }, [limits, spent])

  // Pie data
  const pieData = useMemo(
    () => CATS.map((c) => ({ name: c.key, value: limits[c.key] || 0, color: c.color })),
    [limits]
  )

  // Bar chart data
  const barData = useMemo(
    () => CATS.map((c) => ({
      name: c.key.length > 7 ? c.key.slice(0, 6) + '…' : c.key,
      Budget: limits[c.key] || 0,
      Spent: spent[c.key] || 0,
      color: c.color,
    })),
    [limits, spent]
  )

  // Alerts
  const alerts = useMemo(() => {
    return CATS.filter((c) => c.key !== 'Savings').map((c) => {
      const lim = limits[c.key] || 0
      const s = spent[c.key] || 0
      const pct = lim > 0 ? (s / lim) * 100 : 0
      return { ...c, limit: lim, spent: s, pct, isOver: s > lim, isWarning: pct >= 80 && s <= lim }
    }).filter((c) => c.isOver || c.isWarning)
  }, [limits, spent])

  // AI Suggestions
  const suggestions = useMemo(() => {
    const tips = []
    CATS.forEach((c) => {
      if (c.key === 'Savings') return
      const s = spent[c.key] || 0
      const pctOfIncome = income > 0 ? (s / income) * 100 : 0
      if (c.key === 'Food' && pctOfIncome > 20) {
        const excess = s - income * 0.15
        tips.push({
          icon: Lightbulb, iconColor: '#F59E0B', iconBg: 'rgba(245,158,11,0.12)',
          title: 'Reduce Food Spending',
          desc: `You spent ${Math.round(pctOfIncome)}% of your income on food. Reducing by ${formatCurrency(Math.round(excess))} could significantly boost your savings.`,
          saving: Math.round(excess) * 12,
        })
      }
      if (c.key === 'Entertainment' && pctOfIncome > 12) {
        const excess = s - income * 0.08
        tips.push({
          icon: TrendingDown, iconColor: '#EC4899', iconBg: 'rgba(236,72,153,0.12)',
          title: 'Cut Entertainment Costs',
          desc: `Entertainment is eating ${Math.round(pctOfIncome)}% of your income. Try free alternatives — parks, streaming, home cooking.`,
          saving: Math.round(excess) * 12,
        })
      }
      if (c.key === 'Shopping' && pctOfIncome > 15) {
        tips.push({
          icon: ShoppingBag, iconColor: '#F97316', iconBg: 'rgba(249,115,22,0.12)',
          title: 'Shopping Budget Alert',
          desc: `Shopping takes ${Math.round(pctOfIncome)}% of income. Apply the 24-hour rule — wait a day before non-essential purchases over ₹500.`,
          saving: Math.round((s - income * 0.10) * 12),
        })
      }
    })
    if (savingsPct < 20) {
      tips.push({
        icon: PiggyBank, iconColor: '#22C55E', iconBg: 'rgba(34,197,94,0.12)',
        title: 'Boost Your Savings Rate',
        desc: `You're saving ${savingsPct}% of income. The 50/30/20 rule recommends 20%. Try automating ${formatCurrency(Math.round(income * 0.2))} to savings on payday.`,
        saving: null,
      })
    }
    if (tips.length === 0) {
      tips.push({
        icon: CheckCircle, iconColor: '#22C55E', iconBg: 'rgba(34,197,94,0.12)',
        title: 'Great Financial Discipline! 🎉',
        desc: "Your spending is well within limits. Keep up the 50/30/20 rule and your savings will compound beautifully over time.",
        saving: null,
      })
      tips.push({
        icon: Target, iconColor: '#6366F1', iconBg: 'rgba(99,102,241,0.12)',
        title: 'Set a Savings Goal',
        desc: `With ${formatCurrency(projectedSavings)} saved this month, you could build a ₹1L emergency fund in just ${Math.ceil(100000 / Math.max(projectedSavings, 1))} months.`,
        saving: null,
      })
    }
    return tips.slice(0, 4)
  }, [spent, income, savingsPct, projectedSavings])

  const TABS = ['overview', 'categories', 'insights']

  return (
    <motion.div className="space-y-6 pb-10" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>

      {/* ── Page Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Brain size={20} className="text-primary" /> Smart Budgeting Assistant
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">AI-powered 50/30/20 budget planner personalised for you</p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
          style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', color: '#818CF8' }}>
          <Sparkles size={12} /> AI Active
        </div>
      </div>

      {/* ── Income Input Card ── */}
      <GlassCard>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex-1">
            <h3 className="text-sm font-bold text-slate-200 mb-0.5">Monthly Income / Allowance</h3>
            <p className="text-xs text-slate-500">Enter your take-home pay to auto-generate your smart budget</p>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-48">
              <IndianRupee size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="number"
                value={incomeInput}
                onChange={(e) => setIncomeInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && applyIncome()}
                className="input-field pl-8 text-sm"
                placeholder="e.g. 30000"
              />
            </div>
            <button onClick={applyIncome} className="btn-primary px-4 py-2.5 text-sm whitespace-nowrap">
              <Zap size={14} /> Generate Budget
            </button>
            <button onClick={resetToAI} title="Reset to AI recommendation"
              className="w-10 h-10 rounded-xl glass-card flex items-center justify-center text-slate-400 hover:text-primary transition-colors">
              <RefreshCw size={15} />
            </button>
          </div>
        </div>
      </GlassCard>

      {/* ── 50/30/20 Summary Row ── */}
      <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-4" initial="hidden" animate="visible" variants={stagger}>
        {/* Income */}
        <motion.div variants={fadeUp}>
          <GlassCard className="text-center py-5">
            <div className="w-10 h-10 rounded-xl mx-auto mb-3 flex items-center justify-center"
              style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.2)' }}>
              <IndianRupee size={18} className="text-primary" />
            </div>
            <p className="text-[10px] text-slate-500 uppercase tracking-wide mb-1">Monthly Income</p>
            <p className="text-xl font-black text-slate-100"><StatNumber value={income} /></p>
          </GlassCard>
        </motion.div>

        {/* Needs / Wants / Savings */}
        {Object.entries(GROUPS).map(([key, g]) => (
          <motion.div key={key} variants={fadeUp}>
            <GlassCard className="text-center py-5">
              <div className="w-10 h-10 rounded-xl mx-auto mb-3 flex items-center justify-center"
                style={{ background: `${g.color}18`, border: `1px solid ${g.color}30` }}>
                <span className="text-base">{key === 'needs' ? '🏠' : key === 'wants' ? '🎭' : '💰'}</span>
              </div>
              <p className="text-[10px] text-slate-500 uppercase tracking-wide mb-0.5">{g.label} ({g.pct}%)</p>
              <p className="text-lg font-black" style={{ color: g.color }}>
                <StatNumber value={Math.round(income * g.pct / 100)} />
              </p>
              <div className="mt-2 w-full h-1 rounded-full" style={{ background: 'var(--border)' }}>
                <motion.div
                  className="h-full rounded-full"
                  initial={{ width: 0 }}
                  animate={{
                    width: `${Math.min((groupTotals[key]?.spent / groupTotals[key]?.limit) * 100 || 0, 100)}%`
                  }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  style={{ background: g.color }}
                />
              </div>
              <p className="text-[10px] text-slate-600 mt-1">
                {formatCurrency(groupTotals[key]?.spent || 0)} spent
              </p>
            </GlassCard>
          </motion.div>
        ))}
      </motion.div>

      {/* ── Savings Highlight ── */}
      {income > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
          className="rounded-2xl px-6 py-4 flex items-center justify-between"
          style={{
            background: `linear-gradient(135deg, rgba(34,197,94,0.12), rgba(34,197,94,0.04))`,
            border: '1px solid rgba(34,197,94,0.2)',
          }}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(34,197,94,0.15)' }}>
              <PiggyBank size={18} className="text-success" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-200">Projected Monthly Savings</p>
              <p className="text-xs text-slate-500">Income minus total spending this month</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-black text-success"><StatNumber value={Math.max(projectedSavings, 0)} /></p>
            <p className="text-xs text-slate-500">{savingsPct}% of income</p>
          </div>
        </motion.div>
      )}

      {/* ── Overspend Alerts ── */}
      <AnimatePresence>
        {alerts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            className="space-y-2"
          >
            {alerts.map((a) => (
              <div key={a.key} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm"
                style={a.isOver
                  ? { background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.25)', color: '#F87171' }
                  : { background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)', color: '#FCD34D' }
                }>
                <AlertTriangle size={15} className="flex-shrink-0" />
                <span>
                  {a.isOver
                    ? <><strong>{a.key}</strong> budget exceeded — spent {formatCurrency(a.spent)} of {formatCurrency(a.limit)} limit</>
                    : <><strong>{a.key}</strong> is {Math.round(a.pct)}% used — {formatCurrency(a.limit - a.spent)} remaining</>
                  }
                </span>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Tabs ── */}
      <div className="flex gap-1 p-1 rounded-xl w-fit"
        style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
        {TABS.map((t) => (
          <button key={t} onClick={() => setActiveTab(t)}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 capitalize"
            style={activeTab === t
              ? { background: 'rgba(99,102,241,0.2)', color: '#818CF8', border: '1px solid rgba(99,102,241,0.3)' }
              : { color: '#64748B' }
            }>
            {t === 'overview' ? '📊 Overview' : t === 'categories' ? '🗂️ Categories' : '🤖 AI Insights'}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* ══════════ OVERVIEW TAB ══════════ */}
        {activeTab === 'overview' && (
          <motion.div key="overview"
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            className="space-y-6">

            {/* Quick stats */}
            <GlassCard>
              <h3 className="font-semibold text-slate-200 text-sm mb-4">Quick Progress Overview</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {CATS.map((c) => {
                  const lim = limits[c.key] || 0
                  const s = spent[c.key] || 0
                  const pct = lim > 0 ? Math.min((s / lim) * 100, 100) : 0
                  return (
                    <div key={c.key} className="flex items-center gap-3">
                      <span className="text-base w-6 flex-shrink-0">{c.icon}</span>
                      <div className="flex-1">
                        <div className="flex justify-between text-[10px] mb-1">
                          <span className="text-slate-400">{c.key}</span>
                          <span className="text-slate-500">{formatCurrency(s)} / {formatCurrency(lim)}</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full" style={{ background: 'var(--border)' }}>
                          <motion.div className="h-full rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 0.6, ease: 'easeOut' }}
                            style={{ background: s > lim ? '#F43F5E' : pct >= 80 ? '#F59E0B' : c.color }}
                          />
                        </div>
                      </div>
                      <span className="text-[10px] font-semibold w-8 text-right"
                        style={{ color: s > lim ? '#F43F5E' : pct >= 80 ? '#F59E0B' : '#94A3B8' }}>
                        {Math.round(pct)}%
                      </span>
                    </div>
                  )
                })}
              </div>
            </GlassCard>

            {/* Chart card with dropdown selector */}
            <GlassCard>
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="font-semibold text-slate-200 text-sm">
                    {chartView === 'distribution' ? 'Budget Distribution' : 'Budget vs Actual Spending'}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {chartView === 'distribution' ? 'How your income is allocated' : 'Compare allocated vs spent per category'}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <select
                    value={chartView}
                    onChange={(e) => setChartView(e.target.value)}
                    className="text-xs font-semibold px-3 py-1.5 rounded-xl border cursor-pointer outline-none transition-colors"
                    style={{
                      background: 'var(--surface)',
                      border: '1px solid var(--border)',
                      color: '#818CF8',
                    }}
                  >
                    <option value="distribution">📊 Budget Distribution</option>
                    <option value="comparison">📈 Budget vs Actual</option>
                  </select>
                  <span className="text-xs text-primary bg-primary/10 px-2.5 py-1 rounded-full border border-primary/20">50/30/20</span>
                </div>
              </div>

              <AnimatePresence mode="wait">
                {chartView === 'distribution' ? (
                  <motion.div key="pie"
                    initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 12 }}
                    className="flex items-center gap-6">
                    <ResponsiveContainer width="55%" height={200}>
                      <PieChart>
                        <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85}
                          paddingAngle={3} dataKey="value">
                          {pieData.map((entry) => (
                            <Cell key={entry.name} fill={entry.color} stroke="transparent" />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="flex-1 space-y-2">
                      {pieData.map((d) => (
                        <div key={d.name} className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: d.color }} />
                            <span className="text-slate-400">{d.name}</span>
                          </div>
                          <span className="font-semibold text-slate-300">{formatCurrency(d.value)}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div key="bar"
                    initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }}>
                    <ResponsiveContainer width="100%" height={220}>
                      <BarChart data={barData} barCategoryGap="30%" barGap={4}>
                        <XAxis dataKey="name" tick={{ fill: '#64748B', fontSize: 10 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: '#64748B', fontSize: 10 }} axisLine={false} tickLine={false}
                          tickFormatter={(v) => `₹${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend wrapperStyle={{ fontSize: 11, color: '#64748B' }} />
                        <Bar dataKey="Budget" fill="rgba(99,102,241,0.5)" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="Spent" fill="rgba(20,184,166,0.7)" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </motion.div>
                )}
              </AnimatePresence>
            </GlassCard>
          </motion.div>
        )}

        {/* ══════════ CATEGORIES TAB ══════════ */}
        {activeTab === 'categories' && (
          <motion.div key="categories"
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs text-slate-500">Drag sliders to adjust your budget. Changes update charts in real-time.</p>
              <div className="text-xs text-slate-500">
                Total budgeted: <span className="text-primary font-semibold">{formatCurrency(totalBudgeted)}</span>
                {totalBudgeted > income && (
                  <span className="ml-2 text-red-400">⚠ exceeds income by {formatCurrency(totalBudgeted - income)}</span>
                )}
              </div>
            </div>
            <motion.div className="grid grid-cols-1 xl:grid-cols-2 gap-3"
              initial="hidden" animate="visible" variants={stagger}>
              {CATS.map((c) => (
                <CategoryCard
                  key={c.key}
                  cat={c}
                  limit={limits[c.key] || 0}
                  spent={spent[c.key] || 0}
                  income={income}
                  onChange={updateLimit}
                />
              ))}
            </motion.div>
          </motion.div>
        )}

        {/* ══════════ AI INSIGHTS TAB ══════════ */}
        {activeTab === 'insights' && (
          <motion.div key="insights" className="space-y-6"
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>

            {/* 50/30/20 explainer */}
            <GlassCard>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.2)' }}>
                  <Brain size={18} className="text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-200 mb-1">Your AI Budget Analysis</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Based on your income of <span className="text-primary font-semibold">{formatCurrency(income)}</span>,
                    your AI budget allocates <span className="text-indigo-400 font-semibold">{formatCurrency(Math.round(income * 0.5))}</span> to needs,
                    <span className="text-teal-400 font-semibold"> {formatCurrency(Math.round(income * 0.3))}</span> to wants, and
                    <span className="text-green-400 font-semibold"> {formatCurrency(Math.round(income * 0.2))}</span> to savings.
                    You are currently spending <span className={totalSpent > income * 0.8 ? 'text-red-400' : 'text-slate-300'}>
                      {formatCurrency(totalSpent)}</span> total this month ({Math.round((totalSpent / income) * 100)}% of income).
                  </p>
                </div>
              </div>
            </GlassCard>

            {/* Suggestions */}
            <div>
              <h3 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
                <Lightbulb size={15} className="text-amber-400" /> Smart Suggestions
              </h3>
              <motion.div className="space-y-3" initial="hidden" animate="visible" variants={stagger}>
                {suggestions.map((s, i) => <SuggestionCard key={i} {...s} />)}
              </motion.div>
            </div>

            {/* Year projection */}
            <GlassCard>
              <h3 className="text-sm font-bold text-slate-200 mb-4 flex items-center gap-2">
                <TrendingUp size={15} className="text-success" /> Annual Savings Projection
              </h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                {[
                  { label: 'This Month', val: Math.max(projectedSavings, 0), color: '#22C55E' },
                  { label: '6 Months', val: Math.max(projectedSavings, 0) * 6, color: '#14B8A6' },
                  { label: '12 Months', val: Math.max(projectedSavings, 0) * 12, color: '#6366F1' },
                ].map(({ label, val, color }) => (
                  <div key={label} className="rounded-xl py-4"
                    style={{ background: `${color}0D`, border: `1px solid ${color}25` }}>
                    <p className="text-[10px] text-slate-500 mb-1">{label}</p>
                    <p className="text-lg font-black" style={{ color }}>{formatCurrency(val)}</p>
                  </div>
                ))}
              </div>
            </GlassCard>

            {/* Category deep dive */}
            <GlassCard>
              <h3 className="text-sm font-bold text-slate-200 mb-4">Category Deep Dive</h3>
              <div className="space-y-4">
                {CATS.filter((c) => c.key !== 'Savings').map((c) => {
                  const lim = limits[c.key] || 0
                  const s = spent[c.key] || 0
                  const pctOfIncome = income > 0 ? ((s / income) * 100).toFixed(1) : 0
                  const pctOfBudget = lim > 0 ? Math.round((s / lim) * 100) : 0
                  return (
                    <div key={c.key} className="flex items-center gap-4 py-2 border-b border-white/5 last:border-0">
                      <span className="text-lg w-7">{c.icon}</span>
                      <div className="flex-1">
                        <div className="flex justify-between mb-1">
                          <span className="text-xs font-semibold text-slate-300">{c.key}</span>
                          <span className="text-[10px] text-slate-500">{pctOfBudget}% of budget · {pctOfIncome}% of income</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full" style={{ background: 'var(--border)' }}>
                          <motion.div className="h-full rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(pctOfBudget, 100)}%` }}
                            transition={{ duration: 0.6 }}
                            style={{ background: s > lim ? '#F43F5E' : c.color }}
                          />
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-bold" style={{ color: c.color }}>{formatCurrency(s)}</p>
                        <p className="text-[10px] text-slate-600">of {formatCurrency(lim)}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
