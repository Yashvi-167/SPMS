import React, { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { ProgressBar } from '../../components/common/ProgressBar';
import { Badge } from '../../components/common/Badge';
import { 
  FolderPlus, 
  Search, 
  Calendar, 
  User, 
  Eye, 
  Edit2, 
  Trash2, 
  BookOpen, 
  SlidersHorizontal 
} from 'lucide-react';
import { ProjectForm } from './ProjectForm';
import { Link } from 'react-router-dom';
import { STATUSES, ROLES } from '../../data/mockData';
import { toast, Toaster } from 'react-hot-toast';

export const ProjectList = () => {
  const { currentUser } = useAuth();
  const { projects, users, deleteProject, addProject, updateProject } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  // Checks permissions: Admins and Faculty can edit/delete/create
  const canManageProjects = currentUser && (currentUser.RoleId === ROLES.ADMIN || currentUser.RoleId === ROLES.FACULTY);

  // Project data filtered based on role
  const visibleProjects = useMemo(() => {
    if (!currentUser) return [];
    
    // Student sees only their assigned project, or can view other student projects as read-only.
    // Let's allow them to see all projects for collaborative visibility, but lock edits.
    // If they have no projects, let's keep them in the loop.
    return projects;
  }, [projects, currentUser]);

  // Filter projects by search query and status filter
  const filteredProjects = useMemo(() => {
    return visibleProjects.filter((p) => {
      const matchesSearch = p.ProjectTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            (p.Description && p.Description.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesStatus = statusFilter === 'All' || p.Status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [visibleProjects, searchQuery, statusFilter]);

  // Open modal triggers
  const handleEdit = (project) => {
    setSelectedProject(project);
    setModalOpen(true);
  };

  const handleAddNew = () => {
    setSelectedProject(null);
    setModalOpen(true);
  };

  const handleFormSubmit = (data) => {
    if (selectedProject) {
      updateProject(selectedProject.ProjectId, data);
      toast.success('Project details modified successfully!', {
        style: { backgroundColor: '#141432', color: '#fff', border: '1px solid #1e293b' },
      });
    } else {
      addProject(data);
      toast.success('New project workspace initiated!', {
        style: { backgroundColor: '#141432', color: '#fff', border: '1px solid #1e293b' },
      });
    }
    setModalOpen(false);
  };

  const handleDelete = (projectId) => {
    if (window.confirm('Delete this project? Warning: All associated tasks under this project will also be deleted.')) {
      deleteProject(projectId);
      toast.success('Project and associated tasks removed from records.', {
        style: { backgroundColor: '#141432', color: '#fff', border: '1px solid #1e293b' },
      });
    }
  };

  // Helper lookup for names
  const getUserName = (id) => {
    const u = users.find((x) => x.UserId === id);
    return u ? u.FullName : 'Not Assigned';
  };

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />

      {/* Header section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black font-display text-white">Project Directory</h1>
          <p className="text-slate-400 text-xs mt-1">Configure workspace parameters, assign research guides, and allocate students.</p>
        </div>

        {canManageProjects && (
          <Button onClick={handleAddNew} variant="primary" className="flex items-center gap-2 text-xs py-2.5 px-4 rounded-xl">
            <FolderPlus className="w-4 h-4" />
            Initiate Project
          </Button>
        )}
      </div>

      {/* Search and Filters Toolbar */}
      <div className="glass-card p-4 flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder="Search projects by title or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#1b1b3a] border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          <SlidersHorizontal className="w-4 h-4 text-slate-500 hidden sm:inline" />
          <span className="text-xs text-slate-450 font-semibold uppercase tracking-wider hidden sm:inline">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#1b1b3a] border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
          >
            <option value="All">All Statuses</option>
            <option value={STATUSES.PENDING}>Pending</option>
            <option value={STATUSES.IN_PROGRESS}>In Progress</option>
            <option value={STATUSES.COMPLETED}>Completed</option>
          </select>
        </div>
      </div>

      {/* Grid List */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((p) => (
            <div 
              key={p.ProjectId} 
              className="glass-card glass-card-hover p-5 flex flex-col justify-between h-72 relative"
            >
              {/* Card top */}
              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <Badge text={p.Status} type="status" />
                  <span className="text-xs font-black text-brand-400">{p.ProgressPercentage}%</span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-base font-bold text-white font-display line-clamp-1">
                    {p.ProjectTitle}
                  </h3>
                  <p className="text-xs text-slate-450 line-clamp-3">
                    {p.Description || 'No description provided.'}
                  </p>
                </div>
              </div>

              {/* Card Mid & Bottom */}
              <div className="space-y-4 pt-4 border-t border-slate-800/40">
                <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-brand-450" />
                    <span className="truncate">{getUserName(p.StudentId)}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-indigo-400" />
                    <span className="truncate">{getUserName(p.FacultyId)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <ProgressBar percentage={p.ProgressPercentage} size="sm" />
                  
                  {/* Action items */}
                  <div className="flex items-center gap-1.5">
                    <Link 
                      to={`/projects/${p.ProjectId}`}
                      className="p-1.5 bg-[#1b1b3a] hover:bg-slate-800 border border-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
                      title="View workspace details"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </Link>
                    
                    {canManageProjects && (
                      <>
                        <button
                          onClick={() => handleEdit(p)}
                          className="p-1.5 bg-[#1b1b3a] hover:bg-brand-600/10 border border-slate-800 rounded-lg text-slate-400 hover:text-brand-400 transition-colors"
                          title="Modify details"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(p.ProjectId)}
                          className="p-1.5 bg-[#1b1b3a] hover:bg-rose-500/10 border border-slate-800 rounded-lg text-slate-450 hover:text-rose-400 transition-colors"
                          title="Delete Project"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-card p-12 text-center max-w-lg mx-auto">
          <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white font-display">No Projects Registered</h3>
          <p className="text-sm text-slate-450 mt-1">No project folders match your filter queries.</p>
        </div>
      )}

      {/* Form Dialog */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={selectedProject ? `Modify Project: ${selectedProject.ProjectTitle}` : 'Create New Project Workspace'}
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
export default ProjectList;
