import React from 'react'

type Lead = {
  client_name?: string
  Phone?: string
  selected_car?: string
  lead_quality?: string
  timestamp?: any
  Source?: string
  summary?: string
}

export default function LeadModal({ open, onClose, item }: { open: boolean; onClose: () => void; item: Lead | null }) {
  if (!open || !item) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="card p-6 w-[720px] max-w-[95vw]">
        <div className="text-lg font-semibold mb-4">Карточка лида</div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div><div className="text-[var(--muted)]">Клиент</div><div className="font-medium">{item.client_name || '—'}</div></div>
          <div><div className="text-[var(--muted)]">Телефон</div><div className="font-medium">{item.Phone || '—'}</div></div>
          <div><div className="text-[var(--muted)]">Модель</div><div className="font-medium">{item.selected_car || '—'}</div></div>
          <div><div className="text-[var(--muted)]">Качество</div><div className="font-medium">{item.lead_quality || '—'}</div></div>
          <div><div className="text-[var(--muted)]">Источник</div><div className="font-medium">{item.Source || '—'}</div></div>
          <div className="col-span-2"><div className="text-[var(--muted)]">Описание</div><div className="font-medium">{item.summary || '—'}</div></div>
        </div>
        <div className="mt-6 text-right"><button className="btn" onClick={onClose}>Закрыть</button></div>
      </div>
    </div>
  )
}
