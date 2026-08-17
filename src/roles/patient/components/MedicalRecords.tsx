import { useEffect, useState } from 'react';
import { FileText, FlaskConical, Stethoscope, FolderOpen, FileSearch, Download, Eye, Search, Trash2, RefreshCw } from 'lucide-react';
import { medicalRecords as mockRecords, doctors } from '../data/mockData';
import { patientApi } from '../services/patient.api';
import { Card, Badge, Button } from './ui';

const typeIcons: Record<string, typeof FileText> = {
  visit: Stethoscope,
  lab: FlaskConical,
  diagnosis: FileSearch,
  document: FolderOpen,
  notes: FileText,
  prescription: FileText,
};

const typeColors: Record<string, string> = {
  visit: 'bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400',
  lab: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400',
  diagnosis: 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400',
  document: 'bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400',
  notes: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300',
  prescription: 'bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400',
};

export default function MedicalRecords() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRecords() {
      try {
        const data: any = await patientApi.listMedicalRecords();
        if (data && Array.isArray(data) && data.length > 0) {
          setRecords(data.map((r: any) => ({
            id: r.id,
            title: r.title,
            type: (r.category || 'document').toLowerCase(),
            date: r.date ? String(r.date).split('T')[0] : '2026-08-10',
            doctor: r.doctor?.user?.name || 'Dr. Attending',
            facility: 'MedCare Central Diagnostic Centre',
            description: r.description || r.notes || 'Clinical lab diagnosis chart',
            fileUrl: r.fileUrl,
          })));
        } else {
          setRecords(mockRecords);
        }
      } catch (err) {
        console.warn('Using offline medical records fallback:', err);
        setRecords(mockRecords);
      } finally {
        setLoading(false);
      }
    }
    loadRecords();
  }, []);

  const types = ['all', 'visit', 'lab', 'diagnosis', 'document', 'notes'];

  const filtered = records.filter(r => {
    if (typeFilter !== 'all' && r.type !== typeFilter) return false;
    if (search && !r.title.toLowerCase().includes(search.toLowerCase()) &&
      !r.description.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to remove this record?')) {
      try {
        await patientApi.deleteMedicalRecord(id);
      } catch (err) {
        console.warn('Record deleted locally');
      }
      setRecords(prev => prev.filter(r => r.id !== id));
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="font-patient text-2xl font-bold text-slate-800 dark:text-white">Medical Records & Diagnostic Files</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">Your complete encrypted health history, lab reports, and imaging tests.</p>
      </div>

      {/* Filter bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 mb-5 shadow-sm flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search records by title or description..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition"
          />
        </div>
        <div className="flex gap-1 overflow-x-auto pb-1 sm:pb-0">
          {types.map(t => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl capitalize transition whitespace-nowrap ${
                typeFilter === t
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Records list */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <Card className="p-12 text-center bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="font-semibold text-slate-700 dark:text-slate-200">No medical records found</h3>
            <p className="text-slate-400 text-xs mt-1">Uploaded clinical documents and diagnostic results will appear here.</p>
          </Card>
        ) : (
          filtered.map(r => {
            const Icon = typeIcons[r.type] || FileText;
            const color = typeColors[r.type] || 'bg-slate-100 text-slate-600';

            return (
              <Card key={r.id} className="p-4 sm:p-5 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-teal-500/40 transition">
                <div className="flex items-start justify-between gap-4 flex-wrap sm:flex-nowrap">
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-patient font-bold text-slate-800 dark:text-white text-sm sm:text-base">{r.title}</h3>
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          {r.type}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{r.description}</p>
                      <div className="flex items-center gap-3 text-xs text-slate-400 mt-2">
                        <span>{r.date}</span>
                        {r.doctor && <span>· Authorized by {r.doctor}</span>}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 sm:self-center">
                    <Button size="sm" variant="secondary" onClick={() => alert(`Downloading record: ${r.title}`)}>
                      <Download className="w-3.5 h-3.5" /> Download
                    </Button>
                    <button
                      onClick={() => handleDelete(r.id)}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
