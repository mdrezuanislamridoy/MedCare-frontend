import { apiClient } from '../../../common/services/api';

export interface DoctorDashboardData {
  profile?: {
    id: string;
    name: string;
    specialty?: string;
    qualifications?: string[];
    experienceYears?: number;
    consultationFee?: number;
    rating?: number;
    reviewCount?: number;
    roomNumber?: string;
    clinicName?: string;
  };
  stats: {
    todayAppointments: number;
    completedToday: number;
    pendingToday?: number;
    pendingNotes?: number;
    totalPatients: number;
    todayEarnings?: number;
    totalEarnings?: number;
    monthlyEarnings?: number;
    rating: number;
    totalReviews?: number;
  };
  todayQueue?: any[];
  upcomingAppointments?: any[];
  recentReviews?: any[];
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

export interface SaveConsultationNotesPayload {
  patientId?: string;
  symptoms?: string | string[];
  diagnosis: string;
  vitals?: Record<string, any>;
  treatmentPlan?: string;
  internalNotes?: string;
  followUpDate?: string;
}

export interface DoctorScheduleUpdatePayload {
  consultationFee?: number;
  isAvailableToday?: boolean;
  days?: Array<{
    dayOfWeek: string | number;
    startTime: string;
    endTime: string;
    slotDurationMin?: number;
    isEnabled?: boolean;
    isAvailable?: boolean;
  }>;
  schedules?: any[];
}

export interface DoctorPayoutRequestPayload {
  amount: number;
  bankName?: string;
  payoutMethod?: string;
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

  // 4. Consultation Workspace, Notes & Completion
  async getConsultationWorkspace(appointmentId: string) {
    return apiClient(`/doctor/consultations/${appointmentId}/workspace`);
  },

  async getConsultationNote(appointmentId: string) {
    return apiClient(`/doctor/consultations/${appointmentId}/workspace`).catch(() =>
      apiClient(`/doctor/consultations/${appointmentId}/notes`),
    );
  },

  async saveConsultationNote(appointmentId: string, data: SaveConsultationNotesPayload) {
    const payload = {
      ...data,
      symptoms: Array.isArray(data.symptoms) ? data.symptoms.join(', ') : data.symptoms,
    };
    return apiClient(`/doctor/consultations/${appointmentId}/notes`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async completeConsultation(appointmentId: string, notesDto?: SaveConsultationNotesPayload) {
    const payload = notesDto
      ? {
          ...notesDto,
          symptoms: Array.isArray(notesDto.symptoms) ? notesDto.symptoms.join(', ') : notesDto.symptoms,
        }
      : {};
    return apiClient(`/doctor/consultations/${appointmentId}/complete`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  // 5. Prescriptions
  async createPrescription(data: {
    appointmentId?: string;
    patientId: string;
    diagnosis: string;
    advice?: string;
    instructions?: string;
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

  async getPrescription(id: string) {
    return apiClient(`/doctor/prescriptions/${id}`);
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

  // 7. Schedule & Roster Management
  async getSchedule(date?: string) {
    const qs = date ? `?date=${date}` : '';
    return apiClient(`/doctor/schedules${qs}`);
  },

  async getSchedules(date?: string) {
    return this.getSchedule(date);
  },

  async updateDoctorSchedule(data: DoctorScheduleUpdatePayload) {
    return apiClient('/doctor/schedules', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async setSchedules(data: any) {
    if (data && (data.days || data.schedules || data.consultationFee !== undefined)) {
      return this.updateDoctorSchedule(data);
    }
    // Backward compatibility for single day payload
    return this.updateDoctorSchedule({
      days: [
        {
          dayOfWeek: data.dayOfWeek ?? 1,
          startTime: data.startTime || '09:00',
          endTime: data.endTime || '17:00',
          slotDurationMin: data.slotDurationMinutes || 30,
          isEnabled: data.isAvailable ?? true,
        },
      ],
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

  async requestPayout(
    amountOrDto: number | DoctorPayoutRequestPayload,
    payoutMethod?: string,
  ) {
    const payload =
      typeof amountOrDto === 'number'
        ? {
            amount: amountOrDto,
            bankName: 'Default Bank',
            payoutMethod: payoutMethod || 'BANK_TRANSFER',
          }
        : {
            amount: amountOrDto.amount,
            bankName: amountOrDto.bankName || 'Default Bank',
            payoutMethod: amountOrDto.payoutMethod || payoutMethod || 'BANK_TRANSFER',
          };

    return apiClient('/doctor/payouts/request', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  // 9. Reviews & Feedback
  async listReviews(page?: number, limit?: number) {
    const qs = page ? `?page=${page}&limit=${limit || 20}` : '';
    return apiClient(`/doctor/reviews${qs}`);
  },

  async replyReview(reviewId: string, reply: string) {
    return apiClient(`/doctor/reviews/${reviewId}/reply`, {
      method: 'POST',
      body: JSON.stringify({ reply }),
    });
  },

  // 10. Video Consultation Session Token
  async getVideoToken(appointmentId: string) {
    return apiClient(`/doctor/video-sessions/${appointmentId}/token`, {
      method: 'POST',
    }).catch(() =>
      apiClient(`/doctor/consultations/${appointmentId}/video-token`, {
        method: 'POST',
      }),
    );
  },
};

