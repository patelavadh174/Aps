import { FormEvent, useEffect, useState } from 'react';
import { api } from '../api/client';
import { DashboardShell } from '../components/DashboardShell';
import type { Resource } from '../types';

export function AdminContent() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [status, setStatus] = useState<string | null>(null);
  const load = () => api<{ resources: Resource[] }>('/resources').then((data) => setResources(data.resources)).catch(() => setResources([]));
  useEffect(() => { load(); }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    try {
      await api('/resources', { method: 'POST', body: JSON.stringify({
        title: form.get('title'),
        slug: form.get('slug'),
        category: form.get('category'),
        summary: form.get('summary'),
        body: form.get('body'),
        visibility: 'employee',
        status: 'published'
      }) });
      setStatus('Resource published.');
      event.currentTarget.reset();
      load();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Save failed');
    }
  }

  return (
    <DashboardShell title="Content Management">
      <form onSubmit={submit} className="card mb-8 grid gap-4 md:grid-cols-2">
        <input className="input" name="title" placeholder="Resource title" required />
        <input className="input" name="slug" placeholder="resource-slug" required />
        <input className="input" name="category" placeholder="Category" />
        <input className="input" name="summary" placeholder="Short summary" />
        <textarea className="input md:col-span-2" name="body" placeholder="Resource body" required />
        <button className="btn-primary md:w-fit">Publish resource</button>
        {status ? <p className="text-sm font-semibold text-brand-700">{status}</p> : null}
      </form>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {resources.map((resource) => <article className="card" key={resource.id}><p className="kicker">{resource.category}</p><h2 className="mt-2 text-lg font-black">{resource.title}</h2><p className="mt-2 text-sm text-slate-600">{resource.summary}</p></article>)}
      </div>
    </DashboardShell>
  );
}
