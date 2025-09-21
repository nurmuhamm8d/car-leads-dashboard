import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { getCache, setCache } from './lib/cache.js'
import { fetchLocalCsv } from './sources/localCsv.js'
import { fetchGooglePublicCsv } from './sources/googlePublicCsv.js'
import { detectNewHighLeads } from './lib/diff.js'
import { telegramSend } from './notifiers/telegram.js'

const app = express()
app.use(cors({ origin: process.env.ALLOWED_ORIGIN || true }))

app.get('/api/health', (req, res) => {
  const { updatedAt } = getCache()
  res.json({ status: 'ok', updatedAt })
})

app.get('/api/leads', (req, res) => {
  const { data, updatedAt } = getCache()
  res.json({ data, updatedAt })
})

const interval = Number(process.env.REFRESH_INTERVAL_MS || 30000)

function normalizeQuality(v){
  const s = String(v||'').toLowerCase()
  if (['high','высокое','hot','горячий','горячее'].includes(s)) return 'high'
  if (['medium','среднее','warm','тёплый','теплый'].includes(s)) return 'medium'
  if (['low','низкое','cold','холодный'].includes(s)) return 'low'
  return 'unknown'
}

function isHigh(lead){
  const q = lead.lead_quality || lead.quality || ''
  return normalizeQuality(q) === (process.env.TELEGRAM_ALERT_QUALITY || 'high')
}

async function refresh() {
  const mode = (process.env.DATA_SOURCE || 'local').toLowerCase()
  let data = []
  if (mode === 'public') {
    const online = await fetchGooglePublicCsv({
      publicUrl: process.env.PUBLIC_CSV_URL,
      sheetId: process.env.SHEET_ID,
      gid: process.env.SHEET_GID
    }).catch(() => [])
    data = (online && online.length) ? online : await fetchLocalCsv(process.env.CSV_PATH)
  } else {
    data = await fetchLocalCsv(process.env.CSV_PATH)
  }

  const prev = getCache().data || []
  setCache(data)

  const newbies = detectNewHighLeads(prev, data, isHigh)
  if (newbies.length && process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID) {
    const lines = newbies.slice(0,5).map(x => `• ${x.client_name || '—'} — ${x.selected_car || '—'} (${x.phone || '—'})`).join('\n')
    const more = newbies.length > 5 ? `\n…и ещё ${newbies.length-5}` : ''
    const text = `<b>Новые high-лиды:</b>\n${lines}${more}`
    await telegramSend({ token: process.env.TELEGRAM_BOT_TOKEN, chatId: process.env.TELEGRAM_CHAT_ID, text })
  }
}

await refresh()
setInterval(refresh, interval)

const port = Number(process.env.PORT || 4000)
app.listen(port)
