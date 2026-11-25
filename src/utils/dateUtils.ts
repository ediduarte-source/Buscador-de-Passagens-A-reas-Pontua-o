export function pad2(n: number): string {
  return String(n).padStart(2, '0');
}

export function formatIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = pad2(date.getMonth() + 1);
  const day = pad2(date.getDate());
  return `${year}-${month}-${day}`;
}

export function parseIsoDate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, (m || 1) - 1, d || 1, 12, 0, 0);
}

export function addDaysToIso(iso: string, days: number): string {
  const date = parseIsoDate(iso);
  date.setDate(date.getDate() + days);
  return formatIsoDate(date);
}

export function getTodayIso(): string {
  return formatIsoDate(new Date());
}

export function formatDateBR(iso: string): string {
  if (!iso || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return iso;
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

export function formatDateShortBR(iso: string): string {
  if (!iso || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return iso;
  const months = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
  const [, m, d] = iso.split('-').map(Number);
  return `${pad2(d)} ${months[(m || 1) - 1]}`;
}

export function isValidIsoDate(iso: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return false;
  const [y, m, d] = iso.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d;
}

export function diffDaysIso(fromIso: string, toIso: string): number {
  const from = parseIsoDate(fromIso);
  const to = parseIsoDate(toIso);
  return Math.round((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24));
}

export function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${pad2(m)}m`;
}

export function formatNumberBR(value: number): string {
  return Math.round(value)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

export function formatCurrencyBRL(value: number): string {
  const fixed = value.toFixed(2).replace('.', ',');
  const [intPart, decPart] = fixed.split(',');
  return `R$ ${intPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.')},${decPart}`;
}
