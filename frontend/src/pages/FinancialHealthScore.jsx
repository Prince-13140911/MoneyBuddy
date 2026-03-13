import { useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { ShieldCheck, Sparkles, TrendingUp, PiggyBank, Wallet, Scale, Landmark } from 'lucide-react'
import GlassCard from '../components/ui/GlassCard'
import ProgressBar from '../components/ui/ProgressBar'
import useExpenseStore from '../store/useExpenseStore'
import useBudgetStore from '../store/useBudgetStore'
import { formatCurrency } from '../utils/formatCurrency'
import { currentMonth } from '../utils/formatDate'

const month = currentMonth()

function clampScore(n) {
  return Math.max(0, Math.min(100, Math.round(n)))
}

function getSavingsDisciplineScore(income, expense) {
  if (income <= 0) return 0

  const savingsPct = ((income - expense) / income) * 100

  if (savingsPct <= 0) return 0
  if (savingsPct < 5) return clampScore((savingsPct / 5) * 25)
  if (savingsPct < 10) return clampScore(25 + ((savingsPct - 5) / 5) * 20)
  if (savingsPct < 15) return clampScore(45 + ((savingsPct - 10) / 5) * 20)
  if (savingsPct < 20) return clampScore(65 + ((savingsPct - 15) / 5) * 20)
  if (savingsPct < 25) return clampScore(85 + ((savingsPct - 20) / 5) * 15)

  return 100
}

function getBudgetControlScore(expense, totalBudget) {
  if (totalBudget <= 0) return 60

  const utilization = expense / totalBudget

  if (utilization <= 0.5) return clampScore(72 + (utilization / 0.5) * 14)
  if (utilization <= 0.75) return clampScore(86 + ((utilization - 0.5) / 0.25) * 10)
  if (utilization <= 0.9) return clampScore(96 + ((utilization - 0.75) / 0.15) * 4)
  if (utilization <= 1) return clampScore(100 - ((utilization - 0.9) / 0.1) * 15)
  if (utilization <= 1.15) return clampScore(85 - ((utilization - 1) / 0.15) * 35)
  if (utilization <= 1.35) return clampScore(50 - ((utilization - 1.15) / 0.2) * 30)

  return 20
}

export default function FinancialHealthScore() {
  const { transactions, summary, loadTransactions, loadSummary } = useExpenseStore()
  const { budget, goals, loadBudget, loadGoals } = useBudgetStore()

  useEffect(() => {
    loadTransactions({ month })
    loadSummary({ month })
    loadBudget(month)
    loadGoals()
  }, [])

  const scoreData = useMemo(() => {
    const income = transactions.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0)
    const expense = transactions.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0)

    const savingsPct = income > 0 ? ((income - expense) / income) * 100 : 0
    const savingsDiscipline = getSavingsDisciplineScore(income, expense)

    const totalBudget = budget?.limits
      ? Object.values(budget.limits).reduce((s, v) => s + (Number(v) || 0), 0)
      : 0
    const budgetControl = getBudgetControlScore(expense, totalBudget)

    const catValues = Object.values(summary || {}).filter((v) => Number(v) > 0)
    const totalCat = catValues.reduce((s, v) => s + Number(v), 0)
    const maxCat = catValues.length ? Math.max(...catValues) : 0
    const concentration = totalCat > 0 ? maxCat / totalCat : 0
    const spendingBalance = clampScore((1 - concentration) * 120)

    const emergencyGoals = goals.filter((g) => /emergency/i.test(String(g.title || '')))
    const emergencyProgress = emergencyGoals.length
      ? emergencyGoals.reduce((s, g) => s + ((Number(g.savedAmount) || 0) / Math.max(1, Number(g.targetAmount) || 1)), 0) / emergencyGoals.length
      : Math.max(0, Math.min(1, (income - expense) / Math.max(1, income) * 0.8))

    const investmentTx = transactions.filter((t) => /sip|invest|mutual|equity|fund/i.test(`${t.title || ''} ${t.category || ''}`))
    const investmentActivity = investmentTx.reduce((s, t) => s + Math.max(0, Number(t.amount) || 0), 0)
    const investmentReadiness = clampScore((emergencyProgress * 70) + (Math.min(1, investmentActivity / Math.max(1, income * 0.15)) * 30))

    const emergencyScore = clampScore(emergencyProgress * 100)

    const overall = clampScore(
      savingsDiscipline * 0.28 +
      budgetControl * 0.27 +
      spendingBalance * 0.2 +
      emergencyScore * 0.15 +
      investmentReadiness * 0.1
    )

    return {
      income,
      expense,
      overall,
      components: [
        { key: 'Savings Discipline', value: savingsDiscipline, color: 'success', icon: PiggyBank },
        { key: 'Budget Control', value: budgetControl, color: 'primary', icon: Wallet },
        { key: 'Spending Balance', value: spendingBalance, color: 'secondary', icon: Scale },
        { key: 'Investment Readiness', value: investmentReadiness, color: 'warning', icon: Landmark },
      ],
      savingsGapToTarget: Math.max(0, Math.round((income * 0.25) - Math.max(0, income - expense))),
      savingsPct,
      totalBudget,
      emergencyScore,
      investmentActivity,
    }
  }, [transactions, summary, budget, goals])

  const suggestions = useMemo(() => {
    const list = []

    if (scoreData.savingsGapToTarget > 0) {
      const jump = Math.max(4, Math.round((scoreData.savingsGapToTarget / 1000) * 3))
      list.push(`Increasing monthly savings by ${formatCurrency(scoreData.savingsGapToTarget)} could raise your score by around ${jump} points.`)
    }

    const weakest = [...scoreData.components].sort((a, b) => a.value - b.value)[0]
    if (weakest) {
      list.push(`${weakest.key} is your weakest area. Improving it by 15 points can unlock a healthier finance profile.`)
    }

    if (scoreData.investmentActivity === 0) {
      list.push('Start a small SIP to improve investment readiness and long-term wealth potential.')
    }

    if (scoreData.emergencyScore < 60) {
      list.push('Build emergency reserves first. A 3-6 month safety buffer protects your goals.')
    }

    return list.slice(0, 4)
  }, [scoreData])

  return (
    <motion.div className="space-y-6" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-100">Financial Health Score</h1>
          <p className="text-sm text-slate-500 mt-0.5">A 0-100 score powered by your savings, budgeting, and investment behavior</p>
        </div>
        <div className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-full border border-violet-500/25 bg-violet-500/10 text-violet-300">
          <Sparkles size={12} /> Intelligent scoring model
        </div>
      </div>

      <GlassCard className="overflow-hidden">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-center">
          <div className="xl:col-span-1">
            <p className="text-xs uppercase tracking-wide text-slate-500 mb-2">Financial Health Score</p>
            <div className="rounded-2xl border border-violet-500/25 bg-gradient-to-br from-violet-500/20 to-cyan-500/10 p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-violet-500/20 border border-violet-400/30 flex items-center justify-center">
                  <ShieldCheck size={18} className="text-violet-200" />
                </div>
                <span className="text-sm text-slate-300">Current score</span>
              </div>
              <p className="text-4xl font-black text-white leading-none">{scoreData.overall} <span className="text-xl text-slate-300">/ 100</span></p>
              <p className="text-xs text-slate-300 mt-2">Better consistency in savings and budget habits improves this quickly.</p>
            </div>
          </div>

          <div className="xl:col-span-2 space-y-4">
            {scoreData.components.map((item) => {
              const Icon = item.icon
              return (
                <div key={item.key} className="rounded-xl border border-white/10 bg-white/5 p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Icon size={14} className="text-slate-300" />
                      <span className="text-sm text-slate-200 font-medium">{item.key}</span>
                    </div>
                    <span className="text-xs font-bold text-slate-300">{item.value}/100</span>
                  </div>
                  <ProgressBar value={item.value} max={100} color={item.color} showLabel={false} />
                </div>
              )
            })}
          </div>
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <GlassCard>
          <p className="text-xs uppercase tracking-wide text-slate-500">Income vs Expense</p>
          <p className="text-sm text-slate-300 mt-3">Income: <strong className="text-emerald-300">{formatCurrency(scoreData.income)}</strong></p>
          <p className="text-sm text-slate-300 mt-1">Expense: <strong className="text-rose-300">{formatCurrency(scoreData.expense)}</strong></p>
          <p className="text-xs text-slate-500 mt-2">Savings rate: {Math.max(0, Math.round(scoreData.savingsPct))}%</p>
        </GlassCard>

        <GlassCard>
          <p className="text-xs uppercase tracking-wide text-slate-500">Score Direction</p>
          <div className="flex items-center gap-2 mt-3 text-cyan-300 text-sm">
            <TrendingUp size={14} />
            Aim for +8 points this month
          </div>
          <p className="text-xs text-slate-400 mt-1">Raise savings by at least 5% and cap overspending categories.</p>
        </GlassCard>

        <GlassCard>
          <p className="text-xs uppercase tracking-wide text-slate-500">Next Milestone</p>
          <p className="text-sm text-slate-200 mt-3">Reach <strong className="text-violet-300">80/100</strong> for strong financial stability.</p>
          <p className="text-xs text-slate-400 mt-1">Budget target: {formatCurrency(scoreData.totalBudget || 0)}. Staying near 75-90% usage improves control without overspending.</p>
        </GlassCard>
      </div>

      <GlassCard>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-slate-200">AI Recommendations</h3>
          <Sparkles size={14} className="text-amber-300" />
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
          {suggestions.map((s, i) => (
            <div key={i} className="rounded-xl p-3 border border-white/10 bg-white/5 text-sm text-slate-300">
              {s}
            </div>
          ))}
        </div>
      </GlassCard>
    </motion.div>
  )
}
