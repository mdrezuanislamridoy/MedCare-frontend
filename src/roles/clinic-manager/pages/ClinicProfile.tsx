import { useState, useEffect } from "react";
import { DOCTORS, STAFF, APPOINTMENTS, PATIENTS, QUEUE, ROOMS, NOTIFICATIONS, ACTIVITY, PAYMENTS, type DoctorStatus, type StaffStatus } from "../data/mockData";
import { Avatar, Card, ConfirmDialog, Icons, PageHeader, SearchBar, StatCard, StatusBadge } from "../components/ui";

export default function ClinicProfilePage() {
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState("Green Pine Medical Clinic")
  const [address, setAddress] = useState("1420 Birchwood Ave, Suite 300, Portland, OR 97201")
  const [phone, setPhone] = useState("+1 (503) 555-0192")
  const [email, setEmail] = useState("contact@greenpine.health")

  const services = ["General Practice", "Cardiology", "Pediatrics", "Dermatology", "Orthopedics", "Physical Therapy"]
  const facilities = ["Waiting Room", "X-Ray Room", "Lab", "6 Consultation Rooms", "Reception", "Pharmacy Referral"]
  const hours = [
    { day: "Monday", open: "8:00 AM", close: "6:00 PM" },
    { day: "Tuesday", open: "8:00 AM", close: "6:00 PM" },
    { day: "Wednesday", open: "8:00 AM", close: "6:00 PM" },
    { day: "Thursday", open: "8:00 AM", close: "6:00 PM" },
    { day: "Friday", open: "8:00 AM", close: "5:00 PM" },
    { day: "Saturday", open: "9:00 AM", close: "2:00 PM" },
    { day: "Sunday", open: "Closed", close: "" },
  ]

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader title="Clinic Profile" subtitle="Manage clinic details, working hours, services, and facilities"
        action={<button onClick={() => setEditing(!editing)} className={`px-4 py-2 text-sm rounded-lg font-medium transition-colors ${editing ? "bg-blue-600 text-white hover:bg-blue-700" : "border border-slate-200 text-slate-700 hover:bg-slate-50"}`}>{editing ? "Save Changes" : "Edit Profile"}</button>}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card className="p-5">
          <h3 className="text-sm font-semibold text-slate-800 mb-4">Basic Information</h3>
          <div className="space-y-4">
            {[
              { label: "Clinic Name", val: name, set: setName },
              { label: "Address", val: address, set: setAddress },
              { label: "Phone", val: phone, set: setPhone },
              { label: "Email", val: email, set: setEmail },
            ].map(f => (
              <div key={f.label}>
                <label className="block text-xs font-medium text-slate-500 mb-1">{f.label}</label>
                {editing
                  ? <input value={f.val} onChange={e => f.set(e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400" />
                  : <p className="text-sm text-slate-700">{f.val}</p>
                }
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="text-sm font-semibold text-slate-800 mb-4">Working Hours</h3>
          <div className="space-y-2">
            {hours.map(h => (
              <div key={h.day} className="flex items-center justify-between py-1.5 border-b border-slate-100 last:border-0">
                <span className="text-sm text-slate-600 w-24">{h.day}</span>
                {h.open === "Closed"
                  ? <span className="text-xs text-slate-400 font-medium">Closed</span>
                  : <span className="text-sm text-slate-700 font-mono text-xs">{h.open} — {h.close}</span>
                }
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="text-sm font-semibold text-slate-800 mb-4">Services Offered</h3>
          <div className="flex flex-wrap gap-2">
            {services.map(s => <span key={s} className="px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-medium rounded-full ring-1 ring-blue-200">{s}</span>)}
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="text-sm font-semibold text-slate-800 mb-4">Facilities</h3>
          <div className="flex flex-wrap gap-2">
            {facilities.map(f => <span key={f} className="px-3 py-1.5 bg-slate-100 text-slate-600 text-xs font-medium rounded-full ring-1 ring-slate-200">{f}</span>)}
          </div>
        </Card>
      </div>

      <Card className="p-5">
        <h3 className="text-sm font-semibold text-slate-800 mb-4">Consultation Types</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { type: "New Patient", duration: "45 min", fee: "$120" },
            { type: "Follow-up", duration: "20 min", fee: "$80" },
            { type: "Specialist Consult", duration: "30 min", fee: "$150" },
            { type: "Pediatric Check", duration: "30 min", fee: "$110" },
          ].map(c => (
            <div key={c.type} className="p-3 border border-slate-200 rounded-lg">
              <p className="text-sm font-medium text-slate-700">{c.type}</p>
              <p className="text-xs text-slate-400 mt-1">{c.duration} · {c.fee}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
