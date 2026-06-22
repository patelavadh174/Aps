import type { ApiEnvelope } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export class ApiError extends Error {
  statusCode: number;
  details?: unknown;

  constructor(statusCode: number, message: string, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.details = details;
  }
}

export function getToken() {
  return window.localStorage.getItem('homeboost_token');
}

export function setToken(token: string | null) {
  if (token) window.localStorage.setItem('homeboost_token', token);
  else window.localStorage.removeItem('homeboost_token');
}

export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers = new Headers(options.headers);
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }
  if (token) headers.set('Authorization', `Bearer ${token}`);

  const response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });
  const json = (await response.json().catch(() => null)) as ApiEnvelope<T> | null;

  if (!response.ok) {
    throw new ApiError(response.status, json?.message || 'Request failed', json?.errors);
  }
  return json?.data as T;
}

export function roleHome(role: string) {
  if (role === 'admin') return '/admin';
  if (role === 'hbt_admin' || role === 'hbt_member') return '/hbt/dashboard';
  return '/employee-portal';
}
