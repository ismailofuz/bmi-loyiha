"use client";

import { useEffect, useState } from "react";
import DashboardShell from "@/components/DashboardShell";
import PageHeader from "@/components/PageHeader";
import StatusBadge from "@/components/StatusBadge";
import StatusTabs from "@/components/StatusTabs";
import EmptyState from "@/components/EmptyState";
import { api } from "@/lib/api";
import { useToast } from "@/components/ToastProvider";

const nav = [
  { label: "Bosh sahifa",    href: "/admin",              icon: <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path fillRule="evenodd" d="M9.293 2.293a1 1 0 011.414 0l7 7A1 1 0 0117 11h-1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-3a1 1 0 00-1-1H9a1 1 0 00-1 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-6H3a1 1 0 01-.707-1.707l7-7z" clipRule="evenodd" /></svg> },
  { label: "Foydalanuvchilar", href: "/admin/users",      icon: <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path d="M7 8a3 3 0 100-6 3 3 0 000 6zM14.5 9a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM1.615 16.428a1.224 1.224 0 01-.569-1.175 6.002 6.002 0 0111.908 0c.058.467-.172.92-.57 1.174A9.953 9.953 0 017 18a9.953 9.953 0 01-5.385-1.572zM14.5 16h-.106c.07-.297.088-.611.048-.933a7.47 7.47 0 00-1.588-3.755 4.502 4.502 0 015.874 2.636.818.818 0 01-.36.98A7.465 7.465 0 0114.5 16z" /></svg> },
  { label: "Universitetlar",  href: "/admin/universities", icon: <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path fillRule="evenodd" d="M1 2.75A.75.75 0 011.75 2h16.5a.75.75 0 010 1.5H17v7.75a.25.25 0 01-.25.25h-1.5a.25.25 0 01-.25-.25V3.5h-3v7.75a.25.25 0 01-.25.25h-1.5a.25.25 0 01-.25-.25V3.5h-3v7.75a.25.25 0 01-.25.25h-1.5a.25.25 0 01-.25-.25V3.5H3v13H4.25a.75.75 0 010 1.5H1.75a.75.75 0 010-1.5H3V3.5H1.75A.75.75 0 011 2.75z" clipRule="evenodd" /></svg> },
  { label: "Kompaniyalar",   href: "/admin/companies",    icon: <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path fillRule="evenodd" d="M4 16.5v-13h-.25a.75.75 0 010-1.5h12.5a.75.75 0 010 1.5H16v13h.25a.75.75 0 010 1.5h-3.5a.75.75 0 01-.75-.75v-2.5a.75.75 0 00-.75-.75h-2.5a.75.75 0 00-.75.75v2.5a.75.75 0 01-.75.75h-3.5a.75.75 0 010-1.5H4z" clipRule="evenodd" /></svg> },
  { label: "Talabalar",      href: "/admin/students",     icon: <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z" /></svg> },
];

const ROLE_LABELS: Record<string, string> = {
  super_admin: "Super Admin", university_staff: "Universitet xodimi",
  company_mentor: "Kompaniya mentori", student: "Talaba",
};
const ROLE_COLORS: Record<string, string> = {
  super_admin: "bg-purple-100 text-purple-700", university_staff: "bg-green-100 text-green-700",
  company_mentor: "bg-amber-100 text-amber-700", student: "bg-blue-100 text-blue-700",
};

const TABS = [
  { key: "all", label: "Barchasi" }, { key: "super_admin", label: "Super Admin" },
  { key: "university_staff", label: "Universitet" }, { key: "company_mentor", label: "Mentor" },
  { key: "student", label: "Talaba" },
];

interface User { id: number; email: string; role: string; is_active: boolean; created_at: string }

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [toggling, setToggling] = useState<number | null>(null);
  const { toast } = useToast();

  const load = () => api.get<User[]>("/users").then(setUsers).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const visible = users
    .filter(u => activeTab === "all" || u.role === activeTab)
    .filter(u => !search || u.email.toLowerCase().includes(search.toLowerCase()));

  async function toggleActive(u: User) {
    setToggling(u.id);
    try {
      await api.patch(`/users/${u.id}`, { is_active: !u.is_active });
      load();
    } catch (e) { toast(e instanceof Error ? e.message : "Xatolik", "error"); }
    finally { setToggling(null); }
  }

  return (
    <DashboardShell nav={nav}>
      <div className="space-y-5">
        <PageHeader title="Foydalanuvchilar" subtitle="Tizim foydalanuvchilarini boshqarish" />

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {Object.entries(ROLE_LABELS).map(([role, label]) => {
            const count = users.filter(u => u.role === role).length;
            return (
              <div key={role} className={`rounded-xl border p-3 ${ROLE_COLORS[role]}`}>
                <p className="text-xl font-bold">{count}</p>
                <p className="text-xs font-medium opacity-80">{label}</p>
              </div>
            );
          })}
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <StatusTabs tabs={TABS} active={activeTab} onChange={setActiveTab} />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Email bo'yicha qidirish..."
            className="w-full max-w-xs rounded-lg border border-gray-300 px-3 py-1.5 text-sm outline-none focus:border-[#2563eb]" />
        </div>

        {/* Table */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-6 space-y-3">{[1,2,3,4].map(i => <div key={i} className="h-12 animate-pulse rounded bg-gray-100" />)}</div>
          ) : visible.length === 0 ? (
            <div className="p-6"><EmptyState message="Foydalanuvchilar topilmadi" /></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-100">
                <thead className="bg-gray-50">
                  <tr>
                    {["#", "Email", "Rol", "Holat", "Ro'yxatdan o'tgan", "Amal"].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {visible.map((u, i) => (
                    <tr key={u.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-400">{i + 1}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${ROLE_COLORS[u.role]}`}>
                            {u.email.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-sm font-medium text-gray-800">{u.email}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${ROLE_COLORS[u.role]}`}>
                          {ROLE_LABELS[u.role] ?? u.role}
                        </span>
                      </td>
                      <td className="px-4 py-3"><StatusBadge status={u.is_active} /></td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {new Date(u.created_at).toLocaleDateString("uz-UZ")}
                      </td>
                      <td className="px-4 py-3">
                        <button onClick={() => toggleActive(u)} disabled={toggling === u.id}
                          className={`rounded-lg px-2.5 py-1 text-xs font-medium transition disabled:opacity-50
                            ${u.is_active ? "border border-red-200 text-red-600 hover:bg-red-50" : "border border-green-200 text-green-600 hover:bg-green-50"}`}>
                          {toggling === u.id ? "..." : u.is_active ? "Bloklash" : "Faollashtirish"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}
