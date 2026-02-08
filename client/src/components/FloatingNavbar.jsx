import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Home, UserPlus, Activity, LogIn } from 'lucide-react';

const FloatingNavbar = ({ variant = 'login' }) => {
    const navigate = useNavigate();

    return (
        <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
            <nav className="pointer-events-auto bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-full px-4 py-2 flex items-center justify-between w-full max-w-4xl shadow-2xl shadow-black/30">

                {/* Left Section: Logo & Name - Always to Home */}
                <Link to="/" className="flex items-center gap-3 group pl-2">
                    <div className="bg-blue-600 p-1.5 rounded-full shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform flex items-center justify-center">
                        <Activity size={18} className="text-white" />
                    </div>
                    <span className="text-lg font-bold tracking-tight text-gray-100 group-hover:text-white transition-colors">SuMaarg</span>

                    {/* Vertical Divider */}
                    <div className="h-5 w-px bg-white/10 mx-1"></div>
                </Link>

                {/* Right Section based ONLY on Variant */}
                <div className="flex items-center gap-4 pr-1">

                    {variant === 'landing' ? (
                        <>
                            {/* Landing/Home: Login (Outline) + Signup (Solid) */}
                            <button
                                onClick={() => navigate('/login')}
                                className="hidden sm:flex items-center gap-2 text-gray-300 hover:text-white font-medium px-4 py-2 transition-colors"
                            >
                                Login
                            </button>
                            <button
                                onClick={() => navigate('/register')}
                                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white text-sm font-bold px-5 py-2 rounded-full transition-all shadow-lg shadow-blue-500/25 active:scale-95 hover:shadow-blue-500/40 border border-transparent hover:border-blue-300/30"
                            >
                                <UserPlus size={16} />
                                <span>Signup</span>
                            </button>
                        </>
                    ) : variant === 'login' ? (
                        <>
                            {/* Login Page: Home + Signup */}
                            <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors px-2 group">
                                <Home size={18} className="group-hover:text-blue-400 transition-colors" />
                                <span className="text-sm font-medium hidden sm:inline">Home</span>
                            </Link>

                            <button
                                onClick={() => navigate('/register')}
                                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white text-sm font-bold px-5 py-2 rounded-full transition-all shadow-lg shadow-blue-500/25 active:scale-95 hover:shadow-blue-500/40 border border-transparent hover:border-blue-300/30"
                            >
                                <UserPlus size={16} />
                                <span>Signup</span>
                            </button>
                        </>
                    ) : (
                        <>
                            {/* Register Page: Login Button */}
                            <span className="text-sm text-gray-400 font-medium hidden sm:inline">Already have an account?</span>
                            <button
                                onClick={() => navigate('/login')}
                                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white text-sm font-bold px-5 py-2 rounded-full transition-all border border-white/10 hover:border-white/30 active:scale-95"
                            >
                                <LogIn size={16} />
                                <span>Login</span>
                            </button>
                        </>
                    )}
                </div>

            </nav>
        </div>
    );
};

export default FloatingNavbar;
