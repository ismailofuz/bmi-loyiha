"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import DashboardShell from "@/components/DashboardShell";
import PageHeader from "@/components/PageHeader";
import StatusBadge from "@/components/StatusBadge";
import StatusTabs from "@/components/StatusTabs";
import EmptyState from "@/components/EmptyState";
import { api } from "@/lib/api";
import { useToast } from "@/components/ToastProvider";

const nav = [
  { label: "Bosh sahifa", href: "/company",              icon: <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path fillRule="evenodd" d="M9.293 2.293a1 1 0 011.414 0l7 7A1 1 0 0117 11h-1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-3a1 1 0 00-1-1H9a1 1 0 00-1 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-6H3a1 1 0 01-.707-1.707l7-7z" clipRule="evenodd" /></svg> },
  { label: "Talabalarim", href: "/company/students",     icon: <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z" /></svg> },
  { label: "Hisobotlar",  href: "/company/reports",      icon: <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" /></svg> },
  { label: "So'rovlar",   href: "/company/applications", icon: <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path fillRule="evenodd" d="M2 3.5A1.5 1.5 0 013.5 2h1.148a1.5 1.5 0 011.465 1.175l.716 3.223a1.5 1.5 0 01-1.052 1.767l-.933.267c-.41.117-.643.555-.48.95a11.542 11.542 0 006.254 6.254c.395.163.833-.07.95-.48l.267-.933a1.5 1.5 0 011.767-1.052l3.223.716A1.5 1.5 0 0118 15.352V16.5a1.5 1.5 0 01-1.5 1.5H15c-1.149 0-2.263-.15-3.326-.43A13.022 13.022 0 012.43 8.326 13.019 13.019 0 012 5V3.5z" clipRule="evenodd" /></svg> },
  { label: "Mentorlar",   href: "/company/mentors",      adminOnly: true, icon: <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" /></svg> },
];

const TABS = [
  { key: "all", label: "Barchasi" }, { key: "submitted", label: "Topshirildi" },
  { key: "approved", label: "Tasdiqlandi" }, { key: "rejected", label: "Rad etildi" },
];

interface Student { id: number; full_name: string; student_number: string }
interface Report { id: number; week_number: number; content: string; status: string; reviewer_feedback: string | null; reviewed_at: string | null }

function CompanyReportsContent() {
  const searchParams = useSearchParams();
  const preselectedStudent = searchParams.get("student");

  const [students, setStudents] = useState<Student[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedStudent, setSelectedStudent] = useState(preselectedStudent ?? "");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [reviewing, setReviewing] = useState<{ id: number; action: "approved" | "rejected" } | null>(null);
  const [feedback, setFeedback] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const { toast } = useToast();

  useEffect(() => { api.get<Student[]>("/students").then(setStudents); }, []);

  const loadReports = useCallback((sid: string) => {
    if (!sid) return;
    setLoading(true);
    api.get<Report[]>(`/reports/student/${sid}`).then(setReports).finally(() => setLoading(false));
  }, []);

  useEffect(() => { if (selectedStudent) loadReports(selectedStudent); }, [selectedStudent, loadReports]);

  const visible = activeTab === "all" ? reports : reports.filter(r => r.status === activeTab);
  const pendingCount = reports.filter(r => r.status === "submitted").length;

  async function handleReview() {
    if (!reviewing) return;
    setSubmittingReview(true);
    try {
      await api.patch(`/reports/${reviewing.id}/review`, { status: reviewing.action, reviewer_feedback: feedback || undefined });
      setReviewing(null); setFeedback("");
      loadReports(selectedStudent);
    } catch (e) { toast(e instanceof Error ? e.message : "Xatolik", "error"); }
    finally { setSubmittingReview(false); }
  }

  return (
    <DashboardShell nav={nav}>
      <div className="space-y-5">
        <PageHeader title="Hisobotlar" subtitle="Talabalaring haftalik hisobotlarini ko'rish va tasdiqlash" />

        {pendingCount > 0 && (
          <div className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 shrink-0 text-amber-500">
              <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
            <p className="text-sm font-medium text-amber-800">{pendingCount} ta hisobot ko&apos;rib chiqishingizni kutmoqda</p>
          </div>
        )}

        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-gray-600 shrink-0">Talabani tanlang:</label>
          <select value={selectedStudent} onChange={e => setSelectedStudent(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#2563eb]">
            <option value="">— Tanlang —</option>
            {students.map(s => <option key={s.id} value={s.id}>{s.full_name}</option>)}
          </select>
        </div>

        {selectedStudent ? (
          <>
            <StatusTabs tabs={TABS} active={activeTab} onChange={setActiveTab} />
            {loading ? (
              <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-20 animate-pulse rounded-xl bg-gray-100" />)}</div>
            ) : visible.length === 0 ? (
              <EmptyState message="Hisobotlar yo'q" />
            ) : (
              <div className="space-y-3">
                {visible.map(r => (
                  <div key={r.id} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-sm font-bold text-gray-600">{r.week_number}</div>
                          <p className="text-sm font-semibold text-gray-800">{r.week_number}-hafta hisoboti</p>
                          <StatusBadge status={r.status} />
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-3">{r.content}</p>
                        {r.reviewer_feedback && (
                          <div className={`mt-3 rounded-lg p-2.5 text-xs ${r.status === "approved" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}>
                            <span className="font-semibold">Sizning izohingiz: </span>{r.reviewer_feedback}
                          </div>
                        )}
                      </div>
                      {r.status === "submitted" && (
                        <div className="flex shrink-0 flex-col gap-2">
                          <button onClick={() => setReviewing({ id: r.id, action: "approved" })}
                            className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-700">✓ Tasdiqlash</button>
                          <button onClick={() => setReviewing({ id: r.id, action: "rejected" })}
                            className="rounded-lg bg-red-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-600">✗ Rad etish</button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <EmptyState message="Talaba tanlang" sub="Hisobotlarni ko'rish uchun yuqoridan talabani tanlang" />
        )}
      </div>

      {reviewing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h3 className={`mb-1 text-base font-bold ${reviewing.action === "approved" ? "text-green-700" : "text-red-700"}`}>
              {reviewing.action === "approved" ? "Hisobotni tasdiqlash" : "Hisobotni rad etish"}
            </h3>
            <p className="mb-4 text-sm text-gray-500">Izoh talabaga ko&apos;rinadi.</p>
            <textarea rows={3} value={feedback} onChange={e => setFeedback(e.target.value)}
              placeholder="Izoh (ixtiyoriy)..."
              className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#2563eb] resize-none mb-4" />
            <div className="flex justify-end gap-2">
              <button onClick={() => { setReviewing(null); setFeedback(""); }}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">Bekor qilish</button>
              <button onClick={handleReview} disabled={submittingReview}
                className={`rounded-lg px-4 py-2 text-sm font-semibold text-white disabled:opacity-50 ${reviewing.action === "approved" ? "bg-green-600" : "bg-red-500"}`}>
                {submittingReview ? "..." : reviewing.action === "approved" ? "Tasdiqlash" : "Rad etish"}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}

export default function CompanyReportsPage() {
  return <Suspense><CompanyReportsContent /></Suspense>;
}
