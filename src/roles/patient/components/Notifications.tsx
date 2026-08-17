import { useEffect, useState } from 'react';
import { Bell, Calendar, Clock, X, CreditCard, Pill, MessageSquare, RotateCcw, CheckCheck, RefreshCw } from 'lucide-react';
import { notifications as initialNotifications } from '../data/mockData';
import type { Notification } from '../data/mockData';
import { patientApi } from '../services/patient.api';
import { Card, Button } from './ui';

const typeIcons: Record<string, typeof Bell> = {
  appointment: Calendar,
  reminder: Clock,
  cancellation: X,
  reschedule: RotateCcw,
  payment: CreditCard,
  prescription: Pill,
  message: MessageSquare,
};

const typeColors: Record<string, string> = {
  appointment: 'bg-teal-100 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400',
  reminder: 'bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400',
  cancellation: 'bg-red-100 dark:bg-red-950/50 text-red-500',
  reschedule: 'bg-violet-100 dark:bg-violet-950/50 text-violet-600 dark:text-violet-400',
  payment: 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400',
  prescription: 'bg-teal-100 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400',
  message: 'bg-indigo-100 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400',
};

export default function Notifications() {
  const [notifs, setNotifs] = useState<any[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadNotifications() {
      try {
        const data: any = await patientApi.listNotifications();
        if (data && (Array.isArray(data) && data.length > 0)) {
          setNotifs(data);
        } else {
          setNotifs(initialNotifications);
        }
      } catch (err) {
        console.warn('Using offline notifications fallback:', err);
        setNotifs(initialNotifications);
      } finally {
        setLoading(false);
      }
    }
    loadNotifications();
  }, []);

  const markAllRead = () => setNotifs(prev => prev.map(n => ({ ...n, read: true })));
  
  const markRead = async (id: string) => {
    try {
      await patientApi.markNotificationRead(id);
    } catch (err) {
      console.warn('Marked read locally');
    }
    setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const dismiss = (id: string) => setNotifs(prev => prev.filter(n => n.id !== id));

  const displayed = notifs.filter(n => filter === 'all' || !n.read);
  const unreadCount = notifs.filter(n => !n.read).length;

  return (
    <div className="animate-fade-in">
      <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="font-patient text-2xl font-bold text-slate-800 dark:text-white">Notifications</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
            {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}` : 'All caught up!'}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="secondary" size="sm" onClick={markAllRead}>
            <CheckCheck className="w-4 h-4" /> Mark all read
          </Button>
        )}
      </div>

      {/* Filter */}
      <div className="flex gap-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-1 mb-5 w-fit">
        {(['all', 'unread'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors capitalize ${
              filter === f ? 'bg-teal-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="space-y-3">
        {displayed.length === 0 ? (
          <Card className="p-12 text-center bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <Bell className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="font-semibold text-slate-700 dark:text-slate-200">No notifications</h3>
            <p className="text-slate-400 text-xs mt-1">You have reviewed all clinical alerts and messages.</p>
          </Card>
        ) : (
          displayed.map(n => {
            const Icon = typeIcons[n.type] ?? Bell;
            const color = typeColors[n.type] ?? 'bg-teal-100 text-teal-600';

            return (
              <Card
                key={n.id}
                className={`p-4 transition-colors bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 ${
                  !n.read ? 'border-l-4 border-l-teal-500 bg-teal-50/20' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-semibold text-slate-800 dark:text-white text-xs sm:text-sm">{n.title}</p>
                      <span className="text-[10px] text-slate-400 whitespace-nowrap">{n.time || '10 mins ago'}</span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{n.message}</p>
                    {!n.read && (
                      <button
                        onClick={() => markRead(n.id)}
                        className="text-[11px] text-teal-600 dark:text-teal-400 font-semibold hover:underline mt-2"
                      >
                        Mark as read
                      </button>
                    )}
                  </div>
                  <button
                    onClick={() => dismiss(n.id)}
                    className="text-slate-400 hover:text-slate-600 p-1 transition"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
