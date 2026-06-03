"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import DashboardShell from "@/components/DashboardShell";
import PageHeader from "@/components/PageHeader";
import StatusBadge from "@/components/StatusBadge";
import { api } from "@/lib/api";
import { getUser } from "@/lib/auth";

const nav = [
  { label: "Bosh sahifa",       href: "/university",                    icon: <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path fillRule="evenodd" d="M9.293 2.293a1 1 0 011.414 0l7 7A1 1 0 0117 11h-1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-3a1 1 0 00-1-1H9a1 1 0 00-1 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-6H3a1 1 0 01-.707-1.707l7-7z" clipRule="evenodd" /></svg> },
  { label: "Talabalar",          href: "/university/students",           icon: <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z" /></svg> },
  { label: "Hisobotlar",         href: "/university/reports",            icon: <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" /></svg> },
  { label: "Xodimlar",           href: "/university/staff",              adminOnly: true, icon: <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path d="M7 8a3 3 0 100-6 3 3 0 000 6zM14.5 9a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM1.615 16.428a1.224 1.224 0 01-.569-1.175 6.002 6.002 0 0111.908 0c.058.467-.172.92-.57 1.174A9.953 9.953 0 017 18a9.953 9.953 0 01-5.385-1.572zM14.5 16h-.106c.07-.297.088-.611.048-.933a7.47 7.47 0 00-1.588-3.755 4.502 4.502 0 015.874 2.636.818.818 0 01-.36.98A7.465 7.465 0 0114.5 16z" /></svg> },
  { label: "Amaliyotlar",        href: "/university/amaliyotlar",        icon: <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path fillRule="evenodd" d="M6 3.75A2.75 2.75 0 018.75 1h2.5A2.75 2.75 0 0114 3.75v.443c.572.055 1.14.122 1.706.2C17.053 4.582 18 5.75 18 7.07v3.469c0 1.126-.694 2.191-1.83 2.54-1.952.599-4.024.921-6.17.921s-4.219-.322-6.17-.921C2.694 12.73 2 11.665 2 10.539V7.07c0-1.321.947-2.489 2.294-2.676A41.047 41.047 0 016 4.193V3.75zm6.5 0v.325a41.622 41.622 0 00-5 0V3.75c0-.69.56-1.25 1.25-1.25h2.5c.69 0 1.25.56 1.25 1.25zM10 10a1 1 0 00-1 1v.01a1 1 0 001 1h.01a1 1 0 001-1V11a1 1 0 00-1-1H10z" clipRule="evenodd" /><path d="M3 15.055v-.684c.126.053.255.1.39.142 2.1.644 4.318.999 6.61.999 2.291 0 4.51-.355 6.61-.999.135-.041.264-.089.39-.142v.684c0 1.347-.985 2.53-2.363 2.686a41.454 41.454 0 01-9.274 0C3.985 17.585 3 16.402 3 15.055z" /></svg> },
  { label: "Struktura",          href: "/university/struktura",          icon: <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path d="M2 3a1 1 0 00-1 1v1a1 1 0 001 1h16a1 1 0 001-1V4a1 1 0 00-1-1H2zM2 9a1 1 0 00-1 1v1a1 1 0 001 1h6a1 1 0 001-1v-1a1 1 0 00-1-1H2zM2 15a1 1 0 00-1 1v1a1 1 0 001 1h6a1 1 0 001-1v-1a1 1 0 00-1-1H2z" /></svg> },
  { label: "Hamkor korxonalar",  href: "/university/korxonalar",         icon: <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V8a2 2 0 00-2-2h-5L9 4H4zm7 5a1 1 0 10-2 0v1H8a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" /></svg> },
  { label: "Qaydnomalar",        href: "/university/qaydnomalar",        icon: <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" /></svg> },
];

interface Student {
  id: number; full_name: string; student_number: string; specialty: string;
  email: string; company_name: string; internship_start: string; internship_end: string; status: string;
}

interface Stats {
  students_count: number;
  companies_count: number;
  internships_count: number;
  completed_count: number;
}

interface Internship {
  id: number;
  status: string;
}

function DonutChart({ segments }: { segments: { color: string; value: number }[] }) {
  const total = segments.reduce((s, d) => s + d.value, 0);
  if (total === 0) {
    return (
      <svg viewBox="0 0 120 120" className="h-28 w-28">
        <circle cx="60" cy="60" r="44" fill="none" stroke="#e5e7eb" strokeWidth="20" />
      </svg>
    );
  }
  const r = 44;
  const circumference = 2 * Math.PI * r;
  let offset = 0;
  return (
    <svg viewBox="0 0 120 120" className="h-28 w-28 -rotate-90">
      {segments.map((seg, i) => {
        const dash = (seg.value / total) * circumference;
        const gap = circumference - dash;
        const dashOffset = -offset;
        offset += dash;
        return (
          <circle
            key={i}
            cx="60" cy="60" r={r}
            fill="none"
            stroke={seg.color}
            strokeWidth="20"
            strokeDasharray={`${dash} ${gap}`}
            strokeDashoffset={dashOffset}
          />
        );
      })}
    </svg>
  );
}

export default function UniversityPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [internships, setInternships] = useState<Internship[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const me = getUser();
    const statsPromise = me?.universityId
      ? api.get<Stats>(`/universities/${me.universityId}/stats`)
      : Promise.resolve(null);

    Promise.allSettled([
      api.get<Student[]>("/students"),
      statsPromise,
      api.get<Internship[]>("/internships"),
    ]).then(([studR, statsR, intR]) => {
      if (studR.status === "fulfilled")  setStudents(studR.value);
      if (statsR.status === "fulfilled") setStats(statsR.value as Stats | null);
      if (intR.status === "fulfilled")   setInternships(intR.value);
    }).finally(() => setLoading(false));
  }, []);

  const s = (v: number | undefined) => loading ? "..." : String(v ?? 0);

  const pending   = internships.filter(i => i.status === "pending").length;
  const accepted  = internships.filter(i => i.status === "accepted").length;
  const cancelled = internships.filter(i => i.status === "cancelled").length;

  const donutSegments = [
    { color: "#22c55e", value: accepted },
    { color: "#eab308", value: pending },
    { color: "#9ca3af", value: cancelled },
  ];

  return (
    <DashboardShell nav={nav}>
      <div className="space-y-6">
        <PageHeader title="Universitet paneli" subtitle="Universitetingiz talabalari va amaliyot holati" />

        {/* Main stats */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: "Jami talabalar",    value: s(stats?.students_count),    color: "bg-blue-50 border-blue-200 text-blue-700" },
            { label: "Hamkor korxonalar", value: s(stats?.companies_count),   color: "bg-indigo-50 border-indigo-200 text-indigo-700" },
            { label: "Amaliyotlar",       value: s(stats?.internships_count), color: "bg-green-50 border-green-200 text-green-700" },
            { label: "Tugallangan",       value: s(stats?.completed_count),   color: "bg-gray-50 border-gray-200 text-gray-700" },
          ].map(st => (
            <div key={st.label} className={`rounded-xl border p-4 ${st.color}`}>
              <p className="text-2xl font-bold">{st.value}</p>
              <p className="text-sm font-medium opacity-80">{st.label}</p>
            </div>
          ))}
        </div>

        {/* Charts row */}
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Donut chart - internship statuses */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <h3 className="mb-4 text-sm font-semibold text-gray-700">Amaliyot holatlari</h3>
            {loading ? (
              <div className="flex items-center justify-center h-28">
                <div className="h-28 w-28 animate-pulse rounded-full bg-gray-100" />
              </div>
            ) : (
              <div className="flex items-center gap-6">
                <DonutChart segments={donutSegments} />
                <div className="space-y-2">
                  {[
                    { color: "bg-green-500",  label: "Tasdiqlandi",      value: accepted },
                    { color: "bg-yellow-500", label: "Kutilmoqda",        value: pending },
                    { color: "bg-gray-400",   label: "Bekor qilindi",    value: cancelled },
                  ].map(l => (
                    <div key={l.label} className="flex items-center gap-2 text-sm">
                      <span className={`h-2.5 w-2.5 rounded-full ${l.color}`} />
                      <span className="text-gray-600">{l.label}</span>
                      <span className="ml-auto font-semibold text-gray-800">{l.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Bar chart - simple stats comparison */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <h3 className="mb-4 text-sm font-semibold text-gray-700">Umumiy ko'rsatkichlar</h3>
            {loading ? (
              <div className="space-y-3">{[1,2,3,4].map(i => <div key={i} className="h-8 animate-pulse rounded bg-gray-100" />)}</div>
            ) : (
              <div className="space-y-3">
                {[
                  { label: "Talabalar",        value: stats?.students_count ?? 0,    max: Math.max(stats?.students_count ?? 0, 1),    color: "bg-blue-500" },
                  { label: "Korxonalar",        value: stats?.companies_count ?? 0,   max: Math.max(stats?.students_count ?? 1, 1),    color: "bg-indigo-500" },
                  { label: "Amaliyotlar",       value: stats?.internships_count ?? 0, max: Math.max(stats?.students_count ?? 1, 1),    color: "bg-green-500" },
                  { label: "Tugatilgan",        value: stats?.completed_count ?? 0,   max: Math.max(stats?.internships_count ?? 1, 1), color: "bg-emerald-500" },
                ].map(b => {
                  const pct = b.max > 0 ? Math.round((b.value / b.max) * 100) : 0;
                  return (
                    <div key={b.label}>
                      <div className="mb-1 flex justify-between text-xs text-gray-600">
                        <span>{b.label}</span>
                        <span className="font-semibold">{b.value}</span>
                      </div>
                      <div className="h-2 rounded-full bg-gray-100">
                        <div className={`h-2 rounded-full ${b.color} transition-all`} style={{ width: `${Math.min(pct, 100)}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Recent students */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-3.5">
            <h2 className="text-sm font-semibold text-gray-700">So'nggi talabalar</h2>
            <Link href="/university/students" className="text-xs font-medium text-[#2563eb] hover:underline">
              Barchasini ko'rish →
            </Link>
          </div>
          {loading ? (
            <div className="p-5 space-y-3">{[1,2,3].map(i => <div key={i} className="h-12 animate-pulse rounded bg-gray-100" />)}</div>
          ) : students.length === 0 ? (
            <p className="p-5 text-sm text-gray-400">Talabalar yo'q</p>
          ) : (
            <ul className="divide-y divide-gray-50">
              {students.slice(0, 5).map(s => (
                <li key={s.id} className="flex items-center justify-between px-5 py-3 hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#2563eb]/10 text-xs font-bold text-[#2563eb]">
                      {s.full_name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">{s.full_name}</p>
                      <p className="text-xs text-gray-400">{s.specialty ?? s.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="hidden text-xs text-gray-400 sm:block">{s.company_name ?? "—"}</span>
                    <StatusBadge status={s.status} />
                    <Link href={`/university/reports?student=${s.id}`} className="text-xs font-medium text-[#2563eb] hover:underline">
                      Hisobotlar
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Quick links */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { href: "/university/students",   label: "Talabalar ro'yxati",    sub: "Barcha amaliyot talabalarini ko'rish", bg: "bg-[#2563eb]/10", tc: "text-[#2563eb]",  icon: <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z" /></svg> },
            { href: "/university/reports",    label: "Hisobotlar",            sub: "Kunlik hisobotlarni ko'rish",        bg: "bg-green-100",     tc: "text-green-700",  icon: <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" /></svg> },
            { href: "/university/korxonalar", label: "Hamkor korxonalar",     sub: "Amaliyot hamkor korxonalari",          bg: "bg-indigo-100",    tc: "text-indigo-700", icon: <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V8a2 2 0 00-2-2h-5L9 4H4zm7 5a1 1 0 10-2 0v1H8a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" /></svg> },
            { href: "/university/qaydnomalar",label: "Qaydnomalar",           sub: "Normativ hujjatlar",                   bg: "bg-orange-100",    tc: "text-orange-700", icon: <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" /></svg> },
          ].map(q => (
            <Link key={q.href} href={q.href}
              className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition">
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${q.bg} ${q.tc}`}>
                {q.icon}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">{q.label}</p>
                <p className="text-xs text-gray-500">{q.sub}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}
