import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Wallet, TrendingDown, PiggyBank, Activity } from 'lucide-react'
import StatCard from '../components/ui/StatCard'
import GlassCard from '../components/ui/GlassCard'
import SpendingAreaChart from '../components/charts/SpendingAreaChart'
import CategoryPieChart from '../components/charts/CategoryPieChart'
import AIInsightCard from '../components/ai/AIInsightCard'
import AIChatWidget from '../components/ai/AIChatWidget'
import Badge from '../components/ui/Badge'
import useExpenseStore from '../store/useExpenseStore'
import { formatCurrency } from '../utils/formatCurrency'
import { formatDate, currentMonth } from '../utils/formatDate'

const WEEK_MOCK = [
  { name: 'Mon', amount: 45 },
  { name: 'Tue', amount: 120 },
  { name: 'Wed', amount: 30 },
  { name: 'Thu', amount: 85 },
  { name: 'Fri', amount: 160 },
  { name: 'Sat', amount: 220 },
  { name: 'Sun', amount: 70 },
]

const month = currentMonth()

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

  return (
    <motion.div className="space-y-6" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      {/* Stat Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard title="Total Balance" value={formatCurrency(balance)} icon={Wallet} color="primary" trend={12} />
        <StatCard title="Monthly Spending" value={formatCurrency(totalExpense)} icon={TrendingDown} color="warning" />
        <StatCard title="Savings Rate" value={`${savingsRate}%`} icon={PiggyBank} color="success" />
        <StatCard title="Transactions" value={transactions.length} icon={Activity} color="secondary" />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <GlassCard>
          <h3 className="font-semibold text-slate-200 mb-4 text-sm uppercase tracking-wide">Spending This Week</h3>
          <SpendingAreaChart data={WEEK_MOCK} />
        </GlassCard>
        <GlassCard>
          <h3 className="font-semibold text-slate-200 mb-4 text-sm uppercase tracking-wide">By Category</h3>
          <CategoryPieChart data={pieData} />
        </GlassCard>
      </div>

      {/* Recent + AI Insight */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <GlassCard className="xl:col-span-2">
          <h3 className="font-semibold text-slate-200 mb-4 text-sm uppercase tracking-wide">Recent Transactions</h3>
          {loading ? (
            <p className="text-slate-500 text-sm">Loading...</p>
          ) : recent.length === 0 ? (
            <p className="text-slate-500 text-sm py-4 text-center">No transactions yet — add your first expense!</p>
          ) : (
            <div className="space-y-1">
              {recent.map((t) => (
                <div
                  key={t._id}
                  className="flex items-center justify-between py-3 px-1 border-b border-white/5 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <Badge label={t.category} />
                    <div>
                      <p className="text-sm font-medium text-slate-200">{t.title}</p>
                      <p className="text-xs text-slate-500">{formatDate(t.date)}</p>
                    </div>
                  </div>
                  <span className={`text-sm font-bold ${t.type === 'income' ? 'text-success' : 'text-red-400'}`}>
                    {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </GlassCard>

        <AIInsightCard month={month} />
      </div>

      <AIChatWidget />
    </motion.div>
  )
}
