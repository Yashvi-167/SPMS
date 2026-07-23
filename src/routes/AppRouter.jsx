import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import ProtectedRoute from './ProtectedRoute';
import Login from '../pages/auth/Login';
import DashboardSelector from '../pages/dashboard/DashboardSelector';
import UserList from '../pages/users/UserList';
import ProjectList from '../pages/projects/ProjectList';
import ProjectDetail from '../pages/projects/ProjectDetail';
import TaskList from '../pages/tasks/TaskList';
import StatusList from '../pages/status/StatusList';
import PriorityList from '../pages/priority/PriorityList';
import Profile from '../pages/profile/Profile';
import { ROLES } from '../data/mockData';

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Route */}
        <Route path="/login" element={<Login />} />

        {/* Protected System App Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          {/* Default Route redirects to dashboard */}
          <Route index element={<Navigate to="/dashboard" replace />} />
          
          <Route path="dashboard" element={<DashboardSelector />} />
          
          {/* User management is Admin only */}
          <Route
            path="users"
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                <UserList />
              </ProtectedRoute>
            }
          />
          
          {/* Projects (Admin, Faculty, Student) */}
          <Route path="projects" element={<ProjectList />} />
          <Route path="projects/:id" element={<ProjectDetail />} />
          
          {/* Tasks (Admin, Faculty, Student) */}
          <Route path="tasks" element={<TaskList />} />
          
          {/* Status & Priority Management (Admin only) */}
          <Route
            path="status"
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                <StatusList />
              </ProtectedRoute>
            }
          />
          <Route
            path="priority"
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                <PriorityList />
              </ProtectedRoute>
            }
          />
          
          {/* Profile Details */}
          <Route path="profile" element={<Profile />} />
          <Route path="profile/:id" element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
              <Profile />
            </ProtectedRoute>
          } />
        </Route>

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
};
export default AppRouter;
