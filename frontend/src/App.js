import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import AppHeader from './components/AppHeader';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import PatientDashboard from './components/Patient/PatientDashboard';
import DoctorSearch from './components/Patient/DoctorSearch';
import AppointmentHistory from './components/Patient/AppointmentHistory';
import Tokens from './components/Patient/Tokens';
import DoctorDashboard from './components/Doctor/DoctorDashboard';
import ScheduleManager from './components/Doctor/ScheduleManager';
import MyPatients from './components/Doctor/MyPatients';
import PatientRecords from './components/Doctor/PatientRecords';
import Settings from './components/Settings';
import './App.css';
import './components/AppShell.css';

const ProtectedRoute = ({ children, role }) => {
    const { user, loading } = useAuth();
    if (loading) return <div className="loading-container"><div className="spinner" /><p className="loading-text">Loading...</p></div>;
    if (!user) return <Navigate to="/login" replace />;
    if (role && user.role !== role) return <Navigate to={user.role === 'doctor' ? '/doctor/dashboard' : '/dashboard'} replace />;
    return children;
};

const PublicRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return <div className="loading-container"><div className="spinner" /></div>;
    if (user) return <Navigate to={user.role === 'doctor' ? '/doctor/dashboard' : '/dashboard'} replace />;
    return children;
};

const AppRoutes = () => {
    const { user } = useAuth();
    return (
        <>
            <AppHeader />
            <div className="page-wrapper">
                <Routes>
                    <Route path="/" element={<Navigate to={user ? (user.role === 'doctor' ? '/doctor/dashboard' : '/dashboard') : '/login'} replace />} />
                    <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
                    <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

                    {/* Patient Routes */}
                    <Route path="/dashboard" element={<ProtectedRoute role="patient"><PatientDashboard /></ProtectedRoute>} />
                    <Route path="/search-doctors" element={<ProtectedRoute role="patient"><DoctorSearch /></ProtectedRoute>} />
                    <Route path="/medical-history" element={<ProtectedRoute role="patient"><AppointmentHistory /></ProtectedRoute>} />
                    <Route path="/tokens" element={<ProtectedRoute role="patient"><Tokens /></ProtectedRoute>} />
                    <Route path="/settings" element={<ProtectedRoute role="patient"><Settings /></ProtectedRoute>} />
                    <Route path="/history" element={<Navigate to="/medical-history" replace />} />
                    <Route path="/profile" element={<Navigate to="/settings" replace />} />

                    {/* Doctor Routes */}
                    <Route path="/doctor/dashboard" element={<ProtectedRoute role="doctor"><DoctorDashboard /></ProtectedRoute>} />
                    <Route path="/doctor/schedule" element={<ProtectedRoute role="doctor"><ScheduleManager /></ProtectedRoute>} />
                    <Route path="/doctor/patients" element={<ProtectedRoute role="doctor"><MyPatients /></ProtectedRoute>} />
                    <Route path="/doctor/records" element={<ProtectedRoute role="doctor"><PatientRecords /></ProtectedRoute>} />
                    <Route path="/doctor/settings" element={<ProtectedRoute role="doctor"><Settings /></ProtectedRoute>} />
                    <Route path="/doctor/profile" element={<Navigate to="/doctor/settings" replace />} />

                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </div>
        </>
    );
};

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <AppRoutes />
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
