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
    Avatar,
    Chip,
    Fade,
    Zoom,
    useMediaQuery,
    useTheme,
    Tooltip,
    alpha,
    keyframes
} from '@mui/material';
import {
    Security as SecurityIcon,
    Lock as LockIcon,
    Celebration as CelebrationIcon,
    AccountCircle as AccountCircleIcon,
    Logout as LogoutIcon,
    Person as PersonIcon,
    Info as InfoIcon,
    HowToReg as HowToRegIcon,
    RocketLaunch as RocketLaunchIcon,
    Restaurant as RestaurantIcon,
    Brush as BrushIcon,
    CameraAlt as CameraAltIcon,
    MusicNote as MusicNoteIcon,
    LocationOn as LocationOnIcon,
    Cake as CakeIcon,
    EmojiEvents as EmojiEventsIcon,
    Star as StarIcon,
    AutoAwesome as AutoAwesomeIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

// Custom animations
const float = keyframes`
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    25% { transform: translateY(-15px) rotate(3deg); }
    50% { transform: translateY(-25px) rotate(-3deg); }
    75% { transform: translateY(-10px) rotate(2deg); }
`;

const pulse = keyframes`
    0%, 100% { opacity: 0.4; transform: scale(1); }
    50% { opacity: 0.7; transform: scale(1.05); }
`;

const slideIn = keyframes`
    from { opacity: 0; transform: translateX(-50px); }
    to { opacity: 1; transform: translateX(0); }
`;

const gradientShift = keyframes`
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
`;

const AboutUsPage = () => {
    const navigate = useNavigate();
    const { user, logout, isAdmin } = useAuth();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

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

    const handleAdminPanel = () => {
        handleMenuClose();
        navigate('/admin/dashboard');
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
            background: 'linear-gradient(135deg, #FFF9F0 0%, #F5F0E8 100%)',
            position: 'relative',
            overflowX: 'hidden',
            fontFamily: "'Inter', sans-serif"
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
                    radial-gradient(circle at ${backgroundPosition.x * 100}% ${backgroundPosition.y * 100}%, rgba(255,107,53,0.08) 0%, transparent 50%),
                    radial-gradient(circle at ${100 - backgroundPosition.x * 100}% ${100 - backgroundPosition.y * 100}%, rgba(255,193,7,0.08) 0%, transparent 50%)
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
                    <Box
                        key={`bg-circle-${idx}`}
                        sx={{
                            position: 'absolute',
                            top: `${(idx * 13) % 100}%`,
                            left: `${(idx * 17) % 100}%`,
                            width: `${150 + (idx * 20)}px`,
                            height: `${150 + (idx * 20)}px`,
                            borderRadius: '50%',
                            background: `radial-gradient(circle, ${alpha(['#FF6B35', '#FFB347', '#FF8C42', '#FF9F4A'][idx % 4], 0.06)} 0%, transparent 70%)`,
                            animation: `${pulse} ${8 + idx}s ease-in-out infinite`,
                            pointerEvents: 'none'
                        }}
                    />
                ))}
            </Box>

            {/* Header */}
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
                            onClick={() => navigate('/')}
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
                                <LockIcon sx={{ color: 'white', fontSize: 22 }} />
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
                                sx={{ fontWeight: 500, color: '#FF6B35', borderBottom: '2px solid #FF6B35', borderRadius: 0 }}
                                onClick={handleAboutClick}
                            >
                                About Us
                            </Button>
                            <Button
                                startIcon={<HowToRegIcon />}
                                sx={{ fontWeight: 500, color: '#4A4A4A', '&:hover': { color: '#FF6B35' } }}
                                onClick={() => handleScrollToSection('how-it-works')}
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
                            {isAdmin && (
                                <Button sx={{ fontWeight: 500, color: '#FF9800' }} onClick={handleAdminPanel}>
                                    Admin
                                </Button>
                            )}
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            {user ? (
                                <>
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
                                        <MenuItem onClick={handleProfile}><PersonIcon sx={{ mr: 2, fontSize: 20, color: '#FF6B35' }} />Profile</MenuItem>
                                        {isAdmin && (
                                            <MenuItem onClick={handleAdminPanel}><SecurityIcon sx={{ mr: 2, fontSize: 20, color: '#FF9800' }} />Admin Panel</MenuItem>
                                        )}
                                        <Divider />
                                        <MenuItem onClick={handleLogout}><LogoutIcon sx={{ mr: 2, fontSize: 20, color: '#FF6B35' }} />Logout</MenuItem>
                                    </Menu>
                                </>
                            ) : (
                                <>
                                    <Button sx={{ fontWeight: 500, color: '#4A4A4A', '&:hover': { color: '#FF6B35' } }} onClick={handleLoginClick}>
                                        Sign In
                                    </Button>
                                    <Button
                                        variant="contained"
                                        sx={{
                                            fontWeight: 600,
                                            borderRadius: '12px',
                                            background: 'linear-gradient(135deg, #FF6B35 0%, #FFB347 100%)',
                                            boxShadow: '0 4px 12px rgba(255,107,53,0.25)',
                                            '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 6px 16px rgba(255,107,53,0.35)' }
                                        }}
                                        onClick={handleSignupClick}
                                    >
                                        Get Started
                                    </Button>
                                </>
                            )}
                        </Box>
                    </Box>
                </Container>
            </Box>

            {/* Main Content */}
            <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 3, py: { xs: 4, md: 6 } }}>
                {/* Hero Section */}
                <Fade in timeout={1000}>
                    <Box sx={{
                        textAlign: 'center',
                        mb: { xs: 6, md: 8 },
                        animation: `${slideIn} 0.8s ease-out`
                    }}>
                        <Typography variant="h1" sx={{
                            fontSize: { xs: 36, sm: 48, md: 64, lg: 72 },
                            fontWeight: 800,
                            lineHeight: 1.2,
                            mb: 3,
                            letterSpacing: '-0.02em'
                        }}>
                            <Box component="span" sx={{ color: '#2C2C2C' }}>
                                About{' '}
                            </Box>
                            <Box component="span" sx={{
                                background: 'linear-gradient(135deg, #FF6B35 0%, #FFB347 100%)',
                                backgroundSize: '200% 200%',
                                animation: `${gradientShift} 3s ease infinite`,
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                color: 'transparent'
                            }}>
                                Festivy
                            </Box>
                        </Typography>

                        <Box sx={{
                            width: 80,
                            height: 3,
                            background: 'linear-gradient(90deg, #FF6B35, #FFB347)',
                            borderRadius: 2,
                            mb: 4,
                            mx: 'auto'
                        }} />

                        <Typography variant="h6" sx={{
                            color: '#4A4A4A',
                            maxWidth: '800px',
                            mx: 'auto',
                            fontSize: { xs: 16, md: 18 },
                            lineHeight: 1.8,
                            fontWeight: 500
                        }}>
                            Welcome to <Box component="span" sx={{ color: '#FF6B35', fontWeight: 700 }}>Festivy</Box> — your ultimate destination for creating unforgettable celebrations.
                            We bring together the finest <Box component="span" sx={{ color: '#FFB347', fontWeight: 600 }}>party planners</Box>,
                            <Box component="span" sx={{ color: '#FF8C42', fontWeight: 600 }}> entertainers</Box>, and
                            <Box component="span" sx={{ color: '#FF9F4A', fontWeight: 600 }}> service providers</Box> to turn your vision into reality.
                            Whether you're planning an intimate birthday or a grand festival, our platform connects you with professionals who
                            bring <Box component="span" sx={{ color: '#FF6B35', fontWeight: 700 }}>passion</Box>,
                            <Box component="span" sx={{ color: '#FFB347', fontWeight: 700 }}> creativity</Box>, and
                            <Box component="span" sx={{ color: '#FF8C42', fontWeight: 700 }}> excellence</Box> to every event.
                        </Typography>
                    </Box>
                </Fade>

                {/* Service Categories Section */}
                <Box sx={{ mb: 8 }}>
                    <Typography variant="h3" sx={{
                        fontSize: { xs: 28, md: 38 },
                        fontWeight: 700,
                        color: '#2C2C2C',
                        textAlign: 'center',
                        mb: 2
                    }}>
                        Service <span style={{ color: '#FFB347' }}>Categories</span>
                    </Typography>
                    <Box sx={{
                        width: 60,
                        height: 3,
                        background: 'linear-gradient(90deg, #FF6B35, #FFB347)',
                        borderRadius: 2,
                        mx: 'auto',
                        mb: 5
                    }} />

                    <Grid container spacing={3}>
                        {[
                            { icon: <CelebrationIcon />, title: 'Party Services', desc: 'Find the perfect party planning services for any occasion', color: '#FF6B35' },
                            { icon: <CakeIcon />, title: 'Birthday Celebrations', desc: 'Discover amazing birthday party packages and services', color: '#FFB347' },
                            { icon: <EmojiEventsIcon />, title: 'Entertainment', desc: 'Book entertainment services including DJs, performers, and more', color: '#FF8C42' },
                            { icon: <RestaurantIcon />, title: 'Catering', desc: 'Find catering services for your special events', color: '#FF9F4A' },
                            { icon: <BrushIcon />, title: 'Decoration', desc: 'Professional decoration services for all occasions', color: '#FFA559' },
                            { icon: <CameraAltIcon />, title: 'Photography', desc: 'Capture your special moments with professional photographers', color: '#FF6B35' },
                            { icon: <MusicNoteIcon />, title: 'Music & DJ', desc: 'Professional music and DJ services for your events', color: '#FFB347' },
                            { icon: <LocationOnIcon />, title: 'Venue', desc: 'Find the perfect venue for your special occasion', color: '#FF8C42' }
                        ].map((category, index) => (
                            <Grid item xs={12} sm={6} md={3} key={index}>
                                <Zoom in timeout={300 + index * 100}>
                                    <Card sx={{
                                        background: alpha(category.color, 0.04),
                                        backdropFilter: 'blur(10px)',
                                        border: `1px solid ${alpha(category.color, 0.15)}`,
                                        borderRadius: '20px',
                                        height: '100%',
                                        transition: 'all 0.3s ease',
                                        cursor: 'pointer',
                                        '&:hover': {
                                            transform: 'translateY(-5px)',
                                            borderColor: alpha(category.color, 0.4),
                                            boxShadow: `0 10px 30px ${alpha(category.color, 0.15)}`,
                                            background: alpha(category.color, 0.08)
                                        }
                                    }}>
                                        <CardContent sx={{ p: 3, textAlign: 'center' }}>
                                            <Box sx={{
                                                width: 60,
                                                height: 60,
                                                borderRadius: '16px',
                                                background: `linear-gradient(135deg, ${category.color}20, ${category.color}05)`,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                mx: 'auto',
                                                mb: 2,
                                                border: `1px solid ${alpha(category.color, 0.3)}`
                                            }}>
                                                <Box sx={{ color: category.color, fontSize: 32, display: 'flex' }}>
                                                    {category.icon}
                                                </Box>
                                            </Box>
                                            <Typography variant="h6" sx={{
                                                color: category.color,
                                                fontWeight: 600,
                                                mb: 1
                                            }}>
                                                {category.title}
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: '#5A5A5A', lineHeight: 1.5 }}>
                                                {category.desc}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Zoom>
                            </Grid>
                        ))}
                    </Grid>
                </Box>

                {/* Footer */}
                <Box sx={{
                    py: 4,
                    textAlign: 'center',
                    borderTop: '1px solid rgba(0,0,0,0.08)'
                }}>
                    <Typography variant="body2" sx={{ color: '#8A8A8A' }}>
                        © 2026 Festivy. All rights reserved.
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
};

export default AboutUsPage;