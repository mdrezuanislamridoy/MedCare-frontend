// ─── Types ────────────────────────────────────────────────────────────────────

export type NavItem =
  | "dashboard" | "clinic-profile" | "doctors" | "staff" | "schedule"
  | "appointments" | "patients" | "patient-queue" | "rooms" | "payments"
  | "reports" | "notifications" | "activity"

export type ApptStatus = "Pending" | "Confirmed" | "Checked In" | "In Progress" | "Completed" | "Cancelled" | "No Show"
export type QueueStatus = "Waiting" | "Checked In" | "In Consultation" | "Completed" | "No Show"
export type RoomStatus = "Available" | "Occupied" | "Reserved" | "Maintenance"
export type StaffStatus = "Active" | "Inactive"
export type DoctorStatus = "Active" | "On Leave" | "Inactive"

// ─── Mock Data ────────────────────────────────────────────────────────────────

export const DOCTORS = [
  { id: "D001", name: "Dr. Sarah Mitchell", specialty: "Cardiology", experience: "14 yrs", schedule: "Mon-Fri, 9am-5pm", appointments: 8, status: "Active" as DoctorStatus, avatar: "SM", color: "#1E40AF" },
  { id: "D002", name: "Dr. James Okafor", specialty: "General Practice", experience: "9 yrs", schedule: "Mon-Sat, 8am-4pm", appointments: 12, status: "Active" as DoctorStatus, avatar: "JO", color: "#065F46" },
  { id: "D003", name: "Dr. Priya Nair", specialty: "Pediatrics", experience: "7 yrs", schedule: "Tue-Sat, 10am-6pm", appointments: 5, status: "Active" as DoctorStatus, avatar: "PN", color: "#7C3AED" },
  { id: "D004", name: "Dr. Elena Torres", specialty: "Dermatology", experience: "11 yrs", schedule: "Mon-Thu, 9am-3pm", appointments: 0, status: "On Leave" as DoctorStatus, avatar: "ET", color: "#B45309" },
  { id: "D005", name: "Dr. Marcus Webb", specialty: "Orthopedics", experience: "16 yrs", schedule: "Wed-Fri, 11am-7pm", appointments: 6, status: "Active" as DoctorStatus, avatar: "MW", color: "#DC2626" },
]

export const STAFF = [
  { id: "S001", name: "Angela Brooks", role: "Receptionist", email: "angela.brooks@greenpine.health", phone: "+1 (555) 201-4432", status: "Active" as StaffStatus, permissions: ["Appointments", "Check-in", "Payments"], lastActive: "Today, 10:22 AM" },
  { id: "S002", name: "Kevin Flores", role: "Receptionist", email: "kevin.flores@greenpine.health", phone: "+1 (555) 201-7831", status: "Active" as StaffStatus, permissions: ["Appointments", "Check-in"], lastActive: "Today, 9:45 AM" },
  { id: "S003", name: "Maria Santos", role: "Support Staff", email: "maria.santos@greenpine.health", phone: "+1 (555) 201-3310", status: "Active" as StaffStatus, permissions: ["Rooms", "Scheduling"], lastActive: "Today, 11:05 AM" },
  { id: "S004", name: "David Kim", role: "Support Staff", email: "david.kim@greenpine.health", phone: "+1 (555) 201-9902", status: "Inactive" as StaffStatus, permissions: ["Rooms"], lastActive: "Aug 10, 2026" },
]

export const APPOINTMENTS = [
  { id: "APT-1041", patient: "Robert Chen", doctor: "Dr. Sarah Mitchell", date: "Aug 13, 2026", time: "09:00 AM", room: "Room 2", type: "Follow-up", payStatus: "Paid", status: "Completed" as ApptStatus },
  { id: "APT-1042", patient: "Linda Park", doctor: "Dr. James Okafor", date: "Aug 13, 2026", time: "09:30 AM", room: "Room 4", type: "Consultation", payStatus: "Paid", status: "Completed" as ApptStatus },
  { id: "APT-1043", patient: "Oscar Ruiz", doctor: "Dr. Priya Nair", date: "Aug 13, 2026", time: "10:00 AM", room: "Room 1", type: "Pediatric Check", payStatus: "Paid", status: "In Progress" as ApptStatus },
  { id: "APT-1044", patient: "Hannah Scott", doctor: "Dr. Marcus Webb", date: "Aug 13, 2026", time: "10:30 AM", room: "Room 3", type: "Consultation", payStatus: "Unpaid", status: "Checked In" as ApptStatus },
  { id: "APT-1045", patient: "Tom Bradley", doctor: "Dr. Sarah Mitchell", date: "Aug 13, 2026", time: "11:00 AM", room: "Room 2", type: "Follow-up", payStatus: "Unpaid", status: "Confirmed" as ApptStatus },
  { id: "APT-1046", patient: "Nadia Coleman", doctor: "Dr. James Okafor", date: "Aug 13, 2026", time: "11:30 AM", room: "Room 4", type: "New Patient", payStatus: "Unpaid", status: "Pending" as ApptStatus },
  { id: "APT-1047", patient: "Eric Walsh", doctor: "Dr. Priya Nair", date: "Aug 13, 2026", time: "12:00 PM", room: "—", type: "Pediatric Check", payStatus: "Unpaid", status: "Pending" as ApptStatus },
  { id: "APT-1048", patient: "Grace Huang", doctor: "Dr. Marcus Webb", date: "Aug 13, 2026", time: "09:00 AM", room: "Room 3", type: "Consultation", payStatus: "Refunded", status: "Cancelled" as ApptStatus },
]

export const PATIENTS = [
  { id: "P001", name: "Robert Chen", doctor: "Dr. Sarah Mitchell", lastVisit: "Aug 6, 2026", nextAppt: "Aug 20, 2026", status: "Active" },
  { id: "P002", name: "Linda Park", doctor: "Dr. James Okafor", lastVisit: "Aug 13, 2026", nextAppt: "Sep 3, 2026", status: "Active" },
  { id: "P003", name: "Oscar Ruiz", doctor: "Dr. Priya Nair", lastVisit: "Jul 22, 2026", nextAppt: "Aug 13, 2026", status: "Active" },
  { id: "P004", name: "Hannah Scott", doctor: "Dr. Marcus Webb", lastVisit: "Jul 30, 2026", nextAppt: "Aug 13, 2026", status: "Active" },
  { id: "P005", name: "Tom Bradley", doctor: "Dr. Sarah Mitchell", lastVisit: "Aug 1, 2026", nextAppt: "Aug 13, 2026", status: "Active" },
  { id: "P006", name: "Grace Huang", doctor: "Dr. Marcus Webb", lastVisit: "Aug 13, 2026", nextAppt: "—", status: "Inactive" },
  { id: "P007", name: "Nadia Coleman", doctor: "Dr. James Okafor", lastVisit: "—", nextAppt: "Aug 13, 2026", status: "New" },
]

export const QUEUE = [
  { q: 1, patient: "Oscar Ruiz", doctor: "Dr. Priya Nair", time: "10:00 AM", waiting: "18 min", status: "In Consultation" as QueueStatus },
  { q: 2, patient: "Hannah Scott", doctor: "Dr. Marcus Webb", time: "10:30 AM", waiting: "12 min", status: "Checked In" as QueueStatus },
  { q: 3, patient: "Tom Bradley", doctor: "Dr. Sarah Mitchell", time: "11:00 AM", waiting: "—", status: "Waiting" as QueueStatus },
  { q: 4, patient: "Nadia Coleman", doctor: "Dr. James Okafor", time: "11:30 AM", waiting: "—", status: "Waiting" as QueueStatus },
  { q: 5, patient: "Eric Walsh", doctor: "Dr. Priya Nair", time: "12:00 PM", waiting: "—", status: "Waiting" as QueueStatus },
  { q: 6, patient: "Robert Chen", doctor: "Dr. Sarah Mitchell", time: "09:00 AM", waiting: "—", status: "Completed" as QueueStatus },
]

export const ROOMS = [
  { id: "R1", name: "Room 1", doctor: "Dr. Priya Nair", patient: "Oscar Ruiz", status: "Occupied" as RoomStatus, type: "Consultation" },
  { id: "R2", name: "Room 2", doctor: "Dr. Sarah Mitchell", patient: "—", status: "Reserved" as RoomStatus, type: "Consultation" },
  { id: "R3", name: "Room 3", doctor: "Dr. Marcus Webb", patient: "Hannah Scott", status: "Occupied" as RoomStatus, type: "Consultation" },
  { id: "R4", name: "Room 4", doctor: "Dr. James Okafor", patient: "—", status: "Available" as RoomStatus, type: "Consultation" },
  { id: "R5", name: "Room 5", doctor: "—", patient: "—", status: "Maintenance" as RoomStatus, type: "Procedure" },
  { id: "R6", name: "Room 6", doctor: "—", patient: "—", status: "Available" as RoomStatus, type: "Consultation" },
]

export const NOTIFICATIONS = [
  { id: 1, type: "new-appt", title: "New Appointment", message: "Nadia Coleman booked a consultation with Dr. James Okafor for 11:30 AM.", time: "10 min ago", read: false },
  { id: 2, type: "checkin", title: "Patient Checked In", message: "Hannah Scott has checked in for her 10:30 AM appointment with Dr. Marcus Webb.", time: "22 min ago", read: false },
  { id: 3, type: "cancel", title: "Appointment Cancelled", message: "Grace Huang cancelled APT-1048 with Dr. Marcus Webb. Refund initiated.", time: "1 hr ago", read: false },
  { id: 4, type: "leave", title: "Doctor Leave Request", message: "Dr. Elena Torres has requested leave from Aug 14–18. Pending approval.", time: "2 hrs ago", read: true },
  { id: 5, type: "schedule", title: "Schedule Change", message: "Dr. James Okafor updated working hours for next week (Mon–Fri, 9am–5pm).", time: "3 hrs ago", read: true },
  { id: 6, type: "staff", title: "Staff Update", message: "David Kim's account has been deactivated by manager.", time: "Yesterday", read: true },
]

export const ACTIVITY = [
  { id: 1, action: "Appointment Rescheduled", detail: "APT-1039 moved from Aug 12 to Aug 13 by Angela Brooks", time: "10:05 AM", user: "Angela Brooks", type: "appointment" },
  { id: 2, action: "Room Assigned", detail: "Room 3 assigned to Dr. Marcus Webb for APT-1044", time: "10:02 AM", user: "Kevin Flores", type: "room" },
  { id: 3, action: "Patient Checked In", detail: "Hannah Scott checked in for APT-1044", time: "09:58 AM", user: "Kevin Flores", type: "checkin" },
  { id: 4, action: "Schedule Updated", detail: "Dr. James Okafor's consultation slots modified for Aug 15", time: "09:30 AM", user: "Manager", type: "schedule" },
  { id: 5, action: "Appointment Cancelled", detail: "APT-1048 cancelled — Grace Huang. Refund processed.", time: "08:55 AM", user: "Angela Brooks", type: "cancel" },
  { id: 6, action: "Staff Deactivated", detail: "David Kim's account deactivated", time: "Yesterday 4:30 PM", user: "Manager", type: "staff" },
  { id: 7, action: "Room Maintenance", detail: "Room 5 set to Maintenance by Maria Santos", time: "Yesterday 2:10 PM", user: "Maria Santos", type: "room" },
]

export const PAYMENTS = [
  { id: "PAY-0891", patient: "Robert Chen", doctor: "Dr. Sarah Mitchell", amount: "$120", type: "Consultation", date: "Aug 13, 2026", status: "Paid" },
  { id: "PAY-0892", patient: "Linda Park", doctor: "Dr. James Okafor", amount: "$95", type: "Follow-up", date: "Aug 13, 2026", status: "Paid" },
  { id: "PAY-0893", patient: "Oscar Ruiz", doctor: "Dr. Priya Nair", amount: "$110", type: "Pediatric", date: "Aug 13, 2026", status: "Paid" },
  { id: "PAY-0894", patient: "Grace Huang", doctor: "Dr. Marcus Webb", amount: "$140", type: "Consultation", date: "Aug 13, 2026", status: "Refunded" },
  { id: "PAY-0895", patient: "Hannah Scott", doctor: "Dr. Marcus Webb", amount: "$140", type: "Consultation", date: "Aug 13, 2026", status: "Pending" },
]
