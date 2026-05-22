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
  { label: "Bosh sahifa", href: "/university",         icon: <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path fillRule="evenodd" d="M9.293 2.293a1 1 0 011.414 0l7 7A1 1 0 0117 11h-1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-3a1 1 0 00-1-1H9a1 1 0 00-1 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-6H3a1 1 0 01-.707-1.707l7-7z" clipRule="evenodd" /></svg> },
  { label: "Talabalar",   href: "/university/students", icon: <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z" /></svg> },
  { label: "Hisobotlar",  href: "/university/reports",  icon: <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" /></svg> },
  { label: "Xodimlar",    href: "/university/staff",        adminOnly: true, icon: <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path d="M7 8a3 3 0 100-6 3 3 0 000 6zM14.5 9a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM1.615 16.428a1.224 1.224 0 01-.569-1.175 6.002 6.002 0 0111.908 0c.058.467-.172.92-.57 1.174A9.953 9.953 0 017 18a9.953 9.953 0 01-5.385-1.572zM14.5 16h-.106c.07-.297.088-.611.048-.933a7.47 7.47 0 00-1.588-3.755 4.502 4.502 0 015.874 2.636.818.818 0 01-.36.98A7.465 7.465 0 0114.5 16z" /></svg> },
  { label: "Amaliyotlar", href: "/university/amaliyotlar", icon: <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path fillRule="evenodd" d="M6 3.75A2.75 2.75 0 018.75 1h2.5A2.75 2.75 0 0114 3.75v.443c.572.055 1.14.122 1.706.2C17.053 4.582 18 5.75 18 7.07v3.469c0 1.126-.694 2.191-1.83 2.54-1.952.599-4.024.921-6.17.921s-4.219-.322-6.17-.921C2.694 12.73 2 11.665 2 10.539V7.07c0-1.321.947-2.489 2.294-2.676A41.047 41.047 0 016 4.193V3.75zm6.5 0v.325a41.622 41.622 0 00-5 0V3.75c0-.69.56-1.25 1.25-1.25h2.5c.69 0 1.25.56 1.25 1.25zM10 10a1 1 0 00-1 1v.01a1 1 0 001 1h.01a1 1 0 001-1V11a1 1 0 00-1-1H10z" clipRule="evenodd" /><path d="M3 15.055v-.684c.126.053.255.1.39.142 2.1.644 4.318.999 6.61.999 2.291 0 4.51-.355 6.61-.999.135-.041.264-.089.39-.142v.684c0 1.347-.985 2.53-2.363 2.686a41.454 41.454 0 01-9.274 0C3.985 17.585 3 16.402 3 15.055z" /></svg> },
  { label: "Struktura",   href: "/university/struktura",  icon: <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path d="M2 3a1 1 0 00-1 1v1a1 1 0 001 1h16a1 1 0 001-1V4a1 1 0 00-1-1H2zM2 9a1 1 0 00-1 1v1a1 1 0 001 1h6a1 1 0 001-1v-1a1 1 0 00-1-1H2zM2 15a1 1 0 00-1 1v1a1 1 0 001 1h6a1 1 0 001-1v-1a1 1 0 00-1-1H2z" /></svg> },
];

const TABS = [
  { key: "all", label: "Barchasi" }, { key: "submitted", label: "Topshirildi" },
  { key: "approved", label: "Tasdiqlandi" }, { key: "rejected", label: "Rad etildi" },
  { key: "draft", label: "Qoralama" },
];

interface Student { id: number; full_name: string; student_number: string }
interface Report { id: number; student_id: number; week_number: number; content: string; status: string; reviewer_feedback: string | null; reviewed_at: string | null }

function UniversityReportsContent() {
  const searchParams = useSearchParams();
  const preselectedStudent = searchParams.get("student");

  const [students, setStudents] = useState<Student[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<string>(preselectedStudent ?? "");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [reviewing, setReviewing] = useState<{ id: number; action: "approved" | "rejected" } | null>(null);
  const [feedback, setFeedback] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    api.get<Student[]>("/students").then(setStudents);
  }, []);

  const loadReports = useCallback((sid: string) => {
    if (!sid) return;
    setLoading(true);
    api.get<Report[]>(`/reports/student/${sid}`).then(setReports).finally(() => setLoading(false));
  }, []);

  useEffect(() => { if (selectedStudent) loadReports(selectedStudent); }, [selectedStudent, loadReports]);

  const visible = activeTab === "all" ? reports : reports.filter(r => r.status === activeTab);

  async function handleReview() {
    if (!reviewing) return;
    setSubmittingReview(true);
    try {
      await api.patch(`/reports/${reviewing.id}/review`, { status: reviewing.action, reviewer_feedback: feedback || undefined });
      setReviewing(null);
      setFeedback("");
      loadReports(selectedStudent);
    } catch (e) { toast(e instanceof Error ? e.message : "Xatolik", "error"); }
    finally { setSubmittingReview(false); }
  }

  return (
    <DashboardShell nav={nav}>
      <div className="space-y-5">
        <PageHeader title="Hisobotlar" subtitle="Talabalarning haftalik hisobotlarini ko'rish va tasdiqlash" />

        {/* Student selector */}
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-gray-600 shrink-0">Talabani tanlang:</label>
          <select value={selectedStudent} onChange={e => setSelectedStudent(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#2563eb]">
            <option value="">— Tanlang —</option>
            {students.map(s => <option key={s.id} value={s.id}>{s.full_name} ({s.student_number ?? s.id})</option>)}
          </select>
        </div>

        {selectedStudent && (
          <>
            <StatusTabs tabs={TABS} active={activeTab} onChange={setActiveTab} />

            {loading ? (
              <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-20 animate-pulse rounded-xl bg-gray-100" />)}</div>
            ) : visible.length === 0 ? (
              <EmptyState message="Hisobotlar yo'q" />
            ) : (
              <div className="space-y-3">
                {visible.map(r => (
                  <div key={r.id} className="rounded-xl border border-gray-200 bg-white shadow-sm">
                    <div className="flex items-start justify-between p-5">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-sm font-bold text-gray-600">{r.week_number}</div>
                          <div>
                            <p className="text-sm font-semibold text-gray-800">{r.week_number}-hafta hisoboti</p>
                          </div>
                          <StatusBadge status={r.status} />
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-3">{r.content}</p>
                        {r.reviewer_feedback && (
                          <div className={`mt-3 rounded-lg p-3 text-xs ${r.status === "approved" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}>
                            <span className="font-semibold">Izoh: </span>{r.reviewer_feedback}
                          </div>
                        )}
                      </div>
                      {r.status === "submitted" && (
                        <div className="ml-4 flex shrink-0 flex-col gap-2">
                          <button onClick={() => setReviewing({ id: r.id, action: "approved" })}
                            className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-700">
                            Tasdiqlash
                          </button>
                          <button onClick={() => setReviewing({ id: r.id, action: "rejected" })}
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
          </>
        )}

        {!selectedStudent && (
          <EmptyState message="Talaba tanlang" sub="Hisobotlarni ko'rish uchun yuqoridan talabani tanlang" />
        )}
      </div>

      {/* Review modal */}
      {reviewing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h3 className={`mb-1 text-base font-bold ${reviewing.action === "approved" ? "text-green-700" : "text-red-700"}`}>
              {reviewing.action === "approved" ? "Hisobotni tasdiqlash" : "Hisobotni rad etish"}
            </h3>
            <p className="mb-4 text-sm text-gray-500">Izohlangiz ixtiyoriy — talabaga ko&apos;rinadi.</p>
            <textarea rows={3} value={feedback} onChange={e => setFeedback(e.target.value)}
              placeholder="Izoh (ixtiyoriy)..."
              className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#2563eb] resize-none mb-4" />
            <div className="flex justify-end gap-2">
              <button onClick={() => { setReviewing(null); setFeedback(""); }}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50">
                Bekor qilish
              </button>
              <button onClick={handleReview} disabled={submittingReview}
                className={`rounded-lg px-4 py-2 text-sm font-semibold text-white disabled:opacity-50 ${reviewing.action === "approved" ? "bg-green-600 hover:bg-green-700" : "bg-red-500 hover:bg-red-600"}`}>
                {submittingReview ? "..." : reviewing.action === "approved" ? "Tasdiqlash" : "Rad etish"}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}

export default function UniversityReportsPage() {
  return <Suspense><UniversityReportsContent /></Suspense>;
}
