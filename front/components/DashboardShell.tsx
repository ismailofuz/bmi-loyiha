"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { getUser, logout } from "@/lib/auth";
import type { JwtUser } from "@/lib/auth";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  adminOnly?: boolean;
}

interface Props {
  nav: NavItem[];
  children: React.ReactNode;
}

const roleLabel: Record<string, string> = {
  super_admin: "Super Admin",
  university_staff: "Universitet xodimi",
  company_mentor: "Kompaniya mentori",
  student: "Talaba",
};

const roleBadgeColor: Record<string, string> = {
  super_admin: "bg-purple-100 text-purple-700",
  university_staff: "bg-green-100 text-green-700",
  company_mentor: "bg-amber-100 text-amber-700",
  student: "bg-blue-100 text-blue-700",
};

export default function DashboardShell({ nav, children }: Props) {
  const [confirmLogout, setConfirmLogout] = useState(false);
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [user, setUser] = useState<JwtUser | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dateStr, setDateStr] = useState("");

  useEffect(() => {
    setUser(getUser());
    setDateStr(new Date().toLocaleDateString("uz-UZ", { weekday: "long", year: "numeric", month: "long", day: "numeric" }));
  }, []);

  const initials = user?.email?.slice(0, 2).toUpperCase() ?? "??";

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* ── Mobile overlay ────────────────────────────────────────── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── Sidebar ───────────────────────────────────────────────── */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-30 flex flex-col border-r border-gray-200 bg-white transition-all duration-200
          ${collapsed ? "w-16" : "w-60"}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Logo row */}
        <div className="flex h-14 items-center justify-between border-b border-gray-100 px-3">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#2563eb]">
                <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 text-white" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
              <span className="text-sm font-bold text-gray-900">Amaliyot Tizimi</span>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="ml-auto rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className={`h-4 w-4 transition-transform ${collapsed ? "rotate-180" : ""}`}>
              <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
          {nav.filter(item => !item.adminOnly || user?.isAdmin).map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                title={collapsed ? item.label : undefined}
                className={`
                  flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors
                  ${active
                    ? "bg-[#eff6ff] text-[#2563eb]"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }
                `}
              >
                <span className="shrink-0">{item.icon}</span>
                {!collapsed && <span className="truncate">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* User row */}
        <div className={`border-t border-gray-100 p-3 ${collapsed ? "flex justify-center" : ""}`}>
          {collapsed ? (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2563eb] text-xs font-bold text-white">
              {initials}
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#2563eb] text-xs font-bold text-white">
                {initials}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-gray-900">{user?.email}</p>
                <span className={`inline-block rounded-full px-1.5 py-0.5 text-[10px] font-medium ${roleBadgeColor[user?.role ?? ""]}`}>
                  {roleLabel[user?.role ?? ""] ?? user?.role}
                </span>
              </div>
              <button
                onClick={() => setConfirmLogout(true)}
                title="Chiqish"
                className="shrink-0 rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-red-500"
              >
                <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                  <path fillRule="evenodd" d="M3 4.25A2.25 2.25 0 015.25 2h5.5A2.25 2.25 0 0113 4.25v2a.75.75 0 01-1.5 0v-2a.75.75 0 00-.75-.75h-5.5a.75.75 0 00-.75.75v11.5c0 .414.336.75.75.75h5.5a.75.75 0 00.75-.75v-2a.75.75 0 011.5 0v2A2.25 2.25 0 0110.75 18h-5.5A2.25 2.25 0 013 15.75V4.25z" clipRule="evenodd" />
                  <path fillRule="evenodd" d="M6 10a.75.75 0 01.75-.75h9.546l-1.048-.943a.75.75 0 111.004-1.114l2.5 2.25a.75.75 0 010 1.114l-2.5 2.25a.75.75 0 11-1.004-1.114l1.048-.943H6.75A.75.75 0 016 10z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Logout confirm modal */}
      {confirmLogout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-red-100">
              <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 text-red-600">
                <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-base font-bold text-gray-900">Tizimdan chiqish</h3>
            <p className="mt-1 text-sm text-gray-500">Rostdan ham tizimdan chiqmoqchimisiz?</p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setConfirmLogout(false)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
              >
                Bekor qilish
              </button>
              <button
                onClick={logout}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
              >
                Chiqish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Main area ─────────────────────────────────────────────── */}
      <div className={`flex flex-1 flex-col overflow-hidden transition-all duration-200 ${collapsed ? "lg:pl-16" : "lg:pl-60"}`}>
        {/* Top bar */}
        <header className="flex h-14 shrink-0 items-center gap-3 border-b border-gray-200 bg-white px-4">
          <button
            onClick={() => setMobileOpen(true)}
            className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100 lg:hidden"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
              <path fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z" clipRule="evenodd" />
            </svg>
          </button>
          <div className="flex-1" />
          <span className="text-xs text-gray-400">{dateStr}</span>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
