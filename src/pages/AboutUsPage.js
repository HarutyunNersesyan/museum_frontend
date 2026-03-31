import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Typography,
    Box,
    Button,
    Grid,
    Card,
    CardContent,
    Divider,
    IconButton,
    Paper,
    Menu,
    MenuItem,
    Avatar
} from '@mui/material';
import {
    Security as SecurityIcon,
    VisibilityOff as VisibilityOffIcon,
    Lock as LockIcon,
    Code as CodeIcon,
    Storage as StorageIcon,
    Image as ImageIcon,
    TextFields as TextFieldsIcon,
    Speed as SpeedIcon,
    AccountCircle as AccountCircleIcon,
    Logout as LogoutIcon,
    Person as PersonIcon,
    Celebration as CelebrationIcon,
    KeyboardArrowDown as KeyboardArrowDownIcon,
    Description as DescriptionIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { alpha } from '@mui/material/styles';

const AboutUsPage = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const [backgroundPosition, setBackgroundPosition] = useState({ x: 0, y: 0 });
    const [anchorEl, setAnchorEl] = useState(null);
    const [userInitial, setUserInitial] = useState('');

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
        if (!user) {
            navigate('/login');
            return;
        }
        navigate('/services');
    };

    const handleProfile = () => {
        handleMenuClose();
        navigate('/profile');
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
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleLoginClick = () => {
        navigate('/login');
    };

    const handleSignupClick = () => {
        navigate('/signup');
    };

    return (
        <Box sx={{
            minHeight: '100vh',
            background: '#0A0A0A',
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
                    radial-gradient(circle at ${backgroundPosition.x * 100}% ${backgroundPosition.y * 100}%, rgba(0, 150, 136, 0.15) 0%, transparent 50%),
                    radial-gradient(circle at ${100 - backgroundPosition.x * 100}% ${100 - backgroundPosition.y * 100}%, rgba(76, 175, 80, 0.15) 0%, transparent 50%),
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
                            width: '2px',
                            height: '2px',
                            background: `rgba(0, 150, 136, ${0.3 + Math.random() * 0.5})`,
                            borderRadius: '50%',
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            animation: `float ${15 + Math.random() * 10}s infinite ${i * 0.5}s ease-in-out`,
                            boxShadow: `0 0 20px rgba(0, 150, 136, ${0.3 + Math.random() * 0.5})`
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
            <Box
                component="header"
                sx={{
                    position: 'sticky',
                    top: 0,
                    zIndex: 1000,
                    backgroundColor: alpha('#0A0A0A', 0.95),
                    backdropFilter: 'blur(10px)',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                }}
            >
                <Box sx={{ padding: '0 24px' }}>
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        height: '80px',
                        maxWidth: '1280px',
                        margin: '0 auto'
                    }}>
                        {/* Logo */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <Box
                                onClick={() => navigate('/')}
                                sx={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '12px',
                                    background: 'linear-gradient(135deg, #009688 0%, #4CAF50 100%)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    animation: 'pulse 3s infinite',
                                    cursor: 'pointer',
                                    transition: 'transform 0.3s ease',
                                    '&:hover': {
                                        transform: 'scale(1.1)'
                                    }
                                }}
                            >
                                <LockIcon sx={{ color: 'white', fontSize: 24 }} />
                            </Box>
                            <Typography
                                variant="h6"
                                onClick={() => navigate('/')}
                                sx={{
                                    fontWeight: 700,
                                    background: 'linear-gradient(135deg, #009688 0%, #4CAF50 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    cursor: 'pointer',
                                    letterSpacing: '-0.5px'
                                }}
                            >
                                VeilVision
                            </Typography>
                        </Box>

                        {/* Navigation */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
                            <Button
                                color="inherit"
                                onClick={handleAboutClick}
                                sx={{
                                    fontWeight: 500,
                                    fontSize: '16px',
                                    color: '#4CAF50',
                                    borderBottom: '2px solid #4CAF50',
                                    borderRadius: 0,
                                    pb: 1,
                                    position: 'relative'
                                }}
                            >
                                About Us
                            </Button>
                            <Button
                                color="inherit"
                                onClick={() => handleScrollToSection('how-it-works')}
                                sx={{
                                    fontWeight: 500,
                                    fontSize: '16px',
                                    color: '#FFFFFF',
                                    position: 'relative',
                                    '&::after': {
                                        content: '""',
                                        position: 'absolute',
                                        bottom: 0,
                                        left: '50%',
                                        transform: 'translateX(-50%)',
                                        width: '0%',
                                        height: '2px',
                                        background: 'linear-gradient(90deg, #009688, #4CAF50)',
                                        transition: 'width 0.3s ease'
                                    },
                                    '&:hover::after': {
                                        width: '80%'
                                    }
                                }}
                            >
                                How It Works
                            </Button>
                            <Button
                                color="inherit"
                                onClick={handleServicesClick}
                                sx={{
                                    fontWeight: 500,
                                    fontSize: '16px',
                                    color: '#FFFFFF',
                                    position: 'relative',
                                    '&::after': {
                                        content: '""',
                                        position: 'absolute',
                                        bottom: 0,
                                        left: '50%',
                                        transform: 'translateX(-50%)',
                                        width: '0%',
                                        height: '2px',
                                        background: 'linear-gradient(90deg, #009688, #4CAF50)',
                                        transition: 'width 0.3s ease'
                                    },
                                    '&:hover::after': {
                                        width: '80%'
                                    }
                                }}
                            >
                                Services
                            </Button>
                        </Box>

                        {/* User Menu */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            {user ? (
                                <>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Typography sx={{
                                            color: alpha('#FFFFFF', 0.8),
                                            fontWeight: 500,
                                            fontSize: '14px',
                                            display: { xs: 'none', md: 'block' }
                                        }}>
                                            Welcome back,
                                        </Typography>
                                        <IconButton
                                            onClick={handleMenuOpen}
                                            sx={{
                                                color: '#FFFFFF',
                                                background: 'linear-gradient(135deg, #009688 0%, #4CAF50 100%)',
                                                width: '40px',
                                                height: '40px',
                                                '&:hover': {
                                                    background: 'linear-gradient(135deg, #008577 0%, #45a049 100%)',
                                                    transform: 'scale(1.05)'
                                                },
                                                transition: 'all 0.3s ease'
                                            }}
                                        >
                                            {userInitial ? (
                                                <Typography sx={{ fontWeight: 600, fontSize: '16px' }}>
                                                    {userInitial}
                                                </Typography>
                                            ) : (
                                                <AccountCircleIcon />
                                            )}
                                        </IconButton>
                                    </Box>
                                    <Menu
                                        anchorEl={anchorEl}
                                        open={Boolean(anchorEl)}
                                        onClose={handleMenuClose}
                                        PaperProps={{
                                            sx: {
                                                backgroundColor: '#121212',
                                                color: '#FFFFFF',
                                                border: '1px solid #242424',
                                                marginTop: '8px',
                                                minWidth: '200px',
                                                boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                                            }
                                        }}
                                    >
                                        <MenuItem onClick={handleDashboard} sx={{ py: 1.5 }}>
                                            <SecurityIcon sx={{ mr: 2, fontSize: '20px', color: '#009688' }} />
                                            Dashboard
                                        </MenuItem>
                                        <MenuItem onClick={handleServicesClick} sx={{ py: 1.5 }}>
                                            <CelebrationIcon sx={{ mr: 2, fontSize: '20px', color: '#009688' }} />
                                            Services
                                        </MenuItem>
                                        <MenuItem onClick={handleProfile} sx={{ py: 1.5 }}>
                                            <PersonIcon sx={{ mr: 2, fontSize: '20px', color: '#009688' }} />
                                            Profile
                                        </MenuItem>
                                        <Divider sx={{ borderColor: '#242424', my: 1 }} />
                                        <MenuItem onClick={handleLogout} sx={{ py: 1.5 }}>
                                            <LogoutIcon sx={{ mr: 2, fontSize: '20px', color: '#f44336' }} />
                                            Logout
                                        </MenuItem>
                                    </Menu>
                                </>
                            ) : (
                                <>
                                    <Button
                                        sx={{
                                            fontWeight: 500,
                                            fontSize: '16px',
                                            color: '#FFFFFF',
                                            '&:hover': {
                                                backgroundColor: 'rgba(255, 255, 255, 0.1)'
                                            }
                                        }}
                                        onClick={handleLoginClick}
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
                                            background: 'linear-gradient(135deg, #009688 0%, #4CAF50 100%)',
                                            '&:hover': {
                                                background: 'linear-gradient(135deg, #008577 0%, #45a049 100%)',
                                                transform: 'translateY(-2px)',
                                                boxShadow: '0 8px 25px rgba(0, 150, 136, 0.4)'
                                            },
                                            transition: 'all 0.3s ease'
                                        }}
                                        onClick={handleSignupClick}
                                    >
                                        Get Started
                                    </Button>
                                </>
                            )}
                        </Box>
                    </Box>
                </Box>
            </Box>

            <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, py: { xs: 4, md: 6 } }}>
                {/* Header Section */}
                <Box sx={{ textAlign: 'center', mb: { xs: 6, md: 8 } }}>
                    <Box sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 2,
                        mb: 3
                    }}>
                        <Box sx={{
                            width: 80,
                            height: 80,
                            borderRadius: '20px',
                            background: 'linear-gradient(135deg, #009688 0%, #4CAF50 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            animation: 'pulse 3s infinite'
                        }}>
                            <SecurityIcon sx={{ fontSize: 48, color: 'white' }} />
                        </Box>
                    </Box>

                    <Typography variant="h2" sx={{
                        fontSize: { xs: '36px', sm: '48px', md: '64px' },
                        fontWeight: 800,
                        lineHeight: 1.1,
                        mb: 3,
                        background: 'linear-gradient(135deg, #009688, #4CAF50, #009688)',
                        backgroundSize: '200% 200%',
                        animation: 'gradient 3s ease infinite',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>
                        About VeilVision
                    </Typography>

                    <Typography variant="h6" sx={{
                        color: alpha('#FFFFFF', 0.8),
                        maxWidth: '800px',
                        mx: 'auto',
                        fontSize: { xs: '16px', md: '18px' },
                        lineHeight: 1.6
                    }}>
                        VeilVision is a platform that helps you discover amazing holiday services including parties,
                        birthdays, and entertainment options. Browse, save favorites, and inquire about services that
                        interest you for your special occasions.
                    </Typography>
                </Box>

                {/* How It Works Section */}
                <Box sx={{ mb: 8 }}>
                    <Typography variant="h3" sx={{
                        fontSize: { xs: '28px', md: '36px' },
                        fontWeight: 700,
                        color: '#FFFFFF',
                        textAlign: 'center',
                        mb: 5
                    }}>
                        How <span style={{ color: '#009688' }}>Our Platform</span> Works
                    </Typography>

                    <Grid container spacing={4}>
                        <Grid item xs={12} md={4}>
                            <Card sx={{
                                background: 'rgba(18, 18, 18, 0.95)',
                                border: '1px solid #242424',
                                borderRadius: '20px',
                                height: '100%',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    transform: 'translateY(-5px)',
                                    borderColor: '#009688',
                                    boxShadow: '0 10px 30px rgba(0, 150, 136, 0.3)'
                                }
                            }}>
                                <CardContent sx={{ p: 4 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                                        <Box sx={{
                                            width: 50,
                                            height: 50,
                                            borderRadius: '12px',
                                            background: 'linear-gradient(135deg, #009688 0%, #4CAF50 100%)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            <CelebrationIcon sx={{ color: 'white', fontSize: 28 }} />
                                        </Box>
                                        <Typography variant="h5" sx={{ color: '#FFFFFF', fontWeight: 600 }}>
                                            Browse Services
                                        </Typography>
                                    </Box>
                                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)', lineHeight: 1.8 }}>
                                        Explore our wide range of holiday services including parties, birthdays,
                                        entertainment, catering, decoration, and more. Use filters to find exactly
                                        what you're looking for.
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Card sx={{
                                background: 'rgba(18, 18, 18, 0.95)',
                                border: '1px solid #242424',
                                borderRadius: '20px',
                                height: '100%',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    transform: 'translateY(-5px)',
                                    borderColor: '#4CAF50',
                                    boxShadow: '0 10px 30px rgba(76, 175, 80, 0.3)'
                                }
                            }}>
                                <CardContent sx={{ p: 4 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                                        <Box sx={{
                                            width: 50,
                                            height: 50,
                                            borderRadius: '12px',
                                            background: 'linear-gradient(135deg, #4CAF50 0%, #009688 100%)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            <SecurityIcon sx={{ color: 'white', fontSize: 28 }} />
                                        </Box>
                                        <Typography variant="h5" sx={{ color: '#FFFFFF', fontWeight: 600 }}>
                                            Save Favorites
                                        </Typography>
                                    </Box>
                                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)', lineHeight: 1.8 }}>
                                        Like services you're interested in and add them to your favorites.
                                        Build a personalized collection of services that match your needs and preferences.
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Card sx={{
                                background: 'rgba(18, 18, 18, 0.95)',
                                border: '1px solid #242424',
                                borderRadius: '20px',
                                height: '100%',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    transform: 'translateY(-5px)',
                                    borderColor: '#009688',
                                    boxShadow: '0 10px 30px rgba(0, 150, 136, 0.3)'
                                }
                            }}>
                                <CardContent sx={{ p: 4 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                                        <Box sx={{
                                            width: 50,
                                            height: 50,
                                            borderRadius: '12px',
                                            background: 'linear-gradient(135deg, #009688 0%, #4CAF50 100%)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            <DescriptionIcon sx={{ color: 'white', fontSize: 28 }} />
                                        </Box>
                                        <Typography variant="h5" sx={{ color: '#FFFFFF', fontWeight: 600 }}>
                                            Send Inquiry
                                        </Typography>
                                    </Box>
                                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)', lineHeight: 1.8 }}>
                                        Contact the admin directly via email about any service you're interested in.
                                        Get detailed information and personalized responses to your questions.
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Box>

                {/* Features Grid */}
                <Box sx={{ mb: 8 }}>
                    <Typography variant="h3" sx={{
                        fontSize: { xs: '28px', md: '36px' },
                        fontWeight: 700,
                        color: '#FFFFFF',
                        textAlign: 'center',
                        mb: 5
                    }}>
                        Key <span style={{ color: '#4CAF50' }}>Features</span>
                    </Typography>

                    <Grid container spacing={3}>
                        {[
                            { icon: <CelebrationIcon />, title: 'Party Services', desc: 'Find the perfect party planning services for any occasion' },
                            { icon: <SecurityIcon />, title: 'Birthday Celebrations', desc: 'Discover amazing birthday party packages and services' },
                            { icon: <SpeedIcon />, title: 'Entertainment', desc: 'Book entertainment services including DJs, performers, and more' },
                            { icon: <CodeIcon />, title: 'Catering', desc: 'Find catering services for your special events' },
                            { icon: <TextFieldsIcon />, title: 'Decoration', desc: 'Professional decoration services for all occasions' },
                            { icon: <ImageIcon />, title: 'Photography', desc: 'Capture your special moments with professional photographers' }
                        ].map((feature, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                                <Card sx={{
                                    background: 'rgba(18, 18, 18, 0.95)',
                                    border: '1px solid #242424',
                                    borderRadius: '16px',
                                    p: 3,
                                    height: '100%',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        borderColor: index % 2 === 0 ? '#009688' : '#4CAF50',
                                        transform: 'translateY(-5px)'
                                    }
                                }}>
                                    <Box sx={{ color: index % 2 === 0 ? '#009688' : '#4CAF50', mb: 2 }}>
                                        {React.cloneElement(feature.icon, { sx: { fontSize: 40 } })}
                                    </Box>
                                    <Typography variant="h6" sx={{ color: '#FFFFFF', mb: 1 }}>
                                        {feature.title}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                        {feature.desc}
                                    </Typography>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>

                {/* CTA Section */}
                <Box sx={{
                    textAlign: 'center',
                    py: 6,
                    px: 4,
                    background: 'linear-gradient(135deg, rgba(0, 150, 136, 0.1) 0%, rgba(76, 175, 80, 0.1) 100%)',
                    borderRadius: '24px',
                    border: `1px solid ${alpha('#009688', 0.3)}`
                }}>
                    <Typography variant="h4" sx={{ color: '#FFFFFF', fontWeight: 700, mb: 2 }}>
                        Ready to Plan Your Next Event?
                    </Typography>
                    <Typography variant="body1" sx={{ color: alpha('#FFFFFF', 0.8), mb: 4, maxWidth: '600px', mx: 'auto' }}>
                        Browse our collection of holiday services and find the perfect match for your special occasion.
                    </Typography>
                    <Button
                        variant="contained"
                        onClick={handleServicesClick}
                        startIcon={<CelebrationIcon />}
                        sx={{
                            padding: '14px 32px',
                            borderRadius: '12px',
                            background: 'linear-gradient(135deg, #009688 0%, #4CAF50 100%)',
                            fontSize: '16px',
                            fontWeight: 600,
                            '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: '0 8px 25px rgba(0, 150, 136, 0.4)'
                            }
                        }}
                    >
                        Browse Services
                    </Button>
                </Box>

                {/* Footer */}
                <Box sx={{ textAlign: 'center', pt: 6, mt: 4, borderTop: '1px solid #242424' }}>
                    <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.3)' }}>
                        VeilVision - Holiday Services Platform
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
};

export default AboutUsPage;