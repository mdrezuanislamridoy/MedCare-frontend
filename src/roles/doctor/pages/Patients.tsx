import { useState } from "react";
import { Search, Eye, FileText, Pill, History, ChevronDown, ChevronUp, Phone, Mail, Droplets } from "lucide-react";
import { patients } from "../data/mockData";

export default function Patients() {
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = patients.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="animate-fade-in space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">My Patients</h1>
        <span className="text-sm text-slate-500">{patients.length} patients under care</span>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search patients by name or ID..."
            className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="responsive-table">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-4 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wide">Patient</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wide">Age / Gender</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wide">Blood Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wide">Conditions</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wide">Last Visit</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wide">Next Appt</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((p) => (
                <>
                  <tr key={p.id} className="table-row-hover">
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <img src={p.avatar} alt={p.name} className="w-9 h-9 rounded-full object-cover bg-slate-100" />
                        <div>
                          <div className="font-medium text-slate-900">{p.name}</div>
                          <div className="text-xs text-slate-500 font-mono">{p.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-slate-700">{p.age} y · {p.gender}</td>
                    <td className="px-4 py-3.5">
                      <span className="inline-flex items-center gap-1 text-xs font-mono font-semibold text-red-600 bg-red-50 px-2 py-1 rounded-md">
                        <Droplets className="w-3 h-3" /> {p.bloodType}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex flex-wrap gap-1">
                        {p.conditions.slice(0, 2).map((c) => (
                          <span key={c} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{c}</span>
                        ))}
                        {p.conditions.length > 2 && (
                          <span className="text-xs text-slate-400">+{p.conditions.length - 2}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-slate-700 text-xs">{p.lastVisit}</td>
                    <td className="px-4 py-3.5">
                      <span className="text-xs font-medium text-teal-600">{p.nextAppointment}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1">
                        <button className="p-1.5 text-slate-500 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors" title="View Profile">
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="History">
                          <History className="w-3.5 h-3.5" />
                        </button>
                        <button className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Records">
                          <FileText className="w-3.5 h-3.5" />
                        </button>
                        <button className="p-1.5 text-slate-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Prescriptions">
                          <Pill className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setExpanded(expanded === p.id ? null : p.id)}
                          className="p-1.5 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                          {expanded === p.id ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                  {expanded === p.id && (
                    <tr key={`${p.id}-detail`}>
                      <td colSpan={7} className="bg-slate-50 border-b border-slate-200">
                        <div className="px-6 py-4 grid grid-cols-3 gap-6">
                          <div>
                            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Contact</div>
                            <div className="flex items-center gap-2 text-sm text-slate-700 mb-1">
                              <Phone className="w-3.5 h-3.5 text-slate-400" /> {p.phone}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-700">
                              <Mail className="w-3.5 h-3.5 text-slate-400" /> {p.email}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">All Conditions</div>
                            <div className="flex flex-wrap gap-1.5">
                              {p.conditions.map((c) => (
                                <span key={c} className="text-xs bg-white border border-slate-200 text-slate-700 px-2 py-1 rounded-full">{c}</span>
                              ))}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Quick Actions</div>
                            <div className="flex flex-wrap gap-2">
                              <button className="text-xs bg-teal-600 text-white px-3 py-1.5 rounded-lg font-medium hover:bg-teal-700 transition-colors">Book Appointment</button>
                              <button className="text-xs border border-slate-200 text-slate-700 px-3 py-1.5 rounded-lg font-medium hover:bg-slate-100 transition-colors">Send Message</button>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Showing {filtered.length} of {patients.length} patients</span>
          <div className="flex gap-1">
            <button className="px-3 py-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50" disabled>Previous</button>
            <button className="px-3 py-1.5 bg-teal-600 text-white rounded-lg">1</button>
            <button className="px-3 py-1.5 border border-slate-200 rounded-lg hover:bg-slate-50">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
