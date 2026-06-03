"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api";

function formatDisplayDate(d: string | null | undefined) {
  if (!d) return "—";
  const date = new Date(d);
  return date.toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function formatDateTime(d: string | null | undefined) {
  if (!d) return "—";
  const date = new Date(d);
  return (
    date.toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric" }) +
    " " +
    date.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })
  );
}

function academicYear(start: string, end: string) {
  const s = new Date(start).getFullYear();
  const e = new Date(end).getFullYear();
  if (s === e) return `${s}-${s + 1}-o'quv yili`;
  return `${s}-${e}-o'quv yili`;
}

function isActive(status: string, end: string) {
  return status === "accepted" && new Date(end) >= new Date();
}

interface Contract {
  id: number;
  contract_uuid: string;
  contract_number: string | null;
  contract_date: string | null;
  contract_pdf_path: string | null;
  internship_start: string;
  internship_end: string;
  status: string;
  created_at: string;
  university_name: string;
  rector_full_name: string | null;
  university_address: string | null;
  university_email: string | null;
  university_phone: string | null;
  university_inn: string | null;
  company_name: string;
  director_full_name: string | null;
  company_address: string | null;
  company_email: string | null;
  company_phone: string | null;
  company_inn: string | null;
}

export default function ContractViewPage() {
  const params = useParams();
  const uuid = params?.uuid as string;

  const [contract, setContract] = useState<Contract | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!uuid) return;
    fetch(`${BASE_URL}/contracts/${uuid}`)
      .then(async (r) => {
        if (!r.ok) {
          const b = await r.json().catch(() => ({}));
          throw new Error((b as { message?: string }).message ?? "Topilmadi");
        }
        return r.json() as Promise<Contract>;
      })
      .then(setContract)
      .catch((e) => setError(e instanceof Error ? e.message : "Xatolik"))
      .finally(() => setLoading(false));
  }, [uuid]);

  function copyUuid() {
    navigator.clipboard.writeText(uuid).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  const pdfUrl = `${BASE_URL}/contracts/${uuid}/pdf`;

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="text-sm text-gray-500">Yuklanmoqda...</div>
    </div>
  );

  if (error || !contract) return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="rounded-xl bg-white p-10 shadow text-center space-y-3">
        <div className="text-5xl">📄</div>
        <p className="font-semibold text-gray-700">Shartnoma topilmadi</p>
        <p className="text-sm text-gray-400">{error}</p>
      </div>
    </div>
  );

  const active = isActive(contract.status, contract.internship_end);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="mx-auto max-w-2xl space-y-4">

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm p-6 flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 text-gray-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Shartnoma Tafsilotlari</h1>
              <p className="text-sm text-gray-400 mt-0.5">{academicYear(contract.internship_start, contract.internship_end)}</p>
            </div>
          </div>
          <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
            active ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${active ? "bg-green-500" : "bg-gray-400"}`} />
            {active ? "Faol" : "Faol emas"}
          </span>
        </div>

        {/* Download button */}
        <a href={pdfUrl} download
          className="flex items-center justify-center gap-2 w-full rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 text-sm shadow-sm transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
          Shartnomani yuklab olish
        </a>

        {/* Main info */}
        <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
          <h2 className="text-sm font-bold text-gray-700">Asosiy Ma&apos;lumotlar</h2>

          <div className="grid grid-cols-2 gap-4 text-sm">
            {/* University */}
            <div className="col-span-2 sm:col-span-1 flex items-start gap-2">
              <div className="mt-0.5 text-gray-400 shrink-0">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21" />
                </svg>
              </div>
              <div>
                <p className="text-gray-400 text-xs mb-0.5">Ta&apos;lim muassasasi</p>
                <p className="font-semibold text-gray-800">{contract.university_name}</p>
              </div>
            </div>

            {/* Company */}
            <div className="col-span-2 sm:col-span-1 flex items-start gap-2">
              <div className="mt-0.5 text-gray-400 shrink-0">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
                </svg>
              </div>
              <div>
                <p className="text-gray-400 text-xs mb-0.5">Korxona</p>
                <p className="font-semibold text-gray-800">{contract.company_name}</p>
              </div>
            </div>

            {/* Dates row */}
            <div className="flex items-start gap-2">
              <div className="mt-0.5 text-gray-400 shrink-0">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                </svg>
              </div>
              <div>
                <p className="text-gray-400 text-xs mb-0.5">Boshlash sanasi</p>
                <p className="font-semibold text-gray-800">{formatDisplayDate(contract.internship_start)}</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <div className="mt-0.5 text-gray-400 shrink-0">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0121 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                </svg>
              </div>
              <div>
                <p className="text-gray-400 text-xs mb-0.5">Tugash sanasi</p>
                <p className="font-semibold text-gray-800">{formatDisplayDate(contract.internship_end)}</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <div className="mt-0.5 text-gray-400 shrink-0">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
                </svg>
              </div>
              <div>
                <p className="text-gray-400 text-xs mb-0.5">O&apos;quv yili</p>
                <p className="font-semibold text-gray-800">{academicYear(contract.internship_start, contract.internship_end)}</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <div className="mt-0.5 text-gray-400 shrink-0">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-gray-400 text-xs mb-0.5">Yaratilgan sana</p>
                <p className="font-semibold text-gray-800">{formatDateTime(contract.created_at)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional info */}
        <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
          <h2 className="text-sm font-bold text-gray-700">Qo&apos;shimcha Ma&apos;lumotlar</h2>

          <div className="divide-y divide-gray-100 text-sm">
            <div className="flex items-center justify-between py-2.5">
              <span className="text-gray-500">Shartnoma ID</span>
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-gray-700 text-xs">{uuid}</span>
                <button onClick={copyUuid} className="text-gray-400 hover:text-blue-500 transition-colors" title="Nusxa olish">
                  {copied ? (
                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between py-2.5">
              <span className="text-gray-500">O&apos;quv yili boshlanishi</span>
              <span className="font-semibold text-gray-800">{formatDisplayDate(contract.internship_start)}</span>
            </div>

            <div className="flex items-center justify-between py-2.5">
              <span className="text-gray-500">O&apos;quv yili tugashi</span>
              <span className="font-semibold text-gray-800">{formatDisplayDate(contract.internship_end)}</span>
            </div>

            <div className="flex items-center justify-between py-2.5">
              <span className="text-gray-500">O&apos;quv yili holati</span>
              <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                active ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${active ? "bg-green-500" : "bg-gray-400"}`} />
                {active ? "Faol" : "Faol emas"}
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
