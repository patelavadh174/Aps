import { PublicNav } from './PublicNav';

export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <PublicNav />
      {children}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 py-8 text-sm text-slate-500 sm:px-6 lg:px-8 md:grid-cols-2">
          <p>© {new Date().getFullYear()} HomeBoost. Employee home-buying support, built with care.</p>
          <p className="md:text-right">Education and readiness guidance only. Not a final loan approval.</p>
        </div>
      </footer>
    </div>
  );
}
