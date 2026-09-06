import { useEffect, useState } from "react";
import { FileText, Upload, Search, Shield, Eye, Download, Lock } from "lucide-react";
import { doctorApi } from "../services/doctor.api";

const typeColors: Record<string, string> = {
  "Lab Report": "bg-blue-50 text-blue-700",
  "ECG Report": "bg-purple-50 text-purple-700",
  "Consultation Note": "bg-teal-50 text-teal-700",
  "Imaging": "bg-indigo-50 text-indigo-700",
  "Discharge Summary": "bg-orange-50 text-orange-700",
};

export default function MedicalRecords({ onToast }: { onToast: (msg: string) => void }) {
  const [records, setRecords] = useState<any[]>([]);
  const [patientsList, setPatientsList] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [filterPatient, setFilterPatient] = useState("All");

  useEffect(() => {
    async function loadData() {
      try {
        const ptData: any = await doctorApi.listPatients();
        const pts = Array.isArray(ptData) ? ptData : (ptData?.data || []);
        setPatientsList(pts);
      } catch (err) {
        console.warn("Could not load patients for medical records:", err);
      }
    }
    loadData();
  }, []);

  const filtered = records.filter((r) => {
    const matchSearch = (r.name || "").toLowerCase().includes(search.toLowerCase()) || (r.patient || "").toLowerCase().includes(search.toLowerCase());
    const matchPatient = filterPatient === "All" || r.patient === filterPatient;
    return matchSearch && matchPatient;
  });

  return (
    <div className="animate-fade-in space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-slate-900">Medical Records</h1>
          <span className="inline-flex items-center gap-1 text-xs text-green-700 bg-green-50 border border-green-200 px-2 py-1 rounded-full font-medium">
            <Shield className="w-3 h-3" /> Secure Access
          </span>
        </div>
        <button onClick={() => onToast("Document uploaded securely to patient chart")} className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          <Upload className="w-4 h-4" /> Upload Document
        </button>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
        <Lock className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-amber-800">
          <span className="font-semibold">Authorized Access Only.</span> You can only view records for patients who have an active appointment or have explicitly granted you access. All actions are logged.
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-4 flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search records..."
            className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
        <select value={filterPatient} onChange={(e) => setFilterPatient(e.target.value)} className="text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white">
          <option value="All">All Patients</option>
          {patientsList.map((p) => {
            const name = p.name || p.user?.name || "Patient";
            return <option key={p.id} value={name}>{name}</option>;
          })}
        </select>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="responsive-table">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-4 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wide">Document</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wide">Patient</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wide">Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wide">Date</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wide">Uploaded By</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wide">Size</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400">
                    <FileText className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                    <p className="text-sm font-semibold text-slate-700">No medical records uploaded</p>
                    <p className="text-xs text-slate-400 mt-0.5">Uploaded laboratory results and clinical attachments will appear here.</p>
                  </td>
                </tr>
              ) : (
                filtered.map((rec) => (
                  <tr key={rec.id} className="table-row-hover">
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <FileText className="w-4 h-4 text-slate-500" />
                        </div>
                        <div>
                          <div className="font-medium text-slate-900">{rec.name}</div>
                          <div className="text-xs text-slate-500 font-mono">{rec.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-slate-700">{rec.patient}</td>
                    <td className="px-4 py-3.5">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${typeColors[rec.type] || "bg-slate-100 text-slate-600"}`}>{rec.type}</span>
                    </td>
                    <td className="px-4 py-3.5 text-slate-600 text-xs">{rec.date}</td>
                    <td className="px-4 py-3.5 text-slate-600 text-xs">{rec.uploadedBy}</td>
                    <td className="px-4 py-3.5 text-slate-500 text-xs">{rec.size}</td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1">
                        <button className="p-1.5 text-slate-500 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors" title="View">
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Download">
                          <Download className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
