// src/pages/FavoritesPage.js

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Typography,
    Box,
    Grid,
    Button,
    IconButton,
    Chip,
    Pagination,
    Skeleton,
    Alert,
    Snackbar,
    Menu,
    MenuItem,
    Divider,
    CircularProgress,
    Tooltip,
    Backdrop,
    Fade,
    Grow,
    Avatar,
    GlobalStyles
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
    Image as ImageIcon,
    Category as CategoryIcon,
    Whatshot as WhatshotIcon,
    ChevronLeft as ChevronLeftIcon,
    ChevronRight as ChevronRightIcon,
    Bookmark as BookmarkIcon,
    BookmarkBorder as BookmarkBorderIcon,
    Email as EmailIcon,
    Phone as PhoneIcon,
    Language as LanguageIcon,
    Facebook as FacebookIcon,
    Instagram as InstagramIcon,
    YouTube as YouTubeIcon,
    LinkedIn as LinkedInIcon,
    Info as InfoIcon,
    HowToReg as HowToRegIcon
} from '@mui/icons-material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { useAuth } from '../context/AuthContext';
import serviceAPI from '../services/serviceAPI';
import { alpha, styled } from '@mui/material/styles';

// Styled components
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

const FavoritesPage = () => {
    const navigate = useNavigate();
    const { user, logout, isAdmin } = useAuth();

    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });
    const [anchorEl, setAnchorEl] = useState(null);
    const [activeImageIndex, setActiveImageIndex] = useState({});

    useEffect(() => {
        loadFavorites();
    }, [page]);

    const loadFavorites = async () => {
        setLoading(true);
        try {
            const response = await serviceAPI.getFavorites(page, 10);
            setFavorites(response.data.content);
            setTotalPages(response.data.totalPages);
            setTotalElements(response.data.totalElements);
        } catch (error) {
            console.error('Error loading favorites:', error);
            setSnackbar({
                open: true,
                message: 'Failed to load favorites',
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveFavorite = async (serviceId, e) => {
        e.stopPropagation();
        try {
            await serviceAPI.removeFromFavorites(serviceId);

            setFavorites(prev => prev.filter(service => service.id !== serviceId));
            setTotalElements(prev => prev - 1);

            setSnackbar({
                open: true,
                message: 'Removed from favorites',
                severity: 'info'
            });
        } catch (error) {
            console.error('Error removing favorite:', error);
            setSnackbar({
                open: true,
                message: 'Failed to remove from favorites',
                severity: 'error'
            });
        }
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

    const handleProfile = () => {
        handleMenuClose();
        navigate('/profile');
    };

    const handleAdminPanel = () => {
        handleMenuClose();
        navigate('/admin/dashboard');
    };

    const handleAboutClick = () => {
        navigate('/about');
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

    const userInitial = user?.userName ? user.userName.charAt(0).toUpperCase() : '';

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
            case 'FACEBOOK': return <FacebookIcon sx={{ fontSize: 16, color: '#1877F2' }} />;
            case 'INSTAGRAM': return <InstagramIcon sx={{ fontSize: 16, color: '#E4405F' }} />;
            case 'YOUTUBE': return <YouTubeIcon sx={{ fontSize: 16, color: '#FF0000' }} />;
            case 'LINKEDIN': return <LinkedInIcon sx={{ fontSize: 16, color: '#0077B5' }} />;
            default: return <LanguageIcon sx={{ fontSize: 16, color: '#FF6B35' }} />;
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
                                    sx={{ fontWeight: 500, color: '#4A4A4A', '&:hover': { color: '#FF6B35' } }}
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
                                                {totalElements > 0 && (
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
                                                        {totalElements > 99 ? '99+' : totalElements}
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
                    {/* Header Section */}
                    <Fade in={true} timeout={500}>
                        <Box sx={{ textAlign: 'center', mb: 5 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 2 }}>
                                <BookmarkIcon sx={{ fontSize: 48, color: '#FF6B35' }} />
                                <Typography variant="h1" sx={{
                                    fontSize: { xs: '36px', md: '48px' },
                                    fontWeight: 800,
                                    background: 'linear-gradient(135deg, #FF6B35 0%, #FFB347 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    letterSpacing: '-1px'
                                }}>
                                    Saved Services
                                </Typography>
                            </Box>
                            <Typography variant="h6" sx={{ color: '#8A99A8', maxWidth: '600px', mx: 'auto' }}>
                                Your collection of favorite services and events
                            </Typography>
                        </Box>
                    </Fade>

                    {/* Results Count */}
                    {!loading && favorites.length > 0 && (
                        <Box sx={{ mb: 3 }}>
                            <Typography sx={{ color: '#8A99A8' }}>
                                You have <strong style={{ color: '#FF6B35' }}>{totalElements}</strong> saved {totalElements === 1 ? 'service' : 'services'}
                            </Typography>
                        </Box>
                    )}

                    {/* Favorites Grid */}
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
                    ) : favorites.length === 0 ? (
                        <Box sx={{ textAlign: 'center', py: 8 }}>
                            <BookmarkBorderIcon sx={{ fontSize: 80, color: '#D0D5DD', mb: 2 }} />
                            <Typography variant="h5" sx={{ color: '#1A2733', fontWeight: 600, mb: 1 }}>
                                No saved services yet
                            </Typography>
                            <Typography variant="body1" sx={{ color: '#8A99A8', mb: 3 }}>
                                Start exploring services and click the 🔥 button to save your favorites
                            </Typography>
                            <Button
                                variant="contained"
                                onClick={() => navigate('/services')}
                                sx={{
                                    fontWeight: 600,
                                    borderRadius: '40px',
                                    background: 'linear-gradient(135deg, #FF6B35 0%, #FFB347 100%)',
                                    boxShadow: '0 4px 12px rgba(255,107,53,0.25)',
                                    px: 4,
                                    py: 1.5,
                                    '&:hover': {
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 6px 16px rgba(255,107,53,0.35)'
                                    }
                                }}
                            >
                                Browse Services
                            </Button>
                        </Box>
                    ) : (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                            {favorites.map((service, index) => {
                                const eventDate = formatEventDate(service.startDate, service.startTime);
                                const images = service.imageUrls || [];
                                const currentIndex = activeImageIndex[service.id] || 0;

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
                                                            <Box sx={{
                                                                display: 'flex',
                                                                alignItems: 'flex-start',
                                                                justifyContent: 'space-between',
                                                                mb: 2,
                                                                flexWrap: 'wrap',
                                                                gap: 2
                                                            }}>
                                                                <Typography variant="h5" sx={{
                                                                    fontWeight: 700,
                                                                    color: '#1A2733',
                                                                    fontSize: { xs: '1.3rem', sm: '1.5rem', md: '1.8rem' },
                                                                    lineHeight: 1.2
                                                                }}>
                                                                    {service.name}
                                                                </Typography>
                                                                <Tooltip title="Remove from saved">
                                                                    <IconButton
                                                                        onClick={(e) => handleRemoveFavorite(service.id, e)}
                                                                        sx={{
                                                                            bgcolor: 'transparent',
                                                                            p: 0,
                                                                            '&:hover': {
                                                                                bgcolor: 'transparent',
                                                                                transform: 'scale(1.05)'
                                                                            }
                                                                        }}
                                                                    >
                                                                        <WhatshotIcon sx={{ color: '#FF6B35', fontSize: 28 }} />
                                                                    </IconButton>
                                                                </Tooltip>
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

                                                            {/* Contact Information Section */}
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
                                            {index < favorites.length - 1 && <Divider sx={{ borderColor: '#E8ECF0' }} />}
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

export default FavoritesPage;