import { useState } from "react";
import { Plus, Trash2, Lock } from "lucide-react";
import { weeklySchedule as initialSchedule } from "../data/mockData";

type DaySchedule = { enabled: boolean; start: string; end: string; breakStart: string; breakEnd: string };
type Schedule = Record<string, DaySchedule>;

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const hours = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, "0")}:00`);

const calendarSlots = [
  { time: "09:00", label: "James Harrington", type: "booked", color: "bg-blue-100 text-blue-700 border-blue-200" },
  { time: "10:00", label: "Maria Santos", type: "booked", color: "bg-blue-100 text-blue-700 border-blue-200" },
  { time: "11:00", label: "Available", type: "available", color: "bg-teal-50 text-teal-600 border-teal-200" },
  { time: "11:30", label: "Robert Chen", type: "booked", color: "bg-blue-100 text-blue-700 border-blue-200" },
  { time: "12:00", label: "Available", type: "available", color: "bg-teal-50 text-teal-600 border-teal-200" },
  { time: "13:00", label: "Break", type: "blocked", color: "bg-amber-50 text-amber-700 border-amber-200" },
  { time: "14:00", label: "Emily Watson", type: "booked", color: "bg-blue-100 text-blue-700 border-blue-200" },
  { time: "15:00", label: "Available", type: "available", color: "bg-teal-50 text-teal-600 border-teal-200" },
  { time: "15:30", label: "David Kim", type: "booked", color: "bg-blue-100 text-blue-700 border-blue-200" },
  { time: "16:30", label: "Linda Foster", type: "booked", color: "bg-blue-100 text-blue-700 border-blue-200" },
  { time: "17:00", label: "Unavailable", type: "unavailable", color: "bg-slate-100 text-slate-400 border-slate-200" },
];

export default function Schedule({ onToast }: { onToast: (msg: string) => void }) {
  const [schedule, setSchedule] = useState<Schedule>(initialSchedule);
  const [duration, setDuration] = useState("30");
  const [mode, setMode] = useState<"weekly" | "calendar">("weekly");

  const toggleDay = (day: string) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: { ...prev[day], enabled: !prev[day].enabled },
    }));
  };

  const updateField = (day: string, field: keyof DaySchedule, value: string) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: { ...prev[day], [field]: value },
    }));
  };

  return (
    <div className="animate-fade-in space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Schedule & Availability</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setMode("weekly")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${mode === "weekly" ? "bg-teal-600 text-white" : "border border-slate-200 text-slate-600 hover:bg-slate-50"}`}
          >
            Weekly View
          </button>
          <button
            onClick={() => setMode("calendar")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${mode === "calendar" ? "bg-teal-600 text-white" : "border border-slate-200 text-slate-600 hover:bg-slate-50"}`}
          >
            Day View
          </button>
        </div>
      </div>

      {mode === "weekly" ? (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          <div className="xl:col-span-2 space-y-4">
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h2 className="font-semibold text-slate-900 mb-4">Weekly Working Hours</h2>
              <div className="space-y-3">
                {days.map((day) => {
                  const s = schedule[day];
                  return (
                    <div key={day} className={`flex items-center gap-4 p-3 rounded-lg border transition-all ${s.enabled ? "border-slate-200 bg-white" : "border-dashed border-slate-200 bg-slate-50"}`}>
                      <label className="flex items-center gap-2 w-28 cursor-pointer">
                        <div
                          onClick={() => toggleDay(day)}
                          className={`w-10 h-5 rounded-full cursor-pointer transition-colors relative flex-shrink-0 ${s.enabled ? "bg-teal-500" : "bg-slate-200"}`}
                        >
                          <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${s.enabled ? "translate-x-5" : "translate-x-0.5"}`} />
                        </div>
                        <span className={`text-sm font-medium ${s.enabled ? "text-slate-900" : "text-slate-400"}`}>{day}</span>
                      </label>
                      {s.enabled ? (
                        <div className="flex items-center gap-3 flex-wrap">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-500">From</span>
                            <select value={s.start} onChange={(e) => updateField(day, "start", e.target.value)} className="text-sm border border-slate-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-teal-500">
                              {hours.map((h) => <option key={h}>{h}</option>)}
                            </select>
                            <span className="text-xs text-slate-500">To</span>
                            <select value={s.end} onChange={(e) => updateField(day, "end", e.target.value)} className="text-sm border border-slate-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-teal-500">
                              {hours.map((h) => <option key={h}>{h}</option>)}
                            </select>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-amber-600 font-medium">Break</span>
                            <select value={s.breakStart} onChange={(e) => updateField(day, "breakStart", e.target.value)} className="text-sm border border-slate-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-teal-500">
                              <option value="">None</option>
                              {hours.map((h) => <option key={h}>{h}</option>)}
                            </select>
                            {s.breakStart && (
                              <>
                                <span className="text-xs text-slate-500">to</span>
                                <select value={s.breakEnd} onChange={(e) => updateField(day, "breakEnd", e.target.value)} className="text-sm border border-slate-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-teal-500">
                                  {hours.map((h) => <option key={h}>{h}</option>)}
                                </select>
                              </>
                            )}
                          </div>
                        </div>
                      ) : (
                        <span className="text-sm text-slate-400">Day off</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-slate-900">Holidays & Leave</h2>
                <button className="inline-flex items-center gap-1 text-teal-600 text-sm font-medium hover:text-teal-700">
                  <Plus className="w-4 h-4" /> Add
                </button>
              </div>
              <div className="space-y-2">
                {[
                  { date: "2026-09-01", label: "Labor Day", type: "Public Holiday" },
                  { date: "2026-10-05", label: "Conference Leave", type: "Personal Leave" },
                ].map((h) => (
                  <div key={h.date} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <div>
                      <div className="font-medium text-slate-900 text-sm">{h.label}</div>
                      <div className="text-xs text-slate-500">{h.date} · {h.type}</div>
                    </div>
                    <button className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h2 className="font-semibold text-slate-900 mb-4">Consultation Settings</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1">Slot Duration</label>
                  <select value={duration} onChange={(e) => setDuration(e.target.value)} className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500">
                    <option value="15">15 minutes</option>
                    <option value="30">30 minutes</option>
                    <option value="45">45 minutes</option>
                    <option value="60">60 minutes</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1">Booking Window</label>
                  <select className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500">
                    <option>Up to 30 days ahead</option>
                    <option>Up to 60 days ahead</option>
                    <option>Up to 90 days ahead</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1">Buffer Between Slots</label>
                  <select className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500">
                    <option>No buffer</option>
                    <option>5 minutes</option>
                    <option>10 minutes</option>
                    <option>15 minutes</option>
                  </select>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-slate-700">In-Person Consultations</span>
                  <div className="w-10 h-5 rounded-full bg-teal-500 relative cursor-pointer flex-shrink-0">
                    <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-white rounded-full shadow" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700">Online Consultations</span>
                  <div className="w-10 h-5 rounded-full bg-teal-500 relative cursor-pointer flex-shrink-0">
                    <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-white rounded-full shadow" />
                  </div>
                </div>
              </div>
              <button onClick={() => onToast("Schedule saved successfully")} className="mt-4 w-full bg-teal-600 hover:bg-teal-700 text-white py-2 rounded-lg text-sm font-medium transition-colors">
                Save Schedule
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-slate-900">Monday, August 10, 2026</h2>
            <div className="flex gap-3 text-xs">
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-blue-200" /> Booked</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-teal-100" /> Available</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-amber-100" /> Break</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-slate-200" /> Unavailable</span>
            </div>
          </div>
          <div className="space-y-2">
            {calendarSlots.map((slot) => (
              <div key={slot.time} className={`flex items-center gap-4 p-3 rounded-lg border ${slot.color} cursor-pointer hover:opacity-90 transition-opacity`}>
                <span className="font-mono text-xs font-semibold w-14 flex-shrink-0">{slot.time}</span>
                <span className="text-sm font-medium flex-1">{slot.label}</span>
                {slot.type === "available" && (
                  <button className="text-xs bg-teal-600 text-white px-2.5 py-1 rounded-lg font-medium">Book</button>
                )}
                {slot.type === "booked" && (
                  <Lock className="w-3.5 h-3.5 opacity-50" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
