import React from 'react'

function QualityBadge({q}){
  const t = (q||'unknown').toLowerCase()
  const tone = t==='high' ? 'green' : t==='medium' ? 'amber' : t==='low' ? 'red' : 'gray'
  const label = t==='high' ? 'high' : t==='medium' ? 'medium' : t==='low' ? 'low' : 'unknown'
  return <span className={`badge ${tone}`}>{label}</span>
}

export default function LeadsTable({ rows, onRowClick }){
  const [page, setPage] = React.useState(0)
  const [size, setSize] = React.useState(10)

  const total = rows.length
  const pages = Math.max(1, Math.ceil(total/size))
  const from = page*size
  const to = Math.min(total, from+size)
  const pageRows = rows.slice(from, to)

  React.useEffect(()=>{
    if (page>0 && from>=total) setPage(0)
  },[total,size])

  return (
    <div className="table-wrap">
      <table className="table">
        <thead>
          <tr>
            <th style={{width:160}}>client_name</th>
            <th style={{width:140}}>phone</th>
            <th style={{width:160}}>selected_car</th>
            <th>summary</th>
            <th style={{width:120}}>lead_quality</th>
            <th style={{width:130}}>timestamp</th>
            <th style={{width:130}}>Source</th>
          </tr>
        </thead>
        <tbody>
          {pageRows.map((r,idx)=>(
            <tr key={from+idx} onClick={()=>onRowClick?.(r)} style={{cursor:'pointer'}}>
              <td><div className="summary">{r.client_name}</div></td>
              <td className="muted">{r.phone}</td>
              <td className="muted">{r.selected_car}</td>
              <td><div className="summary">{r.summary}</div></td>
              <td><QualityBadge q={r.lead_quality}/></td>
              <td className="muted">{r.timestamp}</td>
              <td><span className="badge gray">{r.source||'unknown'}</span></td>
            </tr>
          ))}
          {pageRows.length===0 && (
            <tr><td colSpan={7} className="muted">Ничего не найдено</td></tr>
          )}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={7}>
              <div className="controls" style={{justifyContent:'space-between'}}>
                <div className="controls">
                  <button className="input" onClick={()=>setPage(p=>Math.max(0,p-1))} disabled={page===0}>←</button>
                  <div className="muted">Стр. {page+1} из {pages}</div>
                  <button className="input" onClick={()=>setPage(p=>Math.min(pages-1,p+1))} disabled={page===pages-1}>→</button>
                </div>
                <div className="controls">
                  <div className="muted">Показывать:</div>
                  <select className="select" value={size} onChange={e=>setSize(Number(e.target.value))}>
                    {[10,20,30,50].map(n=><option key={n} value={n}>{n}/стр</option>)}
                  </select>
                </div>
              </div>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  )
}
