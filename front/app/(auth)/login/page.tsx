"use client";

import Link from "next/link";

const roles = [
  {
    href: "/login/student",
    label: "Talaba",
    desc: "Talaba yoki bitiruvchi sifatida kirish",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-9 w-9">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 00-.491 6.347A48.62 48.62 0 0112 20.904a48.62 48.62 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.636 50.636 0 00-2.658-.813A59.906 59.906 0 0112 3.493a59.903 59.903 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
      </svg>
    ),
  },
  {
    href: "/login/university",
    label: "Ta'lim muassasasi",
    desc: "Ta'lim muassasasi sifatida kirish",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-9 w-9">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
      </svg>
    ),
  },
  {
    href: "/login/company",
    label: "Tashkilot",
    desc: "Korxona yoki xodim sifatida kirish",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-9 w-9">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
      </svg>
    ),
  },
];

export default function LoginRoleSelectPage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#eef2ff] px-4">

      {/* Decorative background blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 h-[500px] w-[500px] rounded-full bg-[#2563eb]/10 blur-3xl" />
        <div className="absolute -bottom-40 -right-20 h-[600px] w-[600px] rounded-full bg-[#2563eb]/10 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/40 blur-2xl" />
      </div>

      <div className="relative z-10 w-full max-w-3xl">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="mb-5 flex justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#2563eb] shadow-lg shadow-blue-500/30">
              <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7 text-white" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
          </div>
          <p className="text-sm font-medium text-[#2563eb]">Amaliyot boshqaruv tizimi</p>
          <h1 className="mt-2 text-3xl font-bold text-gray-900">Foydalanuvchi turini tanlang</h1>
          <p className="mt-2 text-sm text-gray-500">Talaba va ish beruvchilar uchun yagona platforma</p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {roles.map((r) => (
            <Link
              key={r.href}
              href={r.href}
              className="group relative flex flex-col gap-5 rounded-2xl border border-white/80 bg-white/70 p-6 shadow-sm backdrop-blur-sm transition-all duration-200 hover:-translate-y-1.5 hover:bg-[#2563eb] hover:shadow-xl hover:shadow-blue-500/25"
            >
              {/* Arrow */}
              <div className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-gray-400 transition-all duration-200 group-hover:bg-white/20 group-hover:text-white">
                <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                  <path fillRule="evenodd" d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z" clipRule="evenodd" />
                </svg>
              </div>

              {/* Icon box */}
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#dbeafe] text-[#2563eb] transition-all duration-200 group-hover:bg-white/20 group-hover:text-white">
                {r.icon}
              </div>

              {/* Text */}
              <div>
                <p className="text-base font-bold text-gray-900 transition-colors duration-200 group-hover:text-white">
                  {r.label}
                </p>
                <p className="mt-1 text-sm text-gray-500 transition-colors duration-200 group-hover:text-blue-100">
                  {r.desc}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
