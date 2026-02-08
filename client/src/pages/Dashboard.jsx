import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import UserDashboard from './UserDashboard';
import AdminDashboard from './AdminDashboard';

const Dashboard = () => {
    const { user, loading } = useAuth();
    const navigate = useNavigate();

    // Handle initial loading
    if (loading) return <div className="flex h-screen items-center justify-center bg-slate-900 text-white">Loading...</div>;

    // Redirect if not logged in
    if (!user) {
        navigate('/login');
        return null; // Render nothing while redirecting
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {user?.role === 'admin' ? <AdminDashboard /> : <UserDashboard />}
        </div>
    );
};

export default Dashboard;
