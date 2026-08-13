import { useState, useEffect } from "react";
import { DOCTORS, STAFF, APPOINTMENTS, PATIENTS, QUEUE, ROOMS, NOTIFICATIONS, ACTIVITY, PAYMENTS, type DoctorStatus, type StaffStatus } from "../data/mockData";
import { Avatar, Card, ConfirmDialog, Icons, PageHeader, SearchBar, StatCard, StatusBadge } from "../components/ui";

export default function ActivityPage() {
  const typeIcon: Record<string, string> = {
    appointment: "📅", room: "🚪", checkin: "✅", schedule: "📋", cancel: "❌", staff: "👤"
  }
  const typeColor: Record<string, string> = {
    appointment: "bg-blue-100 text-blue-600",
    room: "bg-slate-100 text-slate-600",
    checkin: "bg-emerald-100 text-emerald-600",
    schedule: "bg-violet-100 text-violet-600",
    cancel: "bg-red-100 text-red-600",
    staff: "bg-amber-100 text-amber-600",
  }

  return (
    <div>
      <PageHeader title="Activity Log" subtitle="Clinic-level actions and changes tracked in real time"
        action={<button className="px-4 py-2 text-sm border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors">Export Log</button>}
      />

      <div className="flex items-center gap-3 mb-4">
        <SearchBar placeholder="Search activity…" />
        <select className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-200">
          <option>All Actions</option>
          <option>Appointments</option>
          <option>Rooms</option>
          <option>Schedule</option>
          <option>Staff</option>
        </select>
      </div>

      <Card>
        <div className="divide-y divide-slate-100">
          {ACTIVITY.map(a => (
            <div key={a.id} className="flex items-start gap-4 px-5 py-4 hover:bg-slate-50 transition-colors">
              <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-base flex-shrink-0 ${typeColor[a.type]}`}>{typeIcon[a.type]}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-semibold text-slate-800">{a.action}</p>
                  <span className="text-xs text-slate-400">by {a.user}</span>
                </div>
                <p className="text-sm text-slate-600 mt-0.5">{a.detail}</p>
              </div>
              <span className="text-xs text-slate-400 flex-shrink-0 mt-0.5">{a.time}</span>
            </div>
          ))}
        </div>
        <div className="px-5 py-3 border-t border-slate-100 text-center">
          <button className="text-sm text-blue-600 hover:underline">Load more activity</button>
        </div>
      </Card>
    </div>
  )
}
