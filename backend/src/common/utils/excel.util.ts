import * as XLSX from 'xlsx';

/** Yuklangan fayl (xlsx/xls/csv) birinchi varag'ini obyektlar massiviga o'qiydi.
 *  Har bir qiymat string ko'rinishida, trim qilingan holda qaytadi. */
export function parseSheet(buffer: Buffer): Record<string, string>[] {
  const wb = XLSX.read(buffer, { type: 'buffer' });
  const sheetName = wb.SheetNames[0];
  if (!sheetName) return [];
  const sheet = wb.Sheets[sheetName];
  const raw = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: '' });
  return raw.map((row) => {
    const out: Record<string, string> = {};
    for (const [k, v] of Object.entries(row)) {
      out[String(k).trim()] = v === null || v === undefined ? '' : String(v).trim();
    }
    return out;
  });
}

/** Sarlavhalar + 1 namuna qatordan iborat .xlsx shablon (Buffer) yaratadi. */
export function buildTemplate(
  headers: string[],
  example: Record<string, string> = {},
): Buffer {
  const exampleRow = headers.map((h) => example[h] ?? '');
  const sheet = XLSX.utils.aoa_to_sheet([headers, exampleRow]);
  sheet['!cols'] = headers.map(() => ({ wch: 22 }));
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, sheet, 'Shablon');
  return XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' }) as Buffer;
}

/** Tasodifiy parol (DTO talabiga ko'ra ≥6). */
export function genPassword(len = 10): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
  let out = '';
  for (let i = 0; i < len; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}
