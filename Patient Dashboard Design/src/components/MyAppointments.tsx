import { useState } from 'react';
import { Calendar, List, Video, MapPin, Clock, FileText, RotateCcw, X, CreditCard, Eye } from 'lucide-react';
import { appointments, doctors } from '../data/mockData';
import type { Appointment } from '../data/mockData';
import { Badge, Card, Avatar, Button, Modal } from './ui';

const STATUS_OPTIONS = ['All', 'Upcoming', 'Completed', 'Cancelled'];

function getStatusGroup(a: Appointment) {
  if (['confirmed', 'payment_pending', 'pending'].includes(a.status)) return 'Upcoming';
  if (a.status === 'completed') return 'Completed';
  if (a.status === 'cancelled' || a.status === 'no_show') return 'Cancelled';
  if (['in_progress', 'checked_in'].includes(a.status)) return 'Upcoming';
  return 'Upcoming';
}

export default function MyAppointments({ onBook }: { onBook: () => void }) {
  const [view, setView] = useState<'list' | 'calendar'>('list');
  const [filter, setFilter] = useState('All');
  const [selectedAppt, setSelectedAppt] = useState<Appointment | null>(null);
  const [cancelTarget, setCancelTarget] = useState<string | null>(null);
  const [cancelledIds, setCancelledIds] = useState<string[]>([]);

  const getDr = (id: string) => doctors.find(d => d.id === id)!;

  const displayed = appointments
    .map(a => cancelledIds.includes(a.id) ? { ...a, status: 'cancelled' as const } : a)
    .filter(a => filter === 'All' || getStatusGroup(a) === filter);

  const handleCancel = () => {
    if (cancelTarget) { setCancelledIds(prev => [...prev, cancelTarget]); setCancelTarget(null); }
  };

  const ActionButtons = ({ appt }: { appt: Appointment }) => {
    const effectiveStatus = cancelledIds.includes(appt.id) ? 'cancelled' : appt.status;
    return (
      <div className="flex flex-wrap gap-2">
        <Button size="sm" variant="ghost" onClick={() => setSelectedAppt(appt)}>
          <Eye className="w-3.5 h-3.5" /> Details
        </Button>
        {effectiveStatus === 'in_progress' && appt.type === 'online' && (
          <Button size="sm" variant="primary">
            <Video className="w-3.5 h-3.5" /> Join
          </Button>
        )}
        {effectiveStatus === 'payment_pending' && (
          <Button size="sm" variant="primary">
            <CreditCard className="w-3.5 h-3.5" /> Pay
          </Button>
        )}
        {['confirmed', 'pending', 'payment_pending'].includes(effectiveStatus) && (
          <Button size="sm" variant="secondary">
            <RotateCcw className="w-3.5 h-3.5" /> Reschedule
          </Button>
        )}
        {['confirmed', 'pending', 'payment_pending'].includes(effectiveStatus) && (
          <Button size="sm" variant="ghost" className="text-red-500 hover:bg-red-50" onClick={() => setCancelTarget(appt.id)}>
            <X className="w-3.5 h-3.5" /> Cancel
          </Button>
        )}
        {effectiveStatus === 'completed' && appt.prescription && (
          <Button size="sm" variant="secondary">
            <FileText className="w-3.5 h-3.5" /> Prescription
          </Button>
        )}
      </div>
    );
  };

  return (
    <div className="p-6 animate-fade-in">
      <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800" style={{ fontFamily: 'DM Sans, sans-serif' }}>My Appointments</h1>
          <p className="text-slate-500 text-sm mt-0.5">Manage all your doctor appointments in one place.</p>
        </div>
        <Button onClick={onBook}>
          <Calendar className="w-4 h-4" /> Book Appointment
        </Button>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div className="flex gap-1 bg-white border border-slate-200 rounded-xl p-1">
          {STATUS_OPTIONS.map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3.5 py-1.5 text-sm font-medium rounded-lg transition-colors ${filter === s ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              {s}
            </button>
          ))}
        </div>
        <div className="flex gap-1 bg-white border border-slate-200 rounded-xl p-1">
          <button onClick={() => setView('list')} className={`p-2 rounded-lg transition-colors ${view === 'list' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:bg-slate-50'}`}>
            <List className="w-4 h-4" />
          </button>
          <button onClick={() => setView('calendar')} className={`p-2 rounded-lg transition-colors ${view === 'calendar' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:bg-slate-50'}`}>
            <Calendar className="w-4 h-4" />
          </button>
        </div>
      </div>

      {view === 'calendar' ? (
        <CalendarView appointments={displayed} />
      ) : (
        <div className="space-y-3">
          {displayed.length === 0 ? (
            <Card className="p-12 text-center">
              <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="font-medium text-slate-600">No appointments found</p>
              <Button onClick={onBook} className="mt-4" size="sm">Book your first appointment</Button>
            </Card>
          ) : (
            displayed.map(appt => {
              const dr = getDr(appt.doctorId);
              const effectiveStatus = cancelledIds.includes(appt.id) ? 'cancelled' as const : appt.status;
              return (
                <Card key={appt.id} className="p-5">
                  <div className="flex items-start gap-4 flex-wrap">
                    <Avatar src={dr.photo} name={dr.name} size="md" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between flex-wrap gap-2 mb-2">
                        <div>
                          <p className="font-semibold text-slate-800">{dr.name}</p>
                          <p className="text-sm text-sky-600">{dr.specialty}</p>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                          <Badge variant={effectiveStatus} />
                          <Badge variant={appt.paymentStatus} />
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-3 text-xs text-slate-500 mb-3">
                        <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{appt.date}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{appt.time}</span>
                        <span className="flex items-center gap-1">
                          {appt.type === 'online' ? <Video className="w-3.5 h-3.5" /> : <MapPin className="w-3.5 h-3.5" />}
                          {appt.type === 'online' ? 'Online Consultation' : dr.clinicName}
                        </span>
                        <span className="font-medium text-slate-600">₹{appt.amount}</span>
                      </div>
                      <ActionButtons appt={appt} />
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      )}

      {/* Detail Modal */}
      {selectedAppt && (
        <Modal onClose={() => setSelectedAppt(null)} title="Appointment Details" size="md">
          {(() => {
            const dr = getDr(selectedAppt.doctorId);
            return (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar src={dr.photo} name={dr.name} size="lg" />
                  <div>
                    <p className="font-semibold text-slate-800">{dr.name}</p>
                    <p className="text-sky-600 text-sm">{dr.specialty}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {[
                    { label: 'Date', value: selectedAppt.date },
                    { label: 'Time', value: selectedAppt.time },
                    { label: 'Type', value: selectedAppt.type },
                    { label: 'Status', value: selectedAppt.status },
                    { label: 'Amount', value: `₹${selectedAppt.amount}` },
                    { label: 'Payment', value: selectedAppt.paymentStatus },
                  ].map(row => (
                    <div key={row.label} className="bg-slate-50 rounded-xl p-3">
                      <p className="text-xs text-slate-400 mb-0.5">{row.label}</p>
                      <p className="font-medium text-slate-700 capitalize">{row.value}</p>
                    </div>
                  ))}
                </div>
                {selectedAppt.notes && (
                  <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 text-sm text-amber-700">
                    <p className="font-medium mb-0.5">Notes</p>
                    <p>{selectedAppt.notes}</p>
                  </div>
                )}
              </div>
            );
          })()}
        </Modal>
      )}

      {/* Cancel Confirmation */}
      {cancelTarget && (
        <Modal onClose={() => setCancelTarget(null)} title="Cancel Appointment" size="sm">
          <div className="text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <X className="w-6 h-6 text-red-500" />
            </div>
            <p className="text-sm text-slate-600 mb-5">Are you sure you want to cancel this appointment? This action cannot be undone and a refund will be initiated if applicable.</p>
            <div className="flex gap-3">
              <Button variant="secondary" onClick={() => setCancelTarget(null)} className="flex-1 justify-center">Keep It</Button>
              <Button variant="danger" onClick={handleCancel} className="flex-1 justify-center">Yes, Cancel</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

function CalendarView({ appointments }: { appointments: Appointment[] }) {
  const year = 2026, month = 7; // August 2026 (0-indexed)
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const getDr = (id: string) => doctors.find(d => d.id === id)!;

  const apptsByDate: Record<number, Appointment[]> = {};
  appointments.forEach(a => {
    const d = new Date(a.date);
    if (d.getFullYear() === year && d.getMonth() === month) {
      const day = d.getDate();
      if (!apptsByDate[day]) apptsByDate[day] = [];
      apptsByDate[day].push(a);
    }
  });

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-slate-800" style={{ fontFamily: 'DM Sans, sans-serif' }}>August 2026</h3>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-1">
        {dayNames.map(d => (
          <div key={d} className="text-center text-xs font-semibold text-slate-400 py-2">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, i) => {
          const appts = day ? (apptsByDate[day] ?? []) : [];
          const isToday = day === 10;
          return (
            <div
              key={i}
              className={`min-h-[56px] rounded-lg p-1 ${!day ? '' : 'border border-slate-100'} ${isToday ? 'bg-sky-50 border-sky-200' : ''}`}
            >
              {day && (
                <>
                  <p className={`text-xs font-medium text-center mb-1 ${isToday ? 'text-sky-700' : 'text-slate-600'}`}>{day}</p>
                  {appts.slice(0, 2).map(a => {
                    const dr = getDr(a.doctorId);
                    return (
                      <div key={a.id} className="text-[9px] bg-sky-100 text-sky-700 rounded px-1 py-0.5 truncate mb-0.5 leading-tight">
                        {dr.name.split(' ')[1] ?? dr.name.split(' ')[0]}
                      </div>
                    );
                  })}
                  {appts.length > 2 && <div className="text-[9px] text-slate-400 text-center">+{appts.length - 2}</div>}
                </>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}
