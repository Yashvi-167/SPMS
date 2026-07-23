import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Activity, Plus, Edit2, Trash2 } from 'lucide-react';
import { Badge } from '../../components/common/Badge';
import toast from 'react-hot-toast';

export const StatusList = () => {
  const { statuses, addStatus, updateStatus, deleteStatus } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStatus, setEditingStatus] = useState(null);
  const [statusName, setStatusName] = useState('');

  const handleOpenModal = (status = null) => {
    if (status) {
      setEditingStatus(status);
      setStatusName(status.StatusName);
    } else {
      setEditingStatus(null);
      setStatusName('');
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingStatus(null);
    setStatusName('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!statusName.trim()) {
      toast.error('Status name is required');
      return;
    }

    if (editingStatus) {
      updateStatus(editingStatus.StatusId, { StatusName: statusName.trim() });
      toast.success('Status updated successfully');
    } else {
      addStatus({ StatusName: statusName.trim() });
      toast.success('Status created successfully');
    }
    handleCloseModal();
  };

  const handleDelete = (statusId) => {
    if (window.confirm('Are you sure you want to delete this status? Tasks using this status might not display correctly.')) {
      deleteStatus(statusId);
      toast.success('Status deleted');
    }
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black font-display text-white">Status Management</h1>
          <p className="text-slate-400 text-xs mt-1">
            System-wide task and project statuses configuration.
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-lg font-medium transition-colors shadow-glow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Status</span>
        </button>
      </div>

      <div className="glass-card p-6">
        <div className="flex items-center gap-2 mb-6">
          <Activity className="w-5 h-5 text-brand-400" />
          <h2 className="text-base font-bold text-slate-200 font-display uppercase tracking-wider">Available Statuses</h2>
        </div>
        
        <div className="overflow-x-auto rounded-lg border border-slate-850">
          <table className="w-full border-collapse text-left text-sm text-slate-300">
            <thead className="bg-[#1b1b3a]/75 text-slate-200 uppercase text-xs tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-5 py-4 font-semibold">Status Name</th>
                <th className="px-5 py-4 font-semibold">Badge Preview</th>
                <th className="px-5 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40">
              {statuses && statuses.length > 0 ? (
                statuses.map((s, index) => (
                  <tr key={index} className="hover:bg-slate-800/20 transition-colors group">
                    <td className="px-5 py-4">
                      <span className="font-semibold text-slate-200 block text-sm">{s.StatusName}</span>
                    </td>
                    <td className="px-5 py-4">
                      <Badge text={s.StatusName} type="status" />
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleOpenModal(s)}
                          className="p-1.5 text-slate-400 hover:text-brand-400 hover:bg-brand-400/10 rounded"
                          title="Edit Status"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(s.StatusId)}
                          className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-400/10 rounded"
                          title="Delete Status"
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
                    No statuses found.
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
              {editingStatus ? 'Edit Status' : 'Add New Status'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Status Name
                </label>
                <input
                  type="text"
                  value={statusName}
                  onChange={(e) => setStatusName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"
                  placeholder="e.g. In Review"
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
                  {editingStatus ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatusList;
