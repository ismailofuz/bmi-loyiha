"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import DashboardShell from "@/components/DashboardShell";
import StatusBadge from "@/components/StatusBadge";
import { api } from "@/lib/api";
import { getUser } from "@/lib/auth";

const nav = [
  { label: "Amaliyot", href: "/student", icon: <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path fillRule="evenodd" d="M9.293 2.293a1 1 0 011.414 0l7 7A1 1 0 0117 11h-1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-3a1 1 0 00-1-1H9a1 1 0 00-1 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-6H3a1 1 0 01-.707-1.707l7-7z" clipRule="evenodd" /></svg> },
  { label: "Kundalik", href: "/student/journal", icon: <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path d="M3 3.5A1.5 1.5 0 014.5 2h6.879a1.5 1.5 0 011.06.44l4.122 4.12A1.5 1.5 0 0117 7.622V16.5a1.5 1.5 0 01-1.5 1.5h-11A1.5 1.5 0 013 16.5v-13z" /></svg> },
  { label: "Haftalik hisobot", href: "/student/reports", icon: <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" /></svg> },
  { label: "Profil", href: "/student/profile", icon: <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-5.5-2.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zM10 12a5.99 5.99 0 00-4.793 2.39A6.483 6.483 0 0010 16.5a6.483 6.483 0 004.793-2.11A5.99 5.99 0 0010 12z" clipRule="evenodd" /></svg> },
];

const MOOD = {
  excellent: { emoji: "🤩", label: "Ajoyib" },
  good:      { emoji: "😊", label: "Yaxshi" },
  neutral:   { emoji: "😐", label: "O'rtacha" },
  difficult: { emoji: "😓", label: "Qiyin" },
  bad:       { emoji: "😞", label: "Yomon" },
};

const DAYS = ["Du", "Se", "Ch", "Pa", "Ju", "Sha", "Ya"];

interface Student {
  id: number; full_name: string; student_number: string; specialty: string;
  university_name: string; company_name: string;
  internship_start: string; internship_end: string; status: string;
}
interface JournalEntry { id: number; entry_date: string; mood: string; content: string }
interface Report { id: number; week_number: number; status: string }

export default function StudentDashboard() {
  const [student, setStudent] = useState<Student | null>(null);
  const [journals, setJournals] = useState<JournalEntry[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = getUser();
    if (!user?.studentId) return;
    const sid = user.studentId;

    Promise.all([
      api.get<Student[]>("/students"),
      api.get<JournalEntry[]>(`/journal/student/${sid}`),
      api.get<Report[]>(`/reports/student/${sid}`),
    ]).then(([students, j, r]) => {
      setStudent((students as Student[])[0] ?? null);
      setJournals(j);
      setReports(r);
    }).finally(() => setLoading(false));
  }, []);

  const attended = journals.length;
  const submitted = reports.filter(r => r.status !== "draft").length;
  const approved = reports.filter(r => r.status === "approved").length;

  // Build last 7 days journal map
  const today = new Date();
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (6 - i));
    const key = d.toISOString().slice(0, 10);
    const entry = journals.find(j => j.entry_date === key);
    return { date: d, key, entry, dayName: DAYS[d.getDay() === 0 ? 6 : d.getDay() - 1] };
  });

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
                      <p className="text-sm text-gray-500">{student.specialty} · {student.student_number}</p>
                      <StatusBadge status={student.status} />
                    </div>
                  </div>
                  <Link href="/student/journal" className="rounded-lg bg-[#2563eb] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#1d4ed8]">
                    Kundalik yozish
                  </Link>
                </div>
                <div className="grid grid-cols-2 gap-4 p-5 sm:grid-cols-4">
                  {[
                    { label: "Universitet",  value: student.university_name ?? "—" },
                    { label: "Kompaniya",    value: student.company_name ?? "—" },
                    { label: "Boshlanishi",  value: student.internship_start ? new Date(student.internship_start).toLocaleDateString("uz-UZ") : "—" },
                    { label: "Tugashi",      value: student.internship_end   ? new Date(student.internship_end).toLocaleDateString("uz-UZ")   : "—" },
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
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Kelgan kunlar",          value: attended,  color: "bg-green-50 border-green-200 text-green-700" },
                { label: "Topshirilgan hisobotlar", value: submitted, color: "bg-blue-50  border-blue-200  text-blue-700"  },
                { label: "Tasdiqlangan hisobotlar", value: approved,  color: "bg-purple-50 border-purple-200 text-purple-700" },
              ].map(s => (
                <div key={s.label} className={`rounded-xl border p-4 ${s.color}`}>
                  <p className="text-2xl font-bold">{s.value}</p>
                  <p className="mt-0.5 text-xs font-medium opacity-80">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Last 7 days */}
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <h3 className="mb-4 text-sm font-semibold text-gray-700">So&apos;nggi 7 kun</h3>
              <div className="grid grid-cols-7 gap-2">
                {weekDays.map(({ date, key, entry, dayName }) => {
                  const isToday = key === today.toISOString().slice(0, 10);
                  return (
                    <Link
                      key={key}
                      href={`/student/journal?date=${key}`}
                      className={`flex flex-col items-center rounded-lg border p-2 text-center transition hover:border-[#2563eb]
                        ${isToday ? "border-[#2563eb] bg-blue-50" : "border-gray-200"}
                        ${entry ? "bg-green-50 border-green-300" : ""}
                      `}
                    >
                      <span className="text-[10px] text-gray-400">{dayName}</span>
                      <span className={`text-sm font-bold ${isToday ? "text-[#2563eb]" : "text-gray-700"}`}>{date.getDate()}</span>
                      <span className="mt-1 text-base">
                        {entry ? (MOOD[entry.mood as keyof typeof MOOD]?.emoji ?? "📝") : "—"}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Recent reports */}
            {reports.length > 0 && (
              <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
                  <h3 className="text-sm font-semibold text-gray-700">Haftalik hisobotlar</h3>
                  <Link href="/student/reports" className="text-xs text-[#2563eb] hover:underline">Barchasi →</Link>
                </div>
                <div className="divide-y divide-gray-100">
                  {reports.slice(0, 4).map(r => (
                    <div key={r.id} className="flex items-center justify-between px-5 py-3">
                      <span className="text-sm text-gray-700">{r.week_number}-hafta</span>
                      <StatusBadge status={r.status} />
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
