import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import NotificationDropdown from '../components/NotificationDropdown';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
    Search, Bell, Plus, CheckCircle, AlertCircle, Clock,
    ChevronDown, Filter, MapPin, X, ExternalLink, MoreVertical,
    LayoutDashboard, Map as MapIcon, FileText, Settings, User,
    ArrowRight, ChevronLeft, ChevronRight, List, LogOut
} from 'lucide-react';

const AdminDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [complaints, setComplaints] = useState([]);
    const [filteredComplaints, setFilteredComplaints] = useState([]);
    const [stats, setStats] = useState({ total: 0, new: 0, inProgress: 0, resolved: 0 });
    const [loading, setLoading] = useState(true);

    // Filters
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [priorityFilter, setPriorityFilter] = useState('All');
    const [categoryFilter, setCategoryFilter] = useState('All');

    // Selected Ticket for Side Panel
    const [selectedTicket, setSelectedTicket] = useState(null);

    useEffect(() => {
        fetchComplaints();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [complaints, searchTerm, statusFilter, priorityFilter, categoryFilter]);

    const fetchComplaints = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('/api/complaints/all', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = res.data.map(c => ({
                ...c,
                priority: c.priority || 'Medium', // Default if missing
                ticketId: c._id.substring(c._id.length - 4).toUpperCase()
            }));
            setComplaints(data);
            calculateStats(data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const calculateStats = (data) => {
        setStats({
            total: data.length,
            new: data.filter(c => c.status === 'Active' || c.status === 'New').length,
            inProgress: data.filter(c => c.status === 'In Progress').length,
            resolved: data.filter(c => c.status === 'Resolved').length
        });
    };

    const applyFilters = () => {
        let result = complaints;

        if (searchTerm) {
            const lowerTerm = searchTerm.toLowerCase();
            result = result.filter(c =>
                c.ticketId.toLowerCase().includes(lowerTerm) ||
                c.title.toLowerCase().includes(lowerTerm) ||
                c.description.toLowerCase().includes(lowerTerm) ||
                c.address?.toLowerCase().includes(lowerTerm)
            );
        }

        if (statusFilter !== 'All') {
            const backendStatus = statusFilter === 'New' ? 'Active' : statusFilter;
            result = result.filter(c => c.status === backendStatus);
        }

        if (priorityFilter !== 'All') {
            result = result.filter(c => c.priority === priorityFilter);
        }

        if (categoryFilter !== 'All') {
            result = result.filter(c => c.category === categoryFilter);
        }

        setFilteredComplaints(result);
    };

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            const token = localStorage.getItem('token');
            await axios.patch(`/api/complaints/${id}/status`, { status: newStatus }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Update local state
            const updated = complaints.map(c => c._id === id ? { ...c, status: newStatus } : c);
            setComplaints(updated);
            calculateStats(updated);

            if (selectedTicket && selectedTicket._id === id) {
                setSelectedTicket({ ...selectedTicket, status: newStatus });
            }
        } catch (err) {
            console.error("Failed to update status", err);
            alert(`Failed to update ticket status: ${err.response?.data?.message || err.message}`);
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Resolved': return { bg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500/30' };
            case 'In Progress': return { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30' };
            case 'Active':
            case 'New': return { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/30' };
            default: return { bg: 'bg-slate-700', text: 'text-slate-300', border: 'border-slate-600' };
        }
    };

    const getPriorityStyle = (priority) => {
        switch (priority) {
            case 'High':
            case 'Critical': return { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/30' };
            case 'Medium': return { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/30' };
            case 'Low': return { bg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500/30' };
            default: return { bg: 'bg-slate-700', text: 'text-slate-300', border: 'border-slate-600' };
        }
    };

    const getCategoryIcon = (category) => {
        switch (category) {
            case 'Pothole': return <AlertCircle size={16} className="text-orange-400" />;
            case 'Streetlight': return <div className="p-1 bg-yellow-500/20 rounded-full"><span className="block w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span></div>;
            case 'Drainage': return <div className="text-blue-400">💧</div>;
            default: return <FileText size={16} className="text-slate-400" />;
        }
    }

    if (loading) return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-900 font-sans text-white flex flex-col relative overflow-hidden selection:bg-blue-500/30">

            {/* Background Image with Overlay */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <img
                    src="https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?q=80&w=2670&auto=format&fit=crop"
                    alt="City Lights"
                    className="w-full h-full object-cover opacity-20 blur-[2px]"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-900/95 to-slate-900/90"></div>
            </div>

            {/* TOP NAVIGATION */}
            <header className="relative z-20 px-6 py-5 flex items-center justify-between">
                <div className="flex items-center gap-12">
                    {/* Logo area */}
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
                            <span className="text-white font-bold text-xl">S</span>
                        </div>
                        <div>
                            <h1 className="font-bold text-xl tracking-tight leading-none">SuMaarg</h1>
                            <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mt-0.5">Admin Portal</p>
                        </div>
                    </div>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={logout}
                        className="p-2.5 text-slate-400 hover:text-red-400 hover:bg-white/5 rounded-full transition-all"
                        title="Logout"
                    >
                        <LogOut size={20} />
                    </button>
                    <NotificationDropdown />
                    <div className="bg-slate-800/60 backdrop-blur-md border border-white/10 rounded-full pl-2 pr-4 py-1.5 flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-md">
                            AD
                        </div>
                        <div className="text-right hidden sm:block">
                            <p className="text-xs font-bold text-white leading-none">Admin User</p>
                            <p className="text-[10px] text-slate-400">City Works Dept</p>
                        </div>
                        <ChevronDown size={14} className="text-slate-500" />
                    </div>
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden relative z-10 px-6 pb-6 gap-6">

                {/* MAIN CONTENT */}
                <main className="flex-1 flex flex-col gap-6 overflow-hidden">

                    {/* KPI Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-shrink-0">
                        {/* Total Issues */}
                        <div className="bg-slate-800/40 backdrop-blur-xl border border-white/5 p-5 rounded-2xl relative overflow-hidden group hover:bg-slate-800/60 transition-all">
                            <div className="flex justify-between items-start mb-2">
                                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Total Issues</p>
                                <div className="p-2 bg-slate-700/50 rounded-lg text-slate-400 group-hover:text-white transition-colors">
                                    <List size={18} />
                                </div>
                            </div>
                            <h3 className="text-3xl font-bold text-white mb-1 group-hover:scale-105 transition-transform origin-left">{stats.total.toLocaleString()}</h3>
                            <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
                                <span>+12% this week</span>
                            </div>
                        </div>

                        {/* Pending Review */}
                        <div className="bg-slate-800/40 backdrop-blur-xl border border-white/5 p-5 rounded-2xl relative overflow-hidden group hover:bg-slate-800/60 transition-all">
                            <div className="flex justify-between items-start mb-2">
                                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Pending Review</p>
                                <div className="p-2 bg-yellow-500/10 rounded-lg text-yellow-500">
                                    <AlertCircle size={18} />
                                </div>
                            </div>
                            <h3 className="text-3xl font-bold text-white mb-1 group-hover:scale-105 transition-transform origin-left text-yellow-400">{stats.new}</h3>
                            <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-xs font-bold">
                                <span>Action Required</span>
                            </div>
                        </div>

                        {/* In Progress */}
                        <div className="bg-slate-800/40 backdrop-blur-xl border border-white/5 p-5 rounded-2xl relative overflow-hidden group hover:bg-slate-800/60 transition-all">
                            <div className="flex justify-between items-start mb-2">
                                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">In Progress</p>
                                <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                                    <Clock size={18} />
                                </div>
                            </div>
                            <h3 className="text-3xl font-bold text-white mb-1 group-hover:scale-105 transition-transform origin-left text-blue-400">{stats.inProgress}</h3>
                            <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold">
                                <span>24 Crews Active</span>
                            </div>
                        </div>

                        {/* Resolved */}
                        <div className="bg-slate-800/40 backdrop-blur-xl border border-white/5 p-5 rounded-2xl relative overflow-hidden group hover:bg-slate-800/60 transition-all">
                            <div className="flex justify-between items-start mb-2">
                                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Resolved (YTD)</p>
                                <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
                                    <CheckCircle size={18} />
                                </div>
                            </div>
                            <h3 className="text-3xl font-bold text-white mb-1 group-hover:scale-105 transition-transform origin-left text-emerald-400">{stats.resolved}</h3>
                            <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-700/50 border border-slate-600/50 text-slate-300 text-xs font-bold">
                                <span>92% Satisfaction</span>
                            </div>
                        </div>
                    </div>

                    {/* Table Section */}
                    <div className="flex-1 bg-slate-800/40 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden flex flex-col shadow-2xl shadow-black/20">
                        {/* Table Header / Toolbar */}
                        <div className="px-6 py-5 border-b border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
                            <div>
                                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                    <LayoutDashboard size={20} className="text-blue-500" />
                                    Issue Management
                                </h2>
                                <p className="text-slate-400 text-sm">Manage and track citizen reports in real-time.</p>
                            </div>

                            <div className="flex items-center gap-3 w-full md:w-auto">
                                <div className="relative group flex-1 md:flex-none">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={16} />
                                    <input
                                        type="text"
                                        placeholder="Search by ID, location..."
                                        className="w-full md:w-64 pl-10 pr-4 py-2 bg-slate-900/50 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <div className="relative">
                                    <select
                                        className="appearance-none bg-slate-900/50 pl-4 pr-10 py-2 rounded-xl border border-white/10 text-slate-300 text-sm font-medium focus:outline-none focus:border-blue-500 cursor-pointer hover:bg-slate-800/50 transition-colors"
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                    >
                                        <option value="All">Status: All</option>
                                        <option value="New">New</option>
                                        <option value="In Progress">In Progress</option>
                                        <option value="Resolved">Resolved</option>
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={14} />
                                </div>
                                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-600/20 transition-all flex items-center gap-2">
                                    <Filter size={14} /> More Filters
                                </button>
                            </div>
                        </div>

                        {/* Table Content */}
                        <div className="flex-1 overflow-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="sticky top-0 bg-slate-900/90 backdrop-blur-md z-10">
                                    <tr className="border-b border-white/5">
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Issue ID</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Issue Type</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Location</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Reported</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Priority</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {filteredComplaints.length > 0 ? filteredComplaints.map((c) => (
                                        <tr
                                            key={c._id}
                                            onClick={() => setSelectedTicket(c)}
                                            className={`cursor-pointer transition-all hover:bg-white/5 group ${selectedTicket?._id === c._id ? 'bg-blue-500/10' : ''}`}
                                        >
                                            <td className="px-6 py-4">
                                                <span className="font-mono text-sm font-bold text-blue-400">#{c.ticketId}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    {getCategoryIcon(c.category)}
                                                    <span className="text-sm text-slate-200 font-medium">{c.category || "General"}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-1.5 text-slate-400 group-hover:text-slate-300 transition-colors">
                                                    <span className="text-sm truncate max-w-[150px]">{c.address}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm text-slate-400">{new Date(c.createdAt).toLocaleDateString()}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {(() => {
                                                    const style = getPriorityStyle(c.priority);
                                                    return (
                                                        <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-bold border ${style.bg} ${style.text} ${style.border}`}>
                                                            {c.priority}
                                                        </span>
                                                    );
                                                })()}
                                            </td>
                                            <td className="px-6 py-4">
                                                {(() => {
                                                    const style = getStatusStyle(c.status);
                                                    return (
                                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold border ${style.bg} ${style.text} ${style.border}`}>
                                                            <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5"></span>
                                                            {c.status === 'Active' ? 'Pending' : c.status}
                                                        </span>
                                                    );
                                                })()}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                                                        <ExternalLink size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="7" className="px-6 py-12 text-center text-slate-500">
                                                <div className="flex flex-col items-center justify-center">
                                                    <Filter size={32} className="mb-2 opacity-50" />
                                                    <p>No issues found matching your filters.</p>
                                                    <button onClick={() => { setSearchTerm(''); setStatusFilter('All'); }} className="mt-2 text-blue-400 hover:text-blue-300 text-sm font-medium">Clear Filters</button>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Footer Pagination */}
                        <div className="px-6 py-4 border-t border-white/5 flex items-center justify-between bg-slate-900/50">
                            <p className="text-sm text-slate-500">Showing <span className="font-bold text-white">1</span> to <span className="font-bold text-white">{filteredComplaints.length}</span> of <span className="font-bold text-white">{filteredComplaints.length}</span> results</p>
                            <div className="flex gap-2">
                                <button disabled className="px-3 py-1.5 border border-white/10 rounded-lg text-xs font-medium text-slate-500 disabled:opacity-50 hover:bg-white/5 hover:text-white transition-all flex items-center gap-1">
                                    <ChevronLeft size={14} /> Previous
                                </button>
                                <button disabled className="px-3 py-1.5 border border-white/10 rounded-lg text-xs font-medium text-slate-500 disabled:opacity-50 hover:bg-white/5 hover:text-white transition-all flex items-center gap-1">
                                    Next <ChevronRight size={14} />
                                </button>
                            </div>
                        </div>
                    </div>
                </main>

                {/* RIGHT SIDE PANEL (Ticket Details) */}
                {selectedTicket && (
                    <aside className="w-[380px] flex-shrink-0 bg-slate-800/60 backdrop-blur-xl border border-white/5 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right-10 duration-300">
                        {/* Panel Header */}
                        <div className="px-6 py-5 border-b border-white/5 flex items-start justify-between bg-white/5">
                            <div>
                                <h2 className="text-lg font-bold text-white">Ticket #{selectedTicket.ticketId}</h2>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className={`w-2 h-2 rounded-full ${selectedTicket.priority === 'High' ? 'bg-red-500' : 'bg-yellow-500'}`}></span>
                                    <p className="text-xs font-medium text-slate-300 uppercase tracking-wide">{selectedTicket.category}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedTicket(null)}
                                className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Scrollable Content */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">

                            {/* Actions Block */}
                            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                                <label className="block text-xs font-bold text-blue-300 uppercase tracking-wider mb-2">Update Status</label>
                                <div className="flex gap-2">
                                    <select
                                        value={selectedTicket.status}
                                        onChange={(e) => handleStatusUpdate(selectedTicket._id, e.target.value)}
                                        className="flex-1 bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                                    >
                                        <option value="Active">Pending Review</option>
                                        <option value="In Progress">In Progress</option>
                                        <option value="Resolved">Resolved</option>
                                    </select>
                                    <button className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-2 rounded-lg text-sm font-bold shadow-lg shadow-blue-600/20 transition-all">
                                        Update
                                    </button>
                                </div>
                            </div>

                            {/* Evidence */}
                            <div>
                                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                                    <FileText size={14} /> Evidence
                                </h3>
                                <div className="rounded-xl overflow-hidden border border-white/10 shadow-lg relative group aspect-video bg-slate-900">
                                    <img
                                        src={selectedTicket.imageUrl}
                                        alt="Issue Evidence"
                                        className="w-full h-full object-cover"
                                        onError={(e) => { e.target.src = "https://via.placeholder.com/400x300?text=No+Image" }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                                        <button className="text-xs font-bold text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg backdrop-blur-md border border-white/10 transition-colors">
                                            View Full Size
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Details Grid */}
                            <div>
                                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Details</h3>
                                <div className="space-y-3 bg-white/5 p-4 rounded-xl border border-white/5">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-slate-400">Reported By</span>
                                        <div className="flex items-center gap-2">
                                            <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-[10px] font-bold text-white">
                                                {selectedTicket.user?.name?.charAt(0) || 'U'}
                                            </div>
                                            <span className="text-sm font-medium text-white">{selectedTicket.user?.name || 'Citizen'}</span>
                                        </div>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-slate-400">Date</span>
                                        <span className="text-sm font-medium text-white">{new Date(selectedTicket.createdAt).toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-start">
                                        <span className="text-sm text-slate-400 mt-0.5">Location</span>
                                        <span className="text-sm font-medium text-white text-right max-w-[180px] leading-snug">{selectedTicket.address}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Description</h3>
                                <p className="text-sm text-slate-300 leading-relaxed bg-white/5 p-4 rounded-xl border border-white/5">
                                    {selectedTicket.description}
                                </p>
                            </div>

                        </div>
                    </aside>
                )}

            </div>

            {/* FOOTER */}
            <footer className="relative z-10 py-4 border-t border-white/5 bg-slate-900/50 backdrop-blur-md px-6 flex items-center justify-between text-xs text-slate-500">
                <p>© 2024 SuMaarg Infrastructure Ltd. Admin Portal v2.0</p>
                <div className="flex gap-4">
                    <a href="#" className="hover:text-white transition-colors">System Status</a>
                    <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                    <a href="#" className="hover:text-white transition-colors">Internal Help Desk</a>
                </div>
            </footer>
        </div>
    );
};

export default AdminDashboard;
