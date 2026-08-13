import { useState, useEffect } from "react";
import {
  LayoutDashboard, User, Calendar, CalendarClock, Users, Stethoscope,
  Pill, FileText, DollarSign, Star, Bell, Settings as SettingsIcon, LogOut,
  Search, Menu, X, ChevronRight, Clock
} from "lucide-react";
import { doctorProfile, notifications } from "./data/mockData";
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

const navItems: { key: Page; label: string; icon: typeof LayoutDashboard; badge?: number }[] = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "profile", label: "My Profile", icon: User },
  { key: "schedule", label: "Schedule & Availability", icon: CalendarClock },
  { key: "appointments", label: "Appointments", icon: Calendar, badge: 4 },
  { key: "patients", label: "Patients", icon: Users },
  { key: "consultations", label: "Consultations", icon: Stethoscope },
  { key: "prescriptions", label: "Prescriptions", icon: Pill },
  { key: "records", label: "Medical Records", icon: FileText },
  { key: "earnings", label: "Earnings", icon: DollarSign },
  { key: "reviews", label: "Reviews", icon: Star },
  { key: "notifications", label: "Notifications", icon: Bell, badge: 3 },
  { key: "settings", label: "Settings", icon: SettingsIcon },
];

interface Toast {
  id: number;
  message: string;
}

export default function App() {
  const [page, setPage] = useState<Page>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const unread = notifications.filter((n) => !n.read).length;

  const showToast = (message: string) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
  };

  useEffect(() => {
    const close = () => { setProfileMenuOpen(false); setSearchOpen(false); };
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, []);

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
            <img src={doctorProfile.avatar} alt={doctorProfile.name} className="w-10 h-10 rounded-xl object-cover bg-slate-700 flex-shrink-0" />
            <div className="min-w-0">
              <div className="text-white font-medium text-sm truncate">Dr. Sarah Mitchell</div>
              <div className="text-teal-400 text-xs">Cardiologist</div>
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
                    ? "bg-teal-600 text-white"
                    : "text-slate-400 hover:bg-white/8 hover:text-white"
                }`}
              >
                <item.icon className={`w-4 h-4 flex-shrink-0 transition-colors ${active ? "text-white" : "text-slate-500 group-hover:text-slate-300"}`} />
                <span className="flex-1 text-left truncate">{item.label}</span>
                {item.badge && !active && (
                  <span className="text-xs bg-teal-500 text-white px-1.5 py-0.5 rounded-full font-bold min-w-[20px] text-center">{item.badge}</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-white/10">
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:bg-white/8 hover:text-white transition-all">
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center gap-2 px-3 sm:gap-4 sm:px-6 flex-shrink-0">
          <button onClick={() => setSidebarOpen(true)} className="xl:hidden text-slate-500 hover:text-slate-700 transition-colors">
            <Menu className="w-5 h-5" />
          </button>

          {/* Breadcrumb */}
          <div className="hidden sm:flex items-center gap-1.5 text-sm text-slate-500">
            <span className="text-slate-400">Dashboard</span>
            {page !== "dashboard" && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                <span className="text-slate-900 font-medium">{currentItem?.label}</span>
              </>
            )}
          </div>

          <div className="flex-1" />

          {/* Today's indicator */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-teal-50 rounded-lg text-xs font-medium text-teal-700">
            <Clock className="w-3.5 h-3.5" />
            6 appointments today
          </div>

          {/* Search */}
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>
            {searchOpen && (
              <div className="absolute right-0 top-10 w-[calc(100vw-1.5rem)] max-w-72 bg-white rounded-xl border border-slate-200 shadow-xl p-3 z-50">
                <input autoFocus placeholder="Search patients, appointments..." className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500" />
                <div className="mt-2 text-xs text-slate-400 text-center py-2">Start typing to search...</div>
              </div>
            )}
          </div>

          {/* Notifications */}
          <button onClick={() => navigate("notifications")} className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
            <Bell className="w-5 h-5" />
            {unread > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold leading-none">{unread}</span>
            )}
          </button>

          {/* Profile Menu */}
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              className="flex items-center gap-2 p-1.5 hover:bg-slate-100 rounded-xl transition-colors"
            >
              <img src={doctorProfile.avatar} alt="Profile" className="w-8 h-8 rounded-lg object-cover bg-slate-200" />
              <div className="hidden sm:block text-left">
                <div className="text-sm font-medium text-slate-900 leading-tight">Dr. Mitchell</div>
                <div className="text-xs text-slate-500">Cardiologist</div>
              </div>
            </button>
            {profileMenuOpen && (
              <div className="absolute right-0 top-12 w-48 bg-white rounded-xl border border-slate-200 shadow-xl py-1 z-50">
                <button onClick={() => navigate("profile")} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                  <User className="w-4 h-4 text-slate-400" /> My Profile
                </button>
                <button onClick={() => navigate("settings")} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                  <SettingsIcon className="w-4 h-4 text-slate-400" /> Settings
                </button>
                <div className="border-t border-slate-100 my-1" />
                <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main className="dashboard-content flex-1 overflow-y-auto">
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
