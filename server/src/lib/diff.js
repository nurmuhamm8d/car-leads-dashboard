import crypto from 'node:crypto'

export function detectNewHighLeads(prev = [], next = [], isHigh) {
  const H = x => isHigh(x)
  const map = new Set(prev.filter(H).map(keyLead))
  const incoming = next.filter(H).filter(x => !map.has(keyLead(x)))
  return incoming
}

function keyLead(x){
  const s = [x.client_name, x.phone, x.selected_car, x.summary].map(v=>String(v||'').trim()).join('|')
  return crypto.createHash('sha1').update(s).digest('hex')
}
