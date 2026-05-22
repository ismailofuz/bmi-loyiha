"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import DashboardShell from "@/components/DashboardShell";
import PageHeader from "@/components/PageHeader";
import EmptyState from "@/components/EmptyState";
import { api } from "@/lib/api";
import { getUser } from "@/lib/auth";
import { useToast } from "@/components/ToastProvider";

const nav = [
  { label: "Bosh sahifa", href: "/university",          icon: <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path fillRule="evenodd" d="M9.293 2.293a1 1 0 011.414 0l7 7A1 1 0 0117 11h-1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-3a1 1 0 00-1-1H9a1 1 0 00-1 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-6H3a1 1 0 01-.707-1.707l7-7z" clipRule="evenodd" /></svg> },
  { label: "Talabalar",   href: "/university/students",  icon: <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z" /></svg> },
  { label: "Hisobotlar",  href: "/university/reports",   icon: <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" /></svg> },
  { label: "Xodimlar",    href: "/university/staff",        adminOnly: true, icon: <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path d="M7 8a3 3 0 100-6 3 3 0 000 6zM14.5 9a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM1.615 16.428a1.224 1.224 0 01-.569-1.175 6.002 6.002 0 0111.908 0c.058.467-.172.92-.57 1.174A9.953 9.953 0 017 18a9.953 9.953 0 01-5.385-1.572zM14.5 16h-.106c.07-.297.088-.611.048-.933a7.47 7.47 0 00-1.588-3.755 4.502 4.502 0 015.874 2.636.818.818 0 01-.36.98A7.465 7.465 0 0114.5 16z" /></svg> },
  { label: "Amaliyotlar", href: "/university/amaliyotlar", icon: <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path fillRule="evenodd" d="M6 3.75A2.75 2.75 0 018.75 1h2.5A2.75 2.75 0 0114 3.75v.443c.572.055 1.14.122 1.706.2C17.053 4.582 18 5.75 18 7.07v3.469c0 1.126-.694 2.191-1.83 2.54-1.952.599-4.024.921-6.17.921s-4.219-.322-6.17-.921C2.694 12.73 2 11.665 2 10.539V7.07c0-1.321.947-2.489 2.294-2.676A41.047 41.047 0 016 4.193V3.75zm6.5 0v.325a41.622 41.622 0 00-5 0V3.75c0-.69.56-1.25 1.25-1.25h2.5c.69 0 1.25.56 1.25 1.25zM10 10a1 1 0 00-1 1v.01a1 1 0 001 1h.01a1 1 0 001-1V11a1 1 0 00-1-1H10z" clipRule="evenodd" /><path d="M3 15.055v-.684c.126.053.255.1.39.142 2.1.644 4.318.999 6.61.999 2.291 0 4.51-.355 6.61-.999.135-.041.264-.089.39-.142v.684c0 1.347-.985 2.53-2.363 2.686a41.454 41.454 0 01-9.274 0C3.985 17.585 3 16.402 3 15.055z" /></svg> },
  { label: "Struktura",   href: "/university/struktura",  icon: <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path d="M2 3a1 1 0 00-1 1v1a1 1 0 001 1h16a1 1 0 001-1V4a1 1 0 00-1-1H2zM2 9a1 1 0 00-1 1v1a1 1 0 001 1h6a1 1 0 001-1v-1a1 1 0 00-1-1H2zM2 15a1 1 0 00-1 1v1a1 1 0 001 1h6a1 1 0 001-1v-1a1 1 0 00-1-1H2z" /></svg> },
];

interface EduForm { id: number; name: string }
interface EduType { id: number; name: string }
interface EduLang { id: number; name: string }
interface Direction {
  id: number; name: string; faculty_name: string;
  edu_form_id: number | null; edu_type_id: number | null; edu_lang_id: number | null;
}
interface Course    { id: number; direction_id: number; number: number }
interface Group     { id: number; name: string }
interface Student {
  id: number; full_name: string; phone: string | null; email: string;
  university_name: string;
  passport_serial: string | null; pin: string | null;
  direction_id: number | null; course_id: number | null; group_id: number | null;
  edu_form_id: number | null; edu_type_id: number | null; edu_lang_id: number | null;
}

const ENROLL_EMPTY = {
  email: "", password: "", full_name: "",
  passport_serial: "", pin: "",
  edu_form_id: "", edu_type_id: "", edu_lang_id: "",
  direction_id: "", course_id: "", group_id: "",
};

const EDIT_EMPTY = {
  full_name: "", phone: "",
  passport_serial: "", pin: "",
  edu_form_id: "", edu_type_id: "", edu_lang_id: "",
  direction_id: "", course_id: "", group_id: "",
};

export default function UniversityStudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  /* Enroll modal */
  const [showEnroll, setShowEnroll] = useState(false);
  const [enrollForm, setEnrollForm] = useState(ENROLL_EMPTY);
  const [enrolling, setEnrolling] = useState(false);
  const [eduForms, setEduForms] = useState<EduForm[]>([]);
  const [eduTypes, setEduTypes] = useState<EduType[]>([]);
  const [eduLangs, setEduLangs] = useState<EduLang[]>([]);
  const [allDirections, setAllDirections] = useState<Direction[]>([]);
  const [enrollCourses, setEnrollCourses] = useState<Course[]>([]);
  const [enrollGroups, setEnrollGroups] = useState<Group[]>([]);

  /* Edit modal */
  const [editTarget, setEditTarget] = useState<Student | null>(null);
  const [editForm, setEditForm] = useState(EDIT_EMPTY);
  const [editing, setEditing] = useState(false);
  const [editEduForms, setEditEduForms] = useState<EduForm[]>([]);
  const [editEduTypes, setEditEduTypes] = useState<EduType[]>([]);
  const [editEduLangs, setEditEduLangs] = useState<EduLang[]>([]);
  const [editAllDirections, setEditAllDirections] = useState<Direction[]>([]);
  const [editCourses, setEditCourses] = useState<Course[]>([]);
  const [editGroups, setEditGroups] = useState<Group[]>([]);

  const { toast } = useToast();

  const loadStudents = () =>
    api.get<Student[]>("/students").then(setStudents).finally(() => setLoading(false));

  useEffect(() => { loadStudents(); }, []);

  useEffect(() => {
    if (showEnroll) {
      Promise.allSettled([
        api.get<EduForm[]>("/academic/education-forms"),
        api.get<EduType[]>("/academic/education-types"),
        api.get<EduLang[]>("/academic/education-languages"),
        api.get<Direction[]>("/academic/directions"),
      ]).then(([fR, tR, lR, dR]) => {
        if (fR.status === "fulfilled") setEduForms(fR.value);
        if (tR.status === "fulfilled") setEduTypes(tR.value);
        if (lR.status === "fulfilled") setEduLangs(lR.value);
        if (dR.status === "fulfilled") setAllDirections(dR.value);
      });
    } else {
      setEduForms([]); setEduTypes([]); setEduLangs([]);
      setAllDirections([]); setEnrollCourses([]); setEnrollGroups([]);
    }
  }, [showEnroll]);

  const visible = students.filter(s =>
    !search ||
    s.full_name.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  async function handleEnroll() {
    const me = getUser();
    const universityId = me?.universityId;
    if (!universityId) return toast("Universitet ID aniqlanmadi", "error");
    const { email, password, full_name } = enrollForm;
    if (!email || !password || !full_name) return toast("Majburiy maydonlarni to'ldiring", "error");
    setEnrolling(true);
    try {
      await api.post("/students/enroll", {
        email, password, full_name,
        university_id: universityId,
        passport_serial: enrollForm.passport_serial || undefined,
        pin: enrollForm.pin || undefined,
        direction_id: enrollForm.direction_id ? +enrollForm.direction_id : undefined,
        course_id: enrollForm.course_id ? +enrollForm.course_id : undefined,
        group_id: enrollForm.group_id ? +enrollForm.group_id : undefined,
        edu_form_id: enrollForm.edu_form_id ? +enrollForm.edu_form_id : undefined,
        edu_type_id: enrollForm.edu_type_id ? +enrollForm.edu_type_id : undefined,
        edu_lang_id: enrollForm.edu_lang_id ? +enrollForm.edu_lang_id : undefined,
      });
      setShowEnroll(false); setEnrollForm(ENROLL_EMPTY);
      setLoading(true); loadStudents();
    } catch (e) { toast(e instanceof Error ? e.message : "Xatolik", "error"); }
    finally { setEnrolling(false); }
  }

  async function openEdit(s: Student) {
    setEditTarget(s);
    setEditCourses([]); setEditGroups([]);

    const form = {
      full_name: s.full_name ?? "",
      phone: s.phone ?? "",
      passport_serial: s.passport_serial ?? "",
      pin: s.pin ?? "",
      edu_form_id: s.edu_form_id ? String(s.edu_form_id) : "",
      edu_type_id: s.edu_type_id ? String(s.edu_type_id) : "",
      edu_lang_id: s.edu_lang_id ? String(s.edu_lang_id) : "",
      direction_id: s.direction_id ? String(s.direction_id) : "",
      course_id: s.course_id ? String(s.course_id) : "",
      group_id: s.group_id ? String(s.group_id) : "",
    };
    setEditForm(form);

    const [fR, tR, lR, dR] = await Promise.allSettled([
      api.get<EduForm[]>("/academic/education-forms"),
      api.get<EduType[]>("/academic/education-types"),
      api.get<EduLang[]>("/academic/education-languages"),
      api.get<Direction[]>("/academic/directions"),
    ]);
    if (fR.status === "fulfilled") setEditEduForms(fR.value);
    if (tR.status === "fulfilled") setEditEduTypes(tR.value);
    if (lR.status === "fulfilled") setEditEduLangs(lR.value);
    if (dR.status === "fulfilled") setEditAllDirections(dR.value);

    if (s.direction_id) {
      const courses = await api.get<Course[]>(`/academic/directions/${s.direction_id}/courses`).catch(() => []);
      setEditCourses(courses);
      if (s.course_id) {
        const groups = await api.get<Group[]>(`/academic/courses/${s.course_id}/groups`).catch(() => []);
        setEditGroups(groups);
      }
    }
  }

  function closeEdit() {
    setEditTarget(null); setEditForm(EDIT_EMPTY);
    setEditEduForms([]); setEditEduTypes([]); setEditEduLangs([]);
    setEditAllDirections([]); setEditCourses([]); setEditGroups([]);
  }

  async function handleEdit() {
    if (!editTarget) return;
    setEditing(true);
    try {
      await api.patch(`/students/${editTarget.id}`, {
        full_name: editForm.full_name || undefined,
        phone: editForm.phone || undefined,
        passport_serial: editForm.passport_serial || undefined,
        pin: editForm.pin || undefined,
        edu_form_id: editForm.edu_form_id ? +editForm.edu_form_id : undefined,
        edu_type_id: editForm.edu_type_id ? +editForm.edu_type_id : undefined,
        edu_lang_id: editForm.edu_lang_id ? +editForm.edu_lang_id : undefined,
        direction_id: editForm.direction_id ? +editForm.direction_id : undefined,
        course_id: editForm.course_id ? +editForm.course_id : undefined,
        group_id: editForm.group_id ? +editForm.group_id : undefined,
      });
      closeEdit();
      setLoading(true); loadStudents();
    } catch (e) { toast(e instanceof Error ? e.message : "Xatolik", "error"); }
    finally { setEditing(false); }
  }

  const inputCls = "block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#2563eb]";

  return (
    <DashboardShell nav={nav}>
      <div className="space-y-5">
        <PageHeader
          title="Talabalar"
          subtitle="Universitetingizdagi barcha talabalar"
          action={
            <button onClick={() => setShowEnroll(true)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#2563eb] px-3.5 py-2 text-sm font-semibold text-white hover:bg-blue-700">
              <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4"><path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" /></svg>
              Talaba qo'shish
            </button>
          }
        />

        {/* Stats */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1">
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 text-gray-700 w-40">
            <p className="text-xl font-bold">{students.length}</p>
            <p className="text-xs">Jami talabalar</p>
          </div>
        </div>

        {/* Search */}
        <div className="flex items-center justify-end">
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Ism yoki email bo'yicha qidirish..."
            className="w-full max-w-xs rounded-lg border border-gray-300 px-3 py-1.5 text-sm outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20" />
        </div>

        {/* Table */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-6 space-y-3">{[1,2,3].map(i => <div key={i} className="h-12 animate-pulse rounded bg-gray-100" />)}</div>
          ) : visible.length === 0 ? (
            <div className="p-6"><EmptyState message="Talabalar topilmadi" /></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-100">
                <thead className="bg-gray-50">
                  <tr>
                    {["#", "F.I.O.", "Passport / PIN", ""].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {visible.map((s, i) => (
                    <tr key={s.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-400">{i + 1}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#2563eb]/10 text-xs font-bold text-[#2563eb]">
                            {s.full_name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-800">{s.full_name}</p>
                            <p className="text-xs text-gray-400">{s.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500 font-mono">
                        {s.passport_serial ?? "—"}
                        {s.pin && <span className="ml-2 text-gray-400">/ {s.pin}</span>}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button onClick={() => openEdit(s)}
                            className="rounded-lg border border-gray-200 px-2.5 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100">
                            Tahrirlash
                          </button>
                          <Link href={`/university/reports?student=${s.id}`} className="text-xs font-medium text-[#2563eb] hover:underline">
                            Hisobotlar
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Enroll modal */}
      {showEnroll && (() => {
        const filteredDirs = allDirections.filter(d =>
          (!enrollForm.edu_form_id || d.edu_form_id === +enrollForm.edu_form_id) &&
          (!enrollForm.edu_type_id || d.edu_type_id === +enrollForm.edu_type_id) &&
          (!enrollForm.edu_lang_id || d.edu_lang_id === +enrollForm.edu_lang_id)
        );
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto">
              <h3 className="mb-4 text-base font-bold text-gray-900">Yangi talaba ro'yxatga olish</h3>
              <div className="grid grid-cols-2 gap-3">

                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600">Email *</label>
                  <input type="email" value={enrollForm.email} onChange={e => setEnrollForm(f => ({ ...f, email: e.target.value }))} placeholder="talaba@mail.com" className={inputCls} autoFocus />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600">Parol * (min 6 belgi)</label>
                  <input type="password" value={enrollForm.password} onChange={e => setEnrollForm(f => ({ ...f, password: e.target.value }))} placeholder="••••••" className={inputCls} />
                </div>
                <div className="col-span-2">
                  <label className="mb-1 block text-xs font-medium text-gray-600">To'liq ismi *</label>
                  <input type="text" value={enrollForm.full_name} onChange={e => setEnrollForm(f => ({ ...f, full_name: e.target.value }))} placeholder="Familiya Ism Otasining ismi" className={inputCls} />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600">Passport seriyasi</label>
                  <input type="text" value={enrollForm.passport_serial} onChange={e => setEnrollForm(f => ({ ...f, passport_serial: e.target.value }))} placeholder="AA1234567" className={inputCls} />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600">PINFL</label>
                  <input type="text" value={enrollForm.pin} onChange={e => setEnrollForm(f => ({ ...f, pin: e.target.value }))} placeholder="14 raqamli PIN" className={inputCls} />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600">Ta'lim shakli</label>
                  <select value={enrollForm.edu_form_id} onChange={e => setEnrollForm(f => ({ ...f, edu_form_id: e.target.value, direction_id: "", course_id: "", group_id: "" }))} className={inputCls}>
                    <option value="">— Barchasi —</option>
                    {eduForms.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600">Ta'lim turi</label>
                  <select value={enrollForm.edu_type_id} onChange={e => setEnrollForm(f => ({ ...f, edu_type_id: e.target.value, direction_id: "", course_id: "", group_id: "" }))} className={inputCls}>
                    <option value="">— Barchasi —</option>
                    {eduTypes.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="mb-1 block text-xs font-medium text-gray-600">Ta'lim tili</label>
                  <select value={enrollForm.edu_lang_id} onChange={e => setEnrollForm(f => ({ ...f, edu_lang_id: e.target.value, direction_id: "", course_id: "", group_id: "" }))} className={inputCls}>
                    <option value="">— Barchasi —</option>
                    {eduLangs.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="mb-1 block text-xs font-medium text-gray-600">Yo'nalish</label>
                  <select value={enrollForm.direction_id} onChange={e => {
                    const did = e.target.value;
                    setEnrollForm(f => ({ ...f, direction_id: did, course_id: "", group_id: "" }));
                    setEnrollCourses([]); setEnrollGroups([]);
                    if (did) api.get<Course[]>(`/academic/directions/${did}/courses`).then(setEnrollCourses);
                  }} className={inputCls}>
                    <option value="">— Tanlang —</option>
                    {filteredDirs.map(d => <option key={d.id} value={d.id}>{d.name} ({d.faculty_name})</option>)}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600">Kurs</label>
                  <select value={enrollForm.course_id} disabled={!enrollForm.direction_id} onChange={e => {
                    const cid = e.target.value;
                    setEnrollForm(f => ({ ...f, course_id: cid, group_id: "" }));
                    setEnrollGroups([]);
                    if (cid) api.get<Group[]>(`/academic/courses/${cid}/groups`).then(setEnrollGroups);
                  }} className={inputCls + (!enrollForm.direction_id ? " opacity-50" : "")}>
                    <option value="">— Tanlang —</option>
                    {[...enrollCourses].sort((a, b) => a.number - b.number).map(c => <option key={c.id} value={c.id}>{c.number}-kurs</option>)}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600">Guruh</label>
                  <select value={enrollForm.group_id} disabled={!enrollForm.course_id} onChange={e => setEnrollForm(f => ({ ...f, group_id: e.target.value }))} className={inputCls + (!enrollForm.course_id ? " opacity-50" : "")}>
                    <option value="">— Tanlang —</option>
                    {enrollGroups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                  </select>
                </div>

              </div>
              <div className="mt-5 flex justify-end gap-2">
                <button onClick={() => { setShowEnroll(false); setEnrollForm(ENROLL_EMPTY); }}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">
                  Bekor qilish
                </button>
                <button onClick={handleEnroll} disabled={enrolling}
                  className="rounded-lg bg-[#2563eb] px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50">
                  {enrolling ? "..." : "Qo'shish"}
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Edit modal */}
      {editTarget && (() => {
        const filteredDirs = editAllDirections.filter(d =>
          (!editForm.edu_form_id || d.edu_form_id === +editForm.edu_form_id) &&
          (!editForm.edu_type_id || d.edu_type_id === +editForm.edu_type_id) &&
          (!editForm.edu_lang_id || d.edu_lang_id === +editForm.edu_lang_id)
        );
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto">
              <h3 className="mb-1 text-base font-bold text-gray-900">Talabani tahrirlash</h3>
              <p className="mb-4 text-sm text-gray-500">{editTarget.email}</p>
              <div className="grid grid-cols-2 gap-3">

                <div className="col-span-2">
                  <label className="mb-1 block text-xs font-medium text-gray-600">To'liq ismi</label>
                  <input type="text" value={editForm.full_name} onChange={e => setEditForm(f => ({ ...f, full_name: e.target.value }))} className={inputCls} />
                </div>
                <div className="col-span-2">
                  <label className="mb-1 block text-xs font-medium text-gray-600">Telefon</label>
                  <input type="text" value={editForm.phone} onChange={e => setEditForm(f => ({ ...f, phone: e.target.value }))} placeholder="+998..." className={inputCls} />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600">Passport seriyasi</label>
                  <input type="text" value={editForm.passport_serial} onChange={e => setEditForm(f => ({ ...f, passport_serial: e.target.value }))} placeholder="AA1234567" className={inputCls} />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600">PINFL</label>
                  <input type="text" value={editForm.pin} onChange={e => setEditForm(f => ({ ...f, pin: e.target.value }))} placeholder="14 raqamli PIN" className={inputCls} />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600">Ta'lim shakli</label>
                  <select value={editForm.edu_form_id} onChange={e => setEditForm(f => ({ ...f, edu_form_id: e.target.value, direction_id: "", course_id: "", group_id: "" }))} className={inputCls}>
                    <option value="">— Barchasi —</option>
                    {editEduForms.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600">Ta'lim turi</label>
                  <select value={editForm.edu_type_id} onChange={e => setEditForm(f => ({ ...f, edu_type_id: e.target.value, direction_id: "", course_id: "", group_id: "" }))} className={inputCls}>
                    <option value="">— Barchasi —</option>
                    {editEduTypes.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="mb-1 block text-xs font-medium text-gray-600">Ta'lim tili</label>
                  <select value={editForm.edu_lang_id} onChange={e => setEditForm(f => ({ ...f, edu_lang_id: e.target.value, direction_id: "", course_id: "", group_id: "" }))} className={inputCls}>
                    <option value="">— Barchasi —</option>
                    {editEduLangs.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="mb-1 block text-xs font-medium text-gray-600">Yo'nalish</label>
                  <select value={editForm.direction_id} onChange={e => {
                    const did = e.target.value;
                    setEditForm(f => ({ ...f, direction_id: did, course_id: "", group_id: "" }));
                    setEditCourses([]); setEditGroups([]);
                    if (did) api.get<Course[]>(`/academic/directions/${did}/courses`).then(setEditCourses);
                  }} className={inputCls}>
                    <option value="">— Tanlang —</option>
                    {filteredDirs.map(d => <option key={d.id} value={d.id}>{d.name} ({d.faculty_name})</option>)}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600">Kurs</label>
                  <select value={editForm.course_id} disabled={!editForm.direction_id} onChange={e => {
                    const cid = e.target.value;
                    setEditForm(f => ({ ...f, course_id: cid, group_id: "" }));
                    setEditGroups([]);
                    if (cid) api.get<Group[]>(`/academic/courses/${cid}/groups`).then(setEditGroups);
                  }} className={inputCls + (!editForm.direction_id ? " opacity-50" : "")}>
                    <option value="">— Tanlang —</option>
                    {[...editCourses].sort((a, b) => a.number - b.number).map(c => <option key={c.id} value={c.id}>{c.number}-kurs</option>)}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600">Guruh</label>
                  <select value={editForm.group_id} disabled={!editForm.course_id} onChange={e => setEditForm(f => ({ ...f, group_id: e.target.value }))} className={inputCls + (!editForm.course_id ? " opacity-50" : "")}>
                    <option value="">— Tanlang —</option>
                    {editGroups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                  </select>
                </div>

              </div>
              <div className="mt-5 flex justify-end gap-2">
                <button onClick={closeEdit}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">
                  Bekor qilish
                </button>
                <button onClick={handleEdit} disabled={editing}
                  className="rounded-lg bg-[#2563eb] px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50">
                  {editing ? "..." : "Saqlash"}
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </DashboardShell>
  );
}
