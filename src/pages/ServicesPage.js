// src/pages/ServicesPage.js

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Container,
    Typography,
    Box,
    Grid,
    Button,
    IconButton,
    Chip,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Pagination,
    Skeleton,
    Alert,
    Snackbar,
    Menu,
    Divider,
    CircularProgress,
    Tooltip,
    Backdrop,
    Tabs,
    Tab,
    Collapse,
    Slider,
    Stack,
    Avatar,
    GlobalStyles,
    Fade,
    Grow
} from '@mui/material';
import {
    Email as EmailIcon,
    Close as CloseIcon,
    LocationOn as LocationIcon,
    AccessTime as AccessTimeIcon,
    Event as EventIcon,
    AccountCircle as AccountCircleIcon,
    Logout as LogoutIcon,
    Person as PersonIcon,
    Celebration as CelebrationIcon,
    AdminPanelSettings as AdminIcon,
    FilterAlt as FilterIcon,
    Clear as ClearIcon,
    Info as InfoIcon,
    HowToReg as HowToRegIcon,
    ChevronLeft as ChevronLeftIcon,
    ChevronRight as ChevronRightIcon,
    Image as ImageIcon,
    Category as CategoryIcon,
    Whatshot as WhatshotIcon,
    Phone as PhoneIcon,
    Language as LanguageIcon,
    Facebook as FacebookIcon,
    Instagram as InstagramIcon,
    YouTube as YouTubeIcon,
    LinkedIn as LinkedInIcon,
    Bookmark as BookmarkIcon,
    Lock as LockIcon
} from '@mui/icons-material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { useAuth } from '../context/AuthContext';
import serviceAPI from '../services/serviceAPI';
import { alpha, keyframes, styled } from '@mui/material/styles';

// Custom animations (same as HomePage)
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

const ServiceImage = styled('img')({
    maxWidth: '100%',
    maxHeight: '100%',
    width: 'auto',
    height: 'auto',
    objectFit: 'contain',
    display: 'block',
    borderRadius: '12px'
});

const formatEventDate = (startDate, startTime) => {
    if (!startDate) return null;
    try {
        const date = dayjs(startDate);
        if (!date.isValid()) return null;
        let formatted = date.format('MMMM D, YYYY');
        if (startTime) {
            const time = dayjs(startTime, 'HH:mm');
            if (time.isValid()) {
                formatted += ` at ${time.format('HH:mm')}`;
            }
        }
        return formatted;
    } catch (error) {
        return null;
    }
};

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

const CATEGORIES = [
    'PARTY', 'BIRTHDAY', 'ENTERTAINMENT', 'CATERING',
    'DECORATION', 'PHOTOGRAPHY', 'MUSIC', 'VENUE', 'OTHER'
];

const ServicesPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout, isAdmin } = useAuth();

    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [favorites, setFavorites] = useState(new Set());
    const [favoritesCount, setFavoritesCount] = useState(0);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });
    const [anchorEl, setAnchorEl] = useState(null);
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [activeImageIndex, setActiveImageIndex] = useState({});

    // Tab state - "all" or "popular"
    const [activeTab, setActiveTab] = useState('all');

    // Filter states
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedLocation, setSelectedLocation] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [priceRange, setPriceRange] = useState([0, 1000000]);

    // Load favorites count
    const loadFavoritesCount = async () => {
        try {
            const response = await serviceAPI.getFavorites(0, 100);
            setFavoritesCount(response.data.totalElements || 0);
        } catch (error) {
            console.error('Error loading favorites count:', error);
        }
    };

    // Read URL params on mount
    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const categoryFromUrl = urlParams.get('category');
        const queryFromUrl = urlParams.get('query');
        const locationFromUrl = urlParams.get('location');
        const tabFromUrl = urlParams.get('tab');

        if (categoryFromUrl) setSelectedCategory(categoryFromUrl);
        if (queryFromUrl) setSearchQuery(queryFromUrl);
        if (locationFromUrl) setSelectedLocation(locationFromUrl);
        if (tabFromUrl === 'popular') {
            setActiveTab('popular');
        } else if (tabFromUrl === 'all') {
            setActiveTab('all');
        }

        const savedParams = sessionStorage.getItem('servicesSearchParams');
        if (savedParams) {
            const params = JSON.parse(savedParams);
            if (params.category) setSelectedCategory(params.category);
            if (params.query) setSearchQuery(params.query);
            if (params.location) setSelectedLocation(params.location);
            sessionStorage.removeItem('servicesSearchParams');
        }

        loadInitialData();
    }, []);

    // Load favorites after user is loaded
    useEffect(() => {
        if (user) {
            loadFavorites();
            loadFavoritesCount();
        }
    }, [user]);

    // Load services when page changes or tab changes
    useEffect(() => {
        if (activeTab === 'popular') {
            loadPopularServices();
        } else if (page > 0 || isSearching) {
            performSearch();
        }
    }, [page, activeTab]);

    const loadInitialData = async () => {
        setLoading(true);
        try {
            if (activeTab === 'popular') {
                await loadPopularServices();
            } else {
                await performSearch();
            }
        } catch (error) {
            console.error('Error loading initial data:', error);
        } finally {
            setLoading(false);
        }
    };

    const performSearch = async () => {
        setLoading(true);
        try {
            const searchParams = {
                query: searchQuery || null,
                category: selectedCategory || null,
                location: selectedLocation || null,
                page: page,
                size: 10
            };

            if (minPrice && minPrice !== '') {
                searchParams.minPrice = parseFloat(minPrice);
            }
            if (maxPrice && maxPrice !== '') {
                searchParams.maxPrice = parseFloat(maxPrice);
            }

            const response = await serviceAPI.searchServices(searchParams);
            setServices(response.data.content);
            setTotalPages(response.data.totalPages);
            setTotalElements(response.data.totalElements);
            setIsSearching(true);
        } catch (error) {
            console.error('Error loading services:', error);
            setSnackbar({
                open: true,
                message: 'Failed to load services',
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const loadPopularServices = async () => {
        setLoading(true);
        try {
            const response = await serviceAPI.getPopularServices(page, 10);
            setServices(response.data.content);
            setTotalPages(response.data.totalPages);
            setTotalElements(response.data.totalElements);
            setIsSearching(true);
        } catch (error) {
            console.error('Error loading popular services:', error);
            setSnackbar({
                open: true,
                message: 'Failed to load popular services',
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const loadFavorites = async () => {
        try {
            const response = await serviceAPI.getFavorites(0, 100);
            const favoriteIds = new Set(response.data.content.map(s => s.id));
            setFavorites(favoriteIds);
        } catch (error) {
            console.error('Error loading favorites:', error);
        }
    };

    const handleSearch = () => {
        setPage(0);
        setIsSearching(false);
        if (activeTab === 'popular') {
            loadPopularServices();
        } else {
            performSearch();
        }
    };

    const handleClearFilters = () => {
        setSearchQuery('');
        setSelectedCategory('');
        setSelectedLocation('');
        setMinPrice('');
        setMaxPrice('');
        setPriceRange([0, 1000000]);
        setPage(0);
        setIsSearching(false);
        setTimeout(() => {
            if (activeTab === 'popular') {
                loadPopularServices();
            } else {
                performSearch();
            }
        }, 100);
    };

    const handlePriceRangeChange = (event, newValue) => {
        setPriceRange(newValue);
        setMinPrice(newValue[0].toString());
        setMaxPrice(newValue[1].toString());
    };

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
        setPage(0);
        setIsSearching(false);

        setTimeout(() => {
            if (newValue === 'popular') {
                loadPopularServices();
            } else {
                performSearch();
            }
        }, 100);

        const urlParams = new URLSearchParams(location.search);
        urlParams.set('tab', newValue);
        navigate(`${location.pathname}?${urlParams.toString()}`, { replace: true });
    };

    const handleLikeToggle = async (serviceId, e) => {
        e.stopPropagation();
        try {
            if (favorites.has(serviceId)) {
                await serviceAPI.removeFromFavorites(serviceId);
                setFavorites(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(serviceId);
                    return newSet;
                });
                setFavoritesCount(prev => Math.max(0, prev - 1));
                setServices(prevServices =>
                    prevServices.map(service =>
                        service.id === serviceId
                            ? { ...service, likeCount: Math.max(0, (service.likeCount || 0) - 1) }
                            : service
                    )
                );
                setSnackbar({
                    open: true,
                    message: 'Removed from saved',
                    severity: 'info'
                });
            } else {
                await serviceAPI.addToFavorites(serviceId);
                setFavorites(prev => new Set(prev).add(serviceId));
                setFavoritesCount(prev => prev + 1);
                setServices(prevServices =>
                    prevServices.map(service =>
                        service.id === serviceId
                            ? { ...service, likeCount: (service.likeCount || 0) + 1 }
                            : service
                    )
                );
                setSnackbar({
                    open: true,
                    message: 'Saved to favorites!',
                    severity: 'success'
                });
            }
        } catch (error) {
            console.error('Error toggling favorite:', error);
            setSnackbar({
                open: true,
                message: 'Failed to update',
                severity: 'error'
            });
        }
    };

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = async () => {
        await logout();
        handleMenuClose();
        setSnackbar({ open: true, message: 'Logged out successfully!', severity: 'success' });
        navigate('/');
    };

    const handleAboutClick = () => {
        navigate('/about');
    };

    const handleProfile = () => {
        handleMenuClose();
        navigate('/profile');
    };

    const handleAdminPanel = () => {
        handleMenuClose();
        navigate('/admin/dashboard');
    };

    const handleHowItWorks = () => {
        navigate('/');
        setTimeout(() => {
            const element = document.getElementById('how-it-works');
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }, 100);
    };

    const handleNextImage = (serviceId, totalImages, e) => {
        e.stopPropagation();
        setActiveImageIndex(prev => ({
            ...prev,
            [serviceId]: ((prev[serviceId] || 0) + 1) % totalImages
        }));
    };

    const handlePrevImage = (serviceId, totalImages, e) => {
        e.stopPropagation();
        setActiveImageIndex(prev => ({
            ...prev,
            [serviceId]: ((prev[serviceId] || 0) - 1 + totalImages) % totalImages
        }));
    };

    const userInitial = user?.userName ? user.userName.charAt(0).toUpperCase() : '';

    const activeFiltersCount = [
        searchQuery ? 1 : 0,
        selectedCategory ? 1 : 0,
        selectedLocation ? 1 : 0,
        (minPrice && minPrice !== '0' && minPrice !== '') ? 1 : 0
    ].reduce((a, b) => a + b, 0);

    if (!user) {
        return (
            <Backdrop open={true} sx={{ zIndex: 9999, backgroundColor: 'rgba(255,255,255,0.9)' }}>
                <CircularProgress sx={{ color: '#FF6B35' }} />
            </Backdrop>
        );
    }

    // Helper function to get social media icon
    const getSocialIcon = (platform) => {
        switch(platform?.toUpperCase()) {
            case 'FACEBOOK': return <FacebookIcon sx={{ fontSize: 18, color: '#1877F2' }} />;
            case 'INSTAGRAM': return <InstagramIcon sx={{ fontSize: 18, color: '#E4405F' }} />;
            case 'YOUTUBE': return <YouTubeIcon sx={{ fontSize: 18, color: '#FF0000' }} />;
            case 'LINKEDIN': return <LinkedInIcon sx={{ fontSize: 18, color: '#0077B5' }} />;
            default: return <LanguageIcon sx={{ fontSize: 18, color: '#FF6B35' }} />;
        }
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box sx={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #FFF9F0 0%, #F5F0E8 100%)',
                fontFamily: 'Inter, sans-serif',
                position: 'relative'
            }}>
                <GlobalStyles styles={scrollbarStyles} />

                {/* Header - SAME AS HOMEPAGE */}
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
                                    onClick={handleHowItWorks}
                                >
                                    How It Works
                                </Button>
                                <Button
                                    startIcon={<CelebrationIcon />}
                                    sx={{ fontWeight: 500, color: '#FF6B35', borderBottom: '2px solid #FF6B35', borderRadius: 0 }}
                                    onClick={() => navigate('/services')}
                                >
                                    Services
                                </Button>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                {user ? (
                                    <>
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
                                                onClick={() => navigate('/favorites')}
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
                                            <MenuItem onClick={handleProfile}><PersonIcon sx={{ mr: 2, fontSize: 20, color: '#FF6B35' }} />Profile</MenuItem>
                                            {isAdmin && (
                                                <MenuItem onClick={handleAdminPanel}><AdminIcon sx={{ mr: 2, fontSize: 20, color: '#FF9800' }} />Admin Panel</MenuItem>
                                            )}
                                            <Divider />
                                            <MenuItem onClick={handleLogout}><LogoutIcon sx={{ mr: 2, fontSize: 20, color: '#FF6B35' }} />Logout</MenuItem>
                                        </Menu>
                                    </>
                                ) : (
                                    <>
                                        <Button sx={{ fontWeight: 500, color: '#4A4A4A', '&:hover': { color: '#FF6B35' } }} onClick={() => navigate('/login')}>
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
                                            onClick={() => navigate('/signup')}
                                        >
                                            Sign Up
                                        </Button>
                                    </>
                                )}
                            </Box>
                        </Box>
                    </Container>
                </Box>

                {/* Main Content */}
                <Box sx={{
                    position: 'relative',
                    zIndex: 1,
                    py: { xs: 2, sm: 3, md: 4 },
                    px: { xs: 2, sm: 3, md: 4, lg: 6 }
                }}>
                    {/* Hero Section */}
                    <Fade in={true} timeout={500}>
                        <Box sx={{ textAlign: 'center', mb: 5 }}>
                            <Typography variant="h1" sx={{
                                fontSize: { xs: '36px', md: '56px' },
                                fontWeight: 800,
                                background: 'linear-gradient(135deg, #FF6B35 0%, #FFB347 50%, #FF6B35 100%)',
                                backgroundSize: '200% 200%',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                mb: 2,
                                letterSpacing: '-1px'
                            }}>
                                Make Every Moment Memorable
                            </Typography>
                            <Typography variant="h6" sx={{ color: '#8A99A8', maxWidth: '600px', mx: 'auto' }}>
                                Discover and book the best services for your celebrations
                            </Typography>
                        </Box>
                    </Fade>

                    {/* TABS */}
                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4, borderBottom: '1px solid #E8ECF0' }}>
                        <Tabs
                            value={activeTab}
                            onChange={handleTabChange}
                            sx={{
                                '& .MuiTab-root': {
                                    fontSize: '1rem',
                                    fontWeight: 600,
                                    textTransform: 'none',
                                    minWidth: 120,
                                    py: 1.5,
                                    color: '#8A99A8',
                                    '&.Mui-selected': {
                                        color: '#FF6B35'
                                    }
                                },
                                '& .MuiTabs-indicator': {
                                    backgroundColor: '#FF6B35',
                                    height: 3,
                                    borderRadius: '3px 3px 0 0'
                                }
                            }}
                        >
                            <Tab label="All Services" value="all" icon={<CelebrationIcon sx={{ fontSize: 20 }} />} iconPosition="start" />
                            <Tab label="Popular" value="popular" icon={<WhatshotIcon sx={{ fontSize: 20 }} />} iconPosition="start" />
                        </Tabs>
                    </Box>

                    {/* Search Filters */}
                    <Box sx={{
                        background: alpha('#FFFFFF', 0.95),
                        borderRadius: '20px',
                        p: 3,
                        mb: 3,
                        border: '1px solid rgba(255,107,53,0.15)',
                        backdropFilter: 'blur(10px)'
                    }}>
                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs={12} md={4}>
                                <TextField
                                    fullWidth
                                    placeholder="Search services..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            backgroundColor: '#FAFAFA',
                                            borderRadius: '40px',
                                            '& fieldset': { borderColor: '#E8E0D8' },
                                            '&:hover fieldset': { borderColor: '#FFB347' }
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
                                            backgroundColor: '#FAFAFA',
                                            borderRadius: '40px',
                                            '& .MuiOutlinedInput-notchedOutline': { borderColor: '#E8E0D8' }
                                        }}
                                    >
                                        <MenuItem value="">All Categories</MenuItem>
                                        {CATEGORIES.map((cat) => <MenuItem key={cat} value={cat}>{cat}</MenuItem>)}
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
                                            backgroundColor: '#FAFAFA',
                                            borderRadius: '40px',
                                            '& .MuiOutlinedInput-notchedOutline': { borderColor: '#E8E0D8' }
                                        }}
                                    >
                                        <MenuItem value="">All Locations</MenuItem>
                                        {ARMENIAN_LOCATIONS.map((location) => <MenuItem key={location.value} value={location.value}>{location.label}</MenuItem>)}
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
                                    <Tooltip title="Advanced Filters">
                                        <IconButton
                                            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                                            sx={{
                                                height: '56px',
                                                width: '56px',
                                                border: '1px solid #F0E8E0',
                                                borderRadius: '40px',
                                                bgcolor: '#FAFAFA',
                                                color: showAdvancedFilters ? '#FF6B35' : '#8A8A8A',
                                                '&:hover': {
                                                    bgcolor: alpha('#FF6B35', 0.05)
                                                }
                                            }}
                                        >
                                            <FilterIcon />
                                        </IconButton>
                                    </Tooltip>
                                </Stack>
                            </Grid>
                        </Grid>

                        {/* Advanced Filters */}
                        <Collapse in={showAdvancedFilters}>
                            <Box sx={{ mt: 3, pt: 3, borderTop: '1px solid #F0E8E0' }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: '#2C2C2C' }}>Price Range (AMD)</Typography>
                                <Box sx={{ px: 2, mb: 3 }}>
                                    <Slider
                                        value={priceRange}
                                        onChange={handlePriceRangeChange}
                                        valueLabelDisplay="auto"
                                        valueLabelFormat={(value) => `${value.toLocaleString()} ֏`}
                                        min={0}
                                        max={1000000}
                                        step={10000}
                                        sx={{ color: '#FF6B35' }}
                                    />
                                    <Grid container spacing={2} sx={{ mt: 1 }}>
                                        <Grid item xs={6}>
                                            <TextField
                                                fullWidth
                                                type="number"
                                                label="Min Price"
                                                value={minPrice}
                                                onChange={(e) => { setMinPrice(e.target.value); setPriceRange([parseInt(e.target.value) || 0, priceRange[1]]); }}
                                                size="small"
                                                sx={{ '& .MuiOutlinedInput-root': { backgroundColor: '#FAFAFA', borderRadius: '20px', '& fieldset': { borderColor: '#E8E0D8' } } }}
                                            />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <TextField
                                                fullWidth
                                                type="number"
                                                label="Max Price"
                                                value={maxPrice}
                                                onChange={(e) => { setMaxPrice(e.target.value); setPriceRange([priceRange[0], parseInt(e.target.value) || 1000000]); }}
                                                size="small"
                                                sx={{ '& .MuiOutlinedInput-root': { backgroundColor: '#FAFAFA', borderRadius: '20px', '& fieldset': { borderColor: '#E8E0D8' } } }}
                                            />
                                        </Grid>
                                    </Grid>
                                </Box>

                                {activeFiltersCount > 0 && (
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                                        <Button
                                            startIcon={<ClearIcon />}
                                            onClick={handleClearFilters}
                                            sx={{
                                                borderRadius: '40px',
                                                textTransform: 'none',
                                                color: '#FF6B35',
                                                '&:hover': { bgcolor: alpha('#FF6B35', 0.05) }
                                            }}
                                        >
                                            Clear All Filters ({activeFiltersCount})
                                        </Button>
                                    </Box>
                                )}
                            </Box>
                        </Collapse>
                    </Box>

                    {/* Active Filters Chips */}
                    {activeFiltersCount > 0 && (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                            {searchQuery && (
                                <Chip
                                    label={`Search: ${searchQuery}`}
                                    onDelete={() => { setSearchQuery(''); handleSearch(); }}
                                    size="small"
                                    sx={{ bgcolor: alpha('#FF6B35', 0.1), color: '#FF6B35', borderRadius: '20px' }}
                                />
                            )}
                            {selectedCategory && (
                                <Chip
                                    label={`Category: ${selectedCategory}`}
                                    onDelete={() => { setSelectedCategory(''); handleSearch(); }}
                                    size="small"
                                    sx={{ bgcolor: alpha('#FF6B35', 0.1), color: '#FF6B35', borderRadius: '20px' }}
                                />
                            )}
                            {selectedLocation && (
                                <Chip
                                    label={`Location: ${selectedLocation}`}
                                    onDelete={() => { setSelectedLocation(''); handleSearch(); }}
                                    size="small"
                                    sx={{ bgcolor: alpha('#FF6B35', 0.1), color: '#FF6B35', borderRadius: '20px' }}
                                />
                            )}
                            {(minPrice || maxPrice) && (
                                <Chip
                                    label={`Price: ${minPrice ? `${parseInt(minPrice).toLocaleString()}֏` : '0֏'} - ${maxPrice ? `${parseInt(maxPrice).toLocaleString()}֏` : '∞'}`}
                                    onDelete={() => { setMinPrice(''); setMaxPrice(''); setPriceRange([0, 1000000]); handleSearch(); }}
                                    size="small"
                                    sx={{ bgcolor: alpha('#FF6B35', 0.1), color: '#FF6B35', borderRadius: '20px' }}
                                />
                            )}
                        </Box>
                    )}

                    {/* Results Count */}
                    {!loading && services.length > 0 && (
                        <Box sx={{ mb: 3 }}>
                            <Typography sx={{ color: '#8A99A8' }}>
                                Found <strong style={{ color: '#FF6B35' }}>{totalElements}</strong> {totalElements === 1 ? 'service' : 'services'}
                                {activeTab === 'popular' && (
                                    <Box component="span" sx={{ ml: 2, display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
                                        <WhatshotIcon sx={{ fontSize: 16, color: '#FF6B35' }} />
                                        <span style={{ color: '#FF6B35' }}>Sorted by popularity</span>
                                    </Box>
                                )}
                            </Typography>
                        </Box>
                    )}

                    {/* Services Grid */}
                    {loading ? (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                            {[1, 2, 3].map((i) => (
                                <Box key={i} sx={{ width: '100%' }}>
                                    <Grid container>
                                        <Grid item xs={12} md={7}>
                                            <Skeleton variant="text" height={40} width="60%" sx={{ bgcolor: '#F0F0F0', mb: 2 }} />
                                            <Skeleton variant="text" height={20} width="90%" sx={{ bgcolor: '#F0F0F0', mb: 1 }} />
                                            <Skeleton variant="text" height={20} width="80%" sx={{ bgcolor: '#F0F0F0', mb: 1 }} />
                                            <Skeleton variant="text" height={20} width="50%" sx={{ bgcolor: '#F0F0F0' }} />
                                        </Grid>
                                        <Grid item xs={12} md={5}>
                                            <Skeleton variant="rectangular" height={200} sx={{ bgcolor: '#F0F0F0', borderRadius: '12px' }} />
                                        </Grid>
                                    </Grid>
                                    <Divider sx={{ my: 4, borderColor: '#E8ECF0' }} />
                                </Box>
                            ))}
                        </Box>
                    ) : services.length === 0 ? (
                        <Box sx={{ textAlign: 'center', py: 8 }}>
                            <Typography variant="h6" sx={{ color: '#8A99A8' }}>No services found</Typography>
                            <Typography variant="body2" sx={{ color: '#B0B0B0', mt: 1 }}>Try adjusting your search filters</Typography>
                            <Button
                                onClick={handleClearFilters}
                                sx={{
                                    mt: 3,
                                    borderRadius: '40px',
                                    textTransform: 'none',
                                    color: '#FF6B35',
                                    borderColor: '#FF6B35',
                                    '&:hover': { bgcolor: alpha('#FF6B35', 0.05) }
                                }}
                                variant="outlined"
                            >
                                Clear All Filters
                            </Button>
                        </Box>
                    ) : (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                            {services.map((service, index) => {
                                const eventDate = formatEventDate(service.startDate, service.startTime);
                                const images = service.imageUrls || [];
                                const currentIndex = activeImageIndex[service.id] || 0;
                                const isLiked = favorites.has(service.id);

                                return (
                                    <Grow in={true} style={{ transitionDelay: `${index * 50}ms` }} key={service.id}>
                                        <Box>
                                            <Box
                                                sx={{
                                                    width: '100%',
                                                    py: 3,
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s ease'
                                                }}
                                                onClick={() => navigate(`/services/${service.id}`)}
                                            >
                                                <Grid container sx={{ width: '100%', m: 0 }}>
                                                    {/* Left side - Information */}
                                                    <Grid item xs={12} md={7}>
                                                        <Box sx={{ pr: { md: 4 } }}>
                                                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, flexWrap: 'wrap', gap: 2 }}>
                                                                <Typography variant="h5" sx={{
                                                                    fontWeight: 700,
                                                                    color: '#1A2733',
                                                                    fontSize: { xs: '1.3rem', sm: '1.5rem', md: '1.8rem' }
                                                                }}>
                                                                    {service.name}
                                                                </Typography>
                                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                    <Tooltip title={isLiked ? "Remove from saved" : "Save to favorites"}>
                                                                        <IconButton
                                                                            onClick={(e) => handleLikeToggle(service.id, e)}
                                                                            sx={{
                                                                                bgcolor: 'transparent',
                                                                                p: 0,
                                                                                '&:hover': {
                                                                                    bgcolor: 'transparent',
                                                                                    transform: 'scale(1.05)'
                                                                                }
                                                                            }}
                                                                        >
                                                                            <WhatshotIcon sx={{ color: isLiked ? '#FF6B35' : '#8A99A8', fontSize: 28 }} />
                                                                        </IconButton>
                                                                    </Tooltip>
                                                                    <Typography variant="body1" sx={{ fontWeight: 600, color: isLiked ? '#FF6B35' : '#5A6874', minWidth: '45px' }}>
                                                                        {service.likeCount || 0}
                                                                    </Typography>
                                                                </Box>
                                                            </Box>

                                                            <Typography variant="body1" sx={{ color: '#5A6874', mb: 3, lineHeight: 1.6, fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                                                                {service.description.length > 200 ? service.description.substring(0, 200) + '...' : service.description}
                                                            </Typography>

                                                            <Grid container spacing={2} sx={{ mb: 3 }}>
                                                                <Grid item xs={6} sm={4}>
                                                                    <Box>
                                                                        <Typography variant="body2" sx={{ color: '#8A99A8', display: 'block', fontSize: '0.75rem', mb: 0.5 }}>
                                                                            Price
                                                                        </Typography>
                                                                        <Typography variant="body1" sx={{ color: '#4CAF50', fontWeight: 600, fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                                                                            From {service.price?.toLocaleString()} ֏
                                                                        </Typography>
                                                                    </Box>
                                                                </Grid>
                                                                <Grid item xs={6} sm={4}>
                                                                    <Box>
                                                                        <Typography variant="body2" sx={{ color: '#8A99A8', display: 'block', fontSize: '0.75rem', mb: 0.5 }}>
                                                                            Category
                                                                        </Typography>
                                                                        <Typography variant="body1" sx={{ color: '#1A2733', fontSize: { xs: '0.85rem', sm: '0.9rem' } }}>
                                                                            {service.category}
                                                                        </Typography>
                                                                    </Box>
                                                                </Grid>
                                                                <Grid item xs={6} sm={4}>
                                                                    <Box>
                                                                        <Typography variant="body2" sx={{ color: '#8A99A8', display: 'block', fontSize: '0.75rem', mb: 0.5 }}>
                                                                            Location
                                                                        </Typography>
                                                                        <Typography variant="body1" sx={{ color: '#1A2733', fontSize: { xs: '0.85rem', sm: '0.9rem' } }}>
                                                                            {service.locationDisplayName || service.location}
                                                                        </Typography>
                                                                    </Box>
                                                                </Grid>
                                                            </Grid>

                                                            {eventDate && (
                                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                                                                    <EventIcon sx={{ fontSize: 20, color: '#8A99A8' }} />
                                                                    <Typography variant="body1" sx={{ color: '#5A6874', fontSize: '0.95rem' }}>
                                                                        {eventDate}
                                                                    </Typography>
                                                                </Box>
                                                            )}

                                                            {service.duration && (
                                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                                                                    <AccessTimeIcon sx={{ fontSize: 20, color: '#8A99A8' }} />
                                                                    <Typography variant="body1" sx={{ color: '#5A6874', fontSize: '0.95rem' }}>
                                                                        Duration: {service.duration} {service.duration === 1 ? 'hour' : 'hours'}
                                                                    </Typography>
                                                                </Box>
                                                            )}

                                                            {/* Contact Us Section */}
                                                            {(service.contactEmail || (service.phoneNumbers && service.phoneNumbers.length > 0) || (service.socialNetworks && service.socialNetworks.length > 0)) && (
                                                                <Box sx={{ mt: 2, mb: 2 }}>
                                                                    <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#1A2733', mb: 1.5, fontSize: { xs: '0.85rem', sm: '0.9rem' } }}>
                                                                        📞 Contact Us
                                                                    </Typography>

                                                                    {service.contactEmail && (
                                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                                                                            <EmailIcon sx={{ fontSize: 18, color: '#8A99A8' }} />
                                                                            <Typography variant="body2" sx={{ color: '#5A6874', fontSize: { xs: '0.8rem', sm: '0.85rem' } }}>
                                                                                {service.contactEmail}
                                                                            </Typography>
                                                                        </Box>
                                                                    )}

                                                                    {service.phoneNumbers && service.phoneNumbers.length > 0 && (
                                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5, flexWrap: 'wrap' }}>
                                                                            <PhoneIcon sx={{ fontSize: 18, color: '#8A99A8' }} />
                                                                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                                                                {service.phoneNumbers.map((phone, idx) => (
                                                                                    <Chip key={idx} label={phone} size="small" sx={{ bgcolor: alpha('#FF6B35', 0.1), color: '#FF6B35', fontSize: '0.7rem' }} />
                                                                                ))}
                                                                            </Box>
                                                                        </Box>
                                                                    )}

                                                                    {service.socialNetworks && service.socialNetworks.length > 0 && (
                                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5, flexWrap: 'wrap' }}>
                                                                            <LanguageIcon sx={{ fontSize: 18, color: '#8A99A8' }} />
                                                                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                                                                {service.socialNetworks.map((social, idx) => (
                                                                                    <Button
                                                                                        key={idx}
                                                                                        size="small"
                                                                                        href={social.url}
                                                                                        target="_blank"
                                                                                        startIcon={getSocialIcon(social.platform)}
                                                                                        sx={{
                                                                                            textTransform: 'none',
                                                                                            color: '#1A2733',
                                                                                            fontSize: '0.7rem',
                                                                                            '&:hover': { bgcolor: alpha('#FF6B35', 0.1) }
                                                                                        }}
                                                                                    >
                                                                                        {social.platform}
                                                                                    </Button>
                                                                                ))}
                                                                            </Box>
                                                                        </Box>
                                                                    )}
                                                                </Box>
                                                            )}

                                                            <Divider sx={{ borderColor: '#E8ECF0', my: 2 }} />
                                                        </Box>
                                                    </Grid>

                                                    {/* Right side - Image Carousel */}
                                                    <Grid item xs={12} md={5}>
                                                        <Box sx={{
                                                            height: '100%',
                                                            minHeight: { xs: '250px', sm: '300px', md: '320px' },
                                                            background: '#FFFFFF',
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            position: 'relative',
                                                            overflow: 'hidden'
                                                        }}>
                                                            {images.length > 0 ? (
                                                                <>
                                                                    <Box sx={{
                                                                        width: '100%',
                                                                        height: '100%',
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        justifyContent: 'center',
                                                                        backgroundColor: '#FFFFFF',
                                                                        borderRadius: '12px',
                                                                        overflow: 'hidden',
                                                                        position: 'relative',
                                                                        minHeight: { xs: '250px', sm: '300px', md: '320px' }
                                                                    }}>
                                                                        <ServiceImage src={images[currentIndex]} alt={`${service.name} - ${currentIndex + 1}`} />
                                                                    </Box>

                                                                    {images.length > 1 && (
                                                                        <>
                                                                            <IconButton
                                                                                onClick={(e) => handlePrevImage(service.id, images.length, e)}
                                                                                sx={{
                                                                                    position: 'absolute',
                                                                                    left: 8,
                                                                                    top: '50%',
                                                                                    transform: 'translateY(-50%)',
                                                                                    backgroundColor: alpha('#000000', 0.5),
                                                                                    color: 'white',
                                                                                    '&:hover': { backgroundColor: alpha('#000000', 0.7) },
                                                                                    zIndex: 1,
                                                                                    width: { xs: 28, sm: 32 },
                                                                                    height: { xs: 28, sm: 32 }
                                                                                }}
                                                                            >
                                                                                <ChevronLeftIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />
                                                                            </IconButton>
                                                                            <IconButton
                                                                                onClick={(e) => handleNextImage(service.id, images.length, e)}
                                                                                sx={{
                                                                                    position: 'absolute',
                                                                                    right: 8,
                                                                                    top: '50%',
                                                                                    transform: 'translateY(-50%)',
                                                                                    backgroundColor: alpha('#000000', 0.5),
                                                                                    color: 'white',
                                                                                    '&:hover': { backgroundColor: alpha('#000000', 0.7) },
                                                                                    zIndex: 1,
                                                                                    width: { xs: 28, sm: 32 },
                                                                                    height: { xs: 28, sm: 32 }
                                                                                }}
                                                                            >
                                                                                <ChevronRightIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />
                                                                            </IconButton>

                                                                            <Box sx={{
                                                                                position: 'absolute',
                                                                                bottom: 8,
                                                                                left: '50%',
                                                                                transform: 'translateX(-50%)',
                                                                                display: 'flex',
                                                                                gap: 0.5,
                                                                                zIndex: 1,
                                                                                backgroundColor: alpha('#000000', 0.5),
                                                                                padding: '3px 6px',
                                                                                borderRadius: '16px'
                                                                            }}>
                                                                                {images.map((_, idx) => (
                                                                                    <Box
                                                                                        key={idx}
                                                                                        onClick={(e) => { e.stopPropagation(); setActiveImageIndex(prev => ({ ...prev, [service.id]: idx })); }}
                                                                                        sx={{
                                                                                            width: { xs: 5, sm: 6 },
                                                                                            height: { xs: 5, sm: 6 },
                                                                                            borderRadius: '50%',
                                                                                            backgroundColor: idx === currentIndex ? '#FF6B35' : 'white',
                                                                                            cursor: 'pointer',
                                                                                            transition: 'all 0.3s ease',
                                                                                            '&:hover': { transform: 'scale(1.2)' }
                                                                                        }}
                                                                                    />
                                                                                ))}
                                                                            </Box>

                                                                            <Chip
                                                                                label={`${currentIndex + 1} / ${images.length}`}
                                                                                size="small"
                                                                                sx={{
                                                                                    position: 'absolute',
                                                                                    top: 8,
                                                                                    right: 8,
                                                                                    bgcolor: alpha('#000000', 0.7),
                                                                                    color: 'white',
                                                                                    fontWeight: 500,
                                                                                    fontSize: '0.65rem',
                                                                                    height: 20,
                                                                                    zIndex: 1
                                                                                }}
                                                                            />
                                                                        </>
                                                                    )}
                                                                </>
                                                            ) : (
                                                                <Box sx={{ textAlign: 'center', p: { xs: 2, sm: 3 } }}>
                                                                    <ImageIcon sx={{ fontSize: { xs: 50, sm: 80 }, color: alpha('#FF6B35', 0.3), mb: 1 }} />
                                                                    <Typography variant="body2" sx={{ color: '#8A99A8', fontSize: { xs: '0.75rem', sm: '0.85rem' } }}>
                                                                        No images available
                                                                    </Typography>
                                                                </Box>
                                                            )}
                                                        </Box>
                                                    </Grid>
                                                </Grid>
                                            </Box>
                                            {index < services.length - 1 && <Divider sx={{ borderColor: '#E8ECF0' }} />}
                                        </Box>
                                    </Grow>
                                );
                            })}
                        </Box>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
                            <Pagination
                                count={totalPages}
                                page={page + 1}
                                onChange={(e, newPage) => setPage(newPage - 1)}
                                sx={{
                                    '& .MuiPaginationItem-root': {
                                        color: '#5A6874',
                                        borderRadius: '12px'
                                    },
                                    '& .Mui-selected': {
                                        bgcolor: '#FF6B35 !important',
                                        color: 'white',
                                        '&:hover': { bgcolor: '#FF6B35' }
                                    }
                                }}
                            />
                        </Box>
                    )}
                </Box>

                {/* Snackbar */}
                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={4000}
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                >
                    <Alert
                        severity={snackbar.severity}
                        sx={{
                            bgcolor: '#FFFFFF',
                            color: '#1A2733',
                            border: `1px solid ${snackbar.severity === 'success' ? '#4CAF50' : snackbar.severity === 'error' ? '#f44336' : '#FF6B35'}`,
                            borderRadius: '12px'
                        }}
                    >
                        {snackbar.message}
                    </Alert>
                </Snackbar>
            </Box>
        </LocalizationProvider>
    );
};

export default ServicesPage;