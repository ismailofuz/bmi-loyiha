"use client";

import { useEffect, useState, useCallback } from "react";
import DashboardShell from "@/components/DashboardShell";
import PageHeader from "@/components/PageHeader";
import StatusBadge from "@/components/StatusBadge";
import StatusTabs from "@/components/StatusTabs";
import EmptyState from "@/components/EmptyState";
import { api } from "@/lib/api";
import { getUser } from "@/lib/auth";
import { useToast } from "@/components/ToastProvider";

const nav = [
  { label: "Amaliyot",       href: "/student",         icon: <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path fillRule="evenodd" d="M9.293 2.293a1 1 0 011.414 0l7 7A1 1 0 0117 11h-1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-3a1 1 0 00-1-1H9a1 1 0 00-1 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-6H3a1 1 0 01-.707-1.707l7-7z" clipRule="evenodd" /></svg> },
  { label: "Kundalik",       href: "/student/journal", icon: <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path d="M3 3.5A1.5 1.5 0 014.5 2h6.879a1.5 1.5 0 011.06.44l4.122 4.12A1.5 1.5 0 0117 7.622V16.5a1.5 1.5 0 01-1.5 1.5h-11A1.5 1.5 0 013 16.5v-13z" /></svg> },
  { label: "Haftalik hisobot", href: "/student/reports", icon: <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" /></svg> },
  { label: "Profil",          href: "/student/profile", icon: <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-5.5-2.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zM10 12a5.99 5.99 0 00-4.793 2.39A6.483 6.483 0 0010 16.5a6.483 6.483 0 004.793-2.11A5.99 5.99 0 0010 12z" clipRule="evenodd" /></svg> },
];

const TABS = [
  { key: "all", label: "Barchasi" }, { key: "draft", label: "Qoralama" },
  { key: "submitted", label: "Topshirildi" }, { key: "approved", label: "Tasdiqlandi" },
  { key: "rejected", label: "Rad etildi" },
];

interface Report { id: number; week_number: number; content: string; status: string; reviewer_feedback: string | null; reviewed_at: string | null }

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [studentId, setStudentId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ week_number: "", content: "" });
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState<number | null>(null);
  const [expanded, setExpanded] = useState<number | null>(null);
  const { toast } = useToast();

  const load = useCallback((sid: number) => {
    setLoading(true);
    api.get<Report[]>(`/reports/student/${sid}`).then(setReports).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const user = getUser();
    if (!user?.studentId) return;
    setStudentId(user.studentId);
    load(user.studentId);
  }, [load]);

  const visible = activeTab === "all" ? reports : reports.filter(r => r.status === activeTab);
  const usedWeeks = new Set(reports.map(r => r.week_number));

  async function handleCreate() {
    if (!form.week_number || !form.content.trim()) return;
    setSaving(true);
    try {
      await api.post("/reports", { week_number: Number(form.week_number), content: form.content });
      setForm({ week_number: "", content: "" });
      setShowForm(false);
      if (studentId) load(studentId);
    } catch (e) { toast(e instanceof Error ? e.message : "Xatolik", "error"); }
    finally { setSaving(false); }
  }

  async function handleSubmit(id: number) {
    setSubmitting(id);
    try {
      await api.patch(`/reports/${id}`, { status: "submitted" });
      if (studentId) load(studentId);
    } catch (e) { toast(e instanceof Error ? e.message : "Xatolik", "error"); }
    finally { setSubmitting(null); }
  }

  return (
    <DashboardShell nav={nav}>
      <div className="space-y-5">
        <PageHeader
          title="Haftalik hisobotlar"
          subtitle="Har hafta amaliyot faoliyatingiz haqida hisobot yozing"
          action={
            <button onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-1.5 rounded-lg bg-[#2563eb] px-3.5 py-2 text-sm font-semibold text-white hover:bg-[#1d4ed8]">
              <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4"><path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" /></svg>
              Yangi hisobot
            </button>
          }
        />

        {/* New report form */}
        {showForm && (
          <div className="rounded-xl border border-blue-200 bg-blue-50 p-5">
            <h3 className="mb-4 text-sm font-semibold text-gray-800">Yangi haftalik hisobot</h3>
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">Hafta raqami *</label>
                <input type="number" min="1" max="52" value={form.week_number}
                  onChange={e => setForm(f => ({ ...f, week_number: e.target.value }))}
                  placeholder="1"
                  className="block w-32 rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20" />
                {form.week_number && usedWeeks.has(Number(form.week_number)) && (
                  <p className="mt-1 text-xs text-red-600">Bu hafta uchun allaqachon hisobot mavjud</p>
                )}
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">Hisobot mazmuni *</label>
                <textarea rows={5} value={form.content}
                  onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                  placeholder="Bu hafta nima qildingiz? Qanday ko'nikmalar oldingiz? Qanday muammolarga duch keldingiz?"
                  className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20 resize-none" />
              </div>
              <div className="flex gap-2">
                <button onClick={handleCreate} disabled={saving || !form.content.trim() || !form.week_number || usedWeeks.has(Number(form.week_number))}
                  className="rounded-lg bg-[#2563eb] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1d4ed8] disabled:opacity-50">
                  {saving ? "Saqlanmoqda..." : "Saqlash"}
                </button>
                <button onClick={() => setShowForm(false)} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50">
                  Bekor qilish
                </button>
              </div>
            </div>
          </div>
        )}

        <StatusTabs tabs={TABS} active={activeTab} onChange={setActiveTab} />

        {loading ? (
          <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-20 animate-pulse rounded-xl bg-gray-100" />)}</div>
        ) : visible.length === 0 ? (
          <EmptyState message="Hisobotlar yo'q" sub="Yangi hisobot qo'shish uchun yuqoridagi tugmani bosing" />
        ) : (
          <div className="space-y-3">
            {visible.map(r => (
              <div key={r.id} className="rounded-xl border border-gray-200 bg-white shadow-sm">
                <button className="flex w-full items-center justify-between px-5 py-4 text-left"
                  onClick={() => setExpanded(expanded === r.id ? null : r.id)}>
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-sm font-bold text-gray-600">
                      {r.week_number}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{r.week_number}-hafta hisoboti</p>
                      <p className="text-xs text-gray-400 truncate max-w-xs">{r.content.slice(0, 80)}…</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={r.status} />
                    {r.status === "draft" && (
                      <button onClick={e => { e.stopPropagation(); handleSubmit(r.id); }}
                        disabled={submitting === r.id}
                        className="rounded-lg border border-[#2563eb] px-2.5 py-1 text-xs font-medium text-[#2563eb] hover:bg-blue-50 disabled:opacity-50">
                        {submitting === r.id ? "..." : "Topshirish"}
                      </button>
                    )}
                    <svg viewBox="0 0 20 20" fill="currentColor" className={`h-4 w-4 text-gray-400 transition ${expanded === r.id ? "rotate-180" : ""}`}>
                      <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                    </svg>
                  </div>
                </button>
                {expanded === r.id && (
                  <div className="border-t border-gray-100 px-5 py-4 space-y-3">
                    <p className="whitespace-pre-wrap text-sm text-gray-700">{r.content}</p>
                    {r.reviewer_feedback && (
                      <div className={`rounded-lg p-3 text-sm ${r.status === "approved" ? "bg-green-50 text-green-800 border border-green-200" : "bg-red-50 text-red-800 border border-red-200"}`}>
                        <p className="font-semibold mb-1">Mentor izohi:</p>
                        <p>{r.reviewer_feedback}</p>
                      </div>
                    )}
                    {r.reviewed_at && <p className="text-xs text-gray-400">Ko&apos;rilgan: {new Date(r.reviewed_at).toLocaleDateString("uz-UZ")}</p>}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
