import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, LineChart, Line, CartesianGrid, XAxis, YAxis, BarChart, Bar } from 'recharts'

type SourceMap = Record<string, number>
type TimelinePoint = { date: string; value: number }
type ModelPoint = { name: string; value: number }
type HourPoint = { hour: string; value: number }
type HasFlags = { source: boolean; created: boolean }

const COLORS = ['#60a5fa','#34d399','#f472b6','#fbbf24','#a78bfa','#38bdf8','#f87171']

export default function ChartsPanel({
  bySource,
  timeline,
  topModels,
  hours,
  has
}: {
  bySource: SourceMap
  timeline: TimelinePoint[]
  topModels: ModelPoint[]
  hours: HourPoint[]
  has: HasFlags
}) {
  const srcData = Object.entries(bySource || {}).map(([name, value]) => ({ name, value }))
  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="card p-4">
        <div className="mb-2 text-sm text-zinc-400">Распределение по источникам</div>
        {has.source && srcData.length ? (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={srcData} dataKey="value" nameKey="name" outerRadius={100} innerRadius={50}>
                  {srcData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : <Empty text="Добавьте столбец Source" />}
      </div>

      <div className="card p-4">
        <div className="mb-2 text-sm text-zinc-400">Динамика лидов по дням</div>
        {has.created && timeline?.length ? (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timeline}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Line type="monotone" dataKey="value" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : <Empty text="Добавьте столбец timestamp" />}
      </div>

      <div className="card p-4">
        <div className="mb-2 text-sm text-zinc-400">Топ-5 моделей</div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topModels || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" interval={0} tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card p-4 lg:col-span-3">
        <div className="mb-2 text-sm text-zinc-400">Распределение по часам</div>
        {has.created && hours?.length ? (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hours}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : <Empty text="Для графика по часам нужна колонка timestamp" />}
      </div>
    </div>
  )
}

function Empty({ text }: { text: string }) {
  return (
    <div className="h-64 grid place-content-center">
      <div className="text-sm text-zinc-500">{text}</div>
    </div>
  )
}
