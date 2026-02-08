import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Search,
    Filter,
    MapPin,
    Calendar,
    ChevronRight,
    Bell,
    Plus,
    FileText,
    Clock,
    CheckCircle,
    MessageSquare,
    ThumbsUp,
    ArrowRight
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import NotificationDropdown from '../components/NotificationDropdown';

const MyIssues = () => {
    const { user, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('All');

    // Protect Route
    if (!authLoading && !user) {
        navigate('/login');
    }
    if (!authLoading && !user) return null;

    useEffect(() => {
        const fetchIssues = async () => {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${user?.token}`,
                    },
                };
                const { data } = await axios.get('/api/complaints/user', config);
                setIssues(data);
            } catch (error) {
                console.error("Error fetching issues:", error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchIssues();
        }
    }, [user]);

    // KPI Calculations
    const totalReports = issues.length;
    const pendingAction = issues.filter(i => i.status === 'Active' || i.status === 'In Progress').length;
    const resolved = issues.filter(i => i.status === 'Resolved').length;

    // Filter Logic
    const filteredIssues = issues.filter(issue => {
        if (filterStatus === 'All') return true;
        // Map UI filter terms to Backend status
        if (filterStatus === 'Pending') return issue.status === 'Active';
        if (filterStatus === 'In Progress') return issue.status === 'In Progress';
        if (filterStatus === 'Resolved') return issue.status === 'Resolved';
        return true;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'Resolved': return 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30';
            case 'In Progress': return 'bg-blue-500/20 text-blue-400 border border-blue-500/30';
            case 'Active': return 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'; // Pending Review
            case 'Rejected': return 'bg-red-500/20 text-red-400 border border-red-500/30';
            default: return 'bg-slate-700 text-slate-300';
        }
    };

    const getStatusText = (status) => {
        if (status === 'Active') return 'Pending Review';
        return status;
    };

    return (
        <div className="min-h-screen relative flex flex-col font-sans bg-slate-900 text-white overflow-x-hidden selection:bg-blue-500/30">

            {/* Background Image with Overlay */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <img
                    src="https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=2613&auto=format&fit=crop"
                    alt="City Lights"
                    className="w-full h-full object-cover opacity-30 blur-[4px]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/90 to-slate-900/60"></div>
            </div>

            {/* Top Navigation (Floating Pill) */}
            <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4">
                <nav className="bg-slate-800/60 backdrop-blur-xl border border-white/10 rounded-full px-6 py-3 flex items-center justify-between w-full max-w-5xl shadow-2xl shadow-black/20">
                    <div className="flex items-center gap-8">
                        {/* Logo */}
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
                                <span className="font-bold text-white text-lg">S</span>
                            </div>
                            <span className="font-bold text-lg tracking-tight text-white hidden sm:block">SuMaarg</span>
                        </div>

                        {/* Nav Links */}
                        <div className="hidden md:flex items-center gap-1 bg-white/5 rounded-full p-1 border border-white/5">
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="px-5 py-2 rounded-full text-slate-300 hover:text-white hover:bg-white/5 text-sm font-medium transition-all"
                            >
                                Dashboard
                            </button>
                            <button className="px-5 py-2 rounded-full bg-white/10 text-white text-sm font-medium shadow-inner border border-white/5">
                                My Reports
                            </button>

                        </div>
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-4">
                        <NotificationDropdown />

                        <button
                            onClick={() => navigate('/report-issue')}
                            className="hidden sm:flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-full text-sm font-bold shadow-lg shadow-blue-600/20 transition-all hover:scale-105 active:scale-95"
                        >
                            <Plus size={16} /> New Report
                        </button>

                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold shadow-inner border border-white/10 cursor-pointer">
                            {user?.name ? user.name.substring(0, 2).toUpperCase() : 'US'}
                        </div>
                    </div>
                </nav>
            </div>

            {/* Main Content Area */}
            <main className="relative z-10 flex-grow px-4 pt-32 pb-16 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">

                {/* Page Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div>
                        <h1 className="text-4xl font-extrabold text-white tracking-tight mb-3">My Reported Issues</h1>
                        <p className="text-slate-400 text-lg max-w-2xl">View and track the status of infrastructure issues you’ve reported. Your contributions help make our city better.</p>
                    </div>

                    {/* Filter Pills */}
                    <div className="flex items-center gap-2 p-1 bg-slate-800/50 backdrop-blur-md rounded-full border border-white/10 overflow-x-auto max-w-full">
                        {['All', 'Pending', 'In Progress', 'Resolved'].map((status) => (
                            <button
                                key={status}
                                onClick={() => setFilterStatus(status)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${filterStatus === status
                                    ? 'bg-slate-700 text-white shadow-lg'
                                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                {status === 'All' ? 'All Issues' : status}
                            </button>
                        ))}
                    </div>
                </div>

                {/* KPI Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="bg-slate-800/40 backdrop-blur-xl border border-white/5 rounded-3xl p-6 flex items-center gap-5 relative overflow-hidden group hover:bg-slate-800/60 transition-colors">
                        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-colors"></div>
                        <div className="w-14 h-14 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                            <FileText size={24} />
                        </div>
                        <div>
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Total Reports</p>
                            <p className="text-3xl font-extrabold text-white">{totalReports}</p>
                        </div>
                    </div>

                    <div className="bg-slate-800/40 backdrop-blur-xl border border-white/5 rounded-3xl p-6 flex items-center gap-5 relative overflow-hidden group hover:bg-slate-800/60 transition-colors">
                        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-yellow-500/10 rounded-full blur-2xl group-hover:bg-yellow-500/20 transition-colors"></div>
                        <div className="w-14 h-14 rounded-2xl bg-yellow-500/20 flex items-center justify-center text-yellow-400 group-hover:scale-110 transition-transform">
                            <Clock size={24} />
                        </div>
                        <div>
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Pending Action</p>
                            <p className="text-3xl font-extrabold text-white">{pendingAction}</p>
                        </div>
                    </div>

                    <div className="bg-slate-800/40 backdrop-blur-xl border border-white/5 rounded-3xl p-6 flex items-center gap-5 relative overflow-hidden group hover:bg-slate-800/60 transition-colors">
                        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-colors"></div>
                        <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                            <CheckCircle size={24} />
                        </div>
                        <div>
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Resolved</p>
                            <p className="text-3xl font-extrabold text-white">{resolved}</p>
                        </div>
                    </div>
                </div>

                {/* Reports Grid */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredIssues.map((issue) => (
                            <div key={issue._id} className="bg-slate-800/40 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-black/20 hover:border-white/10 hover:-translate-y-1 transition-all duration-300 group flex flex-col">
                                {/* Card Header */}
                                <div className="p-6 pb-4 border-b border-white/5 relative">
                                    <div className="flex justify-between items-start mb-4">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${getStatusColor(issue.status)}`}>
                                            {getStatusText(issue.status)}
                                        </span>
                                        <span className={`text-[10px] font-medium text-slate-500 bg-slate-900/50 px-2 py-1 rounded-md border border-white/5`}>
                                            #{issue._id.slice(-6).toUpperCase()}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2 leading-tight group-hover:text-blue-400 transition-colors line-clamp-2">
                                        {issue.title}
                                    </h3>
                                    <div className="flex items-center text-slate-400 text-xs gap-3">
                                        <div className="flex items-center gap-1">
                                            <Calendar size={12} />
                                            {new Date(issue.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>

                                {/* Card Body */}
                                <div className="p-6 pt-4 flex-grow flex flex-col">
                                    <div className="flex items-start gap-2 mb-4">
                                        <MapPin size={14} className="text-slate-500 mt-0.5 flex-shrink-0" />
                                        <p className="text-sm text-slate-400 line-clamp-1">{issue.address || "Location not provided"}</p>
                                    </div>
                                    <p className="text-sm text-slate-500 mb-6 line-clamp-2">
                                        {issue.description}
                                    </p>

                                    {/* Footer / Engagement (Visual Only for now) */}
                                    <div className="mt-auto flex items-center justify-between pt-4 border-t border-white/5">
                                        <div className="flex gap-4">
                                            <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                                                <ThumbsUp size={14} className="text-slate-600" />
                                                <span>0</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                                                <MessageSquare size={14} className="text-slate-600" />
                                                <span>0</span>
                                            </div>
                                        </div>

                                        <Link
                                            to={`/issue/${issue._id}`}
                                            className="flex items-center gap-1 text-sm font-bold text-slate-300 hover:text-white transition-colors group/link"
                                        >
                                            Details
                                            <ArrowRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Add New Report Card */}
                        {filterStatus === 'All' && (
                            <button
                                onClick={() => navigate('/report-issue')}
                                className="min-h-[300px] border-2 border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center p-8 hover:bg-slate-800/30 hover:border-blue-500/30 transition-all group text-center"
                            >
                                <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-blue-600 transition-all shadow-lg">
                                    <Plus size={32} className="text-slate-400 group-hover:text-white transition-colors" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">Report New Issue</h3>
                                <p className="text-slate-400 text-sm max-w-[200px]">Found something that needs attention? Submit a new report.</p>
                            </button>
                        )}
                    </div>
                )}

                {/* Empty State */}
                {!loading && filteredIssues.length === 0 && filterStatus !== 'All' && (
                    <div className="text-center py-20 bg-slate-800/20 rounded-3xl border border-dashed border-white/5">
                        <Filter className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-white mb-1">No reports found</h3>
                        <p className="text-slate-500 max-w-sm mx-auto">None of your reports match the current filter status.</p>
                    </div>
                )}

            </main>

            {/* Footer */}
            <footer className="relative z-10 py-8 border-t border-white/5 mt-auto bg-slate-900/0 max-w-7xl mx-auto w-full px-6 text-center md:text-left">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-slate-500 text-sm">
                        © 2024 SuMaarg. All rights reserved.
                    </p>

                    <div className="flex gap-6">
                        <a href="#" className="text-slate-500 hover:text-white text-sm transition-colors">Privacy Policy</a>
                        <a href="#" className="text-slate-500 hover:text-white text-sm transition-colors">Terms of Service</a>
                        <a href="#" className="text-slate-500 hover:text-white text-sm transition-colors">Contact Us</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default MyIssues;
