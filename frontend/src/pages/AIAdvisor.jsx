import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Bot, Zap, Sparkles } from 'lucide-react'
import { sendChatMessage } from '../services/aiService'

const SUGGESTIONS = [
  'Can I afford a new laptop this month?',
  'Where am I overspending?',
  'How much should I save this month?',
  'Give me 3 tips to cut my expenses',
  'What percentage of my income should go to food?',
  'Am I on track with my savings?',
]

const initialMessages = [
  {
    role: 'assistant',
    content: "Hi! I'm FinPilot AI, your personal financial co-pilot 🚀 I can analyze your spending, answer budgeting questions, and help you make smarter financial decisions. What would you like to know?",
  },
]

export default function AIAdvisor() {
  const [messages, setMessages] = useState(initialMessages)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = async (text) => {
    const msg = text || input
    if (!msg.trim() || loading) return
    setInput('')
    setMessages((m) => [...m, { role: 'user', content: msg }])
    setLoading(true)
    try {
      const res = await sendChatMessage(msg)
      setMessages((m) => [...m, { role: 'assistant', content: res.data.data }])
    } catch {
      setMessages((m) => [
        ...m,
        {
          role: 'assistant',
          content: '⚠️ AI is currently unavailable. Make sure OPENAI_API_KEY is configured in your backend .env file.',
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      className="flex flex-col h-[calc(100vh-140px)]"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Header */}
      <div className="glass-card p-5 mb-4 flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/25">
          <Zap size={22} className="text-white" />
        </div>
        <div>
          <h2 className="font-bold text-slate-100 flex items-center gap-2">
            FinPilot AI <Sparkles size={14} className="text-secondary" />
          </h2>
          <p className="text-xs text-slate-500">Powered by GPT-4 · Analyzes your real spending data</p>
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
          <span className="text-xs text-success font-medium">Online</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 glass-card p-4 overflow-y-auto mb-4 space-y-4">
        {messages.map((m, i) => (
          <motion.div
            key={i}
            className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
          >
            {m.role === 'assistant' && (
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Bot size={14} className="text-primary" />
              </div>
            )}
            <div
              className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                m.role === 'user'
                  ? 'bg-gradient-to-r from-primary to-secondary text-white rounded-tr-sm'
                  : 'bg-slate-800/70 text-slate-200 rounded-tl-sm border border-white/5'
              }`}
            >
              {m.content}
            </div>
          </motion.div>
        ))}

        {loading && (
          <motion.div className="flex gap-3 justify-start" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/20 flex items-center justify-center flex-shrink-0">
              <Bot size={14} className="text-primary animate-pulse" />
            </div>
            <div className="bg-slate-800/70 border border-white/5 px-4 py-3 rounded-2xl rounded-tl-sm">
              <span className="flex gap-1 items-center">
                <span className="text-slate-400 text-sm">Thinking</span>
                {[0, 1, 2].map((j) => (
                  <span key={j} className="w-1 h-1 rounded-full bg-primary animate-bounce" style={{ animationDelay: `${j * 0.15}s` }} />
                ))}
              </span>
            </div>
          </motion.div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Suggestions */}
      {messages.length <= 1 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => send(s)}
              className="text-xs bg-primary/8 border border-primary/20 text-primary px-3 py-1.5 rounded-full hover:bg-primary/15 transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="glass-card p-3 flex gap-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send()}
          placeholder="Ask anything about your finances..."
          className="input-field flex-1"
        />
        <button
          onClick={() => send()}
          disabled={loading || !input.trim()}
          className="btn-primary px-5 py-3 rounded-xl flex-shrink-0"
        >
          <Send size={16} />
        </button>
      </div>
    </motion.div>
  )
}
