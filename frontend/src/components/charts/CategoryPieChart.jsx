import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'

const COLORS = ['#6366F1', '#14B8A6', '#F59E0B', '#EC4899', '#EF4444', '#94A3B8']

const CustomTooltip = ({ active, payload }) => {
  if (active && payload?.length) {
    return (
      <div className="glass-card p-3 text-sm border border-primary/20">
        <p className="text-slate-300 font-medium">{payload[0].name}</p>
        <p className="text-primary font-bold">${payload[0].value.toFixed(2)}</p>
      </div>
    )
  }
  return null
}

export default function CategoryPieChart({ data }) {
  if (!data?.length) {
    return (
      <div className="flex items-center justify-center h-48 text-slate-500 text-sm">
        No expenses recorded yet
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={55}
          outerRadius={85}
          paddingAngle={3}
          dataKey="value"
        >
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="transparent" />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend formatter={(v) => <span style={{ color: '#94A3B8', fontSize: 11 }}>{v}</span>} />
      </PieChart>
    </ResponsiveContainer>
  )
}
