"use client";

import { useEffect, useState, useCallback } from "react";
import DashboardShell from "@/components/DashboardShell";
import PageHeader from "@/components/PageHeader";
import { api } from "@/lib/api";
import { useToast } from "@/components/ToastProvider";

const nav = [
  { label: "Bosh sahifa", href: "/university",            icon: <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path fillRule="evenodd" d="M9.293 2.293a1 1 0 011.414 0l7 7A1 1 0 0117 11h-1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-3a1 1 0 00-1-1H9a1 1 0 00-1 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-6H3a1 1 0 01-.707-1.707l7-7z" clipRule="evenodd" /></svg> },
  { label: "Talabalar",   href: "/university/students",   icon: <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z" /></svg> },
  { label: "Hisobotlar",  href: "/university/reports",    icon: <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" /></svg> },
  { label: "Xodimlar",    href: "/university/staff",      adminOnly: true, icon: <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path d="M7 8a3 3 0 100-6 3 3 0 000 6zM14.5 9a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM1.615 16.428a1.224 1.224 0 01-.569-1.175 6.002 6.002 0 0111.908 0c.058.467-.172.92-.57 1.174A9.953 9.953 0 017 18a9.953 9.953 0 01-5.385-1.572zM14.5 16h-.106c.07-.297.088-.611.048-.933a7.47 7.47 0 00-1.588-3.755 4.502 4.502 0 015.874 2.636.818.818 0 01-.36.98A7.465 7.465 0 0114.5 16z" /></svg> },
  { label: "Amaliyotlar", href: "/university/amaliyotlar",icon: <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path fillRule="evenodd" d="M6 3.75A2.75 2.75 0 018.75 1h2.5A2.75 2.75 0 0114 3.75v.443c.572.055 1.14.122 1.706.2C17.053 4.582 18 5.75 18 7.07v3.469c0 1.126-.694 2.191-1.83 2.54-1.952.599-4.024.921-6.17.921s-4.219-.322-6.17-.921C2.694 12.73 2 11.665 2 10.539V7.07c0-1.321.947-2.489 2.294-2.676A41.047 41.047 0 016 4.193V3.75zm6.5 0v.325a41.622 41.622 0 00-5 0V3.75c0-.69.56-1.25 1.25-1.25h2.5c.69 0 1.25.56 1.25 1.25zM10 10a1 1 0 00-1 1v.01a1 1 0 001 1h.01a1 1 0 001-1V11a1 1 0 00-1-1H10z" clipRule="evenodd" /><path d="M3 15.055v-.684c.126.053.255.1.39.142 2.1.644 4.318.999 6.61.999 2.291 0 4.51-.355 6.61-.999.135-.041.264-.089.39-.142v.684c0 1.347-.985 2.53-2.363 2.686a41.454 41.454 0 01-9.274 0C3.985 17.585 3 16.402 3 15.055z" /></svg> },
  { label: "Struktura",   href: "/university/struktura",  icon: <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path d="M2 3a1 1 0 00-1 1v1a1 1 0 001 1h16a1 1 0 001-1V4a1 1 0 00-1-1H2zM2 9a1 1 0 00-1 1v1a1 1 0 001 1h6a1 1 0 001-1v-1a1 1 0 00-1-1H2zM2 15a1 1 0 00-1 1v1a1 1 0 001 1h6a1 1 0 001-1v-1a1 1 0 00-1-1H2z" /></svg> }, 
  { label: "Hamkor korxonalar",  href: "/university/korxonalar",         icon: <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V8a2 2 0 00-2-2h-5L9 4H4zm7 5a1 1 0 10-2 0v1H8a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" /></svg> },
  { label: "Qaydnomalar",        href: "/university/qaydnomalar",        icon: <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" /></svg> },
];

interface Faculty    { id: number; name: string; code: string | null }
interface Department { id: number; name: string; faculty_id: number; faculty_name: string }
interface EduForm    { id: number; name: string }
interface EduType    { id: number; name: string }
interface EduLang    { id: number; name: string }
interface Direction  {
  id: number; name: string; code: string | null; faculty_id: number; faculty_name: string;
  edu_form_id: number | null; edu_type_id: number | null; edu_lang_id: number | null;
  edu_form_name: string | null; edu_type_name: string | null; edu_lang_name: string | null;
}
interface Course { id: number; direction_id: number; number: number; direction_name: string; faculty_name: string }
interface Group  {
  id: number; name: string; course_id: number; course_number: number; direction_name: string;
  direction_id: number; faculty_id: number;
  edu_form_id: number | null; edu_type_id: number | null; edu_lang_id: number | null;
}

type ModalMode = "faculty" | "department" | "edu_form" | "edu_type" | "edu_lang" | "direction" | "course" | "group";

interface ModalState {
  mode: ModalMode; action: "create" | "edit";
  editId?: number;
  name: string; code: string;
  facultyId: number | "";
  directionId: number | "";
  courseId: number | "";
  eduFormId: number | ""; eduTypeId: number | ""; eduLangId: number | "";
  courseNumber: number;
}

const MODAL_EMPTY: ModalState = {
  mode: "faculty", action: "create",
  name: "", code: "",
  facultyId: "", directionId: "", courseId: "",
  eduFormId: "", eduTypeId: "", eduLangId: "",
  courseNumber: 1,
};

const LABELS: Record<ModalMode, string> = {
  faculty: "Fakultet", department: "Kafedra",
  edu_form: "Ta'lim shakli", edu_type: "Ta'lim turi", edu_lang: "Ta'lim tili",
  direction: "Yo'nalish", course: "Kurs", group: "Guruh",
};

const EditIcon = () => (
  <svg viewBox="0 0 16 16" fill="currentColor" className="h-3.5 w-3.5">
    <path d="M11.013 1.427a1.75 1.75 0 012.474 2.474L5.19 12.196l-3.75.5.5-3.75 9.073-9.519z"/>
  </svg>
);
const DeleteIcon = () => (
  <svg viewBox="0 0 16 16" fill="currentColor" className="h-3.5 w-3.5">
    <path d="M6.5 1.75a.25.25 0 01.25-.25h2.5a.25.25 0 01.25.25V3h-3V1.75zM4.75 3a.75.75 0 000 1.5h.418l.486 8.503A1.75 1.75 0 007.399 14.5h1.202a1.75 1.75 0 001.745-1.497l.486-8.503h.418a.75.75 0 000-1.5H4.75z"/>
  </svg>
);

export default function UniversityStrukturaPage() {
  const [tab, setTab] = useState<"struktura" | "meta">("struktura");
  const [faculties,   setFaculties]   = useState<Faculty[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [directions,  setDirections]  = useState<Direction[]>([]);
  const [courses,     setCourses]     = useState<Course[]>([]);
  const [groups,      setGroups]      = useState<Group[]>([]);
  const [eduForms,    setEduForms]    = useState<EduForm[]>([]);
  const [eduTypes,    setEduTypes]    = useState<EduType[]>([]);
  const [eduLangs,    setEduLangs]    = useState<EduLang[]>([]);
  const [loading, setLoading] = useState(true);

  const [modal,      setModal]      = useState<ModalState | null>(null);
  const [saving,     setSaving]     = useState(false);
  const [confirmDel, setConfirmDel] = useState<{ mode: ModalMode; id: number } | null>(null);

  const { toast } = useToast();

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const [facsR, deptsR, dirsR, coursesR, groupsR, formsR, typesR, langsR] = await Promise.allSettled([
        api.get<Faculty[]>("/academic/faculties"),
        api.get<Department[]>("/academic/departments"),
        api.get<Direction[]>("/academic/directions"),
        api.get<Course[]>("/academic/courses"),
        api.get<Group[]>("/academic/groups"),
        api.get<EduForm[]>("/academic/education-forms"),
        api.get<EduType[]>("/academic/education-types"),
        api.get<EduLang[]>("/academic/education-languages"),
      ]);
      if (facsR.status    === "fulfilled") setFaculties(facsR.value);
      if (deptsR.status   === "fulfilled") setDepartments(deptsR.value);
      if (dirsR.status    === "fulfilled") setDirections(dirsR.value);
      if (coursesR.status === "fulfilled") setCourses(coursesR.value);
      if (groupsR.status  === "fulfilled") setGroups(groupsR.value);
      if (formsR.status   === "fulfilled") setEduForms(formsR.value);
      if (typesR.status   === "fulfilled") setEduTypes(typesR.value);
      if (langsR.status   === "fulfilled") setEduLangs(langsR.value);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadAll(); }, [loadAll]);

  function openCreate(mode: ModalMode) {
    setModal({ ...MODAL_EMPTY, mode, action: "create" });
  }

  function openEdit(mode: ModalMode, item: Faculty | Department | Direction | Course | Group | EduForm | EduType | EduLang) {
    const base: ModalState = { ...MODAL_EMPTY, mode, action: "edit", editId: item.id };
    switch (mode) {
      case "faculty":
        setModal({ ...base, name: (item as Faculty).name, code: (item as Faculty).code ?? "" });
        break;
      case "department":
        setModal({ ...base, name: (item as Department).name });
        break;
      case "direction": {
        const d = item as Direction;
        setModal({ ...base, name: d.name, code: d.code ?? "", facultyId: d.faculty_id,
          eduFormId: d.edu_form_id ?? "", eduTypeId: d.edu_type_id ?? "",
          eduLangId: d.edu_lang_id ?? "" });
        break;
      }
      case "course":
        setModal({ ...base, directionId: (item as Course).direction_id, courseNumber: (item as Course).number });
        break;
      case "group": {
        const g = item as Group;
        setModal({ ...base, name: g.name, courseId: g.course_id,
          directionId: g.direction_id, facultyId: g.faculty_id,
          eduFormId: g.edu_form_id ?? "", eduTypeId: g.edu_type_id ?? "", eduLangId: g.edu_lang_id ?? "" });
        break;
      }
      default:
        setModal({ ...base, name: (item as EduForm).name });
    }
  }

  async function handleSave() {
    if (!modal) return;
    setSaving(true);
    try {
      const { mode, action, editId, name, code, facultyId, directionId, courseId,
              eduFormId, eduTypeId, eduLangId, courseNumber } = modal;
      if (action === "create") {
        switch (mode) {
          case "faculty":    await api.post("/academic/faculties", { name, code: code || undefined }); break;
          case "department": await api.post("/academic/departments", { name, faculty_id: facultyId }); break;
          case "direction":  await api.post("/academic/directions", { name, code: code || undefined, faculty_id: facultyId, edu_form_id: eduFormId || null, edu_type_id: eduTypeId || null, edu_lang_id: eduLangId || null }); break;
          case "course":     await api.post("/academic/courses", { direction_id: directionId, number: courseNumber }); break;
          case "group":      await api.post("/academic/groups", { name, course_id: courseId }); break;
          case "edu_form":   await api.post("/academic/education-forms", { name }); break;
          case "edu_type":   await api.post("/academic/education-types", { name }); break;
          case "edu_lang":   await api.post("/academic/education-languages", { name }); break;
        }
      } else {
        switch (mode) {
          case "faculty":    await api.patch(`/academic/faculties/${editId}`, { name, code: code || undefined }); break;
          case "department": await api.patch(`/academic/departments/${editId}`, { name }); break;
          case "direction":  await api.patch(`/academic/directions/${editId}`, { name, code: code || undefined, edu_form_id: eduFormId || null, edu_type_id: eduTypeId || null, edu_lang_id: eduLangId || null }); break;
          case "course":     await api.patch(`/academic/courses/${editId}`, { number: courseNumber }); break;
          case "group":      await api.patch(`/academic/groups/${editId}`, { name, course_id: courseId || undefined }); break;
          case "edu_form":   await api.patch(`/academic/education-forms/${editId}`, { name }); break;
          case "edu_type":   await api.patch(`/academic/education-types/${editId}`, { name }); break;
          case "edu_lang":   await api.patch(`/academic/education-languages/${editId}`, { name }); break;
        }
      }
      setModal(null);
      await loadAll();
    } catch (e) { toast(e instanceof Error ? e.message : "Xatolik", "error"); }
    finally { setSaving(false); }
  }

  async function handleDelete() {
    if (!confirmDel) return;
    const { mode, id } = confirmDel;
    try {
      switch (mode) {
        case "faculty":    await api.delete(`/academic/faculties/${id}`); break;
        case "department": await api.delete(`/academic/departments/${id}`); break;
        case "direction":  await api.delete(`/academic/directions/${id}`); break;
        case "course":     await api.delete(`/academic/courses/${id}`); break;
        case "group":      await api.delete(`/academic/groups/${id}`); break;
        case "edu_form":   await api.delete(`/academic/education-forms/${id}`); break;
        case "edu_type":   await api.delete(`/academic/education-types/${id}`); break;
        case "edu_lang":   await api.delete(`/academic/education-languages/${id}`); break;
      }
      setConfirmDel(null);
      await loadAll();
    } catch (e) { toast(e instanceof Error ? e.message : "Xatolik", "error"); }
  }

  const inputCls  = "block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#2563eb]";
  const selectCls = "block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#2563eb] bg-white";

  function SectionHeader({ title, mode }: { title: string; mode: ModalMode }) {
    return (
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-100">
        <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
        <button onClick={() => openCreate(mode)}
          className="inline-flex items-center gap-1 text-xs font-medium text-[#2563eb] hover:underline">
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5"><path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" /></svg>
          Qo'shish
        </button>
      </div>
    );
  }

  function ActionBtns({ onEdit, onDel }: { onEdit: () => void; onDel: () => void }) {
    return (
      <div className="flex items-center justify-end gap-1">
        <button onClick={onEdit} className="rounded p-1.5 hover:bg-gray-100 text-gray-500"><EditIcon /></button>
        <button onClick={onDel} className="rounded p-1.5 hover:bg-red-50 text-red-400"><DeleteIcon /></button>
      </div>
    );
  }

  const thCls = "px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-gray-500";
  const tdCls = "px-4 py-2.5 text-sm";

  // Computed filtered lists for cascade modals
  const filteredDirsForCourse = directions.filter(d =>
    (!modal?.eduFormId || d.edu_form_id === modal.eduFormId) &&
    (!modal?.eduTypeId || d.edu_type_id === modal.eduTypeId)
  );

  const filteredDirsForGroup = directions.filter(d =>
    (!modal?.facultyId  || d.faculty_id   === modal.facultyId)  &&
    (!modal?.eduFormId  || d.edu_form_id  === modal.eduFormId)  &&
    (!modal?.eduTypeId  || d.edu_type_id  === modal.eduTypeId)  &&
    (!modal?.eduLangId  || d.edu_lang_id  === modal.eduLangId)
  );

  const filteredCoursesForGroup = modal?.directionId
    ? courses.filter(c => c.direction_id === modal.directionId)
    : [];

  return (
    <DashboardShell nav={nav}>
      <div className="space-y-5">
        <PageHeader title="Akademik struktura" subtitle="Fakultet, kafedra, yo'nalish, kurs va guruhlar boshqaruvi" />

        {/* Tab switcher */}
        <div className="flex gap-1 rounded-xl bg-gray-100 p-1 w-fit">
          {(["struktura", "meta"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${tab === t ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
              {t === "struktura" ? "Struktura" : "Ta'lim meta"}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-3">{[1,2,3,4,5].map(i => <div key={i} className="h-20 animate-pulse rounded-xl bg-gray-100" />)}</div>
        ) : tab === "meta" ? (

          /* ── Ta'lim meta tab ──────────────────────────────────────────────── */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {([
              { title: "Ta'lim shakllari", items: eduForms, mode: "edu_form" as ModalMode },
              { title: "Ta'lim turlari",   items: eduTypes, mode: "edu_type" as ModalMode },
              { title: "Ta'lim tillari",   items: eduLangs, mode: "edu_lang" as ModalMode },
            ] as const).map(({ title, items, mode }) => (
              <div key={mode} className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                <SectionHeader title={title} mode={mode} />
                <div className="p-4">
                  {items.length === 0 ? (
                    <p className="text-xs text-gray-400 italic">Hech narsa yo'q</p>
                  ) : (
                    <div className="space-y-1">
                      {items.map(item => (
                        <div key={item.id} className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-1.5">
                          <span className="text-sm text-gray-700">{item.name}</span>
                          <ActionBtns onEdit={() => openEdit(mode, item)} onDel={() => setConfirmDel({ mode, id: item.id })} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

        ) : (

          /* ── Struktura tab ────────────────────────────────────────────────── */
          <div className="space-y-5">

            {/* Fakultetlar */}
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
              <SectionHeader title="Fakultetlar" mode="faculty" />
              {faculties.length === 0 ? (
                <p className="p-4 text-sm text-gray-400 italic">Fakultetlar yo'q</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-100">
                    <thead className="bg-gray-50/60">
                      <tr>
                        <th className={thCls}>#</th>
                        <th className={thCls}>Nomi</th>
                        <th className={thCls}>Kodi</th>
                        <th className={thCls + " text-right"}></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {faculties.map((f, i) => (
                        <tr key={f.id} className="hover:bg-gray-50">
                          <td className={tdCls + " text-gray-400"}>{i + 1}</td>
                          <td className={tdCls + " font-medium text-gray-800"}>{f.name}</td>
                          <td className={tdCls + " text-gray-500"}>{f.code ?? "—"}</td>
                          <td className={tdCls}><ActionBtns onEdit={() => openEdit("faculty", f)} onDel={() => setConfirmDel({ mode: "faculty", id: f.id })} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Kafedralar */}
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
              <SectionHeader title="Kafedralar" mode="department" />
              {departments.length === 0 ? (
                <p className="p-4 text-sm text-gray-400 italic">Kafedralar yo'q</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-100">
                    <thead className="bg-gray-50/60">
                      <tr>
                        <th className={thCls}>#</th>
                        <th className={thCls}>Nomi</th>
                        <th className={thCls}>Fakultet</th>
                        <th className={thCls + " text-right"}></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {departments.map((d, i) => (
                        <tr key={d.id} className="hover:bg-gray-50">
                          <td className={tdCls + " text-gray-400"}>{i + 1}</td>
                          <td className={tdCls + " font-medium text-gray-800"}>{d.name}</td>
                          <td className={tdCls + " text-gray-500"}>{d.faculty_name}</td>
                          <td className={tdCls}><ActionBtns onEdit={() => openEdit("department", d)} onDel={() => setConfirmDel({ mode: "department", id: d.id })} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Yo'nalishlar */}
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
              <SectionHeader title="Yo'nalishlar" mode="direction" />
              {directions.length === 0 ? (
                <p className="p-4 text-sm text-gray-400 italic">Yo'nalishlar yo'q</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-100">
                    <thead className="bg-gray-50/60">
                      <tr>
                        <th className={thCls}>#</th>
                        <th className={thCls}>Nomi</th>
                        <th className={thCls}>Kodi</th>
                        <th className={thCls}>Fakultet</th>
                        <th className={thCls}>Shakl / Tur / Til</th>
                        <th className={thCls + " text-right"}></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {directions.map((d, i) => (
                        <tr key={d.id} className="hover:bg-gray-50">
                          <td className={tdCls + " text-gray-400"}>{i + 1}</td>
                          <td className={tdCls + " font-medium text-gray-800"}>{d.name}</td>
                          <td className={tdCls + " text-gray-500"}>{d.code ?? "—"}</td>
                          <td className={tdCls + " text-gray-500"}>{d.faculty_name}</td>
                          <td className={tdCls}>
                            <div className="flex flex-wrap gap-1">
                              {d.edu_form_name && <span className="text-xs px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-700">{d.edu_form_name}</span>}
                              {d.edu_type_name && <span className="text-xs px-1.5 py-0.5 rounded-full bg-green-50 text-green-700">{d.edu_type_name}</span>}
                              {d.edu_lang_name && <span className="text-xs px-1.5 py-0.5 rounded-full bg-purple-50 text-purple-700">{d.edu_lang_name}</span>}
                              {!d.edu_form_name && !d.edu_type_name && !d.edu_lang_name && <span className="text-gray-400">—</span>}
                            </div>
                          </td>
                          <td className={tdCls}><ActionBtns onEdit={() => openEdit("direction", d)} onDel={() => setConfirmDel({ mode: "direction", id: d.id })} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Kurslar */}
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
              <SectionHeader title="Kurslar" mode="course" />
              {courses.length === 0 ? (
                <p className="p-4 text-sm text-gray-400 italic">Kurslar yo'q</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-100">
                    <thead className="bg-gray-50/60">
                      <tr>
                        <th className={thCls}>#</th>
                        <th className={thCls}>Yo'nalish</th>
                        <th className={thCls}>Kurs</th>
                        <th className={thCls + " text-right"}></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {courses.map((c, i) => (
                        <tr key={c.id} className="hover:bg-gray-50">
                          <td className={tdCls + " text-gray-400"}>{i + 1}</td>
                          <td className={tdCls + " text-gray-700"}>{c.direction_name}</td>
                          <td className={tdCls}><span className="inline-flex items-center rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700">{c.number}-kurs</span></td>
                          <td className={tdCls}><ActionBtns onEdit={() => openEdit("course", c)} onDel={() => setConfirmDel({ mode: "course", id: c.id })} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Guruhlar */}
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
              <SectionHeader title="Guruhlar" mode="group" />
              {groups.length === 0 ? (
                <p className="p-4 text-sm text-gray-400 italic">Guruhlar yo'q</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-100">
                    <thead className="bg-gray-50/60">
                      <tr>
                        <th className={thCls}>#</th>
                        <th className={thCls}>Nomi</th>
                        <th className={thCls}>Kurs (Yo'nalish)</th>
                        <th className={thCls + " text-right"}></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {groups.map((g, i) => (
                        <tr key={g.id} className="hover:bg-gray-50">
                          <td className={tdCls + " text-gray-400"}>{i + 1}</td>
                          <td className={tdCls + " font-medium text-gray-800"}>{g.name}</td>
                          <td className={tdCls + " text-gray-500"}>{g.direction_name} — {g.course_number}-kurs</td>
                          <td className={tdCls}><ActionBtns onEdit={() => openEdit("group", g)} onDel={() => setConfirmDel({ mode: "group", id: g.id })} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </div>
        )}
      </div>

      {/* ── Create / Edit modal ─────────────────────────────────────────────── */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="mb-4 text-base font-bold text-gray-900">
              {modal.action === "create" ? `Yangi ${LABELS[modal.mode].toLowerCase()} qo'shish` : `${LABELS[modal.mode]}ni tahrirlash`}
            </h3>
            <div className="space-y-3">

              {/* Name field — all except course */}
              {modal.mode !== "course" && (
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600">Nomi *</label>
                  <input type="text" value={modal.name}
                    onChange={e => setModal(m => m ? { ...m, name: e.target.value } : m)}
                    placeholder={`${LABELS[modal.mode]} nomi`} className={inputCls} autoFocus />
                </div>
              )}

              {/* Code — faculty, direction */}
              {(modal.mode === "faculty" || modal.mode === "direction") && (
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600">Kodi (ixtiyoriy)</label>
                  <input type="text" value={modal.code}
                    onChange={e => setModal(m => m ? { ...m, code: e.target.value } : m)}
                    placeholder="Masalan: CS, MTM" className={inputCls} />
                </div>
              )}

              {/* Faculty select — department, direction (create only) */}
              {(modal.mode === "department" || (modal.mode === "direction" && modal.action === "create")) && (
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600">Fakultet *</label>
                  <select value={modal.facultyId}
                    onChange={e => setModal(m => m ? { ...m, facultyId: e.target.value ? +e.target.value : "" } : m)}
                    className={selectCls}>
                    <option value="">— Tanlang —</option>
                    {faculties.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                  </select>
                </div>
              )}

              {/* Direction selects: edu_form, edu_type, edu_lang */}
              {modal.mode === "direction" && (
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-600">Ta'lim shakli</label>
                    <select value={modal.eduFormId}
                      onChange={e => setModal(m => m ? { ...m, eduFormId: e.target.value ? +e.target.value : "" } : m)}
                      className={selectCls}>
                      <option value="">— —</option>
                      {eduForms.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-600">Ta'lim turi</label>
                    <select value={modal.eduTypeId}
                      onChange={e => setModal(m => m ? { ...m, eduTypeId: e.target.value ? +e.target.value : "" } : m)}
                      className={selectCls}>
                      <option value="">— —</option>
                      {eduTypes.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-600">Ta'lim tili</label>
                    <select value={modal.eduLangId}
                      onChange={e => setModal(m => m ? { ...m, eduLangId: e.target.value ? +e.target.value : "" } : m)}
                      className={selectCls}>
                      <option value="">— —</option>
                      {eduLangs.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                    </select>
                  </div>
                </div>
              )}

              {/* Course create — cascade: eduForm → eduType → direction → courseNumber */}
              {modal.mode === "course" && modal.action === "create" && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="mb-1 block text-xs font-medium text-gray-600">Ta'lim shakli</label>
                      <select value={modal.eduFormId}
                        onChange={e => setModal(m => m ? { ...m, eduFormId: e.target.value ? +e.target.value : "", directionId: "" } : m)}
                        className={selectCls}>
                        <option value="">— Barchasi —</option>
                        {eduForms.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-gray-600">Ta'lim turi</label>
                      <select value={modal.eduTypeId}
                        onChange={e => setModal(m => m ? { ...m, eduTypeId: e.target.value ? +e.target.value : "", directionId: "" } : m)}
                        className={selectCls}>
                        <option value="">— Barchasi —</option>
                        {eduTypes.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-600">Yo'nalish *</label>
                    <select value={modal.directionId}
                      onChange={e => setModal(m => m ? { ...m, directionId: e.target.value ? +e.target.value : "" } : m)}
                      className={selectCls}>
                      <option value="">— Tanlang —</option>
                      {filteredDirsForCourse.map(d => <option key={d.id} value={d.id}>{d.name} ({d.faculty_name})</option>)}
                    </select>
                  </div>
                </>
              )}

              {/* Course number — course */}
              {modal.mode === "course" && (
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600">Kurs raqami *</label>
                  <select value={modal.courseNumber}
                    onChange={e => setModal(m => m ? { ...m, courseNumber: +e.target.value } : m)}
                    className={selectCls} autoFocus={modal.action === "edit"}>
                    {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n}-kurs</option>)}
                  </select>
                </div>
              )}

              {/* Group — cascade: faculty + eduForm + eduType + eduLang → direction → course */}
              {modal.mode === "group" && (
                <>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-600">Fakultet</label>
                    <select value={modal.facultyId}
                      onChange={e => setModal(m => m ? { ...m, facultyId: e.target.value ? +e.target.value : "", directionId: "", courseId: "" } : m)}
                      className={selectCls}>
                      <option value="">— Barchasi —</option>
                      {faculties.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                    </select>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="mb-1 block text-xs font-medium text-gray-600">Ta'lim shakli</label>
                      <select value={modal.eduFormId}
                        onChange={e => setModal(m => m ? { ...m, eduFormId: e.target.value ? +e.target.value : "", directionId: "", courseId: "" } : m)}
                        className={selectCls}>
                        <option value="">— —</option>
                        {eduForms.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-gray-600">Ta'lim turi</label>
                      <select value={modal.eduTypeId}
                        onChange={e => setModal(m => m ? { ...m, eduTypeId: e.target.value ? +e.target.value : "", directionId: "", courseId: "" } : m)}
                        className={selectCls}>
                        <option value="">— —</option>
                        {eduTypes.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-gray-600">Ta'lim tili</label>
                      <select value={modal.eduLangId}
                        onChange={e => setModal(m => m ? { ...m, eduLangId: e.target.value ? +e.target.value : "", directionId: "", courseId: "" } : m)}
                        className={selectCls}>
                        <option value="">— —</option>
                        {eduLangs.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-600">Yo'nalish *</label>
                    <select value={modal.directionId}
                      onChange={e => setModal(m => m ? { ...m, directionId: e.target.value ? +e.target.value : "", courseId: "" } : m)}
                      className={selectCls}>
                      <option value="">— Tanlang —</option>
                      {filteredDirsForGroup.map(d => <option key={d.id} value={d.id}>{d.name} ({d.faculty_name})</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-600">Kurs *</label>
                    <select value={modal.courseId}
                      onChange={e => setModal(m => m ? { ...m, courseId: e.target.value ? +e.target.value : "" } : m)}
                      className={selectCls}>
                      <option value="">— Tanlang —</option>
                      {filteredCoursesForGroup.map(c => <option key={c.id} value={c.id}>{c.number}-kurs</option>)}
                    </select>
                  </div>
                </>
              )}

            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button onClick={() => setModal(null)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">Bekor</button>
              <button onClick={handleSave}
                disabled={
                  saving
                  || (modal.mode !== "course" && !modal.name.trim())
                  || (modal.mode === "department" && !modal.facultyId)
                  || (modal.mode === "course" && modal.action === "create" && !modal.directionId)
                  || (modal.mode === "group" && modal.action === "create" && (!modal.courseId))
                }
                className="rounded-lg bg-[#2563eb] px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50">
                {saving ? "..." : modal.action === "create" ? "Qo'shish" : "Saqlash"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete confirm ───────────────────────────────────────────────────── */}
      {confirmDel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="mb-2 text-base font-bold text-gray-900">O'chirishni tasdiqlang</h3>
            <p className="mb-5 text-sm text-gray-500">{LABELS[confirmDel.mode]}ni o'chirmoqchimisiz? Bu amalni qaytarib bo'lmaydi.</p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setConfirmDel(null)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">Bekor</button>
              <button onClick={handleDelete}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700">O'chirish</button>
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
