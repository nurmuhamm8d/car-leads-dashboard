import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
dayjs.extend(customParseFormat)

function parseTs(ts){
  const d = dayjs(String(ts).trim(),'DD.MM.YYYY, HH:mm:ss',true)
  return d.isValid() ? d : null
}

export function normalizeLead(r){
  return {
    client_name: r.client_name ?? '',
    phone: r.phone ?? '',
    selected_car: r.selected_car ?? '',
    summary: r.summary ?? '',
    lead_quality: r.lead_quality ?? 'unknown',
    timestamp: r.timestamp ?? '',
    source: r.Source ?? r.source ?? 'unknown'
  }
}

export function collectFacetOptions(raw){
  const src = new Set(), mdl = new Set(), q = new Set()
  raw.forEach(r=>{
    if(r.source) src.add(r.source)
    if(r.Source) src.add(r.Source)
    if(r.selected_car) mdl.add(r.selected_car)
    if(r.lead_quality) q.add(r.lead_quality)
  })
  return {
    sources: Array.from(src).sort(),
    models: Array.from(mdl).sort(),
    qualities: Array.from(q).sort()
  }
}

export function filterRows(raw, f){
  const q = (raw||[]).map(normalizeLead)
  return q.filter(r=>{
    if(f.q){
      const s = `${r.client_name} ${r.phone} ${r.summary}`.toLowerCase()
      if(!s.includes(f.q.toLowerCase())) return false
    }
    if(f.quality!=='all' && r.lead_quality!==f.quality) return false
    const src = r.source
    if(f.source!=='all' && src!==f.source) return false
    if(f.model!=='all' && r.selected_car!==f.model) return false
    if(f.from){
      const d=parseTs(r.timestamp); if(d && d.isBefore(dayjs(f.from))) return false
    }
    if(f.to){
      const d=parseTs(r.timestamp); if(d && d.isAfter(dayjs(f.to))) return false
    }
    return true
  })
}

export function computeAnalytics(rows){
  const bySource = {}
  const byDay = {}
  const byHour = {}
  const byModel = {}
  let total = rows.length
  let high = 0

  rows.forEach(r=>{
    const src = r.source || 'unknown'
    bySource[src]=(bySource[src]||0)+1
    const m = r.selected_car || '—'
    byModel[m]=(byModel[m]||0)+1
    if(String(r.lead_quality).toLowerCase()==='high') high++
    const d=parseTs(r.timestamp)
    if(d){
      const dk=d.format('YYYY-MM-DD')
      byDay[dk]=(byDay[dk]||0)+1
      const hk=d.format('HH')
      byHour[hk]=(byHour[hk]||0)+1
    }
  })

  const timeline = Object.entries(byDay).sort(([a],[b])=>a.localeCompare(b)).map(([date,value])=>({date,value}))
  const topModels = Object.entries(byModel).sort((a,b)=>b[1]-a[1]).slice(0,5).map(([name,value])=>({name,value}))
  const hours = Array.from({length:24},(_,i)=>String(i).padStart(2,'0')).map(h=>({hour:h,value:byHour[h]||0}))
  const conversion = total ? Math.round(high*100/total) : 0

  return {
    total,
    high,
    conversion,
    bySource: bySource,
    timeline,
    topModels,
    hours
  }
}
