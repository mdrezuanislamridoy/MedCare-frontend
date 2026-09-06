import { useState, useEffect } from "react";
import type { AppointmentStatus } from "../data/mockData";
import { Avatar, ConfirmDialog, EmptyState, PaymentBadge, StatusBadge } from "../components/ui";
import { receptionistApi } from "../services/receptionist.api";

export default function AppointmentsView({ showToast }: { showToast: (m: string) => void }) {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<AppointmentStatus | "All">("All");
  const [search, setSearch] = useState("");
  const [confirm, setConfirm] = useState<{ msg: string; cb: () => void } | null>(null);
  const [page, setPage] = useState(1);
  const PER_PAGE = 8;

  useEffect(() => {
    async function load() {
      try {
        const data = await receptionistApi.getDashboardSummary();
        setAppointments(data?.appointments ?? []);
      } catch { setAppointments([]); }
      finally { setLoading(false); }
    }
    load();
  }, []);

  const statuses: (AppointmentStatus | "All")[] = ["All", "Confirmed", "Checked In", "In Progress", "Completed", "Cancelled", "No Show"];
  const filtered = appointments.filter((a: any) =>
    (filter === "All" || a.status === filter) &&
    ((a.patient || '').toLowerCase().includes(search.toLowerCase()) || (a.doctor || '').toLowerCase().includes(search.toLowerCase()) || (a.id || '').toLowerCase().includes(search.toLowerCase()))
  );
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const totalPages = Math.ceil(filtered.length / PER_PAGE);

  return (
    <div className="space-y-4 animate-fade-in">
      {confirm && <ConfirmDialog msg={confirm.msg} onConfirm={() => { confirm.cb(); setConfirm(null) }} onCancel={() => setConfirm(null)} />}

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="px-5 py-4 border-b border-gray-50 flex flex-wrap gap-3 items-center">
          <h2 className="font-semibold text-gray-900 mr-2">Appointments</h2>
          <div className="flex gap-1 flex-wrap flex-1">
            {statuses.map(s => (
              <button key={s} onClick={() => { setFilter(s); setPage(1) }}
                className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-colors ${filter === s ? "bg-blue-600 text-white border-blue-600" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
                {s}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 w-full sm:w-48">
            <span className="text-gray-400 text-xs">🔍</span>
            <input value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} placeholder="Search…" className="bg-transparent text-sm outline-none flex-1 placeholder:text-gray-400" />
          </div>
        </div>

        <div className="responsive-table">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/60 text-left">
                {["Appt ID", "Patient", "Doctor", "Time", "Type", "Room", "Payment", "Status", "Actions"].map(h => (
                  <th key={h} className="px-4 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paged.length === 0 ? (
                <tr><td colSpan={9}><EmptyState icon="📅" title="No appointments found" sub={loading ? "Loading..." : "Try adjusting your filters or check back later"} /></td></tr>
              ) : paged.map((a: any) => (
                <tr key={a.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3"><span className="mono text-xs text-blue-600">{a.id}</span></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Avatar initials={a.avatar || a.patient?.slice(0,2).toUpperCase() || 'PT'} size="sm" />
                      <span className="text-sm font-medium text-gray-800 whitespace-nowrap">{a.patient}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">{a.doctor}</td>
                  <td className="px-4 py-3"><span className="mono text-xs text-gray-700">{a.time}</span></td>
                  <td className="px-4 py-3 text-sm text-gray-600">{a.type}</td>
                  <td className="px-4 py-3"><span className="mono text-xs text-gray-500">{a.room || '—'}</span></td>
                  <td className="px-4 py-3">{a.payment && <PaymentBadge status={a.payment} />}</td>
                  <td className="px-4 py-3"><StatusBadge status={a.status} /></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button className="text-xs px-2 py-1 rounded border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">View</button>
                      {a.status === "Confirmed" && (
                        <button onClick={() => showToast(`${a.patient} checked in`)} className="text-xs px-2 py-1 rounded border border-indigo-200 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-colors">Check In</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="px-5 py-3 border-t border-gray-50 flex items-center justify-between">
            <span className="text-xs text-gray-400 mono">{filtered.length} results</span>
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
    </div>
  )
}
