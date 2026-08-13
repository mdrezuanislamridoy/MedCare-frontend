import { useState, useEffect } from "react";
import { DOCTORS, STAFF, APPOINTMENTS, PATIENTS, QUEUE, ROOMS, NOTIFICATIONS, ACTIVITY, PAYMENTS, type DoctorStatus, type StaffStatus } from "../data/mockData";
import { Avatar, Card, ConfirmDialog, Icons, PageHeader, SearchBar, StatCard, StatusBadge } from "../components/ui";

export default function NotificationsPage() {
  const [notifs, setNotifs] = useState(NOTIFICATIONS)
  const iconMap: Record<string, string> = {
    "new-appt": "📅", "checkin": "✅", "cancel": "❌", "leave": "🏖️", "schedule": "📋", "staff": "👤"
  }

  return (
    <div>
      <PageHeader title="Notifications" subtitle={`${notifs.filter(n => !n.read).length} unread notifications`}
        action={<button onClick={() => setNotifs(prev => prev.map(n => ({ ...n, read: true })))} className="text-sm text-blue-600 hover:underline">Mark all read</button>}
      />

      <Card>
        <div className="divide-y divide-slate-100">
          {notifs.map(n => (
            <div key={n.id} onClick={() => setNotifs(prev => prev.map(item => item.id === n.id ? { ...item, read: true } : item))}
              className={`flex gap-4 px-5 py-4 cursor-pointer hover:bg-slate-50 transition-colors ${!n.read ? "bg-blue-50/40" : ""}`}>
              <span className="text-xl flex-shrink-0">{iconMap[n.type]}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-slate-800">{n.title}</p>
                  {!n.read && <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />}
                </div>
                <p className="text-sm text-slate-600 mt-0.5">{n.message}</p>
                <p className="text-xs text-slate-400 mt-1">{n.time}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
