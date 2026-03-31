import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Button,
    TextField,
    Typography,
    Alert,
    IconButton,
    InputAdornment,
    Fade,
    CircularProgress,
    Paper,
    Container
} from '@mui/material';
import {
    Visibility,
    VisibilityOff,
    AdminPanelSettings as AdminIcon,
    Security as SecurityIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { alpha } from '@mui/material/styles';

const AdminLoginPage = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setError(''); // Clear error when user starts typing
    };

    const validateForm = () => {
        if (!formData.email) {
            setError('Email is required');
            return false;
        }
        if (!formData.password) {
            setError('Password is required');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Clear previous error
        setError('');

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            const result = await login(formData.email, formData.password);

            if (result.success) {
                // Check if user has admin role
                const token = localStorage.getItem('token');
                if (token) {
                    try {
                        // Decode token to check role
                        const payload = JSON.parse(atob(token.split('.')[1]));
                        const roles = payload.roles || [];

                        if (roles.includes('ADMIN')) {
                            // Success - redirect to admin dashboard
                            navigate('/admin/dashboard');
                        } else {
                            // Not an admin - show error and clear token
                            setError('Access denied. Admin privileges required.');
                            localStorage.removeItem('token');
                            localStorage.removeItem('user');
                            // Clear password field but keep email
                            setFormData(prev => ({ ...prev, password: '' }));
                        }
                    } catch (decodeError) {
                        console.error('Token decode error:', decodeError);
                        setError('Authentication error. Please try again.');
                        localStorage.removeItem('token');
                        localStorage.removeItem('user');
                        setFormData(prev => ({ ...prev, password: '' }));
                    }
                } else {
                    setError('Authentication failed. Please try again.');
                    setFormData(prev => ({ ...prev, password: '' }));
                }
            } else {
                // Login failed - show error message
                setError(result.message || 'Invalid email or password');
                // Clear only password field, keep email for convenience
                setFormData(prev => ({ ...prev, password: '' }));
            }
        } catch (err) {
            console.error('Login error:', err);
            setError('Something went wrong. Please check your connection and try again.');
            setFormData(prev => ({ ...prev, password: '' }));
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #0A0A0A 0%, #1A1A1A 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Animated Background */}
            <Box sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: `
                    radial-gradient(circle at 20% 50%, rgba(255, 152, 0, 0.15) 0%, transparent 50%),
                    radial-gradient(circle at 80% 80%, rgba(76, 175, 80, 0.1) 0%, transparent 50%),
                    #0A0A0A
                `
            }} />

            <style>{`
                @keyframes pulse {
                    0%, 100% { opacity: 0.5; transform: scale(1); }
                    50% { opacity: 0.8; transform: scale(1.05); }
                }
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
                    20%, 40%, 60%, 80% { transform: translateX(5px); }
                }
            `}</style>

            <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
                <Fade in={true} timeout={500}>
                    <Paper elevation={0} sx={{
                        background: alpha('#121212', 0.95),
                        backdropFilter: 'blur(10px)',
                        borderRadius: '24px',
                        border: error ? `1px solid ${alpha('#f44336', 0.5)}` : `1px solid ${alpha('#FF9800', 0.3)}`,
                        padding: { xs: '30px 20px', sm: '40px 40px' },
                        boxShadow: `0 20px 60px ${alpha('#000000', 0.5)}`,
                        transition: 'border 0.3s ease'
                    }}>
                        {/* Admin Icon */}
                        <Box sx={{ textAlign: 'center', mb: 3 }}>
                            <Box sx={{
                                width: '80px',
                                height: '80px',
                                borderRadius: '20px',
                                background: 'linear-gradient(135deg, #FF9800 0%, #FF5722 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto',
                                animation: 'pulse 2s infinite'
                            }}>
                                <AdminIcon sx={{ fontSize: 48, color: 'white' }} />
                            </Box>
                            <Typography variant="h4" sx={{
                                mt: 2,
                                fontWeight: 700,
                                background: 'linear-gradient(135deg, #FF9800, #FF5722)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent'
                            }}>
                                Admin Portal
                            </Typography>
                            <Typography variant="body2" sx={{ color: alpha('#FFFFFF', 0.6), mt: 1 }}>
                                Secure access for administrators only
                            </Typography>
                        </Box>

                        {/* Security Badge */}
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 1,
                            mb: 4,
                            p: 1,
                            bgcolor: alpha('#FF9800', 0.1),
                            borderRadius: '30px',
                            width: 'fit-content',
                            mx: 'auto'
                        }}>
                            <SecurityIcon sx={{ fontSize: 16, color: '#FF9800' }} />
                            <Typography variant="caption" sx={{ color: '#FF9800' }}>
                                Restricted Access
                            </Typography>
                        </Box>

                        {/* Error Alert - Shows but doesn't close the page */}
                        {error && (
                            <Fade in={!!error}>
                                <Alert
                                    severity="error"
                                    sx={{
                                        mb: 3,
                                        borderRadius: '12px',
                                        bgcolor: alpha('#f44336', 0.1),
                                        color: '#FFFFFF',
                                        border: '1px solid #f44336',
                                        animation: 'shake 0.5s ease-in-out'
                                    }}
                                    onClose={() => setError('')}
                                >
                                    {error}
                                </Alert>
                            </Fade>
                        )}

                        {/* Login Form */}
                        <Box component="form" onSubmit={handleSubmit}>
                            <TextField
                                fullWidth
                                type="email"
                                name="email"
                                label="Admin Email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="admin@example.com"
                                required
                                variant="outlined"
                                error={!!error && !formData.email}
                                sx={{
                                    mb: 3,
                                    '& .MuiOutlinedInput-root': {
                                        background: alpha('#1A1A1A', 0.8),
                                        color: '#FFFFFF',
                                        borderRadius: '12px',
                                        '&:hover .MuiOutlinedInput-notchedOutline': {
                                            borderColor: error ? '#f44336' : '#FF9800',
                                        },
                                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                            borderColor: error ? '#f44336' : '#FF9800',
                                            borderWidth: '2px'
                                        }
                                    },
                                    '& .MuiInputLabel-root': {
                                        color: error ? '#f44336' : alpha('#FFFFFF', 0.7),
                                        '&.Mui-focused': {
                                            color: error ? '#f44336' : '#FF9800'
                                        }
                                    }
                                }}
                            />

                            <TextField
                                fullWidth
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                label="Password"
                                value={formData.password}
                                onChange={handleInputChange}
                                placeholder="Enter your password"
                                required
                                variant="outlined"
                                error={!!error && !formData.password}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={handleClickShowPassword} edge="end" sx={{ color: alpha('#FFFFFF', 0.7) }}>
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    mb: 3,
                                    '& .MuiOutlinedInput-root': {
                                        background: alpha('#1A1A1A', 0.8),
                                        color: '#FFFFFF',
                                        borderRadius: '12px',
                                        '&:hover .MuiOutlinedInput-notchedOutline': {
                                            borderColor: error ? '#f44336' : '#FF9800',
                                        },
                                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                            borderColor: error ? '#f44336' : '#FF9800',
                                            borderWidth: '2px'
                                        }
                                    },
                                    '& .MuiInputLabel-root': {
                                        color: error ? '#f44336' : alpha('#FFFFFF', 0.7),
                                        '&.Mui-focused': {
                                            color: error ? '#f44336' : '#FF9800'
                                        }
                                    }
                                }}
                            />

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                disabled={loading}
                                sx={{
                                    py: 1.5,
                                    background: error
                                        ? 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)'
                                        : 'linear-gradient(135deg, #FF9800 0%, #FF5722 100%)',
                                    borderRadius: '12px',
                                    fontSize: '16px',
                                    fontWeight: 600,
                                    textTransform: 'none',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: 'translateY(-2px)',
                                        boxShadow: error
                                            ? '0 8px 25px rgba(244, 67, 54, 0.4)'
                                            : '0 8px 25px rgba(255, 152, 0, 0.4)'
                                    }
                                }}
                            >
                                {loading ? <CircularProgress size={24} sx={{ color: '#FFFFFF' }} /> : 'Login as Admin'}
                            </Button>

                            {/* Back to Home */}
                            <Button
                                fullWidth
                                variant="text"
                                onClick={() => navigate('/')}
                                sx={{
                                    mt: 2,
                                    color: alpha('#FFFFFF', 0.6),
                                    textTransform: 'none',
                                    '&:hover': {
                                        color: '#FFFFFF',
                                        background: alpha('#FFFFFF', 0.1)
                                    }
                                }}
                            >
                                ← Back to Home
                            </Button>
                        </Box>

                        {/* Help Text */}
                        <Box sx={{ mt: 3, textAlign: 'center' }}>
                            <Typography variant="caption" sx={{ color: alpha('#FFFFFF', 0.3) }}>
                                Contact system administrator if you have issues logging in
                            </Typography>
                        </Box>

                        {/* Footer */}
                        <Box sx={{ mt: 3, textAlign: 'center' }}>
                            <Typography variant="caption" sx={{ color: alpha('#FFFFFF', 0.2) }}>
                                This area is restricted to authorized personnel only
                            </Typography>
                        </Box>
                    </Paper>
                </Fade>
            </Container>
        </Box>
    );
};

export default AdminLoginPage;