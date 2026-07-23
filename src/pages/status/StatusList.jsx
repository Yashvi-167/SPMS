import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Activity, Edit2, Trash2 } from 'lucide-react';
import { STATUSES } from '../../data/mockData';
import { ProjectForm } from '../projects/ProjectForm';
import { Modal } from '../../components/common/Modal';
import toast from 'react-hot-toast';

export const StatusList = () => {
  const { projects, updateProject, deleteProject } = useData();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const handleEdit = (project) => {
    setSelectedProject(project);
    setModalOpen(true);
  };

  const handleFormSubmit = (data) => {
    if (selectedProject) {
      updateProject(selectedProject.ProjectId, data);
      toast.success('Project details modified successfully!');
    }
    setModalOpen(false);
  };

  const handleDelete = (projectId) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      deleteProject(projectId);
      toast.success('Project deleted');
    }
  };

  const handleStatusChange = (projectId, newStatus) => {
    updateProject(projectId, { Status: newStatus });
    toast.success(`Project status updated to ${newStatus}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black font-display text-white">Project Status Overview</h1>
          <p className="text-slate-400 text-xs mt-1">
            Quickly view and update the status of all active projects.
          </p>
        </div>
      </div>

      <div className="glass-card p-6">
        <div className="flex items-center gap-2 mb-6">
          <Activity className="w-5 h-5 text-brand-400" />
          <h2 className="text-base font-bold text-slate-200 font-display uppercase tracking-wider">Project List</h2>
        </div>
        
        <div className="overflow-x-auto rounded-lg border border-slate-850">
          <table className="w-full border-collapse text-left text-sm text-slate-300">
            <thead className="bg-[#1b1b3a]/75 text-slate-200 uppercase text-xs tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-5 py-4 font-semibold">Project Name</th>
                <th className="px-5 py-4 font-semibold w-48">Status</th>
                <th className="px-5 py-4 font-semibold text-right w-24">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40">
              {projects && projects.length > 0 ? (
                projects.map((p) => (
                  <tr key={p.ProjectId} className="hover:bg-slate-800/20 transition-colors group">
                    <td className="px-5 py-4">
                      <span className="font-semibold text-slate-200 block text-sm">{p.ProjectTitle}</span>
                      <span className="text-xs text-slate-500 line-clamp-1 mt-0.5">{p.Description}</span>
                    </td>
                    <td className="px-5 py-4">
                      <select
                        value={p.Status}
                        onChange={(e) => handleStatusChange(p.ProjectId, e.target.value)}
                        className="bg-[#1b1b3a] border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-brand-500 font-semibold"
                      >
                        <option value={STATUSES.PENDING}>Pending</option>
                        <option value={STATUSES.IN_PROGRESS}>In Progress</option>
                        <option value={STATUSES.COMPLETED}>Completed</option>
                      </select>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleEdit(p)}
                          className="p-1.5 text-slate-400 hover:text-brand-400 hover:bg-brand-400/10 rounded"
                          title="Edit Project"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(p.ProjectId)}
                          className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-400/10 rounded"
                          title="Delete Project"
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
                    No projects found.
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
        title={selectedProject ? `Modify Project: ${selectedProject.ProjectTitle}` : 'Create New Project'}
      >
        <ProjectForm
          initialData={selectedProject}
          onSubmit={handleFormSubmit}
          onCancel={() => setModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default StatusList;
