"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import DashboardShell from "@/components/DashboardShell";
import PageHeader from "@/components/PageHeader";
import EmptyState from "@/components/EmptyState";
import { api } from "@/lib/api";
import { getUser } from "@/lib/auth";
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

interface Company  { id: number; name: string }
interface Staff    { id: number; full_name: string; email: string }

interface Internship {
  id: number; status: string;
  company_id: number; company_name: string;
  supervisor_name: string | null;
  internship_start: string; internship_end: string;
  created_at: string;
  contract_uuid: string | null;
}

interface StudentEntry {
  id: number; status: string;
  student_name: string; company_name: string;
  supervisor_name: string | null;
  internship_start: string; internship_end: string;
  created_at: string;
  edu_form_id: number | null; edu_type_id: number | null; edu_lang_id: number | null;
  direction_id: number | null; course_id: number | null; group_id: number | null;
}

interface Opt { id: number; name: string }
interface CourseOpt { id: number; number: number; direction_id: number }
interface GroupOpt { id: number; name: string; course_id: number }

const FILTERS_EMPTY = {
  search: "", edu_form_id: "", edu_type_id: "", edu_lang_id: "",
  direction_id: "", course_id: "", group_id: "",
};

const FORM_EMPTY = { company_id: "", supervisor_id: "", internship_start: "", internship_end: "" };

export default function UniversityAmaliyotlarPage() {
  const [activeTab, setActiveTab] = useState<"internships" | "students">("internships");

  /* Tab 1 — shartnomalar */
  const [internships, setInternships]   = useState<Internship[]>([]);
  const [loadingI, setLoadingI]         = useState(true);

  /* Tab 2 — talabalar */
  const [studentEntries, setStudentEntries] = useState<StudentEntry[]>([]);
  const [loadingS, setLoadingS]             = useState(false);
  const [studentTabLoaded, setStudentTabLoaded] = useState(false);

  /* Tab 2 — filtrlar */
  const [filters, setFilters] = useState(FILTERS_EMPTY);
  const [eduForms, setEduForms] = useState<Opt[]>([]);
  const [eduTypes, setEduTypes] = useState<Opt[]>([]);
  const [eduLangs, setEduLangs] = useState<Opt[]>([]);
  const [directions, setDirections] = useState<Opt[]>([]);
  const [courses, setCourses] = useState<CourseOpt[]>([]);
  const [groups, setGroups] = useState<GroupOpt[]>([]);

  /* Create shartnoma modal */
  const [showCreate, setShowCreate]   = useState(false);
  const [form, setForm]               = useState(FORM_EMPTY);
  const [creating, setCreating]       = useState(false);
  const [companies, setCompanies]     = useState<Company[]>([]);
  const [staffList, setStaffList]     = useState<Staff[]>([]);
  const [modalLoading, setModalLoading] = useState(false);

  /* Delete confirm (tab 2) */
  const [deleteTarget, setDeleteTarget] = useState<StudentEntry | null>(null);
  const [deleting, setDeleting]         = useState(false);

  const { toast } = useToast();

  const loadInternships = useCallback(() => {
    setLoadingI(true);
    api.get<Internship[]>("/internships").then(setInternships).finally(() => setLoadingI(false));
  }, []);

  const loadStudentEntries = useCallback(() => {
    setLoadingS(true);
    api.get<StudentEntry[]>("/internship-students")
      .then(setStudentEntries)
      .finally(() => { setLoadingS(false); setStudentTabLoaded(true); });
    // Filtr ro'yxatlari
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

  useEffect(() => { loadInternships(); }, [loadInternships]);

  useEffect(() => {
    if (activeTab === "students" && !studentTabLoaded) loadStudentEntries();
  }, [activeTab, studentTabLoaded, loadStudentEntries]);

  async function openCreate() {
    setShowCreate(true);
    if (companies.length) return;
    setModalLoading(true);
    const me = getUser();
    await Promise.allSettled([
      api.get<Company[]>("/companies"),
      me?.universityId ? api.get<Staff[]>(`/universities/${me.universityId}/staff`) : Promise.resolve([]),
    ]).then(([coR, stR]) => {
      if (coR.status === "fulfilled") setCompanies(coR.value);
      if (stR.status === "fulfilled") setStaffList(stR.value as Staff[]);
    }).finally(() => setModalLoading(false));
  }

  async function handleCreate() {
    if (!form.company_id)       return toast("Kompaniyani tanlang", "error");
    if (!form.internship_start) return toast("Boshlanish sanasini kiriting", "error");
    if (!form.internship_end)   return toast("Tugash sanasini kiriting", "error");
    setCreating(true);
    try {
      await api.post("/internships", {
        company_id:       +form.company_id,
        supervisor_id:    form.supervisor_id ? +form.supervisor_id : undefined,
        internship_start: form.internship_start,
        internship_end:   form.internship_end,
      });
      setShowCreate(false); setForm(FORM_EMPTY);
      loadInternships();
    } catch (e) { toast(e instanceof Error ? e.message : "Xatolik", "error"); }
    finally { setCreating(false); }
  }

  async function handleDeleteStudent() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.delete(`/internship-students/${deleteTarget.id}`);
      setDeleteTarget(null);
      loadStudentEntries();
      toast("Talaba amaliyotdan chiqarildi", "success");
    } catch (e) { toast(e instanceof Error ? e.message : "Xatolik", "error"); }
    finally { setDeleting(false); }
  }

  const inputCls = "block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#2563eb]";
  const fmt = (d: string) => new Date(d).toLocaleDateString("uz-UZ");

  // Kaskad: kurslar tanlangan yo'nalishga, guruhlar tanlangan kursga bog'liq
  const courseOpts = filters.direction_id ? courses.filter(c => c.direction_id === +filters.direction_id) : courses;
  const groupOpts = filters.course_id ? groups.filter(g => g.course_id === +filters.course_id) : groups;

  function setFilter(patch: Partial<typeof FILTERS_EMPTY>) {
    setFilters(prev => {
      const next = { ...prev, ...patch };
      if (patch.direction_id !== undefined) { next.course_id = ""; next.group_id = ""; }
      if (patch.course_id !== undefined) { next.group_id = ""; }
      return next;
    });
  }

  const filteredEntries = studentEntries.filter(e => {
    const f = filters;
    if (f.search && !e.student_name.toLowerCase().includes(f.search.trim().toLowerCase())) return false;
    if (f.edu_form_id && e.edu_form_id !== +f.edu_form_id) return false;
    if (f.edu_type_id && e.edu_type_id !== +f.edu_type_id) return false;
    if (f.edu_lang_id && e.edu_lang_id !== +f.edu_lang_id) return false;
    if (f.direction_id && e.direction_id !== +f.direction_id) return false;
    if (f.course_id && e.course_id !== +f.course_id) return false;
    if (f.group_id && e.group_id !== +f.group_id) return false;
    return true;
  });

  const StatusBadge = ({ status }: { status: string }) => (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLE[status] ?? "bg-gray-100 text-gray-600"}`}>
      {STATUS_LABEL[status] ?? status}
    </span>
  );

  return (
    <DashboardShell nav={nav}>
      <div className="space-y-5">
        <PageHeader
          title="Amaliyotlar"
          subtitle="Korxonalar bilan amaliyot hamkorligi"
          action={
            activeTab === "internships" ? (
              <button onClick={openCreate}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#2563eb] px-3.5 py-2 text-sm font-semibold text-white hover:bg-blue-700">
                <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4"><path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" /></svg>
                Yangi amaliyot
              </button>
            ) : undefined
          }
        />

        {/* Section tabs */}
        <div className="flex gap-1 rounded-xl border border-gray-200 bg-gray-50 p-1 w-fit">
          {([
            { key: "internships", label: "Amaliyotlar" },
            { key: "students",    label: "Talaba amaliyot guruhlari" },
          ] as const).map(t => (
            <button key={t.key} onClick={() => setActiveTab(t.key)}
              className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-colors ${
                activeTab === t.key
                  ? "bg-white text-[#2563eb] shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* ── Tab 1: Shartnomalar ── */}
        {activeTab === "internships" && (
          loadingI ? (
            <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-14 animate-pulse rounded-xl bg-gray-100" />)}</div>
          ) : internships.length === 0 ? (
            <EmptyState message="Amaliyotlar yo'q" sub="Yangi amaliyot yaratish uchun yuqoridagi tugmani bosing" />
          ) : (
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-100">
                  <thead className="bg-gray-50">
                    <tr>
                      {["#", "Kompaniya", "Mas'ul hodim", "Muddat", "Holat", "Sana", ""].map(h => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {internships.map((item, i) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-400">{i + 1}</td>
                        <td className="px-4 py-3 text-sm">
                          {item.status === "accepted" ? (
                            <Link href={`/university/amaliyotlar/${item.id}`}
                              className="font-semibold text-[#2563eb] hover:underline">
                              {item.company_name}
                            </Link>
                          ) : (
                            <span className="font-semibold text-gray-800">{item.company_name}</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">{item.supervisor_name ?? "—"}</td>
                        <td className="px-4 py-3 text-xs text-gray-500">
                          {fmt(item.internship_start)} — {fmt(item.internship_end)}
                        </td>
                        <td className="px-4 py-3"><StatusBadge status={item.status} /></td>
                        <td className="px-4 py-3 text-xs text-gray-400">{fmt(item.created_at)}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            {item.contract_uuid && (
                              <Link href={`/contracts/${item.contract_uuid}`}
                                className="rounded-lg border border-blue-200 px-2.5 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50">
                                Shartnoma
                              </Link>
                            )}
                            {item.status === "accepted" && (
                              <Link href={`/university/amaliyotlar/${item.id}`}
                                className="rounded-lg border border-gray-200 px-2.5 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100">
                                Ko'rish
                              </Link>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )
        )}

        {/* ── Tab 2: Talaba amaliyot guruhlari ── */}
        {activeTab === "students" && (
          loadingS ? (
            <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-14 animate-pulse rounded-xl bg-gray-100" />)}</div>
          ) : studentEntries.length === 0 ? (
            <EmptyState message="Talabalar yo'q" sub="Shartnoma tasdiqlanganidan keyin talabalar biriktiriladi" />
          ) : (
            <div className="space-y-4">
              {/* Filtrlar */}
              <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                <input
                  type="text"
                  value={filters.search}
                  onChange={e => setFilter({ search: e.target.value })}
                  placeholder="Ism familiya bo'yicha qidirish..."
                  className="mb-3 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#2563eb]"
                />
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                  <select value={filters.edu_form_id} onChange={e => setFilter({ edu_form_id: e.target.value })} className="rounded-lg border border-gray-300 px-2.5 py-2 text-sm outline-none focus:border-[#2563eb]">
                    <option value="">Ta&apos;lim shakli</option>
                    {eduForms.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
                  </select>
                  <select value={filters.edu_type_id} onChange={e => setFilter({ edu_type_id: e.target.value })} className="rounded-lg border border-gray-300 px-2.5 py-2 text-sm outline-none focus:border-[#2563eb]">
                    <option value="">Ta&apos;lim turi</option>
                    {eduTypes.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
                  </select>
                  <select value={filters.edu_lang_id} onChange={e => setFilter({ edu_lang_id: e.target.value })} className="rounded-lg border border-gray-300 px-2.5 py-2 text-sm outline-none focus:border-[#2563eb]">
                    <option value="">Ta&apos;lim tili</option>
                    {eduLangs.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
                  </select>
                  <select value={filters.direction_id} onChange={e => setFilter({ direction_id: e.target.value })} className="rounded-lg border border-gray-300 px-2.5 py-2 text-sm outline-none focus:border-[#2563eb]">
                    <option value="">Yo&apos;nalish</option>
                    {directions.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
                  </select>
                  <select value={filters.course_id} onChange={e => setFilter({ course_id: e.target.value })} className="rounded-lg border border-gray-300 px-2.5 py-2 text-sm outline-none focus:border-[#2563eb]">
                    <option value="">Kurs</option>
                    {courseOpts.map(o => <option key={o.id} value={o.id}>{o.number}-kurs</option>)}
                  </select>
                  <select value={filters.group_id} onChange={e => setFilter({ group_id: e.target.value })} className="rounded-lg border border-gray-300 px-2.5 py-2 text-sm outline-none focus:border-[#2563eb]">
                    <option value="">Guruh</option>
                    {groupOpts.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
                  </select>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xs text-gray-500">{filteredEntries.length} ta talaba</span>
                  <button onClick={() => setFilters(FILTERS_EMPTY)} className="text-xs font-medium text-[#2563eb] hover:underline">Tozalash</button>
                </div>
              </div>

            <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-100">
                  <thead className="bg-gray-50">
                    <tr>
                      {["#", "Talaba", "Kompaniya", "Mas'ul hodim", "Muddat", "Holat", ""].map(h => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredEntries.length === 0 ? (
                      <tr><td colSpan={7} className="px-4 py-8 text-center text-sm text-gray-400">Filtrga mos talaba topilmadi</td></tr>
                    ) : filteredEntries.map((e, i) => (
                      <tr key={e.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-400">{i + 1}</td>
                        <td className="px-4 py-3 text-sm font-semibold text-gray-800">{e.student_name}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{e.company_name}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{e.supervisor_name ?? "—"}</td>
                        <td className="px-4 py-3 text-xs text-gray-500">
                          {fmt(e.internship_start)} — {fmt(e.internship_end)}
                        </td>
                        <td className="px-4 py-3"><StatusBadge status={e.status} /></td>
                        <td className="px-4 py-3">
                          {e.status === "pending" && (
                            <button onClick={() => setDeleteTarget(e)}
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
            </div>
          )
        )}
      </div>

      {/* ── Create shartnoma modal ── */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="mb-4 text-base font-bold text-gray-900">Yangi amaliyot shartnomasi</h3>

            {modalLoading ? (
              <div className="space-y-3 py-2">{[1,2,3].map(i => <div key={i} className="h-10 animate-pulse rounded bg-gray-100" />)}</div>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600">Kompaniya *</label>
                  <select value={form.company_id} onChange={e => setForm(f => ({ ...f, company_id: e.target.value }))} className={inputCls} autoFocus>
                    <option value="">— Tanlang —</option>
                    {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600">Mas'ul hodim</label>
                  <select value={form.supervisor_id} onChange={e => setForm(f => ({ ...f, supervisor_id: e.target.value }))} className={inputCls}>
                    <option value="">— Tanlang —</option>
                    {staffList.map(s => <option key={s.id} value={s.id}>{s.full_name || s.email}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-600">Boshlanishi *</label>
                    <input type="date" value={form.internship_start} onChange={e => setForm(f => ({ ...f, internship_start: e.target.value }))} className={inputCls} />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-600">Tugashi *</label>
                    <input type="date" value={form.internship_end} onChange={e => setForm(f => ({ ...f, internship_end: e.target.value }))} className={inputCls} />
                  </div>
                </div>
              </div>
            )}

            <div className="mt-5 flex justify-end gap-2">
              <button onClick={() => { setShowCreate(false); setForm(FORM_EMPTY); }}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">
                Bekor qilish
              </button>
              <button onClick={handleCreate} disabled={creating}
                className="rounded-lg bg-[#2563eb] px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50">
                {creating ? "..." : "Korxonaga yuborish"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete student confirm ── */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="mb-2 text-base font-bold text-gray-900">Talabani amaliyotdan chiqarish</h3>
            <p className="mb-5 text-sm text-gray-600">
              <span className="font-semibold text-gray-800">{deleteTarget.student_name}</span> ni{" "}
              <span className="font-semibold text-gray-800">{deleteTarget.company_name}</span> dan chiqarasizmi?
            </p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setDeleteTarget(null)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">
                Yo'q
              </button>
              <button onClick={handleDeleteStudent} disabled={deleting}
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
