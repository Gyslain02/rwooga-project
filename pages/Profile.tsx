import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Calendar, Shield, Lock, Edit2, Save, X, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { profileService, UserProfile } from '@/services/profileService';

const Profile = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Profile form state
    const [profileForm, setProfileForm] = useState({
        full_name: '',
        phone_number: ''
    });

    // Password form state
    const [passwordForm, setPasswordForm] = useState({
        old_password: '',
        new_password: '',
        confirm_password: ''
    });
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            setLoading(true);
            const response = await profileService.getProfile();
            if (response.ok && response.data) {
                setProfile(response.data);
                setProfileForm({
                    full_name: response.data.full_name,
                    phone_number: response.data.phone_number
                });
            } else {
                toast.error('Failed to load profile');
            }
        } catch (error: any) {
            console.error('Error loading profile:', error);
            toast.error(error.message || 'Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    const handleSaveProfile = async () => {
        try {
            setIsSaving(true);
            const response = await profileService.updateProfile(profileForm);
            if (response.ok) {
                toast.success('Profile updated successfully');
                setIsEditing(false);
                loadProfile();
            } else {
                toast.error('Failed to update profile');
            }
        } catch (error: any) {
            console.error('Error updating profile:', error);
            toast.error(error.message || 'Failed to update profile');
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancelEdit = () => {
        if (profile) {
            setProfileForm({
                full_name: profile.full_name,
                phone_number: profile.phone_number
            });
        }
        setIsEditing(false);
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (passwordForm.new_password !== passwordForm.confirm_password) {
            toast.error('New passwords do not match');
            return;
        }

        if (passwordForm.new_password.length < 8) {
            toast.error('Password must be at least 8 characters long');
            return;
        }

        try {
            setIsChangingPassword(true);
            const response = await profileService.changePassword({
                old_password: passwordForm.old_password,
                new_password: passwordForm.new_password
            });
            if (response.ok) {
                toast.success('Password changed successfully');
                setPasswordForm({
                    old_password: '',
                    new_password: '',
                    confirm_password: ''
                });
            } else {
                toast.error('Failed to change password');
            }
        } catch (error: any) {
            console.error('Error changing password:', error);
            toast.error(error.message || 'Failed to change password');
        } finally {
            setIsChangingPassword(false);
        }
    };

    const getUserRole = () => {
        if (!profile) return 'Customer';
        if (profile.is_admin) return 'Admin';
        if (profile.is_staff) return 'Staff';
        return 'Customer';
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-brand-dark flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading profile...</p>
                </div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="min-h-screen bg-brand-dark flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-400">Failed to load profile</p>
                    <button
                        onClick={() => navigate('/')}
                        className="mt-4 px-6 py-2 bg-brand-primary text-white rounded-xl font-bold hover:brightness-110 transition-all"
                    >
                        Go Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-brand-dark py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <div className="w-24 h-24 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-full flex items-center justify-center text-white text-4xl font-bold mx-auto mb-4 shadow-xl">
                        {profile.full_name.charAt(0).toUpperCase()}
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">
                        {profile.full_name}
                    </h1>
                    <p className="text-gray-400">{profile.email}</p>
                    <span className={`inline-block mt-2 px-4 py-1 rounded-full text-xs font-bold ${profile.is_admin
                        ? 'bg-purple-500/10 text-purple-400'
                        : profile.is_staff
                            ? 'bg-blue-500/10 text-blue-400'
                            : 'bg-gray-800 text-gray-400'
                        }`}>
                        {getUserRole()}
                    </span>
                </motion.div>

                {/* Profile Information Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-[#1c1c1e] rounded-3xl shadow-xl p-8 mb-6"
                >
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-white flex items-center">
                            <User className="mr-2" size={24} />
                            Profile Information
                        </h2>
                        {!isEditing ? (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="flex items-center space-x-2 px-4 py-2 bg-brand-primary text-white rounded-xl font-bold hover:brightness-110 transition-all"
                            >
                                <Edit2 size={18} />
                                <span>Edit</span>
                            </button>
                        ) : (
                            <div className="flex space-x-2">
                                <button
                                    onClick={handleCancelEdit}
                                    className="flex items-center space-x-2 px-4 py-2 bg-gray-800 text-gray-300 rounded-xl font-bold hover:bg-gray-700 transition-all"
                                >
                                    <X size={18} />
                                    <span>Cancel</span>
                                </button>
                                <button
                                    onClick={handleSaveProfile}
                                    disabled={isSaving}
                                    className="flex items-center space-x-2 px-4 py-2 bg-brand-primary text-white rounded-xl font-bold hover:brightness-110 transition-all disabled:opacity-50"
                                >
                                    <Save size={18} />
                                    <span>{isSaving ? 'Saving...' : 'Save'}</span>
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="space-y-6">
                        {/* Full Name */}
                        <div>
                            <label className="block text-sm font-bold text-gray-400 mb-2">
                                Full Name
                            </label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={profileForm.full_name}
                                    onChange={(e) => setProfileForm({ ...profileForm, full_name: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-900/40 border border-gray-700 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none transition-all text-white"
                                />
                            ) : (
                                <div className="flex items-center px-4 py-3 bg-gray-900/40 rounded-xl">
                                    <User size={20} className="text-gray-500 mr-3" />
                                    <span className="text-white">{profile.full_name}</span>
                                </div>
                            )}
                        </div>

                        {/* Email (Read-only) */}
                        <div>
                            <label className="block text-sm font-bold text-gray-400 mb-2">
                                Email Address
                            </label>
                            <div className="flex items-center px-4 py-3 bg-gray-900/40 rounded-xl">
                                <Mail size={20} className="text-gray-500 mr-3" />
                                <span className="text-white">{profile.email}</span>
                                <span className="ml-auto text-xs text-gray-500">(Read-only)</span>
                            </div>
                        </div>

                        {/* Phone Number */}
                        <div>
                            <label className="block text-sm font-bold text-gray-400 mb-2">
                                Phone Number
                            </label>
                            {isEditing ? (
                                <input
                                    type="tel"
                                    value={profileForm.phone_number}
                                    onChange={(e) => setProfileForm({ ...profileForm, phone_number: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-900/40 border border-gray-700 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none transition-all text-white"
                                />
                            ) : (
                                <div className="flex items-center px-4 py-3 bg-gray-900/40 rounded-xl">
                                    <Phone size={20} className="text-gray-500 mr-3" />
                                    <span className="text-white">{profile.phone_number}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>

                {/* Security Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-[#1c1c1e] rounded-3xl shadow-xl p-8 mb-6"
                >
                    <h2 className="text-xl font-bold text-white flex items-center mb-6">
                        <Lock className="mr-2" size={24} />
                        Security
                    </h2>

                    <form onSubmit={handleChangePassword} className="space-y-6">
                        {/* Current Password */}
                        <div>
                            <label className="block text-sm font-bold text-gray-400 mb-2">
                                Current Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showOldPassword ? 'text' : 'password'}
                                    value={passwordForm.old_password}
                                    onChange={(e) => setPasswordForm({ ...passwordForm, old_password: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-900/40 border border-gray-700 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none transition-all text-white pr-12"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowOldPassword(!showOldPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                                >
                                    {showOldPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        {/* New Password */}
                        <div>
                            <label className="block text-sm font-bold text-gray-400 mb-2">
                                New Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showNewPassword ? 'text' : 'password'}
                                    value={passwordForm.new_password}
                                    onChange={(e) => setPasswordForm({ ...passwordForm, new_password: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-900/40 border border-gray-700 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none transition-all text-white pr-12"
                                    required
                                    minLength={8}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                                >
                                    {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                                Must be at least 8 characters long
                            </p>
                        </div>

                        {/* Confirm New Password */}
                        <div>
                            <label className="block text-sm font-bold text-gray-400 mb-2">
                                Confirm New Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    value={passwordForm.confirm_password}
                                    onChange={(e) => setPasswordForm({ ...passwordForm, confirm_password: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-900/40 border border-gray-700 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none transition-all text-white pr-12"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                                >
                                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isChangingPassword}
                            className="w-full px-6 py-3 bg-brand-primary text-white rounded-xl font-bold hover:brightness-110 transition-all disabled:opacity-50"
                        >
                            {isChangingPassword ? 'Changing Password...' : 'Change Password'}
                        </button>
                    </form>
                </motion.div>

                {/* Account Details Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-[#1c1c1e] rounded-3xl shadow-xl p-8"
                >
                    <h2 className="text-xl font-bold text-white flex items-center mb-6">
                        <Shield className="mr-2" size={24} />
                        Account Details
                    </h2>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between py-3 border-b border-white/10">
                            <span className="text-gray-400">Account Type</span>
                            <span className="font-bold text-white">{getUserRole()}</span>
                        </div>
                        <div className="flex items-center justify-between py-3 border-b border-white/10">
                            <span className="text-gray-400 flex items-center">
                                <Calendar size={18} className="mr-2" />
                                Member Since
                            </span>
                            <span className="font-bold text-white">{formatDate(profile.date_joined)}</span>
                        </div>
                        <div className="flex items-center justify-between py-3">
                            <span className="text-gray-400">Last Updated</span>
                            <span className="font-bold text-white">{formatDate(profile.updated_at)}</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Profile;
