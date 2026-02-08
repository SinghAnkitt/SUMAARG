import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate, Link } from 'react-router-dom';
import MapMain from '../components/MapMain';
import NotificationDropdown from '../components/NotificationDropdown';
import {
    Bell,
    ChevronDown,
    FileText,
    Clock,
    CheckCircle,
    BarChart2,
    Megaphone,
    AlertTriangle,
    Lightbulb,
    Droplet,
    Trash2,
    MapPin,
    ArrowRight,
    LogOut,
    User,
    Lock,
    Settings,
    Sun,
    Moon
} from 'lucide-react';

const UserDashboard = () => {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All Issues');
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    useEffect(() => {
        const fetchComplaints = async () => {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${user.token}`
                    }
                };
                const res = await axios.get('/api/complaints/user', config);
                setComplaints(res.data);
            } catch (error) {
                console.error("Error fetching complaints", error);
            } finally {
                setLoading(false);
            }
        };

        if (user) fetchComplaints();
    }, [user]);

    const stats = {
        total: complaints.length,
        inProgress: complaints.filter(c => c.status === 'In Progress').length,
        resolved: complaints.filter(c => c.status === 'Resolved').length,
        rank: 15 // Static for now as per requirement
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Resolved': return 'bg-green-500/20 text-green-400 border border-green-500/30';
            case 'In Progress': return 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30';
            case 'Active': return 'bg-red-500/20 text-red-400 border border-red-500/30';
            default: return 'bg-gray-500/20 text-gray-400 border border-gray-500/30';
        }
    };

    // Filter complaints for map if needed, though map handles its own rendering
    const mapComplaints = filter === 'All Issues'
        ? complaints
        : complaints.filter(c => c.status === filter);

    if (loading) return <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white font-sans selection:bg-blue-500/30 selection:text-blue-200 overflow-x-hidden transition-colors duration-300">
            {/* Top Navigation (Glassmorphic Pill) */}
            <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4">
                <nav className="bg-white/80 dark:bg-slate-800/60 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-full px-6 py-3 flex items-center justify-between w-full max-w-6xl shadow-2xl shadow-black/5 dark:shadow-black/20">
                    <div className="flex items-center gap-8">
                        {/* Logo */}
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
                                <span className="font-bold text-white text-xl">S</span>
                            </div>
                            <span className="font-bold text-xl tracking-tight text-gray-900 dark:text-white">SuMaarg</span>
                        </div>

                        {/* Nav Links */}
                        <div className="hidden md:flex items-center gap-1 bg-gray-100 dark:bg-white/5 rounded-full p-1 border border-gray-200 dark:border-white/5">
                            <button className="px-5 py-2 rounded-full bg-blue-600 text-white text-sm font-medium shadow-lg shadow-blue-600/20 transition-all">
                                Dashboard
                            </button>
                            <Link to="/my-issues" className="px-5 py-2 rounded-full text-gray-600 hover:text-gray-900 dark:text-slate-300 dark:hover:text-white hover:bg-white dark:hover:bg-white/5 text-sm font-medium transition-all">
                                My Reports
                            </Link>
                        </div>
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-4">

                        <button
                            onClick={toggleTheme}
                            className="p-2.5 rounded-full text-gray-600 hover:text-gray-900 dark:text-slate-300 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                            aria-label="Toggle Dark Mode"
                        >
                            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                        </button>

                        <NotificationDropdown />

                        <div className="relative">
                            <div
                                className="flex items-center gap-3 pl-4 border-l border-gray-200 dark:border-white/10 cursor-pointer"
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                            >
                                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center text-white text-sm font-bold shadow-inner">
                                    {user.name.charAt(0)}
                                </div>
                                <div className="hidden sm:flex items-center gap-2 group">
                                    <span className="text-sm font-medium text-gray-700 dark:text-slate-200 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">{user.name}</span>
                                    <ChevronDown size={14} className={`text-gray-400 dark:text-slate-400 group-hover:text-gray-600 dark:group-hover:text-white transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
                                </div>
                            </div>

                            {/* Dropdown Menu */}
                            {isProfileOpen && (
                                <div className="absolute right-0 top-12 w-56 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-white/10 shadow-xl overflow-hidden py-1 z-50 animate-in fade-in zoom-in-95 duration-200">
                                    <div className="px-4 py-3 border-b border-gray-100 dark:border-white/5">
                                        <p className="text-sm text-gray-900 dark:text-white font-semibold truncate">{user.name}</p>
                                        <p className="text-xs text-gray-500 dark:text-slate-400 truncate">{user.email}</p>
                                    </div>
                                    <Link
                                        to="/user-profile"
                                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                                        onClick={() => setIsProfileOpen(false)}
                                    >
                                        <User size={16} />
                                        <span>My Profile</span>
                                    </Link>
                                    <Link
                                        to="/user-profile"
                                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                                        onClick={() => setIsProfileOpen(false)}
                                    >
                                        <Lock size={16} />
                                        <span>Change Password</span>
                                    </Link>
                                    <div className="border-t border-gray-100 dark:border-white/5 my-1"></div>
                                    <button
                                        onClick={logout}
                                        className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                                    >
                                        <LogOut size={16} />
                                        <span>Sign Out</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </nav>
            </div>

            {/* Main Content */}
            <div className="pt-32 pb-20 px-4 max-w-7xl mx-auto space-y-8">

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white/60 dark:bg-slate-800/40 backdrop-blur-md border border-gray-200 dark:border-white/5 p-6 rounded-3xl relative overflow-hidden group hover:border-blue-500/30 transition-all duration-300 shadow-sm dark:shadow-none">
                        <div className="absolute top-0 right-0 p-8 bg-blue-500/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-blue-500/20 transition-all"></div>
                        <div className="flex items-center gap-4 mb-2">
                            <div className="p-3 bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-2xl">
                                <FileText size={20} />
                            </div>
                            <span className="text-gray-500 dark:text-slate-400 text-sm font-medium">Total Reports</span>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 dark:text-white ml-1">{stats.total}</h3>
                    </div>

                    <div className="bg-white/60 dark:bg-slate-800/40 backdrop-blur-md border border-gray-200 dark:border-white/5 p-6 rounded-3xl relative overflow-hidden group hover:border-yellow-500/30 transition-all duration-300 shadow-sm dark:shadow-none">
                        <div className="absolute top-0 right-0 p-8 bg-yellow-500/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-yellow-500/20 transition-all"></div>
                        <div className="flex items-center gap-4 mb-2">
                            <div className="p-3 bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 rounded-2xl">
                                <Clock size={20} />
                            </div>
                            <span className="text-gray-500 dark:text-slate-400 text-sm font-medium">In Progress</span>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 dark:text-white ml-1">{stats.inProgress}</h3>
                    </div>

                    <div className="bg-white/60 dark:bg-slate-800/40 backdrop-blur-md border border-gray-200 dark:border-white/5 p-6 rounded-3xl relative overflow-hidden group hover:border-green-500/30 transition-all duration-300 shadow-sm dark:shadow-none">
                        <div className="absolute top-0 right-0 p-8 bg-green-500/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-green-500/20 transition-all"></div>
                        <div className="flex items-center gap-4 mb-2">
                            <div className="p-3 bg-green-500/20 text-green-600 dark:text-green-400 rounded-2xl">
                                <CheckCircle size={20} />
                            </div>
                            <span className="text-gray-500 dark:text-slate-400 text-sm font-medium">Resolved</span>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 dark:text-white ml-1">{stats.resolved}</h3>
                    </div>

                    <div className="bg-white/60 dark:bg-slate-800/40 backdrop-blur-md border border-gray-200 dark:border-white/5 p-6 rounded-3xl relative overflow-hidden group hover:border-purple-500/30 transition-all duration-300 shadow-sm dark:shadow-none">
                        <div className="absolute top-0 right-0 p-8 bg-purple-500/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-purple-500/20 transition-all"></div>
                        <div className="flex items-center gap-4 mb-2">
                            <div className="p-3 bg-purple-500/20 text-purple-600 dark:text-purple-400 rounded-2xl">
                                <BarChart2 size={20} />
                            </div>
                            <span className="text-gray-500 dark:text-slate-400 text-sm font-medium">Rank</span>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 dark:text-white ml-1">#{stats.rank}</h3>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:min-h-[600px]">

                    {/* Left Panel: Live Map */}
                    <div className="lg:col-span-2 bg-white/60 dark:bg-slate-800/40 backdrop-blur-md border border-gray-200 dark:border-white/5 rounded-[2rem] p-1.5 relative h-[500px] lg:h-full flex flex-col overflow-hidden group shadow-sm dark:shadow-none">
                        {/* Map Header Pills */}
                        <div className="absolute top-6 left-6 z-[401] flex gap-3">

                            <div className="px-3 py-1.5 bg-white/90 dark:bg-slate-900/80 backdrop-blur border border-gray-200 dark:border-white/10 rounded-full text-xs font-medium text-gray-700 dark:text-slate-300 shadow-lg">
                                Filter: {filter}
                            </div>
                        </div>

                        {/* Map Container */}
                        <div className="w-full h-full rounded-[1.7rem] overflow-hidden relative">
                            {/* Overlay Grid Effect */}
                            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none z-10"></div>

                            <MapMain complaints={mapComplaints} />
                        </div>
                    </div>

                    {/* Right Panel: Actions & Activity */}
                    <div className="flex flex-col gap-6 lg:h-full">

                        {/* Quick Report Section */}
                        <div className="bg-white/60 dark:bg-slate-800/40 backdrop-blur-md border border-gray-200 dark:border-white/5 p-6 rounded-3xl shrink-0 shadow-sm dark:shadow-none">
                            <div className="flex items-center gap-3 mb-6">
                                <Megaphone className="text-blue-600 dark:text-blue-400" size={20} />
                                <h3 className="font-bold text-lg text-gray-900 dark:text-white">Quick Report</h3>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <button onClick={() => navigate('/report-issue')} className="flex flex-col items-center justify-center p-4 bg-gray-50 hover:bg-white dark:bg-slate-900/50 dark:hover:bg-slate-800 border border-gray-200 hover:border-gray-300 dark:border-white/5 dark:hover:border-white/10 rounded-2xl transition-all group">
                                    <div className="p-3 rounded-full bg-white dark:bg-slate-800 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:bg-blue-50 dark:group-hover:bg-blue-500/10 transition-all mb-2">
                                        <AlertTriangle size={20} />
                                    </div>
                                    <span className="text-xs font-medium text-gray-600 dark:text-slate-300">Pothole</span>
                                </button>
                                <button onClick={() => navigate('/report-issue')} className="flex flex-col items-center justify-center p-4 bg-gray-50 hover:bg-white dark:bg-slate-900/50 dark:hover:bg-slate-800 border border-gray-200 hover:border-gray-300 dark:border-white/5 dark:hover:border-white/10 rounded-2xl transition-all group">
                                    <div className="p-3 rounded-full bg-white dark:bg-slate-800 text-slate-400 group-hover:text-yellow-600 dark:group-hover:text-yellow-400 group-hover:bg-yellow-50 dark:group-hover:bg-yellow-500/10 transition-all mb-2">
                                        <Lightbulb size={20} />
                                    </div>
                                    <span className="text-xs font-medium text-gray-600 dark:text-slate-300">Street Light</span>
                                </button>
                                <button onClick={() => navigate('/report-issue')} className="flex flex-col items-center justify-center p-4 bg-gray-50 hover:bg-white dark:bg-slate-900/50 dark:hover:bg-slate-800 border border-gray-200 hover:border-gray-300 dark:border-white/5 dark:hover:border-white/10 rounded-2xl transition-all group">
                                    <div className="p-3 rounded-full bg-white dark:bg-slate-800 text-slate-400 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 group-hover:bg-cyan-50 dark:group-hover:bg-cyan-500/10 transition-all mb-2">
                                        <Droplet size={20} />
                                    </div>
                                    <span className="text-xs font-medium text-gray-600 dark:text-slate-300">Drainage</span>
                                </button>
                                <button onClick={() => navigate('/report-issue')} className="flex flex-col items-center justify-center p-4 bg-gray-50 hover:bg-white dark:bg-slate-900/50 dark:hover:bg-slate-800 border border-gray-200 hover:border-gray-300 dark:border-white/5 dark:hover:border-white/10 rounded-2xl transition-all group">
                                    <div className="p-3 rounded-full bg-white dark:bg-slate-800 text-slate-400 group-hover:text-red-600 dark:group-hover:text-red-400 group-hover:bg-red-50 dark:group-hover:bg-red-500/10 transition-all mb-2">
                                        <Trash2 size={20} />
                                    </div>
                                    <span className="text-xs font-medium text-gray-600 dark:text-slate-300">Garbage</span>
                                </button>
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="bg-white/60 dark:bg-slate-800/40 backdrop-blur-md border border-gray-200 dark:border-white/5 p-6 rounded-3xl flex-1 flex flex-col overflow-hidden shadow-sm dark:shadow-none min-h-0 max-h-[400px]">
                            <div className="flex items-center justify-between mb-6 shrink-0">
                                <h3 className="font-bold text-lg text-gray-900 dark:text-white">Local Reports</h3>
                                <Link to="/my-issues" className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300">View All</Link>
                            </div>

                            <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar space-y-4 pr-2">
                                {complaints.length > 0 ? (
                                    complaints.map((c) => (
                                        <Link 
                                            key={c._id} 
                                            to={`/issue/${c._id}`}
                                            className="flex items-start gap-4 p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 transition-colors border border-transparent hover:border-gray-200 dark:hover:border-white/5 cursor-pointer"
                                        >
                                            <div className={`p-2.5 rounded-full ${c.status === 'Resolved' ? 'bg-green-100 dark:bg-green-500/10 text-green-600 dark:text-green-400' : 'bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400'}`}>
                                                <AlertTriangle size={16} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-start mb-0.5">
                                                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white truncate pr-2">{c.title}</h4>
                                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${getStatusStyle(c.status)}`}>
                                                        {c.status}
                                                    </span>
                                                </div>
                                                <div className="flex items-center text-gray-500 dark:text-slate-400 text-xs gap-3">
                                                    <span className="flex items-center gap-1 truncate max-w-[120px]">
                                                        <MapPin size={12} /> {c.address || 'Unknown'}
                                                    </span>
                                                    <span className="w-1 h-1 rounded-full bg-gray-400 dark:bg-slate-600"></span>
                                                    <span>{new Date(c.createdAt).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        </Link>
                                    ))
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full text-center py-8">
                                        <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center mb-3">
                                            <FileText className="text-gray-400 dark:text-slate-500" size={24} />
                                        </div>
                                        <p className="text-sm text-gray-500 dark:text-slate-400">No reports yet</p>
                                        <button 
                                            onClick={() => navigate('/report-issue')}
                                            className="mt-3 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 font-medium"
                                        >
                                            Create your first report
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="border-t border-gray-200 dark:border-white/5 bg-gray-100/50 dark:bg-black/20 backdrop-blur-md mt-12">
                <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-gray-500 dark:text-slate-500 text-sm">© 2024 SuMaarg. Empowering citizens for better roads.</p>
                    <div className="flex gap-6 text-sm text-gray-500 dark:text-slate-400">
                        <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Help Center</a>
                        <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Privacy</a>
                        <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Terms</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default UserDashboard;
