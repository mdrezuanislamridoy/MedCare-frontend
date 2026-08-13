import { useState } from "react";
import { APPOINTMENTS, QUEUE, DOCTORS, PATIENTS, NOTIFICATIONS, ACTIVITY, type Appointment, type AppointmentStatus, type DoctorStatus } from "../data/mockData";
import { Avatar, ConfirmDialog, DoctorDot, EmptyState, PaymentBadge, StatusBadge } from "../components/ui";

export default function ActivityView() {
  const [filter, setFilter] = useState<string>("All")
  const types = ["All", "checkin", "cancel", "reschedule", "room", "queue", "appointment"]
  const icons: Record<string, string> = {
    checkin: "✅", cancel: "❌", reschedule: "🔄", room: "🚪", queue: "🔢", appointment: "📅"
  }
  const colors: Record<string, string> = {
    checkin: "bg-emerald-100 text-emerald-700",
    cancel: "bg-red-100 text-red-600",
    reschedule: "bg-amber-100 text-amber-700",
    room: "bg-blue-100 text-blue-700",
    queue: "bg-indigo-100 text-indigo-700",
    appointment: "bg-purple-100 text-purple-700",
  }
  const filtered = ACTIVITY.filter(a => filter === "All" || a.type === filter)

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-50 flex flex-wrap gap-2 items-center">
          <h2 className="font-semibold text-gray-900 mr-2">Receptionist Activity Log</h2>
          <div className="flex gap-1 flex-wrap">
            {types.map(t => (
              <button key={t} onClick={() => setFilter(t)}
                className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-colors capitalize ${filter === t ? "bg-blue-600 text-white border-blue-600" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
                {t === "All" ? "All" : t}
              </button>
            ))}
          </div>
        </div>

        <div className="divide-y divide-gray-50">
          {filtered.length === 0 && <EmptyState icon="📋" title="No activity found" sub="Actions will appear here as they occur" />}
          {filtered.map(a => (
            <div key={a.id} className="flex gap-4 px-5 py-3.5 hover:bg-gray-50/50 transition-colors">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-base shrink-0 ${colors[a.type]}`}>
                {icons[a.type]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800">{a.action}</p>
                <p className="text-xs text-gray-500 mt-0.5">{a.detail}</p>
                <p className="text-[11px] text-gray-400 mt-1">by {a.user}</p>
              </div>
              <span className="mono text-xs text-gray-400 shrink-0">{a.time}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl px-5 py-3 flex items-center gap-3">
        <span className="text-blue-500">🔒</span>
        <p className="text-sm text-blue-700">Activity log is scoped to Grace Osei — Riverside Clinic. Administrative and platform-level actions are not visible here.</p>
      </div>
    </div>
  )
}
