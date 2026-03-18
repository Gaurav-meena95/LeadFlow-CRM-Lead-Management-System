import React from 'react';

export default function DataTable({ columns, data, onRowClick }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200">
            {columns.map((col) => (
              <th key={col.key} className="text-left px-4 py-3 text-slate-600 font-medium whitespace-nowrap">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="text-center py-10 text-slate-400">
                No records found
              </td>
            </tr>
          ) : (
            data.map((row, i) => (
              <tr
                key={row._id || i}
                onClick={() => onRowClick && onRowClick(row)}
                className={`border-b border-slate-100 last:border-0 ${onRowClick ? 'cursor-pointer hover:bg-slate-50' : ''}`}
              >
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3 text-slate-700">
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
