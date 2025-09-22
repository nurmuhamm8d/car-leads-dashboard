import express from 'express'
import cors from 'cors'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { parse } from 'csv-parse/sync'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
app.use(cors())

const dataPath = path.join(__dirname, '../data/car_leads.csv')

function readLeads() {
  const csv = fs.readFileSync(dataPath, 'utf8')
  const rows = parse(csv, { columns: true, skip_empty_lines: true })
  return rows.map(r => ({
    client_name: r.client_name || r.name || '',
    Phone: r.Phone || r.phone || '',
    selected_car: r.selected_car || r.model || '',
    lead_quality: r.lead_quality || r.quality || '',
    timestamp: r.timestamp || r.date || '',
    Source: r.Source || r.source || '',
    summary: r.summary || r.description || ''
  }))
}

app.get('/api/leads', (_req, res) => {
  try {
    const items = readLeads()
    res.json({ items })
  } catch (e) {
    res.status(500).json({ error: String(e) })
  }
})

const PORT = process.env.PORT ? Number(process.env.PORT) : 3001
app.listen(PORT, () => {
  console.log(`API http://localhost:${PORT}`)
})
