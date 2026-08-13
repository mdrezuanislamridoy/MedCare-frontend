export type TicketStatus = 'Open' | 'In Progress' | 'Waiting for User' | 'Resolved' | 'Closed';
export type TicketPriority = 'Low' | 'Medium' | 'High' | 'Urgent';
export type TicketCategory = 'Appointment' | 'Payment' | 'Account' | 'Doctor' | 'Technical' | 'General';

export interface Ticket {
  id: string;
  patient: string;
  patientId: string;
  subject: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  assignedStaff: string;
  createdDate: string;
  updatedDate: string;
  description: string;
}

export interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  accountStatus: 'Active' | 'Inactive' | 'Suspended';
  registeredDate: string;
  lastActivity: string;
  recentAppointments: { date: string; doctor: string; status: string }[];
  supportHistory: { ticketId: string; subject: string; status: TicketStatus; date: string }[];
}

export interface Appointment {
  id: string;
  patient: string;
  patientId: string;
  doctor: string;
  specialty: string;
  date: string;
  time: string;
  status: 'Scheduled' | 'Confirmed' | 'Pending Reschedule' | 'Cancelled' | 'Completed' | 'No Show';
  issueFlag: boolean;
  issueType?: string;
  clinic: string;
}

export interface Complaint {
  id: string;
  patient: string;
  patientId: string;
  category: string;
  relatedDoctor: string;
  clinic: string;
  priority: TicketPriority;
  status: 'New' | 'Under Investigation' | 'Responded' | 'Resolved' | 'Escalated';
  createdDate: string;
  description: string;
}

export interface Message {
  id: string;
  patient: string;
  patientId: string;
  lastMessage: string;
  lastMessageTime: string;
  status: 'Open' | 'Pending Reply' | 'Resolved';
  priority: TicketPriority;
  assignedStaff: string;
  unreadCount: number;
  messages: { sender: 'patient' | 'staff'; text: string; time: string }[];
}

export interface Notification {
  id: string;
  type: 'ticket' | 'escalation' | 'appointment' | 'reply' | 'complaint' | 'system';
  title: string;
  description: string;
  time: string;
  read: boolean;
  priority: 'normal' | 'urgent';
}

export interface ActivityItem {
  id: string;
  staff: string;
  action: string;
  target: string;
  targetId: string;
  time: string;
  type: 'ticket' | 'patient' | 'appointment' | 'complaint' | 'escalation' | 'message';
}

export const tickets: Ticket[] = [
  { id: 'TKT-1041', patient: 'Maria Santos', patientId: 'PAT-3821', subject: 'Unable to reschedule appointment online', category: 'Appointment', priority: 'High', status: 'Open', assignedStaff: 'Alex Chen', createdDate: '2026-08-13', updatedDate: '2026-08-13', description: 'Patient reports the reschedule button is not working on the patient portal. She has tried both Chrome and Safari.' },
  { id: 'TKT-1040', patient: 'James Okafor', patientId: 'PAT-2104', subject: 'Payment receipt not received', category: 'Payment', priority: 'Medium', status: 'In Progress', assignedStaff: 'Sara Kim', createdDate: '2026-08-12', updatedDate: '2026-08-13', description: 'Patient made payment for consultation on Aug 10 but has not received an email receipt. Payment was confirmed by bank.' },
  { id: 'TKT-1039', patient: 'Linda Park', patientId: 'PAT-5503', subject: 'Doctor cancelled appointment without notice', category: 'Doctor', priority: 'Urgent', status: 'Open', assignedStaff: 'Alex Chen', createdDate: '2026-08-12', updatedDate: '2026-08-12', description: 'Patient says appointment was cancelled 2 hours before scheduled time with no communication. She had taken time off work.' },
  { id: 'TKT-1038', patient: 'Carlos Rivera', patientId: 'PAT-1892', subject: 'Login 2FA not working', category: 'Technical', priority: 'High', status: 'Waiting for User', assignedStaff: 'Mark Davis', createdDate: '2026-08-11', updatedDate: '2026-08-13', description: 'Patient is unable to receive 2FA codes. IT team reset 2FA and asked patient to re-enroll. Waiting on confirmation.' },
  { id: 'TKT-1037', patient: 'Priya Patel', patientId: 'PAT-4417', subject: 'Wrong doctor assigned to appointment', category: 'Appointment', priority: 'High', status: 'In Progress', assignedStaff: 'Sara Kim', createdDate: '2026-08-11', updatedDate: '2026-08-12', description: 'Patient booked with Dr. Wilson (Cardiology) but was assigned to Dr. Martinez (General Practice).' },
  { id: 'TKT-1036', patient: 'Tom Hughes', patientId: 'PAT-6601', subject: 'Account name change request', category: 'Account', priority: 'Low', status: 'Resolved', assignedStaff: 'Mark Davis', createdDate: '2026-08-10', updatedDate: '2026-08-11', description: 'Patient requests name update following legal name change. Documentation verified and forwarded to admin.' },
  { id: 'TKT-1035', patient: 'Ana Gomez', patientId: 'PAT-2278', subject: 'Appointment confirmation not sent', category: 'Appointment', priority: 'Medium', status: 'Resolved', assignedStaff: 'Alex Chen', createdDate: '2026-08-10', updatedDate: '2026-08-10', description: 'Patient booked appointment but did not receive confirmation email. Manually triggered resend — confirmed received.' },
  { id: 'TKT-1034', patient: 'David Nguyen', patientId: 'PAT-3390', subject: 'General inquiry about services', category: 'General', priority: 'Low', status: 'Closed', assignedStaff: 'Sara Kim', createdDate: '2026-08-09', updatedDate: '2026-08-09', description: 'Patient asked about available specialties. Provided information and links to service pages.' },
  { id: 'TKT-1033', patient: 'Fatima Al-Rashid', patientId: 'PAT-7712', subject: 'Appointment video link not working', category: 'Technical', priority: 'Urgent', status: 'Open', assignedStaff: 'Mark Davis', createdDate: '2026-08-13', updatedDate: '2026-08-13', description: 'Patient cannot connect to telehealth session scheduled in 30 minutes. Link returns 404 error.' },
  { id: 'TKT-1032', patient: 'Robert Chang', patientId: 'PAT-8834', subject: 'Duplicate charge on account', category: 'Payment', priority: 'High', status: 'Open', assignedStaff: 'Alex Chen', createdDate: '2026-08-13', updatedDate: '2026-08-13', description: 'Patient was charged twice for the same appointment. Bank statements provided. Needs escalation to billing.' },
];

export const patients: Patient[] = [
  {
    id: 'PAT-3821', name: 'Maria Santos', email: 'maria.santos@email.com', phone: '+1 (555) 234-5678',
    accountStatus: 'Active', registeredDate: '2024-03-15', lastActivity: '2026-08-13',
    recentAppointments: [
      { date: '2026-08-10', doctor: 'Dr. Emily Carter', status: 'Completed' },
      { date: '2026-08-20', doctor: 'Dr. James Wilson', status: 'Scheduled' },
    ],
    supportHistory: [
      { ticketId: 'TKT-1041', subject: 'Unable to reschedule appointment online', status: 'Open', date: '2026-08-13' },
      { ticketId: 'TKT-0998', subject: 'Password reset assistance', status: 'Resolved', date: '2026-06-02' },
    ],
  },
  {
    id: 'PAT-2104', name: 'James Okafor', email: 'j.okafor@email.com', phone: '+1 (555) 891-2345',
    accountStatus: 'Active', registeredDate: '2023-11-20', lastActivity: '2026-08-12',
    recentAppointments: [
      { date: '2026-08-10', doctor: 'Dr. Sarah Lee', status: 'Completed' },
    ],
    supportHistory: [
      { ticketId: 'TKT-1040', subject: 'Payment receipt not received', status: 'In Progress', date: '2026-08-12' },
    ],
  },
  {
    id: 'PAT-5503', name: 'Linda Park', email: 'linda.park@email.com', phone: '+1 (555) 456-7890',
    accountStatus: 'Active', registeredDate: '2025-01-08', lastActivity: '2026-08-12',
    recentAppointments: [
      { date: '2026-08-12', doctor: 'Dr. Michael Brown', status: 'Cancelled' },
      { date: '2026-08-25', doctor: 'Dr. Michael Brown', status: 'Scheduled' },
    ],
    supportHistory: [
      { ticketId: 'TKT-1039', subject: 'Doctor cancelled appointment without notice', status: 'Open', date: '2026-08-12' },
    ],
  },
  {
    id: 'PAT-7712', name: 'Fatima Al-Rashid', email: 'f.alrashid@email.com', phone: '+1 (555) 123-9876',
    accountStatus: 'Active', registeredDate: '2025-06-14', lastActivity: '2026-08-13',
    recentAppointments: [
      { date: '2026-08-13', doctor: 'Dr. Aisha Nwosu', status: 'Scheduled' },
    ],
    supportHistory: [
      { ticketId: 'TKT-1033', subject: 'Appointment video link not working', status: 'Open', date: '2026-08-13' },
    ],
  },
];

export const appointments: Appointment[] = [
  { id: 'APT-8812', patient: 'Fatima Al-Rashid', patientId: 'PAT-7712', doctor: 'Dr. Aisha Nwosu', specialty: 'Cardiology', date: '2026-08-13', time: '2:30 PM', status: 'Scheduled', issueFlag: true, issueType: 'Video link error', clinic: 'City Medical Center' },
  { id: 'APT-8810', patient: 'Linda Park', patientId: 'PAT-5503', doctor: 'Dr. Michael Brown', specialty: 'Orthopedics', date: '2026-08-12', time: '10:00 AM', status: 'Cancelled', issueFlag: true, issueType: 'Doctor-cancelled, no notice', clinic: 'Downtown Clinic' },
  { id: 'APT-8809', patient: 'Priya Patel', patientId: 'PAT-4417', doctor: 'Dr. Martinez', specialty: 'General Practice', date: '2026-08-14', time: '9:00 AM', status: 'Pending Reschedule', issueFlag: true, issueType: 'Wrong doctor assigned', clinic: 'City Medical Center' },
  { id: 'APT-8807', patient: 'Maria Santos', patientId: 'PAT-3821', doctor: 'Dr. James Wilson', specialty: 'Cardiology', date: '2026-08-20', time: '11:00 AM', status: 'Scheduled', issueFlag: false, clinic: 'Westside Health' },
  { id: 'APT-8804', patient: 'Carlos Rivera', patientId: 'PAT-1892', doctor: 'Dr. Patel', specialty: 'Neurology', date: '2026-08-15', time: '3:00 PM', status: 'Confirmed', issueFlag: false, clinic: 'City Medical Center' },
  { id: 'APT-8800', patient: 'Ana Gomez', patientId: 'PAT-2278', doctor: 'Dr. Emily Carter', specialty: 'Dermatology', date: '2026-08-16', time: '1:00 PM', status: 'Scheduled', issueFlag: false, clinic: 'Downtown Clinic' },
  { id: 'APT-8798', patient: 'James Okafor', patientId: 'PAT-2104', doctor: 'Dr. Sarah Lee', specialty: 'ENT', date: '2026-08-10', time: '9:30 AM', status: 'Completed', issueFlag: false, clinic: 'Westside Health' },
  { id: 'APT-8791', patient: 'David Nguyen', patientId: 'PAT-3390', doctor: 'Dr. Thomas Reed', specialty: 'Psychiatry', date: '2026-08-18', time: '4:00 PM', status: 'Scheduled', issueFlag: false, clinic: 'City Medical Center' },
];

export const complaints: Complaint[] = [
  { id: 'CMP-0512', patient: 'Linda Park', patientId: 'PAT-5503', category: 'Doctor Conduct', relatedDoctor: 'Dr. Michael Brown', clinic: 'Downtown Clinic', priority: 'Urgent', status: 'Under Investigation', createdDate: '2026-08-12', description: 'Patient reports appointment was cancelled 2 hours before scheduled time with no communication or rescheduling assistance offered.' },
  { id: 'CMP-0511', patient: 'Robert Chang', patientId: 'PAT-8834', category: 'Billing Error', relatedDoctor: 'N/A', clinic: 'City Medical Center', priority: 'High', status: 'Escalated', createdDate: '2026-08-13', description: 'Patient was charged twice for the same consultation. Requires billing department review and refund processing.' },
  { id: 'CMP-0510', patient: 'Priya Patel', patientId: 'PAT-4417', category: 'Appointment Error', relatedDoctor: 'Dr. Martinez', clinic: 'City Medical Center', priority: 'High', status: 'New', createdDate: '2026-08-11', description: 'Patient booked with a cardiologist but was assigned to a general practitioner without notification or explanation.' },
  { id: 'CMP-0509', patient: 'Sophie Turner', patientId: 'PAT-9102', category: 'Staff Conduct', relatedDoctor: 'N/A', clinic: 'Westside Health', priority: 'Medium', status: 'Responded', createdDate: '2026-08-09', description: 'Patient reported rude interaction with front-desk staff when attempting to check in for appointment.' },
  { id: 'CMP-0508', patient: 'Marcus Johnson', patientId: 'PAT-6623', category: 'Wait Time', relatedDoctor: 'Dr. Lee', clinic: 'Downtown Clinic', priority: 'Low', status: 'Resolved', createdDate: '2026-08-07', description: 'Patient waited over 90 minutes past scheduled appointment time with no updates from clinic staff.' },
];

export const messages: Message[] = [
  {
    id: 'MSG-2201', patient: 'Fatima Al-Rashid', patientId: 'PAT-7712', lastMessage: 'The link still is not working. My appointment is in 15 minutes!', lastMessageTime: '2:15 PM', status: 'Open', priority: 'Urgent', assignedStaff: 'Alex Chen', unreadCount: 3,
    messages: [
      { sender: 'patient', text: 'Hello, my video appointment link is giving me a 404 error.', time: '1:58 PM' },
      { sender: 'staff', text: 'Hi Fatima, I am looking into this right now. Can you confirm which browser you are using?', time: '2:02 PM' },
      { sender: 'patient', text: 'I tried Chrome and Firefox. Both show the same error.', time: '2:08 PM' },
      { sender: 'staff', text: 'Thank you. I have escalated this to our technical team. They are generating a new link now.', time: '2:11 PM' },
      { sender: 'patient', text: 'The link still is not working. My appointment is in 15 minutes!', time: '2:15 PM' },
    ],
  },
  {
    id: 'MSG-2200', patient: 'Maria Santos', patientId: 'PAT-3821', lastMessage: 'Thank you for your help! I can see the reschedule button now.', lastMessageTime: '11:42 AM', status: 'Resolved', priority: 'Medium', assignedStaff: 'Sara Kim', unreadCount: 0,
    messages: [
      { sender: 'patient', text: 'Hi, I cannot seem to find the reschedule option on my appointments page.', time: '10:30 AM' },
      { sender: 'staff', text: 'Hello Maria! The reschedule option appears 72+ hours before the appointment. Your next appointment is on Aug 20, so it should be available now. Let me check your account.', time: '10:35 AM' },
      { sender: 'patient', text: 'Thank you for your help! I can see the reschedule button now.', time: '11:42 AM' },
    ],
  },
  {
    id: 'MSG-2199', patient: 'James Okafor', patientId: 'PAT-2104', lastMessage: 'I checked my spam folder but nothing there either.', lastMessageTime: '9:20 AM', status: 'Pending Reply', priority: 'Medium', assignedStaff: 'Mark Davis', unreadCount: 1,
    messages: [
      { sender: 'patient', text: 'I paid for my consultation on Aug 10 but never got a receipt.', time: '9:00 AM' },
      { sender: 'staff', text: 'Hello James, I can see your payment was processed. The receipt should have gone to j.okafor@email.com. Can you check your spam folder?', time: '9:15 AM' },
      { sender: 'patient', text: 'I checked my spam folder but nothing there either.', time: '9:20 AM' },
    ],
  },
  {
    id: 'MSG-2198', patient: 'Carlos Rivera', patientId: 'PAT-1892', lastMessage: 'Got it. I will try to re-enroll the 2FA tonight.', lastMessageTime: 'Yesterday', status: 'Pending Reply', priority: 'High', assignedStaff: 'Sara Kim', unreadCount: 0,
    messages: [
      { sender: 'patient', text: 'I cannot log in. The 2FA code is not arriving on my phone.', time: 'Yesterday 3:00 PM' },
      { sender: 'staff', text: 'Hi Carlos, our IT team has reset your 2FA. Please visit the login page and select "Re-enroll authenticator" to set it up again.', time: 'Yesterday 4:30 PM' },
      { sender: 'patient', text: 'Got it. I will try to re-enroll the 2FA tonight.', time: 'Yesterday 5:00 PM' },
    ],
  },
];

export const notifications: Notification[] = [
  { id: 'N-001', type: 'escalation', title: 'Ticket escalated to admin', description: 'TKT-1032 (Duplicate charge) has been escalated to Admin by Mark Davis.', time: '10 min ago', read: false, priority: 'urgent' },
  { id: 'N-002', type: 'ticket', title: 'New urgent ticket', description: 'TKT-1033 opened by Fatima Al-Rashid — video link not working for appointment in 30 min.', time: '25 min ago', read: false, priority: 'urgent' },
  { id: 'N-003', type: 'reply', title: 'Patient replied to MSG-2201', description: 'Fatima Al-Rashid: "The link still is not working. My appointment is in 15 minutes!"', time: '30 min ago', read: false, priority: 'urgent' },
  { id: 'N-004', type: 'appointment', title: 'Appointment issue flagged', description: 'APT-8810 for Linda Park has been flagged — doctor cancelled without patient notification.', time: '2 hr ago', read: false, priority: 'normal' },
  { id: 'N-005', type: 'complaint', title: 'New complaint submitted', description: 'CMP-0512 filed by Linda Park regarding doctor conduct (Dr. Michael Brown).', time: '2 hr ago', read: true, priority: 'normal' },
  { id: 'N-006', type: 'system', title: 'System maintenance scheduled', description: 'Platform maintenance scheduled for Aug 14, 2026 from 2:00 AM – 4:00 AM EST.', time: '5 hr ago', read: true, priority: 'normal' },
  { id: 'N-007', type: 'ticket', title: 'Ticket assigned to you', description: 'TKT-1039 (Doctor cancelled appointment) has been assigned to you by supervisor.', time: '3 hr ago', read: true, priority: 'normal' },
  { id: 'N-008', type: 'reply', title: 'Patient replied to TKT-1038', description: 'Carlos Rivera responded: "I re-enrolled the 2FA but still cannot login."', time: 'Yesterday', read: true, priority: 'normal' },
];

export const activityLog: ActivityItem[] = [
  { id: 'ACT-501', staff: 'Alex Chen', action: 'Replied to ticket', target: 'TKT-1033', targetId: 'TKT-1033', time: '2:11 PM today', type: 'ticket' },
  { id: 'ACT-500', staff: 'Mark Davis', action: 'Escalated ticket to Admin', target: 'TKT-1032', targetId: 'TKT-1032', time: '10:05 AM today', type: 'escalation' },
  { id: 'ACT-499', staff: 'Sara Kim', action: 'Resolved ticket', target: 'TKT-1035', targetId: 'TKT-1035', time: '9:50 AM today', type: 'ticket' },
  { id: 'ACT-498', staff: 'Alex Chen', action: 'Sent message to patient', target: 'Maria Santos (PAT-3821)', targetId: 'PAT-3821', time: '10:35 AM today', type: 'patient' },
  { id: 'ACT-497', staff: 'Mark Davis', action: 'Flagged appointment issue', target: 'APT-8810', targetId: 'APT-8810', time: '8:30 AM today', type: 'appointment' },
  { id: 'ACT-496', staff: 'Sara Kim', action: 'Initiated complaint investigation', target: 'CMP-0512', targetId: 'CMP-0512', time: '8:00 AM today', type: 'complaint' },
  { id: 'ACT-495', staff: 'Alex Chen', action: 'Assigned ticket to Sara Kim', target: 'TKT-1037', targetId: 'TKT-1037', time: 'Yesterday 4:45 PM', type: 'ticket' },
  { id: 'ACT-494', staff: 'Mark Davis', action: 'Responded to complaint', target: 'CMP-0509', targetId: 'CMP-0509', time: 'Yesterday 3:20 PM', type: 'complaint' },
  { id: 'ACT-493', staff: 'Sara Kim', action: 'Resent appointment confirmation', target: 'James Okafor (PAT-2104)', targetId: 'PAT-2104', time: 'Yesterday 2:00 PM', type: 'patient' },
  { id: 'ACT-492', staff: 'Alex Chen', action: 'Helped reschedule appointment', target: 'APT-8807', targetId: 'APT-8807', time: 'Yesterday 11:30 AM', type: 'appointment' },
];
