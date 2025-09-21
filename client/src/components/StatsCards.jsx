export default function StatsCards({ total, high, conversion }){
  const cards = [
    { k:'Всего лидов',  v: total,       tone:'gray' },
    { k:'Высокое качество', v: high,    tone:'green' },
    { k:'Конверсия в высокие', v: `${conversion}%`, tone:'amber' },
    { k:'Обновление', v:'в реальном времени', tone:'gray' },
  ]
  return (
    <div className="grid-2">
      {cards.map((c,i)=>(
        <div key={i} className="stat">
          <div className="k">{c.k}</div>
          <div className="v">{c.v}</div>
        </div>
      ))}
    </div>
  )
}
