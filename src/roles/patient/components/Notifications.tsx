import { useState } from 'react';
import { Bell, Calendar, Clock, X, CreditCard, Pill, MessageSquare, RotateCcw, CheckCheck } from 'lucide-react';
import { notifications as initialNotifications } from '../data/mockData';
import type { Notification } from '../data/mockData';
import { Card, Button } from './ui';

const typeIcons: Record<string, typeof Bell> = {
  appointment:  Calendar,
  reminder:     Clock,
  cancellation: X,
  reschedule:   RotateCcw,
  payment:      CreditCard,
  prescription: Pill,
  message:      MessageSquare,
};

const typeColors: Record<string, string> = {
  appointment:  'bg-sky-100 text-sky-600',
  reminder:     'bg-amber-100 text-amber-600',
  cancellation: 'bg-red-100 text-red-500',
  reschedule:   'bg-violet-100 text-violet-600',
  payment:      'bg-emerald-100 text-emerald-600',
  prescription: 'bg-teal-100 text-teal-600',
  message:      'bg-indigo-100 text-indigo-600',
};

export default function Notifications() {
  const [notifs, setNotifs] = useState<Notification[]>(initialNotifications);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const markAllRead = () => setNotifs(prev => prev.map(n => ({ ...n, read: true })));
  const markRead = (id: string) => setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  const dismiss = (id: string) => setNotifs(prev => prev.filter(n => n.id !== id));

  const displayed = notifs.filter(n => filter === 'all' || !n.read);
  const unreadCount = notifs.filter(n => !n.read).length;

  return (
    <div className="p-6 animate-fade-in">
      <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800" style={{ fontFamily: 'DM Sans, sans-serif' }}>Notifications</h1>
          <p className="text-slate-500 text-sm mt-0.5">
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
      <div className="flex gap-1 bg-white border border-slate-200 rounded-xl p-1 mb-5 w-fit">
        {(['all', 'unread'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-colors capitalize ${filter === f ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
            {f === 'unread' && unreadCount > 0 && (
              <span className="ml-1.5 text-xs bg-sky-500 text-white rounded-full px-1.5 py-0.5">{unreadCount}</span>
            )}
          </button>
        ))}
      </div>

      {displayed.length === 0 ? (
        <Card className="p-12 text-center">
          <Bell className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="font-medium text-slate-600">No notifications</p>
          <p className="text-sm text-slate-400 mt-1">
            {filter === 'unread' ? "You've read everything!" : "You're all caught up!"}
          </p>
        </Card>
      ) : (
        <div className="space-y-2">
          {displayed.map(notif => {
            const Icon = typeIcons[notif.type] ?? Bell;
            const colorClass = typeColors[notif.type] ?? 'bg-slate-100 text-slate-500';
            return (
              <div
                key={notif.id}
                className={`flex items-start gap-4 p-4 rounded-xl border transition-colors ${
                  notif.read
                    ? 'bg-white border-slate-200'
                    : 'bg-sky-50/70 border-sky-200'
                }`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${colorClass}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0" onClick={() => markRead(notif.id)}>
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-sm font-medium ${notif.read ? 'text-slate-700' : 'text-slate-900'}`}>{notif.title}</p>
                    {!notif.read && <div className="w-2 h-2 rounded-full bg-sky-500 mt-1.5 flex-shrink-0" />}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{notif.message}</p>
                  <p className="text-[10px] text-slate-400 mt-1.5">{notif.time}</p>
                </div>
                <button
                  onClick={() => dismiss(notif.id)}
                  className="p-1 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors flex-shrink-0"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
