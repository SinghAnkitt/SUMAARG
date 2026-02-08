import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ChevronRight,
    Upload,
    X,
    Search,
    MapPin,
    Camera,
    Send,
    Crosshair,
    ChevronDown,
    Map
} from 'lucide-react';
import LocationPickerMap from '../components/LocationPickerMap';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const ReportIssue = () => {
    const navigate = useNavigate();
    const { user, loading: authLoading } = useAuth();
    const [loading, setLoading] = useState(false);
    const [showMapModal, setShowMapModal] = useState(false);

    // Protect Route
    if (!authLoading && !user) {
        navigate('/login');
    }

    // Prevent rendering if redirecting
    if (!authLoading && !user) return null;

    // Form State
    const [title, setTitle] = useState(''); // Kept for logic, but UI asks for Description only? Prompt says "Description... Describe issue...". Wait, Prompt has "Issue Type", "Location", "Description". Title might be redundant or implicit. I'll keep it as "Issue Type" + "Description". Actually Prompt "Description" placeholder says "Describe the issue in detail".
    // I will auto-generate title or merge it. For compatibility with backend (which likely expects 'title'), I'll add a hidden or combined approach. 
    // Actually, I'll keep 'Title' but style it subtly or integrate it if strictly following visual spec which omits it.
    // Spec: "Issue Type", "Location", "Description". No separate "Title" field in visual spec text. 
    // I will use "Issue Type" as the main categorizer, and "Description" for details. 
    // Backend `title` is required? Let's check `ReportIssue.jsx`... `const payload = { title, ... }`.
    // I will use a default title like "Report: [IssueType] at [Location]" if I remove the field, OR better, I'll add a concise "Subject" field to match "Title" requirement but keep it clean.
    // Let's stick to the VISUAL spec: Issue Type, Location, Description. 
    // use `Issue Type` + `Location` to auto-generate `title` for backend.

    const [issueType, setIssueType] = useState('Pothole');
    const [description, setDescription] = useState('');
    const [address, setAddress] = useState('');
    const [coordinates, setCoordinates] = useState(null);
    const [images, setImages] = useState([]);

    // Handlers
    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);

        // Validate size (Max 5MB)
        const validFiles = files.filter(file => {
            if (file.size > 5 * 1024 * 1024) {
                alert(`File ${file.name} is too large. Max size is 5MB.`);
                return false;
            }
            return true;
        });

        const newImages = validFiles.map(file => ({
            file,
            preview: URL.createObjectURL(file)
        }));
        setImages([...images, ...newImages]);
    };

    const removeImage = (index) => {
        const newImages = [...images];
        URL.revokeObjectURL(newImages[index].preview);
        newImages.splice(index, 1);
        setImages(newImages);
    };

    const handleLocationSelect = (locData) => {
        setCoordinates({ lat: locData.lat, lng: locData.lng });
        if (!address) setAddress(locData.address);
        // user clicked map, so we can assume they picked a spot.
        // We might want to close modal if we implement one, or just update state.
    };

    const confirmLocation = () => {
        if (!coordinates) {
            alert("Please tap on the map to select a location.");
            return;
        }
        setShowMapModal(false);
    };

    const handleSubmit = async () => {
        // Construct a title if we don't have a separate field
        const constructedTitle = `${issueType} Issue at ${address ? address.split(',')[0] : 'Unknown Location'}`;

        if (!description || !coordinates) {
            alert("Please fill in required fields and select a location.");
            return;
        }

        if (images.length === 0) {
            alert("Please upload at least one evidence photo.");
            return;
        }

        setLoading(true);
        try {
            const convertToBase64 = (file) => {
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = () => resolve(reader.result);
                    reader.onerror = (error) => reject(error);
                });
            };

            const base64Image = await convertToBase64(images[0].file);

            const config = {
                headers: { Authorization: `Bearer ${user?.token}` }
            };

            const payload = {
                title: constructedTitle,
                category: issueType,
                description,
                address,
                latitude: coordinates.lat,
                longitude: coordinates.lng,
                imageUrl: base64Image
            };

            await axios.post('/api/complaints', payload, config);
            navigate('/dashboard');
        } catch (error) {
            console.error("Submission failed", error);
            const message = error.response?.data?.message || error.message || "Failed to submit report. Please try again.";
            alert(`Error: ${message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen relative flex flex-col font-sans bg-slate-900 text-white overflow-x-hidden selection:bg-blue-500/30">

            {/* Background Image with Overlay */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <img
                    src="https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=2864&auto=format&fit=crop"
                    alt="City Night Road"
                    className="w-full h-full object-cover opacity-40 blur-[3px]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-slate-900/60"></div>
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
                            <button className="px-5 py-2 rounded-full bg-blue-600 text-sm font-medium shadow-lg shadow-blue-600/20 transition-all">
                                New Issue
                            </button>
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="px-5 py-2 rounded-full text-slate-300 hover:text-white hover:bg-white/5 text-sm font-medium transition-all"
                            >
                                Dashboard
                            </button>
                        </div>
                    </div>

                    {/* Right User Profile */}
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3 pl-4 border-l border-white/10">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-bold text-white leading-tight">{user?.name || 'Citizen'}</p>
                                <p className="text-[10px] font-medium text-blue-400 uppercase tracking-wider">Citizen</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-sm font-bold shadow-inner border border-white/10">
                                {user?.name ? user.name.substring(0, 2).toUpperCase() : 'US'}
                            </div>
                        </div>
                    </div>
                </nav>
            </div>

            {/* Main Content Area */}
            <main className="relative z-10 flex-grow flex flex-col items-center justify-center px-4 pt-32 pb-12 sm:px-6 lg:px-8">

                {/* Main Form Card */}
                <div className="w-full max-w-2xl bg-slate-800/40 backdrop-blur-2xl border border-white/10 rounded-[32px] p-8 sm:p-10 shadow-2xl relative overflow-hidden">

                    {/* Header */}
                    <div className="flex justify-between items-start mb-10">
                        <div>
                            <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2 tracking-tight">Report an Issue</h1>
                            <p className="text-slate-400 text-lg">Spot a problem? Let us know so we can fix it.</p>
                        </div>
                        {address && (
                            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-xs font-bold uppercase tracking-wider">
                                <Crosshair size={14} />
                                <span className="max-w-[100px] truncate">{address.split(',')[0]}</span>
                            </div>
                        )}
                    </div>

                    <div className="space-y-8">

                        {/* Row 1: Type & Location */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            {/* Issue Type */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-300 ml-1">Issue Type</label>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-400 transition-colors">
                                        <div className="w-5 h-5 bg-slate-600 rounded-sm rotate-45 group-focus-within:bg-blue-500 transition-colors"></div>
                                    </div>
                                    <select
                                        value={issueType}
                                        onChange={(e) => setIssueType(e.target.value)}
                                        className="w-full pl-12 pr-10 py-4 bg-slate-900/60 border border-white/10 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none cursor-pointer transition-all hover:bg-slate-900/80"
                                    >
                                        <option>Pothole</option>
                                        <option>Streetlight</option>
                                        <option>Garbage</option>
                                        <option>Drainage</option>
                                        <option>Signage</option>
                                        <option>Other</option>
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={18} />
                                </div>
                            </div>

                            {/* Location */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-300 ml-1">Location</label>
                                <div className="relative group">
                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-400 transition-colors" size={20} />
                                    <input
                                        type="text"
                                        readOnly
                                        value={address || ''}
                                        placeholder="Tap target to select..."
                                        className="w-full pl-12 pr-12 py-4 bg-slate-900/60 border border-white/10 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all cursor-default truncate"
                                    />
                                    <button
                                        onClick={() => setShowMapModal(true)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-lg shadow-blue-600/20 transition-all hover:scale-105 active:scale-95"
                                        title="Pick exact location on map"
                                    >
                                        <Crosshair size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-300 ml-1">Description</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Describe the issue in detail (e.g., depth of pothole, obstruction details, specific landmarks)..."
                                rows="4"
                                className="w-full px-5 py-4 bg-slate-900/60 border border-white/10 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all resize-none hover:bg-slate-900/80"
                            />
                        </div>

                        {/* Evidence Photos */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-300 ml-1">Evidence Photos</label>
                            <div className="relative group">
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                />
                                <div className="border-2 border-dashed border-white/10 rounded-[24px] bg-slate-900/30 p-8 text-center transition-all group-hover:border-blue-500/40 group-hover:bg-slate-900/50">
                                    <div className="w-14 h-14 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400 group-hover:text-blue-400 group-hover:scale-110 transition-all">
                                        <Camera size={28} />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-slate-300 font-medium">Click to upload <span className="text-slate-500 font-normal">or drag & drop</span></p>
                                        <p className="text-xs text-slate-500 uppercase tracking-wide">SVG, PNG, JPG (Max: 5MB)</p>
                                    </div>
                                </div>
                            </div>

                            {/* Preview Area */}
                            {images.length > 0 && (
                                <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
                                    {images.map((img, idx) => (
                                        <div key={idx} className="relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden border border-white/10 group">
                                            <img src={img.preview} alt="Evidence" className="w-full h-full object-cover" />
                                            <button
                                                onClick={() => removeImage(idx)}
                                                className="absolute inset-0 bg-black/60 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="w-full py-4 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-lg shadow-xl shadow-blue-600/20 hover:shadow-blue-600/30 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70"
                        >
                            {loading ? (
                                'Submitting...'
                            ) : (
                                <>
                                    Submit Report <Send size={20} className="ml-1" />
                                </>
                            )}
                        </button>

                    </div>
                </div>

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

            {/* Map Modal */}
            {showMapModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="w-full max-w-3xl h-[80vh] bg-slate-900 rounded-3xl overflow-hidden relative shadow-2xl flex flex-col border border-white/10">
                        {/* Modal Header */}
                        <div className="p-4 bg-slate-800 border-b border-white/5 flex justify-between items-center z-10">
                            <div>
                                <h3 className="text-white font-bold">Select Location</h3>
                                <p className="text-xs text-slate-400">Drag marker to pinpoint the issue</p>
                            </div>
                            <button onClick={() => setShowMapModal(false)} className="p-2 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Map Area */}
                        <div className="flex-grow relative">
                            {/* Hint Overlay */}
                            {!coordinates && (
                                <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[500] bg-slate-900/90 text-white px-4 py-2 rounded-full text-sm shadow-lg pointer-events-none border border-white/10">
                                    Tap on the map to place a marker
                                </div>
                            )}
                            <LocationPickerMap onLocationSelect={handleLocationSelect} />
                        </div>

                        {/* Modal Footer */}
                        <div className="p-4 bg-slate-800 border-t border-white/5 flex justify-end gap-3 z-10">
                            <button
                                onClick={() => setShowMapModal(false)}
                                className="px-6 py-2.5 rounded-xl text-slate-300 font-medium hover:text-white hover:bg-white/5 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmLocation}
                                className="px-8 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-lg shadow-blue-600/20 transition-all"
                            >
                                Confirm Location
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReportIssue;
