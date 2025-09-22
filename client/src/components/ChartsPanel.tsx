import React from 'react'
import { ResponsiveContainer, LineChart, Line, Tooltip, XAxis, YAxis, PieChart, Pie, Cell, Legend, CartesianGrid, BarChart, Bar } from 'recharts'
type Props={byDay:{day:string,count:number}[],bySource:{name:string,value:number}[],topModels:{name:string,value:number}[],byHour:{hour:string,value:number}[],bySourceQuality:{name:string,value:number}[]}
const COLORS=['#22d3ee','#4f8cff','#f59e0b','#ef4444','#16a34a']
const axis={fill:'#8a97b1'}
export default function ChartsPanel({byDay,bySource,topModels,byHour,bySourceQuality}:Props){
  return(
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
      <div className="card p-4 h-80">
        <div className="text-sm text-[var(--muted)] mb-2">Динамика по дням</div>
        <ResponsiveContainer width="100%" height="100%"><LineChart data={byDay} margin={{left:16,right:10,bottom:10}}><CartesianGrid stroke="#263146" strokeDasharray="3 3"/><XAxis dataKey="day" tick={axis} stroke="#263146"/><YAxis allowDecimals={false} tick={axis} stroke="#263146"/><Tooltip/><Line type="monotone" dataKey="count" stroke="#4f8cff" strokeWidth={2} dot={false}/></LineChart></ResponsiveContainer>
      </div>
      <div className="card p-4 h-80">
        <div className="text-sm text-[var(--muted)] mb-2">Распределение по источникам</div>
        <ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={bySource} dataKey="value" nameKey="name" innerRadius={60} outerRadius={90}>{bySource.map((_,i)=><Cell key={i} fill={COLORS[i%COLORS.length]}/>)}</Pie><Legend/><Tooltip/></PieChart></ResponsiveContainer>
      </div>
      <div className="card p-4 h-80">
        <div className="text-sm text-[var(--muted)] mb-2">Топ-5 моделей</div>
        <ResponsiveContainer width="100%" height="100%"><BarChart data={topModels} margin={{left:16,right:10,bottom:24}}><CartesianGrid stroke="#263146" strokeDasharray="3 3"/><XAxis dataKey="name" interval={0} tickLine={false} tick={axis} stroke="#263146"/><YAxis allowDecimals={false} tick={axis} stroke="#263146"/><Tooltip/><Bar dataKey="value" fill="#22d3ee"/></BarChart></ResponsiveContainer>
      </div>
      <div className="card p-4 h-80">
        <div className="text-sm text-[var(--muted)] mb-2">Лиды по часам</div>
        <ResponsiveContainer width="100%" height="100%"><BarChart data={byHour} margin={{left:16,right:10,bottom:10}}><CartesianGrid stroke="#263146" strokeDasharray="3 3"/><XAxis dataKey="hour" tick={axis} stroke="#263146"/><YAxis allowDecimals={false} tick={axis} stroke="#263146"/><Tooltip/><Bar dataKey="value" fill="#4f8cff"/></BarChart></ResponsiveContainer>
      </div>
      <div className="card p-4 h-80 lg:col-span-2">
        <div className="text-sm text-[var(--muted)] mb-2">Эффективность источников (доля «Высокий», %)</div>
        <ResponsiveContainer width="100%" height="100%"><BarChart data={bySourceQuality} margin={{left:16,right:10,bottom:10}}><CartesianGrid stroke="#263146" strokeDasharray="3 3"/><XAxis dataKey="name" interval={0} tickLine={false} tick={axis} stroke="#263146"/><YAxis allowDecimals={false} tick={axis} stroke="#263146"/><Tooltip/><Bar dataKey="value" fill="#16a34a"/></BarChart></ResponsiveContainer>
      </div>
    </div>
  )
}
