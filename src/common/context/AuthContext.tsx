"use client";

import React, { useEffect } from 'react';
import { useAuthStore } from '../stores/auth.store';

// Re-export Zustand store and types for drop-in compatibility
export {
  useAuthStore,
  useAuth,
  normalizeBackendRole,
  toBackendRole,
  getRoleRoute,
  ROLE_ROUTES,
  type Role,
  type AuthState,
} from '../stores/auth.store';

/**
 * Root AuthProvider that initializes authentication and handles session expiry across all pages.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Hydrate and verify auth state on initial mount
    useAuthStore.getState().initialize();

    // Listen for unauthorized 401 events from api client
    const handleUnauthorized = () => {
      useAuthStore.getState().logout();
    };

    window.addEventListener('medcare:unauthorized', handleUnauthorized);
    return () => {
      window.removeEventListener('medcare:unauthorized', handleUnauthorized);
    };
  }, []);

  return <>{children}</>;
}
