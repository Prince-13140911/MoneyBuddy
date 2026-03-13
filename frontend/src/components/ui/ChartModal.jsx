import { motion, AnimatePresence } from 'framer-motion'
import { X, Maximize2 } from 'lucide-react'

export function ExpandButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-500 hover:text-primary hover:bg-primary/10 transition-all"
      title="Expand chart"
    >
      <Maximize2 size={13} />
    </button>
  )
}

export default function ChartModal({ open, onClose, title, subtitle, children }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8"
          style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.93, opacity: 0, y: 16 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.93, opacity: 0, y: 16 }}
            transition={{ type: 'spring', damping: 26, stiffness: 320 }}
            className="w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4"
              style={{ borderBottom: '1px solid var(--divider)' }}>
              <div>
                <h2 className="font-bold text-base" style={{ color: 'var(--body-text)' }}>{title}</h2>
                {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-200 hover:bg-white/10 transition-all"
              >
                <X size={16} />
              </button>
            </div>

            {/* Chart area — white in light, dark in dark */}
            <div className="p-6" style={{ background: 'var(--surface)', minHeight: '360px' }}>
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
