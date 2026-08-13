import { useState } from "react";
import { APPOINTMENTS, QUEUE, DOCTORS, PATIENTS, NOTIFICATIONS, ACTIVITY, type Appointment, type AppointmentStatus, type DoctorStatus } from "../data/mockData";
import { Avatar, ConfirmDialog, DoctorDot, EmptyState, PaymentBadge, StatusBadge } from "../components/ui";

export default function CheckInView({ showToast }: { showToast: (m: string) => void }) {
  const [step, setStep] = useState(0)
  const [selected, setSelected] = useState<Appointment | null>(null)
  const [queueNum, setQueueNum] = useState<number | null>(null)
  const [room, setRoom] = useState("")
  const [search, setSearch] = useState("")

  const pending = APPOINTMENTS.filter(a => a.status === "Confirmed" &&
    (a.patient.toLowerCase().includes(search.toLowerCase()) || a.id.toLowerCase().includes(search.toLowerCase())))

  const steps = ["Find Appointment", "Verify Patient", "Confirm Details", "Assign Queue", "Assign Room", "Complete"]

  const reset = () => { setStep(0); setSelected(null); setQueueNum(null); setRoom("") }

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Steps */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center gap-0">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-0 flex-1 min-w-0">
              <div className="flex flex-col items-center min-w-0">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${i < step ? "bg-emerald-500 text-white" : i === step ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-400"}`}>
                  {i < step ? "✓" : i + 1}
                </div>
                <span className={`text-[10px] mt-1 text-center hidden sm:block truncate max-w-16 ${i === step ? "text-blue-600 font-semibold" : "text-gray-400"}`}>{s}</span>
              </div>
              {i < steps.length - 1 && <div className={`flex-1 h-0.5 mx-1 mb-4 ${i < step ? "bg-emerald-400" : "bg-gray-200"}`} />}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        {step === 0 && (
          <div className="space-y-4">
            <h2 className="font-semibold text-gray-900">Find Patient Appointment</h2>
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 max-w-sm">
              <span className="text-gray-400">🔍</span>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or appointment ID…" className="bg-transparent text-sm outline-none flex-1 placeholder:text-gray-400" />
            </div>
            {search && pending.length === 0 && <EmptyState icon="🔍" title="No matching appointments" sub="Check the name or appointment ID" />}
            <div className="space-y-2">
              {pending.map(a => (
                <button key={a.id} onClick={() => { setSelected(a); setStep(1) }}
                  className="w-full flex items-center gap-4 border border-gray-200 rounded-xl p-4 hover:border-blue-300 hover:bg-blue-50/30 transition-colors text-left">
                  <Avatar initials={a.avatar} size="md" />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{a.patient}</p>
                    <p className="text-sm text-gray-500">{a.doctor} · {a.type} · {a.time}</p>
                  </div>
                  <div>
                    <span className="mono text-xs text-blue-600">{a.id}</span>
                    <PaymentBadge status={a.payment} />
                  </div>
                  <span className="text-blue-500">›</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 1 && selected && (
          <div className="space-y-4 max-w-lg">
            <h2 className="font-semibold text-gray-900">Verify Patient Identity</h2>
            <div className="flex items-center gap-4 bg-blue-50 rounded-xl p-4 border border-blue-100">
              <Avatar initials={selected.avatar} size="lg" />
              <div>
                <p className="font-bold text-gray-900 text-lg">{selected.patient}</p>
                <p className="text-sm text-gray-500">{selected.doctor}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[["Appointment ID", selected.id], ["Date", "Aug 13, 2026"], ["Time", selected.time], ["Type", selected.type], ["Payment", selected.payment]].map(([k, v]) => (
                <div key={k} className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-400">{k}</p>
                  <p className="text-sm font-medium text-gray-800 mt-0.5">{v}</p>
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-500">Please ask the patient to confirm their name and date of birth before proceeding.</p>
            <div className="flex gap-3">
              <button onClick={reset} className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-50">Back</button>
              <button onClick={() => setStep(2)} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">Identity Confirmed →</button>
            </div>
          </div>
        )}

        {step === 2 && selected && (
          <div className="space-y-4 max-w-lg">
            <h2 className="font-semibold text-gray-900">Confirm Appointment Details</h2>
            <div className="space-y-2">
              {[
                ["Patient Name", selected.patient],
                ["Appointment ID", selected.id],
                ["Doctor", selected.doctor],
                ["Appointment Time", selected.time],
                ["Appointment Type", selected.type],
                ["Payment Status", selected.payment],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between items-center py-2 border-b border-gray-50">
                  <span className="text-sm text-gray-500">{k}</span>
                  <span className="text-sm font-medium text-gray-900">{v}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-50">Back</button>
              <button onClick={() => setStep(3)} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">Details Confirmed →</button>
            </div>
          </div>
        )}

        {step === 3 && selected && (
          <div className="space-y-4 max-w-md">
            <h2 className="font-semibold text-gray-900">Assign Queue Number</h2>
            <p className="text-sm text-gray-500">The next available queue number will be assigned to this patient.</p>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-8 text-center">
              <p className="text-xs text-blue-500 uppercase tracking-widest font-semibold mb-2">Queue Number</p>
              <p className="text-7xl font-bold text-blue-600 mono">{queueNum || "—"}</p>
              {!queueNum && <p className="text-xs text-gray-400 mt-3">Click Assign to generate queue number</p>}
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(2)} className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-50">Back</button>
              {!queueNum ? (
                <button onClick={() => setQueueNum(QUEUE.length + 1)} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">Assign Queue #{QUEUE.length + 1}</button>
              ) : (
                <button onClick={() => setStep(4)} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">Next →</button>
              )}
            </div>
          </div>
        )}

        {step === 4 && selected && (
          <div className="space-y-4 max-w-md">
            <h2 className="font-semibold text-gray-900">Assign Room</h2>
            <p className="text-sm text-gray-500">Select an available room for the patient.</p>
            <div className="grid grid-cols-3 gap-2">
              {["101", "102", "201", "203", "301", "305"].map(r => (
                <button key={r} onClick={() => setRoom(r)}
                  className={`py-3 rounded-xl border-2 text-sm font-semibold transition-colors ${room === r ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-200 text-gray-600 hover:border-blue-200 hover:bg-blue-50/30"}`}>
                  Room {r}
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(3)} className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-50">Back</button>
              <button disabled={!room} onClick={() => setStep(5)} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed">
                {room ? `Assign Room ${room} →` : "Select a Room"}
              </button>
            </div>
          </div>
        )}

        {step === 5 && selected && (
          <div className="space-y-4 max-w-md text-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-3xl mx-auto">✅</div>
            <h2 className="font-bold text-gray-900 text-xl">Check-In Complete!</h2>
            <p className="text-gray-500">{selected.patient} has been successfully checked in.</p>
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-left space-y-2">
              {[
                ["Patient", selected.patient],
                ["Doctor", selected.doctor],
                ["Queue Number", `#${queueNum}`],
                ["Room", `Room ${room}`],
                ["Check-In Time", new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between text-sm">
                  <span className="text-gray-500">{k}</span>
                  <span className="font-semibold text-gray-800">{v}</span>
                </div>
              ))}
            </div>
            <button onClick={() => { showToast(`${selected.patient} checked in successfully`); reset() }} className="px-6 py-2.5 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors">
              Done — Next Patient
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
