import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User as UserIcon, Sun, Moon } from 'lucide-react';
import { useState, useEffect } from 'react';

import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();
    const location = useLocation();
    const isProfilePage = location.pathname === '/user-profile';

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg border-b border-gray-100 dark:border-white/10 shadow-sm transition-all duration-300">
            {/* Top Gradient Line */}
            <div className="h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Logo Section */}
                    <div className="flex items-center">
                        {isProfilePage ? (
                            <div className="flex-shrink-0 flex items-center group cursor-default">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center mr-2 shadow-lg transition-all duration-300">
                                    <span className="text-white font-bold text-lg">S</span>
                                </div>
                                <span className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 tracking-tight transition-all duration-300">
                                    Su-Maarg
                                </span>
                            </div>
                        ) : (
                            <Link to="/" className="flex-shrink-0 flex items-center group">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center mr-2 shadow-lg group-hover:shadow-blue-500/30 transition-all duration-300">
                                    <span className="text-white font-bold text-lg">S</span>
                                </div>
                                <span className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 tracking-tight group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300">
                                    Su-Maarg
                                </span>
                            </Link>
                        )}
                    </div>

                    {/* Desktop Navigation */}
                    <div className="flex items-center space-x-1">
                        {/* Theme Toggle Button */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 mr-2 rounded-xl text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-yellow-400 transition-colors hover:bg-gray-50 dark:hover:bg-white/10"
                            aria-label="Toggle Dark Mode"
                        >
                            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                        </button>

                        {user ? (
                            <>
                                <div className="hidden md:flex items-center justify-center w-10 h-10 bg-blue-100 text-blue-600 rounded-full mr-4 border border-blue-200">
                                    <UserIcon size={20} />
                                </div>

                                {user.role === 'admin' && (
                                    <Link to="/admin" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:bg-blue-50 dark:hover:bg-white/10">
                                        Admin
                                    </Link>
                                )}

                                <Link to="/dashboard" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:bg-blue-50 dark:hover:bg-white/10">
                                    Dashboard
                                </Link>

                                <Link to="/my-issues" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:bg-blue-50 dark:hover:bg-white/10">
                                    My Reports
                                </Link>

                                <div className="h-6 w-px bg-gray-200 dark:bg-white/10 mx-2"></div>

                                <button
                                    onClick={handleLogout}
                                    className="flex items-center text-red-600 dark:text-red-400 hover:text-white hover:bg-red-600 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200"
                                >
                                    <LogOut className="h-4 w-4 mr-2" /> Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium px-5 py-2.5 rounded-xl transition-all hover:bg-gray-50 dark:hover:bg-white/10">
                                    Log In
                                </Link>
                                <Link to="/register" className="ml-2 bg-gray-900 dark:bg-blue-600 text-white px-6 py-2.5 rounded-xl font-medium shadow-lg shadow-gray-900/20 dark:shadow-blue-600/20 hover:bg-gray-800 dark:hover:bg-blue-500 hover:shadow-gray-900/30 hover:-translate-y-0.5 transition-all active:scale-95">
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
