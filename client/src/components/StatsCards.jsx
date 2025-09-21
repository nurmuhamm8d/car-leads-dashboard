export default function StatsCards({ total = 0, high = 0, conversion = 0 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="card p-6">
        <div className="text-sm text-slate-500">Всего лидов</div>
        <div className="mt-2 text-3xl font-semibold">{total}</div>
      </div>
      <div className="card p-6">
        <div className="text-sm text-slate-500">Высокое качество</div>
        <div className="mt-2 text-3xl font-semibold text-emerald-600">{high}</div>
      </div>
      <div className="card p-6">
        <div className="text-sm text-slate-500">Конверсия в высокие</div>
        <div className="mt-2 text-3xl font-semibold">{conversion}%</div>
      </div>
    </div>
  )
}
