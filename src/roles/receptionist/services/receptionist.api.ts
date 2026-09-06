import { apiClient } from '../../../common/services/api';

export interface ReceptionistDashboardStats {
  todayAppointments: number;
  waitingPatients: number;
  checkedIn: number;
  completedVisits: number;
  cancelled: number;
  availableDoctors: number;
}

export interface ReceptionistDashboardData {
  stats: ReceptionistDashboardStats;
  appointments: any[];
  queue: any[];
  doctors: any[];
}

export const receptionistApi = {
  async getDashboardSummary(): Promise<ReceptionistDashboardData> {
    return apiClient<ReceptionistDashboardData>('/receptionist/dashboard');
  },

  async getQueue(clinicId?: string): Promise<any[]> {
    return apiClient(`/receptionist/queue${clinicId ? `?clinicId=${clinicId}` : ''}`);
  },

  async checkIn(payload: { appointmentId?: string; patientId?: string; doctorId?: string }): Promise<any> {
    return apiClient('/receptionist/check-in', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async updateQueueStatus(id: string, status: string): Promise<any> {
    return apiClient(`/receptionist/queue/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  async getPatients(search?: string): Promise<any[]> {
    return apiClient(`/receptionist/patients${search ? `?search=${encodeURIComponent(search)}` : ''}`);
  },

  async getDoctors(): Promise<any[]> {
    return apiClient('/receptionist/doctors');
  },
};
