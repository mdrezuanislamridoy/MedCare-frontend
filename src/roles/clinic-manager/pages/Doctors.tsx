import { useState, useEffect } from "react";
import { Avatar, Card, PageHeader, SearchBar, StatusBadge } from "../components/ui";
import { clinicManagerApi } from "../services/clinic-manager.api";

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDoctors() {
      try {
        const data: any = await clinicManagerApi.getDoctors();
        setDoctors(Array.isArray(data) ? data : (data?.data || []));
      } catch (err) {
        console.warn("Could not load clinic doctors:", err);
      } finally {
        setLoading(false);
      }
    }
    loadDoctors();
  }, []);

  const filtered = doctors.filter((d) => {
    const name = d.name || d.user?.name || "";
    const specialty = d.specialty || "General Medicine";
    const matchSearch = !search || name.toLowerCase().includes(search.toLowerCase()) || specialty.toLowerCase().includes(search.toLowerCase());
    const matchSpecialty = selectedSpecialty === "All" || specialty === selectedSpecialty;
    return matchSearch && matchSpecialty;
  });

  const specialties = Array.from(new Set(doctors.map(d => d.specialty || "General Medicine")));

  return (
    <div>
      <PageHeader title="Doctors" subtitle="Doctors assigned to this clinic branch" />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 bg-white"
            placeholder="Search doctors…"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={selectedSpecialty}
            onChange={(e) => setSelectedSpecialty(e.target.value)}
            className="text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white text-slate-700"
          >
            <option value="All">All Specialties</option>
            {specialties.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <Card>
        <div className="responsive-table">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3">DOCTOR</th>
                <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3">SPECIALTY</th>
                <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3">EXPERIENCE</th>
                <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3">SCHEDULE</th>
                <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3">STATUS</th>
                <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <p className="text-sm font-semibold text-slate-700">No doctors found</p>
                    <p className="text-xs text-slate-400 mt-0.5">There are currently no doctors assigned to this clinic roster.</p>
                  </td>
                </tr>
              ) : (
                filtered.map((d) => {
                  const name = d.name || d.user?.name || "Dr. Specialist";
                  const initials = (name.replace(/^Dr\.\s*/, '').slice(0, 2) || "DR").toUpperCase();
                  return (
                    <tr key={d.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <Avatar initials={initials} color="#0d9488" size="sm" />
                          <div>
                            <p className="text-sm font-medium text-slate-800">{name}</p>
                            <p className="text-xs text-slate-400">{d.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-sm text-slate-600">{d.specialty || "General Medicine"}</td>
                      <td className="px-5 py-3.5 text-sm text-slate-600">{d.experienceYears ? `${d.experienceYears} yrs` : "5+ yrs"}</td>
                      <td className="px-5 py-3.5 text-xs text-slate-500">{d.schedule || "Mon – Fri · 9AM - 5PM"}</td>
                      <td className="px-5 py-3.5"><StatusBadge status={d.status || "Active"} /></td>
                      <td className="px-5 py-3.5">
                        <button className="px-2.5 py-1 text-xs text-slate-600 border border-slate-200 rounded hover:bg-slate-50 transition-colors">View Roster</button>
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
