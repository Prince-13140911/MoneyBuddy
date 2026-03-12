import { motion } from 'framer-motion'

export default function GlassCard({ children, className = '', hover = false, onClick }) {
  return (
    <motion.div
      className={`glass-card p-6 ${className}`}
      whileHover={hover ? { y: -2, borderColor: 'rgba(99,102,241,0.25)' } : {}}
      transition={{ duration: 0.2 }}
      onClick={onClick}
    >
      {children}
    </motion.div>
  )
}
