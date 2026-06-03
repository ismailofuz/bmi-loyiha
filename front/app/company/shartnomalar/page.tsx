"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import DashboardShell from "@/components/DashboardShell";
import PageHeader from "@/components/PageHeader";
import EmptyState from "@/components/EmptyState";
import { api } from "@/lib/api";
import { useToast } from "@/components/ToastProvider";

const nav = [
  { label: "Bosh sahifa",  href: "/company",              icon: <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path fillRule="evenodd" d="M9.293 2.293a1 1 0 011.414 0l7 7A1 1 0 0117 11h-1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-3a1 1 0 00-1-1H9a1 1 0 00-1 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-6H3a1 1 0 01-.707-1.707l7-7z" clipRule="evenodd" /></svg> },
  { label: "Talabalarim",  href: "/company/students",     icon: <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z" /></svg> },
  { label: "Hisobotlar",   href: "/company/reports",      icon: <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" /></svg> },
  { label: "Shartnomalar", href: "/company/shartnomalar", icon: <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path fillRule="evenodd" d="M6 3.75A2.75 2.75 0 018.75 1h2.5A2.75 2.75 0 0114 3.75v.443c.572.055 1.14.122 1.706.2C17.053 4.582 18 5.75 18 7.07v3.469c0 1.126-.694 2.191-1.83 2.54-1.952.599-4.024.921-6.17.921s-4.219-.322-6.17-.921C2.694 12.73 2 11.665 2 10.539V7.07c0-1.321.947-2.489 2.294-2.676A41.047 41.047 0 016 4.193V3.75zm6.5 0v.325a41.622 41.622 0 00-5 0V3.75c0-.69.56-1.25 1.25-1.25h2.5c.69 0 1.25.56 1.25 1.25zM10 10a1 1 0 00-1 1v.01a1 1 0 001 1h.01a1 1 0 001-1V11a1 1 0 00-1-1H10z" clipRule="evenodd" /><path d="M3 15.055v-.684c.126.053.255.1.39.142 2.1.644 4.318.999 6.61.999 2.291 0 4.51-.355 6.61-.999.135-.041.264-.089.39-.142v.684c0 1.347-.985 2.53-2.363 2.686a41.454 41.454 0 01-9.274 0C3.985 17.585 3 16.402 3 15.055z" /></svg> },
  { label: "So'rovlar",    href: "/company/applications", icon: <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path fillRule="evenodd" d="M2 3.5A1.5 1.5 0 013.5 2h1.148a1.5 1.5 0 011.465 1.175l.716 3.223a1.5 1.5 0 01-1.052 1.767l-.933.267c-.41.117-.643.555-.48.95a11.542 11.542 0 006.254 6.254c.395.163.833-.07.95-.48l.267-.933a1.5 1.5 0 011.767-1.052l3.223.716A1.5 1.5 0 0118 15.352V16.5a1.5 1.5 0 01-1.5 1.5H15c-1.149 0-2.263-.15-3.326-.43A13.022 13.022 0 012.43 8.326 13.019 13.019 0 012 5V3.5z" clipRule="evenodd" /></svg> },
  { label: "Mentorlar",    href: "/company/mentors",      adminOnly: true, icon: <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" /></svg> },
];

const STATUS_LABEL: Record<string, string> = {
  pending:   "Kutilmoqda",
  accepted:  "Tasdiqlandi",
  cancelled: "Bekor qilindi",
};
const STATUS_STYLE: Record<string, string> = {
  pending:   "bg-yellow-100 text-yellow-700",
  accepted:  "bg-green-100 text-green-700",
  cancelled: "bg-gray-100 text-gray-600",
};

type Tab = "all" | "pending" | "accepted" | "cancelled";

interface Internship {
  id: number;
  status: string;
  university_id: number;
  university_name: string | null;
  supervisor_name: string | null;
  internship_start: string;
  internship_end: string;
  created_at: string;
  contract_uuid: string | null;
}

export default function ShartnomalarPage() {
  const [internships, setInternships] = useState<Internship[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("all");
  const [uniFilter, setUniFilter] = useState<string>("");

  const [respondTarget, setRespondTarget] = useState<{ item: Internship; action: "accepted" | "cancelled" } | null>(null);
  const [responding, setResponding] = useState(false);

  const { toast } = useToast();

  function load() {
    setLoading(true);
    api.get<Internship[]>("/internships").then(setInternships).finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  async function handleRespond() {
    if (!respondTarget) return;
    setResponding(true);
    try {
      await api.patch(`/internships/${respondTarget.item.id}/respond`, { status: respondTarget.action });
      toast(
        respondTarget.action === "accepted" ? "Shartnoma tasdiqlandi" : "Shartnoma rad etildi",
        "success"
      );
      setRespondTarget(null);
      load();
    } catch (e) {
      toast(e instanceof Error ? e.message : "Xatolik", "error");
    } finally {
      setResponding(false);
    }
  }

  // Shartnoma yuborgan universitetlar ro'yxati (filter uchun)
  const universities = Array.from(
    new Map(internships.filter(i => i.university_id).map(i => [i.university_id, i.university_name ?? `#${i.university_id}`])).entries()
  ).map(([id, name]) => ({ id, name }));

  const filtered = internships.filter(i =>
    (activeTab === "all" || i.status === activeTab) &&
    (!uniFilter || i.university_id === +uniFilter)
  );
  const fmt = (d: string) => new Date(d).toLocaleDateString("uz-UZ");

  const counts = {
    all:       internships.length,
    pending:   internships.filter(i => i.status === "pending").length,
    accepted:  internships.filter(i => i.status === "accepted").length,
    cancelled: internships.filter(i => i.status === "cancelled").length,
  };

  return (
    <DashboardShell nav={nav}>
      <div className="space-y-5">
        <PageHeader
          title="Shartnomalar"
          subtitle="Universitetlar bilan tuzilgan amaliyot shartnomalari"
        />

        {/* Tabs */}
        <div className="flex flex-wrap gap-2">
          {([
            { key: "all",       label: "Barchasi" },
            { key: "pending",   label: "Kutilmoqda" },
            { key: "accepted",  label: "Tasdiqlandi" },
            { key: "cancelled", label: "Bekor qilindi" },
          ] as const).map(t => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                activeTab === t.key
                  ? "bg-[#2563eb] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {t.label}
              <span className={`rounded-full px-1.5 py-0.5 text-xs font-bold ${activeTab === t.key ? "bg-white/20" : "bg-gray-200"}`}>
                {counts[t.key]}
              </span>
            </button>
          ))}
        </div>

        {/* Universitet bo'yicha filter */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-600">Universitet:</label>
          <select value={uniFilter} onChange={e => setUniFilter(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#2563eb] sm:w-80">
            <option value="">— Barchasi ({internships.length}) —</option>
            {universities.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
          </select>
        </div>

        {loading ? (
          <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-14 animate-pulse rounded-xl bg-gray-100" />)}</div>
        ) : filtered.length === 0 ? (
          <EmptyState message="Shartnomalar yo'q" sub="Universitetlar tomonidan yuborilgan shartnomalar bu yerda ko'rinadi" />
        ) : (
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-100">
                <thead className="bg-gray-50">
                  <tr>
                    {["#", "Shartnoma raqami", "Universitet", "Mas'ul hodim", "Boshlanish", "Tugash", "Holat", ""].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map((item, i) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-400">{i + 1}</td>
                      <td className="px-4 py-3">
                        {item.status === "accepted" ? (
                          <Link
                            href={`/company/analiyotlar/${item.id}`}
                            className="text-sm font-semibold text-[#2563eb] hover:underline"
                          >
                            #{item.id}
                          </Link>
                        ) : (
                          <span className="text-sm font-semibold text-gray-800">#{item.id}</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">{item.university_name ?? "—"}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{item.supervisor_name ?? "—"}</td>
                      <td className="px-4 py-3 text-xs text-gray-500">{fmt(item.internship_start)}</td>
                      <td className="px-4 py-3 text-xs text-gray-500">{fmt(item.internship_end)}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLE[item.status] ?? "bg-gray-100 text-gray-600"}`}>
                          {STATUS_LABEL[item.status] ?? item.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {item.contract_uuid && (
                            <Link
                              href={`/contracts/${item.contract_uuid}`}
                              className="rounded-lg border border-blue-200 px-2.5 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50"
                            >
                              Shartnoma
                            </Link>
                          )}
                          {item.status === "accepted" && (
                            <Link
                              href={`/company/analiyotlar/${item.id}`}
                              className="rounded-lg border border-gray-200 px-2.5 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100"
                            >
                              Ko'rish
                            </Link>
                          )}
                          {item.status === "pending" && (
                            <>
                              <button
                                onClick={() => setRespondTarget({ item, action: "accepted" })}
                                className="rounded-lg bg-green-500 px-2.5 py-1 text-xs font-semibold text-white hover:bg-green-600"
                              >
                                Qabul
                              </button>
                              <button
                                onClick={() => setRespondTarget({ item, action: "cancelled" })}
                                className="rounded-lg bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-600 hover:bg-red-200"
                              >
                                Rad
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Respond confirm */}
      {respondTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-base font-semibold text-gray-800 mb-2">
              {respondTarget.action === "accepted" ? "Shartnomani tasdiqlash" : "Shartnomani rad etish"}
            </h2>
            <p className="text-sm text-gray-600 mb-5">
              <strong>#{respondTarget.item.id}</strong> raqamli shartnomani{" "}
              {respondTarget.action === "accepted" ? "tasdiqlashni" : "rad etishni"} tasdiqlaysizmi?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setRespondTarget(null)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Bekor qilish
              </button>
              <button
                onClick={handleRespond}
                disabled={responding}
                className={`rounded-lg px-4 py-2 text-sm font-semibold text-white disabled:opacity-60 ${
                  respondTarget.action === "accepted" ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"
                }`}
              >
                {responding ? "..." : respondTarget.action === "accepted" ? "Tasdiqlash" : "Rad etish"}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
