export default function LeadModal({ open, onClose, lead }) {
  if (!open) return null
  const L = lead || {}
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 w-full max-w-2xl" onClick={e=>e.stopPropagation()}>
        <div className="text-xl font-semibold mb-2">{L.client_name}</div>
        <div className="text-sm text-zinc-400 mb-4">{L.selected_car}</div>
        <div className="space-y-2">
          <Row k="Телефон" v={L.phone} />
          <Row k="Качество" v={L.quality} />
          <Row k="Источник" v={L.source} />
          <Row k="Дата" v={L.created_at ? new Date(L.created_at).toLocaleString() : '—'} />
          <div className="text-sm whitespace-pre-wrap leading-relaxed">{L.summary || '—'}</div>
        </div>
        <div className="mt-6 flex justify-end">
          <button className="px-4 py-2 rounded-xl bg-zinc-100 text-black" onClick={onClose}>Закрыть</button>
        </div>
      </div>
    </div>
  )
}

function Row({k,v}) {
  return (
    <div className="text-sm flex gap-3">
      <div className="text-zinc-500 w-24">{k}</div>
      <div>{v || '—'}</div>
    </div>
  )
}
