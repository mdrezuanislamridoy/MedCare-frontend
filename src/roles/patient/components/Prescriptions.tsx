import { useEffect, useState } from 'react';
import { Pill, Download, Eye, Calendar, ChevronDown, ChevronUp, RefreshCw, FileText } from 'lucide-react';
import { prescriptions as mockPrescriptions, doctors } from '../data/mockData';
import { patientApi } from '../services/patient.api';
import { Card, Avatar, Button } from './ui';

export default function Prescriptions() {
  const [expanded, setExpanded] = useState<string>('');
  const [prescriptionsList, setPrescriptionsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPrescriptions() {
      try {
        const data: any = await patientApi.listPrescriptions();
        if (data && Array.isArray(data) && data.length > 0) {
          setPrescriptionsList(data);
          setExpanded(data[0].id);
        } else {
          setPrescriptionsList(mockPrescriptions);
          setExpanded(mockPrescriptions[0]?.id || '');
        }
      } catch (err) {
        console.warn('Using offline prescriptions fallback:', err);
        setPrescriptionsList(mockPrescriptions);
        setExpanded(mockPrescriptions[0]?.id || '');
      } finally {
        setLoading(false);
      }
    }
    loadPrescriptions();
  }, []);

  const getDr = (id: string) => doctors.find(d => d.id === id) || doctors[0];

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="font-patient text-2xl font-bold text-slate-800 dark:text-white">Prescriptions & Medical Charts</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">View and download your verified clinical digital prescriptions.</p>
      </div>

      {prescriptionsList.length === 0 ? (
        <Card className="p-12 text-center bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <Pill className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="font-semibold text-slate-600 dark:text-slate-300">No prescriptions found.</p>
          <p className="text-xs text-slate-400 mt-1">Prescriptions issued during consultations will appear here automatically.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {prescriptionsList.map(rx => {
            const dr = rx.doctor || getDr(rx.doctorId);
            const drName = rx.doctor?.user?.name || dr.name || 'Doctor';
            const drSpecialty = rx.doctor?.specialty || dr.specialty || 'Specialist';
            const drPhoto = dr.photo || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=120&h=120&fit=crop&auto=format';
            const isOpen = expanded === rx.id;
            const meds = rx.medicines || [];

            return (
              <Card key={rx.id} className="overflow-hidden bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                {/* Header */}
                <div
                  className="p-5 flex items-center gap-4 cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors"
                  onClick={() => setExpanded(isOpen ? '' : rx.id)}
                >
                  <Avatar src={drPhoto} name={drName} size="md" />
                  <div className="flex-1 min-w-0">
                    <p className="font-patient font-bold text-slate-800 dark:text-white text-sm">{rx.diagnosis}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{drName} · {drSpecialty}</p>
                    <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-400">
                      <Calendar className="w-3.5 h-3.5 text-teal-600" />
                      <span>{rx.date ? String(rx.date).split('T')[0] : '2026-08-10'}</span>
                      <span>·</span>
                      <span>{meds.length} medicine{meds.length !== 1 ? 's' : ''}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="secondary" onClick={() => alert(`Downloading PDF prescription for ${rx.diagnosis}...`)}>
                      <Download className="w-3.5 h-3.5" /> PDF
                    </Button>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </div>
                </div>

                {/* Expanded prescription */}
                {isOpen && (
                  <div className="border-t border-slate-100 dark:border-slate-800 animate-fade-in">
                    {/* Prescription header */}
                    <div className="px-5 py-4 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between flex-wrap gap-3">
                      <div>
                        <div className="text-xs font-bold text-slate-700 dark:text-slate-200">Prescription ID: {rx.id}</div>
                        <div className="text-[11px] text-slate-500">Authorized by {drName}</div>
                      </div>
                      <span className="text-[11px] bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 font-semibold px-2.5 py-1 rounded-full border border-teal-200 dark:border-teal-800">
                        Active Regimen
                      </span>
                    </div>

                    {/* Medicines List */}
                    <div className="p-5 space-y-3">
                      {meds.map((m: any, i: number) => (
                        <div key={i} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div>
                            <div className="font-bold text-sm text-slate-800 dark:text-white flex items-center gap-2">
                              <Pill className="w-4 h-4 text-teal-600" /> {m.name}
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                              Dosage: <span className="font-semibold text-slate-700 dark:text-slate-300">{m.dosage}</span> · Frequency: <span className="font-semibold text-slate-700 dark:text-slate-300">{m.frequency}</span> · Duration: <span className="font-semibold text-slate-700 dark:text-slate-300">{m.duration}</span>
                            </div>
                            {m.instructions && (
                              <div className="text-[11px] text-teal-700 dark:text-teal-400 mt-1 font-medium italic">
                                Note: {m.instructions}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
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
