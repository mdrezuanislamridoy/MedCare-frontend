import { useState, useEffect } from 'react';
import { Card, StatusBadge, PriorityBadge, Avatar } from '../components/ui';
import { supportStaffApi, SupportStaffKpis } from '../services/support-staff.api';
import { useAuthStore } from '../../../common/stores/auth.store';

export default function DashboardPage({ onNavigate }: { onNavigate: (page: string) => void }) {
  const { user } = useAuthStore();
  const [liveKpis, setLiveKpis] = useState<SupportStaffKpis | null>(null);
  const [liveTickets, setLiveTickets] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [kpis, tData, aData]: any = await Promise.all([
          supportStaffApi.getKpis(),
          supportStaffApi.listTickets(),
          supportStaffApi.getAppointments(),
        ]);
        if (kpis) setLiveKpis(kpis);
        setLiveTickets(Array.isArray(tData) ? tData : (tData?.data || tData?.items || []));
        setAppointments(Array.isArray(aData) ? aData : (aData?.data || aData?.items || []));
      } catch (err: any) {
        console.error('Support staff dashboard load error:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const resolved = liveKpis?.resolvedToday ?? liveTickets.filter(t => (t.status || '').toLowerCase() === 'resolved').length;
  const open = liveKpis?.openTickets ?? liveTickets.filter(t => (t.status || '').toLowerCase() === 'open').length;
  const pending = liveTickets.filter(t => ['in progress', 'waiting for user'].includes((t.status || '').toLowerCase())).length;
  const urgent = liveKpis?.escalatedTickets ?? liveTickets.filter(t => (t.priority || '').toLowerCase() === 'urgent').length;
  const apptIssues = appointments.filter(a => a.issueFlag || a.status === 'CANCELLED' || a.status === 'NO_SHOW').length;
  const unread = 0;

  const statCards = [
    { label: 'Open Tickets', value: open, icon: '📬', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
    { label: 'Pending Tickets', value: pending, icon: '⏳', color: 'text-violet-600', bg: 'bg-violet-50', border: 'border-violet-100' },
    { label: 'Resolved Today', value: resolved, icon: '✓', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
    { label: 'Urgent Issues', value: urgent, icon: '🚨', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-100' },
    { label: 'Appointment Issues', value: apptIssues, icon: '📅', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
    { label: 'Satisfaction Rate', value: liveKpis?.satisfactionRate ? `${liveKpis.satisfactionRate}%` : '—', icon: '⭐', color: 'text-teal-600', bg: 'bg-teal-50', border: 'border-teal-100' },
  ];

  const priorityTickets = liveTickets.filter(t => ['urgent', 'high'].includes((t.priority || '').toLowerCase())).slice(0, 4);
  const upcomingWithSupport = appointments.filter(a => a.issueFlag || a.status === 'CANCELLED').slice(0, 4);

  const resolutionStats = [
    { label: 'Avg. Resolution Time', value: liveKpis?.avgResponseTimeHours ? `${liveKpis.avgResponseTimeHours}h` : '—' },
    { label: 'First Contact Resolution', value: liveKpis?.firstContactResolution ? `${liveKpis.firstContactResolution}%` : '—' },
    { label: 'Customer Satisfaction', value: liveKpis?.satisfactionRate ? `${liveKpis.satisfactionRate}%` : '—' },
    { label: 'Active Disputes', value: liveKpis?.activeDisputes ?? 0 },
  ];

  const todayStr = new Date().toLocaleDateString(undefined, { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' });
  const firstName = user?.name ? user.name.split(' ')[0] : 'Support';

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Support Dashboard</h1>
        <p className="text-sm text-slate-500 mt-0.5">{todayStr} · Welcome back, {firstName}</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map(s => (
          <Card key={s.label} className="p-4 hover:shadow-md transition-shadow cursor-default">
            <div className={`w-8 h-8 ${s.bg} ${s.border} border rounded-lg flex items-center justify-center text-base mb-3`}>
              {s.icon}
            </div>
            <div className={`text-2xl font-bold ${s.color} font-mono`}>{s.value}</div>
            <div className="text-xs text-slate-500 mt-0.5 leading-tight">{s.label}</div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Tickets */}
        <Card className="xl:col-span-2">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h2 className="text-sm font-semibold text-slate-800">Recent Tickets</h2>
            <button onClick={() => onNavigate('tickets')} className="text-xs text-teal-600 hover:underline">View all →</button>
          </div>
          <div className="divide-y divide-slate-50">
            {liveTickets.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                No tickets currently logged. System queue is clear.
              </div>
            ) : (
              liveTickets.slice(0, 6).map(t => (
                <div key={t.id || t._id} className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50 transition-colors">
                  <Avatar name={t.patient || t.patientName || 'Patient'} size="sm" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-slate-400">{t.id || t._id}</span>
                      <span className="text-xs font-medium text-slate-800 truncate">{t.subject || 'Support Ticket'}</span>
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">{t.patient || t.patientName || 'Patient'} · {t.category || 'General'}</div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <PriorityBadge priority={t.priority || 'Medium'} />
                    <StatusBadge status={t.status || 'Open'} />
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Right column */}
        <div className="flex flex-col gap-5">
          {/* Priority Issues */}
          <Card>
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <h2 className="text-sm font-semibold text-slate-800">Priority Issues</h2>
              <span className="text-xs bg-red-50 text-red-600 border border-red-100 rounded-md px-2 py-0.5">{priorityTickets.length} active</span>
            </div>
            <div className="divide-y divide-slate-50">
              {priorityTickets.length === 0 ? (
                <div className="p-6 text-center text-slate-400 text-xs">
                  No urgent or high-priority tickets active.
                </div>
              ) : (
                priorityTickets.map(t => (
                  <div key={t.id || t._id} className="px-5 py-3 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-xs text-slate-400">{t.id || t._id}</span>
                      <PriorityBadge priority={t.priority || 'Urgent'} />
                    </div>
                    <p className="text-xs font-medium text-slate-700 truncate">{t.subject}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{t.patient || t.patientName || 'Patient'} · {t.assignedStaff || 'Unassigned'}</p>
                  </div>
                ))
              )}
            </div>
          </Card>

          {/* Resolution Stats */}
          <Card>
            <div className="px-5 py-4 border-b border-slate-100">
              <h2 className="text-sm font-semibold text-slate-800">Resolution Statistics</h2>
            </div>
            <div className="p-5 grid grid-cols-2 gap-4">
              {resolutionStats.map(s => (
                <div key={s.label}>
                  <div className="text-lg font-bold text-slate-900 font-mono">{s.value}</div>
                  <div className="text-xs text-slate-500 leading-tight">{s.label}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Upcoming appointments requiring support */}
      <Card>
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h2 className="text-sm font-semibold text-slate-800">Appointments Requiring Support</h2>
          <button onClick={() => onNavigate('appointments')} className="text-xs text-teal-600 hover:underline">View all →</button>
        </div>
        <div className="divide-y divide-slate-50">
          {upcomingWithSupport.length === 0 ? (
            <div className="p-6 text-center text-slate-400 text-xs">
              No appointments currently flagged with issues.
            </div>
          ) : (
            upcomingWithSupport.map(a => (
              <div key={a.id || a._id} className="flex items-center gap-4 px-5 py-3 hover:bg-slate-50 transition-colors">
                <div className="w-1.5 h-10 rounded-full bg-red-400 flex-shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-slate-400">{a.id || a._id}</span>
                    <span className="text-xs font-medium text-slate-800">{a.patient || a.patientName || 'Patient'}</span>
                    <span className="text-xs text-slate-400">→ {a.doctor || a.doctorName || 'Doctor'}</span>
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">{a.date || 'Today'} at {a.time || a.timeSlot || 'Scheduled'} · {a.clinic || 'Main Clinic'}</div>
                </div>
                <div className="text-xs text-right">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-red-50 text-red-700 border border-red-100 text-xs font-medium">{a.issueType || a.status || 'Flagged'}</span>
                </div>
                <StatusBadge status={a.status || 'Scheduled'} />
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}
