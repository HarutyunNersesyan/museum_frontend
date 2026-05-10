// src/pages/PaymentSuccessPage.js
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Container, Typography, Box, Paper, Button, Divider, Alert, alpha } from '@mui/material';
import { CheckCircle as CheckCircleIcon, Home as HomeIcon, Event as EventIcon, Print as PrintIcon } from '@mui/icons-material';

const colors = {
    primary: '#C4A484',
    success: '#6B8E23',
    gradient: 'linear-gradient(135deg, #C4A484 0%, #D2B48C 50%, #DEB887 100%)'
};

const PaymentSuccessPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const booking = location.state?.booking;

    const handlePrint = () => window.print();

    if (!booking) {
        return (
            <Box sx={{ minHeight: '100vh', background: '#FFF8F0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Alert severity="warning">Ամրագրման տվյալները չեն գտնվել</Alert>
            </Box>
        );
    }

    return (
        <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #FFF8F0 0%, #F5EDE3 100%)', py: 4, px: { xs: 2, sm: 3, md: 4 } }}>
            <Container maxWidth="md">
                <Paper elevation={0} sx={{ borderRadius: '24px', background: 'white', textAlign: 'center', p: 4 }}>
                    <CheckCircleIcon sx={{ fontSize: 80, color: colors.success, mb: 2 }} />
                    <Typography variant="h4" sx={{ fontWeight: 700, color: colors.primary, mb: 2 }}>Շնորհավորում ենք:</Typography>
                    <Typography variant="h6" sx={{ color: '#4A3728', mb: 3 }}>Ձեր ամրագրումը հաջողությամբ կատարվեց</Typography>
                    <Alert severity="success" sx={{ mb: 4, borderRadius: '16px' }}>Հաստատման email-ը ուղարկվել է Ձեր էլ. հասցեին</Alert>

                    <Box sx={{ bgcolor: alpha(colors.primary, 0.05), borderRadius: '16px', p: 3, mb: 4, textAlign: 'left' }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>Ամրագրման մանրամասներ</Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body2" sx={{ color: '#7A5C4A' }}>Ամրագրման համար</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>#{booking.id}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body2" sx={{ color: '#7A5C4A' }}>Միջոցառում</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>{booking.eventName}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body2" sx={{ color: '#7A5C4A' }}>Տոմսերի քանակ</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>{booking.ticketQuantity}</Typography>
                        </Box>
                        {booking.includeGuide && (
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2" sx={{ color: '#7A5C4A' }}>Ուղեցույց</Typography>
                                <Typography variant="body2" sx={{ fontWeight: 500 }}>Ավելացված է</Typography>
                            </Box>
                        )}
                        <Divider sx={{ my: 1 }} />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Ընդհանուր գումար</Typography>
                            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: colors.primary }}>{booking.totalAmount.toLocaleString()} ֏</Typography>
                        </Box>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Button variant="outlined" startIcon={<PrintIcon />} onClick={handlePrint} sx={{ borderRadius: '40px', borderColor: colors.primary, color: colors.primary }}>Տպել</Button>
                        <Button variant="contained" startIcon={<HomeIcon />} onClick={() => navigate('/')} sx={{ borderRadius: '40px', background: colors.gradient }}>Գլխավոր էջ</Button>
                        <Button variant="contained" startIcon={<EventIcon />} onClick={() => navigate('/events')} sx={{ borderRadius: '40px', background: colors.gradient }}>Այլ միջոցառումներ</Button>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};

export default PaymentSuccessPage;