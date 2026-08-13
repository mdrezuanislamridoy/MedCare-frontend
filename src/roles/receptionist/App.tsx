import { useState } from "react";
import { NOTIFICATIONS, type NavItem } from "./data/mockData";
import { Header, Sidebar, Toast } from "./components/ui";
import Dashboard from "./pages/Dashboard";
import AppointmentsView from "./pages/Appointments";
import CheckInView from "./pages/CheckIn";
import QueueView from "./pages/Queue";
import PatientsView from "./pages/Patients";
import DoctorsView from "./pages/Doctors";
import ScheduleView from "./pages/Schedule";
import NotificationsView from "./pages/Notifications";
import ActivityView from "./pages/Activity";

export default function App() {
  const [active, setActive] = useState<NavItem>("Dashboard");
  const [toast, setToast] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const unreadNotifs = NOTIFICATIONS.filter((n) => !n.read).length;

  const showToast = (msg: string) => setToast(msg);

  const renderView = () => {
    switch (active) {
      case "Dashboard": return <Dashboard />;
      case "Appointments": return <AppointmentsView showToast={showToast} />;
      case "Patient Check-In": return <CheckInView showToast={showToast} />;
      case "Patient Queue": return <QueueView showToast={showToast} />;
      case "Patients": return <PatientsView />;
      case "Doctors": return <DoctorsView />;
      case "Schedule": return <ScheduleView showToast={showToast} />;
      case "Notifications": return <NotificationsView />;
      case "Activity": return <ActivityView />;
    }
  };

  return (
    <div className="app-shell-height flex overflow-hidden bg-[#f0f4f8]">
      {sidebarOpen && <div className="fixed inset-0 z-30 bg-black/45 lg:hidden" onClick={() => setSidebarOpen(false)} />}
      <div className={`fixed inset-y-0 left-0 z-40 transition-transform duration-200 lg:relative lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <Sidebar active={active} setActive={(next) => { setActive(next); setSidebarOpen(false); }} />
      </div>
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Header active={active} notifCount={unreadNotifs} onNotif={() => setActive("Notifications")} onOpenSidebar={() => setSidebarOpen(true)} />
        <main className="dashboard-content flex-1 overflow-y-auto">
          {renderView()}
        </main>
      </div>
      {toast && <Toast msg={toast} onClose={() => setToast(null)} />}
    </div>
  );
}
