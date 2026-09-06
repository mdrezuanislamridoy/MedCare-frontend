import { apiClient } from '../../../common/services/api';

export interface ClinicManagerStats {
  totalDoctors: number;
  totalRooms: number;
  activeAppointmentsToday: number;
  occupancyRate: number;
  revenueThisMonth: number;
  staffOnDuty: number;
}

export const clinicManagerApi = {
  async getStats(): Promise<ClinicManagerStats> {
    return apiClient<ClinicManagerStats>('/clinics/clinic-manager/stats');
  },

  async getStaff(): Promise<any[]> {
    return apiClient('/clinics/clinic-manager/staff');
  },

  async getRooms(): Promise<any[]> {
    return apiClient('/clinics/clinic-manager/rooms');
  },

  async getClinics(): Promise<any[]> {
    return apiClient('/clinics');
  },
};
