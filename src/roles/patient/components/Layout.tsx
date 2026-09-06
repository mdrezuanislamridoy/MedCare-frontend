import { useState } from 'react';
import {
  LayoutDashboard, Search, Calendar, FileText, Pill, CreditCard,
  Star, Bell, User, LogOut, Menu, X, Activity,
} from 'lucide-react';
import { Avatar } from './ui';
import { useAuthStore } from '../../../common/stores/auth.store';

export type Page =
  | 'dashboard' | 'find-doctors' | 'my-appointments'
  | 'medical-records' | 'prescriptions' | 'payments'
  | 'reviews' | 'notifications' | 'profile';

const navItems: { id: Page; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'dashboard',       label: 'Dashboard',       icon: LayoutDashboard },
  { id: 'find-doctors',    label: 'Find Doctors',     icon: Search },
  { id: 'my-appointments', label: 'My Appointments',  icon: Calendar },
  { id: 'medical-records', label: 'Medical Records',  icon: FileText },
  { id: 'prescriptions',   label: 'Prescriptions',    icon: Pill },
  { id: 'payments',        label: 'Payments',         icon: CreditCard },
  { id: 'reviews',         label: 'Reviews',          icon: Star },
  { id: 'notifications',   label: 'Notifications',    icon: Bell },
  { id: 'profile',         label: 'Profile & Settings', icon: User },
];

export default function Layout({ current, onChange, children }: {
  current: Page;
  onChange: (p: Page) => void;
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuthStore();

  const patientName = user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.name || user.email : "Patient";
  const patientEmail = user?.email || "";

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-slate-900 text-white">
      {/* Logo */}
      <div className="px-5 py-5 flex items-center gap-2.5 border-b border-white/10">
        <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center flex-shrink-0">
          <Activity className="w-4 h-4 text-white" />
        </div>
        <div>
          <p className="font-patient font-bold text-white text-sm leading-tight">MedCare</p>
          <p className="text-xs text-slate-400">Patient Health Portal</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">Navigation</p>
        <ul className="space-y-0.5">
          {navItems.map(({ id, label, icon: Icon }) => {
            const active = current === id;
            return (
              <li key={id}>
                <button
                  onClick={() => { onChange(id); setSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors relative ${
                    active
                      ? 'bg-teal-600 text-white shadow-sm'
                      : 'text-slate-200 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 flex-shrink-0 ${active ? 'text-teal-200' : 'text-slate-300'}`} />
                  <span>{label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Patient info at bottom */}
      <div className="px-3 py-3 border-t border-white/10 space-y-1">
        <button
          onClick={() => onChange('profile')}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors"
        >
          <Avatar name={patientName} size="sm" />
          <div className="flex-1 min-w-0 text-left">
            <p className="text-sm font-semibold text-white truncate">{patientName}</p>
            <p className="text-xs text-slate-400 truncate">{patientEmail}</p>
          </div>
        </button>
        <button
          onClick={() => {
            useAuthStore.getState().logout();
            window.location.href = '/login';
          }}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-bold text-white hover:text-red-300 hover:bg-red-500/20 transition-colors"
          title="Sign Out"
        >
          <LogOut className="w-4 h-4 text-white" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="app-shell-height flex overflow-hidden bg-slate-50">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-60 bg-slate-900 border-r border-slate-800 flex-shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          <div className="absolute inset-0 bg-slate-900/50" onClick={() => setSidebarOpen(false)} />
          <aside className="relative z-10 flex flex-col w-64 bg-slate-900 shadow-xl animate-slide-in">
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-white/10 text-white"
            >
              <X className="w-4 h-4" />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main content without top header */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Mobile menu open trigger */}
        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden fixed top-3 left-3 z-30 p-2 bg-slate-900 text-white rounded-lg shadow-md"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        {/* Page content */}
        <main className="dashboard-content flex-1 overflow-y-auto p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
