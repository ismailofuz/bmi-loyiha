"use client";

import { useEffect, useState, useCallback } from "react";
import DashboardShell from "@/components/DashboardShell";
import PageHeader from "@/components/PageHeader";
import EmptyState from "@/components/EmptyState";
import { api } from "@/lib/api";
import { getUser } from "@/lib/auth";
import { useToast } from "@/components/ToastProvider";

const nav = [
  { label: "Bosh sahifa", href: "/university",            icon: <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path fillRule="evenodd" d="M9.293 2.293a1 1 0 011.414 0l7 7A1 1 0 0117 11h-1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-3a1 1 0 00-1-1H9a1 1 0 00-1 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-6H3a1 1 0 01-.707-1.707l7-7z" clipRule="evenodd" /></svg> },
  { label: "Talabalar",   href: "/university/students",   icon: <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z" /></svg> },
  { label: "Hisobotlar",  href: "/university/reports",    icon: <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" /></svg> },
  { label: "Xodimlar",    href: "/university/staff",      adminOnly: true, icon: <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path d="M7 8a3 3 0 100-6 3 3 0 000 6zM14.5 9a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM1.615 16.428a1.224 1.224 0 01-.569-1.175 6.002 6.002 0 0111.908 0c.058.467-.172.92-.57 1.174A9.953 9.953 0 017 18a9.953 9.953 0 01-5.385-1.572zM14.5 16h-.106c.07-.297.088-.611.048-.933a7.47 7.47 0 00-1.588-3.755 4.502 4.502 0 015.874 2.636.818.818 0 01-.36.98A7.465 7.465 0 0114.5 16z" /></svg> },
  { label: "Amaliyotlar", href: "/university/amaliyotlar",icon: <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path fillRule="evenodd" d="M6 3.75A2.75 2.75 0 018.75 1h2.5A2.75 2.75 0 0114 3.75v.443c.572.055 1.14.122 1.706.2C17.053 4.582 18 5.75 18 7.07v3.469c0 1.126-.694 2.191-1.83 2.54-1.952.599-4.024.921-6.17.921s-4.219-.322-6.17-.921C2.694 12.73 2 11.665 2 10.539V7.07c0-1.321.947-2.489 2.294-2.676A41.047 41.047 0 016 4.193V3.75zm6.5 0v.325a41.622 41.622 0 00-5 0V3.75c0-.69.56-1.25 1.25-1.25h2.5c.69 0 1.25.56 1.25 1.25zM10 10a1 1 0 00-1 1v.01a1 1 0 001 1h.01a1 1 0 001-1V11a1 1 0 00-1-1H10z" clipRule="evenodd" /><path d="M3 15.055v-.684c.126.053.255.1.39.142 2.1.644 4.318.999 6.61.999 2.291 0 4.51-.355 6.61-.999.135-.041.264-.089.39-.142v.684c0 1.347-.985 2.53-2.363 2.686a41.454 41.454 0 01-9.274 0C3.985 17.585 3 16.402 3 15.055z" /></svg> },
  { label: "Struktura",   href: "/university/struktura",  icon: <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path d="M2 3a1 1 0 00-1 1v1a1 1 0 001 1h16a1 1 0 001-1V4a1 1 0 00-1-1H2zM2 9a1 1 0 00-1 1v1a1 1 0 001 1h6a1 1 0 001-1v-1a1 1 0 00-1-1H2zM2 15a1 1 0 00-1 1v1a1 1 0 001 1h6a1 1 0 001-1v-1a1 1 0 00-1-1H2z" /></svg> },
];

interface University { id: number; name: string }
interface Staff {
  id: number; full_name: string; phone: string; email: string;
  is_active: boolean; is_admin: boolean;
  permissions: Record<string, Record<string, boolean>>;
  created_at: string;
}

const PERM_ENTITIES = [
  { key: "faculty",    label: "Fakultet" },
  { key: "department", label: "Kafedra" },
  { key: "edu_form",   label: "Ta'lim shakli" },
  { key: "edu_type",   label: "Ta'lim turi" },
  { key: "edu_lang",   label: "Ta'lim tili" },
  { key: "direction",  label: "Yo'nalish" },
  { key: "course",     label: "Kurs" },
  { key: "group",      label: "Guruh" },
  { key: "degree",     label: "Daraja" },
  { key: "staff",      label: "Xodim" },
];
const PERM_OPS = [
  { key: "read",   label: "Ko'rish" },
  { key: "create", label: "Yaratish" },
  { key: "update", label: "Tahrirlash" },
  { key: "delete", label: "O'chirish" },
];

const ENROLL_EMPTY = { full_name: "", email: "", password: "", phone: "" };
const EDIT_EMPTY = { full_name: "", phone: "", email: "", new_password: "" };

export default function UniversityStaffPage() {
  const currentUser = getUser();
  if (currentUser && !currentUser.isAdmin) {
    if (typeof window !== "undefined") window.location.replace("/university");
    return null;
  }

  const [universityId, setUniversityId] = useState<number | null>(null);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [amAdmin, setAmAdmin] = useState(false);

  const [showEnroll, setShowEnroll] = useState(false);
  const [enrollForm, setEnrollForm] = useState(ENROLL_EMPTY);
  const [enrolling, setEnrolling] = useState(false);

  const [editTarget, setEditTarget] = useState<Staff | null>(null);
  const [editForm, setEditForm] = useState(EDIT_EMPTY);
  const [editIsAdmin, setEditIsAdmin] = useState(false);
  const [editing, setEditing] = useState(false);

  const [permTarget, setPermTarget] = useState<Staff | null>(null);
  const [permEdit, setPermEdit] = useState<Record<string, Record<string, boolean>>>({});
  const [savingPerm, setSavingPerm] = useState(false);

  const { toast } = useToast();

  const loadStaff = useCallback((uid: number) => {
    setLoading(true);
    api.get<Staff[]>(`/universities/${uid}/staff`).then(list => {
      setStaff(list);
      const me = getUser();
      if (me) {
        const myRecord = list.find(s => s.id === me.sub);
        setAmAdmin(myRecord?.is_admin ?? false);
      }
    }).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    api.get<University[]>("/universities").then(unis => {
      if (unis.length > 0) {
        setUniversityId(unis[0].id);
        loadStaff(unis[0].id);
      } else {
        setLoading(false);
      }
    });
  }, [loadStaff]);

  async function handleEnroll() {
    if (!universityId) return;
    const { full_name, email, password } = enrollForm;
    if (!email || !password || !full_name) return toast("Majburiy maydonlarni to'ldiring", "error");
    setEnrolling(true);
    try {
      await api.post("/universities/enroll-staff", {
        full_name, email, password,
        phone: enrollForm.phone || undefined,
        university_id: universityId,
      });
      setShowEnroll(false); setEnrollForm(ENROLL_EMPTY);
      loadStaff(universityId);
    } catch (e) { toast(e instanceof Error ? e.message : "Xatolik", "error"); }
    finally { setEnrolling(false); }
  }

  function openEdit(s: Staff) {
    setEditTarget(s);
    setEditForm({ full_name: s.full_name ?? "", phone: s.phone ?? "", email: s.email, new_password: "" });
    setEditIsAdmin(s.is_admin ?? false);
  }

  async function handleEdit() {
    if (!editTarget || !universityId) return;
    setEditing(true);
    try {
      const staffUpdate: Record<string, string | undefined> = {
        full_name: editForm.full_name || undefined,
        phone: editForm.phone || undefined,
      };
      if (editForm.email && editForm.email !== editTarget.email) staffUpdate.email = editForm.email;
      if (editForm.new_password) staffUpdate.new_password = editForm.new_password;
      await api.patch(`/universities/staff/${editTarget.id}`, staffUpdate);
      if (amAdmin && editTarget.id !== me?.sub) {
        await api.patch(`/universities/staff/${editTarget.id}/permissions`, { is_admin: editIsAdmin });
      }
      setEditTarget(null); setEditForm(EDIT_EMPTY);
      loadStaff(universityId);
    } catch (e) { toast(e instanceof Error ? e.message : "Xatolik", "error"); }
    finally { setEditing(false); }
  }

  function openPermissions(s: Staff) {
    setPermTarget(s);
    setPermEdit(s.permissions ?? {});
  }

  async function handleSavePermissions() {
    if (!permTarget || !universityId) return;
    setSavingPerm(true);
    try {
      await api.patch(`/universities/staff/${permTarget.id}/permissions`, { permissions: permEdit });
      setPermTarget(null);
      loadStaff(universityId);
    } catch (e) { toast(e instanceof Error ? e.message : "Xatolik", "error"); }
    finally { setSavingPerm(false); }
  }

  const me = getUser();
  const inputCls = "block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#2563eb]";

  return (
    <DashboardShell nav={nav}>
      <div className="space-y-5">
        <PageHeader
          title="Xodimlar"
          subtitle="Universitetingiz xodimlarini boshqarish"
          action={
            amAdmin ? (
              <button onClick={() => setShowEnroll(true)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#2563eb] px-3.5 py-2 text-sm font-semibold text-white hover:bg-blue-700">
                <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4"><path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" /></svg>
                Xodim qo'shish
              </button>
            ) : undefined
          }
        />

        <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-6 space-y-3">{[1,2,3].map(i => <div key={i} className="h-12 animate-pulse rounded bg-gray-100" />)}</div>
          ) : staff.length === 0 ? (
            <div className="p-6"><EmptyState message="Xodimlar yo'q" sub="Yangi xodim qo'shish uchun yuqoridagi tugmani bosing" /></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-100">
                <thead className="bg-gray-50">
                  <tr>
                    {["#", "Xodim", "Telefon", "Holat", "Qo'shilgan", ""].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {staff.map((s, i) => (
                    <tr key={s.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-400">{i + 1}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-purple-100 text-xs font-bold text-purple-700">
                            {(s.full_name ?? s.email).charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <p className="text-sm font-semibold text-gray-800">{s.full_name || "—"}</p>
                              {s.is_admin && <span className="text-xs font-semibold px-1.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700">ADMIN</span>}
                            </div>
                            <p className="text-xs text-gray-400">{s.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{s.phone || "—"}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${s.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                          {s.is_active ? "Faol" : "Bloklangan"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500">
                        {new Date(s.created_at).toLocaleDateString("uz-UZ")}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <button onClick={() => openEdit(s)}
                            className="rounded-lg border border-gray-200 px-2.5 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100">
                            Tahrirlash
                          </button>
                          {amAdmin && s.id !== me?.sub && (
                            <button onClick={() => openPermissions(s)}
                              className="rounded-lg border border-indigo-200 px-2.5 py-1 text-xs font-medium text-indigo-600 hover:bg-indigo-50">
                              Permissionlar
                            </button>
                          )}
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
      {showEnroll && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="mb-4 text-base font-bold text-gray-900">Yangi xodim qo'shish</h3>
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">To'liq ismi *</label>
                <input type="text" value={enrollForm.full_name} onChange={e => setEnrollForm(f => ({ ...f, full_name: e.target.value }))} placeholder="Familiya Ism Otasining ismi" className={inputCls} />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">Email *</label>
                <input type="email" value={enrollForm.email} onChange={e => setEnrollForm(f => ({ ...f, email: e.target.value }))} placeholder="xodim@mail.com" className={inputCls} />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">Parol * (min 6 belgi)</label>
                <input type="password" value={enrollForm.password} onChange={e => setEnrollForm(f => ({ ...f, password: e.target.value }))} placeholder="••••••" className={inputCls} />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">Telefon</label>
                <input type="text" value={enrollForm.phone} onChange={e => setEnrollForm(f => ({ ...f, phone: e.target.value }))} placeholder="+998..." className={inputCls} />
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
      {editTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="mb-4 text-base font-bold text-gray-900">Xodimni tahrirlash</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2 sm:col-span-1">
                <label className="mb-1 block text-xs font-medium text-gray-600">To'liq ismi</label>
                <input type="text" value={editForm.full_name} onChange={e => setEditForm(f => ({ ...f, full_name: e.target.value }))} className={inputCls} />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="mb-1 block text-xs font-medium text-gray-600">Telefon</label>
                <input type="text" value={editForm.phone} onChange={e => setEditForm(f => ({ ...f, phone: e.target.value }))} placeholder="+998..." className={inputCls} />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="mb-1 block text-xs font-medium text-gray-600">Email (login)</label>
                <input type="email" value={editForm.email} onChange={e => setEditForm(f => ({ ...f, email: e.target.value }))} placeholder="email@univ.uz" className={inputCls} />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="mb-1 block text-xs font-medium text-gray-600">Yangi parol (ixtiyoriy)</label>
                <input type="password" value={editForm.new_password} onChange={e => setEditForm(f => ({ ...f, new_password: e.target.value }))} placeholder="••••••" className={inputCls} />
              </div>
            </div>
            {amAdmin && editTarget.id !== me?.sub && (
              <label className="mt-3 flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={editIsAdmin} onChange={e => setEditIsAdmin(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600" />
                <span className="text-sm font-medium text-indigo-800">Universitet admin (to'liq huquq)</span>
              </label>
            )}
            <div className="mt-5 flex justify-end gap-2">
              <button onClick={() => { setEditTarget(null); setEditForm(EDIT_EMPTY); }}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">Bekor qilish</button>
              <button onClick={handleEdit} disabled={editing}
                className="rounded-lg bg-[#2563eb] px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50">
                {editing ? "..." : "Saqlash"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Permission matrix modal */}
      {permTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="mb-1 text-base font-bold text-gray-900">Permissionlar</h3>
            <p className="mb-4 text-sm text-gray-500">{permTarget.full_name || permTarget.email}</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    <th className="text-left py-1.5 pr-3 text-xs font-semibold text-gray-500">Bo'lim</th>
                    {PERM_OPS.map(op => (
                      <th key={op.key} className="px-2 py-1.5 text-xs font-semibold text-gray-500 text-center">{op.label}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {PERM_ENTITIES.map(ent => (
                    <tr key={ent.key} className="border-t border-gray-100">
                      <td className="py-2 pr-3 text-sm text-gray-700">{ent.label}</td>
                      {PERM_OPS.map(op => (
                        <td key={op.key} className="px-2 py-2 text-center">
                          <input type="checkbox"
                            checked={permEdit[ent.key]?.[op.key] ?? false}
                            onChange={e => setPermEdit(p => ({
                              ...p,
                              [ent.key]: { ...p[ent.key], [op.key]: e.target.checked }
                            }))}
                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 cursor-pointer" />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 rounded-lg bg-gray-50 px-3 py-2 text-xs text-gray-500">
              Talabalar ustidan ko'rish va boshqarish huquqlari avtomatik beriladi va o'zgartirilmaydi.
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setPermTarget(null)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">Bekor qilish</button>
              <button onClick={handleSavePermissions} disabled={savingPerm}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50">
                {savingPerm ? "..." : "Saqlash"}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
