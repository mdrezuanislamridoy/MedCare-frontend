import { DollarSign, TrendingUp, Clock, ArrowUp } from "lucide-react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import StatusBadge from "../components/StatusBadge";
import { earningsData } from "../data/mockData";

const kpiCards = [
  { label: "Today", value: `$${earningsData.today}`, icon: DollarSign, color: "text-teal-600", bg: "bg-teal-50" },
  { label: "This Week", value: `$${earningsData.weekly.toLocaleString()}`, icon: TrendingUp, color: "text-blue-600", bg: "bg-blue-50" },
  { label: "This Month", value: `$${earningsData.monthly.toLocaleString()}`, icon: TrendingUp, color: "text-indigo-600", bg: "bg-indigo-50" },
  { label: "Total Earnings", value: `$${earningsData.total.toLocaleString()}`, icon: DollarSign, color: "text-purple-600", bg: "bg-purple-50" },
  { label: "Platform Commission", value: `$${earningsData.commission.toLocaleString()}`, icon: DollarSign, color: "text-slate-600", bg: "bg-slate-100" },
  { label: "Pending Payout", value: `$${earningsData.pendingPayout.toLocaleString()}`, icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
];

const weeklyData = [
  { day: "Mon", earnings: 450 },
  { day: "Tue", earnings: 750 },
  { day: "Wed", earnings: 300 },
  { day: "Thu", earnings: 600 },
  { day: "Fri", earnings: 450 },
  { day: "Sat", earnings: 0 },
  { day: "Sun", earnings: 0 },
];

export default function Earnings() {
  return (
    <div className="animate-fade-in space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Earnings</h1>
        <div className="flex gap-2">
          <button className="border border-slate-200 text-slate-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">Export Report</button>
          <button className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">Request Payout</button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {kpiCards.map((card) => (
          <div key={card.label} className="bg-white rounded-xl border border-slate-200 p-4">
            <div className={`w-8 h-8 rounded-lg ${card.bg} flex items-center justify-center mb-3`}>
              <card.icon className={`w-4 h-4 ${card.color}`} />
            </div>
            <div className="text-lg font-bold text-slate-900">{card.value}</div>
            <div className="text-xs text-slate-500 mt-0.5">{card.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2 bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-slate-900">Monthly Earnings Trend</h2>
            <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full font-medium flex items-center gap-1">
              <ArrowUp className="w-3 h-3" /> 8.2% vs last month
            </span>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={earningsData.chartData} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="earGrad2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0d9488" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#0d9488" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(v: number) => [`$${v.toLocaleString()}`, "Earnings"]} contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 12 }} />
                <Area type="monotone" dataKey="earnings" stroke="#0d9488" strokeWidth={2.5} fill="url(#earGrad2)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="font-semibold text-slate-900 mb-4">This Week</h2>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
                <Tooltip formatter={(v: number) => [`$${v}`, "Earnings"]} contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 12 }} />
                <Bar dataKey="earnings" fill="#0d9488" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 text-sm">
            <div className="flex justify-between text-slate-500">
              <span>Week Total</span>
              <span className="font-semibold text-slate-900">$2,550</span>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-semibold text-slate-900">Transaction History</h2>
          <select className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-teal-500">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 90 days</option>
          </select>
        </div>
        <div className="responsive-table">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-4 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wide">Transaction ID</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wide">Patient</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wide">Date</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wide">Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wide">Amount</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wide">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {earningsData.transactions.map((tx) => (
                <tr key={tx.id} className="table-row-hover">
                  <td className="px-4 py-3.5 font-mono text-xs text-slate-500">{tx.id}</td>
                  <td className="px-4 py-3.5 font-medium text-slate-900">{tx.patient}</td>
                  <td className="px-4 py-3.5 text-slate-600">{tx.date}</td>
                  <td className="px-4 py-3.5">
                    <StatusBadge status={tx.type === "Online" ? "online" : "in-person"} size="sm" />
                  </td>
                  <td className="px-4 py-3.5 font-semibold text-slate-900">${tx.amount}</td>
                  <td className="px-4 py-3.5">
                    <StatusBadge status={tx.status} size="sm" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
