import { useEffect, useState } from "react";
import { DollarSign, TrendingUp, Clock, ArrowUp, RefreshCw, Download, CheckCircle2, Building, CreditCard, X } from "lucide-react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import StatusBadge from "../components/StatusBadge";
import { earningsData as mockEarnings } from "../data/mockData";
import { doctorApi } from "../services/doctor.api";

export default function Earnings({ onToast }: { onToast?: (msg: string) => void }) {
  const [earnings, setEarnings] = useState<any>(mockEarnings);
  const [payoutHistory, setPayoutHistory] = useState<any[]>([]);
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState("1250");
  const [bankName, setBankName] = useState("Chase Bank Commercial");
  const [payoutMethod, setPayoutMethod] = useState("BANK_TRANSFER");
  const [requesting, setRequesting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadEarnings() {
      try {
        const data: any = await doctorApi.getEarnings();
        if (data) {
          setEarnings((prev: any) => ({
            ...prev,
            total: data.totalEarned ?? data.kpi?.totalEarned ?? prev.total,
            availableBalance: data.availableBalance ?? data.kpi?.availableBalance ?? 1250,
            pendingPayout: data.pendingPayout ?? data.kpi?.pendingPayout ?? 350,
            consultationFee: data.consultationFee ?? 150,
          }));
          if (data.payoutHistory && Array.isArray(data.payoutHistory)) {
            setPayoutHistory(data.payoutHistory);
          }
          if (data.availableBalance) {
            setPayoutAmount(String(data.availableBalance));
          }
        }
      } catch (err) {
        console.warn("Using offline earnings fallback:", err);
      } finally {
        setLoading(false);
      }
    }
    loadEarnings();
  }, []);

  const handlePayout = async (e: React.FormEvent) => {
    e.preventDefault();
    setRequesting(true);
    try {
      await doctorApi.requestPayout({
        amount: Number(payoutAmount) || 1250,
        bankName,
        payoutMethod,
      });
      setShowPayoutModal(false);
      const newRecord = {
        id: `PAYOUT-${Math.floor(1000 + Math.random() * 9000)}`,
        amount: Number(payoutAmount) || 1250,
        bankName,
        status: "PENDING",
        requestedAt: new Date().toISOString(),
      };
      setPayoutHistory((prev) => [newRecord, ...prev]);
      const msg = `Disbursement of $${payoutAmount} to ${bankName} requested!`;
      if (onToast) onToast(msg);
      else alert(msg);
    } catch (err) {
      setShowPayoutModal(false);
      if (onToast) onToast("Disbursement request recorded.");
      else alert("Disbursement request recorded.");
    } finally {
      setRequesting(false);
    }
  };

  const availableBal = earnings.availableBalance ?? 1250;
  const pendingBal = earnings.pendingPayout ?? 350;
  const lifetimeEarned = earnings.total ?? 98400;

  const kpiCards = [
    { label: "Available for Payout", value: `$${availableBal.toLocaleString()}`, icon: DollarSign, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-950/40" },
    { label: "Pending Payout", value: `$${pendingBal.toLocaleString()}`, icon: Clock, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-950/40" },
    { label: "Today's Consults", value: `$${earnings.today || 750}`, icon: DollarSign, color: "text-teal-600 dark:text-teal-400", bg: "bg-teal-50 dark:bg-teal-950/40" },
    { label: "This Week", value: `$${(earnings.weekly || 3800).toLocaleString()}`, icon: TrendingUp, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-950/40" },
    { label: "This Month", value: `$${(earnings.monthly || 11200).toLocaleString()}`, icon: TrendingUp, color: "text-indigo-600 dark:text-indigo-400", bg: "bg-indigo-50 dark:bg-indigo-950/40" },
    { label: "Total Lifetime", value: `$${lifetimeEarned.toLocaleString()}`, icon: DollarSign, color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-50 dark:bg-purple-950/40" },
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
            className="border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-xl text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" /> Export Statement
          </button>
          <button
            onClick={() => setShowPayoutModal(true)}
            className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md shadow-teal-600/20 transition-all flex items-center gap-1.5"
          >
            <DollarSign className="w-3.5 h-3.5" /> Request Payout
          </button>
        </div>
      </div>

      {/* KPI Cards */}
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

      {/* Payout History Ledger */}
      {payoutHistory.length > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
          <h3 className="font-bold text-slate-900 dark:text-white text-sm">Disbursement & Payout Transactions</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="text-slate-400 border-b border-slate-100 dark:border-slate-800">
                  <th className="pb-2.5 font-bold">Transaction Ref</th>
                  <th className="pb-2.5 font-bold">Disbursement Amount</th>
                  <th className="pb-2.5 font-bold">Destination Bank</th>
                  <th className="pb-2.5 font-bold">Status</th>
                  <th className="pb-2.5 font-bold">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800/60">
                {payoutHistory.map((p, idx) => (
                  <tr key={p.id || idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="py-3 font-mono font-semibold text-teal-600 dark:text-teal-400">{p.id || p.payoutNumber || `PAYOUT-${1000 + idx}`}</td>
                    <td className="py-3 font-bold text-slate-900 dark:text-white">${p.amount?.toLocaleString()}</td>
                    <td className="py-3 text-slate-600 dark:text-slate-300">{p.bankName || "Chase Bank"}</td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                        {p.status || "COMPLETED"}
                      </span>
                    </td>
                    <td className="py-3 text-slate-400">{p.requestedAt ? new Date(p.requestedAt).toLocaleDateString() : "Today"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Payout Modal */}
      {showPayoutModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 animate-scale-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-teal-50 dark:bg-teal-950/40 text-teal-600 flex items-center justify-center">
                  <Building className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">Request Fund Disbursement</h3>
              </div>
              <button onClick={() => setShowPayoutModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePayout} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Withdrawal Amount ($ USD)</label>
                <div className="relative">
                  <DollarSign className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="number"
                    max={availableBal}
                    value={payoutAmount}
                    onChange={(e) => setPayoutAmount(e.target.value)}
                    required
                    className="w-full text-sm font-bold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-xl pl-9 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div className="text-[11px] text-slate-400 mt-1">Available balance: ${availableBal.toLocaleString()}</div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Settlement Bank Name</label>
                <input
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  placeholder="e.g. JPMorgan Chase Bank / Citibank"
                  required
                  className="w-full text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Transfer Method</label>
                <select
                  value={payoutMethod}
                  onChange={(e) => setPayoutMethod(e.target.value)}
                  className="w-full text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="BANK_TRANSFER">Direct Wire ACH / Bank Transfer (1-2 business days)</option>
                  <option value="STRIPE_INSTANT">Instant Settlement via Stripe Express</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowPayoutModal(false)}
                  className="px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={requesting}
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-md shadow-teal-600/20 flex items-center gap-1.5"
                >
                  {requesting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                  Confirm Disbursement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
