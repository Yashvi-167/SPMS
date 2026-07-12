import React, { useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { StatCard } from '../../components/common/StatCard';
import { ProgressBar } from '../../components/common/ProgressBar';
import { FolderGit, Users, ClipboardCheck, Award } from 'lucide-react';
import { STATUSES } from '../../data/mockData';
import { Link } from 'react-router-dom';

export const FacultyDashboard = () => {
  const { currentUser } = useAuth();
  const { projects, users, tasks } = useData();

  // Find projects supervised by this faculty member
  const supervisedProjects = useMemo(() => {
    if (!currentUser) return [];
    return projects.filter((p) => p.FacultyId === currentUser.UserId);
  }, [projects, currentUser]);

  // Unique student IDs supervised by this faculty member
  const supervisedStudentIds = useMemo(() => {
    return [...new Set(supervisedProjects.map((p) => p.StudentId))];
  }, [supervisedProjects]);

  // Supervised tasks
  const supervisedTasks = useMemo(() => {
    const projIds = supervisedProjects.map((p) => p.ProjectId);
    return tasks.filter((t) => projIds.includes(t.ProjectId));
  }, [tasks, supervisedProjects]);

  // Statistics calculation
  const totalProjectsSupervised = supervisedProjects.length;
  const totalStudentsSupervised = supervisedStudentIds.length;
  const totalTasksCount = supervisedTasks.length;
  const completedTasksCount = supervisedTasks.filter((t) => t.Status === STATUSES.COMPLETED).length;

  // Grade progress scoring calculations
  const totalScores = useMemo(() => {
    let assigned = 0;
    let earned = 0;
    supervisedTasks.forEach((t) => {
      assigned += Number(t.AssignedScore || 0);
      earned += Number(t.EarnedScore || 0);
    });
    return { assigned, earned };
  }, [supervisedTasks]);

  // Find name of a student
  const getStudentName = (studentId) => {
    const student = users.find((u) => u.UserId === studentId);
    return student ? student.FullName : 'Unknown Student';
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div>
        <h1 className="text-2xl font-black font-display text-white">
          Welcome back, {currentUser?.FullName}!
        </h1>
        <p className="text-slate-400 text-xs mt-1">
          Review progress metrics of your assigned project cohorts and approve milestones.
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Assigned Projects"
          value={totalProjectsSupervised}
          icon={FolderGit}
          description="Supervised workspaces"
        />
        <StatCard
          title="Supervised Students"
          value={totalStudentsSupervised}
          icon={Users}
          description="Active researchers"
        />
        <StatCard
          title="Task Milestones"
          value={`${completedTasksCount} / ${totalTasksCount}`}
          icon={ClipboardCheck}
          description="Completed tasks ratio"
        />
        <StatCard
          title="Cumulative Marks"
          value={`${totalScores.earned} / ${totalScores.assigned}`}
          icon={Award}
          description="Earned vs Assigned points"
        />
      </div>

      {/* Main Grid: Projects overview + Tasks list */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Projects Progress Tracker */}
        <div className="glass-card p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4 border-b border-slate-800/40 pb-3">
            <h3 className="text-sm font-bold text-slate-300 font-display uppercase tracking-wider">
              Student Project Progress Matrix
            </h3>
            <span className="text-xs text-slate-500 font-medium">Auto-updated from tasks</span>
          </div>

          {supervisedProjects.length > 0 ? (
            <div className="divide-y divide-slate-800/40 space-y-4">
              {supervisedProjects.map((p) => (
                <div key={p.ProjectId} className="pt-4 first:pt-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <Link to={`/projects/${p.ProjectId}`} className="text-sm font-bold text-slate-205 hover:text-brand-400 transition-colors">
                        {p.ProjectTitle}
                      </Link>
                      <p className="text-xs text-slate-500 mt-1">
                        Student Researcher:{' '}
                        <span className="text-slate-350 font-medium">
                          {getStudentName(p.StudentId)}
                        </span>
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <span className={`text-[10px] px-2 py-0.5 rounded font-semibold border ${
                        p.Status === STATUSES.COMPLETED
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : p.Status === STATUSES.IN_PROGRESS
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                      }`}>
                        {p.Status}
                      </span>
                      <span className="text-xs font-bold text-brand-400">{p.ProgressPercentage}%</span>
                    </div>
                  </div>
                  <ProgressBar percentage={p.ProgressPercentage} size="sm" />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500 text-sm">
              You are currently not assigned to guide any project workspace.
            </div>
          )}
        </div>

        {/* Action List Checklist */}
        <div className="glass-card p-5">
          <h3 className="text-sm font-bold text-slate-300 font-display mb-4 uppercase tracking-wider pb-3 border-b border-slate-800/40">
            Recent Task Updates
          </h3>
          <div className="space-y-4">
            {supervisedTasks.length > 0 ? (
              supervisedTasks.slice(0, 5).map((t) => (
                <div key={t.TaskId} className="p-3 bg-[#1b1b3a]/30 border border-slate-800/40 rounded-xl">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-semibold text-slate-300 line-clamp-1">
                      {t.TaskTitle}
                    </span>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-semibold border flex-shrink-0 ${
                      t.Status === STATUSES.COMPLETED
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : t.Status === STATUSES.IN_PROGRESS
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                    }`}>
                      {t.Status}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-slate-800/30 text-[10px] text-slate-500">
                    <span>Due: {t.DueDate}</span>
                    {t.Status === STATUSES.COMPLETED && (
                      <span className="text-brand-400 font-semibold">
                        Score: {t.EarnedScore} / {t.AssignedScore}
                      </span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-slate-500 text-xs">
                No active tasks logged under your guided projects yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default FacultyDashboard;
