import { Link } from 'react-router-dom';
import { PageShell } from '../components/PageShell';

export function NotFound() {
  return (
    <PageShell>
      <section className="mx-auto max-w-3xl px-4 py-20 text-center">
        <p className="kicker">404</p>
        <h1 className="mt-4 text-4xl font-black">This page went house hunting and got lost.</h1>
        <p className="mt-4 text-slate-600">No worries. The homepage still has the keys.</p>
        <Link className="btn-primary mt-8" to="/">Go home</Link>
      </section>
    </PageShell>
  );
}
