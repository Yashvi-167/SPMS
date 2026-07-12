import React from 'react';
import clsx from 'clsx';
import { STATUSES, PRIORITIES } from '../../data/mockData';

export const Badge = ({ text, type = 'status' }) => {
  const getStyles = () => {
    const normText = String(text).trim();

    if (type === 'status') {
      switch (normText) {
        case STATUSES.COMPLETED:
          return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
        case STATUSES.IN_PROGRESS:
          return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
        case STATUSES.PENDING:
          return 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20';
        default:
          return 'bg-slate-500/10 text-slate-400 border border-slate-500/20';
      }
    }

    if (type === 'priority') {
      switch (normText) {
        case PRIORITIES.HIGH:
          return 'bg-rose-500/10 text-rose-400 border border-rose-500/20';
        case PRIORITIES.MEDIUM:
          return 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20';
        case PRIORITIES.LOW:
          return 'bg-sky-500/10 text-sky-400 border border-sky-500/20';
        default:
          return 'bg-slate-500/10 text-slate-400 border border-slate-500/20';
      }
    }

    if (type === 'role') {
      switch (normText) {
        case 'Admin':
          return 'bg-purple-500/10 text-purple-400 border border-purple-500/20';
        case 'Faculty':
          return 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20';
        case 'Student':
          return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
        default:
          return 'bg-slate-500/10 text-slate-400 border border-slate-500/20';
      }
    }

    return 'bg-slate-500/10 text-slate-400 border border-slate-500/20';
  };

  return (
    <span className={clsx('px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide inline-flex items-center gap-1.5', getStyles())}>
      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
      {text}
    </span>
  );
};
