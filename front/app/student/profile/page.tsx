"use client";

import { useEffect, useState } from "react";
import DashboardShell from "@/components/DashboardShell";
import PageHeader from "@/components/PageHeader";
import { api } from "@/lib/api";
import { getUser } from "@/lib/auth";

const nav = [
  { label: "Amaliyot",         href: "/student",          icon: <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path fillRule="evenodd" d="M9.293 2.293a1 1 0 011.414 0l7 7A1 1 0 0117 11h-1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-3a1 1 0 00-1-1H9a1 1 0 00-1 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-6H3a1 1 0 01-.707-1.707l7-7z" clipRule="evenodd" /></svg> },
  { label: "Amaliyotim",       href: "/student/amaliyot", icon: <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path fillRule="evenodd" d="M6 3.75A2.75 2.75 0 018.75 1h2.5A2.75 2.75 0 0114 3.75v.443c.572.055 1.14.122 1.706.2C17.053 4.582 18 5.75 18 7.07v3.469c0 1.126-.694 2.191-1.83 2.54-1.952.599-4.024.921-6.17.921s-4.219-.322-6.17-.921C2.694 12.73 2 11.665 2 10.539V7.07c0-1.321.947-2.489 2.294-2.676A41.047 41.047 0 016 4.193V3.75zm6.5 0v.325a41.622 41.622 0 00-5 0V3.75c0-.69.56-1.25 1.25-1.25h2.5c.69 0 1.25.56 1.25 1.25zM10 10a1 1 0 00-1 1v.01a1 1 0 001 1h.01a1 1 0 001-1V11a1 1 0 00-1-1H10z" clipRule="evenodd" /><path d="M3 15.055v-.684c.126.053.255.1.39.142 2.1.644 4.318.999 6.61.999 2.291 0 4.51-.355 6.61-.999.135-.041.264-.089.39-.142v.684c0 1.347-.985 2.53-2.363 2.686a41.454 41.454 0 01-9.274 0C3.985 17.585 3 16.402 3 15.055z" /></svg> },
  { label: "Hisobotlar",       href: "/student/reports",  icon: <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" /></svg> },
  { label: "Profil",           href: "/student/profile",  icon: <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-5.5-2.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zM10 12a5.99 5.99 0 00-4.793 2.39A6.483 6.483 0 0010 16.5a6.483 6.483 0 004.793-2.11A5.99 5.99 0 0010 12z" clipRule="evenodd" /></svg> },
];

interface Student {
  id: number; full_name: string; email: string;
  university_name: string | null; direction_name: string | null;
}

interface Assignment {
  id: number; status: string;
  company_name: string | null;
  supervisor_name: string | null; supervisor_position: string | null;
  mentor_name: string | null; mentor_position: string | null;
  internship_start: string | null; internship_end: string | null;
}

interface Report { id: number; status: string }

function InfoRow({ label, value }: { label: string; value: string | undefined | null }) {
  return (
    <div className="flex items-start gap-4 py-3 border-b border-gray-100 last:border-0">
      <span className="w-44 shrink-0 text-xs font-medium text-gray-500">{label}</span>
      <span className="text-sm text-gray-800">{value || "—"}</span>
    </div>
  );
}

/** "Ism Familiya — Lavozim" ko'rinishida birlashtiradi */
function person(name: string | null, position: string | null): string {
  if (!name) return "Belgilanmagan";
  return position ? `${name} — ${position}` : name;
}

export default function StudentProfilePage() {
  const [profile, setProfile] = useState<Student | null>(null);
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [avg, setAvg] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sid = getUser()?.studentId;
    api.get<Student[]>("/students").then(data => {
      setProfile(data[0] ?? null);
    }).finally(() => setLoading(false));

    api.get<Assignment[]>("/internship-students/my").then(list => {
      // Tasdiqlangan biriktiruv ustun, bo'lmasa eng oxirgisi
      const acc = list.find(a => a.status === "accepted");
      setAssignment(acc ?? list[0] ?? null);
    }).catch(() => {});

    if (sid) {
      api.get<Report[]>(`/reports/student/${sid}`).then(setReports).catch(() => {});
      api.get<{ averageGrade: number | null }>(`/reports/student/${sid}/summary`)
        .then(s => setAvg(s.averageGrade)).catch(() => {});
    }
  }, []);

  const start = assignment?.internship_start ?? null;
  const end = assignment?.internship_end ?? null;

  const daysLeft = end
    ? Math.max(0, Math.ceil((new Date(end).getTime() - Date.now()) / 86_400_000))
    : null;
  const totalDays = (start && end)
    ? Math.ceil((new Date(end).getTime() - new Date(start).getTime()) / 86_400_000)
    : null;
  const elapsedPct = (totalDays && daysLeft !== null && totalDays > 0)
    ? Math.min(100, Math.round(((totalDays - daysLeft) / totalDays) * 100))
    : 0;

  return (
    <DashboardShell nav={nav}>
      <div className="space-y-6">
        <PageHeader title="Profil" subtitle="Shaxsiy ma'lumotlar va amaliyot holati" />

        {loading ? (
          <div className="space-y-4">{[1,2,3].map(i => <div key={i} className="h-20 animate-pulse rounded-xl bg-gray-100" />)}</div>
        ) : !profile ? (
          <div className="rounded-xl border border-gray-200 bg-white p-8 text-center text-sm text-gray-400">
            Profil topilmadi
          </div>
        ) : (
          <>
            {/* Avatar card */}
            <div className="flex items-center gap-5 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#2563eb]/10 text-2xl font-bold text-[#2563eb]">
                {profile.full_name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-bold text-gray-900">{profile.full_name}</h2>
                <p className="text-sm text-gray-500">{profile.email}</p>
                {profile.direction_name && (
                  <p className="mt-0.5 text-xs text-gray-400">{profile.direction_name}</p>
                )}
              </div>
              <div className="hidden sm:grid grid-cols-3 gap-4 text-center">
                {[
                  { label: "Hisobotlar", value: reports.length },
                  { label: "Tasdiqlangan", value: reports.filter(r => r.status === "approved").length },
                  { label: "O'rtacha baho", value: avg != null ? `${avg.toFixed(1)} ⭐` : "—" },
                ].map(s => (
                  <div key={s.label}>
                    <p className="text-xl font-bold text-gray-800">{s.value}</p>
                    <p className="text-xs text-gray-500">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Progress bar */}
            {totalDays !== null && daysLeft !== null && start && end && (
              <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Amaliyot jarayoni</span>
                  <span className="text-sm font-semibold text-[#2563eb]">{elapsedPct}%</span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-100">
                  <div className="h-full rounded-full bg-[#2563eb] transition-all" style={{ width: `${elapsedPct}%` }} />
                </div>
                <div className="mt-2 flex justify-between text-xs text-gray-400">
                  <span>{new Date(start).toLocaleDateString("uz-UZ")}</span>
                  <span>{daysLeft > 0 ? `${daysLeft} kun qoldi` : "Tugagan"}</span>
                  <span>{new Date(end).toLocaleDateString("uz-UZ")}</span>
                </div>
              </div>
            )}

            {/* Amaliyot ma'lumotlari */}
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <h3 className="mb-2 text-sm font-semibold text-gray-700">Amaliyot ma&apos;lumotlari</h3>
              <InfoRow label="To'liq ism"                value={profile.full_name} />
              <InfoRow label="Yo'nalish"                 value={profile.direction_name} />
              <InfoRow label="Universitet"               value={profile.university_name} />
              <InfoRow label="Kompaniya"                 value={assignment?.company_name} />
              <InfoRow label="Amaliyot boshlanishi"      value={start ? new Date(start).toLocaleDateString("uz-UZ") : undefined} />
              <InfoRow label="Amaliyot tugashi"          value={end ? new Date(end).toLocaleDateString("uz-UZ") : undefined} />
              <InfoRow label="Universitetdan mas'ul"     value={person(assignment?.supervisor_name ?? null, assignment?.supervisor_position ?? null)} />
              <InfoRow label="Korxonadan mentor"         value={person(assignment?.mentor_name ?? null, assignment?.mentor_position ?? null)} />
            </div>

            {/* Hisobot statistikasi */}
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { label: "Barcha hisobotlar", value: reports.length,                                       color: "bg-gray-50 border-gray-200 text-gray-700" },
                { label: "Tasdiqlangan",       value: reports.filter(r => r.status === "approved").length,   color: "bg-green-50 border-green-200 text-green-700" },
                { label: "Ko'rib chiqilmoqda", value: reports.filter(r => r.status === "submitted").length,  color: "bg-blue-50 border-blue-200 text-blue-700" },
              ].map(s => (
                <div key={s.label} className={`rounded-xl border p-4 ${s.color}`}>
                  <p className="text-2xl font-bold">{s.value}</p>
                  <p className="text-sm font-medium opacity-80">{s.label}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </DashboardShell>
  );
}
