import React, { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { Badge } from '../../components/common/Badge';
import { TaskForm } from './TaskForm';
import { 
  Plus, 
  Filter, 
  SlidersHorizontal, 
  Grid, 
  List, 
  ArrowRight, 
  ChevronRight, 
  Calendar, 
  Award,
  ChevronLeft,
  CheckCircle,
  FileCheck2
} from 'lucide-react';
import { STATUSES, PRIORITIES, ROLES } from '../../data/mockData';
import { toast, Toaster } from 'react-hot-toast';

export const TaskList = () => {
  const { currentUser } = useAuth();
  const { tasks, projects, addTask, updateTask, deleteTask } = useData();

  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' or 'list'
  const [projectFilter, setProjectFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  // Filters visibility based on student role
  const visibleTasks = useMemo(() => {
    if (!currentUser) return [];
    if (currentUser.RoleId === ROLES.STUDENT) {
      // Find student project
      const studentProject = projects.find((p) => p.StudentId === currentUser.UserId);
      if (!studentProject) return [];
      return tasks.filter((t) => t.ProjectId === studentProject.ProjectId);
    }
    return tasks;
  }, [tasks, projects, currentUser]);

  // Apply filters
  const filteredTasks = useMemo(() => {
    return visibleTasks.filter((t) => {
      const matchesProject = projectFilter === 'All' || t.ProjectId === Number(projectFilter);
      const matchesPriority = priorityFilter === 'All' || t.Priority === priorityFilter;
      return matchesProject && matchesPriority;
    });
  }, [visibleTasks, projectFilter, priorityFilter]);

  // Group tasks for Kanban columns
  const kanbanColumns = useMemo(() => {
    return {
      [STATUSES.PENDING]: filteredTasks.filter((t) => t.Status === STATUSES.PENDING),
      [STATUSES.IN_PROGRESS]: filteredTasks.filter((t) => t.Status === STATUSES.IN_PROGRESS),
      [STATUSES.COMPLETED]: filteredTasks.filter((t) => t.Status === STATUSES.COMPLETED),
    };
  }, [filteredTasks]);

  // Project lookup
  const getProjectName = (projId) => {
    const p = projects.find((x) => x.ProjectId === projId);
    return p ? p.ProjectTitle : 'Unknown Project';
  };

  // Add / Edit actions
  const handleAddNew = () => {
    setSelectedTask(null);
    setModalOpen(true);
  };

  const handleEdit = (task) => {
    setSelectedTask(task);
    setModalOpen(true);
  };

  const handleFormSubmit = (data) => {
    if (selectedTask) {
      updateTask(selectedTask.TaskId, data);
      toast.success('Task details updated!', {
        style: { backgroundColor: '#141432', color: '#fff', border: '1px solid #1e293b' },
      });
    } else {
      addTask(data);
      toast.success('Sprint task created!', {
        style: { backgroundColor: '#141432', color: '#fff', border: '1px solid #1e293b' },
      });
    }
    setModalOpen(false);
  };

  const handleDelete = (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteTask(taskId);
      toast.success('Task removed.', {
        style: { backgroundColor: '#141432', color: '#fff', border: '1px solid #1e293b' },
      });
    }
  };

  // Move task state helper buttons
  const handleMoveStatus = (task, newStatus) => {
    const patch = { Status: newStatus };
    // Auto populate scores if student/faculty mark completed
    if (newStatus === STATUSES.COMPLETED) {
      patch.CompletedDate = new Date().toISOString().split('T')[0];
      // Keep previous score or default
      patch.EarnedScore = task.EarnedScore || task.AssignedScore; 
    }
    updateTask(task.TaskId, patch);
    toast.success(`Task moved to ${newStatus}`, {
      style: { backgroundColor: '#141432', color: '#fff', border: '1px solid #1e293b' },
    });
  };

  // Check management details
  const canModifyTask = (task) => {
    if (!currentUser) return false;
    if (currentUser.RoleId === ROLES.ADMIN || currentUser.RoleId === ROLES.FACULTY) return true;
    
    // Student can modify tasks assigned to their project
    const studentProject = projects.find((p) => p.StudentId === currentUser.UserId);
    return studentProject && task.ProjectId === studentProject.ProjectId;
  };

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />

      {/* Title bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black font-display text-white">Backlog Sprints</h1>
          <p className="text-slate-400 text-xs mt-1">
            {currentUser?.RoleId === ROLES.STUDENT 
              ? 'Organize your academic goals, milestones, and status tags.'
              : 'Assess sprint boards, check status metrics and evaluate student deliverables.'}
          </p>
        </div>

        {/* Display create option if eligible */}
        {(currentUser?.RoleId !== ROLES.STUDENT || projects.some(p => p.StudentId === currentUser.UserId)) && (
          <Button onClick={handleAddNew} variant="primary" className="flex items-center gap-2 text-xs py-2.5 px-4 rounded-xl">
            <Plus className="w-4 h-4" />
            Create Task
          </Button>
        )}
      </div>

      {/* Toolbar Options (Filters & Views toggles) */}
      <div className="glass-card p-4 flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        {/* Dropdowns */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-500" />
            <span className="text-xs text-slate-450 font-semibold uppercase tracking-wider">Project:</span>
            <select
              value={projectFilter}
              onChange={(e) => setProjectFilter(e.target.value)}
              className="bg-[#1b1b3a] border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
              disabled={currentUser?.RoleId === ROLES.STUDENT} // locked for student
            >
              <option value="All">All Projects</option>
              {projects.map((p) => (
                <option key={p.ProjectId} value={p.ProjectId}>
                  {p.ProjectTitle}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-slate-500" />
            <span className="text-xs text-slate-450 font-semibold uppercase tracking-wider">Priority:</span>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="bg-[#1b1b3a] border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
            >
              <option value="All">All Priorities</option>
              <option value={PRIORITIES.LOW}>Low</option>
              <option value={PRIORITIES.MEDIUM}>Medium</option>
              <option value={PRIORITIES.HIGH}>High</option>
            </select>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="bg-[#1b1b3a] border border-slate-800 rounded-xl p-1 flex items-center gap-1 self-start md:self-auto">
          <button
            onClick={() => setViewMode('kanban')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
              viewMode === 'kanban' ? 'bg-brand-600 text-white shadow-glow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            Kanban Board
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
              viewMode === 'list' ? 'bg-brand-600 text-white shadow-glow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <List className="w-3.5 h-3.5" />
            Table View
          </button>
        </div>
      </div>

      {/* Main Board view / List view display */}
      {viewMode === 'kanban' ? (
        /* Kanban Board Columns */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {Object.entries(kanbanColumns).map(([statusKey, list]) => (
            <div key={statusKey} className="glass-card bg-[#141432]/40 p-4 flex flex-col h-[70vh] border-slate-800/80">
              {/* Header column */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800/50 mb-4">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${
                    statusKey === STATUSES.COMPLETED ? 'bg-emerald-450' : statusKey === STATUSES.IN_PROGRESS ? 'bg-amber-450' : 'bg-cyan-450'
                  }`} />
                  <h3 className="text-sm font-bold text-slate-200 font-display">{statusKey}</h3>
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[#1b1b3a] border border-slate-800 text-slate-450">
                  {list.length}
                </span>
              </div>

              {/* Cards wrapper */}
              <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                {list.length > 0 ? (
                  list.map((task) => (
                    <div 
                      key={task.TaskId}
                      className="p-4 bg-[#1b1b3a]/55 border border-slate-850 hover:border-slate-800 rounded-xl space-y-3 transition-colors shadow shadow-black/10 group relative"
                    >
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-brand-450 uppercase block line-clamp-1">
                          {getProjectName(task.ProjectId)}
                        </span>
                        <h4 className="text-sm font-bold text-slate-200 leading-snug">{task.TaskTitle}</h4>
                        {task.TaskDescription && (
                          <p className="text-xs text-slate-500 line-clamp-2 pt-0.5">{task.TaskDescription}</p>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-slate-800/30 text-[10px] text-slate-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {task.DueDate}
                        </span>
                        <Badge text={task.Priority} type="priority" />
                      </div>

                      {/* Kanban Action Buttons */}
                      <div className="flex items-center justify-between pt-3 border-t border-slate-800/20 mt-2">
                        {/* Score display */}
                        <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                          <Award className="w-3.5 h-3.5 text-indigo-400" />
                          {task.Status === STATUSES.COMPLETED ? `${task.EarnedScore} / ` : ''}{task.AssignedScore} pts
                        </span>

                        {canModifyTask(task) && (
                          <div className="flex items-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                            {/* Direction triggers */}
                            {task.Status === STATUSES.PENDING && (
                              <button
                                onClick={() => handleMoveStatus(task, STATUSES.IN_PROGRESS)}
                                className="p-1 bg-[#252549] border border-slate-800 hover:border-brand-500 rounded text-slate-450 hover:text-white"
                                title="Move to In Progress"
                              >
                                <ChevronRight className="w-3.5 h-3.5" />
                              </button>
                            )}
                            {task.Status === STATUSES.IN_PROGRESS && (
                              <>
                                <button
                                  onClick={() => handleMoveStatus(task, STATUSES.PENDING)}
                                  className="p-1 bg-[#252549] border border-slate-800 hover:border-brand-500 rounded text-slate-450 hover:text-white"
                                  title="Move to Pending"
                                >
                                  <ChevronLeft className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleMoveStatus(task, STATUSES.COMPLETED)}
                                  className="p-1 bg-[#252549] border border-slate-800 hover:border-brand-500 rounded text-slate-450 hover:text-white"
                                  title="Mark Completed"
                                >
                                  <CheckCircle className="w-3.5 h-3.5 text-emerald-450" />
                                </button>
                              </>
                            )}
                            {task.Status === STATUSES.COMPLETED && (
                              <button
                                onClick={() => handleMoveStatus(task, STATUSES.IN_PROGRESS)}
                                className="p-1 bg-[#252549] border border-slate-800 hover:border-brand-500 rounded text-slate-450 hover:text-white"
                                title="Move back to In Progress"
                              >
                                <ChevronLeft className="w-3.5 h-3.5" />
                              </button>
                            )}
                            
                            <button
                              onClick={() => handleEdit(task)}
                              className="p-1 bg-[#252549] border border-slate-800 hover:text-brand-400 rounded text-xs text-slate-400"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(task.TaskId)}
                              className="p-1 bg-red-500/10 border border-slate-800 hover:text-red-400 rounded text-xs text-slate-450"
                            >
                              Del
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-slate-600 text-xs">
                    No backlog items.
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Table View fallback */
        <div className="glass-card p-6">
          <div className="overflow-x-auto rounded-lg border border-slate-850">
            <table className="w-full border-collapse text-left text-sm text-slate-300">
              <thead className="bg-[#1b1b3a]/75 text-slate-200 uppercase text-xs tracking-wider border-b border-slate-800">
                <tr>
                  <th className="px-5 py-4 font-semibold">Title</th>
                  <th className="px-5 py-4 font-semibold">Project Module</th>
                  <th className="px-5 py-4 font-semibold">Status</th>
                  <th className="px-5 py-4 font-semibold">Priority</th>
                  <th className="px-5 py-4 font-semibold">Due Date</th>
                  <th className="px-5 py-4 font-semibold">Points Score</th>
                  <th className="px-5 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {filteredTasks.length > 0 ? (
                  filteredTasks.map((t) => (
                    <tr key={t.TaskId} className="hover:bg-slate-800/20 transition-colors">
                      <td className="px-5 py-4">
                        <span className="font-semibold text-slate-200 block text-sm">{t.TaskTitle}</span>
                        {t.TaskDescription && (
                          <span className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">{t.TaskDescription}</span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-xs font-semibold text-brand-400 max-w-[200px] truncate">
                        {getProjectName(t.ProjectId)}
                      </td>
                      <td className="px-5 py-4">
                        <Badge text={t.Status} type="status" />
                      </td>
                      <td className="px-5 py-4">
                        <Badge text={t.Priority} type="priority" />
                      </td>
                      <td className="px-5 py-4 text-xs text-slate-400">{t.DueDate}</td>
                      <td className="px-5 py-4 text-xs font-bold text-slate-350">
                        {t.Status === STATUSES.COMPLETED ? (
                          <span className="text-emerald-450">{t.EarnedScore}</span>
                        ) : (
                          <span className="text-slate-500">-</span>
                        )}
                        <span className="text-slate-500 font-normal"> / {t.AssignedScore}</span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex justify-end gap-1">
                          {canModifyTask(t) && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEdit(t)}
                                className="!p-1 text-brand-400"
                              >
                                Edit
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(t.TaskId)}
                                className="!p-1 text-rose-450"
                              >
                                Delete
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-slate-500 text-sm">
                      No task milestones logged in system.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Form Dialog popup */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={selectedTask ? `Modify Sprint Task: ${selectedTask.TaskTitle}` : 'Create New Sprint Task'}
      >
        <TaskForm
          initialData={selectedTask}
          onSubmit={handleFormSubmit}
          onCancel={() => setModalOpen(false)}
        />
      </Modal>
    </div>
  );
};
export default TaskList;
