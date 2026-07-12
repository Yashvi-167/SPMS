import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { STATUSES, PRIORITIES, ROLES } from '../../data/mockData';
import { Button } from '../../components/common/Button';

export const TaskForm = ({ initialData, projectId, onSubmit, onCancel }) => {
  const { projects } = useData();
  const { currentUser } = useAuth();

  const [targetProjectId, setTargetProjectId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState(STATUSES.PENDING);
  const [priority, setPriority] = useState(PRIORITIES.MEDIUM);
  const [assignedScore, setAssignedScore] = useState(10);
  const [earnedScore, setEarnedScore] = useState(0);
  const [startDate, setStartDate] = useState('');
  const [dueDate, setDueDate] = useState('');

  // Identify roles: Students cannot grade (cannot modify EarnedScore)
  const canGrade = currentUser && (currentUser.RoleId === ROLES.ADMIN || currentUser.RoleId === ROLES.FACULTY);

  // Sync edits
  useEffect(() => {
    if (initialData) {
      setTargetProjectId(String(initialData.ProjectId || ''));
      setTitle(initialData.TaskTitle || '');
      setDescription(initialData.TaskDescription || '');
      setStatus(initialData.Status || STATUSES.PENDING);
      setPriority(initialData.Priority || PRIORITIES.MEDIUM);
      setAssignedScore(Number(initialData.AssignedScore !== undefined ? initialData.AssignedScore : 10));
      setEarnedScore(Number(initialData.EarnedScore !== undefined ? initialData.EarnedScore : 0));
      setStartDate(initialData.StartDate || '');
      setDueDate(initialData.DueDate || '');
    } else {
      setTargetProjectId(projectId ? String(projectId) : (projects[0]?.ProjectId ? String(projects[0].ProjectId) : ''));
      setTitle('');
      setDescription('');
      setStatus(STATUSES.PENDING);
      setPriority(PRIORITIES.MEDIUM);
      setAssignedScore(10);
      setEarnedScore(0);
      setStartDate(new Date().toISOString().split('T')[0]);
      setDueDate('');
    }
  }, [initialData, projectId, projects]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ProjectId: Number(targetProjectId),
      TaskTitle: title,
      TaskDescription: description,
      Status: status,
      Priority: priority,
      AssignedScore: Number(assignedScore),
      EarnedScore: status === STATUSES.COMPLETED ? Number(earnedScore) : 0,
      StartDate: startDate,
      DueDate: dueDate,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-2">
      {/* Project Selector */}
      {!projectId ? (
        <div>
          <label className="text-xs font-semibold text-slate-400 block mb-1.5 uppercase tracking-wider">
            Project Module
          </label>
          <select
            required
            value={targetProjectId}
            onChange={(e) => setTargetProjectId(e.target.value)}
            className="w-full bg-[#1b1b3a] border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
          >
            <option value="" disabled>Select Workspace</option>
            {projects.map((p) => (
              <option key={p.ProjectId} value={p.ProjectId}>
                {p.ProjectTitle}
              </option>
            ))}
          </select>
        </div>
      ) : null}

      {/* Task Title */}
      <div>
        <label className="text-xs font-semibold text-slate-400 block mb-1.5 uppercase tracking-wider">
          Task Title
        </label>
        <input
          type="text"
          required
          placeholder="e.g. Design API Routes schemas"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-[#1b1b3a] border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
        />
      </div>

      {/* Description */}
      <div>
        <label className="text-xs font-semibold text-slate-400 block mb-1.5 uppercase tracking-wider">
          Task Description
        </label>
        <textarea
          rows={3}
          placeholder="Break down sprint tasks instructions and expectations..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full bg-[#1b1b3a] border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 resize-none"
        />
      </div>

      {/* Status + Priority */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-semibold text-slate-400 block mb-1.5 uppercase tracking-wider">
            Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full bg-[#1b1b3a] border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
          >
            <option value={STATUSES.PENDING}>Pending</option>
            <option value={STATUSES.IN_PROGRESS}>In Progress</option>
            <option value={STATUSES.COMPLETED}>Completed</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-400 block mb-1.5 uppercase tracking-wider">
            Priority
          </label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="w-full bg-[#1b1b3a] border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
          >
            <option value={PRIORITIES.LOW}>Low</option>
            <option value={PRIORITIES.MEDIUM}>Medium</option>
            <option value={PRIORITIES.HIGH}>High</option>
          </select>
        </div>
      </div>

      {/* Score Settings */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-semibold text-slate-400 block mb-1.5 uppercase tracking-wider">
            Max Assigned Score
          </label>
          <input
            type="number"
            min="0"
            max="100"
            required
            value={assignedScore}
            onChange={(e) => setAssignedScore(Number(e.target.value))}
            className="w-full bg-[#1b1b3a] border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-400 block mb-1.5 uppercase tracking-wider">
            Earned Score {!canGrade ? '(Guides Only)' : ''}
          </label>
          <input
            type="number"
            min="0"
            max={assignedScore}
            disabled={status !== STATUSES.COMPLETED || !canGrade}
            value={earnedScore}
            onChange={(e) => setEarnedScore(Number(e.target.value))}
            className="w-full bg-[#1b1b3a] border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 disabled:opacity-40 disabled:cursor-not-allowed"
            placeholder={status !== STATUSES.COMPLETED ? 'Unlock via completed state' : '0'}
          />
        </div>
      </div>

      {/* Start + Due Dates */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-semibold text-slate-400 block mb-1.5 uppercase tracking-wider">
            Start Date
          </label>
          <input
            type="date"
            required
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full bg-[#1b1b3a] border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-400 block mb-1.5 uppercase tracking-wider">
            Due Date (Deadline)
          </label>
          <input
            type="date"
            required
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full bg-[#1b1b3a] border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
          />
        </div>
      </div>

      {/* Actions buttons */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800/40 mt-6">
        <Button variant="secondary" size="md" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" size="md">
          {initialData ? 'Save Changes' : 'Create Task'}
        </Button>
      </div>
    </form>
  );
};
export default TaskForm;
