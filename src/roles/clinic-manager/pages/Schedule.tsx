import { useState } from "react";
import { Card, PageHeader } from "../components/ui";

export default function SchedulePage() {
  const [view, setView] = useState<"week" | "day">("week");
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const slots = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"];

  return (
    <div>
      <PageHeader
        title="Schedule"
        subtitle="Clinic timetable, consultation slots, and room rosters"
        action={
          <div className="flex gap-2">
            <button
              onClick={() => setView("week")}
              className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                view === "week" ? "bg-blue-600 text-white border-blue-600" : "border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setView("day")}
              className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                view === "day" ? "bg-blue-600 text-white border-blue-600" : "border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              Day
            </button>
          </div>
        }
      />

      {/* Legend */}
      <div className="flex items-center gap-4 mb-4">
        {[
          { label: "Booked", cls: "bg-blue-100 border border-blue-200" },
          { label: "Available", cls: "bg-emerald-50 border border-emerald-200" },
          { label: "Blocked / Break", cls: "bg-amber-50 border border-amber-200" },
          { label: "Unavailable", cls: "bg-slate-100 border border-slate-200" },
        ].map((l) => (
          <div key={l.label} className="flex items-center gap-1.5">
            <div className={`w-4 h-3 rounded ${l.cls}`} />
            <span className="text-xs text-slate-500">{l.label}</span>
          </div>
        ))}
      </div>

      <Card className="responsive-table p-6">
        <div className="py-8 text-center text-slate-400">
          <p className="text-sm font-semibold text-slate-700">Clinic Time Roster</p>
          <p className="text-xs text-slate-400 mt-1 mb-6">Consultation slots synchronised with doctor availability rosters.</p>
        </div>
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="text-left text-xs font-semibold text-slate-400 px-4 py-3 w-20">TIME</th>
              {days.map((d) => (
                <th key={d} className="text-center text-xs font-semibold text-slate-600 px-4 py-3">
                  {d}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {slots.map((t) => (
              <tr key={t} className="hover:bg-slate-50/50">
                <td className="px-4 py-2.5 text-xs font-mono text-slate-400 font-medium">{t}</td>
                {days.map((d) => (
                  <td key={d} className="px-2 py-2 text-center">
                    <div className="text-xs px-2 py-1 rounded bg-slate-50 border border-slate-200 text-slate-500">
                      Available
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
