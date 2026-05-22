"use client";

import { useEffect, useState } from "react";
import DashboardShell from "@/components/DashboardShell";
import PageHeader from "@/components/PageHeader";
import EmptyState from "@/components/EmptyState";
import { api } from "@/lib/api";
import { useToast } from "@/components/ToastProvider";
import { getUser } from "@/lib/auth";

const nav = [
  { label: "Bosh sahifa", href: "/company",              icon: <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path fillRule="evenodd" d="M9.293 2.293a1 1 0 011.414 0l7 7A1 1 0 0117 11h-1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-3a1 1 0 00-1-1H9a1 1 0 00-1 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-6H3a1 1 0 01-.707-1.707l7-7z" clipRule="evenodd" /></svg> },
  { label: "Talabalarim", href: "/company/students",     icon: <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z" /></svg> },
  { label: "Hisobotlar",  href: "/company/reports",      icon: <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" /></svg> },
  { label: "So'rovlar",   href: "/company/applications", icon: <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path fillRule="evenodd" d="M2 3.5A1.5 1.5 0 013.5 2h1.148a1.5 1.5 0 011.465 1.175l.716 3.223a1.5 1.5 0 01-1.052 1.767l-.933.267c-.41.117-.643.555-.48.95a11.542 11.542 0 006.254 6.254c.395.163.833-.07.95-.48l.267-.933a1.5 1.5 0 011.767-1.052l3.223.716A1.5 1.5 0 0118 15.352V16.5a1.5 1.5 0 01-1.5 1.5H15c-1.149 0-2.263-.15-3.326-.43A13.022 13.022 0 012.43 8.326 13.019 13.019 0 012 5V3.5z" clipRule="evenodd" /></svg> },
  { label: "Mentorlar",   href: "/company/mentors",      adminOnly: true, icon: <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" /></svg> },
];

interface Mentor { id: number; full_name: string | null; email: string; phone: string | null; is_active: boolean; created_at: string }

const ENROLL_EMPTY = { email: "", password: "", full_name: "", phone: "" };
const EDIT_EMPTY   = { full_name: "", phone: "", email: "", new_password: "" };

export default function CompanyMentorsPage() {
  const me = getUser();
  if (me && !me.isAdmin) {
    if (typeof window !== "undefined") window.location.replace("/company");
    return null;
  }

  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(true);
  const [companyId, setCompanyId] = useState<number | null>(null);
  const { toast } = useToast();

  // Enroll modal
  const [showEnroll, setShowEnroll] = useState(false);
  const [enrollForm, setEnrollForm] = useState(ENROLL_EMPTY);
  const [enrolling, setEnrolling] = useState(false);

  // Edit modal
  const [editMentor, setEditMentor] = useState<Mentor | null>(null);
  const [editForm, setEditForm] = useState(EDIT_EMPTY);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const me = getUser();
    if (!me?.companyId) { setLoading(false); return; }
    setCompanyId(me.companyId);
    api.get<Mentor[]>(`/companies/${me.companyId}/mentors`)
      .then(setMentors)
      .finally(() => setLoading(false));
  }, []);

  function reload() {
    const me = getUser();
    if (!me?.companyId) return;
    api.get<Mentor[]>(`/companies/${me.companyId}/mentors`).then(setMentors);
  }

  async function handleEnroll() {
    if (!companyId) return;
    if (!enrollForm.email || !enrollForm.password) return toast("Email va parol majburiy", "error");
    if (enrollForm.password.length < 6) return toast("Parol kamida 6 ta belgi bo'lishi kerak", "error");
    setEnrolling(true);
    try {
      await api.post("/companies/enroll-mentor", {
        email: enrollForm.email,
        password: enrollForm.password,
        company_id: companyId,
        full_name: enrollForm.full_name || undefined,
        phone: enrollForm.phone || undefined,
      });
      setShowEnroll(false);
      setEnrollForm(ENROLL_EMPTY);
      reload();
      toast("Mentor qo'shildi", "success");
    } catch (e) { toast(e instanceof Error ? e.message : "Xatolik", "error"); }
    finally { setEnrolling(false); }
  }

  function openEdit(m: Mentor) {
    setEditMentor(m);
    setEditForm({ full_name: m.full_name ?? "", phone: m.phone ?? "", email: m.email, new_password: "" });
  }

  async function handleSave() {
    if (!editMentor) return;
    setSaving(true);
    try {
      const mentorUpdate: Record<string, string | undefined> = {
        full_name: editForm.full_name || undefined,
        phone: editForm.phone || undefined,
      };
      if (editForm.email && editForm.email !== editMentor.email) mentorUpdate.email = editForm.email;
      if (editForm.new_password) mentorUpdate.new_password = editForm.new_password;
      await api.patch(`/companies/mentors/${editMentor.id}`, mentorUpdate);
      setEditMentor(null);
      reload();
      toast("Mentor yangilandi", "success");
    } catch (e) { toast(e instanceof Error ? e.message : "Xatolik", "error"); }
    finally { setSaving(false); }
  }

  const inputCls = "block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#2563eb]";

  return (
    <DashboardShell nav={nav}>
      <div className="space-y-5">
        <PageHeader
          title="Mentorlar"
          subtitle="Kompaniya mentorlari ro'yxati"
          action={
            <button onClick={() => { setShowEnroll(true); setEditMentor(null); }}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#2563eb] px-3.5 py-2 text-sm font-semibold text-white hover:bg-blue-700">
              <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4"><path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" /></svg>
              Mentor qo'shish
            </button>
          }
        />

        <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-6 space-y-3">{[1,2,3].map(i => <div key={i} className="h-12 animate-pulse rounded bg-gray-100" />)}</div>
          ) : mentors.length === 0 ? (
            <div className="p-6"><EmptyState message="Mentorlar topilmadi" /></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-100">
                <thead className="bg-gray-50">
                  <tr>
                    {["#", "F.I.O", "Email", "Telefon", "Holat", ""].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {mentors.map((m, i) => (
                    <tr key={m.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-400">{i + 1}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-100 text-xs font-bold text-amber-700">
                            {(m.full_name ?? m.email).charAt(0).toUpperCase()}
                          </div>
                          <span className="text-sm font-medium text-gray-800">{m.full_name ?? "—"}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">{m.email}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{m.phone ?? "—"}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${m.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                          {m.is_active ? "Faol" : "Bloklangan"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button onClick={() => openEdit(m)}
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

      {/* Enroll modal */}
      {showEnroll && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="mb-4 text-base font-bold text-gray-900">Yangi mentor qo'shish</h3>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2 sm:col-span-1">
                  <label className="mb-1 block text-xs font-medium text-gray-600">Email *</label>
                  <input type="email" value={enrollForm.email} onChange={e => setEnrollForm(f => ({ ...f, email: e.target.value }))} placeholder="mentor@company.uz" className={inputCls} />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="mb-1 block text-xs font-medium text-gray-600">Parol * (min 6)</label>
                  <input type="password" value={enrollForm.password} onChange={e => setEnrollForm(f => ({ ...f, password: e.target.value }))} placeholder="••••••" className={inputCls} />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600">To'liq ismi</label>
                  <input type="text" value={enrollForm.full_name} onChange={e => setEnrollForm(f => ({ ...f, full_name: e.target.value }))} placeholder="F.I.O" className={inputCls} />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600">Telefon</label>
                  <input type="text" value={enrollForm.phone} onChange={e => setEnrollForm(f => ({ ...f, phone: e.target.value }))} placeholder="+998..." className={inputCls} />
                </div>
              </div>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button onClick={() => { setShowEnroll(false); setEnrollForm(ENROLL_EMPTY); }}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">Bekor qilish</button>
              <button onClick={handleEnroll} disabled={enrolling}
                className="rounded-lg bg-[#2563eb] px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50">
                {enrolling ? "..." : "Qo'shish"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit modal */}
      {editMentor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="mb-4 text-base font-bold text-gray-900">Mentorni tahrirlash</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">To'liq ismi</label>
                <input type="text" value={editForm.full_name} onChange={e => setEditForm(f => ({ ...f, full_name: e.target.value }))} placeholder="F.I.O" className={inputCls} />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">Telefon</label>
                <input type="text" value={editForm.phone} onChange={e => setEditForm(f => ({ ...f, phone: e.target.value }))} placeholder="+998..." className={inputCls} />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">Email (login)</label>
                <input type="email" value={editForm.email} onChange={e => setEditForm(f => ({ ...f, email: e.target.value }))} placeholder="email@company.uz" className={inputCls} />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">Yangi parol (ixtiyoriy)</label>
                <input type="password" value={editForm.new_password} onChange={e => setEditForm(f => ({ ...f, new_password: e.target.value }))} placeholder="••••••" className={inputCls} />
              </div>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button onClick={() => setEditMentor(null)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">Bekor qilish</button>
              <button onClick={handleSave} disabled={saving}
                className="rounded-lg bg-[#2563eb] px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50">
                {saving ? "..." : "Saqlash"}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
