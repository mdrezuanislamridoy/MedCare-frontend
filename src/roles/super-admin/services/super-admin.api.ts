import { apiClient } from '../../../common/services/api';

export interface AnalyticsOverview {
  totalRevenue: number;
  revenueGrowth: number;
  totalAppointments: number;
  appointmentsGrowth: number;
  totalDoctors: number;
  doctorsGrowth: number;
  totalPatients: number;
  patientsGrowth: number;
  activeClinics: number;
  pendingVerifications: number;
  systemHealth: string;
}

export interface PlatformAdministrator {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  clinicId?: string;
  clinicName?: string;
  lastLoginAt?: string;
  createdAt: string;
}

export interface DoctorVerificationItem {
  id: string;
  name: string;
  specialty: string;
  licenseNumber: string;
  submittedAt: string;
  status: 'PENDING' | 'DOCS_REQUESTED' | 'APPROVED' | 'REJECTED';
  documentCount: number;
  clinicName: string;
}

export interface SystemHealthData {
  status: 'HEALTHY' | 'DEGRADED' | 'DOWN';
  uptimeSeconds: number;
  database: { status: string; latencyMs: number; activeConnections: number };
  redis: { status: string; latencyMs: number };
  microservices: Record<string, string>;
  metrics: {
    cpuUsagePercent: number;
    memoryUsagePercent: number;
    diskUsagePercent: number;
  };
}

export const superAdminApi = {
  // 1. Platform Analytics
  async getAnalyticsOverview(): Promise<AnalyticsOverview> {
    return apiClient<AnalyticsOverview>('/admin/analytics/overview');
  },

  async getAnalyticsRevenue(): Promise<any> {
    return apiClient('/admin/analytics/revenue');
  },

  async getAnalyticsAppointments(): Promise<any> {
    return apiClient('/admin/analytics/appointments');
  },

  async getAnalyticsPerformance(): Promise<any> {
    return apiClient('/admin/analytics/performance');
  },

  // 2. Administrators Management
  async listAdministrators(query?: { search?: string; role?: string; page?: number; limit?: number }) {
    const params = new URLSearchParams();
    if (query?.search) params.append('search', query.search);
    if (query?.role) params.append('role', query.role);
    if (query?.page) params.append('page', String(query.page));
    if (query?.limit) params.append('limit', String(query.limit));
    const qs = params.toString();
    return apiClient(`/super-admin/administrators${qs ? `?${qs}` : ''}`);
  },

  async createAdministrator(data: { name: string; email: string; role: string; password?: string; clinicId?: string }) {
    return apiClient('/super-admin/administrators', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateAdministratorStatus(id: string, status: string, reason?: string) {
    return apiClient(`/super-admin/administrators/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, reason }),
    });
  },

  // 3. RBAC Matrix & Access Requests
  async getRbacMatrix(): Promise<any> {
    return apiClient('/super-admin/rbac/matrix');
  },

  async createRole(data: { name: string; description?: string; permissionIds?: string[] }) {
    return apiClient('/super-admin/rbac/roles', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateRolePermissions(roleId: string, permissionIds: string[]) {
    return apiClient(`/super-admin/rbac/roles/${roleId}/permissions`, {
      method: 'PUT',
      body: JSON.stringify({ permissionIds }),
    });
  },

  async listAccessRequests(query?: { status?: string; page?: number; limit?: number }) {
    const params = new URLSearchParams();
    if (query?.status) params.append('status', query.status);
    if (query?.page) params.append('page', String(query.page));
    if (query?.limit) params.append('limit', String(query.limit));
    const qs = params.toString();
    return apiClient(`/super-admin/rbac/access-requests${qs ? `?${qs}` : ''}`);
  },

  async decideAccessRequest(id: string, decision: 'APPROVED' | 'REJECTED', notes?: string) {
    return apiClient(`/super-admin/rbac/access-requests/${id}/decision`, {
      method: 'POST',
      body: JSON.stringify({ decision, notes }),
    });
  },

  // 4. Doctor Verification & Roster
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

  async listPendingDoctors(): Promise<DoctorVerificationItem[]> {
    return apiClient<DoctorVerificationItem[]>('/admin/doctors/pending-verification');
  },

  async verifyDoctor(id: string, data: { decision: 'APPROVED' | 'REJECTED' | 'DOCS_REQUESTED'; notes?: string; rejectionReason?: string }) {
    return apiClient(`/admin/doctors/${id}/verify`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateDoctorStatus(id: string, status: string, reason?: string) {
    return apiClient(`/admin/doctors/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, reason }),
    });
  },

  // 5. Patient Registry
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
      method: 'PUT',
      body: JSON.stringify({ status, reason }),
    });
  },

  // 6. Clinics & Branches Network
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

  // 7. Global Appointments
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
      method: 'PUT',
      body: JSON.stringify({ status, notes }),
    });
  },

  // 8. Finance, Ledger & Payouts
  async getFinanceSummary(): Promise<any> {
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

  // 9. Reviews Moderation
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

  // 10. System Notifications & Broadcast
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

  // 11. Immutable Audit Logs
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

  // 12. Server Health, Telemetry & Settings
  async getSystemHealth(): Promise<SystemHealthData> {
    return apiClient<SystemHealthData>('/super-admin/system/health');
  },

  async getSystemSettings(): Promise<any> {
    return apiClient('/super-admin/system/settings');
  },

  async updateSystemSettings(settings: Record<string, any>) {
    return apiClient('/super-admin/system/settings', {
      method: 'PUT',
      body: JSON.stringify({ settings }),
    });
  },

  async triggerBackup(notes?: string) {
    return apiClient('/super-admin/system/backup', {
      method: 'POST',
      body: JSON.stringify({ notes }),
    });
  },
};
