import { useState, useEffect } from "react";
import { DOCTORS, STAFF, APPOINTMENTS, PATIENTS, QUEUE, ROOMS, NOTIFICATIONS, ACTIVITY, PAYMENTS, type DoctorStatus, type StaffStatus } from "../data/mockData";
import { Avatar, Card, ConfirmDialog, Icons, PageHeader, SearchBar, StatCard, StatusBadge } from "../components/ui";

export default function DashboardPage() {
  const timeline = [
    { time: "09:00", patient: "Robert Chen", doctor: "Mitchell", status: "Completed", w: 60 },
    { time: "09:30", patient: "Linda Park", doctor: "Okafor", status: "Completed", w: 60 },
    { time: "10:00", patient: "Oscar Ruiz", doctor: "Nair", status: "In Progress", w: 60 },
    { time: "10:30", patient: "Hannah Scott", doctor: "Webb", status: "Checked In", w: 60 },
    { time: "11:00", patient: "Tom Bradley", doctor: "Mitchell", status: "Confirmed", w: 60 },
    { time: "11:30", patient: "Nadia Coleman", doctor: "Okafor", status: "Pending", w: 60 },
    { time: "12:00", patient: "Eric Walsh", doctor: "Nair", status: "Pending", w: 60 },
  ]

  const barColors: Record<string, string> = {
    "Completed": "#059669", "In Progress": "#7C3AED", "Checked In": "#4F46E5",
    "Confirmed": "#2563EB", "Pending": "#D97706", "Cancelled": "#DC2626",
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Dashboard" subtitle="Thursday, August 13, 2026 — Green Pine Medical Clinic" />

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Today's Appointments" value={8} sub="↑ 2 vs yesterday" icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/></svg>} color="#2563EB" />
        <StatCard label="Waiting Patients" value={3} sub="In queue now" icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5"><circle cx="12" cy="7" r="4"/><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/></svg>} color="#D97706" />
        <StatCard label="Available Doctors" value={4} sub="1 on leave" icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/><path d="M12 11v6M9 14h6"/></svg>} color="#059669" />
        <StatCard label="Active Staff" value={3} sub="1 inactive" icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>} color="#7C3AED" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Completed" value={2} sub="Today so far" icon={Icons.check} color="#059669" />
        <StatCard label="Cancelled" value={1} sub="1 refund issued" icon={Icons.x} color="#DC2626" />
        <StatCard label="Today's Revenue" value="$325" sub="4 payments collected" icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>} color="#0891B2" />
        <StatCard label="No Shows" value={0} sub="Tracking live" icon={Icons.clock} color="#64748B" />
      </div>

      {/* Timeline + Doctor Availability */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Timeline */}
        <Card className="lg:col-span-2 p-5">
          <h2 className="text-sm font-semibold text-slate-800 mb-4">Today's Appointment Timeline</h2>
          <div className="space-y-2">
            {timeline.map((t, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-xs font-mono text-slate-400 w-14 flex-shrink-0">{t.time}</span>
                <div className="flex-1 flex items-center gap-2 py-2 px-3 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: barColors[t.status] }} />
                  <span className="text-sm text-slate-700 flex-1">{t.patient}</span>
                  <span className="text-xs text-slate-400">Dr. {t.doctor}</span>
                  <StatusBadge status={t.status} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Doctor Availability + Patient Queue */}
        <div className="space-y-5">
          <Card className="p-5">
            <h2 className="text-sm font-semibold text-slate-800 mb-4">Doctor Availability</h2>
            <div className="space-y-3">
              {DOCTORS.map(d => (
                <div key={d.id} className="flex items-center gap-3">
                  <Avatar initials={d.avatar} color={d.color} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-slate-700 truncate">{d.name.replace("Dr. ", "")}</p>
                    <p className="text-xs text-slate-400">{d.specialty}</p>
                  </div>
                  <StatusBadge status={d.status} />
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <h2 className="text-sm font-semibold text-slate-800 mb-4">Live Queue</h2>
            <div className="space-y-2">
              {QUEUE.filter(q => ["In Consultation","Checked In","Waiting"].includes(q.status)).map(q => (
                <div key={q.q} className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-500 text-xs font-bold flex items-center justify-center flex-shrink-0">{q.q}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-slate-700 truncate">{q.patient}</p>
                    <p className="text-xs text-slate-400">{q.time}</p>
                  </div>
                  <StatusBadge status={q.status} />
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Clinic Performance */}
      <Card className="p-5">
        <h2 className="text-sm font-semibold text-slate-800 mb-4">Clinic Performance — This Week</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: "Appointments", val: 42, max: 60, color: "#2563EB" },
            { label: "Completed", val: 36, max: 42, color: "#059669" },
            { label: "Cancelled", val: 4, max: 42, color: "#DC2626" },
            { label: "Revenue", val: 5240, max: 8000, color: "#0891B2", prefix: "$" },
          ].map(p => (
            <div key={p.label}>
              <div className="flex items-end justify-between mb-2">
                <p className="text-xs font-medium text-slate-500">{p.label}</p>
                <p className="text-sm font-bold text-slate-800">{p.prefix}{p.val.toLocaleString()}</p>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full">
                <div className="h-2 rounded-full transition-all" style={{ width: `${(p.val / p.max) * 100}%`, backgroundColor: p.color }} />
              </div>
              <p className="text-xs text-slate-400 mt-1">of {p.prefix}{p.max.toLocaleString()} target</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
