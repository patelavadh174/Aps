import { ChangeEvent, useEffect, useState } from 'react';
import { api } from '../api/client';
import { DashboardShell } from '../components/DashboardShell';
import { DataTable } from '../components/DataTable';

type UserRow = Record<string, unknown> & { id: number; first_name: string; last_name: string; email: string; role: string; status: string; employer_name?: string };

export function HbtEmployees() {
  const [rows, setRows] = useState<UserRow[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [partnershipId, setPartnershipId] = useState('1');
  const [status, setStatus] = useState<string | null>(null);
  const load = () => api<{ users: UserRow[] }>('/users?role=employee&limit=50').then((data) => setRows(data.users)).catch(() => setRows([]));
  useEffect(() => { load(); }, []);

  async function upload() {
    if (!file) return;
    const form = new FormData();
    form.append('file', file);
    form.append('partnershipId', partnershipId);
    try {
      const result = await api<{ imported: number; skipped: number }>('/enrollment/upload', { method: 'POST', body: form });
      setStatus(`Imported ${result.imported}, skipped ${result.skipped}.`);
      load();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Upload failed');
    }
  }

  return (
    <DashboardShell title="Employees">
      <div className="card mb-8 grid gap-4 md:grid-cols-[1fr_140px_auto]">
        <input className="input" type="file" accept=".csv" onChange={(event: ChangeEvent<HTMLInputElement>) => setFile(event.target.files?.[0] || null)} />
        <input className="input" value={partnershipId} onChange={(event) => setPartnershipId(event.target.value)} placeholder="Partnership ID" />
        <button className="btn-primary" onClick={upload}>Upload CSV</button>
        {status ? <p className="text-sm font-semibold text-brand-700 md:col-span-3">{status}</p> : null}
      </div>
      <DataTable rows={rows} columns={[
        { key: 'id', label: 'ID' },
        { key: 'first_name', label: 'First' },
        { key: 'last_name', label: 'Last' },
        { key: 'email', label: 'Email' },
        { key: 'status', label: 'Status' },
        { key: 'employer_name', label: 'Employer' }
      ]} />
    </DashboardShell>
  );
}
