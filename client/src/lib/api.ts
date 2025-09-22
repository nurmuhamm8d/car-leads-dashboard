export async function getLeads() {
  const url = `/api/leads?ts=${Date.now()}`; 
  const r = await fetch(url, { cache: 'no-store' });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  const data = await r.json();
  return Array.isArray(data) ? data : (data.items || []);
}
