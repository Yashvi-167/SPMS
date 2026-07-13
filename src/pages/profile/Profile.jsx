import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Button } from '../../components/common/Button';
import { Camera, User, Mail, Phone, Lock } from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';

export const Profile = () => {
  const { id } = useParams();
  const { currentUser, updateProfile } = useAuth();
  const { users } = useData();

  const isViewingOther = Boolean(id && currentUser?.UserId && parseInt(id) !== currentUser.UserId);
  const targetUser = isViewingOther ? users.find((u) => u.UserId === parseInt(id)) : currentUser;

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [avatarBase64, setAvatarBase64] = useState(null);
  
  const fileInputRef = useRef(null);

  // Sync edits
  useEffect(() => {
    if (targetUser) {
      setFullName(targetUser.FullName || '');
      setEmail(targetUser.Email || '');
      setMobileNumber(targetUser.MobileNumber || '');
      setPassword(targetUser.Password || '');
      setAvatarBase64(targetUser.ProfilePicturePath || null);
    }
  }, [targetUser]);

  // Handle local avatar upload and convert to base64
  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Image size exceeds 2MB limits!', {
          style: { backgroundColor: '#141432', color: '#fff', border: '1px solid #1e293b' },
        });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setAvatarBase64(base64String);
        toast.success('Profile image preview loaded!', {
          style: { backgroundColor: '#141432', color: '#fff', border: '1px solid #1e293b' },
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTriggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    try {
      updateProfile({
        FullName: fullName,
        Email: email,
        MobileNumber: mobileNumber,
        Password: password,
        ProfilePicturePath: avatarBase64,
      });

      toast.success('Your profile settings have been updated successfully!', {
        style: { backgroundColor: '#141432', color: '#fff', border: '1px solid #1e293b' },
      });
    } catch (err) {
      toast.error('Failed to update details.', {
        style: { backgroundColor: '#141432', color: '#fff', border: '1px solid #1e293b' },
      });
    }
  };

  const getRoleLabel = () => {
    if (!targetUser) return '';
    if (targetUser.RoleId === 1) return 'Administrator';
    if (targetUser.RoleId === 2) return 'Faculty Guide';
    return 'Student Researcher';
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Toaster position="top-right" />

      {/* Header title */}
      <div>
        <h1 className="text-2xl font-black font-display text-white">
          {isViewingOther ? `${fullName}'s Profile` : 'Account Center'}
        </h1>
        <p className="text-slate-400 text-xs mt-1">
          {isViewingOther 
            ? 'Viewing user profile details and access information.' 
            : 'Configure profile details, upload verification photos and modify access passwords.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Side: Avatar Card */}
        <div className="glass-card p-6 text-center flex flex-col items-center justify-center border-slate-800 bg-[#12122c]/60 h-80 relative">
          <div className="relative group cursor-pointer mb-4" onClick={!isViewingOther ? handleTriggerFileSelect : undefined}>
            <div className="w-24 h-24 rounded-2xl bg-gradient-brand flex items-center justify-center font-extrabold text-white text-2xl shadow-glow overflow-hidden">
              {avatarBase64 ? (
                <img src={avatarBase64} alt="Avatar" className="w-full h-full object-cover rounded-2xl" />
              ) : (
                fullName.charAt(0)
              )}
            </div>
            
            {/* Overlap camera widget */}
            {!isViewingOther && (
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-2xl flex items-center justify-center text-white">
                <Camera className="w-5 h-5" />
              </div>
            )}
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleAvatarChange}
            accept="image/*"
            className="hidden"
          />

          <h3 className="text-base font-bold text-slate-100 font-display">{fullName}</h3>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mt-1">
            {getRoleLabel()}
          </span>
          {!isViewingOther && (
            <p className="text-xs text-slate-500 mt-4 leading-relaxed">
              Click avatar to choose a custom local image (Max 2MB).
            </p>
          )}
        </div>

        {/* Right Side: Account details Form */}
        <div className="glass-card p-6 md:col-span-2 border-slate-800 bg-[#12122c]/60">
          <h2 className="text-sm font-bold text-slate-300 font-display uppercase tracking-wider pb-3 border-b border-slate-800/40 mb-6">
            {isViewingOther ? 'User Profile Details' : 'Modify Profile Settings'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1.5 uppercase tracking-wider">
                Full Name
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                  <User className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  required
                  disabled={isViewingOther}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-[#1b1b3a] border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-100 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 disabled:opacity-70"
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1.5 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  type="email"
                  required
                  disabled={isViewingOther}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#1b1b3a] border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-100 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 disabled:opacity-70"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1.5 uppercase tracking-wider">
                Mobile Number
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                  <Phone className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  disabled={isViewingOther}
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  className="w-full bg-[#1b1b3a] border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-100 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 disabled:opacity-70"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1.5 uppercase tracking-wider">
                Access Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type={isViewingOther ? "text" : "password"}
                  required
                  disabled={isViewingOther}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#1b1b3a] border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-100 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 disabled:opacity-70"
                />
              </div>
            </div>

            {/* Actions button */}
            {!isViewingOther && (
              <div className="pt-4 flex items-center justify-end">
                <Button type="submit" variant="primary" size="md">
                  Update Account Profile
                </Button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};
export default Profile;
