import fetch from 'node-fetch'

export async function telegramSend({ token, chatId, text }) {
  if (!token || !chatId || !text) return false
  const url = `https://api.telegram.org/bot${token}/sendMessage`
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' })
  })
  return res.ok
}
