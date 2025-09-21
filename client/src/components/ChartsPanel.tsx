import React from 'react'
import {
  ResponsiveContainer,
  PieChart, Pie, Cell, Tooltip, Legend,
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  BarChart, Bar
} from 'recharts'

type TimelinePoint = { date: string; value: number }
type ModelPoint = { name: string; value: number }
type HourPoint = { hour: string; value: number }
type Props = {
  bySource?: Record<string, number> | null
  timeline?: TimelinePoint[] | null
  topModels?: ModelPoint[] | null
  hours?: HourPoint[] | null
}

const COLORS = ['#0ea5e9','#22c55e','#f59e0b','#ef4444','#8b5cf6','#14b8a6','#3b82f6']

export default function ChartsPanel({ bySource, timeline, topModels, hours }: Props) {
  const pieData = Object.entries(bySource || {}).map(([name,value])=>({name, value}))
  return (
    <div className="grid-2">
      <div className="card chart-card">
        <div className="chart-head">
          <div className="chart-title">Распределение по источникам</div>
          <div className="legend">
            {pieData.map((d,i)=>(
              <span key={d.name} className="badge">
                <span className="dot" style={{background:COLORS[i%COLORS.length]}}/>
                {d.name}
              </span>
            ))}
          </div>
        </div>
        <div style={{height:300}}>
          <ResponsiveContainer>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={70} outerRadius={110} stroke="#fff" strokeWidth={2}>
                {pieData.map((_,i)=><Cell key={i} fill={COLORS[i%COLORS.length]}/>)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card chart-card">
        <div className="chart-head"><div className="chart-title">Динамика лидов по дням</div></div>
        <div style={{height:300}}>
          <ResponsiveContainer>
            <LineChart data={timeline || []} margin={{left:8,right:8,top:10,bottom:4}}>
              <CartesianGrid stroke="#eef2f7" />
              <XAxis dataKey="date" tick={{fontSize:12}} />
              <YAxis width={36} tick={{fontSize:12}} />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#0ea5e9" strokeWidth={3} dot={{r:4}} activeDot={{r:6}} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card chart-card">
        <div className="chart-head"><div className="chart-title">Топ-5 моделей</div></div>
        <div style={{height:300}}>
          <ResponsiveContainer>
            <BarChart data={topModels || []} margin={{left:8,right:8,top:10,bottom:4}}>
              <CartesianGrid stroke="#eef2f7" />
              <XAxis dataKey="name" tick={{fontSize:12}} />
              <YAxis width={36} tick={{fontSize:12}} />
              <Tooltip />
              <Bar dataKey="value" radius={[6,6,0,0]}>
                {(topModels||[]).map((_,i)=><Cell key={i} fill={COLORS[i%COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card chart-card">
        <div className="chart-head"><div className="chart-title">Лиды по часам</div></div>
        <div style={{height:300}}>
          <ResponsiveContainer>
            <BarChart data={hours || []} margin={{left:8,right:8,top:10,bottom:4}}>
              <CartesianGrid stroke="#eef2f7" />
              <XAxis dataKey="hour" tick={{fontSize:12}} />
              <YAxis width={36} tick={{fontSize:12}} />
              <Tooltip />
              <Bar dataKey="value" fill="#94a3b8" radius={[6,6,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
