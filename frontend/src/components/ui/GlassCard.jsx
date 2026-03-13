import { motion } from 'framer-motion'

export default function GlassCard({ children, className = '', hover = false, onClick }) {
  return (
    <motion.div
      className={`shimmer-card p-6 ${className}`}
      whileHover={hover ? { y: -3, transition: { duration: 0.2 } } : {}}
      onClick={onClick}
    >
      {children}
    </motion.div>
  )
}
