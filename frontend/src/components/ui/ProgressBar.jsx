import { motion } from 'framer-motion'

const colorMap = {
  primary: '#6366F1',
  secondary: '#14B8A6',
  success: '#22C55E',
  warning: '#F59E0B',
  danger: '#EF4444',
}

export default function ProgressBar({ value, max, color = 'primary', showLabel = true, className = '' }) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0

  return (
    <div className={`w-full ${className}`}>
      <div className="w-full bg-slate-800/80 rounded-full h-2 overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: colorMap[color] || colorMap.primary }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
      {showLabel && (
        <p className="text-xs text-slate-500 mt-1 text-right">{Math.round(pct)}%</p>
      )}
    </div>
  )
}
