import { useState, useEffect } from "react";
import { DOCTORS, STAFF, APPOINTMENTS, PATIENTS, QUEUE, ROOMS, NOTIFICATIONS, ACTIVITY, PAYMENTS, type DoctorStatus, type StaffStatus } from "../data/mockData";
import { Avatar, Card, ConfirmDialog, Icons, PageHeader, SearchBar, StatCard, StatusBadge } from "../components/ui";

export default function PatientsPage() {
  return (
    <div>
      <PageHeader title="Patients" subtitle="Patients with appointments at Green Pine Medical Clinic" />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
        <SearchBar placeholder="Search patients…" />
        <select className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-200">
          <option>All Patients</option>
          <option>Active</option>
          <option>New</option>
          <option>Inactive</option>
        </select>
      </div>

      <Card>
        <div className="responsive-table">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                {["PATIENT", "PRIMARY DOCTOR", "LAST VISIT", "NEXT APPOINTMENT", "STATUS", "ACTIONS"].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-slate-500 px-5 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {PATIENTS.map(p => (
                <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <Avatar initials={p.name.split(" ").map(n => n[0]).join("")} color="#0891B2" size="sm" />
                      <div>
                        <p className="text-sm font-medium text-slate-800">{p.name}</p>
                        <p className="text-xs text-slate-400">{p.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-slate-600">{p.doctor}</td>
                  <td className="px-5 py-3.5 text-sm text-slate-500">{p.lastVisit}</td>
                  <td className="px-5 py-3.5 text-sm text-slate-600">{p.nextAppt}</td>
                  <td className="px-5 py-3.5"><StatusBadge status={p.status} /></td>
                  <td className="px-5 py-3.5">
                    <button className="px-2.5 py-1.5 text-xs text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-1">{Icons.eye} View Records</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between">
          <p className="text-xs text-slate-400">Showing {PATIENTS.length} patients · Clinic-authorized records only</p>
          <div className="flex gap-1">
            <button className="px-3 py-1 text-xs border border-slate-200 rounded hover:bg-slate-50 text-slate-600">Prev</button>
            <button className="px-3 py-1 text-xs border border-slate-200 rounded bg-blue-600 text-white">1</button>
            <button className="px-3 py-1 text-xs border border-slate-200 rounded hover:bg-slate-50 text-slate-600">Next</button>
          </div>
        </div>
      </Card>

      <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
        <p className="text-xs text-amber-700 font-medium">Access Restricted — You can only view records for patients who have appointments at this clinic.</p>
      </div>
    </div>
  )
}
