import fetch from 'node-fetch'
import { parseCsv } from '../lib/csv.js'

export async function fetchGooglePublicCsv({ publicUrl, sheetId, gid }) {
  const url =
    publicUrl ||
    (sheetId ? `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid || 0}` : null)
  if (!url) return []
  const res = await fetch(url, { redirect: 'follow' })
  if (!res.ok) return []
  const text = await res.text()
  return parseCsv(text)
}
