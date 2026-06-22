import { useEffect, useState } from 'react';
import { api } from '../api/client';
import { DashboardShell } from '../components/DashboardShell';
import { DataTable } from '../components/DataTable';

type ThreadRow = Record<string, unknown> & { id: number; first_name: string; last_name: string; email: string; subject: string; status: string; last_message?: string };

export function HbtMessages({ title = 'Messages' }: { title?: string }) {
  const [rows, setRows] = useState<ThreadRow[]>([]);
  useEffect(() => { api<{ threads: ThreadRow[] }>('/messages/threads?limit=50').then((data) => setRows(data.threads)).catch(() => setRows([])); }, []);
  return (
    <DashboardShell title={title}>
      <DataTable rows={rows} columns={[
        { key: 'id', label: 'Thread' },
        { key: 'first_name', label: 'First' },
        { key: 'last_name', label: 'Last' },
        { key: 'email', label: 'Email' },
        { key: 'status', label: 'Status' },
        { key: 'last_message', label: 'Last message' }
      ]} />
    </DashboardShell>
  );
}
