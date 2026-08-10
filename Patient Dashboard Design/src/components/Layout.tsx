import { useState } from 'react';
import {
  LayoutDashboard, Search, Calendar, FileText, Pill, CreditCard,
  Star, Bell, User, LogOut, Menu, X, ChevronDown, Video, Activity,
} from 'lucide-react';
import { Avatar } from './ui';
import { patient, notifications } from '../data/mockData';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const unread = notifications.filter(n => !n.read).length;

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-5 flex items-center gap-2.5 border-b border-slate-100">
        <div className="w-8 h-8 bg-sky-600 rounded-lg flex items-center justify-center flex-shrink-0">
          <Activity className="w-4 h-4 text-white" />
        </div>
        <div>
          <p className="font-semibold text-slate-800 text-sm leading-tight" style={{ fontFamily: 'DM Sans, sans-serif' }}>MediConnect</p>
          <p className="text-xs text-slate-400">Patient Portal</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-3 mb-2">Menu</p>
        <ul className="space-y-0.5">
          {navItems.map(({ id, label, icon: Icon }) => {
            const active = current === id;
            return (
              <li key={id}>
                <button
                  onClick={() => { onChange(id); setSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors relative ${
                    active
                      ? 'bg-sky-600 text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span>{label}</span>
                  {id === 'notifications' && unread > 0 && (
                    <span className={`ml-auto text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${active ? 'bg-white/25 text-white' : 'bg-sky-100 text-sky-700'}`}>
                      {unread}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Patient info at bottom */}
      <div className="px-3 py-4 border-t border-slate-100">
        <button
          onClick={() => onChange('profile')}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <Avatar src={patient.photo} name={patient.name} size="sm" />
          <div className="flex-1 min-w-0 text-left">
            <p className="text-sm font-medium text-slate-800 truncate">{patient.name}</p>
            <p className="text-xs text-slate-400 truncate">{patient.email}</p>
          </div>
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-60 bg-white border-r border-slate-200 flex-shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          <div className="absolute inset-0 bg-slate-900/50" onClick={() => setSidebarOpen(false)} />
          <aside className="relative z-10 flex flex-col w-64 bg-white shadow-xl animate-slide-in">
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-slate-100 text-slate-400"
            >
              <X className="w-4 h-4" />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-4 lg:px-6 py-3.5 flex items-center gap-4 flex-shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-slate-100 text-slate-500"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Search */}
          <div className="flex-1 max-w-md relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search doctors, specialties..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && onChange('find-doctors')}
              className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500 focus:bg-white transition placeholder:text-slate-400"
            />
          </div>

          <div className="flex items-center gap-2 ml-auto">
            {/* Upcoming indicator */}
            <button
              onClick={() => onChange('my-appointments')}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-sky-50 text-sky-700 rounded-lg text-xs font-medium hover:bg-sky-100 transition-colors border border-sky-200"
            >
              <Video className="w-3.5 h-3.5" />
              <span>Consultation Today</span>
            </button>

            {/* Notifications */}
            <button
              onClick={() => onChange('notifications')}
              className="relative p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
            >
              <Bell className="w-5 h-5" />
              {unread > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
              )}
            </button>

            {/* Profile menu */}
            <div className="relative">
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <Avatar src={patient.photo} name={patient.name} size="sm" />
                <span className="hidden sm:block text-sm font-medium text-slate-700">{patient.name.split(' ')[0]}</span>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>

              {profileMenuOpen && (
                <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-slate-200 rounded-xl shadow-lg py-1 z-30 animate-fade-in">
                  <button onClick={() => { onChange('profile'); setProfileMenuOpen(false); }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 transition-colors">
                    <User className="w-4 h-4" /> My Profile
                  </button>
                  <div className="border-t border-slate-100 my-1" />
                  <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors">
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
