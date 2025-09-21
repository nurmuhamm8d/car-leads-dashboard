import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
dayjs.extend(customParseFormat)

function parseTs(ts) {
  if (ts == null) return null
  const raw = String(ts).trim().replace('.5055', '.2025')
  const d = dayjs(raw, 'DD.MM.YYYY, HH:mm:ss', true) // строгий разбор
  return d.isValid() ? d : null
}

export function normalizeLead(r) {
  const d = parseTs(r?.timestamp)
  return {
    client_name: r?.client_name ?? '—',
    phone: r?.phone ?? r?.Phone ?? 'Не указан',
    selected_car: r?.selected_car ?? '—',
    summary: r?.summary ?? '',
    lead_quality: (r?.lead_quality ?? r?.quality ?? 'unknown').toLowerCase(),
    timestamp: d ? d.format('DD.MM.YYYY, HH:mm:ss') : '—',
    source: (r?.Source ?? r?.source ?? 'unknown').toLowerCase()
  }
}

export function collectFacetOptions(rows) {
  const qualities = new Set(), sources = new Set(), models = new Set()
  rows.forEach(r=>{
    if (r.lead_quality) qualities.add(r.lead_quality)
    if (r.source) sources.add(r.source)
    if (r.selected_car) models.add(r.selected_car)
  })
  return {
    qualities:[...qualities].sort(),
    sources:[...sources].sort(),
    models:[...models].sort(),
  }
}

export function filterRows(raw, filters){
  const f = (raw||[]).map(normalizeLead)
  return f.filter(r=>{
    if (filters.quality!=='all' && r.lead_quality!==filters.quality) return false
    if (filters.source!=='all' && r.source!==filters.source) return false
    if (filters.model!=='all' && r.selected_car!==filters.model) return false
    if (filters.from){
      const d=parseTs(r.timestamp); if (!d || d.isBefore(filters.from,'day')) return false
    }
    if (filters.to){
      const d=parseTs(r.timestamp); if (!d || d.isAfter(filters.to,'day')) return false
    }
    const q = filters.q?.trim().toLowerCase()
    if (q){
      const inRow = `${r.client_name} ${r.phone} ${r.selected_car} ${r.summary}`.toLowerCase()
      if (!inRow.includes(q)) return false
    }
    return true
  })
}

export function computeAnalytics(rows){
  const total = rows.length
  const high = rows.filter(r=>r.lead_quality==='high').length
  const conversion = total ? Math.round(high/total*100) : 0

  const bySource = {}
  rows.forEach(r=>{
    const k = r.source || 'unknown'
    bySource[k] = (bySource[k]||0) + 1
  })

  const map = {}
  rows.forEach(r=>{
    const d = parseTs(r.timestamp)
    if (!d) return
    const key = d.format('YYYY-MM-DD')
    map[key] = (map[key]||0)+1
  })
  const timeline = Object.entries(map)
    .sort(([a],[b])=>a.localeCompare(b))
    .map(([date,value])=>({date,value}))

  const models = {}
  rows.forEach(r=>{
    const k = r.selected_car || '—'
    models[k] = (models[k]||0)+1
  })
  const topModels = Object.entries(models)
    .sort((a,b)=>b[1]-a[1]).slice(0,5)
    .map(([name,value])=>({name,value}))

  const hours = Array.from({length:24}, (_,h)=>({hour: String(h).padStart(2,'0'), value:0}))
  rows.forEach(r=>{
    const d = parseTs(r.timestamp)
    if (!d) return
    const h = d.format('HH')
    const i = Number(h)
    if (!Number.isNaN(i)) hours[i].value++
  })

  return {
    total, high, conversion,
    bySource, timeline, topModels, hours,
    has: { source: Object.keys(bySource).length>0, created: timeline.length>0 }
  }
}
