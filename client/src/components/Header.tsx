import React from 'react';

type Props = {
  lastUpdated: string | null;
  onExport: () => void;
};

export default function Header({ lastUpdated, onExport }: Props) {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-semibold tracking-tight">Leads Dashboard</h1>
      <div className="flex items-center gap-4">
        {lastUpdated && (
          <div className="text-xs text-[var(--muted)]">
            Обновлено: {lastUpdated}
          </div>
        )}
        <button
          onClick={onExport}
          className="rounded-xl px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-500 to-sky-500 hover:from-indigo-400 hover:to-sky-400 shadow-md hover:shadow-lg transition"
        >
          Экспорт PDF
        </button>
      </div>
    </div>
  );
}
