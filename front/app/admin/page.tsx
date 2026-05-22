"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import DashboardShell from "@/components/DashboardShell";
import PageHeader from "@/components/PageHeader";
import { api } from "@/lib/api";

const nav = [
  { label: "Bosh sahifa",   href: "/admin",              icon: <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path fillRule="evenodd" d="M9.293 2.293a1 1 0 011.414 0l7 7A1 1 0 0117 11h-1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-3a1 1 0 00-1-1H9a1 1 0 00-1 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-6H3a1 1 0 01-.707-1.707l7-7z" clipRule="evenodd" /></svg> },
  { label: "Universitetlar", href: "/admin/universities", icon: <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path fillRule="evenodd" d="M1 2.75A.75.75 0 011.75 2h16.5a.75.75 0 010 1.5H17v7.75a.25.25 0 01-.25.25h-1.5a.25.25 0 01-.25-.25V3.5h-3v7.75a.25.25 0 01-.25.25h-1.5a.25.25 0 01-.25-.25V3.5h-3v7.75a.25.25 0 01-.25.25h-1.5a.25.25 0 01-.25-.25V3.5H3v13H4.25a.75.75 0 010 1.5H1.75a.75.75 0 010-1.5H3V3.5H1.75A.75.75 0 011 2.75z" clipRule="evenodd" /></svg> },
  { label: "Kompaniyalar",  href: "/admin/companies",    icon: <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path fillRule="evenodd" d="M4 16.5v-13h-.25a.75.75 0 010-1.5h12.5a.75.75 0 010 1.5H16v13h.25a.75.75 0 010 1.5h-3.5a.75.75 0 01-.75-.75v-2.5a.75.75 0 00-.75-.75h-2.5a.75.75 0 00-.75.75v2.5a.75.75 0 01-.75.75h-3.5a.75.75 0 010-1.5H4z" clipRule="evenodd" /></svg> },
];

interface University { id: number }
interface Company { id: number }

export default function AdminPage() {
  const [universities, setUniversities] = useState<University[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get<University[]>("/universities"),
      api.get<Company[]>("/companies"),
    ]).then(([uni, co]) => {
      setUniversities(uni); setCompanies(co);
    }).finally(() => setLoading(false));
  }, []);

  const stat = (v: number) => loading ? "..." : String(v);

  return (
    <DashboardShell nav={nav}>
      <div className="space-y-6">
        <PageHeader title="Bosh sahifa" subtitle="Tizim umumiy ko'rinishi" />

        <div className="grid grid-cols-2 gap-4">
          <Link href="/admin/universities"
            className="rounded-xl border bg-green-50 border-green-200 text-green-700 p-6 transition hover:shadow-md">
            <p className="text-3xl font-bold">{stat(universities.length)}</p>
            <p className="text-sm font-medium opacity-80 mt-1">Universitetlar</p>
          </Link>
          <Link href="/admin/companies"
            className="rounded-xl border bg-amber-50 border-amber-200 text-amber-700 p-6 transition hover:shadow-md">
            <p className="text-3xl font-bold">{stat(companies.length)}</p>
            <p className="text-sm font-medium opacity-80 mt-1">Kompaniyalar</p>
          </Link>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <Link href="/admin/universities"
            className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 text-green-700">
              <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path fillRule="evenodd" d="M1 2.75A.75.75 0 011.75 2h16.5a.75.75 0 010 1.5H17v7.75a.25.25 0 01-.25.25h-1.5a.25.25 0 01-.25-.25V3.5h-3v7.75a.25.25 0 01-.25.25h-1.5a.25.25 0 01-.25-.25V3.5h-3v7.75a.25.25 0 01-.25.25h-1.5a.25.25 0 01-.25-.25V3.5H3v13H4.25a.75.75 0 010 1.5H1.75a.75.75 0 010-1.5H3V3.5H1.75A.75.75 0 011 2.75z" clipRule="evenodd" /></svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">Universitetlar</p>
              <p className="text-xs text-gray-500">Universitetlar va xodimlarni boshqarish</p>
            </div>
          </Link>
          <Link href="/admin/companies"
            className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
              <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path fillRule="evenodd" d="M4 16.5v-13h-.25a.75.75 0 010-1.5h12.5a.75.75 0 010 1.5H16v13h.25a.75.75 0 010 1.5h-3.5a.75.75 0 01-.75-.75v-2.5a.75.75 0 00-.75-.75h-2.5a.75.75 0 00-.75.75v2.5a.75.75 0 01-.75.75h-3.5a.75.75 0 010-1.5H4z" clipRule="evenodd" /></svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">Kompaniyalar</p>
              <p className="text-xs text-gray-500">Kompaniyalar va mentorlarni boshqarish</p>
            </div>
          </Link>
        </div>
      </div>
    </DashboardShell>
  );
}
