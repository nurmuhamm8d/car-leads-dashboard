import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
  LineChart, Line, CartesianGrid, XAxis, YAxis,
  BarChart, Bar
} from 'recharts'

type SourceMap = Record<string, number>
type TimelinePoint = { date: string; value: number }
type ModelPoint = { name: string; value: number }
type HourPoint = { hour: string; value: number }
type HasFlags = { source: boolean; created: boolean }

type Props = {
  bySource?: SourceMap | null
  timeline?: TimelinePoint[]
  topModels?: ModelPoint[]
  hours?: HourPoint[]
  has?: HasFlags
}

const COLORS = ['#5B60EA', '#22C55E', '#F59E0B', '#EF4444', '#06B6D4', '#8B5CF6', '#10B981']
const SURFACE = 'var(--card)'
const GRID = '#E7EAF1'
const TEXT = 'var(--text)'

function Empty({ text }: { text: string }) {
  return <div className="h-[260px] flex items-center justify-center text-slate-400">{text}</div>
}

export default function ChartsPanel ({
  bySource, timeline, topModels, hours, has,
}: Props) {
  const sourceData = Object.entries(bySource ?? {}).map(([name, value]) => ({ name, value }))

  return (
    <section className="grid gap-6 grid-cols-1 xl:grid-cols-3">
      {/* Источники (пирог) */}
      <div className="card">
        <h3 className="card-title">Распределение по источникам</h3>
        {sourceData.length === 0 ? <Empty text="Нет данных по источникам" /> : (
          <div className="chart-wrap">
            <ResponsiveContainer>
              <PieChart>
                <Tooltip />
                <Legend />
                <Pie
                  data={sourceData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  outerRadius={90}
                  stroke={SURFACE}
                >
                  {sourceData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Динамика по дням */}
      <div className="card">
        <h3 className="card-title">Динамика лидов по дням</h3>
        {(timeline?.length ?? 0) === 0 ? <Empty text="Нет данных по датам" /> : (
          <div className="chart-wrap">
            <ResponsiveContainer>
              <LineChart data={timeline!}>
                <CartesianGrid strokeDasharray="4 4" stroke={GRID} />
                <XAxis dataKey="date" stroke={TEXT} />
                <YAxis width={36} stroke={TEXT}/>
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="value" name="Лиды" stroke="#5B60EA" dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Топ-5 моделей */}
      <div className="card">
        <h3 className="card-title">Топ-5 моделей</h3>
        {(topModels?.length ?? 0) === 0 ? <Empty text="Нет данных по моделям" /> : (
          <div className="chart-wrap">
            <ResponsiveContainer>
              <BarChart data={topModels!}>
                <CartesianGrid strokeDasharray="4 4" stroke={GRID} />
                <XAxis dataKey="name" stroke={TEXT} interval={0} height={52} angle={0}/>
                <YAxis width={36} stroke={TEXT} />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" name="Лиды по моделям">
                  {topModels!.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Часы — на всю ширину */}
      <div className="card xl:col-span-3">
        <h3 className="card-title">Распределение по часам</h3>
        {(hours?.length ?? 0) === 0 ? <Empty text="Нет данных по часам" /> : (
          <div className="chart-wrap">
            <ResponsiveContainer>
              <BarChart data={hours!}>
                <CartesianGrid strokeDasharray="4 4" stroke={GRID} />
                <XAxis dataKey="hour" stroke={TEXT} />
                <YAxis width={36} stroke={TEXT}/>
                <Tooltip />
                <Legend />
                <Bar dataKey="value" name="Лиды в час" fill="#5B60EA" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </section>
  )
}
