import React from 'react';

export default function FiltersBar({
  q, setQ,
  quality, setQuality,
  source, setSource,
  model, setModel,
  dateFrom, setDateFrom,
  dateTo, setDateTo,
  onClear
}) {
  return (
    <div className="card p-4 flex flex-wrap gap-3 items-center">
      <input
        value={q} onChange={e => setQ(e.target.value)}
        placeholder="Имя или телефон"
        className="input flex-1 min-w-[220px]"
      />
      <select className="select" value={quality} onChange={e => setQuality(e.target.value)}>
        <option value="">Качество: все</option>
        <option>Высокий</option>
        <option>Хороший</option>
        <option>Средний</option>
        <option>Низкий</option>
      </select>
      <select className="select" value={source} onChange={e => setSource(e.target.value)}>
        <option value="">Источник: все</option>
        <option>AmoLine</option>
        <option>telegramm</option>
      </select>
      <input
        value={model} onChange={e => setModel(e.target.value)}
        placeholder="Модель"
        className="input w-[180px]"
      />
      <input
        type="date"
        className="input w-[130px] sm:w-[160px] md:w-[180px]"
        value={dateFrom}
        onChange={e => setDateFrom(e.target.value)}
        placeholder="ДД.ММ.ГГГГ"
      />
      <input
        type="date"
        className="input w-[130px] sm:w-[160px] md:w-[180px]"
        value={dateTo}
        onChange={e => setDateTo(e.target.value)}
        placeholder="ДД.ММ.ГГГГ"
      />
      <button className="btn ml-auto" onClick={onClear}>Сбросить</button>
    </div>
  );
}
