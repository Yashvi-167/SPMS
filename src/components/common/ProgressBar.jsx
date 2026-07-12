import React from 'react';
import clsx from 'clsx';

export const ProgressBar = ({ percentage, size = 'md', showText = false, colorClass }) => {
  const cleanPercent = Math.min(Math.max(Number(percentage || 0), 0), 100);

  const sizes = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  const getProgressColor = () => {
    if (colorClass) return colorClass;
    if (cleanPercent === 100) return 'bg-gradient-to-r from-emerald-500 to-teal-500';
    if (cleanPercent > 60) return 'bg-gradient-to-r from-brand-500 to-indigo-500';
    if (cleanPercent > 20) return 'bg-gradient-to-r from-amber-500 to-orange-500';
    return 'bg-gradient-to-r from-rose-500 to-red-500';
  };

  return (
    <div className="w-full flex items-center gap-3">
      <div className="w-full bg-[#1b1b3a] rounded-full overflow-hidden border border-slate-800/40">
        <div
          className={clsx('transition-all duration-500 ease-out rounded-full', sizes[size], getProgressColor())}
          style={{ width: `${cleanPercent}%` }}
        />
      </div>
      {showText && (
        <span className="text-xs font-bold text-slate-300 min-w-[2.5rem] text-right">
          {cleanPercent}%
        </span>
      )}
    </div>
  );
};
export default ProgressBar;
