import { useState, useEffect } from "react";
import { Card, Icons, PageHeader, StatCard, StatusBadge } from "../components/ui";
import { clinicManagerApi } from "../services/clinic-manager.api";

export default function PaymentsPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPayments() {
      try {
        const data = await clinicManagerApi.getPayments();
        setPayments(Array.isArray(data) ? data : (data?.data || []));
      } catch (err) {
        console.warn("Could not load clinic payments:", err);
      } finally {
        setLoading(false);
      }
    }
    loadPayments();
  }, []);

  const totalRev = payments.reduce((acc, p) => acc + (Number(p.amount) || 0), 0);
  const pendingCount = payments.filter(p => (p.status || "").toLowerCase() === "pending").length;
  const refundedCount = payments.filter(p => (p.status || "").toLowerCase() === "refunded").length;

  return (
    <div>
      <PageHeader title="Payments" subtitle="Clinic-level payment records and transaction ledger" />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Revenue" value={`$${totalRev.toLocaleString()}`} sub={`${payments.length} transactions`} icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>} color="#059669" />
        <StatCard label="Completed" value={payments.filter(p => (p.status || "").toLowerCase() === "paid" || (p.status || "").toLowerCase() === "completed").length} sub="Settled visits" icon={Icons.check} color="#2563EB" />
        <StatCard label="Pending" value={pendingCount} sub="Awaiting checkout" icon={Icons.clock} color="#D97706" />
        <StatCard label="Refunded" value={refundedCount} sub="Processed refunds" icon={Icons.x} color="#DC2626" />
      </div>

      <Card>
        <div className="responsive-table">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                {["PAYMENT ID", "PATIENT", "DOCTOR", "TYPE", "AMOUNT", "DATE", "STATUS"].map((h) => (
                  <th key={h} className="text-left text-xs font-semibold text-slate-500 px-5 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {payments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <p className="text-sm font-semibold text-slate-700">No payment records found</p>
                    <p className="text-xs text-slate-400 mt-0.5">Payment receipts and transaction records will appear here.</p>
                  </td>
                </tr>
              ) : (
                payments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3.5 text-xs font-mono text-blue-600">{p.id}</td>
                    <td className="px-5 py-3.5 text-sm font-medium text-slate-700">{p.patient || p.patientName || "Patient"}</td>
                    <td className="px-5 py-3.5 text-sm text-slate-600">{p.doctor || p.doctorName || "Doctor"}</td>
                    <td className="px-5 py-3.5 text-sm text-slate-500">{p.type || "Consultation"}</td>
                    <td className="px-5 py-3.5 text-sm font-semibold text-slate-800">${Number(p.amount || 0).toLocaleString()}</td>
                    <td className="px-5 py-3.5 text-sm text-slate-500">{p.date || (p.createdAt ? new Date(p.createdAt).toLocaleDateString() : "Recent")}</td>
                    <td className="px-5 py-3.5"><StatusBadge status={p.status || "Paid"} /></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-xs text-blue-700 font-medium">Clinic-level view only — Scoped strictly to this facility's transactions.</p>
      </div>
    </div>
  );
}
