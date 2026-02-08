import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { User, Mail, Lock, Save, ArrowLeft, Phone, MapPin, Smile } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
    const { user, updateUser } = useAuth();
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [gender, setGender] = useState('');
    const [mobile, setMobile] = useState('');
    const [address, setAddress] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (user) {
            setName(user.name || '');
            setEmail(user.email || '');
            setGender(user.gender || 'Other');
            setMobile(user.mobile || '');
            setAddress(user.address || '');
        }
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        if (password && password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            };

            const { data } = await axios.put(
                '/api/auth/profile',
                { name, email, gender, mobile, address, password },
                config
            );

            updateUser(data);
            setMessage('Profile updated successfully');
            setPassword('');
            setConfirmPassword('');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex flex-col py-12 sm:px-6 lg:px-8 transition-colors duration-300">
            <div className="sm:mx-auto sm:w-full sm:max-w-md mb-6">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors mb-4"
                >
                    <ArrowLeft size={18} className="mr-1" /> Back
                </button>
                <div className="flex justify-center">
                    <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                        <User size={32} />
                    </div>
                </div>
                <h2 className="mt-4 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
                    Your Profile
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                    Manage your account settings and preferences
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white dark:bg-slate-800 py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-100 dark:border-white/5 transition-colors duration-300">
                    {message && (
                        <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded relative" role="alert">
                            <span className="block sm:inline">{message}</span>
                        </div>
                    )}
                    {error && (
                        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
                            <span className="block sm:inline">{error}</span>
                        </div>
                    )}

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Full Name
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 dark:border-white/10 rounded-lg py-2.5 bg-white dark:bg-slate-900/50 text-gray-900 dark:text-white placeholder-gray-400"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Email Address
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 dark:border-white/10 rounded-lg py-2.5 bg-white dark:bg-slate-900/50 text-gray-900 dark:text-white placeholder-gray-400"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="gender" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Gender
                                </label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Smile className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <select
                                        id="gender"
                                        name="gender"
                                        value={gender}
                                        onChange={(e) => setGender(e.target.value)}
                                        className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 dark:border-white/10 rounded-lg py-2.5 bg-white dark:bg-slate-900/50 text-gray-900 dark:text-white"
                                    >
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Mobile Number
                                </label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Phone className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="mobile"
                                        name="mobile"
                                        type="tel"
                                        placeholder="Enter mobile number"
                                        value={mobile}
                                        onChange={(e) => setMobile(e.target.value)}
                                        className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 dark:border-white/10 rounded-lg py-2.5 bg-white dark:bg-slate-900/50 text-gray-900 dark:text-white placeholder-gray-400"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Address
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <MapPin className="h-5 w-5 text-gray-400" />
                                </div>
                                <textarea
                                    id="address"
                                    name="address"
                                    rows={3}
                                    placeholder="Enter your address"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 dark:border-white/10 rounded-lg py-2.5 bg-white dark:bg-slate-900/50 text-gray-900 dark:text-white placeholder-gray-400"
                                />
                            </div>
                        </div>

                        <div className="border-t border-gray-100 dark:border-white/10 pt-6">
                            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4">Change Password</h3>

                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        New Password
                                    </label>
                                    <div className="mt-1 relative rounded-md shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Lock className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            id="password"
                                            name="password"
                                            type="password"
                                            placeholder="Leave blank to keep current"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 dark:border-white/10 rounded-lg py-2.5 bg-white dark:bg-slate-900/50 text-gray-900 dark:text-white placeholder-gray-400"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Confirm New Password
                                    </label>
                                    <div className="mt-1 relative rounded-md shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Lock className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            type="password"
                                            placeholder="Confirm new password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 dark:border-white/10 rounded-lg py-2.5 bg-white dark:bg-slate-900/50 text-gray-900 dark:text-white placeholder-gray-400"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
                            >
                                {loading ? (
                                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                ) : (
                                    <>
                                        <Save className="h-5 w-5 mr-2" />
                                        Save Changes
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div >
        </div >
    );
};

export default UserProfile;
