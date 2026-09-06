import { apiClient } from '../../../common/services/api';

export interface ClinicManagerStats {
  totalDoctors: number;
  totalRooms: number;
  activeAppointmentsToday: number;
  occupancyRate: number;
  revenueThisMonth: number;
  staffOnDuty: number;
  completedToday: number;
  cancelledToday: number;
  pendingVisits: number;
}

export const clinicManagerApi = {
  async getStats(): Promise<ClinicManagerStats> {
    return apiClient<ClinicManagerStats>('/clinics/clinic-manager/stats');
  },

  async getStaff(): Promise<any> {
    return apiClient('/clinics/clinic-manager/staff');
  },

  async getRooms(): Promise<any> {
    return apiClient('/clinics/clinic-manager/rooms');
  },

  async getClinics(): Promise<any> {
    return apiClient('/clinics');
  },

  async getDoctors(): Promise<any> {
    return apiClient('/doctors').catch(() => []);
  },

  async getAppointments(): Promise<any> {
    return apiClient('/appointments').catch(() => []);
  },

  async getPatients(): Promise<any> {
    return apiClient('/patients').catch(() => []);
  },

  async getQueue(): Promise<any> {
    return apiClient('/receptionist/queue').catch(() => []);
  },

  async getPayments(): Promise<any> {
    return apiClient('/billing/transactions').catch(() => []);
  },
};
