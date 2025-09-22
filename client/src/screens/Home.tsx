import React, { useEffect, useMemo, useRef, useState } from 'react';
import Header from '../components/Header';
import StatsCards from '../components/StatsCards';
import FiltersBar from '../components/FiltersBar';
import LeadsTable from '../components/LeadsTable';
import ChartsPanel from '../components/ChartsPanel';
import LeadModal from '../components/LeadModal';
import { getLeads } from '../lib/api';
import { parseTs } from '../lib/time';

type Lead = {
  client_name?: string;
  Phone?: string;
  selected_car?: string;
  lead_quality?: string;
  timestamp?: any;
  Source?: string;
  summary?: string;
};

export default function Home() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  // filters
  const [q, setQ] = useState('');
  const [quality, setQuality] = useState('');
  const [source, setSource] = useState('');
  const [model, setModel] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // sorting / paging
  const [sortKey, setSortKey] = useState<'timestamp' | 'client_name' | 'Phone' | 'selected_car' | 'lead_quality' | 'Source' | 'summary'>('timestamp');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  // modal
  const [modal, setModal] = useState<{ open: boolean; item: Lead | null }>({ open: false, item: null });
  const printRef = useRef<HTMLDivElement>(null);

  // ---- data ----
  const load = async () => {
    const all = await getLeads();
    // сервер может вернуть { items: [...] } или массив
    setLeads(Array.isArray(all) ? (all as Lead[]) : ((all?.items ?? []) as Lead[]));
    setLastUpdated(new Date().toLocaleString('ru-RU'));
  };

  useEffect(() => { load(); }, []);
  useEffect(() => { const t = setInterval(load, 30000); return () => clearInterval(t); }, []);

  // ---- filtering ----
  const filtered = useMemo(
    () =>
      leads.filter((r) => {
        const okQ = q ? ((r.client_name || '').toLowerCase().includes(q.toLowerCase()) || (r.Phone || '').includes(q)) : true;
        const okQual = quality ? r.lead_quality === quality : true;
        const okSrc = source ? r.Source === source : true;
        const okModel = model ? (r.selected_car || '').toLowerCase().includes(model.toLowerCase()) : true;

        const t = parseTs(r.timestamp).getTime();
        const okFrom = dateFrom ? t >= new Date(dateFrom).getTime() : true;
        const okTo = dateTo ? t <= new Date(dateTo).getTime() : true;
        return okQ && okQual && okSrc && okModel && okFrom && okTo;
      }),
    [leads, q, quality, source, model, dateFrom, dateTo]
  );

  // ---- sorting ----
  const sorted = useMemo(() => {
    const arr = [...filtered];
    arr.sort((a, b) => {
      if (sortKey === 'timestamp') {
        const da = parseTs(a.timestamp).getTime();
        const db = parseTs(b.timestamp).getTime();
        return sortDir === 'asc' ? da - db : db - da;
      }
      const A = (a[sortKey] || '').toString();
      const B = (b[sortKey] || '').toString();
      return sortDir === 'asc' ? A.localeCompare(B) : B.localeCompare(A);
    });
    return arr;
  }, [filtered, sortKey, sortDir]);

  // ---- paging ----
  const pages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const paged = useMemo(() => sorted.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize), [sorted, page, pageSize]);
  useEffect(() => { if (page > pages) setPage(pages); }, [pages, page]);

  // ---- analytics (всё от sorted) ----
  const byQuality = useMemo(
    () => sorted.reduce((m: Record<string, number>, r) => { const k = r.lead_quality || '—'; m[k] = (m[k] || 0) + 1; return m; }, {}),
    [sorted]
  );

  const byDay = useMemo(() => {
    const m = new Map<string, number>();
    for (const r of sorted) {
      const d = parseTs(r.timestamp);
      if (isNaN(d.getTime())) continue;
      // показываем «как в данных CSV» — никаких принудительных правок года
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      const k = `${yyyy}-${mm}-${dd}`;
      m.set(k, (m.get(k) || 0) + 1);
    }
    return Array.from(m.entries())
      .map(([day, count]) => ({ day, count }))
      .sort((a, b) => a.day.localeCompare(b.day));
  }, [sorted]);

  const bySource = useMemo(() => {
    const m = sorted.reduce<Record<string, number>>((a, r) => { const k = r.Source || '—'; a[k] = (a[k] || 0) + 1; return a; }, {});
    return Object.entries(m).map(([name, value]) => ({ name, value }));
  }, [sorted]);

  const topModels = useMemo(() => {
    const m = sorted.reduce<Record<string, number>>((a, r) => { const k = r.selected_car || '—'; a[k] = (a[k] || 0) + 1; return a; }, {});
    return Object.entries(m).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 5);
  }, [sorted]);

  const byHour = useMemo(() => {
    const m: Record<string, number> = {};
    for (const r of sorted) {
      const d = parseTs(r.timestamp);
      if (isNaN(d.getTime())) continue;
      const h = String(d.getHours()).padStart(2, '0');
      m[h] = (m[h] || 0) + 1;
    }
    return Array.from({ length: 24 }, (_, i) => ({ hour: String(i).padStart(2, '0'), value: m[String(i).padStart(2, '0')] || 0 }));
  }, [sorted]);

  const bySourceQuality = useMemo(() => {
    const s: Record<string, { h: number; t: number }> = {};
    for (const r of sorted) {
      const k = r.Source || '—';
      s[k] = s[k] || { h: 0, t: 0 };
      s[k].t += 1;
      const q = (r.lead_quality || '').toLowerCase();
      if (q.includes('высок') || q === 'high') s[k].h += 1;
    }
    return Object.entries(s).map(([name, { h, t }]) => ({ name, value: t ? Math.round(100 * h / t) : 0 }));
  }, [sorted]);

  // ---- ui handlers ----
  const onSort = (key: typeof sortKey) => {
    if (sortKey === key) setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
    setPage(1);
  };

  // КРАСИВЫЙ PDF через pdfmake (динамический импорт + шрифты из vfs)
  const onExport = async () => {
    const [pdfMakeMod, pdfFontsMod] = await Promise.all([
      import('pdfmake/build/pdfmake'),
      import('pdfmake/build/vfs_fonts'),
    ]);
    const pdfMake = pdfMakeMod.default;
    const pdfFonts = pdfFontsMod.default;

    // В pdfmake 0.2.x рекомендуется addVirtualFileSystem; в 0.1.x часто используют pdfMake.vfs = pdfFonts.pdfMake.vfs.
    // Покроем оба варианта.
    if (typeof pdfMake.addVirtualFileSystem === 'function') {
      pdfMake.addVirtualFileSystem(pdfFonts);
    } else {
      // @ts-ignore
      pdfMake.vfs = pdfFonts?.pdfMake?.vfs ?? pdfFonts?.vfs;
    }

    const headerRow = [
      { text: 'Клиент', bold: true, color: '#ffffff' },
      { text: 'Телефон', bold: true, color: '#ffffff' },
      { text: 'Модель', bold: true, color: '#ffffff' },
      { text: 'Качество', bold: true, color: '#ffffff' },
      { text: 'Источник', bold: true, color: '#ffffff' },
      { text: 'Дата', bold: true, color: '#ffffff' },
      { text: 'Описание', bold: true, color: '#ffffff' },
    ];

    const body = sorted.map((r) => [
      r.client_name || '—',
      r.Phone || '—',
      r.selected_car || '—',
      r.lead_quality || '—',
      r.Source || '—',
      new Date(parseTs(r.timestamp)).toLocaleString('ru-RU'),
      (r.summary || '').toString(),
    ]);

    const docDefinition: any = {
      info: { title: 'Leads', author: 'Car Leads Dashboard' },
      pageSize: 'A4',
      pageMargins: [26, 28, 26, 32],
      defaultStyle: { font: 'Roboto', fontSize: 9, color: '#0b1220' },
      content: [
        {
          columns: [
            { text: `Leads (${sorted.length})`, style: 'title' },
            { text: new Date().toLocaleString('ru-RU'), style: 'updated', alignment: 'right' },
          ],
          margin: [0, 0, 0, 10],
        },
        {
          layout: {
            fillColor: (rowIndex: number) => (rowIndex === 0 ? '#26358a' : rowIndex % 2 === 0 ? '#f6f8ff' : null),
            hLineColor: () => '#dbe1f0',
            vLineColor: () => '#dbe1f0',
          },
          table: {
            headerRows: 1,
            widths: [90, 95, 100, 70, 70, 90, '*'], // адаптив — последняя колонка растягивается
            body: [headerRow, ...body],
          },
        },
      ],
      styles: {
        title: { fontSize: 14, bold: true, color: '#0b1220' },
        updated: { fontSize: 9, color: '#6b7280' },
      },
    };

    pdfMake.createPdf(docDefinition).download('leads.pdf');
  };

  return (
    <div className="p-5 space-y-6">
      <Header lastUpdated={lastUpdated} onExport={onExport} />

      <StatsCards total={sorted.length} byQuality={byQuality} lastUpdated={lastUpdated} />

      {/* тонкая разделительная полоса */}
      <div className="card h-2 relative z-[0]"><div className="w-full h-full bg-[var(--accent)]/30" /></div>

      <FiltersBar
        q={q} setQ={setQ}
        quality={quality} setQuality={setQuality}
        source={source} setSource={setSource}
        model={model} setModel={setModel}
        dateFrom={dateFrom} setDateFrom={setDateFrom}
        dateTo={dateTo} setDateTo={setDateTo}
        onClear={() => { setQ(''); setQuality(''); setSource(''); setModel(''); setDateFrom(''); setDateTo(''); setPage(1); }}
      />

      <ChartsPanel
        byDay={byDay}
        bySource={bySource}
        topModels={topModels}
        byHour={byHour}
        bySourceQuality={bySourceQuality}
      />

      <LeadsTable
        rows={paged}
        page={page}
        pages={pages}
        total={sorted.length}
        pageSize={pageSize}
        setPage={setPage}
        setPageSize={(n: number) => { setPageSize(n); setPage(1); }}
        sortKey={sortKey}
        sortDir={sortDir}
        onSort={onSort}
        onRow={(it: Lead) => setModal({ open: true, item: it })}
      />

      <div ref={printRef} />
      <LeadModal open={modal.open} item={modal.item} onClose={() => setModal({ open: false, item: null })} />
    </div>
  );
}
