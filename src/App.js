// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import VerifyCodePage from './pages/VerifyCodePage';
import EventsPage from './pages/EventsPage';
import PaymentPage from './pages/PaymentPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import './App.css';

const AppContent = () => {
    return (
        <div className="app-container">
            <Routes>
                {/* Home Page - Shows museums */}
                <Route path="/" element={<HomePage/>}/>

                {/* Auth Pages (Public) */}
                <Route path="/login" element={<LoginPage/>}/>
                <Route path="/signup" element={<SignUpPage/>}/>
                <Route path="/verify-code" element={<VerifyCodePage/>}/>

                {/* Admin Routes */}
                <Route path="/admin/auth" element={<AdminLoginPage/>}/>
                <Route
                    path="/admin/dashboard"
                    element={
                        <ProtectedRoute>
                            <AdminDashboardPage/>
                        </ProtectedRoute>
                    }
                />
                <Route path="/admin" element={<Navigate to="/admin/auth" replace/>}/>

                {/* Events Pages - Require Authentication */}
                <Route
                    path="/events"
                    element={
                        <ProtectedRoute>
                            <EventsPage/>
                        </ProtectedRoute>
                    }
                />

                {/* Payment Pages - Require Authentication */}
                <Route
                    path="/payment"
                    element={
                        <ProtectedRoute>
                            <PaymentPage/>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/payment-success"
                    element={
                        <ProtectedRoute>
                            <PaymentSuccessPage/>
                        </ProtectedRoute>
                    }
                />

                {/* Profile Page - Protected */}
                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute>
                            <ProfilePage/>
                        </ProtectedRoute>
                    }
                />

                {/* Catch-all route - redirect to home */}
                <Route path="*" element={<Navigate to="/" replace/>}/>
            </Routes>
        </div>
    );
};

function App() {
    return (
        <Router>
            <AuthProvider>
                <AppContent/>
            </AuthProvider>
        </Router>
    );
}

export default App;