import { useState, useEffect } from "react";
import { Card, PageHeader } from "../components/ui";
import { clinicManagerApi } from "../services/clinic-manager.api";

export default function ReportsPage() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAppointments() {
      try {
        const data = await clinicManagerApi.getAppointments();
        setAppointments(Array.isArray(data) ? data : (data?.data || []));
      } catch (err) {
        console.warn("Could not load appointments for reports:", err);
      } finally {
        setLoading(false);
      }
    }
    loadAppointments();
  }, []);

  const completed = appointments.filter(a => (a.status || "").toLowerCase() === "completed").length;
  const cancelled = appointments.filter(a => (a.status || "").toLowerCase() === "cancelled").length;
  const inProgress = appointments.filter(a => (a.status || "").toLowerCase() === "in-progress" || (a.status || "").toLowerCase() === "in consultation").length;
  const pending = appointments.filter(a => (a.status || "").toLowerCase() === "pending" || (a.status || "").toLowerCase() === "scheduled" || (a.status || "").toLowerCase() === "confirmed").length;
  const total = appointments.length || 1;

  const defaultDays = [
    { day: "Mon", appts: 0 },
    { day: "Tue", appts: 0 },
    { day: "Wed", appts: 0 },
    { day: "Thu", appts: 0 },
    { day: "Fri", appts: 0 },
    { day: "Sat", appts: 0 },
  ];

  return (
    <div>
      <PageHeader
        title="Reports"
        subtitle="Clinic-level analytics and appointment trends"
        action={
          <button onClick={() => alert("Exporting clinic report CSV...")} className="px-4 py-2 text-sm border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors">
            Export CSV
          </button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card className="p-5">
          <h3 className="text-sm font-semibold text-slate-800 mb-4">Appointments This Week</h3>
          <div className="flex items-end gap-3 h-40">
            {defaultDays.map((d) => (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-xs text-slate-500">{d.appts}</span>
                <div className="w-full rounded-t-md bg-blue-500 transition-all" style={{ height: `4px` }} />
                <span className="text-xs text-slate-400">{d.day}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="text-sm font-semibold text-slate-800 mb-4">Appointment Status Breakdown</h3>
          <div className="space-y-3">
            {[
              { label: "Completed", val: completed, color: "#059669" },
              { label: "In Progress", val: inProgress, color: "#7C3AED" },
              { label: "Pending / Upcoming", val: pending, color: "#2563EB" },
              { label: "Cancelled", val: cancelled, color: "#DC2626" },
            ].map((s) => (
              <div key={s.label}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-slate-600">{s.label}</span>
                  <span className="text-sm font-medium text-slate-800">{s.val}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="h-2 rounded-full transition-all" style={{ width: `${(s.val / total) * 100}%`, backgroundColor: s.color }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
