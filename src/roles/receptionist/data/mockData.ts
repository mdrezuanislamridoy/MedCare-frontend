// ─── Types ────────────────────────────────────────────────────────────────────

export type NavItem =
  | "Dashboard"
  | "Appointments"
  | "Patient Check-In"
  | "Patient Queue"
  | "Patients"
  | "Doctors"
  | "Schedule"
  | "Notifications"
  | "Activity"

export type AppointmentStatus =
  | "Confirmed"
  | "Checked In"
  | "In Progress"
  | "Completed"
  | "Cancelled"
  | "No Show"

export type DoctorStatus = "Available" | "In Consultation" | "On Break" | "Offline"

export type PaymentStatus = "Paid" | "Pending" | "Insurance" | "Waived"

export interface Appointment {
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

export interface QueueEntry {
  queueNo: number
  patient: string
  doctor: string
  apptTime: string
  waitMins: number
  status: "Waiting" | "Called" | "In Room" | "No Show"
  avatar: string
}

export interface Doctor {
  name: string
  specialty: string
  status: DoctorStatus
  avatar: string
  queue: number
  nextAppt: string
  room: string
}

export interface Patient {
  name: string
  phone: string
  doctor: string
  lastVisit: string
  visits: number
  avatar: string
}

export interface Notification {
  id: number
  type: "appointment" | "cancel" | "reschedule" | "doctor" | "checkin" | "schedule"
  message: string
  time: string
  read: boolean
}

export interface ActivityEntry {
  id: number
  action: string
  detail: string
  time: string
  user: string
  type: "checkin" | "cancel" | "reschedule" | "room" | "queue" | "appointment"
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

export const APPOINTMENTS: Appointment[] = [
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

export const QUEUE: QueueEntry[] = [
  { queueNo: 1, patient: "Maria Santos", doctor: "Dr. Amir Patel", apptTime: "09:30 AM", waitMins: 12, status: "In Room", avatar: "MS" },
  { queueNo: 2, patient: "Daniel Okafor", doctor: "Dr. Raj Mehta", apptTime: "10:00 AM", waitMins: 8, status: "Called", avatar: "DO" },
  { queueNo: 3, patient: "Elena Vasquez", doctor: "Dr. Linda Cho", apptTime: "10:30 AM", waitMins: 4, status: "Waiting", avatar: "EV" },
  { queueNo: 4, patient: "Thomas Kim", doctor: "Dr. Raj Mehta", apptTime: "11:00 AM", waitMins: 2, status: "Waiting", avatar: "TK" },
  { queueNo: 5, patient: "Priya Nair", doctor: "Dr. Amir Patel", apptTime: "11:30 AM", waitMins: 0, status: "Waiting", avatar: "PN" },
]

export const DOCTORS: Doctor[] = [
  { name: "Dr. Amir Patel", specialty: "General Practice", status: "In Consultation", avatar: "AP", queue: 3, nextAppt: "11:30 AM", room: "101" },
  { name: "Dr. Linda Cho", specialty: "Internal Medicine", status: "Available", avatar: "LC", queue: 2, nextAppt: "10:30 AM", room: "203" },
  { name: "Dr. Raj Mehta", specialty: "Cardiology", status: "In Consultation", avatar: "RM", queue: 2, nextAppt: "11:00 AM", room: "305" },
  { name: "Dr. Sarah Quinn", specialty: "Pediatrics", status: "On Break", avatar: "SQ", queue: 0, nextAppt: "02:00 PM", room: "—" },
]

export const PATIENTS: Patient[] = [
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

export const NOTIFICATIONS: Notification[] = [
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

export const ACTIVITY: ActivityEntry[] = [
  { id: 1, action: "Patient Checked In", detail: "Maria Santos — APT-1003 — Room 101 assigned", time: "9:28 AM", user: "Grace Osei", type: "checkin" },
  { id: 2, action: "Queue Updated", detail: "Queue #2 called for Daniel Okafor", time: "9:55 AM", user: "Grace Osei", type: "queue" },
  { id: 3, action: "Room Assigned", detail: "Room 305 assigned to Daniel Okafor", time: "9:57 AM", user: "Grace Osei", type: "room" },
  { id: 4, action: "Appointment Cancelled", detail: "APT-1008 — Robert Walsh — Reason: Patient request", time: "8:51 AM", user: "Grace Osei", type: "cancel" },
  { id: 5, action: "Patient Checked In", detail: "Daniel Okafor — APT-1004 — Queue #2", time: "9:40 AM", user: "Grace Osei", type: "checkin" },
  { id: 6, action: "No Show Marked", detail: "Kevin Adeyemi — APT-1012 — 10:32 AM", time: "10:32 AM", user: "Grace Osei", type: "queue" },
  { id: 7, action: "Appointment Rescheduled", detail: "Kevin Adeyemi from Aug 13 2:30 PM → Aug 14 9:00 AM", time: "8:44 AM", user: "Grace Osei", type: "reschedule" },
  { id: 8, action: "Patient Checked In", detail: "James Thornton — APT-1002 — Room 203", time: "8:55 AM", user: "Grace Osei", type: "checkin" },
]
