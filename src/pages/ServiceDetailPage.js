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
    Avatar
} from '@mui/material';
import {
    Favorite as FavoriteIcon,
    FavoriteBorder as FavoriteBorderIcon,
    ShoppingCart as CartIcon,
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
    AdminPanelSettings as AdminIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import serviceAPI from '../services/serviceAPI';
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

    const handleAddToCart = async () => {
        try {
            await serviceAPI.addToCart(id, 1);
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
            <Backdrop open={true} sx={{ zIndex: 9999 }}>
                <CircularProgress sx={{ color: '#4CAF50' }} />
            </Backdrop>
        );
    }

    if (!service) return null;

    return (
        <Box sx={{ minHeight: '100vh', background: '#0A0A0A', color: '#FFFFFF' }}>
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
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '80px', maxWidth: '1400px', margin: '0 auto' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => navigate('/')}>
                            <Box sx={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, #009688 0%, #4CAF50 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <LockIcon sx={{ color: 'white', fontSize: 24 }} />
                            </Box>
                            <Typography variant="h6" sx={{ fontWeight: 700, background: 'linear-gradient(135deg, #009688 0%, #4CAF50 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                VeilVision
                            </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
                            <Button onClick={() => navigate('/')} sx={{ fontWeight: 500, color: '#FFFFFF' }}>Home</Button>
                            <Button onClick={handleAboutClick} sx={{ fontWeight: 500, color: '#FFFFFF' }}>About Us</Button>
                            <Button onClick={() => navigate('/services')} sx={{ fontWeight: 500, color: '#4CAF50' }}>Services</Button>
                            {userIsAdmin && (
                                <Button onClick={handleAdminPanel} sx={{ fontWeight: 500, color: '#FF9800' }}>Admin</Button>
                            )}
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <IconButton onClick={() => navigate('/services')} sx={{ color: '#FFFFFF' }}>
                                <CartIcon />
                            </IconButton>
                            <IconButton onClick={handleMenuOpen} sx={{ color: '#FFFFFF', background: 'linear-gradient(135deg, #009688 0%, #4CAF50 100%)', width: '40px', height: '40px' }}>
                                {userInitial ? <Typography sx={{ fontWeight: 600 }}>{userInitial}</Typography> : <AccountCircleIcon />}
                            </IconButton>
                        </Box>
                    </Box>
                </Box>
            </Box>

            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}
                  PaperProps={{ sx: { bgcolor: '#121212', color: '#FFFFFF', border: '1px solid #242424', minWidth: 200 } }}>
                <MenuItem onClick={() => navigate('/profile')}><PersonIcon sx={{ mr: 2 }} />Profile</MenuItem>
                <MenuItem onClick={() => navigate('/services')}><CelebrationIcon sx={{ mr: 2 }} />Services</MenuItem>
                {userIsAdmin && (
                    <MenuItem onClick={handleAdminPanel}><AdminIcon sx={{ mr: 2 }} />Admin Panel</MenuItem>
                )}
                <Divider />
                <MenuItem onClick={handleLogout}><LogoutIcon sx={{ mr: 2 }} />Logout</MenuItem>
            </Menu>

            {/* Main Content */}
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Breadcrumbs sx={{ mb: 3, color: alpha('#FFFFFF', 0.7) }}>
                    <Link color="inherit" href="/" sx={{ cursor: 'pointer' }} onClick={() => navigate('/')}>Home</Link>
                    <Link color="inherit" href="/services" sx={{ cursor: 'pointer' }} onClick={() => navigate('/services')}>Services</Link>
                    <Typography color="#4CAF50">{service.name}</Typography>
                </Breadcrumbs>

                <Grid container spacing={4}>
                    <Grid item xs={12} md={6}>
                        <Card sx={{ background: alpha('#1A1A1A', 0.8), borderRadius: '20px', overflow: 'hidden' }}>
                            <Box sx={{ height: 400, bgcolor: alpha('#009688', 0.1), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {service.imageUrls && service.imageUrls[selectedImage] ? (
                                    <img src={service.imageUrls[selectedImage]} alt={service.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                ) : (
                                    <CartIcon sx={{ fontSize: 100, color: alpha('#009688', 0.3) }} />
                                )}
                            </Box>
                            {service.imageUrls && service.imageUrls.length > 1 && (
                                <Box sx={{ display: 'flex', gap: 1, p: 2, overflowX: 'auto' }}>
                                    {service.imageUrls.map((img, idx) => (
                                        <Box key={idx} onClick={() => setSelectedImage(idx)} sx={{
                                            width: 80, height: 80, borderRadius: '8px', overflow: 'hidden', cursor: 'pointer',
                                            border: selectedImage === idx ? `2px solid #4CAF50` : `1px solid ${alpha('#FFFFFF', 0.2)}`
                                        }}>
                                            <img src={img} alt={`${service.name} ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        </Box>
                                    ))}
                                </Box>
                            )}
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                <Typography variant="h4" sx={{ fontWeight: 700 }}>{service.name}</Typography>
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    <Tooltip title={isFavorited ? "Remove from favorites" : "Add to favorites"}>
                                        <IconButton onClick={handleFavoriteToggle} sx={{ bgcolor: alpha('#1A1A1A', 0.8), '&:hover': { bgcolor: alpha('#f44336', 0.2) } }}>
                                            {isFavorited ? <FavoriteIcon sx={{ color: '#f44336' }} /> : <FavoriteBorderIcon />}
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Add to bucket">
                                        <IconButton onClick={handleAddToCart} sx={{ bgcolor: alpha('#1A1A1A', 0.8), '&:hover': { bgcolor: alpha('#4CAF50', 0.2) } }}>
                                            <CartIcon />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Inquire about this service">
                                        <IconButton onClick={handleOpenInquiry} sx={{ bgcolor: alpha('#1A1A1A', 0.8), '&:hover': { bgcolor: alpha('#009688', 0.2) } }}>
                                            <EmailIcon />
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                            </Box>

                            <Chip label={service.category} sx={{ bgcolor: '#009688', color: 'white', mb: 2 }} />
                            <Typography variant="caption" sx={{ display: 'block', color: alpha('#FFFFFF', 0.5), mb: 2 }}>
                                {favoriteCount} {favoriteCount === 1 ? 'person likes this' : 'people like this'}
                            </Typography>

                            <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <PriceIcon sx={{ color: '#4CAF50' }} />
                                    <Typography variant="h5" sx={{ color: '#4CAF50', fontWeight: 600 }}>{formatPriceAMD(service.price)}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <LocationIcon sx={{ color: alpha('#FFFFFF', 0.7) }} />
                                    <Typography sx={{ color: alpha('#FFFFFF', 0.8) }}>{service.locationDisplayName || service.location}</Typography>
                                </Box>
                                {service.duration && (
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <TimeIcon sx={{ color: alpha('#FFFFFF', 0.7) }} />
                                        <Typography sx={{ color: alpha('#FFFFFF', 0.8) }}>{service.duration} hours</Typography>
                                    </Box>
                                )}
                                {service.maxParticipants && (
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <PeopleIcon sx={{ color: alpha('#FFFFFF', 0.7) }} />
                                        <Typography sx={{ color: alpha('#FFFFFF', 0.8) }}>Up to {service.maxParticipants} people</Typography>
                                    </Box>
                                )}
                            </Box>

                            <Divider sx={{ borderColor: alpha('#FFFFFF', 0.1), my: 3 }} />

                            <Typography variant="h6" sx={{ mb: 2 }}>Description</Typography>
                            <Typography sx={{ color: alpha('#FFFFFF', 0.8), lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
                                {service.description}
                            </Typography>

                            {service.tags && (
                                <>
                                    <Divider sx={{ borderColor: alpha('#FFFFFF', 0.1), my: 3 }} />
                                    <Typography variant="h6" sx={{ mb: 2 }}>Tags</Typography>
                                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                        {service.tags.split(',').map((tag, idx) => (
                                            <Chip key={idx} label={tag.trim()} size="small" sx={{ bgcolor: alpha('#009688', 0.2), color: '#009688' }} />
                                        ))}
                                    </Box>
                                </>
                            )}
                        </Box>
                    </Grid>
                </Grid>

                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 5 }}>
                    <Button variant="contained" onClick={handleAddToCart} startIcon={<CartIcon />} sx={{
                        background: 'linear-gradient(135deg, #4CAF50, #2E7D32)',
                        padding: '12px 32px',
                        borderRadius: '30px',
                        '&:hover': { transform: 'translateY(-2px)' }
                    }}>
                        Add to Bucket
                    </Button>
                    <Button variant="outlined" onClick={handleOpenInquiry} startIcon={<EmailIcon />} sx={{
                        borderColor: '#009688',
                        color: '#009688',
                        padding: '12px 32px',
                        borderRadius: '30px',
                        '&:hover': { borderColor: '#4CAF50', color: '#4CAF50' }
                    }}>
                        Inquire Now
                    </Button>
                </Box>
            </Container>

            {/* Inquiry Dialog */}
            <Dialog open={inquiryDialogOpen} onClose={() => setInquiryDialogOpen(false)} maxWidth="sm" fullWidth
                    PaperProps={{ sx: { bgcolor: '#121212', color: '#FFFFFF', borderRadius: '20px' } }}>
                <DialogTitle>
                    Inquire about {service?.name}
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

export default ServiceDetailPage;