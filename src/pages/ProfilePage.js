// src/pages/ProfilePage.js

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Button,
    Typography,
    TextField,
    Alert,
    CircularProgress,
    IconButton,
    InputAdornment,
    Fade,
    Divider,
    Avatar,
    Grid,
    Paper,
    Container,
    Snackbar,
    Menu,
    MenuItem,
    Card,
    Chip,
    Tooltip,
    GlobalStyles
} from '@mui/material';
import {
    Visibility,
    VisibilityOff,
    Lock as LockIcon,
    Security as SecurityIcon,
    CheckCircle as CheckCircleIcon,
    Error as ErrorIcon,
    AccountCircle as AccountCircleIcon,
    Save as SaveIcon,
    Cancel as CancelIcon,
    Info as InfoIcon,
    Logout as LogoutIcon,
    Person as PersonIcon,
    Celebration as CelebrationIcon,
    Email as EmailIcon,
    Shield as ShieldIcon,
    VerifiedUser as VerifiedUserIcon,
    HowToReg as HowToRegIcon,
    AdminPanelSettings as AdminPanelSettingsIcon,
    Bookmark as BookmarkIcon
} from '@mui/icons-material';
import { alpha, keyframes } from '@mui/material/styles';
import { useAuth } from '../context/AuthContext';
import serviceAPI from '../services/serviceAPI';

// Custom animations (same as HomePage)
const float = keyframes`
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    25% { transform: translateY(-15px) rotate(3deg); }
    50% { transform: translateY(-25px) rotate(-3deg); }
    75% { transform: translateY(-10px) rotate(2deg); }
`;

const floatReverse = keyframes`
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    25% { transform: translateY(15px) rotate(-3deg); }
    50% { transform: translateY(25px) rotate(3deg); }
    75% { transform: translateY(10px) rotate(-2deg); }
`;

const pulse = keyframes`
    0%, 100% { opacity: 0.4; transform: scale(1); }
    50% { opacity: 0.7; transform: scale(1.05); }
`;

// Global scrollbar styles (same as HomePage)
const scrollbarStyles = {
    '*::-webkit-scrollbar': {
        width: '10px',
        height: '10px',
    },
    '*::-webkit-scrollbar-track': {
        background: '#F5F0E8',
        borderRadius: '10px',
    },
    '*::-webkit-scrollbar-thumb': {
        background: '#FF6B35',
        borderRadius: '10px',
        '&:hover': {
            background: '#E55A2B',
        },
    },
    '*': {
        scrollbarColor: '#FF6B35 #F5F0E8',
        scrollbarWidth: 'thin',
    },
};

const ProfilePage = () => {
    const navigate = useNavigate();
    const { user, logout, isAdmin } = useAuth();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });
    const [anchorEl, setAnchorEl] = useState(null);
    const [userInitial, setUserInitial] = useState('');
    const [backgroundPosition, setBackgroundPosition] = useState({ x: 0, y: 0 });
    const [favoritesCount, setFavoritesCount] = useState(0);

    const [formData, setFormData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [passwordStrength, setPasswordStrength] = useState({
        hasMinLength: false,
        hasUpperCase: false,
        hasLowerCase: false,
        hasNumber: false,
        hasSpecialChar: false,
        score: 0
    });

    useEffect(() => {
        if (user && user.userName) {
            setUserInitial(user.userName.charAt(0).toUpperCase());
        }
    }, [user]);

    // Load favorites count when user is logged in
    useEffect(() => {
        if (user) {
            loadFavoritesCount();
        }
    }, [user]);

    const loadFavoritesCount = async () => {
        try {
            const response = await serviceAPI.getFavorites(0, 100);
            setFavoritesCount(response.data.totalElements || 0);
        } catch (error) {
            console.error('Error loading favorites count:', error);
        }
    };

    useEffect(() => {
        const handleMouseMove = (e) => {
            const x = e.clientX / window.innerWidth;
            const y = e.clientY / window.innerHeight;
            setBackgroundPosition({ x, y });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    useEffect(() => {
        const password = formData.newPassword;
        const strength = {
            hasMinLength: password.length >= 8,
            hasUpperCase: /[A-Z]/.test(password),
            hasLowerCase: /[a-z]/.test(password),
            hasNumber: /[0-9]/.test(password),
            hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
        };
        const score = Object.values(strength).filter(Boolean).length;
        setPasswordStrength({ ...strength, score });
    }, [formData.newPassword]);

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = async () => {
        await logout();
        handleMenuClose();
        navigate('/');
    };

    const handleServicesClick = () => {
        handleMenuClose();
        navigate('/services');
    };

    const handleHomeClick = () => {
        navigate('/');
    };

    const handleAboutClick = () => {
        navigate('/about');
    };

    const handleHowItWorksClick = () => {
        navigate('/');
        setTimeout(() => {
            const element = document.getElementById('how-it-works');
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }, 100);
    };

    const handleAdminPanel = () => {
        handleMenuClose();
        navigate('/admin/dashboard');
    };

    const handleFavoritesClick = () => {
        handleMenuClose();
        navigate('/favorites');
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setError('');
        setSuccess('');
    };

    const validateForm = () => {
        if (!formData.oldPassword) {
            setError('Current password is required');
            return false;
        }
        if (!formData.newPassword) {
            setError('New password is required');
            return false;
        }
        if (formData.newPassword.length < 8) {
            setError('Password must be at least 8 characters long');
            return false;
        }
        if (passwordStrength.score < 4) {
            setError('Password must contain uppercase, lowercase, number, and special character');
            return false;
        }
        if (!formData.confirmPassword) {
            setError('Please confirm your new password');
            return false;
        }
        if (formData.newPassword !== formData.confirmPassword) {
            setError('New passwords do not match');
            return false;
        }
        if (formData.oldPassword === formData.newPassword) {
            setError('New password cannot be the same as current password');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const passwordData = {
                oldPassword: formData.oldPassword,
                newPassword: formData.newPassword,
                newPasswordRepeat: formData.confirmPassword
            };

            const response = await fetch(`http://localhost:8080/api/public/user/changePassword?email=${encodeURIComponent(user?.email)}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(passwordData)
            });

            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(errorData || 'Failed to change password');
            }

            setSuccess('Password changed successfully!');
            setSnackbar({
                open: true,
                message: 'Password updated successfully!',
                severity: 'success'
            });
            setFormData({
                oldPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
        } catch (err) {
            let errorMessage = err.message;
            if (errorMessage.includes('Invalid old password')) {
                errorMessage = 'Current password is incorrect';
            } else if (errorMessage.includes('new password cannot be the same')) {
                errorMessage = 'New password cannot be the same as current password';
            } else if (errorMessage.includes('Email must be verified')) {
                errorMessage = 'Your email must be verified to change password';
            }
            setError(errorMessage);
            setSnackbar({
                open: true,
                message: errorMessage,
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setFormData({
            oldPassword: '',
            newPassword: '',
            confirmPassword: ''
        });
        setError('');
        setSuccess('');
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const getPasswordStrengthColor = () => {
        const score = passwordStrength.score;
        if (score <= 2) return '#f44336';
        if (score === 3) return '#ff9800';
        if (score === 4) return '#4caf50';
        return '#4caf50';
    };

    const getPasswordStrengthText = () => {
        const score = passwordStrength.score;
        if (score <= 2) return 'Weak';
        if (score === 3) return 'Medium';
        if (score === 4) return 'Strong';
        return 'Very Strong';
    };

    if (!user) {
        return (
            <Box sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #FFF9F0 0%, #F5F0E8 100%)'
            }}>
                <CircularProgress sx={{ color: '#FF6B35' }} />
            </Box>
        );
    }

    return (
        <Box sx={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #FFF9F0 0%, #F5F0E8 100%)',
            fontFamily: "'Inter', sans-serif",
            position: 'relative'
        }}>
            {/* Global Scrollbar Styles */}
            <GlobalStyles styles={scrollbarStyles} />

            {/* Animated Background */}
            <Box sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 0,
                background: `
                    radial-gradient(circle at ${backgroundPosition.x * 100}% ${backgroundPosition.y * 100}%, rgba(255,107,53,0.08) 0%, transparent 50%),
                    radial-gradient(circle at ${100 - backgroundPosition.x * 100}% ${100 - backgroundPosition.y * 100}%, rgba(255,193,7,0.08) 0%, transparent 50%)
                `,
                transition: 'background 0.3s ease-out'
            }} />

            <style>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0) translateX(0); }
                    25% { transform: translateY(-10px) translateX(5px); }
                    50% { transform: translateY(-20px) translateX(-5px); }
                    75% { transform: translateY(-10px) translateX(5px); }
                }
                @keyframes pulse {
                    0%, 100% { opacity: 0.5; transform: scale(1); }
                    50% { opacity: 0.8; transform: scale(1.05); }
                }
                @keyframes gradient {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
            `}</style>

            {/* Header - Navbar identical to HomePage */}
            <Box sx={{
                position: 'sticky',
                top: 0,
                zIndex: 100,
                backgroundColor: alpha('#FFFFFF', 0.95),
                backdropFilter: 'blur(10px)',
                borderBottom: '1px solid rgba(0,0,0,0.08)',
                boxShadow: '0 2px 20px rgba(0,0,0,0.03)'
            }}>
                <Container maxWidth="xl">
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        height: 70,
                    }}>
                        <Box
                            onClick={handleHomeClick}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1.5,
                                cursor: 'pointer'
                            }}
                        >
                            <Box sx={{
                                width: 38,
                                height: 38,
                                borderRadius: '12px',
                                background: 'linear-gradient(135deg, #FF6B35 0%, #FFB347 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <CelebrationIcon sx={{ color: 'white', fontSize: 22 }} />
                            </Box>
                            <Typography variant="h6" sx={{
                                fontWeight: 800,
                                background: 'linear-gradient(135deg, #FF6B35 0%, #FFB347 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                letterSpacing: '-0.5px'
                            }}>
                                Festivy
                            </Typography>
                        </Box>

                        <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 3 }}>
                            <Button
                                startIcon={<InfoIcon />}
                                sx={{ fontWeight: 500, color: '#4A4A4A', '&:hover': { color: '#FF6B35' } }}
                                onClick={handleAboutClick}
                            >
                                About Us
                            </Button>
                            <Button
                                startIcon={<HowToRegIcon />}
                                sx={{ fontWeight: 500, color: '#4A4A4A', '&:hover': { color: '#FF6B35' } }}
                                onClick={handleHowItWorksClick}
                            >
                                How It Works
                            </Button>
                            <Button
                                startIcon={<CelebrationIcon />}
                                sx={{ fontWeight: 500, color: '#4A4A4A', '&:hover': { color: '#FF6B35' } }}
                                onClick={handleServicesClick}
                            >
                                Services
                            </Button>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            {/* Welcome Chip */}
                            <Chip
                                label={`Welcome, ${user.userName}`}
                                size="small"
                                sx={{
                                    display: { xs: 'none', sm: 'flex' },
                                    bgcolor: alpha('#FF6B35', 0.1),
                                    color: '#FF6B35',
                                    border: `1px solid ${alpha('#FF6B35', 0.2)}`
                                }}
                            />

                            {/* Saved Button with Bookmark Icon */}
                            <Tooltip title="Saved Services">
                                <IconButton
                                    onClick={handleFavoritesClick}
                                    sx={{
                                        position: 'relative',
                                        bgcolor: alpha('#FF6B35', 0.1),
                                        '&:hover': {
                                            bgcolor: alpha('#FF6B35', 0.2),
                                            transform: 'scale(1.05)'
                                        }
                                    }}
                                >
                                    <BookmarkIcon sx={{ color: '#FF6B35' }} />
                                    {favoritesCount > 0 && (
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                top: -5,
                                                right: -5,
                                                bgcolor: '#FF5722',
                                                color: 'white',
                                                borderRadius: '50%',
                                                width: 20,
                                                height: 20,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '11px',
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            {favoritesCount > 99 ? '99+' : favoritesCount}
                                        </Box>
                                    )}
                                </IconButton>
                            </Tooltip>

                            {/* Profile Icon */}
                            <IconButton
                                onClick={handleMenuOpen}
                                sx={{
                                    background: 'linear-gradient(135deg, #FF6B35 0%, #FFB347 100%)',
                                    width: 38,
                                    height: 38,
                                    '&:hover': { transform: 'scale(1.05)' }
                                }}
                            >
                                <Avatar sx={{ width: 38, height: 38, bgcolor: 'transparent', color: 'white' }}>
                                    {userInitial || <AccountCircleIcon />}
                                </Avatar>
                            </IconButton>

                            <Menu
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={handleMenuClose}
                                PaperProps={{
                                    sx: {
                                        bgcolor: '#FFFFFF',
                                        color: '#1A1A1A',
                                        border: '1px solid #E0E0E0',
                                        minWidth: 200,
                                        borderRadius: '16px',
                                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                                    }
                                }}
                            >
                                <MenuItem onClick={() => { handleMenuClose(); navigate('/profile'); }}>
                                    <PersonIcon sx={{ mr: 2, fontSize: 20, color: '#FF6B35' }} />
                                    Profile
                                </MenuItem>
                                {isAdmin && (
                                    <MenuItem onClick={handleAdminPanel}>
                                        <AdminPanelSettingsIcon sx={{ mr: 2, fontSize: 20, color: '#FF9800' }} />
                                        Admin Panel
                                    </MenuItem>
                                )}
                                <Divider />
                                <MenuItem onClick={handleLogout}>
                                    <LogoutIcon sx={{ mr: 2, fontSize: 20, color: '#FF6B35' }} />
                                    Logout
                                </MenuItem>
                            </Menu>
                        </Box>
                    </Box>
                </Container>
            </Box>

            {/* Main Content */}
            <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1, py: 5 }}>
                <Box sx={{ width: '100%' }}>
                    {/* Profile Header Card */}
                    <Card sx={{
                        background: '#FFFFFF',
                        borderRadius: '24px',
                        mb: 4,
                        overflow: 'hidden',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                        border: '1px solid #F0E8E0'
                    }}>
                        <Box sx={{
                            background: 'linear-gradient(135deg, #FF6B35 0%, #FFB347 100%)',
                            height: '100px',
                            position: 'relative'
                        }} />
                        <Box sx={{ display: 'flex', alignItems: 'flex-end', px: 4, pb: 3, position: 'relative', mt: -50 }}>
                            <Avatar sx={{
                                width: 100,
                                height: 100,
                                background: 'linear-gradient(135deg, #FF6B35 0%, #FFB347 100%)',
                                fontSize: '42px',
                                fontWeight: 'bold',
                                border: '4px solid #FFFFFF',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                            }}>
                                {user?.userName?.charAt(0).toUpperCase() || 'U'}
                            </Avatar>
                            <Box sx={{ ml: 3, mb: 1 }}>
                                <Typography variant="h4" sx={{ fontWeight: 700, color: '#2C2C2C', mb: 0.5 }}>
                                    {user?.userName || 'User'}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <EmailIcon sx={{ color: '#8A8A8A', fontSize: 16 }} />
                                    <Typography sx={{ color: '#6A6A6A', fontSize: '14px' }}>
                                        {user?.email || 'user@example.com'}
                                    </Typography>
                                </Box>
                            </Box>
                            <Box sx={{ ml: 'auto', mb: 1 }}>
                                <Chip
                                    icon={<VerifiedUserIcon sx={{ fontSize: 16 }} />}
                                    label="Verified Account"
                                    sx={{
                                        bgcolor: alpha('#4CAF50', 0.1),
                                        color: '#4CAF50',
                                        borderRadius: '20px',
                                        fontWeight: 500
                                    }}
                                />
                            </Box>
                        </Box>
                    </Card>

                    {/* Alerts */}
                    {error && (
                        <Fade in={!!error}>
                            <Alert
                                severity="error"
                                icon={<ErrorIcon />}
                                sx={{
                                    mb: 3,
                                    borderRadius: '16px',
                                    bgcolor: alpha('#f44336', 0.08),
                                    color: '#c62828',
                                    border: '1px solid #f44336'
                                }}
                            >
                                {error}
                            </Alert>
                        </Fade>
                    )}

                    {success && (
                        <Fade in={!!success}>
                            <Alert
                                severity="success"
                                icon={<CheckCircleIcon />}
                                sx={{
                                    mb: 3,
                                    borderRadius: '16px',
                                    bgcolor: alpha('#4CAF50', 0.08),
                                    color: '#2e7d32',
                                    border: '1px solid #4CAF50'
                                }}
                            >
                                {success}
                            </Alert>
                        </Fade>
                    )}

                    {/* Security Info Card */}
                    <Paper sx={{
                        p: 3,
                        mb: 4,
                        bgcolor: alpha('#FF6B35', 0.05),
                        borderRadius: '20px',
                        border: `1px solid ${alpha('#FF6B35', 0.2)}`,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        flexWrap: 'wrap'
                    }}>
                        <ShieldIcon sx={{ color: '#FF6B35', fontSize: 32 }} />
                        <Box sx={{ flex: 1 }}>
                            <Typography sx={{ color: '#2C2C2C', fontWeight: 600, mb: 0.5 }}>
                                Password Security Guidelines
                            </Typography>
                            <Typography sx={{ color: '#6A6A6A', fontSize: '13px' }}>
                                Password must be at least 8 characters long and contain: uppercase letter, lowercase letter, number, and special character (!@#$%^&*).
                            </Typography>
                        </Box>
                    </Paper>

                    {/* Password Change Form Card */}
                    <Card sx={{
                        background: '#FFFFFF',
                        borderRadius: '24px',
                        overflow: 'hidden',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                        border: '1px solid #F0E8E0'
                    }}>
                        <Box sx={{ p: 3, borderBottom: '1px solid #F0E8E0', bgcolor: '#FAFAFA' }}>
                            <Typography variant="h6" sx={{ fontWeight: 700, color: '#2C2C2C', display: 'flex', alignItems: 'center', gap: 1 }}>
                                <LockIcon sx={{ color: '#FF6B35' }} />
                                Change Password
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#8A8A8A', mt: 0.5 }}>
                                Update your password to keep your account secure
                            </Typography>
                        </Box>

                        <Box component="form" onSubmit={handleSubmit} sx={{ p: 3 }}>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        type={showOldPassword ? 'text' : 'password'}
                                        name="oldPassword"
                                        label="Current Password"
                                        value={formData.oldPassword}
                                        onChange={handleInputChange}
                                        required
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton onClick={() => setShowOldPassword(!showOldPassword)} edge="end" sx={{ color: '#8A8A8A' }}>
                                                        {showOldPassword ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                bgcolor: '#FAFAFA',
                                                borderRadius: '12px',
                                                '&:hover fieldset': { borderColor: '#FF6B35' },
                                                '&.Mui-focused fieldset': { borderColor: '#FF6B35' }
                                            },
                                            '& .MuiInputLabel-root': { color: '#8A8A8A', '&.Mui-focused': { color: '#FF6B35' } }
                                        }}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        type={showNewPassword ? 'text' : 'password'}
                                        name="newPassword"
                                        label="New Password"
                                        value={formData.newPassword}
                                        onChange={handleInputChange}
                                        required
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton onClick={() => setShowNewPassword(!showNewPassword)} edge="end" sx={{ color: '#8A8A8A' }}>
                                                        {showNewPassword ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                bgcolor: '#FAFAFA',
                                                borderRadius: '12px',
                                                '&:hover fieldset': { borderColor: '#FF6B35' },
                                                '&.Mui-focused fieldset': { borderColor: '#FF6B35' }
                                            },
                                            '& .MuiInputLabel-root': { color: '#8A8A8A', '&.Mui-focused': { color: '#FF6B35' } }
                                        }}
                                    />

                                    {formData.newPassword && (
                                        <Box sx={{ mt: 2 }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                                <Typography sx={{ color: '#6A6A6A', fontSize: '12px' }}>Password Strength:</Typography>
                                                <Typography sx={{ color: getPasswordStrengthColor(), fontSize: '12px', fontWeight: 600 }}>{getPasswordStrengthText()}</Typography>
                                            </Box>
                                            <Box sx={{ width: '100%', height: '4px', bgcolor: '#F0E8E0', borderRadius: '2px', overflow: 'hidden' }}>
                                                <Box sx={{ width: `${(passwordStrength.score / 5) * 100}%`, height: '100%', background: getPasswordStrengthColor(), transition: 'width 0.3s ease' }} />
                                            </Box>
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mt: 1.5 }}>
                                                <Chip label="8+ characters" size="small" sx={{
                                                    bgcolor: passwordStrength.hasMinLength ? alpha('#4CAF50', 0.1) : alpha('#f44336', 0.1),
                                                    color: passwordStrength.hasMinLength ? '#4CAF50' : '#f44336',
                                                    fontSize: '11px', height: '24px'
                                                }} />
                                                <Chip label="Uppercase" size="small" sx={{
                                                    bgcolor: passwordStrength.hasUpperCase ? alpha('#4CAF50', 0.1) : alpha('#f44336', 0.1),
                                                    color: passwordStrength.hasUpperCase ? '#4CAF50' : '#f44336',
                                                    fontSize: '11px', height: '24px'
                                                }} />
                                                <Chip label="Lowercase" size="small" sx={{
                                                    bgcolor: passwordStrength.hasLowerCase ? alpha('#4CAF50', 0.1) : alpha('#f44336', 0.1),
                                                    color: passwordStrength.hasLowerCase ? '#4CAF50' : '#f44336',
                                                    fontSize: '11px', height: '24px'
                                                }} />
                                                <Chip label="Number" size="small" sx={{
                                                    bgcolor: passwordStrength.hasNumber ? alpha('#4CAF50', 0.1) : alpha('#f44336', 0.1),
                                                    color: passwordStrength.hasNumber ? '#4CAF50' : '#f44336',
                                                    fontSize: '11px', height: '24px'
                                                }} />
                                                <Chip label="Special char" size="small" sx={{
                                                    bgcolor: passwordStrength.hasSpecialChar ? alpha('#4CAF50', 0.1) : alpha('#f44336', 0.1),
                                                    color: passwordStrength.hasSpecialChar ? '#4CAF50' : '#f44336',
                                                    fontSize: '11px', height: '24px'
                                                }} />
                                            </Box>
                                        </Box>
                                    )}
                                </Grid>

                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        name="confirmPassword"
                                        label="Confirm New Password"
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        required
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end" sx={{ color: '#8A8A8A' }}>
                                                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                bgcolor: '#FAFAFA',
                                                borderRadius: '12px',
                                                '&:hover fieldset': { borderColor: '#FF6B35' },
                                                '&.Mui-focused fieldset': { borderColor: '#FF6B35' }
                                            },
                                            '& .MuiInputLabel-root': { color: '#8A8A8A', '&.Mui-focused': { color: '#FF6B35' } }
                                        }}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                                        <Button
                                            variant="outlined"
                                            onClick={handleCancel}
                                            disabled={loading}
                                            startIcon={<CancelIcon />}
                                            sx={{
                                                py: 1.5,
                                                px: 4,
                                                borderColor: '#E0E0E0',
                                                color: '#8A8A8A',
                                                borderRadius: '30px',
                                                textTransform: 'none',
                                                fontWeight: 600,
                                                '&:hover': { borderColor: '#FF6B35', color: '#FF6B35', bgcolor: alpha('#FF6B35', 0.05) }
                                            }}
                                        >
                                            Reset
                                        </Button>
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            disabled={loading}
                                            startIcon={loading ? <CircularProgress size={20} sx={{ color: 'white' }} /> : <SaveIcon />}
                                            sx={{
                                                py: 1.5,
                                                px: 4,
                                                background: 'linear-gradient(135deg, #FF6B35 0%, #FFB347 100%)',
                                                borderRadius: '30px',
                                                textTransform: 'none',
                                                fontWeight: 600,
                                                boxShadow: '0 4px 12px rgba(255,107,53,0.25)',
                                                '&:hover': { transform: 'translateY(-1px)', boxShadow: '0 6px 16px rgba(255,107,53,0.35)' }
                                            }}
                                        >
                                            {loading ? 'Updating...' : 'Change Password'}
                                        </Button>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Box>
                    </Card>

                    {/* Security Tips Card */}
                    <Card sx={{
                        mt: 3,
                        background: '#FFFFFF',
                        borderRadius: '20px',
                        border: '1px solid #F0E8E0',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
                    }}>
                        <Box sx={{ p: 2.5, display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                            <SecurityIcon sx={{ color: '#FFB347', fontSize: 28 }} />
                            <Box sx={{ flex: 1 }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#2C2C2C', mb: 0.5 }}>
                                    Security Tips
                                </Typography>
                                <Typography variant="caption" sx={{ color: '#8A8A8A', display: 'block' }}>
                                    • Use a unique password that you don't use for other services<br />
                                    • Never share your password with anyone<br />
                                    • Consider changing your password regularly
                                </Typography>
                            </Box>
                        </Box>
                    </Card>
                </Box>
            </Container>

            {/* Snackbar */}
            <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{
                    bgcolor: '#FFFFFF',
                    color: '#1A1A1A',
                    borderRadius: '16px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    borderLeft: `4px solid ${snackbar.severity === 'success' ? '#4CAF50' : '#FF6B35'}`
                }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default ProfilePage;