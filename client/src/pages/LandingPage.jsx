import { useNavigate } from 'react-router-dom';
import { Camera, Upload, BarChart3, ArrowRight, Play, Globe, Twitter, Facebook } from 'lucide-react';
import FloatingNavbar from '../components/FloatingNavbar';

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen relative flex flex-col font-sans bg-gray-50 dark:bg-slate-900 overflow-x-hidden text-gray-900 dark:text-white selection:bg-blue-500/30 transition-colors duration-300">

            {/* Background Image with Overlay */}
            <div className="fixed inset-0 z-0">
                <img
                    src="https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?q=80&w=2670&auto=format&fit=crop"
                    alt="City Night"
                    className="w-full h-full object-cover opacity-10 dark:opacity-30 blur-[2px]"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-white/90 to-white dark:from-slate-900/60 dark:via-slate-900/90 dark:to-slate-900"></div>
            </div>

            {/* Navbar */}
            <FloatingNavbar variant="landing" />

            {/* Main Content Area */}
            <main className="relative z-10 flex-grow flex flex-col items-center justify-center px-4 pt-32 pb-16 sm:px-6 lg:px-8">

                {/* Large Glass Container */}
                <div className="w-full max-w-6xl bg-white/40 dark:bg-slate-900/40 backdrop-blur-2xl border border-gray-200 dark:border-white/5 rounded-[40px] p-8 md:p-16 lg:p-20 shadow-2xl flex flex-col items-center text-center">

                    {/* Badge */}
                    <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-blue-600/10 border border-blue-500/20 text-blue-400 text-[10px] sm:text-xs font-bold tracking-widest uppercase mb-8">
                        Citizen Reporting Platform
                    </div>

                    {/* Headline */}
                    <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight mb-8 text-gray-900 dark:text-white leading-[1.1]">
                        Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-500 dark:from-blue-400 dark:to-blue-600">SuMaarg</span>
                    </h1>

                    {/* Subheadline */}
                    <p className="max-w-3xl text-lg sm:text-xl text-gray-600 dark:text-gray-300/90 mb-12 leading-relaxed font-light">
                        Empowering citizens to drive change. Join us in making our roads safer and smoother by reporting maintenance issues directly to the authorities with transparency and ease.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-5 mb-20 w-full justify-center">
                        <button
                            onClick={() => navigate('/register')}
                            className="group px-8 py-4 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-lg shadow-lg shadow-blue-600/20 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                        >
                            Get Started
                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button
                            onClick={() => navigate('/demo')}
                            className="px-8 py-4 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 text-gray-900 dark:text-white font-medium text-lg border border-gray-200 dark:border-white/10 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                        >
                            <div className="w-6 h-6 rounded-full bg-gray-900 dark:bg-white flex items-center justify-center">
                                <Play size={10} className="text-white dark:text-slate-900 fill-current ml-0.5" />
                            </div>
                            Watch Demo
                        </button>
                    </div>

                    {/* Feature Cards Row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">

                        {/* Card 1 */}
                        <div className="text-left p-8 rounded-3xl bg-white/50 dark:bg-slate-800/40 border border-gray-200 dark:border-white/5 hover:bg-white/80 dark:hover:bg-slate-800/60 transition-colors group">
                            <div className="w-12 h-12 rounded-xl bg-blue-600/20 flex items-center justify-center mb-6 text-blue-400 group-hover:scale-110 transition-transform">
                                <Camera size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Snap a Photo</h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                                Capture the road issue quickly using your device's camera.
                            </p>
                        </div>

                        {/* Card 2 */}
                        <div className="text-left p-8 rounded-3xl bg-white/50 dark:bg-slate-800/40 border border-gray-200 dark:border-white/5 hover:bg-white/80 dark:hover:bg-slate-800/60 transition-colors group">
                            <div className="w-12 h-12 rounded-xl bg-blue-600/20 flex items-center justify-center mb-6 text-blue-400 group-hover:scale-110 transition-transform">
                                <Upload size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Upload Details</h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                                Provide location and severity details in just a few clicks.
                            </p>
                        </div>

                        {/* Card 3 */}
                        <div className="text-left p-8 rounded-3xl bg-white/50 dark:bg-slate-800/40 border border-gray-200 dark:border-white/5 hover:bg-white/80 dark:hover:bg-slate-800/60 transition-colors group">
                            <div className="w-12 h-12 rounded-xl bg-blue-600/20 flex items-center justify-center mb-6 text-blue-400 group-hover:scale-110 transition-transform">
                                <BarChart3 size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Track Progress</h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                                Watch in real-time as authorities address your report.
                            </p>
                        </div>

                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="relative z-10 py-8 border-t border-gray-200 dark:border-white/5 mt-auto bg-gray-50/0 dark:bg-slate-900/0 max-w-7xl mx-auto w-full px-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-gray-500 text-xs sm:text-sm order-2 md:order-1">
                        © 2024 SuMaarg. All rights reserved.
                    </p>

                    <div className="flex gap-6 order-1 md:order-2">
                        <a href="#" className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white text-xs sm:text-sm transition-colors">Privacy Policy</a>
                        <a href="#" className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white text-xs sm:text-sm transition-colors">Terms of Service</a>
                        <a href="#" className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white text-xs sm:text-sm transition-colors">Contact Us</a>
                    </div>

                    <div className="flex gap-3 order-3">
                        <a href="#" className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 dark:bg-white/5 dark:hover:bg-white/10 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">
                            <Globe size={16} />
                        </a>
                        <a href="#" className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 dark:bg-white/5 dark:hover:bg-white/10 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">
                            <Twitter size={16} />
                        </a>
                        <a href="#" className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 dark:bg-white/5 dark:hover:bg-white/10 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">
                            <Facebook size={16} />
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
