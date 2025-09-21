export default function StatsCards({ total, high, conversion }) {
  const Item = ({ title, value, icon }) => (
    <div className="card">
      <div className="muted">{title}</div>
      <div style={{display:'flex', alignItems:'baseline', gap:12, marginTop:6}}>
        <div style={{fontSize:32, fontWeight:800}}>{value}</div>
        {icon}
      </div>
    </div>
  )

  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
      <Item title="Всего лидов" value={total ?? 0} />
      <Item title="Высокое качество" value={high ?? 0} />
      <Item title="Конверсия в высокие" value={`${Math.round((conversion ?? 0)*100)}%`} />
      <Item title="Обновления активны" value="✓" />
    </div>
  )
}
