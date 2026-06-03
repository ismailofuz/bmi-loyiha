"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import DashboardShell from "@/components/DashboardShell";
import { api } from "@/lib/api";
import { getUser } from "@/lib/auth";
import { useToast } from "@/components/ToastProvider";

const nav = [
  { label: "Bosh sahifa",  href: "/company",              icon: <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path fillRule="evenodd" d="M9.293 2.293a1 1 0 011.414 0l7 7A1 1 0 0117 11h-1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-3a1 1 0 00-1-1H9a1 1 0 00-1 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-6H3a1 1 0 01-.707-1.707l7-7z" clipRule="evenodd" /></svg> },
  { label: "Talabalarim",  href: "/company/students",     icon: <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z" /></svg> },
  { label: "Hisobotlar",   href: "/company/reports",      icon: <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" /></svg> },
  { label: "Shartnomalar", href: "/company/shartnomalar", icon: <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path fillRule="evenodd" d="M6 3.75A2.75 2.75 0 018.75 1h2.5A2.75 2.75 0 0114 3.75v.443c.572.055 1.14.122 1.706.2C17.053 4.582 18 5.75 18 7.07v3.469c0 1.126-.694 2.191-1.83 2.54-1.952.599-4.024.921-6.17.921s-4.219-.322-6.17-.921C2.694 12.73 2 11.665 2 10.539V7.07c0-1.321.947-2.489 2.294-2.676A41.047 41.047 0 016 4.193V3.75zm6.5 0v.325a41.622 41.622 0 00-5 0V3.75c0-.69.56-1.25 1.25-1.25h2.5c.69 0 1.25.56 1.25 1.25zM10 10a1 1 0 00-1 1v.01a1 1 0 001 1h.01a1 1 0 001-1V11a1 1 0 00-1-1H10z" clipRule="evenodd" /><path d="M3 15.055v-.684c.126.053.255.1.39.142 2.1.644 4.318.999 6.61.999 2.291 0 4.51-.355 6.61-.999.135-.041.264-.089.39-.142v.684c0 1.347-.985 2.53-2.363 2.686a41.454 41.454 0 01-9.274 0C3.985 17.585 3 16.402 3 15.055z" /></svg> },
  { label: "So'rovlar",    href: "/company/applications", icon: <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path fillRule="evenodd" d="M2 3.5A1.5 1.5 0 013.5 2h1.148a1.5 1.5 0 011.465 1.175l.716 3.223a1.5 1.5 0 01-1.052 1.767l-.933.267c-.41.117-.643.555-.48.95a11.542 11.542 0 006.254 6.254c.395.163.833-.07.95-.48l.267-.933a1.5 1.5 0 011.767-1.052l3.223.716A1.5 1.5 0 0118 15.352V16.5a1.5 1.5 0 01-1.5 1.5H15c-1.149 0-2.263-.15-3.326-.43A13.022 13.022 0 012.43 8.326 13.019 13.019 0 012 5V3.5z" clipRule="evenodd" /></svg> },
  { label: "Mentorlar",    href: "/company/mentors",      adminOnly: true, icon: <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" /></svg> },
];

interface Internship {
  id: number;
  status: string;
  supervisor_name: string | null;
  internship_start: string;
  internship_end: string;
}

interface InternshipStudent {
  id: number;
  student_id: number;
  student_name: string;
  status: string;
}

interface AttendanceRecord {
  id: number;
  internship_student_id: number;
  student_id: number;
  student_name: string;
  date: string;
  is_present: boolean;
  grade: number | null;
  note: string | null;
}

interface Mentor { id: number; full_name: string | null; email: string }

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function CalendarGrid({
  year, month, attendance, students, rangeStart, rangeEnd,
}: {
  year: number;
  month: number;
  attendance: AttendanceRecord[];
  students: InternshipStudent[];
  rangeStart: string;
  rangeEnd: string;
}) {
  const days = getDaysInMonth(year, month);
  const daysArr = Array.from({ length: days }, (_, i) => i + 1);
  const todayStr = new Date().toISOString().slice(0, 10);

  const attendanceMap = new Map<string, AttendanceRecord>();
  for (const a of attendance) {
    const key = `${a.internship_student_id}_${a.date.slice(0, 10)}`;
    attendanceMap.set(key, a);
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse text-xs">
        <thead>
          <tr>
            <th className="sticky left-0 z-10 bg-gray-50 px-3 py-2 text-left font-semibold text-gray-600 border border-gray-200 min-w-36">
              Talaba
            </th>
            {daysArr.map(d => {
              const date = new Date(year, month, d);
              const isWeekend = date.getDay() === 0 || date.getDay() === 6;
              return (
                <th key={d} className={`px-1.5 py-2 text-center font-medium border border-gray-200 w-8 ${isWeekend ? "bg-gray-100 text-gray-400" : "bg-gray-50 text-gray-600"}`}>
                  {d}
                </th>
              );
            })}
            <th className="px-3 py-2 text-center font-semibold text-gray-600 border border-gray-200 bg-gray-50">
              %
            </th>
          </tr>
        </thead>
        <tbody>
          {students.filter(s => s.status === "accepted").map(student => {
            let presentCount = 0;
            return (
              <tr key={student.id} className="hover:bg-gray-50">
                <td className="sticky left-0 z-10 bg-white px-3 py-2 font-medium text-gray-800 border border-gray-200">
                  {student.student_name}
                </td>
                {daysArr.map(d => {
                  const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
                  const key = `${student.id}_${dateStr}`;
                  const rec = attendanceMap.get(key);
                  const date = new Date(year, month, d);
                  const isWeekend = date.getDay() === 0 || date.getDay() === 6;

                  if (rec) {
                    if (rec.is_present) presentCount++;
                    return (
                      <td key={d} className={`px-1 py-2 text-center border border-gray-200 ${isWeekend ? "bg-gray-50" : ""}`}>
                        {rec.is_present ? (
                          <span className="inline-block h-5 w-5 rounded-full bg-green-500 text-white text-xs leading-5 text-center font-bold">
                            ✓
                          </span>
                        ) : (
                          <span className="inline-block h-5 w-5 rounded-full bg-red-400 text-white text-xs leading-5 text-center font-bold">
                            ✕
                          </span>
                        )}
                      </td>
                    );
                  }
                  // Yozuv yo'q: amaliyot davridagi o'tgan kun bo'lsa — kelmadi
                  const inRange = dateStr >= rangeStart && dateStr <= rangeEnd;
                  const missed = inRange && dateStr < todayStr;
                  return (
                    <td key={d} className={`px-1 py-2 text-center border border-gray-200 ${isWeekend ? "bg-gray-50" : ""}`}>
                      {missed ? (
                        <span className="inline-block h-5 w-5 rounded-full bg-red-400 text-white text-xs leading-5 text-center font-bold">✕</span>
                      ) : (
                        <span className="inline-block h-5 w-5 rounded-full bg-gray-100" />
                      )}
                    </td>
                  );
                })}
                <td className="px-3 py-2 text-center text-xs font-semibold text-gray-700 border border-gray-200">
                  {presentCount > 0 ? `${presentCount}` : "—"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default function InternshipDetailPage() {
  const { id } = useParams<{ id: string }>();
  const internshipId = Number(id);

  const [internship, setInternship] = useState<Internship | null>(null);
  const [students, setStudents] = useState<InternshipStudent[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const today = new Date();
  const [calYear, setCalYear]   = useState(today.getFullYear());
  const [calMonth, setCalMonth] = useState(today.getMonth());

  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [respondTarget, setRespondTarget] = useState<InternshipStudent | null>(null);
  const [selectedMentor, setSelectedMentor] = useState<string>("");
  const [responding, setResponding] = useState(false);

  const { toast } = useToast();

  const loadStudents = useCallback(() => {
    return api.get<InternshipStudent[]>(`/internships/${internshipId}/students`)
      .then(setStudents)
      .catch(() => {});
  }, [internshipId]);

  useEffect(() => {
    setLoading(true);
    const companyId = getUser()?.companyId;
    Promise.allSettled([
      api.get<Internship>(`/internships/${internshipId}`),
      api.get<InternshipStudent[]>(`/internships/${internshipId}/students`),
      api.get<AttendanceRecord[]>(`/attendance/internship/${internshipId}`),
      companyId ? api.get<Mentor[]>(`/companies/${companyId}/mentors`) : Promise.resolve([] as Mentor[]),
    ]).then(([intR, stuR, attR, mentR]) => {
      if (intR.status === "fulfilled") setInternship(intR.value);
      if (stuR.status === "fulfilled") setStudents(stuR.value);
      if (attR.status === "fulfilled") setAttendance(attR.value);
      if (mentR.status === "fulfilled") setMentors(mentR.value);
    }).finally(() => setLoading(false));
  }, [internshipId]);

  async function handleRespondStudent(action: "accepted" | "cancelled") {
    if (!respondTarget) return;
    setResponding(true);
    try {
      await api.patch(`/internship-students/${respondTarget.id}/respond`, {
        status: action,
        ...(action === "accepted" && selectedMentor ? { mentor_id: +selectedMentor } : {}),
      });
      toast(action === "accepted" ? "Talaba qabul qilindi va mentor biriktirildi" : "Talaba rad etildi", "success");
      setRespondTarget(null);
      setSelectedMentor("");
      loadStudents();
    } catch (e) {
      toast(e instanceof Error ? e.message : "Xatolik", "error");
    } finally {
      setResponding(false);
    }
  }

  const fmt = (d: string) => new Date(d).toLocaleDateString("uz-UZ");
  const monthName = new Date(calYear, calMonth).toLocaleDateString("uz-UZ", { month: "long", year: "numeric" });

  const accepted = students.filter(s => s.status === "accepted");
  const presentThisMonth = attendance.filter(a => {
    const d = new Date(a.date);
    return d.getFullYear() === calYear && d.getMonth() === calMonth && a.is_present;
  }).length;

  return (
    <DashboardShell nav={nav}>
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Link
            href="/company/shartnomalar"
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
              <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
            </svg>
            Shartnomalar
          </Link>
          <span className="text-gray-300">/</span>
          <span className="text-sm font-semibold text-gray-800">Shartnoma #{internshipId}</span>
        </div>

        {loading ? (
          <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-20 animate-pulse rounded-xl bg-gray-100" />)}</div>
        ) : !internship ? (
          <p className="text-sm text-gray-500">Shartnoma topilmadi.</p>
        ) : (
          <>
            {/* Info cards */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                { label: "Shartnoma raqami",  value: `#${internship.id}` },
                { label: "Mas'ul hodim",       value: internship.supervisor_name ?? "—" },
                { label: "Boshlanish",         value: fmt(internship.internship_start) },
                { label: "Tugash",             value: fmt(internship.internship_end) },
              ].map(info => (
                <div key={info.label} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                  <p className="text-xs text-gray-500 mb-1">{info.label}</p>
                  <p className="text-sm font-semibold text-gray-800">{info.value}</p>
                </div>
              ))}
            </div>

            {/* Students summary */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Jami talabalar",  value: students.length,    color: "bg-blue-50 border-blue-200 text-blue-700" },
                { label: "Faol",            value: accepted.length,    color: "bg-green-50 border-green-200 text-green-700" },
                { label: "Bu oy davomati", value: presentThisMonth,   color: "bg-indigo-50 border-indigo-200 text-indigo-700" },
              ].map(s => (
                <div key={s.label} className={`rounded-xl border p-4 ${s.color}`}>
                  <p className="text-2xl font-bold">{s.value}</p>
                  <p className="text-sm font-medium opacity-80">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Attendance calendar */}
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
              <div className="flex items-center justify-between border-b border-gray-100 px-5 py-3.5">
                <h2 className="text-sm font-semibold text-gray-700">Davomat jadvali</h2>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => { if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1); } else setCalMonth(m => m - 1); }}
                      className="rounded p-1 hover:bg-gray-100"
                    >
                      <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-gray-500">
                        <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <span className="text-sm font-medium text-gray-700 w-36 text-center capitalize">{monthName}</span>
                    <button
                      onClick={() => { if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1); } else setCalMonth(m => m + 1); }}
                      className="rounded p-1 hover:bg-gray-100"
                    >
                      <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-gray-500">
                        <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                  <span className="text-xs text-gray-400">Davomatni talaba o&apos;zi belgilaydi</span>
                </div>
              </div>

              {accepted.length === 0 ? (
                <p className="p-5 text-sm text-gray-400">Faol talabalar yo'q</p>
              ) : (
                <div className="p-3">
                  <div className="mb-3 flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-full bg-green-500" /> Keldi</span>
                    <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-full bg-red-400" /> Kelmadi</span>
                    <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-full bg-gray-100 border" /> Belgilanmagan</span>
                  </div>
                  <CalendarGrid
                    year={calYear}
                    month={calMonth}
                    attendance={attendance}
                    students={students}
                    rangeStart={internship.internship_start.slice(0, 10)}
                    rangeEnd={internship.internship_end.slice(0, 10)}
                  />
                </div>
              )}
            </div>

            {/* Students list */}
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
              <div className="border-b border-gray-100 px-5 py-3.5">
                <h2 className="text-sm font-semibold text-gray-700">Talabalar ({students.length})</h2>
              </div>
              {students.length === 0 ? (
                <p className="p-5 text-sm text-gray-400">Hali talabalar biriktirilmagan</p>
              ) : (
                <ul className="divide-y divide-gray-50">
                  {students.map(s => {
                    const presentDays = attendance.filter(a => a.internship_student_id === s.id && a.is_present).length;
                    const grades = attendance.filter(a => a.internship_student_id === s.id && a.grade != null).map(a => a.grade as number);
                    const avgGrade = grades.length > 0 ? (grades.reduce((sum, g) => sum + g, 0) / grades.length).toFixed(1) : null;
                    return (
                      <li key={s.id} className="flex items-center justify-between px-5 py-3 hover:bg-gray-50">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#2563eb]/10 text-xs font-bold text-[#2563eb]">
                            {s.student_name.charAt(0)}
                          </div>
                          <p className="text-sm font-medium text-gray-800">{s.student_name}</p>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>{presentDays} kun</span>
                          {avgGrade && <span className="font-semibold text-gray-700">⭐ {avgGrade}</span>}
                          {s.status === "pending" ? (
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => { setRespondTarget(s); setSelectedMentor(""); }}
                                className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-700"
                              >
                                Qabul qilish
                              </button>
                              <button
                                onClick={async () => {
                                  try {
                                    await api.patch(`/internship-students/${s.id}/respond`, { status: "cancelled" });
                                    toast("Talaba rad etildi", "success");
                                    loadStudents();
                                  } catch (e) { toast(e instanceof Error ? e.message : "Xatolik", "error"); }
                                }}
                                className="rounded-lg border border-red-300 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50"
                              >
                                Rad etish
                              </button>
                            </div>
                          ) : (
                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              s.status === "accepted" ? "bg-green-100 text-green-700" :
                              "bg-gray-100 text-gray-600"
                            }`}>
                              {s.status === "accepted" ? "Faol" : "Bekor"}
                            </span>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </>
        )}
      </div>

      {/* Talabani qabul qilish + mentor biriktirish modali */}
      {respondTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="mb-1 text-base font-bold text-gray-900">Talabani qabul qilish</h3>
            <p className="mb-4 text-sm text-gray-500">
              <span className="font-medium text-gray-700">{respondTarget.student_name}</span> uchun mas&apos;ul mentorni tanlang.
            </p>
            <label className="mb-1.5 block text-sm font-semibold text-gray-700">Mas&apos;ul mentor</label>
            <select
              value={selectedMentor}
              onChange={(e) => setSelectedMentor(e.target.value)}
              className="mb-4 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#2563eb]"
            >
              <option value="">— Meni biriktir (default) —</option>
              {mentors.map((m) => (
                <option key={m.id} value={m.id}>{m.full_name ?? m.email}</option>
              ))}
            </select>
            <div className="flex justify-end gap-2">
              <button onClick={() => { setRespondTarget(null); setSelectedMentor(""); }}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">Bekor qilish</button>
              <button onClick={() => handleRespondStudent("accepted")} disabled={responding}
                className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50">
                {responding ? "..." : "Qabul qilish"}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
