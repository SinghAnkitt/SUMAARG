import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import {
    Calendar, MapPin, Share2, CheckCircle, AlertCircle,
    ArrowLeft, Camera, Flag, Clock, User, Bell, Plus, Phone
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

// Fix Leaflet icons
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const IssueDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [issue, setIssue] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [updateLoading, setUpdateLoading] = useState(false);
    const [uploadingPhoto, setUploadingPhoto] = useState(false);
    const [additionalPhotos, setAdditionalPhotos] = useState([]);

    useEffect(() => {
        const fetchIssue = async () => {
            if (!user?.token) {
                setError('Please login to view issue details');
                setLoading(false);
                return;
            }

            try {
                const config = {
                    headers: { Authorization: `Bearer ${user.token}` }
                };
                const { data } = await axios.get(`/api/complaints/${id}`, config);
                setIssue(data);
                setError('');
            } catch (err) {
                console.error("Issue Fetch Error:", err);
                const status = err.response?.status;
                const backendMsg = err.response?.data?.message;

                if (status === 404) {
                    setError(backendMsg || `Issue not found (ID: ${id})`);
                } else if (status === 401) {
                    setError('Authentication failed. Please login again.');
                } else {
                    setError(backendMsg || 'Failed to fetch issue details');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchIssue();
    }, [id, user]);

    const handleCloseIssue = async () => {
        if (!window.confirm("Are you sure you want to mark this issue as Resolved?")) return;
        setUpdateLoading(true);
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` }
            };
            const { data } = await axios.patch(
                `/api/complaints/${id}/status`,
                { status: "Resolved" },
                config
            );
            setIssue(data);
            alert("Issue marked as Resolved successfully!");
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "Failed to update status");
        } finally {
            setUpdateLoading(false);
        }
    };

    const handlePhotoUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('File size must be less than 5MB');
            return;
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Please upload an image file');
            return;
        }

        setUploadingPhoto(true);
        try {
            // Convert to base64
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result;
                // Add to additional photos array
                setAdditionalPhotos(prev => [...prev, {
                    url: base64String,
                    uploadedAt: new Date().toISOString()
                }]);
                alert('Photo added successfully! (Note: This is a demo - photos are not persisted to database)');
            };
            reader.readAsDataURL(file);
        } catch (err) {
            console.error('Photo upload error:', err);
            alert('Failed to upload photo');
        } finally {
            setUploadingPhoto(false);
        }
    };

    const openInMaps = () => {
        if (issue?.location?.coordinates) {
            const [lng, lat] = issue.location.coordinates;
            // Open in Google Maps
            window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank');
        } else if (issue?.address) {
            // Fallback to address search
            window.open(`https://www.google.com/maps/search/${encodeURIComponent(issue.address)}`, '_blank');
        } else {
            alert('Location information not available');
        }
    };

    const handleShare = () => {
        const url = window.location.href;
        if (navigator.share) {
            navigator.share({
                title: issue?.title,
                text: `Check out this issue: ${issue?.title}`,
                url: url
            }).catch(err => console.log('Error sharing:', err));
        } else {
            navigator.clipboard.writeText(url);
            alert('Link copied to clipboard!');
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Resolved': return { bg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500/30' };
            case 'In Progress': return { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30' };
            case 'Active': return { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/30' };
            case 'Rejected': return { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/30' };
            default: return { bg: 'bg-slate-700', text: 'text-slate-300', border: 'border-slate-600' };
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error || !issue) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
                <div className="bg-slate-800/80 backdrop-blur-xl p-8 rounded-2xl shadow-xl max-w-md w-full text-center border border-white/10">
                    <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertCircle className="h-8 w-8 text-red-500" />
                    </div>
                    <h2 className="text-xl font-bold text-white mb-2">Error Loading Issue</h2>
                    <p className="text-slate-400 mb-6">{error || 'Issue not found'}</p>
                    <button
                        onClick={() => navigate('/my-issues')}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition shadow-lg shadow-blue-600/20"
                    >
                        Go Back to My Issues
                    </button>
                </div>
            </div>
        );
    }

    const mapCenter = issue.location?.coordinates
        ? [issue.location.coordinates[1], issue.location.coordinates[0]]
        : [28.6139, 77.2090];

    const statusStyle = getStatusStyle(issue.status);

    return (
        <div className="min-h-screen relative flex flex-col font-sans bg-slate-900 text-white overflow-x-hidden selection:bg-blue-500/30">

            {/* Background Image with Overlay */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <img
                    src="https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=2613&auto=format&fit=crop"
                    alt="City Lights"
                    className="w-full h-full object-cover opacity-30 blur-[4px]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/90 to-slate-900/80"></div>
            </div>

            {/* Top Navigation (Floating Pill) */}
            <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4">
                <nav className="bg-slate-800/60 backdrop-blur-xl border border-white/10 rounded-full px-6 py-3 flex items-center justify-between w-full max-w-5xl shadow-2xl shadow-black/20">
                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
                                <span className="font-bold text-white text-lg">S</span>
                            </div>
                            <span className="font-bold text-lg tracking-tight text-white hidden sm:block">SuMaarg</span>
                        </div>
                        <div className="hidden md:flex items-center gap-1 bg-white/5 rounded-full p-1 border border-white/5">
                            <button onClick={() => navigate('/dashboard')} className="px-5 py-2 rounded-full text-slate-300 hover:text-white hover:bg-white/5 text-sm font-medium transition-all">Dashboard</button>
                            <button className="px-5 py-2 rounded-full bg-white/10 text-white text-sm font-medium shadow-inner border border-white/5">Issues</button>
                            <button 
                                onClick={openInMaps}
                                className="px-5 py-2 rounded-full text-slate-300 hover:text-white hover:bg-white/5 text-sm font-medium transition-all flex items-center gap-1"
                            >
                                <MapPin size={14} />
                                Map View
                            </button>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="p-2 text-slate-400 hover:text-white transition-colors relative"><Bell size={20} /></button>
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold shadow-inner border border-white/10 cursor-pointer">
                            {user?.name ? user.name.substring(0, 2).toUpperCase() : 'US'}
                        </div>
                    </div>
                </nav>
            </div>

            {/* Main Content */}
            <main className="relative z-10 flex-grow px-4 pt-32 pb-16 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">

                {/* Header */}
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 mb-8">
                    <div className="flex items-start gap-4">
                        <button onClick={() => navigate(-1)} className="mt-1 p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 text-slate-400 hover:text-white transition-all"><ArrowLeft size={20} /></button>
                        <div>
                            <div className="flex items-center gap-3 mb-2 flex-wrap">
                                <h1 className="text-3xl font-extrabold text-white tracking-tight">Issue #{issue._id.slice(-6).toUpperCase()}</h1>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}>
                                    {issue.status === 'Active' ? 'Pending Review' : issue.status}
                                </span>
                            </div>
                            <p className="text-slate-400 text-sm">
                                Reported on {new Date(issue.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} by <span className="text-slate-300 font-medium">{issue.user?.name || 'Anonymous'}</span>
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button onClick={handleShare} className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white rounded-lg text-sm font-medium transition-all">
                            <Share2 size={16} /> Share
                        </button>
                        {(user?.role === 'admin' && issue.status !== 'Resolved') ? (
                            <button
                                onClick={handleCloseIssue}
                                disabled={updateLoading}
                                className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-bold shadow-lg shadow-blue-600/20 transition-all hover:scale-105"
                            >
                                <CheckCircle size={16} />
                                {updateLoading ? 'Updating...' : 'Update Status'}
                            </button>
                        ) : null}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* LEFT COLUMN */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Description Card */}
                        <div className="bg-slate-800/40 backdrop-blur-xl border border-white/5 rounded-3xl p-6 lg:p-8">
                            <div className="flex items-center gap-2 mb-4 text-blue-400">
                                <Flag size={20} />
                                <h3 className="text-lg font-bold uppercase tracking-wide">Issue Description</h3>
                            </div>
                            <p className="text-slate-300 leading-relaxed text-lg">
                                {issue.description}
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                                <div className="bg-slate-900/50 rounded-xl p-4 border border-white/5 flex flex-col justify-center">
                                    <p className="text-slate-500 text-xs font-bold uppercase mb-1">Location</p>
                                    <div className="flex items-start gap-2">
                                        <MapPin size={16} className="text-blue-500 mt-0.5 shrink-0" />
                                        <p className="text-slate-200 text-sm font-medium">{issue.address || "Location unavailable"}</p>
                                    </div>
                                </div>
                                <div className="bg-slate-900/50 rounded-xl p-4 border border-white/5 flex flex-col justify-center">
                                    <p className="text-slate-500 text-xs font-bold uppercase mb-1">Category</p>
                                    <div className="flex items-start gap-2">
                                        <AlertCircle size={16} className="text-yellow-500 mt-0.5 shrink-0" />
                                        <p className="text-slate-200 text-sm font-medium">{issue.category}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Media Attachments */}
                        <div className="bg-slate-800/40 backdrop-blur-xl border border-white/5 rounded-3xl p-6 lg:p-8">
                            <div className="flex items-center gap-2 mb-6 text-blue-400">
                                <Camera size={20} />
                                <h3 className="text-lg font-bold uppercase tracking-wide">Media Attachments</h3>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="col-span-2 md:col-span-2 relative aspect-video rounded-2xl overflow-hidden group shadow-lg shadow-black/20 border border-white/5">
                                    <img
                                        src={issue.imageUrl}
                                        alt="Evidence"
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        onError={(e) => { e.target.src = "https://via.placeholder.com/600x400?text=No+Image" }}
                                    />
                                    <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                                        <p className="text-white text-xs font-bold">Site View</p>
                                    </div>
                                </div>

                                {/* Additional Photos */}
                                {additionalPhotos.map((photo, idx) => (
                                    <div key={idx} className="relative aspect-video rounded-2xl overflow-hidden group shadow-lg shadow-black/20 border border-white/5">
                                        <img
                                            src={photo.url}
                                            alt={`Additional ${idx + 1}`}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                        <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                                            <p className="text-white text-[10px] font-bold">Additional {idx + 1}</p>
                                        </div>
                                    </div>
                                ))}

                                {/* Placeholder if no additional photos */}
                                {additionalPhotos.length === 0 && (
                                    <div className="relative rounded-2xl overflow-hidden bg-slate-900/50 border border-white/5 flex items-center justify-center opacity-50">
                                        <p className="text-slate-500 text-xs">Before</p>
                                    </div>
                                )}

                                {/* Add Photo Button */}
                                <label className="relative rounded-2xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center text-slate-500 hover:text-white hover:bg-white/5 hover:border-white/20 transition-all cursor-pointer">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handlePhotoUpload}
                                        className="hidden"
                                        disabled={uploadingPhoto}
                                    />
                                    {uploadingPhoto ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mb-1"></div>
                                            <p className="text-xs font-medium">Uploading...</p>
                                        </>
                                    ) : (
                                        <>
                                            <Camera size={20} className="mb-1" />
                                            <p className="text-xs font-medium">Add Photo</p>
                                        </>
                                    )}
                                </label>
                            </div>
                        </div>

                    </div>

                    {/* RIGHT COLUMN */}
                    <div className="lg:col-span-1 space-y-6">

                        {/* Map Preview */}
                        <div className="bg-slate-800/40 backdrop-blur-xl border border-white/5 rounded-3xl p-4 h-[300px] relative overflow-hidden flex flex-col">
                            <div className="absolute top-4 right-4 z-10 bg-slate-900/80 backdrop-blur-md p-2 rounded-lg border border-white/10 shadow-lg">
                                <MapPin size={16} className="text-red-500" />
                            </div>
                            <div className="w-full h-full rounded-2xl overflow-hidden border border-white/5 relative z-0">
                                <MapContainer
                                    center={mapCenter}
                                    zoom={14}
                                    style={{ height: '100%', width: '100%' }}
                                    zoomControl={false}
                                    attributionControl={false}
                                >
                                    <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
                                    <Marker position={mapCenter} />
                                </MapContainer>
                            </div>
                        </div>

                        {/* Timeline */}
                        <div className="bg-slate-800/40 backdrop-blur-xl border border-white/5 rounded-3xl p-6">
                            <div className="flex items-center gap-2 mb-6 text-blue-400">
                                <Clock size={20} />
                                <h3 className="text-lg font-bold uppercase tracking-wide">Maintenance Timeline</h3>
                            </div>

                            <div className="relative pl-6 space-y-8 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-white/10">
                                {/* Repair Started (Mock) */}
                                {issue.status === 'In Progress' && (
                                    <div className="relative">
                                        <span className="absolute -left-6 top-1 h-4 w-4 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)] border-2 border-slate-900"></span>
                                        <div>
                                            <p className="text-white font-semibold text-sm">Repair Started</p>
                                            <p className="text-slate-400 text-xs mt-0.5">Oct 14, 2024 • 09:30 AM</p>
                                            <div className="mt-2 text-xs text-slate-300 bg-white/5 p-3 rounded-lg border border-white/5">
                                                Crew arrived on site. Area barricaded.
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Issue Verified (Mock) */}
                                <div className="relative">
                                    <span className="absolute -left-6 top-1 h-4 w-4 rounded-full bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.5)] border-2 border-slate-900"></span>
                                    <div>
                                        <p className="text-white font-semibold text-sm">Issue Verified</p>
                                        <p className="text-slate-400 text-xs mt-0.5">Oct 13, 2024 • 02:15 PM</p>
                                        <p className="text-slate-500 text-xs mt-1">Verified by Supervisor Amit K.</p>
                                    </div>
                                </div>

                                {/* Report Submitted */}
                                <div className="relative">
                                    <span className="absolute -left-6 top-1 h-4 w-4 rounded-full bg-slate-600 border-2 border-slate-900"></span>
                                    <div>
                                        <p className="text-white font-semibold text-sm">Report Submitted</p>
                                        <p className="text-slate-400 text-xs mt-0.5">
                                            {new Date(issue.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} • {new Date(issue.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                        <p className="text-slate-500 text-xs mt-1">Submitted via Mobile App</p>
                                    </div>
                                </div>
                            </div>

                            <button className="w-full mt-6 py-3 rounded-xl border border-white/10 text-slate-400 text-xs font-bold hover:text-white hover:bg-white/5 transition-all">
                                View Full History
                            </button>
                        </div>

                        {/* Assigned Team */}
                        <div className="bg-slate-800/40 backdrop-blur-xl border border-white/5 rounded-3xl p-6">
                            <p className="text-slate-500 text-xs font-bold uppercase mb-4 tracking-wider">Assigned Team</p>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 border border-indigo-500/30">
                                    <User size={20} />
                                </div>
                                <div>
                                    <p className="text-white font-bold text-sm">Zone 4 Maintenance</p>
                                    <p className="text-slate-400 text-xs">Supervisor: Mr. Sharma</p>
                                </div>
                                <button className="ml-auto w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors">
                                    <Phone size={14} />
                                </button>
                            </div>
                        </div>

                    </div>
                </div>

            </main>

            {/* Footer */}
            <footer className="relative z-10 py-8 border-t border-white/5 mt-auto bg-slate-900/0 max-w-7xl mx-auto w-full px-6 text-center md:text-left">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-slate-500 text-sm">
                        © 2024 SuMaarg. Citizen Road Safety Initiative.
                    </p>
                    <div className="flex gap-6">
                        <a href="#" className="text-slate-500 hover:text-white text-sm transition-colors">Privacy Policy</a>
                        <a href="#" className="text-slate-500 hover:text-white text-sm transition-colors">Help Center</a>
                        <a href="#" className="text-slate-500 hover:text-white text-sm transition-colors">Contact</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default IssueDetails;
