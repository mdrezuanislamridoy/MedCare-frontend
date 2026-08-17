import { useEffect, useState } from 'react';
import { Calendar, List, Video, MapPin, Clock, FileText, RotateCcw, X, CreditCard, Eye, RefreshCw } from 'lucide-react';
import { appointments as mockAppointments, doctors } from '../data/mockData';
import type { Appointment } from '../data/mockData';
import { patientApi } from '../services/patient.api';
import { Badge, Card, Avatar, Button, Modal } from './ui';

const STATUS_OPTIONS = ['All', 'Upcoming', 'Completed', 'Cancelled'];

function getStatusGroup(status: string) {
  const s = status.toLowerCase();
  if (['confirmed', 'payment_pending', 'pending', 'in_progress', 'checked_in'].includes(s)) return 'Upcoming';
  if (s === 'completed') return 'Completed';
  if (['cancelled', 'no_show'].includes(s)) return 'Cancelled';
  return 'Upcoming';
}

export default function MyAppointments({ onBook }: { onBook: () => void }) {
  const [view, setView] = useState<'list' | 'calendar'>('list');
  const [filter, setFilter] = useState('All');
  const [selectedAppt, setSelectedAppt] = useState<any | null>(null);
  const [cancelTarget, setCancelTarget] = useState<string | null>(null);
  const [cancelledIds, setCancelledIds] = useState<string[]>([]);
  const [liveAppointments, setLiveAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAppointments = async () => {
    try {
      const res: any = await patientApi.listAppointments();
      if (res && (res.items || Array.isArray(res))) {
        setLiveAppointments(res.items || res);
      }
    } catch (err) {
      console.warn('Using offline appointments fallback:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  const getDr = (id: string) => doctors.find(d => d.id === id) || doctors[0];

  const apptList = (liveAppointments.length > 0 ? liveAppointments : mockAppointments).map(a => {
    const dr = getDr(a.doctorId);
    return {
      id: a.id,
      doctorId: a.doctorId,
      doctorName: a.doctor?.user?.name || a.doctor?.name || dr?.name || 'Doctor',
      doctorSpecialty: a.doctor?.specialty || dr?.specialty || 'Specialist',
      doctorAvatar: a.doctor?.photo || dr?.photo || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=120&h=120&fit=crop&auto=format',
      date: a.date ? String(a.date).split('T')[0] : '2026-08-12',
      time: a.timeSlot || a.time || '10:00 AM',
      type: a.type === 'VIDEO' || a.type === 'online' ? 'online' : 'clinic',
      status: (cancelledIds.includes(a.id) ? 'cancelled' : a.status || 'confirmed').toLowerCase(),
      paymentStatus: a.paymentStatus || 'paid',
      reason: a.reason || 'General Consultation',
      clinicName: a.clinic?.name || dr?.clinicName || 'MedCare Central Clinic',
      roomNumber: a.doctor?.roomNumber || '302',
    };
  });

  const displayed = apptList.filter(a => filter === 'All' || getStatusGroup(a.status) === filter);

  const handleCancel = async () => {
    if (cancelTarget) {
      try {
        await patientApi.cancelAppointment(cancelTarget, 'Cancelled by patient from portal');
      } catch (err) {
        console.warn('Cancelled offline');
      }
      setCancelledIds(prev => [...prev, cancelTarget]);
      setCancelTarget(null);
    }
  };

  const ActionButtons = ({ appt }: { appt: any }) => {
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
        {effectiveStatus === 'completed' && (
          <Button size="sm" variant="secondary">
            <FileText className="w-3.5 h-3.5" /> Prescription
          </Button>
        )}
      </div>
    );
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="font-patient text-2xl font-bold text-slate-800 dark:text-white">My Appointments</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">Manage and review your clinical consultations.</p>
        </div>
        <Button onClick={onBook} className="bg-teal-600 hover:bg-teal-700 text-white">
          <Calendar className="w-4 h-4" /> Book Appointment
        </Button>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div className="flex gap-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-1">
          {STATUS_OPTIONS.map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3.5 py-1.5 text-sm font-medium rounded-lg transition-colors ${filter === s ? 'bg-teal-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
            >
              {s}
            </button>
          ))}
        </div>
        <div className="flex gap-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-1">
          <button onClick={() => setView('list')} className={`p-2 rounded-lg transition-colors ${view === 'list' ? 'bg-teal-600 text-white' : 'text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
            <List className="w-4 h-4" />
          </button>
          <button onClick={() => setView('calendar')} className={`p-2 rounded-lg transition-colors ${view === 'calendar' ? 'bg-teal-600 text-white' : 'text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
            <Calendar className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* List view */}
      {view === 'list' && (
        <div className="space-y-4">
          {displayed.length === 0 ? (
            <Card className="p-12 text-center bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
              <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="font-semibold text-slate-700 dark:text-slate-200">No appointments found</h3>
              <p className="text-slate-400 text-sm mt-1">There are no {filter.toLowerCase()} appointments scheduled.</p>
              <Button onClick={onBook} className="mt-4 bg-teal-600 hover:bg-teal-700 text-white" size="sm">
                Book a Doctor
              </Button>
            </Card>
          ) : (
            displayed.map(a => (
              <Card key={a.id} className="p-4 sm:p-5 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-teal-500/40 transition">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <Avatar src={a.doctorAvatar || getDr(a.doctorId).photo} name={a.doctorName || getDr(a.doctorId).name} size="lg" />
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-patient font-bold text-slate-800 dark:text-white text-base">
                          {a.doctorName || getDr(a.doctorId).name}
                        </h3>
                        <Badge variant={a.status} />
                        <Badge variant={a.type === 'online' ? 'online' : 'clinic'} label={a.type === 'online' ? 'Video Visit' : 'In-Person'} />
                      </div>
                      <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">{a.doctorSpecialty || getDr(a.doctorId).specialty} · {a.clinicName || 'Clinic'}</p>
                      
                      <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mt-3 flex-wrap">
                        <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-200">
                          <Calendar className="w-3.5 h-3.5 text-teal-600" /> {a.date}
                        </span>
                        <span className="flex items-center gap-1 font-medium">
                          <Clock className="w-3.5 h-3.5 text-teal-600" /> {a.time}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-teal-600" /> {a.type === 'online' ? 'Secure Agora Video Room' : `Room ${a.roomNumber || '302'}`}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="sm:self-center">
                    <ActionButtons appt={a} />
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Appointment Detail Modal */}
      {selectedAppt && (
        <Modal title="Appointment Overview" onClose={() => setSelectedAppt(null)}>
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
              <Avatar src={selectedAppt.doctorAvatar || getDr(selectedAppt.doctorId).photo} name={selectedAppt.doctorName || getDr(selectedAppt.doctorId).name} size="md" />
              <div>
                <h4 className="font-bold text-slate-800 dark:text-white text-sm">{selectedAppt.doctorName || getDr(selectedAppt.doctorId).name}</h4>
                <p className="text-xs text-slate-500">{selectedAppt.doctorSpecialty || getDr(selectedAppt.doctorId).specialty}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <div className="text-slate-400 font-medium">Scheduled Time</div>
                <div className="font-semibold text-slate-800 dark:text-white mt-0.5">{selectedAppt.date} at {selectedAppt.time}</div>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <div className="text-slate-400 font-medium">Consultation Type</div>
                <div className="font-semibold text-slate-800 dark:text-white mt-0.5">{selectedAppt.type === 'online' ? 'Video Visit' : 'In-Person Clinic'}</div>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <div className="text-slate-400 font-medium">Clinical Reason</div>
                <div className="font-semibold text-slate-800 dark:text-white mt-0.5">{selectedAppt.reason || 'General Consultation'}</div>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <div className="text-slate-400 font-medium">Payment Status</div>
                <div className="font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5 uppercase">{selectedAppt.paymentStatus || 'PAID'}</div>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <Button onClick={() => setSelectedAppt(null)} variant="secondary" size="sm">
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Cancel Confirmation Modal */}
      {cancelTarget && (
        <Modal title="Cancel Appointment" onClose={() => setCancelTarget(null)}>
          <div className="space-y-4">
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Are you sure you want to cancel this appointment? This time slot will be released back to the doctor&apos;s schedule.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="secondary" onClick={() => setCancelTarget(null)} size="sm">
                Keep Appointment
              </Button>
              <Button onClick={handleCancel} className="bg-red-600 hover:bg-red-700 text-white" size="sm">
                Yes, Cancel
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
