
export function parseTs(input: unknown): Date {
  if (input instanceof Date) return input;
  if (typeof input === 'number') return new Date(input);

  if (typeof input === 'string') {
    let s = input.trim();

    s = s.replace(/5055/g, '2025')
         .replace(/5054/g, '2024')
         .replace(/5053/g, '2023');

    s = s.replace(',', ' ').replace(/\//g, '.').replace(/-/g, '.').replace(/\s+/g, ' ');

    const m = s.match(
      /^(\d{1,2})\.(\d{1,2})\.(\d{4})(?:\s+(\d{1,2}):(\d{2}))?$/
    );
    if (m) {
      const dd = +m[1], mm = +m[2], yyyy = +m[3];
      const hh = m[4] ? +m[4] : 0;
      const mi = m[5] ? +m[5] : 0;
      const safeY = yyyy > 2100 ? 2000 + (yyyy % 100) : yyyy; // ещё одна страховка
      return new Date(safeY, mm - 1, dd, hh, mi, 0, 0);
    }

    const d = new Date(s);
    if (!isNaN(d.getTime())) return d;
  }

  return new Date(NaN);
}

function pad(n: number) { return String(n).padStart(2, '0'); }

export function formatTs(input: unknown): string {
  const d = parseTs(input);
  if (isNaN(d.getTime())) return '—';
  return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function formatDateOnly(input: unknown): string {
  const d = parseTs(input);
  if (isNaN(d.getTime())) return '—';
  return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()}`;
}
