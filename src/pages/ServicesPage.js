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
    Avatar,
    Divider,
    CircularProgress,
    Zoom,
    Tooltip,
    Backdrop
} from '@mui/material';
import {
    Favorite as FavoriteIcon,
    FavoriteBorder as FavoriteBorderIcon,
    ShoppingCart as CartIcon,
    Email as EmailIcon,
    Search as SearchIcon,
    Close as CloseIcon,
    LocationOn as LocationIcon,
    AttachMoney as PriceIcon,
    AccountCircle as AccountCircleIcon,
    Logout as LogoutIcon,
    Person as PersonIcon,
    Celebration as CelebrationIcon,
    Lock as LockIcon,
    AddShoppingCart as AddCartIcon,
    AdminPanelSettings as AdminIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import serviceAPI from '../services/serviceAPI';
import { alpha } from '@mui/material/styles';
import { isAdmin } from '../utils/jwtUtils';

// Format price to AMD
const formatPriceAMD = (price) => {
    if (!price && price !== 0) return '֏0';
    return new Intl.NumberFormat('hy-AM', {
        style: 'currency',
        currency: 'AMD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(price);
};

// Armenian cities matching backend enum
const ARMENIAN_CITIES = [
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

const ServicesPage = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [location, setLocation] = useState('');
    const [favorites, setFavorites] = useState(new Set());
    const [cartCount, setCartCount] = useState(0);
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
    const [cartAnchorEl, setCartAnchorEl] = useState(null);
    const [cartItems, setCartItems] = useState([]);
    const [cartTotal, setCartTotal] = useState(0);
    const [userIsAdmin, setUserIsAdmin] = useState(false);

    useEffect(() => {
        if (user && user.userName) {
            setUserInitial(user.userName.charAt(0).toUpperCase());
        }
        const token = localStorage.getItem('token');
        if (token) {
            setUserIsAdmin(isAdmin(token));
        }
    }, [user]);

    useEffect(() => {
        loadServices();
        loadCategories();
        loadFavorites();
        loadCart();
    }, [page, selectedCategory, location]);

    useEffect(() => {
        const handleMouseMove = (e) => {
            const x = e.clientX / window.innerWidth;
            const y = e.clientY / window.innerHeight;
            setBackgroundPosition({ x, y });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const loadServices = async () => {
        setLoading(true);
        try {
            let response;
            if (searchQuery) {
                response = await serviceAPI.searchServices({
                    query: searchQuery,
                    category: selectedCategory || null,
                    location: location || null,
                    page: page,
                    size: 12
                });
            } else {
                response = await serviceAPI.getAllServices(page, 12);
            }
            setServices(response.data.content);
            setTotalPages(response.data.totalPages);
            setTotalElements(response.data.totalElements);
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

    const loadCart = async () => {
        try {
            const response = await serviceAPI.getCart();
            setCartItems(response.data);
            const total = response.data.reduce((sum, item) =>
                sum + (item.service.price * item.quantity), 0);
            setCartTotal(total);
            setCartCount(response.data.length);
        } catch (error) {
            console.error('Error loading cart:', error);
        }
    };

    const handleSearch = () => {
        setPage(0);
        loadServices();
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

    const handleAddToCart = async (serviceId) => {
        try {
            await serviceAPI.addToCart(serviceId, 1);
            await loadCart();
            setSnackbar({
                open: true,
                message: 'Added to bucket',
                severity: 'success'
            });
        } catch (error) {
            console.error('Error adding to cart:', error);
            setSnackbar({
                open: true,
                message: 'Failed to add to bucket',
                severity: 'error'
            });
        }
    };

    const handleRemoveFromCart = async (serviceId) => {
        try {
            await serviceAPI.removeFromCart(serviceId);
            await loadCart();
            setSnackbar({
                open: true,
                message: 'Removed from bucket',
                severity: 'info'
            });
        } catch (error) {
            console.error('Error removing from cart:', error);
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

    const handleCartClick = (event) => {
        setCartAnchorEl(event.currentTarget);
    };

    const handleCartClose = () => {
        setCartAnchorEl(null);
    };

    const handleUpdateCartQuantity = async (serviceId, newQuantity) => {
        try {
            await serviceAPI.updateCartQuantity(serviceId, newQuantity);
            await loadCart();
        } catch (error) {
            console.error('Error updating quantity:', error);
        }
    };

    const handleClearCart = async () => {
        try {
            await serviceAPI.clearCart();
            await loadCart();
            setSnackbar({
                open: true,
                message: 'Bucket cleared',
                severity: 'info'
            });
        } catch (error) {
            console.error('Error clearing cart:', error);
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
                <Grid item xs={12} sm={6} md={4} key={i}>
                    <Card sx={{ background: alpha('#1A1A1A', 0.8), borderRadius: '20px' }}>
                        <Skeleton variant="rectangular" height={200} animation="wave" />
                        <CardContent>
                            <Skeleton variant="text" height={32} width="80%" />
                            <Skeleton variant="text" height={20} width="60%" />
                            <Skeleton variant="text" height={20} width="40%" />
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );

    if (!user) {
        return (
            <Backdrop open={true} sx={{ zIndex: 9999 }}>
                <CircularProgress sx={{ color: '#4CAF50' }} />
            </Backdrop>
        );
    }

    return (
        <Box sx={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #0A0A0A 0%, #1A1A1A 100%)',
            color: '#FFFFFF',
            fontFamily: "'Inter', sans-serif",
            position: 'relative'
        }}>
            <Box sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 0,
                background: `
                    radial-gradient(circle at ${backgroundPosition.x * 100}% ${backgroundPosition.y * 100}%, ${alpha('#009688', 0.15)} 0%, transparent 50%),
                    radial-gradient(circle at ${100 - backgroundPosition.x * 100}% ${100 - backgroundPosition.y * 100}%, ${alpha('#4CAF50', 0.15)} 0%, transparent 50%),
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
            <Box component="header" sx={{
                position: 'sticky',
                top: 0,
                zIndex: 1000,
                backgroundColor: alpha('#0A0A0A', 0.95),
                backdropFilter: 'blur(10px)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
                <Box sx={{ padding: '0 24px' }}>
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        height: '80px',
                        maxWidth: '1400px',
                        margin: '0 auto'
                    }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => navigate('/')}>
                            <Box sx={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '12px',
                                background: 'linear-gradient(135deg, #009688 0%, #4CAF50 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <LockIcon sx={{ color: 'white', fontSize: 24 }} />
                            </Box>
                            <Typography variant="h6" sx={{
                                fontWeight: 700,
                                background: 'linear-gradient(135deg, #009688 0%, #4CAF50 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent'
                            }}>
                                VeilVision
                            </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
                            <Button onClick={() => navigate('/')} sx={{ fontWeight: 500, color: '#FFFFFF' }}>Home</Button>
                            <Button onClick={handleAboutClick} sx={{ fontWeight: 500, color: '#FFFFFF' }}>About Us</Button>
                            <Button onClick={() => navigate('/services')} sx={{ fontWeight: 500, color: '#4CAF50', borderBottom: '2px solid #4CAF50', borderRadius: 0 }}>
                                Services
                            </Button>
                            {userIsAdmin && (
                                <Button onClick={handleAdminPanel} sx={{ fontWeight: 500, color: '#FF9800' }}>Admin</Button>
                            )}
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <Tooltip title="My Bucket">
                                <IconButton onClick={handleCartClick} sx={{ color: '#FFFFFF', position: 'relative' }}>
                                    <CartIcon />
                                    {cartCount > 0 && (
                                        <Box sx={{
                                            position: 'absolute',
                                            top: -5,
                                            right: -5,
                                            bgcolor: '#4CAF50',
                                            color: 'white',
                                            borderRadius: '50%',
                                            width: 20,
                                            height: 20,
                                            fontSize: '12px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            {cartCount}
                                        </Box>
                                    )}
                                </IconButton>
                            </Tooltip>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Typography sx={{ color: alpha('#FFFFFF', 0.8), fontWeight: 500, fontSize: '14px', display: { xs: 'none', md: 'block' } }}>
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
                        </Box>
                    </Box>
                </Box>
            </Box>

            {/* Cart Dropdown */}
            <Menu anchorEl={cartAnchorEl} open={Boolean(cartAnchorEl)} onClose={handleCartClose}
                  PaperProps={{ sx: { bgcolor: '#121212', color: '#FFFFFF', border: '1px solid #242424', minWidth: 320, maxWidth: 400 } }}>
                <Box sx={{ p: 2 }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>My Bucket ({cartCount} items)</Typography>
                    {cartItems.length === 0 ? (
                        <Typography sx={{ color: alpha('#FFFFFF', 0.7), textAlign: 'center', py: 3 }}>
                            Your bucket is empty
                        </Typography>
                    ) : (
                        <>
                            {cartItems.map((item) => (
                                <Box key={item.id} sx={{ display: 'flex', gap: 2, mb: 2, pb: 2, borderBottom: `1px solid ${alpha('#FFFFFF', 0.1)}` }}>
                                    <Box sx={{ width: 60, height: 60, bgcolor: alpha('#009688', 0.2), borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        {item.service.imageUrls?.[0] ? (
                                            <img src={item.service.imageUrls[0]} alt={item.service.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8 }} />
                                        ) : (
                                            <CartIcon sx={{ color: '#009688' }} />
                                        )}
                                    </Box>
                                    <Box sx={{ flex: 1 }}>
                                        <Typography variant="body2" fontWeight={600}>{item.service.name}</Typography>
                                        <Typography variant="caption" sx={{ color: alpha('#FFFFFF', 0.7) }}>{formatPriceAMD(item.service.price)}</Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                                            <IconButton size="small" onClick={() => handleUpdateCartQuantity(item.service.id, Math.max(1, item.quantity - 1))} sx={{ color: '#009688' }}>-</IconButton>
                                            <Typography variant="body2">{item.quantity}</Typography>
                                            <IconButton size="small" onClick={() => handleUpdateCartQuantity(item.service.id, item.quantity + 1)} sx={{ color: '#009688' }}>+</IconButton>
                                            <IconButton size="small" onClick={() => handleRemoveFromCart(item.service.id)} sx={{ color: '#f44336', ml: 'auto' }}>
                                                <CloseIcon fontSize="small" />
                                            </IconButton>
                                        </Box>
                                    </Box>
                                </Box>
                            ))}
                            <Divider sx={{ borderColor: alpha('#FFFFFF', 0.1), my: 2 }} />
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                <Typography fontWeight={600}>Total:</Typography>
                                <Typography fontWeight={600} color="#4CAF50">{formatPriceAMD(cartTotal)}</Typography>
                            </Box>
                            <Button fullWidth variant="outlined" onClick={handleClearCart} sx={{ borderColor: '#f44336', color: '#f44336', mb: 1 }}>
                                Clear Bucket
                            </Button>
                        </>
                    )}
                </Box>
            </Menu>

            {/* User Menu */}
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}
                  PaperProps={{ sx: { bgcolor: '#121212', color: '#FFFFFF', border: '1px solid #242424', minWidth: 200 } }}>
                <MenuItem onClick={handleProfile}><PersonIcon sx={{ mr: 2, fontSize: 20, color: '#009688' }} />Profile</MenuItem>
                <MenuItem onClick={() => navigate('/services')}><CelebrationIcon sx={{ mr: 2, fontSize: 20, color: '#009688' }} />Services</MenuItem>
                {userIsAdmin && (
                    <MenuItem onClick={handleAdminPanel}><AdminIcon sx={{ mr: 2, fontSize: 20, color: '#FF9800' }} />Admin Panel</MenuItem>
                )}
                <Divider sx={{ borderColor: '#242424' }} />
                <MenuItem onClick={handleLogout}><LogoutIcon sx={{ mr: 2, fontSize: 20, color: '#f44336' }} />Logout</MenuItem>
            </Menu>

            {/* Main Content */}
            <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1, py: 4 }}>
                <Box sx={{ textAlign: 'center', mb: 5 }}>
                    <Typography variant="h2" sx={{
                        fontSize: { xs: '36px', md: '48px' },
                        fontWeight: 800,
                        background: 'linear-gradient(135deg, #009688, #4CAF50, #009688)',
                        backgroundSize: '200% 200%',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>
                        Holiday Services
                    </Typography>
                    <Typography variant="h6" sx={{ color: alpha('#FFFFFF', 0.8), mt: 2 }}>
                        Discover amazing parties, birthdays, and entertainment services in Armenia
                    </Typography>
                </Box>

                {/* Search Filters */}
                <Card sx={{ background: alpha('#121212', 0.95), borderRadius: '20px', p: 3, mb: 4, border: `1px solid ${alpha('#FFFFFF', 0.1)}` }}>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                placeholder="Search services..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: alpha('#FFFFFF', 0.5) }} /></InputAdornment>
                                }}
                                sx={{ '& .MuiOutlinedInput-root': { bgcolor: alpha('#1A1A1A', 0.8), color: '#FFFFFF' } }}
                            />
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <FormControl fullWidth>
                                <InputLabel sx={{ color: alpha('#FFFFFF', 0.7) }}>Category</InputLabel>
                                <Select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} label="Category" sx={{ bgcolor: alpha('#1A1A1A', 0.8), color: '#FFFFFF' }}>
                                    <MenuItem value="">All Categories</MenuItem>
                                    {categories.map((cat) => (
                                        <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <FormControl fullWidth>
                                <InputLabel sx={{ color: alpha('#FFFFFF', 0.7) }}>City</InputLabel>
                                <Select value={location} onChange={(e) => setLocation(e.target.value)} label="City" sx={{ bgcolor: alpha('#1A1A1A', 0.8), color: '#FFFFFF' }}>
                                    <MenuItem value="">All Cities</MenuItem>
                                    {ARMENIAN_CITIES.map((city) => (
                                        <MenuItem key={city.value} value={city.value}>{city.label}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={2}>
                            <Button fullWidth variant="contained" onClick={handleSearch} sx={{
                                background: 'linear-gradient(135deg, #009688, #4CAF50)',
                                height: '56px',
                                '&:hover': { transform: 'translateY(-2px)' }
                            }}>
                                Search
                            </Button>
                        </Grid>
                    </Grid>
                </Card>

                {/* Services Grid */}
                {loading ? (
                    <LoadingSkeleton />
                ) : services.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 8 }}>
                        <Typography variant="h6" sx={{ color: alpha('#FFFFFF', 0.7) }}>No services found</Typography>
                        <Typography variant="body2" sx={{ color: alpha('#FFFFFF', 0.5), mt: 1 }}>Try adjusting your search filters</Typography>
                    </Box>
                ) : (
                    <>
                        <Typography sx={{ mb: 2, color: alpha('#FFFFFF', 0.7) }}>
                            Found {totalElements} service{totalElements !== 1 ? 's' : ''}
                        </Typography>
                        <Grid container spacing={3}>
                            {services.map((service, index) => (
                                <Grid item xs={12} sm={6} md={4} lg={3} key={service.id}>
                                    <Zoom in={true} style={{ transitionDelay: `${index * 50}ms` }}>
                                        <Card sx={{
                                            background: alpha('#1A1A1A', 0.95),
                                            borderRadius: '20px',
                                            border: `1px solid ${alpha('#FFFFFF', 0.1)}`,
                                            transition: 'all 0.3s ease',
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            '&:hover': { transform: 'translateY(-5px)', borderColor: alpha('#4CAF50', 0.3) }
                                        }}>
                                            <Box sx={{ position: 'relative', height: 200, overflow: 'hidden', borderRadius: '20px 20px 0 0' }}>
                                                {service.imageUrls && service.imageUrls[0] ? (
                                                    <CardMedia component="img" image={service.imageUrls[0]} alt={service.name} sx={{ height: '100%', objectFit: 'cover' }} />
                                                ) : (
                                                    <Box sx={{ height: '100%', bgcolor: alpha('#009688', 0.2), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        <CartIcon sx={{ fontSize: 60, color: alpha('#009688', 0.5) }} />
                                                    </Box>
                                                )}
                                                <Chip label={service.category} size="small" sx={{
                                                    position: 'absolute',
                                                    top: 10,
                                                    left: 10,
                                                    bgcolor: alpha('#009688', 0.9),
                                                    color: 'white'
                                                }} />
                                                <IconButton onClick={() => handleFavoriteToggle(service.id)} sx={{
                                                    position: 'absolute',
                                                    top: 10,
                                                    right: 10,
                                                    bgcolor: alpha('#000000', 0.5),
                                                    '&:hover': { bgcolor: alpha('#000000', 0.8) }
                                                }}>
                                                    {favorites.has(service.id) ? <FavoriteIcon sx={{ color: '#f44336' }} /> : <FavoriteBorderIcon sx={{ color: 'white' }} />}
                                                </IconButton>
                                            </Box>

                                            <CardContent sx={{ flex: 1 }}>
                                                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>{service.name}</Typography>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                                    <PriceIcon sx={{ fontSize: 16, color: '#4CAF50' }} />
                                                    <Typography variant="body1" sx={{ color: '#4CAF50', fontWeight: 600 }}>{formatPriceAMD(service.price)}</Typography>
                                                </Box>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                                    <LocationIcon sx={{ fontSize: 16, color: alpha('#FFFFFF', 0.5) }} />
                                                    <Typography variant="body2" sx={{ color: alpha('#FFFFFF', 0.7) }}>{service.locationDisplayName || service.location}</Typography>
                                                </Box>
                                                <Typography variant="body2" sx={{ color: alpha('#FFFFFF', 0.6), mt: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                                    {service.description}
                                                </Typography>
                                            </CardContent>

                                            <CardActions sx={{ p: 2, pt: 0, gap: 1 }}>
                                                <Tooltip title="Add to Bucket">
                                                    <IconButton onClick={() => handleAddToCart(service.id)} sx={{ color: '#4CAF50' }}>
                                                        <AddCartIcon />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Inquire">
                                                    <IconButton onClick={() => handleOpenInquiry(service)} sx={{ color: '#009688' }}>
                                                        <EmailIcon />
                                                    </IconButton>
                                                </Tooltip>
                                                <Button variant="outlined" size="small" onClick={() => navigate(`/services/${service.id}`)} sx={{
                                                    ml: 'auto',
                                                    borderColor: alpha('#4CAF50', 0.5),
                                                    color: '#4CAF50',
                                                    '&:hover': { borderColor: '#4CAF50', bgcolor: alpha('#4CAF50', 0.1) }
                                                }}>
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
                                <Pagination count={totalPages} page={page + 1} onChange={(e, newPage) => setPage(newPage - 1)} sx={{
                                    '& .MuiPaginationItem-root': { color: '#FFFFFF' },
                                    '& .Mui-selected': { bgcolor: '#4CAF50 !important', color: 'white' }
                                }} />
                            </Box>
                        )}
                    </>
                )}
            </Container>

            {/* Inquiry Dialog */}
            <Dialog open={inquiryDialogOpen} onClose={() => setInquiryDialogOpen(false)} maxWidth="sm" fullWidth
                    PaperProps={{ sx: { bgcolor: '#121212', color: '#FFFFFF', borderRadius: '20px' } }}>
                <DialogTitle>
                    Inquire about {selectedService?.name}
                    <IconButton onClick={() => setInquiryDialogOpen(false)} sx={{ position: 'absolute', right: 8, top: 8, color: '#FFFFFF' }}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                        <TextField fullWidth label="Subject" value={inquiryData.subject} onChange={(e) => setInquiryData({ ...inquiryData, subject: e.target.value })} required
                                   sx={{ '& .MuiOutlinedInput-root': { bgcolor: alpha('#1A1A1A', 0.8), color: '#FFFFFF' }, '& .MuiInputLabel-root': { color: alpha('#FFFFFF', 0.7) } }} />
                        <TextField fullWidth label="Email" value={inquiryData.email} onChange={(e) => setInquiryData({ ...inquiryData, email: e.target.value })} required
                                   sx={{ '& .MuiOutlinedInput-root': { bgcolor: alpha('#1A1A1A', 0.8), color: '#FFFFFF' }, '& .MuiInputLabel-root': { color: alpha('#FFFFFF', 0.7) } }} />
                        <TextField fullWidth label="Phone Number" value={inquiryData.phone} onChange={(e) => setInquiryData({ ...inquiryData, phone: e.target.value })} required placeholder="+374 XX XXX XXX"
                                   sx={{ '& .MuiOutlinedInput-root': { bgcolor: alpha('#1A1A1A', 0.8), color: '#FFFFFF' }, '& .MuiInputLabel-root': { color: alpha('#FFFFFF', 0.7) } }} />
                        <TextField fullWidth multiline rows={4} label="Message" value={inquiryData.message} onChange={(e) => setInquiryData({ ...inquiryData, message: e.target.value })} required
                                   sx={{ '& .MuiOutlinedInput-root': { bgcolor: alpha('#1A1A1A', 0.8), color: '#FFFFFF' }, '& .MuiInputLabel-root': { color: alpha('#FFFFFF', 0.7) } }} />
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={() => setInquiryDialogOpen(false)} sx={{ color: alpha('#FFFFFF', 0.7) }}>Cancel</Button>
                    <Button onClick={handleSendInquiry} disabled={sendingInquiry} variant="contained" sx={{
                        background: 'linear-gradient(135deg, #009688, #4CAF50)',
                        '&:hover': { transform: 'translateY(-2px)' }
                    }}>
                        {sendingInquiry ? <CircularProgress size={24} /> : 'Send Inquiry'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
                <Alert severity={snackbar.severity} sx={{ bgcolor: '#121212', color: '#FFFFFF', border: `1px solid ${snackbar.severity === 'success' ? '#4CAF50' : '#f44336'}` }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default ServicesPage;