import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { roleHome } from '../api/client';

export function PublicNav() {
  const { user, logout } = useAuth();
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-semibold ${isActive ? 'text-brand-700' : 'text-slate-600 hover:text-brand-700'}`;

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2 text-xl font-black text-brand-900">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-700 text-white">HB</span>
          HomeBoost
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          <NavLink className={linkClass} to="/partners">Partners</NavLink>
          <NavLink className={linkClass} to="/pricing">Pricing</NavLink>
          <NavLink className={linkClass} to="/contact">Contact</NavLink>
        </nav>
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link to={roleHome(user.role)} className="btn-secondary py-2">Dashboard</Link>
              <button onClick={logout} className="text-sm font-semibold text-slate-500 hover:text-slate-900">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-semibold text-slate-700">Login</Link>
              <Link to="/signup" className="btn-primary py-2">Sign up</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
