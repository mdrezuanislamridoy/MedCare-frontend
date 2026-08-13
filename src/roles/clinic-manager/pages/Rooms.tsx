import { useState, useEffect } from "react";
import { DOCTORS, STAFF, APPOINTMENTS, PATIENTS, QUEUE, ROOMS, NOTIFICATIONS, ACTIVITY, PAYMENTS, type DoctorStatus, type StaffStatus, type QueueStatus, type RoomStatus } from "../data/mockData";
import { Avatar, Card, ConfirmDialog, Icons, PageHeader, SearchBar, StatCard, StatusBadge } from "../components/ui";

export default function RoomsPage() {
  const [rooms, setRooms] = useState(ROOMS)
  const [confirm, setConfirm] = useState<string | null>(null)

  const cardColor: Record<RoomStatus, { bg: string; border: string; dot: string }> = {
    Available: { bg: "bg-emerald-50", border: "border-emerald-200", dot: "bg-emerald-500" },
    Occupied: { bg: "bg-red-50", border: "border-red-200", dot: "bg-red-500" },
    Reserved: { bg: "bg-blue-50", border: "border-blue-200", dot: "bg-blue-500" },
    Maintenance: { bg: "bg-amber-50", border: "border-amber-200", dot: "bg-amber-500" },
  }

  return (
    <div>
      <PageHeader title="Rooms" subtitle="Consultation room management and real-time availability" />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {(["Available", "Occupied", "Reserved", "Maintenance"] as RoomStatus[]).map(s => {
          const c = cardColor[s]
          return (
            <div key={s} className={`p-4 rounded-xl border ${c.bg} ${c.border}`}>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${c.dot}`} />
                <p className="text-xs font-medium text-slate-600">{s}</p>
              </div>
              <p className="text-2xl font-bold text-slate-800 mt-2">{rooms.filter(r => r.status === s).length}</p>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {rooms.map(r => {
          const c = cardColor[r.status]
          return (
            <Card key={r.id} className={`p-5 border-2 ${r.status === "Occupied" ? "border-red-200" : r.status === "Available" ? "border-emerald-200" : "border-slate-200"}`}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-base font-semibold text-slate-800">{r.name}</h3>
                  <p className="text-xs text-slate-400">{r.type}</p>
                </div>
                <StatusBadge status={r.status} />
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Doctor</span>
                  <span className="text-slate-700 font-medium">{r.doctor}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Patient</span>
                  <span className="text-slate-700 font-medium">{r.patient}</span>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                {r.status !== "Maintenance" && (
                  <button className="flex-1 py-1.5 text-xs border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors">Assign Doctor</button>
                )}
                <button onClick={() => setConfirm(r.id)}
                  className={`flex-1 py-1.5 text-xs border rounded-lg transition-colors ${r.status === "Maintenance" ? "border-emerald-200 text-emerald-600 hover:bg-emerald-50" : "border-amber-200 text-amber-600 hover:bg-amber-50"}`}>
                  {r.status === "Maintenance" ? "Mark Available" : "Maintenance"}
                </button>
              </div>
            </Card>
          )
        })}
      </div>

      <ConfirmDialog open={!!confirm} title="Update Room Status"
        message="This will change the room's status. Any active bookings may be affected."
        onConfirm={() => {
          if (confirm) {
            setRooms(prev => prev.map(r => r.id === confirm ? { ...r, status: r.status === "Maintenance" ? "Available" as RoomStatus : "Maintenance" as RoomStatus } : r))
            setConfirm(null)
          }
        }}
        onCancel={() => setConfirm(null)} />
    </div>
  )
}
