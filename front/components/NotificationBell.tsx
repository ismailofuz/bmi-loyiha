"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { api } from "@/lib/api";

interface Notif {
  id: number;
  type: string;
  title: string;
  body?: string | null;
  link?: string | null;
  is_read: boolean;
  created_at: string;
}

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<Notif[]>([]);
  const ref = useRef<HTMLDivElement>(null);

  const load = useCallback(async () => {
    try {
      const data = await api.get<Notif[]>("/notifications");
      setItems(Array.isArray(data) ? data : []);
    } catch {
      /* sukut: avtorizatsiya yo'q bo'lishi mumkin */
    }
  }, []);

  // Real-time: 30 soniyada bir marta yangilab turish
  useEffect(() => {
    load();
    const t = setInterval(load, 30000);
    return () => clearInterval(t);
  }, [load]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const unread = items.filter((n) => !n.is_read).length;

  const markAll = async () => {
    try {
      await api.patch("/notifications/read-all", {});
      setItems((prev) => prev.map((n) => ({ ...n, is_read: true })));
    } catch { /* ignore */ }
  };

  const openItem = async (n: Notif) => {
    if (!n.is_read) {
      try { await api.patch(`/notifications/${n.id}/read`, {}); } catch { /* ignore */ }
      setItems((prev) => prev.map((x) => (x.id === n.id ? { ...x, is_read: true } : x)));
    }
    if (n.link) window.location.href = n.link;
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => { setOpen((o) => !o); if (!open) load(); }}
        className="relative rounded-md p-1.5 text-gray-500 hover:bg-gray-100"
        title="Xabarnomalar"
      >
        <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
          <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-2.83-2h5.66A3 3 0 0110 18z" />
        </svg>
        {unread > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-80 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl">
          <div className="flex items-center justify-between border-b border-gray-100 px-4 py-2.5">
            <span className="text-sm font-bold text-gray-900">Xabarnomalar</span>
            {unread > 0 && (
              <button onClick={markAll} className="text-xs font-medium text-blue-600 hover:underline">
                Hammasini o&apos;qilgan qilish
              </button>
            )}
          </div>
          <div className="max-h-96 overflow-y-auto">
            {items.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-gray-400">Xabarnomalar yo&apos;q</div>
            ) : (
              items.map((n) => (
                <button
                  key={n.id}
                  onClick={() => openItem(n)}
                  className={`flex w-full flex-col items-start gap-0.5 border-b border-gray-50 px-4 py-3 text-left hover:bg-gray-50 ${
                    n.is_read ? "" : "bg-blue-50/50"
                  }`}
                >
                  <div className="flex w-full items-center gap-2">
                    {!n.is_read && <span className="h-2 w-2 shrink-0 rounded-full bg-blue-500" />}
                    <span className="text-sm font-semibold text-gray-900">{n.title}</span>
                  </div>
                  {n.body && <span className="text-xs text-gray-500">{n.body}</span>}
                  <span className="text-[10px] text-gray-400">
                    {new Date(n.created_at).toLocaleString("uz-UZ")}
                  </span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
