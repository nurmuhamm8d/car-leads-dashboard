import React from 'react'

export default function StatsCards({ total=0, high=0, conversion=0 }) {
  return (
    <div className="grid-2">
      <div className="card kpi">
        <div className="icon">👥</div>
        <div>
          <div className="val">{total}</div>
          <div className="lbl">Всего лидов</div>
        </div>
      </div>
      <div className="card kpi">
        <div className="icon">⭐</div>
        <div>
          <div className="val">{high}</div>
          <div className="lbl">Высокое качество</div>
        </div>
      </div>
      <div className="card kpi">
        <div className="icon">📈</div>
        <div>
          <div className="val">{conversion}%</div>
          <div className="lbl">Конверсия в высокие</div>
        </div>
      </div>
      <div className="card kpi">
        <div className="icon">⏱️</div>
        <div>
          <div className="val">实时</div>
          <div className="lbl">Обновление в реальном времени</div>
        </div>
      </div>
    </div>
  )
}
