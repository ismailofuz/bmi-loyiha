"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import DashboardShell from "@/components/DashboardShell";
import EmptyState from "@/components/EmptyState";
import { api } from "@/lib/api";
import { useToast } from "@/components/ToastProvider";

const nav = [
  { label: "Bosh sahifa", href: "/university",             icon: <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path fillRule="evenodd" d="M9.293 2.293a1 1 0 011.414 0l7 7A1 1 0 0117 11h-1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-3a1 1 0 00-1-1H9a1 1 0 00-1 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-6H3a1 1 0 01-.707-1.707l7-7z" clipRule="evenodd" /></svg> },
  { label: "Talabalar",   href: "/university/students",     icon: <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z" /></svg> },
  { label: "Hisobotlar",  href: "/university/reports",      icon: <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" /></svg> },
  { label: "Xodimlar",    href: "/university/staff",        adminOnly: true, icon: <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path d="M7 8a3 3 0 100-6 3 3 0 000 6zM14.5 9a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM1.615 16.428a1.224 1.224 0 01-.569-1.175 6.002 6.002 0 0111.908 0c.058.467-.172.92-.57 1.174A9.953 9.953 0 017 18a9.953 9.953 0 01-5.385-1.572zM14.5 16h-.106c.07-.297.088-.611.048-.933a7.47 7.47 0 00-1.588-3.755 4.502 4.502 0 015.874 2.636.818.818 0 01-.36.98A7.465 7.465 0 0114.5 16z" /></svg> },
  { label: "Amaliyotlar", href: "/university/amaliyotlar",  icon: <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path fillRule="evenodd" d="M6 3.75A2.75 2.75 0 018.75 1h2.5A2.75 2.75 0 0114 3.75v.443c.572.055 1.14.122 1.706.2C17.053 4.582 18 5.75 18 7.07v3.469c0 1.126-.694 2.191-1.83 2.54-1.952.599-4.024.921-6.17.921s-4.219-.322-6.17-.921C2.694 12.73 2 11.665 2 10.539V7.07c0-1.321.947-2.489 2.294-2.676A41.047 41.047 0 016 4.193V3.75zm6.5 0v.325a41.622 41.622 0 00-5 0V3.75c0-.69.56-1.25 1.25-1.25h2.5c.69 0 1.25.56 1.25 1.25zM10 10a1 1 0 00-1 1v.01a1 1 0 001 1h.01a1 1 0 001-1V11a1 1 0 00-1-1H10z" clipRule="evenodd" /><path d="M3 15.055v-.684c.126.053.255.1.39.142 2.1.644 4.318.999 6.61.999 2.291 0 4.51-.355 6.61-.999.135-.041.264-.089.39-.142v.684c0 1.347-.985 2.53-2.363 2.686a41.454 41.454 0 01-9.274 0C3.985 17.585 3 16.402 3 15.055z" /></svg> },
  { label: "Struktura",   href: "/university/struktura",   icon: <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path d="M2 3a1 1 0 00-1 1v1a1 1 0 001 1h16a1 1 0 001-1V4a1 1 0 00-1-1H2zM2 9a1 1 0 00-1 1v1a1 1 0 001 1h6a1 1 0 001-1v-1a1 1 0 00-1-1H2zM2 15a1 1 0 00-1 1v1a1 1 0 001 1h6a1 1 0 001-1v-1a1 1 0 00-1-1H2z" /></svg> }, 
  { label: "Hamkor korxonalar",  href: "/university/korxonalar",         icon: <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V8a2 2 0 00-2-2h-5L9 4H4zm7 5a1 1 0 10-2 0v1H8a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" /></svg> },
  { label: "Qaydnomalar",        href: "/university/qaydnomalar",        icon: <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" /></svg> },
];

const STATUS_STYLE: Record<string, string> = {
  pending:   "bg-yellow-100 text-yellow-700",
  accepted:  "bg-green-100 text-green-700",
  cancelled: "bg-gray-100 text-gray-600",
};
const STATUS_LABEL: Record<string, string> = {
  pending:   "Kutilmoqda",
  accepted:  "Tasdiqlandi",
  cancelled: "Bekor qilindi",
};

interface Internship {
  id: number; status: string;
  company_id: number; company_name: string;
  supervisor_id: number | null; supervisor_name: string | null;
  internship_start: string; internship_end: string;
  university_id: number; created_at: string;
}

interface StudentEntry {
  id: number; status: string;
  student_id: number; student_name: string;
  passport_serial: string | null; pin: string | null;
  created_at: string;
}

interface Student {
  id: number; full_name: string;
  edu_form_id: number | null; edu_type_id: number | null; edu_lang_id: number | null;
  direction_id: number | null; course_id: number | null; group_id: number | null;
}
interface EduForm     { id: number; name: string }
interface EduType     { id: number; name: string }
interface EduLang     { id: number; name: string }
interface Direction   { id: number; name: string; faculty_name: string; edu_form_id: number | null; edu_type_id: number | null; edu_lang_id: number | null }
interface Course      { id: number; number: number }
interface Group       { id: number; name: string }

const FILTER_EMPTY = { edu_form_id: "", edu_type_id: "", edu_lang_id: "", direction_id: "", course_id: "", group_id: "", search: "" };

export default function InternshipDetailPage() {
  const params = useParams<{ internshipId: string }>();
  const internshipId = params?.internshipId;

  const [internship, setInternship] = useState<Internship | null>(null);
  const [students, setStudents]     = useState<StudentEntry[]>([]);
  const [loading, setLoading]       = useState(true);

  /* Assign student modal */
  const [showAssign, setShowAssign]       = useState(false);
  const [assignLoading, setAssignLoading] = useState(false);
  const [assigning, setAssigning]         = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);
  const [filter, setFilter]               = useState(FILTER_EMPTY);

  /* Modal data */
  const [allStudents, setAllStudents]     = useState<Student[]>([]);
  const [eduForms, setEduForms]           = useState<EduForm[]>([]);
  const [eduTypes, setEduTypes]           = useState<EduType[]>([]);
  const [eduLangs, setEduLangs]           = useState<EduLang[]>([]);
  const [allDirections, setAllDirections] = useState<Direction[]>([]);
  const [courses, setCourses]             = useState<Course[]>([]);
  const [groups, setGroups]               = useState<Group[]>([]);

  /* Delete confirm */
  const [deleteTarget, setDeleteTarget] = useState<StudentEntry | null>(null);
  const [deleting, setDeleting]         = useState(false);

  const { toast } = useToast();

  const loadData = useCallback(async () => {
    if (!internshipId) return;
    setLoading(true);
    try {
      const [inv, sts] = await Promise.all([
        api.get<Internship>(`/internships/${internshipId}`),
        api.get<StudentEntry[]>(`/internships/${internshipId}/students`),
      ]);
      setInternship(inv);
      setStudents(sts);
    } catch {
      /* handled by toast */
    } finally {
      setLoading(false);
    }
  }, [internshipId]);

  useEffect(() => { loadData(); }, [loadData]);

  async function openAssign() {
    setShowAssign(true);
    setSelectedStudentId(null);
    setFilter(FILTER_EMPTY);
    setCourses([]); setGroups([]);
    if (allStudents.length) return;
    setAssignLoading(true);
    await Promise.allSettled([
      api.get<Student[]>("/students"),
      api.get<EduForm[]>("/academic/education-forms"),
      api.get<EduType[]>("/academic/education-types"),
      api.get<EduLang[]>("/academic/education-languages"),
      api.get<Direction[]>("/academic/directions"),
    ]).then(([sR, fR, tR, lR, dR]) => {
      if (sR.status === "fulfilled") setAllStudents(sR.value);
      if (fR.status === "fulfilled") setEduForms(fR.value);
      if (tR.status === "fulfilled") setEduTypes(tR.value);
      if (lR.status === "fulfilled") setEduLangs(lR.value);
      if (dR.status === "fulfilled") setAllDirections(dR.value);
    }).finally(() => setAssignLoading(false));
  }

  async function handleAssign() {
    if (!selectedStudentId) return toast("Talabani tanlang", "error");
    setAssigning(true);
    try {
      await api.post(`/internships/${internshipId}/students`, { student_id: selectedStudentId });
      setShowAssign(false);
      await loadData();
      toast("Talaba biriktirildi", "success");
    } catch (e) { toast(e instanceof Error ? e.message : "Xatolik", "error"); }
    finally { setAssigning(false); }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.delete(`/internship-students/${deleteTarget.id}`);
      setDeleteTarget(null);
      await loadData();
      toast("Talaba amaliyotdan chiqarildi", "success");
    } catch (e) { toast(e instanceof Error ? e.message : "Xatolik", "error"); }
    finally { setDeleting(false); }
  }

  const fmt = (d: string) => new Date(d).toLocaleDateString("uz-UZ");
  const inputCls = "block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#2563eb]";

  const StatusBadge = ({ status }: { status: string }) => (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLE[status] ?? "bg-gray-100 text-gray-600"}`}>
      {STATUS_LABEL[status] ?? status}
    </span>
  );

  const alreadyAssigned = new Set(students.map(s => s.student_id));

  const filteredDirs = allDirections.filter(d =>
    (!filter.edu_form_id || d.edu_form_id === +filter.edu_form_id) &&
    (!filter.edu_type_id || d.edu_type_id === +filter.edu_type_id) &&
    (!filter.edu_lang_id || d.edu_lang_id === +filter.edu_lang_id)
  );

  const visibleStudents = allStudents.filter(s => {
    if (alreadyAssigned.has(s.id)) return false;
    if (filter.edu_form_id  && s.edu_form_id  !== +filter.edu_form_id)  return false;
    if (filter.edu_type_id  && s.edu_type_id  !== +filter.edu_type_id)  return false;
    if (filter.edu_lang_id  && s.edu_lang_id  !== +filter.edu_lang_id)  return false;
    if (filter.direction_id && s.direction_id !== +filter.direction_id) return false;
    if (filter.course_id    && s.course_id    !== +filter.course_id)    return false;
    if (filter.group_id     && s.group_id     !== +filter.group_id)     return false;
    if (filter.search && !s.full_name.toLowerCase().includes(filter.search.toLowerCase())) return false;
    return true;
  });

  const stats = {
    total:     students.length,
    accepted:  students.filter(s => s.status === "accepted").length,
    pending:   students.filter(s => s.status === "pending").length,
    cancelled: students.filter(s => s.status === "cancelled").length,
  };

  if (loading) {
    return (
      <DashboardShell nav={nav}>
        <div className="space-y-5">
          <div className="h-8 w-48 animate-pulse rounded-lg bg-gray-200" />
          <div className="h-28 animate-pulse rounded-xl bg-gray-100" />
          <div className="h-64 animate-pulse rounded-xl bg-gray-100" />
        </div>
      </DashboardShell>
    );
  }

  if (!internship) {
    return (
      <DashboardShell nav={nav}>
        <EmptyState message="Amaliyot topilmadi" sub="Bunday amaliyot mavjud emas yoki kirish huquqingiz yo'q" />
      </DashboardShell>
    );
  }

  return (
    <DashboardShell nav={nav}>
      <div className="space-y-5">
        {/* Back link */}
        <Link href="/university/amaliyotlar"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700">
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
            <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
          </svg>
          Amaliyotlarga qaytish
        </Link>

        {/* Header card */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-bold text-gray-900">{internship.company_name}</h1>
                <StatusBadge status={internship.status} />
              </div>
              <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-600">
                <span>
                  <span className="font-medium text-gray-700">Mas&apos;ul hodim:</span>{" "}
                  {internship.supervisor_name ?? "—"}
                </span>
                <span>
                  <span className="font-medium text-gray-700">Muddat:</span>{" "}
                  {fmt(internship.internship_start)} — {fmt(internship.internship_end)}
                </span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: "Jami",         value: stats.total,     color: "bg-blue-50 text-blue-700" },
              { label: "Tasdiqlandi",  value: stats.accepted,  color: "bg-green-50 text-green-700" },
              { label: "Kutilmoqda",   value: stats.pending,   color: "bg-yellow-50 text-yellow-700" },
              { label: "Bekor qilindi",value: stats.cancelled, color: "bg-gray-50 text-gray-600" },
            ].map(s => (
              <div key={s.label} className={`rounded-lg px-4 py-3 text-center ${s.color}`}>
                <div className="text-2xl font-bold">{s.value}</div>
                <div className="text-xs font-medium">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Students section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-800">Amaliyot guruhi</h2>
            {internship.status === "accepted" && (
              <button onClick={openAssign}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#2563eb] px-3.5 py-2 text-sm font-semibold text-white hover:bg-blue-700">
                <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                  <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                </svg>
                Talaba biriktirish
              </button>
            )}
          </div>

          {students.length === 0 ? (
            <EmptyState
              message="Talabalar yo'q"
              sub={internship.status === "accepted"
                ? "Yuqoridagi tugma orqali talaba biriktiring"
                : "Shartnoma tasdiqlanganidan keyin talaba biriktirish mumkin"}
            />
          ) : (
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-100">
                  <thead className="bg-gray-50">
                    <tr>
                      {["#", "Talaba", "Passport", "PINFL", "Holat", "Sana", ""].map(h => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {students.map((s, i) => (
                      <tr key={s.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-400">{i + 1}</td>
                        <td className="px-4 py-3 text-sm font-semibold text-gray-800">{s.student_name}</td>
                        <td className="px-4 py-3 text-xs text-gray-500">{s.passport_serial ?? "—"}</td>
                        <td className="px-4 py-3 text-xs text-gray-500">{s.pin ?? "—"}</td>
                        <td className="px-4 py-3"><StatusBadge status={s.status} /></td>
                        <td className="px-4 py-3 text-xs text-gray-400">{fmt(s.created_at)}</td>
                        <td className="px-4 py-3">
                          {s.status === "pending" && (
                            <button onClick={() => setDeleteTarget(s)}
                              className="rounded-lg border border-red-200 px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-50">
                              Bekor qilish
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Assign student modal ── */}
      {showAssign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl max-h-[90vh] flex flex-col">
            <h3 className="mb-4 text-base font-bold text-gray-900">Talaba biriktirish</h3>

            {assignLoading ? (
              <div className="space-y-3 flex-1 py-2">
                {[1,2,3,4].map(i => <div key={i} className="h-10 animate-pulse rounded bg-gray-100" />)}
              </div>
            ) : (
              <div className="flex flex-col gap-3 flex-1 min-h-0">
                {/* Filters */}
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-600">Ta&apos;lim shakli</label>
                    <select value={filter.edu_form_id} onChange={e => setFilter(f => ({ ...f, edu_form_id: e.target.value, direction_id: "", course_id: "", group_id: "" }))} className={inputCls}>
                      <option value="">— Barchasi —</option>
                      {eduForms.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-600">Ta&apos;lim turi</label>
                    <select value={filter.edu_type_id} onChange={e => setFilter(f => ({ ...f, edu_type_id: e.target.value, direction_id: "", course_id: "", group_id: "" }))} className={inputCls}>
                      <option value="">— Barchasi —</option>
                      {eduTypes.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-600">Ta&apos;lim tili</label>
                    <select value={filter.edu_lang_id} onChange={e => setFilter(f => ({ ...f, edu_lang_id: e.target.value, direction_id: "", course_id: "", group_id: "" }))} className={inputCls}>
                      <option value="">— Barchasi —</option>
                      {eduLangs.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                    </select>
                  </div>
                  <div className="col-span-3">
                    <label className="mb-1 block text-xs font-medium text-gray-600">Yo&apos;nalish</label>
                    <select value={filter.direction_id} onChange={e => {
                      const did = e.target.value;
                      setFilter(f => ({ ...f, direction_id: did, course_id: "", group_id: "" }));
                      setCourses([]); setGroups([]);
                      if (did) api.get<Course[]>(`/academic/directions/${did}/courses`).then(setCourses).catch(() => {});
                    }} className={inputCls}>
                      <option value="">— Barchasi —</option>
                      {filteredDirs.map(d => <option key={d.id} value={d.id}>{d.name} ({d.faculty_name})</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-600">Kurs</label>
                    <select value={filter.course_id} disabled={!filter.direction_id} onChange={e => {
                      const cid = e.target.value;
                      setFilter(f => ({ ...f, course_id: cid, group_id: "" }));
                      setGroups([]);
                      if (cid) api.get<Group[]>(`/academic/courses/${cid}/groups`).then(setGroups).catch(() => {});
                    }} className={inputCls + (!filter.direction_id ? " opacity-50" : "")}>
                      <option value="">— Barchasi —</option>
                      {[...courses].sort((a, b) => a.number - b.number).map(c => <option key={c.id} value={c.id}>{c.number}-kurs</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-600">Guruh</label>
                    <select value={filter.group_id} disabled={!filter.course_id} onChange={e => setFilter(f => ({ ...f, group_id: e.target.value }))} className={inputCls + (!filter.course_id ? " opacity-50" : "")}>
                      <option value="">— Barchasi —</option>
                      {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                    </select>
                  </div>
                  <div className="col-span-3">
                    <label className="mb-1 block text-xs font-medium text-gray-600">Ism bo&apos;yicha qidirish</label>
                    <input type="text" value={filter.search} onChange={e => setFilter(f => ({ ...f, search: e.target.value }))} placeholder="Familiya Ism..." className={inputCls} />
                  </div>
                </div>

                {/* Student radio list */}
                <div className="flex-1 overflow-y-auto max-h-48 rounded-lg border border-gray-200 divide-y divide-gray-100">
                  {visibleStudents.length === 0 ? (
                    <div className="flex items-center justify-center py-6 text-sm text-gray-400">
                      {allStudents.length === 0 ? "Talabalar yuklanmoqda..." : "Talabalar topilmadi"}
                    </div>
                  ) : (
                    visibleStudents.map(s => (
                      <label key={s.id} className={`flex cursor-pointer items-center gap-3 px-4 py-2.5 hover:bg-gray-50 ${selectedStudentId === s.id ? "bg-blue-50" : ""}`}>
                        <input
                          type="radio"
                          name="assign-student"
                          checked={selectedStudentId === s.id}
                          onChange={() => setSelectedStudentId(s.id)}
                          className="h-4 w-4 text-[#2563eb]"
                        />
                        <span className="text-sm text-gray-800">{s.full_name}</span>
                      </label>
                    ))
                  )}
                </div>

                <p className="text-xs text-gray-400">
                  {visibleStudents.length} ta talaba ko&apos;rsatilmoqda
                  {alreadyAssigned.size > 0 && ` · ${alreadyAssigned.size} ta allaqachon biriktirilgan`}
                </p>
              </div>
            )}

            <div className="mt-4 flex justify-end gap-2 border-t border-gray-100 pt-4">
              <button onClick={() => setShowAssign(false)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">
                Bekor qilish
              </button>
              <button onClick={handleAssign} disabled={assigning || !selectedStudentId}
                className="rounded-lg bg-[#2563eb] px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50">
                {assigning ? "..." : "Biriktirish"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete confirm ── */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="mb-2 text-base font-bold text-gray-900">Talabani amaliyotdan chiqarish</h3>
            <p className="mb-5 text-sm text-gray-600">
              <span className="font-semibold text-gray-800">{deleteTarget.student_name}</span> ni{" "}
              bu amaliyotdan chiqarasizmi?
            </p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setDeleteTarget(null)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">
                Yo&apos;q
              </button>
              <button onClick={handleDelete} disabled={deleting}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50">
                {deleting ? "..." : "Ha, chiqarish"}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
