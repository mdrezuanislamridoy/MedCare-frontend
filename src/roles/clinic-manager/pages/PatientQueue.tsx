import { useState, useEffect } from "react";
import { Avatar, Card, PageHeader, StatusBadge } from "../components/ui";
import { clinicManagerApi } from "../services/clinic-manager.api";

export default function PatientQueuePage() {
  const [queue, setQueue] = useState<any[]>([]);
  const [now, setNow] = useState(new Date());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    async function loadQueue() {
      try {
        const data = await clinicManagerApi.getQueue();
        setQueue(Array.isArray(data) ? data : (data?.data || []));
      } catch (err) {
        console.warn("Could not load clinic queue:", err);
      } finally {
        setLoading(false);
      }
    }
    loadQueue();
  }, []);

  const inConsult = queue.filter((q) => (q.status || "").toLowerCase() === "in consultation" || (q.status || "").toLowerCase() === "in-progress").length;
  const checkedIn = queue.filter((q) => (q.status || "").toLowerCase() === "checked in").length;
  const waiting = queue.filter((q) => (q.status || "").toLowerCase() === "waiting").length;
  const completed = queue.filter((q) => (q.status || "").toLowerCase() === "completed").length;

  return (
    <div>
      <PageHeader title="Patient Queue" subtitle={`Live queue — ${now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "In Consultation", val: inConsult, color: "#7C3AED" },
          { label: "Checked In", val: checkedIn, color: "#2563EB" },
          { label: "Waiting", val: waiting, color: "#D97706" },
          { label: "Completed", val: completed, color: "#059669" },
        ].map((s) => (
          <Card key={s.label} className="p-4">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">{s.label}</p>
            <p className="text-3xl font-bold mt-1" style={{ color: s.color }}>{s.val}</p>
          </Card>
        ))}
      </div>

      <Card>
        <div className="responsive-table">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                {["#", "PATIENT", "DOCTOR", "APPT TIME", "WAITING", "STATUS"].map((h) => (
                  <th key={h} className="text-left text-xs font-semibold text-slate-500 px-5 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {queue.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <p className="text-sm font-semibold text-slate-700">Patient queue is currently empty</p>
                    <p className="text-xs text-slate-400 mt-0.5">Checked-in patients and real-time waiting tokens will appear here.</p>
                  </td>
                </tr>
              ) : (
                queue.map((q, idx) => {
                  const patientName = q.patient || q.patientName || "Patient";
                  const initials = (patientName.slice(0, 2) || "PT").toUpperCase();
                  return (
                    <tr key={q.id || idx} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-3.5">
                        <span className="w-7 h-7 rounded-full bg-slate-100 text-slate-700 text-sm font-bold flex items-center justify-center">
                          {q.queueNo || q.tokenNumber || idx + 1}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <Avatar initials={initials} color="#0891B2" size="sm" />
                          <span className="text-sm font-medium text-slate-800">{patientName}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-sm text-slate-600">{q.doctor || q.doctorName ? `Dr. ${q.doctor || q.doctorName}` : "Doctor"}</td>
                      <td className="px-5 py-3.5 text-sm text-slate-600">{q.time || q.slot || "—"}</td>
                      <td className="px-5 py-3.5 text-xs text-slate-500">{q.waitMins ? `${q.waitMins}m` : "In Clinic"}</td>
                      <td className="px-5 py-3.5"><StatusBadge status={q.status || "Waiting"} /></td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
