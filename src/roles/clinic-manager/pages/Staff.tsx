import { useState, useEffect } from "react";
import { DOCTORS, STAFF, APPOINTMENTS, PATIENTS, QUEUE, ROOMS, NOTIFICATIONS, ACTIVITY, PAYMENTS, type DoctorStatus, type StaffStatus } from "../data/mockData";
import { Avatar, Card, ConfirmDialog, Icons, PageHeader, SearchBar, StatCard, StatusBadge } from "../components/ui";

export default function StaffPage() {
  const [showAdd, setShowAdd] = useState(false)
  const [confirm, setConfirm] = useState<string | null>(null)
  const [staff, setStaff] = useState(STAFF)

  const toggle = (id: string) => {
    setStaff(prev => prev.map(s => s.id === id ? { ...s, status: s.status === "Active" ? "Inactive" as StaffStatus : "Active" as StaffStatus } : s))
    setConfirm(null)
  }

  return (
    <div>
      <PageHeader title="Staff" subtitle="Receptionists and support staff at this clinic"
        action={<button onClick={() => setShowAdd(true)} className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">{Icons.plus} Add Staff</button>}
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
        <SearchBar placeholder="Search staff…" />
        <select className="text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white text-slate-700">
          <option>All Roles</option>
          <option>Receptionist</option>
          <option>Support Staff</option>
        </select>
      </div>

      <Card>
        <div className="responsive-table">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3">STAFF</th>
                <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3">ROLE</th>
                <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3">CONTACT</th>
                <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3">PERMISSIONS</th>
                <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3">LAST ACTIVE</th>
                <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3">STATUS</th>
                <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {staff.map(s => (
                <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <Avatar initials={s.name.split(" ").map(n => n[0]).join("")} color="#4F46E5" size="sm" />
                      <div>
                        <p className="text-sm font-medium text-slate-800">{s.name}</p>
                        <p className="text-xs text-slate-400">{s.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-slate-600">{s.role}</td>
                  <td className="px-5 py-3.5">
                    <p className="text-xs text-slate-600">{s.email}</p>
                    <p className="text-xs text-slate-400">{s.phone}</p>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex flex-wrap gap-1">
                      {s.permissions.map(p => <span key={p} className="px-1.5 py-0.5 bg-slate-100 text-slate-600 text-xs rounded">{p}</span>)}
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-xs text-slate-500">{s.lastActive}</td>
                  <td className="px-5 py-3.5"><StatusBadge status={s.status} /></td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1.5">
                      <button className="px-2.5 py-1.5 text-xs text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">{Icons.edit}</button>
                      <button className="px-2.5 py-1.5 text-xs text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors">Permissions</button>
                      <button onClick={() => setConfirm(s.id)}
                        className={`px-2.5 py-1.5 text-xs rounded-lg border transition-colors ${s.status === "Active" ? "text-red-600 border-red-200 hover:bg-red-50" : "text-emerald-600 border-emerald-200 hover:bg-emerald-50"}`}>
                        {s.status === "Active" ? "Deactivate" : "Activate"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setShowAdd(false)}>
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md mx-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-base font-semibold text-slate-900 mb-4">Add Staff Member</h3>
            <div className="space-y-3">
              {["Full Name", "Email", "Phone", "Role"].map(f => (
                <div key={f}>
                  <label className="block text-xs font-medium text-slate-500 mb-1">{f}</label>
                  {f === "Role"
                    ? <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"><option>Receptionist</option><option>Support Staff</option></select>
                    : <input className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200" placeholder={f} />
                  }
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-5 justify-end">
              <button onClick={() => setShowAdd(false)} className="px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">Cancel</button>
              <button onClick={() => setShowAdd(false)} className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">Add Staff</button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog open={!!confirm} title="Change Staff Status"
        message="This will change the staff member's access to the clinic system. Continue?"
        onConfirm={() => confirm && toggle(confirm)} onCancel={() => setConfirm(null)} />
    </div>
  )
}
