import dayjs from 'dayjs'
import clsx from 'clsx'

export default function FiltersBar({ facets, state, onChange, onExport }) {
  const { qualities=[], sources=[], models=[] } = facets || {}
  const s = state || {}

  return (
    <div className="grid md:grid-cols-[1fr,auto,auto,auto,auto,auto] gap-3 items-end">
      <div className="flex items-center gap-2">
        <input
          className="px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 w-full"
          placeholder="Поиск по имени/телефону/заметке"
          value={s.q}
          onChange={e=>onChange({...s, q:e.target.value})}
        />
      </div>

      <Select label="Качество" value={s.quality} onChange={v=>onChange({...s, quality:v})}
        options={[['all','Все'],['high','High'],['medium','Medium'],['low','Low'],['unknown','Unknown']]} />

      <Select label="Источник" value={s.source} onChange={v=>onChange({...s, source:v})}
        options={[['all','Все'],...sources.map(x=>[x,x])]} />

      <Select label="Модель" value={s.model} onChange={v=>onChange({...s, model:v})}
        options={[['all','Все'],...models.map(x=>[x,x])]} />

      <input
        type="date"
        className="px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800"
        value={s.from ? dayjs(s.from).format('YYYY-MM-DD') : ''}
        onChange={e=>onChange({...s, from: e.target.value || null})}
      />
      <input
        type="date"
        className="px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800"
        value={s.to ? dayjs(s.to).format('YYYY-MM-DD') : ''}
        onChange={e=>onChange({...s, to: e.target.value || null})}
      />

      <button onClick={onExport}
        className={clsx('px-4 py-2 rounded-xl border bg-zinc-100 text-black md:col-span-6 md:justify-self-start')}>
        Экспорт в PDF
      </button>
    </div>
  )
}

function Select({ label, value, onChange, options }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="text-xs text-zinc-400">{label}</div>
      <select className="px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800"
        value={value} onChange={e=>onChange(e.target.value)}>
        {options.map(([v,t])=><option key={v} value={v}>{t}</option>)}
      </select>
    </div>
  )
}
