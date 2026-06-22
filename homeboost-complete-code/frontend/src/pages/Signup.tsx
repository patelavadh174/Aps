import { FormEvent, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { roleHome } from '../api/client';
import { useAuth } from '../auth/AuthContext';
import { PageShell } from '../components/PageShell';

export function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    const form = new FormData(event.currentTarget);
    try {
      const user = await signup({
        firstName: String(form.get('firstName')),
        lastName: String(form.get('lastName')),
        email: String(form.get('email')),
        password: String(form.get('password')),
        partnershipSlug: String(form.get('partnershipSlug') || '') || undefined
      });
      navigate(roleHome(user.role));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageShell>
      <section className="mx-auto max-w-xl px-4 py-16 sm:px-6 lg:px-8">
        <form onSubmit={submit} className="card space-y-4">
          <div>
            <p className="kicker">Employee access</p>
            <h1 className="mt-2 text-3xl font-black">Create your HomeBoost account</h1>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <input className="input" name="firstName" placeholder="First name" required />
            <input className="input" name="lastName" placeholder="Last name" required />
          </div>
          <input className="input" name="email" type="email" placeholder="Work email" required />
          <input className="input" name="password" type="password" placeholder="Password, minimum 8 characters" minLength={8} required />
          <input className="input" name="partnershipSlug" placeholder="Employer portal slug, example: amc" defaultValue={params.get('partner') || ''} />
          {error ? <p className="rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p> : null}
          <button className="btn-primary w-full" disabled={loading}>{loading ? 'Creating account...' : 'Create account'}</button>
          <p className="text-center text-sm text-slate-500">Already have an account? <Link className="font-semibold text-brand-700" to="/login">Login</Link></p>
        </form>
      </section>
    </PageShell>
  );
}
