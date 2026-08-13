import { tickets, appointments, messages, notifications } from '../data/mockData';
import { Card, StatusBadge, PriorityBadge, Avatar } from '../components/ui';

const resolved = tickets.filter(t => t.status === 'Resolved').length;
const open = tickets.filter(t => t.status === 'Open').length;
const pending = tickets.filter(t => t.status === 'In Progress' || t.status === 'Waiting for User').length;
const urgent = tickets.filter(t => t.priority === 'Urgent').length;
const apptIssues = appointments.filter(a => a.issueFlag).length;
const unread = messages.reduce((s, m) => s + m.unreadCount, 0);

const statCards = [
  { label: 'Open Tickets', value: open, icon: '📬', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
  { label: 'Pending Tickets', value: pending, icon: '⏳', color: 'text-violet-600', bg: 'bg-violet-50', border: 'border-violet-100' },
  { label: 'Resolved Today', value: resolved, icon: '✓', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
  { label: 'Urgent Issues', value: urgent, icon: '🚨', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-100' },
  { label: 'Appointment Issues', value: apptIssues, icon: '📅', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
  { label: 'Unread Messages', value: unread, icon: '💬', color: 'text-cyan-600', bg: 'bg-cyan-50', border: 'border-cyan-100' },
];

const priorityTickets = tickets.filter(t => t.priority === 'Urgent' || t.priority === 'High').slice(0, 4);
const upcomingWithSupport = appointments.filter(a => a.issueFlag).slice(0, 3);

const resolutionStats = [
  { label: 'Avg. Resolution Time', value: '3.2h' },
  { label: 'First Contact Resolution', value: '68%' },
  { label: 'Customer Satisfaction', value: '4.6/5' },
  { label: 'Escalation Rate', value: '12%' },
];

export default function DashboardPage({ onNavigate }: { onNavigate: (page: string) => void }) {
  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Support Dashboard</h1>
        <p className="text-sm text-slate-500 mt-0.5">Wed, August 13, 2026 · Good morning, Alex</p>
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
            <button onClick={() => onNavigate('tickets')} className="text-xs text-[#0C7BB3] hover:underline">View all →</button>
          </div>
          <div className="divide-y divide-slate-50">
            {tickets.slice(0, 6).map(t => (
              <div key={t.id} className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50 transition-colors">
                <Avatar name={t.patient} size="sm" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-slate-400">{t.id}</span>
                    <span className="text-xs font-medium text-slate-800 truncate">{t.subject}</span>
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">{t.patient} · {t.category}</div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <PriorityBadge priority={t.priority} />
                  <StatusBadge status={t.status} />
                </div>
              </div>
            ))}
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
              {priorityTickets.map(t => (
                <div key={t.id} className="px-5 py-3 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-xs text-slate-400">{t.id}</span>
                    <PriorityBadge priority={t.priority} />
                  </div>
                  <p className="text-xs font-medium text-slate-700 truncate">{t.subject}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{t.patient} · {t.assignedStaff}</p>
                </div>
              ))}
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
          <button onClick={() => onNavigate('appointments')} className="text-xs text-[#0C7BB3] hover:underline">View all →</button>
        </div>
        <div className="divide-y divide-slate-50">
          {upcomingWithSupport.map(a => (
            <div key={a.id} className="flex items-center gap-4 px-5 py-3 hover:bg-slate-50 transition-colors">
              <div className="w-1.5 h-10 rounded-full bg-red-400 flex-shrink-0" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-slate-400">{a.id}</span>
                  <span className="text-xs font-medium text-slate-800">{a.patient}</span>
                  <span className="text-xs text-slate-400">→ {a.doctor}</span>
                </div>
                <div className="text-xs text-slate-500 mt-0.5">{a.date} at {a.time} · {a.clinic}</div>
              </div>
              <div className="text-xs text-right">
                <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-red-50 text-red-700 border border-red-100 text-xs font-medium">{a.issueType}</span>
              </div>
              <StatusBadge status={a.status} />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
