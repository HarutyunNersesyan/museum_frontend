import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Typography,
    Box,
    Grid,
    Card,
    CardContent,
    Button,
    IconButton,
    Avatar,
    Menu,
    MenuItem,
    Divider,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Alert,
    Snackbar,
    CircularProgress,
    Tabs,
    Tab,
    Switch,
    FormControlLabel,
    InputAdornment,
    Tooltip,
    Backdrop,
    FormControl,
    InputLabel,
    Select,
    ImageList,
    ImageListItem,
    Fade,
    Grow,
    Zoom,
    Slide
} from '@mui/material';
import {
    Dashboard as DashboardIcon,
    Celebration as CelebrationIcon,
    Email as EmailIcon,
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Visibility as VisibilityIcon,
    Close as CloseIcon,
    Image as ImageIcon,
    Category as CategoryIcon,
    LocationOn as LocationIcon,
    AttachMoney as PriceIcon,
    Reply as ReplyIcon,
    Logout as LogoutIcon,
    Person as PersonIcon,
    AdminPanelSettings as AdminIcon,
    CheckCircle as CheckCircleIcon,
    Cancel as CancelIcon,
    Save as SaveIcon,
    CloudUpload as UploadIcon,
    DeleteOutline as DeleteOutlineIcon,
    TrendingUp as TrendingUpIcon,
    Star as StarIcon,
    AccessTime as AccessTimeIcon,
    ShoppingBag as ShoppingBagIcon,
    Build as BuildIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { alpha, styled } from '@mui/material/styles';
import adminAPI from '../services/adminAPI';
import { isAdmin } from '../utils/jwtUtils';
import { formatPriceAMD } from '../services/serviceAPI';

// Styled components for modern design
const GlassCard = styled(Card)(({ theme }) => ({
    background: 'rgba(18, 18, 18, 0.8)',
    backdropFilter: 'blur(10px)',
    borderRadius: '24px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    transition: 'all 0.3s ease',
    '&:hover': {
        transform: 'translateY(-5px)',
        borderColor: 'rgba(255, 152, 0, 0.3)',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
    }
}));

const GradientButton = styled(Button)(({ theme }) => ({
    background: 'linear-gradient(135deg, #FF9800 0%, #FF5722 100%)',
    borderRadius: '12px',
    padding: '10px 24px',
    fontWeight: 600,
    textTransform: 'none',
    transition: 'all 0.3s ease',
    '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 8px 25px rgba(255, 152, 0, 0.4)'
    }
}));

const StatCard = styled(Paper)(({ theme, color }) => ({
    background: `linear-gradient(135deg, ${color}20 0%, ${color}05 100%)`,
    backdropFilter: 'blur(10px)',
    borderRadius: '20px',
    padding: '20px',
    border: `1px solid ${color}40`,
    transition: 'all 0.3s ease',
    '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: `0 15px 35px ${color}20`
    }
}));

// Armenian cities
const ARMENIAN_CITIES = [
    { value: 'YEREVAN', label: 'Yerevan', region: 'Central' },
    { value: 'GYUMRI', label: 'Gyumri', region: 'Shirak' },
    { value: 'VANADZOR', label: 'Vanadzor', region: 'Lori' },
    { value: 'VAGHARSHAPAT', label: 'Vagharshapat', region: 'Armavir' },
    { value: 'ABOVYAN', label: 'Abovyan', region: 'Kotayk' },
    { value: 'KAPAN', label: 'Kapan', region: 'Syunik' },
    { value: 'HRAZDAN', label: 'Hrazdan', region: 'Kotayk' },
    { value: 'ARMAVIR', label: 'Armavir', region: 'Armavir' },
    { value: 'ARTASHAT', label: 'Artashat', region: 'Ararat' },
    { value: 'IJEVAN', label: 'Ijevan', region: 'Tavush' },
    { value: 'GAVAR', label: 'Gavar', region: 'Gegharkunik' },
    { value: 'GORIS', label: 'Goris', region: 'Syunik' },
    { value: 'CHARENTSAVAN', label: 'Charentsavan', region: 'Kotayk' },
    { value: 'ARARAT', label: 'Ararat', region: 'Ararat' },
    { value: 'MASIS', label: 'Masis', region: 'Ararat' },
    { value: 'SEVAN', label: 'Sevan', region: 'Gegharkunik' },
    { value: 'ASHTARAK', label: 'Ashtarak', region: 'Aragatsotn' },
    { value: 'DILIJAN', label: 'Dilijan', region: 'Tavush' },
    { value: 'SISIAN', label: 'Sisian', region: 'Syunik' },
    { value: 'ALAVERDI', label: 'Alaverdi', region: 'Lori' },
    { value: 'STEPANAVAN', label: 'Stepanavan', region: 'Lori' },
    { value: 'MARTUNI', label: 'Martuni', region: 'Gegharkunik' },
    { value: 'VARDENIS', label: 'Vardenis', region: 'Gegharkunik' },
    { value: 'YEGHVARD', label: 'Yeghvard', region: 'Kotayk' },
    { value: 'METSAMOR', label: 'Metsamor', region: 'Armavir' },
    { value: 'BERD', label: 'Berd', region: 'Tavush' },
    { value: 'TASHIR', label: 'Tashir', region: 'Lori' },
    { value: 'APARAN', label: 'Aparan', region: 'Aragatsotn' },
    { value: 'VAYK', label: 'Vayk', region: 'Vayots Dzor' },
    { value: 'JERMUK', label: 'Jermuk', region: 'Vayots Dzor' }
];

const AdminDashboardPage = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState(0);
    const [services, setServices] = useState([]);
    const [inquiries, setInquiries] = useState([]);
    const [stats, setStats] = useState({
        totalServices: 0,
        availableServices: 0,
        pendingInquiries: 0
    });
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingService, setEditingService] = useState(null);
    const [selectedInquiry, setSelectedInquiry] = useState(null);
    const [inquiryDialogOpen, setInquiryDialogOpen] = useState(false);
    const [responseText, setResponseText] = useState('');
    const [sendingResponse, setSendingResponse] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [anchorEl, setAnchorEl] = useState(null);
    const [userInitial, setUserInitial] = useState('');
    const [backgroundPosition, setBackgroundPosition] = useState({ x: 0, y: 0 });

    const [imageFiles, setImageFiles] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [existingImages, setExistingImages] = useState([]);
    const fileInputRef = useRef(null);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: '',
        location: '',
        duration: '',
        maxParticipants: '',
        tags: ''
    });

    const categories = [
        { value: 'PARTY', label: '🎉 Party / Celebration', icon: '🎉' },
        { value: 'BIRTHDAY', label: '🎂 Birthday Party', icon: '🎂' },
        { value: 'ENTERTAINMENT', label: '🎬 Entertainment', icon: '🎬' },
        { value: 'CATERING', label: '🍽️ Catering Services', icon: '🍽️' },
        { value: 'DECORATION', label: '🎨 Decoration', icon: '🎨' },
        { value: 'PHOTOGRAPHY', label: '📸 Photography', icon: '📸' },
        { value: 'MUSIC', label: '🎵 Music / DJ', icon: '🎵' },
        { value: 'VENUE', label: '🏛️ Venue Rental', icon: '🏛️' },
        { value: 'OTHER', label: '✨ Other Services', icon: '✨' }
    ];

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token || !isAdmin(token)) {
            navigate('/admin/auth');
            return;
        }

        if (user && user.userName) {
            setUserInitial(user.userName.charAt(0).toUpperCase());
        }

        loadData();

        const handleMouseMove = (e) => {
            const x = e.clientX / window.innerWidth;
            const y = e.clientY / window.innerHeight;
            setBackgroundPosition({ x, y });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [user, page]);

    const loadData = async () => {
        setLoading(true);
        try {
            await Promise.all([
                loadServices(),
                loadInquiries(),
                loadStats()
            ]);
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadServices = async () => {
        try {
            const response = await adminAPI.getAllServices(page, 10);
            setServices(response.data.content);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error('Error loading services:', error);
        }
    };

    const loadInquiries = async () => {
        try {
            const response = await adminAPI.getAllInquiries(0, 50);
            setInquiries(response.data.content);
        } catch (error) {
            console.error('Error loading inquiries:', error);
        }
    };

    const loadStats = async () => {
        try {
            const response = await adminAPI.getStats();
            setStats(response.data);
        } catch (error) {
            console.error('Error loading stats:', error);
        }
    };

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
        if (newValue === 0) {
            loadServices();
        } else if (newValue === 1) {
            loadInquiries();
        }
    };

    const handleOpenCreateDialog = () => {
        setEditingService(null);
        setFormData({
            name: '',
            description: '',
            price: '',
            category: '',
            location: '',
            duration: '',
            maxParticipants: '',
            tags: ''
        });
        setImageFiles([]);
        setImagePreviews([]);
        setExistingImages([]);
        setDialogOpen(true);
    };

    const handleOpenEditDialog = (service) => {
        setEditingService(service);
        setFormData({
            name: service.name,
            description: service.description,
            price: service.price,
            category: service.category,
            location: service.location,
            duration: service.duration || '',
            maxParticipants: service.maxParticipants || '',
            tags: service.tags || ''
        });
        setExistingImages(service.imageUrls || []);
        setImageFiles([]);
        setImagePreviews([]);
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
        setEditingService(null);
        setImageFiles([]);
        setImagePreviews([]);
        setExistingImages([]);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageSelect = (event) => {
        const files = Array.from(event.target.files);
        const validFiles = files.filter(file => file.type.startsWith('image/'));
        const newFiles = [...imageFiles, ...validFiles];
        setImageFiles(newFiles);
        const newPreviews = validFiles.map(file => URL.createObjectURL(file));
        setImagePreviews([...imagePreviews, ...newPreviews]);

        if (validFiles.length !== files.length) {
            setSnackbar({
                open: true,
                message: 'Some files were skipped. Please select only image files.',
                severity: 'warning'
            });
        }
    };

    const handleRemoveNewImage = (index) => {
        const newFiles = imageFiles.filter((_, i) => i !== index);
        const newPreviews = imagePreviews.filter((_, i) => i !== index);
        setImageFiles(newFiles);
        setImagePreviews(newPreviews);
    };

    const handleRemoveExistingImage = (index) => {
        const newExisting = existingImages.filter((_, i) => i !== index);
        setExistingImages(newExisting);
    };

    const handleSubmit = async () => {
        if (!formData.name || !formData.description || !formData.price || !formData.category || !formData.location) {
            setSnackbar({
                open: true,
                message: 'Please fill all required fields',
                severity: 'warning'
            });
            return;
        }

        setLoading(true);
        try {
            const submitData = {
                ...formData,
                price: parseFloat(formData.price),
                duration: formData.duration ? parseInt(formData.duration) : null,
                maxParticipants: formData.maxParticipants ? parseInt(formData.maxParticipants) : null
            };

            if (editingService) {
                await adminAPI.updateService(editingService.id, submitData, imageFiles, existingImages);
                setSnackbar({ open: true, message: 'Service updated successfully', severity: 'success' });
            } else {
                await adminAPI.createService(submitData, imageFiles);
                setSnackbar({ open: true, message: 'Service created successfully', severity: 'success' });
            }
            handleCloseDialog();
            loadServices();
            loadStats();
        } catch (error) {
            console.error('Error saving service:', error);
            setSnackbar({ open: true, message: 'Failed to save service', severity: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteService = async (serviceId) => {
        if (window.confirm('Are you sure you want to delete this service?')) {
            try {
                await adminAPI.deleteService(serviceId);
                setSnackbar({ open: true, message: 'Service deleted successfully', severity: 'success' });
                loadServices();
                loadStats();
            } catch (error) {
                setSnackbar({ open: true, message: 'Failed to delete service', severity: 'error' });
            }
        }
    };

    const handleToggleAvailability = async (serviceId, currentStatus) => {
        try {
            await adminAPI.toggleAvailability(serviceId);
            setSnackbar({
                open: true,
                message: `Service ${currentStatus ? 'hidden' : 'visible'} successfully`,
                severity: 'success'
            });
            loadServices();
            loadStats();
        } catch (error) {
            setSnackbar({ open: true, message: 'Failed to update service status', severity: 'error' });
        }
    };

    const handleOpenInquiryResponse = (inquiry) => {
        setSelectedInquiry(inquiry);
        setResponseText('');
        setInquiryDialogOpen(true);
    };

    const handleSendResponse = async () => {
        if (!responseText.trim()) {
            setSnackbar({ open: true, message: 'Please enter a response', severity: 'warning' });
            return;
        }

        setSendingResponse(true);
        try {
            await adminAPI.respondToInquiry(selectedInquiry.id, { response: responseText });
            setSnackbar({ open: true, message: 'Response sent successfully', severity: 'success' });
            setInquiryDialogOpen(false);
            loadInquiries();
        } catch (error) {
            setSnackbar({ open: true, message: 'Failed to send response', severity: 'error' });
        } finally {
            setSendingResponse(false);
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

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString();
    };

    if (!user) {
        return (
            <Backdrop open={true} sx={{ zIndex: 9999 }}>
                <CircularProgress sx={{ color: '#FF9800' }} />
            </Backdrop>
        );
    }

    return (
        <Box sx={{
            minHeight: '100vh',
            background: '#0A0A0A',
            color: '#FFFFFF',
            position: 'relative',
            overflow: 'hidden'
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
                    radial-gradient(circle at ${backgroundPosition.x * 100}% ${backgroundPosition.y * 100}%, rgba(255, 152, 0, 0.15) 0%, transparent 50%),
                    radial-gradient(circle at ${100 - backgroundPosition.x * 100}% ${100 - backgroundPosition.y * 100}%, rgba(255, 87, 34, 0.1) 0%, transparent 50%),
                    #0A0A0A
                `,
                transition: 'background 0.3s ease-out'
            }} />

            {/* Floating particles */}
            <Box sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 0,
                pointerEvents: 'none',
                opacity: 0.3
            }}>
                {[...Array(30)].map((_, i) => (
                    <Box
                        key={i}
                        sx={{
                            position: 'absolute',
                            width: '2px',
                            height: '2px',
                            background: `rgba(255, 152, 0, ${0.2 + Math.random() * 0.5})`,
                            borderRadius: '50%',
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            animation: `float ${15 + Math.random() * 10}s infinite ${i * 0.5}s ease-in-out`,
                        }}
                    />
                ))}
            </Box>

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
                @keyframes shimmer {
                    0% { background-position: -1000px 0; }
                    100% { background-position: 1000px 0; }
                }
            `}</style>

            {/* Header */}
            <Box sx={{
                position: 'sticky',
                top: 0,
                zIndex: 1000,
                backgroundColor: alpha('#0A0A0A', 0.95),
                backdropFilter: 'blur(10px)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
                <Container maxWidth="xl" sx={{ py: 1.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Box sx={{
                                width: '45px',
                                height: '45px',
                                borderRadius: '12px',
                                background: 'linear-gradient(135deg, #FF9800 0%, #FF5722 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                animation: 'pulse 2s infinite'
                            }}>
                                <AdminIcon sx={{ color: 'white', fontSize: 28 }} />
                            </Box>
                            <Box>
                                <Typography variant="h6" sx={{ fontWeight: 700, color: '#FF9800' }}>
                                    Admin Dashboard
                                </Typography>
                                <Typography variant="caption" sx={{ color: alpha('#FFFFFF', 0.5) }}>
                                    Manage your holiday services
                                </Typography>
                            </Box>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Button onClick={() => navigate('/')} sx={{ color: '#FFFFFF' }}>Home</Button>
                            <Button onClick={() => navigate('/services')} sx={{ color: '#FFFFFF' }}>Services</Button>
                            <IconButton onClick={handleMenuOpen} sx={{
                                background: 'linear-gradient(135deg, #FF9800 0%, #FF5722 100%)',
                                width: '45px',
                                height: '45px',
                                '&:hover': { transform: 'scale(1.05)' }
                            }}>
                                <Typography sx={{ fontWeight: 600, color: 'white' }}>{userInitial}</Typography>
                            </IconButton>
                        </Box>
                    </Box>
                </Container>
            </Box>

            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}
                  PaperProps={{ sx: { bgcolor: '#121212', color: '#FFFFFF', border: '1px solid #242424', minWidth: '200px', borderRadius: '12px' } }}>
                <MenuItem onClick={() => navigate('/profile')} sx={{ '&:hover': { bgcolor: alpha('#FF9800', 0.1) } }}>
                    <PersonIcon sx={{ mr: 2, color: '#FF9800' }} /> Profile
                </MenuItem>
                <MenuItem onClick={() => navigate('/services')} sx={{ '&:hover': { bgcolor: alpha('#FF9800', 0.1) } }}>
                    <CelebrationIcon sx={{ mr: 2, color: '#FF9800' }} /> Services
                </MenuItem>
                <Divider sx={{ borderColor: '#242424' }} />
                <MenuItem onClick={handleLogout} sx={{ '&:hover': { bgcolor: alpha('#f44336', 0.1) } }}>
                    <LogoutIcon sx={{ mr: 2, color: '#f44336' }} /> Logout
                </MenuItem>
            </Menu>

            {/* Main Content */}
            <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1, py: 4 }}>
                {/* Welcome Section */}
                <Fade in={true} timeout={500}>
                    <Box sx={{ mb: 5, textAlign: 'center' }}>
                        <Typography variant="h3" sx={{
                            fontWeight: 800,
                            background: 'linear-gradient(135deg, #FF9800, #FF5722, #FF9800)',
                            backgroundSize: '200% 200%',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            mb: 1
                        }}>
                            Welcome back, {user?.userName || 'Admin'}!
                        </Typography>
                        <Typography variant="body1" sx={{ color: alpha('#FFFFFF', 0.7) }}>
                            Here's what's happening with your holiday services today
                        </Typography>
                    </Box>
                </Fade>

                {/* Stats Cards */}
                <Grid container spacing={3} sx={{ mb: 5 }}>
                    <Grid item xs={12} sm={6} md={4}>
                        <Zoom in={true} style={{ transitionDelay: '100ms' }}>
                            <StatCard color="#FF9800">
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Box>
                                        <Typography variant="body2" sx={{ color: alpha('#FFFFFF', 0.7), mb: 1 }}>
                                            Total Services
                                        </Typography>
                                        <Typography variant="h3" sx={{ fontWeight: 700, color: '#FF9800' }}>
                                            {stats.totalServices}
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: alpha('#FFFFFF', 0.5) }}>
                                            All time
                                        </Typography>
                                    </Box>
                                    <Avatar sx={{ bgcolor: alpha('#FF9800', 0.2), width: 56, height: 56 }}>
                                        <CelebrationIcon sx={{ fontSize: 32, color: '#FF9800' }} />
                                    </Avatar>
                                </Box>
                            </StatCard>
                        </Zoom>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <Zoom in={true} style={{ transitionDelay: '200ms' }}>
                            <StatCard color="#4CAF50">
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Box>
                                        <Typography variant="body2" sx={{ color: alpha('#FFFFFF', 0.7), mb: 1 }}>
                                            Available Services
                                        </Typography>
                                        <Typography variant="h3" sx={{ fontWeight: 700, color: '#4CAF50' }}>
                                            {stats.availableServices}
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: alpha('#FFFFFF', 0.5) }}>
                                            Currently active
                                        </Typography>
                                    </Box>
                                    <Avatar sx={{ bgcolor: alpha('#4CAF50', 0.2), width: 56, height: 56 }}>
                                        <VisibilityIcon sx={{ fontSize: 32, color: '#4CAF50' }} />
                                    </Avatar>
                                </Box>
                            </StatCard>
                        </Zoom>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <Zoom in={true} style={{ transitionDelay: '300ms' }}>
                            <StatCard color="#FF9800">
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Box>
                                        <Typography variant="body2" sx={{ color: alpha('#FFFFFF', 0.7), mb: 1 }}>
                                            Pending Inquiries
                                        </Typography>
                                        <Typography variant="h3" sx={{ fontWeight: 700, color: '#FF9800' }}>
                                            {stats.pendingInquiries}
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: alpha('#FFFFFF', 0.5) }}>
                                            Need response
                                        </Typography>
                                    </Box>
                                    <Avatar sx={{ bgcolor: alpha('#FF9800', 0.2), width: 56, height: 56 }}>
                                        <EmailIcon sx={{ fontSize: 32, color: '#FF9800' }} />
                                    </Avatar>
                                </Box>
                            </StatCard>
                        </Zoom>
                    </Grid>
                </Grid>

                {/* Tabs */}
                <Paper sx={{
                    background: alpha('#121212', 0.95),
                    borderRadius: '20px',
                    overflow: 'hidden',
                    border: `1px solid ${alpha('#FFFFFF', 0.1)}`
                }}>
                    <Tabs value={activeTab} onChange={handleTabChange} sx={{
                        borderBottom: `1px solid ${alpha('#FFFFFF', 0.1)}`,
                        '& .MuiTab-root': {
                            color: alpha('#FFFFFF', 0.7),
                            py: 2,
                            '&.Mui-selected': { color: '#FF9800' }
                        }
                    }}>
                        <Tab label="📦 Services Management" icon={<CelebrationIcon />} iconPosition="start" />
                        <Tab label="✉️ Customer Inquiries" icon={<EmailIcon />} iconPosition="start" />
                    </Tabs>

                    {/* Services Tab */}
                    {activeTab === 0 && (
                        <Box sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                    All Services ({services.length})
                                </Typography>
                                <GradientButton startIcon={<AddIcon />} onClick={handleOpenCreateDialog}>
                                    Add New Service
                                </GradientButton>
                            </Box>

                            {loading ? (
                                <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                                    <CircularProgress sx={{ color: '#FF9800' }} />
                                </Box>
                            ) : services.length === 0 ? (
                                <Box sx={{ textAlign: 'center', py: 8 }}>
                                    <Typography sx={{ color: alpha('#FFFFFF', 0.7) }}>No services found</Typography>
                                    <Button onClick={handleOpenCreateDialog} sx={{ mt: 2, color: '#FF9800' }}>
                                        Create your first service
                                    </Button>
                                </Box>
                            ) : (
                                <Grid container spacing={3}>
                                    {services.map((service, index) => (
                                        <Grid item xs={12} sm={6} md={4} key={service.id}>
                                            <Grow in={true} style={{ transitionDelay: `${index * 50}ms` }}>
                                                <GlassCard>
                                                    <Box sx={{ position: 'relative', height: 180, overflow: 'hidden', borderRadius: '24px 24px 0 0' }}>
                                                        {service.imageUrls && service.imageUrls[0] ? (
                                                            <img src={service.imageUrls[0]} alt={service.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                        ) : (
                                                            <Box sx={{ height: '100%', bgcolor: alpha('#FF9800', 0.2), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                                <ImageIcon sx={{ fontSize: 80, color: alpha('#FF9800', 0.5) }} />
                                                            </Box>
                                                        )}
                                                        <Chip
                                                            label={service.isAvailable ? '● Available' : '● Hidden'}
                                                            size="small"
                                                            sx={{
                                                                position: 'absolute',
                                                                top: 12,
                                                                right: 12,
                                                                bgcolor: service.isAvailable ? alpha('#4CAF50', 0.95) : alpha('#f44336', 0.95),
                                                                color: 'white',
                                                                fontWeight: 600,
                                                                backdropFilter: 'blur(5px)'
                                                            }}
                                                        />
                                                        <Box sx={{
                                                            position: 'absolute',
                                                            bottom: 0,
                                                            left: 0,
                                                            right: 0,
                                                            background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                                                            p: 2
                                                        }}>
                                                            <Typography variant="h6" sx={{ fontWeight: 700, color: 'white' }}>
                                                                {service.name}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                    <CardContent>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                                            <PriceIcon sx={{ fontSize: 18, color: '#4CAF50' }} />
                                                            <Typography variant="body2" sx={{ color: '#4CAF50', fontWeight: 600 }}>
                                                                {formatPriceAMD(service.price)}
                                                            </Typography>
                                                        </Box>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                                            <CategoryIcon sx={{ fontSize: 18, color: alpha('#FFFFFF', 0.5) }} />
                                                            <Typography variant="body2" sx={{ color: alpha('#FFFFFF', 0.7) }}>
                                                                {service.category}
                                                            </Typography>
                                                        </Box>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                                            <LocationIcon sx={{ fontSize: 18, color: alpha('#FFFFFF', 0.5) }} />
                                                            <Typography variant="body2" sx={{ color: alpha('#FFFFFF', 0.7) }}>
                                                                {service.location}
                                                            </Typography>
                                                        </Box>
                                                        <Typography variant="body2" sx={{ color: alpha('#FFFFFF', 0.6), mb: 2, display: '-webkit-box', WebkitLineClamp: 2, overflow: 'hidden' }}>
                                                            {service.description}
                                                        </Typography>
                                                        <Divider sx={{ borderColor: alpha('#FFFFFF', 0.1), my: 2 }} />
                                                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'space-between', alignItems: 'center' }}>
                                                            <FormControlLabel
                                                                control={
                                                                    <Switch
                                                                        checked={service.isAvailable}
                                                                        onChange={() => handleToggleAvailability(service.id, service.isAvailable)}
                                                                        sx={{
                                                                            '& .MuiSwitch-switchBase.Mui-checked': { color: '#4CAF50' },
                                                                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: '#4CAF50' }
                                                                        }}
                                                                    />
                                                                }
                                                                label="Visible"
                                                                sx={{ mr: 0 }}
                                                            />
                                                            <Box>
                                                                <Tooltip title="Edit">
                                                                    <IconButton size="small" onClick={() => handleOpenEditDialog(service)} sx={{ color: '#FF9800' }}>
                                                                        <EditIcon />
                                                                    </IconButton>
                                                                </Tooltip>
                                                                <Tooltip title="Delete">
                                                                    <IconButton size="small" onClick={() => handleDeleteService(service.id)} sx={{ color: '#f44336' }}>
                                                                        <DeleteIcon />
                                                                    </IconButton>
                                                                </Tooltip>
                                                            </Box>
                                                        </Box>
                                                    </CardContent>
                                                </GlassCard>
                                            </Grow>
                                        </Grid>
                                    ))}
                                </Grid>
                            )}
                        </Box>
                    )}

                    {/* Inquiries Tab */}
                    {activeTab === 1 && (
                        <Box sx={{ p: 3 }}>
                            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                                Customer Inquiries ({inquiries.length})
                            </Typography>
                            {inquiries.length === 0 ? (
                                <Box sx={{ textAlign: 'center', py: 8 }}>
                                    <EmailIcon sx={{ fontSize: 80, color: alpha('#FFFFFF', 0.2), mb: 2 }} />
                                    <Typography sx={{ color: alpha('#FFFFFF', 0.7) }}>No inquiries found</Typography>
                                </Box>
                            ) : (
                                <TableContainer component={Paper} sx={{
                                    background: alpha('#1A1A1A', 0.6),
                                    borderRadius: '16px',
                                    overflow: 'hidden'
                                }}>
                                    <Table>
                                        <TableHead>
                                            <TableRow sx={{ bgcolor: alpha('#FF9800', 0.1) }}>
                                                <TableCell sx={{ color: '#FF9800', fontWeight: 600 }}>Customer</TableCell>
                                                <TableCell sx={{ color: '#FF9800', fontWeight: 600 }}>Service</TableCell>
                                                <TableCell sx={{ color: '#FF9800', fontWeight: 600 }}>Subject</TableCell>
                                                <TableCell sx={{ color: '#FF9800', fontWeight: 600 }}>Message</TableCell>
                                                <TableCell sx={{ color: '#FF9800', fontWeight: 600 }}>Date</TableCell>
                                                <TableCell sx={{ color: '#FF9800', fontWeight: 600 }}>Action</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {inquiries.map((inquiry) => (
                                                <TableRow key={inquiry.id} sx={{ '&:hover': { bgcolor: alpha('#FFFFFF', 0.05) } }}>
                                                    <TableCell>
                                                        <Typography variant="body2" sx={{ color: '#FFFFFF', fontWeight: 500 }}>
                                                            {inquiry.user?.userName || 'Unknown'}
                                                        </Typography>
                                                        <Typography variant="caption" sx={{ color: alpha('#FFFFFF', 0.6) }}>
                                                            {inquiry.userEmail}
                                                        </Typography>
                                                        <Typography variant="caption" sx={{ color: alpha('#FFFFFF', 0.4), display: 'block' }}>
                                                            {inquiry.userPhone}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="body2" sx={{ color: '#FFFFFF' }}>{inquiry.service?.name}</Typography>
                                                        <Chip label={inquiry.service?.category} size="small" sx={{
                                                            bgcolor: alpha('#FF9800', 0.2),
                                                            color: '#FF9800',
                                                            mt: 0.5,
                                                            fontSize: '10px'
                                                        }} />
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="body2" sx={{ color: '#FFFFFF' }}>{inquiry.subject}</Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="body2" sx={{ color: alpha('#FFFFFF', 0.8), maxWidth: 250 }}>
                                                            {inquiry.message.length > 100 ? inquiry.message.substring(0, 100) + '...' : inquiry.message}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="caption" sx={{ color: alpha('#FFFFFF', 0.6) }}>
                                                            {formatDate(inquiry.createdAt)}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Button
                                                            size="small"
                                                            variant="outlined"
                                                            startIcon={<ReplyIcon />}
                                                            onClick={() => handleOpenInquiryResponse(inquiry)}
                                                            sx={{
                                                                borderColor: '#FF9800',
                                                                color: '#FF9800',
                                                                borderRadius: '20px',
                                                                '&:hover': {
                                                                    background: alpha('#FF9800', 0.1),
                                                                    borderColor: '#FF9800'
                                                                }
                                                            }}
                                                        >
                                                            Respond
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            )}
                        </Box>
                    )}
                </Paper>
            </Container>

            {/* Create/Edit Service Dialog */}
            <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth
                    PaperProps={{ sx: { bgcolor: '#121212', borderRadius: '24px', border: `1px solid ${alpha('#FF9800', 0.3)}` } }}>
                <DialogTitle sx={{ borderBottom: `1px solid ${alpha('#FFFFFF', 0.1)}`, pb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {editingService ? <EditIcon sx={{ color: '#FF9800' }} /> : <AddIcon sx={{ color: '#FF9800' }} />}
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            {editingService ? 'Edit Service' : 'Create New Service'}
                        </Typography>
                    </Box>
                    <IconButton onClick={handleCloseDialog} sx={{ position: 'absolute', right: 16, top: 16, color: '#FFFFFF' }}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent sx={{ mt: 2 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                        <TextField
                            fullWidth
                            label="Service Name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    bgcolor: alpha('#1A1A1A', 0.8),
                                    borderRadius: '12px',
                                    '&:hover fieldset': { borderColor: '#FF9800' },
                                    '&.Mui-focused fieldset': { borderColor: '#FF9800' }
                                },
                                '& .MuiInputLabel-root': { color: alpha('#FFFFFF', 0.7), '&.Mui-focused': { color: '#FF9800' } }
                            }}
                        />
                        <TextField
                            fullWidth
                            multiline
                            rows={3}
                            label="Description"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            required
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    bgcolor: alpha('#1A1A1A', 0.8),
                                    borderRadius: '12px',
                                    '&:hover fieldset': { borderColor: '#FF9800' },
                                    '&.Mui-focused fieldset': { borderColor: '#FF9800' }
                                },
                                '& .MuiInputLabel-root': { color: alpha('#FFFFFF', 0.7), '&.Mui-focused': { color: '#FF9800' } }
                            }}
                        />
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    type="number"
                                    label="Price (AMD)"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    required
                                    InputProps={{ startAdornment: <InputAdornment position="start">֏</InputAdornment> }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            bgcolor: alpha('#1A1A1A', 0.8),
                                            borderRadius: '12px',
                                            '&:hover fieldset': { borderColor: '#FF9800' },
                                            '&.Mui-focused fieldset': { borderColor: '#FF9800' }
                                        },
                                        '& .MuiInputLabel-root': { color: alpha('#FFFFFF', 0.7), '&.Mui-focused': { color: '#FF9800' } }
                                    }}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <FormControl fullWidth>
                                    <InputLabel sx={{ color: alpha('#FFFFFF', 0.7) }}>Category</InputLabel>
                                    <Select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        label="Category"
                                        required
                                        sx={{
                                            bgcolor: alpha('#1A1A1A', 0.8),
                                            borderRadius: '12px',
                                            color: '#FFFFFF',
                                            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#FF9800' },
                                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#FF9800' }
                                        }}
                                    >
                                        <MenuItem value="">Select Category</MenuItem>
                                        {categories.map((cat) => (
                                            <MenuItem key={cat.value} value={cat.value}>{cat.label}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>

                        {/* Location Dropdown */}
                        <FormControl fullWidth required>
                            <InputLabel sx={{ color: alpha('#FFFFFF', 0.7) }}>City</InputLabel>
                            <Select
                                name="location"
                                value={formData.location}
                                onChange={handleInputChange}
                                label="City"
                                sx={{
                                    bgcolor: alpha('#1A1A1A', 0.8),
                                    borderRadius: '12px',
                                    color: '#FFFFFF',
                                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#FF9800' },
                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#FF9800' }
                                }}
                            >
                                <MenuItem value="">Select City</MenuItem>
                                {ARMENIAN_CITIES.map((city) => (
                                    <MenuItem key={city.value} value={city.value}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <LocationIcon sx={{ fontSize: 16, color: '#FF9800' }} />
                                            <span>{city.label}</span>
                                            <Typography variant="caption" sx={{ color: alpha('#FFFFFF', 0.5), ml: 1 }}>
                                                ({city.region})
                                            </Typography>
                                        </Box>
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    type="number"
                                    label="Duration (hours)"
                                    name="duration"
                                    value={formData.duration}
                                    onChange={handleInputChange}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            bgcolor: alpha('#1A1A1A', 0.8),
                                            borderRadius: '12px',
                                            '&:hover fieldset': { borderColor: '#FF9800' },
                                            '&.Mui-focused fieldset': { borderColor: '#FF9800' }
                                        },
                                        '& .MuiInputLabel-root': { color: alpha('#FFFFFF', 0.7), '&.Mui-focused': { color: '#FF9800' } }
                                    }}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    type="number"
                                    label="Max Participants"
                                    name="maxParticipants"
                                    value={formData.maxParticipants}
                                    onChange={handleInputChange}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            bgcolor: alpha('#1A1A1A', 0.8),
                                            borderRadius: '12px',
                                            '&:hover fieldset': { borderColor: '#FF9800' },
                                            '&.Mui-focused fieldset': { borderColor: '#FF9800' }
                                        },
                                        '& .MuiInputLabel-root': { color: alpha('#FFFFFF', 0.7), '&.Mui-focused': { color: '#FF9800' } }
                                    }}
                                />
                            </Grid>
                        </Grid>

                        <TextField
                            fullWidth
                            label="Tags (comma separated)"
                            name="tags"
                            value={formData.tags}
                            onChange={handleInputChange}
                            placeholder="e.g., premium, outdoor, family-friendly"
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    bgcolor: alpha('#1A1A1A', 0.8),
                                    borderRadius: '12px',
                                    '&:hover fieldset': { borderColor: '#FF9800' },
                                    '&.Mui-focused fieldset': { borderColor: '#FF9800' }
                                },
                                '& .MuiInputLabel-root': { color: alpha('#FFFFFF', 0.7), '&.Mui-focused': { color: '#FF9800' } }
                            }}
                        />

                        {/* Image Upload Section */}
                        <Typography variant="subtitle2" sx={{ mt: 1, color: '#FF9800', display: 'flex', alignItems: 'center', gap: 1 }}>
                            <ImageIcon sx={{ fontSize: 20 }} /> Service Images
                        </Typography>

                        <Button
                            variant="outlined"
                            component="label"
                            startIcon={<UploadIcon />}
                            sx={{
                                borderColor: '#FF9800',
                                color: '#FF9800',
                                borderRadius: '12px',
                                py: 1.5,
                                '&:hover': { borderColor: '#FF5722', bgcolor: alpha('#FF9800', 0.1) }
                            }}
                        >
                            Upload Images
                            <input type="file" multiple accept="image/*" onChange={handleImageSelect} style={{ display: 'none' }} ref={fileInputRef} />
                        </Button>

                        {existingImages.length > 0 && (
                            <Box>
                                <Typography variant="body2" sx={{ color: alpha('#FFFFFF', 0.7), mb: 1 }}>Current Images:</Typography>
                                <ImageList cols={3} rowHeight={100} sx={{ mb: 2 }}>
                                    {existingImages.map((url, index) => (
                                        <ImageListItem key={index} sx={{ position: 'relative', borderRadius: '8px', overflow: 'hidden' }}>
                                            <img src={url} alt={`Existing ${index}`} style={{ height: 100, objectFit: 'cover', width: '100%' }} />
                                            <IconButton
                                                size="small"
                                                onClick={() => handleRemoveExistingImage(index)}
                                                sx={{
                                                    position: 'absolute',
                                                    top: 5,
                                                    right: 5,
                                                    bgcolor: alpha('#000000', 0.7),
                                                    '&:hover': { bgcolor: '#f44336' }
                                                }}
                                            >
                                                <DeleteOutlineIcon sx={{ fontSize: 16, color: 'white' }} />
                                            </IconButton>
                                        </ImageListItem>
                                    ))}
                                </ImageList>
                            </Box>
                        )}

                        {imagePreviews.length > 0 && (
                            <Box>
                                <Typography variant="body2" sx={{ color: alpha('#FFFFFF', 0.7), mb: 1 }}>New Images:</Typography>
                                <ImageList cols={3} rowHeight={100}>
                                    {imagePreviews.map((preview, index) => (
                                        <ImageListItem key={index} sx={{ position: 'relative', borderRadius: '8px', overflow: 'hidden' }}>
                                            <img src={preview} alt={`Preview ${index}`} style={{ height: 100, objectFit: 'cover', width: '100%' }} />
                                            <IconButton
                                                size="small"
                                                onClick={() => handleRemoveNewImage(index)}
                                                sx={{
                                                    position: 'absolute',
                                                    top: 5,
                                                    right: 5,
                                                    bgcolor: alpha('#000000', 0.7),
                                                    '&:hover': { bgcolor: '#f44336' }
                                                }}
                                            >
                                                <DeleteOutlineIcon sx={{ fontSize: 16, color: 'white' }} />
                                            </IconButton>
                                        </ImageListItem>
                                    ))}
                                </ImageList>
                            </Box>
                        )}

                        <Typography variant="caption" sx={{ color: alpha('#FFFFFF', 0.4), textAlign: 'center' }}>
                            Supported formats: JPG, PNG, GIF, BMP. Max size: 5MB per image.
                        </Typography>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 3, borderTop: `1px solid ${alpha('#FFFFFF', 0.1)}` }}>
                    <Button onClick={handleCloseDialog} sx={{ color: alpha('#FFFFFF', 0.7), borderRadius: '10px' }}>
                        Cancel
                    </Button>
                    <GradientButton onClick={handleSubmit} disabled={loading}>
                        {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : (editingService ? 'Update Service' : 'Create Service')}
                    </GradientButton>
                </DialogActions>
            </Dialog>

            {/* Respond to Inquiry Dialog */}
            <Dialog open={inquiryDialogOpen} onClose={() => setInquiryDialogOpen(false)} maxWidth="md" fullWidth
                    PaperProps={{ sx: { bgcolor: '#121212', borderRadius: '24px', border: `1px solid ${alpha('#FF9800', 0.3)}` } }}>
                <DialogTitle sx={{ borderBottom: `1px solid ${alpha('#FFFFFF', 0.1)}` }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <ReplyIcon sx={{ color: '#FF9800' }} />
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>Respond to Customer</Typography>
                    </Box>
                    <IconButton onClick={() => setInquiryDialogOpen(false)} sx={{ position: 'absolute', right: 16, top: 16, color: '#FFFFFF' }}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    {selectedInquiry && (
                        <Box sx={{ mt: 2 }}>
                            <Paper sx={{
                                p: 2.5,
                                mb: 3,
                                bgcolor: alpha('#FF9800', 0.1),
                                borderRadius: '16px',
                                border: `1px solid ${alpha('#FF9800', 0.3)}`
                            }}>
                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <Typography variant="caption" sx={{ color: alpha('#FFFFFF', 0.5) }}>Customer Name</Typography>
                                        <Typography variant="body2" sx={{ color: '#FFFFFF', fontWeight: 500 }}>{selectedInquiry.user?.userName}</Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="caption" sx={{ color: alpha('#FFFFFF', 0.5) }}>Email</Typography>
                                        <Typography variant="body2" sx={{ color: '#FFFFFF' }}>{selectedInquiry.userEmail}</Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="caption" sx={{ color: alpha('#FFFFFF', 0.5) }}>Phone</Typography>
                                        <Typography variant="body2" sx={{ color: '#FFFFFF' }}>{selectedInquiry.userPhone}</Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="caption" sx={{ color: alpha('#FFFFFF', 0.5) }}>Service</Typography>
                                        <Typography variant="body2" sx={{ color: '#FF9800', fontWeight: 500 }}>{selectedInquiry.service?.name}</Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography variant="caption" sx={{ color: alpha('#FFFFFF', 0.5) }}>Subject</Typography>
                                        <Typography variant="body2" sx={{ color: '#FFFFFF' }}>{selectedInquiry.subject}</Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography variant="caption" sx={{ color: alpha('#FFFFFF', 0.5) }}>Message</Typography>
                                        <Paper sx={{
                                            p: 2,
                                            mt: 0.5,
                                            bgcolor: alpha('#000000', 0.3),
                                            borderRadius: '12px',
                                            borderLeft: `3px solid #FF9800`
                                        }}>
                                            <Typography variant="body2" sx={{ color: alpha('#FFFFFF', 0.9) }}>
                                                {selectedInquiry.message}
                                            </Typography>
                                        </Paper>
                                    </Grid>
                                </Grid>
                            </Paper>
                            <TextField
                                fullWidth
                                multiline
                                rows={6}
                                label="Your Response"
                                value={responseText}
                                onChange={(e) => setResponseText(e.target.value)}
                                required
                                placeholder="Type your response here. This will be sent to the customer's email."
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        bgcolor: alpha('#1A1A1A', 0.8),
                                        borderRadius: '12px',
                                        '&:hover fieldset': { borderColor: '#FF9800' },
                                        '&.Mui-focused fieldset': { borderColor: '#FF9800' }
                                    },
                                    '& .MuiInputLabel-root': { color: alpha('#FFFFFF', 0.7), '&.Mui-focused': { color: '#FF9800' } }
                                }}
                            />
                        </Box>
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 3, borderTop: `1px solid ${alpha('#FFFFFF', 0.1)}` }}>
                    <Button onClick={() => setInquiryDialogOpen(false)} sx={{ color: alpha('#FFFFFF', 0.7) }}>Cancel</Button>
                    <GradientButton onClick={handleSendResponse} disabled={sendingResponse}>
                        {sendingResponse ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Send Response'}
                    </GradientButton>
                </DialogActions>
            </Dialog>

            {/* Snackbar */}
            <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
                <Alert severity={snackbar.severity} sx={{
                    bgcolor: '#121212',
                    color: '#FFFFFF',
                    border: `1px solid ${snackbar.severity === 'success' ? '#4CAF50' : '#f44336'}`,
                    borderRadius: '12px'
                }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default AdminDashboardPage;