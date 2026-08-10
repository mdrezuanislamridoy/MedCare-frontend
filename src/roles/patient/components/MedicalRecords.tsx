import { useState } from 'react';
import { FileText, FlaskConical, Stethoscope, FolderOpen, FileSearch, Download, Eye, Search } from 'lucide-react';
import { medicalRecords, doctors } from '../data/mockData';
import { Card, Badge, Button } from './ui';

const typeIcons: Record<string, typeof FileText> = {
  visit:      Stethoscope,
  lab:        FlaskConical,
  diagnosis:  FileSearch,
  document:   FolderOpen,
  notes:      FileText,
};

const typeColors: Record<string, string> = {
  visit:      'bg-teal-50 text-teal-600',
  lab:        'bg-emerald-50 text-emerald-600',
  diagnosis:  'bg-amber-50 text-amber-600',
  document:   'bg-violet-50 text-violet-600',
  notes:      'bg-slate-100 text-slate-600',
};

const typeLabels: Record<string, string> = {
  visit:      'Visit',
  lab:        'Lab Report',
  diagnosis:  'Diagnosis',
  document:   'Document',
  notes:      'Notes',
};

export default function MedicalRecords() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [expanded, setExpanded] = useState<string | null>(null);

  const getDr = (id?: string) => id ? doctors.find(d => d.id === id) : undefined;

  const types = ['all', 'visit', 'lab', 'diagnosis', 'document', 'notes'];

  const filtered = medicalRecords.filter(r => {
    if (typeFilter !== 'all' && r.type !== typeFilter) return false;
    if (search && !r.title.toLowerCase().includes(search.toLowerCase()) &&
      !r.description.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="p-6 animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-800" style={{ fontFamily: 'DM Sans, sans-serif' }}>Medical Records</h1>
        <p className="text-slate-500 text-sm mt-0.5">Your complete medical history, securely stored and accessible.</p>
      </div>

      {/* Filter bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 mb-5 shadow-sm flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search records..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition"
          />
        </div>
        <div className="flex gap-1 bg-slate-50 rounded-lg p-1 flex-wrap">
          {types.map(t => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors capitalize ${typeFilter === t ? 'bg-teal-600 text-white shadow-sm' : 'text-slate-500 hover:bg-white'}`}
            >
              {t === 'all' ? 'All' : typeLabels[t]}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <Card className="p-12 text-center">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="font-medium text-slate-600">No records found</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map(record => {
            const Icon = typeIcons[record.type] ?? FileText;
            const colorClass = typeColors[record.type] ?? typeColors.notes;
            const dr = getDr(record.doctorId);
            const isExpanded = expanded === record.id;

            return (
              <Card key={record.id} className="overflow-hidden">
                <div
                  className="p-5 flex items-start gap-4 cursor-pointer hover:bg-slate-50/50 transition-colors"
                  onClick={() => setExpanded(isExpanded ? null : record.id)}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${colorClass}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div>
                        <p className="font-semibold text-slate-800 text-sm">{record.title}</p>
                        {dr && <p className="text-xs text-slate-500 mt-0.5">{dr.name} · {dr.specialty}</p>}
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${
                          record.type === 'lab' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                          record.type === 'visit' ? 'bg-teal-50 text-teal-700 border-teal-200' :
                          record.type === 'diagnosis' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                          'bg-slate-100 text-slate-600 border-slate-200'
                        }`}>
                          {typeLabels[record.type]}
                        </span>
                        <span className="text-xs text-slate-400">{record.date}</span>
                      </div>
                    </div>
                    {!isExpanded && <p className="text-xs text-slate-500 mt-1.5 line-clamp-1">{record.description}</p>}
                  </div>
                  <svg
                    className={`w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                    fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>

                {isExpanded && (
                  <div className="px-5 pb-5 border-t border-slate-100 animate-fade-in">
                    <p className="text-sm text-slate-600 mt-4 leading-relaxed">{record.description}</p>
                    <div className="flex gap-3 mt-4">
                      <Button size="sm" variant="secondary">
                        <Eye className="w-3.5 h-3.5" /> View
                      </Button>
                      <Button size="sm" variant="secondary">
                        <Download className="w-3.5 h-3.5" /> Download
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
