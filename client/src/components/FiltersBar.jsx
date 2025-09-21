import React from 'react'

export default function FiltersBar({ facets, state, onChange, onExport }) {
  const set=(k,v)=>onChange({...state,[k]:v})
  return (
    <div className="toolbar">
      <input className="input" placeholder="Поиск по имени/телефону/заметкам" value={state.q} onChange={e=>set('q',e.target.value)} />
      <select className="select" value={state.quality} onChange={e=>set('quality',e.target.value)}>
        <option value="all">Все</option>
        {facets.qualities.map(v=><option key={v} value={v}>{v}</option>)}
      </select>
      <select className="select" value={state.source} onChange={e=>set('source',e.target.value)}>
        <option value="all">Все</option>
        {facets.sources.map(v=><option key={v} value={v}>{v}</option>)}
      </select>
      <select className="select" value={state.model} onChange={e=>set('model',e.target.value)}>
        <option value="all">Все</option>
        {facets.models.map(v=><option key={v} value={v}>{v}</option>)}
      </select>
      <input className="input" type="date" value={state.from||''} onChange={e=>set('from',e.target.value||null)} />
      <input className="input" type="date" value={state.to||''} onChange={e=>set('to',e.target.value||null)} />
      <div style={{display:'none'}} />
      <button className="btn" onClick={onExport}>Экспорт в PDF</button>
    </div>
  )
}
