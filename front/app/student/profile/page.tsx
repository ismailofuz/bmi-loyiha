"use client";

import { useEffect, useState } from "react";
import DashboardShell from "@/components/DashboardShell";
import PageHeader from "@/components/PageHeader";
import StatusBadge from "@/components/StatusBadge";
import { api } from "@/lib/api";

const nav = [
  { label: "Amaliyot",       href: "/student",         icon: <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path fillRule="evenodd" d="M9.293 2.293a1 1 0 011.414 0l7 7A1 1 0 0117 11h-1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-3a1 1 0 00-1-1H9a1 1 0 00-1 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-6H3a1 1 0 01-.707-1.707l7-7z" clipRule="evenodd" /></svg> },
  { label: "Kundalik",       href: "/student/journal", icon: <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path d="M3 3.5A1.5 1.5 0 014.5 2h6.879a1.5 1.5 0 011.06.44l4.122 4.12A1.5 1.5 0 0117 7.622V16.5a1.5 1.5 0 01-1.5 1.5h-11A1.5 1.5 0 013 16.5v-13z" /></svg> },
  { label: "Haftalik hisobot", href: "/student/reports", icon: <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" /></svg> },
  { label: "Profil",          href: "/student/profile", icon: <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-5.5-2.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zM10 12a5.99 5.99 0 00-4.793 2.39A6.483 6.483 0 0010 16.5a6.483 6.483 0 004.793-2.11A5.99 5.99 0 0010 12z" clipRule="evenodd" /></svg> },
];

interface Student {
  id: number; full_name: string; student_number: string; specialty: string;
  email: string; university_name: string; company_name: string;
  internship_start: string; internship_end: string; status: string;
}

interface Report { id: number; week_number: number; status: string }
interface JournalEntry { id: number; entry_date: string }

function InfoRow({ label, value }: { label: string; value: string | undefined }) {
  return (
    <div className="flex items-start gap-4 py-3 border-b border-gray-100 last:border-0">
      <span className="w-40 shrink-0 text-xs font-medium text-gray-500">{label}</span>
      <span className="text-sm text-gray-800">{value ?? "—"}</span>
    </div>
  );
}

export default function StudentProfilePage() {
  const [profile, setProfile] = useState<Student | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<Student[]>("/students").then(data => {
      const me = data[0] ?? null;
      setProfile(me);
      if (me) {
        return Promise.all([
          api.get<Report[]>(`/reports/student/${me.id}`),
          api.get<JournalEntry[]>(`/journal/student/${me.id}`),
        ]).then(([r, j]) => { setReports(r); setJournalEntries(j); });
      }
    }).finally(() => setLoading(false));
  }, []);

  const daysLeft = profile?.internship_end
    ? Math.max(0, Math.ceil((new Date(profile.internship_end).getTime() - Date.now()) / 86_400_000))
    : null;

  const totalDays = (profile?.internship_start && profile?.internship_end)
    ? Math.ceil((new Date(profile.internship_end).getTime() - new Date(profile.internship_start).getTime()) / 86_400_000)
    : null;

  const elapsedPct = (totalDays && daysLeft !== null)
    ? Math.round(((totalDays - daysLeft) / totalDays) * 100)
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
                <div className="mt-1.5">
                  <StatusBadge status={profile.status} />
                </div>
              </div>
              <div className="hidden sm:grid grid-cols-3 gap-4 text-center">
                {[
                  { label: "Hisobotlar", value: reports.length },
                  { label: "Tasdiqlangan", value: reports.filter(r => r.status === "approved").length },
                  { label: "Kundaliklar", value: journalEntries.length },
                ].map(s => (
                  <div key={s.label}>
                    <p className="text-xl font-bold text-gray-800">{s.value}</p>
                    <p className="text-xs text-gray-500">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Progress bar */}
            {totalDays !== null && daysLeft !== null && (
              <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Amaliyot jarayoni</span>
                  <span className="text-sm font-semibold text-[#2563eb]">{elapsedPct}%</span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-100">
                  <div className="h-full rounded-full bg-[#2563eb] transition-all" style={{ width: `${elapsedPct}%` }} />
                </div>
                <div className="mt-2 flex justify-between text-xs text-gray-400">
                  <span>{new Date(profile.internship_start).toLocaleDateString("uz-UZ")}</span>
                  <span>{daysLeft > 0 ? `${daysLeft} kun qoldi` : "Tugagan"}</span>
                  <span>{new Date(profile.internship_end).toLocaleDateString("uz-UZ")}</span>
                </div>
              </div>
            )}

            {/* Details */}
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <h3 className="mb-2 text-sm font-semibold text-gray-700">Ma'lumotlar</h3>
              <InfoRow label="To'liq ism"       value={profile.full_name} />
              <InfoRow label="Talaba raqami"    value={profile.student_number} />
              <InfoRow label="Mutaxassislik"    value={profile.specialty} />
              <InfoRow label="Universitet"      value={profile.university_name} />
              <InfoRow label="Kompaniya"        value={profile.company_name} />
              <InfoRow label="Amaliyot boshlanishi" value={profile.internship_start ? new Date(profile.internship_start).toLocaleDateString("uz-UZ") : undefined} />
              <InfoRow label="Amaliyot tugashi"    value={profile.internship_end   ? new Date(profile.internship_end).toLocaleDateString("uz-UZ")   : undefined} />
            </div>

            {/* Report summary */}
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
