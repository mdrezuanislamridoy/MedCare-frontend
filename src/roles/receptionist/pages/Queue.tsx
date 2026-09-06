import { useState, useEffect } from "react";
import type { QueueEntry } from "../data/mockData";
import { Avatar, ConfirmDialog, EmptyState, StatusBadge } from "../components/ui";
import { receptionistApi } from "../services/receptionist.api";

export default function QueueView({ showToast }: { showToast: (m: string) => void }) {
  const [queue, setQueue] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirm, setConfirm] = useState<{ msg: string; cb: () => void } | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await receptionistApi.getQueue();
        setQueue(Array.isArray(data) ? data : (data as any)?.data ?? []);
      } catch { setQueue([]); }
      finally { setLoading(false); }
    }
    load();
  }, []);

  const callPatient = (q: any) => {
    setQueue(prev => prev.map(e => (e.queueNo || e.id) === (q.queueNo || q.id) ? { ...e, status: "Called" } : e));
    showToast(`Calling patient ${q.patient || q.patientName} — Queue #${q.queueNo || q.tokenNumber}`);
  };

  const noShow = (q: any) => {
    setConfirm({ msg: `Mark ${q.patient || q.patientName} as No Show?`, cb: () => {
      setQueue(prev => prev.map(e => (e.queueNo || e.id) === (q.queueNo || q.id) ? { ...e, status: "No Show" } : e));
      showToast(`${q.patient || q.patientName} marked as No Show`);
    }});
  };

  const complete = (q: any) => {
    setQueue(prev => prev.filter(e => (e.queueNo || e.id) !== (q.queueNo || q.id)));
    showToast(`${q.patient || q.patientName} check-in complete`);
  };

  const activeQ = queue.filter(q => q.status !== "No Show");
  const noShows = queue.filter(q => q.status === "No Show");

  return (
    <div className="space-y-4 animate-fade-in">
      {confirm && <ConfirmDialog msg={confirm.msg} onConfirm={() => { confirm.cb(); setConfirm(null) }} onCancel={() => setConfirm(null)} />}

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-50 flex items-center gap-3">
          <h2 className="font-semibold text-gray-900 flex-1">Patient Queue</h2>
          <span className="flex items-center gap-1.5 text-xs text-emerald-600">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 pulse-dot" />
            Real-time
          </span>
          <span className="mono text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">{activeQ.length} active</span>
        </div>

        <div className="responsive-table">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/60 text-left">
                {["Queue #", "Patient", "Doctor", "Appt Time", "Waiting", "Status", "Actions"].map(h => (
                  <th key={h} className="px-4 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {activeQ.length === 0 && noShows.length === 0 && (
                <tr><td colSpan={7}><EmptyState icon="✅" title="Queue is clear" sub={loading ? "Loading..." : "No patients currently waiting"} /></td></tr>
              )}
              {activeQ.map(q => (
                <tr key={q.queueNo || q.id} className={`hover:bg-gray-50/50 transition-colors ${q.status === "In Room" ? "bg-emerald-50/30" : ""}`}>
                  <td className="px-4 py-3">
                    <span className="mono text-lg font-bold text-blue-600">#{q.queueNo || q.tokenNumber || '—'}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Avatar initials={q.avatar || (q.patient || q.patientName || 'PT').slice(0, 2).toUpperCase()} size="sm" />
                      <span className="text-sm font-medium text-gray-800">{q.patient || q.patientName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{q.doctor || q.doctorName || '—'}</td>
                  <td className="px-4 py-3"><span className="mono text-xs text-gray-700">{q.apptTime || q.appointmentTime || '—'}</span></td>
                  <td className="px-4 py-3">
                    <span className={`mono text-xs font-semibold ${(q.waitMins ?? 0) > 10 ? "text-red-500" : (q.waitMins ?? 0) > 5 ? "text-amber-600" : "text-emerald-600"}`}>
                      {q.waitMins ?? 0}m
                    </span>
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={q.status || 'Waiting'} /></td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1 flex-wrap">
                      {q.status === "Waiting" && (
                        <button onClick={() => callPatient(q)} className="text-xs px-2 py-1 rounded border border-blue-200 text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors">Call</button>
                      )}
                      <button onClick={() => showToast(`Room assigned to ${q.patient || q.patientName}`)} className="text-xs px-2 py-1 rounded border border-teal-200 text-teal-700 bg-teal-50 hover:bg-teal-100 transition-colors">Room</button>
                      <button onClick={() => noShow(q)} className="text-xs px-2 py-1 rounded border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">No Show</button>
                      {(q.status === "Called" || q.status === "In Room") && (
                        <button onClick={() => complete(q)} className="text-xs px-2 py-1 rounded border border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors">Complete</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {noShows.map(q => (
                <tr key={q.queueNo || q.id} className="opacity-50">
                  <td className="px-4 py-3"><span className="mono text-lg font-bold text-gray-400">#{q.queueNo || q.tokenNumber}</span></td>
                  <td className="px-4 py-3 text-sm text-gray-400 line-through">{q.patient || q.patientName}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">{q.doctor || q.doctorName}</td>
                  <td className="px-4 py-3"><span className="mono text-xs text-gray-400">{q.apptTime || q.appointmentTime}</span></td>
                  <td className="px-4 py-3" />
                  <td className="px-4 py-3"><StatusBadge status="No Show" /></td>
                  <td className="px-4 py-3" />
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
