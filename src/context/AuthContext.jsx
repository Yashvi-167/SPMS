import React, { createContext, useState, useContext, useEffect } from 'react';
import { initialUsers } from '../data/mockData';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('spms_current_user');
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Failed to parse current user from storage', e);
      }
    }
    setLoading(false);
  }, []);

  const login = (email, password, expectedRoleId) => {
    // Read current users list from storage (which could contain updates)
    const storedUsers = localStorage.getItem('spms_users');
    const users = storedUsers ? JSON.parse(storedUsers) : initialUsers;

    const user = users.find(
      (u) => 
        u.Email.toLowerCase() === email.toLowerCase() && 
        u.Password === password && 
        u.RoleId === Number(expectedRoleId)
    );

    if (user) {
      if (!user.IsActive) {
        throw new Error('This user account is currently deactivated.');
      }
      setCurrentUser(user);
      localStorage.setItem('spms_current_user', JSON.stringify(user));
      return user;
    } else {
      throw new Error('Invalid email, password, or role selection.');
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('spms_current_user');
  };

  const updateProfile = (updatedDetails) => {
    if (!currentUser) return;
    
    const newProfile = { ...currentUser, ...updatedDetails };
    setCurrentUser(newProfile);
    localStorage.setItem('spms_current_user', JSON.stringify(newProfile));

    // Also sync to global user array stored in DataContext
    const storedUsers = localStorage.getItem('spms_users');
    if (storedUsers) {
      const users = JSON.parse(storedUsers);
      const updatedUsers = users.map((u) => u.UserId === currentUser.UserId ? { ...u, ...updatedDetails } : u);
      localStorage.setItem('spms_users', JSON.stringify(updatedUsers));
      // Dispatch an event to notify DataContext
      window.dispatchEvent(new Event('users-updated'));
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, updateProfile, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
