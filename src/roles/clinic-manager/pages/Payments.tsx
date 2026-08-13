import { useState, useEffect } from "react";
import { DOCTORS, STAFF, APPOINTMENTS, PATIENTS, QUEUE, ROOMS, NOTIFICATIONS, ACTIVITY, PAYMENTS, type DoctorStatus, type StaffStatus } from "../data/mockData";
import { Avatar, Card, ConfirmDialog, Icons, PageHeader, SearchBar, StatCard, StatusBadge } from "../components/ui";

export default function PaymentsPage() {
  return (
    <div>
      <PageHeader title="Payments" subtitle="Clinic-level payment records and revenue summary" />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Today's Revenue" value="$325" sub="4 payments" icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>} color="#059669" />
        <StatCard label="This Week" value="$2,180" sub="18 payments" icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5"><polyline points="23,6 13.5,15.5 8.5,10.5 1,18"/><polyline points="17,6 23,6 23,12"/></svg>} color="#2563EB" />
        <StatCard label="Pending" value="$280" sub="2 unpaid" icon={Icons.clock} color="#D97706" />
        <StatCard label="Refunded" value="$140" sub="1 refund today" icon={Icons.x} color="#DC2626" />
      </div>

      <Card>
        <div className="responsive-table">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                {["PAYMENT ID", "PATIENT", "DOCTOR", "TYPE", "AMOUNT", "DATE", "STATUS"].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-slate-500 px-5 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {PAYMENTS.map(p => (
                <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3.5 text-xs font-mono text-blue-600">{p.id}</td>
                  <td className="px-5 py-3.5 text-sm font-medium text-slate-700">{p.patient}</td>
                  <td className="px-5 py-3.5 text-sm text-slate-600">{p.doctor}</td>
                  <td className="px-5 py-3.5 text-sm text-slate-500">{p.type}</td>
                  <td className="px-5 py-3.5 text-sm font-semibold text-slate-800">{p.amount}</td>
                  <td className="px-5 py-3.5 text-sm text-slate-500">{p.date}</td>
                  <td className="px-5 py-3.5"><StatusBadge status={p.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-xs text-blue-700 font-medium">Clinic-level view only — Platform-wide financial data is not accessible from this dashboard.</p>
      </div>
    </div>
  )
}
