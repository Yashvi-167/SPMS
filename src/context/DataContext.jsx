import React, { createContext, useState, useContext, useEffect } from 'react';
import {
  initialUsers,
  initialProjects,
  initialTasks,
  initialStatuses,
  initialPriorities,
  STATUSES,
} from '../data/mockData';

const DataContext = createContext(null);

export const DataProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [priorities, setPriorities] = useState([]);

  // Load initial data or localStorage
  useEffect(() => {
    const storedUsers = localStorage.getItem('spms_users');
    const storedProjects = localStorage.getItem('spms_projects');
    const storedTasks = localStorage.getItem('spms_tasks');

    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    } else {
      localStorage.setItem('spms_users', JSON.stringify(initialUsers));
      setUsers(initialUsers);
    }

    if (storedProjects) {
      setProjects(JSON.parse(storedProjects));
    } else {
      localStorage.setItem('spms_projects', JSON.stringify(initialProjects));
      setProjects(initialProjects);
    }

    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    } else {
      localStorage.setItem('spms_tasks', JSON.stringify(initialTasks));
      setTasks(initialTasks);
    }

    const storedStatuses = localStorage.getItem('spms_statuses');
    const storedPriorities = localStorage.getItem('spms_priorities');

    if (storedStatuses) {
      setStatuses(JSON.parse(storedStatuses));
    } else {
      localStorage.setItem('spms_statuses', JSON.stringify(initialStatuses));
      setStatuses(initialStatuses);
    }

    if (storedPriorities) {
      setPriorities(JSON.parse(storedPriorities));
    } else {
      localStorage.setItem('spms_priorities', JSON.stringify(initialPriorities));
      setPriorities(initialPriorities);
    }
  }, []);

  // Listen to profile updates from AuthContext
  useEffect(() => {
    const handleUsersUpdate = () => {
      const storedUsers = localStorage.getItem('spms_users');
      if (storedUsers) {
        setUsers(JSON.parse(storedUsers));
      }
    };
    window.addEventListener('users-updated', handleUsersUpdate);
    return () => window.removeEventListener('users-updated', handleUsersUpdate);
  }, []);

  // Helper to persist state
  const saveToStorage = (key, data, setter) => {
    localStorage.setItem(key, JSON.stringify(data));
    setter(data);
  };

  // Recalculates the project progress percentage based on its tasks' status
  const recalculateProjectProgress = (projectId, currentTasks, currentProjects) => {
    const projTasks = currentTasks.filter((t) => t.ProjectId === Number(projectId));
    if (projTasks.length === 0) {
      return currentProjects.map((p) => 
        p.ProjectId === Number(projectId) ? { ...p, ProgressPercentage: p.Status === STATUSES.COMPLETED ? 100 : 0 } : p
      );
    }

    const completedTasks = projTasks.filter((t) => t.Status === STATUSES.COMPLETED);
    const totalScoreAssigned = projTasks.reduce((acc, t) => acc + Number(t.AssignedScore || 0), 0);
    const totalScoreEarned = projTasks.reduce((acc, t) => acc + Number(t.EarnedScore || 0), 0);

    let progressPercentage = 0;
    if (totalScoreAssigned > 0) {
      progressPercentage = Math.round((totalScoreEarned / totalScoreAssigned) * 100);
    } else {
      progressPercentage = Math.round((completedTasks.length / projTasks.length) * 100);
    }

    // Determine status from progress
    let projectStatus = STATUSES.IN_PROGRESS;
    if (progressPercentage === 100) {
      projectStatus = STATUSES.COMPLETED;
    } else if (progressPercentage === 0) {
      projectStatus = STATUSES.PENDING;
    }

    return currentProjects.map((p) =>
      p.ProjectId === Number(projectId)
        ? { ...p, ProgressPercentage: progressPercentage, Status: projectStatus }
        : p
    );
  };

  // ---------------- USER CRUD ----------------
  const addUser = (userData) => {
    const newId = users.length > 0 ? Math.max(...users.map((u) => u.UserId)) + 1 : 1;
    const newUser = {
      UserId: newId,
      FullName: userData.FullName,
      Email: userData.Email,
      Password: userData.Password || 'password123',
      MobileNumber: userData.MobileNumber || '',
      ProfilePicturePath: userData.ProfilePicturePath || null,
      IsActive: userData.IsActive !== undefined ? userData.IsActive : true,
      RoleId: Number(userData.RoleId),
    };
    const updatedUsers = [...users, newUser];
    saveToStorage('spms_users', updatedUsers, setUsers);
    return newUser;
  };

  const updateUser = (userId, updatedData) => {
    const updatedUsers = users.map((u) =>
      u.UserId === Number(userId) ? { ...u, ...updatedData, RoleId: Number(updatedData.RoleId || u.RoleId) } : u
    );
    saveToStorage('spms_users', updatedUsers, setUsers);
  };

  const deleteUser = (userId) => {
    const updatedUsers = users.filter((u) => u.UserId !== Number(userId));
    saveToStorage('spms_users', updatedUsers, setUsers);
  };

  // ---------------- PROJECT CRUD ----------------
  const addProject = (projectData) => {
    const newId = projects.length > 0 ? Math.max(...projects.map((p) => p.ProjectId)) + 1 : 1;
    const newProject = {
      ProjectId: newId,
      ProjectTitle: projectData.ProjectTitle,
      Description: projectData.Description || '',
      StudentId: Number(projectData.StudentId),
      FacultyId: Number(projectData.FacultyId),
      StartDate: projectData.StartDate,
      EndDate: projectData.EndDate || null,
      Status: projectData.Status || STATUSES.PENDING,
      ProgressPercentage: Number(projectData.ProgressPercentage || 0),
    };
    const updatedProjects = [...projects, newProject];
    saveToStorage('spms_projects', updatedProjects, setProjects);
    return newProject;
  };

  const updateProject = (projectId, updatedData) => {
    const updatedProjects = projects.map((p) =>
      p.ProjectId === Number(projectId)
        ? {
            ...p,
            ...updatedData,
            StudentId: Number(updatedData.StudentId || p.StudentId),
            FacultyId: Number(updatedData.FacultyId || p.FacultyId),
          }
        : p
    );
    saveToStorage('spms_projects', updatedProjects, setProjects);
  };

  const deleteProject = (projectId) => {
    const updatedProjects = projects.filter((p) => p.ProjectId !== Number(projectId));
    // Cascade delete project tasks
    const updatedTasks = tasks.filter((t) => t.ProjectId !== Number(projectId));
    saveToStorage('spms_tasks', updatedTasks, setTasks);
    saveToStorage('spms_projects', updatedProjects, setProjects);
  };

  // ---------------- TASK CRUD ----------------
  const addTask = (taskData) => {
    const newId = tasks.length > 0 ? Math.max(...tasks.map((t) => t.TaskId)) + 1 : 1;
    const newTask = {
      TaskId: newId,
      ProjectId: Number(taskData.ProjectId),
      TaskTitle: taskData.TaskTitle,
      TaskDescription: taskData.TaskDescription || '',
      Status: taskData.Status || STATUSES.PENDING,
      Priority: taskData.Priority || 'Medium',
      AssignedScore: Number(taskData.AssignedScore || 0),
      EarnedScore: Number(taskData.EarnedScore || 0),
      StartDate: taskData.StartDate,
      DueDate: taskData.DueDate,
      CompletedDate: taskData.Status === STATUSES.COMPLETED ? (taskData.CompletedDate || new Date().toISOString().split('T')[0]) : null,
    };
    
    const updatedTasks = [...tasks, newTask];
    localStorage.setItem('spms_tasks', JSON.stringify(updatedTasks));
    setTasks(updatedTasks);

    // Sync project progress
    const updatedProjects = recalculateProjectProgress(taskData.ProjectId, updatedTasks, projects);
    saveToStorage('spms_projects', updatedProjects, setProjects);
    return newTask;
  };

  const updateTask = (taskId, updatedData) => {
    let targetProjectId = null;
    const updatedTasks = tasks.map((t) => {
      if (t.TaskId === Number(taskId)) {
        targetProjectId = t.ProjectId;
        const isCompleted = updatedData.Status === STATUSES.COMPLETED;
        return {
          ...t,
          ...updatedData,
          ProjectId: Number(updatedData.ProjectId || t.ProjectId),
          AssignedScore: Number(updatedData.AssignedScore !== undefined ? updatedData.AssignedScore : t.AssignedScore),
          EarnedScore: Number(updatedData.EarnedScore !== undefined ? updatedData.EarnedScore : t.EarnedScore),
          CompletedDate: isCompleted ? (updatedData.CompletedDate || t.CompletedDate || new Date().toISOString().split('T')[0]) : null,
        };
      }
      return t;
    });

    localStorage.setItem('spms_tasks', JSON.stringify(updatedTasks));
    setTasks(updatedTasks);

    if (targetProjectId) {
      const updatedProjects = recalculateProjectProgress(targetProjectId, updatedTasks, projects);
      saveToStorage('spms_projects', updatedProjects, setProjects);
    }
  };

  const deleteTask = (taskId) => {
    const taskToDelete = tasks.find((t) => t.TaskId === Number(taskId));
    if (!taskToDelete) return;
    const targetProjectId = taskToDelete.ProjectId;

    const updatedTasks = tasks.filter((t) => t.TaskId !== Number(taskId));
    localStorage.setItem('spms_tasks', JSON.stringify(updatedTasks));
    setTasks(updatedTasks);

    const updatedProjects = recalculateProjectProgress(targetProjectId, updatedTasks, projects);
    saveToStorage('spms_projects', updatedProjects, setProjects);
  };

  // ---------------- STATUS CRUD ----------------
  const addStatus = (statusData) => {
    const newId = statuses.length > 0 ? Math.max(...statuses.map((s) => s.StatusId)) + 1 : 1;
    const newStatus = {
      StatusId: newId,
      StatusName: statusData.StatusName,
    };
    const updatedStatuses = [...statuses, newStatus];
    saveToStorage('spms_statuses', updatedStatuses, setStatuses);
    return newStatus;
  };

  const updateStatus = (statusId, updatedData) => {
    const updatedStatuses = statuses.map((s) =>
      s.StatusId === Number(statusId) ? { ...s, ...updatedData } : s
    );
    saveToStorage('spms_statuses', updatedStatuses, setStatuses);
  };

  const deleteStatus = (statusId) => {
    const updatedStatuses = statuses.filter((s) => s.StatusId !== Number(statusId));
    saveToStorage('spms_statuses', updatedStatuses, setStatuses);
  };

  // ---------------- PRIORITY CRUD ----------------
  const addPriority = (priorityData) => {
    const newId = priorities.length > 0 ? Math.max(...priorities.map((p) => p.PriorityId)) + 1 : 1;
    const newPriority = {
      PriorityId: newId,
      PriorityName: priorityData.PriorityName,
    };
    const updatedPriorities = [...priorities, newPriority];
    saveToStorage('spms_priorities', updatedPriorities, setPriorities);
    return newPriority;
  };

  const updatePriority = (priorityId, updatedData) => {
    const updatedPriorities = priorities.map((p) =>
      p.PriorityId === Number(priorityId) ? { ...p, ...updatedData } : p
    );
    saveToStorage('spms_priorities', updatedPriorities, setPriorities);
  };

  const deletePriority = (priorityId) => {
    const updatedPriorities = priorities.filter((p) => p.PriorityId !== Number(priorityId));
    saveToStorage('spms_priorities', updatedPriorities, setPriorities);
  };

  return (
    <DataContext.Provider
      value={{
        users,
        projects,
        tasks,
        statuses,
        priorities,
        addUser,
        updateUser,
        deleteUser,
        addProject,
        updateProject,
        deleteProject,
        addTask,
        updateTask,
        deleteTask,
        addStatus,
        updateStatus,
        deleteStatus,
        addPriority,
        updatePriority,
        deletePriority,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
