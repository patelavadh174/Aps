import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../api/client';
import { PageShell } from '../components/PageShell';
import type { EventItem, Resource } from '../types';

type PartnershipData = {
  partnership: {
    id: number;
    slug: string;
    employer_name: string;
    hero_headline: string;
    hero_subheadline: string;
    primary_cta_label: string;
    hbt_name?: string;
    support_email?: string;
  };
  resources: Resource[];
  events: EventItem[];
};

export function PartnershipLanding() {
  const { slug } = useParams();
  const [data, setData] = useState<PartnershipData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    api<PartnershipData>(`/public-partnerships/${slug}`).then(setData).catch((err) => setError(err instanceof Error ? err.message : 'Portal not found'));
  }, [slug]);

  if (error) {
    return <PageShell><section className="mx-auto max-w-3xl px-4 py-20"><h1 className="text-4xl font-black">Employer portal not found</h1><p className="mt-4 text-slate-600">{error}</p></section></PageShell>;
  }
  if (!data) return <PageShell><section className="mx-auto max-w-3xl px-4 py-20 text-slate-500">Loading portal...</section></PageShell>;

  const { partnership, resources, events } = data;
  return (
    <PageShell>
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <p className="kicker">{partnership.employer_name}</p>
        <h1 className="mt-4 max-w-4xl text-5xl font-black text-slate-950">{partnership.hero_headline}</h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">{partnership.hero_subheadline}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to={`/signup?partner=${partnership.slug}`} className="btn-primary">{partnership.primary_cta_label}</Link>
          <Link to="/login" className="btn-secondary">Already enrolled? Login</Link>
        </div>
      </section>
      <section className="mx-auto grid max-w-7xl gap-6 px-4 pb-16 sm:px-6 md:grid-cols-2 lg:px-8">
        <div className="card">
          <h2 className="text-2xl font-black">Featured resources</h2>
          <div className="mt-5 space-y-4">
            {resources.map((resource) => <article key={resource.id}><p className="font-bold">{resource.title}</p><p className="text-sm text-slate-600">{resource.summary}</p></article>)}
          </div>
        </div>
        <div className="card">
          <h2 className="text-2xl font-black">Upcoming events</h2>
          <div className="mt-5 space-y-4">
            {events.length ? events.map((event) => <article key={event.id}><p className="font-bold">{event.title}</p><p className="text-sm text-slate-600">{new Date(event.starts_at).toLocaleString()} · {event.location}</p></article>) : <p className="text-slate-500">No upcoming events posted yet.</p>}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
