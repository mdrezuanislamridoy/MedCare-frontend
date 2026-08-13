import { useState } from "react";
import { APPOINTMENTS, QUEUE, DOCTORS, PATIENTS, NOTIFICATIONS, ACTIVITY, type Appointment, type AppointmentStatus, type DoctorStatus } from "../data/mockData";
import { Avatar, ConfirmDialog, DoctorDot, EmptyState, PaymentBadge, StatusBadge } from "../components/ui";

export default function DoctorsView() {
  const doctorSchedule: Record<string, { time: string; patient: string; type: string }[]> = {
    "Dr. Amir Patel": [
      { time: "08:30 AM", patient: "Sarah Mitchell", type: "General" },
      { time: "09:30 AM", patient: "Maria Santos", type: "Consultation" },
      { time: "11:30 AM", patient: "Priya Nair", type: "Consultation" },
      { time: "02:30 PM", patient: "Kevin Adeyemi", type: "Consultation" },
    ],
    "Dr. Linda Cho": [
      { time: "09:00 AM", patient: "James Thornton", type: "Follow-Up" },
      { time: "10:30 AM", patient: "Elena Vasquez", type: "General" },
      { time: "01:00 PM", patient: "Aisha Kamara", type: "General" },
    ],
    "Dr. Raj Mehta": [
      { time: "10:00 AM", patient: "Daniel Okafor", type: "Check-Up" },
      { time: "11:00 AM", patient: "Thomas Kim", type: "Follow-Up" },
      { time: "01:30 PM", patient: "Nathan Brooks", type: "Follow-Up" },
    ],
    "Dr. Sarah Quinn": [
      { time: "12:00 PM", patient: "Robert Walsh", type: "Procedure" },
      { time: "02:00 PM", patient: "Claire Dupont", type: "Check-Up" },
    ],
  }

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {DOCTORS.map(d => (
          <div key={d.name} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-5 border-b border-gray-50">
              <div className="flex items-center gap-4">
                <Avatar initials={d.avatar} size="lg" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900">{d.name}</h3>
                    <DoctorDot status={d.status} />
                  </div>
                  <p className="text-sm text-gray-400">{d.specialty}</p>
                </div>
                <StatusBadge status={d.status} />
              </div>
              <div className="grid grid-cols-3 gap-3 mt-4">
                {[
                  ["Room", d.room],
                  ["Queue", `${d.queue} waiting`],
                  ["Next", d.nextAppt],
                ].map(([k, v]) => (
                  <div key={k} className="bg-gray-50 rounded-lg px-3 py-2">
                    <p className="text-[10px] text-gray-400 uppercase tracking-wide">{k}</p>
                    <p className="text-sm font-semibold text-gray-800 mono mt-0.5">{v}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="px-5 py-3">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Today's Schedule</p>
              <div className="space-y-1.5">
                {(doctorSchedule[d.name] || []).map(s => (
                  <div key={s.time} className="flex items-center gap-3">
                    <span className="mono text-[11px] text-gray-400 w-16">{s.time}</span>
                    <span className="text-xs text-gray-700">{s.patient}</span>
                    <span className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded ml-auto">{s.type}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
