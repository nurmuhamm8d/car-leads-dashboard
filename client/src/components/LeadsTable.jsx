import { createColumnHelper, flexRender, getCoreRowModel, getSortedRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table'
import { useMemo, useState } from 'react'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

const columnHelper = createColumnHelper()

export default function LeadsTable({ rows = [], onRowClick }) {
  const [sorting, setSorting] = useState([])
  const columns = useMemo(() => [
    columnHelper.accessor('client_name', { header: 'client_name' }),
    columnHelper.accessor('phone', { header: 'Phone' }),
    columnHelper.accessor('selected_car', { header: 'selected_car' }),
    columnHelper.accessor('summary', { header: 'summary' }),
    columnHelper.accessor('lead_quality', { header: 'lead_quality' }),
    columnHelper.accessor('created_at', { header: 'timestamp', cell: info => info.getValue() ? new Date(info.getValue()).toLocaleString() : '—' }),
    columnHelper.accessor('source', { header: 'Source' })
  ], [])

  const table = useReactTable({
    data: rows,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageIndex: 0, pageSize: 10 } }
  })

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-zinc-950 text-zinc-200">
            {table.getHeaderGroups().map(hg => (
              <tr key={hg.id}>
                {hg.headers.map(h => (
                  <th key={h.id} className="text-left px-3 py-2 cursor-pointer select-none" onClick={h.column.getToggleSortingHandler()}>
                    <div className="flex items-center gap-1">
                      {flexRender(h.column.columnDef.header, h.getContext())}
                      <Sort dir={h.column.getIsSorted()} />
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map(row => (
              <tr key={row.id} className="border-t border-zinc-800 odd:bg-zinc-900/40 hover:bg-zinc-800/60" onClick={() => onRowClick && onRowClick(row.original)}>
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="px-3 py-2 align-top">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button className="px-3 py-1 rounded bg-zinc-800" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>&larr;</button>
          <div className="text-sm">Стр. {table.getState().pagination.pageIndex + 1} из {table.getPageCount()}</div>
          <button className="px-3 py-1 rounded bg-zinc-800" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>&rarr;</button>
        </div>

        <select className="px-2 py-1 rounded bg-zinc-800" value={table.getState().pagination.pageSize} onChange={e => table.setPageSize(Number(e.target.value))}>
          {[10, 20, 50, 100].map(n => <option key={n} value={n}>{n}/стр</option>)}
        </select>

        <button className="px-3 py-1 rounded bg-zinc-100 text-black" onClick={() => exportPdf(table.getRowModel().rows.map(r => r.original))}>
          Экспорт текущей страницы в PDF
        </button>
      </div>
    </div>
  )
}

function Sort({ dir }) {
  if (!dir) return null
  return <span className="text-zinc-400">{dir === 'asc' ? '▲' : '▼'}</span>
}

async function exportPdf(rows) {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' })
  const base64 = await loadFontBase64('/fonts/NotoSans-Regular.ttf')
  doc.addFileToVFS('NotoSans-Regular.ttf', base64)
  doc.addFont('NotoSans-Regular.ttf', 'NotoSans', 'normal')
  doc.setFont('NotoSans')
  doc.setFontSize(16)
  doc.text('Car Leads — export', 40, 40)

  const body = rows.map(r => [
    r.client_name || '',
    r.phone || '',
    r.selected_car || '',
    r.summary || '',
    r.lead_quality || '',
    r.created_at ? new Date(r.created_at).toLocaleString() : '',
    r.source || ''
  ])

  autoTable(doc, {
    startY: 60,
    head: [['client_name', 'Phone', 'selected_car', 'summary', 'lead_quality', 'timestamp', 'Source']],
    body,
    styles: { font: 'NotoSans', fontSize: 9, cellPadding: 4, overflow: 'linebreak' },
    columnStyles: { 3: { cellWidth: 250 } },
    headStyles: { fillColor: [24, 119, 242], textColor: 255 }
  })

  doc.save('leads.pdf')
}

async function loadFontBase64(path) {
  const res = await fetch(new URL(path, import.meta.url))
  const buf = await res.arrayBuffer()
  let bin = ''
  const bytes = new Uint8Array(buf)
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i])
  return btoa(bin)
}
