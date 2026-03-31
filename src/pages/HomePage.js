import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Button,
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    Box,
    Alert,
    Snackbar,
    Modal,
    IconButton,
    CardMedia,
    Menu,
    MenuItem
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import SecurityIcon from '@mui/icons-material/Security';
import CloseIcon from '@mui/icons-material/Close';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import CelebrationIcon from '@mui/icons-material/Celebration';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import LoginPage from './LoginPage';
import SignUpPage from './SignUpPage';
import VerifyCodePage from './VerifyCodePage';
import { useAuth } from '../context/AuthContext';

function HomePage() {
    const { user, logout, isAdmin } = useAuth();
    const navigate = useNavigate();

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });
    const [loginModalOpen, setLoginModalOpen] = useState(false);
    const [signupModalOpen, setSignupModalOpen] = useState(false);
    const [verifyModalOpen, setVerifyModalOpen] = useState(false);
    const [verifyEmail, setVerifyEmail] = useState('');
    const [backgroundPosition, setBackgroundPosition] = useState({ x: 0, y: 0 });
    const [anchorEl, setAnchorEl] = useState(null);
    const [userInitial, setUserInitial] = useState('');

    useEffect(() => {
        if (user && user.userName) {
            setUserInitial(user.userName.charAt(0).toUpperCase());
        }
    }, [user]);

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = async () => {
        await logout();
        handleMenuClose();
        setSnackbar({
            open: true,
            message: 'Logged out successfully!',
            severity: 'success'
        });
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

    const handleServicesClick = () => {
        if (!user) {
            setSnackbar({
                open: true,
                message: 'Please sign in to browse services',
                severity: 'warning'
            });
            handleOpenLoginModal();
            return;
        }
        navigate('/services');
    };

    const handleAboutClick = () => {
        navigate('/about');
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

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const handleOpenLoginModal = () => {
        setLoginModalOpen(true);
    };

    const handleCloseLoginModal = () => {
        setLoginModalOpen(false);
    };

    const handleOpenSignupModal = () => {
        setSignupModalOpen(true);
    };

    const handleCloseSignupModal = () => {
        setSignupModalOpen(false);
    };

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
        setTimeout(() => {
            handleOpenSignupModal();
        }, 300);
    };

    const handleSwitchToLogin = () => {
        handleCloseSignupModal();
        setTimeout(() => {
            handleOpenLoginModal();
        }, 300);
    };

    const handleSignupSuccess = (email) => {
        handleCloseSignupModal();
        setTimeout(() => {
            handleOpenVerifyModal(email);
        }, 300);
    };

    const handleScrollToSection = (sectionId) => {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div style={{
            position: 'relative',
            minHeight: '100vh',
            backgroundColor: '#0A0A0A',
            color: '#FFFFFF',
            fontFamily: 'Inter, sans-serif',
            overflow: 'hidden'
        }}>
            {/* Animated Background */}
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 0,
                background: `
                    radial-gradient(circle at ${backgroundPosition.x * 100}% ${backgroundPosition.y * 100}%, rgba(0, 150, 136, 0.15) 0%, transparent 50%),
                    radial-gradient(circle at ${100 - backgroundPosition.x * 100}% ${100 - backgroundPosition.y * 100}%, rgba(76, 175, 80, 0.15) 0%, transparent 50%),
                    #0A0A0A
                `,
                transition: 'background 0.3s ease-out'
            }} />

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
            <header style={{
                position: 'sticky',
                top: 0,
                zIndex: 1000,
                backgroundColor: 'rgba(10, 10, 10, 0.95)',
                backdropFilter: 'blur(10px)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
                <nav style={{ padding: '0 24px' }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        height: '80px',
                        maxWidth: '1280px',
                        margin: '0 auto'
                    }}>
                        {/* Logo */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => navigate('/')}>
                            <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '12px',
                                background: 'linear-gradient(135deg, #009688 0%, #4CAF50 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <LockIcon sx={{ color: 'white', fontSize: 24 }} />
                            </div>
                            <Typography variant="h6" sx={{
                                fontWeight: 700,
                                background: 'linear-gradient(135deg, #009688 0%, #4CAF50 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent'
                            }}>
                                VeilVision
                            </Typography>
                        </div>

                        {/* Navigation */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
                            <Button sx={{ fontWeight: 500, fontSize: '16px', color: '#FFFFFF' }} onClick={handleAboutClick}>
                                About Us
                            </Button>
                            <Button sx={{ fontWeight: 500, fontSize: '16px', color: '#FFFFFF' }} onClick={() => handleScrollToSection('how-it-works')}>
                                How It Works
                            </Button>
                            <Button sx={{ fontWeight: 500, fontSize: '16px', color: '#4CAF50' }} onClick={handleServicesClick}>
                                Services
                            </Button>
                            {isAdmin && (
                                <Button sx={{ fontWeight: 500, fontSize: '16px', color: '#FF9800' }} onClick={handleAdminPanel}>
                                    Admin
                                </Button>
                            )}
                        </div>

                        {/* User Menu / Auth Buttons */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            {user ? (
                                <>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Typography sx={{ color: '#FFFFFF', fontWeight: 500, fontSize: '14px', display: { xs: 'none', md: 'block' } }}>
                                            Welcome back,
                                        </Typography>
                                        <IconButton onClick={handleMenuOpen} sx={{
                                            color: '#FFFFFF',
                                            background: 'linear-gradient(135deg, #009688 0%, #4CAF50 100%)',
                                            width: '40px',
                                            height: '40px',
                                            '&:hover': { transform: 'scale(1.05)' }
                                        }}>
                                            {userInitial ? <Typography sx={{ fontWeight: 600 }}>{userInitial}</Typography> : <AccountCircleIcon />}
                                        </IconButton>
                                    </Box>
                                    <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}
                                          PaperProps={{ sx: { backgroundColor: '#121212', color: '#FFFFFF', border: '1px solid #242424', minWidth: '200px' } }}>
                                        <MenuItem onClick={handleProfile}><PersonIcon sx={{ mr: 2 }} />Profile</MenuItem>
                                        <MenuItem onClick={handleServicesClick}><CelebrationIcon sx={{ mr: 2 }} />Services</MenuItem>
                                        {isAdmin && (
                                            <MenuItem onClick={handleAdminPanel}><AdminPanelSettingsIcon sx={{ mr: 2 }} />Admin Panel</MenuItem>
                                        )}
                                        <MenuItem onClick={handleLogout}><LogoutIcon sx={{ mr: 2 }} />Logout</MenuItem>
                                    </Menu>
                                </>
                            ) : (
                                <>
                                    <Button
                                        sx={{ fontWeight: 500, fontSize: '16px', color: '#FFFFFF' }}
                                        onClick={handleOpenLoginModal}
                                    >
                                        Sign In
                                    </Button>
                                    <Button
                                        variant="contained"
                                        sx={{
                                            fontWeight: 600,
                                            fontSize: '16px',
                                            padding: '12px 24px',
                                            borderRadius: '12px',
                                            background: 'linear-gradient(135deg, #009688 0%, #4CAF50 100%)'
                                        }}
                                        onClick={handleOpenSignupModal}
                                    >
                                        Get Started
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                </nav>
            </header>

            {/* Main Content */}
            <main style={{ position: 'relative', zIndex: 1 }}>
                {/* Hero Section */}
                <section style={{ padding: '120px 0 40px' }}>
                    <Container maxWidth="lg">
                        <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
                            <Typography variant="h1" sx={{
                                fontSize: { xs: '48px', md: '64px' },
                                fontWeight: 800,
                                marginBottom: '24px',
                                background: 'linear-gradient(135deg, #009688, #4CAF50, #009688)',
                                backgroundSize: '200% 200%',
                                animation: 'gradient 3s ease infinite',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent'
                            }}>
                                {user ? `Welcome back, ${user.userName}!` : 'Discover Amazing Holiday Services'}
                            </Typography>

                            <Typography variant="h6" sx={{
                                fontSize: { xs: '18px', md: '24px' },
                                fontWeight: 400,
                                color: 'rgba(255, 255, 255, 0.8)',
                                marginBottom: '40px'
                            }}>
                                Find the perfect parties, birthdays, and entertainment services for your special occasions.
                                Browse, save favorites, and inquire about services that interest you.
                            </Typography>

                            <Box sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                gap: '20px',
                                flexWrap: 'wrap',
                                marginTop: '40px'
                            }}>
                                <Button
                                    variant="contained"
                                    onClick={handleServicesClick}
                                    startIcon={<CelebrationIcon />}
                                    sx={{
                                        padding: '16px 32px',
                                        borderRadius: '12px',
                                        background: 'linear-gradient(135deg, #009688 0%, #4CAF50 100%)',
                                        fontSize: '18px',
                                        fontWeight: 600
                                    }}
                                >
                                    Browse Services
                                </Button>
                            </Box>
                        </div>
                    </Container>
                </section>

                {/* How It Works Section */}
                <section id="how-it-works" style={{
                    padding: '120px 0',
                    background: 'rgba(255, 255, 255, 0.02)',
                    borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
                }}>
                    <Container maxWidth="lg">
                        <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h3" sx={{
                                fontSize: { xs: '36px', md: '48px' },
                                fontWeight: 700,
                                marginBottom: '60px',
                                background: 'linear-gradient(135deg, #FFFFFF 0%, rgba(255, 255, 255, 0.8) 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent'
                            }}>
                                How It Works
                            </Typography>

                            <Grid container spacing={4}>
                                <Grid item xs={12} md={4}>
                                    <Box sx={{ textAlign: 'center', p: 3 }}>
                                        <Box sx={{
                                            width: '80px',
                                            height: '80px',
                                            borderRadius: '50%',
                                            background: 'linear-gradient(135deg, #009688 0%, #4CAF50 100%)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            margin: '0 auto 24px'
                                        }}>
                                            <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>1</Typography>
                                        </Box>
                                        <Typography variant="h5" sx={{ mb: 2, color: '#FFFFFF' }}>Browse Services</Typography>
                                        <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                            Explore our wide range of holiday services including parties, birthdays, and entertainment options.
                                        </Typography>
                                    </Box>
                                </Grid>

                                <Grid item xs={12} md={4}>
                                    <Box sx={{ textAlign: 'center', p: 3 }}>
                                        <Box sx={{
                                            width: '80px',
                                            height: '80px',
                                            borderRadius: '50%',
                                            background: 'linear-gradient(135deg, #009688 0%, #4CAF50 100%)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            margin: '0 auto 24px'
                                        }}>
                                            <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>2</Typography>
                                        </Box>
                                        <Typography variant="h5" sx={{ mb: 2, color: '#FFFFFF' }}>Save Favorites</Typography>
                                        <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                            Like services you're interested in and add them to your bucket for later consideration.
                                        </Typography>
                                    </Box>
                                </Grid>

                                <Grid item xs={12} md={4}>
                                    <Box sx={{ textAlign: 'center', p: 3 }}>
                                        <Box sx={{
                                            width: '80px',
                                            height: '80px',
                                            borderRadius: '50%',
                                            background: 'linear-gradient(135deg, #009688 0%, #4CAF50 100%)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            margin: '0 auto 24px'
                                        }}>
                                            <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>3</Typography>
                                        </Box>
                                        <Typography variant="h5" sx={{ mb: 2, color: '#FFFFFF' }}>Send Inquiry</Typography>
                                        <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                            Contact the admin directly via email about any service you're interested in.
                                        </Typography>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Box>
                    </Container>
                </section>

                {/* Footer */}
                <footer style={{
                    padding: '80px 0 40px',
                    background: 'rgba(255, 255, 255, 0.02)',
                    borderTop: '1px solid rgba(255, 255, 255, 0.05)'
                }}>
                    <Container maxWidth="lg">
                        <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                                © 2026 VeilVision. All rights reserved.
                            </Typography>
                        </Box>
                    </Container>
                </footer>
            </main>

            {/* Login Modal */}
            <Modal open={loginModalOpen} onClose={handleCloseLoginModal} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)' }}>
                <Box sx={{ width: '90%', maxWidth: '800px', maxHeight: '90vh', bgcolor: '#121212', borderRadius: '16px', border: '1px solid #242424', position: 'relative', overflow: 'hidden' }}>
                    <IconButton onClick={handleCloseLoginModal} sx={{ position: 'absolute', top: 16, right: 16, zIndex: 10, backgroundColor: 'rgba(0,0,0,0.5)', color: '#FFFFFF' }}>
                        <CloseIcon />
                    </IconButton>
                    <LoginPage isModal={true} onClose={handleCloseLoginModal} onSwitchToSignup={handleSwitchToSignup} />
                </Box>
            </Modal>

            {/* Signup Modal */}
            <Modal open={signupModalOpen} onClose={handleCloseSignupModal} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)' }}>
                <Box sx={{ width: '90%', maxWidth: '800px', maxHeight: '90vh', bgcolor: '#121212', borderRadius: '16px', border: '1px solid #242424', position: 'relative', overflow: 'hidden' }}>
                    <IconButton onClick={handleCloseSignupModal} sx={{ position: 'absolute', top: 16, right: 16, zIndex: 10, backgroundColor: 'rgba(0,0,0,0.5)', color: '#FFFFFF' }}>
                        <CloseIcon />
                    </IconButton>
                    <SignUpPage isModal={true} onClose={handleCloseSignupModal} onSwitchToLogin={handleSwitchToLogin} onSuccess={handleSignupSuccess} />
                </Box>
            </Modal>

            {/* Verify Code Modal */}
            <Modal open={verifyModalOpen} onClose={handleCloseVerifyModal} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)' }}>
                <Box sx={{ width: '90%', maxWidth: '800px', maxHeight: '90vh', bgcolor: '#121212', borderRadius: '16px', border: '1px solid #242424', position: 'relative', overflow: 'hidden' }}>
                    <IconButton onClick={handleCloseVerifyModal} sx={{ position: 'absolute', top: 16, right: 16, zIndex: 10, backgroundColor: 'rgba(0,0,0,0.5)', color: '#FFFFFF' }}>
                        <CloseIcon />
                    </IconButton>
                    <VerifyCodePage isModal={true} onClose={handleCloseVerifyModal} email={verifyEmail} />
                </Box>
            </Modal>

            {/* Snackbar */}
            <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ backgroundColor: '#121212', color: '#FFFFFF', border: `1px solid ${snackbar.severity === 'success' ? '#4CAF50' : '#f44336'}` }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </div>
    );
}

export default HomePage;