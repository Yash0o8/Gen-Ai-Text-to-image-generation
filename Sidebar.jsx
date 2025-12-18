export default function Sidebar() {
  return (
    <aside className="w-64 p-4
      bg-white dark:bg-slate-900
      border-r border-slate-200 dark:border-slate-800
      transition-colors">

      <h2 className="text-lg font-bold mb-6">
        ✨ GenAI Studio
      </h2>

      <button className="
        w-full px-4 py-2 rounded-xl
        bg-slate-100 dark:bg-slate-800
        hover:bg-slate-200 dark:hover:bg-slate-700
        transition">
        New Generation
      </button>

      <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">
        History coming soon
      </p>
    </aside>
  );
}
