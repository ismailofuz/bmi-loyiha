"use client";

import { useRef, useState } from "react";
import { api } from "@/lib/api";
import { useToast } from "@/components/ToastProvider";

interface Created { full_name: string; email: string; password: string }
interface Failed { row: number; label: string; reason: string }
interface ImportResult { created: Created[]; failed: Failed[] }

export default function ImportPanel({
  templatePath,
  importPath,
  templateName,
  onDone,
}: {
  templatePath: string;
  importPath: string;
  templateName: string;
  onDone?: () => void;
}) {
  const { toast } = useToast();
  const fileRef = useRef<HTMLInputElement>(null);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);

  async function downloadTemplate() {
    try { await api.download(templatePath, templateName); }
    catch (e) { toast(e instanceof Error ? e.message : "Xatolik", "error"); }
  }

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (fileRef.current) fileRef.current.value = "";
    if (!file) return;
    setImporting(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await api.postForm<ImportResult>(importPath, fd);
      setResult(res);
      if (res.created.length) toast(`${res.created.length} ta qo'shildi`, "success");
      if (!res.created.length && res.failed.length) toast("Hech narsa qo'shilmadi", "error");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Import xatolik", "error");
    } finally {
      setImporting(false);
    }
  }

  function downloadCredentials() {
    if (!result?.created.length) return;
    const rows = [["F.I.O", "Login (email)", "Parol"], ...result.created.map(c => [c.full_name, c.email, c.password])];
    const csv = "﻿" + rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "login-parollar.csv";
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
  }

  function close() {
    setResult(null);
    onDone?.();
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <button onClick={downloadTemplate}
          className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50">
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-gray-400"><path d="M10.75 2.75a.75.75 0 00-1.5 0v8.614L6.295 8.235a.75.75 0 10-1.09 1.03l4.25 4.5a.75.75 0 001.09 0l4.25-4.5a.75.75 0 00-1.09-1.03l-2.955 3.129V2.75z" /><path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" /></svg>
          Shablon
        </button>
        <button onClick={() => fileRef.current?.click()} disabled={importing}
          className="inline-flex items-center gap-1.5 rounded-lg border border-green-300 bg-green-50 px-3 py-2 text-sm font-medium text-green-700 hover:bg-green-100 disabled:opacity-50">
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4"><path d="M9.25 13.25a.75.75 0 001.5 0V4.636l2.955 3.129a.75.75 0 001.09-1.03l-4.25-4.5a.75.75 0 00-1.09 0l-4.25 4.5a.75.75 0 101.09 1.03L9.25 4.636v8.614z" /><path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" /></svg>
          {importing ? "Import qilinmoqda..." : "Excel import"}
        </button>
        <input ref={fileRef} type="file" accept=".xlsx,.xls,.csv" onChange={handleFile} className="hidden" />
      </div>

      {result && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <h3 className="mb-3 text-base font-bold text-gray-900">Import natijasi</h3>
            <div className="mb-4 flex gap-3">
              <div className="flex-1 rounded-xl border border-green-200 bg-green-50 p-3 text-center">
                <p className="text-2xl font-bold text-green-700">{result.created.length}</p>
                <p className="text-xs text-green-600">Muvaffaqiyatli</p>
              </div>
              <div className="flex-1 rounded-xl border border-red-200 bg-red-50 p-3 text-center">
                <p className="text-2xl font-bold text-red-700">{result.failed.length}</p>
                <p className="text-xs text-red-600">Xato</p>
              </div>
            </div>

            {result.created.length > 0 && (
              <button onClick={downloadCredentials}
                className="mb-4 w-full rounded-lg bg-[#2563eb] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1d4ed8]">
                Login va parollarni yuklab olish (CSV)
              </button>
            )}

            {result.failed.length > 0 && (
              <div className="mb-4 max-h-48 overflow-y-auto rounded-lg border border-red-100 bg-red-50/50 p-3">
                <p className="mb-1.5 text-xs font-semibold text-red-700">Xato qatorlar:</p>
                <ul className="space-y-1 text-xs text-red-700">
                  {result.failed.map((f, i) => (
                    <li key={i}>• {f.row}-qator{f.label ? ` (${f.label})` : ""}: {f.reason}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex justify-end">
              <button onClick={close}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50">
                Yopish
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
