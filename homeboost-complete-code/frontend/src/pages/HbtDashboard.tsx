import { Link } from 'react-router-dom';
import { DashboardShell } from '../components/DashboardShell';
import { StatCard } from '../components/StatCard';

export function HbtDashboard() {
  return (
    <DashboardShell title="Home Buying Team Dashboard">
      <div className="grid gap-6 md:grid-cols-4">
        <StatCard label="Partnerships" value="Active" helper="Employer programs" />
        <StatCard label="Employees" value="Enrolled" helper="CSV and signup supported" />
        <StatCard label="Messages" value="Open" helper="Follow-up workflow" />
        <StatCard label="Events" value="Ready" helper="Workshops and sessions" />
      </div>
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {[['Companies', '/hbt/companies'], ['Employees', '/hbt/employees'], ['Messages', '/hbt/messages']].map(([label, to]) => (
          <Link className="card hover:border-brand-600" to={to} key={label}><h2 className="text-xl font-black">{label}</h2><p className="mt-2 text-slate-600">Manage {label.toLowerCase()} for assigned partnerships.</p></Link>
        ))}
      </div>
    </DashboardShell>
  );
}
