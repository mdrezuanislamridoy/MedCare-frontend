import { useEffect, useState } from 'react';
import {
  Calendar,
  CheckCircle,
  Clock,
  CreditCard,
  Video,
  ChevronRight,
  MapPin,
  Star,
  FileText,
  Pill,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { useAuthStore } from '../../../common/stores/auth.store';
import { patientApi, PatientDashboardSummary } from '../services/patient.api';
import { doctors, appointments, prescriptions, patient } from '../data/mockData';
import { Badge, Card, StatCard, SectionHeader, Button, Stars, Avatar } from './ui';
import type { Page } from './Layout';

export default function Dashboard({ onNavigate }: { onNavigate: (p: Page, extra?: string) => void }) {
  const { user } = useAuthStore();
  const [liveData, setLiveData] = useState<PatientDashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const data = await patientApi.getDashboardSummary();
        setLiveData(data);
      } catch (err) {
        console.warn('Using offline mock summary for patient dashboard:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  const upcomingAppts = appointments.filter(a => ['confirmed', 'payment_pending'].includes(a.status))
    .sort((a, b) => a.date.localeCompare(b.date));
  const nextAppt = upcomingAppts[0];
  const todayAppt = appointments.find(a => a.date === '2026-08-10' && a.status === 'in_progress');
  const completedVisits = liveData?.stats?.completedAppointments ?? appointments.filter(a => a.status === 'completed').length;
  const pendingPayments = liveData?.stats?.pendingPayments ?? appointments.filter(a => a.paymentStatus === 'pending').length;
  const upcomingCount = liveData?.stats?.upcomingAppointments ?? upcomingAppts.length;

  const displayName = user?.name || patient.name;
  const firstName = displayName.split(' ')[0] || 'Patient';

  const getDr = (id: string) => doctors.find(d => d.id === id) || doctors[0];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="font-patient text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            Good afternoon, {firstName} <span className="inline-block animate-bounce">👋</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
            Welcome to your unified MedCare patient health portal.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => onNavigate('find-doctors')}
            className="bg-teal-600 hover:bg-teal-700 text-white shadow-md shadow-teal-600/20"
            size="sm"
          >
            <Sparkles className="w-3.5 h-3.5" /> Book Consultation
          </Button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          label="Upcoming"
          value={upcomingCount}
          color="sky"
          sub="appointments"
          icon={<Calendar className="w-5 h-5" />}
        />
        <StatCard
          label="Today"
          value={todayAppt ? 1 : 0}
          color="violet"
          sub={todayAppt ? "in progress" : "consultations"}
          icon={<Clock className="w-5 h-5" />}
        />
        <StatCard
          label="Prescriptions"
          value={liveData?.stats?.totalPrescriptions ?? prescriptions.length}
          color="emerald"
          sub="active & past"
          icon={<Pill className="w-5 h-5" />}
        />
        <StatCard
          label="Completed"
          value={completedVisits}
          color="amber"
          sub="visits"
          icon={<Star className="w-5 h-5" />}
        />
        <StatCard
          label="Pending"
          value={pendingPayments}
          color="rose"
          sub={pendingPayments === 1 ? "payment" : "payments"}
          icon={<CreditCard className="w-5 h-5" />}
        />
      </div>

      {/* Today's active consultation banner */}
      {todayAppt && (
        <Card className="bg-gradient-to-r from-teal-600 to-teal-500 border-0 p-5 shadow-lg shadow-teal-500/20 text-white">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Video className="w-5 h-5 text-white animate-pulse" />
              </div>
              <div>
                <p className="font-patient font-bold text-base">Teleconsultation Ready</p>
                <p className="text-teal-100 text-xs sm:text-sm">
                  {getDr(todayAppt.doctorId).name} · {getDr(todayAppt.doctorId).specialty} · In Room Now
                </p>
              </div>
            </div>
            <Button
              onClick={() => onNavigate('my-appointments')}
              className="bg-white text-teal-700 hover:bg-teal-50 shadow-md font-semibold flex-shrink-0"
              variant="secondary"
            >
              <Video className="w-4 h-4" /> Join Video Visit
            </Button>
          </div>
        </Card>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Upcoming appointments */}
        <div className="lg:col-span-2 space-y-4">
          <SectionHeader title="Upcoming Appointments" action={() => onNavigate('my-appointments')} />
          {upcomingAppts.length === 0 ? (
            <Card className="p-8 text-center bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
              <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="text-sm text-slate-500">No upcoming appointments scheduled.</p>
              <Button onClick={() => onNavigate('find-doctors')} className="mt-3" size="sm">
                Find a Doctor
              </Button>
            </Card>
          ) : (
            <div className="space-y-3">
              {upcomingAppts.slice(0, 3).map((a) => {
                const doc = getDr(a.doctorId);
                return (
                  <Card key={a.id} className="p-4 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-teal-500/50 transition">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <Avatar src={doc.photo} name={doc.name} size="md" />
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-patient font-semibold text-slate-800 dark:text-white text-sm">
                              {doc.name}
                            </h3>
                            <Badge variant={a.type === 'online' ? 'online' : 'clinic'} label={a.type === 'online' ? 'Video Visit' : 'In-Person'} />
                          </div>
                          <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">{doc.specialty} · {doc.clinicName}</p>
                          <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-2">
                            <span className="flex items-center gap-1 font-medium text-slate-700 dark:text-slate-300">
                              <Calendar className="w-3.5 h-3.5 text-teal-600" /> {a.date}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-teal-600" /> {a.time}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Button
                        onClick={() => onNavigate('my-appointments')}
                        size="sm"
                        variant="secondary"
                        className="text-xs"
                      >
                        Manage
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick Health Summary & Prescriptions */}
        <div className="space-y-4">
          <SectionHeader title="Active Prescriptions" action={() => onNavigate('prescriptions')} />
          <Card className="p-4 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 space-y-3">
            {prescriptions.slice(0, 3).map((p) => {
              const doc = getDr(p.doctorId);
              return (
                <div key={p.id} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <Pill className="w-3.5 h-3.5 text-teal-600" /> {p.diagnosis}
                    </span>
                    <span className="text-[10px] text-slate-400">{p.date}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    Dr. {doc.name.split('Dr. ')[1] || doc.name} · {p.medicines.length} medications prescribed
                  </p>
                </div>
              );
            })}
            <Button
              onClick={() => onNavigate('prescriptions')}
              variant="secondary"
              className="w-full text-xs"
              size="sm"
            >
              <FileText className="w-3.5 h-3.5" /> View All Prescriptions
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
