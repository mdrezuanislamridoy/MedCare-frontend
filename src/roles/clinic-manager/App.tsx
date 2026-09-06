import { useState, type ReactNode } from "react";
import type { NavItem } from "./data/mockData";
import { Sidebar } from "./components/ui";
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
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && <div className="fixed inset-0 z-30 bg-black/45 lg:hidden" onClick={() => setSidebarOpen(false)} />}
      
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-40 transition-transform duration-200 lg:relative lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <Sidebar active={page} onNav={(next) => { setPage(next); setSidebarOpen(false); }} />
      </div>

      {/* Main Content Area */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden relative">
        {/* Mobile menu open trigger */}
        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden fixed top-3 left-3 z-30 p-2 bg-slate-900 text-white rounded-lg shadow-md"
            aria-label="Open navigation menu"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        )}
        <main className="dashboard-content flex-1 overflow-y-auto p-4 sm:p-6" style={{ backgroundColor: "#F0F4F8" }}>
          {pages[page]}
        </main>
      </div>
    </div>
  );
}
