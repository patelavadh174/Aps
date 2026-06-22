import { useEffect, useState } from 'react';
import { api } from '../api/client';
import { PageShell } from '../components/PageShell';

type Plan = { id: number; name: string; description: string; price_label: string; feature_list: string };

export function Pricing() {
  const [plans, setPlans] = useState<Plan[]>([]);
  useEffect(() => {
    api<{ pricing: Plan[] }>('/pricing').then((data) => setPlans(data.pricing)).catch(() => setPlans([]));
  }, []);
  return (
    <PageShell>
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <p className="kicker">Pricing</p>
        <h1 className="mt-4 text-4xl font-black text-slate-950">Flexible program packages</h1>
        <p className="mt-4 max-w-2xl text-slate-600">Every employer is different, so pricing is built around program size, support level, and reporting needs.</p>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {(plans.length ? plans : [
            { id: 1, name: 'Starter', description: 'Launch a branded employee portal.', price_label: 'Custom', feature_list: 'Employer portal\nResources\nBasic reporting' },
            { id: 2, name: 'Growth', description: 'Add engagement workflows.', price_label: 'Custom', feature_list: 'CSV enrollment\nMessaging\nEvents' },
            { id: 3, name: 'Enterprise', description: 'Scale across programs.', price_label: 'Custom', feature_list: 'Advanced reporting\nIntegrations\nPriority support' }
          ]).map((plan) => (
            <article className="card" key={plan.id}>
              <h2 className="text-2xl font-black">{plan.name}</h2>
              <p className="mt-2 text-slate-600">{plan.description}</p>
              <p className="mt-6 text-3xl font-black text-brand-700">{plan.price_label}</p>
              <ul className="mt-6 space-y-2 text-sm text-slate-600">
                {plan.feature_list.split('\n').filter(Boolean).map((item) => <li key={item}>✓ {item}</li>)}
              </ul>
            </article>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
