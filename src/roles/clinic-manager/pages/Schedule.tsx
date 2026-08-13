import { useState, useEffect } from "react";
import { DOCTORS, STAFF, APPOINTMENTS, PATIENTS, QUEUE, ROOMS, NOTIFICATIONS, ACTIVITY, PAYMENTS, type DoctorStatus, type StaffStatus } from "../data/mockData";
import { Avatar, Card, ConfirmDialog, Icons, PageHeader, SearchBar, StatCard, StatusBadge } from "../components/ui";

export default function SchedulePage() {
  const [view, setView] = useState<"week" | "day">("week")
  const days = ["Mon Aug 11", "Tue Aug 12", "Wed Aug 13", "Thu Aug 14", "Fri Aug 15", "Sat Aug 16"]
  const slots = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"]

  type SlotType = "booked" | "available" | "blocked" | "unavailable"
  const slotData: Record<string, Record<string, SlotType>> = {
    "09:00": { "Mon Aug 11": "booked", "Tue Aug 12": "booked", "Wed Aug 13": "booked", "Thu Aug 14": "available", "Fri Aug 15": "available" },
    "10:00": { "Mon Aug 11": "booked", "Tue Aug 12": "available", "Wed Aug 13": "booked", "Thu Aug 14": "booked", "Fri Aug 15": "blocked" },
    "11:00": { "Mon Aug 11": "available", "Tue Aug 12": "booked", "Wed Aug 13": "booked", "Thu Aug 14": "available", "Fri Aug 15": "available" },
    "12:00": { "Mon Aug 11": "blocked", "Tue Aug 12": "blocked", "Wed Aug 13": "blocked", "Thu Aug 14": "blocked", "Fri Aug 15": "blocked", "Sat Aug 16": "unavailable" },
    "13:00": { "Mon Aug 11": "available", "Tue Aug 12": "booked", "Wed Aug 13": "booked", "Thu Aug 14": "available", "Fri Aug 15": "booked" },
    "14:00": { "Mon Aug 11": "booked", "Tue Aug 12": "available", "Wed Aug 13": "available", "Thu Aug 14": "booked", "Fri Aug 15": "booked" },
    "15:00": { "Mon Aug 11": "available", "Tue Aug 12": "available", "Wed Aug 13": "booked", "Thu Aug 14": "available", "Fri Aug 15": "unavailable" },
    "08:00": { "Sat Aug 16": "unavailable", "Sun": "unavailable" },
    "16:00": { "Fri Aug 15": "unavailable", "Sat Aug 16": "unavailable" },
  }

  const slotStyle: Record<SlotType, string> = {
    booked: "bg-blue-100 text-blue-700 border-blue-200",
    available: "bg-emerald-50 text-emerald-700 border-emerald-200",
    blocked: "bg-amber-50 text-amber-600 border-amber-200",
    unavailable: "bg-slate-100 text-slate-400 border-slate-200",
  }

  return (
    <div>
      <PageHeader title="Schedule" subtitle="Manage doctor hours, consultation slots, breaks, and room availability"
        action={
          <div className="flex gap-2">
            <button onClick={() => setView("week")} className={`px-3 py-2 text-sm rounded-lg border transition-colors ${view === "week" ? "bg-blue-600 text-white border-blue-600" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}>Week</button>
            <button onClick={() => setView("day")} className={`px-3 py-2 text-sm rounded-lg border transition-colors ${view === "day" ? "bg-blue-600 text-white border-blue-600" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}>Day</button>
          </div>
        }
      />

      {/* Legend */}
      <div className="flex items-center gap-4 mb-4">
        {[
          { label: "Booked", cls: "bg-blue-100 border border-blue-200" },
          { label: "Available", cls: "bg-emerald-50 border border-emerald-200" },
          { label: "Blocked / Break", cls: "bg-amber-50 border border-amber-200" },
          { label: "Unavailable", cls: "bg-slate-100 border border-slate-200" },
        ].map(l => (
          <div key={l.label} className="flex items-center gap-1.5">
            <div className={`w-4 h-3 rounded ${l.cls}`} />
            <span className="text-xs text-slate-500">{l.label}</span>
          </div>
        ))}
      </div>

      <Card className="responsive-table">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="text-left text-xs font-semibold text-slate-400 px-4 py-3 w-20">TIME</th>
              {days.map(d => (
                <th key={d} className={`text-center text-xs font-semibold px-2 py-3 ${d.includes("13") ? "text-blue-600" : "text-slate-500"}`}>{d}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {slots.map(slot => (
              <tr key={slot} className="border-b border-slate-50 last:border-0">
                <td className="px-4 py-2.5 text-xs font-mono text-slate-400">{slot}</td>
                {days.map(day => {
                  const type = slotData[slot]?.[day] ?? "available"
                  return (
                    <td key={day} className="px-2 py-2">
                      <div className={`text-xs text-center py-1.5 rounded border cursor-pointer transition-all hover:opacity-80 ${slotStyle[type]}`}>
                        {type === "booked" ? "Booked" : type === "blocked" ? "Break" : type === "unavailable" ? "—" : "Open"}
                      </div>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
        <Card className="p-4">
          <h3 className="text-sm font-semibold text-slate-700 mb-3">Upcoming Leave</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <div>
                <p className="text-sm font-medium text-slate-700">Dr. Elena Torres</p>
                <p className="text-xs text-slate-400">Aug 14 – 18, 2026</p>
              </div>
              <StatusBadge status="Pending" />
            </div>
            <p className="text-xs text-slate-400">No other leave scheduled</p>
          </div>
        </Card>
        <Card className="p-4">
          <h3 className="text-sm font-semibold text-slate-700 mb-3">Clinic Holidays</h3>
          <div className="space-y-2 text-sm text-slate-600">
            <div className="flex justify-between"><span>Labor Day</span><span className="text-slate-400">Sep 1, 2026</span></div>
            <div className="flex justify-between"><span>Thanksgiving</span><span className="text-slate-400">Nov 26, 2026</span></div>
            <div className="flex justify-between"><span>Christmas</span><span className="text-slate-400">Dec 25, 2026</span></div>
          </div>
        </Card>
        <Card className="p-4">
          <h3 className="text-sm font-semibold text-slate-700 mb-3">Room Availability</h3>
          <div className="space-y-2">
            {ROOMS.map(r => (
              <div key={r.id} className="flex items-center justify-between">
                <span className="text-sm text-slate-600">{r.name}</span>
                <StatusBadge status={r.status} />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
