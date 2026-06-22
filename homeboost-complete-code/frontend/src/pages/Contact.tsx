import { FormEvent, useState } from 'react';
import { api } from '../api/client';
import { PageShell } from '../components/PageShell';

export function Contact() {
  const [status, setStatus] = useState<string | null>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    try {
      await api('/contact', {
        method: 'POST',
        body: JSON.stringify({
          name: form.get('name'),
          email: form.get('email'),
          company: form.get('company'),
          message: form.get('message')
        })
      });
      setStatus('Message sent. The HomeBoost team will follow up.');
      event.currentTarget.reset();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Message failed.');
    }
  }

  return (
    <PageShell>
      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div>
          <p className="kicker">Contact</p>
          <h1 className="mt-4 text-4xl font-black text-slate-950">Launch HomeBoost for your team.</h1>
          <p className="mt-4 text-slate-600">Tell us about your employer program, partnership goals, or support questions.</p>
        </div>
        <form onSubmit={submit} className="card space-y-4">
          <input className="input" name="name" placeholder="Full name" required />
          <input className="input" name="email" type="email" placeholder="Email" required />
          <input className="input" name="company" placeholder="Company" />
          <textarea className="input min-h-32" name="message" placeholder="How can HomeBoost help?" required />
          <button className="btn-primary w-full" type="submit">Send message</button>
          {status ? <p className="text-sm font-semibold text-brand-700">{status}</p> : null}
        </form>
      </section>
    </PageShell>
  );
}
