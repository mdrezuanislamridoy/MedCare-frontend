import { useState } from 'react';
import { Pill, Download, Eye, Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import { prescriptions, doctors } from '../data/mockData';
import { Card, Avatar, Button } from './ui';

export default function Prescriptions() {
  const [expanded, setExpanded] = useState<string>(prescriptions[0]?.id ?? '');

  const getDr = (id: string) => doctors.find(d => d.id === id)!;

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="font-patient text-2xl font-semibold text-slate-800">Prescriptions</h1>
        <p className="text-slate-500 text-sm mt-0.5">View and download your digital prescriptions.</p>
      </div>

      {prescriptions.length === 0 ? (
        <Card className="p-12 text-center">
          <Pill className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="font-medium text-slate-600">No prescriptions yet.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {prescriptions.map(rx => {
            const dr = getDr(rx.doctorId);
            const isOpen = expanded === rx.id;

            return (
              <Card key={rx.id} className="overflow-hidden">
                {/* Header */}
                <div
                  className="p-5 flex items-center gap-4 cursor-pointer hover:bg-slate-50/50 transition-colors"
                  onClick={() => setExpanded(isOpen ? '' : rx.id)}
                >
                  <Avatar src={dr.photo} name={dr.name} size="md" />
                  <div className="flex-1 min-w-0">
                    <p className="font-patient font-semibold text-slate-800 text-sm">{rx.diagnosis}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{dr.name} · {dr.specialty}</p>
                    <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-400">
                      <Calendar className="w-3 h-3" />
                      <span>{rx.date}</span>
                      <span>·</span>
                      <span>{rx.medicines.length} medicine{rx.medicines.length !== 1 ? 's' : ''}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="secondary" onClick={() => {}}>
                      <Download className="w-3.5 h-3.5" />
                    </Button>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </div>
                </div>

                {/* Expanded prescription */}
                {isOpen && (
                  <div className="border-t border-slate-100 animate-fade-in">
                    {/* Prescription header */}
                    <div className="px-5 py-4 bg-slate-50 flex items-center justify-between flex-wrap gap-3">
                      <div>
                        <p className="text-xs text-slate-400">Prescription for</p>
                        <p className="font-patient font-semibold text-slate-800">Sarah Johnson</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-slate-400">Prescribed by</p>
                        <p className="font-medium text-slate-700">{dr.name}</p>
                        <p className="text-xs text-teal-600">{dr.qualifications.join(', ')}</p>
                      </div>
                    </div>

                    <div className="p-5">
                      <div className="mb-4">
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Diagnosis</p>
                        <p className="text-sm font-medium text-slate-800">{rx.diagnosis}</p>
                      </div>

                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Medicines</p>
                      <div className="space-y-3">
                        {rx.medicines.map((med, i) => (
                          <div key={i} className="flex gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                            <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <Pill className="w-4 h-4 text-emerald-600" />
                            </div>
                            <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-3">
                              <div>
                                <p className="text-[10px] text-slate-400 font-medium uppercase mb-0.5">Medicine</p>
                                <p className="text-sm font-semibold text-slate-800">{med.name}</p>
                              </div>
                              <div>
                                <p className="text-[10px] text-slate-400 font-medium uppercase mb-0.5">Dosage</p>
                                <p className="text-sm text-slate-700">{med.dosage}</p>
                              </div>
                              <div>
                                <p className="text-[10px] text-slate-400 font-medium uppercase mb-0.5">Frequency</p>
                                <p className="text-sm text-slate-700">{med.frequency}</p>
                              </div>
                              <div>
                                <p className="text-[10px] text-slate-400 font-medium uppercase mb-0.5">Duration</p>
                                <p className="text-sm text-slate-700">{med.duration}</p>
                              </div>
                              {med.instructions && (
                                <div className="col-span-full">
                                  <p className="text-[10px] text-slate-400 font-medium uppercase mb-0.5">Instructions</p>
                                  <p className="text-xs text-amber-700 bg-amber-50 rounded-lg px-2 py-1 inline-block border border-amber-100">{med.instructions}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      {rx.notes && (
                        <div className="mt-4 p-3 bg-teal-50 border border-teal-100 rounded-xl">
                          <p className="text-xs font-semibold text-teal-700 mb-1">Doctor Notes</p>
                          <p className="text-sm text-teal-700">{rx.notes}</p>
                        </div>
                      )}

                      <div className="flex gap-3 mt-5">
                        <Button size="sm" variant="secondary">
                          <Eye className="w-3.5 h-3.5" /> View Full
                        </Button>
                        <Button size="sm" variant="primary">
                          <Download className="w-3.5 h-3.5" /> Download PDF
                        </Button>
                      </div>
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
