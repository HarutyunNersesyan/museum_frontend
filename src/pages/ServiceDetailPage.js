// src/pages/ServiceDetailPage.js - Without cart functionality

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container,
    Typography,
    Box,
    Button,
    IconButton,
    Chip,
    Grid,
    Card,
    CardContent,
    CardMedia,
    CardActions,
    Divider,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    CircularProgress,
    Alert,
    Snackbar,
    Breadcrumbs,
    Link,
    Tooltip,
    Backdrop,
    Menu,
    MenuItem,
    Avatar,
    Paper,
    Fade
} from '@mui/material';
import {
    Favorite as FavoriteIcon,
    FavoriteBorder as FavoriteBorderIcon,
    Email as EmailIcon,
    LocationOn as LocationIcon,
    AttachMoney as PriceIcon,
    AccessTime as TimeIcon,
    People as PeopleIcon,
    Close as CloseIcon,
    AccountCircle as AccountCircleIcon,
    Logout as LogoutIcon,
    Person as PersonIcon,
    Lock as LockIcon,
    Celebration as CelebrationIcon,
    AdminPanelSettings as AdminIcon,
    Event as EventIcon,
    Star as StarIcon,
    Share as ShareIcon,
    CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import serviceAPI from '../services/serviceAPI';
import { alpha } from '@mui/material/styles';
import { isAdmin } from '../utils/jwtUtils';
import dayjs from 'dayjs';

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
    try {
        const parsed = dayjs(dateString);
        if (parsed.isValid()) {
            return parsed.format('MMMM D, YYYY');
        }
        return dateString;
    } catch (error) {
        console.error('Error formatting date:', error);
        return dateString;
    }
};

const formatTime = (timeString) => {
    if (!timeString) return null;

    try {
        if (typeof timeString === 'string') {
            if (timeString.includes(':')) {
                const parsed = dayjs(timeString, 'HH:mm');
                if (parsed.isValid()) {
                    return parsed.format('HH:mm');
                }
            }
            return timeString;
        }
        if (Array.isArray(timeString) && timeString.length >= 2) {
            return `${String(timeString[0]).padStart(2, '0')}:${String(timeString[1]).padStart(2, '0')}`;
        }
        if (typeof timeString === 'object' && timeString !== null) {
            if (timeString.hour !== undefined && timeString.minute !== undefined) {
                return `${String(timeString.hour).padStart(2, '0')}:${String(timeString.minute).padStart(2, '0')}`;
            }
        }
        const parsed = dayjs(timeString);
        if (parsed.isValid()) {
            return parsed.format('HH:mm');
        }
        return String(timeString);
    } catch (error) {
        console.error('Error formatting time:', error);
        return timeString;
    }
};

const ServiceDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const [service, setService] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isFavorited, setIsFavorited] = useState(false);
    const [favoriteCount, setFavoriteCount] = useState(0);
    const [inquiryDialogOpen, setInquiryDialogOpen] = useState(false);
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
    const [selectedImage, setSelectedImage] = useState(0);
    const [userIsAdmin, setUserIsAdmin] = useState(false);
    const [backgroundPosition, setBackgroundPosition] = useState({ x: 0, y: 0 });

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
        loadService();
        checkFavorite();
        getFavoriteCount();
    }, [id]);

    useEffect(() => {
        const handleMouseMove = (e) => {
            const x = e.clientX / window.innerWidth;
            const y = e.clientY / window.innerHeight;
            setBackgroundPosition({ x, y });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const loadService = async () => {
        setLoading(true);
        try {
            const response = await serviceAPI.getServiceById(id);
            setService(response.data);
        } catch (error) {
            console.error('Error loading service:', error);
            setSnackbar({
                open: true,
                message: 'Service not found',
                severity: 'error'
            });
            setTimeout(() => navigate('/services'), 2000);
        } finally {
            setLoading(false);
        }
    };

    const checkFavorite = async () => {
        try {
            const response = await serviceAPI.isFavorited(id);
            setIsFavorited(response.data);
        } catch (error) {
            console.error('Error checking favorite:', error);
        }
    };

    const getFavoriteCount = async () => {
        try {
            const response = await serviceAPI.getFavoriteCount(id);
            setFavoriteCount(response.data);
        } catch (error) {
            console.error('Error getting favorite count:', error);
        }
    };

    const handleFavoriteToggle = async () => {
        try {
            if (isFavorited) {
                await serviceAPI.removeFromFavorites(id);
                setIsFavorited(false);
                setFavoriteCount(prev => prev - 1);
                setSnackbar({
                    open: true,
                    message: 'Removed from favorites',
                    severity: 'info'
                });
            } else {
                await serviceAPI.addToFavorites(id);
                setIsFavorited(true);
                setFavoriteCount(prev => prev + 1);
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

    const handleOpenInquiry = () => {
        setInquiryData({
            subject: `Inquiry about ${service?.name}`,
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
            await serviceAPI.sendInquiry(id, inquiryData);
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

    const handleAboutClick = () => navigate('/about');
    const handleAdminPanel = () => navigate('/admin/dashboard');

    if (loading) {
        return (
            <Backdrop open={true} sx={{ zIndex: 9999, backgroundColor: 'rgba(255,255,255,0.9)' }}>
                <CircularProgress sx={{ color: '#FF6B35' }} />
            </Backdrop>
        );
    }

    if (!service) return null;

    const formattedStartTime = formatTime(service.startTime);
    const formattedStartDate = formatDate(service.startDate);

    return (
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
                    radial-gradient(circle at ${backgroundPosition.x * 100}% ${backgroundPosition.y * 100}%, rgba(255,107,53,0.08) 0%, transparent 50%),
                    radial-gradient(circle at ${100 - backgroundPosition.x * 100}% ${100 - backgroundPosition.y * 100}%, rgba(255,193,7,0.08) 0%, transparent 50%)
                `,
                transition: 'background 0.3s ease-out'
            }} />

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
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '70px', maxWidth: '1400px', margin: '0 auto' }}>
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
                                color: '#FFFFFF',
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

            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}
                  PaperProps={{ sx: { bgcolor: '#FFFFFF', color: '#1A1A1A', border: '1px solid #E0E0E0', minWidth: 200, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' } }}>
                <MenuItem onClick={() => navigate('/profile')}><PersonIcon sx={{ mr: 2, color: '#FF6B35' }} />Profile</MenuItem>
                <MenuItem onClick={() => navigate('/services')}><CelebrationIcon sx={{ mr: 2, color: '#FF6B35' }} />Services</MenuItem>
                {userIsAdmin && (
                    <MenuItem onClick={handleAdminPanel}><AdminIcon sx={{ mr: 2, color: '#FF9800' }} />Admin Panel</MenuItem>
                )}
                <Divider />
                <MenuItem onClick={handleLogout}><LogoutIcon sx={{ mr: 2, color: '#FF6B35' }} />Logout</MenuItem>
            </Menu>

            {/* Main Content */}
            <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, py: 5 }}>
                <Breadcrumbs sx={{ mb: 4, color: '#8A8A8A' }}>
                    <Link color="inherit" href="/" sx={{ cursor: 'pointer', textDecoration: 'none', '&:hover': { color: '#FF6B35' } }} onClick={() => navigate('/')}>Home</Link>
                    <Link color="inherit" href="/services" sx={{ cursor: 'pointer', textDecoration: 'none', '&:hover': { color: '#FF6B35' } }} onClick={() => navigate('/services')}>Services</Link>
                    <Typography color="#FF6B35" fontWeight={500}>{service.name}</Typography>
                </Breadcrumbs>

                <Grid container spacing={4}>
                    {/* Image Gallery */}
                    <Grid item xs={12} md={6}>
                        <Fade in={true} timeout={500}>
                            <Paper elevation={0} sx={{
                                background: '#FFFFFF',
                                borderRadius: '24px',
                                overflow: 'hidden',
                                boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
                                border: '1px solid rgba(0,0,0,0.05)'
                            }}>
                                <Box sx={{
                                    height: 420,
                                    bgcolor: '#FAF6F0',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    position: 'relative'
                                }}>
                                    {service.imageUrls && service.imageUrls[selectedImage] ? (
                                        <img src={service.imageUrls[selectedImage]} alt={service.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                    ) : (
                                        <CelebrationIcon sx={{ fontSize: 100, color: alpha('#FF6B35', 0.2) }} />
                                    )}
                                </Box>
                                {service.imageUrls && service.imageUrls.length > 1 && (
                                    <Box sx={{ display: 'flex', gap: 1.5, p: 2, overflowX: 'auto', bgcolor: '#FAF6F0' }}>
                                        {service.imageUrls.map((img, idx) => (
                                            <Box key={idx} onClick={() => setSelectedImage(idx)} sx={{
                                                width: 85, height: 85, borderRadius: '12px', overflow: 'hidden', cursor: 'pointer',
                                                border: selectedImage === idx ? `2px solid #FF6B35` : `1px solid rgba(0,0,0,0.1)`,
                                                transition: 'all 0.2s ease',
                                                '&:hover': { transform: 'scale(1.05)' }
                                            }}>
                                                <img src={img} alt={`${service.name} ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            </Box>
                                        ))}
                                    </Box>
                                )}
                            </Paper>
                        </Fade>
                    </Grid>

                    {/* Service Info */}
                    <Grid item xs={12} md={6}>
                        <Fade in={true} timeout={500} delay={200}>
                            <Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                    <Typography variant="h3" sx={{
                                        fontWeight: 800,
                                        fontSize: { xs: '28px', md: '36px' },
                                        background: 'linear-gradient(135deg, #2C2C2C 0%, #4A4A4A 100%)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        letterSpacing: '-0.5px'
                                    }}>
                                        {service.name}
                                    </Typography>
                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        <Tooltip title={isFavorited ? "Remove from favorites" : "Add to favorites"}>
                                            <IconButton onClick={handleFavoriteToggle} sx={{
                                                bgcolor: '#FFFFFF',
                                                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                                                '&:hover': { bgcolor: '#FFF5F0' }
                                            }}>
                                                {isFavorited ? <FavoriteIcon sx={{ color: '#FF6B35' }} /> : <FavoriteBorderIcon sx={{ color: '#8A8A8A' }} />}
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Share">
                                            <IconButton sx={{ bgcolor: '#FFFFFF', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                                                <ShareIcon sx={{ color: '#8A8A8A' }} />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                </Box>

                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, flexWrap: 'wrap' }}>
                                    <Chip label={service.category} sx={{
                                        bgcolor: alpha('#FF6B35', 0.1),
                                        color: '#FF6B35',
                                        fontWeight: 500,
                                        borderRadius: '12px'
                                    }} />
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                        <StarIcon sx={{ fontSize: 18, color: '#FFB347' }} />
                                        <Typography variant="body2" sx={{ color: '#6A6A6A' }}>4.9 (128 reviews)</Typography>
                                    </Box>
                                    <Typography variant="caption" sx={{ color: '#9A9A9A' }}>
                                        ❤️ {favoriteCount} {favoriteCount === 1 ? 'person likes this' : 'people like this'}
                                    </Typography>
                                </Box>

                                {/* Price Card */}
                                <Paper elevation={0} sx={{
                                    p: 2.5,
                                    bgcolor: alpha('#FF6B35', 0.05),
                                    borderRadius: '20px',
                                    mb: 3,
                                    border: `1px solid ${alpha('#FF6B35', 0.15)}`
                                }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                            <Box sx={{
                                                width: 48,
                                                height: 48,
                                                borderRadius: '16px',
                                                bgcolor: '#FFFFFF',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}>
                                                <PriceIcon sx={{ color: '#FF6B35', fontSize: 28 }} />
                                            </Box>
                                            <Box>
                                                <Typography variant="caption" sx={{ color: '#8A8A8A' }}>Price</Typography>
                                                <Typography variant="h4" sx={{ color: '#FF6B35', fontWeight: 700, lineHeight: 1 }}>
                                                    {formatPriceAMD(service.price)}
                                                </Typography>
                                            </Box>
                                        </Box>
                                        <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', sm: 'block' } }} />
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                            <Box sx={{
                                                width: 48,
                                                height: 48,
                                                borderRadius: '16px',
                                                bgcolor: '#FFFFFF',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}>
                                                <LocationIcon sx={{ color: '#FF6B35', fontSize: 28 }} />
                                            </Box>
                                            <Box>
                                                <Typography variant="caption" sx={{ color: '#8A8A8A' }}>Location</Typography>
                                                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                                    {service.locationDisplayName || service.location}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Box>
                                </Paper>

                                {/* Details Grid */}
                                <Grid container spacing={2} sx={{ mb: 3 }}>
                                    {service.duration && (
                                        <Grid item xs={6}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1.5, bgcolor: '#FFFFFF', borderRadius: '16px' }}>
                                                <TimeIcon sx={{ color: '#FFB347' }} />
                                                <Box>
                                                    <Typography variant="caption" sx={{ color: '#8A8A8A', display: 'block' }}>Duration</Typography>
                                                    <Typography variant="body2" fontWeight={500}>{service.duration} {service.duration === 1 ? 'hour' : 'hours'}</Typography>
                                                </Box>
                                            </Box>
                                        </Grid>
                                    )}
                                    {service.maxParticipants && (
                                        <Grid item xs={6}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1.5, bgcolor: '#FFFFFF', borderRadius: '16px' }}>
                                                <PeopleIcon sx={{ color: '#FFB347' }} />
                                                <Box>
                                                    <Typography variant="caption" sx={{ color: '#8A8A8A', display: 'block' }}>Capacity</Typography>
                                                    <Typography variant="body2" fontWeight={500}>Up to {service.maxParticipants} people</Typography>
                                                </Box>
                                            </Box>
                                        </Grid>
                                    )}
                                    {service.startDate && (
                                        <Grid item xs={12}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1.5, bgcolor: '#FFFFFF', borderRadius: '16px' }}>
                                                <EventIcon sx={{ color: '#FFB347' }} />
                                                <Box>
                                                    <Typography variant="caption" sx={{ color: '#8A8A8A', display: 'block' }}>Start Date & Time</Typography>
                                                    <Typography variant="body2" fontWeight={500}>
                                                        {formattedStartDate}
                                                        {formattedStartTime && ` at ${formattedStartTime}`}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </Grid>
                                    )}
                                </Grid>

                                <Divider sx={{ my: 3, borderColor: '#E8E0D8' }} />

                                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5, color: '#2C2C2C' }}>Description</Typography>
                                <Typography sx={{ color: '#6A6A6A', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
                                    {service.description}
                                </Typography>

                                {service.tags && (
                                    <>
                                        <Divider sx={{ my: 3, borderColor: '#E8E0D8' }} />
                                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5, color: '#2C2C2C' }}>Tags</Typography>
                                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                            {service.tags.split(',').map((tag, idx) => (
                                                <Chip key={idx} label={tag.trim()} size="small" sx={{
                                                    bgcolor: alpha('#FF6B35', 0.08),
                                                    color: '#FF6B35',
                                                    borderRadius: '10px'
                                                }} />
                                            ))}
                                        </Box>
                                    </>
                                )}
                            </Box>
                        </Fade>
                    </Grid>
                </Grid>

                {/* Action Buttons - Without Add to Bucket */}
                <Fade in={true} timeout={500} delay={400}>
                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 6 }}>
                        <Button
                            variant="contained"
                            onClick={handleOpenInquiry}
                            startIcon={<EmailIcon />}
                            sx={{
                                background: 'linear-gradient(135deg, #FF6B35 0%, #FFB347 100%)',
                                padding: '14px 40px',
                                borderRadius: '40px',
                                fontSize: '16px',
                                fontWeight: 600,
                                textTransform: 'none',
                                boxShadow: '0 8px 20px rgba(255,107,53,0.25)',
                                '&:hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 12px 28px rgba(255,107,53,0.35)'
                                }
                            }}
                        >
                            Inquire Now
                        </Button>
                    </Box>
                </Fade>

                {/* Suggested Services Section */}
                <Box sx={{ mt: 8 }}>
                    <Divider sx={{ mb: 4, borderColor: '#E8E0D8' }}>
                        <Typography variant="body2" sx={{ color: '#8A8A8A', px: 2 }}>You might also like</Typography>
                    </Divider>
                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, textAlign: 'center', color: '#2C2C2C' }}>
                        Similar Services
                    </Typography>
                    <Typography variant="body2" sx={{ textAlign: 'center', color: '#8A8A8A', mb: 4 }}>
                        Discover more amazing experiences in Armenia
                    </Typography>
                    <Grid container spacing={3}>
                        {[1, 2, 3].map((item) => (
                            <Grid item xs={12} sm={6} md={4} key={item}>
                                <Card sx={{
                                    borderRadius: '20px',
                                    bgcolor: '#FFFFFF',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                                    transition: 'all 0.3s ease',
                                    cursor: 'pointer',
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        boxShadow: '0 12px 24px rgba(0,0,0,0.1)'
                                    }
                                }}>
                                    <Box sx={{ height: 180, bgcolor: '#FAF6F0', borderRadius: '20px 20px 0 0' }} />
                                    <CardContent>
                                        <Typography variant="subtitle1" fontWeight={600}>Suggested Service {item}</Typography>
                                        <Typography variant="body2" color="#8A8A8A">Discover amazing experiences</Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </Container>

            {/* Inquiry Dialog */}
            <Dialog open={inquiryDialogOpen} onClose={() => setInquiryDialogOpen(false)} maxWidth="sm" fullWidth
                    PaperProps={{ sx: { bgcolor: '#FFFFFF', borderRadius: '24px', boxShadow: '0 24px 48px rgba(0,0,0,0.15)' } }}>
                <DialogTitle sx={{ borderBottom: '1px solid #F0E8E0', pb: 2 }}>
                    <Typography variant="h6" fontWeight={700}>Inquire about {service?.name}</Typography>
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
                    <Button onClick={() => setInquiryDialogOpen(false)} sx={{ color: '#8A8A8A', borderRadius: '30px', px: 3 }}>
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
    );
};

export default ServiceDetailPage;