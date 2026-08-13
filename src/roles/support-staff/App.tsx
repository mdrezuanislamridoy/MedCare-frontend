import { useState } from 'react';
import { ToastContainer, useToast } from './components/ui';
import DashboardPage from './pages/DashboardPage';
import TicketsPage from './pages/TicketsPage';
import PatientsPage from './pages/PatientsPage';
import AppointmentsPage from './pages/AppointmentsPage';
import ComplaintsPage from './pages/ComplaintsPage';
import MessagesPage from './pages/MessagesPage';
import NotificationsPage from './pages/NotificationsPage';
import ActivityPage from './pages/ActivityPage';
import { notifications, messages, tickets } from './data/mockData';

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
  const [page, setPage] = useState<Page>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');
  const { toasts, show: showToast, dismiss } = useToast();

  const unreadNotifs = notifications.filter(n => !n.read).length;
  const unreadMessages = messages.reduce((s, m) => s + m.unreadCount, 0);
  const urgentTickets = tickets.filter(t => t.priority === 'Urgent' && t.status !== 'Resolved' && t.status !== 'Closed').length;

  const badges: Partial<Record<Page, number>> = {
    notifications: unreadNotifs,
    messages: unreadMessages,
  };

  const navigate = (p: string) => setPage(p as Page);

  const handleNavigate = (next: Page) => {
    setPage(next);
    setSidebarOpen(false);
  };

  return (
    <div className="app-shell-height flex bg-[#F0F4F8] overflow-hidden">
      {sidebarOpen && <div className="fixed inset-0 z-30 bg-black/45 lg:hidden" onClick={() => setSidebarOpen(false)} />}
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 flex w-60 flex-shrink-0 flex-col overflow-hidden border-r border-slate-200 bg-white transition-all duration-200 lg:relative lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0 lg:w-16'}`}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 h-14 border-b border-slate-100">
          <div className="w-8 h-8 bg-[#0C7BB3] rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-white text-sm font-bold">+</span>
          </div>
          <div className="lg:hidden">
            <button onClick={() => setSidebarOpen(false)} className="rounded-lg px-2 py-1 text-sm text-slate-400 hover:bg-slate-100 hover:text-slate-700" aria-label="Close navigation">✕</button>
          </div>
          <div className="hidden lg:block">
          {sidebarOpen && (
            <div>
              <p className="text-sm font-semibold text-slate-900 leading-none">MediSupport</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Support Portal</p>
            </div>
          )}
          </div>
          <div className="lg:hidden">
            <p className="text-sm font-semibold text-slate-900 leading-none">MediSupport</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Support Portal</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto">
          {navItems.map(item => {
            const badge = badges[item.id];
            const active = page === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.id)}
                title={!sidebarOpen ? item.label : undefined}
                className={`nav-item w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                  active
                    ? 'bg-[#0C7BB3] text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <span className="text-base flex-shrink-0">{item.icon}</span>
                {sidebarOpen && (
                  <>
                    <span className="flex-1 text-left truncate">{item.label}</span>
                    {badge != null && badge > 0 && (
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center ${
                        active ? 'bg-white/20 text-white' : 'bg-[#0C7BB3] text-white'
                      }`}>
                        {badge}
                      </span>
                    )}
                  </>
                )}
              </button>
            );
          })}
        </nav>

        {/* Staff profile */}
        <div className={`border-t border-slate-100 p-3 ${sidebarOpen ? '' : 'flex justify-center'}`}>
          {sidebarOpen ? (
            <div className="flex items-center gap-3 px-2 py-1.5">
              <div className="w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">AC</div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-800 truncate">Alex Chen</p>
                <p className="text-[10px] text-slate-400">Support Staff</p>
              </div>
              <div className="w-2 h-2 bg-emerald-500 rounded-full flex-shrink-0" title="Online" />
            </div>
          ) : (
            <div className="w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-sm font-semibold">AC</div>
          )}
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="min-h-14 bg-white border-b border-slate-200 flex flex-wrap items-center gap-2 px-3 py-2 sm:gap-3 sm:px-4 flex-shrink-0">
          <button
            onClick={() => setSidebarOpen(o => !o)}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
            title="Toggle sidebar"
          >
            ☰
          </button>

          {/* Search */}
          <div className="order-last relative w-full sm:order-none sm:min-w-[220px] sm:flex-1 sm:max-w-96">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">🔍</span>
            <input
              type="text"
              value={globalSearch}
              onChange={e => setGlobalSearch(e.target.value)}
              placeholder="Search tickets, patients, appointments…"
              className="w-full pl-8 pr-4 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0C7BB3]/30 focus:border-[#0C7BB3] transition-colors"
            />
          </div>

          <div className="ml-auto flex shrink-0 items-center gap-1">
            {/* Urgent indicator */}
            {urgentTickets > 0 && (
              <button
                onClick={() => navigate('tickets')}
                className="hidden items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-2.5 py-1.5 text-xs font-medium text-red-700 transition-colors hover:bg-red-100 sm:flex"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                {urgentTickets} Urgent
              </button>
            )}

            {/* Notifications */}
            <button
              onClick={() => setPage('notifications')}
              className="relative w-9 h-9 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
            >
              🔔
              {unreadNotifs > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">{unreadNotifs}</span>
              )}
            </button>

            {/* Messages */}
            <button
              onClick={() => setPage('messages')}
              className="relative w-9 h-9 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
            >
              💬
              {unreadMessages > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#0C7BB3] text-white text-[9px] font-bold rounded-full flex items-center justify-center">{unreadMessages}</span>
              )}
            </button>

            {/* Quick actions */}
            <button
              onClick={() => showToast('Quick actions: Create ticket, look up patient, flag appointment.', 'info')}
              className="hidden rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-200 md:block"
            >
              Quick Action
            </button>

            {/* Profile */}
            <div className="flex items-center gap-2 ml-2 pl-3 border-l border-slate-200">
              <div className="w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-sm font-semibold">AC</div>
              <div className="hidden sm:block">
                <p className="text-xs font-semibold text-slate-800">Alex Chen</p>
                <p className="text-[10px] text-slate-400">Support Staff</p>
              </div>
              <button
                onClick={() => showToast('You have been logged out.', 'info')}
                className="ml-1 text-xs text-slate-400 hover:text-slate-600 px-2 py-1 rounded hover:bg-slate-100 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="dashboard-content flex-1 overflow-y-auto pb-9">
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
        <span>Session: Alex Chen · MediSupport v2.4.1</span>
      </div>

      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </div>
  );
}
