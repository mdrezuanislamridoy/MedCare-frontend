import { useState, useEffect } from "react";
import { Avatar, EmptyState, StatusBadge } from "../components/ui";
import { receptionistApi } from "../services/receptionist.api";

export default function PatientsView() {
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const PER_PAGE = 8;

  useEffect(() => {
    async function load() {
      try {
        const data = await receptionistApi.getPatients();
        setPatients(Array.isArray(data) ? data : (data as any)?.data ?? []);
      } catch { setPatients([]); }
      finally { setLoading(false); }
    }
    load();
  }, []);

  const filtered = patients.filter((p: any) =>
    (p.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (p.phone || '').includes(search) ||
    (p.doctor || '').toLowerCase().includes(search.toLowerCase())
  );
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const totalPages = Math.ceil(filtered.length / PER_PAGE);

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-50 flex items-center gap-3">
          <h2 className="font-semibold text-gray-900 flex-1">Patients</h2>
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 w-full sm:w-48">
            <span className="text-gray-400 text-xs">🔍</span>
            <input value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} placeholder="Search patients…" className="bg-transparent text-sm outline-none flex-1 placeholder:text-gray-400" />
          </div>
        </div>

        <div className="responsive-table">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/60 text-left">
                {["Patient", "Phone", "Doctor", "Visits", "Last Visit", "Actions"].map(h => (
                  <th key={h} className="px-4 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paged.length === 0 ? (
                <tr><td colSpan={6}><EmptyState icon="👤" title="No patients found" sub={loading ? "Loading..." : "No patient records available"} /></td></tr>
              ) : paged.map((p: any) => (
                <tr key={p.name || p.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <Avatar initials={p.avatar || (p.name || 'PT').slice(0, 2).toUpperCase()} size="sm" />
                      <span className="text-sm font-medium text-gray-800">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3"><span className="mono text-xs text-gray-600">{p.phone || '—'}</span></td>
                  <td className="px-4 py-3 text-sm text-gray-600">{p.doctor || '—'}</td>
                  <td className="px-4 py-3"><span className="mono text-sm font-semibold text-gray-800">{p.visits ?? 0}</span></td>
                  <td className="px-4 py-3 text-sm text-gray-500">{p.lastVisit || '—'}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button className="text-xs px-2 py-1 rounded border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">Profile</button>
                      <button className="text-xs px-2 py-1 rounded border border-blue-200 text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors">Appointments</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="px-5 py-3 border-t border-gray-50 flex items-center justify-between">
            <span className="text-xs text-gray-400 mono">{filtered.length} patients</span>
            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => (
                <button key={i} onClick={() => setPage(i + 1)}
                  className={`w-7 h-7 text-xs rounded-md transition-colors ${page === i + 1 ? "bg-blue-600 text-white" : "border border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-3 flex items-center gap-3">
        <span className="text-amber-500">🔒</span>
        <p className="text-sm text-amber-700">Only patients associated with your clinic appointments are shown. Detailed medical records are restricted to clinical staff.</p>
      </div>
    </div>
  )
}
