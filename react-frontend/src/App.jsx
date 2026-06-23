import React, { useState } from 'react';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import { useAuth } from './auth/AuthProvider';

export default function App() {
    const { user } = useAuth();
    // New state to track which page we are looking at
    const [currentView, setCurrentView] = useState('dashboard');

    // Not logged in? Show Login.
    if (!user) {
        return <Login />;
    }

    // Logged in AND requested the admin panel AND is actually an admin? Show Admin!
    if (currentView === 'admin' && user.role === 'admin') {
        return <AdminDashboard onBack={() => setCurrentView('dashboard')} />;
    }

    // Otherwise, show the default Dashboard!
    return <Dashboard onNavigateAdmin={() => setCurrentView('admin')} />;
}