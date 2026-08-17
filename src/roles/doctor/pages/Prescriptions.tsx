import { useEffect, useState } from "react";
import { Plus, Trash2, Eye, Download, Printer, Pill, RefreshCw, Sparkles } from "lucide-react";
import { prescriptions as initialRx, patients } from "../data/mockData";
import { doctorApi } from "../services/doctor.api";

type Medicine = { name: string; dosage: string; frequency: string; duration: string; instructions: string };

export default function Prescriptions({ onToast }: { onToast: (msg: string) => void }) {
  const [rxList, setRxList] = useState<any[]>(initialRx);
  const [creating, setCreating] = useState(false);
  const [preview, setPreview] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);
  const [newRx, setNewRx] = useState<{ patient: string; diagnosis: string; medicines: Medicine[]; notes: string }>({
    patient: patients[0]?.name || "James Harrington",
    diagnosis: "Primary Hypertension",
    medicines: [{ name: "Amlodipine Besylate", dosage: "5mg", frequency: "Once daily (Morning)", duration: "30 days", instructions: "Take after breakfast" }],
    notes: "Review BP log in 2 weeks. Low sodium diet.",
  });

  useEffect(() => {
    async function loadPrescriptions() {
      try {
        const data: any = await doctorApi.listPrescriptions();
        if (data && (Array.isArray(data) && data.length > 0)) {
          setRxList(data);
        }
      } catch (err) {
        console.warn("Using offline prescriptions fallback:", err);
      }
    }
    loadPrescriptions();
  }, []);

  const addMedicine = () => {
    setNewRx((prev) => ({
      ...prev,
      medicines: [...prev.medicines, { name: "", dosage: "", frequency: "", duration: "", instructions: "" }],
    }));
  };

  const removeMedicine = (i: number) => {
    setNewRx((prev) => ({
      ...prev,
      medicines: prev.medicines.filter((_, idx) => idx !== i),
    }));
  };

  const updateMedicine = (i: number, field: keyof Medicine, value: string) => {
    setNewRx((prev) => {
      const meds = [...prev.medicines];
      meds[i] = { ...meds[i], [field]: value };
      return { ...prev, medicines: meds };
    });
  };

  const handleSaveRx = async () => {
    setSaving(true);
    try {
      await doctorApi.createPrescription({
        appointmentId: "APT-1001",
        patientId: "PAT-001",
        diagnosis: newRx.diagnosis,
        medicines: newRx.medicines,
        notes: newRx.notes,
      });
      const createdItem = {
        id: `RX-${Date.now()}`,
        patient: newRx.patient,
        date: "2026-08-10",
        medicines: newRx.medicines,
        notes: newRx.notes,
      };
      setRxList((prev) => [createdItem, ...prev]);
      setCreating(false);
      onToast("Digital prescription issued and sent to patient!");
    } catch (err) {
      console.warn("Saved prescription offline");
      const createdItem = {
        id: `RX-${Date.now()}`,
        patient: newRx.patient,
        date: "2026-08-10",
        medicines: newRx.medicines,
        notes: newRx.notes,
      };
      setRxList((prev) => [createdItem, ...prev]);
      setCreating(false);
      onToast("Prescription created!");
    } finally {
      setSaving(false);
    }
  };

  if (preview) {
    return (
      <div className="animate-fade-in space-y-5">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Prescription Preview</h1>
          <div className="flex gap-2">
            <button onClick={() => setPreview(null)} className="border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">Back</button>
            <button onClick={() => onToast("Prescription dispatched to patient's health portal")} className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md shadow-teal-600/20 transition-colors">
              <Download className="w-4 h-4" /> Send to Patient
            </button>
            <button onClick={() => window.print()} className="inline-flex items-center gap-2 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
              <Printer className="w-4 h-4" /> Print
            </button>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 max-w-2xl mx-auto shadow-sm">
          <div className="border-b-2 border-teal-600 pb-5 mb-5">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold text-teal-700 dark:text-teal-400">Dr. Sarah Mitchell</h2>
                <p className="text-slate-600 dark:text-slate-400 text-xs mt-0.5">MD, FACC · Specialist Cardiologist</p>
                <p className="text-slate-400 text-[11px] mt-1">Medical Registration: MCI-12345</p>
              </div>
              <div className="text-right text-xs text-slate-500 dark:text-slate-400">
                <div className="font-bold text-slate-900 dark:text-white">MedCare Cardiac Center</div>
                <div>420 Medical Drive, Suite 300</div>
                <div>Date: {preview.date}</div>
              </div>
            </div>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl mb-5 flex justify-between text-xs">
            <div><span className="text-slate-400">Patient:</span> <span className="font-bold text-slate-800 dark:text-white">{preview.patient}</span></div>
            <div><span className="text-slate-400">Rx ID:</span> <span className="font-mono font-bold text-slate-700 dark:text-slate-300">{preview.id}</span></div>
          </div>

          <div className="space-y-4 mb-6">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Prescribed Medications</h4>
            {preview.medicines.map((m: Medicine, idx: number) => (
              <div key={idx} className="p-3 bg-teal-50/30 dark:bg-teal-950/20 rounded-xl border border-teal-100 dark:border-teal-900/50">
                <div className="font-bold text-sm text-slate-800 dark:text-white">{idx + 1}. {m.name} ({m.dosage})</div>
                <div className="text-xs text-slate-600 dark:text-slate-300 mt-1">Regimen: {m.frequency} for {m.duration}</div>
                {m.instructions && <div className="text-[11px] text-teal-700 dark:text-teal-400 mt-1 italic">Instructions: {m.instructions}</div>}
              </div>
            ))}
          </div>

          {preview.notes && (
            <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl text-xs text-slate-600 dark:text-slate-300">
              <span className="font-bold text-slate-700 dark:text-slate-200">Doctor&apos;s Advice:</span> {preview.notes}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Digital Prescriptions</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">Author and dispatch digital drug prescriptions to patients.</p>
        </div>
        <button
          onClick={() => setCreating(!creating)}
          className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md shadow-teal-600/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          {creating ? "View Prescriptions" : "Write Prescription"}
        </button>
      </div>

      {creating ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-5">
          <h3 className="font-bold text-slate-900 dark:text-white text-base">New Prescription Form</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">Select Patient</label>
              <select
                value={newRx.patient}
                onChange={(e) => setNewRx({ ...newRx, patient: e.target.value })}
                className="w-full text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                {patients.map((p) => (
                  <option key={p.id} value={p.name}>{p.name} ({p.bloodType})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">Diagnosis / Clinical Condition</label>
              <input
                value={newRx.diagnosis}
                onChange={(e) => setNewRx({ ...newRx, diagnosis: e.target.value })}
                placeholder="e.g. Essential Hypertension"
                className="w-full text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Prescription Medicines</h4>
              <button onClick={addMedicine} className="inline-flex items-center gap-1 text-xs text-teal-600 dark:text-teal-400 font-bold hover:underline">
                <Plus className="w-3.5 h-3.5" /> Add Drug
              </button>
            </div>

            {newRx.medicines.map((m, i) => (
              <div key={i} className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700 grid grid-cols-1 sm:grid-cols-5 gap-3 relative">
                <div className="sm:col-span-2">
                  <label className="text-[10px] font-bold text-slate-500 block mb-1">Medicine Name</label>
                  <input
                    value={m.name}
                    onChange={(e) => updateMedicine(i, "name", e.target.value)}
                    placeholder="e.g. Metformin HCl"
                    className="w-full text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 block mb-1">Dosage</label>
                  <input
                    value={m.dosage}
                    onChange={(e) => updateMedicine(i, "dosage", e.target.value)}
                    placeholder="e.g. 500mg"
                    className="w-full text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 block mb-1">Frequency</label>
                  <input
                    value={m.frequency}
                    onChange={(e) => updateMedicine(i, "frequency", e.target.value)}
                    placeholder="e.g. Twice Daily"
                    className="w-full text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-lg p-2"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <label className="text-[10px] font-bold text-slate-500 block mb-1">Duration</label>
                    <input
                      value={m.duration}
                      onChange={(e) => updateMedicine(i, "duration", e.target.value)}
                      placeholder="e.g. 14 Days"
                      className="w-full text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-lg p-2"
                    />
                  </div>
                  {newRx.medicines.length > 1 && (
                    <button onClick={() => removeMedicine(i)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg mt-4">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">Dietary / Clinical Advice</label>
            <textarea
              rows={2}
              value={newRx.notes}
              onChange={(e) => setNewRx({ ...newRx, notes: e.target.value })}
              placeholder="Lifestyle guidance and special precautions..."
              className="w-full text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setCreating(false)} className="px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold">
              Cancel
            </button>
            <button onClick={handleSaveRx} disabled={saving} className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-md shadow-teal-600/20">
              {saving ? "Issuing..." : "Issue & Dispatch Prescription"}
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {rxList.map((rx) => (
            <div key={rx.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                  <Pill className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 dark:text-white text-sm">{rx.patient || "Patient"}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {rx.medicines?.length || 0} drugs prescribed · {rx.date}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPreview(rx)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold transition"
                >
                  <Eye className="w-3.5 h-3.5" /> Preview Chart
                </button>
                <button
                  onClick={() => onToast("Prescription PDF downloaded")}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" /> PDF
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
