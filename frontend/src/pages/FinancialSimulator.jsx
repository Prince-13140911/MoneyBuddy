import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
  ResponsiveContainer, ReferenceLine, Legend,
} from 'recharts'
import {
  TrendingUp, Zap, IndianRupee, Sliders, Lightbulb,
  Target, Brain, Sparkles, ArrowUp, ArrowDown, RefreshCw,
} from 'lucide-react'
import GlassCard from '../components/ui/GlassCard'
import { formatCurrency } from '../utils/formatCurrency'

const fadeUp  = { hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } }
const stagger = { visible: { transition: { staggerChildren: 0.08 } } }

// ─── Tooltip ─────────────────────────────────────────────────────
function ChartTip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl px-3 py-2 text-xs shadow-xl"
      style={{ background: 'var(--dropdown-bg)', border: '1px solid var(--border)', color: 'var(--body-text)' }}>
      <p className="text-slate-400 mb-1.5">{label}</p>
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

// ─── Slider row ───────────────────────────────────────────────────
function SimSlider({ label, value, min, max, step, color, onChange, sublabel }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold" style={{ color: 'var(--body-text)' }}>{label}</p>
          {sublabel && <p className="text-[10px] text-slate-500">{sublabel}</p>}
        </div>
        <motion.span key={value} className="text-sm font-black tabular-nums"
          initial={{ scale: 0.9 }} animate={{ scale: 1 }} style={{ color }}>
          {formatCurrency(value)}
        </motion.span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 rounded-full appearance-none cursor-pointer"
        style={{
          accentColor: color,
          background: `linear-gradient(to right, ${color} 0%, ${color} ${((value - min) / (max - min)) * 100}%, rgba(100,116,139,0.3) ${((value - min) / (max - min)) * 100}%, rgba(100,116,139,0.3) 100%)`,
        }}
      />
      <div className="flex justify-between text-[9px] text-slate-600">
        <span>{formatCurrency(min)}</span><span>{formatCurrency(max)}</span>
      </div>
    </div>
  )
}

// ─── Scenario comparison card ─────────────────────────────────────
function CompareCard({ label, value, improved, color }) {
  const diff   = improved - value
  const pctInc = value > 0 ? Math.round((diff / value) * 100) : 0
  return (
    <div className="rounded-2xl p-4" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-3">{label}</p>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-[10px] text-slate-500 mb-0.5">Current habits</p>
          <p className="text-base font-black" style={{ color: '#6366F1' }}>{formatCurrency(value)}</p>
        </div>
        <div>
          <p className="text-[10px] text-slate-500 mb-0.5">Improved habits</p>
          <p className="text-base font-black" style={{ color: '#22C55E' }}>{formatCurrency(improved)}</p>
        </div>
      </div>
      {diff > 0 && (
        <div className="mt-2.5 flex items-center gap-1.5 text-[11px] font-semibold text-green-400">
          <ArrowUp size={12} />
          {formatCurrency(diff)} more (+{pctInc}%) with improved habits
        </div>
      )}
    </div>
  )
}

// ─── AI insight pill ──────────────────────────────────────────────
function InsightPill({ icon: Icon, text, color }) {
  return (
    <motion.div variants={fadeUp}
      className="flex items-start gap-2.5 p-3 rounded-xl"
      style={{ background: `${color}0C`, border: `1px solid ${color}25` }}>
      <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
        style={{ background: `${color}18` }}>
        <Icon size={12} style={{ color }} />
      </div>
      <p className="text-xs text-slate-300 leading-relaxed">{text}</p>
    </motion.div>
  )
}

// ─── Build simulation data ────────────────────────────────────────
function buildProjection(monthlySavings, investmentReturn, months) {
  const r = investmentReturn / 100 / 12
  return Array.from({ length: months + 1 }, (_, i) => {
    const simple   = monthlySavings * i
    const compound = r > 0 ? monthlySavings * ((Math.pow(1 + r, i) - 1) / r) : simple
    return { month: i, simple: Math.round(simple), compound: Math.round(compound) }
  })
}

const CHECKPOINTS = [6, 12, 60]
const CHECKPOINT_LABELS = { 6: '6 Months', 12: '1 Year', 60: '5 Years' }

const AI_STRATEGIES = {
  balanced: {
    label: 'Balanced Growth',
    savingsRate: 0.18,
    lifestyleCut: 0.1,
    investShare: 0.35,
    returnRate: 12,
    summary: 'Balances savings discipline with realistic lifestyle cuts.',
  },
  wealth: {
    label: 'Wealth Builder',
    savingsRate: 0.24,
    lifestyleCut: 0.15,
    investShare: 0.55,
    returnRate: 13,
    summary: 'Pushes more surplus into SIPs to maximize 5-year growth.',
  },
  safety: {
    label: 'Safety First',
    savingsRate: 0.22,
    lifestyleCut: 0.08,
    investShare: 0.2,
    returnRate: 10,
    summary: 'Builds cash reserves first, then adds moderate investing.',
  },
}

function generateAIScenario({ income, savings, lifestyle, invest, strategyKey }) {
  const strategy = AI_STRATEGIES[strategyKey] || AI_STRATEGIES.balanced
  const currentCommitted = savings + lifestyle + invest
  const currentSurplus = Math.max(0, income - currentCommitted)
  const targetSavings = Math.round(income * strategy.savingsRate / 500) * 500
  const reducedLifestyle = Math.max(
    0,
    Math.round((lifestyle * (1 - strategy.lifestyleCut)) / 500) * 500,
  )
  const freedLifestyleCash = Math.max(0, lifestyle - reducedLifestyle)
  const availableForUpgrade = currentSurplus + freedLifestyleCash
  const extraSavingsNeeded = Math.max(0, targetSavings - savings)
  const savingsBoost = Math.min(extraSavingsNeeded, availableForUpgrade)
  const remainingAfterSavings = Math.max(0, availableForUpgrade - savingsBoost)
  const investBoost = Math.round((remainingAfterSavings * strategy.investShare) / 500) * 500

  const optimizedSavings = savings + savingsBoost
  const optimizedInvest = invest + investBoost
  const optimizedLifestyle = reducedLifestyle
  const optimizedSurplus = income - optimizedSavings - optimizedInvest - optimizedLifestyle

  return {
    strategy,
    savings: optimizedSavings,
    lifestyle: optimizedLifestyle,
    invest: optimizedInvest,
    surplus: optimizedSurplus,
    recommendedReturn: strategy.returnRate,
  }
}

function RecommendationRow({ label, current, suggested, color, sublabel, formatter = formatCurrency }) {
  const diff = suggested - current
  const maxValue = Math.max(current, suggested, 1)
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold" style={{ color: 'var(--body-text)' }}>{label}</p>
          {sublabel && <p className="text-[10px] text-slate-500">{sublabel}</p>}
        </div>
        <div className="text-right">
          <p className="text-sm font-black" style={{ color }}>{formatter(suggested)}</p>
          <p className={`text-[10px] font-semibold ${diff >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {diff >= 0 ? '+' : ''}{formatter(diff)} vs current
          </p>
        </div>
      </div>
      <div className="relative h-2 rounded-full" style={{ background: 'rgba(100,116,139,0.25)' }}>
        <div className="absolute inset-y-0 left-0 rounded-full bg-slate-400/35"
          style={{ width: `${(current / maxValue) * 100}%` }} />
        <div className="absolute inset-y-0 left-0 rounded-full"
          style={{ width: `${(suggested / maxValue) * 100}%`, background: color }} />
      </div>
      <div className="flex justify-between text-[9px] text-slate-500">
        <span>Current: {formatter(current)}</span>
        <span>AI: {formatter(suggested)}</span>
      </div>
    </div>
  )
}

export default function FinancialSimulator() {
  // Scenario A — current habits
  const [incomeA,     setIncomeA]     = useState(30000)
  const [savingsA,    setSavingsA]    = useState(3000)
  const [lifestyleA,  setLifestyleA]  = useState(8000)
  const [investA,     setInvestA]     = useState(0)

  const [strategyKey, setStrategyKey] = useState('balanced')
  const [hasGeneratedPlan, setHasGeneratedPlan] = useState(false)

  const [returnRate, setReturnRate]   = useState(12)
  const [horizon,    setHorizon]      = useState(60)

  const aiScenario = useMemo(() => generateAIScenario({
    income: incomeA,
    savings: savingsA,
    lifestyle: lifestyleA,
    invest: investA,
    strategyKey,
  }), [incomeA, savingsA, lifestyleA, investA, strategyKey])

  const savingsB = aiScenario.savings
  const lifestyleB = aiScenario.lifestyle
  const investB = aiScenario.invest

  const projA = useMemo(() => buildProjection(savingsA + investA,  returnRate, horizon), [savingsA, investA, returnRate, horizon])
  const projB = useMemo(() => buildProjection(savingsB + investB,  returnRate, horizon), [savingsB, investB, returnRate, horizon])

  const chartData = useMemo(() => {
    return projA.map((a, i) => ({
      label: i === 0 ? 'Now' : i <= 12 ? `M${i}` : i === 60 ? '5yr' : i === 24 ? '2yr' : `M${i}`,
      'Current savings':  a.simple,
      'Current + invest': a.compound,
      'Improved savings': projB[i]?.simple   ?? 0,
      'Improved + invest': projB[i]?.compound ?? 0,
    }))
  }, [projA, projB])

  // Milestones at 6m / 1yr / 5yr
  const milestones = useMemo(() => CHECKPOINTS.map((m) => ({
    period: CHECKPOINT_LABELS[m],
    currentSave:   projA[Math.min(m, projA.length - 1)]?.simple    ?? 0,
    improvedSave:  projB[Math.min(m, projB.length - 1)]?.simple    ?? 0,
    currentInvest: projA[Math.min(m, projA.length - 1)]?.compound  ?? 0,
    improvedInvest:projB[Math.min(m, projB.length - 1)]?.compound  ?? 0,
  })), [projA, projB])

  const monthlySurplusA = incomeA - lifestyleA - (savingsA + investA)
  const monthlySurplusB = aiScenario.surplus
  const sipIn5y = Math.round(investB * ((Math.pow(1 + returnRate / 100 / 12, 60) - 1) / (returnRate / 100 / 12)))

  const insights = useMemo(() => [
    {
      icon: TrendingUp, color: '#22C55E',
      text: `Saving just ₹${(savingsB - savingsA).toLocaleString('en-IN')} more per month compounds to `
           + `${formatCurrency((projB[60]?.simple ?? 0) - (projA[60]?.simple ?? 0))} extra over 5 years.`,
    },
    {
      icon: Sparkles, color: '#6366F1',
      text: `A ₹${investB.toLocaleString('en-IN')}/month SIP at ${returnRate}% annual return grows to approximately `
           + `${formatCurrency(sipIn5y)} after 5 years — the power of compounding.`,
    },
    {
      icon: Lightbulb, color: '#F59E0B',
      text: `The ${aiScenario.strategy.label} plan trims lifestyle spending by ${formatCurrency(lifestyleA - lifestyleB)}/month and redirects the cash to savings and SIPs automatically.`,
    },
    {
      icon: Brain, color: '#14B8A6',
      text: `AI generated Scenario B by targeting a ${Math.round((savingsB / incomeA) * 100)}% savings rate with the ${aiScenario.strategy.label} profile: ${aiScenario.strategy.summary}`,
    },
  ], [savingsA, savingsB, investA, investB, lifestyleA, lifestyleB, projA, projB, returnRate, sipIn5y, aiScenario, incomeA])

  const horizonLabels = { 12: '1 Year', 24: '2 Years', 60: '5 Years' }

  return (
    <motion.div className="space-y-6" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>

      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center mt-0.5"
          style={{ background: 'rgba(20,184,166,0.15)', border: '1px solid rgba(20,184,166,0.3)' }}>
          <TrendingUp size={16} className="text-teal-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold" style={{ color: 'var(--body-text)' }}>Financial Future Simulator</h1>
          <p className="text-sm text-slate-500 mt-0.5">Predict your wealth at 6 months, 1 year and 5 years</p>
        </div>
      </div>

      {/* Controls */}
      <div className={`grid grid-cols-1 ${hasGeneratedPlan ? 'xl:grid-cols-2' : ''} gap-6`}>

        {/* Scenario A */}
        <GlassCard>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-5 rounded-full" style={{ background: '#6366F1' }} />
            <h3 className="font-semibold text-sm" style={{ color: 'var(--body-text)' }}>Scenario A — Current Habits</h3>
          </div>
          <div className="space-y-5">
            <SimSlider label="Monthly Income"    value={incomeA}    min={5000}  max={150000} step={500}  color="#22C55E" onChange={setIncomeA}    sublabel="Your take-home pay" />
            <SimSlider label="Monthly Savings"   value={savingsA}   min={0}     max={incomeA * 0.5} step={500}  color="#6366F1" onChange={setSavingsA}   sublabel="Direct bank savings" />
            <SimSlider label="Lifestyle Spend"   value={lifestyleA} min={0}     max={incomeA * 0.8} step={500}  color="#F43F5E" onChange={setLifestyleA} sublabel="Entertainment, dining, shopping" />
            <SimSlider label="SIP / Investment"  value={investA}    min={0}     max={incomeA * 0.5} step={500}  color="#F59E0B" onChange={setInvestA}    sublabel="Monthly mutual fund or SIP" />
          </div>
          <div className="mt-4 flex items-center justify-between text-xs pt-3" style={{ borderTop: '1px solid var(--border)' }}>
            <span className="text-slate-500">Monthly surplus</span>
            <span className={`font-bold ${monthlySurplusA >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {monthlySurplusA >= 0 ? '+' : ''}{formatCurrency(monthlySurplusA)}
            </span>
          </div>
          {!hasGeneratedPlan && (
            <div className="mt-5 rounded-2xl p-4"
              style={{ background: 'linear-gradient(135deg, rgba(34,197,94,0.08), rgba(20,184,166,0.05))', border: '1px solid rgba(34,197,94,0.18)' }}>
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-green-400 mb-1">Next Step</p>
                  <p className="text-sm font-semibold" style={{ color: 'var(--body-text)' }}>Generate an AI-optimized Scenario B</p>
                  <p className="text-[11px] text-slate-500 mt-1">MoneyBuddy will turn your current numbers into a recommended savings, lifestyle, and SIP plan.</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    setHasGeneratedPlan(true)
                    setReturnRate(aiScenario.recommendedReturn)
                  }}
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-white flex items-center gap-2"
                  style={{ background: 'linear-gradient(135deg, #22C55E, #14B8A6)', boxShadow: '0 10px 30px rgba(34,197,94,0.18)' }}>
                  <Sparkles size={14} />
                  Generate AI Plan
                </motion.button>
              </div>
            </div>
          )}
        </GlassCard>

        {/* Scenario B */}
        {hasGeneratedPlan && (
        <motion.div
          initial={{ opacity: 0, y: 18, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}>
        <GlassCard>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-5 rounded-full" style={{ background: '#22C55E' }} />
            <h3 className="font-semibold text-sm" style={{ color: 'var(--body-text)' }}>Scenario B — AI Recommended Plan</h3>
            <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full text-green-400"
              style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)' }}>
              Auto-generated
            </span>
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            {Object.entries(AI_STRATEGIES).map(([key, strategy]) => (
              <button
                key={key}
                onClick={() => {
                  setStrategyKey(key)
                  setReturnRate(strategy.returnRate)
                }}
                className="px-3 py-1.5 rounded-xl text-[11px] font-semibold transition-all"
                style={strategyKey === key
                  ? { background: 'rgba(34,197,94,0.16)', color: '#22C55E', border: '1px solid rgba(34,197,94,0.35)' }
                  : { color: '#64748B', border: '1px solid var(--border)' }
                }>
                {strategy.label}
              </button>
            ))}
          </div>
          <p className="text-[11px] text-slate-500 mb-4">{aiScenario.strategy.summary}</p>
          <div className="space-y-5">
            <RecommendationRow label="Monthly Savings" current={savingsA} suggested={savingsB} color="#22C55E" sublabel="AI increases your cash savings target" />
            <RecommendationRow label="Lifestyle Spend" current={lifestyleA} suggested={lifestyleB} color="#F43F5E" sublabel="AI trims discretionary spending" />
            <RecommendationRow label="SIP / Investment" current={investA} suggested={investB} color="#F59E0B" sublabel="AI reallocates surplus toward long-term growth" />
            <SimSlider label="Annual Return %" value={returnRate} min={4} max={24} step={0.5} color="#14B8A6" onChange={setReturnRate} sublabel="Adjust market return assumption" />
          </div>
          <div className="mt-4 flex items-center justify-between text-xs pt-3" style={{ borderTop: '1px solid var(--border)' }}>
            <span className="text-slate-500">Monthly surplus</span>
            <span className={`font-bold ${monthlySurplusB >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {monthlySurplusB >= 0 ? '+' : ''}{formatCurrency(monthlySurplusB)}
            </span>
          </div>
        </GlassCard>
        </motion.div>
        )}
      </div>

      {/* Horizon selector */}
      <GlassCard>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <Sliders size={15} className="text-primary" />
            <span className="text-sm font-semibold" style={{ color: 'var(--body-text)' }}>Projection Horizon</span>
          </div>
          <div className="flex gap-2">
            {Object.entries(horizonLabels).map(([val, lbl]) => (
              <button key={val}
                onClick={() => setHorizon(Number(val))}
                className="px-4 py-1.5 rounded-xl text-xs font-semibold transition-all"
                style={horizon === Number(val)
                  ? { background: 'rgba(99,102,241,0.2)', color: '#818CF8', border: '1px solid rgba(99,102,241,0.4)' }
                  : { color: '#64748B', border: '1px solid var(--border)' }
                }>
                {lbl}
              </button>
            ))}
          </div>
        </div>
      </GlassCard>

      {/* Projection chart */}
      <GlassCard>
        <h3 className="font-semibold text-sm mb-4" style={{ color: 'var(--body-text)' }}>
          Savings Growth Projection ({horizonLabels[horizon] || `${horizon} months`})
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart
            data={chartData.filter((_, i) => {
              const step = horizon <= 12 ? 1 : horizon <= 24 ? 2 : 6
              return i % step === 0
            })}
            margin={{ top: 8, right: 8, left: -5, bottom: 0 }}>
            <defs>
              {[['a1','#6366F1'], ['a2','#818CF8'], ['a3','#22C55E'], ['a4','#34D399']].map(([id, c]) => (
                <linearGradient key={id} id={id} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={c} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={c} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,116,139,0.12)" />
            <XAxis dataKey="label" tick={{ fill: '#64748B', fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#64748B', fontSize: 10 }} axisLine={false} tickLine={false}
              tickFormatter={(v) => v >= 100000 ? `₹${(v/100000).toFixed(1)}L` : v >= 1000 ? `₹${(v/1000).toFixed(0)}k` : `₹${v}`} />
            <Tooltip content={<ChartTip />} />
            <Legend wrapperStyle={{ fontSize: 11, color: '#64748B', paddingTop: 8 }} />
            <Area type="monotone" dataKey="Current savings"  stroke="#6366F1" strokeWidth={2} fill="url(#a1)" dot={false} />
            <Area type="monotone" dataKey="Current + invest" stroke="#818CF8" strokeWidth={1.5} fill="url(#a2)" strokeDasharray="4 2" dot={false} />
            {hasGeneratedPlan && <Area type="monotone" dataKey="Improved savings"  stroke="#22C55E" strokeWidth={2} fill="url(#a3)" dot={false} />}
            {hasGeneratedPlan && <Area type="monotone" dataKey="Improved + invest" stroke="#34D399" strokeWidth={1.5} fill="url(#a4)" strokeDasharray="4 2" dot={false} />}
          </AreaChart>
        </ResponsiveContainer>
      </GlassCard>

      {/* Milestone cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {milestones.map((m) => (
          <div key={m.period} className="rounded-2xl p-4 space-y-3"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">{m.period}</p>
            <div className={`grid gap-2 ${hasGeneratedPlan ? 'grid-cols-2' : 'grid-cols-1'}`}>
              {[
                { label: 'A save',     value: m.currentSave,    color: '#6366F1' },
                ...(hasGeneratedPlan ? [{ label: 'B save', value: m.improvedSave, color: '#22C55E' }] : []),
                { label: 'A invest',   value: m.currentInvest,  color: '#818CF8' },
                ...(hasGeneratedPlan ? [{ label: 'B invest', value: m.improvedInvest, color: '#34D399' }] : []),
              ].map(({ label, value, color }) => (
                <div key={label}>
                  <p className="text-[9px] text-slate-500 mb-0.5">{label}</p>
                  <p className="text-xs font-black" style={{ color }}>{formatCurrency(value)}</p>
                </div>
              ))}
            </div>
            {hasGeneratedPlan && m.improvedInvest > m.currentInvest && (
              <p className="text-[10px] text-green-400 font-semibold">
                +{formatCurrency(m.improvedInvest - m.currentInvest)} extra with improved habits
              </p>
            )}
          </div>
        ))}
      </div>

      {/* AI Insights */}
      {hasGeneratedPlan ? (
      <GlassCard>
        <div className="flex items-center gap-2 mb-4">
          <Brain size={15} className="text-primary" />
          <h3 className="font-semibold text-sm" style={{ color: 'var(--body-text)' }}>AI Financial Insights</h3>
        </div>
        <motion.div className="space-y-3" initial="hidden" animate="visible" variants={stagger}>
          {insights.map((ins, i) => <InsightPill key={i} {...ins} />)}
        </motion.div>
      </GlassCard>
      ) : (
      <GlassCard>
        <div className="flex items-center gap-2 mb-3">
          <Brain size={15} className="text-primary" />
          <h3 className="font-semibold text-sm" style={{ color: 'var(--body-text)' }}>AI Financial Insights</h3>
        </div>
        <p className="text-sm text-slate-500">Generate the AI plan to unlock personalized recommendations and the optimized Scenario B comparison.</p>
      </GlassCard>
      )}
    </motion.div>
  )
}
