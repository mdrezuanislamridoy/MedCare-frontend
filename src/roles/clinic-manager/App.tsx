import { useState, useEffect, type ReactNode } from "react"

// ─── Types ────────────────────────────────────────────────────────────────────

type NavItem =
  | "dashboard" | "clinic-profile" | "doctors" | "staff" | "schedule"
  | "appointments" | "patients" | "patient-queue" | "rooms" | "payments"
  | "reports" | "notifications" | "activity"

type ApptStatus = "Pending" | "Confirmed" | "Checked In" | "In Progress" | "Completed" | "Cancelled" | "No Show"
type QueueStatus = "Waiting" | "Checked In" | "In Consultation" | "Completed" | "No Show"
type RoomStatus = "Available" | "Occupied" | "Reserved" | "Maintenance"
type StaffStatus = "Active" | "Inactive"
type DoctorStatus = "Active" | "On Leave" | "Inactive"

// ─── Mock Data ────────────────────────────────────────────────────────────────

const DOCTORS = [
  { id: "D001", name: "Dr. Sarah Mitchell", specialty: "Cardiology", experience: "14 yrs", schedule: "Mon-Fri, 9am-5pm", appointments: 8, status: "Active" as DoctorStatus, avatar: "SM", color: "#1E40AF" },
  { id: "D002", name: "Dr. James Okafor", specialty: "General Practice", experience: "9 yrs", schedule: "Mon-Sat, 8am-4pm", appointments: 12, status: "Active" as DoctorStatus, avatar: "JO", color: "#065F46" },
  { id: "D003", name: "Dr. Priya Nair", specialty: "Pediatrics", experience: "7 yrs", schedule: "Tue-Sat, 10am-6pm", appointments: 5, status: "Active" as DoctorStatus, avatar: "PN", color: "#7C3AED" },
  { id: "D004", name: "Dr. Elena Torres", specialty: "Dermatology", experience: "11 yrs", schedule: "Mon-Thu, 9am-3pm", appointments: 0, status: "On Leave" as DoctorStatus, avatar: "ET", color: "#B45309" },
  { id: "D005", name: "Dr. Marcus Webb", specialty: "Orthopedics", experience: "16 yrs", schedule: "Wed-Fri, 11am-7pm", appointments: 6, status: "Active" as DoctorStatus, avatar: "MW", color: "#DC2626" },
]

const STAFF = [
  { id: "S001", name: "Angela Brooks", role: "Receptionist", email: "angela.brooks@greenpine.health", phone: "+1 (555) 201-4432", status: "Active" as StaffStatus, permissions: ["Appointments", "Check-in", "Payments"], lastActive: "Today, 10:22 AM" },
  { id: "S002", name: "Kevin Flores", role: "Receptionist", email: "kevin.flores@greenpine.health", phone: "+1 (555) 201-7831", status: "Active" as StaffStatus, permissions: ["Appointments", "Check-in"], lastActive: "Today, 9:45 AM" },
  { id: "S003", name: "Maria Santos", role: "Support Staff", email: "maria.santos@greenpine.health", phone: "+1 (555) 201-3310", status: "Active" as StaffStatus, permissions: ["Rooms", "Scheduling"], lastActive: "Today, 11:05 AM" },
  { id: "S004", name: "David Kim", role: "Support Staff", email: "david.kim@greenpine.health", phone: "+1 (555) 201-9902", status: "Inactive" as StaffStatus, permissions: ["Rooms"], lastActive: "Aug 10, 2026" },
]

const APPOINTMENTS = [
  { id: "APT-1041", patient: "Robert Chen", doctor: "Dr. Sarah Mitchell", date: "Aug 13, 2026", time: "09:00 AM", room: "Room 2", type: "Follow-up", payStatus: "Paid", status: "Completed" as ApptStatus },
  { id: "APT-1042", patient: "Linda Park", doctor: "Dr. James Okafor", date: "Aug 13, 2026", time: "09:30 AM", room: "Room 4", type: "Consultation", payStatus: "Paid", status: "Completed" as ApptStatus },
  { id: "APT-1043", patient: "Oscar Ruiz", doctor: "Dr. Priya Nair", date: "Aug 13, 2026", time: "10:00 AM", room: "Room 1", type: "Pediatric Check", payStatus: "Paid", status: "In Progress" as ApptStatus },
  { id: "APT-1044", patient: "Hannah Scott", doctor: "Dr. Marcus Webb", date: "Aug 13, 2026", time: "10:30 AM", room: "Room 3", type: "Consultation", payStatus: "Unpaid", status: "Checked In" as ApptStatus },
  { id: "APT-1045", patient: "Tom Bradley", doctor: "Dr. Sarah Mitchell", date: "Aug 13, 2026", time: "11:00 AM", room: "Room 2", type: "Follow-up", payStatus: "Unpaid", status: "Confirmed" as ApptStatus },
  { id: "APT-1046", patient: "Nadia Coleman", doctor: "Dr. James Okafor", date: "Aug 13, 2026", time: "11:30 AM", room: "Room 4", type: "New Patient", payStatus: "Unpaid", status: "Pending" as ApptStatus },
  { id: "APT-1047", patient: "Eric Walsh", doctor: "Dr. Priya Nair", date: "Aug 13, 2026", time: "12:00 PM", room: "—", type: "Pediatric Check", payStatus: "Unpaid", status: "Pending" as ApptStatus },
  { id: "APT-1048", patient: "Grace Huang", doctor: "Dr. Marcus Webb", date: "Aug 13, 2026", time: "09:00 AM", room: "Room 3", type: "Consultation", payStatus: "Refunded", status: "Cancelled" as ApptStatus },
]

const PATIENTS = [
  { id: "P001", name: "Robert Chen", doctor: "Dr. Sarah Mitchell", lastVisit: "Aug 6, 2026", nextAppt: "Aug 20, 2026", status: "Active" },
  { id: "P002", name: "Linda Park", doctor: "Dr. James Okafor", lastVisit: "Aug 13, 2026", nextAppt: "Sep 3, 2026", status: "Active" },
  { id: "P003", name: "Oscar Ruiz", doctor: "Dr. Priya Nair", lastVisit: "Jul 22, 2026", nextAppt: "Aug 13, 2026", status: "Active" },
  { id: "P004", name: "Hannah Scott", doctor: "Dr. Marcus Webb", lastVisit: "Jul 30, 2026", nextAppt: "Aug 13, 2026", status: "Active" },
  { id: "P005", name: "Tom Bradley", doctor: "Dr. Sarah Mitchell", lastVisit: "Aug 1, 2026", nextAppt: "Aug 13, 2026", status: "Active" },
  { id: "P006", name: "Grace Huang", doctor: "Dr. Marcus Webb", lastVisit: "Aug 13, 2026", nextAppt: "—", status: "Inactive" },
  { id: "P007", name: "Nadia Coleman", doctor: "Dr. James Okafor", lastVisit: "—", nextAppt: "Aug 13, 2026", status: "New" },
]

const QUEUE = [
  { q: 1, patient: "Oscar Ruiz", doctor: "Dr. Priya Nair", time: "10:00 AM", waiting: "18 min", status: "In Consultation" as QueueStatus },
  { q: 2, patient: "Hannah Scott", doctor: "Dr. Marcus Webb", time: "10:30 AM", waiting: "12 min", status: "Checked In" as QueueStatus },
  { q: 3, patient: "Tom Bradley", doctor: "Dr. Sarah Mitchell", time: "11:00 AM", waiting: "—", status: "Waiting" as QueueStatus },
  { q: 4, patient: "Nadia Coleman", doctor: "Dr. James Okafor", time: "11:30 AM", waiting: "—", status: "Waiting" as QueueStatus },
  { q: 5, patient: "Eric Walsh", doctor: "Dr. Priya Nair", time: "12:00 PM", waiting: "—", status: "Waiting" as QueueStatus },
  { q: 6, patient: "Robert Chen", doctor: "Dr. Sarah Mitchell", time: "09:00 AM", waiting: "—", status: "Completed" as QueueStatus },
]

const ROOMS = [
  { id: "R1", name: "Room 1", doctor: "Dr. Priya Nair", patient: "Oscar Ruiz", status: "Occupied" as RoomStatus, type: "Consultation" },
  { id: "R2", name: "Room 2", doctor: "Dr. Sarah Mitchell", patient: "—", status: "Reserved" as RoomStatus, type: "Consultation" },
  { id: "R3", name: "Room 3", doctor: "Dr. Marcus Webb", patient: "Hannah Scott", status: "Occupied" as RoomStatus, type: "Consultation" },
  { id: "R4", name: "Room 4", doctor: "Dr. James Okafor", patient: "—", status: "Available" as RoomStatus, type: "Consultation" },
  { id: "R5", name: "Room 5", doctor: "—", patient: "—", status: "Maintenance" as RoomStatus, type: "Procedure" },
  { id: "R6", name: "Room 6", doctor: "—", patient: "—", status: "Available" as RoomStatus, type: "Consultation" },
]

const NOTIFICATIONS = [
  { id: 1, type: "new-appt", title: "New Appointment", message: "Nadia Coleman booked a consultation with Dr. James Okafor for 11:30 AM.", time: "10 min ago", read: false },
  { id: 2, type: "checkin", title: "Patient Checked In", message: "Hannah Scott has checked in for her 10:30 AM appointment with Dr. Marcus Webb.", time: "22 min ago", read: false },
  { id: 3, type: "cancel", title: "Appointment Cancelled", message: "Grace Huang cancelled APT-1048 with Dr. Marcus Webb. Refund initiated.", time: "1 hr ago", read: false },
  { id: 4, type: "leave", title: "Doctor Leave Request", message: "Dr. Elena Torres has requested leave from Aug 14–18. Pending approval.", time: "2 hrs ago", read: true },
  { id: 5, type: "schedule", title: "Schedule Change", message: "Dr. James Okafor updated working hours for next week (Mon–Fri, 9am–5pm).", time: "3 hrs ago", read: true },
  { id: 6, type: "staff", title: "Staff Update", message: "David Kim's account has been deactivated by manager.", time: "Yesterday", read: true },
]

const ACTIVITY = [
  { id: 1, action: "Appointment Rescheduled", detail: "APT-1039 moved from Aug 12 to Aug 13 by Angela Brooks", time: "10:05 AM", user: "Angela Brooks", type: "appointment" },
  { id: 2, action: "Room Assigned", detail: "Room 3 assigned to Dr. Marcus Webb for APT-1044", time: "10:02 AM", user: "Kevin Flores", type: "room" },
  { id: 3, action: "Patient Checked In", detail: "Hannah Scott checked in for APT-1044", time: "09:58 AM", user: "Kevin Flores", type: "checkin" },
  { id: 4, action: "Schedule Updated", detail: "Dr. James Okafor's consultation slots modified for Aug 15", time: "09:30 AM", user: "Manager", type: "schedule" },
  { id: 5, action: "Appointment Cancelled", detail: "APT-1048 cancelled — Grace Huang. Refund processed.", time: "08:55 AM", user: "Angela Brooks", type: "cancel" },
  { id: 6, action: "Staff Deactivated", detail: "David Kim's account deactivated", time: "Yesterday 4:30 PM", user: "Manager", type: "staff" },
  { id: 7, action: "Room Maintenance", detail: "Room 5 set to Maintenance by Maria Santos", time: "Yesterday 2:10 PM", user: "Maria Santos", type: "room" },
]

const PAYMENTS = [
  { id: "PAY-0891", patient: "Robert Chen", doctor: "Dr. Sarah Mitchell", amount: "$120", type: "Consultation", date: "Aug 13, 2026", status: "Paid" },
  { id: "PAY-0892", patient: "Linda Park", doctor: "Dr. James Okafor", amount: "$95", type: "Follow-up", date: "Aug 13, 2026", status: "Paid" },
  { id: "PAY-0893", patient: "Oscar Ruiz", doctor: "Dr. Priya Nair", amount: "$110", type: "Pediatric", date: "Aug 13, 2026", status: "Paid" },
  { id: "PAY-0894", patient: "Grace Huang", doctor: "Dr. Marcus Webb", amount: "$140", type: "Consultation", date: "Aug 13, 2026", status: "Refunded" },
  { id: "PAY-0895", patient: "Hannah Scott", doctor: "Dr. Marcus Webb", amount: "$140", type: "Consultation", date: "Aug 13, 2026", status: "Pending" },
]

// ─── Utility Components ───────────────────────────────────────────────────────

function Avatar({ initials, color, size = "sm" }: { initials: string; color: string; size?: "sm" | "md" | "lg" }) {
  const sz = size === "lg" ? "w-12 h-12 text-base" : size === "md" ? "w-9 h-9 text-sm" : "w-7 h-7 text-xs"
  return (
    <div className={`${sz} rounded-full flex items-center justify-center font-semibold text-white flex-shrink-0`}
      style={{ backgroundColor: color }}>
      {initials}
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    "Active": "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
    "Inactive": "bg-slate-100 text-slate-500 ring-1 ring-slate-200",
    "On Leave": "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
    "Pending": "bg-yellow-50 text-yellow-700 ring-1 ring-yellow-200",
    "Confirmed": "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
    "Checked In": "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200",
    "In Progress": "bg-violet-50 text-violet-700 ring-1 ring-violet-200",
    "In Consultation": "bg-violet-50 text-violet-700 ring-1 ring-violet-200",
    "Completed": "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
    "Cancelled": "bg-red-50 text-red-600 ring-1 ring-red-200",
    "No Show": "bg-orange-50 text-orange-700 ring-1 ring-orange-200",
    "Available": "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
    "Occupied": "bg-red-50 text-red-600 ring-1 ring-red-200",
    "Reserved": "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
    "Maintenance": "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
    "Waiting": "bg-yellow-50 text-yellow-700 ring-1 ring-yellow-200",
    "Paid": "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
    "Unpaid": "bg-red-50 text-red-600 ring-1 ring-red-200",
    "Refunded": "bg-slate-100 text-slate-600 ring-1 ring-slate-200",
    "New": "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
  }
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${styles[status] ?? "bg-slate-100 text-slate-600"}`}>
      {status}
    </span>
  )
}

function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-xl border border-slate-200 shadow-sm ${className}`}>
      {children}
    </div>
  )
}

function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between mb-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">{title}</h1>
        {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}

function SearchBar({ placeholder }: { placeholder?: string }) {
  return (
    <div className="relative">
      <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
      <input className="pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 bg-white" placeholder={placeholder ?? "Search…"} />
    </div>
  )
}

function ConfirmDialog({ open, title, message, onConfirm, onCancel }: {
  open: boolean; title: string; message: string; onConfirm: () => void; onCancel: () => void
}) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onCancel}>
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md mx-4" onClick={e => e.stopPropagation()}>
        <h3 className="text-base font-semibold text-slate-900 mb-2">{title}</h3>
        <p className="text-sm text-slate-600 mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <button onClick={onCancel} className="px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">Cancel</button>
          <button onClick={onConfirm} className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">Confirm</button>
        </div>
      </div>
    </div>
  )
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({ label, value, sub, icon, color }: { label: string; value: string | number; sub?: string; icon: ReactNode; color: string }) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
          {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
        </div>
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0`} style={{ backgroundColor: color + "20", color }}>
          {icon}
        </div>
      </div>
    </Card>
  )
}

// ─── Icons (inline SVG) ───────────────────────────────────────────────────────

const Icons = {
  dashboard: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} className="w-5 h-5"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
  clinic: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} className="w-5 h-5"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><path d="M9 22V12h6v10"/></svg>,
  doctors: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} className="w-5 h-5"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  staff: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} className="w-5 h-5"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>,
  schedule: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} className="w-5 h-5"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  appointments: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} className="w-5 h-5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="15" y2="17"/></svg>,
  patients: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} className="w-5 h-5"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/><path d="M12 11v6M9 14h6"/></svg>,
  queue: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} className="w-5 h-5"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>,
  rooms: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} className="w-5 h-5"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></svg>,
  payments: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} className="w-5 h-5"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
  reports: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} className="w-5 h-5"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  notifications: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} className="w-5 h-5"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>,
  activity: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} className="w-5 h-5"><polyline points="22,12 18,12 15,21 9,3 6,12 2,12"/></svg>,
  search: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  plus: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  chevronDown: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><polyline points="6,9 12,15 18,9"/></svg>,
  eye: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  edit: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  calendar: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  check: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-4 h-4"><polyline points="20,6 9,17 4,12"/></svg>,
  x: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  logout: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} className="w-5 h-5"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16,17 21,12 16,7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  clock: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg>,
}

// ─── Sidebar ─────────────────────────────────────────────────────────────────

const NAV: { id: NavItem; label: string; icon: ReactNode; badge?: number }[] = [
  { id: "dashboard", label: "Dashboard", icon: Icons.dashboard },
  { id: "clinic-profile", label: "Clinic Profile", icon: Icons.clinic },
  { id: "doctors", label: "Doctors", icon: Icons.doctors },
  { id: "staff", label: "Staff", icon: Icons.staff },
  { id: "schedule", label: "Schedule", icon: Icons.schedule },
  { id: "appointments", label: "Appointments", icon: Icons.appointments, badge: 3 },
  { id: "patients", label: "Patients", icon: Icons.patients },
  { id: "patient-queue", label: "Patient Queue", icon: Icons.queue, badge: 3 },
  { id: "rooms", label: "Rooms", icon: Icons.rooms },
  { id: "payments", label: "Payments", icon: Icons.payments },
  { id: "reports", label: "Reports", icon: Icons.reports },
  { id: "notifications", label: "Notifications", icon: Icons.notifications, badge: 3 },
  { id: "activity", label: "Activity", icon: Icons.activity },
]

function Sidebar({ active, onNav }: { active: NavItem; onNav: (v: NavItem) => void }) {
  return (
    <aside className="flex h-full w-60 flex-shrink-0 flex-col" style={{ backgroundColor: "#0F172A" }}>
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} className="w-5 h-5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          </div>
          <div>
            <p className="text-white text-sm font-semibold leading-tight">Green Pine</p>
            <p className="text-slate-400 text-xs">Medical Clinic</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto sidebar-scroll px-3 py-4 space-y-0.5">
        {NAV.map(item => {
          const isActive = active === item.id
          return (
            <button key={item.id} onClick={() => onNav(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group ${isActive
                ? "bg-blue-600 text-white"
                : "text-slate-400 hover:text-white hover:bg-white/8"}`}>
              <span className={`transition-colors ${isActive ? "text-white" : "text-slate-500 group-hover:text-slate-300"}`}>{item.icon}</span>
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${isActive ? "bg-white/20 text-white" : "bg-blue-500/30 text-blue-300"}`}>
                  {item.badge}
                </span>
              )}
            </button>
          )
        })}
      </nav>

      {/* Manager profile */}
      <div className="px-4 py-4 border-t border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">CM</div>
          <div className="min-w-0">
            <p className="text-white text-xs font-medium truncate">Claire Morgan</p>
            <p className="text-slate-400 text-xs truncate">Clinic Manager</p>
          </div>
          <button className="text-slate-500 hover:text-slate-300 transition-colors flex-shrink-0" title="Logout">{Icons.logout}</button>
        </div>
      </div>
    </aside>
  )
}

// ─── Header ───────────────────────────────────────────────────────────────────

function Header({ page, notifCount, onOpenSidebar }: { page: string; notifCount: number; onOpenSidebar: () => void }) {
  return (
    <header className="min-h-14 bg-white border-b border-slate-200 flex flex-wrap items-center px-3 py-2 sm:px-6 gap-2 sm:gap-4 flex-shrink-0">
      <button onClick={onOpenSidebar} className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 lg:hidden" aria-label="Open navigation">
        ☰
      </button>
      {/* Clinic selector */}
      <div className="flex min-w-0 items-center gap-2 border border-slate-200 rounded-lg px-3 py-1.5 cursor-pointer hover:bg-slate-50 transition-colors">
        <div className="w-5 h-5 rounded bg-blue-600 flex items-center justify-center">
          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.5} className="w-3 h-3"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>
        </div>
        <span className="truncate text-sm font-medium text-slate-700">Green Pine Medical</span>
        {Icons.chevronDown}
      </div>

      {/* Search */}
      <div className="order-last w-full sm:order-none sm:min-w-[220px] sm:flex-1 sm:max-w-sm">
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input className="pl-9 pr-4 py-1.5 text-sm border border-slate-200 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-slate-50" placeholder="Search patients, doctors, appointments…" />
        </div>
      </div>

      <div className="ml-auto flex shrink-0 items-center gap-2">
        {/* Quick Actions */}
        <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          {Icons.plus}
          <span className="hidden md:block">New Appointment</span>
        </button>

        {/* Notifications */}
        <button className="relative w-9 h-9 flex items-center justify-center text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
          {Icons.notifications}
          {notifCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">{notifCount}</span>
          )}
        </button>

        {/* Manager avatar */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200 cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-bold">CM</div>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-slate-700 leading-tight">Claire Morgan</p>
            <p className="text-xs text-slate-400">Manager</p>
          </div>
          {Icons.chevronDown}
        </div>
      </div>
    </header>
  )
}

// ─── Dashboard Page ───────────────────────────────────────────────────────────

function DashboardPage() {
  const timeline = [
    { time: "09:00", patient: "Robert Chen", doctor: "Mitchell", status: "Completed", w: 60 },
    { time: "09:30", patient: "Linda Park", doctor: "Okafor", status: "Completed", w: 60 },
    { time: "10:00", patient: "Oscar Ruiz", doctor: "Nair", status: "In Progress", w: 60 },
    { time: "10:30", patient: "Hannah Scott", doctor: "Webb", status: "Checked In", w: 60 },
    { time: "11:00", patient: "Tom Bradley", doctor: "Mitchell", status: "Confirmed", w: 60 },
    { time: "11:30", patient: "Nadia Coleman", doctor: "Okafor", status: "Pending", w: 60 },
    { time: "12:00", patient: "Eric Walsh", doctor: "Nair", status: "Pending", w: 60 },
  ]

  const barColors: Record<string, string> = {
    "Completed": "#059669", "In Progress": "#7C3AED", "Checked In": "#4F46E5",
    "Confirmed": "#2563EB", "Pending": "#D97706", "Cancelled": "#DC2626",
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Dashboard" subtitle="Thursday, August 13, 2026 — Green Pine Medical Clinic" />

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Today's Appointments" value={8} sub="↑ 2 vs yesterday" icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/></svg>} color="#2563EB" />
        <StatCard label="Waiting Patients" value={3} sub="In queue now" icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5"><circle cx="12" cy="7" r="4"/><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/></svg>} color="#D97706" />
        <StatCard label="Available Doctors" value={4} sub="1 on leave" icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/><path d="M12 11v6M9 14h6"/></svg>} color="#059669" />
        <StatCard label="Active Staff" value={3} sub="1 inactive" icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>} color="#7C3AED" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Completed" value={2} sub="Today so far" icon={Icons.check} color="#059669" />
        <StatCard label="Cancelled" value={1} sub="1 refund issued" icon={Icons.x} color="#DC2626" />
        <StatCard label="Today's Revenue" value="$325" sub="4 payments collected" icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>} color="#0891B2" />
        <StatCard label="No Shows" value={0} sub="Tracking live" icon={Icons.clock} color="#64748B" />
      </div>

      {/* Timeline + Doctor Availability */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Timeline */}
        <Card className="lg:col-span-2 p-5">
          <h2 className="text-sm font-semibold text-slate-800 mb-4">Today's Appointment Timeline</h2>
          <div className="space-y-2">
            {timeline.map((t, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-xs font-mono text-slate-400 w-14 flex-shrink-0">{t.time}</span>
                <div className="flex-1 flex items-center gap-2 py-2 px-3 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: barColors[t.status] }} />
                  <span className="text-sm text-slate-700 flex-1">{t.patient}</span>
                  <span className="text-xs text-slate-400">Dr. {t.doctor}</span>
                  <StatusBadge status={t.status} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Doctor Availability + Patient Queue */}
        <div className="space-y-5">
          <Card className="p-5">
            <h2 className="text-sm font-semibold text-slate-800 mb-4">Doctor Availability</h2>
            <div className="space-y-3">
              {DOCTORS.map(d => (
                <div key={d.id} className="flex items-center gap-3">
                  <Avatar initials={d.avatar} color={d.color} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-slate-700 truncate">{d.name.replace("Dr. ", "")}</p>
                    <p className="text-xs text-slate-400">{d.specialty}</p>
                  </div>
                  <StatusBadge status={d.status} />
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <h2 className="text-sm font-semibold text-slate-800 mb-4">Live Queue</h2>
            <div className="space-y-2">
              {QUEUE.filter(q => ["In Consultation","Checked In","Waiting"].includes(q.status)).map(q => (
                <div key={q.q} className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-500 text-xs font-bold flex items-center justify-center flex-shrink-0">{q.q}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-slate-700 truncate">{q.patient}</p>
                    <p className="text-xs text-slate-400">{q.time}</p>
                  </div>
                  <StatusBadge status={q.status} />
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Clinic Performance */}
      <Card className="p-5">
        <h2 className="text-sm font-semibold text-slate-800 mb-4">Clinic Performance — This Week</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: "Appointments", val: 42, max: 60, color: "#2563EB" },
            { label: "Completed", val: 36, max: 42, color: "#059669" },
            { label: "Cancelled", val: 4, max: 42, color: "#DC2626" },
            { label: "Revenue", val: 5240, max: 8000, color: "#0891B2", prefix: "$" },
          ].map(p => (
            <div key={p.label}>
              <div className="flex items-end justify-between mb-2">
                <p className="text-xs font-medium text-slate-500">{p.label}</p>
                <p className="text-sm font-bold text-slate-800">{p.prefix}{p.val.toLocaleString()}</p>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full">
                <div className="h-2 rounded-full transition-all" style={{ width: `${(p.val / p.max) * 100}%`, backgroundColor: p.color }} />
              </div>
              <p className="text-xs text-slate-400 mt-1">of {p.prefix}{p.max.toLocaleString()} target</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

// ─── Clinic Profile Page ──────────────────────────────────────────────────────

function ClinicProfilePage() {
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState("Green Pine Medical Clinic")
  const [address, setAddress] = useState("1420 Birchwood Ave, Suite 300, Portland, OR 97201")
  const [phone, setPhone] = useState("+1 (503) 555-0192")
  const [email, setEmail] = useState("contact@greenpine.health")

  const services = ["General Practice", "Cardiology", "Pediatrics", "Dermatology", "Orthopedics", "Physical Therapy"]
  const facilities = ["Waiting Room", "X-Ray Room", "Lab", "6 Consultation Rooms", "Reception", "Pharmacy Referral"]
  const hours = [
    { day: "Monday", open: "8:00 AM", close: "6:00 PM" },
    { day: "Tuesday", open: "8:00 AM", close: "6:00 PM" },
    { day: "Wednesday", open: "8:00 AM", close: "6:00 PM" },
    { day: "Thursday", open: "8:00 AM", close: "6:00 PM" },
    { day: "Friday", open: "8:00 AM", close: "5:00 PM" },
    { day: "Saturday", open: "9:00 AM", close: "2:00 PM" },
    { day: "Sunday", open: "Closed", close: "" },
  ]

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader title="Clinic Profile" subtitle="Manage clinic details, working hours, services, and facilities"
        action={<button onClick={() => setEditing(!editing)} className={`px-4 py-2 text-sm rounded-lg font-medium transition-colors ${editing ? "bg-blue-600 text-white hover:bg-blue-700" : "border border-slate-200 text-slate-700 hover:bg-slate-50"}`}>{editing ? "Save Changes" : "Edit Profile"}</button>}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card className="p-5">
          <h3 className="text-sm font-semibold text-slate-800 mb-4">Basic Information</h3>
          <div className="space-y-4">
            {[
              { label: "Clinic Name", val: name, set: setName },
              { label: "Address", val: address, set: setAddress },
              { label: "Phone", val: phone, set: setPhone },
              { label: "Email", val: email, set: setEmail },
            ].map(f => (
              <div key={f.label}>
                <label className="block text-xs font-medium text-slate-500 mb-1">{f.label}</label>
                {editing
                  ? <input value={f.val} onChange={e => f.set(e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400" />
                  : <p className="text-sm text-slate-700">{f.val}</p>
                }
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="text-sm font-semibold text-slate-800 mb-4">Working Hours</h3>
          <div className="space-y-2">
            {hours.map(h => (
              <div key={h.day} className="flex items-center justify-between py-1.5 border-b border-slate-100 last:border-0">
                <span className="text-sm text-slate-600 w-24">{h.day}</span>
                {h.open === "Closed"
                  ? <span className="text-xs text-slate-400 font-medium">Closed</span>
                  : <span className="text-sm text-slate-700 font-mono text-xs">{h.open} — {h.close}</span>
                }
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="text-sm font-semibold text-slate-800 mb-4">Services Offered</h3>
          <div className="flex flex-wrap gap-2">
            {services.map(s => <span key={s} className="px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-medium rounded-full ring-1 ring-blue-200">{s}</span>)}
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="text-sm font-semibold text-slate-800 mb-4">Facilities</h3>
          <div className="flex flex-wrap gap-2">
            {facilities.map(f => <span key={f} className="px-3 py-1.5 bg-slate-100 text-slate-600 text-xs font-medium rounded-full ring-1 ring-slate-200">{f}</span>)}
          </div>
        </Card>
      </div>

      <Card className="p-5">
        <h3 className="text-sm font-semibold text-slate-800 mb-4">Consultation Types</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { type: "New Patient", duration: "45 min", fee: "$120" },
            { type: "Follow-up", duration: "20 min", fee: "$80" },
            { type: "Specialist Consult", duration: "30 min", fee: "$150" },
            { type: "Pediatric Check", duration: "30 min", fee: "$110" },
          ].map(c => (
            <div key={c.type} className="p-3 border border-slate-200 rounded-lg">
              <p className="text-sm font-medium text-slate-700">{c.type}</p>
              <p className="text-xs text-slate-400 mt-1">{c.duration} · {c.fee}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

// ─── Doctors Page ─────────────────────────────────────────────────────────────

function DoctorsPage() {
  const [confirm, setConfirm] = useState<string | null>(null)
  const [doctors, setDoctors] = useState(DOCTORS)

  const toggle = (id: string) => {
    setDoctors(prev => prev.map(d => d.id === id ? { ...d, status: d.status === "Active" ? "Inactive" as DoctorStatus : "Active" as DoctorStatus } : d))
    setConfirm(null)
  }

  return (
    <div>
      <PageHeader title="Doctors" subtitle="Doctors assigned to Green Pine Medical Clinic" />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
        <SearchBar placeholder="Search doctors…" />
        <div className="flex gap-2">
          <select className="text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white text-slate-700">
            <option>All Specialties</option>
            <option>Cardiology</option>
            <option>Pediatrics</option>
            <option>Dermatology</option>
          </select>
          <select className="text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white text-slate-700">
            <option>All Status</option>
            <option>Active</option>
            <option>On Leave</option>
          </select>
        </div>
      </div>

      <Card>
        <div className="responsive-table">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3">DOCTOR</th>
                <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3">SPECIALTY</th>
                <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3">EXPERIENCE</th>
                <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3">SCHEDULE</th>
                <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3">APPTS TODAY</th>
                <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3">STATUS</th>
                <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {doctors.map(d => (
                <tr key={d.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <Avatar initials={d.avatar} color={d.color} size="sm" />
                      <div>
                        <p className="text-sm font-medium text-slate-800">{d.name}</p>
                        <p className="text-xs text-slate-400">{d.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-slate-600">{d.specialty}</td>
                  <td className="px-5 py-3.5 text-sm text-slate-600">{d.experience}</td>
                  <td className="px-5 py-3.5 text-xs text-slate-500">{d.schedule}</td>
                  <td className="px-5 py-3.5">
                    <span className="text-sm font-semibold text-slate-700">{d.appointments}</span>
                  </td>
                  <td className="px-5 py-3.5"><StatusBadge status={d.status} /></td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1.5">
                      <button className="px-2.5 py-1.5 text-xs text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-1">{Icons.eye} Profile</button>
                      <button className="px-2.5 py-1.5 text-xs text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-1">{Icons.calendar} Schedule</button>
                      <button onClick={() => setConfirm(d.id)}
                        className={`px-2.5 py-1.5 text-xs rounded-lg border transition-colors ${d.status === "Active" ? "text-red-600 border-red-200 hover:bg-red-50" : "text-emerald-600 border-emerald-200 hover:bg-emerald-50"}`}>
                        {d.status === "Active" ? "Deactivate" : "Activate"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <p className="text-xs text-slate-400 mt-3 px-1">Note: Doctor verification status is managed at the platform level and cannot be modified here.</p>

      <ConfirmDialog open={!!confirm} title="Change Doctor Status"
        message="This will change the doctor's availability at this clinic. Continue?"
        onConfirm={() => confirm && toggle(confirm)}
        onCancel={() => setConfirm(null)} />
    </div>
  )
}

// ─── Staff Page ───────────────────────────────────────────────────────────────

function StaffPage() {
  const [showAdd, setShowAdd] = useState(false)
  const [confirm, setConfirm] = useState<string | null>(null)
  const [staff, setStaff] = useState(STAFF)

  const toggle = (id: string) => {
    setStaff(prev => prev.map(s => s.id === id ? { ...s, status: s.status === "Active" ? "Inactive" as StaffStatus : "Active" as StaffStatus } : s))
    setConfirm(null)
  }

  return (
    <div>
      <PageHeader title="Staff" subtitle="Receptionists and support staff at this clinic"
        action={<button onClick={() => setShowAdd(true)} className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">{Icons.plus} Add Staff</button>}
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
        <SearchBar placeholder="Search staff…" />
        <select className="text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white text-slate-700">
          <option>All Roles</option>
          <option>Receptionist</option>
          <option>Support Staff</option>
        </select>
      </div>

      <Card>
        <div className="responsive-table">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3">STAFF</th>
                <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3">ROLE</th>
                <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3">CONTACT</th>
                <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3">PERMISSIONS</th>
                <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3">LAST ACTIVE</th>
                <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3">STATUS</th>
                <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {staff.map(s => (
                <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <Avatar initials={s.name.split(" ").map(n => n[0]).join("")} color="#4F46E5" size="sm" />
                      <div>
                        <p className="text-sm font-medium text-slate-800">{s.name}</p>
                        <p className="text-xs text-slate-400">{s.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-slate-600">{s.role}</td>
                  <td className="px-5 py-3.5">
                    <p className="text-xs text-slate-600">{s.email}</p>
                    <p className="text-xs text-slate-400">{s.phone}</p>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex flex-wrap gap-1">
                      {s.permissions.map(p => <span key={p} className="px-1.5 py-0.5 bg-slate-100 text-slate-600 text-xs rounded">{p}</span>)}
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-xs text-slate-500">{s.lastActive}</td>
                  <td className="px-5 py-3.5"><StatusBadge status={s.status} /></td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1.5">
                      <button className="px-2.5 py-1.5 text-xs text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">{Icons.edit}</button>
                      <button className="px-2.5 py-1.5 text-xs text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors">Permissions</button>
                      <button onClick={() => setConfirm(s.id)}
                        className={`px-2.5 py-1.5 text-xs rounded-lg border transition-colors ${s.status === "Active" ? "text-red-600 border-red-200 hover:bg-red-50" : "text-emerald-600 border-emerald-200 hover:bg-emerald-50"}`}>
                        {s.status === "Active" ? "Deactivate" : "Activate"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setShowAdd(false)}>
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md mx-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-base font-semibold text-slate-900 mb-4">Add Staff Member</h3>
            <div className="space-y-3">
              {["Full Name", "Email", "Phone", "Role"].map(f => (
                <div key={f}>
                  <label className="block text-xs font-medium text-slate-500 mb-1">{f}</label>
                  {f === "Role"
                    ? <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"><option>Receptionist</option><option>Support Staff</option></select>
                    : <input className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200" placeholder={f} />
                  }
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-5 justify-end">
              <button onClick={() => setShowAdd(false)} className="px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">Cancel</button>
              <button onClick={() => setShowAdd(false)} className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">Add Staff</button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog open={!!confirm} title="Change Staff Status"
        message="This will change the staff member's access to the clinic system. Continue?"
        onConfirm={() => confirm && toggle(confirm)} onCancel={() => setConfirm(null)} />
    </div>
  )
}

// ─── Schedule Page ────────────────────────────────────────────────────────────

function SchedulePage() {
  const [view, setView] = useState<"week" | "day">("week")
  const days = ["Mon Aug 11", "Tue Aug 12", "Wed Aug 13", "Thu Aug 14", "Fri Aug 15", "Sat Aug 16"]
  const slots = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"]

  type SlotType = "booked" | "available" | "blocked" | "unavailable"
  const slotData: Record<string, Record<string, SlotType>> = {
    "09:00": { "Mon Aug 11": "booked", "Tue Aug 12": "booked", "Wed Aug 13": "booked", "Thu Aug 14": "available", "Fri Aug 15": "available" },
    "10:00": { "Mon Aug 11": "booked", "Tue Aug 12": "available", "Wed Aug 13": "booked", "Thu Aug 14": "booked", "Fri Aug 15": "blocked" },
    "11:00": { "Mon Aug 11": "available", "Tue Aug 12": "booked", "Wed Aug 13": "booked", "Thu Aug 14": "available", "Fri Aug 15": "available" },
    "12:00": { "Mon Aug 11": "blocked", "Tue Aug 12": "blocked", "Wed Aug 13": "blocked", "Thu Aug 14": "blocked", "Fri Aug 15": "blocked", "Sat Aug 16": "unavailable" },
    "13:00": { "Mon Aug 11": "available", "Tue Aug 12": "booked", "Wed Aug 13": "booked", "Thu Aug 14": "available", "Fri Aug 15": "booked" },
    "14:00": { "Mon Aug 11": "booked", "Tue Aug 12": "available", "Wed Aug 13": "available", "Thu Aug 14": "booked", "Fri Aug 15": "booked" },
    "15:00": { "Mon Aug 11": "available", "Tue Aug 12": "available", "Wed Aug 13": "booked", "Thu Aug 14": "available", "Fri Aug 15": "unavailable" },
    "08:00": { "Sat Aug 16": "unavailable", "Sun": "unavailable" },
    "16:00": { "Fri Aug 15": "unavailable", "Sat Aug 16": "unavailable" },
  }

  const slotStyle: Record<SlotType, string> = {
    booked: "bg-blue-100 text-blue-700 border-blue-200",
    available: "bg-emerald-50 text-emerald-700 border-emerald-200",
    blocked: "bg-amber-50 text-amber-600 border-amber-200",
    unavailable: "bg-slate-100 text-slate-400 border-slate-200",
  }

  return (
    <div>
      <PageHeader title="Schedule" subtitle="Manage doctor hours, consultation slots, breaks, and room availability"
        action={
          <div className="flex gap-2">
            <button onClick={() => setView("week")} className={`px-3 py-2 text-sm rounded-lg border transition-colors ${view === "week" ? "bg-blue-600 text-white border-blue-600" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}>Week</button>
            <button onClick={() => setView("day")} className={`px-3 py-2 text-sm rounded-lg border transition-colors ${view === "day" ? "bg-blue-600 text-white border-blue-600" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}>Day</button>
          </div>
        }
      />

      {/* Legend */}
      <div className="flex items-center gap-4 mb-4">
        {[
          { label: "Booked", cls: "bg-blue-100 border border-blue-200" },
          { label: "Available", cls: "bg-emerald-50 border border-emerald-200" },
          { label: "Blocked / Break", cls: "bg-amber-50 border border-amber-200" },
          { label: "Unavailable", cls: "bg-slate-100 border border-slate-200" },
        ].map(l => (
          <div key={l.label} className="flex items-center gap-1.5">
            <div className={`w-4 h-3 rounded ${l.cls}`} />
            <span className="text-xs text-slate-500">{l.label}</span>
          </div>
        ))}
      </div>

      <Card className="responsive-table">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="text-left text-xs font-semibold text-slate-400 px-4 py-3 w-20">TIME</th>
              {days.map(d => (
                <th key={d} className={`text-center text-xs font-semibold px-2 py-3 ${d.includes("13") ? "text-blue-600" : "text-slate-500"}`}>{d}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {slots.map(slot => (
              <tr key={slot} className="border-b border-slate-50 last:border-0">
                <td className="px-4 py-2.5 text-xs font-mono text-slate-400">{slot}</td>
                {days.map(day => {
                  const type = slotData[slot]?.[day] ?? "available"
                  return (
                    <td key={day} className="px-2 py-2">
                      <div className={`text-xs text-center py-1.5 rounded border cursor-pointer transition-all hover:opacity-80 ${slotStyle[type]}`}>
                        {type === "booked" ? "Booked" : type === "blocked" ? "Break" : type === "unavailable" ? "—" : "Open"}
                      </div>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
        <Card className="p-4">
          <h3 className="text-sm font-semibold text-slate-700 mb-3">Upcoming Leave</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <div>
                <p className="text-sm font-medium text-slate-700">Dr. Elena Torres</p>
                <p className="text-xs text-slate-400">Aug 14 – 18, 2026</p>
              </div>
              <StatusBadge status="Pending" />
            </div>
            <p className="text-xs text-slate-400">No other leave scheduled</p>
          </div>
        </Card>
        <Card className="p-4">
          <h3 className="text-sm font-semibold text-slate-700 mb-3">Clinic Holidays</h3>
          <div className="space-y-2 text-sm text-slate-600">
            <div className="flex justify-between"><span>Labor Day</span><span className="text-slate-400">Sep 1, 2026</span></div>
            <div className="flex justify-between"><span>Thanksgiving</span><span className="text-slate-400">Nov 26, 2026</span></div>
            <div className="flex justify-between"><span>Christmas</span><span className="text-slate-400">Dec 25, 2026</span></div>
          </div>
        </Card>
        <Card className="p-4">
          <h3 className="text-sm font-semibold text-slate-700 mb-3">Room Availability</h3>
          <div className="space-y-2">
            {ROOMS.map(r => (
              <div key={r.id} className="flex items-center justify-between">
                <span className="text-sm text-slate-600">{r.name}</span>
                <StatusBadge status={r.status} />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}

// ─── Appointments Page ────────────────────────────────────────────────────────

function AppointmentsPage() {
  const [filter, setFilter] = useState<string>("All")
  const [selected, setSelected] = useState<string | null>(null)
  const statuses = ["All", "Pending", "Confirmed", "Checked In", "In Progress", "Completed", "Cancelled", "No Show"]
  const filtered = filter === "All" ? APPOINTMENTS : APPOINTMENTS.filter(a => a.status === filter)

  return (
    <div>
      <PageHeader title="Appointments" subtitle="Aug 13, 2026 — Today's appointments at Green Pine Medical"
        action={<button className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">{Icons.plus} New Appointment</button>}
      />

      {/* Status tabs */}
      <div className="flex gap-1.5 flex-wrap mb-4">
        {statuses.map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${filter === s ? "bg-blue-600 text-white" : "border border-slate-200 text-slate-600 hover:bg-slate-50 bg-white"}`}>
            {s}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3 mb-4">
        <SearchBar placeholder="Search appointments, patients…" />
        <select className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-200">
          <option>All Doctors</option>
          {DOCTORS.map(d => <option key={d.id}>{d.name}</option>)}
        </select>
      </div>

      <Card>
        <div className="responsive-table">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                {["APPT ID", "PATIENT", "DOCTOR", "DATE & TIME", "ROOM", "TYPE", "PAYMENT", "STATUS", "ACTIONS"].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-slate-500 px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map(a => (
                <tr key={a.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3.5 text-xs font-mono text-blue-600">{a.id}</td>
                  <td className="px-4 py-3.5 text-sm font-medium text-slate-700">{a.patient}</td>
                  <td className="px-4 py-3.5 text-sm text-slate-600">{a.doctor}</td>
                  <td className="px-4 py-3.5">
                    <p className="text-sm text-slate-700">{a.date}</p>
                    <p className="text-xs text-slate-400">{a.time}</p>
                  </td>
                  <td className="px-4 py-3.5 text-sm text-slate-500">{a.room}</td>
                  <td className="px-4 py-3.5 text-xs text-slate-600">{a.type}</td>
                  <td className="px-4 py-3.5"><StatusBadge status={a.payStatus} /></td>
                  <td className="px-4 py-3.5"><StatusBadge status={a.status} /></td>
                  <td className="px-4 py-3.5">
                    <div className="flex gap-1">
                      <button onClick={() => setSelected(a.id)} className="px-2 py-1 text-xs text-slate-600 border border-slate-200 rounded hover:bg-slate-50 transition-colors">View</button>
                      {a.status !== "Completed" && a.status !== "Cancelled" && (
                        <>
                          <button className="px-2 py-1 text-xs text-blue-600 border border-blue-200 rounded hover:bg-blue-50 transition-colors">Reschedule</button>
                          {a.status === "Confirmed" && <button className="px-2 py-1 text-xs text-emerald-600 border border-emerald-200 rounded hover:bg-emerald-50 transition-colors">Check In</button>}
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between">
          <p className="text-xs text-slate-400">Showing {filtered.length} of {APPOINTMENTS.length} appointments</p>
          <div className="flex gap-1">
            <button className="px-3 py-1 text-xs border border-slate-200 rounded hover:bg-slate-50 text-slate-600">Prev</button>
            <button className="px-3 py-1 text-xs border border-slate-200 rounded bg-blue-600 text-white">1</button>
            <button className="px-3 py-1 text-xs border border-slate-200 rounded hover:bg-slate-50 text-slate-600">Next</button>
          </div>
        </div>
      </Card>
    </div>
  )
}

// ─── Patients Page ────────────────────────────────────────────────────────────

function PatientsPage() {
  return (
    <div>
      <PageHeader title="Patients" subtitle="Patients with appointments at Green Pine Medical Clinic" />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
        <SearchBar placeholder="Search patients…" />
        <select className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-200">
          <option>All Patients</option>
          <option>Active</option>
          <option>New</option>
          <option>Inactive</option>
        </select>
      </div>

      <Card>
        <div className="responsive-table">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                {["PATIENT", "PRIMARY DOCTOR", "LAST VISIT", "NEXT APPOINTMENT", "STATUS", "ACTIONS"].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-slate-500 px-5 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {PATIENTS.map(p => (
                <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <Avatar initials={p.name.split(" ").map(n => n[0]).join("")} color="#0891B2" size="sm" />
                      <div>
                        <p className="text-sm font-medium text-slate-800">{p.name}</p>
                        <p className="text-xs text-slate-400">{p.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-slate-600">{p.doctor}</td>
                  <td className="px-5 py-3.5 text-sm text-slate-500">{p.lastVisit}</td>
                  <td className="px-5 py-3.5 text-sm text-slate-600">{p.nextAppt}</td>
                  <td className="px-5 py-3.5"><StatusBadge status={p.status} /></td>
                  <td className="px-5 py-3.5">
                    <button className="px-2.5 py-1.5 text-xs text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-1">{Icons.eye} View Records</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between">
          <p className="text-xs text-slate-400">Showing {PATIENTS.length} patients · Clinic-authorized records only</p>
          <div className="flex gap-1">
            <button className="px-3 py-1 text-xs border border-slate-200 rounded hover:bg-slate-50 text-slate-600">Prev</button>
            <button className="px-3 py-1 text-xs border border-slate-200 rounded bg-blue-600 text-white">1</button>
            <button className="px-3 py-1 text-xs border border-slate-200 rounded hover:bg-slate-50 text-slate-600">Next</button>
          </div>
        </div>
      </Card>

      <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
        <p className="text-xs text-amber-700 font-medium">Access Restricted — You can only view records for patients who have appointments at this clinic.</p>
      </div>
    </div>
  )
}

// ─── Patient Queue Page ───────────────────────────────────────────────────────

function PatientQueuePage() {
  const [queue, setQueue] = useState(QUEUE)
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30000)
    return () => clearInterval(t)
  }, [])

  const rowColor: Record<QueueStatus, string> = {
    "In Consultation": "border-l-4 border-violet-400",
    "Checked In": "border-l-4 border-blue-400",
    "Waiting": "border-l-4 border-yellow-400",
    "Completed": "border-l-4 border-emerald-300",
    "No Show": "border-l-4 border-red-300",
  }

  return (
    <div>
      <PageHeader title="Patient Queue" subtitle={`Live queue — ${now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "In Consultation", val: queue.filter(q => q.status === "In Consultation").length, color: "#7C3AED" },
          { label: "Checked In", val: queue.filter(q => q.status === "Checked In").length, color: "#2563EB" },
          { label: "Waiting", val: queue.filter(q => q.status === "Waiting").length, color: "#D97706" },
          { label: "Completed", val: queue.filter(q => q.status === "Completed").length, color: "#059669" },
        ].map(s => (
          <Card key={s.label} className="p-4">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">{s.label}</p>
            <p className="text-3xl font-bold mt-1" style={{ color: s.color }}>{s.val}</p>
          </Card>
        ))}
      </div>

      <Card>
        <div className="responsive-table">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                {["#", "PATIENT", "DOCTOR", "APPT TIME", "WAITING", "STATUS", "ACTIONS"].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-slate-500 px-5 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {queue.map(q => (
                <tr key={q.q} className={`hover:bg-slate-50 transition-colors ${rowColor[q.status]}`}>
                  <td className="px-5 py-3.5">
                    <span className="w-7 h-7 rounded-full bg-slate-100 text-slate-700 text-sm font-bold flex items-center justify-center">{q.q}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <Avatar initials={q.patient.split(" ").map(n => n[0]).join("")} color="#0891B2" size="sm" />
                      <span className="text-sm font-medium text-slate-800">{q.patient}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-slate-600">{q.doctor}</td>
                  <td className="px-5 py-3.5 text-sm font-mono text-slate-600">{q.time}</td>
                  <td className="px-5 py-3.5 text-sm text-slate-500">{q.waiting}</td>
                  <td className="px-5 py-3.5"><StatusBadge status={q.status} /></td>
                  <td className="px-5 py-3.5">
                    {q.status === "Waiting" && (
                      <button onClick={() => setQueue(prev => prev.map(item => item.q === q.q ? { ...item, status: "Checked In" as QueueStatus } : item))}
                        className="px-2.5 py-1.5 text-xs text-emerald-600 border border-emerald-200 rounded-lg hover:bg-emerald-50 transition-colors">
                        Check In
                      </button>
                    )}
                    {q.status === "Checked In" && (
                      <button className="px-2.5 py-1.5 text-xs text-violet-600 border border-violet-200 rounded-lg hover:bg-violet-50 transition-colors">
                        Start Consult
                      </button>
                    )}
                    {(q.status === "Completed" || q.status === "No Show") && (
                      <span className="text-xs text-slate-400">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

// ─── Rooms Page ───────────────────────────────────────────────────────────────

function RoomsPage() {
  const [rooms, setRooms] = useState(ROOMS)
  const [confirm, setConfirm] = useState<string | null>(null)

  const cardColor: Record<RoomStatus, { bg: string; border: string; dot: string }> = {
    Available: { bg: "bg-emerald-50", border: "border-emerald-200", dot: "bg-emerald-500" },
    Occupied: { bg: "bg-red-50", border: "border-red-200", dot: "bg-red-500" },
    Reserved: { bg: "bg-blue-50", border: "border-blue-200", dot: "bg-blue-500" },
    Maintenance: { bg: "bg-amber-50", border: "border-amber-200", dot: "bg-amber-500" },
  }

  return (
    <div>
      <PageHeader title="Rooms" subtitle="Consultation room management and real-time availability" />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {(["Available", "Occupied", "Reserved", "Maintenance"] as RoomStatus[]).map(s => {
          const c = cardColor[s]
          return (
            <div key={s} className={`p-4 rounded-xl border ${c.bg} ${c.border}`}>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${c.dot}`} />
                <p className="text-xs font-medium text-slate-600">{s}</p>
              </div>
              <p className="text-2xl font-bold text-slate-800 mt-2">{rooms.filter(r => r.status === s).length}</p>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {rooms.map(r => {
          const c = cardColor[r.status]
          return (
            <Card key={r.id} className={`p-5 border-2 ${r.status === "Occupied" ? "border-red-200" : r.status === "Available" ? "border-emerald-200" : "border-slate-200"}`}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-base font-semibold text-slate-800">{r.name}</h3>
                  <p className="text-xs text-slate-400">{r.type}</p>
                </div>
                <StatusBadge status={r.status} />
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Doctor</span>
                  <span className="text-slate-700 font-medium">{r.doctor}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Patient</span>
                  <span className="text-slate-700 font-medium">{r.patient}</span>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                {r.status !== "Maintenance" && (
                  <button className="flex-1 py-1.5 text-xs border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors">Assign Doctor</button>
                )}
                <button onClick={() => setConfirm(r.id)}
                  className={`flex-1 py-1.5 text-xs border rounded-lg transition-colors ${r.status === "Maintenance" ? "border-emerald-200 text-emerald-600 hover:bg-emerald-50" : "border-amber-200 text-amber-600 hover:bg-amber-50"}`}>
                  {r.status === "Maintenance" ? "Mark Available" : "Maintenance"}
                </button>
              </div>
            </Card>
          )
        })}
      </div>

      <ConfirmDialog open={!!confirm} title="Update Room Status"
        message="This will change the room's status. Any active bookings may be affected."
        onConfirm={() => {
          if (confirm) {
            setRooms(prev => prev.map(r => r.id === confirm ? { ...r, status: r.status === "Maintenance" ? "Available" as RoomStatus : "Maintenance" as RoomStatus } : r))
            setConfirm(null)
          }
        }}
        onCancel={() => setConfirm(null)} />
    </div>
  )
}

// ─── Payments Page ────────────────────────────────────────────────────────────

function PaymentsPage() {
  return (
    <div>
      <PageHeader title="Payments" subtitle="Clinic-level payment records and revenue summary" />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Today's Revenue" value="$325" sub="4 payments" icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>} color="#059669" />
        <StatCard label="This Week" value="$2,180" sub="18 payments" icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5"><polyline points="23,6 13.5,15.5 8.5,10.5 1,18"/><polyline points="17,6 23,6 23,12"/></svg>} color="#2563EB" />
        <StatCard label="Pending" value="$280" sub="2 unpaid" icon={Icons.clock} color="#D97706" />
        <StatCard label="Refunded" value="$140" sub="1 refund today" icon={Icons.x} color="#DC2626" />
      </div>

      <Card>
        <div className="responsive-table">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                {["PAYMENT ID", "PATIENT", "DOCTOR", "TYPE", "AMOUNT", "DATE", "STATUS"].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-slate-500 px-5 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {PAYMENTS.map(p => (
                <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3.5 text-xs font-mono text-blue-600">{p.id}</td>
                  <td className="px-5 py-3.5 text-sm font-medium text-slate-700">{p.patient}</td>
                  <td className="px-5 py-3.5 text-sm text-slate-600">{p.doctor}</td>
                  <td className="px-5 py-3.5 text-sm text-slate-500">{p.type}</td>
                  <td className="px-5 py-3.5 text-sm font-semibold text-slate-800">{p.amount}</td>
                  <td className="px-5 py-3.5 text-sm text-slate-500">{p.date}</td>
                  <td className="px-5 py-3.5"><StatusBadge status={p.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-xs text-blue-700 font-medium">Clinic-level view only — Platform-wide financial data is not accessible from this dashboard.</p>
      </div>
    </div>
  )
}

// ─── Reports Page ─────────────────────────────────────────────────────────────

function ReportsPage() {
  const weeklyData = [
    { day: "Mon", appts: 9, revenue: 720 },
    { day: "Tue", appts: 11, revenue: 880 },
    { day: "Wed", appts: 8, revenue: 640 },
    { day: "Thu", appts: 7, revenue: 560 },
    { day: "Fri", appts: 5, revenue: 380 },
    { day: "Sat", appts: 2, revenue: 160 },
  ]
  const maxAppts = Math.max(...weeklyData.map(d => d.appts))

  return (
    <div>
      <PageHeader title="Reports" subtitle="Clinic-level analytics and appointment trends"
        action={<button className="px-4 py-2 text-sm border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors">Export CSV</button>}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card className="p-5">
          <h3 className="text-sm font-semibold text-slate-800 mb-4">Appointments This Week</h3>
          <div className="flex items-end gap-3 h-40">
            {weeklyData.map(d => (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-xs text-slate-500">{d.appts}</span>
                <div className="w-full rounded-t-md bg-blue-500 transition-all" style={{ height: `${(d.appts / maxAppts) * 100}%` }} />
                <span className="text-xs text-slate-400">{d.day}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="text-sm font-semibold text-slate-800 mb-4">Revenue This Week</h3>
          <div className="flex items-end gap-3 h-40">
            {weeklyData.map(d => (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-xs text-slate-500">${d.revenue}</span>
                <div className="w-full rounded-t-md bg-emerald-500 transition-all" style={{ height: `${(d.revenue / 880) * 100}%` }} />
                <span className="text-xs text-slate-400">{d.day}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="text-sm font-semibold text-slate-800 mb-4">Appointment Status Breakdown</h3>
          <div className="space-y-3">
            {[
              { label: "Completed", val: 36, color: "#059669" },
              { label: "Cancelled", val: 4, color: "#DC2626" },
              { label: "No Shows", val: 2, color: "#D97706" },
              { label: "Pending / Upcoming", val: 8, color: "#2563EB" },
            ].map(s => (
              <div key={s.label}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-slate-600">{s.label}</span>
                  <span className="text-sm font-semibold text-slate-700">{s.val}</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full">
                  <div className="h-2 rounded-full" style={{ width: `${(s.val / 50) * 100}%`, backgroundColor: s.color }} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="text-sm font-semibold text-slate-800 mb-4">Doctor Performance</h3>
          <div className="space-y-3">
            {DOCTORS.filter(d => d.status === "Active").map(d => (
              <div key={d.id} className="flex items-center gap-3">
                <Avatar initials={d.avatar} color={d.color} size="sm" />
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-xs font-medium text-slate-700">{d.name}</span>
                    <span className="text-xs text-slate-500">{d.appointments} today</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full">
                    <div className="h-1.5 rounded-full" style={{ width: `${(d.appointments / 12) * 100}%`, backgroundColor: d.color }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}

// ─── Notifications Page ───────────────────────────────────────────────────────

function NotificationsPage() {
  const [notifs, setNotifs] = useState(NOTIFICATIONS)
  const iconMap: Record<string, string> = {
    "new-appt": "📅", "checkin": "✅", "cancel": "❌", "leave": "🏖️", "schedule": "📋", "staff": "👤"
  }

  return (
    <div>
      <PageHeader title="Notifications" subtitle={`${notifs.filter(n => !n.read).length} unread notifications`}
        action={<button onClick={() => setNotifs(prev => prev.map(n => ({ ...n, read: true })))} className="text-sm text-blue-600 hover:underline">Mark all read</button>}
      />

      <Card>
        <div className="divide-y divide-slate-100">
          {notifs.map(n => (
            <div key={n.id} onClick={() => setNotifs(prev => prev.map(item => item.id === n.id ? { ...item, read: true } : item))}
              className={`flex gap-4 px-5 py-4 cursor-pointer hover:bg-slate-50 transition-colors ${!n.read ? "bg-blue-50/40" : ""}`}>
              <span className="text-xl flex-shrink-0">{iconMap[n.type]}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-slate-800">{n.title}</p>
                  {!n.read && <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />}
                </div>
                <p className="text-sm text-slate-600 mt-0.5">{n.message}</p>
                <p className="text-xs text-slate-400 mt-1">{n.time}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

// ─── Activity Page ────────────────────────────────────────────────────────────

function ActivityPage() {
  const typeIcon: Record<string, string> = {
    appointment: "📅", room: "🚪", checkin: "✅", schedule: "📋", cancel: "❌", staff: "👤"
  }
  const typeColor: Record<string, string> = {
    appointment: "bg-blue-100 text-blue-600",
    room: "bg-slate-100 text-slate-600",
    checkin: "bg-emerald-100 text-emerald-600",
    schedule: "bg-violet-100 text-violet-600",
    cancel: "bg-red-100 text-red-600",
    staff: "bg-amber-100 text-amber-600",
  }

  return (
    <div>
      <PageHeader title="Activity Log" subtitle="Clinic-level actions and changes tracked in real time"
        action={<button className="px-4 py-2 text-sm border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors">Export Log</button>}
      />

      <div className="flex items-center gap-3 mb-4">
        <SearchBar placeholder="Search activity…" />
        <select className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-200">
          <option>All Actions</option>
          <option>Appointments</option>
          <option>Rooms</option>
          <option>Schedule</option>
          <option>Staff</option>
        </select>
      </div>

      <Card>
        <div className="divide-y divide-slate-100">
          {ACTIVITY.map(a => (
            <div key={a.id} className="flex items-start gap-4 px-5 py-4 hover:bg-slate-50 transition-colors">
              <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-base flex-shrink-0 ${typeColor[a.type]}`}>{typeIcon[a.type]}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-semibold text-slate-800">{a.action}</p>
                  <span className="text-xs text-slate-400">by {a.user}</span>
                </div>
                <p className="text-sm text-slate-600 mt-0.5">{a.detail}</p>
              </div>
              <span className="text-xs text-slate-400 flex-shrink-0 mt-0.5">{a.time}</span>
            </div>
          ))}
        </div>
        <div className="px-5 py-3 border-t border-slate-100 text-center">
          <button className="text-sm text-blue-600 hover:underline">Load more activity</button>
        </div>
      </Card>
    </div>
  )
}

// ─── App Root ─────────────────────────────────────────────────────────────────

export default function App() {
  const [page, setPage] = useState<NavItem>("dashboard")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const unreadNotifs = NOTIFICATIONS.filter(n => !n.read).length

  const pages: Record<NavItem, ReactNode> = {
    "dashboard": <DashboardPage />,
    "clinic-profile": <ClinicProfilePage />,
    "doctors": <DoctorsPage />,
    "staff": <StaffPage />,
    "schedule": <SchedulePage />,
    "appointments": <AppointmentsPage />,
    "patients": <PatientsPage />,
    "patient-queue": <PatientQueuePage />,
    "rooms": <RoomsPage />,
    "payments": <PaymentsPage />,
    "reports": <ReportsPage />,
    "notifications": <NotificationsPage />,
    "activity": <ActivityPage />,
  }

  return (
    <div className="app-shell-height flex overflow-hidden" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      {sidebarOpen && <div className="fixed inset-0 z-30 bg-black/45 lg:hidden" onClick={() => setSidebarOpen(false)} />}
      <div className={`fixed inset-y-0 left-0 z-40 transition-transform duration-200 lg:relative lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <Sidebar active={page} onNav={(next) => { setPage(next); setSidebarOpen(false) }} />
      </div>
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Header page={page} notifCount={unreadNotifs} onOpenSidebar={() => setSidebarOpen(true)} />
        <main className="dashboard-content flex-1 overflow-y-auto" style={{ backgroundColor: "#F0F4F8" }}>
          {pages[page]}
        </main>
      </div>
    </div>
  )
}
