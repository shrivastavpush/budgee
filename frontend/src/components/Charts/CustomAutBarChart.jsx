import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'

const data = [
  { date: 'Mar 25', value: 50 },
  { date: 'Mar 26', value: 100 },
  { date: 'Mar 27', value: 180 },
  { date: 'Mar 28', value: 90 },
  { date: 'Mar 29', value: 70 },
  { date: 'Mar 30', value: 150 },
  { date: 'Mar 31', value: 80 },
]

export default function CustomBarChart() {
  return (
    <div className="bg-white rounded-2xl shadow-lg shadow-teal-400/10">
      <ResponsiveContainer width="100%" height={260} className="pt-4 pr-4 pb-2">
        <BarChart data={data}>
          <XAxis dataKey="date" tick={{ fill: 'var(--text-secondary)' }} />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" radius={[5, 5, 0, 0]}>
            {data.map((entry, index) => (
              <Cell
                key={entry.date}
                fill={
                  index % 2 === 0
                    ? 'var(--accent-chart-light)'
                    : 'var(--accent-chart-dark)'
                }
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
