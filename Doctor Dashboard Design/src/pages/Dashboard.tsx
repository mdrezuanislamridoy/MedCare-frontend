import { Calendar, Clock, Users, TrendingUp, Star, DollarSign, CheckCircle, AlertCircle, ArrowUp, ArrowRight } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import StatusBadge from "../components/StatusBadge";
import { todayAppointments, earningsData, reviews, patients } from "../data/mockData";

const kpiCards = [
  { label: "Today's Appointments", value: "6", sub: "+2 pending", icon: Calendar, color: "bg-teal-500", light: "bg-teal-50", text: "text-teal-600" },
  { label: "Upcoming", value: "18", sub: "Next 7 days", icon: Clock, color: "bg-blue-500", light: "bg-blue-50", text: "text-blue-600" },
  { label: "Completed", value: "124", sub: "This month", icon: CheckCircle, color: "bg-green-500", light: "bg-green-50", text: "text-green-600" },
  { label: "Pending Review", value: "4", sub: "Needs action", icon: AlertCircle, color: "bg-amber-500", light: "bg-amber-50", text: "text-amber-600" },
  { label: "Total Patients", value: "1,247", sub: "+12 this month", icon: Users, color: "bg-indigo-500", light: "bg-indigo-50", text: "text-indigo-600" },
  { label: "Monthly Earnings", value: "$11,200", sub: "+8.2% vs last month", icon: DollarSign, color: "bg-purple-500", light: "bg-purple-50", text: "text-purple-600" },
  { label: "Avg. Rating", value: "4.8", sub: "From 312 reviews", icon: Star, color: "bg-orange-500", light: "bg-orange-50", text: "text-orange-600" },
];

export default function Dashboard() {
  const now = new Date();
  const currentHour = now.getHours();

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Good {currentHour < 12 ? "Morning" : currentHour < 17 ? "Afternoon" : "Evening"}, Dr. Mitchell</h1>
          <p className="text-slate-500 mt-1 text-sm">Monday, August 10, 2026 · You have 6 appointments today</p>
        </div>
        <button className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          <Calendar className="w-4 h-4" />
          Start Next Consultation
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-7 gap-4">
        {kpiCards.map((card) => (
          <div key={card.label} className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col gap-3 hover:shadow-md transition-shadow">
            <div className={`w-9 h-9 rounded-lg ${card.light} flex items-center justify-center`}>
              <card.icon className={`w-4 h-4 ${card.text}`} />
            </div>
            <div>
              <div className="text-xl font-bold text-slate-900">{card.value}</div>
              <div className="text-xs text-slate-500 mt-0.5 leading-tight">{card.label}</div>
              <div className={`text-xs mt-1 font-medium ${card.text}`}>{card.sub}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Today's Schedule */}
        <div className="xl:col-span-2 bg-white rounded-xl border border-slate-200">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-semibold text-slate-900">Today&apos;s Schedule</h2>
            <span className="text-xs text-slate-500">August 10, 2026</span>
          </div>
          <div className="divide-y divide-slate-50">
            {todayAppointments.map((apt) => (
              <div key={apt.id} className="px-5 py-3.5 flex items-center gap-4 hover:bg-slate-50 transition-colors group">
                <div className="text-center min-w-[60px]">
                  <div className="text-sm font-semibold text-slate-900">{apt.time.split(" ")[0]}</div>
                  <div className="text-xs text-slate-400">{apt.time.split(" ")[1]}</div>
                </div>
                <div className="w-px h-10 bg-slate-200" />
                <img src={apt.avatar} alt={apt.patient} className="w-9 h-9 rounded-full object-cover flex-shrink-0 bg-slate-100" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-slate-900 text-sm truncate">{apt.patient}</div>
                  <div className="text-xs text-slate-500">{apt.reason}</div>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={apt.type === "Online" ? "online" : "in-person"} size="sm" />
                  <StatusBadge status={apt.status} size="sm" />
                </div>
                {apt.status === "confirmed" && (
                  <button className="opacity-0 group-hover:opacity-100 text-xs bg-teal-600 text-white px-3 py-1.5 rounded-lg font-medium transition-all">
                    Start
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Earnings Overview */}
        <div className="bg-white rounded-xl border border-slate-200">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-semibold text-slate-900">Earnings Overview</h2>
            <span className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded-full font-medium flex items-center gap-1">
              <ArrowUp className="w-3 h-3" /> 8.2%
            </span>
          </div>
          <div className="px-5 pt-4 pb-2">
            <div className="text-3xl font-bold text-slate-900">$11,200</div>
            <div className="text-sm text-slate-500">This month</div>
            <div className="mt-4 h-36">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={earningsData.chartData} margin={{ top: 2, right: 4, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="earningsGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0d9488" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#0d9488" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                  <Tooltip formatter={(v: number) => [`$${v.toLocaleString()}`, "Earnings"]} contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 12 }} />
                  <Area type="monotone" dataKey="earnings" stroke="#0d9488" strokeWidth={2} fill="url(#earningsGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="px-5 pb-4 grid grid-cols-2 gap-3 mt-2">
            <div className="bg-slate-50 rounded-lg p-3">
              <div className="text-xs text-slate-500">Today</div>
              <div className="font-bold text-slate-900">${earningsData.today}</div>
            </div>
            <div className="bg-slate-50 rounded-lg p-3">
              <div className="text-xs text-slate-500">Pending Payout</div>
              <div className="font-bold text-slate-900">${earningsData.pendingPayout.toLocaleString()}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Recent Patients */}
        <div className="bg-white rounded-xl border border-slate-200">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-semibold text-slate-900">Recent Patients</h2>
            <button className="text-xs text-teal-600 hover:text-teal-700 font-medium flex items-center gap-1">View All <ArrowRight className="w-3 h-3" /></button>
          </div>
          <div className="divide-y divide-slate-50">
            {patients.slice(0, 5).map((p) => (
              <div key={p.id} className="px-5 py-3 flex items-center gap-3 hover:bg-slate-50 transition-colors">
                <img src={p.avatar} alt={p.name} className="w-9 h-9 rounded-full object-cover bg-slate-100" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-slate-900 text-sm truncate">{p.name}</div>
                  <div className="text-xs text-slate-500">{p.age}y · {p.gender} · {p.conditions[0]}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-500">Last visit</div>
                  <div className="text-xs font-medium text-slate-700">{p.lastVisit}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Reviews */}
        <div className="bg-white rounded-xl border border-slate-200">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-semibold text-slate-900">Recent Reviews</h2>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span className="font-bold text-slate-900 text-sm">4.8</span>
              <span className="text-xs text-slate-500">/ 5.0</span>
            </div>
          </div>
          <div className="divide-y divide-slate-50">
            {reviews.slice(0, 4).map((r) => (
              <div key={r.id} className="px-5 py-3.5">
                <div className="flex items-start gap-3">
                  <img src={r.avatar} alt={r.patient} className="w-8 h-8 rounded-full object-cover bg-slate-100 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium text-slate-900 text-sm">{r.patient}</span>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-3 h-3 ${i < r.rating ? "text-amber-400 fill-amber-400" : "text-slate-200"}`} />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 line-clamp-2">{r.comment}</p>
                    <div className="text-xs text-slate-400 mt-1">{r.date}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
