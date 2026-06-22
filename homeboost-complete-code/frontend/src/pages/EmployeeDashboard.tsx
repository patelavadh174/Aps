import { useEffect, useState } from 'react';
import { api } from '../api/client';
import { DashboardShell } from '../components/DashboardShell';
import { StatCard } from '../components/StatCard';
import type { EventItem, Resource } from '../types';

type DashboardData = {
  stats: { resources: number; upcomingEvents: number; activeQuizzes: number; unreadMessages: number };
  resources: Resource[];
  events: EventItem[];
};

export function EmployeeDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  useEffect(() => { api<DashboardData>('/employee-portal/dashboard').then(setData).catch(() => setData(null)); }, []);

  return (
    <DashboardShell title="Employee Portal">
      <div className="grid gap-6 md:grid-cols-4">
        <StatCard label="Resources" value={data?.stats.resources ?? '—'} />
        <StatCard label="Events" value={data?.stats.upcomingEvents ?? '—'} />
        <StatCard label="Quizzes" value={data?.stats.activeQuizzes ?? '—'} />
        <StatCard label="Unread messages" value={data?.stats.unreadMessages ?? '—'} />
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="card">
          <h2 className="text-xl font-black">Recommended resources</h2>
          <div className="mt-4 space-y-4">
            {(data?.resources || []).map((resource) => <article key={resource.id}><p className="font-bold">{resource.title}</p><p className="text-sm text-slate-600">{resource.summary}</p></article>)}
          </div>
        </section>
        <section className="card">
          <h2 className="text-xl font-black">Upcoming events</h2>
          <div className="mt-4 space-y-4">
            {(data?.events || []).map((event) => <article key={event.id}><p className="font-bold">{event.title}</p><p className="text-sm text-slate-600">{new Date(event.starts_at).toLocaleString()} · {event.location}</p></article>)}
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}
