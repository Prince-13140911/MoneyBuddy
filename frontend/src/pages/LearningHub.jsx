import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  BookOpen,
  Wallet,
  Shield,
  LineChart,
  Landmark,
  PiggyBank,
  ShoppingBag,
  Lightbulb,
  ArrowRight,
} from 'lucide-react'
import GlassCard from '../components/ui/GlassCard'

const TOPICS = [
  {
    id: 'budgeting-basics',
    title: 'Budgeting Basics',
    icon: Wallet,
    level: 'Beginner',
    summary: 'Learn the 50-30-20 framework and how to split your income with clarity.',
    explanation: 'Budgeting is the process of assigning every rupee a job before you spend it. Start with needs, then goals, then wants.',
    example: 'If your monthly income is 30000, you can set 15000 for needs, 6000 for savings/investments, and 9000 for wants.',
    tips: ['Track expenses weekly, not only monthly.', 'Create spending caps for top 3 categories.', 'Automate savings on salary day.'],
  },
  {
    id: 'emergency-fund-guide',
    title: 'Emergency Fund Guide',
    icon: Shield,
    level: 'Beginner',
    summary: 'Build a safety buffer for job loss, medical events, and urgent repairs.',
    explanation: 'Emergency funds are liquid savings kept only for true emergencies. This protects your goals from being interrupted.',
    example: 'If monthly essentials are 20000, start with a 60000 target for 3 months of coverage.',
    tips: ['Keep this amount in a separate account.', 'Refill after every emergency withdrawal.', 'Start with a mini-goal of 10000 first.'],
  },
  {
    id: 'sip-basics',
    title: 'How SIP Works',
    icon: LineChart,
    level: 'Beginner',
    summary: 'Understand systematic investing and compounding with simple monthly contributions.',
    explanation: 'SIP invests a fixed amount monthly in mutual funds. This builds discipline and averages market volatility over time.',
    example: 'A 2000 monthly SIP over years can grow significantly due to compounding.',
    tips: ['Start small and increase yearly.', 'Stay consistent during market dips.', 'Link SIP date with income credit date.'],
  },
  {
    id: 'mutual-funds-intro',
    title: 'Introduction to Mutual Funds',
    icon: Landmark,
    level: 'Beginner',
    summary: 'Know debt, equity, and hybrid funds and where each may fit your goals.',
    explanation: 'Mutual funds pool investor money and allocate it across assets. Fund type should match your time horizon and risk level.',
    example: 'Short-term goals may prefer lower-risk funds, while long-term wealth goals may use equity-oriented funds.',
    tips: ['Check expense ratio and consistency.', 'Avoid chasing only recent high returns.', 'Diversify across asset types.'],
  },
  {
    id: 'smart-saving-tips',
    title: 'Smart Saving Tips',
    icon: PiggyBank,
    level: 'Beginner',
    summary: 'Use small habit changes that improve monthly savings without stress.',
    explanation: 'Saving works best when you remove daily friction. Automations and simple rules create long-term consistency.',
    example: 'Reducing one food delivery order per week can free meaningful monthly cash for goals.',
    tips: ['Use no-spend days each week.', 'Set category alerts for overspending.', 'Round up transfers to savings automatically.'],
  },
  {
    id: 'avoid-impulse-spending',
    title: 'Avoiding Impulse Spending',
    icon: ShoppingBag,
    level: 'Beginner',
    summary: 'Control unplanned purchases with practical pause-and-prioritize methods.',
    explanation: 'Impulse spending often comes from convenience and emotion. Delayed decisions improve purchase quality.',
    example: 'Apply a 24-hour delay for non-essential buys and compare with your monthly budget before checkout.',
    tips: ['Unsubscribe from sale notifications.', 'Keep a wish list and review weekly.', 'Use a spending cap for entertainment/shopping.'],
  },
]

export default function LearningHub() {
  const [query, setQuery] = useState('')
  const [activeId, setActiveId] = useState(TOPICS[0].id)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return TOPICS
    return TOPICS.filter((t) =>
      [t.title, t.summary, t.explanation, ...t.tips].join(' ').toLowerCase().includes(q)
    )
  }, [query])

  const activeTopic = useMemo(() => {
    const insideFiltered = filtered.find((t) => t.id === activeId)
    return insideFiltered || filtered[0] || null
  }, [filtered, activeId])

  return (
    <motion.div className="space-y-6" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-100">Learning Hub</h1>
          <p className="text-sm text-slate-500 mt-0.5">Interactive personal finance lessons for beginners and young earners</p>
        </div>
        <div className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-full border border-fuchsia-500/25 bg-fuchsia-500/10 text-fuchsia-300">
          <BookOpen size={12} /> AI-guided education
        </div>
      </div>

      <GlassCard>
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search topics: budgeting, emergency fund, SIP, mutual funds..."
            className="input-field pl-10"
          />
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-1 space-y-3">
          {filtered.map((topic) => {
            const Icon = topic.icon
            const active = activeTopic?.id === topic.id
            return (
              <motion.button
                key={topic.id}
                whileHover={{ y: -2 }}
                onClick={() => setActiveId(topic.id)}
                className={`w-full text-left rounded-2xl p-4 border transition-all ${
                  active
                    ? 'border-cyan-400/35 bg-cyan-500/10'
                    : 'border-white/10 bg-white/5 hover:border-cyan-500/25 hover:bg-white/10'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-400/25 flex items-center justify-center">
                    <Icon size={16} className="text-cyan-200" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-200">{topic.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{topic.summary}</p>
                    <div className="flex items-center gap-2 mt-2 text-[10px] uppercase tracking-wide text-slate-500">
                      <span>{topic.level}</span>
                      <ArrowRight size={10} />
                      <span>Open Guide</span>
                    </div>
                  </div>
                </div>
              </motion.button>
            )
          })}
          {filtered.length === 0 && (
            <GlassCard className="p-4">
              <p className="text-sm text-slate-400">No topic found. Try a broader keyword.</p>
            </GlassCard>
          )}
        </div>

        <div className="xl:col-span-2">
          <AnimatePresence mode="wait">
            {activeTopic ? (
              <motion.div
                key={activeTopic.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
              >
                <GlassCard>
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-11 h-11 rounded-xl bg-violet-500/20 border border-violet-400/25 flex items-center justify-center">
                      <activeTopic.icon size={20} className="text-violet-200" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-100">{activeTopic.title}</h3>
                      <p className="text-sm text-slate-400 mt-0.5">{activeTopic.summary}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                      <p className="text-xs uppercase tracking-wide text-slate-500 mb-2">Simple Explanation</p>
                      <p className="text-sm text-slate-300">{activeTopic.explanation}</p>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                      <p className="text-xs uppercase tracking-wide text-slate-500 mb-2">Real-life Example</p>
                      <p className="text-sm text-slate-300">{activeTopic.example}</p>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                      <p className="text-xs uppercase tracking-wide text-slate-500 mb-3">Visual Illustration</p>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="rounded-lg p-3 border border-cyan-500/20 bg-cyan-500/10">
                          <p className="text-[10px] uppercase tracking-wide text-slate-500">Understand</p>
                          <p className="text-sm font-semibold text-cyan-200 mt-1">Learn the concept</p>
                        </div>
                        <div className="rounded-lg p-3 border border-violet-500/20 bg-violet-500/10">
                          <p className="text-[10px] uppercase tracking-wide text-slate-500">Apply</p>
                          <p className="text-sm font-semibold text-violet-200 mt-1">Use it in your budget</p>
                        </div>
                        <div className="rounded-lg p-3 border border-emerald-500/20 bg-emerald-500/10">
                          <p className="text-[10px] uppercase tracking-wide text-slate-500">Improve</p>
                          <p className="text-sm font-semibold text-emerald-200 mt-1">Track progress weekly</p>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Lightbulb size={14} className="text-amber-300" />
                        <p className="text-xs uppercase tracking-wide text-slate-500">Quick Tips</p>
                      </div>
                      <div className="space-y-2">
                        {activeTopic.tips.map((tip) => (
                          <div key={tip} className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-slate-300">
                            {tip}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ) : (
              <GlassCard>
                <p className="text-sm text-slate-400">Pick a topic to view the learning guide.</p>
              </GlassCard>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}
