"use client";

import { useEffect, useState } from "react";
import DashboardShell from "@/components/DashboardShell";
import PageHeader from "@/components/PageHeader";
import EmptyState from "@/components/EmptyState";
import { api } from "@/lib/api";
import { getUser } from "@/lib/auth";
import { useToast } from "@/components/ToastProvider";

const nav = [
  { label: "Bosh sahifa",       href: "/university",                    icon: <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path fillRule="evenodd" d="M9.293 2.293a1 1 0 011.414 0l7 7A1 1 0 0117 11h-1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-3a1 1 0 00-1-1H9a1 1 0 00-1 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-6H3a1 1 0 01-.707-1.707l7-7z" clipRule="evenodd" /></svg> },
  { label: "Talabalar",          href: "/university/students",           icon: <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z" /></svg> },
  { label: "Hisobotlar",         href: "/university/reports",            icon: <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" /></svg> },
  { label: "Xodimlar",           href: "/university/staff",              adminOnly: true, icon: <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path d="M7 8a3 3 0 100-6 3 3 0 000 6zM14.5 9a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM1.615 16.428a1.224 1.224 0 01-.569-1.175 6.002 6.002 0 0111.908 0c.058.467-.172.92-.57 1.174A9.953 9.953 0 017 18a9.953 9.953 0 01-5.385-1.572zM14.5 16h-.106c.07-.297.088-.611.048-.933a7.47 7.47 0 00-1.588-3.755 4.502 4.502 0 015.874 2.636.818.818 0 01-.36.98A7.465 7.465 0 0114.5 16z" /></svg> },
  { label: "Amaliyotlar",        href: "/university/amaliyotlar",        icon: <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path fillRule="evenodd" d="M6 3.75A2.75 2.75 0 018.75 1h2.5A2.75 2.75 0 0114 3.75v.443c.572.055 1.14.122 1.706.2C17.053 4.582 18 5.75 18 7.07v3.469c0 1.126-.694 2.191-1.83 2.54-1.952.599-4.024.921-6.17.921s-4.219-.322-6.17-.921C2.694 12.73 2 11.665 2 10.539V7.07c0-1.321.947-2.489 2.294-2.676A41.047 41.047 0 016 4.193V3.75zm6.5 0v.325a41.622 41.622 0 00-5 0V3.75c0-.69.56-1.25 1.25-1.25h2.5c.69 0 1.25.56 1.25 1.25zM10 10a1 1 0 00-1 1v.01a1 1 0 001 1h.01a1 1 0 001-1V11a1 1 0 00-1-1H10z" clipRule="evenodd" /><path d="M3 15.055v-.684c.126.053.255.1.39.142 2.1.644 4.318.999 6.61.999 2.291 0 4.51-.355 6.61-.999.135-.041.264-.089.39-.142v.684c0 1.347-.985 2.53-2.363 2.686a41.454 41.454 0 01-9.274 0C3.985 17.585 3 16.402 3 15.055z" /></svg> },
  { label: "Struktura",          href: "/university/struktura",          icon: <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path d="M2 3a1 1 0 00-1 1v1a1 1 0 001 1h16a1 1 0 001-1V4a1 1 0 00-1-1H2zM2 9a1 1 0 00-1 1v1a1 1 0 001 1h6a1 1 0 001-1v-1a1 1 0 00-1-1H2zM2 15a1 1 0 00-1 1v1a1 1 0 001 1h6a1 1 0 001-1v-1a1 1 0 00-1-1H2z" /></svg> },
  { label: "Hamkor korxonalar",  href: "/university/korxonalar",         icon: <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V8a2 2 0 00-2-2h-5L9 4H4zm7 5a1 1 0 10-2 0v1H8a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" /></svg> },
  { label: "Qaydnomalar",        href: "/university/qaydnomalar",        icon: <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" /></svg> },
];

interface Regulation {
  id: number;
  title: string;
  adoption_year: number;
  author: string;
  description: string | null;
  created_at: string;
}

const FORM_EMPTY = { title: "", adoption_year: String(new Date().getFullYear()), author: "", description: "" };

export default function QaydnomalarPage() {
  const [regulations, setRegulations] = useState<Regulation[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState<Regulation | null>(null);
  const [form, setForm] = useState(FORM_EMPTY);
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<Regulation | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [viewTarget, setViewTarget] = useState<Regulation | null>(null);

  const { toast } = useToast();

  function load() {
    setLoading(true);
    api.get<Regulation[]>("/regulations").then(setRegulations).finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  function openCreate() {
    setEditTarget(null);
    setForm(FORM_EMPTY);
    setShowModal(true);
  }

  function openEdit(r: Regulation) {
    setEditTarget(r);
    setForm({
      title: r.title,
      adoption_year: String(r.adoption_year),
      author: r.author,
      description: r.description ?? "",
    });
    setShowModal(true);
  }

  async function handleSave() {
    if (!form.title.trim())  return toast("Nomi kiritilmagan", "error");
    if (!form.author.trim()) return toast("Muallif kiritilmagan", "error");
    if (!form.adoption_year) return toast("Qabul yili kiritilmagan", "error");

    const me = getUser();
    if (!me?.universityId) return toast("Foydalanuvchi aniqlanmadi", "error");

    setSaving(true);
    try {
      if (editTarget) {
        await api.patch(`/regulations/${editTarget.id}`, {
          title: form.title.trim(),
          adoption_year: +form.adoption_year,
          author: form.author.trim(),
          description: form.description.trim() || undefined,
        });
        toast("Qaydnoma yangilandi", "success");
      } else {
        await api.post("/regulations", {
          university_id: me.universityId,
          title: form.title.trim(),
          adoption_year: +form.adoption_year,
          author: form.author.trim(),
          description: form.description.trim() || undefined,
        });
        toast("Qaydnoma qo'shildi", "success");
      }
      setShowModal(false);
      load();
    } catch (e) {
      toast(e instanceof Error ? e.message : "Xatolik", "error");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.delete(`/regulations/${deleteTarget.id}`);
      setDeleteTarget(null);
      toast("Qaydnoma o'chirildi", "success");
      load();
    } catch (e) {
      toast(e instanceof Error ? e.message : "Xatolik", "error");
    } finally {
      setDeleting(false);
    }
  }

  const filtered = regulations.filter(r =>
    r.title.toLowerCase().includes(search.toLowerCase()) ||
    r.author.toLowerCase().includes(search.toLowerCase())
  );

  const inputCls = "block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#2563eb]";

  return (
    <DashboardShell nav={nav}>
      <div className="space-y-5">
        <PageHeader
          title="Qaydnomalar"
          subtitle="Universitet normativ hujjatlari va qaydnomalari"
          action={
            <button
              onClick={openCreate}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#2563eb] px-3.5 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4"><path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" /></svg>
              Yangi qaydnoma
            </button>
          }
        />

        <input
          type="text"
          placeholder="Nom yoki muallif bo'yicha qidirish..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#2563eb] w-80"
        />

        {loading ? (
          <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-14 animate-pulse rounded-xl bg-gray-100" />)}</div>
        ) : filtered.length === 0 ? (
          <EmptyState message="Qaydnomalar yo'q" sub="Yangi qaydnoma qo'shish uchun yuqoridagi tugmani bosing" />
        ) : (
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-100">
                <thead className="bg-gray-50">
                  <tr>
                    {["#", "Nomi", "Qabul yili", "Muallif", "Izoh", ""].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map((r, i) => (
                    <tr key={r.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-400">{i + 1}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => setViewTarget(r)}
                          className="text-sm font-semibold text-[#2563eb] hover:underline text-left"
                        >
                          {r.title}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{r.adoption_year}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{r.author}</td>
                      <td className="px-4 py-3 text-sm text-gray-400 max-w-xs truncate">
                        {r.description ?? "—"}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openEdit(r)}
                            className="rounded-lg border border-gray-200 px-2.5 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100"
                          >
                            Tahrirlash
                          </button>
                          <button
                            onClick={() => setDeleteTarget(r)}
                            className="rounded-lg border border-red-200 px-2.5 py-1 text-xs font-medium text-red-500 hover:bg-red-50"
                          >
                            O'chirish
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Create / Edit modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <h2 className="text-base font-semibold text-gray-800">
                {editTarget ? "Qaydnomani tahrirlash" : "Yangi qaydnoma"}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" /></svg>
              </button>
            </div>
            <div className="space-y-4 px-6 py-5">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Nomi *</label>
                <input className={inputCls} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Qaydnoma nomi" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Qabul yili *</label>
                  <input className={inputCls} type="number" value={form.adoption_year} onChange={e => setForm(f => ({ ...f, adoption_year: e.target.value }))} placeholder="2024" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Muallif *</label>
                  <input className={inputCls} value={form.author} onChange={e => setForm(f => ({ ...f, author: e.target.value }))} placeholder="Muallif ismi" />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Izoh</label>
                <textarea
                  className={`${inputCls} resize-none`}
                  rows={3}
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="Qaydnoma haqida qisqacha ma'lumot..."
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 border-t border-gray-100 px-6 py-4">
              <button onClick={() => setShowModal(false)} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                Bekor qilish
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="rounded-lg bg-[#2563eb] px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
              >
                {saving ? "Saqlanmoqda..." : "Saqlash"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View modal */}
      {viewTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <h2 className="text-base font-semibold text-gray-800">{viewTarget.title}</h2>
              <button onClick={() => setViewTarget(null)} className="text-gray-400 hover:text-gray-600">
                <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" /></svg>
              </button>
            </div>
            <div className="space-y-3 px-6 py-5">
              <div className="flex gap-6 text-sm">
                <div><span className="text-gray-500">Qabul yili:</span> <span className="font-semibold">{viewTarget.adoption_year}</span></div>
                <div><span className="text-gray-500">Muallif:</span> <span className="font-semibold">{viewTarget.author}</span></div>
              </div>
              {viewTarget.description && (
                <div>
                  <p className="mb-1 text-sm font-medium text-gray-700">Izoh:</p>
                  <p className="text-sm text-gray-600 leading-relaxed">{viewTarget.description}</p>
                </div>
              )}
            </div>
            <div className="flex justify-end gap-3 border-t border-gray-100 px-6 py-4">
              <button onClick={() => { setViewTarget(null); openEdit(viewTarget); }} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                Tahrirlash
              </button>
              <button onClick={() => setViewTarget(null)} className="rounded-lg bg-[#2563eb] px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
                Yopish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-base font-semibold text-gray-800 mb-2">Qaydnomani o'chirish</h2>
            <p className="text-sm text-gray-600 mb-5">
              <strong>{deleteTarget.title}</strong> qaydnomasini o'chirishni tasdiqlaysizmi?
            </p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteTarget(null)} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                Bekor qilish
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600 disabled:opacity-60"
              >
                {deleting ? "O'chirilmoqda..." : "O'chirish"}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
