import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import type { Role } from '../types';

const links: Record<Role, { to: string; label: string }[]> = {
  admin: [
    { to: '/admin', label: 'Overview' },
    { to: '/admin/users', label: 'Users' },
    { to: '/admin/partnerships', label: 'Partnerships' },
    { to: '/admin/content', label: 'Content' },
    { to: '/admin/messages', label: 'Messages' }
  ],
  hbt_admin: [
    { to: '/hbt/dashboard', label: 'Overview' },
    { to: '/hbt/companies', label: 'Companies' },
    { to: '/hbt/employees', label: 'Employees' },
    { to: '/hbt/events', label: 'Events' },
    { to: '/hbt/messages', label: 'Messages' }
  ],
  hbt_member: [
    { to: '/hbt/dashboard', label: 'Overview' },
    { to: '/hbt/messages', label: 'Messages' },
    { to: '/hbt/events', label: 'Events' }
  ],
  employee: [
    { to: '/employee-portal', label: 'Overview' },
    { to: '/employee/resources', label: 'Resources' },
    { to: '/employee/quiz', label: 'Quiz' },
    { to: '/employee/messages', label: 'Messages' }
  ]
};

export function DashboardShell({ title, children }: { title: string; children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const role = user?.role || 'employee';
  const nav = links[role];

  return (
    <div className="min-h-screen bg-slate-100">
      <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-slate-200 bg-white p-6 lg:block">
        <Link to="/" className="mb-8 flex items-center gap-2 text-xl font-black text-brand-900">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-700 text-white">HB</span>
          HomeBoost
        </Link>
        <nav className="space-y-2">
          {nav.map((item) => (
            <NavLink key={item.to} to={item.to} className={({ isActive }) =>
              `block rounded-xl px-4 py-3 text-sm font-semibold ${isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-50'}`
            }>
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="lg:pl-72">
        <header className="border-b border-slate-200 bg-white px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="kicker">{role.replace('_', ' ')}</p>
              <h1 className="text-2xl font-black text-slate-950">{title}</h1>
            </div>
            <div className="text-right text-sm">
              <p className="font-semibold text-slate-800">{user?.firstName || user?.first_name} {user?.lastName || user?.last_name}</p>
              <button onClick={logout} className="font-semibold text-brand-700">Logout</button>
            </div>
          </div>
          <nav className="mt-4 flex gap-2 overflow-x-auto lg:hidden">
            {nav.map((item) => <Link className="btn-secondary whitespace-nowrap py-2" key={item.to} to={item.to}>{item.label}</Link>)}
          </nav>
        </header>
        <section className="px-4 py-8 sm:px-6 lg:px-8">{children}</section>
      </main>
    </div>
  );
}
