import { activityLog, type ActivityItem } from '../data/mockData';
import { Card } from '../components/ui';

const typeConfig: Record<ActivityItem['type'], { icon: string; color: string }> = {
  ticket: { icon: '🎫', color: 'bg-blue-50 text-blue-600' },
  patient: { icon: '👤', color: 'bg-emerald-50 text-emerald-600' },
  appointment: { icon: '📅', color: 'bg-amber-50 text-amber-600' },
  complaint: { icon: '⚠', color: 'bg-orange-50 text-orange-600' },
  escalation: { icon: '⬆', color: 'bg-red-50 text-red-600' },
  message: { icon: '💬', color: 'bg-violet-50 text-violet-600' },
};

const staffColors: Record<string, string> = {
  'Alex Chen': 'bg-blue-100 text-blue-700',
  'Sara Kim': 'bg-violet-100 text-violet-700',
  'Mark Davis': 'bg-emerald-100 text-emerald-700',
};

export default function ActivityPage() {
  const byDate: Record<string, ActivityItem[]> = {};
  activityLog.forEach(a => {
    const key = a.time.includes('today') ? 'Today' : 'Yesterday';
    if (!byDate[key]) byDate[key] = [];
    byDate[key].push(a);
  });

  return (
    <div className="animate-fade-in space-y-4 max-w-3xl">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Activity Log</h1>
        <p className="text-sm text-slate-500 mt-0.5">Track all support actions across tickets, patients, appointments, and complaints.</p>
      </div>

      {Object.entries(byDate).map(([date, items]) => (
        <div key={date}>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">{date}</p>
          <Card>
            <div className="divide-y divide-slate-50">
              {items.map(item => {
                const cfg = typeConfig[item.type];
                const staffCls = staffColors[item.staff] || 'bg-slate-100 text-slate-600';
                return (
                  <div key={item.id} className="flex items-start gap-4 px-5 py-3.5 hover:bg-slate-50/80 transition-colors">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0 ${cfg.color}`}>
                      {cfg.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-md ${staffCls}`}>{item.staff}</span>
                        <span className="text-sm text-slate-700">{item.action}</span>
                        <span className="font-mono text-xs text-[#0C7BB3] bg-sky-50 border border-sky-100 px-1.5 py-0.5 rounded">{item.target}</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">{item.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      ))}
    </div>
  );
}
