import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Calendar, Shield, Lock, Edit2, Save, X, Eye, EyeOff, RefreshCw, Trash2, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { profileService, UserProfile } from '@/services/profileService';
import { authService } from '@/services/authService';
import DeleteConfirmModal from '@/components/DeleteConfirmModal';

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

    // Email change state
    const [showEmailChange, setShowEmailChange] = useState(false);
    const [emailChangeStep, setEmailChangeStep] = useState<'request' | 'confirm'>('request');
    const [emailChangeForm, setEmailChangeForm] = useState({
        new_email: '',
        password: '',
        code: ''
    });
    const [isChangingEmail, setIsChangingEmail] = useState(false);
    const [showEmailPassword, setShowEmailPassword] = useState(false);

    // Delete Account state
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

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
                new_password: passwordForm.new_password,
                new_password_confirm: passwordForm.confirm_password
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

    const handleEmailChangeRequest = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!emailChangeForm.new_email || !emailChangeForm.password) {
            toast.error('Please fill in all fields');
            return;
        }

        try {
            setIsChangingEmail(true);
            const response = await profileService.emailChangeRequest({
                new_email: emailChangeForm.new_email,
                password: emailChangeForm.password
            });
            if (response.ok) {
                toast.success('Verification code sent to your new email');
                setEmailChangeStep('confirm');
            } else {
                toast.error('Failed to request email change');
            }
        } catch (error: any) {
            console.error('Error requesting email change:', error);
            toast.error(error.message || 'Failed to request email change');
        } finally {
            setIsChangingEmail(false);
        }
    };

    const handleEmailChangeConfirm = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!emailChangeForm.code || emailChangeForm.code.length !== 6) {
            toast.error('Please enter the 6-digit verification code');
            return;
        }

        try {
            setIsChangingEmail(true);
            const response = await profileService.emailChangeConfirm({
                new_email: emailChangeForm.new_email,
                code: emailChangeForm.code
            });
            if (response.ok) {
                toast.success('Email changed successfully');
                setShowEmailChange(false);
                setEmailChangeStep('request');
                setEmailChangeForm({ new_email: '', password: '', code: '' });
                loadProfile();
            } else {
                toast.error('Failed to confirm email change');
            }
        } catch (error: any) {
            console.error('Error confirming email change:', error);
            toast.error(error.message || 'Failed to confirm email change');
        } finally {
            setIsChangingEmail(false);
        }
    };

    const handleResendCode = async () => {
        try {
            setIsChangingEmail(true);
            const response = await profileService.resendEmailChangeCode({
                new_email: emailChangeForm.new_email,
                password: emailChangeForm.password
            });
            if (response.ok) {
                toast.success('Verification code resent');
            } else {
                toast.error('Failed to resend code');
            }
        } catch (error: any) {
            console.error('Error resending code:', error);
            toast.error(error.message || 'Failed to resend code');
        } finally {
            setIsChangingEmail(false);
        }
    };

    const handleCancelEmailChange = () => {
        setShowEmailChange(false);
        setEmailChangeStep('request');
        setEmailChangeForm({ new_email: '', password: '', code: '' });
    };

    const getUserRole = () => {
        if (!profile) return 'Customer';
        switch (profile.user_type) {
            case 'ADMIN': return 'Admin';
            case 'STAFF': return 'Staff';
            case 'CUSTOMER': return 'Customer';
            default: return 'Customer';
        }
    };

    const getRoleBadgeClasses = () => {
        if (!profile) return 'bg-gray-800 text-gray-400';
        switch (profile.user_type) {
            case 'ADMIN': return 'bg-purple-500/10 text-purple-400';
            case 'STAFF': return 'bg-blue-500/10 text-blue-400';
            case 'CUSTOMER': return 'bg-gray-800 text-gray-400';
            default: return 'bg-gray-800 text-gray-400';
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const handleDeleteAccount = async () => {
        if (!profile) return;

        try {
            setIsDeleting(true);
            const response = await profileService.deleteAccount(profile.id);
            if (response.ok) {
                toast.success('Account deleted successfully');
                // Logout and clean up
                const refreshToken = localStorage.getItem('refresh_token');
                if (refreshToken) {
                    await authService.logout(refreshToken);
                }
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                localStorage.removeItem('user');
                navigate('/');
            } else {
                toast.error('Failed to delete account');
            }
        } catch (error: any) {
            console.error('Error deleting account:', error);
            toast.error(error.message || 'Failed to delete account');
        } finally {
            setIsDeleting(false);
            setShowDeleteConfirm(false);
        }
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
                    <div className="flex items-center justify-center gap-2 mt-2">
                        <span className={`inline-block px-4 py-1 rounded-full text-xs font-bold ${getRoleBadgeClasses()}`}>
                            {getUserRole()}
                        </span>
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${profile.is_active
                            ? 'bg-green-500/10 text-green-400'
                            : 'bg-red-500/10 text-red-400'
                            }`}>
                            {profile.is_active ? 'Active' : 'Inactive'}
                        </span>
                    </div>
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

                        {/* Email (Read-only with change option) */}
                        <div>
                            <label className="block text-sm font-bold text-gray-400 mb-2">
                                Email Address
                            </label>
                            <div className="flex items-center px-4 py-3 bg-gray-900/40 rounded-xl">
                                <Mail size={20} className="text-gray-500 mr-3" />
                                <span className="text-white">{profile.email}</span>
                                <button
                                    onClick={() => setShowEmailChange(!showEmailChange)}
                                    className="ml-auto text-xs bg-brand-primary/10 text-brand-primary px-3 py-1 rounded-lg font-bold hover:bg-brand-primary/20 transition-all"
                                >
                                    Change Email
                                </button>
                            </div>
                        </div>

                        {/* Email Change Section */}
                        <AnimatePresence>
                            {showEmailChange && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="bg-gray-900/40 border border-gray-700 rounded-xl p-6">
                                        {emailChangeStep === 'request' ? (
                                            <form onSubmit={handleEmailChangeRequest} className="space-y-4">
                                                <h3 className="text-sm font-bold text-white mb-2">Change Email Address</h3>
                                                <p className="text-xs text-gray-400 mb-4">
                                                    A verification code will be sent to your new email address.
                                                </p>
                                                <div>
                                                    <label className="block text-xs font-bold text-gray-400 mb-1">
                                                        New Email Address
                                                    </label>
                                                    <input
                                                        type="email"
                                                        value={emailChangeForm.new_email}
                                                        onChange={(e) => setEmailChangeForm({ ...emailChangeForm, new_email: e.target.value })}
                                                        className="w-full px-4 py-3 bg-gray-900/60 border border-gray-600 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none transition-all text-white"
                                                        placeholder="Enter new email"
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-gray-400 mb-1">
                                                        Current Password
                                                    </label>
                                                    <div className="relative">
                                                        <input
                                                            type={showEmailPassword ? 'text' : 'password'}
                                                            value={emailChangeForm.password}
                                                            onChange={(e) => setEmailChangeForm({ ...emailChangeForm, password: e.target.value })}
                                                            className="w-full px-4 py-3 bg-gray-900/60 border border-gray-600 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none transition-all text-white pr-12"
                                                            placeholder="Enter current password"
                                                            required
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowEmailPassword(!showEmailPassword)}
                                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                                                        >
                                                            {showEmailPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={handleCancelEmailChange}
                                                        className="flex-1 px-4 py-2.5 bg-gray-800 text-gray-300 rounded-xl font-bold hover:bg-gray-700 transition-all text-sm"
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        type="submit"
                                                        disabled={isChangingEmail}
                                                        className="flex-1 px-4 py-2.5 bg-brand-primary text-white rounded-xl font-bold hover:brightness-110 transition-all disabled:opacity-50 text-sm"
                                                    >
                                                        {isChangingEmail ? 'Sending...' : 'Send Code'}
                                                    </button>
                                                </div>
                                            </form>
                                        ) : (
                                            <form onSubmit={handleEmailChangeConfirm} className="space-y-4">
                                                <h3 className="text-sm font-bold text-white mb-2">Verify New Email</h3>
                                                <p className="text-xs text-gray-400 mb-4">
                                                    Enter the 6-digit code sent to <span className="text-white font-bold">{emailChangeForm.new_email}</span>
                                                </p>
                                                <div>
                                                    <label className="block text-xs font-bold text-gray-400 mb-1">
                                                        Verification Code
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={emailChangeForm.code}
                                                        onChange={(e) => {
                                                            const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                                                            setEmailChangeForm({ ...emailChangeForm, code: val });
                                                        }}
                                                        className="w-full px-4 py-3 bg-gray-900/60 border border-gray-600 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none transition-all text-white text-center text-2xl tracking-[0.5em] font-mono"
                                                        placeholder="000000"
                                                        maxLength={6}
                                                        required
                                                    />
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={handleCancelEmailChange}
                                                        className="flex-1 px-4 py-2.5 bg-gray-800 text-gray-300 rounded-xl font-bold hover:bg-gray-700 transition-all text-sm"
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        type="submit"
                                                        disabled={isChangingEmail}
                                                        className="flex-1 px-4 py-2.5 bg-brand-primary text-white rounded-xl font-bold hover:brightness-110 transition-all disabled:opacity-50 text-sm"
                                                    >
                                                        {isChangingEmail ? 'Confirming...' : 'Confirm'}
                                                    </button>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={handleResendCode}
                                                    disabled={isChangingEmail}
                                                    className="w-full flex items-center justify-center gap-2 text-xs text-gray-400 hover:text-white transition-colors disabled:opacity-50"
                                                >
                                                    <RefreshCw size={14} />
                                                    Resend verification code
                                                </button>
                                            </form>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

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
                        Change Password
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
                            <span className="text-gray-400">Status</span>
                            <span className={`font-bold ${profile.is_active ? 'text-green-400' : 'text-red-400'}`}>
                                {profile.is_active ? 'Active' : 'Inactive'}
                            </span>
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

                {/* Danger Zone */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-red-500/5 border border-red-500/20 rounded-3xl shadow-xl p-8 mb-6"
                >
                    <h2 className="text-xl font-bold text-red-500 flex items-center mb-4">
                        <AlertTriangle className="mr-2" size={24} />
                        Danger Zone
                    </h2>
                    <p className="text-gray-400 mb-6 text-sm">
                        Once you delete your account, there is no going back. Please be certain.
                    </p>
                    <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="flex items-center space-x-2 px-6 py-3 bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl font-bold hover:bg-red-500 hover:text-white transition-all"
                    >
                        <Trash2 size={18} />
                        <span>Delete Account</span>
                    </button>
                </motion.div>
            </div>

            <DeleteConfirmModal
                isOpen={showDeleteConfirm}
                onClose={() => setShowDeleteConfirm(false)}
                onConfirm={handleDeleteAccount}
                title="Delete Account"
                message="Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently removed."
                loading={isDeleting}
            />
        </div>
    );
};

export default Profile;
