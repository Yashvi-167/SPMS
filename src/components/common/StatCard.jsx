import React from 'react';
import clsx from 'clsx';

export const StatCard = ({ title, value, icon: Icon, description, trend, trendType = 'up', className = '' }) => {
  return (
    <div className={clsx('glass-card p-6 flex items-center justify-between border-l-4 border-l-brand-500 shadow-glow-sm', className)}>
      <div className="space-y-1">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">{title}</span>
        <h4 className="text-3xl font-extrabold text-white font-display">{value}</h4>
        
        {description && (
          <p className="text-xs text-slate-500 flex items-center gap-1">
            {trend && (
              <span className={clsx(
                'font-bold',
                trendType === 'up' ? 'text-emerald-400' : 'text-rose-400'
              )}>
                {trend}
              </span>
            )}
            {description}
          </p>
        )}
      </div>
      
      {Icon && (
        <div className="p-3 bg-[#1b1b3a] rounded-xl text-brand-400 border border-slate-800 shadow-inner">
          <Icon className="w-6 h-6" />
        </div>
      )}
    </div>
  );
};
export default StatCard;
