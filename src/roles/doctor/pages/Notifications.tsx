import { Calendar, Bell, X, MessageCircle, DollarSign, RefreshCw, Star } from "lucide-react";
import { notifications as initialNotifs } from "../data/mockData";
import { useState } from "react";

const typeConfig: Record<string, { icon: typeof Calendar; bg: string; text: string }> = {
  appointment: { icon: Calendar, bg: "bg-blue-50", text: "text-blue-600" },
  reminder: { icon: Bell, bg: "bg-amber-50", text: "text-amber-600" },
  cancellation: { icon: X, bg: "bg-red-50", text: "text-red-600" },
  reschedule: { icon: RefreshCw, bg: "bg-indigo-50", text: "text-indigo-600" },
  payment: { icon: DollarSign, bg: "bg-green-50", text: "text-green-600" },
  message: { icon: MessageCircle, bg: "bg-teal-50", text: "text-teal-600" },
  review: { icon: Star, bg: "bg-amber-50", text: "text-amber-600" },
};

export default function Notifications() {
  const [notifs, setNotifs] = useState(initialNotifs);

  const markAllRead = () => setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));
  const dismiss = (id: string) => setNotifs((prev) => prev.filter((n) => n.id !== id));
  const markRead = (id: string) => setNotifs((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));

  const unread = notifs.filter((n) => !n.read).length;

  return (
    <div className="animate-fade-in space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-slate-900">Notifications</h1>
          {unread > 0 && (
            <span className="bg-teal-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">{unread} new</span>
          )}
        </div>
        {unread > 0 && (
          <button onClick={markAllRead} className="text-sm text-teal-600 font-medium hover:text-teal-700">Mark all as read</button>
        )}
      </div>

      <div className="space-y-2">
        {notifs.length === 0 && (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
            <Bell className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <div className="text-slate-500">No notifications</div>
          </div>
        )}
        {notifs.map((n) => {
          const cfg = typeConfig[n.type] || typeConfig.appointment;
          return (
            <div
              key={n.id}
              onClick={() => markRead(n.id)}
              className={`bg-white rounded-xl border p-4 flex items-start gap-4 cursor-pointer hover:shadow-sm transition-all ${n.read ? "border-slate-200" : "border-teal-200 bg-teal-50/30"}`}
            >
              <div className={`w-9 h-9 rounded-xl ${cfg.bg} flex items-center justify-center flex-shrink-0`}>
                <cfg.icon className={`w-4 h-4 ${cfg.text}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className={`font-medium text-sm ${n.read ? "text-slate-700" : "text-slate-900"}`}>
                      {n.title}
                      {!n.read && <span className="ml-2 w-2 h-2 bg-teal-500 rounded-full inline-block" />}
                    </div>
                    <p className="text-sm text-slate-500 mt-0.5">{n.message}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-xs text-slate-400">{n.time}</span>
                    <button
                      onClick={(e) => { e.stopPropagation(); dismiss(n.id); }}
                      className="p-1 text-slate-300 hover:text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                {n.type === "appointment" && (
                  <div className="flex gap-2 mt-2">
                    <button className="text-xs bg-teal-600 text-white px-3 py-1 rounded-lg font-medium hover:bg-teal-700 transition-colors">Accept</button>
                    <button className="text-xs border border-slate-200 text-slate-600 px-3 py-1 rounded-lg font-medium hover:bg-slate-50 transition-colors">Decline</button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
