import React from 'react'
type Props={lastUpdated?:string|null,onRefresh:()=>void,onExport:()=>void,onNewest:()=>void}
export default function Header({lastUpdated,onRefresh,onExport,onNewest}:Props){
  return(
    <div className="mb-4 flex items-center justify-between">
      <h1 className="text-2xl font-semibold">Leads Dashboard</h1>
      <div className="flex items-center gap-3">
        {lastUpdated&&<span className="text-xs text-[var(--muted)]">Обновлено: {lastUpdated}</span>}
        <button className="btn" onClick={onNewest}>Сначала новые</button>
        <button className="btn" onClick={onRefresh}>Обновить</button>
        <button className="btn btn-primary" onClick={onExport}>Экспорт PDF</button>
      </div>
    </div>
  )
}
