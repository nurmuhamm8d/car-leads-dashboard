import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { parseTs } from './time';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

export type Lead = {
  client_name?: string;
  Phone?: string;
  selected_car?: string;
  lead_quality?: string;
  timestamp?: any;
  Source?: string;
  summary?: string;
};

const qualityStyle = (q?: string) => {
  const v = (q || '').toLowerCase();
  if (v.includes('высок') || v === 'high') return { color: '#22c55e', bold: true }; // зелёный
  if (v.includes('средн') || v === 'medium' || v === 'good') return { color: '#f59e0b', bold: true }; // янтарный
  if (v.includes('низк') || v === 'low' || v === 'плохой') return { color: '#9ca3af', bold: true }; // серый
  return {};
};

const clamp = (s: string, max = 350) =>
  (s || '').length > max ? (s || '').slice(0, max).trimEnd() + '…' : (s || '');

export function exportLeadsPdf(rows: Lead[]) {
  const head = [
    [
      { text: 'Клиент', style: 'th' },
      { text: 'Телефон', style: 'th' },
      { text: 'Модель', style: 'th' },
      { text: 'Качество', style: 'th', alignment: 'center' },
      { text: 'Источник', style: 'th' },
      { text: 'Дата', style: 'th' },
      { text: 'Описание', style: 'th' },
    ],
  ];

  const body = rows.map((r) => ([
    { text: r.client_name || '—' },
    { text: r.Phone || '—' },
    { text: r.selected_car || '—' },
    { text: r.lead_quality || '—', alignment: 'center', ...qualityStyle(r.lead_quality) },
    { text: r.Source || '—' },
    { text: new Date(parseTs(r.timestamp)).toLocaleString('ru-RU') },
    { text: clamp(String(r.summary || '')) },
  ]));

  const docDefinition: any = {
    pageSize: 'A4',
    pageMargins: [28, 64, 28, 42],
    header: (currentPage: number, pageCount: number) => ({
      margin: [28, 22, 28, 10],
      columns: [
        { text: 'Leads Dashboard — экспорт', style: 'title' },
        { text: new Date().toLocaleString('ru-RU'), style: 'muted', alignment: 'right' },
      ],
    }),
    footer: (currentPage: number, pageCount: number) => ({
      margin: [28, 0, 28, 20],
      columns: [
        { text: 'car-leads-dashboard', style: 'muted' },
        { text: `Стр. ${currentPage} из ${pageCount}`, alignment: 'right', style: 'muted' },
      ],
    }),
    content: [
      {
        layout: {
          fillColor: (rowIndex: number) =>
            rowIndex === 0 ? '#1f2937' : (rowIndex % 2 === 0 ? '#f8fafc' : null),
          hLineColor: () => '#cbd5e1',
          vLineColor: () => '#cbd5e1',
          hLineWidth: (i: number, node: any) =>
            (i === 0 || i === node.table.body.length) ? 1.0 : 0.5,
          vLineWidth: () => 0.5,
          paddingLeft: () => 6,
          paddingRight: () => 6,
          paddingTop: () => 6,
          paddingBottom: () => 6,
        },
        table: {
          headerRows: 1,
          widths: [90, 100, 110, 70, 80, 95, '*'],
          body: [...head, ...body],
          dontBreakRows: false, 
        },
        fontSize: 9,
      },
    ],
    styles: {
      title: { fontSize: 14, bold: true },
      th: { color: '#ffffff', bold: true },
      muted: { fontSize: 9, color: '#6b7280' },
    },
    defaultStyle: { font: 'Roboto', fontSize: 9, color: '#111827' },
  };

  pdfMake.createPdf(docDefinition).download('leads.pdf');
}
