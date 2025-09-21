export async function fetchLeads() {
  const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000'
  const res = await fetch(`${base}/api/leads`)
  if (!res.ok) throw new Error('Failed to load leads')
  return res.json()
}
