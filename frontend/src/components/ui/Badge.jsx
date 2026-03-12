const colors = {
  Food: 'bg-orange-500/15 text-orange-400 border-orange-500/20',
  Transport: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
  Entertainment: 'bg-purple-500/15 text-purple-400 border-purple-500/20',
  Shopping: 'bg-pink-500/15 text-pink-400 border-pink-500/20',
  Bills: 'bg-red-500/15 text-red-400 border-red-500/20',
  Other: 'bg-slate-500/15 text-slate-400 border-slate-500/20',
  income: 'bg-green-500/15 text-green-400 border-green-500/20',
  expense: 'bg-red-500/15 text-red-400 border-red-500/20',
}

export default function Badge({ label }) {
  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${colors[label] || colors.Other}`}>
      {label}
    </span>
  )
}
