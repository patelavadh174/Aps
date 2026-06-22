export type Role = 'admin' | 'hbt_admin' | 'hbt_member' | 'employee';

export interface User {
  id: number;
  firstName?: string;
  first_name?: string;
  lastName?: string;
  last_name?: string;
  email: string;
  role: Role;
  partnershipId?: number | null;
  partnership_id?: number | null;
  hbtId?: number | null;
  hbt_id?: number | null;
}

export interface ApiEnvelope<T> {
  status: 'success' | 'error';
  message: string;
  data: T;
  errors?: unknown;
}

export interface Resource {
  id: number;
  title: string;
  slug: string;
  category: string;
  summary: string;
  body?: string;
}

export interface EventItem {
  id: number;
  title: string;
  event_type: string;
  starts_at: string;
  location?: string;
}
