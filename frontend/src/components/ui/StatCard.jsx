import { motion } from 'framer-motion'
import GlassCard from './GlassCard'
import { TrendingUp, TrendingDown } from 'lucide-react'

const colorMap = {
  primary:   { icon: 'text-primary',   bg: 'rgba(99,102,241,0.12)',  glow: 'rgba(99,102,241,0.25)',  border: 'rgba(99,102,241,0.3)',  top: '#6366F1' },
  secondary: { icon: 'text-secondary', bg: 'rgba(20,184,166,0.12)',  glow: 'rgba(20,184,166,0.25)',  border: 'rgba(20,184,166,0.3)',  top: '#14B8A6' },
  success:   { icon: 'text-success',   bg: 'rgba(34,197,94,0.12)',   glow: 'rgba(34,197,94,0.25)',   border: 'rgba(34,197,94,0.3)',   top: '#22C55E' },
  warning:   { icon: 'text-amber-400', bg: 'rgba(245,158,11,0.12)',  glow: 'rgba(245,158,11,0.25)',  border: 'rgba(245,158,11,0.3)',  top: '#F59E0B' },
}

export default function StatCard({ title, value, subtitle, icon: Icon, color = 'primary', trend }) {
  const cfg = colorMap[color] || colorMap.primary

  return (
    <GlassCard hover className="flex flex-col gap-3 relative overflow-hidden !p-5">
      {/* top gradient accent bar */}
      <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl"
        style={{ background: `linear-gradient(90deg, ${cfg.top}, transparent)` }} />

      <div className="flex items-start justify-between">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</p>
        {Icon && (
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: cfg.bg, border: `1px solid ${cfg.border}`, boxShadow: `0 0 16px ${cfg.glow}` }}>
            <Icon size={17} className={cfg.icon} />
          </div>
        )}
      </div>

      <motion.p
        className="text-2xl font-bold text-slate-100 truncate"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {value}
      </motion.p>

      {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
      {trend !== undefined && (
        <div className={`flex items-center gap-1 text-xs font-semibold ${trend >= 0 ? 'text-green-400' : 'text-red-400'}`}>
          {trend >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {Math.abs(trend)}% vs last month
        </div>
      )}
    </GlassCard>
  )
}
