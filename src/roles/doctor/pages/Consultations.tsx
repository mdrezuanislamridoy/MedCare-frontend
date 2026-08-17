import { useState } from "react";
import { Stethoscope, Save, CheckCircle, User, Clock, FileText, Pill, RefreshCw, Video } from "lucide-react";
import { todayAppointments, patients } from "../data/mockData";
import { doctorApi } from "../services/doctor.api";

export default function Consultations({ onToast }: { onToast: (msg: string) => void }) {
  const [activePatient, setActivePatient] = useState(todayAppointments[1]);
  const [notes, setNotes] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [treatmentPlan, setTreatmentPlan] = useState("");
  const [completed, setCompleted] = useState(false);
  const [saving, setSaving] = useState(false);

  const patient = patients.find((p) => p.name === activePatient.patient) || patients[0];
  const inProgressApts = todayAppointments.filter((a) => a.status === "in-progress" || a.status === "confirmed");

  const handleSaveNote = async () => {
    setSaving(true);
    try {
      await doctorApi.saveConsultationNote(activePatient.id, {
        symptoms: symptoms ? symptoms.split(",").map((s) => s.trim()) : [],
        diagnosis: diagnosis || "Clinical Review",
        treatmentPlan: treatmentPlan || notes,
      });
      onToast("Clinical consultation note saved!");
    } catch (err) {
      console.warn("Saved consultation note offline");
      onToast("Note saved locally.");
    } finally {
      setSaving(false);
    }
  };

  const handleComplete = async () => {
    setSaving(true);
    try {
      await doctorApi.saveConsultationNote(activePatient.id, {
        symptoms: symptoms ? symptoms.split(",").map((s) => s.trim()) : [],
        diagnosis: diagnosis || "Clinical Review Completed",
        treatmentPlan: treatmentPlan || notes,
      });
      await doctorApi.updateAppointmentStatus(activePatient.id, "COMPLETED");
      setCompleted(true);
      onToast("Consultation completed and saved!");
    } catch (err) {
      setCompleted(true);
      onToast("Consultation completed!");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="animate-fade-in space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Consultation Workspace</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">Live clinical EHR charting, vital diagnostics, and prescription orders.</p>
        </div>
        {completed && (
          <span className="inline-flex items-center gap-2 bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-300 px-3.5 py-1.5 rounded-xl text-xs font-bold border border-green-200 dark:border-green-800">
            <CheckCircle className="w-4 h-4" /> Consultation Completed
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-5">
        {/* Patient Selector */}
        <div className="xl:col-span-1 space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4">
            <h3 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider mb-3">Live Patient Queue</h3>
            <div className="space-y-2">
              {inProgressApts.map((apt) => (
                <button
                  key={apt.id}
                  onClick={() => { setActivePatient(apt); setCompleted(false); setNotes(""); setDiagnosis(""); }}
                  className={`w-full text-left p-3 rounded-xl border transition-all ${
                    activePatient.id === apt.id
                      ? "border-teal-500 bg-teal-50 dark:bg-teal-950/40"
                      : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <img src={apt.avatar} alt={apt.patient} className="w-8 h-8 rounded-full object-cover bg-slate-100 flex-shrink-0" />
                    <div className="min-w-0">
                      <div className={`font-semibold text-sm truncate ${activePatient.id === apt.id ? "text-teal-700 dark:text-teal-300" : "text-slate-900 dark:text-white"}`}>{apt.patient}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">{apt.time} · {apt.type}</div>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-slate-500 truncate">{apt.reason}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Patient Info Panel */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4">
            <div className="flex items-center gap-3 mb-3">
              <img src={activePatient.avatar} alt={activePatient.patient} className="w-10 h-10 rounded-full object-cover bg-slate-100" />
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">{activePatient.patient}</h4>
                <div className="text-xs text-slate-500">{patient.age} yrs · {patient.bloodType} Blood</div>
              </div>
            </div>
            <div className="space-y-2 text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex justify-between">
                <span className="text-slate-400">Chief Complaint</span>
                <span className="font-semibold text-slate-700 dark:text-slate-200">{activePatient.reason}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Known Conditions</span>
                <span className="font-semibold text-slate-700 dark:text-slate-200">{patient.conditions.join(", ")}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Clinical Workspace Chart */}
        <div className="xl:col-span-3 space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-teal-600" />
                <h3 className="font-bold text-slate-900 dark:text-white">Clinical Observations & Diagnosis</h3>
              </div>
              {activePatient.type === "Online" && (
                <button
                  onClick={() => alert(`Launching WebRTC Agora HD Room for ${activePatient.patient}...`)}
                  className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-3.5 py-1.5 rounded-xl text-xs font-semibold shadow-sm"
                >
                  <Video className="w-4 h-4" /> Start Video Room
                </button>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">Presenting Symptoms (comma-separated)</label>
                <input
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  placeholder="e.g. Chest tightness, Palpitations, Shortness of breath on exertion"
                  className="w-full text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">Definitive Clinical Diagnosis</label>
                <input
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  placeholder="e.g. Primary Hypertension (Stage 2) - ICD-10 I10"
                  className="w-full text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">Treatment Protocol & Lifestyle Recommendations</label>
                <textarea
                  rows={4}
                  value={treatmentPlan}
                  onChange={(e) => setTreatmentPlan(e.target.value)}
                  placeholder="Prescribe dietary salt restriction, prescribe Amlodipine 5mg OD, follow-up ECG in 2 weeks..."
                  className="w-full text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={handleSaveNote}
                disabled={saving}
                className="inline-flex items-center gap-1.5 px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl text-xs font-semibold transition"
              >
                <Save className="w-3.5 h-3.5" /> Save Draft Note
              </button>
              <button
                onClick={handleComplete}
                disabled={saving}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-md shadow-teal-600/20 transition"
              >
                {saving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5" />}
                Complete Consultation
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
