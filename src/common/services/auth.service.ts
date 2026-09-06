import { apiClient } from './api';

export interface UserProfile {
  id: string;
  email: string;
  name?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  phoneNumber?: string | null;
  phone?: string | null;
  avatar?: string | null;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'PATIENT' | 'DOCTOR' | 'CLINIC_MANAGER' | 'RECEPTIONIST' | 'SUPPORT_STAFF';
  isEmailVerified?: boolean;
  emailVerifiedAt?: string | null;
  avatarUrl?: string | null;
  lastLoginAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
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

export interface ResetPasswordPayload {
  email: string;
  code: string;
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
    const { email, password, name, role } = payload;
    const data = await apiClient<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        email,
        password,
        name,
        ...(role ? { role } : {}),
      }),
    });

    if (typeof window !== 'undefined' && data.accessToken) {
      localStorage.setItem('medcare.accessToken', data.accessToken);
      localStorage.setItem('medcare.user', JSON.stringify(data.user));
    }

    return data;
  },

  async googleAuth(idToken: string): Promise<AuthResponse> {
    const data = await apiClient<AuthResponse>('/auth/google', {
      method: 'POST',
      body: JSON.stringify({ idToken }),
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

  async verifySession(): Promise<{ valid: boolean; user?: any }> {
    return apiClient('/auth/verify', {
      method: 'GET',
    });
  },

  async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
    return apiClient('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });
  },

  async forgotPassword(email: string): Promise<{ message?: string; expiresInSeconds?: number }> {
    return apiClient('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email: email.toLowerCase().trim() }),
    });
  },

  async resetPassword(payload: ResetPasswordPayload): Promise<{ success: boolean; message?: string }> {
    return apiClient('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({
        email: payload.email.toLowerCase().trim(),
        code: payload.code.trim(),
        password: payload.password,
      }),
    });
  },

  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('medcare.accessToken');
      localStorage.removeItem('medcare.user');
      localStorage.removeItem('medcare.session');
      localStorage.removeItem('medcare-auth-storage');
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
