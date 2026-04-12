// src/pages/ServicesPage.js - Final updated version

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
    LinkedIn as LinkedInIcon
} from '@mui/icons-material';
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

        // Don't clear filters when switching tabs - keep the same search filters
        // Just reload the data with the same filters
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
                setServices(prevServices =>
                    prevServices.map(service =>
                        service.id === serviceId
                            ? { ...service, likeCount: Math.max(0, (service.likeCount || 0) - 1) }
                            : service
                    )
                );
                setSnackbar({
                    open: true,
                    message: 'Removed like',
                    severity: 'info'
                });
            } else {
                await serviceAPI.addToFavorites(serviceId);
                setFavorites(prev => new Set(prev).add(serviceId));
                setServices(prevServices =>
                    prevServices.map(service =>
                        service.id === serviceId
                            ? { ...service, likeCount: (service.likeCount || 0) + 1 }
                            : service
                    )
                );
                setSnackbar({
                    open: true,
                    message: 'Liked!',
                    severity: 'success'
                });
            }
        } catch (error) {
            console.error('Error toggling like:', error);
            setSnackbar({
                open: true,
                message: 'Failed to update like',
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
                            <Box onClick={() => navigate('/')} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, cursor: 'pointer' }}>
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
                                <Button startIcon={<InfoIcon />} sx={{ fontWeight: 500, color: '#5A6874', '&:hover': { color: '#FF9800' } }} onClick={handleAboutClick}>
                                    About Us
                                </Button>
                                <Button startIcon={<HowToRegIcon />} sx={{ fontWeight: 500, color: '#5A6874', '&:hover': { color: '#FF9800' } }} onClick={handleHowItWorks}>
                                    How It Works
                                </Button>
                                <Button startIcon={<CelebrationIcon />} sx={{ fontWeight: 500, color: '#FF9800', borderBottom: '2px solid #FF9800', borderRadius: 0 }} onClick={() => navigate('/services')}>
                                    Services
                                </Button>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                {user ? (
                                    <>
                                        <Chip label={`Welcome, ${user.userName}`} size="small" sx={{ display: { xs: 'none', sm: 'flex' }, bgcolor: alpha('#FF9800', 0.1), color: '#FF9800', border: `1px solid ${alpha('#FF9800', 0.2)}` }} />
                                        <IconButton onClick={handleMenuOpen} sx={{ background: 'linear-gradient(135deg, #FF9800 0%, #FF5722 100%)', width: 38, height: 38, '&:hover': { transform: 'scale(1.05)' } }}>
                                            <Avatar sx={{ width: 38, height: 38, bgcolor: 'transparent', color: 'white' }}>{userInitial || <AccountCircleIcon />}</Avatar>
                                        </IconButton>
                                        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose} PaperProps={{ sx: { bgcolor: '#FFFFFF', color: '#1A2733', border: '1px solid #E8ECF0', minWidth: 200, borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' } }}>
                                            <MenuItem onClick={handleProfile}><PersonIcon sx={{ mr: 2, fontSize: 20, color: '#FF9800' }} />Profile</MenuItem>
                                            {isAdmin && <MenuItem onClick={handleAdminPanel}><AdminIcon sx={{ mr: 2, fontSize: 20, color: '#FF9800' }} />Admin Panel</MenuItem>}
                                            <Divider />
                                            <MenuItem onClick={handleLogout}><LogoutIcon sx={{ mr: 2, fontSize: 20, color: '#f44336' }} />Logout</MenuItem>
                                        </Menu>
                                    </>
                                ) : (
                                    <>
                                        <Button sx={{ fontWeight: 500, color: '#5A6874', '&:hover': { color: '#FF9800' } }} onClick={() => navigate('/login')}>Sign In</Button>
                                        <GradientButton onClick={() => navigate('/signup')}>Get Started</GradientButton>
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
                            <Typography variant="h1" sx={{ fontSize: { xs: '36px', md: '56px' }, fontWeight: 800, background: 'linear-gradient(135deg, #FF9800 0%, #FF5722 50%, #FF9800 100%)', backgroundSize: '200% 200%', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', mb: 2, letterSpacing: '-1px' }}>
                                Discover Amazing Events
                            </Typography>
                            <Typography variant="h6" sx={{ color: '#8A99A8', maxWidth: '600px', mx: 'auto' }}>
                                Find the perfect parties, birthdays, and entertainment services in Armenia
                            </Typography>
                        </Box>
                    </Fade>

                    {/* TABS */}
                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4, borderBottom: '1px solid #E8ECF0' }}>
                        <Tabs value={activeTab} onChange={handleTabChange} sx={{ '& .MuiTab-root': { fontSize: '1rem', fontWeight: 600, textTransform: 'none', minWidth: 120, py: 1.5, color: '#8A99A8', '&.Mui-selected': { color: '#FF9800' } }, '& .MuiTabs-indicator': { backgroundColor: '#FF9800', height: 3, borderRadius: '3px 3px 0 0' } }}>
                            <Tab label="All Services" value="all" icon={<CelebrationIcon sx={{ fontSize: 20 }} />} iconPosition="start" />
                            <Tab label="Popular" value="popular" icon={<WhatshotIcon sx={{ fontSize: 20 }} />} iconPosition="start" />
                        </Tabs>
                    </Box>

                    {/* Search Filters - Show for BOTH tabs */}
                    <Paper elevation={0} sx={{ background: '#FFFFFF', borderRadius: '20px', p: 3, mb: 3, boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)', border: '1px solid #E8ECF0' }}>
                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs={12} md={4}>
                                <TextField
                                    fullWidth
                                    placeholder="Search services..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                    sx={{ '& .MuiOutlinedInput-root': { backgroundColor: '#F5F7FA', borderRadius: '12px', '& fieldset': { border: 'none' } } }}
                                />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <FormControl fullWidth>
                                    <InputLabel sx={{ color: '#8A99A8' }}>Category</InputLabel>
                                    <Select
                                        value={selectedCategory}
                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                        label="Category"
                                        sx={{ backgroundColor: '#F5F7FA', borderRadius: '12px', '& fieldset': { border: 'none' } }}
                                    >
                                        <MenuItem value="">All Categories</MenuItem>
                                        {CATEGORIES.map((cat) => <MenuItem key={cat} value={cat}>{cat}</MenuItem>)}
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
                                        sx={{ backgroundColor: '#F5F7FA', borderRadius: '12px', '& fieldset': { border: 'none' } }}
                                    >
                                        <MenuItem value="">All Locations</MenuItem>
                                        {ARMENIAN_LOCATIONS.map((location) => <MenuItem key={location.value} value={location.value}>{location.label}</MenuItem>)}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={2}>
                                <Stack direction="row" spacing={1}>
                                    <GradientButton fullWidth onClick={handleSearch} sx={{ height: '56px' }}>Search</GradientButton>
                                    <Tooltip title="Advanced Filters">
                                        <IconButton
                                            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                                            sx={{ height: '56px', width: '56px', border: '1px solid #E8ECF0', borderRadius: '12px', bgcolor: showAdvancedFilters ? alpha('#FF9800', 0.1) : '#F5F7FA', color: showAdvancedFilters ? '#FF9800' : '#8A99A8' }}
                                        >
                                            <FilterIcon />
                                        </IconButton>
                                    </Tooltip>
                                </Stack>
                            </Grid>
                        </Grid>

                        {/* Advanced Filters - Price Range only */}
                        <Collapse in={showAdvancedFilters}>
                            <Box sx={{ mt: 3, pt: 3, borderTop: '1px solid #E8ECF0' }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: '#1A2733' }}>Price Range</Typography>
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
                                            <TextField fullWidth type="number" label="Min Price (AMD)" value={minPrice} onChange={(e) => { setMinPrice(e.target.value); setPriceRange([parseInt(e.target.value) || 0, priceRange[1]]); }} size="small" sx={{ '& .MuiOutlinedInput-root': { backgroundColor: '#F5F7FA', borderRadius: '8px', '& fieldset': { border: 'none' } } }} />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <TextField fullWidth type="number" label="Max Price (AMD)" value={maxPrice} onChange={(e) => { setMaxPrice(e.target.value); setPriceRange([priceRange[0], parseInt(e.target.value) || 1000000]); }} size="small" sx={{ '& .MuiOutlinedInput-root': { backgroundColor: '#F5F7FA', borderRadius: '8px', '& fieldset': { border: 'none' } } }} />
                                        </Grid>
                                    </Grid>
                                </Box>

                                {activeFiltersCount > 0 && (
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                                        <OutlinedButton startIcon={<ClearIcon />} onClick={handleClearFilters} size="small">Clear All Filters ({activeFiltersCount})</OutlinedButton>
                                    </Box>
                                )}
                            </Box>
                        </Collapse>
                    </Paper>

                    {/* Active Filters Chips */}
                    {activeFiltersCount > 0 && (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                            {searchQuery && <Chip label={`Search: ${searchQuery}`} onDelete={() => { setSearchQuery(''); handleSearch(); }} size="small" sx={{ bgcolor: alpha('#FF9800', 0.1), color: '#FF9800', borderRadius: '20px' }} />}
                            {selectedCategory && <Chip label={`Category: ${selectedCategory}`} onDelete={() => { setSelectedCategory(''); handleSearch(); }} size="small" sx={{ bgcolor: alpha('#FF9800', 0.1), color: '#FF9800', borderRadius: '20px' }} />}
                            {selectedLocation && <Chip label={`Location: ${selectedLocation}`} onDelete={() => { setSelectedLocation(''); handleSearch(); }} size="small" sx={{ bgcolor: alpha('#FF9800', 0.1), color: '#FF9800', borderRadius: '20px' }} />}
                            {(minPrice || maxPrice) && <Chip label={`Price: ${minPrice ? `${parseInt(minPrice).toLocaleString()}֏` : '0֏'} - ${maxPrice ? `${parseInt(maxPrice).toLocaleString()}֏` : '∞'}`} onDelete={() => { setMinPrice(''); setMaxPrice(''); setPriceRange([0, 1000000]); handleSearch(); }} size="small" sx={{ bgcolor: alpha('#FF9800', 0.1), color: '#FF9800', borderRadius: '20px' }} />}
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
                            <OutlinedButton onClick={handleClearFilters} sx={{ mt: 3 }}>Clear All Filters</OutlinedButton>
                        </Box>
                    ) : (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                            {services.map((service, index) => {
                                const eventDate = formatEventDate(service.startDate, service.startTime);
                                const images = service.imageUrls || [];
                                const currentIndex = activeImageIndex[service.id] || 0;
                                const isLiked = favorites.has(service.id);

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
                                                                <Tooltip title={isLiked ? "Unlike" : "Like"}>
                                                                    <IconButton
                                                                        onClick={(e) => handleLikeToggle(service.id, e)}
                                                                        sx={{
                                                                            bgcolor: isLiked ? alpha('#FF9800', 0.2) : alpha('#FF9800', 0.1),
                                                                            '&:hover': {
                                                                                bgcolor: alpha('#FF9800', 0.3),
                                                                                transform: 'scale(1.05)'
                                                                            }
                                                                        }}
                                                                    >
                                                                        <WhatshotIcon sx={{ color: isLiked ? '#FF9800' : '#8A99A8', fontSize: 24 }} />
                                                                    </IconButton>
                                                                </Tooltip>
                                                                <Typography variant="body1" sx={{ fontWeight: 600, color: isLiked ? '#FF9800' : '#5A6874', minWidth: '45px' }}>
                                                                    {service.likeCount || 0}
                                                                </Typography>
                                                            </Box>
                                                        </Box>

                                                        <Typography variant="body1" sx={{ color: '#5A6874', mb: '26px', lineHeight: 1.6, fontSize: '1rem' }}>
                                                            {service.description.length > 200 ? service.description.substring(0, 200) + '...' : service.description}
                                                        </Typography>

                                                        <Grid container spacing={3} sx={{ mb: '26px' }}>
                                                            <Grid item xs={6} sm={4}>
                                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                                    <Box>
                                                                        <Typography variant="body2" sx={{ color: '#8A99A8', display: 'block', fontSize: '0.85rem' }}>Price</Typography>
                                                                        <Typography variant="body1" sx={{ color: '#4CAF50', fontWeight: 600, fontSize: '1.1rem' }}>
                                                                            Since {service.price?.toLocaleString()} ֏
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
                                                                </Typography>
                                                            </Box>
                                                        )}

                                                        {/* Contact Us Section */}
                                                        {(service.contactEmail || (service.phoneNumbers && service.phoneNumbers.length > 0) || (service.socialNetworks && service.socialNetworks.length > 0)) && (
                                                            <Box sx={{ mt: 2, mb: 2 }}>
                                                                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1A2733', mb: 1.5 }}>
                                                                    📞 Contact Us
                                                                </Typography>

                                                                {service.contactEmail && (
                                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                                                                        <EmailIcon sx={{ fontSize: 20, color: '#8A99A8' }} />
                                                                        <Typography variant="body2" sx={{ color: '#5A6874' }}>
                                                                            {service.contactEmail}
                                                                        </Typography>
                                                                    </Box>
                                                                )}

                                                                {service.phoneNumbers && service.phoneNumbers.length > 0 && (
                                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5, flexWrap: 'wrap' }}>
                                                                        <PhoneIcon sx={{ fontSize: 20, color: '#8A99A8' }} />
                                                                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                                                            {service.phoneNumbers.map((phone, idx) => (
                                                                                <Chip key={idx} label={phone} size="small" sx={{ bgcolor: alpha('#FF9800', 0.1), color: '#FF9800' }} />
                                                                            ))}
                                                                        </Box>
                                                                    </Box>
                                                                )}

                                                                {service.socialNetworks && service.socialNetworks.length > 0 && (
                                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5, flexWrap: 'wrap' }}>
                                                                        <LanguageIcon sx={{ fontSize: 20, color: '#8A99A8' }} />
                                                                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                                                            {service.socialNetworks.map((social, idx) => {
                                                                                const getSocialIcon = (platform) => {
                                                                                    switch(platform?.toUpperCase()) {
                                                                                        case 'FACEBOOK': return <FacebookIcon sx={{ fontSize: 18, color: '#1877F2' }} />;
                                                                                        case 'INSTAGRAM': return <InstagramIcon sx={{ fontSize: 18, color: '#E4405F' }} />;
                                                                                        case 'YOUTUBE': return <YouTubeIcon sx={{ fontSize: 18, color: '#FF0000' }} />;
                                                                                        case 'LINKEDIN': return <LinkedInIcon sx={{ fontSize: 18, color: '#0077B5' }} />;
                                                                                        default: return <LanguageIcon sx={{ fontSize: 18, color: '#FF9800' }} />;
                                                                                    }
                                                                                };
                                                                                return (
                                                                                    <Button key={idx} size="small" href={social.url} target="_blank" startIcon={getSocialIcon(social.platform)} sx={{ textTransform: 'none', color: '#1A2733', '&:hover': { bgcolor: alpha('#FF9800', 0.1) } }}>
                                                                                        {social.platform}
                                                                                    </Button>
                                                                                );
                                                                            })}
                                                                        </Box>
                                                                    </Box>
                                                                )}
                                                            </Box>
                                                        )}

                                                        <Divider sx={{ borderColor: '#E8ECF0', my: '26px' }} />
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
                                                                    <ServiceImage src={images[currentIndex]} alt={`${service.name} - ${currentIndex + 1}`} />
                                                                </Box>

                                                                {images.length > 1 && (
                                                                    <>
                                                                        <IconButton onClick={(e) => handlePrevImage(service.id, images.length, e)} sx={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', backgroundColor: alpha('#000000', 0.5), color: 'white', '&:hover': { backgroundColor: alpha('#000000', 0.7) }, zIndex: 1 }}>
                                                                            <ChevronLeftIcon />
                                                                        </IconButton>
                                                                        <IconButton onClick={(e) => handleNextImage(service.id, images.length, e)} sx={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', backgroundColor: alpha('#000000', 0.5), color: 'white', '&:hover': { backgroundColor: alpha('#000000', 0.7) }, zIndex: 1 }}>
                                                                            <ChevronRightIcon />
                                                                        </IconButton>

                                                                        <Box sx={{ position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 1, zIndex: 1, backgroundColor: alpha('#000000', 0.5), padding: '4px 8px', borderRadius: '20px' }}>
                                                                            {images.map((_, idx) => (
                                                                                <Box key={idx} onClick={(e) => { e.stopPropagation(); setActiveImageIndex(prev => ({ ...prev, [service.id]: idx })); }} sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: idx === currentIndex ? '#FF9800' : 'white', cursor: 'pointer', transition: 'all 0.3s ease', '&:hover': { transform: 'scale(1.2)' } }} />
                                                                            ))}
                                                                        </Box>

                                                                        <Chip label={`${currentIndex + 1} / ${images.length}`} size="small" sx={{ position: 'absolute', top: 16, right: 16, bgcolor: alpha('#000000', 0.7), color: 'white', fontWeight: 500, fontSize: '0.75rem', zIndex: 1 }} />
                                                                    </>
                                                                )}
                                                            </>
                                                        ) : (
                                                            <Box sx={{ textAlign: 'center', p: 4 }}>
                                                                <ImageIcon sx={{ fontSize: 100, color: alpha('#FF9800', 0.3), mb: 2 }} />
                                                                <Typography variant="body1" sx={{ color: '#8A99A8', fontSize: '1rem' }}>No images available</Typography>
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
                            <Pagination count={totalPages} page={page + 1} onChange={(e, newPage) => setPage(newPage - 1)} sx={{ '& .MuiPaginationItem-root': { color: '#5A6874', borderRadius: '12px' }, '& .Mui-selected': { bgcolor: '#FF9800 !important', color: 'white', '&:hover': { bgcolor: '#FF9800' } } }} />
                        </Box>
                    )}
                </Container>

                {/* Snackbar */}
                <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
                    <Alert severity={snackbar.severity} sx={{ bgcolor: '#FFFFFF', color: '#1A2733', border: `1px solid ${snackbar.severity === 'success' ? '#4CAF50' : '#f44336'}`, borderRadius: '12px' }}>
                        {snackbar.message}
                    </Alert>
                </Snackbar>
            </Box>
        </LocalizationProvider>
    );
};

export default ServicesPage;