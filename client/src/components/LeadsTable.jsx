import React, { useMemo, useState } from 'react'

const PAGE_SIZES=[10,25,50]

export default function LeadsTable({ rows, onRowClick }) {
  const [page,setPage]=useState(1)
  const [pageSize,setPageSize]=useState(PAGE_SIZES[0])
  const totalPages=Math.max(1,Math.ceil(rows.length/pageSize))
  const slice=useMemo(()=>rows.slice((page-1)*pageSize,(page-1)*pageSize+pageSize),[rows,page,pageSize])
  return (
    <div className="table-wrap">
      <table className="table">
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
          {slice.map((r,i)=>(
            <tr key={i} onClick={()=>onRowClick(r)} style={{cursor:'pointer'}}>
              <td>{r.client_name||'—'}</td>
              <td>{r.phone||'—'}</td>
              <td>{r.selected_car||'—'}</td>
              <td>{r.summary||'—'}</td>
              <td><span className={`chip ${String(r.lead_quality||'').toLowerCase()}`}>{r.lead_quality||'—'}</span></td>
              <td>{r.timestamp||'—'}</td>
              <td>{r.source||'—'}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={7}>
              <div className="pagination">
                <select className="pill" value={pageSize} onChange={e=>{setPage(1);setPageSize(Number(e.target.value))}}>
                  {PAGE_SIZES.map(n=><option key={n} value={n}>{n}/стр</option>)}
                </select>
                <button className="pill" onClick={()=>setPage(p=>Math.max(1,p-1))}>←</button>
                <div className="subtle">Стр. {page} из {totalPages}</div>
                <button className="pill" onClick={()=>setPage(p=>Math.min(totalPages,p+1))}>→</button>
              </div>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  )
}
