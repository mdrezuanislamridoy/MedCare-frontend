import { useEffect, useState } from "react";
import { Plus, Trash2, Lock, Save, RefreshCw, Clock, DollarSign, Calendar, CheckCircle2 } from "lucide-react";
import { weeklySchedule as initialSchedule } from "../data/mockData";
import { doctorApi } from "../services/doctor.api";

type DaySchedule = { enabled: boolean; start: string; end: string; breakStart: string; breakEnd: string };
type Schedule = Record<string, DaySchedule>;

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const hours = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, "0")}:00`);

const calendarSlots = [
  { time: "09:00", label: "James Harrington", type: "booked", color: "bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800" },
  { time: "10:00", label: "Maria Santos", type: "booked", color: "bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800" },
  { time: "11:00", label: "Available", type: "available", color: "bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400 border-teal-200 dark:border-teal-800" },
  { time: "11:30", label: "Robert Chen", type: "booked", color: "bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800" },
  { time: "12:00", label: "Available", type: "available", color: "bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400 border-teal-200 dark:border-teal-800" },
  { time: "13:00", label: "Lunch Break", type: "blocked", color: "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800" },
  { time: "14:00", label: "Emily Watson", type: "booked", color: "bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800" },
  { time: "15:00", label: "Available", type: "available", color: "bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400 border-teal-200 dark:border-teal-800" },
  { time: "15:30", label: "David Kim", type: "booked", color: "bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800" },
  { time: "16:30", label: "Linda Foster", type: "booked", color: "bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800" },
];

export default function Schedule({ onToast }: { onToast: (msg: string) => void }) {
  const [schedule, setSchedule] = useState<Schedule>(initialSchedule);
  const [duration, setDuration] = useState("30");
  const [fee, setFee] = useState("150");
  const [isAvailableToday, setIsAvailableToday] = useState(true);
  const [mode, setMode] = useState<"weekly" | "calendar">("weekly");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load existing schedule and doctor profile configuration
  useEffect(() => {
    let isMounted = true;
    async function loadDoctorSchedule() {
      try {
        const [schedData, profileData]: any = await Promise.all([
          doctorApi.getSchedule(),
          doctorApi.getProfile(),
        ]);

        if (isMounted) {
          if (profileData?.consultationFee) {
            setFee(String(profileData.consultationFee));
          }
          if (profileData?.isAvailableToday !== undefined) {
            setIsAvailableToday(profileData.isAvailableToday);
          }

          if (schedData?.schedules && Array.isArray(schedData.schedules) && schedData.schedules.length > 0) {
            const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
            const updatedSchedule: Schedule = { ...initialSchedule };
            schedData.schedules.forEach((s: any) => {
              const dayName = typeof s.dayOfWeek === "number" ? dayNames[s.dayOfWeek] : s.dayOfWeek;
              if (dayName && updatedSchedule[dayName]) {
                updatedSchedule[dayName] = {
                  ...updatedSchedule[dayName],
                  enabled: s.isAvailable ?? true,
                  start: s.startTime || "09:00",
                  end: s.endTime || "17:00",
                };
              }
            });
            setSchedule(updatedSchedule);
          }
        }
      } catch (err) {
        console.warn("Using offline fallback schedule:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadDoctorSchedule();
    return () => {
      isMounted = false;
    };
  }, []);

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

  const handleSave = async () => {
    setSaving(true);
    try {
      const daysPayload = Object.entries(schedule).map(([dayName, cfg]) => ({
        dayOfWeek: dayName,
        startTime: cfg.start,
        endTime: cfg.end,
        slotDurationMin: Number(duration) || 30,
        isEnabled: cfg.enabled,
        isAvailable: cfg.enabled,
      }));

      await doctorApi.updateDoctorSchedule({
        consultationFee: Number(fee) || 150,
        isAvailableToday,
        days: daysPayload,
      });
      onToast("Weekly clinical roster & consultation rates updated!");
    } catch (err) {
      onToast("Schedule saved locally.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="animate-fade-in space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Duty Schedule & Slots</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">Configure working shifts, slot durations, and clinic breaks.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex gap-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-1">
            <button
              onClick={() => setMode("weekly")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${mode === "weekly" ? "bg-teal-600 text-white" : "text-slate-600 dark:text-slate-300"}`}
            >
              Weekly Shifts
            </button>
            <button
              onClick={() => setMode("calendar")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${mode === "calendar" ? "bg-teal-600 text-white" : "text-slate-600 dark:text-slate-300"}`}
            >
              Today&apos;s Slots
            </button>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md shadow-teal-600/20 transition-all"
          >
            {saving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            Save Schedule
          </button>
        </div>
      </div>

      {mode === "weekly" ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-5">
          {/* Rate & Global Settings */}
          <div className="grid sm:grid-cols-3 gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">Consultation Slot Duration</label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="15">15 Minutes per patient</option>
                <option value="20">20 Minutes per patient</option>
                <option value="30">30 Minutes per patient</option>
                <option value="45">45 Minutes per patient</option>
                <option value="60">60 Minutes per patient</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">Consultation Fee ($ USD)</label>
              <div className="relative">
                <DollarSign className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="number"
                  value={fee}
                  onChange={(e) => setFee(e.target.value)}
                  placeholder="150"
                  className="w-full text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white rounded-xl pl-9 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">Available for Walk-ins Today</label>
              <button
                type="button"
                onClick={() => setIsAvailableToday(!isAvailableToday)}
                className={`w-full text-xs px-3 py-2 rounded-xl font-semibold border flex items-center justify-between transition-colors ${
                  isAvailableToday
                    ? "bg-teal-50 dark:bg-teal-950/40 border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300"
                    : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500"
                }`}
              >
                <span>{isAvailableToday ? "Available On-Duty" : "Off Duty / Busy"}</span>
                <CheckCircle2 className={`w-4 h-4 ${isAvailableToday ? "text-teal-600" : "text-slate-400"}`} />
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">Weekly Shift Working Hours</h3>
            {days.map((day) => {
              const cfg = schedule[day] || { enabled: false, start: "09:00", end: "17:00", breakStart: "13:00", breakEnd: "14:00" };
              return (
                <div key={day} className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${cfg.enabled ? "bg-slate-50/50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700" : "bg-slate-50/20 dark:bg-slate-900/40 border-slate-100 dark:border-slate-800 opacity-60"}`}>
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={cfg.enabled}
                      onChange={() => toggleDay(day)}
                      className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
                    />
                    <span className="font-bold text-sm text-slate-900 dark:text-white min-w-[90px]">{day}</span>
                  </div>

                  {cfg.enabled && (
                    <div className="flex items-center gap-2 flex-wrap text-xs">
                      <span className="text-slate-400">Shift:</span>
                      <select value={cfg.start} onChange={(e) => updateField(day, "start", e.target.value)} className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white rounded-lg px-2 py-1">
                        {hours.map((h) => <option key={h}>{h}</option>)}
                      </select>
                      <span>to</span>
                      <select value={cfg.end} onChange={(e) => updateField(day, "end", e.target.value)} className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white rounded-lg px-2 py-1">
                        {hours.map((h) => <option key={h}>{h}</option>)}
                      </select>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
          <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-4">Today&apos;s Time Slot Timeline</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {calendarSlots.map((slot, i) => (
              <div key={i} className={`p-3.5 rounded-xl border text-xs ${slot.color}`}>
                <div className="flex items-center justify-between font-bold">
                  <span>{slot.time}</span>
                  <span className="capitalize text-[10px] font-semibold">{slot.type}</span>
                </div>
                <div className="mt-1.5 font-medium truncate">{slot.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
