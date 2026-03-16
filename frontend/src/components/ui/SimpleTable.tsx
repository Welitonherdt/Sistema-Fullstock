type Column<T> = {
  key: keyof T;
  label: string;
};

export default function SimpleTable<T extends Record<string, any>>({
  columns,
  rows
}: {
  columns: Column<T>[];
  rows: T[];
}) {
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            {columns.map((column) => (
              <th key={String(column.key)} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map((row, index) => (
            <tr key={index} className="hover:bg-slate-50">
              {columns.map((column) => (
                <td key={String(column.key)} className="px-4 py-3 text-sm text-slate-700">
                  {String(row[column.key] ?? "-")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
