import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Knex } from 'knex';
import puppeteer from 'puppeteer';
import { KNEX_CONNECTION } from '../database/database.provider';
import { JwtPayload } from '../common/interfaces/jwt-payload.interface';
import { Role } from '../common/enums/role.enum';

function esc(v: unknown): string {
  if (v === null || v === undefined) return '';
  return String(v)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function fmtDate(d: unknown): string {
  if (!d) return '—';
  const date = new Date(d as string);
  if (isNaN(date.getTime())) return esc(d);
  return date.toLocaleDateString('en-GB');
}

@Injectable()
export class DiaryService {
  constructor(@Inject(KNEX_CONNECTION) private readonly knex: Knex) {}

  async buildDiaryPdf(studentId: number, requester: JwtPayload): Promise<Buffer> {
    await this.assertReadAccess(studentId, requester);

    const student = await this.knex('students as s')
      .leftJoin('universities as uni', 's.university_id', 'uni.id')
      .leftJoin('companies as co', 's.company_id', 'co.id')
      .leftJoin('company_mentors as m', 's.mentor_id', 'm.id')
      .leftJoin('directions as dir', 's.direction_id', 'dir.id')
      .leftJoin('groups as g', 's.group_id', 'g.id')
      .where('s.id', studentId)
      .select(
        's.full_name',
        's.passport_serial',
        's.pin',
        'uni.name as university_name',
        'co.name as company_name',
        'm.full_name as mentor_name',
        'dir.name as direction_name',
        'g.name as group_name',
      )
      .first();

    if (!student) throw new NotFoundException('Talaba topilmadi');

    const reports = await this.knex('reports')
      .where({ student_id: studentId })
      .orderBy('report_date', 'asc');

    const assignment = await this.knex('internship_students as ist')
      .join('internships as i', 'ist.internship_id', 'i.id')
      .where('ist.student_id', studentId)
      .select('i.internship_start', 'i.internship_end')
      .first();

    const approved = reports.filter((r) => r.status === 'approved' && r.grade != null);
    const avg = approved.length
      ? Math.round((approved.reduce((s, r) => s + Number(r.grade), 0) / approved.length) * 100) / 100
      : null;

    const statusLabel: Record<string, string> = {
      draft: 'Qoralama',
      submitted: 'Yuborilgan',
      approved: 'Tasdiqlangan',
      rejected: 'Rad etilgan',
    };
    const statusColor: Record<string, string> = {
      draft: '#6b7280',
      submitted: '#2563eb',
      approved: '#16a34a',
      rejected: '#dc2626',
    };

    // Har bir kun (hisobot) — alohida sahifa
    const dayPages = reports
      .map((r, idx) => {
        const color = statusColor[r.status] ?? '#111';
        return `
      <section class="day">
        <div class="day-head">
          <div>
            <div class="day-no">${idx + 1}-kun</div>
            <div class="day-date">${fmtDate(r.report_date)}</div>
          </div>
          <div class="day-grade">
            <div class="grade-val">${r.grade ?? '—'}</div>
            <div class="grade-lbl">baho (5 ballik)</div>
          </div>
        </div>
        <div class="status" style="color:${color};border-color:${color}">${esc(statusLabel[r.status] ?? r.status)}</div>
        <h4>Bajarilgan ishlar</h4>
        <div class="content">${esc(r.content) || '—'}</div>
        ${r.reviewer_feedback ? `<h4>Mentor izohi</h4><div class="feedback">${esc(r.reviewer_feedback)}</div>` : ''}
      </section>`;
      })
      .join('');

    const html = `<!DOCTYPE html>
<html lang="uz"><head><meta charset="UTF-8"><style>
  * { box-sizing: border-box; font-family: Arial, sans-serif; }
  body { margin: 0; color: #111; }
  .title-page { text-align: center; padding-top: 120px; page-break-after: always; }
  .title-page h1 { font-size: 26px; margin-bottom: 8px; }
  .title-page h2 { font-size: 18px; font-weight: normal; margin: 40px 0; }
  .meta { margin: 60px auto 0; width: 80%; text-align: left; font-size: 15px; line-height: 2; }
  .meta b { display: inline-block; width: 220px; }
  .day { page-break-after: always; padding-top: 10px; }
  .day-head { display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid #1d4ed8; padding-bottom: 10px; }
  .day-no { font-size: 22px; font-weight: bold; color: #1d4ed8; }
  .day-date { font-size: 15px; color: #444; margin-top: 4px; }
  .day-grade { text-align: center; }
  .grade-val { font-size: 40px; font-weight: bold; color: #16a34a; line-height: 1; }
  .grade-lbl { font-size: 11px; color: #888; }
  .status { display: inline-block; margin-top: 14px; padding: 3px 12px; border: 1px solid; border-radius: 999px; font-size: 12px; font-weight: bold; }
  h4 { font-size: 14px; margin: 20px 0 6px; color: #333; }
  .content { font-size: 14px; line-height: 1.7; white-space: pre-wrap; border: 1px solid #ddd; border-radius: 8px; padding: 12px 14px; min-height: 120px; }
  .feedback { font-size: 13px; line-height: 1.6; background: #f8fafc; border-left: 3px solid #94a3b8; padding: 10px 14px; }
  .summary-page { padding-top: 80px; text-align: center; }
  .summary-page .big { font-size: 56px; font-weight: bold; color: #1d4ed8; }
  .summary-page .row { font-size: 16px; margin-top: 10px; color: #444; }
</style></head><body>
  <div class="title-page">
    <h1>AMALIYOT KUNDALIGI</h1>
    <h2>(Talaba amaliyot daftari)</h2>
    <div class="meta">
      <div><b>Talaba F.I.Sh:</b> ${esc(student.full_name)}</div>
      <div><b>Universitet:</b> ${esc(student.university_name)}</div>
      <div><b>Yo'nalish:</b> ${esc(student.direction_name) || '—'}</div>
      <div><b>Guruh:</b> ${esc(student.group_name) || '—'}</div>
      <div><b>Korxona:</b> ${esc(student.company_name) || '—'}</div>
      <div><b>Mentor:</b> ${esc(student.mentor_name) || '—'}</div>
      <div><b>Amaliyot muddati:</b> ${fmtDate(assignment?.internship_start)} — ${fmtDate(assignment?.internship_end)}</div>
      <div><b>Jami kunlar (hisobotlar):</b> ${reports.length}</div>
    </div>
  </div>

  ${dayPages || '<section class="day"><h4>Hisobotlar yo\'q</h4></section>'}

  <div class="summary-page">
    <p style="font-size:18px;color:#333">Yakuniy o'rtacha baho</p>
    <div class="big">${avg ?? '—'}</div>
    <div class="row">Tasdiqlangan hisobotlar: ${approved.length} / ${reports.length}</div>
  </div>
</body></html>`;

    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    try {
      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: 'load' });
      const pdf = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: { top: '15mm', bottom: '15mm', left: '15mm', right: '15mm' },
      });
      return Buffer.from(pdf);
    } finally {
      await browser.close();
    }
  }

  private async assertReadAccess(studentId: number, requester: JwtPayload) {
    if (requester.role === Role.SuperAdmin) return;
    if (requester.role === Role.Student && requester.sub !== studentId) {
      throw new ForbiddenException('Access denied');
    }
    if (requester.role === Role.UniversityStaff || requester.role === Role.CompanyMentor) {
      const student = await this.knex('students').where({ id: studentId }).first();
      if (!student) throw new NotFoundException('Talaba topilmadi');
      if (requester.role === Role.UniversityStaff && student.university_id !== requester.universityId) {
        throw new ForbiddenException('Access denied');
      }
      if (requester.role === Role.CompanyMentor && student.company_id !== requester.companyId) {
        throw new ForbiddenException('Access denied');
      }
    }
  }
}
