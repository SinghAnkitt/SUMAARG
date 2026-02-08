import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import FloatingNavbar from '../components/FloatingNavbar';
import { Mail, Lock, LogIn, Globe, Twitter, Facebook } from 'lucide-react';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const { login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await login(formData.email, formData.password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen relative flex flex-col font-sans bg-gray-50 dark:bg-slate-900 overflow-hidden text-gray-900 dark:text-white transition-colors duration-300">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
                <img
                    src="https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?q=80&w=2670&auto=format&fit=crop"
                    alt="City Night"
                    className="w-full h-full object-cover opacity-10 dark:opacity-40 blur-[3px]"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-white/90 to-white dark:from-slate-900/60 dark:via-slate-900/90 dark:to-slate-900"></div>
            </div>

            {/* Navbar */}
            <FloatingNavbar variant="login" />

            {/* Main Content - Centered */}
            <div className="flex-grow flex items-center justify-center relative z-10 px-4 pt-24 pb-8">
                {/* Login Card */}
                <div className="w-full max-w-md backdrop-blur-2xl bg-white/60 dark:bg-slate-900/60 border border-gray-200 dark:border-white/10 rounded-3xl shadow-2xl p-8 sm:p-10 transition-colors">

                    {/* Header */}
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                            Welcome Back
                        </h2>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            Please sign in to your SuMaarg account
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-200 px-4 py-3 rounded-xl text-sm flex items-center gap-2" role="alert">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                            {error}
                        </div>
                    )}

                    <form className="space-y-6" onSubmit={handleSubmit}>

                        {/* Email Address */}
                        <div className="space-y-1.5">
                            <label htmlFor="email" className="block text-xs font-bold text-gray-700 dark:text-gray-300 ml-1">
                                Email Address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="block w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm font-medium placeholder:text-gray-400"
                                    placeholder="name@example.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="space-y-1.5">
                            <label htmlFor="password" className="block text-xs font-bold text-gray-700 dark:text-gray-300 ml-1">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    className="block w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm font-medium placeholder:text-gray-400 tracking-widest"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Options Row */}
                        <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-slate-800"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-gray-600 dark:text-gray-400">
                                    Remember me
                                </label>
                            </div>
                            <div className="text-sm">
                                <a href="#" className="font-semibold text-blue-400 hover:text-blue-300 transition-colors">
                                    Forgot Password?
                                </a>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-3.5 px-4 rounded-full text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-blue-500 font-bold text-sm shadow-lg shadow-blue-600/30 transition-all hover:translate-y-[-1px] active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                            ) : (
                                <>
                                    <span className="flex items-center gap-2">
                                        <LogIn className="w-5 h-5" />
                                        Login
                                    </span>
                                </>
                            )}
                        </button>

                        {/* Signup Link */}
                        <div className="text-center mt-4">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Don't have an account?{' '}
                                <button
                                    type="button"
                                    onClick={() => navigate('/register')}
                                    className="font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                >
                                    Sign up
                                </button>
                            </p>
                        </div>

                    </form>
                </div>
            </div>

            {/* Footer */}
            <footer className="relative z-10 w-full py-6 mt-8 border-t border-gray-200 dark:border-white/5 bg-gray-50/50 dark:bg-slate-900/50 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-gray-500 text-xs sm:text-sm order-2 md:order-1">
                        © 2024 SuMaarg. All rights reserved.
                    </p>

                    <div className="flex gap-6 order-1 md:order-2">
                        <a href="#" className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white text-xs sm:text-sm transition-colors">Privacy Policy</a>
                        <a href="#" className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white text-xs sm:text-sm transition-colors">Terms of Service</a>
                        <a href="#" className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white text-xs sm:text-sm transition-colors">Contact Us</a>
                    </div>

                    <div className="flex gap-3 order-3">
                        <a href="#" className="p-1.5 rounded-full bg-gray-200 hover:bg-gray-300 dark:bg-white/5 dark:hover:bg-white/10 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">
                            <Globe size={14} />
                        </a>
                        <a href="#" className="p-1.5 rounded-full bg-gray-200 hover:bg-gray-300 dark:bg-white/5 dark:hover:bg-white/10 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">
                            <Twitter size={14} />
                        </a>
                        <a href="#" className="p-1.5 rounded-full bg-gray-200 hover:bg-gray-300 dark:bg-white/5 dark:hover:bg-white/10 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">
                            <Facebook size={14} />
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Login;
