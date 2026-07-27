import React from 'react';
import clsx from 'clsx';
import { STATUSES, PRIORITIES } from '../../data/mockData';

export const Badge = ({ id, type = 'status', text }) => {
  // Backwards compatibility for when text was passed instead of id
  // Since we moved to ID-based, ideally we just pass `id`.
  
  if (type === 'status') {
    const statusObj = STATUSES.find(s => s.StatusID === id) || STATUSES.find(s => s.StatusName === text);
    if (statusObj) {
      return (
        <span className={clsx(statusObj.StatusCssClass, 'font-sans font-normal')}>
          {statusObj.StatusName}
        </span>
      );
    }
  }

  if (type === 'priority') {
    const priorityObj = PRIORITIES.find(p => p.PriorityID === id) || PRIORITIES.find(p => p.PriorityName === text);
    if (priorityObj) {
      return (
        <span className={clsx(priorityObj.PriorityCssClass, 'font-sans font-normal')}>
          {priorityObj.PriorityName}
        </span>
      );
    }
  }

  if (type === 'role') {
    let roleStyles = 'bg-slate-500/10 text-slate-400 border border-slate-500/20';
    if (text === 'Admin') roleStyles = 'bg-purple-500/10 text-purple-400 border border-purple-500/20';
    if (text === 'Faculty') roleStyles = 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20';
    if (text === 'Student') roleStyles = 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
    
    return (
      <span className={clsx('px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide inline-flex items-center gap-1.5', roleStyles)}>
        <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
        {text}
      </span>
    );
  }

  return (
    <span className="badge bg-dark">
      {text || 'Unknown'}
    </span>
  );
};
