"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import DashboardShell from "@/components/DashboardShell";
import PageHeader from "@/components/PageHeader";
import EmptyState from "@/components/EmptyState";
import StatusBadge from "@/components/StatusBadge";
import { api } from "@/lib/api";
import { getUser } from "@/lib/auth";

const nav = [
  { label: "Amaliyot",         href: "/student",          icon: <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path fillRule="evenodd" d="M9.293 2.293a1 1 0 011.414 0l7 7A1 1 0 0117 11h-1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-3a1 1 0 00-1-1H9a1 1 0 00-1 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-6H3a1 1 0 01-.707-1.707l7-7z" clipRule="evenodd" /></svg> },
  { label: "Amaliyotim",       href: "/student/amaliyot", icon: <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path fillRule="evenodd" d="M6 3.75A2.75 2.75 0 018.75 1h2.5A2.75 2.75 0 0114 3.75v.443c.572.055 1.14.122 1.706.2C17.053 4.582 18 5.75 18 7.07v3.469c0 1.126-.694 2.191-1.83 2.54-1.952.599-4.024.921-6.17.921s-4.219-.322-6.17-.921C2.694 12.73 2 11.665 2 10.539V7.07c0-1.321.947-2.489 2.294-2.676A41.047 41.047 0 016 4.193V3.75zm6.5 0v.325a41.622 41.622 0 00-5 0V3.75c0-.69.56-1.25 1.25-1.25h2.5c.69 0 1.25.56 1.25 1.25zM10 10a1 1 0 00-1 1v.01a1 1 0 001 1h.01a1 1 0 001-1V11a1 1 0 00-1-1H10z" clipRule="evenodd" /><path d="M3 15.055v-.684c.126.053.255.1.39.142 2.1.644 4.318.999 6.61.999 2.291 0 4.51-.355 6.61-.999.135-.041.264-.089.39-.142v.684c0 1.347-.985 2.53-2.363 2.686a41.454 41.454 0 01-9.274 0C3.985 17.585 3 16.402 3 15.055z" /></svg> },
  { label: "Hisobotlar",       href: "/student/reports",  icon: <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" /></svg> },
  { label: "Profil",           href: "/student/profile",  icon: <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-5.5-2.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zM10 12a5.99 5.99 0 00-4.793 2.39A6.483 6.483 0 0010 16.5a6.483 6.483 0 004.793-2.11A5.99 5.99 0 0010 12z" clipRule="evenodd" /></svg> },
];

interface Assignment {
  id: number;
  internship_id: number;
  student_id: number;
  status: string;
  company_name: string;
  supervisor_name: string | null;
  internship_start: string;
  internship_end: string;
  created_at: string;
  contract_uuid: string | null;
}

interface AttendanceRecord {
  id: number;
  internship_student_id: number;
  date: string;
  is_present: boolean;
  grade: number | null;
  note: string | null;
}

interface ReportLite { report_date: string | null; status: string; grade: number | null }

const WEEKDAYS = ["Du", "Se", "Ch", "Pa", "Ju", "Sha", "Ya"];

function toDateStr(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
// Dushanba = 0 ... Yakshanba = 6
function weekIndex(d: Date): number {
  const g = d.getDay();
  return g === 0 ? 6 : g - 1;
}

export default function StudentAmaliyotPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [reports, setReports] = useState<ReportLite[]>([]);
  const [summaryAvg, setSummaryAvg] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const today = new Date();
  const todayStr = toDateStr(today);

  const loadAttendance = useCallback((assignmentList: Assignment[]) => {
    const accepted = assignmentList.filter(a => a.status === "accepted");
    if (!accepted.length) return;
    Promise.allSettled(
      accepted.map(a => api.get<AttendanceRecord[]>(`/attendance/internship-student/${a.id}`))
    ).then(results => {
      const all: AttendanceRecord[] = [];
      for (const r of results) if (r.status === "fulfilled") all.push(...r.value);
      setAttendance(all);
    });
  }, []);

  useEffect(() => {
    api.get<Assignment[]>("/internship-students/my")
      .then(data => { setAssignments(data); loadAttendance(data); })
      .catch(() => setAssignments([]))
      .finally(() => setLoading(false));
    const sid = getUser()?.studentId;
    if (sid) {
      api.get<{ averageGrade: number | null }>(`/reports/student/${sid}/summary`)
        .then(s => setSummaryAvg(s.averageGrade)).catch(() => {});
      api.get<ReportLite[]>(`/reports/student/${sid}`).then(setReports).catch(() => {});
    }
  }, [loadAttendance]);

  const fmt = (d: string) => new Date(d).toLocaleDateString("uz-UZ");

  // Sana -> davomat / baho xaritalari
  const presentByDate = new Set(
    attendance.filter(a => a.is_present).map(a => (a.date ?? "").slice(0, 10)),
  );
  const gradeByDate = new Map(
    reports.filter(r => r.report_date && r.grade != null && r.status === "approved")
      .map(r => [(r.report_date as string).slice(0, 10), r.grade as number]),
  );

  // Amaliyot davri (qabul qilingan biriktiruvlardan)
  const accepted = assignments.filter(a => a.status === "accepted");
  const rangeStart = accepted.length
    ? accepted.map(a => a.internship_start.slice(0, 10)).sort()[0] : null;
  const rangeEnd = accepted.length
    ? accepted.map(a => a.internship_end.slice(0, 10)).sort().slice(-1)[0] : null;

  // Har bir diapazon kunining holati
  type DayStat = "keldi" | "kelmadi" | "bugun" | "kelajak";
  function dayStatus(ds: string): DayStat {
    if (presentByDate.has(ds)) return "keldi";
    if (ds < todayStr) return "kelmadi";
    if (ds === todayStr) return "bugun";
    return "kelajak";
  }

  // Statistika
  const presentDays = presentByDate.size;
  let absentDays = 0;
  const calendarDays: { date: string; lead: number }[] = [];
  if (rangeStart && rangeEnd) {
    const cur = new Date(rangeStart + "T00:00:00");
    const end = new Date(rangeEnd + "T00:00:00");
    let first = true;
    while (cur <= end) {
      const ds = toDateStr(cur);
      calendarDays.push({ date: ds, lead: first ? weekIndex(cur) : 0 });
      if (dayStatus(ds) === "kelmadi") absentDays++;
      first = false;
      cur.setDate(cur.getDate() + 1);
    }
  }
  const avgGrade = summaryAvg != null ? summaryAvg.toFixed(1) : null;

  return (
    <DashboardShell nav={nav}>
      <div className="space-y-5">
        <PageHeader title="Amaliyotim" subtitle="Umumiy statistika, davomat kalendari va baholar" />

        {/* Statistika */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: "Jami amaliyot",    value: assignments.length, color: "bg-blue-50 border-blue-200 text-blue-700" },
            { label: "Kelgan kunlar",    value: presentDays,        color: "bg-green-50 border-green-200 text-green-700" },
            { label: "Kelmagan kunlar",  value: absentDays,         color: "bg-red-50 border-red-200 text-red-700" },
            { label: "O'rtacha baho",    value: avgGrade ? `${avgGrade} ⭐` : "—", color: "bg-yellow-50 border-yellow-200 text-yellow-700" },
          ].map(s => (
            <div key={s.label} className={`rounded-xl border p-4 ${s.color}`}>
              <p className="text-2xl font-bold">{loading ? "..." : s.value}</p>
              <p className="text-sm font-medium opacity-80">{s.label}</p>
            </div>
          ))}
        </div>

        {loading ? (
          <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-14 animate-pulse rounded-xl bg-gray-100" />)}</div>
        ) : assignments.length === 0 ? (
          <EmptyState message="Amaliyotlar yo'q" sub="Universitetingiz sizni amaliyotga biriktirgach bu yerda ko'rinadi" />
        ) : (
          <>
            {/* Amaliyotlar ro'yxati */}
            <div className="space-y-3">
              {assignments.map(a => (
                <div key={a.id} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-gray-800">{a.company_name}</h3>
                      <p className="text-xs text-gray-500 mt-0.5">Mas&apos;ul: {a.supervisor_name ?? "Belgilanmagan"}</p>
                      <p className="text-xs text-gray-500">{fmt(a.internship_start)} — {fmt(a.internship_end)}</p>
                    </div>
                    <StatusBadge status={a.status} />
                  </div>
                  {a.contract_uuid && (
                    <div className="mt-3">
                      <Link href={`/contracts/${a.contract_uuid}`}
                        className="inline-flex items-center gap-1 rounded-lg border border-blue-200 px-2.5 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50">
                        <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" /></svg>
                        Shartnoma
                      </Link>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Davomat kalendari — faqat amaliyot davri */}
            {rangeStart && rangeEnd && (
              <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                <div className="flex items-center justify-between border-b border-gray-100 px-5 py-3.5">
                  <h2 className="text-sm font-semibold text-gray-700">Davomat kalendari</h2>
                  <span className="text-xs text-gray-400">{fmt(rangeStart)} — {fmt(rangeEnd)}</span>
                </div>
                <div className="p-4">
                  <div className="mb-3 flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-full bg-green-500" /> Keldi</span>
                    <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-full bg-red-400" /> Kelmadi</span>
                    <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-full bg-blue-400" /> Bugun</span>
                  </div>
                  <div className="grid grid-cols-7 gap-1.5">
                    {WEEKDAYS.map(d => (
                      <div key={d} className="text-center text-xs font-medium text-gray-400 py-1">{d}</div>
                    ))}
                    {calendarDays.length > 0 && Array.from({ length: calendarDays[0].lead }).map((_, i) => (
                      <div key={`lead-${i}`} />
                    ))}
                    {calendarDays.map(({ date }) => {
                      const st = dayStatus(date);
                      const dayNum = Number(date.slice(8, 10));
                      const grade = gradeByDate.get(date);
                      const cls =
                        st === "keldi" ? "bg-green-50 border-green-300"
                        : st === "kelmadi" ? "bg-red-50 border-red-300"
                        : st === "bugun" ? "bg-blue-50 border-blue-400 ring-1 ring-blue-300"
                        : "border-gray-200 bg-white";
                      return (
                        <div key={date} className={`flex flex-col items-center rounded-lg p-1.5 border text-center ${cls}`}>
                          <span className={`text-xs font-semibold ${st === "bugun" ? "text-[#2563eb]" : "text-gray-700"}`}>{dayNum}</span>
                          <span className="mt-0.5 text-xs">
                            {st === "keldi" ? (grade != null ? `${grade}⭐` : "✓")
                              : st === "kelmadi" ? "✕"
                              : st === "bugun" ? "•"
                              : ""}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Baholar ro'yxati */}
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
              <div className="border-b border-gray-100 px-5 py-3.5">
                <h2 className="text-sm font-semibold text-gray-700">Hisobot baholari</h2>
              </div>
              {gradeByDate.size === 0 ? (
                <p className="p-5 text-sm text-gray-400">Hali baholangan hisobot yo&apos;q</p>
              ) : (
                <table className="min-w-full divide-y divide-gray-100">
                  <thead className="bg-gray-50">
                    <tr>
                      {["Sana", "Baho"].map(h => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {[...gradeByDate.entries()].sort((a, b) => b[0].localeCompare(a[0])).map(([date, grade]) => (
                      <tr key={date} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium text-gray-800">{fmt(date)}</td>
                        <td className="px-4 py-3 text-sm font-semibold text-green-700">{grade}/5 ⭐</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}
      </div>
    </DashboardShell>
  );
}
