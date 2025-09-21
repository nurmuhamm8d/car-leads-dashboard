import clsx from 'clsx'

const qColor = (q) => ({
  high: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  medium: 'bg-amber-50 text-amber-700 border-amber-200',
  low: 'bg-slate-50 text-slate-600 border-slate-200',
  unknown: 'bg-slate-50 text-slate-500 border-slate-200',
}[String(q || 'unknown').toLowerCase()] || 'bg-slate-50 text-slate-500 border-slate-200')

export default function LeadsTable({ rows, onRowClick }) {
  return (
    <div className="table-scroll">
      <table className="pretty-table">
        <thead>
          <tr>
            <th>client_name</th>
            <th>Phone</th>
            <th>selected_car</th>
            <th>summary</th>
            <th>lead_quality</th>
            <th>timestamp</th>
            <th>Source</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} onClick={() => onRowClick?.(r)}>
              <td className="font-medium">{r.client_name || '—'}</td>
              <td className="whitespace-nowrap">{r.phone || 'Не указан'}</td>
              <td className="whitespace-nowrap">{r.selected_car || '—'}</td>
              <td className="max-w-[800px]">{r.summary}</td>
              <td>
                <span className={clsx('badge', qColor(r.lead_quality))}>
                  {r.lead_quality || 'unknown'}
                </span>
              </td>
              <td className="whitespace-nowrap">{r.timestamp || '—'}</td>
              <td className="whitespace-nowrap">{r.source || r.Source || '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="p-4 flex justify-end">
        <button className="btn">Экспорт текущей страницы в PDF</button>
      </div>
    </div>
  )
}
