export async function getLeads() {
  const r = await fetch('/api/leads')
  const j = await r.json()
  return Array.isArray(j) ? j : j.items || []
}
