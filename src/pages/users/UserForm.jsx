import React, { useState, useEffect } from 'react';
import { ROLES } from '../../data/mockData';
import { Button } from '../../components/common/Button';

export const UserForm = ({ initialData, onSubmit, onCancel }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [roleId, setRoleId] = useState(ROLES.STUDENT);
  const [isActive, setIsActive] = useState(true);

  // Sync state if editing
  useEffect(() => {
    if (initialData) {
      setFullName(initialData.FullName || '');
      setEmail(initialData.Email || '');
      setMobileNumber(initialData.MobileNumber || '');
      setPassword(initialData.Password || '');
      setRoleId(Number(initialData.RoleId || ROLES.STUDENT));
      setIsActive(initialData.IsActive !== undefined ? initialData.IsActive : true);
    } else {
      setFullName('');
      setEmail('');
      setMobileNumber('');
      setPassword('');
      setRoleId(ROLES.STUDENT);
      setIsActive(true);
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      FullName: fullName,
      Email: email,
      MobileNumber: mobileNumber,
      Password: password || 'password123',
      RoleId: Number(roleId),
      IsActive: isActive,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-2">
      {/* Name Input */}
      <div>
        <label className="text-xs font-semibold text-slate-400 block mb-1.5 uppercase tracking-wider">
          Full Name
        </label>
        <input
          type="text"
          required
          placeholder="e.g. Dr. John Doe"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full bg-[#1b1b3a] border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
        />
      </div>

      {/* Email Input */}
      <div>
        <label className="text-xs font-semibold text-slate-400 block mb-1.5 uppercase tracking-wider">
          Email Address
        </label>
        <input
          type="email"
          required
          placeholder="username@spms.edu"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-[#1b1b3a] border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
        />
      </div>

      {/* Password Input (only mandatory if provisioning new user) */}
      <div>
        <label className="text-xs font-semibold text-slate-400 block mb-1.5 uppercase tracking-wider">
          Password {initialData ? '(Optional)' : ''}
        </label>
        <input
          type="password"
          placeholder={initialData ? 'Leave blank to preserve current' : '••••••••'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-[#1b1b3a] border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
        />
      </div>

      {/* Mobile Input */}
      <div>
        <label className="text-xs font-semibold text-slate-400 block mb-1.5 uppercase tracking-wider">
          Mobile Number
        </label>
        <input
          type="text"
          placeholder="+1 (555) 000-0000"
          value={mobileNumber}
          onChange={(e) => setMobileNumber(e.target.value)}
          className="w-full bg-[#1b1b3a] border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Role ID Selector */}
        <div>
          <label className="text-xs font-semibold text-slate-400 block mb-1.5 uppercase tracking-wider">
            Clearance Role
          </label>
          <select
            value={roleId}
            onChange={(e) => setRoleId(Number(e.target.value))}
            className="w-full bg-[#1b1b3a] border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
          >
            <option value={ROLES.STUDENT}>Student</option>
            <option value={ROLES.FACULTY}>Faculty</option>
            <option value={ROLES.ADMIN}>Admin</option>
          </select>
        </div>

        {/* Account State Toggles */}
        <div className="flex flex-col justify-end pb-1.5">
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-4.5 h-4.5 rounded bg-[#1b1b3a] border-slate-800 text-brand-600 focus:ring-brand-500 focus:ring-offset-slate-900 focus:outline-none cursor-pointer"
            />
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Is Account Active
            </span>
          </label>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800/40 mt-6">
        <Button variant="secondary" size="md" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" size="md">
          {initialData ? 'Save Changes' : 'Create Account'}
        </Button>
      </div>
    </form>
  );
};
export default UserForm;
