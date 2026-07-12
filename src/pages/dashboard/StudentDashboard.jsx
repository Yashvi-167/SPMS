import React, { useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { StatCard } from '../../components/common/StatCard';
import { ProgressBar } from '../../components/common/ProgressBar';
import { Badge } from '../../components/common/Badge';
import { 
  FolderGit, 
  Calendar, 
  UserCheck, 
  CheckSquare, 
  AlertTriangle,
  Award,
  BookOpen
} from 'lucide-react';
import { STATUSES, PRIORITIES } from '../../data/mockData';
import { Link } from 'react-router-dom';

export const StudentDashboard = () => {
  const { currentUser } = useAuth();
  const { projects, users, tasks } = useData();

  // Find the student's project (a student typically has one main active project)
  const studentProject = useMemo(() => {
    if (!currentUser) return null;
    return projects.find((p) => p.StudentId === currentUser.UserId);
  }, [projects, currentUser]);

  // Find the tasks for this project
  const studentTasks = useMemo(() => {
    if (!studentProject) return [];
    return tasks.filter((t) => t.ProjectId === studentProject.ProjectId);
  }, [tasks, studentProject]);

  // Supervisor details
  const supervisor = useMemo(() => {
    if (!studentProject) return null;
    return users.find((u) => u.UserId === studentProject.FacultyId);
  }, [users, studentProject]);

  // Tasks statistics calculations
  const pendingTasks = studentTasks.filter((t) => t.Status === STATUSES.PENDING);
  const inProgressTasks = studentTasks.filter((t) => t.Status === STATUSES.IN_PROGRESS);
  const completedTasks = studentTasks.filter((t) => t.Status === STATUSES.COMPLETED);

  const totalTasks = studentTasks.length;
  const completedCount = completedTasks.length;
  const completionPercentage = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

  // Grade/Score Calculations
  const scoreSummary = useMemo(() => {
    let assigned = 0;
    let earned = 0;
    studentTasks.forEach((t) => {
      assigned += Number(t.AssignedScore || 0);
      earned += Number(t.EarnedScore || 0);
    });
    return { assigned, earned };
  }, [studentTasks]);

  // Overdue Tasks calculation
  const overdueTasksCount = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return studentTasks.filter(
      (t) => t.Status !== STATUSES.COMPLETED && t.DueDate < today
    ).length;
  }, [studentTasks]);

  return (
    <div className="space-y-6">
      {/* Greetings Header */}
      <div>
        <h1 className="text-2xl font-black font-display text-white">
          Hello, {currentUser?.FullName}!
        </h1>
        <p className="text-slate-400 text-xs mt-1">
          Monitor your research sprints, address feedback, and check earned milestones.
        </p>
      </div>

      {studentProject ? (
        <>
          {/* Main Stats Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <StatCard
              title="Project Tasks"
              value={`${completedCount} / ${totalTasks}`}
              icon={CheckSquare}
              description="Milestones completed"
            />
            <StatCard
              title="Project Completion"
              value={`${studentProject.ProgressPercentage}%`}
              icon={FolderGit}
              description={studentProject.Status}
            />
            <StatCard
              title="Earned Score"
              value={`${scoreSummary.earned} / ${scoreSummary.assigned}`}
              icon={Award}
              description="Based on graded tasks"
            />
            <StatCard
              title="Overdue Tasks"
              value={overdueTasksCount}
              icon={AlertTriangle}
              description="Needs your attention"
              trend={overdueTasksCount > 0 ? 'URGENT' : 'Clean'}
              trendType={overdueTasksCount > 0 ? 'down' : 'up'}
              className={overdueTasksCount > 0 ? '!border-l-rose-500 shadow-rose-500/5' : ''}
            />
          </div>

          {/* Project Details Banner */}
          <div className="glass-card p-6 bg-gradient-to-r from-[#141432]/80 to-[#1b1b3a]/50 relative overflow-hidden border-slate-800">
            <div className="absolute right-[-10%] top-[-50%] w-64 h-64 bg-brand-500/10 rounded-full blur-[80px] pointer-events-none" />
            
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-2">
                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-brand-450">
                  <BookOpen className="w-3.5 h-3.5" />
                  Primary Research Project
                </span>
                <Link to={`/projects/${studentProject.ProjectId}`} className="text-xl font-bold text-white font-display hover:text-brand-400 transition-colors block">
                  {studentProject.ProjectTitle}
                </Link>
                <p className="text-xs text-slate-400 max-w-3xl line-clamp-2">
                  {studentProject.Description}
                </p>
              </div>

              {/* Guide Info */}
              {supervisor && (
                <div className="flex items-center gap-3 p-3 bg-[#0c0c21]/60 rounded-xl border border-slate-800/60 min-w-[240px]">
                  <div className="w-9 h-9 rounded-lg bg-brand-600/15 border border-brand-500/20 text-brand-400 flex items-center justify-center font-extrabold text-sm">
                    {supervisor.FullName.charAt(0)}
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase tracking-wider font-semibold">Faculty Guide</span>
                    <span className="text-xs font-bold text-slate-200">{supervisor.FullName}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 pt-5 border-t border-slate-800/40 grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Calendar className="w-4 h-4 text-slate-500" />
                <span>Start: {studentProject.StartDate}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Calendar className="w-4 h-4 text-slate-500" />
                <span>Deadline: {studentProject.EndDate || 'N/A'}</span>
              </div>
              <div className="col-span-2 flex items-center gap-3">
                <span className="text-xs text-slate-500 font-semibold whitespace-nowrap">Progress:</span>
                <ProgressBar percentage={studentProject.ProgressPercentage} size="sm" showText />
              </div>
            </div>
          </div>

          {/* Sprints columns or list view */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Urgent / Pending Tasks */}
            <div className="glass-card p-5 lg:col-span-2">
              <h3 className="text-sm font-bold text-slate-300 font-display mb-4 uppercase tracking-wider pb-3 border-b border-slate-800/40">
                Current Sprint Tasks
              </h3>
              
              <div className="space-y-3.5">
                {studentTasks.length > 0 ? (
                  studentTasks.slice(0, 6).map((t) => (
                    <div 
                      key={t.TaskId} 
                      className="p-3.5 bg-[#1b1b3a]/45 border border-slate-800/60 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-700/60 transition-colors"
                    >
                      <div className="space-y-1">
                        <h4 className="text-sm font-bold text-slate-200">{t.TaskTitle}</h4>
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge text={t.Status} type="status" />
                          <Badge text={t.Priority} type="priority" />
                          <span className="text-[10px] text-slate-500">Due: {t.DueDate}</span>
                        </div>
                      </div>
                      
                      <div className="text-right flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-1">
                        <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">Allocated Score</span>
                        <span className="text-xs font-bold text-brand-400">
                          {t.Status === STATUSES.COMPLETED ? `${t.EarnedScore} / ` : ''}{t.AssignedScore} pts
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-slate-500 text-sm">
                    No tasks found for your workspace. Use Tasks menu to create one.
                  </div>
                )}
              </div>
            </div>

            {/* Project telemetry summaries */}
            <div className="glass-card p-5 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-300 font-display mb-4 uppercase tracking-wider pb-3 border-b border-slate-800/40">
                  Sprint Status Breakdown
                </h3>
                
                <div className="space-y-4 my-6">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded bg-emerald-500"></span>
                      Completed Sprints
                    </span>
                    <span className="text-slate-200 font-bold">{completedCount}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded bg-amber-500"></span>
                      In Progress
                    </span>
                    <span className="text-slate-200 font-bold">{inProgressTasks.length}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded bg-cyan-500"></span>
                      Pending Verification
                    </span>
                    <span className="text-slate-200 font-bold">{pendingTasks.length}</span>
                  </div>
                </div>
              </div>

              {/* Progress ring/circle simulation (HTML-only svg) */}
              <div className="flex flex-col items-center gap-3 pt-4 border-t border-slate-800/40">
                <div className="relative w-28 h-28 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="#1b1b3a"
                      strokeWidth="8"
                      fill="transparent"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="url(#brandGradient)"
                      strokeWidth="8"
                      fill="transparent"
                      strokeDasharray={251.2}
                      strokeDashoffset={251.2 - (251.2 * completionPercentage) / 100}
                      strokeLinecap="round"
                      className="transition-all duration-500 ease-out"
                    />
                    <defs>
                      <linearGradient id="brandGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#6366f1" />
                        <stop offset="100%" stopColor="#a855f7" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-xl font-black text-white">{completionPercentage}%</span>
                    <span className="text-[8px] text-slate-500 uppercase tracking-wider font-semibold">Done</span>
                  </div>
                </div>
                <span className="text-[10px] text-slate-400 text-center font-medium">
                  {completedCount} out of {totalTasks} task objectives completed
                </span>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="glass-card p-12 text-center max-w-xl mx-auto mt-12 space-y-4">
          <div className="w-16 h-16 rounded-full bg-slate-800/30 border border-slate-700/50 flex items-center justify-center mx-auto text-slate-500">
            <FolderGit className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white font-display">No Project Supervised</h3>
            <p className="text-sm text-slate-450 mt-1 max-w-md mx-auto">
              You are currently not associated with any active student project team. Please contact the administrator to assign you to a project workspace.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
export default StudentDashboard;
