import { useState } from 'react';
import { notifications as initial, type Notification } from '../data/mockData';
import { Button } from './ui';

const typeConfig: Record<Notification['type'], { icon: string; color: string }> = {
  ticket: { icon: '🎫', color: 'bg-blue-50 text-blue-600' },
  escalation: { icon: '⬆', color: 'bg-red-50 text-red-600' },
  appointment: { icon: '📅', color: 'bg-amber-50 text-amber-600' },
  reply: { icon: '💬', color: 'bg-violet-50 text-violet-600' },
  complaint: { icon: '⚠', color: 'bg-orange-50 text-orange-600' },
  system: { icon: '⚙', color: 'bg-slate-100 text-slate-600' },
};

export default function NotificationsPage({ showToast }: { showToast: (msg: string, type?: 'success' | 'error' | 'info' | 'warning') => void }) {
  const [data, setData] = useState<Notification[]>(initial);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const markAllRead = () => {
    setData(d => d.map(n => ({ ...n, read: true })));
    showToast('All notifications marked as read.', 'success');
  };

  const markRead = (id: string) => setData(d => d.map(n => n.id === id ? { ...n, read: true } : n));

  const filtered = data.filter(n => filter === 'all' || !n.read);
  const unreadCount = data.filter(n => !n.read).length;

  return (
    <div className="animate-fade-in space-y-4 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Notifications</h1>
          <p className="text-sm text-slate-500 mt-0.5">{unreadCount} unread</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border border-slate-200 overflow-hidden">
            {(['all', 'unread'] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-3 py-1.5 text-xs font-medium capitalize transition-colors ${filter === f ? 'bg-[#0C7BB3] text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}>
                {f}
              </button>
            ))}
          </div>
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={markAllRead}>Mark all read</Button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm divide-y divide-slate-50">
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-sm text-slate-400">No {filter === 'unread' ? 'unread ' : ''}notifications.</div>
        ) : filtered.map(n => {
          const cfg = typeConfig[n.type];
          return (
            <div
              key={n.id}
              className={`flex items-start gap-4 px-5 py-4 hover:bg-slate-50 transition-colors cursor-default ${!n.read ? 'bg-sky-50/30' : ''}`}
              onClick={() => markRead(n.id)}
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-base flex-shrink-0 ${cfg.color}`}>
                {cfg.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className={`text-sm ${!n.read ? 'font-semibold text-slate-900' : 'font-medium text-slate-700'}`}>{n.title}</p>
                      {n.priority === 'urgent' && (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-red-100 text-red-700 uppercase tracking-wide">Urgent</span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{n.description}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-xs text-slate-400 whitespace-nowrap">{n.time}</span>
                    {!n.read && <span className="w-2 h-2 rounded-full bg-[#0C7BB3] flex-shrink-0" />}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
