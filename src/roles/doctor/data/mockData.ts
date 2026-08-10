export const doctorProfile = {
  id: "DOC-001",
  name: "Dr. Sarah Mitchell",
  avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=120&h=120&fit=crop&auto=format",
  specialty: "Cardiologist",
  qualifications: ["MBBS", "MD (Cardiology)", "FACC"],
  experience: "12 years",
  consultationFee: 150,
  rating: 4.8,
  totalPatients: 1247,
  registrationNumber: "MCI-12345",
  email: "sarah.mitchell@medcare.com",
  phone: "+1 (555) 234-5678",
  clinicName: "Mitchell Cardiac Center",
  clinicAddress: "420 Medical Drive, Suite 300, Boston, MA 02115",
  about: "Board-certified cardiologist specializing in preventive cardiology, heart failure management, and interventional procedures. Graduate of Harvard Medical School with fellowship training at Johns Hopkins.",
};

export const todayAppointments = [
  { id: "APT-1001", patient: "James Harrington", age: 52, avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=48&h=48&fit=crop&auto=format", time: "09:00 AM", type: "In-Person", status: "completed", reason: "Cardiac Check-Up" },
  { id: "APT-1002", patient: "Maria Santos", age: 38, avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=48&h=48&fit=crop&auto=format", time: "10:00 AM", type: "Online", status: "in-progress", reason: "Follow-Up" },
  { id: "APT-1003", patient: "Robert Chen", age: 61, avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=48&h=48&fit=crop&auto=format", time: "11:30 AM", type: "In-Person", status: "confirmed", reason: "Hypertension Review" },
  { id: "APT-1004", patient: "Emily Watson", age: 44, avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=48&h=48&fit=crop&auto=format", time: "02:00 PM", type: "Online", status: "confirmed", reason: "ECG Results" },
  { id: "APT-1005", patient: "David Kim", age: 55, avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=48&h=48&fit=crop&auto=format", time: "03:30 PM", type: "In-Person", status: "pending", reason: "First Consultation" },
  { id: "APT-1006", patient: "Linda Foster", age: 67, avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=48&h=48&fit=crop&auto=format", time: "04:30 PM", type: "In-Person", status: "pending", reason: "Stress Test Review" },
];

type AppointmentSeed = (typeof todayAppointments)[number] & {
  date?: string;
};

const appointmentSeeds: AppointmentSeed[] = [
  ...todayAppointments,
  { id: "APT-1007", patient: "Michael Torres", age: 48, avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=48&h=48&fit=crop&auto=format", time: "09:30 AM", type: "In-Person", status: "cancelled", reason: "Annual Check-Up", date: "2026-08-09" },
  { id: "APT-1008", patient: "Susan Park", age: 35, avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=48&h=48&fit=crop&auto=format", time: "11:00 AM", type: "Online", status: "no-show", reason: "Medication Review", date: "2026-08-09" },
  { id: "APT-1009", patient: "George Williams", age: 71, avatar: "https://images.unsplash.com/photo-1553529706-7c8aa2bf6d4a?w=48&h=48&fit=crop&auto=format", time: "10:00 AM", type: "In-Person", status: "confirmed", reason: "Heart Failure Follow-Up", date: "2026-08-11" },
  { id: "APT-1010", patient: "Anna Kovacs", age: 42, avatar: "https://images.unsplash.com/photo-1530785602389-07594beb8b73?w=48&h=48&fit=crop&auto=format", time: "02:30 PM", type: "Online", status: "pending", reason: "Arrhythmia Consult", date: "2026-08-11" },
  { id: "APT-1011", patient: "Thomas Baker", age: 58, avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=48&h=48&fit=crop&auto=format", time: "03:00 PM", type: "In-Person", status: "confirmed", reason: "Post-Surgery Review", date: "2026-08-12" },
  { id: "APT-1012", patient: "Rachel Green", age: 31, avatar: "https://images.unsplash.com/photo-1598550874175-4d0ef436c909?w=48&h=48&fit=crop&auto=format", time: "09:00 AM", type: "In-Person", status: "pending", reason: "First Consultation", date: "2026-08-12" },
];

export const allAppointments = appointmentSeeds.map((a, i) => ({ ...a, date: a.date || "2026-08-10", paymentStatus: i % 3 === 0 ? "pending" : i % 3 === 1 ? "paid" : "refunded" }));

export const patients = [
  { id: "PAT-001", name: "James Harrington", age: 52, gender: "Male", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=48&h=48&fit=crop&auto=format", bloodType: "A+", lastVisit: "2026-08-10", nextAppointment: "2026-09-05", conditions: ["Hypertension", "Coronary Artery Disease"], phone: "+1 (555) 111-2222", email: "james.h@email.com" },
  { id: "PAT-002", name: "Maria Santos", age: 38, gender: "Female", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=48&h=48&fit=crop&auto=format", bloodType: "O-", lastVisit: "2026-08-10", nextAppointment: "2026-08-17", conditions: ["Atrial Fibrillation"], phone: "+1 (555) 222-3333", email: "maria.s@email.com" },
  { id: "PAT-003", name: "Robert Chen", age: 61, gender: "Male", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=48&h=48&fit=crop&auto=format", bloodType: "B+", lastVisit: "2026-07-28", nextAppointment: "2026-08-10", conditions: ["Hypertension", "Type 2 Diabetes", "High Cholesterol"], phone: "+1 (555) 333-4444", email: "robert.c@email.com" },
  { id: "PAT-004", name: "Emily Watson", age: 44, gender: "Female", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=48&h=48&fit=crop&auto=format", bloodType: "AB+", lastVisit: "2026-07-15", nextAppointment: "2026-08-10", conditions: ["Mitral Valve Prolapse"], phone: "+1 (555) 444-5555", email: "emily.w@email.com" },
  { id: "PAT-005", name: "David Kim", age: 55, gender: "Male", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=48&h=48&fit=crop&auto=format", bloodType: "O+", lastVisit: "2026-06-20", nextAppointment: "2026-08-10", conditions: ["Chest Pain (Evaluation)"], phone: "+1 (555) 555-6666", email: "david.k@email.com" },
  { id: "PAT-006", name: "Linda Foster", age: 67, gender: "Female", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=48&h=48&fit=crop&auto=format", bloodType: "A-", lastVisit: "2026-07-30", nextAppointment: "2026-08-10", conditions: ["Heart Failure", "Hypertension", "CKD Stage 3"], phone: "+1 (555) 666-7777", email: "linda.f@email.com" },
  { id: "PAT-007", name: "Michael Torres", age: 48, gender: "Male", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=48&h=48&fit=crop&auto=format", bloodType: "B-", lastVisit: "2026-08-09", nextAppointment: "2026-08-20", conditions: ["Angina"], phone: "+1 (555) 777-8888", email: "michael.t@email.com" },
  { id: "PAT-008", name: "Anna Kovacs", age: 42, gender: "Female", avatar: "https://images.unsplash.com/photo-1530785602389-07594beb8b73?w=48&h=48&fit=crop&auto=format", bloodType: "O+", lastVisit: "2026-07-05", nextAppointment: "2026-08-11", conditions: ["Palpitations", "Anxiety"], phone: "+1 (555) 888-9999", email: "anna.k@email.com" },
];

export const earningsData = {
  today: 450,
  weekly: 2850,
  monthly: 11200,
  total: 142800,
  commission: 1120,
  pendingPayout: 3200,
  chartData: [
    { month: "Mar", earnings: 8400 },
    { month: "Apr", earnings: 9200 },
    { month: "May", earnings: 10100 },
    { month: "Jun", earnings: 9600 },
    { month: "Jul", earnings: 10800 },
    { month: "Aug", earnings: 11200 },
  ],
  transactions: [
    { id: "TXN-501", patient: "James Harrington", date: "2026-08-10", amount: 150, type: "In-Person", status: "completed" },
    { id: "TXN-502", patient: "Maria Santos", date: "2026-08-10", amount: 120, type: "Online", status: "completed" },
    { id: "TXN-503", patient: "Robert Chen", date: "2026-08-10", amount: 150, type: "In-Person", status: "pending" },
    { id: "TXN-504", patient: "Emily Watson", date: "2026-08-09", amount: 120, type: "Online", status: "completed" },
    { id: "TXN-505", patient: "Michael Torres", date: "2026-08-09", amount: 150, type: "In-Person", status: "refunded" },
    { id: "TXN-506", patient: "Linda Foster", date: "2026-08-08", amount: 150, type: "In-Person", status: "completed" },
  ],
};

export const reviews = [
  { id: "REV-001", patient: "James Harrington", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&auto=format", rating: 5, date: "2026-08-08", comment: "Dr. Mitchell is exceptional. She took the time to explain every detail of my condition and treatment plan. Very professional and caring.", replied: false },
  { id: "REV-002", patient: "Maria Santos", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&auto=format", rating: 5, date: "2026-08-05", comment: "Best cardiologist I've ever seen. The online consultation was smooth and she was incredibly thorough.", replied: true, reply: "Thank you, Maria! It was a pleasure working with you." },
  { id: "REV-003", patient: "Robert Chen", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&auto=format", rating: 4, date: "2026-07-30", comment: "Very knowledgeable doctor. Wait time was a bit long but the consultation itself was excellent.", replied: false },
  { id: "REV-004", patient: "Emily Watson", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop&auto=format", rating: 5, date: "2026-07-25", comment: "Dr. Mitchell diagnosed my condition that two other doctors missed. Forever grateful.", replied: true, reply: "Thank you for trusting me with your care, Emily. I'm glad we found the right diagnosis!" },
  { id: "REV-005", patient: "David Kim", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&auto=format", rating: 4, date: "2026-07-20", comment: "Professional and thorough. Explained everything clearly. Would recommend.", replied: false },
  { id: "REV-006", patient: "Linda Foster", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=40&h=40&fit=crop&auto=format", rating: 5, date: "2026-07-15", comment: "Wonderful doctor. Very attentive to an elderly patient. Made me feel very comfortable.", replied: false },
];

export const notifications = [
  { id: "N-001", type: "appointment", title: "New Appointment Request", message: "David Kim has requested an appointment for Aug 10 at 3:30 PM", time: "10 min ago", read: false },
  { id: "N-002", type: "reminder", title: "Appointment Reminder", message: "You have a consultation with Maria Santos in 30 minutes", time: "30 min ago", read: false },
  { id: "N-003", type: "cancellation", title: "Appointment Cancelled", message: "Michael Torres cancelled their appointment for Aug 9", time: "2 hours ago", read: false },
  { id: "N-004", type: "reschedule", title: "Reschedule Request", message: "Susan Park requested to reschedule their Aug 9 appointment", time: "3 hours ago", read: true },
  { id: "N-005", type: "payment", title: "Payout Processed", message: "Your weekly payout of $2,850 has been transferred to your bank account", time: "Yesterday", read: true },
  { id: "N-006", type: "message", title: "Patient Message", message: "Anna Kovacs sent you a message about her symptoms", time: "Yesterday", read: true },
  { id: "N-007", type: "review", title: "New Review", message: "James Harrington left you a 5-star review", time: "2 days ago", read: true },
];

export const weeklySchedule = {
  Monday: { enabled: true, start: "09:00", end: "17:00", breakStart: "13:00", breakEnd: "14:00" },
  Tuesday: { enabled: true, start: "09:00", end: "17:00", breakStart: "13:00", breakEnd: "14:00" },
  Wednesday: { enabled: true, start: "09:00", end: "13:00", breakStart: "", breakEnd: "" },
  Thursday: { enabled: true, start: "09:00", end: "17:00", breakStart: "13:00", breakEnd: "14:00" },
  Friday: { enabled: true, start: "09:00", end: "15:00", breakStart: "12:00", breakEnd: "13:00" },
  Saturday: { enabled: false, start: "", end: "", breakStart: "", breakEnd: "" },
  Sunday: { enabled: false, start: "", end: "", breakStart: "", breakEnd: "" },
};

export const prescriptions = [
  {
    id: "RX-001",
    patient: "James Harrington",
    date: "2026-08-10",
    medicines: [
      { name: "Lisinopril", dosage: "10mg", frequency: "Once daily", duration: "90 days", instructions: "Take in the morning with water" },
      { name: "Atorvastatin", dosage: "40mg", frequency: "Once daily at bedtime", duration: "90 days", instructions: "Avoid grapefruit juice" },
      { name: "Aspirin", dosage: "81mg", frequency: "Once daily", duration: "Ongoing", instructions: "Take with food" },
    ],
    notes: "Monitor blood pressure weekly. Return in 3 months for follow-up labs.",
    status: "active",
  },
  {
    id: "RX-002",
    patient: "Maria Santos",
    date: "2026-08-10",
    medicines: [
      { name: "Metoprolol", dosage: "25mg", frequency: "Twice daily", duration: "30 days", instructions: "Do not stop abruptly" },
      { name: "Warfarin", dosage: "5mg", frequency: "Once daily", duration: "Ongoing", instructions: "INR monitoring every 2 weeks" },
    ],
    notes: "Strict INR monitoring required. Avoid foods high in Vitamin K.",
    status: "active",
  },
];
