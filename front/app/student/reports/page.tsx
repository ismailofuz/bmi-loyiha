"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import DashboardShell from "@/components/DashboardShell";
import { api } from "@/lib/api";
import { getUser } from "@/lib/auth";
import { useToast } from "@/components/ToastProvider";

/* --- Navigation -------------------------------------------------- */
const nav = [
  {
    label: "Amaliyot",
    href: "/student",
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
        <path
          fillRule="evenodd"
          d="M9.293 2.293a1 1 0 011.414 0l7 7A1 1 0 0117 11h-1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-3a1 1 0 00-1-1H9a1 1 0 00-1 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-6H3a1 1 0 01-.707-1.707l7-7z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  {
    label: "Amaliyotim",
    href: "/student/amaliyot",
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
        <path
          fillRule="evenodd"
          d="M6 3.75A2.75 2.75 0 018.75 1h2.5A2.75 2.75 0 0114 3.75v.443c.572.055 1.14.122 1.706.2C17.053 4.582 18 5.75 18 7.07v3.469c0 1.126-.694 2.191-1.83 2.54-1.952.599-4.024.921-6.17.921s-4.219-.322-6.17-.921C2.694 12.73 2 11.665 2 10.539V7.07c0-1.321.947-2.489 2.294-2.676A41.047 41.047 0 016 4.193V3.75zm6.5 0v.325a41.622 41.622 0 00-5 0V3.75c0-.69.56-1.25 1.25-1.25h2.5c.69 0 1.25.56 1.25 1.25zM10 10a1 1 0 00-1 1v.01a1 1 0 001 1h.01a1 1 0 001-1V11a1 1 0 00-1-1H10z"
          clipRule="evenodd"
        />
        <path d="M3 15.055v-.684c.126.053.255.1.39.142 2.1.644 4.318.999 6.61.999 2.291 0 4.51-.355 6.61-.999.135-.041.264-.089.39-.142v.684c0 1.347-.985 2.53-2.363 2.686a41.454 41.454 0 01-9.274 0C3.985 17.585 3 16.402 3 15.055z" />
      </svg>
    ),
  },
  {
    label: "Hisobotlar",
    href: "/student/reports",
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
        <path
          fillRule="evenodd"
          d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  {
    label: "Profil",
    href: "/student/profile",
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
        <path
          fillRule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-5.5-2.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zM10 12a5.99 5.99 0 00-4.793 2.39A6.483 6.483 0 0010 16.5a6.483 6.483 0 004.793-2.11A5.99 5.99 0 0010 12z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
];

/* --- Constants --------------------------------------------------- */
const ALLOWED_EXT = [".pdf", ".docx", ".doc", ".pptx", ".ppt"];
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const CONTENT_MAX = 1000;
const BACKEND =
  process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") ?? "http://localhost:3001";

const DAYS_UZ = [
  "Yakshanba",
  "Dushanba",
  "Seshanba",
  "Chorshanba",
  "Payshanba",
  "Juma",
  "Shanba",
];
const MONTHS_UZ = [
  "Yanvar",
  "Fevral",
  "Mart",
  "Aprel",
  "May",
  "Iyun",
  "Iyul",
  "Avgust",
  "Sentabr",
  "Oktabr",
  "Noyabr",
  "Dekabr",
];

/* --- Types ------------------------------------------------------- */
interface Report {
  id: number;
  report_date: string | null;
  week_number: number | null;
  content: string;
  status: string;
  grade: number | null;
  location: string | null;
  file_url: string | null;
  file_name: string | null;
  reviewer_feedback: string | null;
  reviewed_at: string | null;
}

interface AttendanceRecord {
  id: number;
  date: string;
  is_present: boolean;
  grade: number | null;
  note: string | null;
}

interface InternshipAssignment {
  id: number;
  status: string;
  internship_start: string | null;
  internship_end: string | null;
}

interface DayEntry {
  date: string;
  dayName: string;
  report: Report | undefined;
  attendance: AttendanceRecord | undefined;
}

/* --- Helpers ----------------------------------------------------- */
function fileExt(name: string) {
  return name.split(".").pop()?.toLowerCase() ?? "";
}

function parseDate(dateStr: string): Date {
  return new Date(dateStr.slice(0, 10) + "T00:00:00");
}

function formatDateUz(dateStr: string) {
  const d = parseDate(dateStr);
  return `${d.getDate()} ${MONTHS_UZ[d.getMonth()] ?? ""} ${d.getFullYear()}`;
}

function formatCardDate(dateStr: string) {
  const d = parseDate(dateStr);
  const day = String(d.getDate()).padStart(2, "0");
  const month = MONTHS_UZ[d.getMonth()] ?? "";
  return `${day} ${month} ${d.getFullYear()}`;
}

function toDateStr(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/** Lokatsiya satridan koordinata ajratib oladi (maps URL yoki "lat,lng") */
function parseLatLng(loc: string | null | undefined): { lat: number; lng: number } | null {
  if (!loc) return null;
  const m = loc.match(/(-?\d{1,3}\.\d+)[,\s]+(-?\d{1,3}\.\d+)/);
  if (!m) return null;
  const lat = parseFloat(m[1]);
  const lng = parseFloat(m[2]);
  if (Number.isNaN(lat) || Number.isNaN(lng)) return null;
  return { lat, lng };
}

function generateDays(
  start: string,
  end: string,
  reports: Report[],
  attendance: AttendanceRecord[],
): DayEntry[] {
  const startDate = new Date(start + "T00:00:00");
  const endDate = new Date(end + "T00:00:00");
  const days: DayEntry[] = [];

  // Amaliyotning butun davri (kelajak kunlar ham) — har kun bitta card
  const cur = new Date(startDate);
  while (cur <= endDate) {
    const dateStr = toDateStr(cur);
    days.push({
      date: dateStr,
      dayName: DAYS_UZ[cur.getDay()],
      report: reports.find((r) => (r.report_date ?? "").slice(0, 10) === dateStr),
      attendance: attendance.find((a) => (a.date ?? "").slice(0, 10) === dateStr),
    });
    cur.setDate(cur.getDate() + 1);
  }

  return days.reverse(); // newest first
}

/* --- Attendance badge -------------------------------------------- */
function AttendanceBadge({
  attendance,
}: {
  attendance: AttendanceRecord | undefined;
}) {
  if (!attendance) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-500">
        <span className="h-1.5 w-1.5 rounded-full bg-gray-400" />
        Davomat qilinmagan
      </span>
    );
  }
  if (attendance.is_present) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-[11px] font-medium text-green-700">
        <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
        Qatnashgan
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-[11px] font-medium text-red-700">
      <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
      Kelmagan
    </span>
  );
}

function cardBorderColor(day: DayEntry): string {
  if (!day.attendance) return "border-l-gray-300";
  return day.attendance.is_present ? "border-l-blue-500" : "border-l-red-400";
}

/* --- Day Card ---------------------------------------------------- */
interface DayCardProps {
  day: DayEntry;
  today: string;
  onOpen: (day: DayEntry) => void;
}

function DayCard({ day, today, onOpen }: DayCardProps) {
  const isToday = day.date === today;
  const isPast = day.date < today;
  const isFuture = day.date > today;
  const hasReport = !!day.report;
  const rejected = day.report?.status === "rejected";
  const approved = day.report?.status === "approved";
  const editable = !approved && (isToday || rejected);

  return (
    <div
      className={`rounded-xl border bg-white shadow-sm overflow-hidden ${
        isToday
          ? "border-[#2563eb] ring-2 ring-[#2563eb]/30"
          : isFuture
          ? "border-gray-200 opacity-70"
          : "border-gray-200"
      } border-l-4 ${cardBorderColor(day)}`}
    >
      {/* Card header */}
      <div
        className={`flex items-center justify-between px-4 py-3 ${isToday ? "bg-blue-50" : "bg-gray-50"}`}
      >
        <div className="flex items-center gap-2">
          <svg
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-4 w-4 shrink-0 text-gray-400"
          >
            <path
              fillRule="evenodd"
              d="M5.75 2a.75.75 0 01.75.75V4h7V2.75a.75.75 0 011.5 0V4h.25A2.75 2.75 0 0118 6.75v8.5A2.75 2.75 0 0115.25 18H4.75A2.75 2.75 0 012 15.25v-8.5A2.75 2.75 0 014.75 4H5V2.75A.75.75 0 015.75 2zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75z"
              clipRule="evenodd"
            />
          </svg>
          <div>
            <p className="text-xs font-semibold text-gray-800">
              {formatCardDate(day.date)}
            </p>
            <p className="text-[11px] text-gray-500">
              {day.dayName}
              {isToday && <span className="ml-1 font-bold text-[#2563eb]">· Bugun</span>}
            </p>
          </div>
        </div>
        <AttendanceBadge attendance={day.attendance} />
      </div>

      {/* Card body */}
      <div className="flex items-center justify-between gap-2 px-4 py-3">
        <div className="flex items-center gap-3 min-w-0">
          {/* File info */}
          <span className="flex items-center gap-1 text-[11px] text-gray-500">
            <svg
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-3.5 w-3.5 shrink-0 text-gray-400"
            >
              <path
                fillRule="evenodd"
                d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                clipRule="evenodd"
              />
            </svg>
            {day.report?.file_name ? (
              <span className="truncate max-w-[80px]">
                {day.report.file_name}
              </span>
            ) : (
              "Fayl yo’q"
            )}
          </span>

          {/* Report baho / status */}
          {day.report?.status === "approved" && day.report.grade != null ? (
            <span className="flex items-center gap-0.5 text-[11px] font-semibold text-green-600">
              <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
                <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z" clipRule="evenodd" />
              </svg>
              {day.report.grade}/5
            </span>
          ) : day.report?.status === "rejected" ? (
            <span className="text-[11px] font-medium text-red-500">Rad etilgan</span>
          ) : day.report?.status === "submitted" ? (
            <span className="text-[11px] text-blue-500">Tekshiruvda</span>
          ) : (
            <span className="text-[11px] text-gray-400">Baholanmagan</span>
          )}
        </div>

        {/* Action — faqat bugun yoki rad etilgan tahrirlanadi */}
        {editable ? (
          hasReport ? (
            <div
              role="button"
              tabIndex={0}
              onClick={() => onOpen(day)}
              onKeyDown={(e) => e.key === "Enter" && onOpen(day)}
              className={`cursor-pointer text-xs font-semibold shrink-0 ${rejected ? "text-red-600 hover:underline" : "text-[#2563eb] hover:underline"}`}
            >
              {rejected ? "Qayta yuborish" : "O'zgartirish"}
            </div>
          ) : (
            <div
              role="button"
              tabIndex={0}
              onClick={() => onOpen(day)}
              onKeyDown={(e) => e.key === "Enter" && onOpen(day)}
              className="cursor-pointer rounded-lg bg-[#2563eb] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#1d4ed8] shrink-0"
            >
              Hisobot yozish
            </div>
          )
        ) : hasReport ? (
          <div
            role="button"
            tabIndex={0}
            onClick={() => onOpen(day)}
            onKeyDown={(e) => e.key === "Enter" && onOpen(day)}
            className="cursor-pointer text-xs font-medium text-gray-500 hover:underline shrink-0"
          >
            Ko&apos;rish
          </div>
        ) : (
          <span className="text-[11px] font-medium text-gray-400 shrink-0">
            {isPast ? "O'tkazib yuborilgan" : "Vaqti kelmagan"}
          </span>
        )}
      </div>
    </div>
  );
}

/* --- Report Form View -------------------------------------------- */
interface FormViewProps {
  day: DayEntry;
  today: string;
  onBack: () => void;
  onSaved: () => void;
}

function ReportFormView({ day, today, onBack, onSaved }: FormViewProps) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [content, setContent] = useState(day.report?.content ?? "");
  const [location, setLocation] = useState(day.report?.location ?? "");
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState("");
  const [geoLoading, setGeoLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [checkedInNow, setCheckedInNow] = useState(false);

  const isToday = day.date === today;
  const isEdit = !!day.report;
  const rejected = day.report?.status === "rejected";
  const approved = day.report?.status === "approved";
  const editable = !approved && (isToday || rejected);
  const presentToday = !!day.attendance?.is_present || checkedInNow;
  const remaining = CONTENT_MAX - content.length;

  // Belgilangan manzil: report.location yoki check-in (attendance) izohidan
  const locValue = location || (day.attendance?.note?.replace(/^Lokatsiya:\s*/, "") ?? "");
  const coords = parseLatLng(locValue);
  const mapSrc = coords
    ? `https://yandex.uz/map-widget/v1/?ll=${coords.lng}%2C${coords.lat}&z=16&pt=${coords.lng}%2C${coords.lat},pm2rdm`
    : null;

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    setFileError("");
    if (!f) {
      setFile(null);
      return;
    }
    const ext = "." + fileExt(f.name);
    if (!ALLOWED_EXT.includes(ext)) {
      setFileError("Faqat PDF, DOCX, DOC, PPTX yoki PPT fayl yuklanadi");
      setFile(null);
      e.target.value = "";
      return;
    }
    if (f.size > MAX_FILE_SIZE) {
      setFileError("Fayl 5 MB dan katta bo’lmasin");
      setFile(null);
      e.target.value = "";
      return;
    }
    setFile(f);
  }

  async function checkIn(loc: string) {
    try {
      await api.post("/attendance/check-in", { location: loc });
      setCheckedInNow(true);
      toast("Bugungi kelganingiz tasdiqlandi (check-in)", "success");
    } catch (e) {
      toast(e instanceof Error ? e.message : "Check-in xatolik", "error");
    }
  }

  function handleGeo() {
    if (!navigator.geolocation) {
      // Geolokatsiya bo'lmasa ham oddiy check-in qilamiz
      setLocation("Amaliyot joyi");
      checkIn("Amaliyot joyi");
      return;
    }
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        const loc = `https://maps.google.com/?q=${lat},${lng}`;
        setLocation(loc);
        setGeoLoading(false);
        checkIn(loc);
      },
      () => {
        // Ruxsat berilmasa ham check-in qilamiz (lokatsiyasiz)
        setGeoLoading(false);
        setLocation("Amaliyot joyi");
        checkIn("Amaliyot joyi");
      },
    );
  }

  async function handleSave() {
    if (!content.trim()) return;
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("report_date", day.date);
      fd.append("content", content);
      if (location.trim()) fd.append("location", location.trim());
      if (file) fd.append("file", file);

      if (isEdit && day.report) {
        // Rad etilgan hisobot tahrirlangach avtomatik qayta yuboriladi
        const resubmit = day.report.status === "rejected";
        await api.patch(`/reports/${day.report.id}`, {
          content,
          location: location.trim() || null,
          ...(resubmit ? { status: "submitted" } : {}),
        });
        toast(resubmit ? "Hisobot qayta yuborildi" : "Hisobot saqlandi", "success");
      } else {
        await api.postForm("/reports", fd);
        toast("Hisobot yuborildi", "success");
      }

      onSaved();
    } catch (e) {
      toast(e instanceof Error ? e.message : "Xatolik", "error");
    } finally {
      setSaving(false);
    }
  }

  async function handleSubmit() {
    if (!day.report) return;
    setSaving(true);
    try {
      await api.patch(`/reports/${day.report.id}`, { status: "submitted" });
      toast("Hisobot topshirildi", "success");
      onSaved();
    } catch (e) {
      toast(e instanceof Error ? e.message : "Xatolik", "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          <svg
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-4 w-4"
          >
            <path
              fillRule="evenodd"
              d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z"
              clipRule="evenodd"
            />
          </svg>
          Hisobotlar
        </button>
        <div className="h-4 w-px bg-gray-300" />
        <div className="flex items-center gap-2">
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-gray-400">
            <path fillRule="evenodd" d="M5.75 2a.75.75 0 01.75.75V4h7V2.75a.75.75 0 011.5 0V4h.25A2.75 2.75 0 0118 6.75v8.5A2.75 2.75 0 0115.25 18H4.75A2.75 2.75 0 012 15.25v-8.5A2.75 2.75 0 014.75 4H5V2.75A.75.75 0 015.75 2zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75z" clipRule="evenodd" />
          </svg>
          <p className="text-sm font-semibold text-gray-800">
            {formatDateUz(day.date)}
            <span className="ml-2 font-normal text-gray-500">{day.dayName}</span>
          </p>
        </div>
      </div>

      {/* Mentor bahosi / status banner */}
      {day.report?.status === "approved" && (
        <div className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
          <span className="font-semibold">✓ Tasdiqlangan</span>
          {day.report.grade != null && (
            <span className="ml-1 rounded-full bg-green-600 px-2 py-0.5 text-xs font-bold text-white">
              Baho: {day.report.grade}/5
            </span>
          )}
          {day.report.reviewer_feedback && (
            <span className="ml-2 text-green-700">— {day.report.reviewer_feedback}</span>
          )}
        </div>
      )}
      {day.report?.status === "rejected" && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          <p className="font-semibold">✗ Rad etildi — tahrirlab qayta yuboring</p>
          {day.report.reviewer_feedback && (
            <p className="mt-1 text-red-700">Mentor izohi: {day.report.reviewer_feedback}</p>
          )}
        </div>
      )}
      {day.report?.status === "submitted" && (
        <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm text-blue-800">
          ⏳ Mentor baholashini kutmoqda
        </div>
      )}

      {/* Bugun keldim — check-in tasdiqlangan */}
      {isToday && presentToday && (
        <div className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-800">
          ✓ Bugun amaliyotga kelganingiz belgilandi
        </div>
      )}

      {/* Today geo banner — men keldim */}
      {isToday && !presentToday && (
        <div className="flex flex-col gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-2.5">
            <svg
              viewBox="0 0 20 20"
              fill="currentColor"
              className="mt-0.5 h-4 w-4 shrink-0 text-amber-500"
            >
              <path
                fillRule="evenodd"
                d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <p className="text-sm font-semibold text-amber-800">
                Bugun amaliyotga keldingizmi?
              </p>
              <p className="text-xs text-amber-700">
                Davomat uchun &quot;Bugun keldim&quot; tugmasini bosing.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleGeo}
            disabled={geoLoading}
            className="flex shrink-0 items-center gap-1.5 rounded-lg border border-amber-300 bg-white px-3 py-1.5 text-sm font-medium text-amber-700 hover:bg-amber-50 disabled:opacity-50"
          >
            {geoLoading ? (
              <svg
                className="h-4 w-4 animate-spin"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                />
              </svg>
            ) : (
              <svg
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-4 w-4"
              >
                <path
                  fillRule="evenodd"
                  d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.976.544l.062.029.018.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            Bugun keldim
          </button>
        </div>
      )}

      {/* Belgilangan manzil — matn + vizual xarita */}
      {locValue && (
        <div className="overflow-hidden rounded-xl border border-green-200 bg-green-50">
          <div className="flex items-center gap-2 px-3 py-2 text-xs text-green-700">
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5 shrink-0">
              <path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.976.544l.062.029.018.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" clipRule="evenodd" />
            </svg>
            <span className="truncate font-medium">Belgilangan manzil</span>
            {coords && (
              <a href={`https://yandex.uz/maps/?ll=${coords.lng},${coords.lat}&z=16&pt=${coords.lng},${coords.lat}`}
                target="_blank" rel="noreferrer" className="ml-auto shrink-0 text-green-700 underline">
                Xaritada ochish
              </a>
            )}
            {editable && (
              <button type="button" onClick={() => setLocation("")}
                className={`shrink-0 text-green-600 hover:text-green-800 ${coords ? "ml-3" : "ml-auto"}`}>
                &times;
              </button>
            )}
          </div>
          {mapSrc ? (
            <iframe
              src={mapSrc}
              title="Lokatsiya xaritasi"
              className="h-52 w-full border-0"
              loading="lazy"
            />
          ) : (
            <p className="px-3 pb-2 text-xs text-green-700 break-all">{locValue}</p>
          )}
        </div>
      )}

      {/* Main form card */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm space-y-5">
        {/* Content */}
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-gray-700">
            Bajarilgan ishlar{" "}
            <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={8}
            value={content}
            maxLength={CONTENT_MAX}
            disabled={!editable}
            onChange={(e) => setContent(e.target.value)}
            placeholder={`Bugun qanday ishlarni bajardingiz? Qanday natijalar olindingiz? Qanday muammolar bo'ldi?\n\nMisol:\n• Loyihaning login sahifasini yaratdim\n• API integration qildim\n• Team bilan code review o'tkazdik`}
            className="block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20 resize-none leading-relaxed disabled:bg-gray-50 disabled:text-gray-600"
          />
          <div className="mt-1.5 flex items-center justify-between">
            <p className="text-[11px] text-gray-400">
              ✓ Bajargan ishlaringiz haqida batafsil yozing
            </p>
            <p
              className={`text-[11px] ${remaining < 50 ? "text-red-500" : "text-gray-400"}`}
            >
              {content.length}/{CONTENT_MAX}
            </p>
          </div>
        </div>

        {/* File upload */}
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-gray-700">
            Hisobot fayli{" "}
            <span className="text-gray-400 font-normal">(ixtiyoriy)</span>
          </label>

          {/* Existing file link */}
          {day.report?.file_url && day.report?.file_name && !file && (
            <div className="mb-2 flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-600">
              <svg
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-4 w-4 text-gray-400"
              >
                <path
                  fillRule="evenodd"
                  d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                  clipRule="evenodd"
                />
              </svg>
              <a
                href={`${BACKEND}${day.report.file_url}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 truncate text-[#2563eb] hover:underline"
              >
                {day.report.file_name}
              </a>
            </div>
          )}

          {editable && (
          <label className="flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 px-4 py-6 text-center transition hover:border-[#2563eb] hover:bg-blue-50">
            {file ? (
              <>
                <svg
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-6 w-6 text-[#2563eb]"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm font-medium text-[#2563eb]">
                  {file.name}
                </span>
                <span className="text-xs text-gray-400">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </span>
              </>
            ) : (
              <>
                <svg
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-6 w-6 text-gray-400"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm font-medium text-gray-600">
                  Faylni yuklash uchun bosing
                </span>
                <span className="text-xs text-gray-400">
                  PDF, DOC, DOCX formatlarida. Maksimal hajm: 5MB
                </span>
              </>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,.doc,.pptx,.ppt"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
          )}

          {file && (
            <button
              type="button"
              onClick={() => {
                setFile(null);
                setFileError("");
                if (fileInputRef.current) fileInputRef.current.value = "";
              }}
              className="mt-1.5 text-xs text-red-500 hover:text-red-700"
            >
              Faylni o&apos;chirish
            </button>
          )}

          <p className="mt-1.5 text-xs text-gray-400">
            📎 PDF, Word, yoki rasm yuklay olasiz (max 5MB) — Screenshot,
            diagramma, kod namunalari...
          </p>
          {fileError && (
            <p className="mt-1 text-xs text-red-600">{fileError}</p>
          )}
        </div>
      </div>

      {/* Action row */}
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={onBack}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
        >
          {editable ? "Bekor qilish" : "Orqaga"}
        </button>

        <div className="flex gap-2">
          <button
            onClick={handleSave}
            disabled={!editable || saving || !content.trim() || !!fileError || content.length > CONTENT_MAX}
            className="rounded-lg bg-[#2563eb] px-5 py-2 text-sm font-semibold text-white hover:bg-[#1d4ed8] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? "Saqlanmoqda..." : rejected ? "Qayta yuborish" : "Saqlash va yuborish"}
          </button>
          {editable && isEdit && day.report?.status === "draft" && (
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="rounded-lg border border-[#2563eb] px-5 py-2 text-sm font-semibold text-[#2563eb] hover:bg-blue-50 disabled:opacity-50"
            >
              Yuborish
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* --- Main Page --------------------------------------------------- */
export default function ReportsPage() {
  const { toast } = useToast();

  const [reports, setReports] = useState<Report[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [studentId, setStudentId] = useState<number | null>(null);
  const [internshipStart, setInternshipStart] = useState<string | null>(null);
  const [internshipEnd, setInternshipEnd] = useState<string | null>(null);

  /** "grid" | "form" */
  const [view, setView] = useState<"grid" | "form">("grid");
  const [activeDay, setActiveDay] = useState<DayEntry | null>(null);

  // MUHIM: mahalliy sana (toISOString UTC bo'lgani uchun ertalab/kechqurun
  // soat farqida bir kun teskari chiqib ketadi).
  const today = toDateStr(new Date());

  const loadData = useCallback(async (sid: number) => {
    setLoading(true);
    try {
      // Load reports
      const rpts = await api.get<Report[]>(`/reports/student/${sid}`);
      setReports(rpts);

      // Load internship assignment for date range + attendance
      try {
        const assignments =
          await api.get<InternshipAssignment[]>("/internship-students/my");
        const accepted = assignments.find((a) => a.status === "accepted");
        if (accepted?.internship_start) {
          setInternshipStart(accepted.internship_start.slice(0, 10));
          setInternshipEnd(
            accepted.internship_end
              ? accepted.internship_end.slice(0, 10)
              : today,
          );

          const att = await api.get<AttendanceRecord[]>(
            `/attendance/internship-student/${accepted.id}`,
          );
          setAttendance(att);
        }
      } catch {
        // No assignment found — attendance will be empty
      }
    } catch (e) {
      toast(e instanceof Error ? e.message : "Ma’lumotlarni yuklashda xatolik", "error");
    } finally {
      setLoading(false);
    }
  }, [today, toast]);

  useEffect(() => {
    const user = getUser();
    const sid = user?.studentId ?? user?.sub;
    if (!sid) {
      setLoading(false);
      return;
    }
    setStudentId(sid);
    loadData(sid);
  }, [loadData]);

  const days: DayEntry[] =
    internshipStart
      ? generateDays(internshipStart, internshipEnd ?? today, reports, attendance)
      : [];

  // Sanalar ketma-ketligi: boshidan oxirigacha (oshish bo'yicha). Bugungi card
  // highlight qilingani uchun oson topiladi.
  const orderedDays = [...days].sort((a, b) => a.date.localeCompare(b.date));

  function openDay(day: DayEntry) {
    setActiveDay(day);
    setView("form");
  }

  function handleSaved() {
    setView("grid");
    setActiveDay(null);
    if (studentId) loadData(studentId);
  }

  return (
    <DashboardShell nav={nav}>
      {view === "form" && activeDay ? (
        <ReportFormView
          day={activeDay}
          today={today}
          onBack={() => {
            setView("grid");
            setActiveDay(null);
          }}
          onSaved={handleSaved}
        />
      ) : (
        <div className="space-y-5">
          {/* Page header */}
          <div className="flex items-center justify-between gap-3">
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Hisobotlar
              </h1>
              <p className="mt-0.5 text-sm text-gray-500">
                Jami {days.length} ta kun · kundalikni PDF qilib yuklab oling
              </p>
            </div>
            {days.length > 0 && (
              <button
                onClick={async () => {
                  if (!studentId) return;
                  try {
                    await api.download(`/reports/student/${studentId}/diary.pdf`, `kundalik-${studentId}.pdf`);
                  } catch (e) {
                    toast(e instanceof Error ? e.message : "Yuklab olishda xatolik", "error");
                  }
                }}
                className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-sm font-medium text-gray-600 shadow-sm hover:bg-gray-50"
              >
                <svg
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-4 w-4 text-gray-400"
                >
                  <path d="M10.75 2.75a.75.75 0 00-1.5 0v8.614L6.295 8.235a.75.75 0 10-1.09 1.03l4.25 4.5a.75.75 0 001.09 0l4.25-4.5a.75.75 0 00-1.09-1.03l-2.955 3.129V2.75z" />
                  <path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" />
                </svg>
                Kundalikni PDF yuklab olish
              </button>
            )}
          </div>

          {/* Grid */}
          {loading ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div
                  key={i}
                  className="h-28 animate-pulse rounded-xl bg-gray-100"
                />
              ))}
            </div>
          ) : days.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 py-16 text-center">
              <svg
                viewBox="0 0 48 48"
                fill="none"
                className="mb-3 h-12 w-12 text-gray-300"
              >
                <rect
                  x="6"
                  y="8"
                  width="36"
                  height="36"
                  rx="4"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="M16 4v8M32 4v8M6 20h36"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              <p className="text-sm font-semibold text-gray-500">
                Amaliyot topilmadi
              </p>
              <p className="mt-1 text-xs text-gray-400">
                Tasdiqlangan amaliyot mavjud bo&apos;lsa kundalik ko&apos;rinadi
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {orderedDays.map((day) => (
                <DayCard
                  key={day.date}
                  day={day}
                  today={today}
                  onOpen={openDay}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </DashboardShell>
  );
}
