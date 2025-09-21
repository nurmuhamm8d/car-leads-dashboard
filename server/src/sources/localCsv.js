import fs from 'node:fs/promises'
import { parseCsv } from '../lib/csv.js'

export async function fetchLocalCsv(path) {
  const p = path || './data/car_leads.csv'
  const raw = await fs.readFile(p, 'utf8')
  return parseCsv(raw)
}
