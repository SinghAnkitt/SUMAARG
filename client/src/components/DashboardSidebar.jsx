import React from 'react';
import { PlusCircle, Activity, CheckCircle, AlertCircle, FileText } from 'lucide-react';

const DashboardSidebar = ({ stats, complaints, filter, setFilter, onReportClick }) => {
    return (
        <div className="w-96 bg-white h-full border-r border-gray-200 flex flex-col flex-shrink-0 z-20 shadow-xl overflow-y-auto">
            {/* Header / Logo */}
            <div className="p-6 border-b border-gray-100 flex items-center space-x-3 bg-gradient-to-r from-blue-50 to-white">
                <div className="bg-blue-600 p-2 rounded-lg shadow-lg">
                    <Activity className="h-6 w-6 text-white" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Su-Maarg</h1>
                    <p className="text-xs text-blue-600 font-medium tracking-wide uppercase">Road Safety Network</p>
                </div>
            </div>

            {/* Primary Action */}
            <div className="p-6">
                <button
                    onClick={onReportClick}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-blue-500/30 transform transition-all duration-200 hover:-translate-y-0.5 active:scale-95 flex items-center justify-center group"
                >
                    <PlusCircle className="mr-2 h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
                    Report New Issue
                </button>
            </div>

            {/* Dashboard Summary Cards - Stacked in Sidebar as requested */}
            <div className="px-6 pb-6 space-y-4">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Overview</h3>

                <div className="bg-white border border-gray-100 p-4 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-md transition-shadow flex items-center justify-between group">
                    <div>
                        <p className="text-sm text-gray-500 mb-1">Total Reports</p>
                        <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
                    </div>
                    <div className="bg-blue-50 p-2 rounded-lg group-hover:bg-blue-100 transition-colors">
                        <FileText className="h-5 w-5 text-blue-600" />
                    </div>
                </div>

                <div className="bg-white border border-gray-100 p-4 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-md transition-shadow flex items-center justify-between group">
                    <div>
                        <p className="text-sm text-gray-500 mb-1">Resolved (Month)</p>
                        <p className="text-2xl font-bold text-gray-800">{stats.resolvedMonth}</p>
                    </div>
                    <div className="bg-green-50 p-2 rounded-lg group-hover:bg-green-100 transition-colors">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                </div>

                <div className="bg-white border border-gray-100 p-4 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-md transition-shadow flex items-center justify-between group">
                    <div>
                        <p className="text-sm text-gray-500 mb-1">Open Issues</p>
                        <p className="text-2xl font-bold text-gray-800">{stats.open}</p>
                    </div>
                    <div className="bg-yellow-50 p-2 rounded-lg group-hover:bg-yellow-100 transition-colors">
                        <AlertCircle className="h-5 w-5 text-yellow-600" />
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="px-6 pb-6">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Filters</h3>
                <div className="flex flex-wrap gap-2">
                    {['All', 'Pothole', 'Streetlight', 'Signage', 'Other'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 
                                ${filter === f
                                    ? 'bg-gray-900 text-white shadow-md'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900'
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {/* Recent Activity */}
            <div className="px-6 flex-1">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Recent Activity</h3>
                    <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">View All</button>
                </div>

                <div className="space-y-3 pb-6">
                    {complaints.length === 0 ? (
                        <p className="text-sm text-gray-500 italic">No recent activity.</p>
                    ) : (
                        complaints.slice(0, 5).map((c, i) => (
                            <div key={i} className="group bg-white border border-gray-100 p-3 rounded-xl hover:shadow-md transition-all duration-200 cursor-pointer hover:border-blue-100">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-semibold text-gray-800 text-sm line-clamp-1 group-hover:text-blue-600 transition-colors">{c.title}</h4>
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wide
                                        ${c.status === 'Resolved' ? 'bg-green-100 text-green-700' :
                                            c.status === 'In Progress' ? 'bg-yellow-100 text-yellow-700' :
                                                'bg-red-100 text-red-700'
                                        }`}>
                                        {c.status}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-500 flex items-center">
                                    <span className="truncate max-w-[150px]">{c.address || 'Unknown Location'}</span>
                                    <span className="mx-1">•</span>
                                    <span>{new Date(c.createdAt).toLocaleDateString()}</span>
                                </p>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default DashboardSidebar;
