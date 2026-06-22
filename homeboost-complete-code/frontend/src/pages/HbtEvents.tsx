import { FormEvent, useEffect, useState } from 'react';
import { api } from '../api/client';
import { DashboardShell } from '../components/DashboardShell';
import { DataTable } from '../components/DataTable';

type EventRow = Record<string, unknown> & { id: number; title: string; event_type: string; starts_at: string; location: string; status: string };

export function HbtEvents() {
  const [rows, setRows] = useState<EventRow[]>([]);
  const [status, setStatus] = useState<string | null>(null);
  const load = () => api<{ events: EventRow[] }>('/events?limit=50').then((data) => setRows(data.events)).catch(() => setRows([]));
  useEffect(() => { load(); }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    try {
      await api('/events', { method: 'POST', body: JSON.stringify({
        title: form.get('title'),
        description: form.get('description'),
        startsAt: form.get('startsAt'),
        location: form.get('location')
      }) });
      setStatus('Event created.');
      event.currentTarget.reset();
      load();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Create failed');
    }
  }

  return (
    <DashboardShell title="Events">
      <form onSubmit={submit} className="card mb-8 grid gap-4 md:grid-cols-2">
        <input className="input" name="title" placeholder="Event title" required />
        <input className="input" name="startsAt" type="datetime-local" required />
        <input className="input" name="location" placeholder="Location" />
        <input className="input" name="description" placeholder="Description" />
        <button className="btn-primary md:w-fit">Create event</button>
        {status ? <p className="text-sm font-semibold text-brand-700">{status}</p> : null}
      </form>
      <DataTable rows={rows} columns={[
        { key: 'id', label: 'ID' },
        { key: 'title', label: 'Title' },
        { key: 'event_type', label: 'Type' },
        { key: 'starts_at', label: 'Start' },
        { key: 'location', label: 'Location' },
        { key: 'status', label: 'Status' }
      ]} />
    </DashboardShell>
  );
}
