export type AppointmentStatus =
  | 'pending'
  | 'payment_pending'
  | 'confirmed'
  | 'checked_in'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'no_show';

export type ConsultationType = 'online' | 'clinic';

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  qualifications: string[];
  experience: number;
  rating: number;
  reviewCount: number;
  fee: number;
  location: string;
  clinicName: string;
  clinicAddress: string;
  gender: 'male' | 'female';
  photo: string;
  availableOnline: boolean;
  nextSlot: string;
  bio: string;
  languages: string[];
}

export interface Appointment {
  id: string;
  doctorId: string;
  date: string;
  time: string;
  type: ConsultationType;
  status: AppointmentStatus;
  paymentStatus: 'paid' | 'pending' | 'refunded';
  amount: number;
  notes?: string;
  prescription?: string;
}

export interface Prescription {
  id: string;
  doctorId: string;
  appointmentId: string;
  date: string;
  diagnosis: string;
  medicines: {
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions?: string;
  }[];
  notes?: string;
}

export interface MedicalRecord {
  id: string;
  type: 'visit' | 'lab' | 'diagnosis' | 'document' | 'notes';
  title: string;
  date: string;
  doctorId?: string;
  description: string;
  fileUrl?: string;
}

export interface Payment {
  id: string;
  appointmentId: string;
  doctorId: string;
  amount: number;
  method: 'card' | 'upi' | 'netbanking' | 'wallet';
  status: 'completed' | 'pending' | 'refunded' | 'failed';
  date: string;
}

export interface Review {
  id: string;
  doctorId: string;
  appointmentId: string;
  rating: number;
  text: string;
  date: string;
  edited?: boolean;
}

export interface Notification {
  id: string;
  type: 'appointment' | 'reminder' | 'cancellation' | 'reschedule' | 'payment' | 'prescription' | 'message';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

export const doctors: Doctor[] = [
  {
    id: 'd1',
    name: 'Dr. Priya Sharma',
    specialty: 'Cardiologist',
    qualifications: ['MBBS', 'MD (Cardiology)', 'DM (Cardiology)', 'FACC'],
    experience: 14,
    rating: 4.9,
    reviewCount: 312,
    fee: 800,
    location: 'Mumbai, Maharashtra',
    clinicName: 'Heart Care Clinic',
    clinicAddress: 'Level 3, Breach Candy Hospital, Bhulabhai Desai Rd, Mumbai',
    gender: 'female',
    photo: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&h=300&fit=crop&auto=format',
    availableOnline: true,
    nextSlot: 'Today, 3:00 PM',
    bio: 'Dr. Priya Sharma is a board-certified cardiologist with over 14 years of experience in diagnosing and treating heart conditions. She specializes in preventive cardiology and heart failure management.',
    languages: ['English', 'Hindi', 'Marathi'],
  },
  {
    id: 'd2',
    name: 'Dr. Arjun Mehta',
    specialty: 'Orthopedic Surgeon',
    qualifications: ['MBBS', 'MS (Ortho)', 'Fellowship (Joint Replacement)'],
    experience: 11,
    rating: 4.8,
    reviewCount: 245,
    fee: 700,
    location: 'Delhi, NCR',
    clinicName: 'OrthoPlus Centre',
    clinicAddress: 'B-46 Saket District Centre, New Delhi',
    gender: 'male',
    photo: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=300&fit=crop&auto=format',
    availableOnline: true,
    nextSlot: 'Tomorrow, 10:00 AM',
    bio: 'Dr. Arjun Mehta is a leading orthopedic surgeon specializing in joint replacement and sports injuries. He has performed over 3,000 successful surgeries and is known for his minimally invasive techniques.',
    languages: ['English', 'Hindi'],
  },
  {
    id: 'd3',
    name: 'Dr. Kavitha Reddy',
    specialty: 'Dermatologist',
    qualifications: ['MBBS', 'MD (Dermatology)', 'DNB'],
    experience: 9,
    rating: 4.7,
    reviewCount: 189,
    fee: 600,
    location: 'Bangalore, Karnataka',
    clinicName: 'SkinGlow Derma Clinic',
    clinicAddress: '12 Lavelle Road, Bangalore',
    gender: 'female',
    photo: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=300&h=300&fit=crop&auto=format',
    availableOnline: true,
    nextSlot: 'Today, 5:30 PM',
    bio: 'Dr. Kavitha Reddy is a specialist in medical and cosmetic dermatology. She treats a wide range of skin conditions and is a pioneer in laser skin treatment in Bangalore.',
    languages: ['English', 'Kannada', 'Telugu'],
  },
  {
    id: 'd4',
    name: 'Dr. Rohit Verma',
    specialty: 'Neurologist',
    qualifications: ['MBBS', 'MD', 'DM (Neurology)'],
    experience: 16,
    rating: 4.9,
    reviewCount: 278,
    fee: 1000,
    location: 'Mumbai, Maharashtra',
    clinicName: 'NeuroLife Centre',
    clinicAddress: 'Suite 210, Kokilaben Dhirubhai Ambani Hospital, Mumbai',
    gender: 'male',
    photo: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=300&h=300&fit=crop&auto=format',
    availableOnline: false,
    nextSlot: 'Thu, 11:00 AM',
    bio: "Dr. Rohit Verma is one of India's leading neurologists with extensive experience in stroke management, epilepsy, and movement disorders. He leads the neurology department at NeuroLife Centre.",
    languages: ['English', 'Hindi', 'Marathi'],
  },
  {
    id: 'd5',
    name: 'Dr. Anika Kapoor',
    specialty: 'Pediatrician',
    qualifications: ['MBBS', 'MD (Pediatrics)', 'Fellowship (Neonatology)'],
    experience: 8,
    rating: 4.8,
    reviewCount: 204,
    fee: 550,
    location: 'Pune, Maharashtra',
    clinicName: 'Little Stars Clinic',
    clinicAddress: '22 FC Road, Shivajinagar, Pune',
    gender: 'female',
    photo: 'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=300&h=300&fit=crop&auto=format',
    availableOnline: true,
    nextSlot: 'Today, 6:00 PM',
    bio: 'Dr. Anika Kapoor is a compassionate pediatrician and neonatologist. She is dedicated to providing high-quality healthcare to children from birth through adolescence.',
    languages: ['English', 'Hindi', 'Marathi'],
  },
  {
    id: 'd6',
    name: 'Dr. Suresh Iyer',
    specialty: 'General Physician',
    qualifications: ['MBBS', 'MD (General Medicine)'],
    experience: 12,
    rating: 4.6,
    reviewCount: 356,
    fee: 400,
    location: 'Chennai, Tamil Nadu',
    clinicName: 'Wellness First Clinic',
    clinicAddress: '88 Anna Nagar East, Chennai',
    gender: 'male',
    photo: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&h=300&fit=crop&auto=format',
    availableOnline: true,
    nextSlot: 'Today, 4:00 PM',
    bio: 'Dr. Suresh Iyer is a trusted general physician offering comprehensive primary care. He emphasizes preventive medicine and holistic patient wellness.',
    languages: ['English', 'Tamil', 'Hindi'],
  },
];

export const appointments: Appointment[] = [
  {
    id: 'a1',
    doctorId: 'd1',
    date: '2026-08-12',
    time: '3:00 PM',
    type: 'clinic',
    status: 'confirmed',
    paymentStatus: 'paid',
    amount: 800,
    notes: 'Follow-up for ECG results',
  },
  {
    id: 'a2',
    doctorId: 'd3',
    date: '2026-08-10',
    time: '5:30 PM',
    type: 'online',
    status: 'in_progress',
    paymentStatus: 'paid',
    amount: 600,
  },
  {
    id: 'a3',
    doctorId: 'd2',
    date: '2026-07-28',
    time: '10:00 AM',
    type: 'clinic',
    status: 'completed',
    paymentStatus: 'paid',
    amount: 700,
    prescription: 'pr1',
  },
  {
    id: 'a4',
    doctorId: 'd6',
    date: '2026-07-15',
    time: '4:00 PM',
    type: 'online',
    status: 'completed',
    paymentStatus: 'paid',
    amount: 400,
    prescription: 'pr2',
  },
  {
    id: 'a5',
    doctorId: 'd4',
    date: '2026-08-20',
    time: '11:00 AM',
    type: 'clinic',
    status: 'payment_pending',
    paymentStatus: 'pending',
    amount: 1000,
  },
  {
    id: 'a6',
    doctorId: 'd5',
    date: '2026-06-30',
    time: '6:00 PM',
    type: 'clinic',
    status: 'cancelled',
    paymentStatus: 'refunded',
    amount: 550,
  },
];

export const prescriptions: Prescription[] = [
  {
    id: 'pr1',
    doctorId: 'd2',
    appointmentId: 'a3',
    date: '2026-07-28',
    diagnosis: 'Acute knee ligament strain (Grade II)',
    medicines: [
      { name: 'Diclofenac 75mg', dosage: '75mg', frequency: 'Twice daily', duration: '7 days', instructions: 'After meals' },
      { name: 'Pantoprazole 40mg', dosage: '40mg', frequency: 'Once daily', duration: '7 days', instructions: 'Before breakfast' },
      { name: 'Muscle Relaxant (Thiocolchicoside)', dosage: '8mg', frequency: 'Twice daily', duration: '5 days', instructions: 'Night dose before bed' },
    ],
    notes: 'Rest for 2 weeks. Avoid weight-bearing activities. Apply ice pack 3x daily. Follow up in 2 weeks.',
  },
  {
    id: 'pr2',
    doctorId: 'd6',
    appointmentId: 'a4',
    date: '2026-07-15',
    diagnosis: 'Upper respiratory tract infection',
    medicines: [
      { name: 'Azithromycin 500mg', dosage: '500mg', frequency: 'Once daily', duration: '5 days', instructions: 'Empty stomach' },
      { name: 'Cetirizine 10mg', dosage: '10mg', frequency: 'Once daily at night', duration: '7 days', instructions: 'May cause drowsiness' },
      { name: 'Paracetamol 650mg', dosage: '650mg', frequency: 'SOS (as needed)', duration: 'Until fever subsides', instructions: 'Do not exceed 3 tabs/day' },
    ],
    notes: 'Rest well, stay hydrated. Steam inhalation twice daily. Avoid cold foods and beverages.',
  },
];

export const medicalRecords: MedicalRecord[] = [
  {
    id: 'mr1',
    type: 'lab',
    title: 'Complete Blood Count (CBC)',
    date: '2026-07-20',
    doctorId: 'd6',
    description: 'Routine CBC report — all parameters within normal range. Haemoglobin: 13.8 g/dL, WBC: 7,200, Platelets: 2,40,000.',
  },
  {
    id: 'mr2',
    type: 'lab',
    title: 'Lipid Profile',
    date: '2026-07-20',
    doctorId: 'd1',
    description: 'Total Cholesterol: 198 mg/dL, LDL: 118 mg/dL, HDL: 52 mg/dL, Triglycerides: 140 mg/dL. Borderline LDL — dietary modification advised.',
  },
  {
    id: 'mr3',
    type: 'diagnosis',
    title: 'Knee MRI Report',
    date: '2026-07-25',
    doctorId: 'd2',
    description: 'MRI right knee shows partial tear of the medial collateral ligament (MCL) with moderate soft tissue oedema. No bone injury detected.',
  },
  {
    id: 'mr4',
    type: 'visit',
    title: 'Cardiology Consultation',
    date: '2026-06-10',
    doctorId: 'd1',
    description: 'Initial cardiology consultation for palpitations. ECG and 2D echo ordered. No immediate cardiac abnormality found.',
  },
  {
    id: 'mr5',
    type: 'document',
    title: 'Vaccination Record',
    date: '2026-01-05',
    description: 'COVID-19 booster (Covishield Dose 3) administered. Flu vaccination administered.',
  },
];

export const payments: Payment[] = [
  { id: 'pay1', appointmentId: 'a1', doctorId: 'd1', amount: 800, method: 'card', status: 'completed', date: '2026-08-08' },
  { id: 'pay2', appointmentId: 'a2', doctorId: 'd3', amount: 600, method: 'upi', status: 'completed', date: '2026-08-09' },
  { id: 'pay3', appointmentId: 'a3', doctorId: 'd2', amount: 700, method: 'card', status: 'completed', date: '2026-07-26' },
  { id: 'pay4', appointmentId: 'a4', doctorId: 'd6', amount: 400, method: 'wallet', status: 'completed', date: '2026-07-14' },
  { id: 'pay5', appointmentId: 'a5', doctorId: 'd4', amount: 1000, method: 'netbanking', status: 'pending', date: '2026-08-10' },
  { id: 'pay6', appointmentId: 'a6', doctorId: 'd5', amount: 550, method: 'upi', status: 'refunded', date: '2026-06-28' },
];

export const reviews: Review[] = [
  {
    id: 'rv1',
    doctorId: 'd2',
    appointmentId: 'a3',
    rating: 5,
    text: 'Dr. Mehta was extremely thorough and professional. He explained my MRI results clearly and gave a realistic recovery plan. Highly recommend!',
    date: '2026-07-30',
  },
  {
    id: 'rv2',
    doctorId: 'd6',
    appointmentId: 'a4',
    rating: 4,
    text: 'Good experience with the online consultation. Dr. Iyer was attentive and prescribed the right medication. Recovery was quick.',
    date: '2026-07-17',
  },
];

export const notifications: Notification[] = [
  {
    id: 'n1',
    type: 'appointment',
    title: 'Appointment Confirmed',
    message: "Your appointment with Dr. Priya Sharma on Aug 12 at 3:00 PM has been confirmed.",
    time: '2 hours ago',
    read: false,
  },
  {
    id: 'n2',
    type: 'reminder',
    title: 'Appointment Reminder',
    message: "Reminder: You have an online consultation with Dr. Kavitha Reddy today at 5:30 PM.",
    time: '3 hours ago',
    read: false,
  },
  {
    id: 'n3',
    type: 'payment',
    title: 'Payment Successful',
    message: '₹600 payment for Dr. Kavitha Reddy\'s consultation was processed successfully.',
    time: '5 hours ago',
    read: false,
  },
  {
    id: 'n4',
    type: 'prescription',
    title: 'New Prescription Available',
    message: 'Dr. Arjun Mehta has shared your prescription from the Jul 28 appointment.',
    time: '2 days ago',
    read: true,
  },
  {
    id: 'n5',
    type: 'reminder',
    title: 'Payment Pending',
    message: 'Your appointment with Dr. Rohit Verma on Aug 20 has a pending payment of ₹1,000.',
    time: '1 day ago',
    read: true,
  },
  {
    id: 'n6',
    type: 'cancellation',
    title: 'Appointment Cancelled',
    message: 'Your appointment with Dr. Anika Kapoor on Jun 30 was cancelled. Refund initiated.',
    time: '1 month ago',
    read: true,
  },
  {
    id: 'n7',
    type: 'message',
    title: 'Message from Dr. Priya Sharma',
    message: 'Please get your lipid profile done before your appointment on Aug 12.',
    time: '3 days ago',
    read: true,
  },
];

export const specialties = [
  'All Specialties',
  'Cardiologist',
  'Dermatologist',
  'General Physician',
  'Neurologist',
  'Orthopedic Surgeon',
  'Pediatrician',
  'Psychiatrist',
  'Gynecologist',
  'Ophthalmologist',
  'ENT Specialist',
];

export const patient = {
  name: 'Sarah Johnson',
  email: 'sarah.johnson@email.com',
  phone: '+91 98765 43210',
  dob: '1994-03-15',
  gender: 'Female',
  bloodGroup: 'B+',
  address: '24 Palm Grove, Bandra West, Mumbai 400050',
  photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&auto=format',
  emergencyContact: {
    name: 'Mark Johnson',
    relation: 'Spouse',
    phone: '+91 98765 11223',
  },
};
