import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import ReportIssue from './pages/ReportIssue';
import MyIssues from './pages/MyIssues';
import IssueDetails from './pages/IssueDetails';
import UserProfile from './pages/UserProfile';

import LandingPage from './pages/LandingPage'; // Import LandingPage

const Layout = () => {
    const location = useLocation();
    // Hide navbar on dashboard page as it has its own sidebar, and on Landing Page (it has custom nav)
    const hideNavbarRoutes = ['/dashboard', '/', '/login', '/register', '/admin', '/report-issue', '/my-issues'];
    // Hide navbar on specific routes AND dynamic issue pages
    const showNavbar = !hideNavbarRoutes.includes(location.pathname) && !location.pathname.startsWith('/issue/');

    return (
        <div className="min-h-screen flex flex-col">
            {showNavbar && <Navbar />}
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/report-issue" element={<ReportIssue />} />
                <Route path="/my-issues" element={<MyIssues />} />
                <Route path="/issue/:id" element={<IssueDetails />} />
                <Route path="/user-profile" element={<UserProfile />} />
            </Routes>
        </div>
    );
};

import { ThemeProvider } from './context/ThemeContext';

function App() {
    return (
        <AuthProvider>
            <ThemeProvider>
                <Router>
                    <Layout />
                </Router>
            </ThemeProvider>
        </AuthProvider>
    );
}

export default App;
