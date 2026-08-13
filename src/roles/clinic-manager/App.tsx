import { useState, type ReactNode } from "react";
import { NOTIFICATIONS, type NavItem } from "./data/mockData";
import { Header, Sidebar } from "./components/ui";
import DashboardPage from "./pages/Dashboard";
import ClinicProfilePage from "./pages/ClinicProfile";
import DoctorsPage from "./pages/Doctors";
import StaffPage from "./pages/Staff";
import SchedulePage from "./pages/Schedule";
import AppointmentsPage from "./pages/Appointments";
import PatientsPage from "./pages/Patients";
import PatientQueuePage from "./pages/PatientQueue";
import RoomsPage from "./pages/Rooms";
import PaymentsPage from "./pages/Payments";
import ReportsPage from "./pages/Reports";
import NotificationsPage from "./pages/Notifications";
import ActivityPage from "./pages/Activity";

export default function App() {
  const [page, setPage] = useState<NavItem>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const unreadNotifs = NOTIFICATIONS.filter((n) => !n.read).length;

  const pages: Record<NavItem, ReactNode> = {
    dashboard: <DashboardPage />,
    "clinic-profile": <ClinicProfilePage />,
    doctors: <DoctorsPage />,
    staff: <StaffPage />,
    schedule: <SchedulePage />,
    appointments: <AppointmentsPage />,
    patients: <PatientsPage />,
    "patient-queue": <PatientQueuePage />,
    rooms: <RoomsPage />,
    payments: <PaymentsPage />,
    reports: <ReportsPage />,
    notifications: <NotificationsPage />,
    activity: <ActivityPage />,
  };

  return (
    <div className="app-shell-height flex overflow-hidden" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      {sidebarOpen && <div className="fixed inset-0 z-30 bg-black/45 lg:hidden" onClick={() => setSidebarOpen(false)} />}
      <div className={`fixed inset-y-0 left-0 z-40 transition-transform duration-200 lg:relative lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <Sidebar active={page} onNav={(next) => { setPage(next); setSidebarOpen(false); }} />
      </div>
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Header page={page} notifCount={unreadNotifs} onOpenSidebar={() => setSidebarOpen(true)} />
        <main className="dashboard-content flex-1 overflow-y-auto" style={{ backgroundColor: "#F0F4F8" }}>
          {pages[page]}
        </main>
      </div>
    </div>
  );
}
