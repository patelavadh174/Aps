import { useEffect, useState } from 'react';
import { api } from '../api/client';
import { DashboardShell } from '../components/DashboardShell';
import type { Resource } from '../types';

export function EmployeeResources() {
  const [resources, setResources] = useState<Resource[]>([]);
  useEffect(() => { api<{ resources: Resource[] }>('/resources').then((data) => setResources(data.resources)).catch(() => setResources([])); }, []);

  return (
    <DashboardShell title="Resources">
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {resources.map((resource) => (
          <article className="card" key={resource.id}>
            <p className="kicker">{resource.category}</p>
            <h2 className="mt-3 text-xl font-black">{resource.title}</h2>
            <p className="mt-3 text-sm text-slate-600">{resource.summary}</p>
          </article>
        ))}
      </div>
    </DashboardShell>
  );
}
