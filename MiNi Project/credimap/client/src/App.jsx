import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import PortfolioPage from './pages/PortfolioPage';
import BackgroundCanvas from './components/3d/BackgroundCanvas';
import './App.css';

function App() {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
}

function AppContent() {
    const { user, loading } = useAuth();
    const isPublicPortfolio = window.location.pathname.includes('/portfolio/');

    // Default to 'galaxy' for Login/Signup as per user request
    const currentTheme = user?.selectedTheme || 'galaxy';

    if (loading) return null;

    return (
        <div className={`app-wrapper ${currentTheme === 'light' ? 'theme-light' : ''}`}>
            {/* Global 3D Background - ONLY for internal pages. Public portfolios manage their own theme */}
            {!isPublicPortfolio && <BackgroundCanvas theme={currentTheme} />}

            <Router>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/portfolio/:id" element={<PortfolioPage />} />
                    <Route path="/p/:publicId" element={<PortfolioPage />} />
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route path="/" element={<Home />} />
                </Routes>
            </Router>
        </div>
    );
}

export default App;
