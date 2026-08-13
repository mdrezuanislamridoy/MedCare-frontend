import { useState, useEffect, useRef } from "react"

// ─── Types ────────────────────────────────────────────────────────────────────

type NavItem =
  | "Dashboard"
  | "Appointments"
  | "Patient Check-In"
  | "Patient Queue"
  | "Patients"
  | "Doctors"
  | "Schedule"
  | "Notifications"
  | "Activity"

type AppointmentStatus =
  | "Confirmed"
  | "Checked In"
  | "In Progress"
  | "Completed"
  | "Cancelled"
  | "No Show"

type DoctorStatus = "Available" | "In Consultation" | "On Break" | "Offline"

type PaymentStatus = "Paid" | "Pending" | "Insurance" | "Waived"

interface Appointment {
  id: string
  patient: string
  doctor: string
  time: string
  type: string
  room: string
  payment: PaymentStatus
  status: AppointmentStatus
  avatar: string
  doctorAvatar: string
}

interface QueueEntry {
  queueNo: number
  patient: string
  doctor: string
  apptTime: string
  waitMins: number
  status: "Waiting" | "Called" | "In Room" | "No Show"
  avatar: string
}

interface Doctor {
  name: string
  specialty: string
  status: DoctorStatus
  avatar: string
  queue: number
  nextAppt: string
  room: string
}

interface Patient {
  name: string
  phone: string
  doctor: string
  lastVisit: string
  visits: number
  avatar: string
}

interface Notification {
  id: number
  type: "appointment" | "cancel" | "reschedule" | "doctor" | "checkin" | "schedule"
  message: string
  time: string
  read: boolean
}

interface ActivityEntry {
  id: number
  action: string
  detail: string
  time: string
  user: string
  type: "checkin" | "cancel" | "reschedule" | "room" | "queue" | "appointment"
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const APPOINTMENTS: Appointment[] = [
  { id: "APT-1001", patient: "Sarah Mitchell", doctor: "Dr. Amir Patel", time: "08:30 AM", type: "General", room: "101", payment: "Insurance", status: "Completed", avatar: "SM", doctorAvatar: "AP" },
  { id: "APT-1002", patient: "James Thornton", doctor: "Dr. Linda Cho", time: "09:00 AM", type: "Follow-Up", room: "203", payment: "Paid", status: "Completed", avatar: "JT", doctorAvatar: "LC" },
  { id: "APT-1003", patient: "Maria Santos", doctor: "Dr. Amir Patel", time: "09:30 AM", type: "Consultation", room: "101", payment: "Pending", status: "In Progress", avatar: "MS", doctorAvatar: "AP" },
  { id: "APT-1004", patient: "Daniel Okafor", doctor: "Dr. Raj Mehta", time: "10:00 AM", type: "Check-Up", room: "305", payment: "Insurance", status: "Checked In", avatar: "DO", doctorAvatar: "RM" },
  { id: "APT-1005", patient: "Elena Vasquez", doctor: "Dr. Linda Cho", time: "10:30 AM", type: "General", room: "—", payment: "Paid", status: "Confirmed", avatar: "EV", doctorAvatar: "LC" },
  { id: "APT-1006", patient: "Thomas Kim", doctor: "Dr. Raj Mehta", time: "11:00 AM", type: "Follow-Up", room: "—", payment: "Insurance", status: "Confirmed", avatar: "TK", doctorAvatar: "RM" },
  { id: "APT-1007", patient: "Priya Nair", doctor: "Dr. Amir Patel", time: "11:30 AM", type: "Consultation", room: "—", payment: "Pending", status: "Confirmed", avatar: "PN", doctorAvatar: "AP" },
  { id: "APT-1008", patient: "Robert Walsh", doctor: "Dr. Sarah Quinn", time: "12:00 PM", type: "Procedure", room: "—", payment: "Waived", status: "Cancelled", avatar: "RW", doctorAvatar: "SQ" },
  { id: "APT-1009", patient: "Aisha Kamara", doctor: "Dr. Linda Cho", time: "01:00 PM", type: "General", room: "—", payment: "Insurance", status: "Confirmed", avatar: "AK", doctorAvatar: "LC" },
  { id: "APT-1010", patient: "Nathan Brooks", doctor: "Dr. Raj Mehta", time: "01:30 PM", type: "Follow-Up", room: "—", payment: "Paid", status: "Confirmed", avatar: "NB", doctorAvatar: "RM" },
  { id: "APT-1011", patient: "Claire Dupont", doctor: "Dr. Sarah Quinn", time: "02:00 PM", type: "Check-Up", room: "—", payment: "Insurance", status: "Confirmed", avatar: "CD", doctorAvatar: "SQ" },
  { id: "APT-1012", patient: "Kevin Adeyemi", doctor: "Dr. Amir Patel", time: "02:30 PM", type: "Consultation", room: "—", payment: "Pending", status: "No Show", avatar: "KA", doctorAvatar: "AP" },
]

const QUEUE: QueueEntry[] = [
  { queueNo: 1, patient: "Maria Santos", doctor: "Dr. Amir Patel", apptTime: "09:30 AM", waitMins: 12, status: "In Room", avatar: "MS" },
  { queueNo: 2, patient: "Daniel Okafor", doctor: "Dr. Raj Mehta", apptTime: "10:00 AM", waitMins: 8, status: "Called", avatar: "DO" },
  { queueNo: 3, patient: "Elena Vasquez", doctor: "Dr. Linda Cho", apptTime: "10:30 AM", waitMins: 4, status: "Waiting", avatar: "EV" },
  { queueNo: 4, patient: "Thomas Kim", doctor: "Dr. Raj Mehta", apptTime: "11:00 AM", waitMins: 2, status: "Waiting", avatar: "TK" },
  { queueNo: 5, patient: "Priya Nair", doctor: "Dr. Amir Patel", apptTime: "11:30 AM", waitMins: 0, status: "Waiting", avatar: "PN" },
]

const DOCTORS: Doctor[] = [
  { name: "Dr. Amir Patel", specialty: "General Practice", status: "In Consultation", avatar: "AP", queue: 3, nextAppt: "11:30 AM", room: "101" },
  { name: "Dr. Linda Cho", specialty: "Internal Medicine", status: "Available", avatar: "LC", queue: 2, nextAppt: "10:30 AM", room: "203" },
  { name: "Dr. Raj Mehta", specialty: "Cardiology", status: "In Consultation", avatar: "RM", queue: 2, nextAppt: "11:00 AM", room: "305" },
  { name: "Dr. Sarah Quinn", specialty: "Pediatrics", status: "On Break", avatar: "SQ", queue: 0, nextAppt: "02:00 PM", room: "—" },
]

const PATIENTS: Patient[] = [
  { name: "Sarah Mitchell", phone: "+1 (555) 204-8832", doctor: "Dr. Amir Patel", lastVisit: "Today", visits: 4, avatar: "SM" },
  { name: "James Thornton", phone: "+1 (555) 319-0047", doctor: "Dr. Linda Cho", lastVisit: "Today", visits: 2, avatar: "JT" },
  { name: "Maria Santos", phone: "+1 (555) 477-2291", doctor: "Dr. Amir Patel", lastVisit: "Today", visits: 7, avatar: "MS" },
  { name: "Daniel Okafor", phone: "+1 (555) 522-6630", doctor: "Dr. Raj Mehta", lastVisit: "Today", visits: 3, avatar: "DO" },
  { name: "Elena Vasquez", phone: "+1 (555) 638-1124", doctor: "Dr. Linda Cho", lastVisit: "Aug 1", visits: 1, avatar: "EV" },
  { name: "Thomas Kim", phone: "+1 (555) 741-5500", doctor: "Dr. Raj Mehta", lastVisit: "Jul 28", visits: 5, avatar: "TK" },
  { name: "Priya Nair", phone: "+1 (555) 856-9973", doctor: "Dr. Amir Patel", lastVisit: "Jul 22", visits: 2, avatar: "PN" },
  { name: "Aisha Kamara", phone: "+1 (555) 923-4417", doctor: "Dr. Linda Cho", lastVisit: "Jul 18", visits: 3, avatar: "AK" },
  { name: "Nathan Brooks", phone: "+1 (555) 012-8843", doctor: "Dr. Raj Mehta", lastVisit: "Jul 10", visits: 6, avatar: "NB" },
  { name: "Claire Dupont", phone: "+1 (555) 168-3356", doctor: "Dr. Sarah Quinn", lastVisit: "Jul 5", visits: 1, avatar: "CD" },
]

const NOTIFICATIONS: Notification[] = [
  { id: 1, type: "checkin", message: "Maria Santos checked in — Room 101 assigned", time: "9:28 AM", read: false },
  { id: 2, type: "appointment", message: "New appointment booked: Priya Nair at 11:30 AM with Dr. Patel", time: "9:14 AM", read: false },
  { id: 3, type: "doctor", message: "Dr. Sarah Quinn is now On Break", time: "9:02 AM", read: false },
  { id: 4, type: "cancel", message: "Robert Walsh cancelled appointment APT-1008", time: "8:51 AM", read: true },
  { id: 5, type: "reschedule", message: "Kevin Adeyemi rescheduled from 2:30 PM to tomorrow 9:00 AM", time: "8:44 AM", read: true },
  { id: 6, type: "checkin", message: "Daniel Okafor checked in — Queue #2 assigned", time: "8:40 AM", read: true },
  { id: 7, type: "schedule", message: "Room 203 is now available for afternoon appointments", time: "8:30 AM", read: true },
  { id: 8, type: "appointment", message: "Aisha Kamara confirmed appointment at 1:00 PM", time: "8:20 AM", read: true },
  { id: 9, type: "doctor", message: "Dr. Raj Mehta started In Consultation", time: "10:05 AM", read: false },
  { id: 10, type: "cancel", message: "No-show recorded: Kevin Adeyemi (APT-1012)", time: "10:32 AM", read: false },
]

const ACTIVITY: ActivityEntry[] = [
  { id: 1, action: "Patient Checked In", detail: "Maria Santos — APT-1003 — Room 101 assigned", time: "9:28 AM", user: "Grace Osei", type: "checkin" },
  { id: 2, action: "Queue Updated", detail: "Queue #2 called for Daniel Okafor", time: "9:55 AM", user: "Grace Osei", type: "queue" },
  { id: 3, action: "Room Assigned", detail: "Room 305 assigned to Daniel Okafor", time: "9:57 AM", user: "Grace Osei", type: "room" },
  { id: 4, action: "Appointment Cancelled", detail: "APT-1008 — Robert Walsh — Reason: Patient request", time: "8:51 AM", user: "Grace Osei", type: "cancel" },
  { id: 5, action: "Patient Checked In", detail: "Daniel Okafor — APT-1004 — Queue #2", time: "9:40 AM", user: "Grace Osei", type: "checkin" },
  { id: 6, action: "No Show Marked", detail: "Kevin Adeyemi — APT-1012 — 10:32 AM", time: "10:32 AM", user: "Grace Osei", type: "queue" },
  { id: 7, action: "Appointment Rescheduled", detail: "Kevin Adeyemi from Aug 13 2:30 PM → Aug 14 9:00 AM", time: "8:44 AM", user: "Grace Osei", type: "reschedule" },
  { id: 8, action: "Patient Checked In", detail: "James Thornton — APT-1002 — Room 203", time: "8:55 AM", user: "Grace Osei", type: "checkin" },
]

// ─── Utility Components ───────────────────────────────────────────────────────

function Avatar({ initials, color = "blue", size = "sm" }: { initials: string; color?: string; size?: "sm" | "md" | "lg" }) {
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

function StatusBadge({ status }: { status: AppointmentStatus | DoctorStatus | string }) {
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

function PaymentBadge({ status }: { status: PaymentStatus }) {
  return <StatusBadge status={status} />
}

function DoctorDot({ status }: { status: DoctorStatus }) {
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

function Toast({ msg, onClose }: { msg: string; onClose: () => void }) {
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

function ConfirmDialog({ msg, onConfirm, onCancel }: { msg: string; onConfirm: () => void; onCancel: () => void }) {
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

function EmptyState({ icon, title, sub }: { icon: string; title: string; sub: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <span className="text-4xl mb-3">{icon}</span>
      <p className="font-semibold text-gray-700">{title}</p>
      <p className="text-sm text-gray-400 mt-1">{sub}</p>
    </div>
  )
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

const NAV_ITEMS: { label: NavItem; icon: string }[] = [
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

function Sidebar({ active, setActive }: { active: NavItem; setActive: (n: NavItem) => void }) {
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

function Header({ active, notifCount, onNotif, onOpenSidebar }: { active: NavItem; notifCount: number; onNotif: () => void; onOpenSidebar: () => void }) {
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

// ─── Dashboard ────────────────────────────────────────────────────────────────

function StatCard({ label, value, sub, accent }: { label: string; value: number | string; sub?: string; accent?: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 animate-fade-in hover:shadow-md transition-shadow">
      <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{label}</p>
      <p className={`text-3xl font-bold mt-1 ${accent || "text-gray-900"}`}>{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  )
}

function Dashboard() {
  const stats = [
    { label: "Today's Appointments", value: 12, sub: "8 AM – 5 PM", accent: "text-blue-600" },
    { label: "Waiting Patients", value: 3, sub: "In lobby", accent: "text-amber-600" },
    { label: "Checked In", value: 5, sub: "In clinic", accent: "text-indigo-600" },
    { label: "Completed Visits", value: 2, sub: "As of now", accent: "text-emerald-600" },
    { label: "Cancelled", value: 1, sub: "Today", accent: "text-red-500" },
    { label: "Available Doctors", value: 1, sub: "Out of 4", accent: "text-teal-600" },
  ]

  const timeline = APPOINTMENTS.slice(0, 8)

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        {stats.map(s => <StatCard key={s.label} {...s} />)}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Timeline */}
        <div className="xl:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Today's Appointment Timeline</h2>
            <span className="mono text-xs text-gray-400">13 Aug 2026</span>
          </div>
          <div className="divide-y divide-gray-50">
            {timeline.map((a) => (
              <div key={a.id} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50/60 transition-colors">
                <span className="mono text-xs text-gray-400 w-16 shrink-0">{a.time}</span>
                <Avatar initials={a.avatar} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{a.patient}</p>
                  <p className="text-xs text-gray-400 truncate">{a.doctor} · {a.type}</p>
                </div>
                <StatusBadge status={a.status} />
              </div>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-4">
          {/* Live Queue */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">Live Queue</h2>
              <span className="flex items-center gap-1.5 text-xs text-emerald-600">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 pulse-dot" />
                Live
              </span>
            </div>
            <div className="divide-y divide-gray-50">
              {QUEUE.map(q => (
                <div key={q.queueNo} className="flex items-center gap-3 px-5 py-2.5">
                  <span className="mono text-xs font-bold text-blue-600 w-5">#{q.queueNo}</span>
                  <Avatar initials={q.avatar} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{q.patient}</p>
                    <p className="text-xs text-gray-400">{q.waitMins}m wait</p>
                  </div>
                  <StatusBadge status={q.status} />
                </div>
              ))}
            </div>
          </div>

          {/* Doctor availability */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-50">
              <h2 className="font-semibold text-gray-900">Doctor Availability</h2>
            </div>
            <div className="divide-y divide-gray-50">
              {DOCTORS.map(d => (
                <div key={d.name} className="flex items-center gap-3 px-5 py-2.5">
                  <DoctorDot status={d.status} />
                  <Avatar initials={d.avatar} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{d.name}</p>
                    <p className="text-xs text-gray-400 truncate">{d.specialty}</p>
                  </div>
                  <span className="text-xs text-gray-400 mono shrink-0">Q:{d.queue}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent check-ins */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-50">
          <h2 className="font-semibold text-gray-900">Recent Check-ins</h2>
        </div>
        <div className="divide-y divide-gray-50">
          {ACTIVITY.filter(a => a.type === "checkin").slice(0, 4).map(a => (
            <div key={a.id} className="flex items-center gap-3 px-5 py-3">
              <span className="text-emerald-500 text-base">✓</span>
              <div className="flex-1">
                <p className="text-sm text-gray-800">{a.detail}</p>
              </div>
              <span className="mono text-xs text-gray-400">{a.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Appointments ─────────────────────────────────────────────────────────────

function AppointmentsView({ showToast }: { showToast: (m: string) => void }) {
  const [filter, setFilter] = useState<AppointmentStatus | "All">("All")
  const [search, setSearch] = useState("")
  const [confirm, setConfirm] = useState<{ msg: string; cb: () => void } | null>(null)
  const [page, setPage] = useState(1)
  const PER_PAGE = 8

  const statuses: (AppointmentStatus | "All")[] = ["All", "Confirmed", "Checked In", "In Progress", "Completed", "Cancelled", "No Show"]
  const filtered = APPOINTMENTS.filter(a =>
    (filter === "All" || a.status === filter) &&
    (a.patient.toLowerCase().includes(search.toLowerCase()) || a.doctor.toLowerCase().includes(search.toLowerCase()) || a.id.toLowerCase().includes(search.toLowerCase()))
  )
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)
  const totalPages = Math.ceil(filtered.length / PER_PAGE)

  return (
    <div className="space-y-4 animate-fade-in">
      {confirm && <ConfirmDialog msg={confirm.msg} onConfirm={() => { confirm.cb(); setConfirm(null) }} onCancel={() => setConfirm(null)} />}

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="px-5 py-4 border-b border-gray-50 flex flex-wrap gap-3 items-center">
          <h2 className="font-semibold text-gray-900 mr-2">Appointments</h2>
          <div className="flex gap-1 flex-wrap flex-1">
            {statuses.map(s => (
              <button key={s} onClick={() => { setFilter(s); setPage(1) }}
                className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-colors ${filter === s ? "bg-blue-600 text-white border-blue-600" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
                {s}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 w-full sm:w-48">
            <span className="text-gray-400 text-xs">🔍</span>
            <input value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} placeholder="Search…" className="bg-transparent text-sm outline-none flex-1 placeholder:text-gray-400" />
          </div>
        </div>

        <div className="responsive-table">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/60 text-left">
                {["Appt ID", "Patient", "Doctor", "Time", "Type", "Room", "Payment", "Status", "Actions"].map(h => (
                  <th key={h} className="px-4 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paged.length === 0 ? (
                <tr><td colSpan={9}><EmptyState icon="📅" title="No appointments found" sub="Try adjusting your filters" /></td></tr>
              ) : paged.map(a => (
                <tr key={a.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3"><span className="mono text-xs text-blue-600">{a.id}</span></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Avatar initials={a.avatar} size="sm" />
                      <span className="text-sm font-medium text-gray-800 whitespace-nowrap">{a.patient}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">{a.doctor}</td>
                  <td className="px-4 py-3"><span className="mono text-xs text-gray-700">{a.time}</span></td>
                  <td className="px-4 py-3 text-sm text-gray-600">{a.type}</td>
                  <td className="px-4 py-3"><span className="mono text-xs text-gray-500">{a.room}</span></td>
                  <td className="px-4 py-3"><PaymentBadge status={a.payment} /></td>
                  <td className="px-4 py-3"><StatusBadge status={a.status} /></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button className="text-xs px-2 py-1 rounded border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">View</button>
                      {a.status === "Confirmed" && (
                        <button onClick={() => showToast(`${a.patient} checked in`)} className="text-xs px-2 py-1 rounded border border-indigo-200 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-colors">Check In</button>
                      )}
                      {(a.status === "Confirmed" || a.status === "Checked In") && (
                        <>
                          <button onClick={() => showToast("Reschedule dialog opened")} className="text-xs px-2 py-1 rounded border border-amber-200 text-amber-700 bg-amber-50 hover:bg-amber-100 transition-colors">Reschedule</button>
                          <button onClick={() => setConfirm({ msg: `Cancel appointment ${a.id} for ${a.patient}?`, cb: () => showToast(`${a.id} cancelled`) })}
                            className="text-xs px-2 py-1 rounded border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 transition-colors">Cancel</button>
                        </>
                      )}
                      {a.room === "—" && a.status !== "Cancelled" && a.status !== "No Show" && (
                        <button onClick={() => showToast(`Room assigned to ${a.patient}`)} className="text-xs px-2 py-1 rounded border border-teal-200 text-teal-700 bg-teal-50 hover:bg-teal-100 transition-colors">Room</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="px-5 py-3 border-t border-gray-50 flex items-center justify-between">
            <span className="text-xs text-gray-400 mono">{filtered.length} results</span>
            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => (
                <button key={i} onClick={() => setPage(i + 1)}
                  className={`w-7 h-7 text-xs rounded-md transition-colors ${page === i + 1 ? "bg-blue-600 text-white" : "border border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Patient Check-In ─────────────────────────────────────────────────────────

function CheckInView({ showToast }: { showToast: (m: string) => void }) {
  const [step, setStep] = useState(0)
  const [selected, setSelected] = useState<Appointment | null>(null)
  const [queueNum, setQueueNum] = useState<number | null>(null)
  const [room, setRoom] = useState("")
  const [search, setSearch] = useState("")

  const pending = APPOINTMENTS.filter(a => a.status === "Confirmed" &&
    (a.patient.toLowerCase().includes(search.toLowerCase()) || a.id.toLowerCase().includes(search.toLowerCase())))

  const steps = ["Find Appointment", "Verify Patient", "Confirm Details", "Assign Queue", "Assign Room", "Complete"]

  const reset = () => { setStep(0); setSelected(null); setQueueNum(null); setRoom("") }

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Steps */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center gap-0">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-0 flex-1 min-w-0">
              <div className="flex flex-col items-center min-w-0">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${i < step ? "bg-emerald-500 text-white" : i === step ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-400"}`}>
                  {i < step ? "✓" : i + 1}
                </div>
                <span className={`text-[10px] mt-1 text-center hidden sm:block truncate max-w-16 ${i === step ? "text-blue-600 font-semibold" : "text-gray-400"}`}>{s}</span>
              </div>
              {i < steps.length - 1 && <div className={`flex-1 h-0.5 mx-1 mb-4 ${i < step ? "bg-emerald-400" : "bg-gray-200"}`} />}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        {step === 0 && (
          <div className="space-y-4">
            <h2 className="font-semibold text-gray-900">Find Patient Appointment</h2>
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 max-w-sm">
              <span className="text-gray-400">🔍</span>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or appointment ID…" className="bg-transparent text-sm outline-none flex-1 placeholder:text-gray-400" />
            </div>
            {search && pending.length === 0 && <EmptyState icon="🔍" title="No matching appointments" sub="Check the name or appointment ID" />}
            <div className="space-y-2">
              {pending.map(a => (
                <button key={a.id} onClick={() => { setSelected(a); setStep(1) }}
                  className="w-full flex items-center gap-4 border border-gray-200 rounded-xl p-4 hover:border-blue-300 hover:bg-blue-50/30 transition-colors text-left">
                  <Avatar initials={a.avatar} size="md" />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{a.patient}</p>
                    <p className="text-sm text-gray-500">{a.doctor} · {a.type} · {a.time}</p>
                  </div>
                  <div>
                    <span className="mono text-xs text-blue-600">{a.id}</span>
                    <PaymentBadge status={a.payment} />
                  </div>
                  <span className="text-blue-500">›</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 1 && selected && (
          <div className="space-y-4 max-w-lg">
            <h2 className="font-semibold text-gray-900">Verify Patient Identity</h2>
            <div className="flex items-center gap-4 bg-blue-50 rounded-xl p-4 border border-blue-100">
              <Avatar initials={selected.avatar} size="lg" />
              <div>
                <p className="font-bold text-gray-900 text-lg">{selected.patient}</p>
                <p className="text-sm text-gray-500">{selected.doctor}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[["Appointment ID", selected.id], ["Date", "Aug 13, 2026"], ["Time", selected.time], ["Type", selected.type], ["Payment", selected.payment]].map(([k, v]) => (
                <div key={k} className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-400">{k}</p>
                  <p className="text-sm font-medium text-gray-800 mt-0.5">{v}</p>
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-500">Please ask the patient to confirm their name and date of birth before proceeding.</p>
            <div className="flex gap-3">
              <button onClick={reset} className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-50">Back</button>
              <button onClick={() => setStep(2)} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">Identity Confirmed →</button>
            </div>
          </div>
        )}

        {step === 2 && selected && (
          <div className="space-y-4 max-w-lg">
            <h2 className="font-semibold text-gray-900">Confirm Appointment Details</h2>
            <div className="space-y-2">
              {[
                ["Patient Name", selected.patient],
                ["Appointment ID", selected.id],
                ["Doctor", selected.doctor],
                ["Appointment Time", selected.time],
                ["Appointment Type", selected.type],
                ["Payment Status", selected.payment],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between items-center py-2 border-b border-gray-50">
                  <span className="text-sm text-gray-500">{k}</span>
                  <span className="text-sm font-medium text-gray-900">{v}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-50">Back</button>
              <button onClick={() => setStep(3)} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">Details Confirmed →</button>
            </div>
          </div>
        )}

        {step === 3 && selected && (
          <div className="space-y-4 max-w-md">
            <h2 className="font-semibold text-gray-900">Assign Queue Number</h2>
            <p className="text-sm text-gray-500">The next available queue number will be assigned to this patient.</p>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-8 text-center">
              <p className="text-xs text-blue-500 uppercase tracking-widest font-semibold mb-2">Queue Number</p>
              <p className="text-7xl font-bold text-blue-600 mono">{queueNum || "—"}</p>
              {!queueNum && <p className="text-xs text-gray-400 mt-3">Click Assign to generate queue number</p>}
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(2)} className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-50">Back</button>
              {!queueNum ? (
                <button onClick={() => setQueueNum(QUEUE.length + 1)} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">Assign Queue #{QUEUE.length + 1}</button>
              ) : (
                <button onClick={() => setStep(4)} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">Next →</button>
              )}
            </div>
          </div>
        )}

        {step === 4 && selected && (
          <div className="space-y-4 max-w-md">
            <h2 className="font-semibold text-gray-900">Assign Room</h2>
            <p className="text-sm text-gray-500">Select an available room for the patient.</p>
            <div className="grid grid-cols-3 gap-2">
              {["101", "102", "201", "203", "301", "305"].map(r => (
                <button key={r} onClick={() => setRoom(r)}
                  className={`py-3 rounded-xl border-2 text-sm font-semibold transition-colors ${room === r ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-200 text-gray-600 hover:border-blue-200 hover:bg-blue-50/30"}`}>
                  Room {r}
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(3)} className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-50">Back</button>
              <button disabled={!room} onClick={() => setStep(5)} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed">
                {room ? `Assign Room ${room} →` : "Select a Room"}
              </button>
            </div>
          </div>
        )}

        {step === 5 && selected && (
          <div className="space-y-4 max-w-md text-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-3xl mx-auto">✅</div>
            <h2 className="font-bold text-gray-900 text-xl">Check-In Complete!</h2>
            <p className="text-gray-500">{selected.patient} has been successfully checked in.</p>
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-left space-y-2">
              {[
                ["Patient", selected.patient],
                ["Doctor", selected.doctor],
                ["Queue Number", `#${queueNum}`],
                ["Room", `Room ${room}`],
                ["Check-In Time", new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between text-sm">
                  <span className="text-gray-500">{k}</span>
                  <span className="font-semibold text-gray-800">{v}</span>
                </div>
              ))}
            </div>
            <button onClick={() => { showToast(`${selected.patient} checked in successfully`); reset() }} className="px-6 py-2.5 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors">
              Done — Next Patient
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Patient Queue ─────────────────────────────────────────────────────────────

function QueueView({ showToast }: { showToast: (m: string) => void }) {
  const [queue, setQueue] = useState(QUEUE)
  const [confirm, setConfirm] = useState<{ msg: string; cb: () => void } | null>(null)

  const callPatient = (q: QueueEntry) => {
    setQueue(prev => prev.map(e => e.queueNo === q.queueNo ? { ...e, status: "Called" } : e))
    showToast(`Calling patient ${q.patient} — Queue #${q.queueNo}`)
  }

  const noShow = (q: QueueEntry) => {
    setConfirm({ msg: `Mark ${q.patient} as No Show?`, cb: () => {
      setQueue(prev => prev.map(e => e.queueNo === q.queueNo ? { ...e, status: "No Show" } : e))
      showToast(`${q.patient} marked as No Show`)
    }})
  }

  const complete = (q: QueueEntry) => {
    setQueue(prev => prev.filter(e => e.queueNo !== q.queueNo))
    showToast(`${q.patient} check-in complete`)
  }

  const activeQ = queue.filter(q => q.status !== "No Show")
  const noShows = queue.filter(q => q.status === "No Show")

  return (
    <div className="space-y-4 animate-fade-in">
      {confirm && <ConfirmDialog msg={confirm.msg} onConfirm={() => { confirm.cb(); setConfirm(null) }} onCancel={() => setConfirm(null)} />}

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-50 flex items-center gap-3">
          <h2 className="font-semibold text-gray-900 flex-1">Patient Queue</h2>
          <span className="flex items-center gap-1.5 text-xs text-emerald-600">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 pulse-dot" />
            Real-time
          </span>
          <span className="mono text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">{activeQ.length} active</span>
        </div>

        <div className="responsive-table">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/60 text-left">
                {["Queue #", "Patient", "Doctor", "Appt Time", "Waiting", "Status", "Actions"].map(h => (
                  <th key={h} className="px-4 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {activeQ.length === 0 && (
                <tr><td colSpan={7}><EmptyState icon="✅" title="Queue is clear" sub="All patients have been seen" /></td></tr>
              )}
              {activeQ.map(q => (
                <tr key={q.queueNo} className={`hover:bg-gray-50/50 transition-colors ${q.status === "In Room" ? "bg-emerald-50/30" : ""}`}>
                  <td className="px-4 py-3">
                    <span className="mono text-lg font-bold text-blue-600">#{q.queueNo}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Avatar initials={q.avatar} size="sm" />
                      <span className="text-sm font-medium text-gray-800">{q.patient}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{q.doctor}</td>
                  <td className="px-4 py-3"><span className="mono text-xs text-gray-700">{q.apptTime}</span></td>
                  <td className="px-4 py-3">
                    <span className={`mono text-xs font-semibold ${q.waitMins > 10 ? "text-red-500" : q.waitMins > 5 ? "text-amber-600" : "text-emerald-600"}`}>
                      {q.waitMins}m
                    </span>
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={q.status} /></td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1 flex-wrap">
                      {q.status === "Waiting" && (
                        <button onClick={() => callPatient(q)} className="text-xs px-2 py-1 rounded border border-blue-200 text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors">Call</button>
                      )}
                      <button onClick={() => showToast(`Room assigned to ${q.patient}`)} className="text-xs px-2 py-1 rounded border border-teal-200 text-teal-700 bg-teal-50 hover:bg-teal-100 transition-colors">Room</button>
                      <button onClick={() => noShow(q)} className="text-xs px-2 py-1 rounded border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">No Show</button>
                      {(q.status === "Called" || q.status === "In Room") && (
                        <button onClick={() => complete(q)} className="text-xs px-2 py-1 rounded border border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors">Complete</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {noShows.map(q => (
                <tr key={q.queueNo} className="opacity-50">
                  <td className="px-4 py-3"><span className="mono text-lg font-bold text-gray-400">#{q.queueNo}</span></td>
                  <td className="px-4 py-3 text-sm text-gray-400 line-through">{q.patient}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">{q.doctor}</td>
                  <td className="px-4 py-3"><span className="mono text-xs text-gray-400">{q.apptTime}</span></td>
                  <td className="px-4 py-3" />
                  <td className="px-4 py-3"><StatusBadge status="No Show" /></td>
                  <td className="px-4 py-3" />
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// ─── Patients ─────────────────────────────────────────────────────────────────

function PatientsView() {
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const PER_PAGE = 8
  const filtered = PATIENTS.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.phone.includes(search) ||
    p.doctor.toLowerCase().includes(search.toLowerCase())
  )
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)
  const totalPages = Math.ceil(filtered.length / PER_PAGE)

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-50 flex items-center gap-3">
          <h2 className="font-semibold text-gray-900 flex-1">Patients — Riverside Clinic</h2>
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 w-full sm:w-48">
            <span className="text-gray-400 text-xs">🔍</span>
            <input value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} placeholder="Search patients…" className="bg-transparent text-sm outline-none flex-1 placeholder:text-gray-400" />
          </div>
        </div>

        <div className="responsive-table">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/60 text-left">
                {["Patient", "Phone", "Doctor", "Visits", "Last Visit", "Actions"].map(h => (
                  <th key={h} className="px-4 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paged.length === 0 ? (
                <tr><td colSpan={6}><EmptyState icon="👤" title="No patients found" sub="Try a different search" /></td></tr>
              ) : paged.map(p => (
                <tr key={p.name} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <Avatar initials={p.avatar} size="sm" />
                      <span className="text-sm font-medium text-gray-800">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3"><span className="mono text-xs text-gray-600">{p.phone}</span></td>
                  <td className="px-4 py-3 text-sm text-gray-600">{p.doctor}</td>
                  <td className="px-4 py-3"><span className="mono text-sm font-semibold text-gray-800">{p.visits}</span></td>
                  <td className="px-4 py-3 text-sm text-gray-500">{p.lastVisit}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button className="text-xs px-2 py-1 rounded border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">Profile</button>
                      <button className="text-xs px-2 py-1 rounded border border-blue-200 text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors">Appointments</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="px-5 py-3 border-t border-gray-50 flex items-center justify-between">
            <span className="text-xs text-gray-400 mono">{filtered.length} patients</span>
            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => (
                <button key={i} onClick={() => setPage(i + 1)}
                  className={`w-7 h-7 text-xs rounded-md transition-colors ${page === i + 1 ? "bg-blue-600 text-white" : "border border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-3 flex items-center gap-3">
        <span className="text-amber-500">🔒</span>
        <p className="text-sm text-amber-700">Only patients associated with Riverside Clinic appointments are shown. Detailed medical records are restricted to clinical staff.</p>
      </div>
    </div>
  )
}

// ─── Doctors ──────────────────────────────────────────────────────────────────

function DoctorsView() {
  const doctorSchedule: Record<string, { time: string; patient: string; type: string }[]> = {
    "Dr. Amir Patel": [
      { time: "08:30 AM", patient: "Sarah Mitchell", type: "General" },
      { time: "09:30 AM", patient: "Maria Santos", type: "Consultation" },
      { time: "11:30 AM", patient: "Priya Nair", type: "Consultation" },
      { time: "02:30 PM", patient: "Kevin Adeyemi", type: "Consultation" },
    ],
    "Dr. Linda Cho": [
      { time: "09:00 AM", patient: "James Thornton", type: "Follow-Up" },
      { time: "10:30 AM", patient: "Elena Vasquez", type: "General" },
      { time: "01:00 PM", patient: "Aisha Kamara", type: "General" },
    ],
    "Dr. Raj Mehta": [
      { time: "10:00 AM", patient: "Daniel Okafor", type: "Check-Up" },
      { time: "11:00 AM", patient: "Thomas Kim", type: "Follow-Up" },
      { time: "01:30 PM", patient: "Nathan Brooks", type: "Follow-Up" },
    ],
    "Dr. Sarah Quinn": [
      { time: "12:00 PM", patient: "Robert Walsh", type: "Procedure" },
      { time: "02:00 PM", patient: "Claire Dupont", type: "Check-Up" },
    ],
  }

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {DOCTORS.map(d => (
          <div key={d.name} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-5 border-b border-gray-50">
              <div className="flex items-center gap-4">
                <Avatar initials={d.avatar} size="lg" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900">{d.name}</h3>
                    <DoctorDot status={d.status} />
                  </div>
                  <p className="text-sm text-gray-400">{d.specialty}</p>
                </div>
                <StatusBadge status={d.status} />
              </div>
              <div className="grid grid-cols-3 gap-3 mt-4">
                {[
                  ["Room", d.room],
                  ["Queue", `${d.queue} waiting`],
                  ["Next", d.nextAppt],
                ].map(([k, v]) => (
                  <div key={k} className="bg-gray-50 rounded-lg px-3 py-2">
                    <p className="text-[10px] text-gray-400 uppercase tracking-wide">{k}</p>
                    <p className="text-sm font-semibold text-gray-800 mono mt-0.5">{v}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="px-5 py-3">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Today's Schedule</p>
              <div className="space-y-1.5">
                {(doctorSchedule[d.name] || []).map(s => (
                  <div key={s.time} className="flex items-center gap-3">
                    <span className="mono text-[11px] text-gray-400 w-16">{s.time}</span>
                    <span className="text-xs text-gray-700">{s.patient}</span>
                    <span className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded ml-auto">{s.type}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Schedule ─────────────────────────────────────────────────────────────────

function ScheduleView({ showToast }: { showToast: (m: string) => void }) {
  const hours = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"]
  const colors = ["bg-blue-100 border-blue-300 text-blue-800", "bg-purple-100 border-purple-300 text-purple-800", "bg-indigo-100 border-indigo-300 text-indigo-800", "bg-teal-100 border-teal-300 text-teal-800"]

  const doctorSlots: Record<string, { hour: string; patient: string; type: string }[]> = {
    "Dr. Patel": [
      { hour: "08:00", patient: "S. Mitchell", type: "General" },
      { hour: "09:00", patient: "M. Santos", type: "Consult" },
      { hour: "11:00", patient: "P. Nair", type: "Consult" },
      { hour: "14:00", patient: "K. Adeyemi", type: "Consult" },
    ],
    "Dr. Cho": [
      { hour: "09:00", patient: "J. Thornton", type: "Follow-Up" },
      { hour: "10:00", patient: "E. Vasquez", type: "General" },
      { hour: "13:00", patient: "A. Kamara", type: "General" },
    ],
    "Dr. Mehta": [
      { hour: "10:00", patient: "D. Okafor", type: "Check-Up" },
      { hour: "11:00", patient: "T. Kim", type: "Follow-Up" },
      { hour: "13:00", patient: "N. Brooks", type: "Follow-Up" },
    ],
    "Dr. Quinn": [
      { hour: "12:00", patient: "R. Walsh", type: "Procedure" },
      { hour: "14:00", patient: "C. Dupont", type: "Check-Up" },
    ],
  }

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Doctor Schedules — August 13, 2026</h2>
          <button onClick={() => showToast("New appointment slot opened")} className="text-sm bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors">
            + Schedule Appointment
          </button>
        </div>

        <div className="responsive-table">
          <div className="min-w-[700px]">
            <div className="grid gap-0" style={{ gridTemplateColumns: "80px repeat(4, 1fr)" }}>
              {/* Header */}
              <div className="bg-gray-50/60 px-2 py-3 border-b border-r border-gray-100" />
              {Object.keys(doctorSlots).map((d, i) => (
                <div key={d} className="bg-gray-50/60 px-3 py-3 border-b border-r border-gray-100 last:border-r-0">
                  <p className="text-xs font-semibold text-gray-700">{d}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{["Gen. Practice", "Int. Medicine", "Cardiology", "Pediatrics"][i]}</p>
                </div>
              ))}

              {hours.map(hour => (
                <div key={hour} className="contents">
                  <div className="px-2 py-4 border-b border-r border-gray-50 flex items-start">
                    <span className="mono text-[11px] text-gray-400">{hour}</span>
                  </div>
                  {Object.entries(doctorSlots).map(([doc, slots], di) => {
                    const slot = slots.find(s => s.hour === hour)
                    const isBreak = doc === "Dr. Quinn" && hour === "12:00"
                    return (
                      <div key={doc} className="px-2 py-2 border-b border-r border-gray-50 last:border-r-0 min-h-[52px]">
                        {slot ? (
                          <div className={`text-[11px] px-2 py-1.5 rounded border ${colors[di]} font-medium leading-tight`}>
                            <p className="truncate">{slot.patient}</p>
                            <p className="opacity-70 mt-0.5">{slot.type}</p>
                          </div>
                        ) : isBreak ? (
                          <div className="text-[11px] px-2 py-1.5 rounded bg-orange-50 border border-orange-200 text-orange-600">
                            Break
                          </div>
                        ) : (
                          <button onClick={() => showToast("Slot selected for booking")} className="w-full h-full min-h-[38px] rounded border-2 border-dashed border-gray-100 hover:border-blue-300 hover:bg-blue-50/30 transition-colors text-[10px] text-gray-300 hover:text-blue-400">
                            + Book
                          </button>
                        )}
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Room availability */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <h3 className="font-semibold text-gray-900 mb-3">Room Availability</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
          {[
            { room: "101", status: "In Use", doc: "Dr. Patel" },
            { room: "102", status: "Available", doc: "" },
            { room: "201", status: "Available", doc: "" },
            { room: "203", status: "In Use", doc: "Dr. Cho" },
            { room: "301", status: "Available", doc: "" },
            { room: "305", status: "In Use", doc: "Dr. Mehta" },
          ].map(r => (
            <div key={r.room} className={`rounded-xl border px-4 py-3 text-center ${r.status === "In Use" ? "bg-amber-50 border-amber-200" : "bg-emerald-50 border-emerald-200"}`}>
              <p className="mono font-bold text-lg text-gray-800">R{r.room}</p>
              <p className={`text-xs font-semibold mt-1 ${r.status === "In Use" ? "text-amber-700" : "text-emerald-700"}`}>{r.status}</p>
              {r.doc && <p className="text-[10px] text-gray-400 mt-0.5">{r.doc}</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Notifications ────────────────────────────────────────────────────────────

function NotificationsView() {
  const [notifs, setNotifs] = useState(NOTIFICATIONS)
  const markAll = () => setNotifs(prev => prev.map(n => ({ ...n, read: true })))
  const markOne = (id: number) => setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))

  const iconMap: Record<string, string> = {
    appointment: "📅", cancel: "❌", reschedule: "🔄", doctor: "🩺", checkin: "✅", schedule: "🗓"
  }

  const unread = notifs.filter(n => !n.read).length

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="font-semibold text-gray-900">Notifications</h2>
            {unread > 0 && (
              <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{unread}</span>
            )}
          </div>
          <button onClick={markAll} className="text-sm text-blue-600 hover:underline">Mark all read</button>
        </div>

        <div className="divide-y divide-gray-50">
          {notifs.length === 0 && <EmptyState icon="🔔" title="All caught up!" sub="No new notifications" />}
          {notifs.map(n => (
            <div key={n.id} onClick={() => markOne(n.id)}
              className={`flex gap-4 px-5 py-4 cursor-pointer transition-colors ${n.read ? "hover:bg-gray-50/60" : "bg-blue-50/40 hover:bg-blue-50/60"}`}>
              <span className="text-xl shrink-0">{iconMap[n.type]}</span>
              <div className="flex-1 min-w-0">
                <p className={`text-sm ${n.read ? "text-gray-600" : "text-gray-900 font-medium"}`}>{n.message}</p>
                <p className="mono text-[11px] text-gray-400 mt-0.5">{n.time}</p>
              </div>
              {!n.read && <span className="w-2 h-2 bg-blue-500 rounded-full shrink-0 mt-1.5" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Activity ─────────────────────────────────────────────────────────────────

function ActivityView() {
  const [filter, setFilter] = useState<string>("All")
  const types = ["All", "checkin", "cancel", "reschedule", "room", "queue", "appointment"]
  const icons: Record<string, string> = {
    checkin: "✅", cancel: "❌", reschedule: "🔄", room: "🚪", queue: "🔢", appointment: "📅"
  }
  const colors: Record<string, string> = {
    checkin: "bg-emerald-100 text-emerald-700",
    cancel: "bg-red-100 text-red-600",
    reschedule: "bg-amber-100 text-amber-700",
    room: "bg-blue-100 text-blue-700",
    queue: "bg-indigo-100 text-indigo-700",
    appointment: "bg-purple-100 text-purple-700",
  }
  const filtered = ACTIVITY.filter(a => filter === "All" || a.type === filter)

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-50 flex flex-wrap gap-2 items-center">
          <h2 className="font-semibold text-gray-900 mr-2">Receptionist Activity Log</h2>
          <div className="flex gap-1 flex-wrap">
            {types.map(t => (
              <button key={t} onClick={() => setFilter(t)}
                className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-colors capitalize ${filter === t ? "bg-blue-600 text-white border-blue-600" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
                {t === "All" ? "All" : t}
              </button>
            ))}
          </div>
        </div>

        <div className="divide-y divide-gray-50">
          {filtered.length === 0 && <EmptyState icon="📋" title="No activity found" sub="Actions will appear here as they occur" />}
          {filtered.map(a => (
            <div key={a.id} className="flex gap-4 px-5 py-3.5 hover:bg-gray-50/50 transition-colors">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-base shrink-0 ${colors[a.type]}`}>
                {icons[a.type]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800">{a.action}</p>
                <p className="text-xs text-gray-500 mt-0.5">{a.detail}</p>
                <p className="text-[11px] text-gray-400 mt-1">by {a.user}</p>
              </div>
              <span className="mono text-xs text-gray-400 shrink-0">{a.time}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl px-5 py-3 flex items-center gap-3">
        <span className="text-blue-500">🔒</span>
        <p className="text-sm text-blue-700">Activity log is scoped to Grace Osei — Riverside Clinic. Administrative and platform-level actions are not visible here.</p>
      </div>
    </div>
  )
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [active, setActive] = useState<NavItem>("Dashboard")
  const [toast, setToast] = useState<string | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const unreadNotifs = NOTIFICATIONS.filter(n => !n.read).length

  const showToast = (msg: string) => setToast(msg)

  const renderView = () => {
    switch (active) {
      case "Dashboard": return <Dashboard />
      case "Appointments": return <AppointmentsView showToast={showToast} />
      case "Patient Check-In": return <CheckInView showToast={showToast} />
      case "Patient Queue": return <QueueView showToast={showToast} />
      case "Patients": return <PatientsView />
      case "Doctors": return <DoctorsView />
      case "Schedule": return <ScheduleView showToast={showToast} />
      case "Notifications": return <NotificationsView />
      case "Activity": return <ActivityView />
    }
  }

  return (
    <div className="app-shell-height flex overflow-hidden bg-[#f0f4f8]">
      {sidebarOpen && <div className="fixed inset-0 z-30 bg-black/45 lg:hidden" onClick={() => setSidebarOpen(false)} />}
      <div className={`fixed inset-y-0 left-0 z-40 transition-transform duration-200 lg:relative lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <Sidebar active={active} setActive={(next) => { setActive(next); setSidebarOpen(false) }} />
      </div>
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header active={active} notifCount={unreadNotifs} onNotif={() => setActive("Notifications")} onOpenSidebar={() => setSidebarOpen(true)} />
        <main className="dashboard-content flex-1 overflow-y-auto">
          {renderView()}
        </main>
      </div>
      {toast && <Toast msg={toast} onClose={() => setToast(null)} />}
    </div>
  )
}
