import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
  LineChart, Line, CartesianGrid, XAxis, YAxis,
  BarChart, Bar, LabelList
} from 'recharts'

type SourceMap = Record<string, number>
type TimelinePoint = { date: string; value: number }
type ModelPoint = { name: string; value: number }
type HourPoint = { hour: string; value: number }
type HasFlags = { source: boolean; created: boolean }

const PALETTE = ['#16a34a','#22c55e','#10b981','#34d399','#86efac','#2dd4bf','#60a5fa','#f59e0b','#ef4444']

function toArray(map?: SourceMap){
  if(!map) return []
  return Object.entries(map).map(([name,value])=>({name, value}))
}

export default function ChartsPanel({
  bySource,
  timeline,
  topModels,
  hours,
  has
}:{
  bySource?: SourceMap
  timeline?: TimelinePoint[]
  topModels?: ModelPoint[]
  hours?: HourPoint[]
  has?: HasFlags
}){
  const sourceData = toArray(bySource)
  const totalSources = sourceData.reduce((s,d)=>s+d.value,0)

  return (
    <div className="kit-section">
      <div className="grid-3">
        <div className="card p-5 span-4">
          <div className="card-header">Распределение по источникам</div>
          <div style={{height:300}}>
            <ResponsiveContainer>
              <PieChart>
                <Tooltip />
                <Legend />
                <Pie
                  data={sourceData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={70}
                  outerRadius={110}
                  paddingAngle={2}
                >
                  {sourceData.map((_,i)=>(
                    <Cell key={i} fill={PALETTE[i%PALETTE.length]} />
                  ))}
                  <LabelList
                    dataKey="value"
                    position="outside"
                    formatter={(v:any, _:any, item:any)=>{
                      const pct = totalSources ? Math.round((v/totalSources)*100) : 0
                      return `${item?.payload?.name} — ${pct}%`
                    }}
                  />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-5 span-4">
          <div className="card-header">Динамика лидов по дням</div>
          <div style={{height:300}}>
            <ResponsiveContainer>
              <LineChart data={timeline || []} margin={{top:10,right:20,bottom:10,left:0}}>
                <CartesianGrid strokeDasharray="4 4" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="value" name="Лиды" stroke="#16a34a" strokeWidth={3} dot={{r:4}} activeDot={{r:6}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-5 span-4">
          <div className="card-header">Топ-5 моделей</div>
          <div style={{height:300}}>
            <ResponsiveContainer>
              <BarChart data={topModels || []} margin={{top:10,right:20,bottom:10,left:0}}>
                <CartesianGrid strokeDasharray="4 4" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" name="Лиды по моделям">
                  {(topModels || []).map((_,i)=>(
                    <Cell key={i} fill={PALETTE[i%PALETTE.length]} />
                  ))}
                  <LabelList dataKey="value" position="top" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-5 span-12">
          <div className="card-header">Распределение по часам</div>
          <div style={{height:320}}>
            <ResponsiveContainer>
              <BarChart data={hours || []} margin={{top:10,right:20,bottom:10,left:0}}>
                <CartesianGrid strokeDasharray="4 4" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" name="Лиды в час">
                  {(hours || []).map((_,i)=>(
                    <Cell key={i} fill={PALETTE[(i+2)%PALETTE.length]} />
                  ))}
                  <LabelList dataKey="value" position="top" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}
