import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

export const Layout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0b0b1e]">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar isCollapsed={sidebarCollapsed} setIsCollapsed={setSidebarCollapsed} />
      </div>

      {/* Mobile Drawer Sidebar */}
      <div className={`md:hidden fixed inset-0 z-50 transition-opacity duration-300 ${
        mobileSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}>
        {/* Backdrop overlay */}
        <div 
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setMobileSidebarOpen(false)}
        />
        <div className={`absolute top-0 left-0 h-full w-64 transform transition-transform duration-350 ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <Sidebar isCollapsed={false} setIsCollapsed={() => {}} />
        </div>
      </div>

      {/* Main Container */}
      <div className={`transition-all duration-300 min-h-screen flex flex-col ${
        sidebarCollapsed ? 'md:pl-20' : 'md:pl-64'
      }`}>
        <Topbar onMenuToggle={() => setMobileSidebarOpen(!mobileSidebarOpen)} />
        
        {/* Main Content Area */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto animate-fade-in">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
export default Layout;
