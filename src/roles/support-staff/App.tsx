import { useState } from 'react';
import { LogOut } from 'lucide-react';
import { ToastContainer, useToast } from './components/ui';
import { useAuthStore } from '../../common/stores/auth.store';
import DashboardPage from './pages/DashboardPage';
import TicketsPage from './pages/TicketsPage';
import PatientsPage from './pages/PatientsPage';
import AppointmentsPage from './pages/AppointmentsPage';
import ComplaintsPage from './pages/ComplaintsPage';
import MessagesPage from './pages/MessagesPage';
import NotificationsPage from './pages/NotificationsPage';
import ActivityPage from './pages/ActivityPage';

type Page = 'dashboard' | 'tickets' | 'patients' | 'appointments' | 'complaints' | 'messages' | 'notifications' | 'activity';

const navItems: { id: Page; label: string; icon: string }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: '▤' },
  { id: 'tickets', label: 'Support Tickets', icon: '🎫' },
  { id: 'patients', label: 'Patients', icon: '👤' },
  { id: 'appointments', label: 'Appointments', icon: '📅' },
  { id: 'complaints', label: 'Complaints', icon: '⚠' },
  { id: 'messages', label: 'Messages', icon: '💬' },
  { id: 'notifications', label: 'Notifications', icon: '🔔' },
  { id: 'activity', label: 'Activity', icon: '📋' },
];

const pageTitles: Record<Page, string> = {
  dashboard: 'Dashboard',
  tickets: 'Support Tickets',
  patients: 'Patients',
  appointments: 'Appointments',
  complaints: 'Complaints',
  messages: 'Messages',
  notifications: 'Notifications',
  activity: 'Activity',
};

export default function App() {
  const { user } = useAuthStore();
  const [page, setPage] = useState<Page>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { toasts, show: showToast, dismiss } = useToast();

  const initials = user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'ST';
  const displayName = user?.name || 'Support Staff';

  const navigate = (p: string) => setPage(p as Page);

  const handleNavigate = (next: Page) => {
    setPage(next);
    setSidebarOpen(false);
  };

  return (
    <div className="app-shell-height flex bg-[#F0F4F8] overflow-hidden">
      {sidebarOpen && <div className="fixed inset-0 z-30 bg-black/45 lg:hidden" onClick={() => setSidebarOpen(false)} />}
      
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 flex w-60 flex-shrink-0 flex-col overflow-hidden border-r border-slate-800 bg-slate-900 transition-all duration-200 lg:relative lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 h-14 border-b border-slate-800">
          <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md">
            <span className="text-white text-sm font-bold">+</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-white leading-none">MediSupport</p>
            <p className="text-[10px] text-teal-400 mt-0.5">Support Portal</p>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden rounded-lg px-2 py-1 text-sm text-slate-400 hover:bg-slate-800 hover:text-white" aria-label="Close navigation">✕</button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto">
          {navItems.map(item => {
            const active = page === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? 'bg-teal-600 text-white shadow-sm font-semibold'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <span className="text-base flex-shrink-0">{item.icon}</span>
                <span className="flex-1 text-left truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Staff profile */}
        <div className="border-t border-slate-800 p-3 space-y-2">
          <div className="flex items-center gap-3 px-2 py-1.5 bg-slate-800/40 rounded-lg">
            <div className="w-8 h-8 bg-teal-700 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">{initials}</div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">{displayName}</p>
              <p className="text-[10px] text-slate-400">Support Staff</p>
            </div>
            <div className="w-2 h-2 bg-emerald-500 rounded-full flex-shrink-0" title="Online" />
          </div>
          <button
            onClick={() => {
              useAuthStore.getState().logout();
              window.location.href = '/login';
            }}
            className="w-full flex items-center justify-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 transition-colors"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile top bar only */}
        <div className="flex items-center gap-3 px-4 py-2 lg:hidden bg-white border-b border-gray-200">
          <button onClick={() => setSidebarOpen(true)} className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50" aria-label="Open navigation">
            ☰
          </button>
          <h1 className="text-base font-semibold text-gray-900">{pageTitles[page]}</h1>
        </div>

        {/* Page content */}
        <main className="dashboard-content flex-1 overflow-y-auto p-4 sm:p-6 pb-12">
          {page === 'dashboard' && <DashboardPage onNavigate={navigate} />}
          {page === 'tickets' && <TicketsPage showToast={showToast} />}
          {page === 'patients' && <PatientsPage showToast={showToast} />}
          {page === 'appointments' && <AppointmentsPage showToast={showToast} />}
          {page === 'complaints' && <ComplaintsPage showToast={showToast} />}
          {page === 'messages' && <MessagesPage showToast={showToast} />}
          {page === 'notifications' && <NotificationsPage showToast={showToast} />}
          {page === 'activity' && <ActivityPage />}
        </main>
      </div>

      {/* RBAC notice — discreet footer bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-900/90 text-slate-400 text-[10px] px-4 py-1.5 flex items-center justify-between pointer-events-none z-40">
        <span>🔒 Support Staff Role — Limited access. Medical records, payment management, and admin functions are restricted.</span>
        <span>Session: {displayName} · MediSupport</span>
      </div>

      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </div>
  );
}
