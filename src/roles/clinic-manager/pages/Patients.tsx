import { useState, useEffect } from "react";
import { Avatar, Card, Icons, PageHeader, StatusBadge } from "../components/ui";
import { clinicManagerApi } from "../services/clinic-manager.api";

export default function PatientsPage() {
  const [patients, setPatients] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPatients() {
      try {
        const data = await clinicManagerApi.getPatients();
        setPatients(Array.isArray(data) ? data : (data?.data || []));
      } catch (err) {
        console.warn("Could not load clinic patients:", err);
      } finally {
        setLoading(false);
      }
    }
    loadPatients();
  }, []);

  const filtered = patients.filter((p) => {
    const name = p.name || p.user?.name || "";
    const matchSearch = !search || name.toLowerCase().includes(search.toLowerCase()) || (p.id || "").toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || (p.status || "Active").toLowerCase() === statusFilter.toLowerCase();
    return matchSearch && matchStatus;
  });

  return (
    <div>
      <PageHeader title="Patients" subtitle="Patients registered or visiting this clinic branch" />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 bg-white"
            placeholder="Search patients…"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
        >
          <option value="All">All Patients</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      <Card>
        <div className="responsive-table">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                {["PATIENT", "CONTACT", "LAST VISIT", "STATUS", "ACTIONS"].map((h) => (
                  <th key={h} className="text-left text-xs font-semibold text-slate-500 px-5 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    <p className="text-sm font-semibold text-slate-700">No patients found</p>
                    <p className="text-xs text-slate-400 mt-0.5">Patient records will appear here as patients book appointments.</p>
                  </td>
                </tr>
              ) : (
                filtered.map((p) => {
                  const name = p.name || p.user?.name || "Patient";
                  const initials = (name.slice(0, 2) || "PT").toUpperCase();
                  return (
                    <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <Avatar initials={initials} color="#0891B2" size="sm" />
                          <div>
                            <p className="text-sm font-medium text-slate-800">{name}</p>
                            <p className="text-xs text-slate-400">{p.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-sm text-slate-600">{p.email || p.user?.email || p.phone || "—"}</td>
                      <td className="px-5 py-3.5 text-sm text-slate-500">{p.lastVisit || p.createdAt ? new Date(p.createdAt || Date.now()).toLocaleDateString() : "Recent"}</td>
                      <td className="px-5 py-3.5"><StatusBadge status={p.status || "Active"} /></td>
                      <td className="px-5 py-3.5">
                        <button className="px-2.5 py-1.5 text-xs text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-1">
                          {Icons.eye} View Records
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
