import { useEffect, useState } from 'react';
import { api } from '../api/client';
import { DashboardShell } from '../components/DashboardShell';
import { DataTable } from '../components/DataTable';

type UserRow = Record<string, unknown> & { id: number; first_name: string; last_name: string; email: string; role: string; status: string; employer_name?: string };

export function AdminUsers() {
  const [users, setUsers] = useState<UserRow[]>([]);
  useEffect(() => { api<{ users: UserRow[] }>('/users?limit=50').then((data) => setUsers(data.users)).catch(() => setUsers([])); }, []);
  return (
    <DashboardShell title="Users">
      <DataTable rows={users} columns={[
        { key: 'id', label: 'ID' },
        { key: 'first_name', label: 'First' },
        { key: 'last_name', label: 'Last' },
        { key: 'email', label: 'Email' },
        { key: 'role', label: 'Role' },
        { key: 'status', label: 'Status' },
        { key: 'employer_name', label: 'Employer' }
      ]} />
    </DashboardShell>
  );
}
