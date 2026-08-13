import { useState, useEffect } from "react";
import { DOCTORS, STAFF, APPOINTMENTS, PATIENTS, QUEUE, ROOMS, NOTIFICATIONS, ACTIVITY, PAYMENTS, type DoctorStatus, type StaffStatus, type QueueStatus, type RoomStatus } from "../data/mockData";
import { Avatar, Card, ConfirmDialog, Icons, PageHeader, SearchBar, StatCard, StatusBadge } from "../components/ui";

export default function PatientQueuePage() {
  const [queue, setQueue] = useState(QUEUE)
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30000)
    return () => clearInterval(t)
  }, [])

  const rowColor: Record<QueueStatus, string> = {
    "In Consultation": "border-l-4 border-violet-400",
    "Checked In": "border-l-4 border-blue-400",
    "Waiting": "border-l-4 border-yellow-400",
    "Completed": "border-l-4 border-emerald-300",
    "No Show": "border-l-4 border-red-300",
  }

  return (
    <div>
      <PageHeader title="Patient Queue" subtitle={`Live queue — ${now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "In Consultation", val: queue.filter(q => q.status === "In Consultation").length, color: "#7C3AED" },
          { label: "Checked In", val: queue.filter(q => q.status === "Checked In").length, color: "#2563EB" },
          { label: "Waiting", val: queue.filter(q => q.status === "Waiting").length, color: "#D97706" },
          { label: "Completed", val: queue.filter(q => q.status === "Completed").length, color: "#059669" },
        ].map(s => (
          <Card key={s.label} className="p-4">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">{s.label}</p>
            <p className="text-3xl font-bold mt-1" style={{ color: s.color }}>{s.val}</p>
          </Card>
        ))}
      </div>

      <Card>
        <div className="responsive-table">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                {["#", "PATIENT", "DOCTOR", "APPT TIME", "WAITING", "STATUS", "ACTIONS"].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-slate-500 px-5 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {queue.map(q => (
                <tr key={q.q} className={`hover:bg-slate-50 transition-colors ${rowColor[q.status]}`}>
                  <td className="px-5 py-3.5">
                    <span className="w-7 h-7 rounded-full bg-slate-100 text-slate-700 text-sm font-bold flex items-center justify-center">{q.q}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <Avatar initials={q.patient.split(" ").map(n => n[0]).join("")} color="#0891B2" size="sm" />
                      <span className="text-sm font-medium text-slate-800">{q.patient}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-slate-600">{q.doctor}</td>
                  <td className="px-5 py-3.5 text-sm font-mono text-slate-600">{q.time}</td>
                  <td className="px-5 py-3.5 text-sm text-slate-500">{q.waiting}</td>
                  <td className="px-5 py-3.5"><StatusBadge status={q.status} /></td>
                  <td className="px-5 py-3.5">
                    {q.status === "Waiting" && (
                      <button onClick={() => setQueue(prev => prev.map(item => item.q === q.q ? { ...item, status: "Checked In" as QueueStatus } : item))}
                        className="px-2.5 py-1.5 text-xs text-emerald-600 border border-emerald-200 rounded-lg hover:bg-emerald-50 transition-colors">
                        Check In
                      </button>
                    )}
                    {q.status === "Checked In" && (
                      <button className="px-2.5 py-1.5 text-xs text-violet-600 border border-violet-200 rounded-lg hover:bg-violet-50 transition-colors">
                        Start Consult
                      </button>
                    )}
                    {(q.status === "Completed" || q.status === "No Show") && (
                      <span className="text-xs text-slate-400">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
