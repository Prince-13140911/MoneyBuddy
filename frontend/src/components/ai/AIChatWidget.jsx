import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bot, X, Send, Zap } from 'lucide-react'
import { sendChatMessage } from '../../services/aiService'

const SUGGESTIONS = [
  'Can I afford a new laptop?',
  'Where am I overspending?',
  'How much should I save this month?',
  'Give me 3 money-saving tips',
]

export default function AIChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hi! I'm FinPilot AI 👋 Ask me anything about your finances!" },
  ])
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
        { role: 'assistant', content: 'AI unavailable right now. Make sure OPENAI_API_KEY is set in backend .env' },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 16 }}
            transition={{ duration: 0.2 }}
            className="glass-card w-80 flex flex-col mb-4 border border-primary/25 overflow-hidden"
            style={{ height: '420px' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-gradient-to-r from-primary/10 to-secondary/10">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <Zap size={13} className="text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold gradient-text leading-none">FinPilot AI</p>
                  <p className="text-xs text-green-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" /> Online
                  </p>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-slate-200 transition-colors">
                <X size={16} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`text-xs rounded-2xl px-3 py-2 max-w-[85%] leading-relaxed ${
                      m.role === 'user'
                        ? 'bg-gradient-to-r from-primary to-secondary text-white rounded-br-sm'
                        : 'bg-slate-800 text-slate-300 rounded-bl-sm'
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-slate-800 text-slate-400 text-xs rounded-2xl rounded-bl-sm px-3 py-2">
                    <span className="flex gap-1">
                      <span className="animate-bounce">·</span>
                      <span className="animate-bounce" style={{ animationDelay: '0.1s' }}>·</span>
                      <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>·</span>
                    </span>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Suggestions */}
            {messages.length === 1 && (
              <div className="px-3 pb-2 flex flex-wrap gap-1.5">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="text-xs bg-primary/10 border border-primary/20 text-primary px-2.5 py-1 rounded-full hover:bg-primary/20 transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="px-3 py-3 border-t border-white/5 flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && send()}
                placeholder="Ask anything..."
                className="input-field text-xs py-2 flex-1"
              />
              <button
                onClick={() => send()}
                disabled={loading || !input.trim()}
                className="btn-primary px-3 py-2 text-xs rounded-xl"
              >
                <Send size={13} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setOpen(!open)}
        className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-xl shadow-primary/30"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
              <X size={22} className="text-white" />
            </motion.div>
          ) : (
            <motion.div key="bot" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
              <Bot size={22} className="text-white" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  )
}
