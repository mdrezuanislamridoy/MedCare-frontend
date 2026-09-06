import { useState } from "react";
import { Card, PageHeader } from "../components/ui";

export default function ActivityPage() {
  const [activities] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("All");

  const typeIcon: Record<string, string> = {
    appointment: "📅", room: "🚪", checkin: "✅", schedule: "📋", cancel: "❌", staff: "👤"
  };
  const typeColor: Record<string, string> = {
    appointment: "bg-blue-100 text-blue-600",
    room: "bg-slate-100 text-slate-600",
    checkin: "bg-emerald-100 text-emerald-600",
    schedule: "bg-violet-100 text-violet-600",
    cancel: "bg-red-100 text-red-600",
    staff: "bg-amber-100 text-amber-600",
  };

  const filtered = activities.filter((a) => {
    const matchSearch = !search || (a.action || "").toLowerCase().includes(search.toLowerCase());
    const matchAction = actionFilter === "All" || (a.type || "").toLowerCase() === actionFilter.toLowerCase();
    return matchSearch && matchAction;
  });

  return (
    <div>
      <PageHeader
        title="Activity Log"
        subtitle="Clinic-level actions and changes tracked in real time"
        action={
          <button onClick={() => alert("Exporting activity log CSV...")} className="px-4 py-2 text-sm border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors">
            Export Log
          </button>
        }
      />

      <div className="flex items-center gap-3 mb-4">
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 bg-white"
            placeholder="Search activity…"
          />
        </div>
        <select
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value)}
          className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
        >
          <option value="All">All Actions</option>
          <option value="appointment">Appointments</option>
          <option value="room">Rooms</option>
          <option value="schedule">Schedule</option>
          <option value="staff">Staff</option>
        </select>
      </div>

      <Card>
        {filtered.length === 0 ? (
          <div className="py-12 text-center text-slate-400">
            <p className="text-sm font-semibold text-slate-700">No activity logged yet</p>
            <p className="text-xs text-slate-400 mt-0.5">Staff operations, patient check-ins, and appointments will log in real time.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filtered.map((a) => (
              <div key={a.id} className="flex items-start gap-4 px-5 py-4 hover:bg-slate-50 transition-colors">
                <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-base flex-shrink-0 ${typeColor[a.type] || "bg-slate-100"}`}>{typeIcon[a.type] || "📌"}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold text-slate-800">{a.action}</p>
                    <span className="text-xs text-slate-400">by {a.user || "Staff"}</span>
                  </div>
                  <p className="text-sm text-slate-600 mt-0.5">{a.detail}</p>
                </div>
                <span className="text-xs text-slate-400 flex-shrink-0 mt-0.5">{a.time || "Recent"}</span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
