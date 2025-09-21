import { parse } from 'csv-parse/sync'

export function parseCsv(text) {
  const rows = parse(text, { columns: true, skip_empty_lines: true, trim: true })
  return rows.map(normalize)
}

function normalize(row) {
  const r = lowerKeys(row)
  return {
    client_name: pick(r, ['client_name', 'client', 'name']) || '',
    phone: pick(r, ['phone', 'client_phone', 'tel']) || '',
    selected_car: pick(r, ['selected_car', 'model', 'car', 'vehicle']) || '',
    summary: pick(r, ['summary', 'comment', 'notes', 'note']) || '',
    lead_quality: pick(r, ['lead_quality', 'quality', 'grade']) || '',
    source: pick(r, ['source', 'lead_source', 'channel', 'utm_source']) || '',
    created_at: pick(r, ['timestamp', 'created_at', 'date', 'created', 'datetime']) || ''
  }
}

function lowerKeys(obj) {
  const out = {}
  for (const [k, v] of Object.entries(obj || {})) out[String(k).toLowerCase().trim()] = v
  return out
}
function pick(obj, keys) {
  for (const k of keys) if (obj[k] !== undefined && obj[k] !== null && obj[k] !== '') return obj[k]
  return ''
}
