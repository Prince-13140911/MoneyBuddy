import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Bot } from 'lucide-react'
import { fetchInsights } from '../../services/aiService'

export default function AIInsightCard({ month }) {
  const [insight, setInsight] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const res = await fetchInsights({ month })
        setInsight(res.data.data)
      } catch {
        setInsight('Add your OpenAI API key to get personalized AI insights based on your real spending data.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [month])

  return (
    <motion.div
      className="glass-card p-5 h-full border border-primary/20"
      style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.05) 0%, rgba(20,184,166,0.05) 100%)' }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-md shadow-primary/20">
          <Sparkles size={14} className="text-white" />
        </div>
        <span className="text-sm font-bold gradient-text">AI Insight</span>
      </div>
      {loading ? (
        <div className="flex items-center gap-2 text-slate-400 text-sm">
          <Bot size={14} className="animate-pulse text-primary" />
          <span>Analyzing your spending...</span>
        </div>
      ) : (
        <p className="text-sm text-slate-300 leading-relaxed">{insight}</p>
      )}
    </motion.div>
  )
}
