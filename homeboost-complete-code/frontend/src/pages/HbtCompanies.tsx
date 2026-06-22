import { useEffect, useState } from 'react';
import { api } from '../api/client';
import { DashboardShell } from '../components/DashboardShell';
import { DataTable } from '../components/DataTable';

type PartnershipRow = Record<string, unknown> & { id: number; employer_name: string; slug: string; employee_count: number; status: string };

export function HbtCompanies() {
  const [rows, setRows] = useState<PartnershipRow[]>([]);
  useEffect(() => { api<{ partnerships: PartnershipRow[] }>('/partnerships?limit=50').then((data) => setRows(data.partnerships)).catch(() => setRows([])); }, []);
  return (
    <DashboardShell title="Companies & Partnerships">
      <DataTable rows={rows} columns={[
        { key: 'id', label: 'ID' },
        { key: 'employer_name', label: 'Employer' },
        { key: 'slug', label: 'Portal' },
        { key: 'employee_count', label: 'Employees' },
        { key: 'status', label: 'Status' }
      ]} />
    </DashboardShell>
  );
}
