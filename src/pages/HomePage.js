// src/pages/HomePage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Button,
    Container,
    Typography,
    Grid,
    Box,
    Alert,
    Snackbar,
    Modal,
    IconButton,
    Menu,
    MenuItem,
    Divider,
    Avatar,
    Stack,
    Fade,
    useMediaQuery,
    useTheme,
    Paper,
    GlobalStyles
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import MuseumIcon from '@mui/icons-material/Museum';
import EventIcon from '@mui/icons-material/Event';
import InfoIcon from '@mui/icons-material/Info';
import { alpha, keyframes } from '@mui/material/styles';
import LoginPage from './LoginPage';
import SignUpPage from './SignUpPage';
import VerifyCodePage from './VerifyCodePage';
import { useAuth } from '../context/AuthContext';

// Custom animations
const pulse = keyframes`
    0%, 100% { opacity: 0.4; transform: scale(1); }
    50% { opacity: 0.7; transform: scale(1.05); }
`;

// Warm brown color palette for museum theme
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
    gradient: 'linear-gradient(135deg, #C4A484 0%, #D2B48C 50%, #DEB887 100%)'
};

// Global scrollbar styles
const scrollbarStyles = {
    '*::-webkit-scrollbar': { width: '10px', height: '10px' },
    '*::-webkit-scrollbar-track': { background: '#E8D5B7', borderRadius: '10px' },
    '*::-webkit-scrollbar-thumb': { background: '#C4A484', borderRadius: '10px', '&:hover': { background: '#A0522D' } },
};

function HomePage() {
    const { user, logout, isAdmin } = useAuth();
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [loginModalOpen, setLoginModalOpen] = useState(false);
    const [signupModalOpen, setSignupModalOpen] = useState(false);
    const [verifyModalOpen, setVerifyModalOpen] = useState(false);
    const [verifyEmail, setVerifyEmail] = useState('');
    const [anchorEl, setAnchorEl] = useState(null);
    const [backgroundPosition, setBackgroundPosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e) => {
            setBackgroundPosition({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    useEffect(() => {
        if (user && user.userName) {
            setUserInitial(user.userName.charAt(0).toUpperCase());
        }
    }, [user]);

    const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);

    const handleLogout = async () => {
        await logout();
        handleMenuClose();
        setSnackbar({ open: true, message: 'Logged out successfully!', severity: 'success' });
        navigate('/');
    };

    const handleProfile = () => {
        handleMenuClose();
        navigate('/profile');
    };

    const handleAdminPanel = () => {
        handleMenuClose();
        navigate('/admin/dashboard');
    };

    const handleEventsClick = () => {
        if (!user) {
            setSnackbar({ open: true, message: 'Please sign in to browse events', severity: 'warning' });
            handleOpenLoginModal();
            return;
        }
        navigate('/events');
    };

    const handleMuseumsClick = () => {
        navigate('/museums');
    };

    const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

    const handleOpenLoginModal = () => setLoginModalOpen(true);
    const handleCloseLoginModal = () => setLoginModalOpen(false);
    const handleOpenSignupModal = () => setSignupModalOpen(true);
    const handleCloseSignupModal = () => setSignupModalOpen(false);
    const handleOpenVerifyModal = (email = '') => {
        setVerifyEmail(email);
        setVerifyModalOpen(true);
    };
    const handleCloseVerifyModal = () => {
        setVerifyModalOpen(false);
        setVerifyEmail('');
    };
    const handleSwitchToSignup = () => {
        handleCloseLoginModal();
        setTimeout(() => handleOpenSignupModal(), 300);
    };
    const handleSwitchToLogin = () => {
        handleCloseSignupModal();
        setTimeout(() => handleOpenLoginModal(), 300);
    };
    const handleSignupSuccess = (email) => {
        handleCloseSignupModal();
        setTimeout(() => handleOpenVerifyModal(email), 300);
    };

    const [userInitial, setUserInitial] = useState('');

    return (
        <Box sx={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #FFF8F0 0%, #F5EDE3 100%)',
            position: 'relative',
            overflowX: 'hidden',
            fontFamily: 'Inter, sans-serif'
        }}>
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
                    radial-gradient(circle at ${backgroundPosition.x * 100}% ${backgroundPosition.y * 100}%, rgba(196,164,132,0.08) 0%, transparent 50%),
                    radial-gradient(circle at ${100 - backgroundPosition.x * 100}% ${100 - backgroundPosition.y * 100}%, rgba(210,180,140,0.08) 0%, transparent 50%)
                `,
                transition: 'background 0.3s ease-out'
            }} />

            {/* Floating decorative circles */}
            <Box sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 1,
                pointerEvents: 'none',
                overflow: 'hidden'
            }}>
                {[...Array(12)].map((_, idx) => (
                    <Box key={`bg-circle-${idx}`} sx={{
                        position: 'absolute',
                        top: `${(idx * 13) % 100}%`,
                        left: `${(idx * 17) % 100}%`,
                        width: `${150 + (idx * 20)}px`,
                        height: `${150 + (idx * 20)}px`,
                        borderRadius: '50%',
                        background: `radial-gradient(circle, ${alpha(['#C4A484', '#D2B48C', '#DEB887', '#8B7355'][idx % 4], 0.06)} 0%, transparent 70%)`,
                        animation: `${pulse} ${8 + idx}s ease-in-out infinite`,
                        pointerEvents: 'none'
                    }} />
                ))}
            </Box>

            {/* Header */}
            <Box sx={{
                position: 'sticky',
                top: 0,
                zIndex: 100,
                backgroundColor: alpha('#FFFDF7', 0.95),
                backdropFilter: 'blur(10px)',
                borderBottom: `1px solid ${colors.border}`,
                boxShadow: '0 2px 20px rgba(0,0,0,0.03)'
            }}>
                <Container maxWidth="xl">
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 70 }}>
                        {/* Logo - Left side */}
                        <Box onClick={() => navigate('/')} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, cursor: 'pointer' }}>
                            <Box sx={{
                                width: 38, height: 38, borderRadius: '12px', background: colors.gradient,
                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                                <MuseumIcon sx={{ color: 'white', fontSize: 22 }} />
                            </Box>
                            <Typography variant="h6" sx={{
                                fontWeight: 800, background: colors.gradient,
                                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
                            }}>
                                Museum
                            </Typography>
                        </Box>

                        {/* Right side - Navigation and User Menu */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            {/* Navigation Links */}
                            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
                                <Button
                                    startIcon={<MuseumIcon />}
                                    onClick={handleMuseumsClick}
                                    sx={{
                                        fontWeight: 500,
                                        color: colors.textLight,
                                        '&:hover': { color: colors.primary },
                                        fontSize: '0.9rem'
                                    }}
                                >
                                    Museums
                                </Button>
                                <Button
                                    startIcon={<EventIcon />}
                                    onClick={handleEventsClick}
                                    sx={{
                                        fontWeight: 500,
                                        color: colors.textLight,
                                        '&:hover': { color: colors.primary },
                                        fontSize: '0.9rem'
                                    }}
                                >
                                    Events
                                </Button>
                            </Box>

                            {/* User Menu */}
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                {user ? (
                                    <>
                                        {/* Profile Icon */}
                                        <IconButton onClick={handleMenuOpen} sx={{ background: colors.gradient, width: 38, height: 38 }}>
                                            <Avatar sx={{ width: 38, height: 38, bgcolor: 'transparent', color: 'white' }}>
                                                {userInitial || <AccountCircleIcon />}
                                            </Avatar>
                                        </IconButton>

                                        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose} PaperProps={{ sx: { bgcolor: '#FFFDF7', borderRadius: '16px', minWidth: 200 } }}>
                                            <MenuItem onClick={handleProfile}><PersonIcon sx={{ mr: 2, color: colors.primary }} />Profile</MenuItem>
                                            {isAdmin && <MenuItem onClick={handleAdminPanel}><AdminPanelSettingsIcon sx={{ mr: 2, color: colors.primaryDark }} />Admin Panel</MenuItem>}
                                            <Divider />
                                            <MenuItem onClick={handleLogout}><LogoutIcon sx={{ mr: 2, color: colors.error }} />Logout</MenuItem>
                                        </Menu>
                                    </>
                                ) : (
                                    <>
                                        <Button onClick={() => navigate('/login')} sx={{ fontWeight: 500, color: colors.textLight }}>Sign In</Button>
                                        <Button variant="contained" onClick={() => navigate('/signup')} sx={{ fontWeight: 600, borderRadius: '12px', background: colors.gradient, '&:hover': { transform: 'translateY(-2px)' } }}>Sign Up</Button>
                                    </>
                                )}
                            </Box>
                        </Box>
                    </Box>
                </Container>
            </Box>

            {/* Main Content */}
            <Box sx={{ position: 'relative', zIndex: 3 }}>
                {/* About Us Section - Museum Theme */}
                <Box id="about-us" sx={{ py: { xs: 8, md: 10 }, borderTop: `1px solid ${alpha(colors.border, 0.5)}`, borderBottom: `1px solid ${alpha(colors.border, 0.5)}`, background: 'transparent' }}>
                    <Container maxWidth="lg">
                        <Fade in timeout={1000}>
                            <Grid container spacing={6} alignItems="flex-start">
                                {/* Left side - Image */}
                                <Grid item xs={12} md={6}>
                                    <Box sx={{
                                        position: 'relative',
                                        borderRadius: '32px',
                                        overflow: 'hidden',
                                        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                                        transition: 'transform 0.3s ease',
                                        '&:hover': { transform: 'scale(1.02)' }
                                    }}>
                                        <img
                                            src="https://images.unsplash.com/photo-1534432586043-ead5b99229fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80"
                                            alt="Museum interior with ancient artifacts"
                                            style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'cover' }}
                                        />
                                    </Box>
                                </Grid>

                                {/* Right side - Text */}
                                <Grid item xs={12} md={6}>
                                    <Box sx={{ p: { xs: 2, md: 4 }, pt: { xs: 2, md: 0 } }}>
                                        <Typography variant="h3" sx={{ fontSize: { xs: 28, md: 38 }, fontWeight: 700, color: colors.text, mb: 3 }}>
                                            About <span style={{ color: colors.primary }}>Museum Events</span>
                                        </Typography>
                                        <Typography variant="body1" sx={{
                                            color: colors.textLight,
                                            fontSize: { xs: 16, md: 18 },
                                            lineHeight: 1.9,
                                            fontWeight: 450,
                                            letterSpacing: '0.01em',
                                            mb: 3
                                        }}>
                                            <span style={{ fontWeight: 600, color: colors.primary }}>Museum Events</span> is your premier platform for discovering and experiencing the rich cultural heritage of Armenia. We bring together the finest museums, exhibitions, and cultural events across the country, making it easy for you to explore art, history, science, and tradition in one place.
                                        </Typography>

                                        <Typography variant="body1" sx={{
                                            color: colors.textLight,
                                            fontSize: { xs: 16, md: 18 },
                                            lineHeight: 1.9,
                                            fontWeight: 450,
                                            letterSpacing: '0.01em',
                                            mb: 3
                                        }}>
                                            From ancient archaeological treasures to contemporary art exhibitions, from natural history displays to interactive science centers — our platform connects you with Armenia's most prestigious cultural institutions. Whether you're a history enthusiast, art lover, student, or curious traveler, you'll find events and exhibitions that inspire and educate.
                                        </Typography>

                                        <Typography variant="body1" sx={{
                                            color: colors.textLight,
                                            fontSize: { xs: 16, md: 18 },
                                            lineHeight: 1.9,
                                            fontWeight: 450,
                                            letterSpacing: '0.01em',
                                            fontStyle: 'italic'
                                        }}>
                                            Let <span style={{ fontWeight: 600, color: colors.primary }}>Museum Events</span> be your guide to Armenia's cultural treasures — where history comes alive, art speaks volumes, and every visit becomes an unforgettable journey through time.
                                        </Typography>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Fade>
                    </Container>
                </Box>

                {/* Footer */}
                <Box sx={{ py: 5, textAlign: 'center', background: '#FFFFFF', borderTop: `1px solid ${colors.border}` }}>
                    <Container maxWidth="lg">
                        <Typography variant="body2" sx={{ color: colors.textLight }}>© 2026 Museum Events. All rights reserved.</Typography>
                    </Container>
                </Box>
            </Box>

            {/* Modals */}
            <Modal open={loginModalOpen} onClose={handleCloseLoginModal} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)' }}>
                <Box sx={{ width: '90%', maxWidth: 470, maxHeight: '90vh', bgcolor: '#FFFFFF', borderRadius: '24px', border: `1px solid ${colors.border}`, position: 'relative', overflow: 'hidden', boxShadow: '0 24px 48px rgba(0,0,0,0.15)' }}>
                    <IconButton onClick={handleCloseLoginModal} sx={{ position: 'absolute', top: 16, right: 16, zIndex: 10, backgroundColor: alpha('#000', 0.5), color: '#FFF', '&:hover': { backgroundColor: alpha('#000', 0.7) } }}><CloseIcon /></IconButton>
                    <LoginPage isModal={true} onClose={handleCloseLoginModal} onSwitchToSignup={handleSwitchToSignup} />
                </Box>
            </Modal>

            <Modal open={signupModalOpen} onClose={handleCloseSignupModal} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)' }}>
                <Box sx={{ width: '90%', maxWidth: 470, maxHeight: '90vh', bgcolor: '#FFFFFF', borderRadius: '24px', border: `1px solid ${colors.border}`, position: 'relative', overflow: 'hidden', boxShadow: '0 24px 48px rgba(0,0,0,0.15)' }}>
                    <IconButton onClick={handleCloseSignupModal} sx={{ position: 'absolute', top: 16, right: 16, zIndex: 10, backgroundColor: alpha('#000', 0.5), color: '#FFF', '&:hover': { backgroundColor: alpha('#000', 0.7) } }}><CloseIcon /></IconButton>
                    <SignUpPage isModal={true} onClose={handleCloseSignupModal} onSwitchToLogin={handleSwitchToLogin} onSuccess={handleSignupSuccess} />
                </Box>
            </Modal>

            <Modal open={verifyModalOpen} onClose={handleCloseVerifyModal} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)' }}>
                <Box sx={{ width: '90%', maxWidth: 470, bgcolor: '#FFFFFF', borderRadius: '24px', border: `1px solid ${colors.border}`, position: 'relative', overflow: 'hidden', boxShadow: '0 24px 48px rgba(0,0,0,0.15)' }}>
                    <IconButton onClick={handleCloseVerifyModal} sx={{ position: 'absolute', top: 16, right: 16, zIndex: 10, backgroundColor: alpha('#000', 0.5), color: '#FFF', '&:hover': { backgroundColor: alpha('#000', 0.7) } }}><CloseIcon /></IconButton>
                    <VerifyCodePage isModal={true} onClose={handleCloseVerifyModal} email={verifyEmail} />
                </Box>
            </Modal>

            {/* Snackbar */}
            <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ bgcolor: '#FFFDF7', color: colors.text, borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', borderLeft: `4px solid ${snackbar.severity === 'success' ? colors.success : colors.primary}` }}>{snackbar.message}</Alert>
            </Snackbar>
        </Box>
    );
}

export default HomePage;