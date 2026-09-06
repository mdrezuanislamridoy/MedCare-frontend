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
  Building2,
  MapPin,
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import StatusBadge from "../components/StatusBadge";
import { useAuthStore } from "../../../common/stores/auth.store";
import { doctorApi, DoctorDashboardData } from "../services/doctor.api";

const emptyEarningsChart = [
  { day: "Mon", earnings: 0 },
  { day: "Tue", earnings: 0 },
  { day: "Wed", earnings: 0 },
  { day: "Thu", earnings: 0 },
  { day: "Fri", earnings: 0 },
  { day: "Sat", earnings: 0 },
  { day: "Sun", earnings: 0 },
];

export default function Dashboard() {
  const { user } = useAuthStore();
  const [liveData, setLiveData] = useState<DoctorDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const now = new Date();
  const currentHour = now.getHours();
  const greeting = currentHour < 12 ? "Morning" : currentHour < 17 ? "Afternoon" : "Evening";

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

  const doctorName = liveData?.profile?.name || user?.name || "Doctor";
  const clinicName = liveData?.profile?.clinicName || "MedCare Health Center";
  const roomNumber = liveData?.profile?.roomNumber || "Consultation Room";

  const todayCount = liveData?.stats?.todayAppointments ?? 0;
  const completedCount = liveData?.stats?.completedToday ?? 0;
  const pendingToday = liveData?.stats?.pendingToday ?? liveData?.stats?.pendingNotes ?? 0;
  const totalPatients = liveData?.stats?.totalPatients ?? 0;
  const todayEarnings = liveData?.stats?.todayEarnings ?? 0;
  const totalEarnings = liveData?.stats?.totalEarnings ?? liveData?.stats?.monthlyEarnings ?? 0;
  const rating = liveData?.profile?.rating ?? liveData?.stats?.rating ?? 0;
  const totalReviews = liveData?.profile?.reviewCount ?? liveData?.stats?.totalReviews ?? 0;

  const kpiCards = [
    { label: "Today's Consults", value: String(todayCount), sub: `${pendingToday} pending`, icon: Calendar, color: "bg-teal-500", light: "bg-teal-50 dark:bg-teal-950/40", text: "text-teal-600 dark:text-teal-400" },
    { label: "Completed Today", value: String(completedCount), sub: "Recorded in EHR", icon: CheckCircle, color: "bg-green-500", light: "bg-green-50 dark:bg-green-950/40", text: "text-green-600 dark:text-green-400" },
    { label: "Pending in Queue", value: String(pendingToday), sub: "Needs chart", icon: AlertCircle, color: "bg-amber-500", light: "bg-amber-50 dark:bg-amber-950/40", text: "text-amber-600 dark:text-amber-400" },
    { label: "Today's Revenue", value: `$${todayEarnings.toLocaleString()}`, sub: "Consultation fees", icon: DollarSign, color: "bg-emerald-500", light: "bg-emerald-50 dark:bg-emerald-950/40", text: "text-emerald-600 dark:text-emerald-400" },
    { label: "Total Patients", value: String(totalPatients), sub: "Patient records", icon: Users, color: "bg-indigo-500", light: "bg-indigo-50 dark:bg-indigo-950/40", text: "text-indigo-600 dark:text-indigo-400" },
    { label: "Total Revenue", value: `$${totalEarnings.toLocaleString()}`, sub: "Settled payouts", icon: DollarSign, color: "bg-purple-500", light: "bg-purple-50 dark:bg-purple-950/40", text: "text-purple-600 dark:text-purple-400" },
    { label: "Avg. Rating", value: String(rating), sub: `From ${totalReviews} reviews`, icon: Star, color: "bg-orange-500", light: "bg-orange-50 dark:bg-orange-950/40", text: "text-orange-600 dark:text-orange-400" },
  ];

  const rawQueue = liveData?.todayQueue?.length ? liveData.todayQueue : (liveData?.upcomingAppointments?.length ? liveData.upcomingAppointments : []);
  const displayAppointments = rawQueue.map((apt: any, idx: number) => ({
    id: apt.id || `apt-${idx}`,
    time: apt.time || (apt.startTime ? new Date(apt.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'),
    patient: apt.patient?.name || (apt.patient?.user ? `${apt.patient.user.firstName} ${apt.patient.user.lastName}` : apt.patientName || 'Patient'),
    avatar: apt.patient?.avatar || apt.avatar || '',
    reason: apt.reason || apt.notes || 'General Consultation',
    type: apt.type === 'online' || apt.type === 'Online' ? 'Online' : 'In-Person',
    status: apt.status || 'confirmed',
  }));

  const dynamicEarningsChart = (liveData as any)?.earningsTrends?.length ? (liveData as any).earningsTrends : emptyEarningsChart;

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            Good {greeting}, {doctorName.startsWith("Dr.") ? doctorName : `Dr. ${doctorName}`}
            <span className="inline-block animate-bounce">👋</span>
          </h1>
          <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 mt-1 text-xs sm:text-sm">
            <span>{now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</span>
            <span>·</span>
            <span className="flex items-center gap-1"><Building2 className="w-3.5 h-3.5 text-teal-600" /> {clinicName}</span>
            <span>·</span>
            <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-slate-400" /> {roomNumber}</span>
          </div>
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
            {displayAppointments.length === 0 ? (
              <div className="p-12 text-center">
                <Calendar className="w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No appointments scheduled for today</p>
                <p className="text-xs text-slate-400 mt-1">Your real-time patient queue is currently clear.</p>
              </div>
            ) : (
              displayAppointments.map((apt) => (
                <div key={apt.id} className="px-5 py-3.5 flex items-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors group">
                  <div className="text-center min-w-[60px]">
                    <div className="text-sm font-semibold text-slate-900 dark:text-white">{apt.time.split(" ")[0]}</div>
                    <div className="text-xs text-slate-400">{apt.time.split(" ")[1]}</div>
                  </div>
                  <div className="w-px h-10 bg-slate-200 dark:bg-slate-800" />
                  <div className="w-9 h-9 rounded-full bg-teal-100 dark:bg-teal-900/50 flex items-center justify-center text-xs font-bold text-teal-700 dark:text-teal-300 flex-shrink-0">
                    {apt.patient.split(" ")[0]?.[0] || "P"}
                  </div>
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
              ))
            )}
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
            <div className="text-3xl font-bold text-slate-900 dark:text-white">${totalEarnings.toLocaleString()}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Total processed consultation earnings</div>
            <div className="mt-4 h-36">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dynamicEarningsChart} margin={{ top: 2, right: 4, left: -20, bottom: 0 }}>
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
