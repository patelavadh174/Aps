import { Link } from 'react-router-dom';
import { PageShell } from '../components/PageShell';

export function Home() {
  return (
    <PageShell>
      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
        <div>
          <p className="kicker">Employee benefit program</p>
          <h1 className="mt-4 text-5xl font-black tracking-tight text-slate-950 sm:text-6xl">Home-buying support as an employee benefit.</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            HomeBoost helps employers give employees practical guidance for buying a home, from readiness education to trusted Home Buying Team support.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/partners" className="btn-primary">Find your employer portal</Link>
            <Link to="/contact" className="btn-secondary">Book a program demo</Link>
          </div>
        </div>
        <div className="card bg-gradient-to-br from-white to-brand-50">
          <p className="kicker">Product flow</p>
          <div className="mt-6 space-y-4">
            {['Employer launches branded portal', 'Employees access resources and readiness quiz', 'Home Buying Team follows up through messages and events', 'Admins manage users, content, pricing, FAQs, and reports'].map((item, index) => (
              <div key={item} className="flex gap-4 rounded-2xl bg-white p-4 shadow-sm">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand-700 font-bold text-white">{index + 1}</span>
                <p className="font-semibold text-slate-800">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-white py-16">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 md:grid-cols-3 lg:px-8">
          {[
            ['For employers', 'Offer a meaningful financial wellness benefit without building a program from scratch.'],
            ['For employees', 'Learn what to do next before feeling pressured to buy.'],
            ['For teams', 'Track partnerships, resources, quiz submissions, messages, and events in one place.']
          ].map(([title, body]) => <article className="card" key={title}><h2 className="text-xl font-black">{title}</h2><p className="mt-3 text-slate-600">{body}</p></article>)}
        </div>
      </section>
    </PageShell>
  );
}
