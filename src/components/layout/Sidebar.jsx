import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FolderGit, 
  CheckSquare, 
  Users as UsersIcon, 
  User, 
  LogOut, 
  ChevronLeft, 
  ChevronRight,
  GraduationCap,
  Activity,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ROLES } from '../../data/mockData';

export const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const { currentUser, logout } = useAuth();

  const getRoleName = () => {
    if (!currentUser) return '';
    if (currentUser.RoleId === ROLES.ADMIN) return 'Administrator';
    if (currentUser.RoleId === ROLES.FACULTY) return 'Faculty Guide';
    return 'Student Researcher';
  };

  const navItems = [
    {
      label: 'Dashboard',
      path: '/dashboard',
      icon: LayoutDashboard,
      roles: [ROLES.ADMIN, ROLES.FACULTY, ROLES.STUDENT],
    },
    {
      label: 'Users',
      path: '/users',
      icon: UsersIcon,
      roles: [ROLES.ADMIN],
    },
    {
      label: 'Projects',
      path: '/projects',
      icon: FolderGit,
      roles: [ROLES.ADMIN, ROLES.FACULTY, ROLES.STUDENT],
    },
    {
      label: 'Tasks',
      path: '/tasks',
      icon: CheckSquare,
      roles: [ROLES.ADMIN, ROLES.FACULTY, ROLES.STUDENT],
    },
    {
      label: 'Status',
      path: '/status',
      icon: Activity,
      roles: [ROLES.ADMIN],
    },
    {
      label: 'Priority',
      path: '/priority',
      icon: AlertCircle,
      roles: [ROLES.ADMIN],
    },
    {
      label: 'Profile',
      path: '/profile',
      icon: User,
      roles: [ROLES.ADMIN, ROLES.FACULTY, ROLES.STUDENT],
    },
  ];

  const allowedNavItems = navItems.filter(item => 
    currentUser && item.roles.includes(currentUser.RoleId)
  );

  return (
    <aside 
      className={`fixed top-0 left-0 z-40 h-screen transition-all duration-300 bg-[#10102b] border-r border-slate-800/80 flex flex-col justify-between ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-slate-800/60">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="p-2 bg-brand-600/10 border border-brand-500/20 text-brand-400 rounded-lg">
            <GraduationCap className="w-6 h-6 flex-shrink-0" />
          </div>
          {!isCollapsed && (
            <span className="text-xl font-extrabold tracking-wider font-display bg-gradient-to-r from-brand-400 to-accent-pink bg-clip-text text-transparent">
              SPMS
            </span>
          )}
        </div>
        
        {/* Toggle Collapse */}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden md:flex p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* User Card */}
      {!isCollapsed && currentUser && (
        <div className="px-4 py-5 mx-4 mt-6 rounded-xl bg-[#141432]/60 border border-slate-800/40 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-brand flex items-center justify-center font-bold text-white shadow-glow-sm">
            {currentUser.ProfilePicturePath ? (
              <img src={currentUser.ProfilePicturePath} alt="Avatar" className="w-full h-full object-cover rounded-lg" />
            ) : (
              currentUser.FullName.charAt(0)
            )}
          </div>
          <div className="overflow-hidden">
            <h5 className="text-sm font-semibold truncate text-slate-100">{currentUser.FullName}</h5>
            <span className="text-[10px] text-slate-400 block font-medium uppercase tracking-wider">{getRoleName()}</span>
          </div>
        </div>
      )}

      {/* Nav Links */}
      <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
        {allowedNavItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group
              ${isActive 
                ? 'bg-brand-600/15 border border-brand-500/20 text-brand-400 shadow-glow-sm' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
              }
            `}
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && <span className="truncate">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Logout Action */}
      <div className="p-3 border-t border-slate-800/60">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};
export default Sidebar;
