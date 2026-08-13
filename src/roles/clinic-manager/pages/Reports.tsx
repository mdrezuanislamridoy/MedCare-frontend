import { useState, useEffect } from "react";
import { DOCTORS, STAFF, APPOINTMENTS, PATIENTS, QUEUE, ROOMS, NOTIFICATIONS, ACTIVITY, PAYMENTS, type DoctorStatus, type StaffStatus } from "../data/mockData";
import { Avatar, Card, ConfirmDialog, Icons, PageHeader, SearchBar, StatCard, StatusBadge } from "../components/ui";

export default function ReportsPage() {
  const weeklyData = [
    { day: "Mon", appts: 9, revenue: 720 },
    { day: "Tue", appts: 11, revenue: 880 },
    { day: "Wed", appts: 8, revenue: 640 },
    { day: "Thu", appts: 7, revenue: 560 },
    { day: "Fri", appts: 5, revenue: 380 },
    { day: "Sat", appts: 2, revenue: 160 },
  ]
  const maxAppts = Math.max(...weeklyData.map(d => d.appts))

  return (
    <div>
      <PageHeader title="Reports" subtitle="Clinic-level analytics and appointment trends"
        action={<button className="px-4 py-2 text-sm border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors">Export CSV</button>}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card className="p-5">
          <h3 className="text-sm font-semibold text-slate-800 mb-4">Appointments This Week</h3>
          <div className="flex items-end gap-3 h-40">
            {weeklyData.map(d => (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-xs text-slate-500">{d.appts}</span>
                <div className="w-full rounded-t-md bg-blue-500 transition-all" style={{ height: `${(d.appts / maxAppts) * 100}%` }} />
                <span className="text-xs text-slate-400">{d.day}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="text-sm font-semibold text-slate-800 mb-4">Revenue This Week</h3>
          <div className="flex items-end gap-3 h-40">
            {weeklyData.map(d => (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-xs text-slate-500">${d.revenue}</span>
                <div className="w-full rounded-t-md bg-emerald-500 transition-all" style={{ height: `${(d.revenue / 880) * 100}%` }} />
                <span className="text-xs text-slate-400">{d.day}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="text-sm font-semibold text-slate-800 mb-4">Appointment Status Breakdown</h3>
          <div className="space-y-3">
            {[
              { label: "Completed", val: 36, color: "#059669" },
              { label: "Cancelled", val: 4, color: "#DC2626" },
              { label: "No Shows", val: 2, color: "#D97706" },
              { label: "Pending / Upcoming", val: 8, color: "#2563EB" },
            ].map(s => (
              <div key={s.label}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-slate-600">{s.label}</span>
                  <span className="text-sm font-semibold text-slate-700">{s.val}</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full">
                  <div className="h-2 rounded-full" style={{ width: `${(s.val / 50) * 100}%`, backgroundColor: s.color }} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="text-sm font-semibold text-slate-800 mb-4">Doctor Performance</h3>
          <div className="space-y-3">
            {DOCTORS.filter(d => d.status === "Active").map(d => (
              <div key={d.id} className="flex items-center gap-3">
                <Avatar initials={d.avatar} color={d.color} size="sm" />
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-xs font-medium text-slate-700">{d.name}</span>
                    <span className="text-xs text-slate-500">{d.appointments} today</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full">
                    <div className="h-1.5 rounded-full" style={{ width: `${(d.appointments / 12) * 100}%`, backgroundColor: d.color }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
