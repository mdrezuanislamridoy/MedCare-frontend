import { useState, useEffect } from "react";
import { Avatar, Card, Icons, PageHeader, StatusBadge } from "../components/ui";
import { clinicManagerApi } from "../services/clinic-manager.api";

export default function StaffPage() {
  const [staff, setStaff] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStaff() {
      try {
        const data = await clinicManagerApi.getStaff();
        setStaff(Array.isArray(data) ? data : (data?.data || []));
      } catch (err) {
        console.warn("Could not load clinic staff:", err);
      } finally {
        setLoading(false);
      }
    }
    loadStaff();
  }, []);

  const filtered = staff.filter((s) => {
    const name = s.name || s.user?.name || "";
    const role = s.role || "Staff";
    const matchSearch = !search || name.toLowerCase().includes(search.toLowerCase()) || role.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "All" || role.toLowerCase() === roleFilter.toLowerCase();
    return matchSearch && matchRole;
  });

  return (
    <div>
      <PageHeader
        title="Staff"
        subtitle="Receptionists, medical assistants, and support staff at this clinic"
        action={
          <button className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            {Icons.plus} Add Staff
          </button>
        }
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 bg-white"
            placeholder="Search staff…"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white text-slate-700"
        >
          <option value="All">All Roles</option>
          <option value="Receptionist">Receptionist</option>
          <option value="Nurse">Nurse</option>
          <option value="Support Staff">Support Staff</option>
        </select>
      </div>

      <Card>
        <div className="responsive-table">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3">STAFF</th>
                <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3">ROLE</th>
                <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3">CONTACT</th>
                <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3">STATUS</th>
                <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    <p className="text-sm font-semibold text-slate-700">No staff members assigned</p>
                    <p className="text-xs text-slate-400 mt-0.5">Staff roster will appear here as personnel are assigned to this branch.</p>
                  </td>
                </tr>
              ) : (
                filtered.map((s) => {
                  const name = s.name || s.user?.name || "Staff Member";
                  const initials = (name.slice(0, 2) || "ST").toUpperCase();
                  return (
                    <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <Avatar initials={initials} color="#4F46E5" size="sm" />
                          <div>
                            <p className="text-sm font-medium text-slate-800">{name}</p>
                            <p className="text-xs text-slate-400">{s.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-sm text-slate-600">{s.role || "Receptionist"}</td>
                      <td className="px-5 py-3.5">
                        <p className="text-xs text-slate-600">{s.email || s.user?.email || "—"}</p>
                        <p className="text-xs text-slate-400">{s.phone || s.user?.phoneNumber || "—"}</p>
                      </td>
                      <td className="px-5 py-3.5"><StatusBadge status={s.status || "Active"} /></td>
                      <td className="px-5 py-3.5">
                        <button className="px-2.5 py-1 text-xs text-slate-600 border border-slate-200 rounded hover:bg-slate-50 transition-colors">Manage</button>
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
