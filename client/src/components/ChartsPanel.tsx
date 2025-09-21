import React from 'react'
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
  LineChart, Line, CartesianGrid, XAxis, YAxis,
  BarChart, Bar
} from 'recharts'

type SourceMap = Record<string, number>
type TimelinePoint = { date: string; value: number }
type ModelPoint = { name: string; value: number }
type HourPoint = { hour: string; value: number }
type HasFlags = { source:boolean; created:boolean }

type Props = {
  bySource?: SourceMap | null
  timeline?: TimelinePoint[]
  topModels?: ModelPoint[]
  hours?: HourPoint[]
  has?: HasFlags
}

const COLORS = ['var(--series-1)','var(--series-2)','var(--series-3)','var(--series-4)','var(--series-5)']

function Empty({ text }: { text: string }) {
  return <div className="card card-pad" style={{display:'grid',placeItems:'center',height:260,color:'var(--muted)'}}>{text}</div>
}

export default function ChartsPanel({ bySource, timeline, topModels, hours, has }: Props){
  const sources = Object.entries(bySource || {}).map(([name, value])=>({name, value}))
  const models = topModels || []
  const daily = timeline || []
  const byHour = hours || []

  return (
    <div className="grid-3">
      <div className="card card-pad">
        <div className="card-title">Распределение по источникам</div>
        {sources.length === 0 ? <Empty text="Нет данных" /> : (
          <>
            <div style={{height:260}}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={sources} innerRadius={60} outerRadius={90} paddingAngle={2} dataKey="value" nameKey="name">
                    {sources.map((_,i)=><Cell key={i} fill={COLORS[i%COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="legend">
              {sources.map((s,i)=>(
                <span key={s.name}><i style={{background:COLORS[i%COLORS.length]}}/> {s.name}</span>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="card card-pad">
        <div className="card-title">Динамика лидов по дням</div>
        {daily.length===0 ? <Empty text="Нет данных" /> : (
          <div style={{height:260}}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={daily} margin={{left:8,right:12,top:4,bottom:0}}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis width={28}/>
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="value" name="Лиды" stroke="var(--series-1)" strokeWidth={2} dot={{r:3}} activeDot={{r:5}}/>
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <div className="card card-pad">
        <div className="card-title">Топ-5 моделей</div>
        {models.length===0 ? <Empty text="Нет данных" /> : (
          <div style={{height:260}}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={models} margin={{left:8,right:12,top:4,bottom:0}}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis width={28}/>
                <Tooltip />
                <Legend />
                <Bar dataKey="value" name="Лиды по моделям">
                  {models.map((_,i)=><Cell key={i} fill={COLORS[i%COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <div className="card card-pad" style={{gridColumn:'1 / -1'}}>
        <div className="card-title">Распределение по часам</div>
        {byHour.length===0 ? <Empty text="Нет данных" /> : (
          <div style={{height:280}}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byHour} margin={{left:8,right:12,top:4,bottom:0}}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis width={28}/>
                <Tooltip />
                <Bar dataKey="value" name="Лиды в час" fill="var(--series-3)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  )
}
