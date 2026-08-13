import { useState } from 'react';
import { CreditCard, CheckCircle, Clock, RotateCcw, TrendingUp, Receipt } from 'lucide-react';
import { payments, doctors, appointments } from '../data/mockData';
import { Card, Badge, StatCard, Button } from './ui';

const METHOD_ICONS: Record<string, string> = { card: '💳', upi: '📱', netbanking: '🏦', wallet: '👜' };
const METHOD_LABELS: Record<string, string> = { card: 'Card', upi: 'UPI', netbanking: 'Net Banking', wallet: 'Wallet' };

export default function Payments() {
  const [statusFilter, setStatusFilter] = useState('all');

  const getDr = (id: string) => doctors.find(d => d.id === id)!;
  const getAppt = (id: string) => appointments.find(a => a.id === id)!;

  const totalPaid = payments.filter(p => p.status === 'completed').reduce((s, p) => s + p.amount, 0);
  const totalPending = payments.filter(p => p.status === 'pending').reduce((s, p) => s + p.amount, 0);
  const totalRefunded = payments.filter(p => p.status === 'refunded').reduce((s, p) => s + p.amount, 0);

  const filtered = payments.filter(p => statusFilter === 'all' || p.status === statusFilter);

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="font-patient text-2xl font-semibold text-slate-800">Payments</h1>
        <p className="text-slate-500 text-sm mt-0.5">Track your consultation fees, payments, and refunds.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Paid" value={`₹${totalPaid.toLocaleString()}`} color="emerald" icon={<CheckCircle className="w-5 h-5" />} />
        <StatCard label="Pending" value={`₹${totalPending.toLocaleString()}`} color="amber" icon={<Clock className="w-5 h-5" />} />
        <StatCard label="Refunded" value={`₹${totalRefunded.toLocaleString()}`} color="violet" icon={<RotateCcw className="w-5 h-5" />} />
        <StatCard label="Transactions" value={payments.length} color="sky" icon={<TrendingUp className="w-5 h-5" />} />
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 bg-white border border-slate-200 rounded-xl p-1 mb-5 w-fit">
        {['all', 'completed', 'pending', 'refunded'].map(s => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-colors capitalize ${statusFilter === s ? 'bg-teal-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {/* Transactions table */}
      <Card className="overflow-hidden">
        <div className="responsive-table">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                {['Transaction ID', 'Doctor', 'Appointment', 'Amount', 'Method', 'Status', 'Date', ''].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(pay => {
                const dr = getDr(pay.doctorId);
                const appt = getAppt(pay.appointmentId);
                return (
                  <tr key={pay.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3.5">
                      <span className="text-xs font-mono font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded">{pay.id.toUpperCase()}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="text-sm font-medium text-slate-800 whitespace-nowrap">{dr.name}</p>
                      <p className="text-xs text-slate-400">{dr.specialty}</p>
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="text-xs text-slate-600 whitespace-nowrap">{appt.date}</p>
                      <p className="text-xs text-slate-400">{appt.time}</p>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`text-sm font-semibold ${pay.status === 'refunded' ? 'text-purple-700' : pay.status === 'pending' ? 'text-amber-700' : 'text-emerald-700'}`}>
                        {pay.status === 'refunded' ? '-' : ''}₹{pay.amount.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="flex items-center gap-1.5 text-xs text-slate-600 whitespace-nowrap">
                        <span>{METHOD_ICONS[pay.method]}</span>
                        {METHOD_LABELS[pay.method]}
                      </span>
                    </td>
                    <td className="px-4 py-3.5"><Badge variant={pay.status} /></td>
                    <td className="px-4 py-3.5 text-xs text-slate-500 whitespace-nowrap">{pay.date}</td>
                    <td className="px-4 py-3.5">
                      <Button size="sm" variant="ghost">
                        <Receipt className="w-3.5 h-3.5" /> Receipt
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="py-12 text-center">
            <CreditCard className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-sm text-slate-500">No transactions found</p>
          </div>
        )}
      </Card>

      {/* Pending payment banner */}
      {payments.some(p => p.status === 'pending') && (
        <Card className="mt-4 p-4 border-amber-200 bg-amber-50 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-amber-800">You have a pending payment</p>
              <p className="text-xs text-amber-600">Complete payment to confirm your appointment with Dr. Rohit Verma</p>
            </div>
          </div>
          <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white flex-shrink-0">
            <CreditCard className="w-4 h-4" /> Pay ₹1,000
          </Button>
        </Card>
      )}
    </div>
  );
}
