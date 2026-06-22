export function DataTable<T extends Record<string, unknown>>({ rows, columns }: { rows: T[]; columns: { key: keyof T; label: string }[] }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-50 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
          <tr>{columns.map((col) => <th className="px-4 py-3" key={String(col.key)}>{col.label}</th>)}</tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.length ? rows.map((row, index) => (
            <tr key={index} className="hover:bg-slate-50">
              {columns.map((col) => <td className="px-4 py-3 text-slate-700" key={String(col.key)}>{String(row[col.key] ?? '')}</td>)}
            </tr>
          )) : (
            <tr><td className="px-4 py-8 text-center text-slate-500" colSpan={columns.length}>No records yet.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
