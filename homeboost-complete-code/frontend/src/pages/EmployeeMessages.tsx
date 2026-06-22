import { FormEvent, useEffect, useState } from 'react';
import { api } from '../api/client';
import { DashboardShell } from '../components/DashboardShell';

type Message = { id: number; body: string; first_name: string; last_name: string; role: string; created_at: string };
type ThreadData = { thread: { id: number; status: string; subject: string }; messages: Message[] };

export function EmployeeMessages() {
  const [data, setData] = useState<ThreadData | null>(null);
  const [body, setBody] = useState('');
  const load = () => api<ThreadData>('/messages/my-thread').then(setData).catch(() => setData(null));
  useEffect(() => { load(); }, []);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!body.trim()) return;
    await api('/messages/my-thread', { method: 'POST', body: JSON.stringify({ body }) });
    setBody('');
    load();
  }

  return (
    <DashboardShell title="Messages">
      <div className="card max-w-4xl">
        <h2 className="text-xl font-black">{data?.thread.subject || 'HomeBoost Support'}</h2>
        <div className="mt-6 space-y-4">
          {(data?.messages || []).map((message) => (
            <article className="rounded-2xl bg-slate-50 p-4" key={message.id}>
              <p className="text-sm font-bold text-slate-800">{message.first_name} {message.last_name} · {message.role}</p>
              <p className="mt-2 text-slate-700">{message.body}</p>
              <p className="mt-2 text-xs text-slate-400">{new Date(message.created_at).toLocaleString()}</p>
            </article>
          ))}
        </div>
        <form onSubmit={submit} className="mt-6 flex gap-3">
          <input className="input" value={body} onChange={(event) => setBody(event.target.value)} placeholder="Write a message to your Home Buying Team" />
          <button className="btn-primary">Send</button>
        </form>
      </div>
    </DashboardShell>
  );
}
