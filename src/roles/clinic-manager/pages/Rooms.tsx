import { useState, useEffect } from "react";
import { Card, PageHeader, StatusBadge } from "../components/ui";
import { clinicManagerApi } from "../services/clinic-manager.api";

type RoomStatus = "Available" | "Occupied" | "Reserved" | "Maintenance";

export default function RoomsPage() {
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRooms() {
      try {
        const data = await clinicManagerApi.getRooms();
        setRooms(Array.isArray(data) ? data : (data?.data || []));
      } catch (err) {
        console.warn("Could not load clinic rooms:", err);
      } finally {
        setLoading(false);
      }
    }
    loadRooms();
  }, []);

  const cardColor: Record<string, { bg: string; border: string; dot: string }> = {
    Available: { bg: "bg-emerald-50", border: "border-emerald-200", dot: "bg-emerald-500" },
    Occupied: { bg: "bg-red-50", border: "border-red-200", dot: "bg-red-500" },
    Reserved: { bg: "bg-blue-50", border: "border-blue-200", dot: "bg-blue-500" },
    Maintenance: { bg: "bg-amber-50", border: "border-amber-200", dot: "bg-amber-500" },
  };

  return (
    <div>
      <PageHeader title="Rooms" subtitle="Consultation room management and real-time availability" />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {(["Available", "Occupied", "Reserved", "Maintenance"] as RoomStatus[]).map((s) => {
          const c = cardColor[s] || cardColor.Available;
          const count = rooms.filter((r) => (r.status || "").toLowerCase() === s.toLowerCase()).length;
          return (
            <div key={s} className={`p-4 rounded-xl border ${c.bg} ${c.border}`}>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${c.dot}`} />
                <p className="text-xs font-medium text-slate-600">{s}</p>
              </div>
              <p className="text-2xl font-bold text-slate-800 mt-2">{count}</p>
            </div>
          );
        })}
      </div>

      {rooms.length === 0 ? (
        <Card className="p-12 text-center text-slate-400">
          <p className="text-sm font-semibold text-slate-700">No rooms configured</p>
          <p className="text-xs text-slate-400 mt-0.5">Clinic rooms and examination suites will appear here once defined.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rooms.map((r) => {
            const statusKey = r.status || "Available";
            const c = cardColor[statusKey] || cardColor.Available;
            return (
              <Card key={r.id || r.name} className={`p-5 border-2 ${statusKey === "Occupied" ? "border-red-200" : statusKey === "Available" ? "border-emerald-200" : "border-slate-200"}`}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-base font-semibold text-slate-800">{r.name || r.roomNumber || "Room"}</h3>
                    <p className="text-xs text-slate-400">{r.type || "Consultation Suite"}</p>
                  </div>
                  <StatusBadge status={statusKey} />
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Doctor</span>
                    <span className="text-slate-700 font-medium">{r.doctor || r.assignedDoctor || "Unassigned"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Occupancy</span>
                    <span className="text-slate-700 font-medium">{r.patient || "Vacant"}</span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
