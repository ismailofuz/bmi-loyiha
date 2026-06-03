"use client";

import { useEffect, useState, useCallback } from "react";
import DashboardShell from "@/components/DashboardShell";
import PageHeader from "@/components/PageHeader";
import StatusTabs from "@/components/StatusTabs";
import EmptyState from "@/components/EmptyState";
import { api } from "@/lib/api";
import { useToast } from "@/components/ToastProvider";

const nav = [
  { label: "Bosh sahifa", href: "/company",              icon: <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path fillRule="evenodd" d="M9.293 2.293a1 1 0 011.414 0l7 7A1 1 0 0117 11h-1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-3a1 1 0 00-1-1H9a1 1 0 00-1 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-6H3a1 1 0 01-.707-1.707l7-7z" clipRule="evenodd" /></svg> },
  { label: "Talabalarim", href: "/company/students",     icon: <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z" /></svg> },
  { label: "Hisobotlar",  href: "/company/reports",      icon: <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" /></svg> },
  { label: "Shartnomalar", href: "/company/shartnomalar", icon: <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path fillRule="evenodd" d="M6 3.75A2.75 2.75 0 018.75 1h2.5A2.75 2.75 0 0114 3.75v.443c.572.055 1.14.122 1.706.2C17.053 4.582 18 5.75 18 7.07v3.469c0 1.126-.694 2.191-1.83 2.54-1.952.599-4.024.921-6.17.921s-4.219-.322-6.17-.921C2.694 12.73 2 11.665 2 10.539V7.07c0-1.321.947-2.489 2.294-2.676A41.047 41.047 0 016 4.193V3.75zm6.5 0v.325a41.622 41.622 0 00-5 0V3.75c0-.69.56-1.25 1.25-1.25h2.5c.69 0 1.25.56 1.25 1.25zM10 10a1 1 0 00-1 1v.01a1 1 0 001 1h.01a1 1 0 001-1V11a1 1 0 00-1-1H10z" clipRule="evenodd" /><path d="M3 15.055v-.684c.126.053.255.1.39.142 2.1.644 4.318.999 6.61.999 2.291 0 4.51-.355 6.61-.999.135-.041.264-.089.39-.142v.684c0 1.347-.985 2.53-2.363 2.686a41.454 41.454 0 01-9.274 0C3.985 17.585 3 16.402 3 15.055z" /></svg> },
  { label: "So'rovlar",   href: "/company/applications",  icon: <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path fillRule="evenodd" d="M2 3.5A1.5 1.5 0 013.5 2h1.148a1.5 1.5 0 011.465 1.175l.716 3.223a1.5 1.5 0 01-1.052 1.767l-.933.267c-.41.117-.643.555-.48.95a11.542 11.542 0 006.254 6.254c.395.163.833-.07.95-.48l.267-.933a1.5 1.5 0 011.767-1.052l3.223.716A1.5 1.5 0 0118 15.352V16.5a1.5 1.5 0 01-1.5 1.5H15c-1.149 0-2.263-.15-3.326-.43A13.022 13.022 0 012.43 8.326 13.019 13.019 0 012 5V3.5z" clipRule="evenodd" /></svg> },
  { label: "Mentorlar",   href: "/company/mentors",      adminOnly: true, icon: <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" /></svg> },
];

const TABS = [
  { key: "all", label: "Barchasi" },
  { key: "pending", label: "Kutilmoqda" },
  { key: "accepted", label: "Qabul qilindi" },
  { key: "rejected", label: "Rad etildi" },
];

const STATUS_STYLE: Record<string, string> = {
  pending:  "bg-yellow-100 text-yellow-700",
  accepted: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};
const STATUS_LABEL: Record<string, string> = {
  pending: "Kutilmoqda", accepted: "Qabul qilindi", rejected: "Rad etildi",
};

interface Application {
  id: number; status: string;
  student_name: string; student_number: string; specialty: string;
  company_name: string; university_name: string;
  internship_start: string | null; internship_end: string | null;
  notes: string | null; created_at: string;
}

export default function CompanyApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  const [responding, setResponding] = useState<{ id: number; action: "accepted" | "rejected" } | null>(null);
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { toast } = useToast();

  const loadApps = useCallback(() => {
    setLoading(true);
    api.get<Application[]>("/applications").then(setApplications).finally(() => setLoading(false));
  }, []);

  useEffect(() => { loadApps(); }, [loadApps]);

  const visible = activeTab === "all" ? applications : applications.filter(a => a.status === activeTab);
  const pendingCount = applications.filter(a => a.status === "pending").length;

  async function handleRespond() {
    if (!responding) return;
    setSubmitting(true);
    try {
      await api.patch(`/applications/${responding.id}/respond`, {
        status: responding.action,
        notes: notes || undefined,
      });
      setResponding(null); setNotes("");
      loadApps();
    } catch (e) { toast(e instanceof Error ? e.message : "Xatolik", "error"); }
    finally { setSubmitting(false); }
  }

  const inputCls = "block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#2563eb]";

  return (
    <DashboardShell nav={nav}>
      <div className="space-y-5">
        <PageHeader title="Amaliyot so'rovlari" subtitle="Universitetlardan kelgan talaba amaliyot so'rovlari" />

        {pendingCount > 0 && (
          <div className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 shrink-0 text-amber-500">
              <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
            <p className="text-sm font-medium text-amber-800">{pendingCount} ta so'rov javobingizni kutmoqda</p>
          </div>
        )}

        <StatusTabs tabs={TABS} active={activeTab} onChange={setActiveTab} />

        {loading ? (
          <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-24 animate-pulse rounded-xl bg-gray-100" />)}</div>
        ) : visible.length === 0 ? (
          <EmptyState message="So'rovlar yo'q" />
        ) : (
          <div className="space-y-3">
            {visible.map(a => (
              <div key={a.id} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">
                        {a.student_name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">{a.student_name}</p>
                        <p className="text-xs text-gray-400">{a.university_name}</p>
                      </div>
                      <span className={`ml-2 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLE[a.status] ?? "bg-gray-100 text-gray-600"}`}>
                        {STATUS_LABEL[a.status] ?? a.status}
                      </span>
                    </div>
                    {a.specialty && <p className="text-xs text-gray-500 mb-1">Mutaxassislik: {a.specialty}</p>}
                    {a.internship_start && (
                      <p className="text-xs text-gray-500">
                        Muddat: {new Date(a.internship_start).toLocaleDateString("uz-UZ")} — {new Date(a.internship_end!).toLocaleDateString("uz-UZ")}
                      </p>
                    )}
                    {a.notes && (
                      <div className={`mt-2 rounded-lg p-2.5 text-xs ${a.status === "accepted" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}>
                        <span className="font-semibold">Izoh: </span>{a.notes}
                      </div>
                    )}
                  </div>
                  {a.status === "pending" && (
                    <div className="flex shrink-0 flex-col gap-2">
                      <button onClick={() => setResponding({ id: a.id, action: "accepted" })}
                        className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-700">
                        Qabul qilish
                      </button>
                      <button onClick={() => setResponding({ id: a.id, action: "rejected" })}
                        className="rounded-lg bg-red-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-600">
                        Rad etish
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Respond modal */}
      {responding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h3 className={`mb-1 text-base font-bold ${responding.action === "accepted" ? "text-green-700" : "text-red-700"}`}>
              {responding.action === "accepted" ? "So'rovni qabul qilish" : "So'rovni rad etish"}
            </h3>
            <p className="mb-4 text-sm text-gray-500">Izoh talabaga va universitetga ko&apos;rinadi.</p>
            <textarea rows={3} value={notes} onChange={e => setNotes(e.target.value)}
              placeholder="Izoh (ixtiyoriy)..."
              className={`${inputCls} resize-none mb-4`} />
            <div className="flex justify-end gap-2">
              <button onClick={() => { setResponding(null); setNotes(""); }}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">
                Bekor qilish
              </button>
              <button onClick={handleRespond} disabled={submitting}
                className={`rounded-lg px-4 py-2 text-sm font-semibold text-white disabled:opacity-50 ${responding.action === "accepted" ? "bg-green-600 hover:bg-green-700" : "bg-red-500 hover:bg-red-600"}`}>
                {submitting ? "..." : responding.action === "accepted" ? "Qabul qilish" : "Rad etish"}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
