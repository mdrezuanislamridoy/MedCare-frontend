import { useState } from "react";
import { Search, Filter, Calendar, Eye, Check, X, Clock, RefreshCw, Play } from "lucide-react";
import StatusBadge from "../components/StatusBadge";
import { allAppointments } from "../data/mockData";

const statusFilters = ["All", "Pending", "Confirmed", "In Progress", "Completed", "Cancelled", "No Show"];

export default function Appointments({ onToast }: { onToast: (msg: string) => void }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selected, setSelected] = useState<string | null>(null);
  const [appointments, setAppointments] = useState(allAppointments);

  const filtered = appointments.filter((a) => {
    const matchSearch = a.patient.toLowerCase().includes(search.toLowerCase()) || a.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || a.status.toLowerCase().replace("-", " ") === statusFilter.toLowerCase() || a.status === statusFilter.toLowerCase().replace(" ", "-");
    return matchSearch && matchStatus;
  });

  const handleAction = (id: string, action: string) => {
    const msgs: Record<string, string> = {
      accept: "Appointment confirmed successfully",
      cancel: "Appointment cancelled",
      complete: "Consultation completed",
      start: "Consultation started",
    };
    setAppointments((prev) =>
      prev.map((a) =>
        a.id === id
          ? { ...a, status: action === "accept" ? "confirmed" : action === "start" ? "in-progress" : action === "complete" ? "completed" : "cancelled" }
          : a
      )
    );
    onToast(msgs[action] || "Action performed");
  };

  return (
    <div className="animate-fade-in space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Appointments</h1>
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-2 text-slate-600 border border-slate-200 px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
            <Calendar className="w-4 h-4" /> Calendar View
          </button>
          <button className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            + New Appointment
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by patient or appointment ID..."
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
            >
              {statusFilters.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
        </div>
        <div className="flex gap-2 mt-3 flex-wrap">
          {statusFilters.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${statusFilter === s ? "bg-teal-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-4 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wide">ID</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wide">Patient</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wide">Date & Time</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wide">Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wide">Reason</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wide">Payment</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wide">Status</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-slate-400">
                    <Calendar className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                    No appointments found
                  </td>
                </tr>
              ) : (
                filtered.map((apt) => (
                  <tr key={apt.id} className={`table-row-hover cursor-pointer ${selected === apt.id ? "bg-teal-50" : ""}`} onClick={() => setSelected(apt.id === selected ? null : apt.id)}>
                    <td className="px-4 py-3.5">
                      <span className="font-mono text-xs text-slate-500">{apt.id}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <img src={apt.avatar} alt={apt.patient} className="w-8 h-8 rounded-full object-cover bg-slate-100" />
                        <div>
                          <div className="font-medium text-slate-900">{apt.patient}</div>
                          <div className="text-xs text-slate-500">Age {apt.age}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="font-medium text-slate-900">{apt.date}</div>
                      <div className="text-xs text-slate-500">{apt.time}</div>
                    </td>
                    <td className="px-4 py-3.5">
                      <StatusBadge status={apt.type === "Online" ? "online" : "in-person"} size="sm" />
                    </td>
                    <td className="px-4 py-3.5 text-slate-700">{apt.reason}</td>
                    <td className="px-4 py-3.5">
                      <StatusBadge status={apt.paymentStatus} size="sm" />
                    </td>
                    <td className="px-4 py-3.5">
                      <StatusBadge status={apt.status} size="sm" />
                    </td>
                    <td className="px-4 py-3.5" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-1">
                        <button className="p-1.5 text-slate-500 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors" title="View">
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        {apt.status === "pending" && (
                          <>
                            <button onClick={() => handleAction(apt.id, "accept")} className="p-1.5 text-slate-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Accept">
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => handleAction(apt.id, "cancel")} className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Reject">
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                        {apt.status === "confirmed" && (
                          <>
                            <button onClick={() => handleAction(apt.id, "start")} className="p-1.5 text-slate-500 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors" title="Start">
                              <Play className="w-3.5 h-3.5" />
                            </button>
                            <button className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Reschedule">
                              <RefreshCw className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => handleAction(apt.id, "cancel")} className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Cancel">
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                        {apt.status === "in-progress" && (
                          <button onClick={() => handleAction(apt.id, "complete")} className="px-2.5 py-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded-lg font-medium transition-colors">
                            Complete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Showing {filtered.length} of {appointments.length} appointments</span>
          <div className="flex gap-1">
            <button className="px-3 py-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50" disabled>Previous</button>
            <button className="px-3 py-1.5 bg-teal-600 text-white rounded-lg">1</button>
            <button className="px-3 py-1.5 border border-slate-200 rounded-lg hover:bg-slate-50">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
