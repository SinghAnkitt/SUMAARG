import { useState, useEffect, useRef } from 'react';
import { Bell, Check, Info, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const NotificationDropdown = () => {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const dropdownRef = useRef(null);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const res = await axios.get('/api/notifications', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotifications(res.data);
            setUnreadCount(res.data.filter(n => !n.isRead).length);
            setLoading(false);
        } catch (error) {
            console.error("Failed to fetch notifications", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchNotifications();
        } else {
            // Initial fetch for badge
            fetchNotifications();
        }
    }, [isOpen]);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const markAsRead = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`/api/notifications/${id}/read`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Update local state
            setNotifications(notifications.map(n =>
                n._id === id ? { ...n, isRead: true } : n
            ));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error("Failed to mark read", error);
        }
    };

    const markAllAsRead = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.put('/api/notifications/read-all', {}, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setNotifications(notifications.map(n => ({ ...n, isRead: true })));
            setUnreadCount(0);
        } catch (error) {
            console.error("Failed to mark all read", error);
        }
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'success': return <CheckCircle size={16} className="text-green-500" />;
            case 'warning': return <AlertTriangle size={16} className="text-yellow-500" />;
            case 'error': return <XCircle size={16} className="text-red-500" />;
            default: return <Info size={16} className="text-blue-500" />;
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2.5 rounded-full text-gray-600 hover:text-gray-900 dark:text-slate-300 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors relative"
            >
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-800 ring-1 ring-red-500"></span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 top-12 w-80 sm:w-96 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-100 dark:border-white/10 overflow-hidden z-[100] animate-in fade-in zoom-in-95 duration-200">
                    <div className="px-4 py-3 border-b border-gray-100 dark:border-white/5 flex justify-between items-center bg-gray-50/50 dark:bg-slate-900/50">
                        <h3 className="text-sm font-bold text-gray-900 dark:text-white">Notifications</h3>
                        {unreadCount > 0 && (
                            <button
                                onClick={markAllAsRead}
                                className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
                            >
                                Mark all read
                            </button>
                        )}
                    </div>

                    <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                        {loading && notifications.length === 0 ? (
                            <div className="p-8 text-center text-gray-500 dark:text-slate-400 text-sm">
                                Loading...
                            </div>
                        ) : notifications.length > 0 ? (
                            <div className="divide-y divide-gray-100 dark:divide-white/5">
                                {notifications.map((notification) => (
                                    <div
                                        key={notification._id}
                                        className={`p-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors flex gap-3 ${!notification.isRead ? 'bg-blue-50/50 dark:bg-blue-500/5' : ''}`}
                                        onClick={() => !notification.isRead && markAsRead(notification._id)}
                                    >
                                        <div className="mt-0.5 flex-shrink-0">
                                            {getTypeIcon(notification.type)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-sm ${!notification.isRead ? 'text-gray-900 dark:text-white font-semibold' : 'text-gray-600 dark:text-slate-300'}`}>
                                                {notification.message}
                                            </p>
                                            <p className="text-xs text-gray-400 dark:text-slate-500 mt-1">
                                                {new Date(notification.createdAt).toLocaleString()}
                                            </p>
                                        </div>
                                        {!notification.isRead && (
                                            <div className="flex-shrink-0 self-center">
                                                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-8 text-center flex flex-col items-center">
                                <Bell className="text-gray-300 dark:text-slate-600 mb-2" size={32} />
                                <p className="text-gray-500 dark:text-slate-400 text-sm">No new notifications</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationDropdown;
