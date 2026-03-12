import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Trash2, Target, PlusCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import GlassCard from '../components/ui/GlassCard'
import ProgressBar from '../components/ui/ProgressBar'
import AIInsightCard from '../components/ai/AIInsightCard'
import useBudgetStore from '../store/useBudgetStore'
import { formatCurrency } from '../utils/formatCurrency'
import { formatDate, currentMonth } from '../utils/formatDate'

const emptyForm = { name: '', targetAmount: '', savedAmount: '', targetDate: '' }

export default function SavingsGoals() {
  const { goals, loading, loadGoals, addGoal, updateGoalProgress, removeGoal } = useBudgetStore()
  const [form, setForm] = useState(emptyForm)
  const [addFunds, setAddFunds] = useState({})
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    loadGoals()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await addGoal({
        name: form.name,
        targetAmount: parseFloat(form.targetAmount),
        savedAmount: parseFloat(form.savedAmount) || 0,
        targetDate: form.targetDate || undefined,
      })
      setForm(emptyForm)
      toast.success('Goal created!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create goal')
    } finally {
      setSubmitting(false)
    }
  }

  const handleAddFunds = async (goal) => {
    const amount = parseFloat(addFunds[goal._id] || 0)
    if (!amount || amount <= 0) return
    try {
      await updateGoalProgress(goal._id, Math.min(goal.savedAmount + amount, goal.targetAmount))
      setAddFunds((f) => ({ ...f, [goal._id]: '' }))
      toast.success('Progress updated!')
    } catch {
      toast.error('Failed to update')
    }
  }

  const handleDelete = async (id) => {
    try {
      await removeGoal(id)
      toast.success('Goal removed')
    } catch {
      toast.error('Failed to remove')
    }
  }

  return (
    <motion.div className="space-y-6" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Add goal form */}
        <div className="space-y-4">
          <GlassCard>
            <h3 className="font-semibold text-slate-200 mb-5 text-sm uppercase tracking-wide">New Goal</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Goal Name</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="input-field"
                  placeholder="e.g. Emergency Fund"
                  required
                />
              </div>
              <div>
                <label className="label">Target Amount ($)</label>
                <input
                  type="number"
                  min="1"
                  value={form.targetAmount}
                  onChange={(e) => setForm({ ...form, targetAmount: e.target.value })}
                  className="input-field"
                  placeholder="e.g. 5000"
                  required
                />
              </div>
              <div>
                <label className="label">Already Saved ($)</label>
                <input
                  type="number"
                  min="0"
                  value={form.savedAmount}
                  onChange={(e) => setForm({ ...form, savedAmount: e.target.value })}
                  className="input-field"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="label">Target Date (optional)</label>
                <input
                  type="date"
                  value={form.targetDate}
                  onChange={(e) => setForm({ ...form, targetDate: e.target.value })}
                  className="input-field"
                />
              </div>
              <button type="submit" disabled={submitting} className="btn-primary w-full justify-center py-3">
                <Plus size={16} /> {submitting ? 'Creating...' : 'Create Goal'}
              </button>
            </form>
          </GlassCard>

          <AIInsightCard month={currentMonth()} />
        </div>

        {/* Goals list */}
        <div className="xl:col-span-2">
          {loading ? (
            <GlassCard><p className="text-slate-500 text-sm">Loading...</p></GlassCard>
          ) : goals.length === 0 ? (
            <GlassCard className="flex flex-col items-center justify-center py-16 text-center">
              <Target size={40} className="text-slate-600 mb-4" />
              <p className="text-slate-400 font-medium">No goals yet</p>
              <p className="text-slate-600 text-sm mt-1">Create your first savings goal to get started</p>
            </GlassCard>
          ) : (
            <div className="space-y-4">
              {goals.map((goal, i) => {
                const pct = goal.targetAmount > 0 ? Math.min((goal.savedAmount / goal.targetAmount) * 100, 100) : 0
                const remaining = goal.targetAmount - goal.savedAmount
                const isComplete = pct >= 100

                return (
                  <motion.div
                    key={goal._id}
                    className="glass-card p-5"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-slate-100">{goal.name}</h4>
                          {isComplete && (
                            <span className="text-xs bg-success/15 text-success border border-success/20 px-2 py-0.5 rounded-full font-semibold">
                              Complete! 🎉
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {goal.targetDate ? `Target: ${formatDate(goal.targetDate)}` : 'No deadline set'}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDelete(goal._id)}
                        className="text-slate-600 hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-slate-500">
                        {formatCurrency(goal.savedAmount)} saved of {formatCurrency(goal.targetAmount)}
                      </span>
                      <span className="text-xs font-bold text-primary">{Math.round(pct)}%</span>
                    </div>
                    <ProgressBar value={goal.savedAmount} max={goal.targetAmount} showLabel={false} color="secondary" />

                    {!isComplete && (
                      <div className="flex items-center gap-2 mt-4">
                        <input
                          type="number"
                          min="0"
                          value={addFunds[goal._id] || ''}
                          onChange={(e) => setAddFunds((f) => ({ ...f, [goal._id]: e.target.value }))}
                          className="input-field py-2 text-sm flex-1"
                          placeholder={`Add funds (${formatCurrency(remaining)} remaining)`}
                        />
                        <button
                          onClick={() => handleAddFunds(goal)}
                          className="btn-primary py-2 px-4 text-sm rounded-xl flex-shrink-0"
                        >
                          <PlusCircle size={14} /> Add
                        </button>
                      </div>
                    )}
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
