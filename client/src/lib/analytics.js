import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
dayjs.extend(customParseFormat)

export function normalizeLead(raw = {}) {
  const obj = lowerKeys(raw)
  return {
    client_name: pick(obj, ['client_name', 'client', 'name']) || 'Не указан',
    phone: pick(obj, ['phone', 'client_phone', 'tel']) || 'Не указан',
    selected_car: pick(obj, ['selected_car', 'model', 'car', 'vehicle']) || '—',
    summary: pick(obj, ['summary', 'comment', 'notes', 'note']) || '',
    lead_quality: mapQuality(pick(obj, ['lead_quality', 'quality', 'grade']) || ''),
    source: pick(obj, ['source', 'lead_source', 'channel', 'utm_source']) || '',
    created_at: normalizeDate(pick(obj, ['timestamp', 'created_at', 'date', 'created', 'datetime']) || '')
  }
}

export function computeAnalytics(rows = []) {
  const data = rows.map(normalizeLead)
  const total = data.length
  const high = data.filter(r => r.lead_quality === 'high').length
  const conversion = total ? Math.round((high / total) * 100) : 0

  const bySource = countBy(data.filter(r => r.source), r => r.source)

  const dated = data.filter(r => r.created_at)
  const byDay = countBy(dated, r => dayjs(r.created_at).format('YYYY-MM-DD'))
  const timeline = Object.entries(byDay).sort((a, b) => a[0].localeCompare(b[0])).map(([date, value]) => ({ date, value }))

  const byModel = countBy(data, r => r.selected_car || '—')
  const topModels = Object.entries(byModel).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([name, value]) => ({ name, value }))

  const byHour = countBy(dated, r => dayjs(r.created_at).format('HH'))
  const hours = Array.from({ length: 24 }, (_, h) => String(h).padStart(2, '0')).map(h => ({ hour: h, value: byHour[h] || 0 }))

  return {
    total, high, conversion,
    bySource, timeline, topModels, hours,
    has: { source: Object.keys(bySource).length > 0, created: dated.length > 0 }
  }
}

export function filterRows(rows, { q = '', quality = 'all', source = 'all', model = 'all', from = null, to = null }) {
  const s = q.trim().toLowerCase()
  return rows.map(normalizeLead).filter(x => {
    if (s) {
      const hay = [x.client_name, x.phone, x.selected_car, x.summary].join(' ').toLowerCase()
      if (!hay.includes(s)) return false
    }
    if (quality !== 'all' && (x.lead_quality || '') !== quality) return false
    if (source !== 'all' && (x.source || '') !== source) return false
    if (model !== 'all' && (x.selected_car || '—') !== model) return false
    if (from || to) {
      if (!x.created_at) return false
      const d = dayjs(x.created_at)
      if (from && d.isBefore(dayjs(from), 'day')) return false
      if (to && d.isAfter(dayjs(to), 'day')) return false
    }
    return true
  })
}

export function collectFacetOptions(rows) {
  const data = rows.map(normalizeLead)
  const qualities = unique(data.map(x => x.lead_quality).filter(Boolean))
  const sources = unique(data.map(x => x.source).filter(Boolean))
  const models = unique(data.map(x => x.selected_car || '—'))
  return { qualities, sources, models }
}

function mapQuality(v = '') {
  const s = String(v).toLowerCase()
  if (['высокий', 'high', 'горячий', 'горячее', 'высокое'].includes(s)) return 'high'
  if (['хороший', 'средний', 'medium', 'warm', 'тёплый', 'теплый', 'среднее'].includes(s)) return 'medium'
  if (['низкий', 'low', 'cold', 'холодный'].includes(s)) return 'low'
  return 'unknown'
}

function normalizeDate(v = '') {
  if (!v) return null
  const formats = [
    'DD.MM.YYYY, H:mm',
    'DD.MM.YYYY H:mm',
    'DD.MM.YYYY',
    'D.M.YYYY, H:mm',
    'YYYY-MM-DDTHH:mm:ssZ',
    'YYYY-MM-DDTHH:mm:ss.SSSZ'
  ]
  for (const f of formats) {
    const d = dayjs(v, f, true)
    if (d.isValid()) return d.toISOString()
  }
  const d2 = dayjs(v)
  return d2.isValid() ? d2.toISOString() : null
}

function lowerKeys(o) { const out = {}; Object.entries(o || {}).forEach(([k, v]) => out[String(k).trim().toLowerCase()] = v); return out }
function pick(obj, keys) { for (const k of keys) if (obj[k] !== undefined && obj[k] !== null && obj[k] !== '') return obj[k]; return '' }
function countBy(arr, getKey) { const m = {}; for (const it of arr) { const k = getKey(it) || ''; m[k] = (m[k] || 0) + 1 } return m }
function unique(arr) { return Array.from(new Set(arr)).filter(Boolean).sort() }
