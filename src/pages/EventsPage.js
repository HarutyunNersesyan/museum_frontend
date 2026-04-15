// src/pages/EventsPage.js
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
    Avatar,
    GlobalStyles,
    Fade,
    Grow,
    Paper,
    CircularProgress,
    Backdrop,
    InputAdornment,
    Card,
    CardContent,
    Stack,
    Tooltip
} from '@mui/material';
import {
    LocationOn as LocationIcon,
    AccessTime as AccessTimeIcon,
    Event as EventIcon,
    AccountCircle as AccountCircleIcon,
    Logout as LogoutIcon,
    Person as PersonIcon,
    Celebration as CelebrationIcon,
    AdminPanelSettings as AdminIcon,
    Info as InfoIcon,
    HowToReg as HowToRegIcon,
    ChevronLeft as ChevronLeftIcon,
    ChevronRight as ChevronRightIcon,
    Image as ImageIcon,
    Phone as PhoneIcon,
    Email as EmailIcon,
    Search as SearchIcon,
    FilterAlt as FilterIcon,
    Clear as ClearIcon,
    Museum as MuseumIcon,
    Category as CategoryIcon,
    CalendarToday as CalendarIcon,
    AttachMoney as PriceIcon,
    LocalOffer as TicketIcon,
    Star as StarIcon
} from '@mui/icons-material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { useAuth } from '../context/AuthContext';
import eventAPI from '../services/eventAPI';
import { alpha, styled } from '@mui/material/styles';

const scrollbarStyles = {
    '*::-webkit-scrollbar': { width: '10px', height: '10px' },
    '*::-webkit-scrollbar-track': { background: '#F5F0E8', borderRadius: '10px' },
    '*::-webkit-scrollbar-thumb': { background: '#FF6B35', borderRadius: '10px', '&:hover': { background: '#E55A2B' } },
};

const EventImage = styled('img')({
    maxWidth: '100%',
    maxHeight: '100%',
    width: 'auto',
    height: 'auto',
    objectFit: 'contain',
    borderRadius: '12px'
});

const DetailItem = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '12px',
    '&:last-child': { marginBottom: 0 }
}));

const DetailIcon = styled(Box)(({ theme }) => ({
    width: '36px',
    height: '36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: alpha('#FF6B35', 0.12),
    borderRadius: '12px',
    color: '#FF6B35'
}));

const DetailText = styled(Box)(({ theme }) => ({
    flex: 1,
    '& .label': {
        fontSize: '0.7rem',
        color: '#8A8A8A',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        marginBottom: '2px'
    },
    '& .value': {
        fontSize: '0.95rem',
        color: '#2C2C2C',
        fontWeight: 700
    }
}));

// Event Categories (from backend EventCategory enum)
const EVENT_CATEGORIES = [
    { value: 'ART', label: '🎨 Art' },
    { value: 'HISTORY', label: '📜 History' },
    { value: 'SCIENCE', label: '🔬 Science' },
    { value: 'NATURAL_HISTORY', label: '🌿 Natural History' },
    { value: 'TECHNOLOGY', label: '💻 Technology' },
    { value: 'MILITARY', label: '⚔️ Military' },
    { value: 'ARCHAEOLOGY', label: '🏺 Archaeology' },
    { value: 'CULTURAL', label: '🎭 Cultural' },
    { value: 'MARITIME', label: '⚓ Maritime' },
    { value: 'SPACE', label: '🚀 Space' },
    { value: 'TRANSPORT', label: '🚗 Transport' },
    { value: 'RELIGIOUS', label: '⛪ Religious' },
    { value: 'ETHNOGRAPHIC', label: '👥 Ethnographic' },
    { value: 'OPEN_AIR', label: '🌳 Open Air' }
];

// Locations (from backend Location enum)
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

const formatEventDate = (eventDate) => {
    if (!eventDate) return null;
    try {
        const date = dayjs(eventDate);
        return date.isValid() ? date.format('MMMM D, YYYY, HH:mm') : null;
    } catch { return null; }
};

const formatPriceAMD = (price) => {
    if (!price && price !== 0) return '֏0';
    return new Intl.NumberFormat('hy-AM', { style: 'currency', currency: 'AMD', minimumFractionDigits: 0 }).format(price);
};

const getCategoryDisplayName = (categoryValue) => {
    const category = EVENT_CATEGORIES.find(cat => cat.value === categoryValue);
    return category ? category.label : categoryValue;
};

const EventsPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout, isAdmin } = useAuth();

    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [anchorEl, setAnchorEl] = useState(null);
    const [activeImageIndex, setActiveImageIndex] = useState({});
    const [sortBy, setSortBy] = useState('eventDate');
    const [sortDirection, setSortDirection] = useState('asc');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedLocation, setSelectedLocation] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [searchLoading, setSearchLoading] = useState(false);

    useEffect(() => {
        const savedParams = sessionStorage.getItem('eventsSearchParams');
        if (savedParams) {
            const params = JSON.parse(savedParams);
            if (params.query) setSearchQuery(params.query);
            if (params.category) setSelectedCategory(params.category);
            if (params.location) setSelectedLocation(params.location);
            sessionStorage.removeItem('eventsSearchParams');
        }

        const urlParams = new URLSearchParams(location.search);
        const queryFromUrl = urlParams.get('query');
        const categoryFromUrl = urlParams.get('category');
        const locationFromUrl = urlParams.get('location');

        if (queryFromUrl) setSearchQuery(queryFromUrl);
        if (categoryFromUrl) setSelectedCategory(categoryFromUrl);
        if (locationFromUrl) setSelectedLocation(locationFromUrl);
    }, []);

    useEffect(() => {
        loadEvents();
    }, [page, sortBy, sortDirection, searchQuery, selectedCategory, selectedLocation]);

    const loadEvents = async () => {
        setLoading(true);
        try {
            const response = await eventAPI.getAllEvents(page, 10, sortBy, sortDirection);
            let filteredEvents = response.data.content || [];

            if (searchQuery) {
                filteredEvents = filteredEvents.filter(event =>
                    event.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    event.description?.toLowerCase().includes(searchQuery.toLowerCase())
                );
            }

            if (selectedCategory) {
                filteredEvents = filteredEvents.filter(event => event.eventCategory === selectedCategory);
            }

            if (selectedLocation) {
                filteredEvents = filteredEvents.filter(event => event.location === selectedLocation);
            }

            setEvents(filteredEvents);
            setTotalPages(response.data.totalPages);
            setTotalElements(filteredEvents.length);

            const newIndices = {};
            filteredEvents.forEach(event => {
                newIndices[event.id] = 0;
            });
            setActiveImageIndex(newIndices);
        } catch (error) {
            console.error('Error loading events:', error);
            setSnackbar({ open: true, message: 'Failed to load events', severity: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        setPage(0);
        loadEvents();
    };

    const handleClearFilters = () => {
        setSearchQuery('');
        setSelectedCategory('');
        setSelectedLocation('');
        setPage(0);
        setTimeout(() => loadEvents(), 100);
    };

    const handleSortChange = (e) => { setSortBy(e.target.value); setPage(0); };
    const handleSortDirectionToggle = () => { setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc'); setPage(0); };

    const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);

    const handleLogout = async () => {
        await logout();
        handleMenuClose();
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

    const handleAboutClick = () => navigate('/about');
    const handleHowItWorks = () => {
        navigate('/');
        setTimeout(() => {
            const element = document.getElementById('how-it-works');
            if (element) element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };
    const handleHomeClick = () => navigate('/');

    const handleNextImage = (eventId, totalImages, e) => {
        e.stopPropagation();
        setActiveImageIndex(prev => ({
            ...prev,
            [eventId]: ((prev[eventId] || 0) + 1) % totalImages
        }));
    };

    const handlePrevImage = (eventId, totalImages, e) => {
        e.stopPropagation();
        setActiveImageIndex(prev => ({
            ...prev,
            [eventId]: ((prev[eventId] || 0) - 1 + totalImages) % totalImages
        }));
    };

    const userInitial = user?.userName ? user.userName.charAt(0).toUpperCase() : '';
    const activeFiltersCount = [searchQuery, selectedCategory, selectedLocation].filter(Boolean).length;

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box sx={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #FFF9F0 0%, #F5F0E8 100%)',
                fontFamily: 'Inter, sans-serif',
                position: 'relative'
            }}>
                <GlobalStyles styles={scrollbarStyles} />

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
                            <Box onClick={handleHomeClick} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, cursor: 'pointer' }}>
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
                                    WebkitTextFillColor: 'transparent'
                                }}>
                                    Festivy
                                </Typography>
                            </Box>

                            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 3 }}>
                                <Button startIcon={<InfoIcon />} onClick={handleAboutClick} sx={{ fontWeight: 500, color: '#4A4A4A', '&:hover': { color: '#FF6B35' } }}>About Us</Button>
                                <Button startIcon={<HowToRegIcon />} onClick={handleHowItWorks} sx={{ fontWeight: 500, color: '#4A4A4A', '&:hover': { color: '#FF6B35' } }}>How It Works</Button>
                                <Button startIcon={<CelebrationIcon />} sx={{ fontWeight: 500, color: '#FF6B35', borderBottom: '2px solid #FF6B35', borderRadius: 0 }}>Events</Button>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                {user ? (
                                    <>
                                        <Chip label={`Welcome, ${user.userName}`} size="small" sx={{ display: { xs: 'none', sm: 'flex' }, bgcolor: alpha('#FF6B35', 0.1), color: '#FF6B35' }} />
                                        <IconButton onClick={handleMenuOpen} sx={{ background: 'linear-gradient(135deg, #FF6B35 0%, #FFB347 100%)', width: 38, height: 38 }}>
                                            <Avatar sx={{ width: 38, height: 38, bgcolor: 'transparent', color: 'white' }}>{userInitial || <AccountCircleIcon />}</Avatar>
                                        </IconButton>
                                        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose} PaperProps={{ sx: { bgcolor: '#FFFFFF', borderRadius: '16px', minWidth: 200 } }}>
                                            <MenuItem onClick={handleProfile}><PersonIcon sx={{ mr: 2, color: '#FF6B35' }} />Profile</MenuItem>
                                            {isAdmin && <MenuItem onClick={handleAdminPanel}><AdminIcon sx={{ mr: 2, color: '#FF9800' }} />Admin Panel</MenuItem>}
                                            <Divider />
                                            <MenuItem onClick={handleLogout}><LogoutIcon sx={{ mr: 2, color: '#FF6B35' }} />Logout</MenuItem>
                                        </Menu>
                                    </>
                                ) : (
                                    <>
                                        <Button onClick={() => navigate('/login')} sx={{ fontWeight: 500, color: '#4A4A4A' }}>Sign In</Button>
                                        <Button variant="contained" onClick={() => navigate('/signup')} sx={{ fontWeight: 600, borderRadius: '12px', background: 'linear-gradient(135deg, #FF6B35 0%, #FFB347 100%)' }}>Sign Up</Button>
                                    </>
                                )}
                            </Box>
                        </Box>
                    </Container>
                </Box>

                {/* Main Content */}
                <Box sx={{ py: 4, px: { xs: 2, sm: 3, md: 4, lg: 6 } }}>

                    {/* Hero Section */}
                    <Fade in={true}>
                        <Box sx={{ textAlign: 'center', mb: 4 }}>
                            <Typography variant="h1" sx={{ fontSize: { xs: '32px', md: '48px' }, fontWeight: 800, background: 'linear-gradient(135deg, #FF6B35 0%, #FFB347 50%, #FF6B35 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', mb: 1 }}>
                                Discover Amazing Events
                            </Typography>
                            <Typography variant="h6" sx={{ color: '#8A99A8' }}>Explore exhibitions and cultural events at museums across Armenia</Typography>
                        </Box>
                    </Fade>

                    {/* Search and Filters */}
                    <Paper elevation={0} sx={{
                        background: alpha('#FFFFFF', 0.95),
                        borderRadius: '20px',
                        p: 2.5,
                        mb: 3,
                        border: '1px solid rgba(255,107,53,0.15)'
                    }}>
                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs={12} md={4}>
                                <TextField
                                    fullWidth
                                    placeholder="Search events by name or description..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: '#FF6B35' }} /></InputAdornment>,
                                        sx: { borderRadius: '40px', bgcolor: '#FAFAFA' }
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <FormControl fullWidth>
                                    <InputLabel>Category</InputLabel>
                                    <Select
                                        value={selectedCategory}
                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                        label="Category"
                                        sx={{ borderRadius: '40px', bgcolor: '#FAFAFA' }}
                                        renderValue={(selected) => {
                                            const category = EVENT_CATEGORIES.find(c => c.value === selected);
                                            return category ? category.label : selected;
                                        }}
                                    >
                                        <MenuItem value=""><em>All Categories</em></MenuItem>
                                        {EVENT_CATEGORIES.map((cat) => (
                                            <MenuItem key={cat.value} value={cat.value}>{cat.label}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <FormControl fullWidth>
                                    <InputLabel>Location</InputLabel>
                                    <Select
                                        value={selectedLocation}
                                        onChange={(e) => setSelectedLocation(e.target.value)}
                                        label="Location"
                                        sx={{ borderRadius: '40px', bgcolor: '#FAFAFA' }}
                                        renderValue={(selected) => {
                                            const location = ARMENIAN_LOCATIONS.find(l => l.value === selected);
                                            return location ? location.label : selected;
                                        }}
                                    >
                                        <MenuItem value=""><em>All Locations</em></MenuItem>
                                        {ARMENIAN_LOCATIONS.map((loc) => (
                                            <MenuItem key={loc.value} value={loc.value}>{loc.label}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={2}>
                                <Stack direction="row" spacing={1}>
                                    <Button fullWidth variant="contained" onClick={handleSearch} sx={{ borderRadius: '40px', background: 'linear-gradient(135deg, #FF6B35 0%, #FFB347 100%)', height: '56px' }}>
                                        Search
                                    </Button>
                                    <Tooltip title="Filters">
                                        <IconButton onClick={() => setShowFilters(!showFilters)} sx={{ height: '56px', width: '56px', border: '1px solid #F0E8E0', borderRadius: '40px', bgcolor: '#FAFAFA' }}>
                                            <FilterIcon />
                                        </IconButton>
                                    </Tooltip>
                                </Stack>
                            </Grid>
                        </Grid>

                        {showFilters && (
                            <Box sx={{ mt: 3, pt: 3, borderTop: '1px solid #F0E8E0' }}>
                                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                                    <FormControl size="small" sx={{ minWidth: 150 }}>
                                        <InputLabel>Sort By</InputLabel>
                                        <Select value={sortBy} onChange={handleSortChange} label="Sort By">
                                            <MenuItem value="eventDate">Event Date</MenuItem>
                                            <MenuItem value="guidePrice">Guide Price</MenuItem>
                                            <MenuItem value="ticketPrice">Ticket Price</MenuItem>
                                            <MenuItem value="name">Name</MenuItem>
                                        </Select>
                                    </FormControl>
                                    <Button onClick={handleSortDirectionToggle} variant="outlined" size="small" sx={{ borderRadius: '20px' }}>
                                        {sortDirection === 'asc' ? '↑ Ascending' : '↓ Descending'}
                                    </Button>
                                </Box>
                                {activeFiltersCount > 0 && (
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                                        <Button startIcon={<ClearIcon />} onClick={handleClearFilters} sx={{ color: '#FF6B35' }}>Clear All ({activeFiltersCount})</Button>
                                    </Box>
                                )}
                            </Box>
                        )}
                    </Paper>

                    {/* Results Count */}
                    {!loading && events.length > 0 && (
                        <Box sx={{ mb: 3 }}>
                            <Typography sx={{ color: '#8A99A8' }}>Found <strong style={{ color: '#FF6B35' }}>{totalElements}</strong> events</Typography>
                        </Box>
                    )}

                    {/* Events List */}
                    {loading ? (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                            {[1, 2, 3].map(i => (
                                <Box key={i}>
                                    <Grid container>
                                        <Grid item xs={12} md={5}><Skeleton variant="rectangular" height={280} sx={{ borderRadius: '16px' }} /></Grid>
                                        <Grid item xs={12} md={7}>
                                            <Skeleton height={40} width="60%" />
                                            <Skeleton height={20} width="90%" />
                                            <Skeleton height={20} width="80%" />
                                            <Skeleton height={20} width="50%" />
                                        </Grid>
                                    </Grid>
                                    <Divider sx={{ my: 4 }} />
                                </Box>
                            ))}
                        </Box>
                    ) : events.length === 0 ? (
                        <Box sx={{ textAlign: 'center', py: 8 }}>
                            <Typography variant="h6" sx={{ color: '#8A99A8' }}>No events found</Typography>
                            <Button onClick={handleClearFilters} sx={{ mt: 2, color: '#FF6B35' }}>Clear filters</Button>
                        </Box>
                    ) : (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                            {events.map((event, index) => {
                                const eventDate = formatEventDate(event.eventDate);
                                const images = event.imageUrls || [];
                                const currentIndex = activeImageIndex[event.id] || 0;

                                return (
                                    <Grow in={true} style={{ transitionDelay: `${index * 50}ms` }} key={event.id}>
                                        <Box sx={{
                                            py: 3,
                                            borderBottom: index < events.length - 1 ? '1px solid #E8ECF0' : 'none'
                                        }}>
                                            <Grid container spacing={3}>
                                                {/* Image Carousel */}
                                                <Grid item xs={12} md={5}>
                                                    <Box sx={{
                                                        position: 'relative',
                                                        minHeight: 280,
                                                        bgcolor: '#FFFFFF',
                                                        borderRadius: '16px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        overflow: 'hidden',
                                                        border: '1px solid #F0E8E0',
                                                        boxShadow: '0 4px 12px rgba(0,0,0,0.04)'
                                                    }}>
                                                        {images.length > 0 ? (
                                                            <>
                                                                <EventImage src={images[currentIndex]} alt={event.name} />
                                                                {images.length > 1 && (
                                                                    <>
                                                                        <IconButton onClick={(e) => handlePrevImage(event.id, images.length, e)} sx={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', bgcolor: alpha('#000', 0.5), color: 'white', '&:hover': { bgcolor: alpha('#000', 0.7) } }}>
                                                                            <ChevronLeftIcon />
                                                                        </IconButton>
                                                                        <IconButton onClick={(e) => handleNextImage(event.id, images.length, e)} sx={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', bgcolor: alpha('#000', 0.5), color: 'white', '&:hover': { bgcolor: alpha('#000', 0.7) } }}>
                                                                            <ChevronRightIcon />
                                                                        </IconButton>
                                                                        <Chip label={`${currentIndex + 1}/${images.length}`} size="small" sx={{ position: 'absolute', bottom: 8, right: 8, bgcolor: alpha('#000', 0.7), color: 'white' }} />
                                                                    </>
                                                                )}
                                                            </>
                                                        ) : (
                                                            <Box sx={{ textAlign: 'center' }}>
                                                                <ImageIcon sx={{ fontSize: 60, color: alpha('#FF6B35', 0.3) }} />
                                                                <Typography variant="body2" sx={{ color: '#8A99A8', mt: 1 }}>No images</Typography>
                                                            </Box>
                                                        )}
                                                    </Box>
                                                </Grid>

                                                {/* Event Details */}
                                                <Grid item xs={12} md={7}>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2, flexWrap: 'wrap', gap: 1 }}>
                                                        <Typography variant="h5" sx={{ fontWeight: 700, color: '#1A2733' }}>{event.name}</Typography>
                                                        {eventDate && dayjs(event.eventDate).isAfter(dayjs()) ? (
                                                            <Chip label="Upcoming" size="small" sx={{ bgcolor: alpha('#4CAF50', 0.15), color: '#2E7D32', fontWeight: 600 }} />
                                                        ) : (
                                                            <Chip label="Past" size="small" sx={{ bgcolor: alpha('#9E9E9E', 0.15), color: '#757575', fontWeight: 600 }} />
                                                        )}
                                                    </Box>

                                                    <Typography variant="body2" sx={{ color: '#5A6874', mb: 3, lineHeight: 1.6 }}>
                                                        {event.description}
                                                    </Typography>

                                                    {/* Price Section */}
                                                    <Grid container spacing={2} sx={{ mb: 3 }}>
                                                        <Grid item xs={12} sm={6}>
                                                            <DetailItem>
                                                                <DetailIcon><PriceIcon sx={{ fontSize: 20 }} /></DetailIcon>
                                                                <DetailText>
                                                                    <div className="label">Guide Price</div>
                                                                    <div className="value" style={{ color: '#FF6B35' }}>{formatPriceAMD(event.guidePrice)}</div>
                                                                </DetailText>
                                                            </DetailItem>
                                                        </Grid>
                                                        <Grid item xs={12} sm={6}>
                                                            <DetailItem>
                                                                <DetailIcon><TicketIcon sx={{ fontSize: 20 }} /></DetailIcon>
                                                                <DetailText>
                                                                    <div className="label">Ticket Price</div>
                                                                    <div className="value" style={{ color: '#4CAF50' }}>{formatPriceAMD(event.ticketPrice)}</div>
                                                                </DetailText>
                                                            </DetailItem>
                                                        </Grid>
                                                    </Grid>

                                                    {/* Event Details Grid */}
                                                    <Grid container spacing={2} sx={{ mb: 3 }}>
                                                        <Grid item xs={12} sm={6}>
                                                            <DetailItem>
                                                                <DetailIcon><CategoryIcon sx={{ fontSize: 20 }} /></DetailIcon>
                                                                <DetailText>
                                                                    <div className="label">Category</div>
                                                                    <div className="value">{getCategoryDisplayName(event.eventCategory)}</div>
                                                                </DetailText>
                                                            </DetailItem>
                                                        </Grid>
                                                        <Grid item xs={12} sm={6}>
                                                            <DetailItem>
                                                                <DetailIcon><LocationIcon sx={{ fontSize: 20 }} /></DetailIcon>
                                                                <DetailText>
                                                                    <div className="label">Location</div>
                                                                    <div className="value">{event.location}</div>
                                                                </DetailText>
                                                            </DetailItem>
                                                        </Grid>
                                                        <Grid item xs={12} sm={6}>
                                                            <DetailItem>
                                                                <DetailIcon><MuseumIcon sx={{ fontSize: 20 }} /></DetailIcon>
                                                                <DetailText>
                                                                    <div className="label">Museum</div>
                                                                    <div className="value">{event.museumName || '-'}</div>
                                                                </DetailText>
                                                            </DetailItem>
                                                        </Grid>
                                                        <Grid item xs={12} sm={6}>
                                                            <DetailItem>
                                                                <DetailIcon><CalendarIcon sx={{ fontSize: 20 }} /></DetailIcon>
                                                                <DetailText>
                                                                    <div className="label">Event Date</div>
                                                                    <div className="value">{eventDate || 'Date not set'}</div>
                                                                </DetailText>
                                                            </DetailItem>
                                                        </Grid>
                                                        {event.duration && (
                                                            <Grid item xs={12} sm={6}>
                                                                <DetailItem>
                                                                    <DetailIcon><AccessTimeIcon sx={{ fontSize: 20 }} /></DetailIcon>
                                                                    <DetailText>
                                                                        <div className="label">Duration</div>
                                                                        <div className="value">{event.duration} {event.duration === 1 ? 'hour' : 'hours'}</div>
                                                                    </DetailText>
                                                                </DetailItem>
                                                            </Grid>
                                                        )}
                                                        {event.eventType && (
                                                            <Grid item xs={12} sm={6}>
                                                                <DetailItem>
                                                                    <DetailIcon><StarIcon sx={{ fontSize: 20 }} /></DetailIcon>
                                                                    <DetailText>
                                                                        <div className="label">Event Type</div>
                                                                        <div className="value">{event.eventType}</div>
                                                                    </DetailText>
                                                                </DetailItem>
                                                            </Grid>
                                                        )}
                                                    </Grid>

                                                    {/* Contact Information */}
                                                    {(event.contactEmail || event.phoneNumber) && (
                                                        <Box sx={{ mt: 2, p: 2, bgcolor: alpha('#FF6B35', 0.04), borderRadius: '16px', border: `1px solid ${alpha('#FF6B35', 0.15)}` }}>
                                                            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#2C2C2C', mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                📞 Contact Information
                                                            </Typography>
                                                            {event.contactEmail && (
                                                                <DetailItem sx={{ mb: 1 }}>
                                                                    <DetailIcon sx={{ width: '28px', height: '28px', backgroundColor: alpha('#FF6B35', 0.08) }}>
                                                                        <EmailIcon sx={{ fontSize: 16 }} />
                                                                    </DetailIcon>
                                                                    <DetailText>
                                                                        <div className="value" style={{ fontSize: '0.85rem', fontWeight: 500 }}>{event.contactEmail}</div>
                                                                    </DetailText>
                                                                </DetailItem>
                                                            )}
                                                            {event.phoneNumber && (
                                                                <DetailItem>
                                                                    <DetailIcon sx={{ width: '28px', height: '28px', backgroundColor: alpha('#FF6B35', 0.08) }}>
                                                                        <PhoneIcon sx={{ fontSize: 16 }} />
                                                                    </DetailIcon>
                                                                    <DetailText>
                                                                        <div className="value" style={{ fontSize: '0.85rem', fontWeight: 500 }}>{event.phoneNumber}</div>
                                                                    </DetailText>
                                                                </DetailItem>
                                                            )}
                                                        </Box>
                                                    )}
                                                </Grid>
                                            </Grid>
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
                                sx={{ '& .Mui-selected': { bgcolor: '#FF6B35 !important', color: 'white' } }}
                            />
                        </Box>
                    )}
                </Box>

                <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
                    <Alert severity={snackbar.severity} sx={{ borderRadius: '12px' }}>{snackbar.message}</Alert>
                </Snackbar>
            </Box>
        </LocalizationProvider>
    );
};

export default EventsPage;