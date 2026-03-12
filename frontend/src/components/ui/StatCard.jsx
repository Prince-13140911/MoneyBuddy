import { motion } from 'framer-motion'
import GlassCard from './GlassCard'

const colorMap = {
  primary: { icon: 'text-primary bg-primary/10', trend: '' },
  secondary: { icon: 'text-secondary bg-secondary/10', trend: '' },
  success: { icon: 'text-success bg-success/10', trend: '' },
  warning: { icon: 'text-amber-400 bg-amber-400/10', trend: '' },
}

export default function StatCard({ title, value, subtitle, icon: Icon, color = 'primary', trend }) {
  const { icon: iconClass } = colorMap[color] || colorMap.primary

  return (
    <GlassCard hover className="flex items-start justify-between">
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{title}</p>
        <motion.p
          className="text-2xl font-bold text-slate-100 mt-1.5 truncate"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {value}
        </motion.p>
        {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
        {trend !== undefined && (
          <p className={`text-xs mt-1.5 font-semibold ${trend >= 0 ? 'text-success' : 'text-red-400'}`}>
            {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}% vs last month
          </p>
        )}
      </div>
      {Icon && (
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ml-3 ${iconClass}`}>
          <Icon size={20} />
        </div>
      )}
    </GlassCard>
  )
}
