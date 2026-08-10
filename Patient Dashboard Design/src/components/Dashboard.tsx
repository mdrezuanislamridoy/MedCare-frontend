import { Calendar, CheckCircle, Clock, CreditCard, Video, ChevronRight, MapPin, Star } from 'lucide-react';
import { doctors, appointments, prescriptions, notifications, patient } from '../data/mockData';
import { Badge, Card, StatCard, SectionHeader, Button, Stars, Avatar } from './ui';
import type { Page } from './Layout';

export default function Dashboard({ onNavigate }: { onNavigate: (p: Page, extra?: string) => void }) {
  const upcomingAppts = appointments.filter(a => ['confirmed', 'payment_pending'].includes(a.status))
    .sort((a, b) => a.date.localeCompare(b.date));
  const nextAppt = upcomingAppts[0];
  const todayAppt = appointments.find(a => a.date === '2026-08-10' && a.status === 'in_progress');
  const completedVisits = appointments.filter(a => a.status === 'completed').length;
  const pendingPayments = appointments.filter(a => a.paymentStatus === 'pending').length;

  const getDr = (id: string) => doctors.find(d => d.id === id)!;

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-800" style={{ fontFamily: 'DM Sans, sans-serif' }}>
          Good afternoon, {patient.name.split(' ')[0]} 👋
        </h1>
        <p className="text-slate-500 text-sm mt-0.5">Here is your health summary for today.</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          label="Upcoming"
          value={upcomingAppts.length}
          color="sky"
          sub="appointments"
          icon={<Calendar className="w-5 h-5" />}
        />
        <StatCard
          label="Today"
          value={todayAppt ? 1 : 0}
          color="violet"
          sub={todayAppt ? "in progress" : "appointments"}
          icon={<Clock className="w-5 h-5" />}
        />
        <StatCard
          label="Total"
          value={appointments.length}
          color="emerald"
          sub="all time"
          icon={<CheckCircle className="w-5 h-5" />}
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
        <Card className="bg-gradient-to-r from-sky-600 to-sky-500 border-0 p-5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Video className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white font-semibold" style={{ fontFamily: 'DM Sans, sans-serif' }}>Active Consultation</p>
                <p className="text-sky-100 text-sm">
                  {getDr(todayAppt.doctorId).name} · {getDr(todayAppt.doctorId).specialty} · Now
                </p>
              </div>
            </div>
            <Button
              onClick={() => onNavigate('my-appointments')}
              className="bg-white text-sky-700 hover:bg-sky-50 flex-shrink-0"
              variant="secondary"
            >
              <Video className="w-4 h-4" /> Join Now
            </Button>
          </div>
        </Card>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Upcoming appointments */}
        <div className="lg:col-span-2 space-y-4">
          <SectionHeader title="Upcoming Appointments" action={() => onNavigate('my-appointments')} />
          {upcomingAppts.length === 0 ? (
            <Card className="p-8 text-center">
              <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="text-sm text-slate-500">No upcoming appointments.</p>
              <Button onClick={() => onNavigate('find-doctors')} className="mt-3" size="sm">Find a Doctor</Button>
            </Card>
          ) : (
            <div className="space-y-3">
              {upcomingAppts.map(appt => {
                const dr = getDr(appt.doctorId);
                return (
                  <Card key={appt.id} className="p-4 flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer" onClick={() => onNavigate('my-appointments')}>
                    <Avatar src={dr.photo} name={dr.name} size="md" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-800 text-sm">{dr.name}</p>
                      <p className="text-xs text-slate-500">{dr.specialty}</p>
                      <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                        <span className="flex items-center gap-1 text-xs text-slate-500">
                          <Calendar className="w-3 h-3" /> {appt.date}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-slate-500">
                          <Clock className="w-3 h-3" /> {appt.time}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge variant={appt.status} />
                      <Badge variant={appt.type} />
                    </div>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Recent prescriptions */}
          <div className="pt-2">
            <SectionHeader title="Recent Prescriptions" action={() => onNavigate('prescriptions')} />
            <div className="space-y-3">
              {prescriptions.map(rx => {
                const dr = getDr(rx.doctorId);
                return (
                  <Card key={rx.id} className="p-4 flex items-center gap-4" onClick={() => onNavigate('prescriptions')} >
                    <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800">{rx.diagnosis}</p>
                      <p className="text-xs text-slate-500">{dr.name} · {rx.date}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{rx.medicines.length} medicine{rx.medicines.length !== 1 ? 's' : ''} prescribed</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </Card>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right col */}
        <div className="space-y-5">
          {/* Recommended doctors */}
          <div>
            <SectionHeader title="Recommended Doctors" action={() => onNavigate('find-doctors')} />
            <div className="space-y-3">
              {doctors.slice(0, 3).map(dr => (
                <Card key={dr.id} className="p-3.5 cursor-pointer" onClick={() => onNavigate('find-doctors')}>
                  <div className="flex items-center gap-3">
                    <Avatar src={dr.photo} name={dr.name} size="md" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 truncate">{dr.name}</p>
                      <p className="text-xs text-slate-500">{dr.specialty}</p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <Stars rating={dr.rating} />
                        <span className="text-xs text-slate-500">{dr.rating}</span>
                        <span className="text-xs text-slate-400">·</span>
                        <span className="text-xs text-emerald-600 font-medium">₹{dr.fee}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 mt-2.5">
                    <div className={`w-1.5 h-1.5 rounded-full ${dr.nextSlot.startsWith('Today') ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                    <p className="text-xs text-slate-500">{dr.nextSlot}</p>
                    {dr.availableOnline && (
                      <Badge variant="online" className="ml-auto" />
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Recent notifications */}
          <div>
            <SectionHeader title="Notifications" action={() => onNavigate('notifications')} />
            <div className="space-y-2">
              {notifications.slice(0, 4).map(notif => (
                <div
                  key={notif.id}
                  className={`flex gap-3 p-3 rounded-xl border transition-colors ${notif.read ? 'bg-white border-slate-200' : 'bg-sky-50 border-sky-200'}`}
                >
                  <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${notif.read ? 'bg-slate-300' : 'bg-sky-500'}`} />
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-medium ${notif.read ? 'text-slate-600' : 'text-slate-800'}`}>{notif.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{notif.message}</p>
                    <p className="text-[10px] text-slate-400 mt-1">{notif.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recently visited */}
          <div>
            <SectionHeader title="Recently Visited" action={() => onNavigate('find-doctors')} />
            <div className="space-y-2">
              {appointments.filter(a => a.status === 'completed').map(appt => {
                const dr = getDr(appt.doctorId);
                return (
                  <div key={appt.id} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-200">
                    <Avatar src={dr.photo} name={dr.name} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-slate-800 truncate">{dr.name}</p>
                      <p className="text-xs text-slate-500">{appt.date}</p>
                    </div>
                    <div className="flex items-center gap-1 text-amber-400">
                      <Star className="w-3 h-3 fill-current" />
                      <span className="text-xs font-medium text-slate-600">{dr.rating}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
