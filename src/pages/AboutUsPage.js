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
    keyframes,
    GlobalStyles,
    SvgIcon
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
    AutoAwesome as AutoAwesomeIcon,
    Business as BusinessIcon,
    Favorite as FavoriteIcon,
    School as SchoolIcon,
    LocalFlorist as LocalFloristIcon,
    EmojiNature as EmojiNatureIcon,
    Chair as ChairIcon,
    WbIncandescent as WbIncandescentIcon,
    EmojiPeople as EmojiPeopleIcon,
    EventAvailable as EventAvailableIcon,
    ThumbUpAlt as ThumbUpAltIcon,
    People as PeopleIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

// Custom Engagement Icon - Diamond Ring with Love Key & Romantic Stars
const EngagementRingIcon = (props) => (
    <SvgIcon {...props} viewBox="0 0 24 24">
        <path d="M12 3 L14 7 L10 7 Z" fill="currentColor" stroke="currentColor" strokeWidth="0.5" />
        <path d="M12 2 L14 7 L12 9 L10 7 Z" fill="none" stroke="currentColor" strokeWidth="1.2" />
        <path d="M12 4 L13 7 L11 7 Z" fill="white" opacity="0.6" />
        <circle cx="12" cy="13" r="4" stroke="currentColor" strokeWidth="1.8" fill="none" />
        <path d="M12 9 L12 11" stroke="currentColor" strokeWidth="1.2" />
        <path d="M10 9.5 L10.5 11" stroke="currentColor" strokeWidth="1" />
        <path d="M14 9.5 L13.5 11" stroke="currentColor" strokeWidth="1" />
        <path d="M12 1 L12 2" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
        <path d="M10.5 2.5 L11 3" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" />
        <path d="M13.5 2.5 L13 3" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" />
        <path d="M6 6 L6.3 6.8 L7 7 L6.3 7.2 L6 8 L5.7 7.2 L5 7 L5.7 6.8 Z" fill="currentColor" />
        <path d="M18 6 L18.3 6.8 L19 7 L18.3 7.2 L18 8 L17.7 7.2 L17 7 L17.7 6.8 Z" fill="currentColor" />
        <path d="M7 17 L7.2 17.5 L7.7 17.6 L7.3 17.9 L7.4 18.4 L7 18.1 L6.6 18.4 L6.7 17.9 L6.3 17.6 L6.8 17.5 Z" fill="currentColor" opacity="0.8" />
        <path d="M17 16 L17.2 16.5 L17.7 16.6 L17.3 16.9 L17.4 17.4 L17 17.1 L16.6 17.4 L16.7 16.9 L16.3 16.6 L16.8 16.5 Z" fill="currentColor" opacity="0.7" />
        <circle cx="12" cy="5" r="3" fill="currentColor" opacity="0.1" />
    </SvgIcon>
);

// Custom Anniversary Icon - Gift with ribbon and cake/candle elements
const AnniversaryGiftIcon = (props) => (
    <SvgIcon {...props} viewBox="0 0 24 24">
        <rect x="6" y="8" width="12" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <path d="M12 8 L12 18" stroke="currentColor" strokeWidth="1.5" />
        <path d="M6 13 L18 13" stroke="currentColor" strokeWidth="1.5" />
        <path d="M12 8 Q9 4 7 7 Q9 8 12 8" stroke="currentColor" strokeWidth="1.2" fill="none" />
        <path d="M12 8 Q15 4 17 7 Q15 8 12 8" stroke="currentColor" strokeWidth="1.2" fill="none" />
        <circle cx="12" cy="8" r="1" fill="currentColor" />
        <rect x="11.5" y="4" width="1" height="3" rx="0.3" fill="currentColor" />
        <path d="M12 3 Q12.5 4 12 4.5 Q11.5 4 12 3" fill="#FF6B35" />
        <circle cx="8" cy="10" r="0.8" fill="#FFB347" />
        <circle cx="16" cy="11" r="0.6" fill="#FF6B35" />
        <circle cx="10" cy="16" r="0.5" fill="#FF8C42" />
        <circle cx="15" cy="15" r="0.7" fill="#FFB347" />
    </SvgIcon>
);

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
    const [counters, setCounters] = useState({
        happy_clients: 0,
        events_organized: 0,
        expert_planners: 0,
        satisfaction_rate: 0
    });

    // Statistics data
    const statistics = [
        {
            icon: <PeopleIcon sx={{ fontSize: 48 }} />,
            value: 5000,
            label: 'Happy Clients',
            suffix: '+',
            color: '#FF6B35',
            key: 'happy_clients'
        },
        {
            icon: <EventAvailableIcon sx={{ fontSize: 48 }} />,
            value: 10000,
            label: 'Events Organized',
            suffix: '+',
            color: '#FFB347',
            key: 'events_organized'
        },
        {
            icon: <EmojiPeopleIcon sx={{ fontSize: 48 }} />,
            value: 200,
            label: 'Expert Planners',
            suffix: '+',
            color: '#FF8C42',
            key: 'expert_planners'
        },
        {
            icon: <ThumbUpAltIcon sx={{ fontSize: 48 }} />,
            value: 98,
            label: 'Satisfaction Rate',
            suffix: '%',
            color: '#FF9F4A',
            key: 'satisfaction_rate'
        }
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

    // Animate counters on scroll
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        statistics.forEach((stat) => {
                            let start = 0;
                            const end = stat.value;
                            const duration = 2000;
                            const increment = end / (duration / 16);

                            const timer = setInterval(() => {
                                start += increment;
                                if (start >= end) {
                                    start = end;
                                    clearInterval(timer);
                                }
                                setCounters(prev => ({
                                    ...prev,
                                    [stat.key]: Math.floor(start)
                                }));
                            }, 16);
                        });
                        observer.disconnect();
                    }
                });
            },
            { threshold: 0.3 }
        );

        const statsSection = document.getElementById('statistics-section');
        if (statsSection) {
            observer.observe(statsSection);
        }

        return () => observer.disconnect();
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

    // Categories based on the Category enum from backend (without RENTALS)
    const categories = [
        { icon: <CelebrationIcon />, title: 'Party / Celebration', desc: 'Professional party planning services for any celebration', color: '#FF6B35', enumValue: 'PARTY' },
        { icon: <CakeIcon />, title: 'Birthday Party', desc: 'Discover amazing birthday party packages and services', color: '#FFB347', enumValue: 'BIRTHDAY' },
        { icon: <BrushIcon />, title: 'Decoration', desc: 'Professional decoration services for all occasions', color: '#FF8C42', enumValue: 'DECORATION' },
        { icon: <CameraAltIcon />, title: 'Photography', desc: 'Capture your special moments with professional photographers', color: '#FF9F4A', enumValue: 'PHOTOGRAPHY' },
        { icon: <FavoriteIcon />, title: 'Wedding', desc: 'Plan your dream wedding with our expert wedding planners', color: '#FF6B35', enumValue: 'WEDDING' },
        { icon: <BusinessIcon />, title: 'Corporate Event', desc: 'Professional corporate event planning and management', color: '#FFB347', enumValue: 'CORPORATE' },
        { icon: <EngagementRingIcon />, title: 'Engagement', desc: 'Make your engagement unforgettable with our services', color: '#FF8C42', enumValue: 'ENGAGEMENT' },
        { icon: <AnniversaryGiftIcon />, title: 'Anniversary', desc: 'Celebrate your love story with amazing anniversary services', color: '#FF9F4A', enumValue: 'ANNIVERSARY' },
        { icon: <SchoolIcon />, title: 'Graduation Party', desc: 'Honor your achievements with a memorable graduation party', color: '#FF6B35', enumValue: 'GRADUATION_CEREMONY' },
        { icon: <LocalFloristIcon />, title: 'Floral Design', desc: 'Beautiful floral arrangements for any occasion', color: '#FFB347', enumValue: 'FLOWERS' },
        { icon: <WbIncandescentIcon />, title: 'Lighting', desc: 'Professional lighting setup for events', color: '#FF8C42', enumValue: 'LIGHTING' },
        { icon: <EmojiEventsIcon />, title: 'Stage Setup', desc: 'Stage design and setup services', color: '#FF9F4A', enumValue: 'STAGE_SETUP' }
    ];

    return (
        <Box sx={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #FFF9F0 0%, #F5F0E8 100%)',
            position: 'relative',
            overflowX: 'hidden',
            fontFamily: "'Inter', sans-serif"
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

            {/* Header - FULL WIDTH */}
            <Box sx={{
                position: 'sticky',
                top: 0,
                zIndex: 100,
                backgroundColor: alpha('#FFFFFF', 0.95),
                backdropFilter: 'blur(10px)',
                borderBottom: '1px solid rgba(0,0,0,0.08)',
                boxShadow: '0 2px 20px rgba(0,0,0,0.03)',
                px: { xs: 2, sm: 3, md: 4, lg: 6 }
            }}>
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    height: 70,
                    maxWidth: '100%',
                    width: '100%'
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
            </Box>

            {/* Main Content - FULL WIDTH */}
            <Box sx={{
                position: 'relative',
                zIndex: 3,
                py: { xs: 4, md: 6 },
                px: { xs: 2, sm: 3, md: 4, lg: 6 }
            }}>
                {/* Hero Section - Image on LEFT, Text on RIGHT aligned with image top */}
                <Fade in timeout={1000}>
                    <Grid container spacing={4} sx={{
                        mb: { xs: 6, md: 8 },
                        animation: `${slideIn} 0.8s ease-out`,
                        width: '100%',
                        m: 0,
                        alignItems: 'flex-start'
                    }}>
                        {/* Left side - Image */}
                        <Grid item xs={12} md={6}>
                            <Box sx={{
                                position: 'relative',
                                borderRadius: '32px',
                                overflow: 'hidden',
                                boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                                transition: 'transform 0.3s ease',
                                '&:hover': {
                                    transform: 'scale(1.02)'
                                }
                            }}>
                                <img
                                    src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80"
                                    alt="Celebration event with decorations and happy people"
                                    style={{
                                        width: '100%',
                                        height: 'auto',
                                        display: 'block',
                                        objectFit: 'cover'
                                    }}
                                />
                            </Box>
                        </Grid>

                        {/* Right side - Text starts from image top edge */}
                        <Grid item xs={12} md={6}>
                            <Box sx={{ p: { xs: 2, md: 4 }, pt: { xs: 2, md: 0 } }}>
                                {/* "About Festivy" title REMOVED */}
                                {/* Orange line REMOVED */}

                                {/* Text content - starts directly */}
                                <Typography variant="body1" sx={{
                                    color: '#3A3A3A',
                                    fontSize: { xs: 16, md: 18 },
                                    lineHeight: 1.9,
                                    fontWeight: 450,
                                    letterSpacing: '0.01em',
                                    mb: 3
                                }}>
                                    <span style={{ fontWeight: 600, color: '#FF6B35' }}>Festivy</span> is your ultimate destination for creating unforgettable celebrations. We bring together the finest party planners, entertainers, and service providers to turn your vision into reality. Whether you're planning an intimate birthday gathering, a romantic engagement, a corporate event, or a grand festival, our platform connects you with professionals who bring passion, creativity, and excellence to every event.
                                </Typography>

                                <Typography variant="body1" sx={{
                                    color: '#3A3A3A',
                                    fontSize: { xs: 16, md: 18 },
                                    lineHeight: 1.9,
                                    fontWeight: 450,
                                    letterSpacing: '0.01em',
                                    mb: 3
                                }}>
                                    At <span style={{ fontWeight: 600, color: '#FF6B35' }}>Festivy</span>, we believe that every celebration tells a unique story. That's why we focus on providing a seamless and personalized experience, helping you discover and collaborate with trusted experts who truly understand your needs. From stunning decorations and delicious catering to live music, photography, and interactive entertainment, every detail is carefully curated to match your style and expectations.
                                </Typography>

                                <Typography variant="body1" sx={{
                                    color: '#3A3A3A',
                                    fontSize: { xs: 16, md: 18 },
                                    lineHeight: 1.9,
                                    fontWeight: 450,
                                    letterSpacing: '0.01em',
                                    mb: 3
                                }}>
                                    Our mission is to simplify the event planning process while elevating the quality of your celebrations. With an easy-to-use platform and a wide range of verified service providers, you can explore ideas, compare options, and make confident decisions—all in one place. No matter the size or theme of your event, <span style={{ fontWeight: 600, color: '#FF6B35' }}>Festivy</span> empowers you to create moments that leave lasting impressions.
                                </Typography>

                                <Typography variant="body1" sx={{
                                    color: '#3A3A3A',
                                    fontSize: { xs: 16, md: 18 },
                                    lineHeight: 1.9,
                                    fontWeight: 450,
                                    letterSpacing: '0.01em',
                                    fontStyle: 'italic'
                                }}>
                                    Let <span style={{ fontWeight: 600, color: '#FF6B35' }}>Festivy</span> be your partner in celebration, where imagination meets professionalism, and every occasion becomes a cherished memory.
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </Fade>

                {/* Service Categories Section - FULL WIDTH */}
                <Box sx={{ mb: 8, width: '100%' }}>
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

                    <Grid container spacing={3} sx={{ width: '100%', m: 0 }}>
                        {categories.map((category, index) => (
                            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
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
                                                mb: 1,
                                                fontSize: { xs: '0.95rem', sm: '1.05rem' }
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

                {/* Statistics Section - NEW */}
                <Box id="statistics-section" sx={{
                    mb: 8,
                    width: '100%',
                    py: 6,
                    borderRadius: '48px',
                    background: alpha('#FFFFFF', 0.5),
                    backdropFilter: 'blur(10px)'
                }}>
                    <Typography variant="h3" sx={{
                        fontSize: { xs: 28, md: 38 },
                        fontWeight: 700,
                        color: '#2C2C2C',
                        textAlign: 'center',
                        mb: 2
                    }}>
                        Our <span style={{ color: '#FF6B35' }}>Impact</span> in Numbers
                    </Typography>
                    <Box sx={{
                        width: 60,
                        height: 3,
                        background: 'linear-gradient(90deg, #FF6B35, #FFB347)',
                        borderRadius: 2,
                        mx: 'auto',
                        mb: 6
                    }} />

                    <Grid container spacing={4} sx={{ width: '100%', m: 0 }}>
                        {statistics.map((stat, index) => (
                            <Grid item xs={12} sm={6} md={3} key={index}>
                                <Zoom in timeout={500 + index * 200}>
                                    <Box sx={{
                                        textAlign: 'center',
                                        p: 3,
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            transform: 'translateY(-10px)'
                                        }
                                    }}>
                                        <Box sx={{
                                            width: 80,
                                            height: 80,
                                            borderRadius: '50%',
                                            background: `linear-gradient(135deg, ${stat.color}20, ${stat.color}05)`,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            mx: 'auto',
                                            mb: 2,
                                            color: stat.color,
                                            border: `2px solid ${alpha(stat.color, 0.3)}`
                                        }}>
                                            {stat.icon}
                                        </Box>
                                        <Typography variant="h3" sx={{
                                            fontSize: { xs: 36, md: 48 },
                                            fontWeight: 800,
                                            color: stat.color,
                                            mb: 1,
                                            fontFamily: 'monospace'
                                        }}>
                                            {counters[stat.key] || 0}{stat.suffix}
                                        </Typography>
                                        <Typography variant="body1" sx={{
                                            color: '#5A5A5A',
                                            fontWeight: 600,
                                            fontSize: '1.1rem'
                                        }}>
                                            {stat.label}
                                        </Typography>
                                    </Box>
                                </Zoom>
                            </Grid>
                        ))}
                    </Grid>
                </Box>

                {/* Footer - FULL WIDTH */}
                <Box sx={{
                    py: 4,
                    textAlign: 'center',
                    borderTop: '1px solid rgba(0,0,0,0.08)',
                    width: '100%'
                }}>
                    <Typography variant="body2" sx={{ color: '#8A8A8A' }}>
                        © 2026 Festivy. All rights reserved.
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
};

// Scrollbar styles
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

export default AboutUsPage;