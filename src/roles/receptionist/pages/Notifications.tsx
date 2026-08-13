import { useState } from "react";
import { APPOINTMENTS, QUEUE, DOCTORS, PATIENTS, NOTIFICATIONS, ACTIVITY, type Appointment, type AppointmentStatus, type DoctorStatus } from "../data/mockData";
import { Avatar, ConfirmDialog, DoctorDot, EmptyState, PaymentBadge, StatusBadge } from "../components/ui";

export default function NotificationsView() {
  const [notifs, setNotifs] = useState(NOTIFICATIONS)
  const markAll = () => setNotifs(prev => prev.map(n => ({ ...n, read: true })))
  const markOne = (id: number) => setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))

  const iconMap: Record<string, string> = {
    appointment: "📅", cancel: "❌", reschedule: "🔄", doctor: "🩺", checkin: "✅", schedule: "🗓"
  }

  const unread = notifs.filter(n => !n.read).length

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="font-semibold text-gray-900">Notifications</h2>
            {unread > 0 && (
              <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{unread}</span>
            )}
          </div>
          <button onClick={markAll} className="text-sm text-blue-600 hover:underline">Mark all read</button>
        </div>

        <div className="divide-y divide-gray-50">
          {notifs.length === 0 && <EmptyState icon="🔔" title="All caught up!" sub="No new notifications" />}
          {notifs.map(n => (
            <div key={n.id} onClick={() => markOne(n.id)}
              className={`flex gap-4 px-5 py-4 cursor-pointer transition-colors ${n.read ? "hover:bg-gray-50/60" : "bg-blue-50/40 hover:bg-blue-50/60"}`}>
              <span className="text-xl shrink-0">{iconMap[n.type]}</span>
              <div className="flex-1 min-w-0">
                <p className={`text-sm ${n.read ? "text-gray-600" : "text-gray-900 font-medium"}`}>{n.message}</p>
                <p className="mono text-[11px] text-gray-400 mt-0.5">{n.time}</p>
              </div>
              {!n.read && <span className="w-2 h-2 bg-blue-500 rounded-full shrink-0 mt-1.5" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
