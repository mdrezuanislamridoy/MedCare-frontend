import { useEffect, useState } from "react";
import {
  Calendar,
  Clock,
  Users,
  Star,
  DollarSign,
  CheckCircle,
  AlertCircle,
  ArrowUp,
  Sparkles,
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import StatusBadge from "../components/StatusBadge";
import { todayAppointments, earningsData } from "../data/mockData";
import { useAuthStore } from "../../../common/stores/auth.store";
import { doctorApi, DoctorDashboardData } from "../services/doctor.api";

export default function Dashboard() {
  const { user } = useAuthStore();
  const [liveData, setLiveData] = useState<DoctorDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const now = new Date();
  const currentHour = now.getHours();
  const greeting = currentHour < 12 ? "Morning" : currentHour < 17 ? "Afternoon" : "Evening";
  const doctorName = user?.name || "Dr. Sarah Mitchell";

  useEffect(() => {
    async function loadDashboard() {
      try {
        const data = await doctorApi.getDashboardSummary();
        setLiveData(data);
      } catch (err) {
        console.warn("Using offline mock summary for doctor dashboard:", err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  const todayCount = liveData?.stats?.todayAppointments ?? 6;
  const completedCount = liveData?.stats?.completedToday ?? 124;
  const pendingNotes = liveData?.stats?.pendingNotes ?? 4;
  const totalPatients = liveData?.stats?.totalPatients ?? 1247;
  const monthlyEarnings = liveData?.stats?.monthlyEarnings ?? 11200;
  const rating = liveData?.stats?.rating ?? 4.8;
  const totalReviews = liveData?.stats?.totalReviews ?? 312;

  const kpiCards = [
    { label: "Today's Consults", value: String(todayCount), sub: "+2 queue", icon: Calendar, color: "bg-teal-500", light: "bg-teal-50 dark:bg-teal-950/40", text: "text-teal-600 dark:text-teal-400" },
    { label: "Upcoming", value: "18", sub: "Next 7 days", icon: Clock, color: "bg-blue-500", light: "bg-blue-50 dark:bg-blue-950/40", text: "text-blue-600 dark:text-blue-400" },
    { label: "Completed", value: String(completedCount), sub: "This month", icon: CheckCircle, color: "bg-green-500", light: "bg-green-50 dark:bg-green-950/40", text: "text-green-600 dark:text-green-400" },
    { label: "Pending Notes", value: String(pendingNotes), sub: "Needs chart", icon: AlertCircle, color: "bg-amber-500", light: "bg-amber-50 dark:bg-amber-950/40", text: "text-amber-600 dark:text-amber-400" },
    { label: "Total Patients", value: String(totalPatients), sub: "+12 this month", icon: Users, color: "bg-indigo-500", light: "bg-indigo-50 dark:bg-indigo-950/40", text: "text-indigo-600 dark:text-indigo-400" },
    { label: "Monthly Revenue", value: `$${monthlyEarnings.toLocaleString()}`, sub: "+8.2% vs last month", icon: DollarSign, color: "bg-purple-500", light: "bg-purple-50 dark:bg-purple-950/40", text: "text-purple-600 dark:text-purple-400" },
    { label: "Avg. Rating", value: String(rating), sub: `From ${totalReviews} reviews`, icon: Star, color: "bg-orange-500", light: "bg-orange-50 dark:bg-orange-950/40", text: "text-orange-600 dark:text-orange-400" },
  ];

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            Good {greeting}, {doctorName.startsWith("Dr.") ? doctorName : `Dr. ${doctorName}`}
            <span className="inline-block animate-bounce">👋</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
            {now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })} · You have {todayCount} consultations scheduled today
          </p>
        </div>
        <button className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-md shadow-teal-600/20 transition-all">
          <Sparkles className="w-4 h-4" />
          Start Next Consultation
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-7 gap-4">
        {kpiCards.map((card) => (
          <div key={card.label} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 flex flex-col gap-3 hover:shadow-md transition-shadow">
            <div className={`w-9 h-9 rounded-xl ${card.light} flex items-center justify-center`}>
              <card.icon className={`w-4 h-4 ${card.text}`} />
            </div>
            <div>
              <div className="text-xl font-bold text-slate-900 dark:text-white">{card.value}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-tight">{card.label}</div>
              <div className={`text-xs mt-1 font-medium ${card.text}`}>{card.sub}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Today's Schedule */}
        <div className="xl:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h2 className="font-bold text-slate-900 dark:text-white">Today&apos;s Clinical Schedule</h2>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Real-Time Patient Queue</span>
          </div>
          <div className="divide-y divide-slate-50 dark:divide-slate-800/60">
            {todayAppointments.map((apt) => (
              <div key={apt.id} className="px-5 py-3.5 flex items-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors group">
                <div className="text-center min-w-[60px]">
                  <div className="text-sm font-semibold text-slate-900 dark:text-white">{apt.time.split(" ")[0]}</div>
                  <div className="text-xs text-slate-400">{apt.time.split(" ")[1]}</div>
                </div>
                <div className="w-px h-10 bg-slate-200 dark:bg-slate-800" />
                <img src={apt.avatar} alt={apt.patient} className="w-9 h-9 rounded-full object-cover flex-shrink-0 bg-slate-100" />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-slate-900 dark:text-white text-sm truncate">{apt.patient}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">{apt.reason}</div>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={apt.type === "Online" ? "online" : "in-person"} size="sm" />
                  <StatusBadge status={apt.status} size="sm" />
                </div>
                {apt.status === "confirmed" && (
                  <button className="opacity-0 group-hover:opacity-100 text-xs bg-teal-600 text-white px-3 py-1.5 rounded-lg font-semibold transition-all">
                    Start
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Earnings Overview */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h2 className="font-bold text-slate-900 dark:text-white">Earnings Ledger</h2>
            <span className="text-xs bg-green-50 dark:bg-green-950/40 text-green-600 dark:text-green-400 px-2 py-1 rounded-full font-medium flex items-center gap-1">
              <ArrowUp className="w-3 h-3" /> 8.2%
            </span>
          </div>
          <div className="px-5 pt-4 pb-2">
            <div className="text-3xl font-bold text-slate-900 dark:text-white">${monthlyEarnings.toLocaleString()}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">This month (estimated payouts)</div>
            <div className="mt-4 h-36">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={earningsData.chartData} margin={{ top: 2, right: 4, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="earningsGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0d9488" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#0d9488" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      borderColor: "#334155",
                      borderRadius: "12px",
                      color: "#fff",
                      fontSize: "12px",
                    }}
                  />
                  <Area type="monotone" dataKey="amount" stroke="#0d9488" strokeWidth={2} fill="url(#earningsGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
