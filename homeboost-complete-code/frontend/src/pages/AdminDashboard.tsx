import { Link } from 'react-router-dom';
import { DashboardShell } from '../components/DashboardShell';
import { StatCard } from '../components/StatCard';

export function AdminDashboard() {
  return (
    <DashboardShell title="Admin Dashboard">
      <div className="grid gap-6 md:grid-cols-4">
        <StatCard label="Platform scope" value="A-Z" helper="CMS, users, HBTs, partnerships" />
        <StatCard label="Security" value="RBAC" helper="JWT + role-protected routes" />
        <StatCard label="Content" value="CMS" helper="Pages, FAQs, pricing, resources" />
        <StatCard label="Operations" value="Live" helper="Messages, quizzes, enrollment" />
      </div>
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {[['Users', '/admin/users'], ['Partnerships', '/admin/partnerships'], ['Content', '/admin/content']].map(([label, to]) => (
          <Link className="card hover:border-brand-600" to={to} key={label}><h2 className="text-xl font-black">Manage {label}</h2><p className="mt-2 text-slate-600">Open the {label.toLowerCase()} control center.</p></Link>
        ))}
      </div>
    </DashboardShell>
  );
}
