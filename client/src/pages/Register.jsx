import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import FloatingNavbar from '../components/FloatingNavbar';
import { User, Mail, Lock, UserPlus } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const { register } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(formData.name, formData.email, formData.password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 overflow-hidden font-sans bg-slate-900">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
                <img
                    src="https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=2613&auto=format&fit=crop"
                    alt="City Background"
                    className="w-full h-full object-cover opacity-30 blur-sm scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-slate-900/40 via-slate-900/90 to-slate-900"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(30,58,138,0.2)_0%,rgba(15,23,42,0.9)_100%)]"></div>
            </div>

            {/* Navbar - Register Variant */}
            <FloatingNavbar variant="register" />

            {/* Glass Container - Increased top margin to avoid nav overlap (mt-20) */}
            <div className="max-w-md w-full space-y-6 relative z-10 backdrop-blur-2xl bg-slate-900/40 border border-white/10 rounded-3xl shadow-2xl p-8 sm:p-10 mt-16 sm:mt-20">

                {/* Header - Compacted */}
                <div className="text-center">
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
                        Create Account
                    </h2>
                    <p className="mt-2 text-xs sm:text-sm text-gray-300">
                        Join the SuMaarg community to report issues.
                    </p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-200 px-4 py-2 rounded-xl text-xs flex items-center gap-2" role="alert">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                        {error}
                    </div>
                )}

                <form className="mt-4 space-y-4" onSubmit={handleSubmit}>

                    {/* Full Name */}
                    <div className="group">
                        <label htmlFor="name" className="block text-[10px] font-bold text-gray-400 mb-1 ml-1 uppercase tracking-wider">Full Name</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <User className="h-4 w-4 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
                            </div>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                required
                                className="block w-full pl-10 pr-4 py-3 border border-white/10 bg-white/5 placeholder-gray-500 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 focus:bg-white/10 transition-all duration-200 text-sm font-medium backdrop-blur-sm"
                                placeholder="John Doe"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Email Address */}
                    <div className="group">
                        <label htmlFor="email-address" className="block text-[10px] font-bold text-gray-400 mb-1 ml-1 uppercase tracking-wider">Email Address</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Mail className="h-4 w-4 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
                            </div>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="block w-full pl-10 pr-4 py-3 border border-white/10 bg-white/5 placeholder-gray-500 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 focus:bg-white/10 transition-all duration-200 text-sm font-medium backdrop-blur-sm"
                                placeholder="john@example.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div className="group">
                        <label htmlFor="password" className="block text-[10px] font-bold text-gray-400 mb-1 ml-1 uppercase tracking-wider">Password</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Lock className="h-4 w-4 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
                            </div>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="new-password"
                                required
                                className="block w-full pl-10 pr-4 py-3 border border-white/10 bg-white/5 placeholder-gray-500 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 focus:bg-white/10 transition-all duration-200 text-sm font-medium backdrop-blur-sm"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Terms Checkbox */}
                    <div className="flex items-center">
                        <input
                            id="terms"
                            name="terms"
                            type="checkbox"
                            required
                            className="h-3 w-3 text-blue-600 focus:ring-blue-500 border-gray-600 rounded bg-white/10"
                        />
                        <label htmlFor="terms" className="ml-2 block text-xs text-gray-400">
                            I agree to the <a href="#" className="text-blue-400 hover:text-blue-300">Terms</a> & <a href="#" className="text-blue-400 hover:text-blue-300">Privacy Policy</a>
                        </label>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-full text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-blue-500 transition-all duration-200 shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 hover:-translate-y-0.5"
                    >
                        <UserPlus className="w-4 h-4 mr-2" />
                        Create Account
                    </button>
                </form>

                {/* Social Signup - Compacted */}
                <div className="mt-4">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/10"></div>
                        </div>
                        <div className="relative flex justify-center text-xs">
                            <span className="px-2 bg-transparent text-gray-500">Or sign up with</span>
                        </div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3">
                        <button className="flex items-center justify-center px-4 py-2 border border-white/10 rounded-xl shadow-sm bg-white/5 text-xs font-medium text-white hover:bg-white/10 transition-all hover:scale-[1.02]">
                            Google
                        </button>
                        <button className="flex items-center justify-center px-4 py-2 border border-white/10 rounded-xl shadow-sm bg-white/5 text-xs font-medium text-white hover:bg-white/10 transition-all hover:scale-[1.02]">
                            Facebook
                        </button>
                    </div>
                </div>

                <div className="text-center pt-2">
                    <p className="text-gray-500 text-[10px]">
                        &copy; 2024 SuMaarg. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
