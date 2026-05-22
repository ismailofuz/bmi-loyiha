"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { saveToken, decodeToken, ROLE_PATHS } from "@/lib/auth";

export default function CompanyLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await api.post<{ access_token: string }>("/auth/login", {
        email, password, role: "company_mentor",
      });
      saveToken(data.access_token);
      const user = decodeToken(data.access_token);
      router.push(user ? (ROLE_PATHS[user.role] ?? "/login") : "/login");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex w-full min-h-screen">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between bg-[#78350f] px-12 py-10 relative overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-white/5" />
        <div className="absolute -bottom-32 -right-16 w-[480px] h-[480px] rounded-full bg-white/5" />
        <div className="relative z-10 flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/20">
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-white" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <span className="text-xl font-bold text-white tracking-tight">Amaliyot Tizimi</span>
        </div>
        <div className="relative z-10 space-y-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-9 w-9 text-white">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-white leading-snug">Tashkilot kabineti</h2>
          <p className="text-amber-200 text-sm leading-relaxed max-w-xs">
            Talabalar amaliyotini tasdiqlang, mentorlarni boshqaring va hisobotlarni ko'ring.
          </p>
        </div>
        <p className="relative z-10 text-amber-300 text-xs">© 2026 Amaliyot Tizimi</p>
      </div>

      {/* Right panel */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 bg-white">
        <div className="w-full max-w-sm">
          <Link href="/login" className="mb-8 inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700">
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
              <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
            </svg>
            Orqaga
          </Link>

          <h1 className="text-2xl font-bold text-gray-900">Tashkilot tizimiga kirish</h1>
          <p className="mt-1 text-sm text-gray-500">Email va parolingizni kiriting</p>

          {error && (
            <div className="mt-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Email</label>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                placeholder="email@example.com" autoComplete="email"
                className="block w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-[#d97706] focus:ring-2 focus:ring-[#d97706]/10" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Parol</label>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} required value={password}
                  onChange={e => setPassword(e.target.value)} placeholder="••••••••" autoComplete="current-password"
                  className="block w-full rounded-xl border border-gray-300 px-4 py-2.5 pr-11 text-sm outline-none focus:border-[#d97706] focus:ring-2 focus:ring-[#d97706]/10" />
                <button type="button" onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword
                    ? <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path fillRule="evenodd" d="M3.28 2.22a.75.75 0 00-1.06 1.06l14.5 14.5a.75.75 0 101.06-1.06l-1.745-1.745a10.029 10.029 0 003.3-4.38 1.651 1.651 0 000-1.185A10.004 10.004 0 009.999 3a9.956 9.956 0 00-4.744 1.194L3.28 2.22zM7.752 6.69l1.092 1.092a2.5 2.5 0 013.374 3.373l1.091 1.092a4 4 0 00-5.557-5.557z" clipRule="evenodd" /><path d="M10.748 13.93l2.523 2.523a9.987 9.987 0 01-3.27.547c-4.258 0-7.894-2.66-9.337-6.41a1.651 1.651 0 010-1.186A10.007 10.007 0 012.839 6.02L6.07 9.252a4 4 0 004.678 4.678z" /></svg>
                    : <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" /><path fillRule="evenodd" d="M.664 10.59a1.651 1.651 0 010-1.186A10.004 10.004 0 0110 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0110 17c-4.257 0-7.893-2.66-9.336-6.41zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" /></svg>
                  }
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="mt-2 w-full rounded-xl bg-[#d97706] py-2.5 text-sm font-semibold text-white hover:bg-amber-700 disabled:opacity-60 transition-colors">
              {loading ? "Kirilmoqda..." : "Kirish"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
