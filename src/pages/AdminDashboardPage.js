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
    FormControlLabel,
    InputAdornment,
    Tooltip,
    Backdrop,
    FormControl,
    InputLabel,
    Select,
    ImageList,
    ImageListItem,
    Grow,
    GlobalStyles,
    Pagination
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Close as CloseIcon,
    Image as ImageIcon,
    Logout as LogoutIcon,
    Person as PersonIcon,
    AdminPanelSettings as AdminIcon,
    CloudUpload as UploadIcon,
    DeleteOutline as DeleteOutlineIcon,
    AccessTime as AccessTimeIcon,
    ChevronLeft as ChevronLeftIcon,
    ChevronRight as ChevronRightIcon,
    Phone as PhoneIcon,
    Email as EmailIcon,
    Museum as MuseumIcon,
    Event as EventIcon,
    LocationOn as LocationIcon,
    Category as CategoryIcon,
    CalendarToday as CalendarIcon,
    MonetizationOn as MoneyIcon,
    LocalOffer as TicketIcon,
    AttachMoney as PriceIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { alpha, styled } from '@mui/material/styles';
import { adminMuseumAPI, adminEventAPI, adminStatsAPI } from '../services/adminAPI';
import { isAdmin } from '../utils/jwtUtils';

const GradientButton = styled(Button)(({ theme }) => ({
    background: 'linear-gradient(135deg, #FF9800 0%, #FF5722 100%)',
    borderRadius: '12px',
    padding: '10px 24px',
    fontWeight: 600,
    textTransform: 'none',
    color: '#FFFFFF',
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
    border: '1px solid #D4A574',
    color: '#5A3A2A',
    '&:hover': {
        borderColor: '#FF9800',
        backgroundColor: alpha('#FF9800', 0.1)
    }
}));

const StatCard = styled(Paper)(({ theme }) => ({
    background: '#FFF8F0',
    borderRadius: '20px',
    padding: '24px',
    border: 'none',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
    '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 12px 28px rgba(255, 152, 0, 0.15)'
    }
}));

const FlatTextField = styled(TextField)(({ theme }) => ({
    '& .MuiOutlinedInput-root': {
        backgroundColor: '#FFF8F0',
        borderRadius: '8px',
        '& fieldset': { border: 'none' },
        '&:hover': { backgroundColor: '#FFEFE0' },
        '&.Mui-focused': {
            backgroundColor: '#FFEFE0',
            boxShadow: '0 0 0 2px rgba(255, 152, 0, 0.2)',
        }
    },
    '& .MuiInputLabel-root': {
        color: '#5A3A2A',
        '&.Mui-focused': { color: '#FF9800' }
    },
    '& .MuiOutlinedInput-input': {
        color: '#3D2A1A',
        fontWeight: 500
    }
}));

const FlatSelect = styled(Select)(({ theme }) => ({
    backgroundColor: '#FFF8F0',
    borderRadius: '8px',
    '&:hover': { backgroundColor: '#FFEFE0' },
    '&.Mui-focused': {
        backgroundColor: '#FFEFE0',
        boxShadow: '0 0 0 2px rgba(255, 152, 0, 0.2)',
    },
    '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
    '& .MuiSelect-select': {
        color: '#3D2A1A',
        fontWeight: 500
    }
}));

const ServiceImage = styled('img')({
    maxWidth: '100%',
    maxHeight: '100%',
    width: 'auto',
    height: 'auto',
    objectFit: 'contain',
    borderRadius: '12px'
});

const InfoCard = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 12px',
    backgroundColor: '#FFF8F0',
    borderRadius: '12px',
    border: '1px solid #D4A574',
}));

const InfoLabel = styled(Typography)(({ theme }) => ({
    color: '#8B6914',
    fontSize: '0.7rem',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
}));

const InfoValue = styled(Typography)(({ theme }) => ({
    color: '#3D2A1A',
    fontSize: '0.95rem',
    fontWeight: 700
}));

const DetailItem = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '12px',
    '&:last-child': { marginBottom: 0 }
}));

const DetailIcon = styled(Box)(({ theme }) => ({
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: alpha('#FF9800', 0.15),
    borderRadius: '10px',
    color: '#FF9800'
}));

const DetailText = styled(Box)(({ theme }) => ({
    flex: 1,
    '& .label': {
        fontSize: '0.7rem',
        color: '#8B6914',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        marginBottom: '2px'
    },
    '& .value': {
        fontSize: '0.9rem',
        color: '#3D2A1A',
        fontWeight: 700
    }
}));

const ARMENIAN_CITIES = [
    { value: 'YEREVAN', label: 'Yerevan' },
    { value: 'GYUMRI', label: 'Gyumri' },
    { value: 'VANADZOR', label: 'Vanadzor' },
    { value: 'VAGHARSHAPAT', label: 'Vagharshapat' },
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

const eventTypes = [
    { value: 'MOBILE', label: '📱 Mobile' }
];

// Helper function to parse date from backend
const parseEventDate = (dateValue) => {
    if (!dateValue) return dayjs();
    if (dayjs.isDayjs(dateValue)) return dateValue;
    if (typeof dateValue === 'string') {
        const parsed = dayjs(dateValue);
        return parsed.isValid() ? parsed : dayjs();
    }
    if (Array.isArray(dateValue) && dateValue.length >= 3) {
        const [year, month, day, hour = 0, minute = 0] = dateValue;
        const parsed = dayjs(new Date(year, month - 1, day, hour, minute));
        return parsed.isValid() ? parsed : dayjs();
    }
    if (dateValue instanceof Date) {
        const parsed = dayjs(dateValue);
        return parsed.isValid() ? parsed : dayjs();
    }
    return dayjs();
};

const formatEventDate = (dateValue) => {
    if (!dateValue) return 'Date not set';
    const parsed = parseEventDate(dateValue);
    return parsed.isValid() ? parsed.format('MMM D, YYYY HH:mm') : 'Invalid date';
};

const AdminDashboardPage = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState(0);
    const [events, setEvents] = useState([]);
    const [eventsPage, setEventsPage] = useState(0);
    const [eventsTotalPages, setEventsTotalPages] = useState(0);
    const [museums, setMuseums] = useState([]);
    const [museumsPage, setMuseumsPage] = useState(0);
    const [museumsTotalPages, setMuseumsTotalPages] = useState(0);
    const [stats, setStats] = useState({ totalMuseums: 0, totalEvents: 0 });
    const [eventDialogOpen, setEventDialogOpen] = useState(false);
    const [museumDialogOpen, setMuseumDialogOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);
    const [editingMuseum, setEditingMuseum] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [anchorEl, setAnchorEl] = useState(null);
    const [userInitial, setUserInitial] = useState('');
    const [activeImageIndex, setActiveImageIndex] = useState({});
    const [imageFiles, setImageFiles] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [existingImages, setExistingImages] = useState([]);
    const fileInputRef = useRef(null);
    const [phoneNumbersList, setPhoneNumbersList] = useState([]);
    const [contactEmail, setContactEmail] = useState('');
    const [newPhoneNumber, setNewPhoneNumber] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const [museumsList, setMuseumsList] = useState([]);

    const [eventFormData, setEventFormData] = useState({
        name: '', description: '', eventCategory: '', eventType: 'MOBILE',
        eventDate: dayjs(), guidePrice: '', ticketPrice: '', location: '', duration: '', museumId: ''
    });

    const [museumFormData, setMuseumFormData] = useState({ name: '' });

    const validateArmenianPhone = (phone) => /^[0-9]{8}$/.test(phone);

    const handleAddPhoneNumber = () => {
        if (!newPhoneNumber.trim()) {
            setPhoneError('Please enter a phone number');
            return;
        }
        if (!validateArmenianPhone(newPhoneNumber.trim())) {
            setPhoneError('Phone number must be exactly 8 digits');
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
        setPhoneNumbersList(phoneNumbersList.filter((_, i) => i !== index));
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token || !isAdmin(token)) {
            navigate('/admin/auth');
            return;
        }
        if (user?.userName) {
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
            const eventsData = response.data.content || [];
            setEvents(eventsData);
            setEventsTotalPages(response.data.totalPages || 0);
            const newIndices = {};
            eventsData.forEach(event => {
                newIndices[event.id] = 0;
            });
            setActiveImageIndex(newIndices);
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
            setStats({
                totalMuseums: response.data.totalMuseums || 0,
                totalEvents: response.data.totalEvents || 0
            });
        } catch (error) {
            console.error('Error loading stats:', error);
        }
    };

    const loadMuseumsForDropdown = async () => {
        try {
            const response = await adminMuseumAPI.getAllMuseums(0, 100);
            setMuseumsList(response.data.content || []);
        } catch (error) {
            console.error('Error loading museums:', error);
        }
    };

    const handleOpenCreateEventDialog = () => {
        setEditingEvent(null);
        setEventFormData({
            name: '', description: '', eventCategory: '', eventType: 'MOBILE',
            eventDate: dayjs(), guidePrice: '', ticketPrice: '', location: '', duration: '', museumId: ''
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
            eventDate: parseEventDate(event.eventDate),
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
        setImageFiles([...imageFiles, ...validFiles]);
        const newPreviews = validFiles.map(file => URL.createObjectURL(file));
        setImagePreviews([...imagePreviews, ...newPreviews]);
    };

    const handleRemoveNewImage = (index) => {
        setImageFiles(imageFiles.filter((_, i) => i !== index));
        setImagePreviews(imagePreviews.filter((_, i) => i !== index));
    };

    const handleRemoveExistingImage = (index) => {
        setExistingImages(existingImages.filter((_, i) => i !== index));
    };

    const handleSubmitEvent = async () => {
        if (!eventFormData.name || !eventFormData.description || !eventFormData.eventCategory ||
            !eventFormData.location || !eventFormData.guidePrice || !eventFormData.ticketPrice || !eventFormData.museumId) {
            setSnackbar({ open: true, message: 'Please fill all required fields', severity: 'warning' });
            return;
        }

        setLoading(true);
        try {
            let formattedDate;
            if (eventFormData.eventDate) {
                if (typeof eventFormData.eventDate === 'string') {
                    formattedDate = eventFormData.eventDate;
                } else if (eventFormData.eventDate.format) {
                    formattedDate = eventFormData.eventDate.format('YYYY-MM-DDTHH:mm:ss');
                } else {
                    formattedDate = dayjs(eventFormData.eventDate).format('YYYY-MM-DDTHH:mm:ss');
                }
            } else {
                formattedDate = dayjs().format('YYYY-MM-DDTHH:mm:ss');
            }

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

            if (editingEvent) {
                await adminEventAPI.updateEventWithImages(
                    editingEvent.id,
                    submitData,
                    imageFiles,
                    existingImages
                );
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
                errorMessage = typeof error.response.data === 'string' ? error.response.data : error.response.data.message || errorMessage;
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
            setSnackbar({ open: true, message: 'Failed to save museum', severity: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteEvent = async (eventId) => {
        if (window.confirm('Are you sure you want to delete this event?')) {
            try {
                await adminEventAPI.deleteEvent(eventId);
                setSnackbar({ open: true, message: 'Event deleted successfully', severity: 'success' });
                await loadEvents();
                await loadStats();
            } catch (error) {
                setSnackbar({ open: true, message: 'Failed to delete event', severity: 'error' });
            }
        }
    };

    const handleDeleteMuseum = async (museumId) => {
        if (window.confirm('Delete this museum? This will also delete all associated events.')) {
            try {
                await adminMuseumAPI.deleteMuseum(museumId);
                setSnackbar({ open: true, message: 'Museum deleted successfully', severity: 'success' });
                await loadMuseums();
                await loadEvents();
                await loadStats();
                await loadMuseumsForDropdown();
            } catch (error) {
                setSnackbar({ open: true, message: 'Failed to delete museum', severity: 'error' });
            }
        }
    };

    const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);
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
            <Backdrop open={true} sx={{ zIndex: 9999, backgroundColor: 'rgba(210, 180, 140, 0.9)' }}>
                <CircularProgress sx={{ color: '#FF9800' }} />
            </Backdrop>
        );
    }

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <GlobalStyles styles={{
                'body': { backgroundColor: '#F5E6D3' },
                '*::-webkit-scrollbar': { width: '10px' },
                '*::-webkit-scrollbar-track': { background: '#E8D5B7' },
                '*::-webkit-scrollbar-thumb': { background: '#FF9800', borderRadius: '10px' },
                '*::-webkit-scrollbar-thumb:hover': { background: '#FF5722' }
            }} />
            <Box sx={{ minHeight: '100vh', background: '#F5E6D3' }}>
                {/* Header */}
                <Box sx={{
                    position: 'sticky',
                    top: 0,
                    zIndex: 1000,
                    backgroundColor: '#FFF8F0',
                    borderBottom: '1px solid #D4A574',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                    px: { xs: 2, sm: 3, md: 4, lg: 6 }
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 1.5, flexWrap: 'wrap', gap: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Box sx={{ width: '45px', height: '45px', borderRadius: '12px', background: 'linear-gradient(135deg, #FF9800 0%, #FF5722 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <AdminIcon sx={{ color: 'white', fontSize: 28 }} />
                            </Box>
                            <Box>
                                <Typography variant="h6" sx={{ fontWeight: 700, color: '#3D2A1A' }}>Admin Dashboard</Typography>
                                <Typography variant="caption" sx={{ color: '#8B6914' }}>Manage museums and events</Typography>
                            </Box>
                        </Box>
                        <IconButton onClick={handleMenuOpen} sx={{ background: 'linear-gradient(135deg, #FF9800 0%, #FF5722 100%)', width: '45px', height: '45px' }}>
                            <Typography sx={{ fontWeight: 600, color: 'white' }}>{userInitial}</Typography>
                        </IconButton>
                    </Box>
                </Box>

                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose} PaperProps={{ sx: { bgcolor: '#FFF8F0', color: '#3D2A1A', minWidth: '200px', borderRadius: '12px' } }}>
                    <MenuItem onClick={() => navigate('/profile')}><PersonIcon sx={{ mr: 2, color: '#FF9800' }} /> Profile</MenuItem>
                    <Divider sx={{ borderColor: '#D4A574' }} />
                    <MenuItem onClick={handleLogout}><LogoutIcon sx={{ mr: 2, color: '#f44336' }} /> Logout</MenuItem>
                </Menu>

                {/* Main Content */}
                <Box sx={{ py: { xs: 2, sm: 3, md: 4 }, px: { xs: 2, sm: 3, md: 4, lg: 6 } }}>
                    {/* Stats Cards */}
                    <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mb: 4 }}>
                        <Grid item xs={12} sm={6}>
                            <StatCard>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Box>
                                        <Typography variant="body2" sx={{ color: '#8B6914', mb: 1, fontWeight: 600 }}>Total Museums</Typography>
                                        <Typography variant="h3" sx={{ fontWeight: 700, color: '#FF9800' }}>{stats.totalMuseums}</Typography>
                                    </Box>
                                    <Avatar sx={{ bgcolor: alpha('#FF9800', 0.15), width: 56, height: 56 }}>
                                        <MuseumIcon sx={{ fontSize: 32, color: '#FF9800' }} />
                                    </Avatar>
                                </Box>
                            </StatCard>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <StatCard>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Box>
                                        <Typography variant="body2" sx={{ color: '#8B6914', mb: 1, fontWeight: 600 }}>Total Events</Typography>
                                        <Typography variant="h3" sx={{ fontWeight: 700, color: '#4CAF50' }}>{stats.totalEvents}</Typography>
                                    </Box>
                                    <Avatar sx={{ bgcolor: alpha('#4CAF50', 0.15), width: 56, height: 56 }}>
                                        <EventIcon sx={{ fontSize: 32, color: '#4CAF50' }} />
                                    </Avatar>
                                </Box>
                            </StatCard>
                        </Grid>
                    </Grid>

                    {/* Tabs */}
                    <Box sx={{ borderBottom: '1px solid #D4A574', mb: 3 }}>
                        <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)}>
                            <Tab label={`Events (${stats.totalEvents})`} sx={{ textTransform: 'none', fontWeight: 600, color: '#3D2A1A', '&.Mui-selected': { color: '#FF9800' } }} />
                            <Tab label={`Museums (${stats.totalMuseums})`} sx={{ textTransform: 'none', fontWeight: 600, color: '#3D2A1A', '&.Mui-selected': { color: '#FF9800' } }} />
                        </Tabs>
                    </Box>

                    {/* Events Tab */}
                    {activeTab === 0 && (
                        <Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
                                <Typography variant="h6" sx={{ fontWeight: 700, color: '#3D2A1A' }}>All Events ({events.length})</Typography>
                                <GradientButton startIcon={<AddIcon />} onClick={handleOpenCreateEventDialog}>Add New Event</GradientButton>
                            </Box>

                            {loading ? (
                                <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress sx={{ color: '#FF9800' }} /></Box>
                            ) : events.length === 0 ? (
                                <Box sx={{ textAlign: 'center', py: 8 }}>
                                    <Typography sx={{ color: '#8B6914' }}>No events found</Typography>
                                    <Button onClick={handleOpenCreateEventDialog} sx={{ mt: 2, color: '#FF9800' }}>Create your first event</Button>
                                </Box>
                            ) : (
                                <Box>
                                    {events.map((event, index) => {
                                        const images = event.imageUrls || [];
                                        const currentIndex = activeImageIndex[event.id] || 0;
                                        const museum = museumsList.find(m => m.id === event.museumId);

                                        return (
                                            <Grow in={true} key={event.id}>
                                                <Box sx={{
                                                    py: 3,
                                                    borderBottom: index < events.length - 1 ? '1px solid #D4A574' : 'none',
                                                    backgroundColor: index % 2 === 0 ? 'transparent' : alpha('#FFF8F0', 0.5),
                                                    borderRadius: '16px'
                                                }}>
                                                    <Grid container spacing={3}>
                                                        {/* Images Carousel */}
                                                        <Grid item xs={12} md={5}>
                                                            <Box sx={{
                                                                position: 'relative',
                                                                minHeight: 280,
                                                                bgcolor: '#FFF8F0',
                                                                borderRadius: '16px',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                overflow: 'hidden',
                                                                border: '1px solid #D4A574'
                                                            }}>
                                                                {images.length > 0 ? (
                                                                    <>
                                                                        <ServiceImage src={images[currentIndex]} alt={event.name} />
                                                                        {images.length > 1 && (
                                                                            <>
                                                                                <IconButton onClick={() => handlePrevImage(event.id, images.length)} sx={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', bgcolor: alpha('#000', 0.5), color: 'white', '&:hover': { bgcolor: alpha('#000', 0.7) } }}>
                                                                                    <ChevronLeftIcon />
                                                                                </IconButton>
                                                                                <IconButton onClick={() => handleNextImage(event.id, images.length)} sx={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', bgcolor: alpha('#000', 0.5), color: 'white', '&:hover': { bgcolor: alpha('#000', 0.7) } }}>
                                                                                    <ChevronRightIcon />
                                                                                </IconButton>
                                                                                <Chip label={`${currentIndex + 1}/${images.length}`} size="small" sx={{ position: 'absolute', bottom: 8, right: 8, bgcolor: alpha('#000', 0.7), color: 'white' }} />
                                                                            </>
                                                                        )}
                                                                    </>
                                                                ) : (
                                                                    <Box sx={{ textAlign: 'center' }}>
                                                                        <ImageIcon sx={{ fontSize: 60, color: alpha('#FF9800', 0.3) }} />
                                                                        <Typography variant="body2" sx={{ color: '#8B6914', mt: 1 }}>No images</Typography>
                                                                    </Box>
                                                                )}
                                                            </Box>
                                                        </Grid>

                                                        {/* Event Details */}
                                                        <Grid item xs={12} md={7}>
                                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2, flexWrap: 'wrap', gap: 1 }}>
                                                                <Typography variant="h5" sx={{ fontWeight: 700, color: '#3D2A1A' }}>{event.name}</Typography>
                                                                <Chip label="Active" size="small" sx={{ bgcolor: alpha('#4CAF50', 0.15), color: '#2E7D32', fontWeight: 600 }} />
                                                            </Box>
                                                            <Typography variant="body2" sx={{ color: '#5A3A2A', mb: 3, lineHeight: 1.6 }}>{event.description}</Typography>

                                                            {/* Details with Icons - New Design */}
                                                            <Box sx={{ mb: 3 }}>
                                                                <Grid container spacing={2}>
                                                                    <Grid item xs={12} sm={6}>
                                                                        <DetailItem>
                                                                            <DetailIcon>
                                                                                <PriceIcon sx={{ fontSize: 18 }} />
                                                                            </DetailIcon>
                                                                            <DetailText>
                                                                                <div className="label">Guide Price</div>
                                                                                <div className="value" style={{ color: '#FF9800' }}>{event.guidePrice?.toLocaleString()} ֏</div>
                                                                            </DetailText>
                                                                        </DetailItem>
                                                                    </Grid>
                                                                    <Grid item xs={12} sm={6}>
                                                                        <DetailItem>
                                                                            <DetailIcon>
                                                                                <TicketIcon sx={{ fontSize: 18 }} />
                                                                            </DetailIcon>
                                                                            <DetailText>
                                                                                <div className="label">Ticket Price</div>
                                                                                <div className="value" style={{ color: '#4CAF50' }}>{event.ticketPrice?.toLocaleString()} ֏</div>
                                                                            </DetailText>
                                                                        </DetailItem>
                                                                    </Grid>
                                                                    <Grid item xs={12} sm={6}>
                                                                        <DetailItem>
                                                                            <DetailIcon>
                                                                                <CategoryIcon sx={{ fontSize: 18 }} />
                                                                            </DetailIcon>
                                                                            <DetailText>
                                                                                <div className="label">Category</div>
                                                                                <div className="value">{getCategoryDisplayName(event.eventCategory)}</div>
                                                                            </DetailText>
                                                                        </DetailItem>
                                                                    </Grid>
                                                                    <Grid item xs={12} sm={6}>
                                                                        <DetailItem>
                                                                            <DetailIcon>
                                                                                <LocationIcon sx={{ fontSize: 18 }} />
                                                                            </DetailIcon>
                                                                            <DetailText>
                                                                                <div className="label">Location</div>
                                                                                <div className="value">{event.location}</div>
                                                                            </DetailText>
                                                                        </DetailItem>
                                                                    </Grid>
                                                                </Grid>
                                                            </Box>

                                                            {/* Museum and Date Row */}
                                                            <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
                                                                <DetailItem sx={{ flex: 1 }}>
                                                                    <DetailIcon>
                                                                        <MuseumIcon sx={{ fontSize: 18 }} />
                                                                    </DetailIcon>
                                                                    <DetailText>
                                                                        <div className="label">Museum</div>
                                                                        <div className="value">{museum?.name || '-'}</div>
                                                                    </DetailText>
                                                                </DetailItem>
                                                                <DetailItem sx={{ flex: 1 }}>
                                                                    <DetailIcon>
                                                                        <CalendarIcon sx={{ fontSize: 18 }} />
                                                                    </DetailIcon>
                                                                    <DetailText>
                                                                        <div className="label">Event Date</div>
                                                                        <div className="value">{formatEventDate(event.eventDate)}</div>
                                                                    </DetailText>
                                                                </DetailItem>
                                                            </Box>

                                                            {/* Duration */}
                                                            {event.duration && (
                                                                <DetailItem sx={{ mb: 2 }}>
                                                                    <DetailIcon>
                                                                        <AccessTimeIcon sx={{ fontSize: 18 }} />
                                                                    </DetailIcon>
                                                                    <DetailText>
                                                                        <div className="label">Duration</div>
                                                                        <div className="value">{event.duration} hours</div>
                                                                    </DetailText>
                                                                </DetailItem>
                                                            )}

                                                            {/* Contact Information */}
                                                            {(event.contactEmail || event.phoneNumbers?.length > 0) && (
                                                                <Box sx={{ mt: 2, p: 2, bgcolor: '#FFF8F0', borderRadius: '12px', border: '1px solid #D4A574' }}>
                                                                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#3D2A1A', mb: 1.5 }}>📞 Contact Information</Typography>
                                                                    {event.contactEmail && (
                                                                        <DetailItem sx={{ mb: 1 }}>
                                                                            <DetailIcon sx={{ width: '28px', height: '28px' }}>
                                                                                <EmailIcon sx={{ fontSize: 16 }} />
                                                                            </DetailIcon>
                                                                            <DetailText>
                                                                                <div className="value" style={{ fontSize: '0.85rem' }}>{event.contactEmail}</div>
                                                                            </DetailText>
                                                                        </DetailItem>
                                                                    )}
                                                                    {event.phoneNumbers?.length > 0 && (
                                                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                                                                            <PhoneIcon sx={{ fontSize: 16, color: '#FF9800', mt: 0.5 }} />
                                                                            {event.phoneNumbers.map((phone, idx) => (
                                                                                <Chip key={idx} label={phone} size="small" sx={{ bgcolor: alpha('#FF9800', 0.15), color: '#FF9800', fontWeight: 500 }} />
                                                                            ))}
                                                                        </Box>
                                                                    )}
                                                                </Box>
                                                            )}

                                                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
                                                                <IconButton onClick={() => handleOpenEditEventDialog(event)} sx={{ color: '#FF9800', '&:hover': { bgcolor: alpha('#FF9800', 0.1) } }}><EditIcon /></IconButton>
                                                                <IconButton onClick={() => handleDeleteEvent(event.id)} sx={{ color: '#f44336', '&:hover': { bgcolor: alpha('#f44336', 0.1) } }}><DeleteIcon /></IconButton>
                                                            </Box>
                                                        </Grid>
                                                    </Grid>
                                                </Box>
                                            </Grow>
                                        );
                                    })}
                                </Box>
                            )}
                            {eventsTotalPages > 1 && (
                                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                                    <Pagination
                                        count={eventsTotalPages}
                                        page={eventsPage + 1}
                                        onChange={(e, p) => setEventsPage(p - 1)}
                                        sx={{
                                            '& .MuiPaginationItem-root': { color: '#3D2A1A', fontWeight: 500 },
                                            '& .Mui-selected': { bgcolor: '#FF9800', color: 'white', '&:hover': { bgcolor: '#FF9800' } }
                                        }}
                                    />
                                </Box>
                            )}
                        </Box>
                    )}

                    {/* Museums Tab */}
                    {activeTab === 1 && (
                        <Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                <Typography variant="h6" sx={{ fontWeight: 700, color: '#3D2A1A' }}>All Museums ({museums.length})</Typography>
                                <GradientButton startIcon={<AddIcon />} onClick={handleOpenCreateMuseumDialog}>Add New Museum</GradientButton>
                            </Box>
                            {loading ? (
                                <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress sx={{ color: '#FF9800' }} /></Box>
                            ) : museums.length === 0 ? (
                                <Box sx={{ textAlign: 'center', py: 8 }}>
                                    <Typography sx={{ color: '#8B6914' }}>No museums found</Typography>
                                    <Button onClick={handleOpenCreateMuseumDialog} sx={{ mt: 2, color: '#FF9800' }}>Create first museum</Button>
                                </Box>
                            ) : (
                                <Grid container spacing={3}>
                                    {museums.map((museum) => (
                                        <Grid item xs={12} sm={6} md={4} key={museum.id}>
                                            <Card sx={{
                                                borderRadius: '16px',
                                                background: '#FFF8F0',
                                                border: '1px solid #D4A574',
                                                '&:hover': {
                                                    transform: 'translateY(-4px)',
                                                    transition: '0.3s',
                                                    boxShadow: '0 8px 25px rgba(255, 152, 0, 0.15)'
                                                }
                                            }}>
                                                <CardContent>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                                        <Avatar sx={{ bgcolor: alpha('#FF9800', 0.15), width: 48, height: 48 }}>
                                                            <MuseumIcon sx={{ color: '#FF9800' }} />
                                                        </Avatar>
                                                        <Box>
                                                            <IconButton onClick={() => handleOpenEditMuseumDialog(museum)} sx={{ color: '#FF9800' }}><EditIcon /></IconButton>
                                                            <IconButton onClick={() => handleDeleteMuseum(museum.id)} sx={{ color: '#f44336' }}><DeleteIcon /></IconButton>
                                                        </Box>
                                                    </Box>
                                                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#3D2A1A', mb: 1 }}>{museum.name}</Typography>
                                                    <Typography variant="body2" sx={{ color: '#8B6914' }}>ID: {museum.id}</Typography>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    ))}
                                </Grid>
                            )}
                            {museumsTotalPages > 1 && (
                                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                                    <Pagination
                                        count={museumsTotalPages}
                                        page={museumsPage + 1}
                                        onChange={(e, p) => setMuseumsPage(p - 1)}
                                        sx={{
                                            '& .MuiPaginationItem-root': { color: '#3D2A1A', fontWeight: 500 },
                                            '& .Mui-selected': { bgcolor: '#FF9800', color: 'white', '&:hover': { bgcolor: '#FF9800' } }
                                        }}
                                    />
                                </Box>
                            )}
                        </Box>
                    )}
                </Box>

                {/* Event Dialog */}
                <Dialog open={eventDialogOpen} onClose={handleCloseEventDialog} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: '20px', backgroundColor: '#FFF8F0' } }}>
                    <DialogTitle sx={{ borderBottom: '1px solid #D4A574' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {editingEvent ? <EditIcon sx={{ color: '#FF9800' }} /> : <AddIcon sx={{ color: '#FF9800' }} />}
                            <Typography variant="h5" sx={{ fontWeight: 700, color: '#3D2A1A' }}>{editingEvent ? 'Edit Event' : 'Create Event'}</Typography>
                        </Box>
                        <IconButton onClick={handleCloseEventDialog} sx={{ position: 'absolute', right: 16, top: 16, color: '#8B6914' }}><CloseIcon /></IconButton>
                    </DialogTitle>
                    <DialogContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <FlatTextField fullWidth label="Event Name" name="name" value={eventFormData.name} onChange={handleEventInputChange} required />
                            <FlatTextField fullWidth multiline rows={3} label="Description" name="description" value={eventFormData.description} onChange={handleEventInputChange} required />

                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth required>
                                        <InputLabel sx={{ color: '#5A3A2A' }}>Category</InputLabel>
                                        <FlatSelect name="eventCategory" value={eventFormData.eventCategory} onChange={handleEventInputChange} label="Category">
                                            <MenuItem value="">Select</MenuItem>
                                            {eventCategories.map(cat => <MenuItem key={cat.value} value={cat.value}>{cat.label}</MenuItem>)}
                                        </FlatSelect>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth>
                                        <InputLabel sx={{ color: '#5A3A2A' }}>Type</InputLabel>
                                        <FlatSelect name="eventType" value={eventFormData.eventType} onChange={handleEventInputChange} label="Type">
                                            {eventTypes.map(type => <MenuItem key={type.value} value={type.value}>{type.label}</MenuItem>)}
                                        </FlatSelect>
                                    </FormControl>
                                </Grid>
                            </Grid>

                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth required>
                                        <InputLabel sx={{ color: '#5A3A2A' }}>Museum</InputLabel>
                                        <FlatSelect name="museumId" value={eventFormData.museumId} onChange={handleEventInputChange} label="Museum">
                                            <MenuItem value="">Select</MenuItem>
                                            {museumsList.map(m => <MenuItem key={m.id} value={m.id}>{m.name}</MenuItem>)}
                                        </FlatSelect>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth required>
                                        <InputLabel sx={{ color: '#5A3A2A' }}>City</InputLabel>
                                        <FlatSelect name="location" value={eventFormData.location} onChange={handleEventInputChange} label="City">
                                            <MenuItem value="">Select</MenuItem>
                                            {ARMENIAN_CITIES.map(city => <MenuItem key={city.value} value={city.value}>{city.label}</MenuItem>)}
                                        </FlatSelect>
                                    </FormControl>
                                </Grid>
                            </Grid>

                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <FlatTextField fullWidth type="number" label="Guide Price (AMD)" name="guidePrice" value={eventFormData.guidePrice} onChange={handleEventInputChange} required InputProps={{ startAdornment: <InputAdornment position="start" sx={{ color: '#FF9800' }}>֏</InputAdornment> }} />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <FlatTextField fullWidth type="number" label="Ticket Price (AMD)" name="ticketPrice" value={eventFormData.ticketPrice} onChange={handleEventInputChange} required InputProps={{ startAdornment: <InputAdornment position="start" sx={{ color: '#4CAF50' }}>֏</InputAdornment> }} />
                                </Grid>
                            </Grid>

                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <DateTimePicker
                                        label="Event Date"
                                        value={eventFormData.eventDate}
                                        onChange={(newValue) => setEventFormData(prev => ({ ...prev, eventDate: newValue }))}
                                        slotProps={{
                                            textField: {
                                                fullWidth: true,
                                                sx: {
                                                    '& .MuiOutlinedInput-root': {
                                                        backgroundColor: '#FFF8F0',
                                                        '& fieldset': { border: 'none' }
                                                    }
                                                }
                                            }
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <FlatTextField fullWidth type="number" label="Duration (hours)" name="duration" value={eventFormData.duration} onChange={handleEventInputChange} />
                                </Grid>
                            </Grid>

                            <Box>
                                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#3D2A1A', mb: 2 }}>Contact Information</Typography>
                                <FlatTextField fullWidth type="email" label="Contact Email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} sx={{ mb: 2 }} />
                                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                                    <FlatTextField size="small" placeholder="Phone (8 digits)" value={newPhoneNumber} onChange={(e) => { setNewPhoneNumber(e.target.value); setPhoneError(''); }} error={!!phoneError} helperText={phoneError} sx={{ flex: 1 }} />
                                    <GradientButton onClick={handleAddPhoneNumber} sx={{ minWidth: 80 }}>Add</GradientButton>
                                </Box>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                    {phoneNumbersList.map((phone, idx) => (
                                        <Chip key={idx} label={phone} onDelete={() => handleRemovePhoneNumber(idx)} sx={{ bgcolor: alpha('#FF9800', 0.15), color: '#FF9800' }} />
                                    ))}
                                </Box>
                            </Box>

                            <Box>
                                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#3D2A1A', mb: 2 }}>Images</Typography>
                                <OutlinedButton component="label" startIcon={<UploadIcon />} fullWidth sx={{ py: 1.5, backgroundColor: '#FFF8F0' }}>
                                    Choose Images
                                    <input type="file" multiple accept="image/*" onChange={handleImageSelect} hidden />
                                </OutlinedButton>

                                {existingImages.length > 0 && (
                                    <Box sx={{ mt: 2 }}>
                                        <Typography variant="body2" sx={{ color: '#8B6914', mb: 1 }}>Current Images:</Typography>
                                        <ImageList cols={3} rowHeight={100} sx={{ mb: 2 }}>
                                            {existingImages.map((url, idx) => (
                                                <ImageListItem key={idx} sx={{ position: 'relative', borderRadius: '8px', overflow: 'hidden' }}>
                                                    <img src={url} alt={`img-${idx}`} style={{ height: 100, objectFit: 'cover', width: '100%' }} />
                                                    <IconButton size="small" onClick={() => handleRemoveExistingImage(idx)} sx={{ position: 'absolute', top: 5, right: 5, bgcolor: alpha('#000', 0.6) }}>
                                                        <DeleteOutlineIcon sx={{ fontSize: 16, color: 'white' }} />
                                                    </IconButton>
                                                </ImageListItem>
                                            ))}
                                        </ImageList>
                                    </Box>
                                )}

                                {imagePreviews.length > 0 && (
                                    <Box sx={{ mt: 2 }}>
                                        <Typography variant="body2" sx={{ color: '#8B6914', mb: 1 }}>New Images:</Typography>
                                        <ImageList cols={3} rowHeight={100}>
                                            {imagePreviews.map((preview, idx) => (
                                                <ImageListItem key={idx} sx={{ position: 'relative', borderRadius: '8px', overflow: 'hidden' }}>
                                                    <img src={preview} alt={`preview-${idx}`} style={{ height: 100, objectFit: 'cover', width: '100%' }} />
                                                    <IconButton size="small" onClick={() => handleRemoveNewImage(idx)} sx={{ position: 'absolute', top: 5, right: 5, bgcolor: alpha('#000', 0.6) }}>
                                                        <DeleteOutlineIcon sx={{ fontSize: 16, color: 'white' }} />
                                                    </IconButton>
                                                </ImageListItem>
                                            ))}
                                        </ImageList>
                                    </Box>
                                )}
                            </Box>
                        </Box>
                    </DialogContent>
                    <DialogActions sx={{ p: 3, borderTop: '1px solid #D4A574' }}>
                        <OutlinedButton onClick={handleCloseEventDialog}>Cancel</OutlinedButton>
                        <GradientButton onClick={handleSubmitEvent} disabled={loading}>
                            {loading ? <CircularProgress size={24} /> : (editingEvent ? 'Update' : 'Create')}
                        </GradientButton>
                    </DialogActions>
                </Dialog>

                {/* Museum Dialog */}
                <Dialog open={museumDialogOpen} onClose={handleCloseMuseumDialog} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '20px', backgroundColor: '#FFF8F0' } }}>
                    <DialogTitle sx={{ borderBottom: '1px solid #D4A574' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {editingMuseum ? <EditIcon sx={{ color: '#FF9800' }} /> : <AddIcon sx={{ color: '#FF9800' }} />}
                            <Typography variant="h5" sx={{ fontWeight: 700, color: '#3D2A1A' }}>{editingMuseum ? 'Edit Museum' : 'Create Museum'}</Typography>
                        </Box>
                        <IconButton onClick={handleCloseMuseumDialog} sx={{ position: 'absolute', right: 16, top: 16, color: '#8B6914' }}><CloseIcon /></IconButton>
                    </DialogTitle>
                    <DialogContent sx={{ p: 3 }}>
                        <FlatTextField fullWidth label="Museum Name" name="name" value={museumFormData.name} onChange={handleMuseumInputChange} required sx={{ mt: 1 }} />
                    </DialogContent>
                    <DialogActions sx={{ p: 3, borderTop: '1px solid #D4A574' }}>
                        <OutlinedButton onClick={handleCloseMuseumDialog}>Cancel</OutlinedButton>
                        <GradientButton onClick={handleSubmitMuseum} disabled={loading}>
                            {loading ? <CircularProgress size={24} /> : (editingMuseum ? 'Update' : 'Create')}
                        </GradientButton>
                    </DialogActions>
                </Dialog>

                <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
                    <Alert severity={snackbar.severity} sx={{ backgroundColor: '#FFF8F0', color: '#3D2A1A' }}>{snackbar.message}</Alert>
                </Snackbar>
            </Box>
        </LocalizationProvider>
    );
};

export default AdminDashboardPage;