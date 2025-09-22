import React from 'react'
export default function FiltersBar({ q,setQ,quality,setQuality,source,setSource,dateFrom,setDateFrom,dateTo,setDateTo,model,setModel,onClear }){
  return(
    <div className="card p-4 grid grid-cols-1 lg:grid-cols-6 gap-3">
      <input className="input lg:col-span-2" placeholder="Имя или телефон" value={q} onChange={e=>setQ(e.target.value)} />
      <select className="select" value={quality} onChange={e=>setQuality(e.target.value)}>
        <option value="">Качество: все</option><option>Высокий</option><option>Хороший</option><option>Средний</option><option>Низкий</option>
      </select>
      <select className="select" value={source} onChange={e=>setSource(e.target.value)}>
        <option value="">Источник: все</option><option value="AmoLine">AmoLine</option><option value="telegramm">telegramm</option>
      </select>
      <input className="input" placeholder="Модель" value={model} onChange={e=>setModel(e.target.value)} />
      <div className="flex gap-3">
        <input className="select w-full" type="date" value={dateFrom} onChange={e=>setDateFrom(e.target.value)} />
        <input className="select w-full" type="date" value={dateTo} onChange={e=>setDateTo(e.target.value)} />
      </div>
      <div className="lg:col-span-6 flex justify-end"><button className="btn" onClick={onClear}>Сбросить</button></div>
    </div>
  )
}
