import React, { useEffect, useMemo, useRef, useState } from 'react'
import Header from '../components/Header'
import StatsCards from '../components/StatsCards'
import FiltersBar from '../components/FiltersBar'
import LeadsTable from '../components/LeadsTable'
import ChartsPanel from '../components/ChartsPanel'
import LeadModal from '../components/LeadModal'
import { getLeads, type Lead } from '../lib/api'
import { parseTs } from '../lib/time'

export default function Home() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)
  const [q, setQ] = useState('')
  const [quality, setQuality] = useState('')
  const [source, setSource] = useState('')
  const [model, setModel] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [sortKey, setSortKey] = useState<'timestamp' | 'client_name' | 'Phone' | 'selected_car' | 'lead_quality' | 'Source' | 'summary'>('timestamp')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const [modal, setModal] = useState<{ open: boolean; item: Lead | null }>({ open: false, item: null })
  const printRef = useRef<HTMLDivElement>(null)

  const load = async () => {
    const all = await getLeads()
    setLeads(Array.isArray(all) ? all : [])
    setLastUpdated(new Date().toLocaleString())
  }

  useEffect(() => { load() }, [])
  useEffect(() => {
    const t = setInterval(load, 30000)
    return () => clearInterval(t)
  }, [])

  const filtered = useMemo(() => leads.filter(r => {
    const okQ = q ? ((r.client_name || '').toLowerCase().includes(q.toLowerCase()) || (r.Phone || '').includes(q)) : true
    const okQual = quality ? (r.lead_quality === quality) : true
    const okSrc = source ? (r.Source === source) : true
    const okModel = model ? ((r.selected_car || '').toLowerCase().includes(model.toLowerCase())) : true
    const t = parseTs(r.timestamp).getTime()
    const okFrom = dateFrom ? (t >= new Date(dateFrom).getTime()) : true
    const okTo = dateTo ? (t <= new Date(dateTo).getTime()) : true
    return okQ && okQual && okSrc && okModel && okFrom && okTo
  }), [leads, q, quality, source, model, dateFrom, dateTo])

  const sorted = useMemo(() => {
    const arr = [...filtered]
    arr.sort((a, b) => {
      if (sortKey === 'timestamp') {
        const da = parseTs(a.timestamp).getTime()
        const db = parseTs(b.timestamp).getTime()
        return sortDir === 'asc' ? da - db : db - da
      }
      const A = (a[sortKey] || '').toString()
      const B = (b[sortKey] || '').toString()
      return sortDir === 'asc' ? A.localeCompare(B) : B.localeCompare(A)
    })
    return arr
  }, [filtered, sortKey, sortDir])

  const pages = Math.max(1, Math.ceil(sorted.length / pageSize))
  const paged = useMemo(() => sorted.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize), [sorted, page, pageSize])
  useEffect(() => { if (page > pages) setPage(pages) }, [pages, page])

  const byQuality = useMemo(() => sorted.reduce((m: Record<string, number>, r) => { const k = r.lead_quality || '—'; m[k] = (m[k] || 0) + 1; return m }, {}), [sorted])
  const byDay = useMemo(() => { const m = new Map<string, number>(); for (const r of sorted) { const d = parseTs(r.timestamp); const k = isNaN(d.getTime()) ? '—' : d.toISOString().slice(0, 10); m.set(k, (m.get(k) || 0) + 1) } return Array.from(m.entries()).map(([day, count]) => ({ day, count })).sort((a, b) => a.day.localeCompare(b.day)) }, [sorted])
  const bySource = useMemo(() => { const m = sorted.reduce<Record<string, number>>((a, r) => { const k = r.Source || '—'; a[k] = (a[k] || 0) + 1; return a }, {}); return Object.entries(m).map(([name, value]) => ({ name, value })) }, [sorted])
  const topModels = useMemo(() => { const m = sorted.reduce<Record<string, number>>((a, r) => { const k = r.selected_car || '—'; a[k] = (a[k] || 0) + 1; return a }, {}); return Object.entries(m).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 5) }, [sorted])
  const byHour = useMemo(() => { const m: Record<string, number> = {}; for (const r of sorted) { const d = parseTs(r.timestamp); if (isNaN(d.getTime())) continue; const h = String(d.getHours()).padStart(2, '0'); m[h] = (m[h] || 0) + 1 } return Array.from({ length: 24 }, (_, i) => ({ hour: String(i).padStart(2, '0'), value: m[String(i).padStart(2, '0')] || 0 })) }, [sorted])
  const bySourceQuality = useMemo(() => { const s: Record<string, { h: number; t: number }> = {}; for (const r of sorted) { const k = r.Source || '—'; s[k] = s[k] || { h: 0, t: 0 }; s[k].t += 1; if ((r.lead_quality || '').toLowerCase() === 'high' || r.lead_quality === 'Высокий') s[k].h += 1 } return Object.entries(s).map(([name, { h, t }]) => ({ name, value: t ? Math.round(100 * h / t) : 0 })) }, [sorted])

  const onSort = (key: any) => { if (sortKey === key) setSortDir(sortDir === 'asc' ? 'desc' : 'asc'); else { setSortKey(key); setSortDir('asc') } }
  const onNewest = () => { setSortKey('timestamp'); setSortDir('desc') }

  const onExport = () => {
    const rows = sorted
    const html = `<html><head><title>Leads</title><style>body{font:12px system-ui;color:#111}table{width:100%;border-collapse:collapse}th,td{border:1px solid #ccc;padding:6px}th{text-align:left}</style></head><body><h2>Leads (${rows.length})</h2><table><thead><tr><th>Клиент</th><th>Телефон</th><th>Модель</th><th>Качество</th><th>Источник</th><th>Дата</th><th>Описание</th></tr></thead><tbody>${rows.map(r => `<tr><td>${r.client_name || '—'}</td><td>${r.Phone || '—'}</td><td>${r.selected_car || '—'}</td><td>${r.lead_quality || '—'}</td><td>${r.Source || '—'}</td><td>${new Date(parseTs(r.timestamp)).toLocaleString()}</td><td>${(r.summary || '').toString().replace(/</g, '&lt;')}</td></tr>`).join('')}</tbody></table></body></html>`
    const w = window.open('about:blank', '_blank'); if (!w) return; w.document.write(html); w.document.close(); w.focus(); w.print()
  }

  return (
    <div className="p-5 space-y-6">
      <Header lastUpdated={lastUpdated} onRefresh={load} onExport={onExport} onNewest={onNewest} />
      <StatsCards total={sorted.length} byQuality={byQuality} lastUpdated={lastUpdated} />
      <div className="card h-2"><div className="w-full h-full bg-[var(--accent)]/30" /></div>
      <FiltersBar q={q} setQ={setQ} quality={quality} setQuality={setQuality} source={source} setSource={setSource} model={model} setModel={setModel} dateFrom={dateFrom} setDateFrom={setDateFrom} dateTo={dateTo} setDateTo={setDateTo} onClear={() => { setQ(''); setQuality(''); setSource(''); setModel(''); setDateFrom(''); setDateTo(''); setPage(1) }} />
      <ChartsPanel byDay={byDay} bySource={bySource} topModels={topModels} byHour={byHour} bySourceQuality={bySourceQuality} />
      <LeadsTable rows={paged} page={page} pages={pages} total={sorted.length} pageSize={pageSize} setPage={setPage} setPageSize={(n) => { setPageSize(n); setPage(1) }} sortKey={sortKey} sortDir={sortDir} onSort={onSort} onRow={(it) => setModal({ open: true, item: it })} />
      <div ref={printRef} />
      <LeadModal open={modal.open} item={modal.item} onClose={() => setModal({ open: false, item: null })} />
    </div>
  )
}
