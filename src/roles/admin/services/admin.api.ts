import { apiClient } from '../../../common/services/api';

export interface AdminAnalyticsSummary {
  totalRevenue: number;
  totalAppointments: number;
  totalDoctors: number;
  totalPatients: number;
  activeClinics: number;
  pendingVerifications: number;
}

export interface AdminDoctorItem {
  id: string;
  name: string;
  email: string;
  specialty: string;
  clinicName: string;
  rating: number;
  verificationStatus: string;
  accountStatus: string;
  joinedDate: string;
  appointmentCount: number;
  consultationFee: number;
}

export interface AdminVerificationItem {
  id: string;
  doctorId: string;
  doctorName: string;
  specialty: string;
  licenseNumber: string;
  documentsCount: number;
  submittedDate: string;
  status: string;
  clinicName: string;
}

export interface AdminPatientItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  age: number;
  gender: string;
  bloodGroup: string;
  totalAppointments: number;
  lastVisit: string;
  status: string;
}

export interface AdminClinicItem {
  id: string;
  name: string;
  address: string;
  phone: string;
  managerName: string;
  doctorsCount: number;
  patientsCount: number;
  rating: number;
  status: string;
}

export const adminApi = {
  // 1. Analytics & Overview
  async getAnalyticsOverview(): Promise<AdminAnalyticsSummary> {
    return apiClient<AdminAnalyticsSummary>('/admin/analytics/overview');
  },

  // 2. Doctors Management & Verification
  async listDoctors(query?: { search?: string; specialty?: string; status?: string; page?: number; limit?: number }) {
    const params = new URLSearchParams();
    if (query?.search) params.append('search', query.search);
    if (query?.specialty) params.append('specialty', query.specialty);
    if (query?.status) params.append('status', query.status);
    if (query?.page) params.append('page', String(query.page));
    if (query?.limit) params.append('limit', String(query.limit));
    const qs = params.toString();
    return apiClient(`/admin/doctors${qs ? `?${qs}` : ''}`);
  },

  async listVerificationQueue(status?: string) {
    return apiClient(`/admin/doctors/verification-queue${status ? `?status=${status}` : ''}`);
  },

  async decideVerification(id: string, data: { decision: 'APPROVED' | 'REJECTED' | 'DOCS_REQUESTED'; notes?: string; rejectionReason?: string }) {
    return apiClient(`/admin/doctors/verification-queue/${id}/decision`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateDoctorStatus(id: string, status: string, reason?: string) {
    return apiClient(`/admin/doctors/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, reason }),
    });
  },

  // 3. Patients Management
  async listPatients(query?: { search?: string; status?: string; page?: number; limit?: number }) {
    const params = new URLSearchParams();
    if (query?.search) params.append('search', query.search);
    if (query?.status) params.append('status', query.status);
    if (query?.page) params.append('page', String(query.page));
    if (query?.limit) params.append('limit', String(query.limit));
    const qs = params.toString();
    return apiClient(`/admin/patients${qs ? `?${qs}` : ''}`);
  },

  async updatePatientStatus(id: string, status: string, reason?: string) {
    return apiClient(`/admin/patients/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, reason }),
    });
  },

  // 4. Clinics Network
  async listClinics(query?: { search?: string; page?: number; limit?: number }) {
    const params = new URLSearchParams();
    if (query?.search) params.append('search', query.search);
    if (query?.page) params.append('page', String(query.page));
    if (query?.limit) params.append('limit', String(query.limit));
    const qs = params.toString();
    return apiClient(`/admin/clinics${qs ? `?${qs}` : ''}`);
  },

  async createClinic(data: { name: string; address: string; phone?: string; email?: string; managerId?: string }) {
    return apiClient('/admin/clinics', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateClinic(id: string, data: Partial<{ name: string; address: string; phone: string; email: string; managerId: string }>) {
    return apiClient(`/admin/clinics/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // 5. Global Appointments
  async listAppointments(query?: { search?: string; status?: string; date?: string; page?: number; limit?: number }) {
    const params = new URLSearchParams();
    if (query?.search) params.append('search', query.search);
    if (query?.status) params.append('status', query.status);
    if (query?.date) params.append('date', query.date);
    if (query?.page) params.append('page', String(query.page));
    if (query?.limit) params.append('limit', String(query.limit));
    const qs = params.toString();
    return apiClient(`/admin/appointments${qs ? `?${qs}` : ''}`);
  },

  async updateAppointmentStatus(id: string, status: string, notes?: string) {
    return apiClient(`/admin/appointments/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, notes }),
    });
  },

  // 6. Finance & Payouts
  async getFinanceSummary() {
    return apiClient('/admin/finance/summary');
  },

  async listTransactions(query?: { status?: string; provider?: string; page?: number; limit?: number }) {
    const params = new URLSearchParams();
    if (query?.status) params.append('status', query.status);
    if (query?.provider) params.append('provider', query.provider);
    if (query?.page) params.append('page', String(query.page));
    if (query?.limit) params.append('limit', String(query.limit));
    const qs = params.toString();
    return apiClient(`/admin/finance/transactions${qs ? `?${qs}` : ''}`);
  },

  async listPayouts(query?: { status?: string; page?: number; limit?: number }) {
    const params = new URLSearchParams();
    if (query?.status) params.append('status', query.status);
    if (query?.page) params.append('page', String(query.page));
    if (query?.limit) params.append('limit', String(query.limit));
    const qs = params.toString();
    return apiClient(`/admin/finance/payouts${qs ? `?${qs}` : ''}`);
  },

  async decidePayout(id: string, action: 'APPROVE' | 'REJECT', notes?: string) {
    return apiClient(`/admin/finance/payouts/${id}/action`, {
      method: 'POST',
      body: JSON.stringify({ action, notes }),
    });
  },

  // 7. Reviews Moderation
  async listReviews(query?: { search?: string; status?: string; page?: number; limit?: number }) {
    const params = new URLSearchParams();
    if (query?.search) params.append('search', query.search);
    if (query?.status) params.append('status', query.status);
    if (query?.page) params.append('page', String(query.page));
    if (query?.limit) params.append('limit', String(query.limit));
    const qs = params.toString();
    return apiClient(`/admin/reviews${qs ? `?${qs}` : ''}`);
  },

  async moderateReview(id: string, status: string, isHidden?: boolean) {
    return apiClient(`/admin/reviews/${id}/moderate`, {
      method: 'POST',
      body: JSON.stringify({ status, isHidden }),
    });
  },

  // 8. Notifications & Broadcasts
  async listNotifications(query?: { page?: number; limit?: number }) {
    const params = new URLSearchParams();
    if (query?.page) params.append('page', String(query.page));
    if (query?.limit) params.append('limit', String(query.limit));
    const qs = params.toString();
    return apiClient(`/admin/notifications${qs ? `?${qs}` : ''}`);
  },

  async sendBroadcast(data: { title: string; message: string; targetRole?: string; type?: string }) {
    return apiClient('/admin/notifications/broadcast', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // 9. Audit Logs
  async listAuditLogs(query?: { actorId?: string; action?: string; search?: string; page?: number; limit?: number }) {
    const params = new URLSearchParams();
    if (query?.actorId) params.append('actorId', query.actorId);
    if (query?.action) params.append('action', query.action);
    if (query?.search) params.append('search', query.search);
    if (query?.page) params.append('page', String(query.page));
    if (query?.limit) params.append('limit', String(query.limit));
    const qs = params.toString();
    return apiClient(`/admin/audit-logs${qs ? `?${qs}` : ''}`);
  },

  async exportAuditLogs(format: 'JSON' | 'CSV' = 'JSON') {
    return apiClient(`/admin/audit-logs/export?format=${format}`);
  },
};
