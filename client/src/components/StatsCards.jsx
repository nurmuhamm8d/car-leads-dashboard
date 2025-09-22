import React from 'react'

export default function StatsCards({ total, byQuality, lastUpdated }) {
  const high = byQuality['Высокий']||byQuality['high']||0
  const good = (byQuality['Хороший']||0)+(byQuality['Средний']||0)
  const conversion = total ? Math.round((high/total)*100) : 0
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="card p-5">
        <div className="text-sm text-[var(--muted)]">Всего</div>
        <div className="text-3xl font-semibold mt-1">{total}</div>
      </div>
      <div className="card p-5">
        <div className="text-sm text-[var(--muted)]">Высокие</div>
        <div className="text-3xl font-semibold mt-1">{high}</div>
      </div>
      <div className="card p-5">
        <div className="text-sm text-[var(--muted)]">Хорошие/Средние</div>
        <div className="text-3xl font-semibold mt-1">{good}</div>
      </div>
      <div className="card p-5">
        <div className="text-sm text-[var(--muted)]">Конверсия в «Высокий»</div>
        <div className="text-3xl font-semibold mt-1">{conversion}%</div>
        <div className="mt-3 progress"><div style={{width:`${conversion}%`}}/></div>
        {lastUpdated && <div className="mt-2 text-xs text-[var(--muted)]">Обновлено: {lastUpdated}</div>}
      </div>
    </div>
  )
}
