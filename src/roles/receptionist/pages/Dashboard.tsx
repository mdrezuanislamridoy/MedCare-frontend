import { useState } from "react";
import { APPOINTMENTS, QUEUE, DOCTORS, PATIENTS, NOTIFICATIONS, ACTIVITY, type Appointment, type AppointmentStatus, type DoctorStatus } from "../data/mockData";
import { Avatar, ConfirmDialog, DoctorDot, EmptyState, PaymentBadge, StatusBadge } from "../components/ui";

function StatCard({ label, value, sub, accent }: { label: string; value: number | string; sub?: string; accent?: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 animate-fade-in hover:shadow-md transition-shadow">
      <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{label}</p>
      <p className={`text-3xl font-bold mt-1 ${accent || "text-gray-900"}`}>{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  )
}

export default function Dashboard() {
  const stats = [
    { label: "Today's Appointments", value: 12, sub: "8 AM – 5 PM", accent: "text-blue-600" },
    { label: "Waiting Patients", value: 3, sub: "In lobby", accent: "text-amber-600" },
    { label: "Checked In", value: 5, sub: "In clinic", accent: "text-indigo-600" },
    { label: "Completed Visits", value: 2, sub: "As of now", accent: "text-emerald-600" },
    { label: "Cancelled", value: 1, sub: "Today", accent: "text-red-500" },
    { label: "Available Doctors", value: 1, sub: "Out of 4", accent: "text-teal-600" },
  ]

  const timeline = APPOINTMENTS.slice(0, 8)

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        {stats.map(s => <StatCard key={s.label} {...s} />)}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Timeline */}
        <div className="xl:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Today's Appointment Timeline</h2>
            <span className="mono text-xs text-gray-400">13 Aug 2026</span>
          </div>
          <div className="divide-y divide-gray-50">
            {timeline.map((a) => (
              <div key={a.id} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50/60 transition-colors">
                <span className="mono text-xs text-gray-400 w-16 shrink-0">{a.time}</span>
                <Avatar initials={a.avatar} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{a.patient}</p>
                  <p className="text-xs text-gray-400 truncate">{a.doctor} · {a.type}</p>
                </div>
                <StatusBadge status={a.status} />
              </div>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-4">
          {/* Live Queue */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">Live Queue</h2>
              <span className="flex items-center gap-1.5 text-xs text-emerald-600">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 pulse-dot" />
                Live
              </span>
            </div>
            <div className="divide-y divide-gray-50">
              {QUEUE.map(q => (
                <div key={q.queueNo} className="flex items-center gap-3 px-5 py-2.5">
                  <span className="mono text-xs font-bold text-blue-600 w-5">#{q.queueNo}</span>
                  <Avatar initials={q.avatar} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{q.patient}</p>
                    <p className="text-xs text-gray-400">{q.waitMins}m wait</p>
                  </div>
                  <StatusBadge status={q.status} />
                </div>
              ))}
            </div>
          </div>

          {/* Doctor availability */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-50">
              <h2 className="font-semibold text-gray-900">Doctor Availability</h2>
            </div>
            <div className="divide-y divide-gray-50">
              {DOCTORS.map(d => (
                <div key={d.name} className="flex items-center gap-3 px-5 py-2.5">
                  <DoctorDot status={d.status} />
                  <Avatar initials={d.avatar} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{d.name}</p>
                    <p className="text-xs text-gray-400 truncate">{d.specialty}</p>
                  </div>
                  <span className="text-xs text-gray-400 mono shrink-0">Q:{d.queue}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent check-ins */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-50">
          <h2 className="font-semibold text-gray-900">Recent Check-ins</h2>
        </div>
        <div className="divide-y divide-gray-50">
          {ACTIVITY.filter(a => a.type === "checkin").slice(0, 4).map(a => (
            <div key={a.id} className="flex items-center gap-3 px-5 py-3">
              <span className="text-emerald-500 text-base">✓</span>
              <div className="flex-1">
                <p className="text-sm text-gray-800">{a.detail}</p>
              </div>
              <span className="mono text-xs text-gray-400">{a.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
