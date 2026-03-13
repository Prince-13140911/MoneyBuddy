import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Wallet, TrendingDown, PiggyBank, Activity, ArrowUpRight, ArrowDownRight, Sparkles, TrendingUp } from 'lucide-react'
import StatCard from '../components/ui/StatCard'
import GlassCard from '../components/ui/GlassCard'
import SpendingAreaChart from '../components/charts/SpendingAreaChart'
import CategoryPieChart from '../components/charts/CategoryPieChart'
import AIInsightCard from '../components/ai/AIInsightCard'
import ChartModal, { ExpandButton } from '../components/ui/ChartModal'
import Badge from '../components/ui/Badge'
import useExpenseStore from '../store/useExpenseStore'
import { formatCurrency } from '../utils/formatCurrency'
import { formatDate, currentMonth } from '../utils/formatDate'

const month = currentMonth()

const stagger = { visible: { transition: { staggerChildren: 0.07 } } }
const fadeUp = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }

export default function Dashboard() {
  const { transactions, summary, loadTransactions, loadSummary, loading } = useExpenseStore()

  useEffect(() => {
    loadTransactions({ month })
    loadSummary({ month })
  }, [])

  const totalIncome = transactions.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0)
  const totalExpense = transactions.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
  const balance = totalIncome - totalExpense
  const savingsRate = totalIncome > 0 ? Math.round(((totalIncome - totalExpense) / totalIncome) * 100) : 0
  const pieData = Object.entries(summary).map(([name, value]) => ({ name, value }))
  const recent = transactions.slice(0, 6)

  const weekData = useMemo(() => {
    const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    const totals = Object.fromEntries(DAYS.map((d) => [d, 0]))
    const now = new Date()
    const day = now.getDay()
    const diffToMon = day === 0 ? -6 : 1 - day
    const monday = new Date(now)
    monday.setDate(now.getDate() + diffToMon)
    monday.setHours(0, 0, 0, 0)
    transactions.filter((t) => t.type === 'expense').forEach((t) => {
      const d = new Date(t.date)
      if (d >= monday) {
        const dayIdx = d.getDay() === 0 ? 6 : d.getDay() - 1
        totals[DAYS[dayIdx]] += t.amount
      }
    })
    return DAYS.map((d) => ({ name: d, amount: totals[d] }))
  }, [transactions])

  const [expandChart, setExpandChart] = useState(null)

  return (
    <motion.div className="space-y-6 relative" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>

      {/* page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-100">Dashboard</h1>
          <p className="text-sm text-slate-500 mt-0.5">Your financial overview for {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold"
          style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', color: '#22C55E' }}>
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          Live
        </div>
      </div>

      {/* Stat Cards */}
      <motion.div className="grid grid-cols-2 xl:grid-cols-4 gap-4" initial="hidden" animate="visible" variants={stagger}>
        <motion.div variants={fadeUp}>
          <StatCard title="Total Balance" value={formatCurrency(balance)} icon={Wallet} color="primary" trend={12} />
        </motion.div>
        <motion.div variants={fadeUp}>
          <StatCard title="Monthly Spending" value={formatCurrency(totalExpense)} icon={TrendingDown} color="warning" />
        </motion.div>
        <motion.div variants={fadeUp}>
          <StatCard title="Savings Rate" value={`${savingsRate}%`} icon={PiggyBank} color="success" />
        </motion.div>
        <motion.div variants={fadeUp}>
          <StatCard title="Transactions" value={transactions.length} icon={Activity} color="secondary" />
        </motion.div>
      </motion.div>

      {/* Charts row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <GlassCard>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-semibold text-slate-200 text-sm">Spending This Week</h3>
              <p className="text-xs text-slate-500 mt-0.5">Daily expense breakdown</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 text-xs text-teal-400 bg-teal-500/10 px-2.5 py-1 rounded-full border border-teal-500/20">
                <TrendingUp size={11} />  Trending up
              </div>
              <ExpandButton onClick={() => setExpandChart('week')} />
            </div>
          </div>
          <SpendingAreaChart data={weekData} />
        </GlassCard>
        <GlassCard>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-semibold text-slate-200 text-sm">By Category</h3>
              <p className="text-xs text-slate-500 mt-0.5">Spending distribution</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-primary bg-primary/10 px-2.5 py-1 rounded-full border border-primary/20">This month</span>
              <ExpandButton onClick={() => setExpandChart('category')} />
            </div>
          </div>
          <CategoryPieChart data={pieData} />
        </GlassCard>
      </div>

      {/* Recent + AI Insight */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <GlassCard className="xl:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-semibold text-slate-200 text-sm">Recent Transactions</h3>
              <p className="text-xs text-slate-500 mt-0.5">{recent.length} latest entries</p>
            </div>
            <div className="h-px flex-1 mx-4" style={{ background: 'linear-gradient(90deg, rgba(99,102,241,0.3), transparent)' }} />
          </div>
          {loading ? (
            <div className="space-y-3 py-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-12 rounded-xl animate-pulse" style={{ background: 'rgba(255,255,255,0.04)' }} />
              ))}
            </div>
          ) : recent.length === 0 ? (
            <div className="text-center py-10">
              <div className="w-12 h-12 rounded-2xl mx-auto mb-3 flex items-center justify-center"
                style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)' }}>
                <Activity size={20} className="text-primary opacity-50" />
              </div>
              <p className="text-slate-500 text-sm">No transactions yet — add your first expense!</p>
            </div>
          ) : (
            <div className="space-y-1">
              {recent.map((t, i) => (
                <motion.div
                  key={t._id}
                  className="flex items-center justify-between py-3 px-3 rounded-xl hover:bg-white/4 transition-colors"
                  style={{ borderBottom: i < recent.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: t.type === 'income' ? 'rgba(34,197,94,0.12)' : 'rgba(244,63,94,0.12)' }}>
                      {t.type === 'income'
                        ? <ArrowUpRight size={14} className="text-green-400" />
                        : <ArrowDownRight size={14} className="text-red-400" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-200">{t.title}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Badge label={t.category} />
                        <p className="text-[10px] text-slate-600">{formatDate(t.date)}</p>
                      </div>
                    </div>
                  </div>
                  <span className={`text-sm font-bold tabular-nums ${t.type === 'income' ? 'text-green-400' : 'text-red-400'}`}>
                    {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                  </span>
                </motion.div>
              ))}
            </div>
          )}
        </GlassCard>

        <AIInsightCard month={month} />
      </div>

      <ChartModal open={expandChart === 'week'} onClose={() => setExpandChart(null)}
        title="Spending This Week" subtitle="Daily expense breakdown">
        <SpendingAreaChart data={weekData} height={380} />
      </ChartModal>
      <ChartModal open={expandChart === 'category'} onClose={() => setExpandChart(null)}
        title="Spending by Category" subtitle="This month's distribution">
        <CategoryPieChart data={pieData} height={420} />
      </ChartModal>
    </motion.div>
  )
}
