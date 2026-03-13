import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  Bot,
  Brain,
  CalendarDays,
  Flame,
  PiggyBank,
  PieChart as PieIcon,
  Sparkles,
  Target,
  TrendingDown,
  TrendingUp,
} from 'lucide-react'
import {
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts'
import GlassCard from '../components/ui/GlassCard'
import useExpenseStore from '../store/useExpenseStore'
import useBudgetStore from '../store/useBudgetStore'
import { formatCurrency } from '../utils/formatCurrency'
import { currentMonth } from '../utils/formatDate'
import { getAIReport } from '../services/aiService'

const COLORS = ['#22C55E', '#06B6D4', '#6366F1', '#F59E0B', '#EC4899']
const CATS = ['Food', 'Transport', 'Shopping', 'Entertainment', 'Subscriptions']
const month = currentMonth()

function dayLabel(dateLike) {
  return new Date(dateLike).toLocaleDateString('en-IN', { weekday: 'short' })
}

function ReportTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null

  return (
    <div
      className="rounded-2xl px-3 py-2 text-xs shadow-xl"
      style={{ background: 'var(--dropdown-bg)', border: '1px solid var(--border)', color: 'var(--body-text)' }}
    >
      <p className="text-slate-400 mb-1">{label}</p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center gap-2 mb-0.5">
          <div className="w-2 h-2 rounded-full" style={{ background: entry.fill }} />
          <span className="text-slate-400">{entry.name}:</span>
          <span className="font-bold" style={{ color: entry.fill }}>{formatCurrency(Number(entry.value))}</span>
        </div>
      ))}
    </div>
  )
}

export default function WeeklyReports() {
  const { transactions, loadTransactions } = useExpenseStore()
  const { budget, loadBudget } = useBudgetStore()

  useEffect(() => {
    loadTransactions({ month })
    loadBudget(month)
  }, [])

  const report = useMemo(() => {
    const now = new Date()
    const day = now.getDay()
    const diffToMon = day === 0 ? -6 : 1 - day

    const currentWeekStart = new Date(now)
    currentWeekStart.setDate(now.getDate() + diffToMon)
    currentWeekStart.setHours(0, 0, 0, 0)

    const prevWeekStart = new Date(currentWeekStart)
    prevWeekStart.setDate(currentWeekStart.getDate() - 7)

    const prevWeekEnd = new Date(currentWeekStart)
    prevWeekEnd.setMilliseconds(-1)

    const thisWeek = transactions.filter((t) => {
      if (t.type !== 'expense') return false
      const d = new Date(t.date)
      return d >= currentWeekStart
    })

    const lastWeek = transactions.filter((t) => {
      if (t.type !== 'expense') return false
      const d = new Date(t.date)
      return d >= prevWeekStart && d <= prevWeekEnd
    })

    const catTotal = Object.fromEntries(CATS.map((c) => [c, 0]))
    thisWeek.forEach((t) => {
      const raw = String(t.category || '').trim()
      const normalized = raw.toLowerCase()
      if (normalized === 'subscription' || normalized === 'subscriptions') {
        catTotal.Subscriptions += t.amount
      } else {
        const found = CATS.find((c) => c.toLowerCase() === normalized)
        if (found) catTotal[found] += t.amount
      }
    })

    const dayTotalMap = {}
    thisWeek.forEach((t) => {
      const label = dayLabel(t.date)
      dayTotalMap[label] = (dayTotalMap[label] || 0) + t.amount
    })

    const prevDayTotalMap = {}
    lastWeek.forEach((t) => {
      const label = dayLabel(t.date)
      prevDayTotalMap[label] = (prevDayTotalMap[label] || 0) + t.amount
    })

    const orderedDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    const dailyBars = orderedDays.map((d) => ({
      day: d,
      thisWeek: dayTotalMap[d] || 0,
      lastWeek: prevDayTotalMap[d] || 0,
    }))

    const thisWeekSpend = thisWeek.reduce((s, t) => s + t.amount, 0)
    const lastWeekSpend = lastWeek.reduce((s, t) => s + t.amount, 0)
    const spendingDiffPct =
      lastWeekSpend > 0 ? Math.round(((thisWeekSpend - lastWeekSpend) / lastWeekSpend) * 100) : 0

    const biggest = Object.entries(catTotal).sort((a, b) => b[1] - a[1])[0] || ['None', 0]

    const incomeThisMonth = transactions
      .filter((t) => t.type === 'income')
      .reduce((s, t) => s + t.amount, 0)

    const monthlySavings = Math.max(0, incomeThisMonth - transactions.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0))
    const weeklySaved = Math.round(monthlySavings / 4)

    const monthlyBudget = budget?.limits
      ? Object.values(budget.limits).reduce((s, v) => s + (Number(v) || 0), 0)
      : 0
    const weeklyBudgetTarget = monthlyBudget > 0 ? monthlyBudget / 4 : 0
    const budgetUsedPct = weeklyBudgetTarget > 0 ? Math.round((thisWeekSpend / weeklyBudgetTarget) * 100) : 0

    const pieData = Object.entries(catTotal)
      .filter(([, value]) => value > 0)
      .map(([name, value]) => ({ name, value }))

    const topCategories = Object.entries(catTotal)
      .filter(([, value]) => value > 0)
      .sort((a, b) => b[1] - a[1])
      .map(([name, value]) => ({
        name,
        value,
        percent: thisWeekSpend > 0 ? Math.round((value / thisWeekSpend) * 100) : 0,
      }))

    return {
      thisWeekSpend,
      lastWeekSpend,
      spendingDiffPct,
      biggestCategory: biggest[0],
      biggestCategoryAmount: biggest[1],
      weeklySaved,
      budgetUsedPct,
      pieData,
      dailyBars,
      weeklyBudgetTarget,
      topCategories,
    }
  }, [transactions, budget])

  const insights = useMemo(() => {
    const list = []

    if (report.thisWeekSpend > 0) {
      const direction = report.spendingDiffPct >= 0 ? 'more' : 'less'
      list.push(
        `You spent ${formatCurrency(report.thisWeekSpend)} this week, which is ${Math.abs(report.spendingDiffPct)}% ${direction} than last week.`
      )
    }

    if (report.biggestCategory !== 'None' && report.thisWeekSpend > 0) {
      const pct = Math.round((report.biggestCategoryAmount / report.thisWeekSpend) * 100)
      list.push(`${report.biggestCategory} made up ${pct}% of your weekly spending.`)
    }

    if (report.budgetUsedPct > 100) {
      list.push('You are over your weekly budget pace. Reduce discretionary spending for the next few days.')
    } else if (report.budgetUsedPct > 0) {
      list.push('You are within your weekly budget pace. Keep this pattern to hit your monthly target.')
    }

    if (report.weeklySaved > 0) {
      list.push(`You saved approximately ${formatCurrency(report.weeklySaved)} this week. Consider auto-transferring part of it to your emergency fund.`)
    }

    return list.slice(0, 4)
  }, [report])

  // AI-generated insights — overwrite local ones once AI responds
  const [aiInsights, setAiInsights] = useState(null)
  const [insightsLoading, setInsightsLoading] = useState(false)

  useEffect(() => {
    if (!transactions.length) return
    let cancelled = false
    setInsightsLoading(true)

    const prompt =
      `Analyse my weekly spending and give me exactly 4 short, specific, actionable insights (one per line, no bullet symbols or numbering):\n` +
      `- This week spent: ${formatCurrency(report.thisWeekSpend)}\n` +
      `- vs last week: ${report.spendingDiffPct >= 0 ? '+' : ''}${report.spendingDiffPct}%\n` +
      `- Biggest category: ${report.biggestCategory} (${formatCurrency(report.biggestCategoryAmount)})\n` +
      `- Weekly budget usage: ${report.budgetUsedPct}% (cap: ${formatCurrency(report.weeklyBudgetTarget)})\n` +
      `- Estimated weekly savings: ${formatCurrency(report.weeklySaved)}\n` +
      `Be direct, reference the exact numbers, and keep each insight under 25 words.`

    getAIReport(prompt)
      .then((res) => {
        if (cancelled) return
        const lines = res.data.data
          .split('\n')
          .map((l) => l.replace(/^[\d\.\-\*\s]+/, '').trim())
          .filter(Boolean)
          .slice(0, 4)
        setAiInsights(lines.length >= 2 ? lines : null)
      })
      .catch(() => { if (!cancelled) setAiInsights(null) })
      .finally(() => { if (!cancelled) setInsightsLoading(false) })

    return () => { cancelled = true }
  }, [transactions.length]) // re-run when transactions load

  const displayInsights = aiInsights ?? insights

  const pulseRadius = 58
  const pulseCircumference = 2 * Math.PI * pulseRadius
  // Ring always shows 0-100%; when over budget we fill the ring completely and show overage label
  const isOverBudget = (report.budgetUsedPct || 0) > 100
  const ringFillPct = Math.max(0, Math.min(report.budgetUsedPct || 0, 100))
  const pulseOffset = pulseCircumference - (ringFillPct / 100) * pulseCircumference
  const overBudgetPct = isOverBudget ? Math.round((report.budgetUsedPct || 0) - 100) : 0
  const directionUp = report.spendingDiffPct >= 0
  const weeklyChangeLabel = report.lastWeekSpend > 0 ? `${Math.abs(report.spendingDiffPct)}% vs last week` : 'First tracked week'
  const weeklyNarrative = report.thisWeekSpend > 0
    ? `${report.biggestCategory} led your weekly spend pattern while savings remained ${report.weeklySaved > 0 ? 'positive' : 'tight'}.`
    : 'Add expense entries this week to generate a richer weekly money story.'
  const quickSignals = [
    {
      label: 'Weekly Momentum',
      value: directionUp ? 'Spending up' : 'Spending down',
      tone: directionUp ? 'text-rose-300' : 'text-emerald-300',
      icon: directionUp ? ArrowUpRight : ArrowDownRight,
    },
    {
      label: 'Savings Pulse',
      value: report.weeklySaved > 0 ? formatCurrency(report.weeklySaved) : 'Low buffer',
      tone: 'text-cyan-300',
      icon: PiggyBank,
    },
    {
      label: 'Focus Zone',
      value: report.biggestCategory,
      tone: 'text-amber-300',
      icon: Flame,
    },
  ]

  return (
    <motion.div className="space-y-6" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
      <section className="relative overflow-hidden rounded-[28px] border border-cyan-500/20 bg-[radial-gradient(circle_at_top_left,rgba(6,182,212,0.16),transparent_28%),radial-gradient(circle_at_80%_20%,rgba(99,102,241,0.16),transparent_24%),linear-gradient(180deg,rgba(3,18,28,0.96),rgba(2,11,17,0.96))] p-6 xl:p-7">
        <div className="absolute inset-y-0 right-0 w-[38%] bg-[linear-gradient(90deg,transparent,rgba(14,165,233,0.06))] pointer-events-none" />
        <div className="absolute -top-20 right-10 h-52 w-52 rounded-full bg-cyan-400/10 blur-3xl pointer-events-none" />

        <div className="relative grid grid-cols-1 xl:grid-cols-[1.45fr_0.9fr] gap-6 items-start">
          <div>
            <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
              <div>
                <div className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-300/90 mb-3">
                  <CalendarDays size={12} /> Weekly Reports
                </div>
                <h1 className="text-3xl xl:text-[2.6rem] leading-none font-black text-slate-50">Your Week in Money Motion</h1>
                <p className="text-sm text-slate-400 mt-3 max-w-2xl">A cinematic view of how your money moved this week, where the pressure built up, and what the AI would optimize next.</p>
              </div>
              <div className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-full border border-cyan-500/25 bg-cyan-500/10 text-cyan-300">
                <CalendarDays size={12} /> Auto-generated for current week
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-5">
              <div className="rounded-[24px] border border-white/10 bg-black/20 backdrop-blur-sm p-5">
                <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500 mb-2">Weekly Spending Story</p>
                <div className="flex items-end gap-3 flex-wrap mb-3">
                  <h2 className="text-4xl xl:text-5xl font-black text-rose-300 leading-none">{formatCurrency(report.thisWeekSpend)}</h2>
                  <div className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold border ${directionUp ? 'text-rose-300 border-rose-400/25 bg-rose-500/10' : 'text-emerald-300 border-emerald-400/25 bg-emerald-500/10'}`}>
                    {directionUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                    {weeklyChangeLabel}
                  </div>
                </div>
                <p className="text-sm text-slate-300 max-w-xl leading-6">{weeklyNarrative}</p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5">
                  {quickSignals.map((item) => {
                    const Icon = item.icon
                    return (
                      <div key={item.label} className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                            <Icon size={14} className={item.tone} />
                          </div>
                          <p className="text-[11px] uppercase tracking-wide text-slate-500">{item.label}</p>
                        </div>
                        <p className={`text-sm font-semibold ${item.tone}`}>{item.value}</p>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="rounded-[24px] border border-cyan-500/15 bg-gradient-to-b from-cyan-500/10 to-transparent p-5">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-9 h-9 rounded-xl border border-cyan-400/20 bg-cyan-500/10 flex items-center justify-center">
                    <Activity size={16} className="text-cyan-200" />
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Budget Pulse</p>
                    <p className="text-sm text-slate-300">How hard this week pushed your plan</p>
                  </div>
                </div>

                {/* ── Budget utilisation ring ─────────────── */}
                <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500 text-center mb-1">Budget usage</p>
                <div className="flex items-center justify-center my-2">
                  <div className="relative h-40 w-40">
                    <svg viewBox="0 0 140 140" className="h-full w-full -rotate-90">
                      <circle cx="70" cy="70" r={pulseRadius} fill="none" stroke="rgba(148,163,184,0.16)" strokeWidth="10" />
                      <circle
                        cx="70"
                        cy="70"
                        r={pulseRadius}
                        fill="none"
                        stroke={isOverBudget ? '#FB7185' : '#22C55E'}
                        strokeWidth="10"
                        strokeLinecap="round"
                        strokeDasharray={pulseCircumference}
                        strokeDashoffset={pulseOffset}
                        style={{ transition: 'stroke-dashoffset 700ms ease' }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-2">
                      {isOverBudget ? (
                        <>
                          <p className="text-[10px] uppercase tracking-wide text-rose-400 mb-0.5">Over budget</p>
                          <p className="text-3xl font-black leading-none text-rose-300">+{overBudgetPct}%</p>
                          <p className="text-[10px] text-slate-500 mt-1">budget exceeded</p>
                        </>
                      ) : (
                        <>
                          <p className="text-3xl font-black leading-none text-emerald-300">{ringFillPct}%</p>
                          <p className="text-[10px] text-slate-500 mt-1">of budget used</p>
                        </>
                      )}
                      <p className="text-[10px] text-slate-600 mt-1">cap {formatCurrency(report.weeklyBudgetTarget)}</p>
                    </div>
                  </div>
                </div>

                {/* ── Category spend-share breakdown ──────── */}
                <div className="mt-4 mb-1 flex items-center justify-between">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">Top categories</p>
                  <p className="text-[10px] text-slate-600">% of week's spend</p>
                </div>
                <div className="space-y-2">
                  {report.topCategories.slice(0, 3).map((item, index) => (
                    <div key={item.name} className="flex items-center justify-between rounded-xl border border-white/8 bg-black/20 px-3 py-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[index % COLORS.length] }} />
                        <span className="text-sm text-slate-300 truncate">{item.name}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-semibold text-slate-300">{item.percent}%</span>
                        <span className="text-[10px] text-slate-600 ml-1">of spend</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* ── How to read this ────────────────────── */}
                <div className="mt-4 rounded-xl border border-white/8 bg-white/[0.03] px-3 py-2.5">
                  <p className="text-[10px] text-slate-500 leading-[1.7]">
                    <span className="text-slate-300 font-semibold">Ring</span> = total spend as % of your weekly budget cap.<br />
                    <span className="text-slate-300 font-semibold">Category %</span> = how each category splits your actual spend (these sum to 100%, not to the ring %).
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-[24px] border border-white/10 bg-black/20 p-5 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-xl bg-violet-500/15 border border-violet-400/25 flex items-center justify-center">
                  <Target size={14} className="text-violet-200" />
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Snapshot</p>
                  <p className="text-sm text-slate-300">Core weekly checkpoints</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-[11px] uppercase tracking-wide text-slate-500">Biggest Category</p>
                  <p className="text-2xl font-black text-amber-300 mt-1">{report.biggestCategory}</p>
                  <p className="text-xs text-slate-500 mt-1">{formatCurrency(report.biggestCategoryAmount)} this week</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <p className="text-[11px] uppercase tracking-wide text-slate-500">Saved</p>
                    <p className="text-xl font-black text-emerald-300 mt-1">{formatCurrency(report.weeklySaved)}</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <p className="text-[11px] uppercase tracking-wide text-slate-500">Last Week</p>
                    <p className="text-xl font-black text-slate-200 mt-1">{formatCurrency(report.lastWeekSpend)}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[24px] border border-white/10 bg-black/20 p-5 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-400/25 flex items-center justify-center">
                    <Brain size={14} className="text-amber-200" />
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">AI Briefing</p>
                    <p className="text-sm text-slate-300">Short signals worth acting on</p>
                  </div>
                </div>
                {insightsLoading && (
                  <Bot size={14} className="text-amber-300 animate-pulse" />
                )}
              </div>

              {insightsLoading && !displayInsights.length ? (
                <div className="flex items-center gap-2 text-slate-400 text-sm py-4">
                  <Bot size={14} className="animate-pulse text-amber-300" />
                  <span>AI is analyzing your week...</span>
                </div>
              ) : (
                <div className="space-y-3">
                  {displayInsights.map((text, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06 }}
                      className="rounded-2xl border border-white/10 bg-white/[0.04] p-3"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-xl border border-white/10 bg-black/20 flex items-center justify-center flex-shrink-0">
                          {i === 0 && (directionUp ? <TrendingUp size={14} className="text-rose-300" /> : <TrendingDown size={14} className="text-emerald-300" />)}
                          {i === 1 && <PieIcon size={14} className="text-cyan-300" />}
                          {i === 2 && <Target size={14} className="text-violet-300" />}
                          {i === 3 && <PiggyBank size={14} className="text-emerald-300" />}
                        </div>
                        <p className="text-sm text-slate-300 leading-6">{text}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-[1.05fr_1.45fr] gap-6">
        <GlassCard className="overflow-hidden">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-lg font-bold text-slate-100">Category Heatmap</h3>
              <p className="text-sm text-slate-500 mt-0.5">Where your week concentrated the most spending</p>
            </div>
            <PieIcon size={16} className="text-cyan-300" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[0.95fr_1.05fr] gap-4 items-center">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie
                    data={report.pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={92}
                    innerRadius={52}
                    paddingAngle={3}
                  >
                    {report.pieData.map((entry, i) => (
                      <Cell key={entry.name} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<ReportTooltip />} />
                </RePieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-3">
              {report.topCategories.map((item, index) => (
                <div key={item.name} className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[index % COLORS.length] }} />
                      <span className="text-sm font-medium text-slate-200 truncate">{item.name}</span>
                    </div>
                    <span className="text-xs text-slate-400">{formatCurrency(item.value)}</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-800/80 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: COLORS[index % COLORS.length] }}
                      initial={{ width: 0 }}
                      animate={{ width: `${item.percent}%` }}
                      transition={{ duration: 0.7, delay: index * 0.05 }}
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-2">{item.percent}% of this week</p>
                </div>
              ))}
              {report.topCategories.length === 0 && (
                <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.03] p-4 text-sm text-slate-500">
                  Weekly category distribution will appear once expenses are recorded.
                </div>
              )}
            </div>
          </div>
        </GlassCard>

        <GlassCard className="overflow-hidden">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-lg font-bold text-slate-100">Daily Momentum</h3>
              <p className="text-sm text-slate-500 mt-0.5">This week versus last week, day by day</p>
            </div>
            <div className="text-xs text-slate-500">Thu and Fri were your peak spend days</div>
          </div>

          <div className="rounded-[24px] border border-white/10 bg-black/20 p-4">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={report.dailyBars} barGap={10}>
                  <CartesianGrid strokeDasharray="4 4" stroke="rgba(148,163,184,0.14)" vertical={false} />
                  <XAxis dataKey="day" stroke="#94A3B8" fontSize={12} axisLine={false} tickLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={12} axisLine={false} tickLine={false} tickFormatter={(v) => formatCurrency(v).replace('.00', '')} />
                  <Tooltip content={<ReportTooltip />} />
                  <Bar dataKey="thisWeek" name="This Week" fill="#22C55E" radius={[10, 10, 0, 0]} />
                  <Bar dataKey="lastWeek" name="Last Week" fill="#6366F1" radius={[10, 10, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <div className="flex items-center gap-2 mb-2 text-emerald-300">
                <ArrowUpRight size={14} />
                <span className="text-xs uppercase tracking-wide">Spend Peak</span>
              </div>
              <p className="text-sm text-slate-300">Highest outflow happened around your entertainment and shopping cluster.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <div className="flex items-center gap-2 mb-2 text-violet-300">
                <Sparkles size={14} />
                <span className="text-xs uppercase tracking-wide">Pattern</span>
              </div>
              <p className="text-sm text-slate-300">Your week was front-loaded, with most spend pressure building before the weekend.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <div className="flex items-center gap-2 mb-2 text-cyan-300">
                <Brain size={14} />
                <span className="text-xs uppercase tracking-wide">Move Next</span>
              </div>
              <p className="text-sm text-slate-300">Shift one discretionary expense into savings to smooth your weekly cash flow.</p>
            </div>
          </div>
        </GlassCard>
      </div>
    </motion.div>
  )
}
