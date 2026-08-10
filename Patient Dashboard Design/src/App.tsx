import { useState } from 'react';
import Layout, { type Page } from './components/Layout';
import Dashboard from './components/Dashboard';
import FindDoctors from './components/FindDoctors';
import BookAppointment from './components/BookAppointment';
import MyAppointments from './components/MyAppointments';
import MedicalRecords from './components/MedicalRecords';
import Prescriptions from './components/Prescriptions';
import Payments from './components/Payments';
import Reviews from './components/Reviews';
import Notifications from './components/Notifications';
import ProfileSettings from './components/ProfileSettings';

export default function App() {
  const [page, setPage] = useState<Page>('dashboard');
  const [bookingDoctorId, setBookingDoctorId] = useState<string | null>(null);

  const handleBook = (doctorId: string) => {
    setBookingDoctorId(doctorId);
  };

  const handleBookDone = () => {
    setBookingDoctorId(null);
    setPage('my-appointments');
  };

  if (bookingDoctorId) {
    return (
      <Layout current={page} onChange={p => { setBookingDoctorId(null); setPage(p); }}>
        <BookAppointment doctorId={bookingDoctorId} onDone={handleBookDone} />
      </Layout>
    );
  }

  return (
    <Layout current={page} onChange={setPage}>
      {page === 'dashboard'       && <Dashboard onNavigate={(p) => setPage(p)} />}
      {page === 'find-doctors'    && <FindDoctors onBookDoctor={handleBook} />}
      {page === 'my-appointments' && <MyAppointments onBook={() => setPage('find-doctors')} />}
      {page === 'medical-records' && <MedicalRecords />}
      {page === 'prescriptions'   && <Prescriptions />}
      {page === 'payments'        && <Payments />}
      {page === 'reviews'         && <Reviews />}
      {page === 'notifications'   && <Notifications />}
      {page === 'profile'         && <ProfileSettings />}
    </Layout>
  );
}
