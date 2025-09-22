export const qualityBadge = q => {
    const v=(q||'').toString().toLowerCase()
    if(v==='high'||q==='Высокий') return 'badge bg-green-700/30 text-green-300 border-green-700/50'
    if(q==='Хороший'||v==='good') return 'badge bg-sky-700/30 text-sky-300 border-sky-700/50'
    if(q==='Средний'||v==='medium') return 'badge bg-amber-700/30 text-amber-300 border-amber-700/50'
    if(q==='Низкий'||v==='low') return 'badge bg-red-700/30 text-red-300 border-red-700/50'
    return 'badge bg-[var(--panel)] text-[var(--muted)]'
  }
  export const sourcePill = s => 'pill'
  