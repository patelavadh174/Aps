import { FormEvent, useEffect, useState } from 'react';
import { api } from '../api/client';
import { DashboardShell } from '../components/DashboardShell';
import { DataTable } from '../components/DataTable';

type PartnershipRow = Record<string, unknown> & { id: number; name: string; slug: string; employer_name: string; hbt_name: string; employee_count: number; status: string };

export function AdminPartnerships() {
  const [rows, setRows] = useState<PartnershipRow[]>([]);
  const [status, setStatus] = useState<string | null>(null);
  const load = () => api<{ partnerships: PartnershipRow[] }>('/partnerships?limit=50').then((data) => setRows(data.partnerships)).catch(() => setRows([]));
  useEffect(() => { load(); }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    try {
      await api('/partnerships', { method: 'POST', body: JSON.stringify({
        employerName: form.get('employerName'),
        slug: form.get('slug'),
        heroHeadline: form.get('heroHeadline'),
        heroSubheadline: form.get('heroSubheadline')
      }) });
      setStatus('Partnership created.');
      event.currentTarget.reset();
      load();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Create failed');
    }
  }

  return (
    <DashboardShell title="Partnerships">
      <form onSubmit={submit} className="card mb-8 grid gap-4 md:grid-cols-2">
        <input className="input" name="employerName" placeholder="Employer name" required />
        <input className="input" name="slug" placeholder="portal-slug" required />
        <input className="input md:col-span-2" name="heroHeadline" placeholder="Hero headline" />
        <textarea className="input md:col-span-2" name="heroSubheadline" placeholder="Hero subheadline" />
        <button className="btn-primary md:w-fit">Create partnership</button>
        {status ? <p className="text-sm font-semibold text-brand-700">{status}</p> : null}
      </form>
      <DataTable rows={rows} columns={[
        { key: 'id', label: 'ID' },
        { key: 'employer_name', label: 'Employer' },
        { key: 'slug', label: 'Slug' },
        { key: 'hbt_name', label: 'HBT' },
        { key: 'employee_count', label: 'Employees' },
        { key: 'status', label: 'Status' }
      ]} />
    </DashboardShell>
  );
}
