"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export interface StudentLike {
  id: number;
  full_name: string;
  edu_form_id?: number | null;
  edu_type_id?: number | null;
  edu_lang_id?: number | null;
  direction_id?: number | null;
  course_id?: number | null;
  group_id?: number | null;
}

interface Opt { id: number; name: string }
interface CourseOpt { id: number; number: number; direction_id: number }
interface GroupOpt { id: number; name: string; course_id: number }

const EMPTY = {
  search: "", edu_form_id: "", edu_type_id: "", edu_lang_id: "",
  direction_id: "", course_id: "", group_id: "",
};

/**
 * Talabalar ro'yxati uchun to'liq filter (ism qidiruvi + ta'lim shakli/turi/tili,
 * yo'nalish→kurs→guruh kaskadi). `students` ni filtrlab `onChange` orqali qaytaradi.
 * Faqat universitet xodimi uchun (/academic/* endpointlari shu rolga ochiq).
 */
export default function StudentFilterBar<T extends StudentLike>({
  students,
  onChange,
}: {
  students: T[];
  onChange: (filtered: T[]) => void;
}) {
  const [filters, setFilters] = useState(EMPTY);
  const [eduForms, setEduForms] = useState<Opt[]>([]);
  const [eduTypes, setEduTypes] = useState<Opt[]>([]);
  const [eduLangs, setEduLangs] = useState<Opt[]>([]);
  const [directions, setDirections] = useState<Opt[]>([]);
  const [courses, setCourses] = useState<CourseOpt[]>([]);
  const [groups, setGroups] = useState<GroupOpt[]>([]);

  useEffect(() => {
    Promise.allSettled([
      api.get<Opt[]>("/academic/education-forms"),
      api.get<Opt[]>("/academic/education-types"),
      api.get<Opt[]>("/academic/education-languages"),
      api.get<Opt[]>("/academic/directions"),
      api.get<CourseOpt[]>("/academic/courses"),
      api.get<GroupOpt[]>("/academic/groups"),
    ]).then(([f, t, l, d, c, g]) => {
      if (f.status === "fulfilled") setEduForms(f.value);
      if (t.status === "fulfilled") setEduTypes(t.value);
      if (l.status === "fulfilled") setEduLangs(l.value);
      if (d.status === "fulfilled") setDirections(d.value);
      if (c.status === "fulfilled") setCourses(c.value);
      if (g.status === "fulfilled") setGroups(g.value);
    });
  }, []);

  const courseOpts = filters.direction_id ? courses.filter(c => c.direction_id === +filters.direction_id) : courses;
  const groupOpts = filters.course_id ? groups.filter(g => g.course_id === +filters.course_id) : groups;

  function setFilter(patch: Partial<typeof EMPTY>) {
    setFilters(prev => {
      const next = { ...prev, ...patch };
      if (patch.direction_id !== undefined) { next.course_id = ""; next.group_id = ""; }
      if (patch.course_id !== undefined) { next.group_id = ""; }
      return next;
    });
  }

  const filtered = students.filter(s => {
    const f = filters;
    if (f.search && !(s.full_name ?? "").toLowerCase().includes(f.search.trim().toLowerCase())) return false;
    if (f.edu_form_id && s.edu_form_id !== +f.edu_form_id) return false;
    if (f.edu_type_id && s.edu_type_id !== +f.edu_type_id) return false;
    if (f.edu_lang_id && s.edu_lang_id !== +f.edu_lang_id) return false;
    if (f.direction_id && s.direction_id !== +f.direction_id) return false;
    if (f.course_id && s.course_id !== +f.course_id) return false;
    if (f.group_id && s.group_id !== +f.group_id) return false;
    return true;
  });

  // students yoki filterlar o'zgarganda natijani ota komponentga qaytaramiz
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { onChange(filtered); }, [students, JSON.stringify(filters)]);

  const sel = "rounded-lg border border-gray-300 px-2.5 py-2 text-sm outline-none focus:border-[#2563eb]";

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <input
        type="text"
        value={filters.search}
        onChange={e => setFilter({ search: e.target.value })}
        placeholder="Ism familiya bo'yicha qidirish..."
        className="mb-3 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#2563eb]"
      />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <select value={filters.edu_form_id} onChange={e => setFilter({ edu_form_id: e.target.value })} className={sel}>
          <option value="">Ta&apos;lim shakli</option>
          {eduForms.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
        </select>
        <select value={filters.edu_type_id} onChange={e => setFilter({ edu_type_id: e.target.value })} className={sel}>
          <option value="">Ta&apos;lim turi</option>
          {eduTypes.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
        </select>
        <select value={filters.edu_lang_id} onChange={e => setFilter({ edu_lang_id: e.target.value })} className={sel}>
          <option value="">Ta&apos;lim tili</option>
          {eduLangs.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
        </select>
        <select value={filters.direction_id} onChange={e => setFilter({ direction_id: e.target.value })} className={sel}>
          <option value="">Yo&apos;nalish</option>
          {directions.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
        </select>
        <select value={filters.course_id} onChange={e => setFilter({ course_id: e.target.value })} className={sel}>
          <option value="">Kurs</option>
          {courseOpts.map(o => <option key={o.id} value={o.id}>{o.number}-kurs</option>)}
        </select>
        <select value={filters.group_id} onChange={e => setFilter({ group_id: e.target.value })} className={sel}>
          <option value="">Guruh</option>
          {groupOpts.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
        </select>
      </div>
      <div className="mt-2 flex items-center justify-between">
        <span className="text-xs text-gray-500">{filtered.length} ta talaba</span>
        <button onClick={() => setFilters(EMPTY)} className="text-xs font-medium text-[#2563eb] hover:underline">Tozalash</button>
      </div>
    </div>
  );
}
