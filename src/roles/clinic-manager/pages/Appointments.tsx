import { useState, useEffect } from "react";
import { Card, Icons, PageHeader, SearchBar, StatusBadge } from "../components/ui";
import { clinicManagerApi } from "../services/clinic-manager.api";

export default function AppointmentsPage() {
  const [filter, setFilter] = useState<string>("All");
  const [appointments, setAppointments] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<string>("All");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const statuses = ["All", "Pending", "Confirmed", "Checked In", "In Progress", "Completed", "Cancelled", "No Show"];

  useEffect(() => {
    async function loadData() {
      try {
        const [appts, docs] = await Promise.all([
          clinicManagerApi.getAppointments().catch(() => []),
          clinicManagerApi.getDoctors().catch(() => []),
        ]);
        setAppointments(Array.isArray(appts) ? appts : (appts?.data || []));
        setDoctors(Array.isArray(docs) ? docs : (docs?.data || []));
      } catch (err) {
        console.warn("Could not load clinic appointments:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filtered = appointments.filter((a) => {
    const statusMatch = filter === "All" || (a.status || "").toLowerCase() === filter.toLowerCase();
    const docName = a.doctor || a.doctorName || "";
    const doctorMatch = selectedDoctor === "All" || docName === selectedDoctor;
    const patientName = a.patient || a.patientName || "";
    const searchMatch = !search || patientName.toLowerCase().includes(search.toLowerCase()) || (a.id || "").toLowerCase().includes(search.toLowerCase());
    return statusMatch && doctorMatch && searchMatch;
  });

  return (
    <div>
      <PageHeader
        title="Appointments"
        subtitle="Live clinic appointments schedule and status ledger"
        action={
          <button className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            {Icons.plus} New Appointment
          </button>
        }
      />

      {/* Status tabs */}
      <div className="flex gap-1.5 flex-wrap mb-4">
        {statuses.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              filter === s ? "bg-blue-600 text-white" : "border border-slate-200 text-slate-600 hover:bg-slate-50 bg-white"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3 mb-4">
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 bg-white"
            placeholder="Search appointments, patients…"
          />
        </div>
        <select
          value={selectedDoctor}
          onChange={(e) => setSelectedDoctor(e.target.value)}
          className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
        >
          <option value="All">All Doctors</option>
          {doctors.map((d) => {
            const name = d.name || d.user?.name || "Doctor";
            return <option key={d.id} value={name}>{name}</option>;
          })}
        </select>
      </div>

      <Card>
        <div className="responsive-table">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                {["APPT ID", "PATIENT", "DOCTOR", "DATE & TIME", "ROOM", "TYPE", "PAYMENT", "STATUS", "ACTIONS"].map((h) => (
                  <th key={h} className="text-left text-xs font-semibold text-slate-500 px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    <p className="text-sm font-semibold text-slate-700">No appointments found</p>
                    <p className="text-xs text-slate-400 mt-0.5">There are currently no matching appointments in this branch.</p>
                  </td>
                </tr>
              ) : (
                filtered.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3.5 text-xs font-mono text-blue-600">{a.id}</td>
                    <td className="px-4 py-3.5 text-sm font-medium text-slate-700">{a.patient || a.patientName || "Patient"}</td>
                    <td className="px-4 py-3.5 text-sm text-slate-600">{a.doctor || a.doctorName || "Doctor"}</td>
                    <td className="px-4 py-3.5">
                      <p className="text-sm text-slate-700">{a.date || "Today"}</p>
                      <p className="text-xs text-slate-400">{a.time || a.slot || "—"}</p>
                    </td>
                    <td className="px-4 py-3.5 text-sm text-slate-500">{a.room || a.roomNumber || "Consultation Room"}</td>
                    <td className="px-4 py-3.5 text-xs text-slate-600">{a.type || "In-Person"}</td>
                    <td className="px-4 py-3.5"><StatusBadge status={a.payStatus || a.paymentStatus || "Paid"} /></td>
                    <td className="px-4 py-3.5"><StatusBadge status={a.status || "Scheduled"} /></td>
                    <td className="px-4 py-3.5">
                      <div className="flex gap-1">
                        <button className="px-2.5 py-1 text-xs text-slate-600 border border-slate-200 rounded hover:bg-slate-50 transition-colors">View</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
