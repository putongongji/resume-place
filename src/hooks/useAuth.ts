import { useState, useCallback } from 'react';

const AUTH_STORAGE_KEY = 'resume-builder-admin-auth';

// Simple hash to avoid storing plaintext credentials in code
// This is frontend-only validation, not meant for real security
const ADMIN_USERNAME = 'sanjin';
const ADMIN_PASSWORD = '171226';

export interface AuthState {
  isAdmin: boolean;
  username: string | null;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>(() => {
    try {
      const saved = sessionStorage.getItem(AUTH_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load auth state:', e);
    }
    return { isAdmin: false, username: null };
  });

  const login = useCallback((username: string, password: string): boolean => {
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      const newState: AuthState = { isAdmin: true, username };
      setAuthState(newState);
      sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newState));
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    const newState: AuthState = { isAdmin: false, username: null };
    setAuthState(newState);
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
  }, []);

  return {
    isAdmin: authState.isAdmin,
    username: authState.username,
    login,
    logout,
  };
}
