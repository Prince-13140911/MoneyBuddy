import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="glass-card p-3 text-sm border border-primary/20">
        <p className="text-slate-400 text-xs">{label}</p>
        <p className="text-primary font-bold">${payload[0].value.toFixed(2)}</p>
      </div>
    )
  }
  return null
}

export default function SpendingAreaChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="spendGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
        <XAxis dataKey="name" tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="amount"
          stroke="#6366F1"
          strokeWidth={2.5}
          fill="url(#spendGrad)"
          dot={{ fill: '#6366F1', r: 3 }}
          activeDot={{ r: 5, fill: '#6366F1' }}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
