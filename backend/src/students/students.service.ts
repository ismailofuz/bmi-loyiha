import {
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Knex } from 'knex';
import { KNEX_CONNECTION } from '../database/database.provider';
import { JwtPayload } from '../common/interfaces/jwt-payload.interface';
import { Role } from '../common/enums/role.enum';
import { CreateStudentDto, EnrollStudentDto, UpdateStudentDto } from './dto/student.dto';
import { genPassword } from '../common/utils/excel.util';

@Injectable()
export class StudentsService {
  constructor(@Inject(KNEX_CONNECTION) private readonly knex: Knex) {}

  /** Excel'dan ommaviy talaba import. Akademik maydonlar NOM bo'yicha hal qilinadi. */
  async importRows(rows: Record<string, string>[], requester: JwtPayload) {
    const universityId = requester.universityId!;
    const [forms, types, langs, directions, courses, groups] = await Promise.all([
      this.knex('education_forms').where({ university_id: universityId }).select('id', 'name'),
      this.knex('education_types').where({ university_id: universityId }).select('id', 'name'),
      this.knex('education_languages').where({ university_id: universityId }).select('id', 'name'),
      this.knex('directions as d').join('faculties as f', 'd.faculty_id', 'f.id')
        .where('f.university_id', universityId).select('d.id', 'd.name'),
      this.knex('courses as c').join('directions as d', 'c.direction_id', 'd.id').join('faculties as f', 'd.faculty_id', 'f.id')
        .where('f.university_id', universityId).select('c.id', 'c.direction_id', 'c.number'),
      this.knex('groups as g').join('courses as c', 'g.course_id', 'c.id').join('directions as d', 'c.direction_id', 'd.id').join('faculties as f', 'd.faculty_id', 'f.id')
        .where('f.university_id', universityId).select('g.id', 'g.name'),
    ]);

    const nmeMap = (arr: { id: number; name: string }[]) =>
      new Map(arr.map((x) => [x.name.toLowerCase().trim(), x.id]));
    const formMap = nmeMap(forms), typeMap = nmeMap(types), langMap = nmeMap(langs);
    const dirMap = nmeMap(directions as { id: number; name: string }[]);
    const groupMap = nmeMap(groups as { id: number; name: string }[]);
    const courseMap = new Map(
      (courses as { id: number; direction_id: number; number: number }[]).map(
        (c) => [`${c.direction_id}:${c.number}`, c.id],
      ),
    );

    const created: { full_name: string; email: string; password: string }[] = [];
    const failed: { row: number; label: string; reason: string }[] = [];

    for (let i = 0; i < rows.length; i++) {
      const r = rows[i];
      const rowNum = i + 2;
      const full_name = (r.full_name ?? '').trim();
      const email = (r.email ?? '').trim();
      const reasons: string[] = [];

      if (!full_name || !email) {
        failed.push({ row: rowNum, label: full_name || email, reason: "full_name va email majburiy" });
        continue;
      }

      // Akademik nomlarni hal qilish (berilgan bo'lsa topilishi shart)
      let edu_form_id: number | undefined;
      let edu_type_id: number | undefined;
      let edu_lang_id: number | undefined;
      let direction_id: number | undefined;
      let course_id: number | undefined;
      let group_id: number | undefined;
      const resolve = (val: string, map: Map<string, number>, label: string): number | undefined => {
        const v = (val ?? '').trim();
        if (!v) return undefined;
        const id = map.get(v.toLowerCase());
        if (!id) reasons.push(`${label} topilmadi: "${v}"`);
        return id;
      };

      edu_form_id = resolve(r.edu_form, formMap, "Ta'lim shakli");
      edu_type_id = resolve(r.edu_type, typeMap, "Ta'lim turi");
      edu_lang_id = resolve(r.edu_lang, langMap, "Ta'lim tili");
      const dirProvided = !!(r.direction ?? '').trim();
      direction_id = resolve(r.direction, dirMap, "Yo'nalish");
      group_id = resolve(r.group, groupMap, "Guruh");

      const courseStr = (r.course ?? '').trim();
      if (courseStr) {
        const num = parseInt(courseStr, 10);
        if (!dirProvided) reasons.push("Kursni aniqlash uchun yo'nalish kerak");
        else if (direction_id) {
          if (!num || !courseMap.has(`${direction_id}:${num}`)) reasons.push(`Kurs topilmadi: "${courseStr}"`);
          else course_id = courseMap.get(`${direction_id}:${num}`);
        }
        // direction berilgan-u topilmagan bo'lsa — yo'nalish xatosi yetarli
      }

      if (reasons.length) { failed.push({ row: rowNum, label: full_name || email, reason: reasons.join('; ') }); continue; }

      const password = genPassword();
      try {
        await this.enroll({
          email, password, full_name,
          university_id: universityId,
          passport_serial: r.passport_serial || undefined,
          pin: r.pin || undefined,
          direction_id, course_id, group_id,
          edu_form_id, edu_type_id, edu_lang_id,
        } as EnrollStudentDto, requester);
        created.push({ full_name, email, password });
      } catch (e) {
        fail(e instanceof Error ? e.message : 'Xatolik');
      }
    }
    return { created, failed };
  }

  async enroll(dto: EnrollStudentDto, requester: JwtPayload) {
    if (
      requester.role === Role.UniversityStaff &&
      dto.university_id !== requester.universityId
    ) {
      throw new ForbiddenException('Cannot enroll student for another university');
    }

    const existing = await this.knex('students').where({ email: dto.email }).first();
    if (existing) throw new ConflictException('Email already in use');

    return this.knex.transaction(async (trx) => {
      const password_hash = await bcrypt.hash(dto.password, 10);
      const [student] = await trx('students').insert({
        university_id: dto.university_id,
        full_name: dto.full_name,
        passport_serial: dto.passport_serial,
        pin: dto.pin,
        faculty_id: dto.faculty_id,
        direction_id: dto.direction_id,
        course_id: dto.course_id,
        group_id: dto.group_id,
        edu_form_id: dto.edu_form_id,
        edu_type_id: dto.edu_type_id,
        edu_lang_id: dto.edu_lang_id,
        email: dto.email,
        password_hash,
      }).returning('*');

      return student;
    });
  }

  async create(dto: CreateStudentDto, requester: JwtPayload) {
    if (
      requester.role === Role.UniversityStaff &&
      dto.university_id !== requester.universityId
    ) {
      throw new ForbiddenException('Cannot create student for another university');
    }

    const existing = await this.knex('students').where({ email: dto.email }).first();
    if (existing) throw new ConflictException('Email already in use');

    const { password, ...studentData } = dto;
    const password_hash = await bcrypt.hash(password, 10);
    const [student] = await this.knex('students').insert({ ...studentData, password_hash }).returning('*');
    return student;
  }

  async findAll(requester: JwtPayload, supervised = false) {
    const query = this.knex('students as s')
      .leftJoin('universities as uni', 's.university_id', 'uni.id')
      .leftJoin('directions as dir', 's.direction_id', 'dir.id')
      .select('s.*', 'uni.name as university_name', 'dir.name as direction_name');

    if (requester.role === Role.UniversityStaff) {
      query.where('s.university_id', requester.universityId);
      // "supervised": faqat o'sha xodim mas'ul (supervisor) bo'lgan amaliyotlardagi
      // talabalar (katta admin emas xodimlar uchun monitoring). Admin barchasini ko'radi.
      if (supervised && !requester.isAdmin) {
        query.whereIn(
          's.id',
          this.knex('internship_students as ist')
            .join('internships as i', 'ist.internship_id', 'i.id')
            .where('i.supervisor_id', requester.sub)
            .select('ist.student_id'),
        );
      }
    } else if (requester.role === Role.CompanyMentor) {
      // Mentor faqat o'z korxonasiga biriktirilgan talabalarni ko'radi
      query.where('s.company_id', requester.companyId);
    } else if (requester.role === Role.Student) {
      query.where('s.id', requester.sub);
    }

    return query;
  }

  async findOne(id: number, requester: JwtPayload) {
    this.assertAccess(id, requester);

    const student = await this.knex('students as s')
      .leftJoin('universities as uni', 's.university_id', 'uni.id')
      .where('s.id', id)
      .select('s.*', 'uni.name as university_name')
      .first();

    if (!student) throw new NotFoundException('Student not found');
    return student;
  }

  async update(id: number, dto: UpdateStudentDto, requester: JwtPayload) {
    this.assertAccess(id, requester);
    await this.findOne(id, requester);

    const [updated] = await this.knex('students')
      .where({ id })
      .update({ ...dto, updated_at: this.knex.fn.now() })
      .returning('*');

    return updated;
  }

  private async assertAccess(studentId: number, requester: JwtPayload) {
    if (requester.role === Role.SuperAdmin) return;

    const student = await this.knex('students').where({ id: studentId }).first();
    if (!student) throw new NotFoundException('Student not found');

    if (
      requester.role === Role.UniversityStaff &&
      student.university_id !== requester.universityId
    ) {
      throw new ForbiddenException('Access denied');
    }

    if (
      requester.role === Role.Student &&
      studentId !== requester.sub
    ) {
      throw new ForbiddenException('Access denied');
    }
  }
}
