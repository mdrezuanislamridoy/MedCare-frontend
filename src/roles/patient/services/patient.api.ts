import { apiClient } from '../../../common/services/api';

export interface PatientDashboardSummary {
  stats: {
    upcomingAppointments: number;
    completedAppointments: number;
    totalPrescriptions: number;
    totalMedicalRecords: number;
    pendingPayments: number;
  };
  upcomingAppointments: any[];
  recentPrescriptions: any[];
  recentMedicalRecords: any[];
  activeConsultation?: any;
}

export interface PatientProfileData {
  id: string;
  userId: string;
  name?: string;
  email?: string;
  phone?: string;
  bloodGroup?: string;
  height?: number;
  weight?: number;
  allergies?: string[];
  chronicConditions?: string[];
  emergencyName?: string;
  emergencyRelationship?: string;
  emergencyPhone?: string;
}

export const patientApi = {
  // 1. Dashboard
  async getDashboardSummary(): Promise<PatientDashboardSummary> {
    return apiClient<PatientDashboardSummary>('/patient/dashboard');
  },

  // 2. Profile
  async getProfile(): Promise<PatientProfileData> {
    return apiClient<PatientProfileData>('/patient/profile');
  },

  async updateProfile(data: Partial<PatientProfileData>): Promise<PatientProfileData> {
    return apiClient<PatientProfileData>('/patient/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // 3. Doctors Search & Details
  async searchDoctors(query?: { specialty?: string; search?: string; minRating?: number; maxFee?: number; page?: number; limit?: number }) {
    const params = new URLSearchParams();
    if (query?.specialty) params.append('specialty', query.specialty);
    if (query?.search) params.append('search', query.search);
    if (query?.minRating) params.append('minRating', String(query.minRating));
    if (query?.maxFee) params.append('maxFee', String(query.maxFee));
    if (query?.page) params.append('page', String(query.page));
    if (query?.limit) params.append('limit', String(query.limit));

    const qs = params.toString();
    return apiClient(`/patient/doctors${qs ? `?${qs}` : ''}`);
  },

  async getDoctorDetails(id: string) {
    return apiClient(`/patient/doctors/${id}`);
  },

  async getDoctorSlots(id: string, date: string) {
    return apiClient(`/patient/doctors/${id}/slots?date=${date}`);
  },

  // 4. Appointments
  async listAppointments(filter?: { status?: string; page?: number; limit?: number }) {
    const params = new URLSearchParams();
    if (filter?.status) params.append('status', filter.status);
    if (filter?.page) params.append('page', String(filter.page));
    if (filter?.limit) params.append('limit', String(filter.limit));

    const qs = params.toString();
    return apiClient(`/patient/appointments${qs ? `?${qs}` : ''}`);
  },

  async bookAppointment(data: {
    doctorId: string;
    date: string;
    timeSlot: string;
    type?: 'IN_PERSON' | 'VIDEO';
    reason?: string;
  }) {
    return apiClient('/patient/appointments', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async rescheduleAppointment(id: string, data: { date: string; timeSlot: string; reason?: string }) {
    return apiClient(`/patient/appointments/${id}/reschedule`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  async cancelAppointment(id: string, reason?: string) {
    return apiClient(`/patient/appointments/${id}/cancel`, {
      method: 'PATCH',
      body: JSON.stringify({ reason }),
    });
  },

  // 5. Prescriptions
  async listPrescriptions() {
    return apiClient('/patient/prescriptions');
  },

  async getPrescriptionById(id: string) {
    return apiClient(`/patient/prescriptions/${id}`);
  },

  // 6. Medical Records
  async listMedicalRecords(category?: string) {
    const qs = category ? `?category=${category}` : '';
    return apiClient(`/patient/medical-records${qs}`);
  },

  async deleteMedicalRecord(id: string) {
    return apiClient(`/patient/medical-records/${id}`, {
      method: 'DELETE',
    });
  },

  // 7. Payments & Transactions
  async listPayments() {
    return apiClient('/patient/payments');
  },

  async processCheckout(data: { appointmentId: string; amount: number; paymentMethod: string }) {
    return apiClient('/patient/payments/checkout', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // 8. Reviews
  async listReviews() {
    return apiClient('/patient/reviews');
  },

  async submitReview(data: { doctorId: string; rating: number; comment?: string; appointmentId?: string }) {
    return apiClient('/patient/reviews', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // 9. Notifications
  async listNotifications() {
    return apiClient('/patient/notifications');
  },

  async markNotificationRead(id: string) {
    return apiClient(`/patient/notifications/${id}/read`, {
      method: 'PATCH',
    });
  },
};
