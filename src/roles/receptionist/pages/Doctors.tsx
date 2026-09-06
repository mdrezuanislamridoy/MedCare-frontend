import { useState, useEffect } from "react";
import { Avatar, DoctorDot, EmptyState, StatusBadge } from "../components/ui";
import { receptionistApi } from "../services/receptionist.api";

export default function DoctorsView() {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await receptionistApi.getDoctors();
        setDoctors(Array.isArray(data) ? data : (data as any)?.data ?? []);
      } catch { setDoctors([]); }
      finally { setLoading(false); }
    }
    load();
  }, []);

  if (doctors.length === 0) {
    return (
      <div className="space-y-4 animate-fade-in">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-50">
            <h2 className="font-semibold text-gray-900">Doctors</h2>
          </div>
          <EmptyState icon="🩺" title={loading ? "Loading doctors..." : "No doctors available"} sub="Doctor profiles will appear here when registered" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {doctors.map((d: any) => (
          <div key={d.name || d.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-5 border-b border-gray-50">
              <div className="flex items-center gap-4">
                <Avatar initials={d.avatar || (d.name || 'DR').replace('Dr. ', '').slice(0, 2).toUpperCase()} size="lg" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900">{d.name}</h3>
                    <DoctorDot status={d.status || 'Available'} />
                  </div>
                  <p className="text-sm text-gray-400">{d.specialty || 'General'}</p>
                </div>
                <StatusBadge status={d.status || 'Available'} />
              </div>
              <div className="grid grid-cols-3 gap-3 mt-4">
                {[
                  ["Room", d.room || '—'],
                  ["Queue", `${d.queue ?? d.activeQueue ?? 0} waiting`],
                  ["Next", d.nextAppt || '—'],
                ].map(([k, v]) => (
                  <div key={k} className="bg-gray-50 rounded-lg px-3 py-2">
                    <p className="text-[10px] text-gray-400 uppercase tracking-wide">{k}</p>
                    <p className="text-sm font-semibold text-gray-800 mono mt-0.5">{v}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="px-5 py-3">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Today's Schedule</p>
              <EmptyState icon="🗓" title="No schedule data" sub="Schedule will appear when available" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
