import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { AlertCircle, Plus, Edit2, Trash2 } from 'lucide-react';
import { Badge } from '../../components/common/Badge';
import toast from 'react-hot-toast';

export const PriorityList = () => {
  const { priorities, addPriority, updatePriority, deletePriority } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPriority, setEditingPriority] = useState(null);
  const [priorityName, setPriorityName] = useState('');

  const handleOpenModal = (priority = null) => {
    if (priority) {
      setEditingPriority(priority);
      setPriorityName(priority.PriorityName);
    } else {
      setEditingPriority(null);
      setPriorityName('');
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPriority(null);
    setPriorityName('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!priorityName.trim()) {
      toast.error('Priority name is required');
      return;
    }

    if (editingPriority) {
      updatePriority(editingPriority.PriorityId, { PriorityName: priorityName.trim() });
      toast.success('Priority updated successfully');
    } else {
      addPriority({ PriorityName: priorityName.trim() });
      toast.success('Priority created successfully');
    }
    handleCloseModal();
  };

  const handleDelete = (priorityId) => {
    if (window.confirm('Are you sure you want to delete this priority? Tasks using this priority might not display correctly.')) {
      deletePriority(priorityId);
      toast.success('Priority deleted');
    }
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black font-display text-white">Priority Management</h1>
          <p className="text-slate-400 text-xs mt-1">
            System-wide task priority levels configuration.
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-lg font-medium transition-colors shadow-glow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Priority</span>
        </button>
      </div>

      <div className="glass-card p-6">
        <div className="flex items-center gap-2 mb-6">
          <AlertCircle className="w-5 h-5 text-brand-400" />
          <h2 className="text-base font-bold text-slate-200 font-display uppercase tracking-wider">Available Priorities</h2>
        </div>
        
        <div className="overflow-x-auto rounded-lg border border-slate-850">
          <table className="w-full border-collapse text-left text-sm text-slate-300">
            <thead className="bg-[#1b1b3a]/75 text-slate-200 uppercase text-xs tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-5 py-4 font-semibold">Priority Name</th>
                <th className="px-5 py-4 font-semibold">Badge Preview</th>
                <th className="px-5 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40">
              {priorities && priorities.length > 0 ? (
                priorities.map((p, index) => (
                  <tr key={index} className="hover:bg-slate-800/20 transition-colors group">
                    <td className="px-5 py-4">
                      <span className="font-semibold text-slate-200 block text-sm">{p.PriorityName}</span>
                    </td>
                    <td className="px-5 py-4">
                      <Badge text={p.PriorityName} type="priority" />
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleOpenModal(p)}
                          className="p-1.5 text-slate-400 hover:text-brand-400 hover:bg-brand-400/10 rounded"
                          title="Edit Priority"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(p.PriorityId)}
                          className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-400/10 rounded"
                          title="Delete Priority"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="text-center py-8 text-slate-500 text-sm">
                    No priorities found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-[#141432] border border-slate-800 rounded-xl w-full max-w-md shadow-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">
              {editingPriority ? 'Edit Priority' : 'Add New Priority'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Priority Name
                </label>
                <input
                  type="text"
                  value={priorityName}
                  onChange={(e) => setPriorityName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"
                  placeholder="e.g. Urgent"
                  autoFocus
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-lg font-medium transition-colors"
                >
                  {editingPriority ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PriorityList;
