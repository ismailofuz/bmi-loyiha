"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import DashboardShell from "@/components/DashboardShell";
import StatusBadge from "@/components/StatusBadge";
import { api } from "@/lib/api";
import { getUser } from "@/lib/auth";

const fmtDate = (d: string) => new Date(d).toLocaleDateString("uz-UZ");

const nav = [
  { label: "Amaliyot",         href: "/student",          icon: <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path fillRule="evenodd" d="M9.293 2.293a1 1 0 011.414 0l7 7A1 1 0 0117 11h-1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-3a1 1 0 00-1-1H9a1 1 0 00-1 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-6H3a1 1 0 01-.707-1.707l7-7z" clipRule="evenodd" /></svg> },
  { label: "Amaliyotim",       href: "/student/amaliyot", icon: <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path fillRule="evenodd" d="M6 3.75A2.75 2.75 0 018.75 1h2.5A2.75 2.75 0 0114 3.75v.443c.572.055 1.14.122 1.706.2C17.053 4.582 18 5.75 18 7.07v3.469c0 1.126-.694 2.191-1.83 2.54-1.952.599-4.024.921-6.17.921s-4.219-.322-6.17-.921C2.694 12.73 2 11.665 2 10.539V7.07c0-1.321.947-2.489 2.294-2.676A41.047 41.047 0 016 4.193V3.75zm6.5 0v.325a41.622 41.622 0 00-5 0V3.75c0-.69.56-1.25 1.25-1.25h2.5c.69 0 1.25.56 1.25 1.25zM10 10a1 1 0 00-1 1v.01a1 1 0 001 1h.01a1 1 0 001-1V11a1 1 0 00-1-1H10z" clipRule="evenodd" /><path d="M3 15.055v-.684c.126.053.255.1.39.142 2.1.644 4.318.999 6.61.999 2.291 0 4.51-.355 6.61-.999.135-.041.264-.089.39-.142v.684c0 1.347-.985 2.53-2.363 2.686a41.454 41.454 0 01-9.274 0C3.985 17.585 3 16.402 3 15.055z" /></svg> },
  { label: "Hisobotlar",       href: "/student/reports",  icon: <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" /></svg> },
  { label: "Profil",           href: "/student/profile",  icon: <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-5.5-2.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zM10 12a5.99 5.99 0 00-4.793 2.39A6.483 6.483 0 0010 16.5a6.483 6.483 0 004.793-2.11A5.99 5.99 0 0010 12z" clipRule="evenodd" /></svg> },
];

interface Student {
  id: number; full_name: string; university_name: string | null; direction_name: string | null;
}
interface Report { id: number; report_date: string | null; week_number: number | null; status: string; grade: number | null }
interface AttendanceRecord { id: number; is_present: boolean; grade: number | null }
interface Assignment {
  id: number; status: string;
  company_name: string | null; internship_start: string | null; internship_end: string | null;
}

export default function StudentDashboard() {
  const [student, setStudent] = useState<Student | null>(null);
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [summaryAvg, setSummaryAvg] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = getUser();
    if (!user?.studentId) return;
    const sid = user.studentId;

    Promise.allSettled([
      api.get<Student[]>("/students"),
      api.get<Report[]>(`/reports/student/${sid}`),
      api.get<Assignment[]>("/internship-students/my"),
      api.get<{ averageGrade: number | null }>(`/reports/student/${sid}/summary`),
    ]).then(async ([studR, rR, assignR, sumR]) => {
      if (studR.status === "fulfilled") setStudent((studR.value as Student[])[0] ?? null);
      if (rR.status === "fulfilled")    setReports(rR.value);
      if (sumR.status === "fulfilled")  setSummaryAvg((sumR.value as { averageGrade: number | null }).averageGrade);
      if (assignR.status === "fulfilled") {
        const list = assignR.value as Assignment[];
        const accepted = list.filter(a => a.status === "accepted");
        setAssignment(accepted[0] ?? list[0] ?? null);
        const allAtt: AttendanceRecord[] = [];
        await Promise.allSettled(
          accepted.map(a => api.get<AttendanceRecord[]>(`/attendance/internship-student/${a.id}`))
        ).then(results => {
          for (const r of results) {
            if (r.status === "fulfilled") allAtt.push(...r.value);
          }
        });
        setAttendance(allAtt);
      }
    }).finally(() => setLoading(false));
  }, []);

  const submitted = reports.filter(r => r.status === "submitted").length;
  const approved  = reports.filter(r => r.status === "approved").length;
  const presentDays = attendance.filter(a => a.is_present).length;
  const avgGrade = summaryAvg != null ? summaryAvg.toFixed(1) : null;


  return (
    <DashboardShell nav={nav}>
      <div className="space-y-6">
        {loading ? (
          <div className="space-y-4">
            {[1,2,3].map(i => <div key={i} className="h-24 animate-pulse rounded-xl bg-gray-100" />)}
          </div>
        ) : (
          <>
            {/* Internship overview card */}
            {student && (
              <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
                <div className="flex items-start justify-between border-b border-gray-100 p-5">
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#2563eb] text-xl font-bold text-white">
                      {student.full_name.charAt(0)}
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-gray-900">{student.full_name}</h2>
                      <p className="text-sm text-gray-500">{student.direction_name || "Talaba"}</p>
                    </div>
                  </div>
                  <Link href="/student/reports" className="rounded-lg bg-[#2563eb] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#1d4ed8]">
                    Hisobot yozish
                  </Link>
                </div>
                <div className="grid grid-cols-2 gap-4 p-5 sm:grid-cols-4">
                  {[
                    { label: "Universitet",  value: student.university_name ?? "—" },
                    { label: "Kompaniya",    value: assignment?.company_name ?? "—" },
                    { label: "Boshlanishi",  value: assignment?.internship_start ? fmtDate(assignment.internship_start) : "—" },
                    { label: "Tugashi",      value: assignment?.internship_end   ? fmtDate(assignment.internship_end)   : "—" },
                  ].map(item => (
                    <div key={item.label}>
                      <p className="text-xs text-gray-400">{item.label}</p>
                      <p className="text-sm font-semibold text-gray-800 truncate">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                { label: "Kelgan kunlar",          value: presentDays,                        color: "bg-green-50 border-green-200 text-green-700" },
                { label: "O'rtacha baho",           value: avgGrade ? `${avgGrade} ⭐` : "—", color: "bg-yellow-50 border-yellow-200 text-yellow-700" },
                { label: "Topshirilgan hisobotlar", value: submitted,                          color: "bg-blue-50 border-blue-200 text-blue-700" },
                { label: "Tasdiqlangan hisobotlar", value: approved,                           color: "bg-purple-50 border-purple-200 text-purple-700" },
              ].map(s => (
                <div key={s.label} className={`rounded-xl border p-4 ${s.color}`}>
                  <p className="text-2xl font-bold">{s.value}</p>
                  <p className="mt-0.5 text-xs font-medium opacity-80">{s.label}</p>
                </div>
              ))}
            </div>
            {/* Amaliyotim quick link */}
            <div className="flex items-center justify-between rounded-xl border border-indigo-200 bg-indigo-50 px-5 py-3">
              <div>
                <p className="text-sm font-semibold text-indigo-800">Davomat tafsilotlari</p>
                <p className="text-xs text-indigo-600">Amaliyot davomati va tarixini ko'rish</p>
              </div>
              <a href="/student/amaliyot" className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700">
                Ko'rish →
              </a>
            </div>

            {/* Recent reports */}
            {reports.length > 0 && (
              <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
                  <h3 className="text-sm font-semibold text-gray-700">So&apos;nggi hisobotlar</h3>
                  <Link href="/student/reports" className="text-xs text-[#2563eb] hover:underline">Barchasi →</Link>
                </div>
                <div className="divide-y divide-gray-100">
                  {[...reports]
                    .sort((a, b) => (b.report_date ?? "").localeCompare(a.report_date ?? ""))
                    .slice(0, 5).map(r => (
                    <div key={r.id} className="flex items-center justify-between px-5 py-3">
                      <span className="text-sm text-gray-700">
                        {r.report_date ? fmtDate(r.report_date) : `${r.week_number ?? "-"}-hafta`} hisoboti
                      </span>
                      <div className="flex items-center gap-2">
                        {r.status === "approved" && r.grade != null && (
                          <span className="rounded-full bg-green-600 px-2 py-0.5 text-xs font-bold text-white">{r.grade}/5</span>
                        )}
                        <StatusBadge status={r.status} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </DashboardShell>
  );
}
