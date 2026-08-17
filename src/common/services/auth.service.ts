import { apiClient } from './api';

export interface UserProfile {
  id: string;
  email: string;
  name?: string | null;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'PATIENT' | 'DOCTOR' | 'CLINIC_MANAGER' | 'RECEPTIONIST' | 'SUPPORT_STAFF';
  emailVerifiedAt?: string | null;
  lastLoginAt?: string | null;
  doctorProfile?: any;
  patientProfile?: any;
}

export interface AuthResponse {
  accessToken: string;
  user: UserProfile;
}

export interface RegisterPayload {
  email: string;
  password: string;
  name?: string;
  role?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export const authService = {
  async login(payload: LoginPayload): Promise<AuthResponse> {
    const data = await apiClient<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    if (typeof window !== 'undefined' && data.accessToken) {
      localStorage.setItem('medcare.accessToken', data.accessToken);
      localStorage.setItem('medcare.user', JSON.stringify(data.user));
    }

    return data;
  },

  async register(payload: RegisterPayload): Promise<AuthResponse> {
    const data = await apiClient<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    if (typeof window !== 'undefined' && data.accessToken) {
      localStorage.setItem('medcare.accessToken', data.accessToken);
      localStorage.setItem('medcare.user', JSON.stringify(data.user));
    }

    return data;
  },

  async getCurrentUser(): Promise<UserProfile> {
    return apiClient<UserProfile>('/auth/me', {
      method: 'GET',
    });
  },

  async forgotPassword(email: string): Promise<{ success: boolean; message: string }> {
    return apiClient('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  async resetPassword(payload: { email: string; code: string; password: string }): Promise<{ success: boolean; message: string }> {
    return apiClient('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('medcare.accessToken');
      localStorage.removeItem('medcare.user');
      localStorage.removeItem('medcare.session');
    }
  },

  getStoredToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('medcare.accessToken');
  },

  getStoredUser(): UserProfile | null {
    if (typeof window === 'undefined') return null;
    try {
      const user = localStorage.getItem('medcare.user');
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  },
};
