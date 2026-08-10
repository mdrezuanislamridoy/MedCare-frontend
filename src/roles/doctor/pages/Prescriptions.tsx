import { useState } from "react";
import { Plus, Trash2, Eye, Download, Printer, Pill } from "lucide-react";
import { prescriptions as initialRx, patients } from "../data/mockData";

type Medicine = { name: string; dosage: string; frequency: string; duration: string; instructions: string };

export default function Prescriptions({ onToast }: { onToast: (msg: string) => void }) {
  const [rxList] = useState(initialRx);
  const [creating, setCreating] = useState(false);
  const [preview, setPreview] = useState<typeof initialRx[0] | null>(null);
  const [newRx, setNewRx] = useState<{ patient: string; medicines: Medicine[]; notes: string }>({
    patient: "",
    medicines: [{ name: "", dosage: "", frequency: "", duration: "", instructions: "" }],
    notes: "",
  });

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

  if (preview) {
    return (
      <div className="animate-fade-in">
        <div className="flex items-center justify-between mb-5">
          <h1 className="text-2xl font-bold text-slate-900">Prescription Preview</h1>
          <div className="flex gap-2">
            <button onClick={() => setPreview(null)} className="border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">Back</button>
            <button onClick={() => onToast("Prescription sent to patient")} className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              <Download className="w-4 h-4" /> Send to Patient
            </button>
            <button className="inline-flex items-center gap-2 border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
              <Printer className="w-4 h-4" /> Print
            </button>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-8 max-w-2xl mx-auto">
          <div className="border-b-2 border-teal-600 pb-5 mb-5">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold text-teal-700">Dr. Sarah Mitchell</h2>
                <p className="text-slate-600 text-sm">MD, FACC · Cardiologist</p>
                <p className="text-slate-500 text-xs mt-1">MCI Reg: MCI-12345</p>
              </div>
              <div className="text-right text-sm text-slate-600">
                <p>Mitchell Cardiac Center</p>
                <p>420 Medical Drive, Suite 300</p>
                <p>Boston, MA 02115</p>
                <p className="font-semibold">{preview.id}</p>
              </div>
            </div>
          </div>
          <div className="flex justify-between mb-5 text-sm">
            <div><span className="text-slate-500">Patient:</span> <span className="font-semibold">{preview.patient}</span></div>
            <div><span className="text-slate-500">Date:</span> <span className="font-semibold">{preview.date}</span></div>
          </div>
          <div className="space-y-3 mb-5">
            {preview.medicines.map((med, i) => (
              <div key={i} className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0 text-teal-700 font-bold text-xs">{i + 1}</div>
                  <div>
                    <div className="font-bold text-slate-900">{med.name} <span className="font-normal text-teal-600">{med.dosage}</span></div>
                    <div className="text-sm text-slate-600 mt-0.5">{med.frequency} · {med.duration}</div>
                    {med.instructions && <div className="text-xs text-slate-500 mt-0.5 italic">{med.instructions}</div>}
                  </div>
                </div>
              </div>
            ))}
          </div>
          {preview.notes && (
            <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
              <div className="text-sm font-semibold text-amber-800 mb-1">Additional Notes</div>
              <p className="text-sm text-amber-900">{preview.notes}</p>
            </div>
          )}
          <div className="mt-8 pt-5 border-t border-slate-200 flex items-center justify-between text-xs text-slate-400">
            <span>This prescription is digitally signed and verified</span>
            <span>Valid for 90 days</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Prescriptions</h1>
        <button onClick={() => setCreating(!creating)} className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          <Plus className="w-4 h-4" /> New Prescription
        </button>
      </div>

      {creating && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
          <h2 className="font-semibold text-slate-900">Create Prescription</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1">Patient</label>
              <select value={newRx.patient} onChange={(e) => setNewRx((p) => ({ ...p, patient: e.target.value }))} className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500">
                <option value="">Select patient</option>
                {patients.map((p) => <option key={p.id}>{p.name}</option>)}
              </select>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-slate-700">Medicines</label>
              <button onClick={addMedicine} className="text-xs text-teal-600 font-medium flex items-center gap-1 hover:text-teal-700">
                <Plus className="w-3.5 h-3.5" /> Add Medicine
              </button>
            </div>
            <div className="space-y-3">
              {newRx.medicines.map((med, i) => (
                <div key={i} className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-slate-700">Medicine {i + 1}</span>
                    {newRx.medicines.length > 1 && (
                      <button onClick={() => removeMedicine(i)} className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    <input value={med.name} onChange={(e) => updateMedicine(i, "name", e.target.value)} placeholder="Medicine name" className="text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500" />
                    <input value={med.dosage} onChange={(e) => updateMedicine(i, "dosage", e.target.value)} placeholder="Dosage (e.g. 10mg)" className="text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500" />
                    <input value={med.frequency} onChange={(e) => updateMedicine(i, "frequency", e.target.value)} placeholder="Frequency" className="text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500" />
                    <input value={med.duration} onChange={(e) => updateMedicine(i, "duration", e.target.value)} placeholder="Duration" className="text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500" />
                    <input value={med.instructions} onChange={(e) => updateMedicine(i, "instructions", e.target.value)} placeholder="Special instructions" className="col-span-2 text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1">Additional Notes</label>
            <textarea value={newRx.notes} onChange={(e) => setNewRx((p) => ({ ...p, notes: e.target.value }))} rows={2} placeholder="Any special instructions for the patient..." className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none" />
          </div>

          <div className="flex gap-2 pt-2">
            <button onClick={() => setCreating(false)} className="border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">Cancel</button>
            <button onClick={() => { onToast("Prescription saved successfully"); setCreating(false); }} className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors">Save Prescription</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {rxList.map((rx) => (
          <div key={rx.id} className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="font-semibold text-slate-900">{rx.patient}</div>
                <div className="text-xs text-slate-500 font-mono">{rx.id} · {rx.date}</div>
              </div>
              <span className="text-xs bg-green-50 text-green-700 border border-green-200 px-2 py-1 rounded-full font-medium">{rx.status}</span>
            </div>
            <div className="space-y-2 mb-3">
              {rx.medicines.map((med, i) => (
                <div key={i} className="flex items-start gap-2 p-2.5 bg-slate-50 rounded-lg">
                  <Pill className="w-4 h-4 text-teal-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-medium text-slate-900 text-sm">{med.name}</span>
                    <span className="text-slate-500 text-sm"> · {med.dosage}</span>
                    <div className="text-xs text-slate-500">{med.frequency} · {med.duration}</div>
                  </div>
                </div>
              ))}
            </div>
            {rx.notes && <p className="text-xs text-slate-500 mb-3 italic">{rx.notes}</p>}
            <div className="flex gap-2">
              <button onClick={() => setPreview(rx)} className="inline-flex items-center gap-1 text-xs text-teal-600 border border-teal-200 bg-teal-50 px-3 py-1.5 rounded-lg font-medium hover:bg-teal-100 transition-colors">
                <Eye className="w-3 h-3" /> Preview
              </button>
              <button onClick={() => onToast("Prescription sent to patient")} className="inline-flex items-center gap-1 text-xs text-slate-600 border border-slate-200 px-3 py-1.5 rounded-lg font-medium hover:bg-slate-50 transition-colors">
                <Download className="w-3 h-3" /> Send
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
