
export function qualityBadge(q) {
    const v = (q || '').toString().toLowerCase();
    const base = 'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1';
    if (v.includes('высок') || v === 'high')
      return `${base} bg-emerald-500/15 text-emerald-300 ring-emerald-400/30`;
    if (v.includes('хорош')) 
      return `${base} bg-sky-500/15 text-sky-300 ring-sky-400/30`;
    if (v.includes('средн') || v === 'medium')
      return `${base} bg-amber-500/15 text-amber-300 ring-amber-400/30`;
    return `${base} bg-rose-500/15 text-rose-300 ring-rose-400/30`;
  }
  
  export function sourcePill(src) {
    const s = (src || '').toString().toLowerCase();
    const base = 'inline-flex items-center rounded-full px-2 py-1 text-xs ring-1';
    if (s.includes('amo')) return `${base} bg-cyan-500/10 text-cyan-300 ring-cyan-400/30`;
    if (s.includes('tele')) return `${base} bg-indigo-500/10 text-indigo-300 ring-indigo-400/30`;
    return `${base} bg-slate-500/10 text-slate-300 ring-slate-400/30`;
  }
  