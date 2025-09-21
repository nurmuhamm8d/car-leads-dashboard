import { useEffect, useMemo, useState } from 'react'
import { fetchLeads } from '../lib/api'
import { timeAgo } from '../lib/time'
import { computeAnalytics, filterRows, collectFacetOptions, normalizeLead } from '../lib/analytics'
import FiltersBar from '../components/FiltersBar'
import StatsCards from '../components/StatsCards.jsx'
import ChartsPanel from '../components/ChartsPanel'
import LeadsTable from '../components/LeadsTable.jsx'
import LeadModal from '../components/LeadModal.jsx'

type SourceMap = Record<string, number>
type TimelinePoint = { date: string; value: number }
type ModelPoint = { name: string; value: number }
type HourPoint = { hour: string; value: number }
type Stats = {
  total: number
  high: number
  conversion: number
  bySource: SourceMap
  timeline: TimelinePoint[]
  topModels: ModelPoint[]
  hours: HourPoint[]
  has: { source: boolean; created: boolean }
}

let REFRESH_MS = 30000

export default function Home() {
  const [raw, setRaw] = useState<any[]>([])
  const [updatedAt, setUpdatedAt] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState({ q: '', quality: 'all', source: 'all', model: 'all', from: null as any, to: null as any })
  const [selected, setSelected] = useState<any | null>(null)

  async function load() {
    try {
      const { data, updatedAt } = await fetchLeads()
      setRaw(Array.isArray(data) ? data : [])
      setUpdatedAt(updatedAt ?? null)
      setError(null)
    } catch (e: any) {
      setError(e?.message || 'Load error')
    }
  }

  useEffect(() => {
    load()
    const t = setInterval(load, REFRESH_MS)
    return () => clearInterval(t)
  }, [])

  const rows = useMemo(() => filterRows(raw, filters), [raw, filters])
  const facets = useMemo(() => collectFacetOptions(raw), [raw])
  const stats = useMemo<Stats>(() => computeAnalytics(rows) as unknown as Stats, [rows])

  const onExportJson = () => {
    const a = document.createElement('a')
    const blob = new Blob([JSON.stringify(rows.map(normalizeLead), null, 2)], { type: 'application/json' })
    a.href = URL.createObjectURL(blob)
    a.download = 'leads.json'
    a.click()
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="text-2xl font-semibold">Home</div>
      <div className="text-sm text-zinc-400">{updatedAt ? `Обновлено ${timeAgo(updatedAt)} назад` : 'Загрузка...'}</div>

      <FiltersBar facets={facets} state={filters} onChange={setFilters} onExport={onExportJson} />

      <StatsCards total={stats.total} high={stats.high} conversion={stats.conversion} />
      <ChartsPanel bySource={stats.bySource} timeline={stats.timeline} topModels={stats.topModels} hours={stats.hours} has={stats.has} />

      {error ? <div className="text-red-400">{error}</div> : <LeadsTable rows={rows} onRowClick={setSelected} />}
      <LeadModal open={!!selected} onClose={() => setSelected(null)} lead={selected} />
    </div>
  )
}
