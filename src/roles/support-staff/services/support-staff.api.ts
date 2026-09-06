import { apiClient } from '../../../common/services/api';

export interface SupportStaffKpis {
  openTickets: number;
  resolvedToday: number;
  avgResponseTimeHours: number;
  activeDisputes: number;
  satisfactionRate: number;
  escalatedTickets: number;
}

export const supportStaffApi = {
  async getKpis(): Promise<SupportStaffKpis> {
    return apiClient<SupportStaffKpis>('/support-staff/kpis');
  },

  async listTickets(query?: { status?: string; priority?: string; search?: string }): Promise<any> {
    const params = new URLSearchParams();
    if (query?.status) params.append('status', query.status);
    if (query?.priority) params.append('priority', query.priority);
    if (query?.search) params.append('search', query.search);
    const qs = params.toString();
    return apiClient(`/support-staff/tickets${qs ? `?${qs}` : ''}`);
  },

  async createTicket(data: { subject: string; description: string; priority?: string; patientId?: string }): Promise<any> {
    return apiClient('/support-staff/tickets', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async listComplaints(query?: { status?: string; search?: string }): Promise<any> {
    const params = new URLSearchParams();
    if (query?.status) params.append('status', query.status);
    if (query?.search) params.append('search', query.search);
    const qs = params.toString();
    return apiClient(`/support-staff/complaints${qs ? `?${qs}` : ''}`);
  },

  async getPatients(): Promise<any> {
    return apiClient('/patients').catch(() => []);
  },

  async getAppointments(): Promise<any> {
    return apiClient('/appointments').catch(() => []);
  },
};
