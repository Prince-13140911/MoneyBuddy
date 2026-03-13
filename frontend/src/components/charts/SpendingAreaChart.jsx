import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="rounded-xl px-3 py-2 text-xs shadow-xl"
        style={{ background: 'var(--dropdown-bg)', border: '1px solid var(--border)', color: 'var(--body-text)' }}>
        <p className="text-slate-400 text-[10px] mb-0.5">{label}</p>
        <p className="font-bold text-primary">₹{Number(payload[0].value).toLocaleString('en-IN')}</p>
      </div>
    )
  }
  return null
}

export default function SpendingAreaChart({ data, height = 240 }) {
  const avg = data?.length ? data.reduce((s, d) => s + d.amount, 0) / data.length : 0

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="spendGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#6366F1" stopOpacity={0.35} />
            <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,116,139,0.15)" />
        <XAxis dataKey="name" tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false}
          tickFormatter={(v) => v === 0 ? '0' : `₹${v >= 1000 ? `${(v/1000).toFixed(0)}k` : v}`} />
        <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#6366F1', strokeWidth: 1, strokeDasharray: '4 2' }} />
        {avg > 0 && (
          <ReferenceLine y={avg} stroke="rgba(99,102,241,0.4)" strokeDasharray="4 4"
            label={{ value: 'avg', fill: '#6366F1', fontSize: 10, position: 'right' }} />
        )}
        <Area
          type="monotone"
          dataKey="amount"
          stroke="#6366F1"
          strokeWidth={2.5}
          fill="url(#spendGrad)"
          dot={{ fill: '#6366F1', r: 3, strokeWidth: 0 }}
          activeDot={{ r: 6, fill: '#6366F1', stroke: 'rgba(99,102,241,0.3)', strokeWidth: 4 }}
          animationDuration={800}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
