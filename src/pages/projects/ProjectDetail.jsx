import React, { useMemo, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { ProgressBar } from '../../components/common/ProgressBar';
import { Modal } from '../../components/common/Modal';
import { TaskForm } from '../tasks/TaskForm';
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  CheckSquare, 
  Plus, 
  Award, 
  FolderPlus,
  SlidersHorizontal,
  ChevronRight,
  ClipboardList
} from 'lucide-react';
import { STATUSES, PRIORITIES, ROLES } from '../../data/mockData';
import { toast, Toaster } from 'react-hot-toast';

export const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { projects, users, tasks, addTask, updateTask, deleteTask } = useData();

  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  // Retrieve project
  const project = useMemo(() => {
    return projects.find((p) => p.ProjectId === Number(id));
  }, [projects, id]);

  // Tasks associated with this project
  const projectTasks = useMemo(() => {
    return tasks.filter((t) => t.ProjectId === Number(id));
  }, [tasks, id]);

  // Supervisor & student name lookups
  const student = useMemo(() => {
    if (!project) return null;
    return users.find((u) => u.UserId === project.StudentId);
  }, [users, project]);

  const supervisor = useMemo(() => {
    if (!project) return null;
    return users.find((u) => u.UserId === project.FacultyId);
  }, [users, project]);

  // Task stats
  const completedTasksCount = projectTasks.filter((t) => t.Status === STATUSES.COMPLETED).length;
  const scoreSummary = useMemo(() => {
    let assigned = 0;
    let earned = 0;
    projectTasks.forEach((t) => {
      assigned += Number(t.AssignedScore || 0);
      earned += Number(t.EarnedScore || 0);
    });
    return { assigned, earned };
  }, [projectTasks]);

  // Only Admin and Faculty can manage tasks — Students are read-only
  const canManageTasks = currentUser && (
    currentUser.RoleId === ROLES.ADMIN || 
    currentUser.RoleId === ROLES.FACULTY
  );

  // Form submission inside modal
  const handleTaskSubmit = (data) => {
    if (selectedTask) {
      updateTask(selectedTask.TaskId, data);
      toast.success('Task properties modified!', {
        style: { backgroundColor: '#141432', color: '#fff', border: '1px solid #1e293b' },
      });
    } else {
      addTask({ ...data, ProjectId: Number(id) });
      toast.success('Sprint task created and added to backlog!', {
        style: { backgroundColor: '#141432', color: '#fff', border: '1px solid #1e293b' },
      });
    }
    setTaskModalOpen(false);
  };

  const handleEditTask = (task) => {
    setSelectedTask(task);
    setTaskModalOpen(true);
  };

  const handleCreateTask = () => {
    setSelectedTask(null);
    setTaskModalOpen(true);
  };

  const handleDeleteTask = (taskId) => {
    if (window.confirm('Remove this task from project?')) {
      deleteTask(taskId);
      toast.success('Task removed from sprint backlog.', {
        style: { backgroundColor: '#141432', color: '#fff', border: '1px solid #1e293b' },
      });
    }
  };

  if (!project) {
    return (
      <div className="glass-card p-12 text-center max-w-lg mx-auto mt-12">
        <h3 className="text-xl font-bold text-rose-455 font-display mb-2">Project Folder Not Found</h3>
        <p className="text-sm text-slate-400 mb-6">The requested workspace could not be verified.</p>
        <Link to="/projects">
          <Button variant="primary">Return to Workspace</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />

      {/* Nav back row */}
      <div className="flex items-center gap-3">
        <Link 
          to="/projects"
          className="p-1.5 bg-slate-800/40 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors border border-slate-800/50"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div className="flex items-center gap-1.5 text-xs text-slate-450 font-medium">
          <Link to="/projects" className="hover:text-slate-300">Projects</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-400 line-clamp-1">{project.ProjectTitle}</span>
        </div>
      </div>

      {/* Main Details Banner */}
      <div className="glass-card p-6 bg-gradient-to-br from-[#141432]/90 to-[#191938]/60 border-slate-800/80 shadow-glow-sm relative">
        <div className="absolute right-[-10%] top-[-30%] w-60 h-60 bg-brand-500/5 rounded-full blur-[80px] pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 pb-6 border-b border-slate-800/40">
          <div className="space-y-2.5">
            <div className="flex flex-wrap items-center gap-2">
              <Badge text={project.Status} type="status" />
              <span className="text-xs font-bold text-slate-500">Workspace #{project.ProjectId}</span>
            </div>
            <h1 className="text-2xl font-black font-display text-white">{project.ProjectTitle}</h1>
            <p className="text-sm text-slate-400 max-w-4xl">{project.Description || 'No description logged.'}</p>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 gap-4 lg:min-w-[320px]">
            <div className="p-3 bg-[#0d0d24]/60 border border-slate-800 rounded-xl flex items-center gap-2.5">
              <CheckSquare className="w-5 h-5 text-brand-400" />
              <div>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">Tasks Completed</span>
                <span className="text-sm font-bold text-slate-200">{completedTasksCount} / {projectTasks.length}</span>
              </div>
            </div>
            <div className="p-3 bg-[#0d0d24]/60 border border-slate-800 rounded-xl flex items-center gap-2.5">
              <Award className="w-5 h-5 text-indigo-400" />
              <div>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">Project Score</span>
                <span className="text-sm font-bold text-slate-200">{scoreSummary.earned} / {scoreSummary.assigned}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Supervisors and Timelines */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-6">
          {student && (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-600/10 border border-blue-500/20 text-blue-400 font-extrabold flex items-center justify-center text-sm flex-shrink-0">
                {student.FullName.charAt(0)}
              </div>
              <div className="overflow-hidden">
                <span className="text-[10px] text-slate-500 block uppercase tracking-wider font-semibold">Student Researcher</span>
                <span className="text-xs font-bold text-slate-200 truncate block">{student.FullName}</span>
              </div>
            </div>
          )}
          
          {supervisor && (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 font-extrabold flex items-center justify-center text-sm flex-shrink-0">
                {supervisor.FullName.charAt(0)}
              </div>
              <div className="overflow-hidden">
                <span className="text-[10px] text-slate-500 block uppercase tracking-wider font-semibold">Faculty Guide</span>
                <span className="text-xs font-bold text-slate-200 truncate block">{supervisor.FullName}</span>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2.5 text-xs text-slate-400">
            <Calendar className="w-4 h-4 text-slate-500" />
            <div>
              <span className="text-[10px] text-slate-500 block uppercase tracking-wider font-semibold">Start Date</span>
              <span className="font-bold text-slate-300">{project.StartDate}</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 text-xs text-slate-400">
            <Calendar className="w-4 h-4 text-slate-500" />
            <div>
              <span className="text-[10px] text-slate-500 block uppercase tracking-wider font-semibold">Target End Date</span>
              <span className="font-bold text-slate-300">{project.EndDate || 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="mt-8 pt-5 border-t border-slate-800/40 flex items-center gap-4">
          <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Project Progress:</span>
          <ProgressBar percentage={project.ProgressPercentage} size="md" showText />
        </div>
      </div>

      {/* Task Checklist Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-brand-400" />
            <h2 className="text-base font-bold text-slate-200 font-display uppercase tracking-wider">Project Backlog Tasks</h2>
          </div>

          {canManageTasks && (
            <Button onClick={handleCreateTask} variant="primary" size="sm" className="flex items-center gap-1.5 text-xs py-2 px-3 rounded-lg">
              <Plus className="w-4 h-4" />
              Add Task
            </Button>
          )}
        </div>

        {/* Tasks Table */}
        <div className="glass-card p-4">
          {projectTasks.length > 0 ? (
            <div className="overflow-x-auto rounded-lg border border-slate-850">
              <table className="w-full border-collapse text-left text-sm text-slate-300">
                <thead className="bg-[#1b1b3a]/60 text-slate-300 uppercase text-[10px] tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="px-5 py-3 font-semibold">Title</th>
                    <th className="px-5 py-3 font-semibold">Status</th>
                    <th className="px-5 py-3 font-semibold">Priority</th>
                    <th className="px-5 py-3 font-semibold">Due Date</th>
                    <th className="px-5 py-3 font-semibold">Score Allocation</th>
                    {canManageTasks && <th className="px-5 py-3 font-semibold text-right">Actions</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/40">
                  {projectTasks.map((t) => (
                    <tr key={t.TaskId} className="hover:bg-slate-800/20 transition-colors">
                      <td className="px-5 py-3.5">
                        <span className="font-semibold text-slate-200 block text-xs sm:text-sm">{t.TaskTitle}</span>
                        {t.TaskDescription && (
                          <span className="text-[10px] text-slate-500 line-clamp-1 mt-0.5 max-w-sm">{t.TaskDescription}</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5">
                        <Badge text={t.Status} type="status" />
                      </td>
                      <td className="px-5 py-3.5">
                        <Badge text={t.Priority} type="priority" />
                      </td>
                      <td className="px-5 py-3.5 text-xs text-slate-400">{t.DueDate}</td>
                      <td className="px-5 py-3.5 text-xs font-bold text-slate-300">
                        {t.Status === STATUSES.COMPLETED ? (
                          <span className="text-emerald-450">{t.EarnedScore}</span>
                        ) : (
                          <span className="text-slate-500">-</span>
                        )}
                        <span className="text-slate-500 font-normal"> / {t.AssignedScore}</span>
                      </td>
                      {canManageTasks && (
                        <td className="px-5 py-3.5 text-right">
                          <div className="flex justify-end gap-1.5">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleEditTask(t)}
                              className="!p-1 text-brand-400 hover:bg-brand-600/10 rounded"
                            >
                              Edit
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleDeleteTask(t.TaskId)}
                              className="!p-1 text-rose-450 hover:bg-rose-500/10 rounded"
                            >
                              Delete
                            </Button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-10 text-slate-500 text-sm">
              No tasks logged in project backlog folder.
            </div>
          )}
        </div>
      </div>

      {/* Task Creation Form Modal */}
      <Modal
        isOpen={taskModalOpen}
        onClose={() => setTaskModalOpen(false)}
        title={selectedTask ? `Modify Sprint Task: ${selectedTask.TaskTitle}` : 'Create Sprint Objective'}
      >
        <TaskForm
          initialData={selectedTask}
          projectId={id} // Bind to current project
          onSubmit={handleTaskSubmit}
          onCancel={() => setTaskModalOpen(false)}
        />
      </Modal>
    </div>
  );
};
export default ProjectDetail;
