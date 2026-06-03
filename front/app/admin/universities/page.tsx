"use client";

import { useEffect, useState } from "react";
import DashboardShell from "@/components/DashboardShell";
import PageHeader from "@/components/PageHeader";
import ImportPanel from "@/components/ImportPanel";
import EmptyState from "@/components/EmptyState";
import { api } from "@/lib/api";
import { useToast } from "@/components/ToastProvider";

const nav = [
  { label: "Bosh sahifa",   href: "/admin",              icon: <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path fillRule="evenodd" d="M9.293 2.293a1 1 0 011.414 0l7 7A1 1 0 0117 11h-1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-3a1 1 0 00-1-1H9a1 1 0 00-1 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-6H3a1 1 0 01-.707-1.707l7-7z" clipRule="evenodd" /></svg> },
  { label: "Universitetlar", href: "/admin/universities", icon: <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path fillRule="evenodd" d="M1 2.75A.75.75 0 011.75 2h16.5a.75.75 0 010 1.5H17v7.75a.25.25 0 01-.25.25h-1.5a.25.25 0 01-.25-.25V3.5h-3v7.75a.25.25 0 01-.25.25h-1.5a.25.25 0 01-.25-.25V3.5h-3v7.75a.25.25 0 01-.25.25h-1.5a.25.25 0 01-.25-.25V3.5H3v13H4.25a.75.75 0 010 1.5H1.75a.75.75 0 010-1.5H3V3.5H1.75A.75.75 0 011 2.75z" clipRule="evenodd" /></svg> },
  { label: "Kompaniyalar",  href: "/admin/companies",    icon: <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path fillRule="evenodd" d="M4 16.5v-13h-.25a.75.75 0 010-1.5h12.5a.75.75 0 010 1.5H16v13h.25a.75.75 0 010 1.5h-3.5a.75.75 0 01-.75-.75v-2.5a.75.75 0 00-.75-.75h-2.5a.75.75 0 00-.75.75v2.5a.75.75 0 01-.75.75h-3.5a.75.75 0 010-1.5H4z" clipRule="evenodd" /></svg> },
];

interface University { id: number; name: string; address: string | null; contact_email: string | null; rector_full_name: string | null; phone: string | null; inn: string | null; created_at: string }
interface Staff { id: number; full_name: string | null; email: string; is_admin: boolean }

const CREATE_EMPTY = { name: "", address: "", contact_email: "", rector_full_name: "", phone: "", inn: "", admin_email: "", admin_password: "", admin_name: "" };
const EDIT_EMPTY   = { name: "", address: "", contact_email: "", rector_full_name: "", phone: "", inn: "", admin_email: "", admin_name: "", new_password: "" };

export default function AdminUniversitiesPage() {
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState(CREATE_EMPTY);
  const [creating, setCreating] = useState(false);

  const [editTarget, setEditTarget] = useState<University | null>(null);
  const [editAdmin, setEditAdmin] = useState<Staff | null>(null);
  const [editForm, setEditForm] = useState(EDIT_EMPTY);
  const [editLoading, setEditLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const { toast } = useToast();

  const load = () =>
    api.get<University[]>("/universities").then(setUniversities).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const visible = universities.filter(u =>
    !search || u.name.toLowerCase().includes(search.toLowerCase())
  );

  async function handleCreate() {
    if (!createForm.name.trim())              return toast("Nomi majburiy", "error");
    if (!createForm.admin_email)              return toast("Admin email majburiy", "error");
    if (createForm.admin_password.length < 6) return toast("Parol kamida 6 belgi", "error");
    setCreating(true);
    try {
      await api.post("/universities", {
        name:              createForm.name,
        address:           createForm.address           || undefined,
        contact_email:     createForm.contact_email     || undefined,
        rector_full_name:  createForm.rector_full_name  || undefined,
        phone:             createForm.phone             || undefined,
        inn:               createForm.inn               || undefined,
        admin_email:       createForm.admin_email,
        admin_password:    createForm.admin_password,
        admin_name:        createForm.admin_name        || undefined,
      });
      setShowCreate(false);
      setCreateForm(CREATE_EMPTY);
      load();
      toast("Universitet yaratildi", "success");
    } catch (e) { toast(e instanceof Error ? e.message : "Xatolik", "error"); }
    finally { setCreating(false); }
  }

  async function openEdit(u: University) {
    setEditTarget(u);
    setEditAdmin(null);
    setEditForm({ name: u.name, address: u.address ?? "", contact_email: u.contact_email ?? "", rector_full_name: u.rector_full_name ?? "", phone: u.phone ?? "", inn: u.inn ?? "", admin_email: "", admin_name: "", new_password: "" });
    setEditLoading(true);
    try {
      const staff = await api.get<Staff[]>(`/universities/${u.id}/staff`);
      const admin = staff.find(s => s.is_admin) ?? staff[0] ?? null;
      if (admin) {
        setEditAdmin(admin);
        setEditForm(f => ({ ...f, admin_email: admin.email, admin_name: admin.full_name ?? "" }));
      }
    } catch { /* silent */ }
    finally { setEditLoading(false); }
  }

  async function handleSave() {
    if (!editTarget || !editForm.name.trim()) return toast("Nomi majburiy", "error");
    if (!editForm.admin_email)                return toast("Admin email majburiy", "error");
    if (editForm.new_password && editForm.new_password.length < 6) return toast("Yangi parol kamida 6 belgi", "error");
    setSaving(true);
    try {
      await api.patch(`/universities/${editTarget.id}`, {
        name:             editForm.name,
        address:          editForm.address          || undefined,
        contact_email:    editForm.contact_email    || undefined,
        rector_full_name: editForm.rector_full_name || undefined,
        phone:            editForm.phone            || undefined,
        inn:              editForm.inn              || undefined,
      });
      if (editAdmin) {
        const staffUpdate: Record<string, string> = { full_name: editForm.admin_name || undefined as unknown as string };
        if (editForm.admin_email !== editAdmin.email) staffUpdate.email = editForm.admin_email;
        if (editForm.new_password) staffUpdate.new_password = editForm.new_password;
        await api.patch(`/universities/staff/${editAdmin.id}`, staffUpdate);
      }
      setEditTarget(null);
      load();
      toast("Saqlandi", "success");
    } catch (e) { toast(e instanceof Error ? e.message : "Xatolik", "error"); }
    finally { setSaving(false); }
  }

  async function handleDelete(id: number) {
    setDeletingId(id);
    try { await api.delete(`/universities/${id}`); load(); }
    catch (e) { toast(e instanceof Error ? e.message : "Xatolik", "error"); }
    finally { setDeletingId(null); setConfirmDelete(null); }
  }

  const inputCls = "block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#2563eb]";

  return (
    <DashboardShell nav={nav}>
      <div className="space-y-5">
        <PageHeader
          title="Universitetlar"
          subtitle="Tizimga ro'yxatdan o'tgan universitetlar"
          action={
            <div className="flex flex-wrap items-center gap-2">
              <ImportPanel templatePath="/universities/import/template" importPath="/universities/import" templateName="universitetlar-shablon.xlsx" onDone={load} />
              <button onClick={() => { setShowCreate(true); setCreateForm(CREATE_EMPTY); }}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#2563eb] px-3.5 py-2 text-sm font-semibold text-white hover:bg-blue-700">
                <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4"><path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" /></svg>
                Qo&apos;shish
              </button>
            </div>
          }
        />

        <div className="flex items-center gap-3">
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Nom bo'yicha qidirish..."
            className="w-full max-w-xs rounded-lg border border-gray-300 px-3 py-1.5 text-sm outline-none focus:border-[#2563eb]" />
          <span className="text-sm text-gray-500">{visible.length} ta</span>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-6 space-y-3">{[1,2,3].map(i => <div key={i} className="h-12 animate-pulse rounded bg-gray-100" />)}</div>
          ) : visible.length === 0 ? (
            <div className="p-6"><EmptyState message="Universitetlar topilmadi" /></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-100">
                <thead className="bg-gray-50">
                  <tr>
                    {["#", "Nomi", "Manzil", "Kontakt email", "Qo'shilgan", ""].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {visible.map((u, i) => (
                    <tr key={u.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-400">{i + 1}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-xs font-bold text-green-700">
                            {u.name.charAt(0)}
                          </div>
                          <span className="text-sm font-semibold text-gray-800">{u.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">{u.address ?? "—"}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{u.contact_email ?? "—"}</td>
                      <td className="px-4 py-3 text-sm text-gray-400">{new Date(u.created_at).toLocaleDateString("uz-UZ")}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button onClick={() => openEdit(u)}
                            className="rounded-lg border border-gray-200 px-2.5 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100">
                            Tahrirlash
                          </button>
                          {confirmDelete === u.id ? (
                            <span className="inline-flex items-center gap-1">
                              <button onClick={() => handleDelete(u.id)} disabled={deletingId === u.id}
                                className="rounded-lg bg-red-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-red-700 disabled:opacity-50">
                                {deletingId === u.id ? "..." : "Ha"}
                              </button>
                              <button onClick={() => setConfirmDelete(null)}
                                className="rounded-lg border border-gray-200 px-2.5 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100">
                                Yo&apos;q
                              </button>
                            </span>
                          ) : (
                            <button onClick={() => setConfirmDelete(u.id)}
                              className="rounded-lg border border-red-200 px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-50">
                              O&apos;chirish
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

      {/* ── Yangi universitet modal ── */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <h3 className="mb-4 text-base font-bold text-gray-900">Yangi universitet qo&apos;shish</h3>
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Universitet ma&apos;lumotlari</p>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">Nomi *</label>
                <input type="text" value={createForm.name} onChange={e => setCreateForm(f => ({ ...f, name: e.target.value }))} placeholder="Masalan: TATU" className={inputCls} autoFocus />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">Manzil</label>
                <input type="text" value={createForm.address} onChange={e => setCreateForm(f => ({ ...f, address: e.target.value }))} placeholder="Shahar, ko'cha" className={inputCls} />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">Kontakt email</label>
                <input type="email" value={createForm.contact_email} onChange={e => setCreateForm(f => ({ ...f, contact_email: e.target.value }))} placeholder="info@university.uz" className={inputCls} />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">Rektor F.I.Sh</label>
                <input type="text" value={createForm.rector_full_name} onChange={e => setCreateForm(f => ({ ...f, rector_full_name: e.target.value }))} placeholder="Rahimov Alisher Baxtiyorovich" className={inputCls} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600">Telefon</label>
                  <input type="text" value={createForm.phone} onChange={e => setCreateForm(f => ({ ...f, phone: e.target.value }))} placeholder="+998 71 123-45-67" className={inputCls} />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600">INN</label>
                  <input type="text" value={createForm.inn} onChange={e => setCreateForm(f => ({ ...f, inn: e.target.value }))} placeholder="123456789" className={inputCls} />
                </div>
              </div>

              <div className="border-t border-gray-100 pt-3">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">Asosiy admin hisobi</p>
                <div className="space-y-2.5">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-600">Admin email *</label>
                    <input type="email" value={createForm.admin_email} onChange={e => setCreateForm(f => ({ ...f, admin_email: e.target.value }))} placeholder="admin@university.uz" className={inputCls} />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-600">Parol * (min 6 belgi)</label>
                    <input type="password" value={createForm.admin_password} onChange={e => setCreateForm(f => ({ ...f, admin_password: e.target.value }))} placeholder="••••••" className={inputCls} />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-600">Admin ismi</label>
                    <input type="text" value={createForm.admin_name} onChange={e => setCreateForm(f => ({ ...f, admin_name: e.target.value }))} placeholder="Familiya Ism" className={inputCls} />
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button onClick={() => { setShowCreate(false); setCreateForm(CREATE_EMPTY); }}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">
                Bekor qilish
              </button>
              <button onClick={handleCreate} disabled={creating}
                className="rounded-lg bg-[#2563eb] px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50">
                {creating ? "..." : "Yaratish"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Tahrirlash modal ── */}
      {editTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <h3 className="mb-4 text-base font-bold text-gray-900">Universitetni tahrirlash</h3>

            {editLoading ? (
              <div className="space-y-3 py-2">{[1,2,3,4].map(i => <div key={i} className="h-10 animate-pulse rounded bg-gray-100" />)}</div>
            ) : (
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Universitet ma&apos;lumotlari</p>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600">Nomi *</label>
                  <input type="text" value={editForm.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))} className={inputCls} autoFocus />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600">Manzil</label>
                  <input type="text" value={editForm.address} onChange={e => setEditForm(f => ({ ...f, address: e.target.value }))} className={inputCls} />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600">Kontakt email</label>
                  <input type="email" value={editForm.contact_email} onChange={e => setEditForm(f => ({ ...f, contact_email: e.target.value }))} className={inputCls} />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600">Rektor F.I.Sh</label>
                  <input type="text" value={editForm.rector_full_name} onChange={e => setEditForm(f => ({ ...f, rector_full_name: e.target.value }))} placeholder="Rahimov Alisher Baxtiyorovich" className={inputCls} />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-600">Telefon</label>
                    <input type="text" value={editForm.phone} onChange={e => setEditForm(f => ({ ...f, phone: e.target.value }))} placeholder="+998 71 123-45-67" className={inputCls} />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-600">INN</label>
                    <input type="text" value={editForm.inn} onChange={e => setEditForm(f => ({ ...f, inn: e.target.value }))} placeholder="123456789" className={inputCls} />
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-3">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">Asosiy admin hisobi</p>
                  <div className="space-y-2.5">
                    <div>
                      <label className="mb-1 block text-xs font-medium text-gray-600">Admin ismi</label>
                      <input type="text" value={editForm.admin_name} onChange={e => setEditForm(f => ({ ...f, admin_name: e.target.value }))} placeholder="Familiya Ism" className={inputCls} />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-gray-600">Admin email *</label>
                      <input type="email" value={editForm.admin_email} onChange={e => setEditForm(f => ({ ...f, admin_email: e.target.value }))} className={inputCls} />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-gray-600">Yangi parol (bo&apos;sh qolsa o&apos;zgarmaydi)</label>
                      <input type="password" value={editForm.new_password} onChange={e => setEditForm(f => ({ ...f, new_password: e.target.value }))} placeholder="••••••" className={inputCls} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-5 flex justify-end gap-2">
              <button onClick={() => setEditTarget(null)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">
                Bekor qilish
              </button>
              <button onClick={handleSave} disabled={saving || editLoading}
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
