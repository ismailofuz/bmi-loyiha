"use client";

export interface Tab { key: string; label: string }

interface Props {
  tabs: Tab[];
  active: string;
  onChange: (key: string) => void;
}

const colors: Record<string, string> = {
  all:       "data-[active=true]:bg-blue-600   data-[active=true]:text-white",
  submitted: "data-[active=true]:bg-blue-600   data-[active=true]:text-white",
  approved:  "data-[active=true]:bg-green-600  data-[active=true]:text-white",
  rejected:  "data-[active=true]:bg-red-500    data-[active=true]:text-white",
  draft:     "data-[active=true]:bg-gray-500   data-[active=true]:text-white",
  active:    "data-[active=true]:bg-green-600  data-[active=true]:text-white",
  pending:   "data-[active=true]:bg-yellow-500 data-[active=true]:text-white",
  completed: "data-[active=true]:bg-gray-500   data-[active=true]:text-white",
};

export default function StatusTabs({ tabs, active, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {tabs.map((t) => (
        <button
          key={t.key}
          data-active={active === t.key}
          onClick={() => onChange(t.key)}
          className={`rounded-full border border-transparent px-3.5 py-1.5 text-xs font-medium text-gray-500 transition hover:bg-gray-100
            data-[active=true]:border-transparent data-[active=true]:shadow-sm
            ${colors[t.key] ?? "data-[active=true]:bg-blue-600 data-[active=true]:text-white"}`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
