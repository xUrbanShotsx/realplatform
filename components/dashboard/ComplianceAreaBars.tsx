'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

interface AreaData {
  name: string
  score: number
}

export function ComplianceAreaBars({ data }: { data: AreaData[] }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} barSize={28} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
        <XAxis
          dataKey="name"
          tick={{ fontSize: 12, fill: '#6B7280', fontFamily: 'var(--font-space-grotesk)' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          domain={[0, 100]}
          tick={{ fontSize: 11, fill: '#9CA3AF', fontFamily: 'var(--font-space-grotesk)' }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          cursor={{ fill: '#F9F9F7' }}
          contentStyle={{
            border: '1px solid #E5E7EB',
            borderRadius: '8px',
            fontSize: '12px',
            fontFamily: 'var(--font-space-grotesk)',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
          }}
          formatter={(value: number) => [`${value}/100`, 'Score']}
        />
        <Bar dataKey="score" radius={[4, 4, 0, 0]}>
          {data.map((entry) => (
            <Cell
              key={entry.name}
              fill={entry.score >= 80 ? 'var(--accent)' : entry.score >= 60 ? '#F59E0B' : '#EF4444'}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
