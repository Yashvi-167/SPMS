import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { ROLES } from '../../data/mockData';
import AdminDashboard from './AdminDashboard';
import FacultyDashboard from './FacultyDashboard';
import StudentDashboard from './StudentDashboard';

export const DashboardSelector = () => {
  const { currentUser } = useAuth();

  if (!currentUser) return null;

  switch (currentUser.RoleId) {
    case ROLES.ADMIN:
      return <AdminDashboard />;
    case ROLES.FACULTY:
      return <FacultyDashboard />;
    case ROLES.STUDENT:
      return <StudentDashboard />;
    default:
      return (
        <div className="glass-card p-8 text-center max-w-md mx-auto mt-12">
          <h3 className="text-xl font-bold text-rose-455 font-display mb-2">Access Error</h3>
          <p className="text-sm text-slate-400">Could not resolve your system security clearance.</p>
        </div>
      );
  }
};
export default DashboardSelector;
