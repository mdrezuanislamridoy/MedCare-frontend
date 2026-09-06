import { useState, useEffect } from "react";
import { Avatar, Card, Icons, PageHeader, StatCard, StatusBadge } from "../components/ui";
import { clinicManagerApi, ClinicManagerStats } from "../services/clinic-manager.api";

export default function DashboardPage() {
  const [stats, setStats] = useState<ClinicManagerStats | null>(null);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [queue, setQueue] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setError(null);
        const [statsData, apptData, docData, queueData]: any = await Promise.all([
          clinicManagerApi.getStats(),
          clinicManagerApi.getAppointments(),
          clinicManagerApi.getDoctors(),
          clinicManagerApi.getQueue(),
        ]);

        if (statsData) setStats(statsData);
        setAppointments(Array.isArray(apptData) ? apptData : (apptData?.data || []));
        setDoctors(Array.isArray(docData) ? docData : (docData?.data || []));
        setQueue(Array.isArray(queueData) ? queueData : (queueData?.data || []));
      } catch (err: any) {
        console.error("Error loading clinic dashboard data:", err);
        setError(err?.message || "Failed to load dashboard data. Please try again.");
        // Don't set empty arrays, let the UI show error state
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const barColors: Record<string, string> = {
    "Completed": "#059669", "In Progress": "#7C3AED", "Checked In": "#4F46E5",
    "Confirmed": "#2563EB", "Pending": "#D97706", "Cancelled": "#DC2626",
  };

  const todayAppts = stats?.activeAppointmentsToday ?? 0;
  const roomOccupancy = stats?.occupancyRate ?? 0;
  const availableDocs = stats?.totalDoctors ?? 0;
  const staffCount = stats?.staffOnDuty ?? 0;
  const monthRev = stats?.revenueThisMonth ?? 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-3 text-slate-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title="Dashboard" subtitle="MedCare Clinic Operations & Resource Matrix" />
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          <p className="font-medium">Error loading dashboard</p>
          <p className="text-sm mt-1">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Dashboard" subtitle="MedCare Clinic Operations & Resource Matrix" />

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Today's Appointments" value={todayAppts} sub="Live consultations" icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/></svg>} color="#2563EB" />
        <StatCard label="Room Occupancy" value={`${roomOccupancy}%`} sub={`${stats?.totalRooms ?? 0} total rooms`} icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5"><circle cx="12" cy="7" r="4"/><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/></svg>} color="#D97706" />
        <StatCard label="Available Doctors" value={availableDocs} sub="Rostered today" icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/><path d="M12 11v6M9 14h6"/></svg>} color="#059669" />
        <StatCard label="Active Staff" value={staffCount} sub="On shift now" icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>} color="#7C3AED" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Completed" value={stats?.completedToday ?? 0} sub="Today so far" icon={Icons.check} color="#059669" />
        <StatCard label="Cancelled" value={stats?.cancelledToday ?? 0} sub="Tracking live" icon={Icons.x} color="#DC2626" />
        <StatCard label="Month Revenue" value={`$${monthRev.toLocaleString()}`} sub="Clinic earnings" icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>} color="#0891B2" />
        <StatCard label="Pending Visits" value={stats?.pendingVisits ?? 0} sub="In queue or upcoming" icon={Icons.clock} color="#64748B" />
      </div>

      {/* Timeline + Doctor Availability */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Timeline */}
        <Card className="lg:col-span-2 p-5">
          <h2 className="text-sm font-semibold text-slate-800 mb-4">Today's Appointment Timeline</h2>
          {appointments.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <p className="text-sm font-semibold text-slate-600">No appointments scheduled today</p>
              <p className="text-xs text-slate-400 mt-0.5">Patient consultations will show here when booked.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {appointments.slice(0, 8).map((t, i) => (
                <div key={t.id || i} className="flex items-center gap-3">
                  <span className="text-xs font-mono text-slate-400 w-14 flex-shrink-0">{t.time || t.slot || t.startTime || "—"}</span>
                  <div className="flex-1 flex items-center gap-2 py-2 px-3 rounded-lg bg-slate-50 border border-slate-100">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: barColors[t.status] || "#2563EB" }} />
                    <span className="text-sm text-slate-700 flex-1">{t.patient?.name || t.patientName || t.patient?.fullName || "Patient"}</span>
                    <span className="text-xs text-slate-400">{t.doctor?.name || t.doctorName ? `Dr. ${t.doctor?.name || t.doctorName}` : "Doctor"}</span>
                    <StatusBadge status={t.status || "Scheduled"} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Doctor Availability + Patient Queue */}
        <div className="space-y-5">
          <Card className="p-5">
            <h2 className="text-sm font-semibold text-slate-800 mb-4">Doctor Availability</h2>
            {doctors.length === 0 ? (
              <div className="py-6 text-center text-slate-400">
                <p className="text-xs font-medium text-slate-600">No doctors on duty</p>
              </div>
            ) : (
              <div className="space-y-3">
                {doctors.slice(0, 5).map(d => {
                  const name = d.name || d.user?.name || d.fullName || "Doctor";
                  const initials = (name.replace(/^Dr\.\s*/, '').slice(0, 2) || "DR").toUpperCase();
                  return (
                    <div key={d.id} className="flex items-center gap-3">
                      <Avatar initials={initials} color="#0d9488" size="sm" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-slate-700 truncate">{name}</p>
                        <p className="text-xs text-slate-400">{d.specialty || d.specialization || "General Medicine"}</p>
                      </div>
                      <StatusBadge status={d.status || d.availability || "Active"} />
                    </div>
                  );
                })}
              </div>
            )}
          </Card>

          <Card className="p-5">
            <h2 className="text-sm font-semibold text-slate-800 mb-4">Live Queue</h2>
            {queue.length === 0 ? (
              <div className="py-6 text-center text-slate-400">
                <p className="text-xs font-medium text-slate-600">Queue is currently empty</p>
              </div>
            ) : (
              <div className="space-y-2">
                {queue.slice(0, 5).map((q, idx) => {
                  const patientName = q.patient?.name || q.patientName || q.patient?.fullName || "Patient";
                  const initials = (patientName.slice(0, 2) || "PT").toUpperCase();
                  return (
                    <div key={q.id || idx} className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 text-xs font-bold flex items-center justify-center">
                        {q.queueNumber || q.tokenNumber || q.queueNo || idx + 1}
                      </span>
                      <Avatar initials={initials} color="#4F46E5" size="sm" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-slate-700 truncate">{patientName}</p>
                        <p className="text-[11px] text-slate-400">{q.waitTime ? `${q.waitTime}m wait` : q.estimatedWaitTime ? `${q.estimatedWaitTime}m wait` : "Checked in"}</p>
                      </div>
                      <StatusBadge status={q.status || "Waiting"} />
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
