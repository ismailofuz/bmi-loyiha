"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import DashboardShell from "@/components/DashboardShell";
import PageHeader from "@/components/PageHeader";
import EmptyState from "@/components/EmptyState";
import StatusBadge from "@/components/StatusBadge";
import { api } from "@/lib/api";

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

interface Internship {
  id: number;
  company_id: number;
  company_name: string;
  status: string;
  internship_start: string;
  internship_end: string;
}

interface CompanySummary {
  company_id: number;
  company_name: string;
  total: number;
  accepted: number;
  pending: number;
  latest_start: string;
}

export default function KorxonalarPage() {
  const [companies, setCompanies] = useState<CompanySummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    api.get<Internship[]>("/internships").then((data) => {
      const map = new Map<number, CompanySummary>();
      for (const it of data) {
        const existing = map.get(it.company_id);
        if (!existing) {
          map.set(it.company_id, {
            company_id: it.company_id,
            company_name: it.company_name,
            total: 1,
            accepted: it.status === "accepted" ? 1 : 0,
            pending: it.status === "pending" ? 1 : 0,
            latest_start: it.internship_start,
          });
        } else {
          existing.total++;
          if (it.status === "accepted") existing.accepted++;
          if (it.status === "pending") existing.pending++;
          if (it.internship_start > existing.latest_start) existing.latest_start = it.internship_start;
        }
      }
      setCompanies(Array.from(map.values()));
    }).finally(() => setLoading(false));
  }, []);

  const filtered = companies.filter(c =>
    c.company_name.toLowerCase().includes(search.toLowerCase())
  );

  const fmt = (d: string) => new Date(d).toLocaleDateString("uz-UZ");

  return (
    <DashboardShell nav={nav}>
      <div className="space-y-5">
        <PageHeader
          title="Hamkor korxonalar"
          subtitle="Amaliyot shartnomasi tuzilgan korxonalar ro'yxati"
          action={
            <Link
              href="/university/amaliyotlar"
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#2563eb] px-3.5 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4"><path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" /></svg>
              Yangi shartnoma
            </Link>
          }
        />

        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Korxona nomini qidiring..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#2563eb] w-72"
          />
        </div>

        {loading ? (
          <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-14 animate-pulse rounded-xl bg-gray-100" />)}</div>
        ) : filtered.length === 0 ? (
          <EmptyState
            message="Hamkor korxonalar yo'q"
            sub="Korxonalar bilan amaliyot shartnomasi tuzilgach bu yerda ko'rinadi"
          />
        ) : (
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-100">
                <thead className="bg-gray-50">
                  <tr>
                    {["#", "Korxona nomi", "Jami shartnoma", "Tasdiqlangan", "Kutilmoqda", "So'nggi amaliyot", ""].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map((c, i) => (
                    <tr key={c.company_id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-400">{i + 1}</td>
                      <td className="px-4 py-3 text-sm font-semibold text-gray-800">{c.company_name}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{c.total}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-700">
                          {c.accepted}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {c.pending > 0 ? (
                          <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-700">
                            {c.pending}
                          </span>
                        ) : (
                          <span className="text-xs text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500">{fmt(c.latest_start)}</td>
                      <td className="px-4 py-3">
                        <Link
                          href="/university/amaliyotlar"
                          className="rounded-lg border border-gray-200 px-2.5 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100"
                        >
                          Shartnomalar
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Jami korxonalar",      value: companies.length,                          color: "bg-blue-50 border-blue-200 text-blue-700" },
            { label: "Faol shartnomalar",     value: companies.reduce((s,c) => s+c.accepted,0), color: "bg-green-50 border-green-200 text-green-700" },
            { label: "Ko'rib chiqilmoqda",    value: companies.reduce((s,c) => s+c.pending,0),  color: "bg-yellow-50 border-yellow-200 text-yellow-700" },
          ].map(s => (
            <div key={s.label} className={`rounded-xl border p-4 ${s.color}`}>
              <p className="text-2xl font-bold">{loading ? "..." : s.value}</p>
              <p className="text-sm font-medium opacity-80">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}
