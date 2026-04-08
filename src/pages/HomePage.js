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
    Chip,
    Fade,
    Zoom,
    useMediaQuery,
    useTheme,
    Tooltip,
    Paper,
    TextField,
    InputAdornment,
    Select,
    FormControl,
    InputLabel,
    GlobalStyles
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import CloseIcon from '@mui/icons-material/Close';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import CelebrationIcon from '@mui/icons-material/Celebration';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import ExploreIcon from '@mui/icons-material/Explore';
import FavoriteIcon from '@mui/icons-material/Favorite';
import EmailIcon from '@mui/icons-material/Email';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import StarIcon from '@mui/icons-material/Star';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CakeIcon from '@mui/icons-material/Cake';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import BrushIcon from '@mui/icons-material/Brush';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import InfoIcon from '@mui/icons-material/Info';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import SearchIcon from '@mui/icons-material/Search';
import WhatshotIcon from '@mui/icons-material/Whatshot'; // Changed from VisibilityIcon
import { alpha, keyframes } from '@mui/material/styles';
import LoginPage from './LoginPage';
import SignUpPage from './SignUpPage';
import VerifyCodePage from './VerifyCodePage';
import { useAuth } from '../context/AuthContext';

// Custom animations
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

const slideIn = keyframes`
    from { opacity: 0; transform: translateX(-50px); }
    to { opacity: 1; transform: translateX(0); }
`;

// Global scrollbar styles
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

// Category configurations
const categories = [
    { id: 'PARTY', name: 'Party / Celebration', icon: <CelebrationIcon />, color: '#FF6B35', description: 'Epic parties & celebrations' },
    { id: 'BIRTHDAY', name: 'Birthday Party', icon: <CakeIcon />, color: '#FFB347', description: 'Magical birthday experiences' },
    { id: 'ENTERTAINMENT', name: 'Entertainment', icon: <EmojiEventsIcon />, color: '#FF8C42', description: 'Engaging entertainment' },
    { id: 'CATERING', name: 'Catering', icon: <RestaurantIcon />, color: '#FF9F4A', description: 'Exquisite cuisine' },
    { id: 'DECORATION', name: 'Decoration', icon: <BrushIcon />, color: '#FFA559', description: 'Transform spaces' },
    { id: 'PHOTOGRAPHY', name: 'Photography', icon: <CameraAltIcon />, color: '#FF6B35', description: 'Capture moments' },
    { id: 'MUSIC', name: 'Music / DJ', icon: <MusicNoteIcon />, color: '#FFB347', description: 'Perfect vibes' },
    { id: 'VENUE', name: 'Venue', icon: <LocationOnIcon />, color: '#FF8C42', description: 'Stunning venues' },
    { id: 'OTHER', name: 'Other Services', icon: <MoreHorizIcon />, color: '#FF9F4A', description: 'Unique services' }
];

const CATEGORIES = [
    'PARTY', 'BIRTHDAY', 'ENTERTAINMENT', 'CATERING',
    'DECORATION', 'PHOTOGRAPHY', 'MUSIC', 'VENUE', 'OTHER'
];

const ARMENIAN_LOCATIONS = [
    { value: 'YEREVAN', label: 'Yerevan' },
    { value: 'GYUMRI', label: 'Gyumri' },
    { value: 'VANADZOR', label: 'Vanadzor' },
    { value: 'VAGHARSHAPAT', label: 'Vagharshapat (Ejmiatsin)' },
    { value: 'ABOVYAN', label: 'Abovyan' },
    { value: 'KAPAN', label: 'Kapan' },
    { value: 'HRAZDAN', label: 'Hrazdan' },
    { value: 'ARMAVIR', label: 'Armavir' },
    { value: 'ARTASHAT', label: 'Artashat' },
    { value: 'IJEVAN', label: 'Ijevan' },
    { value: 'GAVAR', label: 'Gavar' },
    { value: 'GORIS', label: 'Goris' },
    { value: 'CHARENTSAVAN', label: 'Charentsavan' },
    { value: 'ARARAT', label: 'Ararat' },
    { value: 'MASIS', label: 'Masis' },
    { value: 'SEVAN', label: 'Sevan' },
    { value: 'ASHTARAK', label: 'Ashtarak' },
    { value: 'DILIJAN', label: 'Dilijan' },
    { value: 'SISIAN', label: 'Sisian' },
    { value: 'ALAVERDI', label: 'Alaverdi' },
    { value: 'STEPANAVAN', label: 'Stepanavan' },
    { value: 'MARTUNI', label: 'Martuni' },
    { value: 'VARDENIS', label: 'Vardenis' },
    { value: 'YEGHVARD', label: 'Yeghvard' },
    { value: 'METSAMOR', label: 'Metsamor' },
    { value: 'BERD', label: 'Berd' },
    { value: 'TASHIR', label: 'Tashir' },
    { value: 'APARAN', label: 'Aparan' },
    { value: 'VAYK', label: 'Vayk' },
    { value: 'JERMUK', label: 'Jermuk' }
];

// Random positions for scattered categories
const getRandomPosition = (index) => {
    const positions = [
        { top: '12%', left: '5%', size: 90, anim: float, delay: 0, duration: 7 },
        { top: '18%', right: '3%', size: 75, anim: floatReverse, delay: 0.5, duration: 8 },
        { top: '35%', left: '8%', size: 65, anim: float, delay: 1, duration: 6 },
        { top: '28%', right: '10%', size: 85, anim: floatReverse, delay: 1.5, duration: 9 },
        { top: '50%', left: '15%', size: 70, anim: float, delay: 0.8, duration: 7.5 },
        { top: '45%', right: '5%', size: 80, anim: floatReverse, delay: 2, duration: 8.5 },
        { top: '65%', left: '3%', size: 60, anim: float, delay: 1.2, duration: 6.5 },
        { top: '60%', right: '8%', size: 95, anim: floatReverse, delay: 0.3, duration: 7.8 },
        { top: '78%', left: '12%', size: 70, anim: float, delay: 1.8, duration: 8.2 },
        { top: '20%', left: '25%', size: 55, anim: floatReverse, delay: 2.2, duration: 5.5 },
        { top: '40%', left: '35%', size: 45, anim: float, delay: 0.6, duration: 6.8 },
        { top: '55%', left: '45%', size: 50, anim: floatReverse, delay: 1.4, duration: 7.2 },
        { top: '70%', left: '55%', size: 40, anim: float, delay: 2.5, duration: 5.8 },
        { top: '15%', right: '20%', size: 60, anim: floatReverse, delay: 0.9, duration: 8.8 },
        { top: '30%', right: '30%', size: 50, anim: float, delay: 1.7, duration: 6.3 },
        { top: '48%', right: '40%', size: 45, anim: floatReverse, delay: 2.1, duration: 7.6 },
        { top: '62%', left: '28%', size: 55, anim: float, delay: 0.4, duration: 9.2 },
        { top: '80%', right: '20%', size: 65, anim: floatReverse, delay: 1.1, duration: 6.9 },
        { top: '85%', left: '35%', size: 50, anim: float, delay: 2.3, duration: 7.4 },
        { top: '10%', left: '45%', size: 48, anim: floatReverse, delay: 0.7, duration: 8.1 },
        { top: '90%', right: '45%', size: 42, anim: float, delay: 1.9, duration: 5.9 },
        { top: '5%', right: '50%', size: 38, anim: floatReverse, delay: 2.4, duration: 6.4 },
        { top: '72%', left: '65%', size: 48, anim: float, delay: 0.2, duration: 7.7 },
        { top: '42%', left: '60%', size: 52, anim: floatReverse, delay: 1.6, duration: 8.3 },
    ];
    return positions[index % positions.length];
};

function HomePage() {
    const { user, logout, isAdmin } = useAuth();
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });
    const [loginModalOpen, setLoginModalOpen] = useState(false);
    const [signupModalOpen, setSignupModalOpen] = useState(false);
    const [verifyModalOpen, setVerifyModalOpen] = useState(false);
    const [verifyEmail, setVerifyEmail] = useState('');
    const [anchorEl, setAnchorEl] = useState(null);
    const [backgroundPosition, setBackgroundPosition] = useState({ x: 0, y: 0 });
    const [hoveredCategory, setHoveredCategory] = useState(null);

    // Search states
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedLocation, setSelectedLocation] = useState('');

    useEffect(() => {
        const handleMouseMove = (e) => {
            const x = e.clientX / window.innerWidth;
            const y = e.clientY / window.innerHeight;
            setBackgroundPosition({ x, y });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

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

    const handleServicesClick = (categoryId = null) => {
        if (!user) {
            setSnackbar({ open: true, message: 'Please sign in to browse services', severity: 'warning' });
            handleOpenLoginModal();
            return;
        }
        if (categoryId) {
            navigate(`/services?category=${categoryId}`);
        } else {
            navigate('/services');
        }
    };

    // Search handler - saves search params and navigates to ServicesPage
    const handleSearch = () => {
        if (!user) {
            setSnackbar({ open: true, message: 'Please sign in to search services', severity: 'warning' });
            handleOpenLoginModal();
            return;
        }

        // Build search params object
        const searchParams = {};
        if (searchQuery.trim()) searchParams.query = searchQuery.trim();
        if (selectedCategory) searchParams.category = selectedCategory;
        if (selectedLocation) searchParams.location = selectedLocation;

        // Save to sessionStorage for persistence
        sessionStorage.setItem('servicesSearchParams', JSON.stringify(searchParams));

        // Navigate to services page with search params in URL
        const urlParams = new URLSearchParams();
        if (searchQuery.trim()) urlParams.append('query', searchQuery.trim());
        if (selectedCategory) urlParams.append('category', selectedCategory);
        if (selectedLocation) urlParams.append('location', selectedLocation);

        navigate(`/services?${urlParams.toString()}`);
    };

    const handleClearSearch = () => {
        setSearchQuery('');
        setSelectedCategory('');
        setSelectedLocation('');
    };

    const handleAboutClick = () => navigate('/about');

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

    const userInitial = user?.userName ? user.userName.charAt(0).toUpperCase() : '';

    // Create scattered category elements
    const scatteredCategories = [];
    for (let i = 0; i < 24; i++) {
        const category = categories[i % categories.length];
        const pos = getRandomPosition(i);
        scatteredCategories.push(
            <Box
                key={`scattered-${i}`}
                sx={{
                    position: 'absolute',
                    top: pos.top,
                    left: pos.left,
                    right: pos.right,
                    zIndex: 1,
                    cursor: 'pointer',
                    animation: `${pos.anim} ${pos.duration}s ease-in-out infinite`,
                    animationDelay: `${pos.delay}s`,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        transform: 'scale(1.15) !important',
                        filter: 'drop-shadow(0 0 15px rgba(255,107,53,0.5))'
                    }
                }}
                onMouseEnter={() => setHoveredCategory(category.id)}
                onMouseLeave={() => setHoveredCategory(null)}
                onClick={() => handleServicesClick(category.id)}
            >
                <Tooltip title={category.name} placement="top" arrow>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 1
                    }}>
                        <Box sx={{
                            width: pos.size,
                            height: pos.size,
                            borderRadius: '50%',
                            background: `linear-gradient(135deg, ${category.color}20, ${category.color}05)`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: `2px solid ${alpha(category.color, hoveredCategory === category.id ? 0.8 : 0.3)}`,
                            backdropFilter: 'blur(8px)',
                            transition: 'all 0.3s',
                            boxShadow: hoveredCategory === category.id ? `0 0 30px ${alpha(category.color, 0.4)}` : 'none'
                        }}>
                            <Box sx={{
                                color: category.color,
                                fontSize: pos.size * 0.4,
                                display: 'flex',
                                transition: 'all 0.3s'
                            }}>
                                {category.icon}
                            </Box>
                        </Box>
                        {hoveredCategory === category.id && (
                            <Typography sx={{
                                fontSize: '12px',
                                fontWeight: 600,
                                color: category.color,
                                bgcolor: alpha('#FFFFFF', 0.9),
                                px: 1.5,
                                py: 0.5,
                                borderRadius: 20,
                                whiteSpace: 'nowrap',
                                backdropFilter: 'blur(4px)'
                            }}>
                                {category.name}
                            </Typography>
                        )}
                    </Box>
                </Tooltip>
            </Box>
        );
    }

    return (
        <Box sx={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #FFF9F0 0%, #F5F0E8 100%)',
            position: 'relative',
            overflowX: 'hidden',
            fontFamily: 'Inter, sans-serif'
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

            {/* Scattered Categories - Background layer */}
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
                {categories.map((cat, idx) => (
                    <Box
                        key={`bg-circle-${idx}`}
                        sx={{
                            position: 'absolute',
                            top: `${(idx * 13) % 100}%`,
                            left: `${(idx * 17) % 100}%`,
                            width: `${150 + (idx * 20)}px`,
                            height: `${150 + (idx * 20)}px`,
                            borderRadius: '50%',
                            background: `radial-gradient(circle, ${alpha(cat.color, 0.06)} 0%, transparent 70%)`,
                            animation: `${pulse} ${8 + idx}s ease-in-out infinite`,
                            pointerEvents: 'none'
                        }}
                    />
                ))}
            </Box>

            {/* Scattered Categories - Interactive layer */}
            <Box sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 2,
                pointerEvents: 'none',
                overflow: 'hidden'
            }}>
                {!isMobile && scatteredCategories}
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
                                sx={{ fontWeight: 500, color: '#4A4A4A', '&:hover': { color: '#FF6B35' } }}
                                onClick={handleAboutClick}
                            >
                                About Us
                            </Button>
                            <Button
                                startIcon={<HowToRegIcon />}
                                sx={{ fontWeight: 500, color: '#4A4A4A', '&:hover': { color: '#FF6B35' } }}
                                onClick={() => handleServicesClick()}
                            >
                                How It Works
                            </Button>
                            <Button
                                startIcon={<CelebrationIcon />}
                                sx={{ fontWeight: 500, color: '#FF6B35' }}
                                onClick={() => handleServicesClick()}
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
                                        <MenuItem onClick={() => handleServicesClick()}><CelebrationIcon sx={{ mr: 2, fontSize: 20, color: '#FF6B35' }} />Services</MenuItem>
                                        {isAdmin && (
                                            <MenuItem onClick={handleAdminPanel}><AdminPanelSettingsIcon sx={{ mr: 2, fontSize: 20, color: '#FF9800' }} />Admin Panel</MenuItem>
                                        )}
                                        <Divider />
                                        <MenuItem onClick={handleLogout}><LogoutIcon sx={{ mr: 2, fontSize: 20, color: '#FF6B35' }} />Logout</MenuItem>
                                    </Menu>
                                </>
                            ) : (
                                <>
                                    <Button sx={{ fontWeight: 500, color: '#4A4A4A', '&:hover': { color: '#FF6B35' } }} onClick={handleOpenLoginModal}>
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
                                        onClick={handleOpenSignupModal}
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
            <Box sx={{ position: 'relative', zIndex: 3 }}>
                {/* Hero Section */}
                <Box sx={{
                    minHeight: { xs: 'auto', md: 'auto' },
                    display: 'flex',
                    alignItems: 'center',
                    py: { xs: 4, md: 3 },
                    position: 'relative'
                }}>
                    <Container maxWidth={false} sx={{ px: { xs: 3, md: 8, lg: 12 } }}>
                        <Fade in timeout={1000}>
                            <Box sx={{
                                width: '100%',
                                animation: `${slideIn} 0.8s ease-out`,
                                textAlign: 'center'
                            }}>
                                {/* Main Title */}
                                <Typography
                                    variant="h1"
                                    sx={{
                                        fontSize: { xs: 36, sm: 48, md: 64, lg: 80 },
                                        fontWeight: 800,
                                        lineHeight: 1.2,
                                        mb: 2,
                                        letterSpacing: '-0.02em',
                                        textAlign: 'center'
                                    }}
                                >
                                    <Box component="span" sx={{ color: '#2C2C2C' }}>
                                        Discover Amazing{' '}
                                    </Box>
                                    <Box component="span" sx={{
                                        background: 'linear-gradient(135deg, #FF6B35 0%, #FFB347 100%)',
                                        backgroundClip: 'text',
                                        WebkitBackgroundClip: 'text',
                                        color: 'transparent'
                                    }}>
                                        Holiday Services
                                    </Box>
                                </Typography>

                                {/* Decorative line */}
                                <Box sx={{
                                    width: 60,
                                    height: 3,
                                    background: 'linear-gradient(90deg, #FF6B35, #FFB347)',
                                    borderRadius: 2,
                                    mb: 3,
                                    mx: 'auto'
                                }} />

                                {/* Dynamic, interesting call-to-action text */}
                                <Typography
                                    sx={{
                                        fontSize: { xs: 18, md: 22, lg: 24 },
                                        fontWeight: 500,
                                        color: '#4A4A4A',
                                        lineHeight: 1.5,
                                        mb: 3,
                                        maxWidth: 700,
                                        mx: 'auto',
                                        textAlign: 'center'
                                    }}
                                >
                                    Your next celebration is just a click away.
                                    <Box component="span" sx={{ display: 'inline-block', ml: 1, animation: `${pulse} 2s infinite` }}>
                                        🎉
                                    </Box>
                                </Typography>

                                {/* Search Bar */}
                                <Paper elevation={0} sx={{
                                    maxWidth: 900,
                                    mx: 'auto',
                                    mb: 4,
                                    p: 2,
                                    borderRadius: '60px',
                                    background: alpha('#FFFFFF', 0.95),
                                    backdropFilter: 'blur(10px)',
                                    boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                                    border: '1px solid rgba(255,107,53,0.15)'
                                }}>
                                    <Grid container spacing={2} alignItems="center">
                                        <Grid item xs={12} md={4}>
                                            <TextField
                                                fullWidth
                                                placeholder="Search services..."
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <SearchIcon sx={{ color: '#FF6B35' }} />
                                                        </InputAdornment>
                                                    ),
                                                    sx: {
                                                        borderRadius: '40px',
                                                        bgcolor: '#FAFAFA',
                                                        '& .MuiOutlinedInput-notchedOutline': {
                                                            borderColor: '#E8E0D8'
                                                        },
                                                        '&:hover .MuiOutlinedInput-notchedOutline': {
                                                            borderColor: '#FFB347'
                                                        }
                                                    }
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={3}>
                                            <FormControl fullWidth>
                                                <InputLabel sx={{ color: '#8A8A8A' }}>Category</InputLabel>
                                                <Select
                                                    value={selectedCategory}
                                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                                    label="Category"
                                                    sx={{
                                                        borderRadius: '40px',
                                                        bgcolor: '#FAFAFA',
                                                        '& .MuiOutlinedInput-notchedOutline': {
                                                            borderColor: '#E8E0D8'
                                                        }
                                                    }}
                                                >
                                                    <MenuItem value="">All Categories</MenuItem>
                                                    {CATEGORIES.map((cat) => (
                                                        <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} md={3}>
                                            <FormControl fullWidth>
                                                <InputLabel sx={{ color: '#8A8A8A' }}>Location</InputLabel>
                                                <Select
                                                    value={selectedLocation}
                                                    onChange={(e) => setSelectedLocation(e.target.value)}
                                                    label="Location"
                                                    sx={{
                                                        borderRadius: '40px',
                                                        bgcolor: '#FAFAFA',
                                                        '& .MuiOutlinedInput-notchedOutline': {
                                                            borderColor: '#E8E0D8'
                                                        }
                                                    }}
                                                >
                                                    <MenuItem value="">All Locations</MenuItem>
                                                    {ARMENIAN_LOCATIONS.map((location) => (
                                                        <MenuItem key={location.value} value={location.value}>{location.label}</MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} md={2}>
                                            <Stack direction="row" spacing={1}>
                                                <Button
                                                    fullWidth
                                                    variant="contained"
                                                    onClick={handleSearch}
                                                    sx={{
                                                        background: 'linear-gradient(135deg, #FF6B35 0%, #FFB347 100%)',
                                                        height: '56px',
                                                        borderRadius: '40px',
                                                        textTransform: 'none',
                                                        fontWeight: 600,
                                                        fontSize: '15px',
                                                        boxShadow: '0 4px 12px rgba(255,107,53,0.25)',
                                                        '&:hover': {
                                                            transform: 'translateY(-2px)',
                                                            boxShadow: '0 6px 16px rgba(255,107,53,0.35)'
                                                        }
                                                    }}
                                                >
                                                    Search
                                                </Button>
                                                {(searchQuery || selectedCategory || selectedLocation) && (
                                                    <Tooltip title="Clear filters">
                                                        <IconButton
                                                            onClick={handleClearSearch}
                                                            sx={{
                                                                height: '56px',
                                                                width: '56px',
                                                                border: '1px solid #F0E8E0',
                                                                borderRadius: '40px',
                                                                bgcolor: '#FAFAFA',
                                                                color: '#8A8A8A',
                                                                '&:hover': {
                                                                    bgcolor: alpha('#FF6B35', 0.05),
                                                                    color: '#FF6B35'
                                                                }
                                                            }}
                                                        >
                                                            <CloseIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                )}
                                            </Stack>
                                        </Grid>
                                    </Grid>
                                </Paper>

                                {/* CTA Buttons */}
                                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2.5} justifyContent="center">
                                    <Button
                                        variant="contained"
                                        onClick={() => handleServicesClick()}
                                        endIcon={<RocketLaunchIcon />}
                                        sx={{
                                            background: 'linear-gradient(135deg, #FF6B35 0%, #FFB347 100%)',
                                            borderRadius: '40px',
                                            padding: '12px 32px',
                                            fontSize: 15,
                                            fontWeight: 600,
                                            textTransform: 'none',
                                            boxShadow: '0 8px 20px rgba(255,107,53,0.25)',
                                            '&:hover': {
                                                transform: 'translateY(-2px)',
                                                boxShadow: '0 12px 28px rgba(255,107,53,0.35)',
                                            },
                                            transition: 'all 0.3s'
                                        }}
                                    >
                                        Browse All Services
                                    </Button>
                                    <Button
                                        variant="contained"
                                        onClick={() => handleServicesClick()}
                                        endIcon={<WhatshotIcon />}
                                        sx={{
                                            background: 'linear-gradient(135deg, #FF6B35 0%, #FFB347 100%)',
                                            borderRadius: '40px',
                                            padding: '12px 32px',
                                            fontSize: 15,
                                            fontWeight: 600,
                                            textTransform: 'none',
                                            boxShadow: '0 8px 20px rgba(255,107,53,0.25)',
                                            '&:hover': {
                                                transform: 'translateY(-2px)',
                                                boxShadow: '0 12px 28px rgba(255,107,53,0.35)',
                                            },
                                            transition: 'all 0.3s'
                                        }}
                                    >
                                        View Popular Services
                                    </Button>
                                </Stack>
                            </Box>
                        </Fade>
                    </Container>

                    {/* Decorative floating elements */}
                    {!isMobile && (
                        <Box sx={{
                            position: 'absolute',
                            right: '5%',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            opacity: 0.6
                        }}>
                            <Box sx={{
                                width: 120,
                                height: 120,
                                borderRadius: '50%',
                                background: `radial-gradient(circle, ${alpha('#FF6B35', 0.15)} 0%, transparent 70%)`,
                                animation: `${pulse} 4s ease-in-out infinite`
                            }} />
                        </Box>
                    )}
                </Box>

                {/* How It Works Section */}
                <Box id="how-it-works" sx={{
                    py: { xs: 8, md: 10 },
                    mt: -5,
                    position: 'relative',
                    borderTop: '1px solid rgba(0,0,0,0.05)',
                    borderBottom: '1px solid rgba(0,0,0,0.05)',
                    background: 'transparent'
                }}>
                    <Container maxWidth="lg">
                        <Box sx={{ textAlign: 'center', mb: 6 }}>
                            <Typography variant="h3" sx={{
                                fontSize: { xs: 28, md: 38 },
                                fontWeight: 700,
                                color: '#2C2C2C',
                                mb: 2
                            }}>
                                How It Works
                            </Typography>
                            <Box sx={{
                                width: 60,
                                height: 3,
                                background: 'linear-gradient(90deg, #FF6B35, #FFB347)',
                                borderRadius: 2,
                                mx: 'auto'
                            }} />
                        </Box>

                        <Grid container spacing={4}>
                            {[
                                {
                                    icon: <ExploreIcon sx={{ fontSize: 40 }} />,
                                    title: 'Explore',
                                    desc: 'Browse through 9+ curated service categories and discover the perfect vendors for your event.',
                                    color: '#FF6B35',
                                    gradient: 'linear-gradient(135deg, #FF6B35 0%, #FF8C42 100%)'
                                },
                                {
                                    icon: <FavoriteIcon sx={{ fontSize: 40 }} />,
                                    title: 'Curate',
                                    desc: 'Save your favorites, compare options, and build your dream team of service providers.',
                                    color: '#FFB347',
                                    gradient: 'linear-gradient(135deg, #FFB347 0%, #FF9F4A 100%)'
                                },
                                {
                                    icon: <EmailIcon sx={{ fontSize: 40 }} />,
                                    title: 'Connect',
                                    desc: 'Reach out to providers directly and bring your celebration to life with ease.',
                                    color: '#FF8C42',
                                    gradient: 'linear-gradient(135deg, #FF8C42 0%, #FFA559 100%)'
                                }
                            ].map((step, idx) => (
                                <Grid item xs={12} md={4} key={idx}>
                                    <Zoom in timeout={500 + idx * 200}>
                                        <Box sx={{
                                            textAlign: 'center',
                                            p: 4,
                                            borderRadius: '32px',
                                            background: alpha(step.color, 0.04),
                                            backdropFilter: 'blur(10px)',
                                            border: `1px solid ${alpha(step.color, 0.15)}`,
                                            transition: 'all 0.4s cubic-bezier(0.2, 0.9, 0.4, 1.1)',
                                            boxShadow: '0 8px 20px rgba(0,0,0,0.02)',
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            '&:hover': {
                                                transform: 'translateY(-10px)',
                                                background: alpha(step.color, 0.08),
                                                borderColor: alpha(step.color, 0.4),
                                                boxShadow: `0 20px 35px ${alpha(step.color, 0.15)}`,
                                            }
                                        }}>
                                            <Box sx={{
                                                width: 80,
                                                height: 80,
                                                borderRadius: '28px',
                                                background: step.gradient,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                mx: 'auto',
                                                mb: 3,
                                                boxShadow: `0 10px 20px ${alpha(step.color, 0.25)}`,
                                                transition: 'transform 0.3s',
                                                '&:hover': {
                                                    transform: 'scale(1.05)'
                                                }
                                            }}>
                                                <Box sx={{ color: '#FFFFFF', fontSize: 40, display: 'flex' }}>
                                                    {step.icon}
                                                </Box>
                                            </Box>
                                            <Typography variant="h5" sx={{
                                                color: step.color,
                                                fontWeight: 700,
                                                mb: 1.5,
                                                letterSpacing: '-0.3px'
                                            }}>
                                                {step.title}
                                            </Typography>
                                            <Typography sx={{
                                                color: '#5A5A5A',
                                                lineHeight: 1.6,
                                                fontSize: '0.95rem'
                                            }}>
                                                {step.desc}
                                            </Typography>
                                        </Box>
                                    </Zoom>
                                </Grid>
                            ))}
                        </Grid>
                    </Container>
                </Box>

                {/* Footer */}
                <Box sx={{
                    py: 5,
                    textAlign: 'center',
                    background: '#FFFFFF',
                    borderTop: '1px solid #F0E8E0'
                }}>
                    <Container maxWidth="lg">
                        <Typography variant="body2" sx={{ color: '#8A8A8A' }}>
                            © 2026 Festivy. All rights reserved.
                        </Typography>
                    </Container>
                </Box>
            </Box>

            {/* Modals */}
            <Modal open={loginModalOpen} onClose={handleCloseLoginModal} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)' }}>
                <Box sx={{ width: '90%', maxWidth: 470, maxHeight: '90vh', bgcolor: '#FFFFFF', borderRadius: '24px', border: '1px solid #F0E8E0', position: 'relative', overflow: 'hidden', boxShadow: '0 24px 48px rgba(0,0,0,0.15)' }}>
                    <IconButton onClick={handleCloseLoginModal} sx={{ position: 'absolute', top: 16, right: 16, zIndex: 10, backgroundColor: alpha('#000000', 0.5), color: '#FFFFFF', '&:hover': { backgroundColor: alpha('#000000', 0.7) } }}>
                        <CloseIcon />
                    </IconButton>
                    <LoginPage isModal={true} onClose={handleCloseLoginModal} onSwitchToSignup={handleSwitchToSignup} />
                </Box>
            </Modal>

            <Modal open={signupModalOpen} onClose={handleCloseSignupModal} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)' }}>
                <Box sx={{ width: '90%', maxWidth: 470, maxHeight: '90vh', bgcolor: '#FFFFFF', borderRadius: '24px', border: '1px solid #F0E8E0', position: 'relative', overflow: 'hidden', boxShadow: '0 24px 48px rgba(0,0,0,0.15)' }}>
                    <IconButton onClick={handleCloseSignupModal} sx={{ position: 'absolute', top: 16, right: 16, zIndex: 10, backgroundColor: alpha('#000000', 0.5), color: '#FFFFFF', '&:hover': { backgroundColor: alpha('#000000', 0.7) } }}>
                        <CloseIcon />
                    </IconButton>
                    <SignUpPage isModal={true} onClose={handleCloseSignupModal} onSwitchToLogin={handleSwitchToLogin} onSuccess={handleSignupSuccess} />
                </Box>
            </Modal>

            <Modal open={verifyModalOpen} onClose={handleCloseVerifyModal} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)' }}>
                <Box sx={{ width: '90%', maxWidth: 500, bgcolor: '#FFFFFF', borderRadius: '24px', border: '1px solid #F0E8E0', position: 'relative', overflow: 'hidden', boxShadow: '0 24px 48px rgba(0,0,0,0.15)' }}>
                    <IconButton onClick={handleCloseVerifyModal} sx={{ position: 'absolute', top: 16, right: 16, zIndex: 10, backgroundColor: alpha('#000000', 0.5), color: '#FFFFFF', '&:hover': { backgroundColor: alpha('#000000', 0.7) } }}>
                        <CloseIcon />
                    </IconButton>
                    <VerifyCodePage isModal={true} onClose={handleCloseVerifyModal} email={verifyEmail} />
                </Box>
            </Modal>

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
}

export default HomePage;