import { useState, useEffect } from "react";
import { DOCTORS, STAFF, APPOINTMENTS, PATIENTS, QUEUE, ROOMS, NOTIFICATIONS, ACTIVITY, PAYMENTS, type DoctorStatus, type StaffStatus } from "../data/mockData";
import { Avatar, Card, ConfirmDialog, Icons, PageHeader, SearchBar, StatCard, StatusBadge } from "../components/ui";

export default function DoctorsPage() {
  const [confirm, setConfirm] = useState<string | null>(null)
  const [doctors, setDoctors] = useState(DOCTORS)

  const toggle = (id: string) => {
    setDoctors(prev => prev.map(d => d.id === id ? { ...d, status: d.status === "Active" ? "Inactive" as DoctorStatus : "Active" as DoctorStatus } : d))
    setConfirm(null)
  }

  return (
    <div>
      <PageHeader title="Doctors" subtitle="Doctors assigned to Green Pine Medical Clinic" />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
        <SearchBar placeholder="Search doctors…" />
        <div className="flex gap-2">
          <select className="text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white text-slate-700">
            <option>All Specialties</option>
            <option>Cardiology</option>
            <option>Pediatrics</option>
            <option>Dermatology</option>
          </select>
          <select className="text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white text-slate-700">
            <option>All Status</option>
            <option>Active</option>
            <option>On Leave</option>
          </select>
        </div>
      </div>

      <Card>
        <div className="responsive-table">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3">DOCTOR</th>
                <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3">SPECIALTY</th>
                <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3">EXPERIENCE</th>
                <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3">SCHEDULE</th>
                <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3">APPTS TODAY</th>
                <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3">STATUS</th>
                <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {doctors.map(d => (
                <tr key={d.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <Avatar initials={d.avatar} color={d.color} size="sm" />
                      <div>
                        <p className="text-sm font-medium text-slate-800">{d.name}</p>
                        <p className="text-xs text-slate-400">{d.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-slate-600">{d.specialty}</td>
                  <td className="px-5 py-3.5 text-sm text-slate-600">{d.experience}</td>
                  <td className="px-5 py-3.5 text-xs text-slate-500">{d.schedule}</td>
                  <td className="px-5 py-3.5">
                    <span className="text-sm font-semibold text-slate-700">{d.appointments}</span>
                  </td>
                  <td className="px-5 py-3.5"><StatusBadge status={d.status} /></td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1.5">
                      <button className="px-2.5 py-1.5 text-xs text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-1">{Icons.eye} Profile</button>
                      <button className="px-2.5 py-1.5 text-xs text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-1">{Icons.calendar} Schedule</button>
                      <button onClick={() => setConfirm(d.id)}
                        className={`px-2.5 py-1.5 text-xs rounded-lg border transition-colors ${d.status === "Active" ? "text-red-600 border-red-200 hover:bg-red-50" : "text-emerald-600 border-emerald-200 hover:bg-emerald-50"}`}>
                        {d.status === "Active" ? "Deactivate" : "Activate"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <p className="text-xs text-slate-400 mt-3 px-1">Note: Doctor verification status is managed at the platform level and cannot be modified here.</p>

      <ConfirmDialog open={!!confirm} title="Change Doctor Status"
        message="This will change the doctor's availability at this clinic. Continue?"
        onConfirm={() => confirm && toggle(confirm)}
        onCancel={() => setConfirm(null)} />
    </div>
  )
}
