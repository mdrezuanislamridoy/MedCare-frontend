"use client";

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  authService,
  UserProfile,
  LoginPayload,
  RegisterPayload,
  ResetPasswordPayload,
} from '../services/auth.service';

export type Role =
  | 'patient'
  | 'doctor'
  | 'admin'
  | 'super-admin'
  | 'receptionist'
  | 'clinic-manager'
  | 'support-staff';

export const ROLE_ROUTES: Record<Role, string> = {
  patient: '/patient',
  doctor: '/doctor',
  receptionist: '/receptionist',
  'support-staff': '/support-staff',
  'clinic-manager': '/clinic-manager',
  admin: '/admin',
  'super-admin': '/super-admin',
};

export function getRoleRoute(role: Role): string {
  return ROLE_ROUTES[role] || '/dashboard';
}

export function normalizeBackendRole(backendRole?: string): Role {
  if (!backendRole) return 'patient';
  const upper = backendRole.toUpperCase();
  switch (upper) {
    case 'SUPER_ADMIN':
      return 'super-admin';
    case 'ADMIN':
      return 'admin';
    case 'DOCTOR':
      return 'doctor';
    case 'CLINIC_MANAGER':
      return 'clinic-manager';
    case 'RECEPTIONIST':
      return 'receptionist';
    case 'SUPPORT_STAFF':
      return 'support-staff';
    case 'PATIENT':
    default:
      return 'patient';
  }
}

export function toBackendRole(role: Role): string {
  switch (role) {
    case 'super-admin':
      return 'SUPER_ADMIN';
    case 'admin':
      return 'ADMIN';
    case 'doctor':
      return 'DOCTOR';
    case 'clinic-manager':
      return 'CLINIC_MANAGER';
    case 'receptionist':
      return 'RECEPTIONIST';
    case 'support-staff':
      return 'SUPPORT_STAFF';
    case 'patient':
    default:
      return 'PATIENT';
  }
}

export interface AuthState {
  user: UserProfile | null;
  token: string | null;
  role: Role;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (payload: LoginPayload) => Promise<UserProfile>;
  googleAuth: (idToken: string) => Promise<UserProfile>;
  register: (payload: RegisterPayload) => Promise<UserProfile>;
  forgotPassword: (email: string) => Promise<{ message?: string; expiresInSeconds?: number }>;
  resetPassword: (payload: ResetPasswordPayload) => Promise<{ success: boolean; message?: string }>;
  verifySession: () => Promise<boolean>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
  switchDemoRole: (targetRole: Role) => void;
  clearError: () => void;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      role: 'patient',
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (payload: LoginPayload) => {
        set({ isLoading: true, error: null });
        try {
          const data = await authService.login(payload);
          const role = normalizeBackendRole(data.user?.role);
          set({
            user: data.user,
            token: data.accessToken,
            role,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
          return data.user;
        } catch (err: any) {
          const msg = err?.message || 'Login failed. Please verify credentials.';
          set({ error: msg, isLoading: false, isAuthenticated: false });
          throw err;
        }
      },

      googleAuth: async (idToken: string) => {
        set({ isLoading: true, error: null });
        try {
          const data = await authService.googleAuth(idToken);
          const role = normalizeBackendRole(data.user?.role);
          set({
            user: data.user,
            token: data.accessToken,
            role,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
          return data.user;
        } catch (err: any) {
          const msg = err?.message || 'Google authentication failed.';
          set({ error: msg, isLoading: false });
          throw err;
        }
      },

      register: async (payload: RegisterPayload) => {
        set({ isLoading: true, error: null });
        try {
          const data = await authService.register(payload);
          const role = normalizeBackendRole(data.user?.role);
          set({
            user: data.user,
            token: data.accessToken,
            role,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
          return data.user;
        } catch (err: any) {
          const msg = err?.message || 'Registration failed. Please try again.';
          set({ error: msg, isLoading: false });
          throw err;
        }
      },

      forgotPassword: async (email: string) => {
        set({ isLoading: true, error: null });
        try {
          const res = await authService.forgotPassword(email);
          set({ isLoading: false, error: null });
          return res;
        } catch (err: any) {
          const msg = err?.message || 'Failed to request password reset code.';
          set({ error: msg, isLoading: false });
          throw err;
        }
      },

      resetPassword: async (payload: ResetPasswordPayload) => {
        set({ isLoading: true, error: null });
        try {
          const res = await authService.resetPassword(payload);
          set({ isLoading: false, error: null });
          return res;
        } catch (err: any) {
          const msg = err?.message || 'Failed to reset password.';
          set({ error: msg, isLoading: false });
          throw err;
        }
      },

      verifySession: async () => {
        try {
          const res = await authService.verifySession();
          return Boolean(res?.valid);
        } catch {
          return false;
        }
      },

      logout: () => {
        authService.logout();
        set({
          user: null,
          token: null,
          role: 'patient',
          isAuthenticated: false,
          error: null,
        });
      },

      refreshProfile: async () => {
        try {
          const profile = await authService.getCurrentUser();
          const role = normalizeBackendRole(profile.role);
          set({ user: profile, role, isAuthenticated: true });
        } catch (err) {
          console.warn('Silent refresh error:', err);
        }
      },

      switchDemoRole: (targetRole: Role) => {
        const dummyUser: UserProfile = {
          id: `demo-${targetRole}-id`,
          email: `${targetRole}@medcare.com`,
          name: `${targetRole.replace('-', ' ').toUpperCase()} User`,
          role: toBackendRole(targetRole) as any,
          isEmailVerified: true,
        };
        const demoToken = 'demo-mode-token';
        if (typeof window !== 'undefined') {
          localStorage.setItem('medcare.accessToken', demoToken);
          localStorage.setItem('medcare.user', JSON.stringify(dummyUser));
        }
        set({
          user: dummyUser,
          token: demoToken,
          role: targetRole,
          isAuthenticated: true,
          error: null,
        });
      },

      clearError: () => set({ error: null }),

      initialize: async () => {
        const token = get().token || authService.getStoredToken();
        const user = get().user || authService.getStoredUser();

        if (token && user) {
          const role = normalizeBackendRole(user.role);
          set({ token, user, role, isAuthenticated: true });

          // If in demo mode, skip server verification
          if (token === 'demo-mode-token') {
            return;
          }

          // Silent background verification against backend
          try {
            const profile = await authService.getCurrentUser();
            const verifiedRole = normalizeBackendRole(profile.role);
            set({ user: profile, role: verifiedRole, isAuthenticated: true });
          } catch (err: any) {
            // If 401 Unauthorized, token has expired
            if (err?.statusCode === 401) {
              get().logout();
            }
          }
        }
      },
    }),
    {
      name: 'medcare-auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        role: state.role,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);

// Alias hook for drop-in replacement across components
export const useAuth = useAuthStore;
