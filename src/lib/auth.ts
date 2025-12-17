import type { LoginResponse } from '@/types/api';

const USER_STORAGE_KEY = 'techblog:user';

export function saveUserSession(user: LoginResponse) {
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
}

export function getStoredUser(): LoginResponse | null {
  const raw = localStorage.getItem(USER_STORAGE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as LoginResponse;
  } catch {
    return null;
  }
}

export function clearUserSession() {
  localStorage.removeItem(USER_STORAGE_KEY);
}
