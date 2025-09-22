import React from 'react';
import { qualityBadge, sourcePill } from '../lib/ui';
import { formatTs } from '../lib/time';

export default function LeadsTable({
  rows, page, pages, total, pageSize,
  setPage, setPageSize, sortKey, sortDir, onSort, onRow
}) {
  const H = (k, t) => (
    <th className="th">
      <button className="hover:opacity-80" onClick={() => onSort(k)}>
        {t}{sortKey === k ? (sortDir === 'asc' ? ' ↑' : ' ↓') : ''}
      </button>
    </th>
  );

  return (
    <div className="mt-6">
      <table className="table">
        <thead>
          <tr>
            {H('client_name', 'Клиент')}
            {H('Phone', 'Телефон')}
            {H('selected_car', 'Модель')}
            {H('lead_quality', 'Качество')}
            {H('Source', 'Источник')}
            {H('timestamp', 'Дата')}
            {H('summary', 'Описание')}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="align-top cursor-pointer" onClick={() => onRow(r)}>
              <td className="td td-first min-w-[160px] text-base">
                <div className="font-semibold truncate max-w-[220px]">{r.client_name || '—'}</div>
              </td>
              <td className="td min-w-[140px] text-base tabular-nums">
                <div className="truncate max-w-[180px]">{r.Phone || '—'}</div>
              </td>
              <td className="td min-w-[180px]">
                <div className="truncate max-w-[240px]">{r.selected_car || '—'}</div>
              </td>
              <td className="td w-[120px]">
                <span className={qualityBadge(r.lead_quality)}>{r.lead_quality || '—'}</span>
              </td>
              <td className="td w-[120px]">
                <span className={sourcePill(r.Source)}>{r.Source || '—'}</span>
              </td>
              <td className="td min-w-[120px] w-[140px] sm:w-[160px] md:w-[180px] tabular-nums">
                <div className="whitespace-nowrap">{formatTs(r.timestamp)}</div>
              </td>
              <td className="td td-last min-w-[420px] max-w-[900px] text-base">
                <div className="line-clamp-2">{r.summary || '—'}</div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 flex items-center justify-between">
        <div className="text-xs text-[var(--muted)]">Всего: {total}</div>
        <div className="flex items-center gap-2">
          <button className="btn" onClick={() => setPage(1)} disabled={page <= 1}>«</button>
          <button className="btn" onClick={() => setPage(page - 1)} disabled={page <= 1}>‹</button>
          <div className="pill">{page} / {pages}</div>
          <button className="btn" onClick={() => setPage(page + 1)} disabled={page >= pages}>›</button>
          <button className="btn" onClick={() => setPage(pages)} disabled={page >= pages}>»</button>
          <select
            className="select"
            value={pageSize}
            onChange={e => setPageSize(Number(e.target.value))}
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
      </div>
    </div>
  );
}
