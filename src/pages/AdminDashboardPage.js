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
    GlobalStyles
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
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
    Logout as LogoutIcon,
    Person as PersonIcon,
    AdminPanelSettings as AdminIcon,
    CloudUpload as UploadIcon,
    DeleteOutline as DeleteOutlineIcon,
    AccessTime as AccessTimeIcon,
    ChevronLeft as ChevronLeftIcon,
    ChevronRight as ChevronRightIcon,
    Phone as PhoneIcon,
    Language as LanguageIcon,
    Facebook as FacebookIcon,
    Instagram as InstagramIcon,
    YouTube as YouTubeIcon,
    LinkedIn as LinkedInIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { alpha, styled } from '@mui/material/styles';
import adminAPI from '../services/adminAPI';
import { isAdmin } from '../utils/jwtUtils';

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

// Styled Switch for orange color
const OrangeSwitch = styled(Switch)(({ theme }) => ({
    '& .MuiSwitch-switchBase.Mui-checked': {
        color: '#FF9800',
        '&:hover': {
            backgroundColor: alpha('#FF9800', 0.08),
        },
    },
    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
        backgroundColor: '#FF9800',
    },
    '& .MuiSwitch-track': {
        backgroundColor: '#E0E4E8',
    },
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

// Categories
const categories = [
    { value: 'PARTY', label: '🎉 Party / Celebration', icon: '🎉' },
    { value: 'BIRTHDAY', label: '🎂 Birthday Party', icon: '🎂' },
    { value: 'DECORATION', label: '🎨 Decoration', icon: '🎨' },
    { value: 'PHOTOGRAPHY', label: '📸 Photography', icon: '📸' },
    { value: 'WEDDING', label: '💒 Wedding', icon: '💒' },
    { value: 'CORPORATE', label: '🏢 Corporate Event', icon: '🏢' },
    { value: 'ENGAGEMENT', label: '💍 Engagement', icon: '💍' },
    { value: 'ANNIVERSARY', label: '🎪 Anniversary', icon: '🎪' },
    { value: 'GRADUATION_CEREMONY', label: '🎓 Graduation Party', icon: '🎓' },
    { value: 'FLOWERS', label: '🌸 Floral Design', icon: '🌸' },
    { value: 'LIGHTING', label: '💡 Lighting', icon: '💡' },
    { value: 'STAGE_SETUP', label: '🎭 Stage Setup', icon: '🎭' },
    { value: 'RENTALS', label: '🔧 Equipment Rental', icon: '🔧' }
];

// Social media platforms with real icons
const socialPlatforms = [
    { value: 'FACEBOOK', label: 'Facebook', icon: <FacebookIcon sx={{ color: '#1877F2' }} />, placeholder: 'https://facebook.com/yourpage' },
    { value: 'INSTAGRAM', label: 'Instagram', icon: <InstagramIcon sx={{ color: '#E4405F' }} />, placeholder: 'https://instagram.com/yourprofile' },
    { value: 'YOUTUBE', label: 'YouTube', icon: <YouTubeIcon sx={{ color: '#FF0000' }} />, placeholder: 'https://youtube.com/c/yourchannel' },
    { value: 'LINKEDIN', label: 'LinkedIn', icon: <LinkedInIcon sx={{ color: '#0077B5' }} />, placeholder: 'https://linkedin.com/company/yourcompany' }
];

const AdminDashboardPage = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const [loading, setLoading] = useState(false);
    const [services, setServices] = useState([]);
    const [stats, setStats] = useState({
        totalServices: 0,
        availableServices: 0
    });
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingService, setEditingService] = useState(null);
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

    // State variables for social networks, phone numbers, and contact email
    const [socialNetworks, setSocialNetworks] = useState([]);
    const [phoneNumbersList, setPhoneNumbersList] = useState([]);
    const [contactEmail, setContactEmail] = useState('');
    const [newPhoneNumber, setNewPhoneNumber] = useState('');
    const [phoneError, setPhoneError] = useState('');

    // State for image carousel
    const [activeImageIndex, setActiveImageIndex] = useState({});

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: '',
        location: '',
        duration: '',
        tags: ''
    });

    // Validate Armenian phone number (8 digits)
    const validateArmenianPhone = (phone) => {
        const phoneRegex = /^[0-9]{8}$/;
        return phoneRegex.test(phone);
    };

    // Add phone number
    const handleAddPhoneNumber = () => {
        if (!newPhoneNumber.trim()) {
            setPhoneError('Please enter a phone number');
            return;
        }

        if (!validateArmenianPhone(newPhoneNumber.trim())) {
            setPhoneError('Phone number must be exactly 8 digits (e.g., 99123456)');
            return;
        }

        if (phoneNumbersList.includes(newPhoneNumber.trim())) {
            setPhoneError('This phone number already exists');
            return;
        }

        setPhoneNumbersList([...phoneNumbersList, newPhoneNumber.trim()]);
        setNewPhoneNumber('');
        setPhoneError('');
    };

    // Remove phone number
    const handleRemovePhoneNumber = (index) => {
        const newList = phoneNumbersList.filter((_, i) => i !== index);
        setPhoneNumbersList(newList);
    };

    // Add social network
    const handleAddSocialNetwork = (platform) => {
        setSocialNetworks([...socialNetworks, { platform, url: '' }]);
    };

    // Update social network URL
    const handleUpdateSocialUrl = (index, url) => {
        const updated = [...socialNetworks];
        updated[index].url = url;
        setSocialNetworks(updated);
    };

    // Remove social network
    const handleRemoveSocialNetwork = (index) => {
        const updated = socialNetworks.filter((_, i) => i !== index);
        setSocialNetworks(updated);
    };

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

    const loadStats = async () => {
        try {
            const response = await adminAPI.getStats();
            setStats(response.data);
        } catch (error) {
            console.error('Error loading stats:', error);
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
            tags: ''
        });
        setImageFiles([]);
        setImagePreviews([]);
        setExistingImages([]);
        setSocialNetworks([]);
        setPhoneNumbersList([]);
        setContactEmail('');
        setNewPhoneNumber('');
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
            tags: service.tags || ''
        });

        setExistingImages(service.imageUrls || []);
        setImageFiles([]);
        setImagePreviews([]);

        // Load social networks
        setSocialNetworks(service.socialNetworks?.map(sn => ({
            platform: sn.platform,
            url: sn.url
        })) || []);

        // Load phone numbers
        setPhoneNumbersList(service.phoneNumbers || []);

        // Load contact email
        setContactEmail(service.contactEmail || '');

        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
        setEditingService(null);
        setImageFiles([]);
        setImagePreviews([]);
        setExistingImages([]);
        setSocialNetworks([]);
        setPhoneNumbersList([]);
        setContactEmail('');
        setNewPhoneNumber('');
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
                name: formData.name,
                description: formData.description,
                price: parseFloat(formData.price),
                category: formData.category,
                location: formData.location,
                duration: formData.duration ? parseInt(formData.duration) : null,
                tags: formData.tags || '',
                socialNetworks: socialNetworks.filter(sn => sn.url && sn.url.trim() !== ''),
                phoneNumbers: phoneNumbersList,
                contactEmail: contactEmail || null
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

    // Helper function to get category display name
    const getCategoryDisplayName = (categoryValue) => {
        const category = categories.find(cat => cat.value === categoryValue);
        return category ? category.label : categoryValue;
    };

    // Handle next image
    const handleNextImage = (serviceId, totalImages) => {
        setActiveImageIndex(prev => ({
            ...prev,
            [serviceId]: ((prev[serviceId] || 0) + 1) % totalImages
        }));
    };

    // Handle previous image
    const handlePrevImage = (serviceId, totalImages) => {
        setActiveImageIndex(prev => ({
            ...prev,
            [serviceId]: ((prev[serviceId] || 0) - 1 + totalImages) % totalImages
        }));
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
            {/* Global styles for orange scrollbars */}
            <GlobalStyles
                styles={{
                    '*::-webkit-scrollbar': {
                        width: '10px',
                        height: '10px',
                    },
                    '*::-webkit-scrollbar-track': {
                        background: '#F5F5F5',
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
                        scrollbarWidth: 'thin',
                        scrollbarColor: '#FF9800 #F5F5F5',
                    },
                }}
            />
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
                    {/* Stats Cards - Only Total Services and Available Services */}
                    <Grid container spacing={3} sx={{ mb: 5 }}>
                        <Grid item xs={12} sm={6}>
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
                        <Grid item xs={12} sm={6}>
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
                    </Grid>

                    {/* Services Section - No Tabs */}
                    <Box sx={{
                        background: '#FFFFFF',
                        borderRadius: '20px',
                        overflow: 'hidden',
                        border: 'none',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
                    }}>
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
                                        const images = service.imageUrls || [];
                                        const currentIndex = activeImageIndex[service.id] || 0;

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
                                                                            bgcolor: service.isAvailable ? alpha('#FF9800', 0.1) : alpha('#f44336', 0.1),
                                                                            color: service.isAvailable ? '#FF9800' : '#f44336',
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
                                                                                    {getCategoryDisplayName(service.category)}
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

                                                                {/* Duration - Only show if exists and greater than 0 */}
                                                                {service.duration && service.duration > 0 && (
                                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: '26px' }}>
                                                                        <AccessTimeIcon sx={{ fontSize: 22, color: '#8A99A8' }} />
                                                                        <Typography variant="body1" sx={{ color: '#5A6874', fontSize: '1rem' }}>
                                                                            Duration: {service.duration} hours
                                                                        </Typography>
                                                                    </Box>
                                                                )}

                                                                {/* Our Contacts Section */}
                                                                {(service.contactEmail || (service.phoneNumbers && service.phoneNumbers.length > 0) || (service.socialNetworks && service.socialNetworks.length > 0)) && (
                                                                    <Box sx={{ mt: 2, mb: 2 }}>
                                                                        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1A2733', mb: 1.5 }}>
                                                                            📞 Contact Us
                                                                        </Typography>

                                                                        {/* Contact Email */}
                                                                        {service.contactEmail && (
                                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                                                                                <EmailIcon sx={{ fontSize: 20, color: '#8A99A8' }} />
                                                                                <Typography variant="body2" sx={{ color: '#5A6874' }}>
                                                                                    {service.contactEmail}
                                                                                </Typography>
                                                                            </Box>
                                                                        )}

                                                                        {/* Phone Numbers */}
                                                                        {service.phoneNumbers && service.phoneNumbers.length > 0 && (
                                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5, flexWrap: 'wrap' }}>
                                                                                <PhoneIcon sx={{ fontSize: 20, color: '#8A99A8' }} />
                                                                                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                                                                    {service.phoneNumbers.map((phone, idx) => (
                                                                                        <Chip
                                                                                            key={idx}
                                                                                            label={phone}
                                                                                            size="small"
                                                                                            sx={{ bgcolor: alpha('#FF9800', 0.1), color: '#FF9800' }}
                                                                                        />
                                                                                    ))}
                                                                                </Box>
                                                                            </Box>
                                                                        )}

                                                                        {/* Social Networks */}
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
                                                                                            <Button
                                                                                                key={idx}
                                                                                                size="small"
                                                                                                href={social.url}
                                                                                                target="_blank"
                                                                                                startIcon={getSocialIcon(social.platform)}
                                                                                                sx={{
                                                                                                    textTransform: 'none',
                                                                                                    color: '#1A2733',
                                                                                                    '&:hover': { bgcolor: alpha('#FF9800', 0.1) }
                                                                                                }}
                                                                                            >
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

                                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                                    <FormControlLabel
                                                                        control={
                                                                            <OrangeSwitch
                                                                                checked={service.isAvailable}
                                                                                onChange={() => handleToggleAvailability(service.id, service.isAvailable)}
                                                                            />
                                                                        }
                                                                        label="Visible"
                                                                        sx={{
                                                                            mr: 0,
                                                                            '& .MuiFormControlLabel-label': {
                                                                                color: service.isAvailable ? '#FF9800' : '#8A99A8',
                                                                                fontWeight: service.isAvailable ? 600 : 400
                                                                            }
                                                                        }}
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

                                                                        {images.length > 1 && (
                                                                            <>
                                                                                <IconButton
                                                                                    onClick={() => handlePrevImage(service.id, images.length)}
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
                                                                                    onClick={() => handleNextImage(service.id, images.length)}
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
                                                                                            onClick={() => setActiveImageIndex(prev => ({ ...prev, [service.id]: idx }))}
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
                                                                    <Box sx={{
                                                                        textAlign: 'center',
                                                                        p: 4
                                                                    }}>
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
                        </Box>
                    </Box>
                </Container>

                {/* Create/Edit Service Dialog */}
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

                            {/* Location and Duration */}
                            <Grid container spacing={3}>
                                <Grid item xs={6}>
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
                                </Grid>
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
                            </Grid>

                            {/* Social Networks Section */}
                            <Box sx={{ mt: 2 }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1A2733', mb: 2 }}>
                                    🌐 Social Networks (Optional)
                                </Typography>
                                <Grid container spacing={2}>
                                    {socialPlatforms.map((platform) => {
                                        const existing = socialNetworks.find(sn => sn.platform === platform.value);
                                        const index = socialNetworks.findIndex(sn => sn.platform === platform.value);

                                        return (
                                            <Grid item xs={12} sm={6} key={platform.value}>
                                                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                                    {platform.icon}
                                                    {existing ? (
                                                        <FlatTextField
                                                            fullWidth
                                                            size="small"
                                                            placeholder={platform.placeholder}
                                                            value={existing.url}
                                                            onChange={(e) => handleUpdateSocialUrl(index, e.target.value)}
                                                            sx={{ flex: 1 }}
                                                        />
                                                    ) : (
                                                        <OutlinedButton
                                                            size="small"
                                                            onClick={() => handleAddSocialNetwork(platform.value)}
                                                            sx={{ flex: 1, justifyContent: 'flex-start' }}
                                                        >
                                                            + Add {platform.label}
                                                        </OutlinedButton>
                                                    )}
                                                    {existing && (
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => handleRemoveSocialNetwork(index)}
                                                            sx={{ color: '#f44336' }}
                                                        >
                                                            <DeleteIcon fontSize="small" />
                                                        </IconButton>
                                                    )}
                                                </Box>
                                            </Grid>
                                        );
                                    })}
                                </Grid>
                            </Box>

                            {/* Contact Email and Phone Numbers - Side by side */}
                            <Grid container spacing={3}>
                                {/* Contact Email - Left side */}
                                <Grid item xs={12} md={6}>
                                    <Box>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1A2733', mb: 2 }}>
                                            ✉️ Contact Email (Optional)
                                        </Typography>
                                        <FlatTextField
                                            fullWidth
                                            type="email"
                                            placeholder="contact@example.com"
                                            value={contactEmail}
                                            onChange={(e) => setContactEmail(e.target.value)}
                                            size="small"
                                        />
                                    </Box>
                                </Grid>

                                {/* Phone Numbers - Right side */}
                                <Grid item xs={12} md={6}>
                                    <Box>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1A2733', mb: 2 }}>
                                            📞 Phone Numbers (Optional - Armenian numbers only)
                                        </Typography>

                                        {/* Add phone number input */}
                                        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                                            <FlatTextField
                                                size="small"
                                                placeholder="Enter 8-digit number (e.g., 99123456)"
                                                value={newPhoneNumber}
                                                onChange={(e) => {
                                                    setNewPhoneNumber(e.target.value);
                                                    setPhoneError('');
                                                }}
                                                error={!!phoneError}
                                                helperText={phoneError}
                                                sx={{ flex: 1 }}
                                            />
                                            <GradientButton onClick={handleAddPhoneNumber} sx={{ minWidth: '100px' }}>
                                                Add
                                            </GradientButton>
                                        </Box>

                                        {/* Phone numbers list */}
                                        {phoneNumbersList.length > 0 && (
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                                {phoneNumbersList.map((phone, idx) => (
                                                    <Chip
                                                        key={idx}
                                                        label={`📞 ${phone}`}
                                                        onDelete={() => handleRemovePhoneNumber(idx)}
                                                        sx={{
                                                            bgcolor: alpha('#FF9800', 0.1),
                                                            color: '#FF9800',
                                                            '&:hover': { bgcolor: alpha('#FF9800', 0.2) }
                                                        }}
                                                    />
                                                ))}
                                            </Box>
                                        )}
                                    </Box>
                                </Grid>
                            </Grid>

                            {/* Tags and Upload Images - Side by side */}
                            <Grid container spacing={3}>
                                {/* Tags - Left side */}
                                <Grid item xs={12} md={6}>
                                    <Box>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1A2733', mb: 2 }}>
                                            🏷️ Tags (Optional)
                                        </Typography>
                                        <FlatTextField
                                            fullWidth
                                            label="Tags (comma separated)"
                                            name="tags"
                                            value={formData.tags}
                                            onChange={handleInputChange}
                                            placeholder="e.g., premium, outdoor, family-friendly"
                                            variant="outlined"
                                        />
                                    </Box>
                                </Grid>

                                {/* Upload Images - Right side */}
                                <Grid item xs={12} md={6}>
                                    <Box>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1A2733', mb: 2 }}>
                                            🖼️ Upload Images (Optional)
                                        </Typography>
                                        <OutlinedButton
                                            component="label"
                                            startIcon={<UploadIcon />}
                                            fullWidth
                                            sx={{
                                                height: '56px',
                                                borderColor: '#E0E4E8',
                                                color: '#5A6874',
                                                backgroundColor: '#F5F7FA',
                                                '&:hover': { borderColor: '#FF9800', backgroundColor: '#EEF0F2' }
                                            }}
                                        >
                                            Choose Images
                                            <input type="file" multiple accept="image/*" onChange={handleImageSelect} style={{ display: 'none' }} ref={fileInputRef} />
                                        </OutlinedButton>
                                    </Box>
                                </Grid>
                            </Grid>

                            {/* Image Previews Section */}
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