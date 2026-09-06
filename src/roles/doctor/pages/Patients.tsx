import { useEffect, useState } from "react";
import { Search, Eye, FileText, Pill, History, ChevronDown, ChevronUp, Phone, Mail, Droplets, RefreshCw } from "lucide-react";
import { doctorApi } from "../services/doctor.api";

export default function Patients() {
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [patientList, setPatientList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPatients() {
      try {
        const data: any = await doctorApi.listPatients();
        const list = Array.isArray(data) ? data : (data?.data || data?.items || []);
        setPatientList(list.map((p: any) => ({
          id: p.id,
          name: p.user?.name || p.name || "Patient",
          age: p.age || "—",
          gender: p.gender || "—",
          avatar: p.user?.avatar || p.photo || "",
          bloodType: p.bloodGroup || "—",
          lastVisit: p.lastVisit ? new Date(p.lastVisit).toLocaleDateString() : "Recent",
          nextAppointment: "—",
          conditions: p.allergies || p.conditions || [],
          phone: p.phone || p.emergencyPhone || "—",
          email: p.user?.email || p.email || "—",
        })));
      } catch (err) {
        console.warn("Error loading patients:", err);
        setPatientList([]);
      } finally {
        setLoading(false);
      }
    }
    loadPatients();
  }, []);

  const filtered = patientList.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="animate-fade-in space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Patient Clinical Roster</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">{patientList.length} active patients under attending care</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search patient by name or ID..."
            className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <th className="px-5 py-3.5">Patient</th>
                <th className="px-5 py-3.5">Age / Gender</th>
                <th className="px-5 py-3.5">Blood Type</th>
                <th className="px-5 py-3.5">Conditions / Allergies</th>
                <th className="px-5 py-3.5">Last Visit</th>
                <th className="px-5 py-3.5 text-right">EHR Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-slate-400 dark:text-slate-500">
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No patients found</p>
                    <p className="text-xs text-slate-400 mt-1">There are currently no patients matching your search criteria.</p>
                  </td>
                </tr>
              ) : (
                filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-teal-100 dark:bg-teal-900/50 flex items-center justify-center text-xs font-bold text-teal-700 dark:text-teal-300 flex-shrink-0">
                          {p.name.split(" ")[0]?.[0] || "P"}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white">{p.name}</div>
                          <div className="text-[11px] text-slate-400 font-mono">{p.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-slate-600 dark:text-slate-300">{p.age} yrs · {p.gender}</td>
                    <td className="px-5 py-4">
                      <span className="font-semibold text-teal-600 dark:text-teal-400">{p.bloodType}</span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-1">
                        {p.conditions && p.conditions.length > 0 ? (
                          p.conditions.map((c: string) => (
                            <span key={c} className="bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 px-2 py-0.5 rounded-full text-[10px] font-medium">
                              {c}
                            </span>
                          ))
                        ) : (
                          <span className="text-slate-400 text-[11px]">None recorded</span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-slate-500">{p.lastVisit}</td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => alert(`Opening comprehensive HIPAA EHR clinical chart for ${p.name}...`)}
                        className="inline-flex items-center gap-1 text-teal-600 dark:text-teal-400 font-bold hover:underline"
                      >
                        <Eye className="w-3.5 h-3.5" /> View Chart
                      </button>
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
