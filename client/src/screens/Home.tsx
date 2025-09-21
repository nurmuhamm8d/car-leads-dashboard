import { useEffect, useMemo, useState } from 'react'
import { fetchLeads } from '../lib/api'
import { timeAgo } from '../lib/time'
import { computeAnalytics, filterRows, collectFacetOptions, normalizeLead } from '../lib/analytics'
import FiltersBar from '../components/FiltersBar'
import StatsCards from '../components/StatsCards.jsx'
import ChartsPanel from '../components/ChartsPanel'
import LeadsTable from '../components/LeadsTable.jsx'
import LeadModal from '../components/LeadModal.jsx'

let REFRESH_MS = 30000

export default function Home() {
  const [raw, setRaw] = useState<any[]>([])
  const [updatedAt, setUpdatedAt] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState({ q:'', quality:'all', source:'all', model:'all', from:null as any, to:null as any })
  const [selected, setSelected] = useState<any | null>(null)

  async function load() {
    try {
      const { data, updatedAt } = await fetchLeads()
      setRaw(Array.isArray(data) ? data : [])
      setUpdatedAt(updatedAt ?? null)
      setError(null)
    } catch (e:any) {
      setError(e?.message || 'Load error')
    }
  }

  useEffect(() => {
    load()
    const t = setInterval(load, REFRESH_MS)
    return () => clearInterval(t)
  }, [])

  const rows = useMemo(()=> filterRows(raw, filters), [raw, filters])
  const facets = useMemo(()=> collectFacetOptions(rows), [rows])
  const stats = useMemo(()=> computeAnalytics(rows), [rows])

  const onExportJson = () => {
    const a = document.createElement('a')
    const blob = new Blob([JSON.stringify(rows.map(normalizeLead), null, 2)], {type: 'application/json'})
    a.href = URL.createObjectURL(blob)
    a.download = 'leads.json'
    a.click()
  }

  return (
    <div className="container-app">
      <h1 style={{margin:'0 0 6px'}}>Home</h1>
      <div className="muted">{updatedAt ? `Обновлено ${timeAgo(updatedAt)} назад` : 'Загрузка...'}</div>

      <div className="card card-pad" style={{marginTop:14}}>
        <FiltersBar facets={facets} state={filters} onChange={setFilters} onExport={onExportJson} />
      </div>

      <div style={{height:14}}/>

      <StatsCards total={stats.total} high={stats.high} conversion={stats.conversion} />

      <div style={{height:18}}/>

      <ChartsPanel
        bySource={(stats.bySource || {}) as Record<string, number>}
        timeline={stats.timeline as any}
        topModels={stats.topModels as any}
        hours={stats.hours as any}
        has={stats.has as any}
      />

      <div style={{height:18}}/>

      {error ? <div className="card card-pad" style={{color:'var(--bad)'}}>{error}</div> : (
        <div className="card card-pad">
          <div className="card-title">Все лиды</div>
          <LeadsTable rows={rows} onRowClick={setSelected} />
        </div>
      )}
      <LeadModal open={!!selected} onClose={()=>setSelected(null)} lead={selected} />
      <div className="footer-space"/>
    </div>
  )
}
