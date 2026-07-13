import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { DataTable } from '../../components/common/DataTable';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { UserPlus, Edit2, Trash2, Eye } from 'lucide-react';
import { UserForm } from './UserForm';
import { toast, Toaster } from 'react-hot-toast';

export const UserList = () => {
  const navigate = useNavigate();
  const { users, deleteUser, addUser, updateUser } = useData();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [roleFilter, setRoleFilter] = useState('All');

  // Open modal for editing
  const handleEdit = (user) => {
    setSelectedUser(user);
    setModalOpen(true);
  };

  // Open modal for adding
  const handleAddNew = () => {
    setSelectedUser(null);
    setModalOpen(true);
  };

  // Handle form submission from modal
  const handleFormSubmit = (data) => {
    if (selectedUser) {
      updateUser(selectedUser.UserId, data);
      toast.success('User profile updated successfully!', {
        style: { backgroundColor: '#141432', color: '#fff', border: '1px solid #1e293b' },
      });
    } else {
      addUser(data);
      toast.success('New user profile created successfully!', {
        style: { backgroundColor: '#141432', color: '#fff', border: '1px solid #1e293b' },
      });
    }
    setModalOpen(false);
  };

  // Handle account deletion
  const handleDelete = (userId) => {
    if (window.confirm('Are you absolutely sure you want to delete this user profile? This action is irreversible.')) {
      deleteUser(userId);
      toast.success('User account removed from database.', {
        style: { backgroundColor: '#141432', color: '#fff', border: '1px solid #1e293b' },
      });
    }
  };

  // Roles name lookup mapping
  const getRoleLabel = (roleId) => {
    switch (roleId) {
      case 1: return 'Admin';
      case 2: return 'Faculty';
      case 3: return 'Student';
      default: return 'User';
    }
  };

  // Filter users based on select tag
  const filteredUsersList = useMemo(() => {
    if (roleFilter === 'All') return users;
    const filterId = roleFilter === 'Admin' ? 1 : roleFilter === 'Faculty' ? 2 : 3;
    return users.filter((u) => u.RoleId === filterId);
  }, [users, roleFilter]);

  // Col definitions for DataTable
  const columns = [
    {
      header: 'Full Name',
      accessor: 'FullName',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-brand-600/10 border border-brand-500/20 text-brand-400 font-bold flex items-center justify-center text-xs">
            {row.ProfilePicturePath ? (
              <img src={row.ProfilePicturePath} alt="Avatar" className="w-full h-full object-cover rounded-lg" />
            ) : (
              row.FullName.charAt(0)
            )}
          </div>
          <div>
            <span className="font-semibold text-slate-200 block text-xs sm:text-sm">{row.FullName}</span>
            <span className="text-[10px] text-slate-500 block">ID: #{row.UserId}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Email / Mobile',
      accessor: 'Email',
      render: (row) => (
        <div>
          <span className="text-slate-300 block text-xs">{row.Email}</span>
          <span className="text-[10px] text-slate-500 block">{row.MobileNumber || 'No mobile logged'}</span>
        </div>
      ),
    },
    {
      header: 'Role Clearance',
      accessor: 'RoleId',
      render: (row) => <Badge text={getRoleLabel(row.RoleId)} type="role" />,
    },
    {
      header: 'Account Status',
      accessor: 'IsActive',
      render: (row) => (
        <span className={`text-[10px] px-2 py-0.5 rounded font-semibold border inline-flex items-center gap-1 ${
          row.IsActive 
            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
            : 'bg-rose-500/10 text-rose-450 border-rose-500/20'
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${row.IsActive ? 'bg-emerald-400' : 'bg-rose-400'}`}></span>
          {row.IsActive ? 'Active' : 'Disabled'}
        </span>
      ),
    },
  ];

  // Filters to insert into table toolbar
  const filterComponent = (
    <div className="flex items-center gap-3">
      <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider hidden sm:inline">Role:</span>
      <select
        value={roleFilter}
        onChange={(e) => setRoleFilter(e.target.value)}
        className="bg-[#1b1b3a] border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
      >
        <option value="All">All Roles</option>
        <option value="Admin">Administrators</option>
        <option value="Faculty">Faculty Guides</option>
        <option value="Student">Student Researchers</option>
      </select>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Toast provider */}
      <Toaster position="top-right" />

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black font-display text-white">System User Directory</h1>
          <p className="text-slate-400 text-xs mt-1">Manage and provision administrator, faculty advisors and student credentials.</p>
        </div>
        
        <Button onClick={handleAddNew} variant="primary" className="flex items-center gap-2 text-xs py-2.5 px-4 rounded-xl">
          <UserPlus className="w-4 h-4" />
          Provision Account
        </Button>
      </div>

      {/* Table Section */}
      <div className="glass-card p-6 border-slate-800/80 bg-[#12122c]/60 shadow-glow-sm">
        <DataTable
          columns={columns}
          data={filteredUsersList}
          searchPlaceholder="Search profiles by name..."
          searchField="FullName"
          pageSize={6}
          filterComponent={filterComponent}
          actions={(row) => (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(`/profile/${row.UserId}`)}
                className="!p-1.5 text-blue-400 hover:bg-blue-500/10 hover:text-blue-350"
                title="View Profile"
              >
                <Eye className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleEdit(row)}
                className="!p-1.5 text-brand-400 hover:bg-brand-600/10 hover:text-brand-350"
                title="Edit Account"
              >
                <Edit2 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDelete(row.UserId)}
                className="!p-1.5 text-rose-400 hover:bg-rose-500/10 hover:text-rose-350"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </>
          )}
        />
      </div>

      {/* Provision / Update Modal Form */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={selectedUser ? `Modify Account: ${selectedUser.FullName}` : 'Provision New System User'}
      >
        <UserForm
          initialData={selectedUser}
          onSubmit={handleFormSubmit}
          onCancel={() => setModalOpen(false)}
        />
      </Modal>
    </div>
  );
};
export default UserList;
