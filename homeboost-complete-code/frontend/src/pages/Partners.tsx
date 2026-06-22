import { Link } from 'react-router-dom';
import { PageShell } from '../components/PageShell';

export function Partners() {
  return (
    <PageShell>
      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <p className="kicker">Employer portals</p>
        <h1 className="mt-4 text-4xl font-black text-slate-950">Find your employer home-buying benefit portal.</h1>
        <p className="mt-4 text-slate-600">Use your employer’s HomeBoost link to access resources, events, messaging, and readiness tools.</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <Link to="/amc" className="card hover:border-brand-600">
            <h2 className="text-xl font-black">AMC Manufacturing</h2>
            <p className="mt-2 text-slate-600">Demo employer portal included with seed data.</p>
          </Link>
          <Link to="/contact" className="card hover:border-brand-600">
            <h2 className="text-xl font-black">Need your company added?</h2>
            <p className="mt-2 text-slate-600">Contact HomeBoost to launch a program.</p>
          </Link>
        </div>
      </section>
    </PageShell>
  );
}
