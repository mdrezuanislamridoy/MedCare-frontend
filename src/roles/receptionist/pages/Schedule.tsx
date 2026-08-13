import { useState } from "react";
import { APPOINTMENTS, QUEUE, DOCTORS, PATIENTS, NOTIFICATIONS, ACTIVITY, type Appointment, type AppointmentStatus, type DoctorStatus } from "../data/mockData";
import { Avatar, ConfirmDialog, DoctorDot, EmptyState, PaymentBadge, StatusBadge } from "../components/ui";

export default function ScheduleView({ showToast }: { showToast: (m: string) => void }) {
  const hours = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"]
  const colors = ["bg-blue-100 border-blue-300 text-blue-800", "bg-purple-100 border-purple-300 text-purple-800", "bg-indigo-100 border-indigo-300 text-indigo-800", "bg-teal-100 border-teal-300 text-teal-800"]

  const doctorSlots: Record<string, { hour: string; patient: string; type: string }[]> = {
    "Dr. Patel": [
      { hour: "08:00", patient: "S. Mitchell", type: "General" },
      { hour: "09:00", patient: "M. Santos", type: "Consult" },
      { hour: "11:00", patient: "P. Nair", type: "Consult" },
      { hour: "14:00", patient: "K. Adeyemi", type: "Consult" },
    ],
    "Dr. Cho": [
      { hour: "09:00", patient: "J. Thornton", type: "Follow-Up" },
      { hour: "10:00", patient: "E. Vasquez", type: "General" },
      { hour: "13:00", patient: "A. Kamara", type: "General" },
    ],
    "Dr. Mehta": [
      { hour: "10:00", patient: "D. Okafor", type: "Check-Up" },
      { hour: "11:00", patient: "T. Kim", type: "Follow-Up" },
      { hour: "13:00", patient: "N. Brooks", type: "Follow-Up" },
    ],
    "Dr. Quinn": [
      { hour: "12:00", patient: "R. Walsh", type: "Procedure" },
      { hour: "14:00", patient: "C. Dupont", type: "Check-Up" },
    ],
  }

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Doctor Schedules — August 13, 2026</h2>
          <button onClick={() => showToast("New appointment slot opened")} className="text-sm bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors">
            + Schedule Appointment
          </button>
        </div>

        <div className="responsive-table">
          <div className="min-w-[700px]">
            <div className="grid gap-0" style={{ gridTemplateColumns: "80px repeat(4, 1fr)" }}>
              {/* Header */}
              <div className="bg-gray-50/60 px-2 py-3 border-b border-r border-gray-100" />
              {Object.keys(doctorSlots).map((d, i) => (
                <div key={d} className="bg-gray-50/60 px-3 py-3 border-b border-r border-gray-100 last:border-r-0">
                  <p className="text-xs font-semibold text-gray-700">{d}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{["Gen. Practice", "Int. Medicine", "Cardiology", "Pediatrics"][i]}</p>
                </div>
              ))}

              {hours.map(hour => (
                <div key={hour} className="contents">
                  <div className="px-2 py-4 border-b border-r border-gray-50 flex items-start">
                    <span className="mono text-[11px] text-gray-400">{hour}</span>
                  </div>
                  {Object.entries(doctorSlots).map(([doc, slots], di) => {
                    const slot = slots.find(s => s.hour === hour)
                    const isBreak = doc === "Dr. Quinn" && hour === "12:00"
                    return (
                      <div key={doc} className="px-2 py-2 border-b border-r border-gray-50 last:border-r-0 min-h-[52px]">
                        {slot ? (
                          <div className={`text-[11px] px-2 py-1.5 rounded border ${colors[di]} font-medium leading-tight`}>
                            <p className="truncate">{slot.patient}</p>
                            <p className="opacity-70 mt-0.5">{slot.type}</p>
                          </div>
                        ) : isBreak ? (
                          <div className="text-[11px] px-2 py-1.5 rounded bg-orange-50 border border-orange-200 text-orange-600">
                            Break
                          </div>
                        ) : (
                          <button onClick={() => showToast("Slot selected for booking")} className="w-full h-full min-h-[38px] rounded border-2 border-dashed border-gray-100 hover:border-blue-300 hover:bg-blue-50/30 transition-colors text-[10px] text-gray-300 hover:text-blue-400">
                            + Book
                          </button>
                        )}
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Room availability */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <h3 className="font-semibold text-gray-900 mb-3">Room Availability</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
          {[
            { room: "101", status: "In Use", doc: "Dr. Patel" },
            { room: "102", status: "Available", doc: "" },
            { room: "201", status: "Available", doc: "" },
            { room: "203", status: "In Use", doc: "Dr. Cho" },
            { room: "301", status: "Available", doc: "" },
            { room: "305", status: "In Use", doc: "Dr. Mehta" },
          ].map(r => (
            <div key={r.room} className={`rounded-xl border px-4 py-3 text-center ${r.status === "In Use" ? "bg-amber-50 border-amber-200" : "bg-emerald-50 border-emerald-200"}`}>
              <p className="mono font-bold text-lg text-gray-800">R{r.room}</p>
              <p className={`text-xs font-semibold mt-1 ${r.status === "In Use" ? "text-amber-700" : "text-emerald-700"}`}>{r.status}</p>
              {r.doc && <p className="text-[10px] text-gray-400 mt-0.5">{r.doc}</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
