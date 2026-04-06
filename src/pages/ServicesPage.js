// src/pages/ServicesPage.js - Without cart functionality

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Typography,
    Box,
    Grid,
    Card,
    CardContent,
    CardMedia,
    CardActions,
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
    Paper,
    Fade,
    Tabs,
    Tab,
    Collapse,
    Slider,
    Stack
} from '@mui/material';
import {
    Favorite as FavoriteIcon,
    FavoriteBorder as FavoriteBorderIcon,
    Email as EmailIcon,
    Search as SearchIcon,
    Close as CloseIcon,
    LocationOn as LocationIcon,
    AttachMoney as PriceIcon,
    AccessTime as TimeIcon,
    Event as EventIcon,
    AccountCircle as AccountCircleIcon,
    Logout as LogoutIcon,
    Person as PersonIcon,
    Celebration as CelebrationIcon,
    Lock as LockIcon,
    AdminPanelSettings as AdminIcon,
    Star as StarIcon,
    Whatshot as WhatshotIcon,
    NewReleases as NewIcon,
    TrendingUp as TrendingIcon,
    FilterList as FilterIcon,
    Clear as ClearIcon,
    CalendarToday as CalendarIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { useAuth } from '../context/AuthContext';
import { serviceAPI } from '../services/serviceAPI';
import { alpha } from '@mui/material/styles';
import { isAdmin } from '../utils/jwtUtils';

const formatPriceAMD = (price) => {
    if (!price && price !== 0) return '֏0';
    return new Intl.NumberFormat('hy-AM', {
        style: 'currency',
        currency: 'AMD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(price);
};

const formatDate = (dateString) => {
    if (!dateString) return null;
    return dayjs(dateString).format('MMM D, YYYY');
};

const formatTime = (timeString) => {
    if (!timeString) return null;
    return dayjs(timeString, 'HH:mm').format('HH:mm');
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
    const { user, logout } = useAuth();

    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [categories, setCategories] = useState([]);
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
    const [userInitial, setUserInitial] = useState('');
    const [backgroundPosition, setBackgroundPosition] = useState({ x: 0, y: 0 });
    const [userIsAdmin, setUserIsAdmin] = useState(false);
    const [activeTab, setActiveTab] = useState(0);
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
    const [isSearching, setIsSearching] = useState(false);

    // Filter states
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedLocation, setSelectedLocation] = useState('');

    // Price filter states
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [priceRange, setPriceRange] = useState([0, 1000000]);

    // Date filter states
    const [startDateFrom, setStartDateFrom] = useState(null);
    const [startDateTo, setStartDateTo] = useState(null);

    useEffect(() => {
        if (user && user.userName) {
            setUserInitial(user.userName.charAt(0).toUpperCase());
        }
        const token = localStorage.getItem('token');
        if (token) {
            setUserIsAdmin(isAdmin(token));
        }
    }, [user]);

    // Load initial data on mount
    useEffect(() => {
        loadInitialData();
    }, []);

    // Load favorites after user is loaded
    useEffect(() => {
        if (user) {
            loadFavorites();
        }
    }, [user]);

    // Load services when page changes
    useEffect(() => {
        if (page > 0 || isSearching) {
            performSearch();
        }
    }, [page]);

    const loadInitialData = async () => {
        setLoading(true);
        try {
            await Promise.all([
                loadCategories(),
                performSearch()
            ]);
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
                size: 12,
                sortBy: 'createdAt',
                sortDirection: 'DESC'
            };

            // Add price filters if provided
            if (minPrice && minPrice !== '') {
                searchParams.minPrice = parseFloat(minPrice);
            }
            if (maxPrice && maxPrice !== '') {
                searchParams.maxPrice = parseFloat(maxPrice);
            }

            // Add date filters if provided
            if (startDateFrom) {
                searchParams.startDateFrom = startDateFrom.format('YYYY-MM-DD');
            }
            if (startDateTo) {
                searchParams.startDateTo = startDateTo.format('YYYY-MM-DD');
            }

            console.log('Searching with params:', searchParams);

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

    const loadCategories = async () => {
        try {
            const response = await serviceAPI.getCategories();
            setCategories(response.data);
        } catch (error) {
            console.error('Error loading categories:', error);
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
        // Trigger search after clearing
        setTimeout(() => performSearch(), 100);
    };

    const handlePriceRangeChange = (event, newValue) => {
        setPriceRange(newValue);
        setMinPrice(newValue[0].toString());
        setMaxPrice(newValue[1].toString());
    };

    const handleFavoriteToggle = async (serviceId) => {
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

    const LoadingSkeleton = () => (
        <Grid container spacing={3}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
                    <Card sx={{ background: '#FFFFFF', borderRadius: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                        <Skeleton variant="rectangular" height={200} animation="wave" sx={{ bgcolor: '#F0F0F0' }} />
                        <CardContent>
                            <Skeleton variant="text" height={32} width="80%" sx={{ bgcolor: '#F0F0F0' }} />
                            <Skeleton variant="text" height={20} width="60%" sx={{ bgcolor: '#F0F0F0' }} />
                            <Skeleton variant="text" height={20} width="40%" sx={{ bgcolor: '#F0F0F0' }} />
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );

    // Count active filters
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
                <CircularProgress sx={{ color: '#FF6B35' }} />
            </Backdrop>
        );
    }

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box sx={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #FFF9F0 0%, #F5F0E8 100%)',
                fontFamily: "'Inter', sans-serif",
                position: 'relative'
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
                        radial-gradient(circle at ${backgroundPosition.x * 100}% ${backgroundPosition.y * 100}%, rgba(255,107,53,0.06) 0%, transparent 50%),
                        radial-gradient(circle at ${100 - backgroundPosition.x * 100}% ${100 - backgroundPosition.y * 100}%, rgba(255,193,7,0.06) 0%, transparent 50%)
                    `,
                    transition: 'background 0.3s ease-out'
                }} />

                <style>{`
                    @keyframes float {
                        0%, 100% { transform: translateY(0) translateX(0); }
                        25% { transform: translateY(-10px) translateX(5px); }
                        50% { transform: translateY(-20px) translateX(-5px); }
                        75% { transform: translateY(-10px) translateX(5px); }
                    }
                    @keyframes pulse {
                        0%, 100% { opacity: 0.5; transform: scale(1); }
                        50% { opacity: 0.8; transform: scale(1.05); }
                    }
                `}</style>

                {/* Header */}
                <Box component="header" sx={{
                    position: 'sticky',
                    top: 0,
                    zIndex: 1000,
                    backgroundColor: alpha('#FFFFFF', 0.95),
                    backdropFilter: 'blur(10px)',
                    borderBottom: '1px solid rgba(0,0,0,0.08)',
                    boxShadow: '0 2px 20px rgba(0,0,0,0.03)'
                }}>
                    <Box sx={{ padding: '0 24px' }}>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            height: '70px',
                            maxWidth: '1400px',
                            margin: '0 auto'
                        }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => navigate('/')}>
                                <Box sx={{
                                    width: '38px',
                                    height: '38px',
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
                                    VeilVision
                                </Typography>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
                                <Button onClick={() => navigate('/')} sx={{ fontWeight: 500, color: '#4A4A4A', '&:hover': { color: '#FF6B35' } }}>Home</Button>
                                <Button onClick={handleAboutClick} sx={{ fontWeight: 500, color: '#4A4A4A', '&:hover': { color: '#FF6B35' } }}>About Us</Button>
                                <Button onClick={() => navigate('/services')} sx={{ fontWeight: 500, color: '#FF6B35', borderBottom: '2px solid #FF6B35', borderRadius: 0 }}>Services</Button>
                                {userIsAdmin && (
                                    <Button onClick={handleAdminPanel} sx={{ fontWeight: 500, color: '#FF9800' }}>Admin</Button>
                                )}
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <IconButton onClick={handleMenuOpen} sx={{
                                    background: 'linear-gradient(135deg, #FF6B35 0%, #FFB347 100%)',
                                    width: '38px',
                                    height: '38px',
                                    '&:hover': { transform: 'scale(1.05)' }
                                }}>
                                    {userInitial ? <Typography sx={{ fontWeight: 600, color: 'white' }}>{userInitial}</Typography> : <AccountCircleIcon sx={{ color: 'white' }} />}
                                </IconButton>
                            </Box>
                        </Box>
                    </Box>
                </Box>

                {/* User Menu */}
                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}
                      PaperProps={{ sx: { bgcolor: '#FFFFFF', color: '#1A1A1A', border: '1px solid #E0E0E0', minWidth: 200, borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' } }}>
                    <MenuItem onClick={handleProfile}><PersonIcon sx={{ mr: 2, fontSize: 20, color: '#FF6B35' }} />Profile</MenuItem>
                    <MenuItem onClick={() => navigate('/services')}><CelebrationIcon sx={{ mr: 2, fontSize: 20, color: '#FF6B35' }} />Services</MenuItem>
                    {userIsAdmin && (
                        <MenuItem onClick={handleAdminPanel}><AdminIcon sx={{ mr: 2, fontSize: 20, color: '#FF9800' }} />Admin Panel</MenuItem>
                    )}
                    <Divider sx={{ borderColor: '#F0E8E0' }} />
                    <MenuItem onClick={handleLogout}><LogoutIcon sx={{ mr: 2, fontSize: 20, color: '#FF6B35' }} />Logout</MenuItem>
                </Menu>

                {/* Main Content */}
                <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1, py: 5 }}>
                    {/* Hero Section */}
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
                            Discover Amazing Events
                        </Typography>
                        <Typography variant="h6" sx={{ color: '#6A6A6A', maxWidth: '600px', mx: 'auto' }}>
                            Find the perfect parties, birthdays, and entertainment services in Armenia
                        </Typography>
                    </Box>

                    {/* Category Tabs */}
                    <Tabs
                        value={activeTab}
                        onChange={(e, newValue) => setActiveTab(newValue)}
                        centered
                        sx={{
                            mb: 4,
                            '& .MuiTab-root': {
                                textTransform: 'none',
                                fontWeight: 600,
                                fontSize: '16px',
                                color: '#8A8A8A',
                                '&.Mui-selected': { color: '#FF6B35' }
                            },
                            '& .MuiTabs-indicator': { bgcolor: '#FF6B35', height: 3 }
                        }}
                    >
                        <Tab icon={<TrendingIcon />} iconPosition="start" label="All Services" />
                        <Tab icon={<WhatshotIcon />} iconPosition="start" label="Popular" />
                        <Tab icon={<NewIcon />} iconPosition="start" label="New Arrivals" />
                    </Tabs>

                    {/* Search Filters */}
                    <Paper elevation={0} sx={{
                        background: '#FFFFFF',
                        borderRadius: '24px',
                        p: 3,
                        mb: 3,
                        boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                        border: '1px solid #F0E8E0'
                    }}>
                        {/* Basic Search Row */}
                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs={12} md={4}>
                                <TextField
                                    fullWidth
                                    placeholder="Search services..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: '#B0B0B0' }} /></InputAdornment>,
                                        sx: { borderRadius: '16px' }
                                    }}
                                    sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#FAFAFA' } }}
                                />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <FormControl fullWidth>
                                    <InputLabel sx={{ color: '#8A8A8A' }}>Category</InputLabel>
                                    <Select
                                        value={selectedCategory}
                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                        label="Category"
                                        sx={{ borderRadius: '16px', bgcolor: '#FAFAFA' }}
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
                                        sx={{ borderRadius: '16px', bgcolor: '#FAFAFA' }}
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
                                            borderRadius: '30px',
                                            textTransform: 'none',
                                            fontWeight: 600,
                                            fontSize: '15px',
                                            boxShadow: '0 4px 12px rgba(255,107,53,0.25)',
                                            '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 6px 16px rgba(255,107,53,0.35)' }
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
                                                borderRadius: '30px',
                                                bgcolor: showAdvancedFilters ? alpha('#FF6B35', 0.1) : '#FAFAFA',
                                                color: showAdvancedFilters ? '#FF6B35' : '#8A8A8A'
                                            }}
                                        >
                                            <FilterIcon />
                                        </IconButton>
                                    </Tooltip>
                                </Stack>
                            </Grid>
                        </Grid>

                        {/* Advanced Filters - Collapsible */}
                        <Collapse in={showAdvancedFilters}>
                            <Box sx={{ mt: 3, pt: 3, borderTop: '1px solid #F0E8E0' }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <PriceIcon sx={{ color: '#FF6B35' }} /> Price Range
                                </Typography>

                                {/* Price Range Slider */}
                                <Box sx={{ px: 2, mb: 3 }}>
                                    <Slider
                                        value={priceRange}
                                        onChange={handlePriceRangeChange}
                                        valueLabelDisplay="auto"
                                        valueLabelFormat={(value) => `${value.toLocaleString()} ֏`}
                                        min={0}
                                        max={1000000}
                                        step={10000}
                                        sx={{
                                            color: '#FF6B35',
                                            '& .MuiSlider-thumb': { bgcolor: '#FF6B35' },
                                            '& .MuiSlider-track': { bgcolor: '#FF6B35' }
                                        }}
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
                                                InputProps={{ startAdornment: <InputAdornment position="start">֏</InputAdornment> }}
                                                sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#FAFAFA', borderRadius: '12px' } }}
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
                                                InputProps={{ startAdornment: <InputAdornment position="start">֏</InputAdornment> }}
                                                sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#FAFAFA', borderRadius: '12px' } }}
                                            />
                                        </Grid>
                                    </Grid>
                                </Box>

                                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <CalendarIcon sx={{ color: '#FF6B35' }} /> Event Date
                                </Typography>

                                {/* Date Range Filters */}
                                <Grid container spacing={2} sx={{ mb: 3 }}>
                                    <Grid item xs={12} sm={6}>
                                        <DatePicker
                                            label="Start Date From"
                                            value={startDateFrom}
                                            onChange={(newValue) => setStartDateFrom(newValue)}
                                            sx={{
                                                width: '100%',
                                                '& .MuiOutlinedInput-root': { bgcolor: '#FAFAFA', borderRadius: '12px' }
                                            }}
                                            slotProps={{
                                                textField: { fullWidth: true, size: 'small' }
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <DatePicker
                                            label="Start Date To"
                                            value={startDateTo}
                                            onChange={(newValue) => setStartDateTo(newValue)}
                                            sx={{
                                                width: '100%',
                                                '& .MuiOutlinedInput-root': { bgcolor: '#FAFAFA', borderRadius: '12px' }
                                            }}
                                            slotProps={{
                                                textField: { fullWidth: true, size: 'small' }
                                            }}
                                        />
                                    </Grid>
                                </Grid>

                                {/* Clear Filters Button */}
                                {activeFiltersCount > 0 && (
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                                        <Button
                                            variant="outlined"
                                            startIcon={<ClearIcon />}
                                            onClick={handleClearFilters}
                                            size="small"
                                            sx={{
                                                borderColor: '#FF6B35',
                                                color: '#FF6B35',
                                                borderRadius: '30px',
                                                '&:hover': { bgcolor: alpha('#FF6B35', 0.05) }
                                            }}
                                        >
                                            Clear All Filters ({activeFiltersCount})
                                        </Button>
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
                            {startDateFrom && (
                                <Chip
                                    label={`From: ${startDateFrom.format('MMM D, YYYY')}`}
                                    onDelete={() => { setStartDateFrom(null); handleSearch(); }}
                                    size="small"
                                    sx={{ bgcolor: alpha('#FF6B35', 0.1), color: '#FF6B35', borderRadius: '20px' }}
                                />
                            )}
                            {startDateTo && (
                                <Chip
                                    label={`To: ${startDateTo.format('MMM D, YYYY')}`}
                                    onDelete={() => { setStartDateTo(null); handleSearch(); }}
                                    size="small"
                                    sx={{ bgcolor: alpha('#FF6B35', 0.1), color: '#FF6B35', borderRadius: '20px' }}
                                />
                            )}
                        </Box>
                    )}

                    {/* Results Count */}
                    {!loading && services.length > 0 && (
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 1 }}>
                            <Typography sx={{ color: '#8A8A8A' }}>
                                Found <strong style={{ color: '#FF6B35' }}>{totalElements}</strong> {totalElements === 1 ? 'service' : 'services'}
                            </Typography>
                        </Box>
                    )}

                    {/* Services Grid */}
                    {loading ? (
                        <LoadingSkeleton />
                    ) : services.length === 0 ? (
                        <Box sx={{ textAlign: 'center', py: 8 }}>
                            <Typography variant="h6" sx={{ color: '#8A8A8A' }}>No services found</Typography>
                            <Typography variant="body2" sx={{ color: '#B0B0B0', mt: 1 }}>Try adjusting your search filters</Typography>
                            <Button
                                variant="outlined"
                                onClick={handleClearFilters}
                                sx={{ mt: 3, borderColor: '#FF6B35', color: '#FF6B35', borderRadius: '30px' }}
                            >
                                Clear All Filters
                            </Button>
                        </Box>
                    ) : (
                        <>
                            <Grid container spacing={3}>
                                {services.map((service, index) => (
                                    <Grid item xs={12} sm={6} md={4} lg={3} key={service.id}>
                                        <Zoom in={true} style={{ transitionDelay: `${index * 30}ms` }}>
                                            <Card sx={{
                                                background: '#FFFFFF',
                                                borderRadius: '20px',
                                                transition: 'all 0.3s ease',
                                                height: '100%',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                cursor: 'pointer',
                                                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                                                '&:hover': {
                                                    transform: 'translateY(-6px)',
                                                    boxShadow: '0 20px 30px rgba(0,0,0,0.1)'
                                                }
                                            }}>
                                                <Box sx={{ position: 'relative', height: 200, overflow: 'hidden', borderRadius: '20px 20px 0 0' }}>
                                                    {service.imageUrls && service.imageUrls[0] ? (
                                                        <CardMedia
                                                            component="img"
                                                            image={service.imageUrls[0]}
                                                            alt={service.name}
                                                            sx={{ height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease', '&:hover': { transform: 'scale(1.05)' } }}
                                                        />
                                                    ) : (
                                                        <Box sx={{ height: '100%', bgcolor: alpha('#FF6B35', 0.1), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                            <CelebrationIcon sx={{ fontSize: 50, color: alpha('#FF6B35', 0.3) }} />
                                                        </Box>
                                                    )}
                                                    <Chip
                                                        label={service.category}
                                                        size="small"
                                                        sx={{
                                                            position: 'absolute',
                                                            top: 12,
                                                            left: 12,
                                                            bgcolor: '#FF6B35',
                                                            color: 'white',
                                                            fontWeight: 500,
                                                            borderRadius: '10px'
                                                        }}
                                                    />
                                                    <IconButton
                                                        onClick={(e) => { e.stopPropagation(); handleFavoriteToggle(service.id); }}
                                                        sx={{
                                                            position: 'absolute',
                                                            top: 12,
                                                            right: 12,
                                                            bgcolor: alpha('#FFFFFF', 0.9),
                                                            '&:hover': { bgcolor: '#FFFFFF', transform: 'scale(1.05)' }
                                                        }}
                                                    >
                                                        {favorites.has(service.id) ? <FavoriteIcon sx={{ color: '#FF6B35', fontSize: 20 }} /> : <FavoriteBorderIcon sx={{ color: '#4A4A4A', fontSize: 20 }} />}
                                                    </IconButton>
                                                </Box>

                                                <CardContent sx={{ flex: 1, p: 2.5 }}>
                                                    <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '18px', mb: 1, lineHeight: 1.3 }}>
                                                        {service.name}
                                                    </Typography>

                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                                        <PriceIcon sx={{ fontSize: 16, color: '#FF6B35' }} />
                                                        <Typography variant="body1" sx={{ color: '#FF6B35', fontWeight: 700 }}>
                                                            {formatPriceAMD(service.price)}
                                                        </Typography>
                                                    </Box>

                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                                        <LocationIcon sx={{ fontSize: 14, color: '#B0B0B0' }} />
                                                        <Typography variant="body2" sx={{ color: '#8A8A8A' }}>
                                                            {service.locationDisplayName || service.location}
                                                        </Typography>
                                                    </Box>

                                                    {service.duration && (
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                                            <TimeIcon sx={{ fontSize: 14, color: '#B0B0B0' }} />
                                                            <Typography variant="body2" sx={{ color: '#8A8A8A' }}>
                                                                {service.duration} {service.duration === 1 ? 'hour' : 'hours'}
                                                            </Typography>
                                                        </Box>
                                                    )}

                                                    {service.startDate && (
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                                            <EventIcon sx={{ fontSize: 14, color: '#B0B0B0' }} />
                                                            <Typography variant="body2" sx={{ color: '#8A8A8A', fontSize: '12px' }}>
                                                                {formatDate(service.startDate)}
                                                                {service.startTime && ` at ${formatTime(service.startTime)}`}
                                                            </Typography>
                                                        </Box>
                                                    )}

                                                    <Typography variant="body2" sx={{
                                                        color: '#6A6A6A',
                                                        mt: 1.5,
                                                        display: '-webkit-box',
                                                        WebkitLineClamp: 2,
                                                        WebkitBoxOrient: 'vertical',
                                                        overflow: 'hidden',
                                                        lineHeight: 1.5
                                                    }}>
                                                        {service.description}
                                                    </Typography>
                                                </CardContent>

                                                <CardActions sx={{ p: 2.5, pt: 0, gap: 1 }}>
                                                    <Tooltip title="Inquire">
                                                        <IconButton
                                                            onClick={(e) => { e.stopPropagation(); handleOpenInquiry(service); }}
                                                            sx={{
                                                                color: '#FFB347',
                                                                bgcolor: alpha('#FFB347', 0.1),
                                                                '&:hover': { bgcolor: alpha('#FFB347', 0.2) }
                                                            }}
                                                        >
                                                            <EmailIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Button
                                                        variant="outlined"
                                                        size="small"
                                                        onClick={() => navigate(`/services/${service.id}`)}
                                                        sx={{
                                                            ml: 'auto',
                                                            borderColor: alpha('#FF6B35', 0.5),
                                                            color: '#FF6B35',
                                                            borderRadius: '30px',
                                                            textTransform: 'none',
                                                            '&:hover': { borderColor: '#FF6B35', bgcolor: alpha('#FF6B35', 0.05) }
                                                        }}
                                                    >
                                                        View Details
                                                    </Button>
                                                </CardActions>
                                            </Card>
                                        </Zoom>
                                    </Grid>
                                ))}
                            </Grid>

                            {totalPages > 1 && (
                                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
                                    <Pagination
                                        count={totalPages}
                                        page={page + 1}
                                        onChange={(e, newPage) => setPage(newPage - 1)}
                                        sx={{
                                            '& .MuiPaginationItem-root': { color: '#4A4A4A', borderRadius: '12px' },
                                            '& .Mui-selected': { bgcolor: '#FF6B35 !important', color: 'white', '&:hover': { bgcolor: '#FF6B35' } }
                                        }}
                                    />
                                </Box>
                            )}
                        </>
                    )}
                </Container>

                {/* Inquiry Dialog */}
                <Dialog open={inquiryDialogOpen} onClose={() => setInquiryDialogOpen(false)} maxWidth="sm" fullWidth
                        PaperProps={{ sx: { bgcolor: '#FFFFFF', borderRadius: '24px', boxShadow: '0 24px 48px rgba(0,0,0,0.15)' } }}>
                    <DialogTitle sx={{ borderBottom: '1px solid #F0E8E0', pb: 2 }}>
                        <Typography variant="h6" fontWeight={700}>Inquire about {selectedService?.name}</Typography>
                        <IconButton onClick={() => setInquiryDialogOpen(false)} sx={{ position: 'absolute', right: 12, top: 12, color: '#8A8A8A' }}>
                            <CloseIcon />
                        </IconButton>
                    </DialogTitle>
                    <DialogContent sx={{ pt: 3 }}>
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
                                        bgcolor: '#FAFAFA',
                                        '&:hover fieldset': { borderColor: '#FFB347' }
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
                                        bgcolor: '#FAFAFA',
                                        '&:hover fieldset': { borderColor: '#FFB347' }
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
                                        bgcolor: '#FAFAFA',
                                        '&:hover fieldset': { borderColor: '#FFB347' }
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
                                        bgcolor: '#FAFAFA',
                                        '&:hover fieldset': { borderColor: '#FFB347' }
                                    }
                                }}
                            />
                        </Box>
                    </DialogContent>
                    <DialogActions sx={{ p: 3, borderTop: '1px solid #F0E8E0', gap: 1 }}>
                        <Button onClick={() => setInquiryDialogOpen(false)} sx={{ color: '#8A8A8A', borderRadius: '30px', px: 3, textTransform: 'none' }}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSendInquiry}
                            disabled={sendingInquiry}
                            variant="contained"
                            sx={{
                                background: 'linear-gradient(135deg, #FF6B35 0%, #FFB347 100%)',
                                borderRadius: '30px',
                                px: 3,
                                textTransform: 'none',
                                fontWeight: 600,
                                '&:hover': { transform: 'translateY(-1px)' }
                            }}
                        >
                            {sendingInquiry ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Send Inquiry'}
                        </Button>
                    </DialogActions>
                </Dialog>

                <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
                    <Alert severity={snackbar.severity} sx={{
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
        </LocalizationProvider>
    );
};

export default ServicesPage;