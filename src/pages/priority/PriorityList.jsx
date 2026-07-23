import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { AlertCircle, Edit2, Trash2 } from 'lucide-react';
import { STATUSES, PRIORITIES } from '../../data/mockData';
import { TaskForm } from '../tasks/TaskForm';
import { Modal } from '../../components/common/Modal';
import toast from 'react-hot-toast';

export const PriorityList = () => {
  const { tasks, updateTask, deleteTask } = useData();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const handleEdit = (task) => {
    setSelectedTask(task);
    setModalOpen(true);
  };

  const handleFormSubmit = (data) => {
    if (selectedTask) {
      updateTask(selectedTask.TaskId, data);
      toast.success('Task details modified successfully!');
    }
    setModalOpen(false);
  };

  const handleDelete = (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteTask(taskId);
      toast.success('Task deleted');
    }
  };

  const handleStatusChange = (taskId, newStatus) => {
    updateTask(taskId, { Status: newStatus });
    toast.success(`Task status updated to ${newStatus}`);
  };
  
  const handlePriorityChange = (taskId, newPriority) => {
    updateTask(taskId, { Priority: newPriority });
    toast.success(`Task priority updated to ${newPriority}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black font-display text-white">Task Priority Overview</h1>
          <p className="text-slate-400 text-xs mt-1">
            Quickly view and update the status and priority of all tasks.
          </p>
        </div>
      </div>

      <div className="glass-card p-6">
        <div className="flex items-center gap-2 mb-6">
          <AlertCircle className="w-5 h-5 text-brand-400" />
          <h2 className="text-base font-bold text-slate-200 font-display uppercase tracking-wider">Task List</h2>
        </div>
        
        <div className="overflow-x-auto rounded-lg border border-slate-850">
          <table className="w-full border-collapse text-left text-sm text-slate-300">
            <thead className="bg-[#1b1b3a]/75 text-slate-200 uppercase text-xs tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-5 py-4 font-semibold">Task Name</th>
                <th className="px-5 py-4 font-semibold w-40">Status</th>
                <th className="px-5 py-4 font-semibold w-40">Priority</th>
                <th className="px-5 py-4 font-semibold text-right w-24">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40">
              {tasks && tasks.length > 0 ? (
                tasks.map((t) => (
                  <tr key={t.TaskId} className="hover:bg-slate-800/20 transition-colors group">
                    <td className="px-5 py-4">
                      <span className="font-semibold text-slate-200 block text-sm">{t.TaskTitle}</span>
                      <span className="text-xs text-slate-500 line-clamp-1 mt-0.5">{t.TaskDescription}</span>
                    </td>
                    <td className="px-5 py-4">
                      <select
                        value={t.Status}
                        onChange={(e) => handleStatusChange(t.TaskId, e.target.value)}
                        className="bg-[#1b1b3a] border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-brand-500 font-semibold"
                      >
                        <option value={STATUSES.PENDING}>Pending</option>
                        <option value={STATUSES.IN_PROGRESS}>In Progress</option>
                        <option value={STATUSES.COMPLETED}>Completed</option>
                      </select>
                    </td>
                    <td className="px-5 py-4">
                      <select
                        value={t.Priority}
                        onChange={(e) => handlePriorityChange(t.TaskId, e.target.value)}
                        className="bg-[#1b1b3a] border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-brand-500 font-semibold"
                      >
                        <option value={PRIORITIES.LOW}>Low</option>
                        <option value={PRIORITIES.MEDIUM}>Medium</option>
                        <option value={PRIORITIES.HIGH}>High</option>
                      </select>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleEdit(t)}
                          className="p-1.5 text-slate-400 hover:text-brand-400 hover:bg-brand-400/10 rounded"
                          title="Edit Task"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(t.TaskId)}
                          className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-400/10 rounded"
                          title="Delete Task"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center py-8 text-slate-500 text-sm">
                    No tasks found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={selectedTask ? `Modify Task: ${selectedTask.TaskTitle}` : 'Create New Task'}
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

export default PriorityList;
