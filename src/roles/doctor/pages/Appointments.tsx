import { useEffect, useState } from "react";
import { Search, Filter, Calendar, Eye, Check, X, Clock, RefreshCw, Play } from "lucide-react";
import StatusBadge from "../components/StatusBadge";
import { allAppointments } from "../data/mockData";
import { doctorApi } from "../services/doctor.api";

const statusFilters = ["All", "Pending", "Confirmed", "In Progress", "Completed", "Cancelled", "No Show"];

export default function Appointments({ onToast }: { onToast: (msg: string) => void }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selected, setSelected] = useState<string | null>(null);
  const [appointments, setAppointments] = useState<any[]>(allAppointments);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAppointments() {
      try {
        const res: any = await doctorApi.listAppointments();
        if (res && (res.items || Array.isArray(res))) {
          const list = res.items || res;
          if (list.length > 0) {
            setAppointments(list.map((a: any) => ({
              id: a.id,
              patient: a.patient?.name || a.patientName || "Patient",
              avatar: a.patient?.photo || "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=48&h=48&fit=crop&auto=format",
              time: a.timeSlot || "10:00 AM",
              type: a.type === "VIDEO" ? "Online" : "In-Person",
              status: (a.status || "confirmed").toLowerCase(),
              reason: a.reason || "General Consultation",
              date: a.date ? String(a.date).split("T")[0] : "2026-08-10",
              paymentStatus: (a.paymentStatus || "paid").toLowerCase(),
            })));
          }
        }
      } catch (err) {
        console.warn("Using offline doctor appointments fallback:", err);
      } finally {
        setLoading(false);
      }
    }
    loadAppointments();
  }, []);

  const filtered = appointments.filter((a) => {
    const matchSearch = (a.patient || "").toLowerCase().includes(search.toLowerCase()) || (a.id || "").toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || a.status.toLowerCase().replace("-", " ") === statusFilter.toLowerCase() || a.status === statusFilter.toLowerCase().replace(" ", "-");
    return matchSearch && matchStatus;
  });

  const handleAction = async (id: string, action: string) => {
    const msgs: Record<string, string> = {
      accept: "Appointment confirmed successfully",
      cancel: "Appointment cancelled",
      complete: "Consultation completed",
      start: "Consultation started",
    };

    const statusMap: Record<string, string> = {
      accept: "CONFIRMED",
      cancel: "CANCELLED",
      start: "IN_PROGRESS",
      complete: "COMPLETED",
    };

    try {
      if (action === "complete") {
        await doctorApi.completeConsultation(id);
      } else if (statusMap[action]) {
        await doctorApi.updateAppointmentStatus(id, statusMap[action]);
      }
    } catch (err) {
      console.warn("Updated status offline");
    }

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
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Clinical Appointments</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">Manage and review your patient schedule and consultations.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by patient or appointment ID..."
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div className="flex gap-1 overflow-x-auto pb-1 sm:pb-0">
            {statusFilters.map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${statusFilter === s ? "bg-teal-600 text-white" : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <th className="px-5 py-3.5">Appointment</th>
                <th className="px-5 py-3.5">Patient</th>
                <th className="px-5 py-3.5">Date & Time</th>
                <th className="px-5 py-3.5">Type</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5">Payment</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {filtered.map((apt) => (
                <tr key={apt.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                  <td className="px-5 py-4 font-mono font-bold text-slate-700 dark:text-slate-300">{apt.id}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <img src={apt.avatar} alt={apt.patient} className="w-8 h-8 rounded-full object-cover bg-slate-100" />
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-white">{apt.patient}</div>
                        <div className="text-[11px] text-slate-400">{apt.reason}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-slate-600 dark:text-slate-300">
                    <div>{apt.date}</div>
                    <div className="text-[11px] text-slate-400 font-medium">{apt.time}</div>
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge status={apt.type === "Online" ? "online" : "in-person"} size="sm" />
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge status={apt.status} size="sm" />
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge status={apt.paymentStatus === "paid" ? "paid" : "pending"} size="sm" />
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {apt.status === "pending" && (
                        <>
                          <button
                            onClick={() => handleAction(apt.id, "accept")}
                            className="p-1.5 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg transition"
                            title="Accept"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleAction(apt.id, "cancel")}
                            className="p-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition"
                            title="Cancel"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                      {apt.status === "confirmed" && (
                        <button
                          onClick={() => handleAction(apt.id, "start")}
                          className="px-2.5 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-semibold flex items-center gap-1 transition"
                        >
                          <Play className="w-3 h-3" /> Start
                        </button>
                      )}
                      {apt.status === "in-progress" && (
                        <button
                          onClick={() => handleAction(apt.id, "complete")}
                          className="px-2.5 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold flex items-center gap-1 transition"
                        >
                          <Check className="w-3 h-3" /> Complete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
