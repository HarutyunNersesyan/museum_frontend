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
    MenuItem
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
    KeyboardArrowDown as KeyboardArrowDownIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { alpha } from '@mui/material/styles';

const ProfilePage = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

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
    const [language, setLanguage] = useState('ENG');
    const [languageMenuAnchor, setLanguageMenuAnchor] = useState(null);
    const [backgroundPosition, setBackgroundPosition] = useState({ x: 0, y: 0 });

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

    const languages = [
        { code: 'ENG', name: 'English', flag: 'https://flagcdn.com/w40/us.png' },
        { code: 'ARM', name: 'Armenian', flag: 'https://flagcdn.com/w40/am.png' },
        { code: 'RUS', name: 'Russian', flag: 'https://flagcdn.com/w40/ru.png' }
    ];

    useEffect(() => {
        if (user && user.userName) {
            setUserInitial(user.userName.charAt(0).toUpperCase());
        }
    }, [user]);

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

    const handleLanguageClick = (event) => {
        setLanguageMenuAnchor(event.currentTarget);
    };

    const handleLanguageClose = () => {
        setLanguageMenuAnchor(null);
    };

    const handleLanguageSelect = (langCode) => {
        setLanguage(langCode);
        handleLanguageClose();
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

    const handleDashboard = () => {
        handleMenuClose();
        navigate('/');
    };

    const handleScrollToSection = (sectionId) => {
        navigate('/');
        setTimeout(() => {
            const section = document.getElementById(sectionId);
            if (section) {
                section.scrollIntoView({ behavior: 'smooth' });
            }
        }, 100);
    };

    const handleAboutClick = () => {
        navigate('/about');
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
                background: '#0A0A0A'
            }}>
                <CircularProgress sx={{ color: '#4CAF50' }} />
            </Box>
        );
    }

    return (
        <Box sx={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #0A0A0A 0%, #1A1A1A 100%)',
            color: '#FFFFFF',
            fontFamily: "'Inter', sans-serif",
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Animated Background */}
            <Box sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 0,
                background: `
                    radial-gradient(circle at ${backgroundPosition.x * 100}% ${backgroundPosition.y * 100}%, ${alpha('#009688', 0.15)} 0%, transparent 50%),
                    radial-gradient(circle at ${100 - backgroundPosition.x * 100}% ${100 - backgroundPosition.y * 100}%, ${alpha('#4CAF50', 0.15)} 0%, transparent 50%),
                    #0A0A0A
                `,
                transition: 'background 0.3s ease-out'
            }} />

            {/* Floating particles */}
            <Box sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 0,
                pointerEvents: 'none',
                opacity: 0.5
            }}>
                {[...Array(20)].map((_, i) => (
                    <Box
                        key={i}
                        sx={{
                            position: 'absolute',
                            width: '3px',
                            height: '3px',
                            background: i % 2 === 0 ? alpha('#009688', 0.5) : alpha('#4CAF50', 0.5),
                            borderRadius: '50%',
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            animation: `float ${15 + Math.random() * 10}s infinite ${i * 0.5}s ease-in-out`,
                            boxShadow: `0 0 20px ${i % 2 === 0 ? alpha('#009688', 0.5) : alpha('#4CAF50', 0.5)}`
                        }}
                    />
                ))}
            </Box>

            <style>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0) translateX(0); }
                    25% { transform: translateY(-20px) translateX(10px); }
                    50% { transform: translateY(-40px) translateX(-10px); }
                    75% { transform: translateY(-20px) translateX(10px); }
                }
                @keyframes pulse {
                    0%, 100% { opacity: 0.5; transform: scale(1); }
                    50% { opacity: 0.8; transform: scale(1.1); }
                }
                @keyframes gradient {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
            `}</style>

            {/* Header */}
            <Box component="header" sx={{
                position: 'sticky',
                top: 0,
                zIndex: 1000,
                backgroundColor: alpha('#0A0A0A', 0.95),
                backdropFilter: 'blur(10px)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
                <Box sx={{ padding: '0 24px' }}>
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        height: '80px',
                        maxWidth: '1280px',
                        margin: '0 auto'
                    }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <Box onClick={() => navigate('/')} sx={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '12px',
                                background: 'linear-gradient(135deg, #009688 0%, #4CAF50 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                animation: 'pulse 3s infinite',
                                cursor: 'pointer'
                            }}>
                                <LockIcon sx={{ color: 'white', fontSize: 24 }} />
                            </Box>
                            <Typography variant="h6" onClick={() => navigate('/')} sx={{
                                fontWeight: 700,
                                background: 'linear-gradient(135deg, #009688 0%, #4CAF50 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                cursor: 'pointer'
                            }}>
                                VeilVision
                            </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
                            <Button onClick={() => navigate('/')} sx={{ fontWeight: 500, fontSize: '16px', color: '#FFFFFF' }}>Home</Button>
                            <Button onClick={handleAboutClick} sx={{ fontWeight: 500, fontSize: '16px', color: '#FFFFFF' }}>About Us</Button>
                            <Button onClick={handleServicesClick} sx={{ fontWeight: 500, fontSize: '16px', color: '#FFFFFF' }}>Services</Button>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <Box onClick={handleLanguageClick} sx={{
                                display: 'flex',
                                alignItems: 'center',
                                cursor: 'pointer',
                                padding: '8px 12px',
                                borderRadius: '8px',
                                transition: 'background-color 0.3s ease',
                                '&:hover': { backgroundColor: alpha('#FFFFFF', 0.1) }
                            }}>
                                <img src={languages.find(l => l.code === language)?.flag || languages[0].flag} alt={language}
                                     style={{ width: '24px', height: '16px', borderRadius: '2px', marginRight: '8px' }} />
                                <Typography sx={{ color: '#FFFFFF', fontSize: '14px', fontWeight: 500 }}>{language}</Typography>
                                <KeyboardArrowDownIcon sx={{ color: '#9CA3AF', fontSize: 18, ml: 0.5 }} />
                            </Box>

                            {user ? (
                                <>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Typography sx={{ color: alpha('#FFFFFF', 0.8), fontWeight: 500, fontSize: '14px', display: { xs: 'none', md: 'block' } }}>
                                            Welcome back,
                                        </Typography>
                                        <IconButton onClick={handleMenuOpen} sx={{
                                            color: '#FFFFFF',
                                            background: 'linear-gradient(135deg, #009688 0%, #4CAF50 100%)',
                                            width: '40px',
                                            height: '40px'
                                        }}>
                                            {userInitial ? <Typography sx={{ fontWeight: 600 }}>{userInitial}</Typography> : <AccountCircleIcon />}
                                        </IconButton>
                                    </Box>
                                    <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}
                                          PaperProps={{ sx: { backgroundColor: '#121212', color: '#FFFFFF', border: '1px solid #242424', minWidth: '200px' } }}>
                                        <MenuItem onClick={handleDashboard}><SecurityIcon sx={{ mr: 2, color: '#009688' }} />Dashboard</MenuItem>
                                        <MenuItem onClick={handleServicesClick}><CelebrationIcon sx={{ mr: 2, color: '#009688' }} />Services</MenuItem>
                                        <MenuItem onClick={() => navigate('/profile')}><PersonIcon sx={{ mr: 2, color: '#009688' }} />Profile</MenuItem>
                                        <Divider sx={{ borderColor: '#242424' }} />
                                        <MenuItem onClick={handleLogout}><LogoutIcon sx={{ mr: 2, color: '#f44336' }} />Logout</MenuItem>
                                    </Menu>
                                </>
                            ) : null}
                        </Box>
                    </Box>
                </Box>
            </Box>

            <Menu anchorEl={languageMenuAnchor} open={Boolean(languageMenuAnchor)} onClose={handleLanguageClose}
                  PaperProps={{ sx: { backgroundColor: '#121212', color: '#FFFFFF', border: '1px solid #242424', minWidth: '150px' } }}>
                {languages.map((lang) => (
                    <MenuItem key={lang.code} onClick={() => handleLanguageSelect(lang.code)} selected={language === lang.code}>
                        <img src={lang.flag} alt={lang.code} style={{ width: '20px', height: '15px', borderRadius: '2px', marginRight: '8px' }} />
                        {lang.code} - {lang.name}
                    </MenuItem>
                ))}
            </Menu>

            {/* Main Content */}
            <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1, py: 4, mt: 2 }}>
                <Box sx={{ width: '100%' }}>
                    {/* Header - Avatar and User Info */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 4 }}>
                        <Avatar sx={{
                            width: 80,
                            height: 80,
                            background: 'linear-gradient(135deg, #009688 0%, #4CAF50 100%)',
                            fontSize: '32px',
                            fontWeight: 'bold'
                        }}>
                            {user?.userName?.charAt(0).toUpperCase() || 'U'}
                        </Avatar>
                        <Box>
                            <Typography variant="h4" sx={{ fontSize: { xs: '24px', md: '28px' }, fontWeight: 700, color: '#FFFFFF', mb: 0.5 }}>
                                {user?.userName || 'User'}
                            </Typography>
                            <Typography sx={{ color: alpha('#FFFFFF', 0.7), fontSize: '16px' }}>
                                {user?.email || 'user@example.com'}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                                <SecurityIcon sx={{ color: '#4CAF50', fontSize: 16 }} />
                                <Typography sx={{ color: alpha('#FFFFFF', 0.5), fontSize: '12px' }}>
                                    Account Security
                                </Typography>
                            </Box>
                        </Box>
                    </Box>

                    <Divider sx={{ borderColor: alpha('#FFFFFF', 0.1), mb: 4 }} />

                    {/* Alerts */}
                    {error && (
                        <Fade in={!!error}>
                            <Alert severity="error" icon={<ErrorIcon />} sx={{
                                mb: 3, borderRadius: '12px', bgcolor: alpha('#f44336', 0.1), color: '#FFFFFF', border: '1px solid #f44336'
                            }}>
                                {error}
                            </Alert>
                        </Fade>
                    )}

                    {success && (
                        <Fade in={!!success}>
                            <Alert severity="success" icon={<CheckCircleIcon />} sx={{
                                mb: 3, borderRadius: '12px', bgcolor: alpha('#4CAF50', 0.1), color: '#FFFFFF', border: '1px solid #4CAF50'
                            }}>
                                {success}
                            </Alert>
                        </Fade>
                    )}

                    {/* Security Info */}
                    <Paper sx={{
                        p: 2, mb: 4, background: alpha('#009688', 0.1), borderRadius: '12px', border: `1px solid ${alpha('#009688', 0.3)}`,
                        display: 'flex', alignItems: 'center', gap: 2
                    }}>
                        <InfoIcon sx={{ color: '#009688', fontSize: 24 }} />
                        <Typography sx={{ color: alpha('#FFFFFF', 0.9), fontSize: '14px' }}>
                            Password must be at least 8 characters long and contain: uppercase, lowercase, number, and special character.
                        </Typography>
                    </Paper>

                    {/* Password Change Form */}
                    <Box component="form" onSubmit={handleSubmit}>
                        <Typography variant="h6" sx={{ color: '#FFFFFF', fontWeight: 600, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <LockIcon sx={{ color: '#009688' }} />
                            Change Password
                        </Typography>

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
                                                <IconButton onClick={() => setShowOldPassword(!showOldPassword)} edge="end" sx={{ color: '#9CA3AF' }}>
                                                    {showOldPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{ '& .MuiOutlinedInput-root': { background: '#1A1A1A', color: '#FFFFFF' }, '& .MuiInputLabel-root': { color: '#9CA3AF' } }}
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
                                                <IconButton onClick={() => setShowNewPassword(!showNewPassword)} edge="end" sx={{ color: '#9CA3AF' }}>
                                                    {showNewPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{ '& .MuiOutlinedInput-root': { background: '#1A1A1A', color: '#FFFFFF' }, '& .MuiInputLabel-root': { color: '#9CA3AF' } }}
                                />

                                {formData.newPassword && (
                                    <Box sx={{ mt: 2 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                            <Typography sx={{ color: alpha('#FFFFFF', 0.7), fontSize: '12px' }}>Password Strength:</Typography>
                                            <Typography sx={{ color: getPasswordStrengthColor(), fontSize: '12px', fontWeight: 600 }}>{getPasswordStrengthText()}</Typography>
                                        </Box>
                                        <Box sx={{ width: '100%', height: '4px', background: alpha('#FFFFFF', 0.1), borderRadius: '2px', overflow: 'hidden' }}>
                                            <Box sx={{ width: `${(passwordStrength.score / 5) * 100}%`, height: '100%', background: getPasswordStrengthColor(), transition: 'width 0.3s ease' }} />
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
                                                <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end" sx={{ color: '#9CA3AF' }}>
                                                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{ '& .MuiOutlinedInput-root': { background: '#1A1A1A', color: '#FFFFFF' }, '& .MuiInputLabel-root': { color: '#9CA3AF' } }}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                                    <Button variant="outlined" onClick={handleCancel} disabled={loading} startIcon={<CancelIcon />}
                                            sx={{ py: 1.5, px: 3, borderColor: alpha('#FFFFFF', 0.2), color: '#FFFFFF', borderRadius: '12px' }}>
                                        Reset
                                    </Button>
                                    <Button type="submit" variant="contained" disabled={loading} startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                                            sx={{ py: 1.5, px: 3, background: 'linear-gradient(135deg, #009688 0%, #4CAF50 100%)', borderRadius: '12px' }}>
                                        {loading ? 'Updating...' : 'Change Password'}
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>

                    {/* Additional Info */}
                    <Box sx={{ mt: 4, p: 2, background: alpha('#009688', 0.05), borderRadius: '12px', border: `1px solid ${alpha('#009688', 0.2)}` }}>
                        <Typography sx={{ color: alpha('#FFFFFF', 0.7), fontSize: '13px', display: 'flex', alignItems: 'center', gap: 1 }}>
                            <SecurityIcon sx={{ color: '#009688', fontSize: 16 }} />
                            For your security, we recommend using a strong, unique password that you don't use for other services.
                        </Typography>
                    </Box>
                </Box>
            </Container>

            {/* Snackbar */}
            <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}
                       sx={{ backgroundColor: '#121212', color: '#FFFFFF', border: `1px solid ${snackbar.severity === 'success' ? '#4CAF50' : '#f44336'}` }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default ProfilePage;