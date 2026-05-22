import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#2563eb]/10">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-10 w-10 text-[#2563eb]">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h1 className="mb-2 text-6xl font-bold text-gray-200">404</h1>
      <p className="mb-1 text-lg font-semibold text-gray-700">Sahifa topilmadi</p>
      <p className="mb-6 text-sm text-gray-400">Siz qidirayotgan sahifa mavjud emas yoki o'chirilgan.</p>
      <Link href="/"
        className="inline-flex items-center gap-2 rounded-lg bg-[#2563eb] px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">
        <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4"><path fillRule="evenodd" d="M9.293 2.293a1 1 0 011.414 0l7 7A1 1 0 0117 11h-1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-3a1 1 0 00-1-1H9a1 1 0 00-1 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-6H3a1 1 0 01-.707-1.707l7-7z" clipRule="evenodd" /></svg>
        Bosh sahifaga qaytish
      </Link>
    </div>
  );
}
