// src/pages/PaymentPage.js

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Container,
    Typography,
    Box,
    Paper,
    Button,
    TextField,
    Checkbox,
    FormControlLabel,
    Stepper,
    Step,
    StepLabel,
    Grid,
    Divider,
    Alert,
    Snackbar,
    CircularProgress,
    InputAdornment,
    Fade,
    alpha,
    IconButton
} from '@mui/material';
import {
    ArrowBack as ArrowBackIcon,
    CreditCard as CreditCardIcon,
    LocalOffer as TicketIcon,
    Person as PersonIcon,
    CalendarToday as CalendarIcon,
    Security as SecurityIcon,
    Phone as PhoneIcon,
    Email as EmailIcon,
    Lock as LockIcon,
    Visibility as VisibilityIcon,
    VisibilityOff as VisibilityOffIcon,
    CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { emailAPI } from '../services/apiService';

const colors = {
    primary: '#C4A484',
    primaryDark: '#A0522D',
    primaryLight: '#D2B48C',
    secondary: '#8B7355',
    background: '#FFF8F0',
    surface: '#FFFDF7',
    text: '#4A3728',
    textLight: '#7A5C4A',
    accent: '#DEB887',
    border: '#E8D5B7',
    success: '#6B8E23',
    warning: '#CD853F',
    error: '#BC544B',
    gradient: 'linear-gradient(135deg, #C4A484 0%, #D2B48C 50%, #DEB887 100%)'
};

const PaymentPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();

    const event = location.state?.event;

    const [activeStep, setActiveStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [sendingEmail, setSendingEmail] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [showCvv, setShowCvv] = useState(false);
    const [ticketQuantity, setTicketQuantity] = useState(1);
    const [includeGuide, setIncludeGuide] = useState(false);
    const [fullName, setFullName] = useState(user?.userName || '');
    const [email, setEmail] = useState(user?.email || '');
    const [phone, setPhone] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [cardName, setCardName] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCvv] = useState('');
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (!event) {
            setSnackbar({ open: true, message: 'Միջոցառման տվյալները չեն գտնվել', severity: 'error' });
            setTimeout(() => navigate('/events'), 2000);
        }
    }, [event, navigate]);

    if (!event) {
        return (
            <Box sx={{ minHeight: '100vh', background: colors.background, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CircularProgress sx={{ color: colors.primary }} />
            </Box>
        );
    }

    const calculateTotal = () => {
        let total = event.ticketPrice * ticketQuantity;
        if (includeGuide) {
            total += event.guidePrice;
        }
        return total;
    };

    const totalAmount = calculateTotal();

    const validateContactInfo = () => {
        const newErrors = {};
        if (!fullName.trim()) newErrors.fullName = 'Մուտքագրեք Ձեր լրիվ անունը';
        if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) newErrors.email = 'Մուտքագրեք վավեր email հասցե';
        if (!phone.match(/^(\+?374|0)[0-9]{8}$/)) {
            newErrors.phone = 'Մուտքագրեք վավեր հեռախոսահամար (077XXXXXX կամ +374XXXXXXXX)';
        }
        return newErrors;
    };

    const validateCardInfo = () => {
        const newErrors = {};
        const cleanCardNumber = cardNumber.replace(/\s/g, '');
        if (!cleanCardNumber.match(/^\d{16}$/)) {
            newErrors.cardNumber = 'Մուտքագրեք վավեր քարտի համար (16 նիշ)';
        }
        if (!cardName.trim()) newErrors.cardName = 'Մուտքագրեք քարտի վրա նշված անունը';
        if (!expiryDate.match(/^(0[1-9]|1[0-2])\/([0-9]{2})$/)) {
            newErrors.expiryDate = 'Մուտքագրեք վավեր ժամկետ (MM/YY)';
        }
        if (!cvv.match(/^\d{3}$/)) {
            newErrors.cvv = 'CVV/CVC կոդը պետք է լինի 3 նիշ';
        }
        return newErrors;
    };

    const handleNext = () => {
        if (activeStep === 0) {
            if (ticketQuantity < 1) {
                setErrors({ ticketQuantity: 'Տոմսերի քանակը պետք է լինի առնվազն 1' });
                return;
            }
            if (ticketQuantity > 20) {
                setErrors({ ticketQuantity: 'Մեկ պատվերով կարող եք գնել առավելագույնը 20 տոմս' });
                return;
            }
            setActiveStep(1);
            setErrors({});
        } else if (activeStep === 1) {
            const contactErrors = validateContactInfo();
            if (Object.keys(contactErrors).length > 0) {
                setErrors(contactErrors);
                return;
            }
            setActiveStep(2);
            setErrors({});
        } else if (activeStep === 2) {
            const cardErrors = validateCardInfo();
            if (Object.keys(cardErrors).length > 0) {
                setErrors(cardErrors);
                return;
            }
            setActiveStep(3);
            setErrors({});
        }
    };

    const handleBack = () => {
        setActiveStep(prev => prev - 1);
        setErrors({});
    };

    // PaymentPage.js - sendEmailConfirmation ֆունկցիան

    const sendEmailConfirmation = async (bookingData) => {
        setSendingEmail(true);
        try {
            const eventDateFormatted = new Date(event.eventDate).toLocaleDateString('hy-AM', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            });

            console.log('Sending email to new endpoint: /api/booking/send-ticket-email');

            // Օգտագործել fetch առանց ավելորդ headers-ների
            const response = await fetch('http://localhost:8080/api/booking/send-ticket-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    bookingId: bookingData.bookingId,
                    eventName: event.name,
                    museumName: event.museumNameArm || event.museumName,
                    location: event.locationArm || event.location,
                    eventDate: eventDateFormatted,
                    ticketQuantity: ticketQuantity,
                    ticketPrice: event.ticketPrice,
                    guidePrice: includeGuide ? event.guidePrice : 0,
                    includeGuide: includeGuide,
                    totalAmount: totalAmount,
                    phoneNumber: phone,
                    fullName: fullName
                })
            });

            console.log('Response status:', response.status);

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP ${response.status}: ${errorText}`);
            }

            const data = await response.text();
            console.log('Email sent successfully:', data);
            return true;
        } catch (emailError) {
            console.error('Failed to send ticket confirmation email:', emailError);
            return false;
        } finally {
            setSendingEmail(false);
        }
    };
    const handlePayment = async () => {
        setLoading(true);

        // Simulate payment processing
        setTimeout(async () => {
            const bookingData = {
                id: Date.now(),
                bookingId: `BK-${Date.now()}-${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
                eventId: event.id,
                eventName: event.name,
                eventDate: event.eventDate,
                museumName: event.museumNameArm || event.museumName,
                location: event.locationArm || event.location,
                ticketPrice: event.ticketPrice,
                guidePrice: includeGuide ? event.guidePrice : 0,
                ticketQuantity,
                includeGuide,
                totalAmount,
                fullName,
                email,
                phone,
                bookingDate: new Date().toISOString(),
                status: 'confirmed',
                paymentId: `PAY-${Date.now()}-${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
                last4Digits: cardNumber.replace(/\s/g, '').slice(-4)
            };

            // Save to localStorage
            const existingBookings = JSON.parse(localStorage.getItem('userBookings') || '[]');
            existingBookings.unshift(bookingData);
            localStorage.setItem('userBookings', JSON.stringify(existingBookings));

            // Send email confirmation
            const emailSent = await sendEmailConfirmation(bookingData);

            setLoading(false);

            if (emailSent) {
                setSnackbar({
                    open: true,
                    message: 'Վճարումը հաջողությամբ կատարվեց։ Տոմսը ուղարկվել է ձեր էլ.փոստին',
                    severity: 'success'
                });
            } else {
                setSnackbar({
                    open: true,
                    message: 'Վճարումը հաջողվեց, սակայն էլ.փոստի ուղարկումը ձախողվեց։ Տոմսը պահպանված է ձեր պրոֆիլում։',
                    severity: 'warning'
                });
            }

            setTimeout(() => {
                navigate('/payment-success', { state: { booking: bookingData, emailSent: emailSent } });
            }, 1500);
        }, 1500);
    };

    const formatCardNumber = (value) => {
        const v = value.replace(/\s/g, '').replace(/\D/g, '').slice(0, 16);
        const parts = v.match(/.{1,4}/g);
        return parts ? parts.join(' ') : v;
    };

    const formatExpiryDate = (value) => {
        const v = value.replace(/\D/g, '').slice(0, 4);
        if (v.length >= 2) {
            return `${v.slice(0, 2)}/${v.slice(2)}`;
        }
        return v;
    };

    const handleCvvChange = (value) => {
        const cleaned = value.replace(/\D/g, '').slice(0, 3);
        setCvv(cleaned);
        if (errors.cvv) {
            setErrors(prev => ({ ...prev, cvv: '' }));
        }
    };

    const steps = ['Տոմսերի քանակ', 'Կոնտակտային տվյալներ', 'Վճարման տվյալներ', 'Հաստատում'];

    return (
        <Box sx={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #FFF8F0 0%, #F5EDE3 100%)',
            py: 4,
            px: { xs: 2, sm: 3, md: 4 }
        }}>
            <Container maxWidth="lg">
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate('/events')}
                    sx={{ mb: 3, color: colors.textLight, '&:hover': { color: colors.primary } }}
                >
                    Վերադառնալ միջոցառումներին
                </Button>

                <Grid container spacing={4}>
                    {/* Left Column - Booking Form */}
                    <Grid item xs={12} md={7}>
                        <Paper elevation={0} sx={{
                            borderRadius: '24px',
                            background: colors.surface,
                            border: `1px solid ${colors.border}`,
                            overflow: 'hidden'
                        }}>
                            <Box sx={{ p: 3, background: colors.gradient, color: 'white' }}>
                                <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>Ամրագրել տոմսեր</Typography>
                                <Typography variant="body2" sx={{ opacity: 0.9 }}>Լրացրեք հետևյալ տվյալները ամրագրման համար</Typography>
                            </Box>

                            <Box sx={{ px: 3, pt: 3 }}>
                                <Stepper activeStep={activeStep} alternativeLabel>
                                    {steps.map((label) => (
                                        <Step key={label}>
                                            <StepLabel StepIconProps={{
                                                sx: {
                                                    '&.Mui-completed': { color: colors.success },
                                                    '&.Mui-active': { color: colors.primary }
                                                }
                                            }}>
                                                <Typography variant="caption" sx={{ fontWeight: 500 }}>{label}</Typography>
                                            </StepLabel>
                                        </Step>
                                    ))}
                                </Stepper>
                            </Box>

                            <Divider sx={{ my: 3 }} />

                            <Box sx={{ p: 3 }}>
                                {/* Step 0 - Ticket Quantity */}
                                {activeStep === 0 && (
                                    <Fade in>
                                        <Box>
                                            <Typography variant="h6" sx={{ mb: 3, color: colors.text, fontWeight: 600 }}>
                                                🎫 Ընտրեք տոմսերի քանակը
                                            </Typography>

                                            <Grid container spacing={3}>
                                                <Grid item xs={12}>
                                                    <TextField
                                                        fullWidth
                                                        type="number"
                                                        label="Տոմսերի քանակ"
                                                        value={ticketQuantity}
                                                        onChange={(e) => {
                                                            const val = Math.min(20, Math.max(1, parseInt(e.target.value) || 1));
                                                            setTicketQuantity(val);
                                                            setErrors({});
                                                        }}
                                                        InputProps={{
                                                            inputProps: { min: 1, max: 20 },
                                                            startAdornment: (
                                                                <InputAdornment position="start">
                                                                    <TicketIcon sx={{ color: colors.primary }} />
                                                                </InputAdornment>
                                                            )
                                                        }}
                                                        error={!!errors.ticketQuantity}
                                                        helperText={errors.ticketQuantity}
                                                        sx={{
                                                            '& .MuiOutlinedInput-root': {
                                                                '& fieldset': { borderColor: colors.border },
                                                                '&:hover fieldset': { borderColor: colors.primary },
                                                                '&.Mui-focused fieldset': { borderColor: colors.primary }
                                                            }
                                                        }}
                                                    />
                                                </Grid>

                                                <Grid item xs={12}>
                                                    <FormControlLabel
                                                        control={
                                                            <Checkbox
                                                                checked={includeGuide}
                                                                onChange={(e) => setIncludeGuide(e.target.checked)}
                                                                sx={{
                                                                    color: colors.primary,
                                                                    '&.Mui-checked': { color: colors.primary }
                                                                }}
                                                            />
                                                        }
                                                        label={
                                                            <Box>
                                                                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                                                    🎯 Ուղեցույցի ծառայություն (+{event.guidePrice.toLocaleString()} ֏)
                                                                </Typography>
                                                                <Typography variant="caption" sx={{ color: colors.textLight }}>
                                                                    Պրոֆեսիոնալ ուղեցույց թանգարանում
                                                                </Typography>
                                                            </Box>
                                                        }
                                                    />
                                                </Grid>
                                            </Grid>
                                        </Box>
                                    </Fade>
                                )}

                                {/* Step 1 - Contact Information */}
                                {activeStep === 1 && (
                                    <Fade in>
                                        <Box>
                                            <Typography variant="h6" sx={{ mb: 3, color: colors.text, fontWeight: 600 }}>
                                                📞 Կոնտակտային տվյալներ
                                            </Typography>

                                            <Alert severity="info" sx={{ mb: 3, borderRadius: '12px' }}>
                                                Տոմսը կուղարկվի ձեր նշված էլ.փոստին
                                            </Alert>

                                            <Grid container spacing={2}>
                                                <Grid item xs={12}>
                                                    <TextField
                                                        fullWidth
                                                        label="Լրիվ անուն"
                                                        value={fullName}
                                                        onChange={(e) => setFullName(e.target.value)}
                                                        InputProps={{
                                                            startAdornment: (
                                                                <InputAdornment position="start">
                                                                    <PersonIcon sx={{ color: colors.primary }} />
                                                                </InputAdornment>
                                                            )
                                                        }}
                                                        error={!!errors.fullName}
                                                        helperText={errors.fullName}
                                                        sx={{
                                                            '& .MuiOutlinedInput-root': {
                                                                '& fieldset': { borderColor: colors.border },
                                                                '&:hover fieldset': { borderColor: colors.primary },
                                                                '&.Mui-focused fieldset': { borderColor: colors.primary }
                                                            }
                                                        }}
                                                    />
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <TextField
                                                        fullWidth
                                                        label="Email հասցե"
                                                        type="email"
                                                        placeholder="example@domain.com"
                                                        value={email}
                                                        onChange={(e) => setEmail(e.target.value)}
                                                        InputProps={{
                                                            startAdornment: (
                                                                <InputAdornment position="start">
                                                                    <EmailIcon sx={{ color: colors.primary }} />
                                                                </InputAdornment>
                                                            )
                                                        }}
                                                        error={!!errors.email}
                                                        helperText={errors.email}
                                                    />
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <TextField
                                                        fullWidth
                                                        label="Հեռախոսահամար"
                                                        placeholder="077XXXXXX կամ +374XXXXXXXX"
                                                        value={phone}
                                                        onChange={(e) => setPhone(e.target.value)}
                                                        InputProps={{
                                                            startAdornment: (
                                                                <InputAdornment position="start">
                                                                    <PhoneIcon sx={{ color: colors.primary }} />
                                                                </InputAdornment>
                                                            )
                                                        }}
                                                        error={!!errors.phone}
                                                        helperText={errors.phone}
                                                    />
                                                </Grid>
                                            </Grid>
                                        </Box>
                                    </Fade>
                                )}

                                {/* Step 2 - Payment Information */}
                                {activeStep === 2 && (
                                    <Fade in>
                                        <Box>
                                            <Typography variant="h6" sx={{ mb: 3, color: colors.text, fontWeight: 600 }}>
                                                💳 Վճարման տվյալներ
                                            </Typography>

                                            <Grid container spacing={2}>
                                                <Grid item xs={12}>
                                                    <TextField
                                                        fullWidth
                                                        label="Քարտի համար"
                                                        placeholder="1234 5678 9012 3456"
                                                        value={cardNumber}
                                                        onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                                                        InputProps={{
                                                            startAdornment: (
                                                                <InputAdornment position="start">
                                                                    <CreditCardIcon sx={{ color: colors.primary }} />
                                                                </InputAdornment>
                                                            )
                                                        }}
                                                        error={!!errors.cardNumber}
                                                        helperText={errors.cardNumber}
                                                        sx={{
                                                            '& .MuiOutlinedInput-root': {
                                                                '& fieldset': { borderColor: colors.border },
                                                                '&:hover fieldset': { borderColor: colors.primary },
                                                                '&.Mui-focused fieldset': { borderColor: colors.primary }
                                                            }
                                                        }}
                                                    />
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <TextField
                                                        fullWidth
                                                        label="Քարտի վրա նշված անունը"
                                                        placeholder="JOHN DOE"
                                                        value={cardName}
                                                        onChange={(e) => setCardName(e.target.value.toUpperCase())}
                                                        InputProps={{
                                                            startAdornment: (
                                                                <InputAdornment position="start">
                                                                    <PersonIcon sx={{ color: colors.primary }} />
                                                                </InputAdornment>
                                                            )
                                                        }}
                                                        error={!!errors.cardName}
                                                        helperText={errors.cardName}
                                                    />
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <TextField
                                                        fullWidth
                                                        label="Ժամկետ (MM/YY)"
                                                        placeholder="MM/YY"
                                                        value={expiryDate}
                                                        onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                                                        InputProps={{
                                                            startAdornment: (
                                                                <InputAdornment position="start">
                                                                    <CalendarIcon sx={{ color: colors.primary }} />
                                                                </InputAdornment>
                                                            )
                                                        }}
                                                        error={!!errors.expiryDate}
                                                        helperText={errors.expiryDate}
                                                    />
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <TextField
                                                        fullWidth
                                                        label="CVV/CVC"
                                                        placeholder="123"
                                                        type={showCvv ? 'text' : 'password'}
                                                        value={cvv}
                                                        onChange={(e) => handleCvvChange(e.target.value)}
                                                        InputProps={{
                                                            startAdornment: (
                                                                <InputAdornment position="start">
                                                                    <LockIcon sx={{ color: colors.primary }} />
                                                                </InputAdornment>
                                                            ),
                                                            endAdornment: (
                                                                <InputAdornment position="end">
                                                                    <IconButton
                                                                        onClick={() => setShowCvv(!showCvv)}
                                                                        onMouseDown={(e) => e.preventDefault()}
                                                                        edge="end"
                                                                        size="small"
                                                                    >
                                                                        {showCvv ? <VisibilityOffIcon sx={{ color: colors.textLight }} /> : <VisibilityIcon sx={{ color: colors.textLight }} />}
                                                                    </IconButton>
                                                                </InputAdornment>
                                                            )
                                                        }}
                                                        error={!!errors.cvv}
                                                        helperText={errors.cvv}
                                                        sx={{
                                                            '& .MuiOutlinedInput-root': {
                                                                '& fieldset': { borderColor: colors.border },
                                                                '&:hover fieldset': { borderColor: colors.primary },
                                                                '&.Mui-focused fieldset': { borderColor: colors.primary }
                                                            }
                                                        }}
                                                    />
                                                </Grid>
                                            </Grid>

                                            <Box sx={{ mt: 3, p: 2, bgcolor: alpha(colors.primary, 0.03), borderRadius: '12px' }}>
                                                <Typography variant="caption" sx={{ color: colors.textLight, display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <SecurityIcon sx={{ fontSize: 14, color: colors.primary }} />
                                                    Տվյալները կոդավորված են և անվտանգ
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Fade>
                                )}

                                {/* Step 3 - Confirmation */}
                                {activeStep === 3 && (
                                    <Fade in>
                                        <Box>
                                            <Typography variant="h6" sx={{ mb: 3, color: colors.text, fontWeight: 600 }}>
                                                ✅ Հաստատեք պատվերը
                                            </Typography>

                                            <Alert severity="success" sx={{ mb: 3, borderRadius: '12px' }}>
                                                Ստուգեք տվյալները և հաստատեք ամրագրումը
                                            </Alert>

                                            <Box sx={{ bgcolor: alpha(colors.primary, 0.03), borderRadius: '16px', p: 2, mb: 2 }}>
                                                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: colors.text, mb: 1 }}>
                                                    📋 Միջոցառում
                                                </Typography>
                                                <Typography variant="body2" sx={{ color: colors.textLight }}>
                                                    {event.name}
                                                </Typography>
                                                <Typography variant="caption" sx={{ color: colors.textLight, display: 'block', mt: 0.5 }}>
                                                    {event.museumNameArm || event.museumName} - {event.locationArm || event.location}
                                                </Typography>
                                            </Box>

                                            <Box sx={{ bgcolor: alpha(colors.primary, 0.03), borderRadius: '16px', p: 2, mb: 2 }}>
                                                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: colors.text, mb: 1 }}>
                                                    💰 Պատվերի մանրամասներ
                                                </Typography>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                                    <Typography variant="body2">Տոմսեր ({ticketQuantity} հատ × {event.ticketPrice.toLocaleString()} ֏)</Typography>
                                                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                        {(event.ticketPrice * ticketQuantity).toLocaleString()} ֏
                                                    </Typography>
                                                </Box>
                                                {includeGuide && (
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                                        <Typography variant="body2">Ուղեցույցի ծառայություն</Typography>
                                                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                            {event.guidePrice.toLocaleString()} ֏
                                                        </Typography>
                                                    </Box>
                                                )}
                                                <Divider sx={{ my: 1 }} />
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                                                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Ընդհանուր</Typography>
                                                    <Typography variant="h6" sx={{ fontWeight: 700, color: colors.primary }}>
                                                        {totalAmount.toLocaleString()} ֏
                                                    </Typography>
                                                </Box>
                                            </Box>

                                            <Box sx={{ bgcolor: alpha(colors.primary, 0.03), borderRadius: '16px', p: 2 }}>
                                                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: colors.text, mb: 1 }}>
                                                    👤 Կոնտակտային տվյալներ
                                                </Typography>
                                                <Typography variant="body2" sx={{ color: colors.textLight }}>
                                                    {fullName}<br />
                                                    {email}<br />
                                                    {phone}
                                                </Typography>
                                            </Box>

                                            <Alert severity="info" sx={{ mt: 2, borderRadius: '12px' }}>
                                                <Typography variant="caption">
                                                    Տոմսը կուղարկվի ձեր էլ.փոստին՝ <strong>{email}</strong>
                                                </Typography>
                                            </Alert>
                                        </Box>
                                    </Fade>
                                )}
                            </Box>

                            {/* Navigation Buttons */}
                            <Box sx={{ p: 3, bgcolor: alpha(colors.primary, 0.02), borderTop: `1px solid ${colors.border}` }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Button
                                        variant="outlined"
                                        onClick={handleBack}
                                        disabled={activeStep === 0 || loading || sendingEmail}
                                        sx={{
                                            borderRadius: '40px',
                                            borderColor: colors.border,
                                            color: colors.text,
                                            '&:hover': { borderColor: colors.primary, color: colors.primary }
                                        }}
                                    >
                                        Հետ
                                    </Button>
                                    <Button
                                        variant="contained"
                                        onClick={activeStep === 3 ? handlePayment : handleNext}
                                        disabled={loading || sendingEmail}
                                        sx={{
                                            borderRadius: '40px',
                                            background: colors.gradient,
                                            px: 4,
                                            '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 4px 12px rgba(196, 164, 132, 0.3)' }
                                        }}
                                    >
                                        {loading ? (
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <CircularProgress size={20} sx={{ color: 'white' }} />
                                                <Typography variant="body2">Վճարվում է...</Typography>
                                            </Box>
                                        ) : sendingEmail ? (
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <CircularProgress size={20} sx={{ color: 'white' }} />
                                                <Typography variant="body2">Ուղարկվում է...</Typography>
                                            </Box>
                                        ) : (
                                            activeStep === 3 ? '💳 Հաստատել և Վճարել' : 'Հաջորդ ➜'
                                        )}
                                    </Button>
                                </Box>
                            </Box>
                        </Paper>
                    </Grid>

                    {/* Right Column - Order Summary */}
                    <Grid item xs={12} md={5}>
                        <Paper elevation={0} sx={{
                            borderRadius: '24px',
                            background: colors.surface,
                            border: `1px solid ${colors.border}`,
                            position: 'sticky',
                            top: 20
                        }}>
                            <Box sx={{ p: 3 }}>
                                <Typography variant="h6" sx={{ fontWeight: 700, color: colors.text, mb: 2 }}>
                                    🛒 Պատվերի ամփոփում
                                </Typography>

                                <Box sx={{
                                    bgcolor: alpha(colors.primary, 0.05),
                                    borderRadius: '16px',
                                    p: 2,
                                    mb: 3
                                }}>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 600, color: colors.text, mb: 1 }}>
                                        {event.name}
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: colors.textLight, display: 'block', mb: 0.5 }}>
                                        🏛️ {event.museumNameArm || event.museumName}
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: colors.textLight, display: 'block' }}>
                                        📍 {event.locationArm || event.location}
                                    </Typography>
                                </Box>

                                <Divider sx={{ my: 2 }} />

                                <Box sx={{ mb: 2 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                        <Typography variant="body2" sx={{ color: colors.textLight }}>🎫 Տոմսի գին</Typography>
                                        <Typography variant="body2" sx={{ fontWeight: 500 }}>{event.ticketPrice.toLocaleString()} ֏</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                        <Typography variant="body2" sx={{ color: colors.textLight }}>🔢 Քանակ</Typography>
                                        <Typography variant="body2" sx={{ fontWeight: 500 }}>{ticketQuantity}</Typography>
                                    </Box>
                                    {includeGuide && (
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                            <Typography variant="body2" sx={{ color: colors.textLight }}>🎯 Ուղեցույց</Typography>
                                            <Typography variant="body2" sx={{ fontWeight: 500 }}>{event.guidePrice.toLocaleString()} ֏</Typography>
                                        </Box>
                                    )}
                                </Box>

                                <Divider sx={{ my: 2 }} />

                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                    <Typography variant="h6" sx={{ fontWeight: 700, color: colors.text }}>Ընդհանուր</Typography>
                                    <Typography variant="h5" sx={{ fontWeight: 800, color: colors.primary }}>
                                        {totalAmount.toLocaleString()} ֏
                                    </Typography>
                                </Box>

                                <Alert severity="info" sx={{ mt: 2, borderRadius: '12px' }}>
                                    <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <CheckCircleIcon sx={{ fontSize: 16 }} />
                                        Տոմսը կուղարկվի ձեր էլ.փոստին
                                    </Typography>
                                </Alert>
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>

                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={5000}
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                >
                    <Alert
                        severity={snackbar.severity}
                        sx={{
                            borderRadius: '12px',
                            bgcolor: colors.surface,
                            '& .MuiAlert-icon': {
                                color: snackbar.severity === 'success' ? colors.success : colors.warning
                            }
                        }}
                    >
                        {snackbar.message}
                    </Alert>
                </Snackbar>
            </Container>
        </Box>
    );
};

export default PaymentPage;