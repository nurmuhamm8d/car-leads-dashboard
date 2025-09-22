import express from 'express'
import cors from 'cors'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { parse } from 'csv-parse'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
app.use(cors())

const csvPath = path.resolve(__dirname, '../data/car_leads.csv')
const PORT = Number(process.env.PORT || 3001)

function readCsv() {
  return new Promise((resolve) => {
    if (!fs.existsSync(csvPath)) return resolve([])
    const rows = []
    fs.createReadStream(csvPath, { encoding: 'utf8' })
      .pipe(parse({ columns: true, skip_empty_lines: true, trim: true }))
      .on('data', (r) => rows.push(r))
      .on('end', () => resolve(rows))
      .on('error', () => resolve([]))
  })
}

app.get('/api/leads', async (req, res) => {
  const items = await readCsv()
  res.json({ items })
})

app.listen(PORT, () => {
  console.log(`API http://localhost:${PORT}`)
})
