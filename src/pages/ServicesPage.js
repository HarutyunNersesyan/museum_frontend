// src/pages/ServicesPage.js - Without Sort By

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Container,
    Typography,
    Box,
    Grid,
    Paper,
    Button,
    IconButton,
    Chip,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Pagination,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Skeleton,
    Alert,
    Snackbar,
    InputAdornment,
    Menu,
    Divider,
    CircularProgress,
    Zoom,
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
    Favorite as FavoriteIcon,
    FavoriteBorder as FavoriteBorderIcon,
    Email as EmailIcon,
    Search as SearchIcon,
    Close as CloseIcon,
    LocationOn as LocationIcon,
    AttachMoney as PriceIcon,
    AccessTime as AccessTimeIcon,
    Event as EventIcon,
    AccountCircle as AccountCircleIcon,
    Logout as LogoutIcon,
    Person as PersonIcon,
    Celebration as CelebrationIcon,
    AdminPanelSettings as AdminIcon,
    FilterAlt as FilterIcon,
    Clear as ClearIcon,
    CalendarToday as CalendarIcon,
    Info as InfoIcon,
    HowToReg as HowToRegIcon,
    ChevronLeft as ChevronLeftIcon,
    ChevronRight as ChevronRightIcon,
    Image as ImageIcon,
    Category as CategoryIcon,
    Whatshot as WhatshotIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { useAuth } from '../context/AuthContext';
import serviceAPI from '../services/serviceAPI';
import { alpha, styled } from '@mui/material/styles';

// Styled components
const GradientButton = styled(Button)(({ theme }) => ({
    background: 'linear-gradient(135deg, #FF9800 0%, #FF5722 100%)',
    borderRadius: '12px',
    padding: '10px 24px',
    fontWeight: 600,
    textTransform: 'none',
    color: '#FFFFFF',
    transition: 'all 0.3s ease',
    '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 8px 25px rgba(255, 152, 0, 0.3)'
    }
}));

const OutlinedButton = styled(Button)(({ theme }) => ({
    borderRadius: '12px',
    padding: '10px 24px',
    fontWeight: 600,
    textTransform: 'none',
    border: '1px solid #E8ECF0',
    color: '#5A6874',
    '&:hover': {
        borderColor: '#FF9800',
        backgroundColor: alpha('#FF9800', 0.05)
    }
}));

const ServiceImage = styled('img')({
    maxWidth: '100%',
    maxHeight: '100%',
    width: 'auto',
    height: 'auto',
    objectFit: 'contain',
    display: 'block',
    borderRadius: '12px'
});

const formatPriceAMD = (price) => {
    if (!price && price !== 0) return '֏0';
    return new Intl.NumberFormat('hy-AM', {
        style: 'currency',
        currency: 'AMD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(price);
};

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
        background: '#FF9800',
        borderRadius: '10px',
        '&:hover': {
            background: '#FF5722',
        },
    },
    '*': {
        scrollbarColor: '#FF9800 #F5F0E8',
        scrollbarWidth: 'thin',
    },
};

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
    const [inquiryDialogOpen, setInquiryDialogOpen] = useState(false);
    const [selectedService, setSelectedService] = useState(null);
    const [inquiryData, setInquiryData] = useState({
        subject: '',
        message: '',
        phone: '',
        email: ''
    });
    const [sendingInquiry, setSendingInquiry] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });
    const [anchorEl, setAnchorEl] = useState(null);
    const [backgroundPosition, setBackgroundPosition] = useState({ x: 0, y: 0 });
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [activeImageIndex, setActiveImageIndex] = useState({});

    // New state for tabs - "all" or "popular"
    const [activeTab, setActiveTab] = useState('all');

    // Filter states
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedLocation, setSelectedLocation] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [priceRange, setPriceRange] = useState([0, 1000000]);
    const [startDateFrom, setStartDateFrom] = useState(null);
    const [startDateTo, setStartDateTo] = useState(null);
    // sortBy is now determined by activeTab only
    const sortBy = activeTab === 'popular' ? 'likeCount' : 'createdAt';
    const sortDirection = 'DESC';

    // Mouse move effect for animated background
    useEffect(() => {
        const handleMouseMove = (e) => {
            const x = e.clientX / window.innerWidth;
            const y = e.clientY / window.innerHeight;
            setBackgroundPosition({ x, y });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

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

        // Check sessionStorage for search params
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
        }
    }, [user]);

    // Load services when page changes or tab changes
    useEffect(() => {
        if (page > 0 || isSearching) {
            performSearch();
        }
    }, [page, activeTab]);

    const loadInitialData = async () => {
        setLoading(true);
        try {
            await performSearch();
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
                size: 10,
                sortBy: sortBy,
                sortDirection: sortDirection
            };

            if (minPrice && minPrice !== '') {
                searchParams.minPrice = parseFloat(minPrice);
            }
            if (maxPrice && maxPrice !== '') {
                searchParams.maxPrice = parseFloat(maxPrice);
            }
            if (startDateFrom) {
                searchParams.startDateFrom = startDateFrom.format('YYYY-MM-DD');
            }
            if (startDateTo) {
                searchParams.startDateTo = startDateTo.format('YYYY-MM-DD');
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

    // Handle tab change
    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
        setPage(0);
        setIsSearching(false);

        // Update URL without reload
        const urlParams = new URLSearchParams(location.search);
        urlParams.set('tab', newValue);
        navigate(`${location.pathname}?${urlParams.toString()}`, { replace: true });

        setTimeout(() => performSearch(), 100);
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
        performSearch();
    };

    const handleClearFilters = () => {
        setSearchQuery('');
        setSelectedCategory('');
        setSelectedLocation('');
        setMinPrice('');
        setMaxPrice('');
        setPriceRange([0, 1000000]);
        setStartDateFrom(null);
        setStartDateTo(null);
        setPage(0);
        setIsSearching(false);
        setTimeout(() => performSearch(), 100);
    };

    const handlePriceRangeChange = (event, newValue) => {
        setPriceRange(newValue);
        setMinPrice(newValue[0].toString());
        setMaxPrice(newValue[1].toString());
    };

    const handleFavoriteToggle = async (serviceId, e) => {
        e.stopPropagation();
        try {
            if (favorites.has(serviceId)) {
                await serviceAPI.removeFromFavorites(serviceId);
                setFavorites(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(serviceId);
                    return newSet;
                });
                setSnackbar({
                    open: true,
                    message: 'Removed from favorites',
                    severity: 'info'
                });
            } else {
                await serviceAPI.addToFavorites(serviceId);
                setFavorites(prev => new Set(prev).add(serviceId));
                setSnackbar({
                    open: true,
                    message: 'Added to favorites',
                    severity: 'success'
                });
            }
        } catch (error) {
            console.error('Error toggling favorite:', error);
            setSnackbar({
                open: true,
                message: 'Failed to update favorites',
                severity: 'error'
            });
        }
    };

    const handleOpenInquiry = (service) => {
        setSelectedService(service);
        setInquiryData({
            subject: `Inquiry about ${service.name}`,
            message: '',
            phone: '',
            email: user?.email || ''
        });
        setInquiryDialogOpen(true);
    };

    const handleSendInquiry = async () => {
        if (!inquiryData.subject || !inquiryData.message || !inquiryData.phone) {
            setSnackbar({
                open: true,
                message: 'Please fill all required fields',
                severity: 'warning'
            });
            return;
        }

        setSendingInquiry(true);
        try {
            await serviceAPI.sendInquiry(selectedService.id, inquiryData);
            setInquiryDialogOpen(false);
            setSnackbar({
                open: true,
                message: 'Inquiry sent! Admin will respond via email.',
                severity: 'success'
            });
        } catch (error) {
            console.error('Error sending inquiry:', error);
            setSnackbar({
                open: true,
                message: 'Failed to send inquiry',
                severity: 'error'
            });
        } finally {
            setSendingInquiry(false);
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

    // Handle next image
    const handleNextImage = (serviceId, totalImages, e) => {
        e.stopPropagation();
        setActiveImageIndex(prev => ({
            ...prev,
            [serviceId]: ((prev[serviceId] || 0) + 1) % totalImages
        }));
    };

    // Handle previous image
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
        (minPrice && minPrice !== '0' && minPrice !== '') ? 1 : 0,
        startDateFrom ? 1 : 0,
        startDateTo ? 1 : 0
    ].reduce((a, b) => a + b, 0);

    if (!user) {
        return (
            <Backdrop open={true} sx={{ zIndex: 9999, backgroundColor: 'rgba(255,255,255,0.9)' }}>
                <CircularProgress sx={{ color: '#FF9800' }} />
            </Backdrop>
        );
    }

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box sx={{
                minHeight: '100vh',
                background: '#F5F7FA',
                fontFamily: 'Inter, sans-serif',
                position: 'relative'
            }}>
                {/* Global Scrollbar Styles */}
                <GlobalStyles styles={scrollbarStyles} />

                {/* Header */}
                <Box sx={{
                    position: 'sticky',
                    top: 0,
                    zIndex: 100,
                    backgroundColor: '#FFFFFF',
                    borderBottom: 'none',
                    boxShadow: '0 1px 4px rgba(0, 0, 0, 0.04)'
                }}>
                    <Container maxWidth="xl" sx={{ py: 1.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
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
                                    background: 'linear-gradient(135deg, #FF9800 0%, #FF5722 100%)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <CelebrationIcon sx={{ color: 'white', fontSize: 22 }} />
                                </Box>
                                <Typography variant="h6" sx={{
                                    fontWeight: 800,
                                    background: 'linear-gradient(135deg, #FF9800 0%, #FF5722 100%)',
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
                                    sx={{ fontWeight: 500, color: '#5A6874', '&:hover': { color: '#FF9800' } }}
                                    onClick={handleAboutClick}
                                >
                                    About Us
                                </Button>
                                <Button
                                    startIcon={<HowToRegIcon />}
                                    sx={{ fontWeight: 500, color: '#5A6874', '&:hover': { color: '#FF9800' } }}
                                    onClick={handleHowItWorks}
                                >
                                    How It Works
                                </Button>
                                <Button
                                    startIcon={<CelebrationIcon />}
                                    sx={{ fontWeight: 500, color: '#FF9800', borderBottom: '2px solid #FF9800', borderRadius: 0 }}
                                    onClick={() => navigate('/services')}
                                >
                                    Services
                                </Button>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                {user ? (
                                    <>
                                        <Chip
                                            label={`Welcome, ${user.userName}`}
                                            size="small"
                                            sx={{
                                                display: { xs: 'none', sm: 'flex' },
                                                bgcolor: alpha('#FF9800', 0.1),
                                                color: '#FF9800',
                                                border: `1px solid ${alpha('#FF9800', 0.2)}`
                                            }}
                                        />
                                        <IconButton
                                            onClick={handleMenuOpen}
                                            sx={{
                                                background: 'linear-gradient(135deg, #FF9800 0%, #FF5722 100%)',
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
                                                    color: '#1A2733',
                                                    border: '1px solid #E8ECF0',
                                                    minWidth: 200,
                                                    borderRadius: '16px',
                                                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
                                                }
                                            }}
                                        >
                                            <MenuItem onClick={handleProfile}><PersonIcon sx={{ mr: 2, fontSize: 20, color: '#FF9800' }} />Profile</MenuItem>
                                            {isAdmin && (
                                                <MenuItem onClick={handleAdminPanel}><AdminIcon sx={{ mr: 2, fontSize: 20, color: '#FF9800' }} />Admin Panel</MenuItem>
                                            )}
                                            <Divider />
                                            <MenuItem onClick={handleLogout}><LogoutIcon sx={{ mr: 2, fontSize: 20, color: '#f44336' }} />Logout</MenuItem>
                                        </Menu>
                                    </>
                                ) : (
                                    <>
                                        <Button sx={{ fontWeight: 500, color: '#5A6874', '&:hover': { color: '#FF9800' } }} onClick={() => navigate('/login')}>
                                            Sign In
                                        </Button>
                                        <GradientButton onClick={() => navigate('/signup')}>
                                            Get Started
                                        </GradientButton>
                                    </>
                                )}
                            </Box>
                        </Box>
                    </Container>
                </Box>

                {/* Main Content */}
                <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1, py: 5 }}>
                    {/* Hero Section */}
                    <Fade in={true} timeout={500}>
                        <Box sx={{ textAlign: 'center', mb: 5 }}>
                            <Typography variant="h1" sx={{
                                fontSize: { xs: '36px', md: '56px' },
                                fontWeight: 800,
                                background: 'linear-gradient(135deg, #FF9800 0%, #FF5722 50%, #FF9800 100%)',
                                backgroundSize: '200% 200%',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                mb: 2,
                                letterSpacing: '-1px'
                            }}>
                                Discover Amazing Events
                            </Typography>
                            <Typography variant="h6" sx={{ color: '#8A99A8', maxWidth: '600px', mx: 'auto' }}>
                                Find the perfect parties, birthdays, and entertainment services in Armenia
                            </Typography>
                        </Box>
                    </Fade>

                    {/* TABS - All Services and Popular */}
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        mb: 4,
                        borderBottom: '1px solid #E8ECF0'
                    }}>
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
                                        color: '#FF9800'
                                    }
                                },
                                '& .MuiTabs-indicator': {
                                    backgroundColor: '#FF9800',
                                    height: 3,
                                    borderRadius: '3px 3px 0 0'
                                }
                            }}
                        >
                            <Tab
                                label="All Services"
                                value="all"
                                icon={<CelebrationIcon sx={{ fontSize: 20 }} />}
                                iconPosition="start"
                            />
                            <Tab
                                label="Popular"
                                value="popular"
                                icon={<WhatshotIcon sx={{ fontSize: 20 }} />}
                                iconPosition="start"
                            />
                        </Tabs>
                    </Box>

                    {/* Active Tab Info */}
                    {activeTab === 'popular' && !loading && services.length > 0 && (
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 1,
                            mb: 3,
                            p: 1.5,
                            bgcolor: alpha('#FF9800', 0.08),
                            borderRadius: '12px'
                        }}>
                            <WhatshotIcon sx={{ color: '#FF9800', fontSize: 20 }} />
                            <Typography variant="body2" sx={{ color: '#FF9800', fontWeight: 500 }}>
                                Showing most popular services based on user likes
                            </Typography>
                        </Box>
                    )}

                    {/* Search Filters - WITHOUT SORT BY */}
                    <Paper elevation={0} sx={{
                        background: '#FFFFFF',
                        borderRadius: '20px',
                        p: 3,
                        mb: 3,
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                        border: '1px solid #E8ECF0'
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
                                            backgroundColor: '#F5F7FA',
                                            borderRadius: '12px',
                                            '& fieldset': { border: 'none' }
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <FormControl fullWidth>
                                    <InputLabel sx={{ color: '#8A99A8' }}>Category</InputLabel>
                                    <Select
                                        value={selectedCategory}
                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                        label="Category"
                                        sx={{
                                            backgroundColor: '#F5F7FA',
                                            borderRadius: '12px',
                                            '& fieldset': { border: 'none' }
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
                                    <InputLabel sx={{ color: '#8A99A8' }}>Location</InputLabel>
                                    <Select
                                        value={selectedLocation}
                                        onChange={(e) => setSelectedLocation(e.target.value)}
                                        label="Location"
                                        sx={{
                                            backgroundColor: '#F5F7FA',
                                            borderRadius: '12px',
                                            '& fieldset': { border: 'none' }
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
                                    <GradientButton
                                        fullWidth
                                        onClick={handleSearch}
                                        sx={{ height: '56px' }}
                                    >
                                        Search
                                    </GradientButton>
                                    <Tooltip title="Advanced Filters">
                                        <IconButton
                                            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                                            sx={{
                                                height: '56px',
                                                width: '56px',
                                                border: '1px solid #E8ECF0',
                                                borderRadius: '12px',
                                                bgcolor: showAdvancedFilters ? alpha('#FF9800', 0.1) : '#F5F7FA',
                                                color: showAdvancedFilters ? '#FF9800' : '#8A99A8'
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
                            <Box sx={{ mt: 3, pt: 3, borderTop: '1px solid #E8ECF0' }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: '#1A2733' }}>
                                    Price Range
                                </Typography>
                                <Box sx={{ px: 2, mb: 3 }}>
                                    <Slider
                                        value={priceRange}
                                        onChange={handlePriceRangeChange}
                                        valueLabelDisplay="auto"
                                        valueLabelFormat={(value) => `${value.toLocaleString()} ֏`}
                                        min={0}
                                        max={1000000}
                                        step={10000}
                                        sx={{ color: '#FF9800' }}
                                    />
                                    <Grid container spacing={2} sx={{ mt: 1 }}>
                                        <Grid item xs={6}>
                                            <TextField
                                                fullWidth
                                                type="number"
                                                label="Min Price (AMD)"
                                                value={minPrice}
                                                onChange={(e) => {
                                                    setMinPrice(e.target.value);
                                                    setPriceRange([parseInt(e.target.value) || 0, priceRange[1]]);
                                                }}
                                                size="small"
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        backgroundColor: '#F5F7FA',
                                                        borderRadius: '8px',
                                                        '& fieldset': { border: 'none' }
                                                    }
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <TextField
                                                fullWidth
                                                type="number"
                                                label="Max Price (AMD)"
                                                value={maxPrice}
                                                onChange={(e) => {
                                                    setMaxPrice(e.target.value);
                                                    setPriceRange([priceRange[0], parseInt(e.target.value) || 1000000]);
                                                }}
                                                size="small"
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        backgroundColor: '#F5F7FA',
                                                        borderRadius: '8px',
                                                        '& fieldset': { border: 'none' }
                                                    }
                                                }}
                                            />
                                        </Grid>
                                    </Grid>
                                </Box>

                                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: '#1A2733' }}>
                                    Event Date
                                </Typography>
                                <Grid container spacing={2} sx={{ mb: 3 }}>
                                    <Grid item xs={12} sm={6}>
                                        <DatePicker
                                            label="Start Date From"
                                            value={startDateFrom}
                                            onChange={(newValue) => setStartDateFrom(newValue)}
                                            sx={{
                                                width: '100%',
                                                '& .MuiOutlinedInput-root': {
                                                    backgroundColor: '#F5F7FA',
                                                    borderRadius: '8px',
                                                    '& fieldset': { border: 'none' }
                                                }
                                            }}
                                            slotProps={{ textField: { fullWidth: true, size: 'small' } }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <DatePicker
                                            label="Start Date To"
                                            value={startDateTo}
                                            onChange={(newValue) => setStartDateTo(newValue)}
                                            sx={{
                                                width: '100%',
                                                '& .MuiOutlinedInput-root': {
                                                    backgroundColor: '#F5F7FA',
                                                    borderRadius: '8px',
                                                    '& fieldset': { border: 'none' }
                                                }
                                            }}
                                            slotProps={{ textField: { fullWidth: true, size: 'small' } }}
                                        />
                                    </Grid>
                                </Grid>

                                {activeFiltersCount > 0 && (
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                                        <OutlinedButton
                                            startIcon={<ClearIcon />}
                                            onClick={handleClearFilters}
                                            size="small"
                                        >
                                            Clear All Filters ({activeFiltersCount})
                                        </OutlinedButton>
                                    </Box>
                                )}
                            </Box>
                        </Collapse>
                    </Paper>

                    {/* Active Filters Chips */}
                    {activeFiltersCount > 0 && (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                            {searchQuery && (
                                <Chip
                                    label={`Search: ${searchQuery}`}
                                    onDelete={() => { setSearchQuery(''); handleSearch(); }}
                                    size="small"
                                    sx={{ bgcolor: alpha('#FF9800', 0.1), color: '#FF9800', borderRadius: '20px' }}
                                />
                            )}
                            {selectedCategory && (
                                <Chip
                                    label={`Category: ${selectedCategory}`}
                                    onDelete={() => { setSelectedCategory(''); handleSearch(); }}
                                    size="small"
                                    sx={{ bgcolor: alpha('#FF9800', 0.1), color: '#FF9800', borderRadius: '20px' }}
                                />
                            )}
                            {selectedLocation && (
                                <Chip
                                    label={`Location: ${selectedLocation}`}
                                    onDelete={() => { setSelectedLocation(''); handleSearch(); }}
                                    size="small"
                                    sx={{ bgcolor: alpha('#FF9800', 0.1), color: '#FF9800', borderRadius: '20px' }}
                                />
                            )}
                            {(minPrice || maxPrice) && (
                                <Chip
                                    label={`Price: ${minPrice ? `${parseInt(minPrice).toLocaleString()}֏` : '0֏'} - ${maxPrice ? `${parseInt(maxPrice).toLocaleString()}֏` : '∞'}`}
                                    onDelete={() => { setMinPrice(''); setMaxPrice(''); setPriceRange([0, 1000000]); handleSearch(); }}
                                    size="small"
                                    sx={{ bgcolor: alpha('#FF9800', 0.1), color: '#FF9800', borderRadius: '20px' }}
                                />
                            )}
                            {startDateFrom && (
                                <Chip
                                    label={`From: ${startDateFrom.format('MMM D, YYYY')}`}
                                    onDelete={() => { setStartDateFrom(null); handleSearch(); }}
                                    size="small"
                                    sx={{ bgcolor: alpha('#FF9800', 0.1), color: '#FF9800', borderRadius: '20px' }}
                                />
                            )}
                            {startDateTo && (
                                <Chip
                                    label={`To: ${startDateTo.format('MMM D, YYYY')}`}
                                    onDelete={() => { setStartDateTo(null); handleSearch(); }}
                                    size="small"
                                    sx={{ bgcolor: alpha('#FF9800', 0.1), color: '#FF9800', borderRadius: '20px' }}
                                />
                            )}
                        </Box>
                    )}

                    {/* Results Count */}
                    {!loading && services.length > 0 && (
                        <Box sx={{ mb: 3 }}>
                            <Typography sx={{ color: '#8A99A8' }}>
                                Found <strong style={{ color: '#FF9800' }}>{totalElements}</strong> {totalElements === 1 ? 'service' : 'services'}
                                {activeTab === 'popular' && (
                                    <Box component="span" sx={{ ml: 2, display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
                                        <WhatshotIcon sx={{ fontSize: 16, color: '#FF9800' }} />
                                        <span style={{ color: '#FF9800' }}>Sorted by popularity</span>
                                    </Box>
                                )}
                            </Typography>
                        </Box>
                    )}

                    {/* Services Grid */}
                    {loading ? (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                            {[1, 2, 3].map((i) => (
                                <Paper key={i} sx={{ borderRadius: '20px', overflow: 'hidden', p: 3 }}>
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
                                </Paper>
                            ))}
                        </Box>
                    ) : services.length === 0 ? (
                        <Box sx={{ textAlign: 'center', py: 8 }}>
                            <Typography variant="h6" sx={{ color: '#8A99A8' }}>No services found</Typography>
                            <Typography variant="body2" sx={{ color: '#B0B0B0', mt: 1 }}>Try adjusting your search filters</Typography>
                            <OutlinedButton onClick={handleClearFilters} sx={{ mt: 3 }}>
                                Clear All Filters
                            </OutlinedButton>
                        </Box>
                    ) : (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                            {services.map((service, index) => {
                                const eventDate = formatEventDate(service.startDate, service.startTime);
                                const images = service.imageUrls || [];
                                const currentIndex = activeImageIndex[service.id] || 0;

                                return (
                                    <Grow in={true} style={{ transitionDelay: `${index * 50}ms` }} key={service.id}>
                                        <Paper
                                            sx={{
                                                borderRadius: '20px',
                                                overflow: 'hidden',
                                                border: 'none',
                                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                                                transition: 'all 0.3s ease',
                                                cursor: 'pointer',
                                                '&:hover': {
                                                    transform: 'translateY(-2px)',
                                                    boxShadow: '0 8px 20px rgba(255, 152, 0, 0.12)'
                                                }
                                            }}
                                            onClick={() => navigate(`/services/${service.id}`)}
                                        >
                                            <Grid container sx={{ minHeight: '364px' }}>
                                                {/* Left side - Information */}
                                                <Grid item xs={12} md={7}>
                                                    <Box sx={{ p: '31px' }}>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: '26px' }}>
                                                            <Typography variant="h5" sx={{ fontWeight: 700, color: '#1A2733', fontSize: '1.8rem' }}>
                                                                {service.name}
                                                            </Typography>
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                {service.likeCount > 0 && activeTab === 'popular' && (
                                                                    <Chip
                                                                        icon={<WhatshotIcon sx={{ fontSize: 14 }} />}
                                                                        label={service.likeCount}
                                                                        size="small"
                                                                        sx={{ bgcolor: alpha('#FF9800', 0.1), color: '#FF9800' }}
                                                                    />
                                                                )}
                                                                {service.likeCount > 0 && activeTab !== 'popular' && (
                                                                    <Chip
                                                                        label={`❤️ ${service.likeCount}`}
                                                                        size="small"
                                                                        sx={{ bgcolor: alpha('#FF9800', 0.1), color: '#FF9800' }}
                                                                    />
                                                                )}
                                                                <IconButton
                                                                    onClick={(e) => handleFavoriteToggle(service.id, e)}
                                                                    sx={{
                                                                        bgcolor: alpha('#FF9800', 0.1),
                                                                        '&:hover': { bgcolor: alpha('#FF9800', 0.2) }
                                                                    }}
                                                                >
                                                                    {favorites.has(service.id) ?
                                                                        <FavoriteIcon sx={{ color: '#FF9800' }} /> :
                                                                        <FavoriteBorderIcon sx={{ color: '#8A99A8' }} />
                                                                    }
                                                                </IconButton>
                                                            </Box>
                                                        </Box>

                                                        <Typography variant="body1" sx={{ color: '#5A6874', mb: '26px', lineHeight: 1.6, fontSize: '1rem' }}>
                                                            {service.description.length > 200 ? service.description.substring(0, 200) + '...' : service.description}
                                                        </Typography>

                                                        <Grid container spacing={3} sx={{ mb: '26px' }}>
                                                            <Grid item xs={6} sm={4}>
                                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                                    <PriceIcon sx={{ fontSize: 22, color: '#4CAF50' }} />
                                                                    <Box>
                                                                        <Typography variant="body2" sx={{ color: '#8A99A8', display: 'block', fontSize: '0.85rem' }}>Price</Typography>
                                                                        <Typography variant="body1" sx={{ color: '#4CAF50', fontWeight: 600, fontSize: '1.1rem' }}>
                                                                            {formatPriceAMD(service.price)}
                                                                        </Typography>
                                                                    </Box>
                                                                </Box>
                                                            </Grid>
                                                            <Grid item xs={6} sm={4}>
                                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                                    <CategoryIcon sx={{ fontSize: 22, color: '#FF9800' }} />
                                                                    <Box>
                                                                        <Typography variant="body2" sx={{ color: '#8A99A8', display: 'block', fontSize: '0.85rem' }}>Category</Typography>
                                                                        <Typography variant="body1" sx={{ color: '#1A2733', fontSize: '1rem' }}>
                                                                            {service.category}
                                                                        </Typography>
                                                                    </Box>
                                                                </Box>
                                                            </Grid>
                                                            <Grid item xs={6} sm={4}>
                                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                                    <LocationIcon sx={{ fontSize: 22, color: '#FF9800' }} />
                                                                    <Box>
                                                                        <Typography variant="body2" sx={{ color: '#8A99A8', display: 'block', fontSize: '0.85rem' }}>Location</Typography>
                                                                        <Typography variant="body1" sx={{ color: '#1A2733', fontSize: '1rem' }}>
                                                                            {service.locationDisplayName || service.location}
                                                                        </Typography>
                                                                    </Box>
                                                                </Box>
                                                            </Grid>
                                                        </Grid>

                                                        {eventDate && (
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: '26px' }}>
                                                                <EventIcon sx={{ fontSize: 22, color: '#8A99A8' }} />
                                                                <Typography variant="body1" sx={{ color: '#5A6874', fontSize: '1rem' }}>
                                                                    {eventDate}
                                                                </Typography>
                                                            </Box>
                                                        )}

                                                        {service.duration && (
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: '26px' }}>
                                                                <AccessTimeIcon sx={{ fontSize: 22, color: '#8A99A8' }} />
                                                                <Typography variant="body1" sx={{ color: '#5A6874', fontSize: '1rem' }}>
                                                                    Duration: {service.duration} {service.duration === 1 ? 'hour' : 'hours'}
                                                                    {service.maxParticipants && ` | Max: ${service.maxParticipants} participants`}
                                                                </Typography>
                                                            </Box>
                                                        )}

                                                        <Divider sx={{ borderColor: '#E8ECF0', my: '26px' }} />

                                                        <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                                                            <GradientButton
                                                                startIcon={<EmailIcon />}
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleOpenInquiry(service);
                                                                }}
                                                                sx={{ py: '8px', px: '20px' }}
                                                            >
                                                                Inquire Now
                                                            </GradientButton>
                                                        </Box>
                                                    </Box>
                                                </Grid>

                                                {/* Right side - Image Carousel */}
                                                <Grid item xs={12} md={5}>
                                                    <Box sx={{
                                                        height: '100%',
                                                        minHeight: '364px',
                                                        background: '#FFFFFF',
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        position: 'relative',
                                                        overflow: 'hidden',
                                                        p: 2
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
                                                                    flex: 1
                                                                }}>
                                                                    <ServiceImage
                                                                        src={images[currentIndex]}
                                                                        alt={`${service.name} - ${currentIndex + 1}`}
                                                                    />
                                                                </Box>

                                                                {/* Navigation Arrows - Only show if more than 1 image */}
                                                                {images.length > 1 && (
                                                                    <>
                                                                        <IconButton
                                                                            onClick={(e) => handlePrevImage(service.id, images.length, e)}
                                                                            sx={{
                                                                                position: 'absolute',
                                                                                left: 16,
                                                                                top: '50%',
                                                                                transform: 'translateY(-50%)',
                                                                                backgroundColor: alpha('#000000', 0.5),
                                                                                color: 'white',
                                                                                '&:hover': {
                                                                                    backgroundColor: alpha('#000000', 0.7),
                                                                                },
                                                                                zIndex: 1
                                                                            }}
                                                                        >
                                                                            <ChevronLeftIcon />
                                                                        </IconButton>
                                                                        <IconButton
                                                                            onClick={(e) => handleNextImage(service.id, images.length, e)}
                                                                            sx={{
                                                                                position: 'absolute',
                                                                                right: 16,
                                                                                top: '50%',
                                                                                transform: 'translateY(-50%)',
                                                                                backgroundColor: alpha('#000000', 0.5),
                                                                                color: 'white',
                                                                                '&:hover': {
                                                                                    backgroundColor: alpha('#000000', 0.7),
                                                                                },
                                                                                zIndex: 1
                                                                            }}
                                                                        >
                                                                            <ChevronRightIcon />
                                                                        </IconButton>

                                                                        {/* Image indicators */}
                                                                        <Box sx={{
                                                                            position: 'absolute',
                                                                            bottom: 16,
                                                                            left: '50%',
                                                                            transform: 'translateX(-50%)',
                                                                            display: 'flex',
                                                                            gap: 1,
                                                                            zIndex: 1,
                                                                            backgroundColor: alpha('#000000', 0.5),
                                                                            padding: '4px 8px',
                                                                            borderRadius: '20px'
                                                                        }}>
                                                                            {images.map((_, idx) => (
                                                                                <Box
                                                                                    key={idx}
                                                                                    onClick={(e) => {
                                                                                        e.stopPropagation();
                                                                                        setActiveImageIndex(prev => ({ ...prev, [service.id]: idx }));
                                                                                    }}
                                                                                    sx={{
                                                                                        width: 8,
                                                                                        height: 8,
                                                                                        borderRadius: '50%',
                                                                                        backgroundColor: idx === currentIndex ? '#FF9800' : 'white',
                                                                                        cursor: 'pointer',
                                                                                        transition: 'all 0.3s ease',
                                                                                        '&:hover': {
                                                                                            transform: 'scale(1.2)'
                                                                                        }
                                                                                    }}
                                                                                />
                                                                            ))}
                                                                        </Box>

                                                                        {/* Image counter */}
                                                                        <Chip
                                                                            label={`${currentIndex + 1} / ${images.length}`}
                                                                            size="small"
                                                                            sx={{
                                                                                position: 'absolute',
                                                                                top: 16,
                                                                                right: 16,
                                                                                bgcolor: alpha('#000000', 0.7),
                                                                                color: 'white',
                                                                                fontWeight: 500,
                                                                                fontSize: '0.75rem',
                                                                                zIndex: 1
                                                                            }}
                                                                        />
                                                                    </>
                                                                )}
                                                            </>
                                                        ) : (
                                                            <Box sx={{ textAlign: 'center', p: 4 }}>
                                                                <ImageIcon sx={{ fontSize: 100, color: alpha('#FF9800', 0.3), mb: 2 }} />
                                                                <Typography variant="body1" sx={{ color: '#8A99A8', fontSize: '1rem' }}>
                                                                    No images available
                                                                </Typography>
                                                            </Box>
                                                        )}
                                                    </Box>
                                                </Grid>
                                            </Grid>
                                        </Paper>
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
                                    '& .MuiPaginationItem-root': { color: '#5A6874', borderRadius: '12px' },
                                    '& .Mui-selected': { bgcolor: '#FF9800 !important', color: 'white', '&:hover': { bgcolor: '#FF9800' } }
                                }}
                            />
                        </Box>
                    )}
                </Container>

                {/* Inquiry Dialog */}
                <Dialog open={inquiryDialogOpen} onClose={() => setInquiryDialogOpen(false)} maxWidth="sm" fullWidth
                        PaperProps={{ sx: { bgcolor: '#FFFFFF', borderRadius: '20px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)' } }}>
                    <DialogTitle sx={{ borderBottom: 'none', pb: 2, pt: 3, px: 3 }}>
                        <Typography variant="h6" fontWeight={700} color="#1A2733">Inquire about {selectedService?.name}</Typography>
                        <IconButton onClick={() => setInquiryDialogOpen(false)} sx={{ position: 'absolute', right: 16, top: 16, color: '#8A99A8' }}>
                            <CloseIcon />
                        </IconButton>
                    </DialogTitle>
                    <DialogContent sx={{ pt: 3, px: 3 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                            <TextField
                                fullWidth
                                label="Subject"
                                value={inquiryData.subject}
                                onChange={(e) => setInquiryData({ ...inquiryData, subject: e.target.value })}
                                required
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '12px',
                                        backgroundColor: '#F5F7FA',
                                        '& fieldset': { border: 'none' }
                                    }
                                }}
                            />
                            <TextField
                                fullWidth
                                label="Email"
                                type="email"
                                value={inquiryData.email}
                                onChange={(e) => setInquiryData({ ...inquiryData, email: e.target.value })}
                                required
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '12px',
                                        backgroundColor: '#F5F7FA',
                                        '& fieldset': { border: 'none' }
                                    }
                                }}
                            />
                            <TextField
                                fullWidth
                                label="Phone Number"
                                value={inquiryData.phone}
                                onChange={(e) => setInquiryData({ ...inquiryData, phone: e.target.value })}
                                required
                                placeholder="+374 XX XXX XXX"
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '12px',
                                        backgroundColor: '#F5F7FA',
                                        '& fieldset': { border: 'none' }
                                    }
                                }}
                            />
                            <TextField
                                fullWidth
                                multiline
                                rows={4}
                                label="Message"
                                value={inquiryData.message}
                                onChange={(e) => setInquiryData({ ...inquiryData, message: e.target.value })}
                                required
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '12px',
                                        backgroundColor: '#F5F7FA',
                                        '& fieldset': { border: 'none' }
                                    }
                                }}
                            />
                        </Box>
                    </DialogContent>
                    <DialogActions sx={{ p: 3, borderTop: 'none', gap: 1 }}>
                        <OutlinedButton onClick={() => setInquiryDialogOpen(false)}>Cancel</OutlinedButton>
                        <GradientButton onClick={handleSendInquiry} disabled={sendingInquiry}>
                            {sendingInquiry ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Send Inquiry'}
                        </GradientButton>
                    </DialogActions>
                </Dialog>

                {/* Snackbar */}
                <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
                    <Alert severity={snackbar.severity} sx={{
                        bgcolor: '#FFFFFF',
                        color: '#1A2733',
                        border: `1px solid ${snackbar.severity === 'success' ? '#4CAF50' : '#f44336'}`,
                        borderRadius: '12px'
                    }}>
                        {snackbar.message}
                    </Alert>
                </Snackbar>
            </Box>
        </LocalizationProvider>
    );
};

export default ServicesPage;