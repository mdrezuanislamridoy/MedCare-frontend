import { useEffect, useState } from 'react';
import { CreditCard, CheckCircle, Clock, RotateCcw, TrendingUp, Receipt, Download } from 'lucide-react';
import { payments as mockPayments, doctors, appointments } from '../data/mockData';
import { patientApi } from '../services/patient.api';
import { Card, Badge, StatCard, Button } from './ui';

const METHOD_ICONS: Record<string, string> = { card: '💳', upi: '📱', netbanking: '🏦', wallet: '👜', cash: '💵' };

export default function Payments() {
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentList, setPaymentList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPayments() {
      try {
        const data: any = await patientApi.listPayments();
        if (data && Array.isArray(data) && data.length > 0) {
          setPaymentList(data);
        } else {
          setPaymentList(mockPayments);
        }
      } catch (err) {
        console.warn('Using offline payments fallback:', err);
        setPaymentList(mockPayments);
      } finally {
        setLoading(false);
      }
    }
    loadPayments();
  }, []);

  const totalPaid = paymentList.filter(p => p.status === 'completed' || p.status === 'SUCCESS').reduce((s, p) => s + (p.amount || 0), 0);
  const totalPending = paymentList.filter(p => p.status === 'pending' || p.status === 'PENDING').reduce((s, p) => s + (p.amount || 0), 0);
  const totalRefunded = paymentList.filter(p => p.status === 'refunded' || p.status === 'REFUNDED').reduce((s, p) => s + (p.amount || 0), 0);

  const filtered = paymentList.filter(p => {
    const s = (p.status || 'completed').toLowerCase();
    return statusFilter === 'all' || s === statusFilter;
  });

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="font-patient text-2xl font-bold text-slate-800 dark:text-white">Payments & Billing Ledger</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">Track all your consultation invoices, digital receipts, and refunds.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Settled" value={`$${totalPaid.toLocaleString()}`} color="emerald" icon={<CheckCircle className="w-5 h-5" />} />
        <StatCard label="Pending" value={`$${totalPending.toLocaleString()}`} color="amber" icon={<Clock className="w-5 h-5" />} />
        <StatCard label="Refunded" value={`$${totalRefunded.toLocaleString()}`} color="violet" icon={<RotateCcw className="w-5 h-5" />} />
        <StatCard label="Transactions" value={paymentList.length} color="sky" icon={<TrendingUp className="w-5 h-5" />} />
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-1 mb-5 w-fit">
        {['all', 'completed', 'pending', 'refunded'].map(s => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors capitalize ${
              statusFilter === s
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {/* Transactions table */}
      <Card className="overflow-hidden bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
        <div className="responsive-table overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800">
                {['Invoice ID', 'Doctor', 'Consultation', 'Amount', 'Payment Method', 'Status', 'Date', 'Receipt'].map(h => (
                  <th key={h} className="px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {filtered.map(p => {
                const drName = p.doctor?.user?.name || p.doctorName || 'Dr. Sarah Mitchell';
                const status = (p.status || 'completed').toLowerCase();

                return (
                  <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                    <td className="px-4 py-3.5 font-mono font-bold text-slate-700 dark:text-slate-300">{p.id}</td>
                    <td className="px-4 py-3.5 font-semibold text-slate-800 dark:text-white">{drName}</td>
                    <td className="px-4 py-3.5 text-slate-500 dark:text-slate-400">{p.reason || 'General Consultation'}</td>
                    <td className="px-4 py-3.5 font-bold text-slate-900 dark:text-white">${p.amount}</td>
                    <td className="px-4 py-3.5">
                      <span className="inline-flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
                        <span>{METHOD_ICONS[p.method || 'card'] || '💳'}</span>
                        <span className="capitalize">{p.method || 'Card'}</span>
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <Badge variant={status === 'completed' || status === 'success' ? 'paid' : status} />
                    </td>
                    <td className="px-4 py-3.5 text-slate-400 whitespace-nowrap">{p.date || '2026-08-10'}</td>
                    <td className="px-4 py-3.5">
                      <button
                        onClick={() => alert(`Downloading tax invoice for ${p.id}...`)}
                        className="inline-flex items-center gap-1 text-teal-600 dark:text-teal-400 hover:underline font-semibold"
                      >
                        <Download className="w-3.5 h-3.5" /> PDF
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
