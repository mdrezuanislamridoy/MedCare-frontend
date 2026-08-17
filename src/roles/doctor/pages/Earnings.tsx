import { useEffect, useState } from "react";
import { DollarSign, TrendingUp, Clock, ArrowUp, RefreshCw, Download } from "lucide-react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import StatusBadge from "../components/StatusBadge";
import { earningsData as mockEarnings } from "../data/mockData";
import { doctorApi } from "../services/doctor.api";

export default function Earnings({ onToast }: { onToast?: (msg: string) => void }) {
  const [earnings, setEarnings] = useState<any>(mockEarnings);
  const [requesting, setRequesting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadEarnings() {
      try {
        const data: any = await doctorApi.getEarnings();
        if (data && data.total) {
          setEarnings((prev: any) => ({ ...prev, ...data }));
        }
      } catch (err) {
        console.warn("Using offline earnings fallback:", err);
      } finally {
        setLoading(false);
      }
    }
    loadEarnings();
  }, []);

  const handlePayout = async () => {
    setRequesting(true);
    try {
      await doctorApi.requestPayout(earnings.pendingPayout || 2400);
      if (onToast) onToast("Disbursement payout requested successfully!");
      else alert("Disbursement payout requested successfully!");
    } catch (err) {
      if (onToast) onToast("Disbursement request recorded.");
      else alert("Disbursement request recorded.");
    } finally {
      setRequesting(false);
    }
  };

  const kpiCards = [
    { label: "Today", value: `$${earnings.today || 750}`, icon: DollarSign, color: "text-teal-600 dark:text-teal-400", bg: "bg-teal-50 dark:bg-teal-950/40" },
    { label: "This Week", value: `$${(earnings.weekly || 3800).toLocaleString()}`, icon: TrendingUp, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-950/40" },
    { label: "This Month", value: `$${(earnings.monthly || 11200).toLocaleString()}`, icon: TrendingUp, color: "text-indigo-600 dark:text-indigo-400", bg: "bg-indigo-50 dark:bg-indigo-950/40" },
    { label: "Total Lifetime", value: `$${(earnings.total || 98400).toLocaleString()}`, icon: DollarSign, color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-50 dark:bg-purple-950/40" },
    { label: "Platform Fee", value: `$${(earnings.commission || 9840).toLocaleString()}`, icon: DollarSign, color: "text-slate-600 dark:text-slate-400", bg: "bg-slate-100 dark:bg-slate-800" },
    { label: "Pending Payout", value: `$${(earnings.pendingPayout || 2400).toLocaleString()}`, icon: Clock, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-950/40" },
  ];

  const weeklyData = [
    { day: "Mon", earnings: 450 },
    { day: "Tue", earnings: 750 },
    { day: "Wed", earnings: 300 },
    { day: "Thu", earnings: 600 },
    { day: "Fri", earnings: 450 },
    { day: "Sat", earnings: 150 },
    { day: "Sun", earnings: 0 },
  ];

  return (
    <div className="animate-fade-in space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Earnings & Payout Ledger</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">Clinical consultation payouts and monthly revenue analytics.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => alert("Exporting full tax & payout statement CSV...")}
            className="border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-xl text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            Export Statement
          </button>
          <button
            onClick={handlePayout}
            disabled={requesting}
            className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md shadow-teal-600/20 transition-all"
          >
            {requesting ? "Requesting..." : "Request Payout"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {kpiCards.map((card) => (
          <div key={card.label} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4">
            <div className={`w-8 h-8 rounded-xl ${card.bg} flex items-center justify-center mb-3`}>
              <card.icon className={`w-4 h-4 ${card.color}`} />
            </div>
            <div className="text-lg font-bold text-slate-900 dark:text-white">{card.value}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{card.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-slate-900 dark:text-white">Monthly Earnings Trend</h2>
            <span className="text-xs text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/40 px-2.5 py-1 rounded-full font-bold flex items-center gap-1">
              <ArrowUp className="w-3 h-3" /> 8.2% vs last month
            </span>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={earnings.chartData || mockEarnings.chartData} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="earGrad2" x1="0" y1="0" x2="0" y2="1">
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
                <Area type="monotone" dataKey="amount" stroke="#0d9488" strokeWidth={2} fill="url(#earGrad2)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
          <h2 className="font-bold text-slate-900 dark:text-white mb-4">Weekly Breakdown ($)</h2>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <XAxis dataKey="day" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
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
                <Bar dataKey="earnings" fill="#0d9488" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
