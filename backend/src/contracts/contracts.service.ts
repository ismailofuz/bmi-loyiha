import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Knex } from 'knex';
import { KNEX_CONNECTION } from '../database/database.provider';
import { join } from 'path';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import * as QRCode from 'qrcode';
import puppeteer from 'puppeteer';

const CONTRACT_DIR  = join(process.cwd(), 'uploads', 'contracts');
// Template is copied by nest-cli assets to dist/contracts/templates/ at build time
// In dev mode __dirname = dist/src/contracts/, in prod __dirname = dist/contracts/
const TEMPLATE_PATH = existsSync(join(__dirname, 'templates', 'contract.html'))
  ? join(__dirname, 'templates', 'contract.html')
  : join(__dirname, '..', '..', 'contracts', 'templates', 'contract.html');

const MONTHS_UZ = [
  'yanvar','fevral','mart','aprel','may','iyun',
  'iyul','avgust','sentabr','oktabr','noyabr','dekabr',
];

function formatDate(d: Date | string) {
  const date = typeof d === 'string' ? new Date(d) : d;
  return `"${date.getDate()}" ${MONTHS_UZ[date.getMonth()]} ${date.getFullYear()}-yil`;
}

@Injectable()
export class ContractsService {
  constructor(@Inject(KNEX_CONNECTION) private readonly knex: Knex) {}

  async findByUuid(uuid: string) {
    const internship = await this.knex('internships as i')
      .leftJoin('universities as u',  'i.university_id', 'u.id')
      .leftJoin('companies as co',    'i.company_id',    'co.id')
      .where('i.contract_uuid', uuid)
      .select(
        'i.id',
        'i.contract_uuid',
        'i.contract_number',
        'i.contract_date',
        'i.contract_pdf_path',
        'i.internship_start',
        'i.internship_end',
        'i.status',
        'i.created_at',
        'u.name as university_name',
        'u.rector_full_name',
        'u.address as university_address',
        'u.contact_email as university_email',
        'u.phone as university_phone',
        'u.inn as university_inn',
        'co.name as company_name',
        'co.director_full_name',
        'co.address as company_address',
        'co.contact_email as company_email',
        'co.phone as company_phone',
        'co.inn as company_inn',
      )
      .first();

    if (!internship) throw new NotFoundException('Shartnoma topilmadi');
    return internship;
  }

  async generateContractForInternship(
    internshipId: number,
    trx: Knex.Transaction,
  ): Promise<void> {
    const row = await trx('internships as i')
      .leftJoin('universities as u',  'i.university_id', 'u.id')
      .leftJoin('companies as co',    'i.company_id',    'co.id')
      .where('i.id', internshipId)
      .select(
        'i.*',
        'u.name as university_name',
        'u.rector_full_name',
        'u.address as university_address',
        'u.contact_email as university_email',
        'u.phone as university_phone',
        'u.inn as university_inn',
        'co.name as company_name',
        'co.director_full_name',
        'co.address as company_address',
        'co.contact_email as company_email',
        'co.phone as company_phone',
        'co.inn as company_inn',
      )
      .first();

    if (!row) return;

    const year  = new Date().getFullYear();
    const count = await trx('internships')
      .whereNotNull('contract_number')
      .whereRaw('EXTRACT(YEAR FROM created_at) = ?', [year])
      .count('id as cnt')
      .first();

    const seq            = Number((count as { cnt: string }).cnt ?? 0) + 1;
    const contractNumber = `${year}/${String(seq).padStart(3, '0')}`;
    const contractDate   = new Date();
    const uuid           = row.contract_uuid as string;

    try {
      await this.buildPdf({
        ...row,
        contract_number: contractNumber,
        contract_date:   contractDate,
        contract_uuid:   uuid,
      });
    } catch (err) {
      console.error('[ContractsService] buildPdf failed:', err);
      throw err;
    }

    await trx('internships')
      .where({ id: internshipId })
      .update({
        contract_number:   contractNumber,
        contract_date:     contractDate,
        contract_pdf_path: `uploads/contracts/${uuid}.pdf`,
      });
  }

  private async buildPdf(data: Record<string, unknown>): Promise<string> {
    if (!existsSync(CONTRACT_DIR)) mkdirSync(CONTRACT_DIR, { recursive: true });

    const uuid    = data.contract_uuid as string;
    const outPath = join(CONTRACT_DIR, `${uuid}.pdf`);
    const qrUrl   = `https://career.edu.uz/contracts/${uuid}`;

    const rector   = (data.rector_full_name   as string) ?? '';
    const director = (data.director_full_name as string) ?? '';

    // QR code as inline base64 image
    const qrBase64 = await QRCode.toDataURL(qrUrl, { width: 120, margin: 1 });

    // Read and fill template
    const templateHtml = readFileSync(TEMPLATE_PATH, 'utf-8');
    const contractNum  = (data.contract_number as string) ?? '';
    const contractDate = formatDate((data.contract_date as Date | string) ?? new Date());

    const filled = templateHtml
      .replace(/\{\{contract_number\}\}/g,   `№ ${contractNum}`)
      .replace(/\{\{contract_date\}\}/g,     contractDate)
      .replace(/\{\{university_name\}\}/g,   (data.university_name    as string) ?? '')
      .replace(/\{\{university_rector\}\}/g, rector || '[Rektor]')
      .replace(/\{\{company_name\}\}/g,      (data.company_name       as string) ?? '')
      .replace(/\{\{company_director\}\}/g,  director || '[Rahbar]')
      .replace(/\{\{university_address\}\}/g,(data.university_address as string) ?? '')
      .replace(/\{\{university_email\}\}/g,  (data.university_email   as string) ?? '')
      .replace(/\{\{university_phone\}\}/g,  (data.university_phone   as string) ?? '')
      .replace(/\{\{university_inn\}\}/g,    (data.university_inn     as string) ?? '')
      .replace(/\{\{company_address\}\}/g,   (data.company_address    as string) ?? '')
      .replace(/\{\{company_email\}\}/g,     (data.company_email      as string) ?? '')
      .replace(/\{\{company_phone\}\}/g,     (data.company_phone      as string) ?? '')
      .replace(/\{\{company_inn\}\}/g,       (data.company_inn        as string) ?? '')
      .replace(/\{\{qr_code\}\}/g,           qrBase64);

    const rectLast = rector   ? rector.split(' ').slice(-2).join(' ')   : '[Rektor]';
    const dirLast  = director ? director.split(' ').slice(-2).join(' ') : '[Rahbar]';

    const filledWithSig = filled
      .replace(/\{\{university_rector_short\}\}/g, rectLast)
      .replace(/\{\{company_director_short\}\}/g,  dirLast);

    const fullHtml = `<!DOCTYPE html>
<html lang="uz">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #fff; }
    h4 { font-weight: bold; }
    ul { list-style: none; padding-left: 20px; }
    li { text-indent: -12px; padding-left: 12px; }
  </style>
</head>
<body>
  ${filledWithSig}
</body>
</html>`;

    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    try {
      const page = await browser.newPage();
      await page.setContent(fullHtml, { waitUntil: 'load' });
      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: { top: '20mm', bottom: '20mm', left: '20mm', right: '20mm' },
      });
      writeFileSync(outPath, pdfBuffer);
    } finally {
      await browser.close();
    }

    return outPath;
  }
}
