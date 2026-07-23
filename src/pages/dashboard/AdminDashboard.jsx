import React, { useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { StatCard } from '../../components/common/StatCard';
import { Users, FolderGit, CheckSquare, Layers } from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell, 
  PieChart, 
  Pie 
} from 'recharts';
import { STATUSES, PRIORITIES } from '../../data/mockData';

export const AdminDashboard = () => {
  const { users, projects, tasks, updateTask } = useData();

  // Statistics calculations
  const totalUsers = users.length;
  const totalProjects = projects.length;
  const totalTasks = tasks.length;
  const activeProjectsCount = projects.filter((p) => p.Status === STATUSES.IN_PROGRESS).length;

  // Project status distribution
  const projectStatusData = useMemo(() => {
    const counts = {
      [STATUSES.PENDING]: 0,
      [STATUSES.IN_PROGRESS]: 0,
      [STATUSES.COMPLETED]: 0,
    };
    projects.forEach((p) => {
      if (counts[p.Status] !== undefined) {
        counts[p.Status]++;
      }
    });
    return Object.keys(counts).map((key) => ({
      name: key,
      value: counts[key],
    }));
  }, [projects]);

  // Task priority distribution
  const taskPriorityData = useMemo(() => {
    const counts = {
      [PRIORITIES.LOW]: 0,
      [PRIORITIES.MEDIUM]: 0,
      [PRIORITIES.HIGH]: 0,
    };
    tasks.forEach((t) => {
      if (counts[t.Priority] !== undefined) {
        counts[t.Priority]++;
      }
    });
    return Object.keys(counts).map((key) => ({
      name: key,
      value: counts[key],
    }));
  }, [tasks]);

  const COLORS = {
    [STATUSES.PENDING]: '#06b6d4',      // Cyan
    [STATUSES.IN_PROGRESS]: '#f59e0b',  // Amber
    [STATUSES.COMPLETED]: '#10b981',    // Green
    [PRIORITIES.LOW]: '#38bdf8',        // Sky
    [PRIORITIES.MEDIUM]: '#fbbf24',     // Yellow
    [PRIORITIES.HIGH]: '#f43f5e',       // Rose
  };

  // Recent 5 Projects
  const recentProjects = useMemo(() => {
    return [...projects].slice(-4).reverse();
  }, [projects]);

  // Find names for projects list
  const getUserName = (id) => {
    const u = users.find((x) => x.UserId === id);
    return u ? u.FullName : 'Unknown';
  };

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />
      {/* Top Banner */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black font-display text-white">System Admin Central</h1>
          <p className="text-slate-400 text-xs mt-1">Platform telemetry, system metrics and user allocation status.</p>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="User Accounts"
          value={totalUsers}
          icon={Users}
          description="Registered profiles"
          trend="+1"
          trendType="up"
        />
        <StatCard
          title="Active Projects"
          value={activeProjectsCount}
          icon={FolderGit}
          description={`Out of ${totalProjects} total`}
          trend={`${totalProjects - activeProjectsCount} queued`}
          trendType="up"
        />
        <StatCard
          title="Assigned Tasks"
          value={totalTasks}
          icon={CheckSquare}
          description="Across all workspaces"
          trend="+4"
          trendType="up"
        />
        <StatCard
          title="Completion Rate"
          value={`${projects.length > 0 ? Math.round((projects.filter(p => p.Status === STATUSES.COMPLETED).length / projects.length) * 100) : 0}%`}
          icon={Layers}
          description="Projects completed"
        />
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Project Status Bar Chart */}
        <div className="glass-card p-5 lg:col-span-2">
          <h3 className="text-sm font-bold text-slate-350 font-display mb-4 uppercase tracking-wider">
            Workspace Status Distribution
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={projectStatusData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f293d" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#141432', border: '1px solid #334155', borderRadius: '8px' }}
                  labelStyle={{ color: '#94a3b8', fontSize: '12px', fontWeight: 'bold' }}
                  itemStyle={{ fontSize: '13px' }}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={50}>
                  {projectStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[entry.name] || '#6366f1'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Task Priority Pie Chart */}
        <div className="glass-card p-5">
          <h3 className="text-sm font-bold text-slate-355 font-display mb-4 uppercase tracking-wider">
            Task Priority Allocation
          </h3>
          <div className="h-64 flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={taskPriorityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {taskPriorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[entry.name] || '#6366f1'} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#141432', border: '1px solid #334155', borderRadius: '8px' }}
                  itemStyle={{ fontSize: '13px' }}
                />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Center labels info */}
            <div className="absolute flex flex-col items-center">
              <span className="text-2xl font-extrabold text-white">{totalTasks}</span>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider">Tasks</span>
            </div>
          </div>
          
          {/* Custom Legend */}
          <div className="flex justify-center gap-4 text-xs mt-2">
            {taskPriorityData.map((d, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[d.name] }} />
                <span className="text-slate-400">{d.name} ({d.value})</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom list view */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent projects */}
        <div className="glass-card p-5">
          <h3 className="text-sm font-bold text-slate-350 font-display mb-4 uppercase tracking-wider">
            Recently Added Projects
          </h3>
          <div className="space-y-4">
            {recentProjects.map((p) => (
              <div key={p.ProjectId} className="flex items-center justify-between p-3.5 bg-[#1b1b3a]/40 border border-slate-800/40 rounded-xl hover:border-slate-700/60 transition-colors">
                <div>
                  <h4 className="text-sm font-bold text-slate-200 line-clamp-1">{p.ProjectTitle}</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Student: <span className="text-slate-300 font-medium">{getUserName(p.StudentId)}</span> • Faculty: <span className="text-slate-300 font-medium">{getUserName(p.FacultyId)}</span>
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-xs font-bold text-brand-400">{p.ProgressPercentage}%</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-md font-semibold border ${
                    p.Status === STATUSES.COMPLETED 
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                      : p.Status === STATUSES.IN_PROGRESS 
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' 
                      : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                  }`}>
                    {p.Status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Faculty Guides */}
        <div className="glass-card p-5">
          <h3 className="text-sm font-bold text-slate-350 font-display mb-4 uppercase tracking-wider">
            Faculty Directory & Project Count
          </h3>
          <div className="space-y-4">
            {users
              .filter((u) => u.RoleId === 2 && u.IsActive)
              .map((fac) => {
                const guideCount = projects.filter((p) => p.FacultyId === fac.UserId).length;
                return (
                  <div key={fac.UserId} className="flex items-center justify-between p-3.5 bg-[#1b1b3a]/40 border border-slate-800/40 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 font-extrabold flex items-center justify-center text-sm">
                        {fac.FullName.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-200">{fac.FullName}</h4>
                        <span className="text-xs text-slate-450">{fac.Email}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold text-brand-400">{guideCount}</span>
                      <span className="text-[10px] text-slate-400 block uppercase tracking-wider font-semibold">Assigned</span>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      {/* Recent Tasks Management */}
      <div className="glass-card p-5 mt-6">
        <h3 className="text-sm font-bold text-slate-350 font-display mb-4 uppercase tracking-wider">
          Quick Task Management (Recent)
        </h3>
        <div className="overflow-x-auto rounded-lg border border-slate-850">
          <table className="w-full border-collapse text-left text-sm text-slate-300">
            <thead className="bg-[#1b1b3a]/75 text-slate-200 uppercase text-xs tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-5 py-4 font-semibold">Title</th>
                <th className="px-5 py-4 font-semibold">Project Module</th>
                <th className="px-5 py-4 font-semibold">Status</th>
                <th className="px-5 py-4 font-semibold">Priority</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40">
              {tasks.slice(-5).reverse().map((t) => (
                <tr key={t.TaskId} className="hover:bg-slate-800/20 transition-colors">
                  <td className="px-5 py-4">
                    <span className="font-semibold text-slate-200 block text-sm">{t.TaskTitle}</span>
                  </td>
                  <td className="px-5 py-4 text-xs font-semibold text-brand-400 max-w-[200px] truncate">
                    {projects.find(p => p.ProjectId === t.ProjectId)?.ProjectTitle || 'Unknown'}
                  </td>
                  <td className="px-5 py-4">
                    <select
                      value={t.Status}
                      onChange={(e) => {
                        const newStatus = e.target.value;
                        const patch = { Status: newStatus };
                        if (newStatus === STATUSES.COMPLETED) {
                          patch.CompletedDate = new Date().toISOString().split('T')[0];
                          patch.EarnedScore = t.EarnedScore || t.AssignedScore;
                        }
                        updateTask(t.TaskId, patch);
                        toast.success(`Status updated to ${newStatus}`, {
                          style: { backgroundColor: '#141432', color: '#fff', border: '1px solid #1e293b' },
                        });
                      }}
                      className="bg-[#1b1b3a] border border-slate-800 rounded px-2.5 py-1 text-xs text-slate-205 focus:outline-none focus:border-brand-500"
                    >
                      <option value={STATUSES.PENDING}>Pending</option>
                      <option value={STATUSES.IN_PROGRESS}>In Progress</option>
                      <option value={STATUSES.COMPLETED}>Completed</option>
                    </select>
                  </td>
                  <td className="px-5 py-4">
                    <select
                      value={t.Priority}
                      onChange={(e) => {
                        updateTask(t.TaskId, { Priority: e.target.value });
                        toast.success(`Priority updated to ${e.target.value}`, {
                          style: { backgroundColor: '#141432', color: '#fff', border: '1px solid #1e293b' },
                        });
                      }}
                      className="bg-[#1b1b3a] border border-slate-800 rounded px-2.5 py-1 text-xs text-slate-205 focus:outline-none focus:border-brand-500"
                    >
                      <option value={PRIORITIES.LOW}>Low</option>
                      <option value={PRIORITIES.MEDIUM}>Medium</option>
                      <option value={PRIORITIES.HIGH}>High</option>
                    </select>
                  </td>
                </tr>
              ))}
              {tasks.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center py-8 text-slate-500 text-sm">
                    No task milestones logged in system.
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
export default AdminDashboard;
