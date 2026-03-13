import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Save, IndianRupee } from 'lucide-react'
import toast from 'react-hot-toast'
import GlassCard from '../components/ui/GlassCard'
import ProgressBar from '../components/ui/ProgressBar'
import BudgetBarChart from '../components/charts/BudgetBarChart'
import useBudgetStore from '../store/useBudgetStore'
import useExpenseStore from '../store/useExpenseStore'
import { formatCurrency } from '../utils/formatCurrency'
import { currentMonth } from '../utils/formatDate'

const CATEGORIES = ['Food', 'Transport', 'Entertainment', 'Shopping', 'Bills', 'Other']
const month = currentMonth()

export default function BudgetPlanner() {
  const { budget, loadBudget, upsertBudget } = useBudgetStore()
  const { summary, loadSummary } = useExpenseStore()

  const [income, setIncome] = useState('')
  const [limits, setLimits] = useState(
    Object.fromEntries(CATEGORIES.map((c) => [c, '']))
  )
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadBudget(month)
    loadSummary({ month })
  }, [])

  useEffect(() => {
    if (budget) {
      setIncome(budget.income || '')
      const existingLimits = Object.fromEntries(CATEGORIES.map((c) => [c, '']))
      if (budget.limits) {
        Object.entries(budget.limits).forEach(([k, v]) => {
          if (existingLimits.hasOwnProperty(k)) existingLimits[k] = v
        })
      }
      setLimits(existingLimits)
    }
  }, [budget])

  const handleSave = async () => {
    setSaving(true)
    try {
      const cleanLimits = Object.fromEntries(
        Object.entries(limits).filter(([, v]) => v !== '' && parseFloat(v) > 0).map(([k, v]) => [k, parseFloat(v)])
      )
      await upsertBudget({ month, income: parseFloat(income) || 0, limits: cleanLimits })
      toast.success('Budget saved!')
    } catch {
      toast.error('Failed to save budget')
    } finally {
      setSaving(false)
    }
  }

  const chartData = CATEGORIES.filter((c) => limits[c] && parseFloat(limits[c]) > 0).map((c) => ({
    category: c,
    budget: parseFloat(limits[c]) || 0,
    spent: summary[c] || 0,
  }))

  const totalBudgeted = Object.values(limits).reduce((s, v) => s + (parseFloat(v) || 0), 0)
  const totalSpent = Object.values(summary).reduce((s, v) => s + v, 0)

  return (
    <motion.div className="space-y-6" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Setup form */}
        <GlassCard>
          <h3 className="font-semibold text-slate-200 mb-5 text-sm uppercase tracking-wide">Set Budget</h3>
          <div className="space-y-4">
            <div>
              <label className="label">Monthly Income</label>
              <div className="relative">
                <IndianRupee size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="number"
                  min="0"
                  value={income}
                  onChange={(e) => setIncome(e.target.value)}
                  className="input-field pl-8"
                  placeholder="e.g. 30000"
                />
              </div>
            </div>

            <div className="border-t border-white/5 pt-4">
              <p className="label mb-3">Spending Limits by Category</p>
              <div className="space-y-3">
                {CATEGORIES.map((cat) => (
                  <div key={cat} className="flex items-center gap-3">
                    <span className="text-xs text-slate-400 w-28 flex-shrink-0">{cat}</span>
                    <div className="relative flex-1">
                      <IndianRupee size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        type="number"
                        min="0"
                        value={limits[cat]}
                        onChange={(e) => setLimits({ ...limits, [cat]: e.target.value })}
                        className="input-field pl-7 py-2 text-sm"
                        placeholder="0"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button onClick={handleSave} disabled={saving} className="btn-primary w-full justify-center py-3">
              <Save size={15} /> {saving ? 'Saving...' : 'Save Budget'}
            </button>
          </div>
        </GlassCard>

        {/* Chart + progress */}
        <div className="xl:col-span-2 space-y-6">
          {/* Overview cards */}
          <div className="grid grid-cols-3 gap-4">
            <GlassCard className="p-4">
              <p className="text-xs text-slate-500 uppercase tracking-wide">Monthly Income</p>
              <p className="text-xl font-bold text-slate-100 mt-1">{formatCurrency(parseFloat(income) || 0)}</p>
            </GlassCard>
            <GlassCard className="p-4">
              <p className="text-xs text-slate-500 uppercase tracking-wide">Total Budgeted</p>
              <p className="text-xl font-bold text-primary mt-1">{formatCurrency(totalBudgeted)}</p>
            </GlassCard>
            <GlassCard className="p-4">
              <p className="text-xs text-slate-500 uppercase tracking-wide">Total Spent</p>
              <p className={`text-xl font-bold mt-1 ${totalSpent > totalBudgeted ? 'text-red-400' : 'text-success'}`}>
                {formatCurrency(totalSpent)}
              </p>
            </GlassCard>
          </div>

          {/* Bar chart */}
          <GlassCard>
            <h3 className="font-semibold text-slate-200 mb-4 text-sm uppercase tracking-wide">Budget vs Actual</h3>
            <BudgetBarChart data={chartData} />
          </GlassCard>

          {/* Progress bars */}
          <GlassCard>
            <h3 className="font-semibold text-slate-200 mb-5 text-sm uppercase tracking-wide">Category Progress</h3>
            <div className="space-y-4">
              {CATEGORIES.filter((c) => limits[c] && parseFloat(limits[c]) > 0).map((cat) => {
                const lim = parseFloat(limits[cat]) || 0
                const spent = summary[cat] || 0
                return (
                  <div key={cat}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-medium text-slate-300">{cat}</span>
                      <span className="text-xs text-slate-500">
                        {formatCurrency(spent)} / {formatCurrency(lim)}
                      </span>
                    </div>
                    <ProgressBar value={spent} max={lim} showLabel={false} />
                  </div>
                )
              })}
              {chartData.length === 0 && (
                <p className="text-slate-500 text-sm py-2">Set category limits above to see progress</p>
              )}
            </div>
          </GlassCard>
        </div>
      </div>
    </motion.div>
  )
}
