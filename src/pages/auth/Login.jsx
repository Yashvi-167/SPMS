import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { ROLES } from '../../data/mockData';
import { GraduationCap, ShieldAlert, KeyRound, Mail, Sparkles, User, Phone } from 'lucide-react';
import { Button } from '../../components/common/Button';

export const Login = () => {
  const { login } = useAuth();
  const { addUser, users } = useData();
  const navigate = useNavigate();

  const [isSignUp, setIsSignUp] = useState(false);
  const [roleSelection, setRoleSelection] = useState(ROLES.STUDENT);
  
  // Input fields state
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsLoading(true);

    try {
      login(email, password, roleSelection);
      navigate('/dashboard');
    } catch (err) {
      setErrorMsg(err.message || 'Authentication failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsLoading(true);

    try {
      // Basic validations
      if (!fullName.trim()) throw new Error('Please enter your full name.');
      if (!email.trim()) throw new Error('Please enter your email.');
      if (!password.trim()) throw new Error('Please choose a password.');

      // Check if email already exists
      const emailExists = users.some(u => u.Email.toLowerCase() === email.toLowerCase());
      if (emailExists) {
        throw new Error('This email address is already registered.');
      }

      // Add user (self-registration defaults to Active)
      addUser({
        FullName: fullName,
        Email: email,
        Password: password,
        MobileNumber: mobileNumber,
        RoleId: Number(roleSelection),
        IsActive: true
      });

      setSuccessMsg('Account created successfully! You can now log in.');
      setIsSignUp(false); // Toggle back to login view
      
      // Clear sign-up inputs
      setFullName('');
      setMobileNumber('');
    } catch (err) {
      setErrorMsg(err.message || 'Registration failed.');
    } finally {
      setIsLoading(false);
    }
  };

  // Shortcut filler for developer sandbox
  const handleQuickFill = (role) => {
    setRoleSelection(role);
    setIsSignUp(false);
    if (role === ROLES.ADMIN) {
      setEmail('sarah.admin@spms.edu');
      setPassword('password123');
    } else if (role === ROLES.FACULTY) {
      setEmail('alan.turing@spms.edu');
      setPassword('password123');
    } else {
      setEmail('alex.rivera@spms.edu');
      setPassword('password123');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#070719] px-4 relative overflow-hidden">
      {/* Decorative background gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-brand-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-accent-pink/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-lg relative z-10">
        {/* Header brand details */}
        <div className="text-center mb-6">
          <div className="inline-flex p-3 bg-brand-600/10 border border-brand-500/20 text-brand-400 rounded-2xl mb-3 shadow-glow-sm">
            <GraduationCap className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight font-display bg-gradient-to-r from-brand-400 via-indigo-400 to-accent-pink bg-clip-text text-transparent">
            Student Project Management System
          </h1>
          <p className="text-slate-400 mt-2 text-sm">
            Connect students, academic projects, tasks and grades in a unified workflow.
          </p>
        </div>

        {/* Login/Sign Up Card */}
        <div className="glass-card p-8 border-slate-800 bg-[#12122c]/85 shadow-glow">
          <h2 className="text-lg font-bold text-slate-100 font-display mb-6 text-center">
            {isSignUp ? 'Create New Account' : 'Sign In to Dashboard'}
          </h2>

          {errorMsg && (
            <div className="mb-5 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-5 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 flex-shrink-0 text-emerald-450" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Form Selector */}
          <form onSubmit={isSignUp ? handleSignUp : handleLogin} className="space-y-5">
            {/* Role picker buttons */}
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-2.5 uppercase tracking-wider">
                {isSignUp ? 'Select Your Account Type' : 'Access Tier Role'}
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  { id: ROLES.STUDENT, label: 'Student' },
                  { id: ROLES.FACULTY, label: 'Faculty' },
                  // Hide admin register tier for safety
                  ...(!isSignUp ? [{ id: ROLES.ADMIN, label: 'Admin' }] : []),
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setRoleSelection(item.id)}
                    className={`
                      py-2.5 px-3 rounded-xl border text-xs font-bold transition-all duration-200
                      ${
                        roleSelection === item.id
                          ? 'bg-brand-600/15 border-brand-500/60 text-brand-400 shadow-glow-sm scale-[1.02]'
                          : 'bg-[#1b1b3b]/40 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                      }
                    `}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Sign Up Fields */}
            {isSignUp && (
              <>
                {/* Full Name */}
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1.5 uppercase tracking-wider">
                    Full Name
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                      <User className="w-4 h-4" />
                    </span>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Alex Rivera"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-[#171735] border border-slate-800/80 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors"
                    />
                  </div>
                </div>

                {/* Mobile Number */}
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1.5 uppercase tracking-wider">
                    Mobile Number
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                      <Phone className="w-4 h-4" />
                    </span>
                    <input
                      type="text"
                      placeholder="+1 (555) 012-3456"
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      className="w-full bg-[#171735] border border-slate-800/80 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Email Field */}
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1.5 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  type="email"
                  required
                  placeholder="name@spms.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#171735] border border-slate-800/80 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1.5 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                  <KeyRound className="w-4 h-4" />
                </span>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#171735] border border-slate-800/80 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors"
                />
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              disabled={isLoading}
              className="w-full py-3 rounded-xl mt-2 flex items-center justify-center gap-2"
            >
              {isLoading 
                ? (isSignUp ? 'Creating...' : 'Signing In...') 
                : (isSignUp ? 'Create Account' : 'Verify Access')}
            </Button>
            </form>

          {/* Toggle Login/Sign Up */}
          <div className="mt-4 text-center">
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setErrorMsg('');
                setSuccessMsg('');
              }}
              className="text-xs text-brand-400 hover:text-brand-300 font-semibold"
            >
              {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Create one"}
            </button>
          </div>

          {/* Quick fill section */}
          {!isSignUp && (
            <div className="mt-6 pt-6 border-t border-slate-800/60">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 justify-center mb-3">
                <Sparkles className="w-3.5 h-3.5 text-brand-450" />
                Developer Sandboxed Testing Accounts
              </span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickFill(ROLES.STUDENT)}
                  className="py-1.5 px-2 bg-slate-800/30 hover:bg-slate-800/60 border border-slate-800 rounded-lg text-[10px] font-medium text-slate-400 hover:text-slate-200"
                >
                  Fill Student
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickFill(ROLES.FACULTY)}
                  className="py-1.5 px-2 bg-slate-800/30 hover:bg-slate-800/60 border border-slate-800 rounded-lg text-[10px] font-medium text-slate-400 hover:text-slate-200"
                >
                  Fill Faculty
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickFill(ROLES.ADMIN)}
                  className="py-1.5 px-2 bg-slate-800/30 hover:bg-slate-800/60 border border-slate-800 rounded-lg text-[10px] font-medium text-slate-400 hover:text-slate-200"
                >
                  Fill Admin
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default Login;

