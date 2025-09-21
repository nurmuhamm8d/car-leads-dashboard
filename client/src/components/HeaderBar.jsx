import { useEffect, useState } from 'react'

export default function HeaderBar({ lastUpdated, onRefresh }) {
  const [tick, setTick] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setTick(t => t+1), 1000)
    return () => clearInterval(id)
  }, [])
  const since = lastUpdated ? Math.max(0, Math.floor((Date.now()-lastUpdated)/1000)) : null
  return (
    <div className="sticky top-0 z-20 backdrop-blur bg-zinc-950/70 border-b border-zinc-800">
      <div className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
        <div className="text-xl font-semibold">Car Leads Dashboard</div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-zinc-400">{since!==null ? `Обновлено ${since}s назад` : 'Обновляю...'}</span>
          <button onClick={onRefresh} className="px-3 py-1.5 rounded-lg bg-brand hover:bg-brand-dark text-white">Обновить</button>
        </div>
      </div>
    </div>
  )
}
