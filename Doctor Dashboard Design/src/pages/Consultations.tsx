import { useState } from "react";
import { Stethoscope, Save, CheckCircle, User, Clock, FileText, Pill } from "lucide-react";
import { todayAppointments, patients } from "../data/mockData";

export default function Consultations({ onToast }: { onToast: (msg: string) => void }) {
  const [activePatient, setActivePatient] = useState(todayAppointments[1]);
  const [notes, setNotes] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [treatmentPlan, setTreatmentPlan] = useState("");
  const [completed, setCompleted] = useState(false);

  const patient = patients.find((p) => p.name === activePatient.patient) || patients[0];

  const inProgressApts = todayAppointments.filter((a) => a.status === "in-progress" || a.status === "confirmed");

  const handleComplete = () => {
    setCompleted(true);
    onToast("Consultation completed and saved");
  };

  return (
    <div className="animate-fade-in space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Consultation Workspace</h1>
        {completed && (
          <span className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1.5 rounded-lg text-sm font-medium border border-green-200">
            <CheckCircle className="w-4 h-4" /> Consultation Completed
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-5">
        {/* Patient Selector */}
        <div className="xl:col-span-1 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <h3 className="font-semibold text-slate-900 text-sm mb-3">Active Queue</h3>
            <div className="space-y-2">
              {inProgressApts.map((apt) => (
                <button
                  key={apt.id}
                  onClick={() => { setActivePatient(apt); setCompleted(false); setNotes(""); setDiagnosis(""); }}
                  className={`w-full text-left p-3 rounded-lg border transition-all ${activePatient.id === apt.id ? "border-teal-500 bg-teal-50" : "border-slate-200 hover:bg-slate-50"}`}
                >
                  <div className="flex items-center gap-2.5">
                    <img src={apt.avatar} alt={apt.patient} className="w-8 h-8 rounded-full object-cover bg-slate-100 flex-shrink-0" />
                    <div className="min-w-0">
                      <div className={`font-medium text-sm truncate ${activePatient.id === apt.id ? "text-teal-700" : "text-slate-900"}`}>{apt.patient}</div>
                      <div className="text-xs text-slate-500">{apt.time} · {apt.type}</div>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-slate-500 truncate">{apt.reason}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Patient Info Panel */}
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="flex items-center gap-3 mb-3">
              <img src={activePatient.avatar} alt={activePatient.patient} className="w-10 h-10 rounded-full object-cover bg-slate-100" />
              <div>
                <div className="font-semibold text-slate-900 text-sm">{activePatient.patient}</div>
                <div className="text-xs text-slate-500">{patient.age}y · {patient.gender} · {patient.bloodType}</div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="bg-slate-50 rounded-lg p-2.5">
                <div className="text-xs font-semibold text-slate-500 mb-1">Conditions</div>
                {patient.conditions.map((c) => (
                  <div key={c} className="text-xs text-slate-700">{c}</div>
                ))}
              </div>
              <div className="bg-slate-50 rounded-lg p-2.5">
                <div className="text-xs font-semibold text-slate-500 mb-1">Previous Visits</div>
                <div className="text-xs text-slate-700">Last: {patient.lastVisit}</div>
                <div className="text-xs text-slate-500">3 appointments this year</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Consultation Form */}
        <div className="xl:col-span-3 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-center gap-3 mb-5 pb-4 border-b border-slate-100">
              <div className="w-9 h-9 bg-teal-50 rounded-lg flex items-center justify-center">
                <Stethoscope className="w-4 h-4 text-teal-600" />
              </div>
              <div>
                <div className="font-semibold text-slate-900">Consultation — {activePatient.reason}</div>
                <div className="text-xs text-slate-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {activePatient.time} · {activePatient.type}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-slate-700 block mb-1.5">
                  <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5 text-slate-400" /> Chief Complaint / Symptoms</span>
                </label>
                <textarea
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  placeholder="Describe presenting symptoms..."
                  rows={4}
                  className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-700 block mb-1.5">
                  <span className="flex items-center gap-1.5"><FileText className="w-3.5 h-3.5 text-slate-400" /> Diagnosis</span>
                </label>
                <textarea
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  placeholder="Enter clinical diagnosis and ICD codes..."
                  rows={4}
                  className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-700 block mb-1.5">Doctor Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Clinical observations, examination findings..."
                  rows={4}
                  className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-700 block mb-1.5">
                  <span className="flex items-center gap-1.5"><Pill className="w-3.5 h-3.5 text-slate-400" /> Treatment Plan</span>
                </label>
                <textarea
                  value={treatmentPlan}
                  onChange={(e) => setTreatmentPlan(e.target.value)}
                  placeholder="Treatment plan, lifestyle recommendations, follow-up..."
                  rows={4}
                  className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                />
              </div>
            </div>

            {/* Vitals */}
            <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div className="text-sm font-semibold text-slate-700 mb-3">Vitals</div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {[
                  { label: "Blood Pressure", placeholder: "120/80", unit: "mmHg" },
                  { label: "Heart Rate", placeholder: "72", unit: "bpm" },
                  { label: "Temperature", placeholder: "98.6", unit: "°F" },
                  { label: "SpO₂", placeholder: "98", unit: "%" },
                  { label: "Weight", placeholder: "165", unit: "lbs" },
                ].map((v) => (
                  <div key={v.label}>
                    <label className="text-xs text-slate-500 block mb-1">{v.label}</label>
                    <div className="flex items-center gap-1">
                      <input
                        placeholder={v.placeholder}
                        className="flex-1 min-w-0 text-sm border border-slate-200 bg-white rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                      <span className="text-xs text-slate-400 flex-shrink-0">{v.unit}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between pt-4 border-t border-slate-100">
              <div className="flex gap-2">
                <button onClick={() => onToast("Draft saved")} className="inline-flex items-center gap-2 border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
                  <Save className="w-4 h-4" /> Save Draft
                </button>
                <button className="inline-flex items-center gap-2 border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
                  <Pill className="w-4 h-4" /> Add Prescription
                </button>
              </div>
              <button
                onClick={handleComplete}
                disabled={completed}
                className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                <CheckCircle className="w-4 h-4" /> Complete Consultation
              </button>
            </div>
          </div>

          {/* Medical History */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="font-semibold text-slate-900 mb-3">Previous Consultations</h3>
            <div className="space-y-2">
              {[
                { date: "2026-07-15", reason: "Follow-Up: Cardiac Check-Up", diagnosis: "Hypertension — Well Controlled", doctor: "Dr. Mitchell" },
                { date: "2026-05-20", reason: "Routine Check-Up", diagnosis: "Stable CAD, medication adjusted", doctor: "Dr. Mitchell" },
                { date: "2026-02-10", reason: "Chest Pain Evaluation", diagnosis: "Angina — ruled out ACS", doctor: "Dr. Mitchell" },
              ].map((prev) => (
                <div key={prev.date} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="w-2 h-2 rounded-full bg-teal-400 mt-1.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium text-slate-900 text-sm">{prev.reason}</span>
                      <span className="text-xs text-slate-500 flex-shrink-0">{prev.date}</span>
                    </div>
                    <div className="text-xs text-slate-600 mt-0.5">{prev.diagnosis}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
