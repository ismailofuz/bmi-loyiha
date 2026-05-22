"use client";

import { useEffect, useState } from "react";
import DashboardShell from "@/components/DashboardShell";
import PageHeader from "@/components/PageHeader";
import StatusBadge from "@/components/StatusBadge";
import StatusTabs from "@/components/StatusTabs";
import EmptyState from "@/components/EmptyState";
import { api } from "@/lib/api";
import { useToast } from "@/components/ToastProvider";

const nav = [
  { label: "Bosh sahifa",   href: "/admin",              icon: <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path fillRule="evenodd" d="M9.293 2.293a1 1 0 011.414 0l7 7A1 1 0 0117 11h-1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-3a1 1 0 00-1-1H9a1 1 0 00-1 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-6H3a1 1 0 01-.707-1.707l7-7z" clipRule="evenodd" /></svg> },
  { label: "Universitetlar", href: "/admin/universities", icon: <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path fillRule="evenodd" d="M1 2.75A.75.75 0 011.75 2h16.5a.75.75 0 010 1.5H17v7.75a.25.25 0 01-.25.25h-1.5a.25.25 0 01-.25-.25V3.5h-3v7.75a.25.25 0 01-.25.25h-1.5a.25.25 0 01-.25-.25V3.5h-3v7.75a.25.25 0 01-.25.25h-1.5a.25.25 0 01-.25-.25V3.5H3v13H4.25a.75.75 0 010 1.5H1.75a.75.75 0 010-1.5H3V3.5H1.75A.75.75 0 011 2.75z" clipRule="evenodd" /></svg> },
  { label: "Kompaniyalar",  href: "/admin/companies",    icon: <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path fillRule="evenodd" d="M4 16.5v-13h-.25a.75.75 0 010-1.5h12.5a.75.75 0 010 1.5H16v13h.25a.75.75 0 010 1.5h-3.5a.75.75 0 01-.75-.75v-2.5a.75.75 0 00-.75-.75h-2.5a.75.75 0 00-.75.75v2.5a.75.75 0 01-.75.75h-3.5a.75.75 0 010-1.5H4z" clipRule="evenodd" /></svg> },
];

const TABS = [
  { key: "all", label: "Barchasi" }, { key: "active", label: "Faol" },
  { key: "pending", label: "Kutilmoqda" }, { key: "completed", label: "Tugallandi" },
];

const STATUSES = ["pending", "active", "completed", "dropped"] as const;
const STATUS_LABELS: Record<string, string> = {
  pending: "Kutilmoqda", active: "Faol", completed: "Tugallandi", dropped: "Tashlab ketdi",
};

interface Company { id: number; name: string }
interface Student {
  id: number; full_name: string; student_number: string; specialty: string; phone: string;
  email: string; university_name: string; company_name: string;
  internship_start: string; internship_end: string; status: string;
}

const EDIT_EMPTY = {
  full_name: "", student_number: "", specialty: "", phone: "",
  company_id: "", status: "active", internship_start: "", internship_end: "",
};

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");

  const [editTarget, setEditTarget] = useState<Student | null>(null);
  const [editForm, setEditForm] = useState(EDIT_EMPTY);
  const [editing, setEditing] = useState(false);
  const { toast } = useToast();

  const loadStudents = () =>
    api.get<Student[]>("/students").then(setStudents).finally(() => setLoading(false));

  useEffect(() => {
    api.get<Company[]>("/companies").then(setCompanies);
    loadStudents();
  }, []);

  const visible = students
    .filter(s => activeTab === "all" || s.status === activeTab)
    .filter(s => !search ||
      s.full_name.toLowerCase().includes(search.toLowerCase()) ||
      (s.student_number ?? "").includes(search) ||
      (s.email ?? "").toLowerCase().includes(search.toLowerCase())
    );

  function openEdit(s: Student) {
    setEditTarget(s);
    setEditForm({
      full_name: s.full_name ?? "",
      student_number: s.student_number ?? "",
      specialty: s.specialty ?? "",
      phone: s.phone ?? "",
      company_id: s.company_name ? String(companies.find(c => c.name === s.company_name)?.id ?? "") : "",
      status: s.status,
      internship_start: s.internship_start ? s.internship_start.slice(0, 10) : "",
      internship_end: s.internship_end ? s.internship_end.slice(0, 10) : "",
    });
  }

  async function handleEdit() {
    if (!editTarget) return;
    setEditing(true);
    try {
      await api.patch(`/students/${editTarget.id}`, {
        full_name: editForm.full_name || undefined,
        student_number: editForm.student_number || undefined,
        specialty: editForm.specialty || undefined,
        phone: editForm.phone || undefined,
        company_id: editForm.company_id ? +editForm.company_id : undefined,
        status: editForm.status,
        internship_start: editForm.internship_start || undefined,
        internship_end: editForm.internship_end || undefined,
      });
      setEditTarget(null); setEditForm(EDIT_EMPTY);
      setLoading(true); loadStudents();
    } catch (e) { toast(e instanceof Error ? e.message : "Xatolik", "error"); }
    finally { setEditing(false); }
  }

  const inputCls = "block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#2563eb]";

  return (
    <DashboardShell nav={nav}>
      <div className="space-y-5">
        <PageHeader title="Talabalar" subtitle="Barcha amaliyot talabalari" />

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: "Jami",       value: students.length,                                      color: "bg-gray-50 border-gray-200 text-gray-700" },
            { label: "Faol",       value: students.filter(s => s.status === "active").length,    color: "bg-green-50 border-green-200 text-green-700" },
            { label: "Kutilmoqda", value: students.filter(s => s.status === "pending").length,   color: "bg-yellow-50 border-yellow-200 text-yellow-700" },
            { label: "Tugallandi", value: students.filter(s => s.status === "completed").length, color: "bg-blue-50 border-blue-200 text-blue-700" },
          ].map(s => (
            <div key={s.label} className={`rounded-xl border p-3 ${s.color}`}>
              <p className="text-xl font-bold">{s.value}</p>
              <p className="text-xs font-medium opacity-80">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <StatusTabs tabs={TABS} active={activeTab} onChange={setActiveTab} />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Ism, raqam yoki email..."
            className="w-full max-w-xs rounded-lg border border-gray-300 px-3 py-1.5 text-sm outline-none focus:border-[#2563eb]" />
        </div>

        {/* Table */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-6 space-y-3">{[1,2,3,4].map(i => <div key={i} className="h-12 animate-pulse rounded bg-gray-100" />)}</div>
          ) : visible.length === 0 ? (
            <div className="p-6"><EmptyState message="Talabalar topilmadi" /></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-100">
                <thead className="bg-gray-50">
                  <tr>
                    {["#", "Talaba", "Raqam", "Mutaxassislik", "Universitet", "Kompaniya", "Muddati", "Holat", ""].map(h => (
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
                      <td className="px-4 py-3 text-sm font-mono text-gray-600">{s.student_number ?? "—"}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{s.specialty ?? "—"}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{s.university_name ?? "—"}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{s.company_name ?? "—"}</td>
                      <td className="px-4 py-3 text-xs text-gray-500">
                        {s.internship_start
                          ? `${new Date(s.internship_start).toLocaleDateString("uz-UZ")} — ${new Date(s.internship_end).toLocaleDateString("uz-UZ")}`
                          : "—"}
                      </td>
                      <td className="px-4 py-3"><StatusBadge status={s.status} /></td>
                      <td className="px-4 py-3">
                        <button onClick={() => openEdit(s)}
                          className="rounded-lg border border-gray-200 px-2.5 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100">
                          Tahrirlash
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Edit modal */}
      {editTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="mb-1 text-base font-bold text-gray-900">Talabani tahrirlash</h3>
            <p className="mb-4 text-sm text-gray-500">{editTarget.email}</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="mb-1 block text-xs font-medium text-gray-600">To'liq ismi</label>
                <input type="text" value={editForm.full_name} onChange={e => setEditForm(f => ({ ...f, full_name: e.target.value }))} className={inputCls} />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">Talaba raqami</label>
                <input type="text" value={editForm.student_number} onChange={e => setEditForm(f => ({ ...f, student_number: e.target.value }))} placeholder="TATU-001" className={inputCls} />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">Telefon</label>
                <input type="text" value={editForm.phone} onChange={e => setEditForm(f => ({ ...f, phone: e.target.value }))} placeholder="+998..." className={inputCls} />
              </div>
              <div className="col-span-2">
                <label className="mb-1 block text-xs font-medium text-gray-600">Mutaxassislik</label>
                <input type="text" value={editForm.specialty} onChange={e => setEditForm(f => ({ ...f, specialty: e.target.value }))} className={inputCls} />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">Holat</label>
                <select value={editForm.status} onChange={e => setEditForm(f => ({ ...f, status: e.target.value }))} className={inputCls}>
                  {STATUSES.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">Kompaniya</label>
                <select value={editForm.company_id} onChange={e => setEditForm(f => ({ ...f, company_id: e.target.value }))} className={inputCls}>
                  <option value="">— Yo'q —</option>
                  {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">Boshlanishi</label>
                <input type="date" value={editForm.internship_start} onChange={e => setEditForm(f => ({ ...f, internship_start: e.target.value }))} className={inputCls} />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">Tugashi</label>
                <input type="date" value={editForm.internship_end} onChange={e => setEditForm(f => ({ ...f, internship_end: e.target.value }))} className={inputCls} />
              </div>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button onClick={() => { setEditTarget(null); setEditForm(EDIT_EMPTY); }}
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
      )}
    </DashboardShell>
  );
}
