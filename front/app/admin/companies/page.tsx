"use client";

import { useEffect, useState } from "react";
import DashboardShell from "@/components/DashboardShell";
import PageHeader from "@/components/PageHeader";
import EmptyState from "@/components/EmptyState";
import { api } from "@/lib/api";
import { useToast } from "@/components/ToastProvider";

const nav = [
  { label: "Bosh sahifa",   href: "/admin",              icon: <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path fillRule="evenodd" d="M9.293 2.293a1 1 0 011.414 0l7 7A1 1 0 0117 11h-1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-3a1 1 0 00-1-1H9a1 1 0 00-1 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-6H3a1 1 0 01-.707-1.707l7-7z" clipRule="evenodd" /></svg> },
  { label: "Universitetlar", href: "/admin/universities", icon: <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path fillRule="evenodd" d="M1 2.75A.75.75 0 011.75 2h16.5a.75.75 0 010 1.5H17v7.75a.25.25 0 01-.25.25h-1.5a.25.25 0 01-.25-.25V3.5h-3v7.75a.25.25 0 01-.25.25h-1.5a.25.25 0 01-.25-.25V3.5h-3v7.75a.25.25 0 01-.25.25h-1.5a.25.25 0 01-.25-.25V3.5H3v13H4.25a.75.75 0 010 1.5H1.75a.75.75 0 010-1.5H3V3.5H1.75A.75.75 0 011 2.75z" clipRule="evenodd" /></svg> },
  { label: "Kompaniyalar",  href: "/admin/companies",    icon: <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path fillRule="evenodd" d="M4 16.5v-13h-.25a.75.75 0 010-1.5h12.5a.75.75 0 010 1.5H16v13h.25a.75.75 0 010 1.5h-3.5a.75.75 0 01-.75-.75v-2.5a.75.75 0 00-.75-.75h-2.5a.75.75 0 00-.75.75v2.5a.75.75 0 01-.75.75h-3.5a.75.75 0 010-1.5H4z" clipRule="evenodd" /></svg> },
];

interface Company {
  id: number; name: string;
  industry: string | null; address: string | null;
  contact_email: string | null; created_at: string;
}
interface Mentor { id: number; full_name: string | null; email: string }

const CO_EMPTY   = { name: "", industry: "", address: "", contact_email: "", admin_email: "", admin_password: "", admin_name: "" };
const EDIT_EMPTY = { name: "", industry: "", address: "", contact_email: "", admin_email: "", admin_name: "", new_password: "" };

export default function AdminCompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [showCreate, setShowCreate] = useState(false);
  const [coForm, setCoForm] = useState(CO_EMPTY);
  const [creating, setCreating] = useState(false);

  const [editTarget, setEditTarget] = useState<Company | null>(null);
  const [editAdmin, setEditAdmin] = useState<Mentor | null>(null);
  const [editForm, setEditForm] = useState(EDIT_EMPTY);
  const [editLoading, setEditLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const { toast } = useToast();

  const load = () =>
    api.get<Company[]>("/companies").then(setCompanies).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const visible = companies.filter(c =>
    !search ||
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    (c.industry ?? "").toLowerCase().includes(search.toLowerCase())
  );

  async function handleCreate() {
    if (!coForm.name.trim())        return toast("Kompaniya nomi majburiy", "error");
    if (!coForm.admin_email)        return toast("Admin email majburiy", "error");
    if (coForm.admin_password.length < 6) return toast("Parol kamida 6 belgi", "error");
    setCreating(true);
    try {
      await api.post("/companies", {
        name: coForm.name,
        industry:      coForm.industry      || undefined,
        address:       coForm.address       || undefined,
        contact_email: coForm.contact_email || undefined,
        admin_email:   coForm.admin_email,
        admin_password: coForm.admin_password,
        admin_name:    coForm.admin_name    || undefined,
      });
      setShowCreate(false);
      setCoForm(CO_EMPTY);
      load();
      toast("Kompaniya yaratildi", "success");
    } catch (e) { toast(e instanceof Error ? e.message : "Xatolik", "error"); }
    finally { setCreating(false); }
  }

  async function openEdit(c: Company) {
    setEditTarget(c);
    setEditAdmin(null);
    setEditForm({ name: c.name, industry: c.industry ?? "", address: c.address ?? "", contact_email: c.contact_email ?? "", admin_email: "", admin_name: "", new_password: "" });
    setEditLoading(true);
    try {
      const mentors = await api.get<Mentor[]>(`/companies/${c.id}/mentors`);
      if (mentors.length > 0) {
        const admin = mentors[0];
        setEditAdmin(admin);
        setEditForm(f => ({ ...f, admin_email: admin.email, admin_name: admin.full_name ?? "" }));
      }
    } catch { /* silent */ }
    finally { setEditLoading(false); }
  }

  async function handleSave() {
    if (!editTarget || !editForm.name.trim()) return toast("Nomi majburiy", "error");
    if (!editForm.admin_email) return toast("Admin email majburiy", "error");
    if (editForm.new_password && editForm.new_password.length < 6) return toast("Yangi parol kamida 6 belgi", "error");
    setSaving(true);
    try {
      await api.patch(`/companies/${editTarget.id}`, {
        name:          editForm.name,
        industry:      editForm.industry      || undefined,
        address:       editForm.address       || undefined,
        contact_email: editForm.contact_email || undefined,
      });
      if (editAdmin) {
        const mentorUpdate: Record<string, string> = { full_name: editForm.admin_name || undefined as unknown as string };
        if (editForm.admin_email !== editAdmin.email) mentorUpdate.email = editForm.admin_email;
        if (editForm.new_password) mentorUpdate.new_password = editForm.new_password;
        await api.patch(`/companies/mentors/${editAdmin.id}`, mentorUpdate);
      }
      setEditTarget(null);
      load();
      toast("Saqlandi", "success");
    } catch (e) { toast(e instanceof Error ? e.message : "Xatolik", "error"); }
    finally { setSaving(false); }
  }

  async function handleDelete(id: number) {
    setDeletingId(id);
    try { await api.delete(`/companies/${id}`); load(); }
    catch (e) { toast(e instanceof Error ? e.message : "Xatolik", "error"); }
    finally { setDeletingId(null); setConfirmDelete(null); }
  }

  const inputCls = "block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#2563eb]";

  return (
    <DashboardShell nav={nav}>
      <div className="space-y-5">
        <PageHeader
          title="Kompaniyalar"
          subtitle="Amaliyot kompaniyalari ro'yxati"
          action={
            <button onClick={() => { setShowCreate(true); setCoForm(CO_EMPTY); }}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#2563eb] px-3.5 py-2 text-sm font-semibold text-white hover:bg-blue-700">
              <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4"><path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" /></svg>
              Qo&apos;shish
            </button>
          }
        />

        <div className="flex items-center gap-3">
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Nom yoki soha bo'yicha qidirish..."
            className="w-full max-w-xs rounded-lg border border-gray-300 px-3 py-1.5 text-sm outline-none focus:border-[#2563eb]" />
          <span className="text-sm text-gray-500">{visible.length} ta</span>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-6 space-y-3">{[1,2,3].map(i => <div key={i} className="h-12 animate-pulse rounded bg-gray-100" />)}</div>
          ) : visible.length === 0 ? (
            <div className="p-6"><EmptyState message="Kompaniyalar topilmadi" /></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-100">
                <thead className="bg-gray-50">
                  <tr>
                    {["#", "Nomi", "Soha", "Manzil", "Kontakt", "Qo'shilgan", ""].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {visible.map((c, i) => (
                    <tr key={c.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-400">{i + 1}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-xs font-bold text-amber-700">
                            {c.name.charAt(0)}
                          </div>
                          <span className="text-sm font-semibold text-gray-800">{c.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">{c.industry ?? "—"}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{c.address ?? "—"}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{c.contact_email ?? "—"}</td>
                      <td className="px-4 py-3 text-sm text-gray-400">{new Date(c.created_at).toLocaleDateString("uz-UZ")}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button onClick={() => openEdit(c)}
                            className="rounded-lg border border-gray-200 px-2.5 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100">
                            Tahrirlash
                          </button>
                          {confirmDelete === c.id ? (
                            <span className="inline-flex items-center gap-1">
                              <button onClick={() => handleDelete(c.id)} disabled={deletingId === c.id}
                                className="rounded-lg bg-red-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-red-700 disabled:opacity-50">
                                {deletingId === c.id ? "..." : "Ha"}
                              </button>
                              <button onClick={() => setConfirmDelete(null)}
                                className="rounded-lg border border-gray-200 px-2.5 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100">
                                Yo&apos;q
                              </button>
                            </span>
                          ) : (
                            <button onClick={() => setConfirmDelete(c.id)}
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

      {/* ── Yangi kompaniya modal ── */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <h3 className="mb-4 text-base font-bold text-gray-900">Yangi kompaniya qo&apos;shish</h3>
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Kompaniya ma&apos;lumotlari</p>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">Nomi *</label>
                <input type="text" value={coForm.name} onChange={e => setCoForm(f => ({ ...f, name: e.target.value }))} placeholder="Masalan: PDP Academy" className={inputCls} autoFocus />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">Soha</label>
                <input type="text" value={coForm.industry} onChange={e => setCoForm(f => ({ ...f, industry: e.target.value }))} placeholder="IT, Moliya..." className={inputCls} />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">Manzil</label>
                <input type="text" value={coForm.address} onChange={e => setCoForm(f => ({ ...f, address: e.target.value }))} placeholder="Toshkent, Mirzo Ulug'bek" className={inputCls} />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">Kontakt email</label>
                <input type="email" value={coForm.contact_email} onChange={e => setCoForm(f => ({ ...f, contact_email: e.target.value }))} placeholder="hr@company.uz" className={inputCls} />
              </div>

              <div className="border-t border-gray-100 pt-3">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">Asosiy admin hisobi</p>
                <div className="space-y-2.5">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-600">Admin email *</label>
                    <input type="email" value={coForm.admin_email} onChange={e => setCoForm(f => ({ ...f, admin_email: e.target.value }))} placeholder="admin@company.uz" className={inputCls} />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-600">Parol * (min 6 belgi)</label>
                    <input type="password" value={coForm.admin_password} onChange={e => setCoForm(f => ({ ...f, admin_password: e.target.value }))} placeholder="••••••" className={inputCls} />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-600">Admin ismi</label>
                    <input type="text" value={coForm.admin_name} onChange={e => setCoForm(f => ({ ...f, admin_name: e.target.value }))} placeholder="Familiya Ism" className={inputCls} />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button onClick={() => { setShowCreate(false); setCoForm(CO_EMPTY); }}
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
            <h3 className="mb-4 text-base font-bold text-gray-900">Kompaniyani tahrirlash</h3>

            {editLoading ? (
              <div className="space-y-3 py-2">{[1,2,3,4].map(i => <div key={i} className="h-10 animate-pulse rounded bg-gray-100" />)}</div>
            ) : (
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Kompaniya ma&apos;lumotlari</p>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600">Nomi *</label>
                  <input type="text" value={editForm.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))} className={inputCls} autoFocus />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600">Soha</label>
                  <input type="text" value={editForm.industry} onChange={e => setEditForm(f => ({ ...f, industry: e.target.value }))} className={inputCls} />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600">Manzil</label>
                  <input type="text" value={editForm.address} onChange={e => setEditForm(f => ({ ...f, address: e.target.value }))} className={inputCls} />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600">Kontakt email</label>
                  <input type="email" value={editForm.contact_email} onChange={e => setEditForm(f => ({ ...f, contact_email: e.target.value }))} className={inputCls} />
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
