import { FiSearch, FiBell, FiPlus } from "react-icons/fi";

export default function Topbar({ onNew }) {
  return (
    <div className="mb-6 flex items-center justify-between">
      <div className="relative max-w-xl flex-1">
        <FiSearch className="absolute left-4 top-3 text-slate-400" />
        <input placeholder="Search tools, tips, or upload..." className="w-full rounded-3xl border border-slate-200 bg-white/90 px-12 py-3 text-sm shadow-sm outline-none focus:ring-2 focus:ring-brand-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white" />
      </div>

      <div className="ml-4 flex items-center gap-3">
        <button className="inline-flex h-10 items-center gap-2 rounded-2xl border border-transparent bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700" onClick={onNew}>
          <FiPlus /> New Project
        </button>

        <button className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-900 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-white">
          <FiBell />
        </button>
      </div>
    </div>
  );
}
