import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { roleHome } from '../api/client';
import { useAuth } from '../auth/AuthContext';
import { PageShell } from '../components/PageShell';

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    const form = new FormData(event.currentTarget);
    try {
      const user = await login(String(form.get('email')), String(form.get('password')));
      navigate(roleHome(user.role));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageShell>
      <section className="mx-auto max-w-md px-4 py-16 sm:px-6 lg:px-8">
        <form onSubmit={submit} className="card space-y-4">
          <div>
            <p className="kicker">Welcome back</p>
            <h1 className="mt-2 text-3xl font-black">Login to HomeBoost</h1>
          </div>
          <input className="input" name="email" type="email" placeholder="Email" required />
          <input className="input" name="password" type="password" placeholder="Password" required />
          {error ? <p className="rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p> : null}
          <button className="btn-primary w-full" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
          <p className="text-center text-sm text-slate-500">Need an account? <Link className="font-semibold text-brand-700" to="/signup">Sign up</Link></p>
        </form>
      </section>
    </PageShell>
  );
}
