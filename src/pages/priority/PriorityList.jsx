import React from 'react';
import { useData } from '../../context/DataContext';
import { AlertCircle } from 'lucide-react';
import { Badge } from '../../components/common/Badge';

export const PriorityList = () => {
  const { priorities } = useData();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black font-display text-white">Priority Management</h1>
          <p className="text-slate-400 text-xs mt-1">
            System-wide task priority levels configuration.
          </p>
        </div>
      </div>

      <div className="glass-card p-6">
        <div className="flex items-center gap-2 mb-6">
          <AlertCircle className="w-5 h-5 text-brand-400" />
          <h2 className="text-base font-bold text-slate-200 font-display uppercase tracking-wider">Available Priorities</h2>
        </div>
        
        <div className="overflow-x-auto rounded-lg border border-slate-850">
          <table className="w-full border-collapse text-left text-sm text-slate-300">
            <thead className="bg-[#1b1b3a]/75 text-slate-200 uppercase text-xs tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-5 py-4 font-semibold">Priority Name</th>
                <th className="px-5 py-4 font-semibold">Badge Preview</th>
                <th className="px-5 py-4 font-semibold text-right">Settings</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40">
              {priorities && priorities.length > 0 ? (
                priorities.map((p, index) => (
                  <tr key={index} className="hover:bg-slate-800/20 transition-colors">
                    <td className="px-5 py-4">
                      <span className="font-semibold text-slate-200 block text-sm">{p}</span>
                    </td>
                    <td className="px-5 py-4">
                      <Badge text={p} type="priority" />
                    </td>
                    <td className="px-5 py-4 text-right">
                      <span className="text-xs text-slate-500 font-medium">System Default</span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="text-center py-8 text-slate-500 text-sm">
                    No priorities found.
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

export default PriorityList;
