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
    GlobalStyles,
    Modal,
    Stack
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
    Museum as MuseumIcon,
    Event as EventIcon,
    LocationOn as LocationOnIcon,
    AccessTime as AccessTimeIcon,
    Phone as PhoneIcon,
    Star as StarIcon,
    StarBorder as StarBorderIcon,
    ArrowBack as ArrowBackIcon,
    VpnKey as VpnKeyIcon,
    Password as PasswordIcon
} from '@mui/icons-material';
import { alpha as alphaMUI, keyframes } from '@mui/material/styles';
import { useAuth } from '../context/AuthContext';
import LoginPage from './LoginPage';
import SignUpPage from './SignUpPage';
import VerifyCodePage from './VerifyCodePage';

// Custom animations
const pulse = keyframes`
    0%, 100% { opacity: 0.4; transform: scale(1); }
    50% { opacity: 0.7; transform: scale(1.05); }
`;

const slideIn = keyframes`
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
`;

// Warm brown color palette (same as HomePage)
const colors = {
    primary: '#C4A484',
    primaryDark: '#A0522D',
    primaryLight: '#D2B48C',
    secondary: '#8B7355',
    background: '#FFF8F0',
    surface: '#FFFDF7',
    text: '#4A3728',
    textLight: '#7A5C4A',
    border: '#E8D5B7',
    gradient: 'linear-gradient(135deg, #C4A484 0%, #D2B48C 50%, #DEB887 100%)',
    error: '#f44336'
};

// Scrollbar styles
const scrollbarStyles = {
    '*::-webkit-scrollbar': { width: '8px', height: '8px' },
    '*::-webkit-scrollbar-track': { background: '#E8D5B7', borderRadius: '10px' },
    '*::-webkit-scrollbar-thumb': { background: '#C4A484', borderRadius: '10px', '&:hover': { background: '#A0522D' } },
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
    const [loginModalOpen, setLoginModalOpen] = useState(false);
    const [signupModalOpen, setSignupModalOpen] = useState(false);
    const [verifyModalOpen, setVerifyModalOpen] = useState(false);
    const [verifyEmail, setVerifyEmail] = useState('');
    const [activeTab, setActiveTab] = useState('profile'); // 'profile' or 'security'

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

    const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);

    const handleLogout = async () => {
        await logout();
        handleMenuClose();
        navigate('/');
    };

    const handleEventsClick = () => {
        if (!user) {
            setLoginModalOpen(true);
            return;
        }
        handleMenuClose();
        navigate('/events');
    };

    const handleHomeClick = () => navigate('/');
    const handleAboutClick = () => navigate('/about');
    const handleHowItWorksClick = () => {
        navigate('/');
        setTimeout(() => {
            const element = document.getElementById('how-it-works');
            if (element) element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    const handleAdminPanel = () => {
        handleMenuClose();
        navigate('/admin/dashboard');
    };

    const handleProfile = () => {
        handleMenuClose();
        navigate('/profile');
    };

    const handleLoginModalClose = () => setLoginModalOpen(false);
    const handleSignupModalOpen = () => setSignupModalOpen(true);
    const handleSignupModalClose = () => setSignupModalOpen(false);
    const handleSwitchToSignup = () => {
        handleLoginModalClose();
        setTimeout(() => handleSignupModalOpen(), 100);
    };
    const handleSwitchToLogin = () => {
        handleSignupModalClose();
        setTimeout(() => setLoginModalOpen(true), 100);
    };
    const handleVerifyModalOpen = (email) => {
        setVerifyEmail(email);
        setVerifyModalOpen(true);
    };
    const handleVerifyModalClose = () => {
        setVerifyModalOpen(false);
        setVerifyEmail('');
    };
    const handleSignupSuccess = (email) => {
        handleSignupModalClose();
        setTimeout(() => handleVerifyModalOpen(email), 100);
    };
    const handleVerificationSuccess = () => {
        handleVerifyModalClose();
        setTimeout(() => setLoginModalOpen(true), 300);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
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
        if (!validateForm()) return;

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
            setSnackbar({ open: true, message: 'Password updated successfully!', severity: 'success' });
            setFormData({ oldPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            let errorMessage = err.message;
            if (errorMessage.includes('Invalid old password')) errorMessage = 'Current password is incorrect';
            else if (errorMessage.includes('new password cannot be the same')) errorMessage = 'New password cannot be the same as current password';
            else if (errorMessage.includes('Email must be verified')) errorMessage = 'Your email must be verified to change password';

            setError(errorMessage);
            setSnackbar({ open: true, message: errorMessage, severity: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setFormData({ oldPassword: '', newPassword: '', confirmPassword: '' });
        setError('');
        setSuccess('');
    };

    const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

    const getPasswordStrengthColor = () => {
        const score = passwordStrength.score;
        if (score <= 2) return '#f44336';
        if (score === 3) return '#ff9800';
        return '#4caf50';
    };

    const getPasswordStrengthText = () => {
        const score = passwordStrength.score;
        if (score <= 2) return 'Weak';
        if (score === 3) return 'Medium';
        return 'Strong';
    };

    if (!user) {
        return (
            <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #FFF8F0 0%, #F5EDE3 100%)' }}>
                <CircularProgress sx={{ color: colors.primary }} />
            </Box>
        );
    }

    return (
        <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #FFF8F0 0%, #F5EDE3 100%)', position: 'relative', overflowX: 'hidden' }}>
            <GlobalStyles styles={scrollbarStyles} />

            {/* Animated Background */}
            <Box sx={{
                position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0,
                background: `
                    radial-gradient(circle at ${backgroundPosition.x * 100}% ${backgroundPosition.y * 100}%, rgba(196,164,132,0.08) 0%, transparent 50%),
                    radial-gradient(circle at ${100 - backgroundPosition.x * 100}% ${100 - backgroundPosition.y * 100}%, rgba(210,180,140,0.08) 0%, transparent 50%)
                `,
                transition: 'background 0.3s ease-out'
            }} />

            {/* Floating circles */}
            <Box sx={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1, pointerEvents: 'none', overflow: 'hidden' }}>
                {[...Array(8)].map((_, idx) => (
                    <Box key={`bg-circle-${idx}`} sx={{
                        position: 'absolute',
                        top: `${(idx * 15) % 100}%`,
                        left: `${(idx * 20) % 100}%`,
                        width: `${100 + (idx * 30)}px`,
                        height: `${100 + (idx * 30)}px`,
                        borderRadius: '50%',
                        background: `radial-gradient(circle, ${alphaMUI(['#C4A484', '#D2B48C', '#DEB887'][idx % 3], 0.05)} 0%, transparent 70%)`,
                        animation: `${pulse} ${10 + idx}s ease-in-out infinite`,
                        pointerEvents: 'none'
                    }} />
                ))}
            </Box>

            {/* Header */}
            <Box sx={{
                position: 'sticky', top: 0, zIndex: 100, backgroundColor: alphaMUI('#FFFDF7', 0.95),
                backdropFilter: 'blur(10px)', borderBottom: `1px solid ${colors.border}`
            }}>
                <Container maxWidth="xl">
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 70 }}>
                        <Box onClick={handleHomeClick} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, cursor: 'pointer' }}>
                            <Box sx={{ width: 38, height: 38, borderRadius: '12px', background: colors.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <MuseumIcon sx={{ color: 'white', fontSize: 22 }} />
                            </Box>
                            <Typography variant="h6" sx={{ fontWeight: 800, background: colors.gradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                Museum
                            </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <Button startIcon={<EventIcon />} onClick={handleEventsClick} sx={{ fontWeight: 500, color: colors.textLight, '&:hover': { color: colors.primary } }}>
                                Events
                            </Button>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Chip label={`Welcome, ${user.userName}`} size="small" sx={{ display: { xs: 'none', sm: 'flex' }, bgcolor: alphaMUI(colors.primary, 0.1), color: colors.primary }} />
                                <IconButton onClick={handleMenuOpen} sx={{ background: colors.gradient, width: 38, height: 38 }}>
                                    <Avatar sx={{ width: 38, height: 38, bgcolor: 'transparent', color: 'white' }}>{userInitial || <AccountCircleIcon />}</Avatar>
                                </IconButton>
                                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose} PaperProps={{ sx: { bgcolor: '#FFFDF7', border: `1px solid ${colors.border}`, borderRadius: '16px' } }}>
                                    <MenuItem onClick={handleProfile}><PersonIcon sx={{ mr: 2, color: colors.primary }} />Profile</MenuItem>
                                    {isAdmin && <MenuItem onClick={handleAdminPanel}><AdminPanelSettingsIcon sx={{ mr: 2, color: colors.primaryDark }} />Admin Panel</MenuItem>}
                                    <Divider />
                                    <MenuItem onClick={handleLogout}><LogoutIcon sx={{ mr: 2, color: colors.error }} />Logout</MenuItem>
                                </Menu>
                            </Box>
                        </Box>
                    </Box>
                </Container>
            </Box>

            {/* Main Content - NEW LAYOUT with Sidebar Arrow */}
            <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 3, py: 4 }}>
                <Box sx={{ animation: `${slideIn} 0.5s ease-out` }}>
                    {/* Page Title with Back Arrow */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
                        <IconButton
                            onClick={handleHomeClick}
                            sx={{
                                color: colors.primary,
                                bgcolor: alphaMUI(colors.primary, 0.1),
                                '&:hover': { bgcolor: alphaMUI(colors.primary, 0.2) }
                            }}
                        >
                            <ArrowBackIcon />
                        </IconButton>
                        <Box>
                            <Typography variant="h4" sx={{ fontWeight: 700, color: colors.text }}>
                                My Profile
                            </Typography>
                            <Typography variant="body1" sx={{ color: colors.textLight }}>
                                Manage your account settings and security preferences
                            </Typography>
                        </Box>
                    </Box>

                    <Grid container spacing={4}>
                        {/* Sidebar - Profile Menu */}
                        <Grid item xs={12} md={4}>
                            <Card sx={{
                                background: alphaMUI('#FFFDF7', 0.95),
                                borderRadius: '20px',
                                border: `1px solid ${colors.border}`,
                                overflow: 'hidden',
                                position: 'sticky',
                                top: 90
                            }}>
                                {/* Profile Summary */}
                                <Box sx={{ textAlign: 'center', p: 3, borderBottom: `1px solid ${colors.border}` }}>
                                    <Avatar sx={{
                                        width: 100, height: 100, margin: '0 auto', mb: 2,
                                        background: colors.gradient, fontSize: 48, fontWeight: 'bold'
                                    }}>
                                        {user?.userName?.charAt(0).toUpperCase() || 'U'}
                                    </Avatar>
                                    <Typography variant="h6" sx={{ fontWeight: 600, color: colors.text }}>
                                        {user?.userName || 'User'}
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, mt: 0.5 }}>
                                        <EmailIcon sx={{ color: colors.textLight, fontSize: 14 }} />
                                        <Typography variant="body2" sx={{ color: colors.textLight }}>
                                            {user?.email || 'user@example.com'}
                                        </Typography>
                                    </Box>
                                    <Chip
                                        icon={<VerifiedUserIcon sx={{ fontSize: 14 }} />}
                                        label="Verified Account"
                                        size="small"
                                        sx={{ mt: 1.5, bgcolor: alphaMUI('#4CAF50', 0.1), color: '#4CAF50' }}
                                    />
                                </Box>

                                {/* Menu Items */}
                                <Stack sx={{ p: 1 }}>
                                    <Button
                                        fullWidth
                                        startIcon={<PersonIcon />}
                                        onClick={() => setActiveTab('profile')}
                                        sx={{
                                            justifyContent: 'flex-start',
                                            px: 2, py: 1.5,
                                            borderRadius: '12px',
                                            mb: 0.5,
                                            bgcolor: activeTab === 'profile' ? alphaMUI(colors.primary, 0.1) : 'transparent',
                                            color: activeTab === 'profile' ? colors.primary : colors.textLight,
                                            '&:hover': { bgcolor: alphaMUI(colors.primary, 0.08) }
                                        }}
                                    >
                                        Profile Information
                                    </Button>
                                    <Button
                                        fullWidth
                                        startIcon={<SecurityIcon />}
                                        onClick={() => setActiveTab('security')}
                                        sx={{
                                            justifyContent: 'flex-start',
                                            px: 2, py: 1.5,
                                            borderRadius: '12px',
                                            bgcolor: activeTab === 'security' ? alphaMUI(colors.primary, 0.1) : 'transparent',
                                            color: activeTab === 'security' ? colors.primary : colors.textLight,
                                            '&:hover': { bgcolor: alphaMUI(colors.primary, 0.08) }
                                        }}
                                    >
                                        Security & Password
                                    </Button>
                                </Stack>
                            </Card>
                        </Grid>

                        {/* Main Content Area */}
                        <Grid item xs={12} md={8}>
                            {activeTab === 'profile' ? (
                                // Profile Information Tab
                                <Card sx={{
                                    background: alphaMUI('#FFFDF7', 0.95),
                                    borderRadius: '20px',
                                    border: `1px solid ${colors.border}`,
                                    overflow: 'hidden'
                                }}>
                                    <Box sx={{ p: 3, borderBottom: `1px solid ${colors.border}`, bgcolor: alphaMUI(colors.surface, 0.5) }}>
                                        <Typography variant="h6" sx={{ fontWeight: 600, color: colors.text }}>
                                            Profile Information
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: colors.textLight }}>
                                            Your personal information
                                        </Typography>
                                    </Box>
                                    <Box sx={{ p: 3 }}>
                                        <Stack spacing={3}>
                                            <Box>
                                                <Typography variant="subtitle2" sx={{ color: colors.text, mb: 1, fontWeight: 600 }}>
                                                    Username
                                                </Typography>
                                                <Paper sx={{ p: 2, bgcolor: alphaMUI(colors.background, 0.5), borderRadius: '12px' }}>
                                                    <Typography variant="body1" sx={{ color: colors.text }}>
                                                        {user?.userName || 'User'}
                                                    </Typography>
                                                </Paper>
                                            </Box>
                                            <Box>
                                                <Typography variant="subtitle2" sx={{ color: colors.text, mb: 1, fontWeight: 600 }}>
                                                    Email Address
                                                </Typography>
                                                <Paper sx={{ p: 2, bgcolor: alphaMUI(colors.background, 0.5), borderRadius: '12px' }}>
                                                    <Typography variant="body1" sx={{ color: colors.text }}>
                                                        {user?.email || 'user@example.com'}
                                                    </Typography>
                                                </Paper>
                                            </Box>
                                            <Box>
                                                <Typography variant="subtitle2" sx={{ color: colors.text, mb: 1, fontWeight: 600 }}>
                                                    Account Type
                                                </Typography>
                                                <Paper sx={{ p: 2, bgcolor: alphaMUI(colors.background, 0.5), borderRadius: '12px' }}>
                                                    <Chip
                                                        label={isAdmin ? "Administrator" : "Regular User"}
                                                        sx={{
                                                            bgcolor: isAdmin ? alphaMUI(colors.primary, 0.1) : alphaMUI('#4CAF50', 0.1),
                                                            color: isAdmin ? colors.primary : '#4CAF50'
                                                        }}
                                                    />
                                                </Paper>
                                            </Box>
                                            <Box sx={{ pt: 2 }}>
                                                <Button
                                                    variant="outlined"
                                                    startIcon={<LockIcon />}
                                                    onClick={() => setActiveTab('security')}
                                                    sx={{
                                                        borderColor: colors.border,
                                                        color: colors.primary,
                                                        '&:hover': { borderColor: colors.primary, bgcolor: alphaMUI(colors.primary, 0.05) }
                                                    }}
                                                >
                                                    Change Password
                                                </Button>
                                            </Box>
                                        </Stack>
                                    </Box>
                                </Card>
                            ) : (
                                // Security & Password Tab
                                <Card sx={{
                                    background: alphaMUI('#FFFDF7', 0.95),
                                    borderRadius: '20px',
                                    border: `1px solid ${colors.border}`,
                                    overflow: 'hidden'
                                }}>
                                    <Box sx={{ p: 3, borderBottom: `1px solid ${colors.border}`, bgcolor: alphaMUI(colors.surface, 0.5) }}>
                                        <Typography variant="h6" sx={{ fontWeight: 600, color: colors.text, display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <VpnKeyIcon sx={{ color: colors.primary }} />
                                            Change Password
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: colors.textLight }}>
                                            Update your password to keep your account secure
                                        </Typography>
                                    </Box>

                                    <Box sx={{ p: 3 }}>
                                        {error && (
                                            <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }} onClose={() => setError('')}>
                                                {error}
                                            </Alert>
                                        )}
                                        {success && (
                                            <Alert severity="success" sx={{ mb: 3, borderRadius: '12px' }} onClose={() => setSuccess('')}>
                                                {success}
                                            </Alert>
                                        )}

                                        {/* Security Info Banner */}
                                        <Paper sx={{ p: 2, mb: 3, bgcolor: alphaMUI(colors.primary, 0.05), borderRadius: '12px', display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                            <ShieldIcon sx={{ color: colors.primary }} />
                                            <Typography variant="caption" sx={{ color: colors.textLight }}>
                                                Password must be at least 8 characters with uppercase, lowercase, number, and special character
                                            </Typography>
                                        </Paper>

                                        <form onSubmit={handleSubmit}>
                                            <Stack spacing={3}>
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
                                                                <IconButton onClick={() => setShowOldPassword(!showOldPassword)} edge="end">
                                                                    {showOldPassword ? <VisibilityOff /> : <Visibility />}
                                                                </IconButton>
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                                                />

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
                                                                <IconButton onClick={() => setShowNewPassword(!showNewPassword)} edge="end">
                                                                    {showNewPassword ? <VisibilityOff /> : <Visibility />}
                                                                </IconButton>
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                                                />

                                                {formData.newPassword && (
                                                    <Box>
                                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                                            <Typography variant="caption" sx={{ color: colors.textLight }}>Password Strength:</Typography>
                                                            <Typography variant="caption" sx={{ color: getPasswordStrengthColor(), fontWeight: 600 }}>{getPasswordStrengthText()}</Typography>
                                                        </Box>
                                                        <Box sx={{ width: '100%', height: '4px', bgcolor: colors.border, borderRadius: '2px', overflow: 'hidden' }}>
                                                            <Box sx={{ width: `${(passwordStrength.score / 5) * 100}%`, height: '100%', background: getPasswordStrengthColor(), transition: 'width 0.3s' }} />
                                                        </Box>
                                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1.5 }}>
                                                            <Chip label="8+ chars" size="small" sx={{ bgcolor: passwordStrength.hasMinLength ? alphaMUI('#4CAF50', 0.1) : alphaMUI(colors.error, 0.1), color: passwordStrength.hasMinLength ? '#4CAF50' : colors.error, fontSize: '10px', height: '22px' }} />
                                                            <Chip label="Uppercase" size="small" sx={{ bgcolor: passwordStrength.hasUpperCase ? alphaMUI('#4CAF50', 0.1) : alphaMUI(colors.error, 0.1), color: passwordStrength.hasUpperCase ? '#4CAF50' : colors.error, fontSize: '10px', height: '22px' }} />
                                                            <Chip label="Lowercase" size="small" sx={{ bgcolor: passwordStrength.hasLowerCase ? alphaMUI('#4CAF50', 0.1) : alphaMUI(colors.error, 0.1), color: passwordStrength.hasLowerCase ? '#4CAF50' : colors.error, fontSize: '10px', height: '22px' }} />
                                                            <Chip label="Number" size="small" sx={{ bgcolor: passwordStrength.hasNumber ? alphaMUI('#4CAF50', 0.1) : alphaMUI(colors.error, 0.1), color: passwordStrength.hasNumber ? '#4CAF50' : colors.error, fontSize: '10px', height: '22px' }} />
                                                            <Chip label="Special char" size="small" sx={{ bgcolor: passwordStrength.hasSpecialChar ? alphaMUI('#4CAF50', 0.1) : alphaMUI(colors.error, 0.1), color: passwordStrength.hasSpecialChar ? '#4CAF50' : colors.error, fontSize: '10px', height: '22px' }} />
                                                        </Box>
                                                    </Box>
                                                )}

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
                                                                <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                                                                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                                                </IconButton>
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                                                />

                                                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                                                    <Button
                                                        variant="outlined"
                                                        onClick={handleCancel}
                                                        disabled={loading}
                                                        startIcon={<CancelIcon />}
                                                        sx={{ borderRadius: '30px', textTransform: 'none', px: 4 }}
                                                    >
                                                        Cancel
                                                    </Button>
                                                    <Button
                                                        type="submit"
                                                        variant="contained"
                                                        disabled={loading}
                                                        startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                                                        sx={{
                                                            background: colors.gradient,
                                                            borderRadius: '30px',
                                                            textTransform: 'none',
                                                            px: 4,
                                                            '&:hover': { transform: 'translateY(-1px)' }
                                                        }}
                                                    >
                                                        {loading ? 'Updating...' : 'Update Password'}
                                                    </Button>
                                                </Box>
                                            </Stack>
                                        </form>
                                    </Box>
                                </Card>
                            )}
                        </Grid>
                    </Grid>
                </Box>
            </Container>

            {/* Footer */}
            <Box sx={{ py: 3, textAlign: 'center', background: '#FFFFFF', borderTop: `1px solid ${colors.border}`, mt: 4 }}>
                <Container maxWidth="lg">
                    <Typography variant="body2" sx={{ color: colors.textLight, fontSize: '0.8rem' }}>
                        © 2026 Museum Events. All rights reserved.
                    </Typography>
                </Container>
            </Box>

            {/* Snackbar */}
            <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ bgcolor: '#FFFDF7', borderRadius: '16px', borderLeft: `4px solid ${snackbar.severity === 'success' ? '#4CAF50' : colors.primary}` }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>

            {/* Modals */}
            <Modal open={loginModalOpen} onClose={handleLoginModalClose} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)' }}>
                <Box sx={{ width: '90%', maxWidth: 500, maxHeight: '90vh', bgcolor: 'transparent', outline: 'none' }}>
                    <LoginPage isModal={true} onClose={handleLoginModalClose} onSwitchToSignup={handleSwitchToSignup} />
                </Box>
            </Modal>

            <Modal open={signupModalOpen} onClose={handleSignupModalClose} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)' }}>
                <Box sx={{ width: '90%', maxWidth: 500, maxHeight: '90vh', bgcolor: 'transparent', outline: 'none' }}>
                    <SignUpPage isModal={true} onClose={handleSignupModalClose} onSwitchToLogin={handleSwitchToLogin} onSuccess={handleSignupSuccess} />
                </Box>
            </Modal>

            <Modal open={verifyModalOpen} onClose={handleVerifyModalClose} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)' }}>
                <Box sx={{ width: '90%', maxWidth: 500, maxHeight: '90vh', bgcolor: 'transparent', outline: 'none' }}>
                    <VerifyCodePage isModal={true} onClose={handleVerifyModalClose} onVerificationSuccess={handleVerificationSuccess} email={verifyEmail} />
                </Box>
            </Modal>
        </Box>
    );
};

export default ProfilePage;