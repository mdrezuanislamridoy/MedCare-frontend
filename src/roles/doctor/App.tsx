import { useState, useEffect } from "react";
import {
  LayoutDashboard, User, Calendar, CalendarClock, Users, Stethoscope,
  Pill, FileText, DollarSign, Star, Bell, Settings as SettingsIcon, LogOut,
  Search, Menu, X, ChevronRight, Clock
} from "lucide-react";
import { useAuthStore } from "../../common/stores/auth.store";
import { doctorApi } from "./services/doctor.api";
import Dashboard from "./pages/Dashboard";
import Appointments from "./pages/Appointments";
import Patients from "./pages/Patients";
import Schedule from "./pages/Schedule";
import Consultations from "./pages/Consultations";
import Prescriptions from "./pages/Prescriptions";
import MedicalRecords from "./pages/MedicalRecords";
import Earnings from "./pages/Earnings";
import Reviews from "./pages/Reviews";
import NotificationsPage from "./pages/Notifications";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";

type Page = "dashboard" | "profile" | "schedule" | "appointments" | "patients" | "consultations" | "prescriptions" | "records" | "earnings" | "reviews" | "notifications" | "settings";

const navItems: { key: Page; label: string; icon: typeof LayoutDashboard }[] = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "profile", label: "My Profile", icon: User },
  { key: "schedule", label: "Schedule & Availability", icon: CalendarClock },
  { key: "appointments", label: "Appointments", icon: Calendar },
  { key: "patients", label: "Patients", icon: Users },
  { key: "consultations", label: "Consultations", icon: Stethoscope },
  { key: "prescriptions", label: "Prescriptions", icon: Pill },
  { key: "records", label: "Medical Records", icon: FileText },
  { key: "earnings", label: "Earnings", icon: DollarSign },
  { key: "reviews", label: "Reviews", icon: Star },
  { key: "notifications", label: "Notifications", icon: Bell },
  { key: "settings", label: "Settings", icon: SettingsIcon },
];

interface Toast {
  id: number;
  message: string;
}

export default function App() {
  const { user } = useAuthStore();
  const [liveDoctor, setLiveDoctor] = useState<{ name: string; specialty: string } | null>(null);
  const [page, setPage] = useState<Page>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
  };

  useEffect(() => {
    async function loadDoctorInfo() {
      try {
        const p = await doctorApi.getProfile();
        if (p) {
          setLiveDoctor({
            name: p.name || user?.name || (user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : "Doctor"),
            specialty: p.specialty || "Specialist",
          });
        }
      } catch (err) {
        // Handled silently
      }
    }
    loadDoctorInfo();
  }, [user]);

  const rawDocName = liveDoctor?.name || user?.name || (user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : "Doctor");
  const docName = rawDocName.startsWith("Dr.") ? rawDocName : `Dr. ${rawDocName}`;
  const docSpecialty = liveDoctor?.specialty || "General Medicine";
  const docInitials = (rawDocName.replace(/^Dr\.\s*/, '').slice(0, 2) || "DR").toUpperCase();

  const navigate = (p: Page) => {
    setPage(p);
    setSidebarOpen(false);
    window.scrollTo({ top: 0 });
  };

  const currentItem = navItems.find((n) => n.key === page);

  return (
    <div className="app-shell-height flex bg-slate-50 overflow-hidden">
      {/* Sidebar overlay (mobile) */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 xl:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed xl:relative z-40 flex flex-col h-full w-64 flex-shrink-0 bg-slate-900 transition-transform duration-200 ${sidebarOpen ? "translate-x-0" : "-translate-x-full xl:translate-x-0"}`}>
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-5 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <Stethoscope className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="font-doctor text-white font-bold text-sm leading-tight">MedCare</div>
              <div className="text-slate-400 text-xs">Doctor Portal</div>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="xl:hidden text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Doctor mini card */}
        <div className="px-4 py-3 border-b border-white/10">
          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/5">
            <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {docInitials}
            </div>
            <div className="min-w-0">
              <div className="text-white font-medium text-sm truncate">{docName}</div>
              <div className="text-teal-400 text-xs truncate">{docSpecialty}</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto sidebar-nav py-3 px-3 space-y-0.5">
          {navItems.map((item) => {
            const active = page === item.key;
            return (
              <button
                key={item.key}
                onClick={() => navigate(item.key)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                  active
                    ? "bg-teal-600 text-white font-semibold shadow-sm"
                    : "text-white font-medium hover:bg-white/15 hover:text-white"
                }`}
              >
                <item.icon className={`w-4 h-4 flex-shrink-0 transition-colors ${active ? "text-teal-200" : "text-white"}`} />
                <span className="flex-1 text-left truncate text-white">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-white/10">
          <button
            onClick={() => {
              useAuthStore.getState().logout();
              window.location.href = '/login';
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-white hover:bg-red-500/20 hover:text-red-300 transition-all"
          >
            <LogOut className="w-4 h-4 text-white group-hover:text-red-300" />
            <span className="text-white">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Trigger */}
      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="xl:hidden fixed top-3 left-3 z-30 p-2 bg-[#0F172A] text-white rounded-lg shadow-md"
          title="Open Menu"
        >
          <Menu className="w-5 h-5" />
        </button>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Page Content */}
        <main className="dashboard-content flex-1 overflow-y-auto p-4 sm:p-6">
          {page === "dashboard" && <Dashboard />}
          {page === "appointments" && <Appointments onToast={showToast} />}
          {page === "patients" && <Patients />}
          {page === "schedule" && <Schedule onToast={showToast} />}
          {page === "consultations" && <Consultations onToast={showToast} />}
          {page === "prescriptions" && <Prescriptions onToast={showToast} />}
          {page === "records" && <MedicalRecords onToast={showToast} />}
          {page === "earnings" && <Earnings />}
          {page === "reviews" && <Reviews />}
          {page === "notifications" && <NotificationsPage />}
          {page === "profile" && <Profile onToast={showToast} />}
          {page === "settings" && <Settings onToast={showToast} />}
        </main>
      </div>

      {/* Toast Notifications */}
      <div className="fixed bottom-4 left-3 right-3 z-50 space-y-2 pointer-events-none sm:left-auto sm:right-4">
        {toasts.map((toast) => (
          <div key={toast.id} className="toast-enter bg-slate-900 text-white text-sm px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 pointer-events-auto sm:min-w-[240px]">
            <div className="w-2 h-2 bg-teal-400 rounded-full flex-shrink-0" />
            {toast.message}
          </div>
        ))}
      </div>
    </div>
  );
}
