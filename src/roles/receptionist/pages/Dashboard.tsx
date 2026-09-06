import { useState, useEffect } from "react";
import { Avatar, DoctorDot, EmptyState, StatusBadge } from "../components/ui";
import { receptionistApi, ReceptionistDashboardData } from "../services/receptionist.api";

function StatCard({ label, value, sub, accent }: { label: string; value: number | string; sub?: string; accent?: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 animate-fade-in hover:shadow-md transition-shadow">
      <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{label}</p>
      <p className={`text-3xl font-bold mt-1 ${accent || "text-gray-900"}`}>{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  );
}

export default function Dashboard() {
  const [liveData, setLiveData] = useState<ReceptionistDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await receptionistApi.getDashboardSummary();
        setLiveData(data);
      } catch (err: any) {
        console.error("Receptionist dashboard load error:", err);
        setError(err?.message || "Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const stats = [
    { label: "Today's Appointments", value: liveData?.stats?.todayAppointments ?? 0, sub: "8 AM – 5 PM", accent: "text-blue-600" },
    { label: "Waiting Patients", value: liveData?.stats?.waitingPatients ?? 0, sub: "In lobby", accent: "text-amber-600" },
    { label: "Checked In", value: liveData?.stats?.checkedIn ?? 0, sub: "In clinic", accent: "text-indigo-600" },
    { label: "Completed Visits", value: liveData?.stats?.completedVisits ?? 0, sub: "As of now", accent: "text-emerald-600" },
    { label: "Cancelled", value: liveData?.stats?.cancelled ?? 0, sub: "Today", accent: "text-red-500" },
    { label: "Available Doctors", value: liveData?.stats?.availableDoctors ?? 0, sub: "On duty", accent: "text-teal-600" },
  ];

  const timeline: any[] = liveData?.appointments ?? [];
  const displayQueue: any[] = liveData?.queue ?? [];
  const displayDoctors: any[] = liveData?.doctors ?? [];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-3 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          <p className="font-medium">Error loading dashboard</p>
          <p className="text-sm mt-1">{error}</p>
          <button onClick={() => window.location.reload()} className="mt-3 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm">Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        {stats.map(s => <StatCard key={s.label} {...s} />)}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Timeline */}
        <div className="xl:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Today's Appointment Timeline</h2>
            <span className="mono text-xs text-gray-400">{new Date().toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}</span>
          </div>
          {timeline.length === 0 ? (
            <EmptyState icon="📅" title="No appointments today" sub="Appointments will appear here when scheduled" />
          ) : (
            <div className="divide-y divide-gray-50">
              {timeline.map((a: any) => (
                <div key={a.id} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50/60 transition-colors">
                  <span className="mono text-xs text-gray-400 w-16 shrink-0">{a.time || a.slot || "—"}</span>
                  <Avatar initials={(a.patient?.name || a.patient || "PT").slice(0, 2).toUpperCase()} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{a.patient?.name || a.patient || "Patient"}</p>
                    <p className="text-xs text-gray-400 truncate">{a.doctor?.name || a.doctor || "Doctor"} · {a.type || "Consultation"}</p>
                  </div>
                  <StatusBadge status={a.status} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-4">
          {/* Live Queue */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">Live Queue</h2>
              <span className="flex items-center gap-1.5 text-xs text-emerald-600">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 pulse-dot" />
                Live
              </span>
            </div>
            {displayQueue.length === 0 ? (
              <EmptyState icon="🔢" title="Queue is empty" sub="No patients currently waiting" />
            ) : (
              <div className="divide-y divide-gray-50">
                {displayQueue.map((q: any, idx: number) => (
                  <div key={q.id || idx} className="flex items-center gap-3 px-5 py-2.5">
                    <span className="mono text-xs font-bold text-blue-600 w-5">#{q.queueNumber || q.tokenNumber || q.queueNo || idx + 1}</span>
                    <Avatar initials={(q.patient?.name || q.patientName || "PT").slice(0, 2).toUpperCase()} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{q.patient?.name || q.patientName || "Patient"}</p>
                      <p className="text-xs text-gray-400">{q.waitTime ?? q.waitMins ?? 0}m wait</p>
                    </div>
                    <StatusBadge status={q.status || "Waiting"} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Doctor availability */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-50">
              <h2 className="font-semibold text-gray-900">Doctor Availability</h2>
            </div>
            {displayDoctors.length === 0 ? (
              <EmptyState icon="🩺" title="No doctors available" sub="Doctor availability will show here" />
            ) : (
              <div className="divide-y divide-gray-50">
                {displayDoctors.map((d: any) => (
                  <div key={d.id || d.name} className="flex items-center gap-3 px-5 py-2.5">
                    <DoctorDot status={d.status || "Available"} />
                    <Avatar initials={(d.name || "DR").replace("Dr. ", "").slice(0, 2).toUpperCase()} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{d.name || d.user?.name || "Doctor"}</p>
                      <p className="text-xs text-gray-400 truncate">{d.specialty || d.specialization || "General"}</p>
                    </div>
                    <span className="text-xs text-gray-400 mono shrink-0">Q:{d.activeQueue ?? d.queue ?? 0}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent check-ins */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-50">
          <h2 className="font-semibold text-gray-900">Recent Check-ins</h2>
        </div>
        <EmptyState icon="✅" title="No recent check-ins" sub="Patient check-ins will appear here" />
      </div>
    </div>
  );
}
