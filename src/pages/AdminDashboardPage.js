// src/pages/AdminDashboardPage.js

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
    GlobalStyles,
    Pagination
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
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
    Museum as MuseumIcon,
    Event as EventIcon,
    AttachMoney as MoneyIcon,
    CalendarMonth as CalendarIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { alpha, styled } from '@mui/material/styles';
import { adminMuseumAPI, adminEventAPI, adminStatsAPI } from '../services/adminAPI';
import { isAdmin } from '../utils/jwtUtils';

// Styled components for light design
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

const StatCard = styled(Paper)(({ theme }) => ({
    background: '#FFFFFF',
    borderRadius: '20px',
    padding: '24px',
    border: 'none',
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
    '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 12px 28px rgba(255, 152, 0, 0.12)'
    }
}));

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

const ServiceImage = styled('img')({
    maxWidth: '100%',
    maxHeight: '100%',
    width: 'auto',
    height: 'auto',
    objectFit: 'contain',
    display: 'block',
    borderRadius: '12px'
});

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

// Armenian cities (matching backend Location enum)
const ARMENIAN_CITIES = [
    { value: 'YEREVAN', label: 'Yerevan', region: 'Central' },
    { value: 'GYUMRI', label: 'Gyumri', region: 'Shirak' },
    { value: 'VANADZOR', label: 'Vanadzor', region: 'Lori' },
    { value: 'VAGHARSHAPAT', label: 'Vagharshapat (Ejmiatsin)', region: 'Armavir' },
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

// Event Categories (matching backend EventCategory enum)
const eventCategories = [
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

// Event Types (matching backend EventType enum)
const eventTypes = [
    { value: 'MOBILE', label: '📱 Mobile' }
];

const AdminDashboardPage = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState(0);

    // Events state
    const [events, setEvents] = useState([]);
    const [eventsPage, setEventsPage] = useState(0);
    const [eventsTotalPages, setEventsTotalPages] = useState(0);

    // Museums state
    const [museums, setMuseums] = useState([]);
    const [museumsPage, setMuseumsPage] = useState(0);
    const [museumsTotalPages, setMuseumsTotalPages] = useState(0);

    // Stats state
    const [stats, setStats] = useState({
        totalMuseums: 0,
        totalEvents: 0
    });

    // Dialog states
    const [eventDialogOpen, setEventDialogOpen] = useState(false);
    const [museumDialogOpen, setMuseumDialogOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);
    const [editingMuseum, setEditingMuseum] = useState(null);

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    const [anchorEl, setAnchorEl] = useState(null);
    const [userInitial, setUserInitial] = useState('');
    const [activeImageIndex, setActiveImageIndex] = useState({});

    // Image upload states
    const [imageFiles, setImageFiles] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [existingImages, setExistingImages] = useState([]);
    const fileInputRef = useRef(null);

    // Phone numbers and contact email states
    const [phoneNumbersList, setPhoneNumbersList] = useState([]);
    const [contactEmail, setContactEmail] = useState('');
    const [newPhoneNumber, setNewPhoneNumber] = useState('');
    const [phoneError, setPhoneError] = useState('');

    // Museums list for dropdown
    const [museumsList, setMuseumsList] = useState([]);

    // Event form data
    const [eventFormData, setEventFormData] = useState({
        name: '',
        description: '',
        eventCategory: '',
        eventType: 'MOBILE',
        eventDate: dayjs(),
        guidePrice: '',
        ticketPrice: '',
        location: '',
        duration: '',
        museumId: ''
    });

    // Museum form data
    const [museumFormData, setMuseumFormData] = useState({
        name: ''
    });

    // Validate Armenian phone number (8 digits)
    const validateArmenianPhone = (phone) => {
        const phoneRegex = /^[0-9]{8}$/;
        return phoneRegex.test(phone);
    };

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

    const handleRemovePhoneNumber = (index) => {
        const newList = phoneNumbersList.filter((_, i) => i !== index);
        setPhoneNumbersList(newList);
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

        loadAllData();
    }, [user, eventsPage, museumsPage]);

    const loadAllData = async () => {
        setLoading(true);
        try {
            await Promise.all([
                loadEvents(),
                loadMuseums(),
                loadStats(),
                loadMuseumsForDropdown()
            ]);
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadEvents = async () => {
        try {
            const response = await adminEventAPI.getAllEvents(eventsPage, 10);
            setEvents(response.data.content || []);
            setEventsTotalPages(response.data.totalPages || 0);
        } catch (error) {
            console.error('Error loading events:', error);
        }
    };

    const loadMuseums = async () => {
        try {
            const response = await adminMuseumAPI.getAllMuseums(museumsPage, 10);
            setMuseums(response.data.content || []);
            setMuseumsTotalPages(response.data.totalPages || 0);
        } catch (error) {
            console.error('Error loading museums:', error);
        }
    };

    const loadStats = async () => {
        try {
            const response = await adminStatsAPI.getDashboardStats();
            const statsData = response.data;
            setStats({
                totalMuseums: statsData.totalMuseums || 0,
                totalEvents: statsData.totalEvents || 0
            });
        } catch (error) {
            console.error('Error loading stats:', error);
            setStats({ totalMuseums: 0, totalEvents: 0 });
        }
    };

    const loadMuseumsForDropdown = async () => {
        try {
            const response = await adminMuseumAPI.getAllMuseums(0, 100);
            setMuseumsList(response.data.content || []);
        } catch (error) {
            console.error('Error loading museums for dropdown:', error);
        }
    };

    // Event Dialog Handlers
    const handleOpenCreateEventDialog = () => {
        setEditingEvent(null);
        setEventFormData({
            name: '',
            description: '',
            eventCategory: '',
            eventType: 'MOBILE',
            eventDate: dayjs(),
            guidePrice: '',
            ticketPrice: '',
            location: '',
            duration: '',
            museumId: ''
        });
        setImageFiles([]);
        setImagePreviews([]);
        setExistingImages([]);
        setPhoneNumbersList([]);
        setContactEmail('');
        setNewPhoneNumber('');
        setEventDialogOpen(true);
    };

    const handleOpenEditEventDialog = (event) => {
        setEditingEvent(event);
        setEventFormData({
            name: event.name,
            description: event.description,
            eventCategory: event.eventCategory,
            eventType: event.eventType || 'MOBILE',
            eventDate: dayjs(event.eventDate),
            guidePrice: event.guidePrice?.toString() || '',
            ticketPrice: event.ticketPrice?.toString() || '',
            location: event.location,
            duration: event.duration?.toString() || '',
            museumId: event.museumId
        });
        setExistingImages(event.imageUrls || []);
        setImageFiles([]);
        setImagePreviews([]);
        setPhoneNumbersList(event.phoneNumbers || []);
        setContactEmail(event.contactEmail || '');
        setEventDialogOpen(true);
    };

    const handleCloseEventDialog = () => {
        setEventDialogOpen(false);
        setEditingEvent(null);
        setImageFiles([]);
        setImagePreviews([]);
        setExistingImages([]);
        setPhoneNumbersList([]);
        setContactEmail('');
        setNewPhoneNumber('');
    };

    // Museum Dialog Handlers
    const handleOpenCreateMuseumDialog = () => {
        setEditingMuseum(null);
        setMuseumFormData({ name: '' });
        setMuseumDialogOpen(true);
    };

    const handleOpenEditMuseumDialog = (museum) => {
        setEditingMuseum(museum);
        setMuseumFormData({ name: museum.name });
        setMuseumDialogOpen(true);
    };

    const handleCloseMuseumDialog = () => {
        setMuseumDialogOpen(false);
        setEditingMuseum(null);
    };

    const handleEventInputChange = (e) => {
        const { name, value } = e.target;
        setEventFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleMuseumInputChange = (e) => {
        const { name, value } = e.target;
        setMuseumFormData(prev => ({ ...prev, [name]: value }));
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

    const handleSubmitEvent = async () => {
        if (!eventFormData.name || !eventFormData.description || !eventFormData.eventCategory ||
            !eventFormData.location || !eventFormData.guidePrice || !eventFormData.ticketPrice || !eventFormData.museumId) {
            setSnackbar({
                open: true,
                message: 'Please fill all required fields',
                severity: 'warning'
            });
            return;
        }

        setLoading(true);
        try {
            // Format date properly for backend
            const formattedDate = eventFormData.eventDate
                ? eventFormData.eventDate.format('YYYY-MM-DDTHH:mm:ss')
                : dayjs().format('YYYY-MM-DDTHH:mm:ss');

            const submitData = {
                name: eventFormData.name,
                description: eventFormData.description,
                eventCategory: eventFormData.eventCategory,
                eventType: eventFormData.eventType,
                eventDate: formattedDate,
                guidePrice: parseInt(eventFormData.guidePrice),
                ticketPrice: parseInt(eventFormData.ticketPrice),
                location: eventFormData.location,
                duration: eventFormData.duration ? parseInt(eventFormData.duration) : null,
                museumId: parseInt(eventFormData.museumId),
                phoneNumbers: phoneNumbersList,
                contactEmail: contactEmail || null
            };

            console.log('Submitting event data:', submitData);
            console.log('Image files count:', imageFiles.length);

            if (editingEvent) {
                await adminEventAPI.updateEvent(editingEvent.id, submitData);
                setSnackbar({ open: true, message: 'Event updated successfully', severity: 'success' });
            } else {
                await adminEventAPI.createEventWithImages(submitData, imageFiles);
                setSnackbar({ open: true, message: 'Event created successfully', severity: 'success' });
            }
            handleCloseEventDialog();
            await loadEvents();
            await loadStats();
        } catch (error) {
            console.error('Error saving event:', error);
            let errorMessage = 'Failed to save event';
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
            setSnackbar({ open: true, message: errorMessage, severity: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitMuseum = async () => {
        if (!museumFormData.name) {
            setSnackbar({ open: true, message: 'Please enter museum name', severity: 'warning' });
            return;
        }

        setLoading(true);
        try {
            if (editingMuseum) {
                await adminMuseumAPI.updateMuseum(editingMuseum.id, museumFormData);
                setSnackbar({ open: true, message: 'Museum updated successfully', severity: 'success' });
            } else {
                await adminMuseumAPI.createMuseum(museumFormData);
                setSnackbar({ open: true, message: 'Museum created successfully', severity: 'success' });
            }
            handleCloseMuseumDialog();
            await loadMuseums();
            await loadStats();
            await loadMuseumsForDropdown();
        } catch (error) {
            let errorMessage = 'Failed to save museum';
            if (error.response?.data) {
                errorMessage = typeof error.response.data === 'string' ? error.response.data : error.response.data.message || errorMessage;
            } else if (error.message) {
                errorMessage = error.message;
            }
            setSnackbar({ open: true, message: errorMessage, severity: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteEvent = async (eventId) => {
        if (window.confirm('Are you sure you want to delete this event?')) {
            try {
                await adminEventAPI.deleteEvent(eventId);
                setSnackbar({ open: true, message: 'Event deleted successfully', severity: 'success' });
                loadEvents();
                loadStats();
            } catch (error) {
                setSnackbar({ open: true, message: 'Failed to delete event', severity: 'error' });
            }
        }
    };

    const handleDeleteMuseum = async (museumId) => {
        if (window.confirm('Are you sure you want to delete this museum? This will also delete all associated events.')) {
            try {
                await adminMuseumAPI.deleteMuseum(museumId);
                setSnackbar({ open: true, message: 'Museum deleted successfully', severity: 'success' });
                loadMuseums();
                loadEvents();
                loadStats();
                loadMuseumsForDropdown();
            } catch (error) {
                setSnackbar({ open: true, message: 'Failed to delete museum', severity: 'error' });
            }
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

    const getCategoryDisplayName = (categoryValue) => {
        const category = eventCategories.find(cat => cat.value === categoryValue);
        return category ? category.label : categoryValue;
    };

    const handleNextImage = (eventId, totalImages) => {
        setActiveImageIndex(prev => ({
            ...prev,
            [eventId]: ((prev[eventId] || 0) + 1) % totalImages
        }));
    };

    const handlePrevImage = (eventId, totalImages) => {
        setActiveImageIndex(prev => ({
            ...prev,
            [eventId]: ((prev[eventId] || 0) - 1 + totalImages) % totalImages
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
            <GlobalStyles
                styles={{
                    '*::-webkit-scrollbar': { width: '10px', height: '10px' },
                    '*::-webkit-scrollbar-track': { background: '#F5F5F5', borderRadius: '10px' },
                    '*::-webkit-scrollbar-thumb': { background: '#FF9800', borderRadius: '10px', '&:hover': { background: '#FF5722' } },
                }}
            />
            <Box sx={{ minHeight: '100vh', background: '#FFFFFF', color: '#1A2733' }}>
                {/* Header */}
                <Box sx={{
                    position: 'sticky',
                    top: 0,
                    zIndex: 1000,
                    backgroundColor: '#FFFFFF',
                    borderBottom: '1px solid #E8ECF0',
                    px: { xs: 2, sm: 3, md: 4, lg: 6 }
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 1.5, flexWrap: 'wrap', gap: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Box sx={{ width: '45px', height: '45px', borderRadius: '12px', background: 'linear-gradient(135deg, #FF9800 0%, #FF5722 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <AdminIcon sx={{ color: 'white', fontSize: 28 }} />
                            </Box>
                            <Box>
                                <Typography variant="h6" sx={{ fontWeight: 700, color: '#1A2733' }}>Admin Dashboard</Typography>
                                <Typography variant="caption" sx={{ color: '#8A99A8' }}>Manage museums and events</Typography>
                            </Box>
                        </Box>
                        <IconButton onClick={handleMenuOpen} sx={{ background: 'linear-gradient(135deg, #FF9800 0%, #FF5722 100%)', width: '45px', height: '45px' }}>
                            <Typography sx={{ fontWeight: 600, color: 'white' }}>{userInitial}</Typography>
                        </IconButton>
                    </Box>
                </Box>

                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose} PaperProps={{ sx: { bgcolor: '#FFFFFF', color: '#1A2733', minWidth: '200px', borderRadius: '12px' } }}>
                    <MenuItem onClick={() => navigate('/profile')}><PersonIcon sx={{ mr: 2, color: '#FF9800' }} /> Profile</MenuItem>
                    <Divider sx={{ borderColor: '#E8ECF0' }} />
                    <MenuItem onClick={handleLogout}><LogoutIcon sx={{ mr: 2, color: '#f44336' }} /> Logout</MenuItem>
                </Menu>

                {/* Main Content */}
                <Box sx={{ py: { xs: 2, sm: 3, md: 4 }, px: { xs: 2, sm: 3, md: 4, lg: 6 } }}>
                    {/* Stats Cards */}
                    <Box sx={{ width: '100%', mb: 4 }}>
                        <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ width: '100%', m: 0 }}>
                            <Grid item xs={12} sm={6}>
                                <StatCard>
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                                        <Box>
                                            <Typography variant="body2" sx={{ color: '#8A99A8', mb: 1 }}>Total Museums</Typography>
                                            <Typography variant="h3" sx={{ fontWeight: 700, color: '#FF9800', fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' } }}>
                                                {stats.totalMuseums}
                                            </Typography>
                                        </Box>
                                        <Avatar sx={{ bgcolor: alpha('#FF9800', 0.1), width: { xs: 48, sm: 56 }, height: { xs: 48, sm: 56 } }}>
                                            <MuseumIcon sx={{ fontSize: { xs: 28, sm: 32 }, color: '#FF9800' }} />
                                        </Avatar>
                                    </Box>
                                </StatCard>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <StatCard>
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                                        <Box>
                                            <Typography variant="body2" sx={{ color: '#8A99A8', mb: 1 }}>Total Events</Typography>
                                            <Typography variant="h3" sx={{ fontWeight: 700, color: '#4CAF50', fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' } }}>
                                                {stats.totalEvents}
                                            </Typography>
                                        </Box>
                                        <Avatar sx={{ bgcolor: alpha('#4CAF50', 0.1), width: { xs: 48, sm: 56 }, height: { xs: 48, sm: 56 } }}>
                                            <EventIcon sx={{ fontSize: { xs: 28, sm: 32 }, color: '#4CAF50' }} />
                                        </Avatar>
                                    </Box>
                                </StatCard>
                            </Grid>
                        </Grid>
                    </Box>

                    {/* Tabs */}
                    <Box sx={{ borderBottom: '1px solid #E8ECF0', mb: 3 }}>
                        <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)} sx={{ '& .MuiTab-root': { textTransform: 'none', fontWeight: 600 }, '& .Mui-selected': { color: '#FF9800' }, '& .MuiTabs-indicator': { bgcolor: '#FF9800' } }}>
                            <Tab label={`Events (${stats.totalEvents})`} />
                            <Tab label={`Museums (${stats.totalMuseums})`} />
                        </Tabs>
                    </Box>

                    {/* Events Tab */}
                    {activeTab === 0 && (
                        <Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
                                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1A2733' }}>All Events ({events.length})</Typography>
                                <GradientButton startIcon={<AddIcon />} onClick={handleOpenCreateEventDialog}>Add New Event</GradientButton>
                            </Box>

                            {loading ? (
                                <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress sx={{ color: '#FF9800' }} /></Box>
                            ) : events.length === 0 ? (
                                <Box sx={{ textAlign: 'center', py: 8 }}>
                                    <Typography sx={{ color: '#8A99A8' }}>No events found</Typography>
                                    <Button onClick={handleOpenCreateEventDialog} sx={{ mt: 2, color: '#FF9800' }}>Create your first event</Button>
                                </Box>
                            ) : (
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                                    {events.map((event, index) => {
                                        const images = event.imageUrls || [];
                                        const currentIndex = activeImageIndex[event.id] || 0;
                                        const museum = museumsList.find(m => m.id === event.museumId);

                                        return (
                                            <Grow in={true} style={{ transitionDelay: `${index * 50}ms` }} key={event.id}>
                                                <Box>
                                                    <Box sx={{ width: '100%', py: 3 }}>
                                                        <Grid container sx={{ width: '100%', m: 0 }}>
                                                            <Grid item xs={12} md={7}>
                                                                <Box sx={{ pr: { md: 4 } }}>
                                                                    <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2, flexWrap: 'wrap', gap: 2 }}>
                                                                        <Typography variant="h5" sx={{ fontWeight: 700, color: '#1A2733', fontSize: { xs: '1.3rem', sm: '1.5rem', md: '1.8rem' } }}>
                                                                            {event.name}
                                                                        </Typography>
                                                                        <Chip label="● Active" size="small" sx={{ bgcolor: alpha('#4CAF50', 0.1), color: '#4CAF50', fontWeight: 600 }} />
                                                                    </Box>

                                                                    <Typography variant="body1" sx={{ color: '#5A6874', mb: 3, lineHeight: 1.6 }}>
                                                                        {event.description}
                                                                    </Typography>

                                                                    <Grid container spacing={2} sx={{ mb: 3 }}>
                                                                        <Grid item xs={6} sm={4}>
                                                                            <Typography variant="body2" sx={{ color: '#8A99A8', fontSize: '0.75rem', mb: 0.5 }}>Guide Price</Typography>
                                                                            <Typography variant="body1" sx={{ color: '#FF9800', fontWeight: 600 }}>{event.guidePrice?.toLocaleString()} ֏</Typography>
                                                                        </Grid>
                                                                        <Grid item xs={6} sm={4}>
                                                                            <Typography variant="body2" sx={{ color: '#8A99A8', fontSize: '0.75rem', mb: 0.5 }}>Ticket Price</Typography>
                                                                            <Typography variant="body1" sx={{ color: '#4CAF50', fontWeight: 600 }}>{event.ticketPrice?.toLocaleString()} ֏</Typography>
                                                                        </Grid>
                                                                        <Grid item xs={6} sm={4}>
                                                                            <Typography variant="body2" sx={{ color: '#8A99A8', fontSize: '0.75rem', mb: 0.5 }}>Category</Typography>
                                                                            <Typography variant="body1" sx={{ color: '#1A2733' }}>{getCategoryDisplayName(event.eventCategory)}</Typography>
                                                                        </Grid>
                                                                        <Grid item xs={6} sm={4}>
                                                                            <Typography variant="body2" sx={{ color: '#8A99A8', fontSize: '0.75rem', mb: 0.5 }}>Location</Typography>
                                                                            <Typography variant="body1" sx={{ color: '#1A2733' }}>{event.location}</Typography>
                                                                        </Grid>
                                                                        <Grid item xs={6} sm={4}>
                                                                            <Typography variant="body2" sx={{ color: '#8A99A8', fontSize: '0.75rem', mb: 0.5 }}>Museum</Typography>
                                                                            <Typography variant="body1" sx={{ color: '#1A2733' }}>{museum?.name || event.museumName || '-'}</Typography>
                                                                        </Grid>
                                                                        <Grid item xs={6} sm={4}>
                                                                            <Typography variant="body2" sx={{ color: '#8A99A8', fontSize: '0.75rem', mb: 0.5 }}>Event Date</Typography>
                                                                            <Typography variant="body1" sx={{ color: '#1A2733' }}>{dayjs(event.eventDate).format('MMM D, YYYY HH:mm')}</Typography>
                                                                        </Grid>
                                                                    </Grid>

                                                                    {event.duration && (
                                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                                                                            <AccessTimeIcon sx={{ fontSize: 20, color: '#8A99A8' }} />
                                                                            <Typography variant="body1" sx={{ color: '#5A6874' }}>Duration: {event.duration} hours</Typography>
                                                                        </Box>
                                                                    )}

                                                                    {(event.contactEmail || (event.phoneNumbers && event.phoneNumbers.length > 0)) && (
                                                                        <Box sx={{ mt: 2, mb: 2 }}>
                                                                            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#1A2733', mb: 1.5 }}>📞 Contact Information</Typography>
                                                                            {event.contactEmail && (
                                                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                                                                                    <EmailIcon sx={{ fontSize: 18, color: '#8A99A8' }} />
                                                                                    <Typography variant="body2" sx={{ color: '#5A6874' }}>{event.contactEmail}</Typography>
                                                                                </Box>
                                                                            )}
                                                                            {event.phoneNumbers && event.phoneNumbers.length > 0 && (
                                                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5, flexWrap: 'wrap' }}>
                                                                                    <PhoneIcon sx={{ fontSize: 18, color: '#8A99A8' }} />
                                                                                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                                                                        {event.phoneNumbers.map((phone, idx) => (
                                                                                            <Chip key={idx} label={phone} size="small" sx={{ bgcolor: alpha('#FF9800', 0.1), color: '#FF9800' }} />
                                                                                        ))}
                                                                                    </Box>
                                                                                </Box>
                                                                            )}
                                                                        </Box>
                                                                    )}

                                                                    <Divider sx={{ borderColor: '#E8ECF0', my: 2 }} />

                                                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                                                                        <Tooltip title="Edit">
                                                                            <IconButton size="small" onClick={() => handleOpenEditEventDialog(event)} sx={{ color: '#FF9800' }}>
                                                                                <EditIcon fontSize="small" />
                                                                            </IconButton>
                                                                        </Tooltip>
                                                                        <Tooltip title="Delete">
                                                                            <IconButton size="small" onClick={() => handleDeleteEvent(event.id)} sx={{ color: '#f44336' }}>
                                                                                <DeleteIcon fontSize="small" />
                                                                            </IconButton>
                                                                        </Tooltip>
                                                                    </Box>
                                                                </Box>
                                                            </Grid>

                                                            <Grid item xs={12} md={5}>
                                                                <Box sx={{ height: '100%', minHeight: { xs: '250px', sm: '300px', md: '320px' }, background: '#FFFFFF', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                                                                    {images.length > 0 ? (
                                                                        <>
                                                                            <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF', borderRadius: '12px', overflow: 'hidden', position: 'relative', minHeight: { xs: '250px', sm: '300px', md: '320px' } }}>
                                                                                <ServiceImage src={images[currentIndex]} alt={`${event.name} - ${currentIndex + 1}`} />
                                                                            </Box>
                                                                            {images.length > 1 && (
                                                                                <>
                                                                                    <IconButton onClick={() => handlePrevImage(event.id, images.length)} size="small" sx={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', backgroundColor: alpha('#000000', 0.5), color: 'white', '&:hover': { backgroundColor: alpha('#000000', 0.7) }, zIndex: 1 }}>
                                                                                        <ChevronLeftIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />
                                                                                    </IconButton>
                                                                                    <IconButton onClick={() => handleNextImage(event.id, images.length)} size="small" sx={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', backgroundColor: alpha('#000000', 0.5), color: 'white', '&:hover': { backgroundColor: alpha('#000000', 0.7) }, zIndex: 1 }}>
                                                                                        <ChevronRightIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />
                                                                                    </IconButton>
                                                                                    <Box sx={{ position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 0.5, zIndex: 1, backgroundColor: alpha('#000000', 0.5), padding: '3px 6px', borderRadius: '16px' }}>
                                                                                        {images.map((_, idx) => (
                                                                                            <Box key={idx} onClick={() => setActiveImageIndex(prev => ({ ...prev, [event.id]: idx }))} sx={{ width: { xs: 5, sm: 6 }, height: { xs: 5, sm: 6 }, borderRadius: '50%', backgroundColor: idx === currentIndex ? '#FF9800' : 'white', cursor: 'pointer' }} />
                                                                                        ))}
                                                                                    </Box>
                                                                                    <Chip label={`${currentIndex + 1} / ${images.length}`} size="small" sx={{ position: 'absolute', top: 8, right: 8, bgcolor: alpha('#000000', 0.7), color: 'white', fontWeight: 500, fontSize: '0.65rem', height: 20, zIndex: 1 }} />
                                                                                </>
                                                                            )}
                                                                        </>
                                                                    ) : (
                                                                        <Box sx={{ textAlign: 'center', p: { xs: 2, sm: 3 } }}>
                                                                            <ImageIcon sx={{ fontSize: { xs: 50, sm: 80 }, color: alpha('#FF9800', 0.3), mb: 1 }} />
                                                                            <Typography variant="body2" sx={{ color: '#8A99A8' }}>No images available</Typography>
                                                                        </Box>
                                                                    )}
                                                                </Box>
                                                            </Grid>
                                                        </Grid>
                                                    </Box>
                                                    {index < events.length - 1 && <Divider sx={{ borderColor: '#E8ECF0' }} />}
                                                </Box>
                                            </Grow>
                                        );
                                    })}
                                </Box>
                            )}

                            {eventsTotalPages > 1 && (
                                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                                    <Pagination count={eventsTotalPages} page={eventsPage + 1} onChange={(e, newPage) => setEventsPage(newPage - 1)} sx={{ '& .MuiPaginationItem-root': { color: '#5A6874', borderRadius: '12px' }, '& .Mui-selected': { bgcolor: '#FF9800 !important', color: 'white' } }} />
                                </Box>
                            )}
                        </Box>
                    )}

                    {/* Museums Tab */}
                    {activeTab === 1 && (
                        <Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
                                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1A2733' }}>All Museums ({museums.length})</Typography>
                                <GradientButton startIcon={<AddIcon />} onClick={handleOpenCreateMuseumDialog}>Add New Museum</GradientButton>
                            </Box>

                            {loading ? (
                                <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress sx={{ color: '#FF9800' }} /></Box>
                            ) : museums.length === 0 ? (
                                <Box sx={{ textAlign: 'center', py: 8 }}>
                                    <Typography sx={{ color: '#8A99A8' }}>No museums found</Typography>
                                    <Button onClick={handleOpenCreateMuseumDialog} sx={{ mt: 2, color: '#FF9800' }}>Create your first museum</Button>
                                </Box>
                            ) : (
                                <Grid container spacing={3}>
                                    {museums.map((museum) => (
                                        <Grid item xs={12} sm={6} md={4} key={museum.id}>
                                            <Card sx={{ borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', '&:hover': { transform: 'translateY(-4px)', transition: 'all 0.3s ease' } }}>
                                                <CardContent>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                                                        <Avatar sx={{ bgcolor: alpha('#FF9800', 0.1), width: 48, height: 48 }}>
                                                            <MuseumIcon sx={{ color: '#FF9800' }} />
                                                        </Avatar>
                                                        <Box>
                                                            <Tooltip title="Edit">
                                                                <IconButton size="small" onClick={() => handleOpenEditMuseumDialog(museum)} sx={{ color: '#FF9800' }}>
                                                                    <EditIcon fontSize="small" />
                                                                </IconButton>
                                                            </Tooltip>
                                                            <Tooltip title="Delete">
                                                                <IconButton size="small" onClick={() => handleDeleteMuseum(museum.id)} sx={{ color: '#f44336' }}>
                                                                    <DeleteIcon fontSize="small" />
                                                                </IconButton>
                                                            </Tooltip>
                                                        </Box>
                                                    </Box>
                                                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#1A2733', mb: 1 }}>{museum.name}</Typography>
                                                    <Typography variant="body2" sx={{ color: '#8A99A8' }}>ID: {museum.id}</Typography>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    ))}
                                </Grid>
                            )}

                            {museumsTotalPages > 1 && (
                                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                                    <Pagination count={museumsTotalPages} page={museumsPage + 1} onChange={(e, newPage) => setMuseumsPage(newPage - 1)} sx={{ '& .MuiPaginationItem-root': { color: '#5A6874', borderRadius: '12px' }, '& .Mui-selected': { bgcolor: '#FF9800 !important', color: 'white' } }} />
                                </Box>
                            )}
                        </Box>
                    )}
                </Box>

                {/* Event Dialog */}
                <Dialog open={eventDialogOpen} onClose={handleCloseEventDialog} maxWidth="lg" fullWidth PaperProps={{ sx: { bgcolor: '#FFFFFF', borderRadius: '20px', border: 'none' } }}>
                    <DialogTitle sx={{ borderBottom: 'none', pb: 2, pt: 3, px: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {editingEvent ? <EditIcon sx={{ color: '#FF9800' }} /> : <AddIcon sx={{ color: '#FF9800' }} />}
                            <Typography variant="h5" sx={{ fontWeight: 600, color: '#1A2733' }}>{editingEvent ? 'Edit Event' : 'Create New Event'}</Typography>
                        </Box>
                        <IconButton onClick={handleCloseEventDialog} sx={{ position: 'absolute', right: 16, top: 16, color: '#8A99A8' }}><CloseIcon /></IconButton>
                    </DialogTitle>
                    <DialogContent sx={{ p: { xs: 2, sm: 3 } }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                            <FlatTextField fullWidth label="Event Name" name="name" value={eventFormData.name} onChange={handleEventInputChange} required variant="outlined" />
                            <FlatTextField fullWidth multiline rows={4} label="Description" name="description" value={eventFormData.description} onChange={handleEventInputChange} required variant="outlined" />

                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth required variant="outlined">
                                        <InputLabel>Event Category</InputLabel>
                                        <FlatSelect name="eventCategory" value={eventFormData.eventCategory} onChange={handleEventInputChange} label="Event Category">
                                            <MenuItem value="">Select Category</MenuItem>
                                            {eventCategories.map(cat => <MenuItem key={cat.value} value={cat.value}>{cat.label}</MenuItem>)}
                                        </FlatSelect>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth variant="outlined">
                                        <InputLabel>Event Type</InputLabel>
                                        <FlatSelect name="eventType" value={eventFormData.eventType} onChange={handleEventInputChange} label="Event Type">
                                            {eventTypes.map(type => <MenuItem key={type.value} value={type.value}>{type.label}</MenuItem>)}
                                        </FlatSelect>
                                    </FormControl>
                                </Grid>
                            </Grid>

                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth required variant="outlined">
                                        <InputLabel>Museum</InputLabel>
                                        <FlatSelect name="museumId" value={eventFormData.museumId} onChange={handleEventInputChange} label="Museum">
                                            <MenuItem value="">Select Museum</MenuItem>
                                            {museumsList.map(museum => <MenuItem key={museum.id} value={museum.id}>{museum.name}</MenuItem>)}
                                        </FlatSelect>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth required variant="outlined">
                                        <InputLabel>City</InputLabel>
                                        <FlatSelect name="location" value={eventFormData.location} onChange={handleEventInputChange} label="City">
                                            <MenuItem value="">Select City</MenuItem>
                                            {ARMENIAN_CITIES.map(city => <MenuItem key={city.value} value={city.value}>{city.label}</MenuItem>)}
                                        </FlatSelect>
                                    </FormControl>
                                </Grid>
                            </Grid>

                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <FlatTextField fullWidth type="number" label="Guide Price (AMD)" name="guidePrice" value={eventFormData.guidePrice} onChange={handleEventInputChange} required InputProps={{ startAdornment: <InputAdornment position="start">֏</InputAdornment> }} />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <FlatTextField fullWidth type="number" label="Ticket Price (AMD)" name="ticketPrice" value={eventFormData.ticketPrice} onChange={handleEventInputChange} required InputProps={{ startAdornment: <InputAdornment position="start">֏</InputAdornment> }} />
                                </Grid>
                            </Grid>

                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <DateTimePicker
                                        label="Event Date & Time"
                                        value={eventFormData.eventDate}
                                        onChange={(newValue) => setEventFormData(prev => ({ ...prev, eventDate: newValue }))}
                                        slotProps={{
                                            textField: {
                                                fullWidth: true,
                                                sx: { '& .MuiOutlinedInput-root': { backgroundColor: '#F5F7FA', borderRadius: '8px' } }
                                            }
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <FlatTextField fullWidth type="number" label="Duration (hours)" name="duration" value={eventFormData.duration} onChange={handleEventInputChange} />
                                </Grid>
                            </Grid>

                            <Box>
                                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1A2733', mb: 2 }}>📞 Contact Information (Optional)</Typography>
                                <FlatTextField fullWidth type="email" label="Contact Email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} size="small" sx={{ mb: 2 }} />
                                <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                                    <FlatTextField size="small" placeholder="Enter 8-digit number (e.g., 99123456)" value={newPhoneNumber} onChange={(e) => { setNewPhoneNumber(e.target.value); setPhoneError(''); }} error={!!phoneError} helperText={phoneError} sx={{ flex: 1, minWidth: '180px' }} />
                                    <GradientButton onClick={handleAddPhoneNumber} sx={{ minWidth: '80px', py: 1 }}>Add</GradientButton>
                                </Box>
                                {phoneNumbersList.length > 0 && (
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                        {phoneNumbersList.map((phone, idx) => <Chip key={idx} label={`📞 ${phone}`} onDelete={() => handleRemovePhoneNumber(idx)} sx={{ bgcolor: alpha('#FF9800', 0.1), color: '#FF9800' }} />)}
                                    </Box>
                                )}
                            </Box>

                            <Box>
                                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1A2733', mb: 2 }}>🖼️ Event Images (Optional)</Typography>
                                <OutlinedButton component="label" startIcon={<UploadIcon />} fullWidth sx={{ height: '56px', borderColor: '#E0E4E8', color: '#5A6874', backgroundColor: '#F5F7FA' }}>
                                    Choose Images
                                    <input type="file" multiple accept="image/*" onChange={handleImageSelect} style={{ display: 'none' }} ref={fileInputRef} />
                                </OutlinedButton>
                                {existingImages.length > 0 && (
                                    <Box sx={{ mt: 2 }}>
                                        <Typography variant="body2" sx={{ color: '#8A99A8', mb: 1 }}>Current Images:</Typography>
                                        <ImageList cols={3} rowHeight={100}>
                                            {existingImages.map((url, index) => (
                                                <ImageListItem key={index} sx={{ position: 'relative', borderRadius: '8px', overflow: 'hidden' }}>
                                                    <img src={url} alt={`Existing ${index}`} style={{ height: 100, objectFit: 'cover', width: '100%' }} />
                                                    <IconButton size="small" onClick={() => handleRemoveExistingImage(index)} sx={{ position: 'absolute', top: 5, right: 5, bgcolor: alpha('#000000', 0.6) }}><DeleteOutlineIcon sx={{ fontSize: 16, color: 'white' }} /></IconButton>
                                                </ImageListItem>
                                            ))}
                                        </ImageList>
                                    </Box>
                                )}
                                {imagePreviews.length > 0 && (
                                    <Box sx={{ mt: 2 }}>
                                        <Typography variant="body2" sx={{ color: '#8A99A8', mb: 1 }}>New Images:</Typography>
                                        <ImageList cols={3} rowHeight={100}>
                                            {imagePreviews.map((preview, index) => (
                                                <ImageListItem key={index} sx={{ position: 'relative', borderRadius: '8px', overflow: 'hidden' }}>
                                                    <img src={preview} alt={`Preview ${index}`} style={{ height: 100, objectFit: 'cover', width: '100%' }} />
                                                    <IconButton size="small" onClick={() => handleRemoveNewImage(index)} sx={{ position: 'absolute', top: 5, right: 5, bgcolor: alpha('#000000', 0.6) }}><DeleteOutlineIcon sx={{ fontSize: 16, color: 'white' }} /></IconButton>
                                                </ImageListItem>
                                            ))}
                                        </ImageList>
                                    </Box>
                                )}
                            </Box>
                        </Box>
                    </DialogContent>
                    <DialogActions sx={{ p: { xs: 2, sm: 3 }, borderTop: 'none', flexWrap: 'wrap', gap: 1 }}>
                        <OutlinedButton onClick={handleCloseEventDialog}>Cancel</OutlinedButton>
                        <GradientButton onClick={handleSubmitEvent} disabled={loading}>{loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : (editingEvent ? 'Update Event' : 'Create Event')}</GradientButton>
                    </DialogActions>
                </Dialog>

                {/* Museum Dialog */}
                <Dialog open={museumDialogOpen} onClose={handleCloseMuseumDialog} maxWidth="sm" fullWidth PaperProps={{ sx: { bgcolor: '#FFFFFF', borderRadius: '20px', border: 'none' } }}>
                    <DialogTitle sx={{ borderBottom: 'none', pb: 2, pt: 3, px: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {editingMuseum ? <EditIcon sx={{ color: '#FF9800' }} /> : <AddIcon sx={{ color: '#FF9800' }} />}
                            <Typography variant="h5" sx={{ fontWeight: 600, color: '#1A2733' }}>{editingMuseum ? 'Edit Museum' : 'Create New Museum'}</Typography>
                        </Box>
                        <IconButton onClick={handleCloseMuseumDialog} sx={{ position: 'absolute', right: 16, top: 16, color: '#8A99A8' }}><CloseIcon /></IconButton>
                    </DialogTitle>
                    <DialogContent sx={{ p: { xs: 2, sm: 3 } }}>
                        <FlatTextField fullWidth label="Museum Name" name="name" value={museumFormData.name} onChange={handleMuseumInputChange} required variant="outlined" sx={{ mt: 1 }} />
                    </DialogContent>
                    <DialogActions sx={{ p: { xs: 2, sm: 3 }, borderTop: 'none', gap: 1 }}>
                        <OutlinedButton onClick={handleCloseMuseumDialog}>Cancel</OutlinedButton>
                        <GradientButton onClick={handleSubmitMuseum} disabled={loading}>{loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : (editingMuseum ? 'Update Museum' : 'Create Museum')}</GradientButton>
                    </DialogActions>
                </Dialog>

                {/* Snackbar */}
                <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
                    <Alert severity={snackbar.severity} sx={{ bgcolor: '#FFFFFF', color: '#1A2733', border: `1px solid ${snackbar.severity === 'success' ? '#4CAF50' : '#f44336'}`, borderRadius: '12px' }}>{snackbar.message}</Alert>
                </Snackbar>
            </Box>
        </LocalizationProvider>
    );
};

export default AdminDashboardPage;