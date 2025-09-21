import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend, LineChart, Line, CartesianGrid, XAxis, YAxis, BarChart, Bar } from 'recharts'

type TimelinePoint = { date: string; value: number }
type ModelPoint = { name: string; value: number }
type HourPoint = { hour: string; value: number }
type HasFlags = { source?: boolean; created?: boolean }

type Props = {
  bySource?: Record<string, number> | null
  timeline?: TimelinePoint[] | null
  topModels?: ModelPoint[] | null
  hours?: HourPoint[] | null
  has?: HasFlags | null
}

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#8b5cf6', '#22c55e', '#fb7185']

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="card p-4">
      <div className="card-title">{title}</div>
      <div className="chart-wrap">{children}</div>
    </div>
  )
}

export default function ChartsPanel({ bySource, timeline, topModels, hours, has }: Props) {
  const pieData = Object.entries(bySource ?? {}).map(([name, value]) => ({ name, value }))

  return (
    <div className="grid-3 gap-16">
      <Card title="Распределение по источникам">
        {pieData.length ? (
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={60} outerRadius={100}>
                {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="empty">Нет данных</div>
        )}
      </Card>

      <Card title="Динамика лидов по дням">
        {timeline && timeline.length ? (
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={timeline}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="value" name="Лиды" stroke="#4f46e5" strokeWidth={3} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="empty">Нет данных</div>
        )}
      </Card>

      <Card title="Топ-5 моделей">
        {topModels && topModels.length ? (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={topModels}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" name="Лиды по моделям">
                {topModels.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="empty">Нет данных</div>
        )}
      </Card>

      <div className="col-span-3">
        <Card title="Распределение по часам">
          {hours && hours.length ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={hours}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" name="Лиды в час" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="empty">Нет данных</div>
          )}
        </Card>
      </div>
    </div>
  )
}
