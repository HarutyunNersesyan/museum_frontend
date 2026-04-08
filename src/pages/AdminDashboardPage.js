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
    Grow
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
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
    Save as SaveIcon,
    CloudUpload as UploadIcon,
    DeleteOutline as DeleteOutlineIcon,
    AccessTime as AccessTimeIcon,
    Event as EventIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { alpha, styled } from '@mui/material/styles';
import adminAPI from '../services/adminAPI';
import { isAdmin } from '../utils/jwtUtils';
import { formatPriceAMD } from '../services/serviceAPI';

// Styled components for light design
const GlassCard = styled(Card)(({ theme }) => ({
    background: '#FFFFFF',
    borderRadius: '24px',
    border: 'none',
    transition: 'all 0.3s ease',
    boxShadow: 'none',
    '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 12px 28px rgba(255, 152, 0, 0.12)'
    }
}));

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

const StatCard = styled(Paper)(({ theme, color }) => ({
    background: '#FFFFFF',
    borderRadius: '20px',
    padding: '24px',
    border: 'none',
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
    '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: `0 12px 28px ${color}15`
    }
}));

// Flat TextField without borders
const FlatTextField = styled(TextField)(({ theme }) => ({
    '& .MuiOutlinedInput-root': {
        backgroundColor: '#F5F7FA',
        borderRadius: '8px',
        border: 'none',
        '& fieldset': {
            border: 'none',
        },
        '&:hover': {
            backgroundColor: '#EEF0F2',
        },
        '&.Mui-focused': {
            backgroundColor: '#EEF0F2',
            boxShadow: '0 0 0 2px rgba(255, 152, 0, 0.2)',
        }
    },
    '& .MuiInputLabel-root': {
        color: '#8A99A8',
        '&.Mui-focused': {
            color: '#FF9800',
        }
    }
}));

// Flat Select without borders
const FlatSelect = styled(Select)(({ theme }) => ({
    backgroundColor: '#F5F7FA',
    borderRadius: '8px',
    border: 'none',
    '&:hover': {
        backgroundColor: '#EEF0F2',
    },
    '&.Mui-focused': {
        backgroundColor: '#EEF0F2',
        boxShadow: '0 0 0 2px rgba(255, 152, 0, 0.2)',
    },
    '& .MuiOutlinedInput-notchedOutline': {
        border: 'none',
    }
}));

// Styled image for consistent display
const ServiceImage = styled('img')({
    maxWidth: '100%',
    maxHeight: '100%',
    width: 'auto',
    height: 'auto',
    objectFit: 'contain',
    display: 'block',
    borderRadius: '12px'
});

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
        tags: '',
        startDate: null,
        startTime: null
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
            tags: '',
            startDate: null,
            startTime: null
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
            tags: service.tags || '',
            startDate: service.startDate ? dayjs(service.startDate) : null,
            startTime: service.startTime ? dayjs(service.startTime, 'HH:mm') : null
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

    const handleDateChange = (name, value) => {
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
                name: formData.name,
                description: formData.description,
                price: parseFloat(formData.price),
                category: formData.category,
                location: formData.location,
                duration: formData.duration ? parseInt(formData.duration) : null,
                maxParticipants: formData.maxParticipants ? parseInt(formData.maxParticipants) : null,
                tags: formData.tags,
                startDate: formData.startDate ? formData.startDate.format('YYYY-MM-DD') : null,
                startTime: formData.startTime ? formData.startTime.format('HH:mm') : null
            };

            if (editingService) {
                await adminAPI.updateService(editingService.id, submitData, imageFiles, existingImages);
                setSnackbar({ open: true, message: 'Service updated successfully', severity: 'success' });
            } else {
                await adminAPI.createService(submitData, imageFiles);
                setSnackbar({ open: true, message: 'Service created successfully', severity: 'success' });
            }
            handleCloseDialog();
            await loadServices();
            await loadStats();
        } catch (error) {
            let errorMessage = 'Failed to save service';
            if (error.response?.data) {
                if (typeof error.response.data === 'string') {
                    errorMessage = error.response.data;
                } else if (error.response.data.message) {
                    errorMessage = error.response.data.message;
                } else if (error.response.data.error) {
                    errorMessage = error.response.data.error;
                }
            } else if (error.message) {
                errorMessage = error.message;
            }

            setSnackbar({
                open: true,
                message: errorMessage,
                severity: 'error'
            });
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

    // Helper function to safely format date
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

    if (!user) {
        return (
            <Backdrop open={true} sx={{ zIndex: 9999, backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
                <CircularProgress sx={{ color: '#FF9800' }} />
            </Backdrop>
        );
    }

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box sx={{
                minHeight: '100vh',
                background: '#F5F7FA',
                color: '#1A2733',
                position: 'relative'
            }}>
                {/* Header */}
                <Box sx={{
                    position: 'sticky',
                    top: 0,
                    zIndex: 1000,
                    backgroundColor: '#FFFFFF',
                    borderBottom: 'none',
                    boxShadow: '0 1px 4px rgba(0, 0, 0, 0.04)'
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
                                    justifyContent: 'center'
                                }}>
                                    <AdminIcon sx={{ color: 'white', fontSize: 28 }} />
                                </Box>
                                <Box>
                                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#1A2733' }}>
                                        Admin Dashboard
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: '#8A99A8' }}>
                                        Manage your holiday services
                                    </Typography>
                                </Box>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <IconButton onClick={handleMenuOpen} sx={{
                                    background: 'linear-gradient(135deg, #FF9800 0%, #FF5722 100%)',
                                    width: '45px',
                                    height: '45px'
                                }}>
                                    <Typography sx={{ fontWeight: 600, color: 'white' }}>{userInitial}</Typography>
                                </IconButton>
                            </Box>
                        </Box>
                    </Container>
                </Box>

                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    PaperProps={{
                        sx: {
                            bgcolor: '#FFFFFF',
                            color: '#1A2733',
                            border: 'none',
                            minWidth: '200px',
                            borderRadius: '12px',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
                        }
                    }}
                >
                    <MenuItem onClick={() => navigate('/profile')}>
                        <PersonIcon sx={{ mr: 2, color: '#FF9800' }} /> Profile
                    </MenuItem>
                    <Divider sx={{ borderColor: '#E8ECF0' }} />
                    <MenuItem onClick={handleLogout}>
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
                            <Typography variant="body1" sx={{ color: '#8A99A8' }}>
                                Here's what's happening with your holiday services today
                            </Typography>
                        </Box>
                    </Fade>

                    {/* Stats Cards */}
                    <Grid container spacing={3} sx={{ mb: 5 }}>
                        <Grid item xs={12} sm={6} md={4}>
                            <StatCard color="#FF9800">
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Box>
                                        <Typography variant="body2" sx={{ color: '#8A99A8', mb: 1 }}>
                                            Total Services
                                        </Typography>
                                        <Typography variant="h3" sx={{ fontWeight: 700, color: '#FF9800' }}>
                                            {stats.totalServices}
                                        </Typography>
                                    </Box>
                                    <Avatar sx={{ bgcolor: alpha('#FF9800', 0.1), width: 56, height: 56 }}>
                                        <CelebrationIcon sx={{ fontSize: 32, color: '#FF9800' }} />
                                    </Avatar>
                                </Box>
                            </StatCard>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <StatCard color="#4CAF50">
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Box>
                                        <Typography variant="body2" sx={{ color: '#8A99A8', mb: 1 }}>
                                            Available Services
                                        </Typography>
                                        <Typography variant="h3" sx={{ fontWeight: 700, color: '#4CAF50' }}>
                                            {stats.availableServices}
                                        </Typography>
                                    </Box>
                                    <Avatar sx={{ bgcolor: alpha('#4CAF50', 0.1), width: 56, height: 56 }}>
                                        <VisibilityIcon sx={{ fontSize: 32, color: '#4CAF50' }} />
                                    </Avatar>
                                </Box>
                            </StatCard>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <StatCard color="#FF9800">
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Box>
                                        <Typography variant="body2" sx={{ color: '#8A99A8', mb: 1 }}>
                                            Pending Inquiries
                                        </Typography>
                                        <Typography variant="h3" sx={{ fontWeight: 700, color: '#FF9800' }}>
                                            {stats.pendingInquiries}
                                        </Typography>
                                    </Box>
                                    <Avatar sx={{ bgcolor: alpha('#FF9800', 0.1), width: 56, height: 56 }}>
                                        <EmailIcon sx={{ fontSize: 32, color: '#FF9800' }} />
                                    </Avatar>
                                </Box>
                            </StatCard>
                        </Grid>
                    </Grid>

                    {/* Tabs */}
                    <Paper sx={{
                        background: '#FFFFFF',
                        borderRadius: '20px',
                        overflow: 'hidden',
                        border: 'none',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
                    }}>
                        <Tabs value={activeTab} onChange={handleTabChange} sx={{
                            borderBottom: 'none',
                            '& .MuiTab-root': {
                                color: '#8A99A8',
                                py: 2,
                                '&.Mui-selected': { color: '#FF9800' }
                            }
                        }}>
                            <Tab label="📦 Services Management" icon={<CelebrationIcon />} iconPosition="start" />
                            <Tab label="✉️ Customer Inquiries" icon={<EmailIcon />} iconPosition="start" />
                        </Tabs>

                        {/* Services Tab - Vertical Layout with Image on Right */}
                        {activeTab === 0 && (
                            <Box sx={{ p: 3 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
                                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#1A2733' }}>
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
                                        <Typography sx={{ color: '#8A99A8' }}>No services found</Typography>
                                        <Button onClick={handleOpenCreateDialog} sx={{ mt: 2, color: '#FF9800' }}>
                                            Create your first service
                                        </Button>
                                    </Box>
                                ) : (
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                        {services.map((service, index) => {
                                            const eventDate = formatEventDate(service.startDate, service.startTime);
                                            return (
                                                <Grow in={true} style={{ transitionDelay: `${index * 50}ms` }} key={service.id}>
                                                    <Paper sx={{
                                                        borderRadius: '20px',
                                                        overflow: 'hidden',
                                                        border: 'none',
                                                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                                                        transition: 'all 0.3s ease',
                                                        minHeight: '364px',
                                                        '&:hover': {
                                                            transform: 'translateY(-2px)',
                                                            boxShadow: '0 8px 20px rgba(255, 152, 0, 0.12)'
                                                        }
                                                    }}>
                                                        <Grid container sx={{ minHeight: '364px' }}>
                                                            {/* Left side - Information */}
                                                            <Grid item xs={12} md={7}>
                                                                <Box sx={{ p: '31px' }}>
                                                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: '26px' }}>
                                                                        <Typography variant="h5" sx={{ fontWeight: 700, color: '#1A2733', fontSize: '1.8rem' }}>
                                                                            {service.name}
                                                                        </Typography>
                                                                        <Chip
                                                                            label={service.isAvailable ? '● Available' : '● Hidden'}
                                                                            size="medium"
                                                                            sx={{
                                                                                bgcolor: service.isAvailable ? alpha('#4CAF50', 0.1) : alpha('#f44336', 0.1),
                                                                                color: service.isAvailable ? '#4CAF50' : '#f44336',
                                                                                fontWeight: 600,
                                                                                fontSize: '0.9rem',
                                                                                py: 1
                                                                            }}
                                                                        />
                                                                    </Box>

                                                                    <Typography variant="body1" sx={{ color: '#5A6874', mb: '26px', lineHeight: 1.6, fontSize: '1rem' }}>
                                                                        {service.description}
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
                                                                                        {service.location}
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
                                                                                Duration: {service.duration} hours
                                                                                {service.maxParticipants && ` | Max: ${service.maxParticipants} participants`}
                                                                            </Typography>
                                                                        </Box>
                                                                    )}

                                                                    <Divider sx={{ borderColor: '#E8ECF0', my: '26px' }} />

                                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
                                                                                <IconButton
                                                                                    size="medium"
                                                                                    onClick={() => handleOpenEditDialog(service)}
                                                                                    sx={{
                                                                                        color: '#FF9800',
                                                                                        '&:hover': { bgcolor: alpha('#FF9800', 0.1) }
                                                                                    }}
                                                                                >
                                                                                    <EditIcon />
                                                                                </IconButton>
                                                                            </Tooltip>
                                                                            <Tooltip title="Delete">
                                                                                <IconButton
                                                                                    size="medium"
                                                                                    onClick={() => handleDeleteService(service.id)}
                                                                                    sx={{
                                                                                        color: '#f44336',
                                                                                        '&:hover': { bgcolor: alpha('#f44336', 0.1) }
                                                                                    }}
                                                                                >
                                                                                    <DeleteIcon />
                                                                                </IconButton>
                                                                            </Tooltip>
                                                                        </Box>
                                                                    </Box>
                                                                </Box>
                                                            </Grid>

                                                            {/* Right side - Image with proper aspect ratio and contain */}
                                                            <Grid item xs={12} md={5}>
                                                                <Box sx={{
                                                                    height: '100%',
                                                                    minHeight: '364px',
                                                                    background: `linear-gradient(135deg, ${alpha('#FF9800', 0.05)} 0%, ${alpha('#FF5722', 0.02)} 100%)`,
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                    position: 'relative',
                                                                    overflow: 'hidden',
                                                                    p: 2
                                                                }}>
                                                                    {service.imageUrls && service.imageUrls[0] ? (
                                                                        <>
                                                                            <Box sx={{
                                                                                width: '100%',
                                                                                height: '100%',
                                                                                display: 'flex',
                                                                                alignItems: 'center',
                                                                                justifyContent: 'center',
                                                                                backgroundColor: '#fafafa',
                                                                                borderRadius: '12px',
                                                                                overflow: 'hidden'
                                                                            }}>
                                                                                <ServiceImage
                                                                                    src={service.imageUrls[0]}
                                                                                    alt={service.name}
                                                                                />
                                                                            </Box>
                                                                            {service.imageUrls.length > 1 && (
                                                                                <Chip
                                                                                    label={`+${service.imageUrls.length - 1} more`}
                                                                                    size="medium"
                                                                                    sx={{
                                                                                        position: 'absolute',
                                                                                        bottom: 16,
                                                                                        right: 16,
                                                                                        bgcolor: alpha('#000000', 0.7),
                                                                                        color: 'white',
                                                                                        fontWeight: 500,
                                                                                        fontSize: '0.85rem',
                                                                                        zIndex: 1
                                                                                    }}
                                                                                />
                                                                            )}
                                                                        </>
                                                                    ) : (
                                                                        <Box sx={{
                                                                            textAlign: 'center',
                                                                            p: 4
                                                                        }}>
                                                                            <ImageIcon sx={{ fontSize: 100, color: alpha('#FF9800', 0.3), mb: 2 }} />
                                                                            <Typography variant="body1" sx={{ color: '#8A99A8', fontSize: '1rem' }}>
                                                                                No image available
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
                            </Box>
                        )}

                        {/* Inquiries Tab */}
                        {activeTab === 1 && (
                            <Box sx={{ p: 3 }}>
                                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: '#1A2733' }}>
                                    Customer Inquiries ({inquiries.length})
                                </Typography>
                                {inquiries.length === 0 ? (
                                    <Box sx={{ textAlign: 'center', py: 8 }}>
                                        <EmailIcon sx={{ fontSize: 80, color: alpha('#8A99A8', 0.3), mb: 2 }} />
                                        <Typography sx={{ color: '#8A99A8' }}>No inquiries found</Typography>
                                    </Box>
                                ) : (
                                    <TableContainer component={Paper} sx={{
                                        background: '#FFFFFF',
                                        borderRadius: '16px',
                                        overflow: 'hidden',
                                        border: 'none',
                                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
                                    }}>
                                        <Table>
                                            <TableHead>
                                                <TableRow sx={{ bgcolor: alpha('#FF9800', 0.05) }}>
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
                                                    <TableRow key={inquiry.id} sx={{ '&:hover': { bgcolor: alpha('#FF9800', 0.02) } }}>
                                                        <TableCell>
                                                            <Typography variant="body2" sx={{ color: '#1A2733', fontWeight: 500 }}>
                                                                {inquiry.user?.userName || 'Unknown'}
                                                            </Typography>
                                                            <Typography variant="caption" sx={{ color: '#8A99A8' }}>
                                                                {inquiry.userEmail}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Typography variant="body2" sx={{ color: '#1A2733' }}>{inquiry.service?.name}</Typography>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Typography variant="body2" sx={{ color: '#1A2733' }}>{inquiry.subject}</Typography>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Typography variant="body2" sx={{ color: '#5A6874', maxWidth: 250 }}>
                                                                {inquiry.message.length > 100 ? inquiry.message.substring(0, 100) + '...' : inquiry.message}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Typography variant="caption" sx={{ color: '#8A99A8' }}>
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
                                                                        borderColor: '#FF5722',
                                                                        backgroundColor: alpha('#FF9800', 0.05)
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

                {/* Create/Edit Service Dialog - Enlarged and flat design */}
                <Dialog
                    open={dialogOpen}
                    onClose={handleCloseDialog}
                    maxWidth="lg"
                    fullWidth
                    PaperProps={{
                        sx: {
                            bgcolor: '#FFFFFF',
                            borderRadius: '20px',
                            border: 'none',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                            width: '100%',
                            maxWidth: '1144px',
                        }
                    }}
                >
                    <DialogTitle sx={{ borderBottom: 'none', pb: 2, pt: 3, px: 3, bgcolor: '#FFFFFF' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {editingService ? <EditIcon sx={{ color: '#FF9800' }} /> : <AddIcon sx={{ color: '#FF9800' }} />}
                            <Typography variant="h5" sx={{ fontWeight: 600, color: '#1A2733' }}>
                                {editingService ? 'Edit Service' : 'Create New Service'}
                            </Typography>
                        </Box>
                        <IconButton onClick={handleCloseDialog} sx={{ position: 'absolute', right: 16, top: 16, color: '#8A99A8' }}>
                            <CloseIcon />
                        </IconButton>
                    </DialogTitle>
                    <DialogContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                            {/* Service Name */}
                            <FlatTextField
                                fullWidth
                                label="Service Name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                                variant="outlined"
                                InputProps={{ style: { padding: '14px' } }}
                            />

                            {/* Description */}
                            <FlatTextField
                                fullWidth
                                multiline
                                rows={4}
                                label="Description"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                required
                                variant="outlined"
                            />

                            {/* Price and Category */}
                            <Grid container spacing={3}>
                                <Grid item xs={6}>
                                    <FlatTextField
                                        fullWidth
                                        type="number"
                                        label="Price (AMD)"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleInputChange}
                                        required
                                        variant="outlined"
                                        InputProps={{
                                            startAdornment: <InputAdornment position="start">֏</InputAdornment>,
                                            style: { padding: '14px' }
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <FormControl fullWidth variant="outlined">
                                        <InputLabel sx={{ color: '#8A99A8' }}>Category</InputLabel>
                                        <FlatSelect
                                            name="category"
                                            value={formData.category}
                                            onChange={handleInputChange}
                                            label="Category"
                                            required
                                        >
                                            <MenuItem value="">Select Category</MenuItem>
                                            {categories.map((cat) => (
                                                <MenuItem key={cat.value} value={cat.value}>{cat.label}</MenuItem>
                                            ))}
                                        </FlatSelect>
                                    </FormControl>
                                </Grid>
                            </Grid>

                            {/* Location */}
                            <FormControl fullWidth required variant="outlined">
                                <InputLabel sx={{ color: '#8A99A8' }}>City</InputLabel>
                                <FlatSelect
                                    name="location"
                                    value={formData.location}
                                    onChange={handleInputChange}
                                    label="City"
                                >
                                    <MenuItem value="">Select City</MenuItem>
                                    {ARMENIAN_CITIES.map((city) => (
                                        <MenuItem key={city.value} value={city.value}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <LocationIcon sx={{ fontSize: 16, color: '#FF9800' }} />
                                                <span>{city.label}</span>
                                                <Typography variant="caption" sx={{ color: '#8A99A8', ml: 1 }}>
                                                    ({city.region})
                                                </Typography>
                                            </Box>
                                        </MenuItem>
                                    ))}
                                </FlatSelect>
                            </FormControl>

                            {/* Duration and Max Participants */}
                            <Grid container spacing={3}>
                                <Grid item xs={6}>
                                    <FlatTextField
                                        fullWidth
                                        type="number"
                                        label="Duration (hours)"
                                        name="duration"
                                        value={formData.duration}
                                        onChange={handleInputChange}
                                        variant="outlined"
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <FlatTextField
                                        fullWidth
                                        type="number"
                                        label="Max Participants"
                                        name="maxParticipants"
                                        value={formData.maxParticipants}
                                        onChange={handleInputChange}
                                        variant="outlined"
                                    />
                                </Grid>
                            </Grid>

                            {/* Tags */}
                            <FlatTextField
                                fullWidth
                                label="Tags (comma separated)"
                                name="tags"
                                value={formData.tags}
                                onChange={handleInputChange}
                                placeholder="e.g., premium, outdoor, family-friendly"
                                variant="outlined"
                            />

                            {/* Date and Time Section */}
                            <Typography variant="subtitle1" sx={{ mt: 1, color: '#FF9800', display: 'flex', alignItems: 'center', gap: 1, fontWeight: 600 }}>
                                <EventIcon sx={{ fontSize: 22 }} /> Event Schedule
                            </Typography>

                            <Grid container spacing={3}>
                                {/* Start Date */}
                                <Grid item xs={12} sm={6}>
                                    <DatePicker
                                        label="Start Date"
                                        value={formData.startDate}
                                        onChange={(newValue) => handleDateChange('startDate', newValue)}
                                        sx={{
                                            width: '100%',
                                            '& .MuiOutlinedInput-root': {
                                                backgroundColor: '#F5F7FA',
                                                borderRadius: '8px',
                                                border: 'none',
                                                '& fieldset': { border: 'none' },
                                                '&:hover': { backgroundColor: '#EEF0F2' },
                                                '&.Mui-focused': {
                                                    backgroundColor: '#EEF0F2',
                                                    boxShadow: '0 0 0 2px rgba(255, 152, 0, 0.2)'
                                                }
                                            }
                                        }}
                                        slotProps={{
                                            textField: {
                                                fullWidth: true,
                                                variant: 'outlined'
                                            }
                                        }}
                                    />
                                </Grid>

                                {/* Start Time - 24-hour format */}
                                <Grid item xs={12} sm={6}>
                                    <TimePicker
                                        label="Start Time (24-hour)"
                                        value={formData.startTime}
                                        onChange={(newValue) => handleDateChange('startTime', newValue)}
                                        ampm={false}
                                        format="HH:mm"
                                        sx={{
                                            width: '100%',
                                            '& .MuiOutlinedInput-root': {
                                                backgroundColor: '#F5F7FA',
                                                borderRadius: '8px',
                                                border: 'none',
                                                '& fieldset': { border: 'none' },
                                                '&:hover': { backgroundColor: '#EEF0F2' },
                                                '&.Mui-focused': {
                                                    backgroundColor: '#EEF0F2',
                                                    boxShadow: '0 0 0 2px rgba(255, 152, 0, 0.2)'
                                                }
                                            }
                                        }}
                                        slotProps={{
                                            textField: {
                                                fullWidth: true,
                                                placeholder: "14:30",
                                                variant: 'outlined'
                                            }
                                        }}
                                    />
                                </Grid>
                            </Grid>

                            <Typography variant="caption" sx={{ color: '#8A99A8', textAlign: 'center' }}>
                                ⏰ Time is displayed in 24-hour format (e.g., 14:30 for 2:30 PM)
                            </Typography>

                            {/* Image Upload Section */}
                            <Typography variant="subtitle1" sx={{ mt: 1, color: '#FF9800', display: 'flex', alignItems: 'center', gap: 1, fontWeight: 600 }}>
                                <ImageIcon sx={{ fontSize: 22 }} /> Service Images
                            </Typography>

                            <OutlinedButton
                                component="label"
                                startIcon={<UploadIcon />}
                                sx={{
                                    borderColor: '#E0E4E8',
                                    color: '#5A6874',
                                    backgroundColor: '#F5F7FA',
                                    '&:hover': { borderColor: '#FF9800', backgroundColor: '#EEF0F2' }
                                }}
                            >
                                Upload Images
                                <input type="file" multiple accept="image/*" onChange={handleImageSelect} style={{ display: 'none' }} ref={fileInputRef} />
                            </OutlinedButton>

                            {existingImages.length > 0 && (
                                <Box>
                                    <Typography variant="body2" sx={{ color: '#8A99A8', mb: 1 }}>Current Images:</Typography>
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
                                                        bgcolor: alpha('#000000', 0.6),
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
                                    <Typography variant="body2" sx={{ color: '#8A99A8', mb: 1 }}>New Images:</Typography>
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
                                                        bgcolor: alpha('#000000', 0.6),
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

                            <Typography variant="caption" sx={{ color: '#8A99A8', textAlign: 'center' }}>
                                Supported formats: JPG, PNG, GIF, BMP. Max size: 5MB per image.
                            </Typography>
                        </Box>
                    </DialogContent>
                    <DialogActions sx={{ p: 3, borderTop: 'none', bgcolor: '#FFFFFF' }}>
                        <OutlinedButton onClick={handleCloseDialog}>
                            Cancel
                        </OutlinedButton>
                        <GradientButton onClick={handleSubmit} disabled={loading}>
                            {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : (editingService ? 'Update Service' : 'Create Service')}
                        </GradientButton>
                    </DialogActions>
                </Dialog>

                {/* Respond to Inquiry Dialog */}
                <Dialog open={inquiryDialogOpen} onClose={() => setInquiryDialogOpen(false)} maxWidth="md" fullWidth
                        PaperProps={{ sx: { bgcolor: '#FFFFFF', borderRadius: '16px', border: 'none', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)' } }}>
                    <DialogTitle sx={{ borderBottom: 'none', bgcolor: '#FFFFFF', pt: 3, px: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <ReplyIcon sx={{ color: '#FF9800' }} />
                            <Typography variant="h5" sx={{ fontWeight: 600, color: '#1A2733' }}>Respond to Customer</Typography>
                        </Box>
                        <IconButton onClick={() => setInquiryDialogOpen(false)} sx={{ position: 'absolute', right: 16, top: 16, color: '#8A99A8' }}>
                            <CloseIcon />
                        </IconButton>
                    </DialogTitle>
                    <DialogContent sx={{ p: 3 }}>
                        {selectedInquiry && (
                            <Box sx={{ mt: 2 }}>
                                <Paper sx={{ p: 2.5, mb: 3, bgcolor: alpha('#FF9800', 0.05), borderRadius: '12px', border: 'none' }}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={6}>
                                            <Typography variant="caption" sx={{ color: '#8A99A8' }}>Customer</Typography>
                                            <Typography variant="body2" sx={{ color: '#1A2733' }}>{selectedInquiry.user?.userName}</Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant="caption" sx={{ color: '#8A99A8' }}>Email</Typography>
                                            <Typography variant="body2" sx={{ color: '#1A2733' }}>{selectedInquiry.userEmail}</Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography variant="caption" sx={{ color: '#8A99A8' }}>Message</Typography>
                                            <Typography variant="body2" sx={{ color: '#5A6874' }}>{selectedInquiry.message}</Typography>
                                        </Grid>
                                    </Grid>
                                </Paper>
                                <FlatTextField
                                    fullWidth
                                    multiline
                                    rows={6}
                                    label="Your Response"
                                    value={responseText}
                                    onChange={(e) => setResponseText(e.target.value)}
                                    required
                                    variant="outlined"
                                />
                            </Box>
                        )}
                    </DialogContent>
                    <DialogActions sx={{ p: 3, borderTop: 'none', bgcolor: '#FFFFFF' }}>
                        <OutlinedButton onClick={() => setInquiryDialogOpen(false)}>
                            Cancel
                        </OutlinedButton>
                        <GradientButton onClick={handleSendResponse} disabled={sendingResponse}>
                            {sendingResponse ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Send Response'}
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

export default AdminDashboardPage;