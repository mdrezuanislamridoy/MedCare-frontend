import { useState, useEffect } from "react";
import { DOCTORS, STAFF, APPOINTMENTS, PATIENTS, QUEUE, ROOMS, NOTIFICATIONS, ACTIVITY, PAYMENTS, type DoctorStatus, type StaffStatus } from "../data/mockData";
import { Avatar, Card, ConfirmDialog, Icons, PageHeader, SearchBar, StatCard, StatusBadge } from "../components/ui";

export default function AppointmentsPage() {
  const [filter, setFilter] = useState<string>("All")
  const [selected, setSelected] = useState<string | null>(null)
  const statuses = ["All", "Pending", "Confirmed", "Checked In", "In Progress", "Completed", "Cancelled", "No Show"]
  const filtered = filter === "All" ? APPOINTMENTS : APPOINTMENTS.filter(a => a.status === filter)

  return (
    <div>
      <PageHeader title="Appointments" subtitle="Aug 13, 2026 — Today's appointments at Green Pine Medical"
        action={<button className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">{Icons.plus} New Appointment</button>}
      />

      {/* Status tabs */}
      <div className="flex gap-1.5 flex-wrap mb-4">
        {statuses.map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${filter === s ? "bg-blue-600 text-white" : "border border-slate-200 text-slate-600 hover:bg-slate-50 bg-white"}`}>
            {s}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3 mb-4">
        <SearchBar placeholder="Search appointments, patients…" />
        <select className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-200">
          <option>All Doctors</option>
          {DOCTORS.map(d => <option key={d.id}>{d.name}</option>)}
        </select>
      </div>

      <Card>
        <div className="responsive-table">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                {["APPT ID", "PATIENT", "DOCTOR", "DATE & TIME", "ROOM", "TYPE", "PAYMENT", "STATUS", "ACTIONS"].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-slate-500 px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map(a => (
                <tr key={a.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3.5 text-xs font-mono text-blue-600">{a.id}</td>
                  <td className="px-4 py-3.5 text-sm font-medium text-slate-700">{a.patient}</td>
                  <td className="px-4 py-3.5 text-sm text-slate-600">{a.doctor}</td>
                  <td className="px-4 py-3.5">
                    <p className="text-sm text-slate-700">{a.date}</p>
                    <p className="text-xs text-slate-400">{a.time}</p>
                  </td>
                  <td className="px-4 py-3.5 text-sm text-slate-500">{a.room}</td>
                  <td className="px-4 py-3.5 text-xs text-slate-600">{a.type}</td>
                  <td className="px-4 py-3.5"><StatusBadge status={a.payStatus} /></td>
                  <td className="px-4 py-3.5"><StatusBadge status={a.status} /></td>
                  <td className="px-4 py-3.5">
                    <div className="flex gap-1">
                      <button onClick={() => setSelected(a.id)} className="px-2 py-1 text-xs text-slate-600 border border-slate-200 rounded hover:bg-slate-50 transition-colors">View</button>
                      {a.status !== "Completed" && a.status !== "Cancelled" && (
                        <>
                          <button className="px-2 py-1 text-xs text-blue-600 border border-blue-200 rounded hover:bg-blue-50 transition-colors">Reschedule</button>
                          {a.status === "Confirmed" && <button className="px-2 py-1 text-xs text-emerald-600 border border-emerald-200 rounded hover:bg-emerald-50 transition-colors">Check In</button>}
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between">
          <p className="text-xs text-slate-400">Showing {filtered.length} of {APPOINTMENTS.length} appointments</p>
          <div className="flex gap-1">
            <button className="px-3 py-1 text-xs border border-slate-200 rounded hover:bg-slate-50 text-slate-600">Prev</button>
            <button className="px-3 py-1 text-xs border border-slate-200 rounded bg-blue-600 text-white">1</button>
            <button className="px-3 py-1 text-xs border border-slate-200 rounded hover:bg-slate-50 text-slate-600">Next</button>
          </div>
        </div>
      </Card>
    </div>
  )
}
