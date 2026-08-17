import { apiClient } from '../../../common/services/api';

export interface DoctorDashboardData {
  stats: {
    todayAppointments: number;
    completedToday: number;
    pendingNotes: number;
    totalPatients: number;
    monthlyEarnings: number;
    rating: number;
    totalReviews: number;
  };
  todayQueue: any[];
  upcomingAppointments: any[];
  recentReviews: any[];
}

export interface DoctorProfileData {
  id: string;
  userId: string;
  name?: string;
  email?: string;
  specialty?: string;
  bio?: string;
  roomNumber?: string;
  consultationFee?: number;
  experienceYears?: number;
  qualifications?: string[];
  isAvailableToday?: boolean;
  clinicId?: string;
  rating?: number;
  reviewCount?: number;
}

export const doctorApi = {
  // 1. Dashboard
  async getDashboardSummary(): Promise<DoctorDashboardData> {
    return apiClient<DoctorDashboardData>('/doctor/dashboard');
  },

  // 2. Profile
  async getProfile(): Promise<DoctorProfileData> {
    return apiClient<DoctorProfileData>('/doctor/profile');
  },

  async updateProfile(data: Partial<DoctorProfileData>): Promise<DoctorProfileData> {
    return apiClient<DoctorProfileData>('/doctor/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // 3. Appointments & Clinical Consultations
  async listAppointments(filter?: { status?: string; date?: string; search?: string; page?: number; limit?: number }) {
    const params = new URLSearchParams();
    if (filter?.status) params.append('status', filter.status);
    if (filter?.date) params.append('date', filter.date);
    if (filter?.search) params.append('search', filter.search);
    if (filter?.page) params.append('page', String(filter.page));
    if (filter?.limit) params.append('limit', String(filter.limit));

    const qs = params.toString();
    return apiClient(`/doctor/appointments${qs ? `?${qs}` : ''}`);
  },

  async getAppointmentDetails(id: string) {
    return apiClient(`/doctor/appointments/${id}`);
  },

  async updateAppointmentStatus(id: string, status: string, notes?: string) {
    return apiClient(`/doctor/appointments/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, notes }),
    });
  },

  // 4. Consultation Notes
  async getConsultationNote(appointmentId: string) {
    return apiClient(`/doctor/consultations/${appointmentId}/note`);
  },

  async saveConsultationNote(appointmentId: string, data: {
    symptoms?: string[];
    diagnosis: string;
    vitals?: Record<string, any>;
    treatmentPlan?: string;
    followUpDate?: string;
  }) {
    return apiClient(`/doctor/consultations/${appointmentId}/note`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // 5. Prescriptions
  async createPrescription(data: {
    appointmentId: string;
    patientId: string;
    diagnosis: string;
    medicines: Array<{
      name: string;
      dosage: string;
      frequency: string;
      duration: string;
      instructions?: string;
    }>;
    notes?: string;
  }) {
    return apiClient('/doctor/prescriptions', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async listPrescriptions(filter?: { patientId?: string; search?: string; page?: number; limit?: number }) {
    const params = new URLSearchParams();
    if (filter?.patientId) params.append('patientId', filter.patientId);
    if (filter?.search) params.append('search', filter.search);
    if (filter?.page) params.append('page', String(filter.page));
    if (filter?.limit) params.append('limit', String(filter.limit));

    const qs = params.toString();
    return apiClient(`/doctor/prescriptions${qs ? `?${qs}` : ''}`);
  },

  // 6. Patients & Medical Charts
  async listPatients(filter?: { search?: string; page?: number; limit?: number }) {
    const params = new URLSearchParams();
    if (filter?.search) params.append('search', filter.search);
    if (filter?.page) params.append('page', String(filter.page));
    if (filter?.limit) params.append('limit', String(filter.limit));

    const qs = params.toString();
    return apiClient(`/doctor/patients${qs ? `?${qs}` : ''}`);
  },

  async getPatientChart(patientId: string) {
    return apiClient(`/doctor/patients/${patientId}/chart`);
  },

  // 7. Schedule & Slots
  async getSchedules(date?: string) {
    const qs = date ? `?date=${date}` : '';
    return apiClient(`/doctor/schedules${qs}`);
  },

  async setSchedules(data: {
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    slotDurationMinutes?: number;
    maxPatients?: number;
    isAvailable?: boolean;
  }) {
    return apiClient('/doctor/schedules', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // 8. Earnings & Payouts
  async getEarnings(filter?: { startDate?: string; endDate?: string }) {
    const params = new URLSearchParams();
    if (filter?.startDate) params.append('startDate', filter.startDate);
    if (filter?.endDate) params.append('endDate', filter.endDate);

    const qs = params.toString();
    return apiClient(`/doctor/earnings${qs ? `?${qs}` : ''}`);
  },

  async requestPayout(amount: number, payoutMethod?: string) {
    return apiClient('/doctor/payouts/request', {
      method: 'POST',
      body: JSON.stringify({ amount, payoutMethod: payoutMethod || 'BANK_TRANSFER' }),
    });
  },

  // 9. Reviews
  async listReviews(page?: number, limit?: number) {
    const qs = page ? `?page=${page}&limit=${limit || 20}` : '';
    return apiClient(`/doctor/reviews${qs}`);
  },

  // 10. Video Consultation Session Token
  async getVideoToken(appointmentId: string) {
    return apiClient(`/doctor/video-sessions/${appointmentId}/token`, {
      method: 'POST',
    });
  },
};
