import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Box, CircularProgress, Typography } from '@mui/material';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                    background: '#0A0A0A',
                    color: '#FFFFFF'
                }}
            >
                <Box
                    sx={{
                        textAlign: 'center',
                        padding: '40px',
                        background: 'rgba(18, 18, 18, 0.95)',
                        borderRadius: '16px',
                        border: '1px solid #242424',
                        maxWidth: '400px',
                        width: '90%'
                    }}
                >
                    <CircularProgress
                        sx={{
                            color: '#4CAF50',
                            mb: 2
                        }}
                    />
                    <Typography variant="h6" sx={{ mb: 1, color: '#FFFFFF' }}>
                        Authenticating...
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        Please wait while we verify your session.
                    </Typography>
                </Box>
            </Box>
        );
    }

    if (!user) {
        // Redirect to home page with a message
        const navigationState = {
            from: location.pathname,
            message: 'Please sign in to access this feature',
            severity: 'warning'
        };

        return <Navigate to="/" state={navigationState} replace />;
    }

    return children;
};

export default ProtectedRoute;