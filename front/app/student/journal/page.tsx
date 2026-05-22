"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import DashboardShell from "@/components/DashboardShell";
import PageHeader from "@/components/PageHeader";
import EmptyState from "@/components/EmptyState";
import { api } from "@/lib/api";
import { getUser } from "@/lib/auth";
import { useToast } from "@/components/ToastProvider";

const nav = [
  { label: "Amaliyot", href: "/student", icon: <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path fillRule="evenodd" d="M9.293 2.293a1 1 0 011.414 0l7 7A1 1 0 0117 11h-1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-3a1 1 0 00-1-1H9a1 1 0 00-1 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-6H3a1 1 0 01-.707-1.707l7-7z" clipRule="evenodd" /></svg> },
  { label: "Kundalik", href: "/student/journal", icon: <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path d="M3 3.5A1.5 1.5 0 014.5 2h6.879a1.5 1.5 0 011.06.44l4.122 4.12A1.5 1.5 0 0117 7.622V16.5a1.5 1.5 0 01-1.5 1.5h-11A1.5 1.5 0 013 16.5v-13z" /></svg> },
  { label: "Haftalik hisobot", href: "/student/reports", icon: <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" /></svg> },
  { label: "Profil", href: "/student/profile", icon: <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-5.5-2.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zM10 12a5.99 5.99 0 00-4.793 2.39A6.483 6.483 0 0010 16.5a6.483 6.483 0 004.793-2.11A5.99 5.99 0 0010 12z" clipRule="evenodd" /></svg> },
];

const MOOD = [
  { key: "excellent", emoji: "🤩", label: "Ajoyib" },
  { key: "good",      emoji: "😊", label: "Yaxshi" },
  { key: "neutral",   emoji: "😐", label: "O'rtacha" },
  { key: "difficult", emoji: "😓", label: "Qiyin" },
  { key: "bad",       emoji: "😞", label: "Yomon" },
];

const MONTHS_UZ = ["Yanvar","Fevral","Mart","Aprel","May","Iyun","Iyul","Avgust","Sentabr","Oktabr","Noyabr","Dekabr"];
const WEEKDAYS_UZ = ["Du","Se","Ch","Pa","Ju","Sha","Ya"];

interface Entry { id: number; entry_date: string; content: string; mood: string; tasks_completed?: string; challenges?: string }

type FormState = { content: string; mood: string; tasks_completed: string; challenges: string };

function JournalContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [studentId, setStudentId] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState(() => searchParams.get("date") ?? new Date().toISOString().slice(0, 10));
  const [viewDate, setViewDate] = useState(() => new Date(selectedDate));
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const [form, setForm] = useState<FormState>({ content: "", mood: "good", tasks_completed: "", challenges: "" });
  const [editMode, setEditMode] = useState(false);

  const fetchEntries = useCallback((sid: number) => {
    api.get<Entry[]>(`/journal/student/${sid}`).then(setEntries).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const user = getUser();
    if (!user?.studentId) return;
    setStudentId(user.studentId);
    fetchEntries(user.studentId);
  }, [fetchEntries]);

  const selectedEntry = entries.find(e => e.entry_date === selectedDate);

  useEffect(() => {
    if (selectedEntry) {
      setForm({ content: selectedEntry.content, mood: selectedEntry.mood, tasks_completed: selectedEntry.tasks_completed ?? "", challenges: selectedEntry.challenges ?? "" });
      setEditMode(false);
    } else {
      setForm({ content: "", mood: "good", tasks_completed: "", challenges: "" });
      setEditMode(true);
    }
  }, [selectedEntry, selectedDate]);

  // Calendar helpers
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startOffset = firstDay === 0 ? 6 : firstDay - 1;
  const entryDates = new Set(entries.map(e => e.entry_date));
  const today = new Date().toISOString().slice(0, 10);

  async function handleSave() {
    if (!studentId || !form.content.trim()) return;
    setSaving(true);
    try {
      await api.post("/journal", { entry_date: selectedDate, ...form });
      fetchEntries(studentId);
      router.refresh();
    } catch (e) {
      toast(e instanceof Error ? e.message : "Xatolik", "error");
    } finally {
      setSaving(false);
    }
  }

  function prevMonth() { setViewDate(new Date(year, month - 1, 1)); }
  function nextMonth() { setViewDate(new Date(year, month + 1, 1)); }

  return (
    <DashboardShell nav={nav}>
      <div className="space-y-5">
        <PageHeader title="Amaliyot kundaligi" subtitle="Har kunlik ish faoliyatingizni yozing" />

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-5">
          {/* Calendar */}
          <div className="lg:col-span-2 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <button onClick={prevMonth} className="rounded-md p-1 hover:bg-gray-100">
                <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-gray-500"><path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" /></svg>
              </button>
              <span className="text-sm font-semibold text-gray-700">{MONTHS_UZ[month]} {year}</span>
              <button onClick={nextMonth} className="rounded-md p-1 hover:bg-gray-100">
                <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-gray-500"><path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" /></svg>
              </button>
            </div>
            <div className="mb-2 grid grid-cols-7 gap-1">
              {WEEKDAYS_UZ.map(d => <span key={d} className="text-center text-[10px] font-medium text-gray-400">{d}</span>)}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: startOffset }).map((_, i) => <span key={`e${i}`} />)}
              {Array.from({ length: daysInMonth }, (_, i) => {
                const d = i + 1;
                const key = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
                const hasEntry = entryDates.has(key);
                const isSelected = key === selectedDate;
                const isToday = key === today;
                return (
                  <button
                    key={key}
                    onClick={() => setSelectedDate(key)}
                    className={`relative flex h-8 w-full items-center justify-center rounded-lg text-xs font-medium transition
                      ${isSelected ? "bg-[#2563eb] text-white" : ""}
                      ${!isSelected && isToday ? "border border-[#2563eb] text-[#2563eb]" : ""}
                      ${!isSelected && !isToday ? "hover:bg-gray-100 text-gray-700" : ""}
                    `}
                  >
                    {d}
                    {hasEntry && !isSelected && <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-green-500" />}
                  </button>
                );
              })}
            </div>
            {/* Legend */}
            <div className="mt-3 flex gap-3 text-[10px] text-gray-400">
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-green-500" /> Yozilgan</span>
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-[#2563eb]" /> Tanlangan</span>
            </div>
          </div>

          {/* Entry form / view */}
          <div className="lg:col-span-3 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-700">
                {new Date(selectedDate + "T00:00:00").toLocaleDateString("uz-UZ", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
              </h3>
              {selectedEntry && !editMode && (
                <button onClick={() => setEditMode(true)} className="text-xs text-[#2563eb] hover:underline">Tahrirlash</button>
              )}
            </div>

            {loading ? (
              <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-10 animate-pulse rounded-lg bg-gray-100" />)}</div>
            ) : selectedEntry && !editMode ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{MOOD.find(m => m.key === selectedEntry.mood)?.emoji ?? "📝"}</span>
                  <span className="text-sm font-medium text-gray-600">{MOOD.find(m => m.key === selectedEntry.mood)?.label}</span>
                </div>
                <div>
                  <p className="mb-1 text-xs font-medium text-gray-500">Kundalik yozuv</p>
                  <p className="whitespace-pre-wrap text-sm text-gray-800">{selectedEntry.content}</p>
                </div>
                {selectedEntry.tasks_completed && (
                  <div>
                    <p className="mb-1 text-xs font-medium text-gray-500">Bajarilgan ishlar</p>
                    <p className="text-sm text-gray-800">{selectedEntry.tasks_completed}</p>
                  </div>
                )}
                {selectedEntry.challenges && (
                  <div>
                    <p className="mb-1 text-xs font-medium text-gray-500">Qiyinchiliklar</p>
                    <p className="text-sm text-gray-800">{selectedEntry.challenges}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <p className="mb-2 text-xs font-medium text-gray-600">Bugungi kayfiyat</p>
                  <div className="flex flex-wrap gap-2">
                    {MOOD.map(m => (
                      <button
                        key={m.key}
                        onClick={() => setForm(f => ({ ...f, mood: m.key }))}
                        className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition
                          ${form.mood === m.key ? "border-[#2563eb] bg-blue-50 text-[#2563eb]" : "border-gray-200 text-gray-500 hover:border-gray-300"}`}
                      >
                        <span>{m.emoji}</span> {m.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600">Kundalik yozuv *</label>
                  <textarea rows={4} value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                    placeholder="Bugun nima qildingiz? Qanday natijalar oldingiz?"
                    className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20 resize-none" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600">Bajarilgan ishlar</label>
                  <input type="text" value={form.tasks_completed} onChange={e => setForm(f => ({ ...f, tasks_completed: e.target.value }))}
                    placeholder="API integratsiya, kode review..."
                    className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600">Qiyinchiliklar</label>
                  <input type="text" value={form.challenges} onChange={e => setForm(f => ({ ...f, challenges: e.target.value }))}
                    placeholder="Uchrashaydigan muammolar..."
                    className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20" />
                </div>
                {selectedDate > today ? (
                  <p className="text-xs text-amber-600">Kelajakdagi sana uchun yozuv qo&apos;shib bo&apos;lmaydi.</p>
                ) : (
                  <button onClick={handleSave} disabled={saving || !form.content.trim()}
                    className="flex items-center gap-2 rounded-lg bg-[#2563eb] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1d4ed8] disabled:opacity-50">
                    {saving && <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>}
                    Saqlash
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* List of all entries */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-100 px-5 py-4">
            <h3 className="text-sm font-semibold text-gray-700">Barcha kundaliklar ({entries.length} ta)</h3>
          </div>
          {entries.length === 0 ? (
            <div className="p-6"><EmptyState message="Hali kundalik yozuvlari yo'q" sub="Birinchi yozuvingizni yuqoridagi kalendardan qo'shing" /></div>
          ) : (
            <div className="divide-y divide-gray-100">
              {entries.map(e => (
                <button key={e.id} onClick={() => { setSelectedDate(e.entry_date); setViewDate(new Date(e.entry_date + "T00:00:00")); }}
                  className="flex w-full items-center gap-4 px-5 py-3 text-left hover:bg-gray-50">
                  <span className="text-2xl">{MOOD.find(m => m.key === e.mood)?.emoji ?? "📝"}</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-gray-700">
                      {new Date(e.entry_date + "T00:00:00").toLocaleDateString("uz-UZ", { weekday: "short", year: "numeric", month: "short", day: "numeric" })}
                    </p>
                    <p className="truncate text-xs text-gray-500">{e.content}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}

export default function JournalPage() {
  return <Suspense><JournalContent /></Suspense>;
}
