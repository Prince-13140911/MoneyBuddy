import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Trash2, TrendingUp, TrendingDown } from 'lucide-react'
import toast from 'react-hot-toast'
import GlassCard from '../components/ui/GlassCard'
import Badge from '../components/ui/Badge'
import CategoryPieChart from '../components/charts/CategoryPieChart'
import useExpenseStore from '../store/useExpenseStore'
import { formatCurrency } from '../utils/formatCurrency'
import { formatDate, currentMonth } from '../utils/formatDate'

const CATEGORIES = ['Food', 'Transport', 'Entertainment', 'Shopping', 'Bills', 'Other']
const month = currentMonth()

const emptyForm = { title: '', amount: '', type: 'expense', category: 'Food', date: new Date().toISOString().slice(0, 10) }

export default function ExpenseTracker() {
  const { transactions, summary, loading, loadTransactions, loadSummary, addTransaction, removeTransaction } = useExpenseStore()
  const [form, setForm] = useState(emptyForm)
  const [submitting, setSubmitting] = useState(false)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    loadTransactions({ month })
    loadSummary({ month })
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title || !form.amount) return
    setSubmitting(true)
    try {
      await addTransaction({ ...form, amount: parseFloat(form.amount) })
      await loadSummary({ month })
      setForm(emptyForm)
      toast.success('Transaction added!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add transaction')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await removeTransaction(id)
      await loadSummary({ month })
      toast.success('Deleted')
    } catch {
      toast.error('Failed to delete')
    }
  }

  const pieData = Object.entries(summary).map(([name, value]) => ({ name, value }))
  const filtered = filter === 'all' ? transactions : transactions.filter((t) => t.type === filter)

  return (
    <motion.div className="space-y-6" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Add Form */}
        <GlassCard>
          <h3 className="font-semibold text-slate-200 mb-5 text-sm uppercase tracking-wide">Add Transaction</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Title</label>
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="input-field"
                placeholder="e.g. Lunch, Salary..."
                required
              />
            </div>
            <div>
              <label className="label">Amount ($)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                className="input-field"
                placeholder="0.00"
                required
              />
            </div>
            <div>
              <label className="label">Type</label>
              <div className="flex gap-2">
                {['expense', 'income'].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setForm({ ...form, type: t })}
                    className={`flex-1 py-2 rounded-xl text-sm font-semibold border transition-all duration-200 flex items-center justify-center gap-1.5 ${
                      form.type === t
                        ? t === 'expense'
                          ? 'bg-red-500/15 border-red-500/30 text-red-400'
                          : 'bg-success/15 border-success/30 text-success'
                        : 'border-slate-700 text-slate-500 hover:border-slate-600'
                    }`}
                  >
                    {t === 'expense' ? <TrendingDown size={14} /> : <TrendingUp size={14} />}
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="label">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="input-field"
              >
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Date</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="input-field"
              />
            </div>
            <button type="submit" disabled={submitting} className="btn-primary w-full justify-center py-3">
              <Plus size={16} /> {submitting ? 'Adding...' : 'Add Transaction'}
            </button>
          </form>
        </GlassCard>

        {/* List + Chart */}
        <div className="xl:col-span-2 space-y-6">
          {/* Category chart */}
          <GlassCard>
            <h3 className="font-semibold text-slate-200 mb-4 text-sm uppercase tracking-wide">Spending by Category</h3>
            <CategoryPieChart data={pieData} />
          </GlassCard>

          {/* Transactions list */}
          <GlassCard>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-200 text-sm uppercase tracking-wide">Transactions</h3>
              <div className="flex gap-1.5">
                {['all', 'expense', 'income'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${
                      filter === f ? 'bg-primary/15 text-primary border border-primary/20' : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <p className="text-slate-500 text-sm">Loading...</p>
            ) : filtered.length === 0 ? (
              <p className="text-slate-500 text-sm py-6 text-center">No transactions found</p>
            ) : (
              <div className="space-y-1 max-h-80 overflow-y-auto">
                {filtered.map((t) => (
                  <div
                    key={t._id}
                    className="flex items-center justify-between py-3 px-2 border-b border-white/5 last:border-0 group hover:bg-white/2 rounded-xl transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Badge label={t.category} />
                      <div>
                        <p className="text-sm font-medium text-slate-200">{t.title}</p>
                        <p className="text-xs text-slate-500">{formatDate(t.date)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-sm font-bold ${t.type === 'income' ? 'text-success' : 'text-red-400'}`}>
                        {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                      </span>
                      <button
                        onClick={() => handleDelete(t._id)}
                        className="opacity-0 group-hover:opacity-100 text-slate-600 hover:text-red-400 transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </GlassCard>
        </div>
      </div>
    </motion.div>
  )
}
