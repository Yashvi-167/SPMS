import React from 'react';
import { useData } from '../../context/DataContext';
import { Activity } from 'lucide-react';

export const StatusList = () => {
  const { statuses } = useData();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black font-display text-white">Status Management</h1>
          <p className="text-slate-400 text-xs mt-1">
            View and manage system statuses and their styles.
          </p>
        </div>
      </div>

      <div className="glass-card p-6">
        <div className="flex items-center gap-2 mb-6">
          <Activity className="w-5 h-5 text-brand-400" />
          <h2 className="text-base font-bold text-slate-200 font-display uppercase tracking-wider">Status List</h2>
        </div>
        
        <div className="overflow-x-auto rounded-lg border border-slate-850">
          <table className="w-full border-collapse text-left text-sm text-slate-300">
            <thead className="bg-[#1b1b3a]/75 text-slate-200 uppercase text-xs tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-5 py-4 font-semibold">StatusID</th>
                <th className="px-5 py-4 font-semibold">StatusName</th>
                <th className="px-5 py-4 font-semibold">StatusCssClass</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40">
              {statuses && statuses.length > 0 ? (
                statuses.map((s) => (
                  <tr key={s.StatusID || s.StatusId} className="hover:bg-slate-800/20 transition-colors group">
                    <td className="px-5 py-4 font-semibold text-slate-200">
                      {s.StatusID || s.StatusId}
                    </td>
                    <td className="px-5 py-4">
                      <span className={s.StatusCssClass}>{s.StatusName}</span>
                    </td>
                    <td className="px-5 py-4 font-mono text-xs text-brand-400">
                      {s.StatusCssClass}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="text-center py-8 text-slate-500 text-sm">
                    No statuses found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StatusList;
