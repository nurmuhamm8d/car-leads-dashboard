export function parseTs(ts: any): Date {
  if (ts instanceof Date) return ts
  if (typeof ts === 'number') return new Date(ts)
  if (typeof ts === 'string') return new Date(ts)
  return new Date(NaN)
}

export function formatTs(ts: any): string {
  const d = parseTs(ts)
  if (isNaN(d.getTime())) return '—'
  return d.toLocaleString()
}
