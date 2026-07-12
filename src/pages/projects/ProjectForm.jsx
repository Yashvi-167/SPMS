import React, { useState, useEffect, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { STATUSES } from '../../data/mockData';
import { Button } from '../../components/common/Button';

export const ProjectForm = ({ initialData, onSubmit, onCancel }) => {
  const { users } = useData();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [studentId, setStudentId] = useState('');
  const [facultyId, setFacultyId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [status, setStatus] = useState(STATUSES.PENDING);

  // Filter students and faculty
  const students = useMemo(() => users.filter((u) => u.RoleId === 3 && u.IsActive), [users]);
  const faculty = useMemo(() => users.filter((u) => u.RoleId === 2 && u.IsActive), [users]);

  // Sync edits
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.ProjectTitle || '');
      setDescription(initialData.Description || '');
      setStudentId(String(initialData.StudentId || ''));
      setFacultyId(String(initialData.FacultyId || ''));
      setStartDate(initialData.StartDate || '');
      setEndDate(initialData.EndDate || '');
      setStatus(initialData.Status || STATUSES.PENDING);
    } else {
      setTitle('');
      setDescription('');
      setStudentId(students[0]?.UserId ? String(students[0].UserId) : '');
      setFacultyId(faculty[0]?.UserId ? String(faculty[0].UserId) : '');
      setStartDate(new Date().toISOString().split('T')[0]);
      setEndDate('');
      setStatus(STATUSES.PENDING);
    }
  }, [initialData, students, faculty]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ProjectTitle: title,
      Description: description,
      StudentId: Number(studentId),
      FacultyId: Number(facultyId),
      StartDate: startDate,
      EndDate: endDate || null,
      Status: status,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-2">
      {/* Project Title */}
      <div>
        <label className="text-xs font-semibold text-slate-400 block mb-1.5 uppercase tracking-wider">
          Project Title
        </label>
        <input
          type="text"
          required
          placeholder="e.g. Multi-agent AI Simulation Platform"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-[#1b1b3a] border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
        />
      </div>

      {/* Description */}
      <div>
        <label className="text-xs font-semibold text-slate-400 block mb-1.5 uppercase tracking-wider">
          Workspace Description
        </label>
        <textarea
          rows={3}
          placeholder="Summary of research scope, technologies and expected outcomes..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full bg-[#1b1b3a] border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 resize-none"
        />
      </div>

      {/* Student + Faculty selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Student selector */}
        <div>
          <label className="text-xs font-semibold text-slate-400 block mb-1.5 uppercase tracking-wider">
            Assigned Student
          </label>
          <select
            required
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            className="w-full bg-[#1b1b3a] border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
          >
            <option value="" disabled>Select Student</option>
            {students.map((std) => (
              <option key={std.UserId} value={std.UserId}>
                {std.FullName}
              </option>
            ))}
          </select>
        </div>

        {/* Faculty supervisor selector */}
        <div>
          <label className="text-xs font-semibold text-slate-400 block mb-1.5 uppercase tracking-wider">
            Faculty Supervisor
          </label>
          <select
            required
            value={facultyId}
            onChange={(e) => setFacultyId(e.target.value)}
            className="w-full bg-[#1b1b3a] border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
          >
            <option value="" disabled>Select Supervisor</option>
            {faculty.map((fac) => (
              <option key={fac.UserId} value={fac.UserId}>
                {fac.FullName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Start + End Dates */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-semibold text-slate-400 block mb-1.5 uppercase tracking-wider">
            Start Date
          </label>
          <input
            type="date"
            required
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full bg-[#1b1b3a] border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-400 block mb-1.5 uppercase tracking-wider">
            End Date (Deadline)
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full bg-[#1b1b3a] border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
          />
        </div>
      </div>

      {/* Project Status */}
      <div>
        <label className="text-xs font-semibold text-slate-400 block mb-1.5 uppercase tracking-wider">
          Workspace Status
        </label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full bg-[#1b1b3a] border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
        >
          <option value={STATUSES.PENDING}>Pending</option>
          <option value={STATUSES.IN_PROGRESS}>In Progress</option>
          <option value={STATUSES.COMPLETED}>Completed</option>
        </select>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800/40 mt-6">
        <Button variant="secondary" size="md" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" size="md">
          {initialData ? 'Save Changes' : 'Initiate Workspace'}
        </Button>
      </div>
    </form>
  );
};
export default ProjectForm;
