"use client";

// Re-export Zustand store and types for drop-in compatibility
export {
  useAuthStore,
  useAuth,
  normalizeBackendRole,
  toBackendRole,
  type Role,
  type AuthState,
} from '../stores/auth.store';

// Optional wrapper if needed for compatibility (no-op with Zustand)
export function AuthProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
