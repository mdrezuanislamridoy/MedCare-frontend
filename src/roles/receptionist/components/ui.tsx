import { useEffect, useState } from "react";
import type { AppointmentStatus, DoctorStatus, NavItem, PaymentStatus } from "../data/mockData";

// ─── Utility Components ───────────────────────────────────────────────────────

export function Avatar({ initials, color = "blue", size = "sm" }: { initials: string; color?: string; size?: "sm" | "md" | "lg" }) {
  const colors: Record<string, string> = {
    blue: "bg-blue-100 text-blue-700",
    green: "bg-emerald-100 text-emerald-700",
    purple: "bg-purple-100 text-purple-700",
    amber: "bg-amber-100 text-amber-700",
    rose: "bg-rose-100 text-rose-700",
    indigo: "bg-indigo-100 text-indigo-700",
    teal: "bg-teal-100 text-teal-700",
    orange: "bg-orange-100 text-orange-700",
  }
  const colorMap: Record<string, string> = {
    AP: "blue", LC: "purple", RM: "indigo", SQ: "teal",
    SM: "rose", JT: "green", MS: "amber", DO: "orange",
    EV: "purple", TK: "blue", PN: "rose", RW: "green",
    AK: "teal", NB: "indigo", CD: "amber", KA: "orange",
  }
  const cls = colors[colorMap[initials] || color] || colors.blue
  const sz = size === "lg" ? "w-10 h-10 text-base" : size === "md" ? "w-8 h-8 text-sm" : "w-7 h-7 text-xs"
  return (
    <div className={`${sz} ${cls} rounded-full flex items-center justify-center font-semibold shrink-0`}>
      {initials}
    </div>
  )
}

export function StatusBadge({ status }: { status: AppointmentStatus | DoctorStatus | string }) {
  const map: Record<string, string> = {
    Confirmed: "bg-blue-50 text-blue-700 border border-blue-200",
    "Checked In": "bg-indigo-50 text-indigo-700 border border-indigo-200",
    "In Progress": "bg-amber-50 text-amber-700 border border-amber-200",
    Completed: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    Cancelled: "bg-red-50 text-red-600 border border-red-200",
    "No Show": "bg-gray-100 text-gray-500 border border-gray-200",
    Available: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    "In Consultation": "bg-amber-50 text-amber-700 border border-amber-200",
    "On Break": "bg-orange-50 text-orange-600 border border-orange-200",
    Offline: "bg-gray-100 text-gray-500 border border-gray-200",
    Paid: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    Pending: "bg-yellow-50 text-yellow-700 border border-yellow-200",
    Insurance: "bg-sky-50 text-sky-700 border border-sky-200",
    Waived: "bg-gray-100 text-gray-500 border border-gray-200",
    Waiting: "bg-blue-50 text-blue-700 border border-blue-200",
    Called: "bg-amber-50 text-amber-700 border border-amber-200",
    "In Room": "bg-emerald-50 text-emerald-700 border border-emerald-200",
  }
  return (
    <span className={`mono text-[11px] font-medium px-2 py-0.5 rounded-full whitespace-nowrap ${map[status] || "bg-gray-100 text-gray-600"}`}>
      {status}
    </span>
  )
}

export function PaymentBadge({ status }: { status: PaymentStatus }) {
  return <StatusBadge status={status} />
}

export function DoctorDot({ status }: { status: DoctorStatus }) {
  const map: Record<DoctorStatus, string> = {
    Available: "bg-emerald-500",
    "In Consultation": "bg-amber-500",
    "On Break": "bg-orange-400",
    Offline: "bg-gray-400",
  }
  const pulse = status === "Available"
  return (
    <span className="relative flex h-2.5 w-2.5">
      {pulse && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />}
      <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${map[status]}`} />
    </span>
  )
}

export function Toast({ msg, onClose }: { msg: string; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3200)
    return () => clearTimeout(t)
  }, [onClose])
  return (
    <div className="fixed bottom-6 right-6 z-50 animate-slide-in bg-gray-900 text-white text-sm px-4 py-3 rounded-lg shadow-xl flex items-center gap-3 max-w-xs">
      <span className="text-emerald-400">✓</span>
      {msg}
      <button onClick={onClose} className="ml-auto text-gray-400 hover:text-white text-xs">✕</button>
    </div>
  )
}

export function ConfirmDialog({ msg, onConfirm, onCancel }: { msg: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full mx-4 animate-fade-in">
        <h3 className="font-semibold text-gray-900 mb-2">Confirm Action</h3>
        <p className="text-sm text-gray-500 mb-5">{msg}</p>
        <div className="flex gap-3 justify-end">
          <button onClick={onCancel} className="px-4 py-2 text-sm rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50">Cancel</button>
          <button onClick={onConfirm} className="px-4 py-2 text-sm rounded-lg bg-red-500 text-white hover:bg-red-600">Confirm</button>
        </div>
      </div>
    </div>
  )
}

export function EmptyState({ icon, title, sub }: { icon: string; title: string; sub: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <span className="text-4xl mb-3">{icon}</span>
      <p className="font-semibold text-gray-700">{title}</p>
      <p className="text-sm text-gray-400 mt-1">{sub}</p>
    </div>
  )
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

export const NAV_ITEMS: { label: NavItem; icon: string }[] = [
  { label: "Dashboard", icon: "⊞" },
  { label: "Appointments", icon: "📅" },
  { label: "Patient Check-In", icon: "✅" },
  { label: "Patient Queue", icon: "🔢" },
  { label: "Patients", icon: "👤" },
  { label: "Doctors", icon: "🩺" },
  { label: "Schedule", icon: "🗓" },
  { label: "Notifications", icon: "🔔" },
  { label: "Activity", icon: "📋" },
]

export function Sidebar({ active, setActive }: { active: NavItem; setActive: (n: NavItem) => void }) {
  return (
    <aside className="flex h-full w-56 shrink-0 flex-col border-r border-gray-100 bg-white shadow-sm">
      <div className="px-5 py-5 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm">🏥</span>
          </div>
          <div>
            <p className="font-bold text-gray-900 text-sm leading-tight">MedFront</p>
            <p className="text-[10px] text-gray-400 mono">Riverside Clinic</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto py-3 px-2">
        {NAV_ITEMS.map(({ label, icon }) => {
          const isActive = active === label
          const badge = label === "Notifications" ? 4 : label === "Patient Queue" ? 3 : 0
          return (
            <button
              key={label}
              onClick={() => setActive(label)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg mb-0.5 text-sm transition-colors group ${
                isActive
                  ? "bg-blue-600 text-white font-medium"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <span className="text-base">{icon}</span>
              <span className="flex-1 text-left">{label}</span>
              {badge > 0 && (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${isActive ? "bg-white/20 text-white" : "bg-blue-100 text-blue-700"}`}>
                  {badge}
                </span>
              )}
            </button>
          )
        })}
      </nav>
      <div className="px-4 py-4 border-t border-gray-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold">GO</div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-800 truncate">Grace Osei</p>
            <p className="text-[10px] text-gray-400">Receptionist</p>
          </div>
        </div>
      </div>
    </aside>
  )
}

// ─── Header ───────────────────────────────────────────────────────────────────

export function Header({ active, notifCount, onNotif, onOpenSidebar }: { active: NavItem; notifCount: number; onNotif: () => void; onOpenSidebar: () => void }) {
  const today = new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })
  const [search, setSearch] = useState("")
  return (
    <header className="min-h-14 bg-white border-b border-gray-100 flex flex-wrap items-center px-3 py-2 sm:px-6 gap-2 sm:gap-4 shrink-0 sticky top-0 z-30 shadow-sm">
      <button onClick={onOpenSidebar} className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 lg:hidden" aria-label="Open navigation">
        ☰
      </button>
      <div className="min-w-0 flex-1">
        <h1 className="text-base font-semibold text-gray-900">{active}</h1>
        <p className="text-[11px] text-gray-400 mono hidden sm:block">{today}</p>
      </div>
      <div className="order-last flex w-full items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 sm:order-none sm:w-full sm:w-56">
        <span className="text-gray-400 text-xs">🔍</span>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search patients, appointments…"
          className="bg-transparent text-sm outline-none flex-1 placeholder:text-gray-400 text-gray-700"
        />
      </div>
      <button className="text-sm bg-blue-600 text-white px-3 py-1.5 rounded-lg font-medium hover:bg-blue-700 transition-colors hidden md:block">
        + New Appointment
      </button>
      <button onClick={onNotif} className="relative w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors">
        🔔
        {notifCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-[9px] font-bold">
            {notifCount}
          </span>
        )}
      </button>
      <div className="flex items-center gap-2 cursor-pointer group">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold">GO</div>
        <span className="text-sm font-medium text-gray-700 hidden md:block">Grace Osei</span>
        <span className="text-gray-400 text-xs">▾</span>
      </div>
    </header>
  )
}
