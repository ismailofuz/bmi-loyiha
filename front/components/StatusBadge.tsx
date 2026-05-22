const config: Record<string, { label: string; className: string }> = {
  // report statuses
  draft:     { label: "Qoralama",    className: "bg-gray-100  text-gray-600"   },
  submitted: { label: "Topshirildi", className: "bg-blue-100  text-blue-700"   },
  approved:  { label: "Tasdiqlandi", className: "bg-green-100 text-green-700"  },
  rejected:  { label: "Rad etildi",  className: "bg-red-100   text-red-700"    },
  // student statuses
  pending:   { label: "Kutilmoqda",  className: "bg-yellow-100 text-yellow-700" },
  active:    { label: "Faol",        className: "bg-green-100 text-green-700"  },
  completed: { label: "Tugallandi",  className: "bg-gray-100  text-gray-600"   },
  dropped:   { label: "Tashlab ketdi", className: "bg-red-100 text-red-700"   },
  // user
  true:      { label: "Faol",        className: "bg-green-100 text-green-700"  },
  false:     { label: "Nofaol",      className: "bg-gray-100  text-gray-500"   },
};

export default function StatusBadge({ status }: { status: string | boolean }) {
  const key = String(status);
  const c = config[key] ?? { label: key, className: "bg-gray-100 text-gray-600" };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${c.className}`}>
      {c.label}
    </span>
  );
}
