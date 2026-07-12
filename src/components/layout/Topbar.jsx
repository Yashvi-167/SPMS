import React, { useState } from 'react';
import { Menu, Bell, User, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLocation } from 'react-router-dom';

export const Topbar = ({ onMenuToggle }) => {
  const { currentUser, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();

  // Get human friendly title based on path
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.startsWith('/dashboard')) return 'Dashboard Overview';
    if (path.startsWith('/users')) return 'User Directory';
    if (path.startsWith('/projects')) return 'Project Workspace';
    if (path.startsWith('/tasks')) return 'Task Manager';
    if (path.startsWith('/profile')) return 'Account Center';
    return 'SPMS Portal';
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-6 bg-[#0c0c21]/80 backdrop-blur-md border-b border-slate-800/80">
      {/* Page Title & Mobile Toggle */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuToggle}
          className="p-1.5 text-slate-400 hover:text-white bg-slate-800/40 rounded-lg border border-slate-800/50 md:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h2 className="text-lg font-bold text-white font-display uppercase tracking-wider hidden sm:block">
          {getPageTitle()}
        </h2>
      </div>

      {/* Notifications and Profile */}
      <div className="flex items-center gap-6">
        {/* Mock Notifications */}
        <button className="relative p-2 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg transition-colors border border-transparent hover:border-slate-800/40">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-500 shadow-glow"></span>
        </button>

        {/* Profile Dropdown */}
        {currentUser && (
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2.5 p-1 rounded-lg hover:bg-slate-850 transition-colors focus:outline-none"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-brand flex items-center justify-center font-bold text-white shadow-glow-sm">
                {currentUser.ProfilePicturePath ? (
                  <img src={currentUser.ProfilePicturePath} alt="Avatar" className="w-full h-full object-cover rounded-lg" />
                ) : (
                  currentUser.FullName.charAt(0)
                )}
              </div>
              <span className="hidden md:block text-sm font-medium text-slate-200">{currentUser.FullName.split(' ')[0]}</span>
              <ChevronDown className="w-4 h-4 text-slate-500 hidden md:block" />
            </button>

            {dropdownOpen && (
              <>
                {/* Overlay backdrop to close */}
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setDropdownOpen(false)}
                />
                <div className="absolute right-0 mt-2.5 w-48 rounded-xl bg-[#141432] border border-slate-800 shadow-2xl py-1.5 z-50 animate-fade-in">
                  <div className="px-4 py-2 border-b border-slate-800">
                    <p className="text-xs text-slate-500">Logged in as</p>
                    <p className="text-sm font-bold text-slate-200 truncate">{currentUser.Email}</p>
                  </div>
                  
                  <a
                    href="/profile"
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-350 hover:bg-slate-800/40 hover:text-white transition-colors"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <User className="w-4 h-4 text-slate-500" />
                    My Profile
                  </a>
                  
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-rose-450 hover:bg-rose-500/10 hover:text-rose-400 transition-colors border-t border-slate-800/80"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout Account
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
export default Topbar;
