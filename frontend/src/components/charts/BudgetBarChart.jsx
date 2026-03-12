import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="glass-card p-3 text-sm border border-primary/20">
        <p className="text-slate-400 text-xs mb-1">{label}</p>
        {payload.map((p) => (
          <p key={p.name} style={{ color: p.fill }} className="font-semibold">
            {p.name}: ${p.value.toFixed(2)}
          </p>
        ))}
      </div>
    )
  }
  return null
}

export default function BudgetBarChart({ data }) {
  if (!data?.length) {
    return (
      <div className="flex items-center justify-center h-48 text-slate-500 text-sm">
        No budget data yet
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }} barGap={4}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
        <XAxis dataKey="category" tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} />
        <Tooltip content={<CustomTooltip />} />
        <Legend formatter={(v) => <span style={{ color: '#94A3B8', fontSize: 11 }}>{v}</span>} />
        <Bar dataKey="budget" name="Budget" fill="#6366F1" radius={[4, 4, 0, 0]} />
        <Bar dataKey="spent" name="Spent" fill="#14B8A6" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
