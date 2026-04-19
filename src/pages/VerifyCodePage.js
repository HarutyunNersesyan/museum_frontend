import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    TextField,
    Button,
    Typography,
    Box,
    Alert,
    Fade,
    CircularProgress,
    Backdrop,
    Paper,
    useMediaQuery,
    useTheme,
    GlobalStyles,
    IconButton,
    Stack
} from '@mui/material';
import {
    MarkEmailRead,
    Refresh,
    Close as CloseIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { alpha, keyframes } from '@mui/material/styles';

const scrollbarStyles = {
    '*::-webkit-scrollbar': {
        width: '8px',
    },
    '*::-webkit-scrollbar-track': {
        background: '#D7CCC8',
        borderRadius: '10px',
    },
    '*::-webkit-scrollbar-thumb': {
        background: '#A0522D',
        borderRadius: '10px',
        '&:hover': { background: '#8B4513' },
    },
};

const pulse = keyframes`
    0%, 100% { opacity: 0.6; transform: scale(1); }
    50% { opacity: 1; transform: scale(1.05); }
`;

const VerifyCodePage = ({ isModal = false, onClose, onVerificationSuccess, email: propEmail }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { verifyEmail } = useAuth();

    const [pin, setPin] = useState(['', '', '', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [error, setError] = useState('');
    const [resendAttempts, setResendAttempts] = useState(0);
    const MAX_RESEND_ATTEMPTS = 3;
    const [backgroundPosition, setBackgroundPosition] = useState({ x: 0, y: 0 });

    const email = propEmail || location.state?.email || localStorage.getItem('verificationEmail') || '';

    useEffect(() => {
        const handleMouseMove = (e) => {
            const x = e.clientX / window.innerWidth;
            const y = e.clientY / window.innerHeight;
            setBackgroundPosition({ x, y });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    useEffect(() => {
        if (email) {
            const savedAttempts = localStorage.getItem(`resendAttempts_${email}`);
            if (savedAttempts) {
                setResendAttempts(parseInt(savedAttempts, 10));
            }

            const attempts = savedAttempts ? parseInt(savedAttempts, 10) : 0;
            if (attempts >= MAX_RESEND_ATTEMPTS) {
                handleMaxAttemptsReached();
            }
        }
    }, [email]);

    useEffect(() => {
        if (!email && !isModal) {
            navigate('/signup');
        } else if (email) {
            localStorage.setItem('verificationEmail', email);
        }
    }, [email, location.state]);

    const handleMaxAttemptsReached = () => {
        setError('Հասանելի է փորձերի առավելագույն քանակը: Վերահղում դեպի գրանցում...');

        localStorage.removeItem('verificationEmail');
        localStorage.removeItem(`resendAttempts_${email}`);

        setTimeout(() => {
            if (isModal && onClose) {
                onClose();
            }
            navigate('/signup', {
                state: {
                    message: 'Հասանելի է փորձերի առավելագույն քանակը: Խնդրում ենք կրկին գրանցվել:'
                }
            });
        }, 2000);
    };

    const handlePinChange = (index, value) => {
        if (value.length <= 1 && /^\d*$/.test(value)) {
            const newPin = [...pin];
            newPin[index] = value;
            setPin(newPin);

            if (value && index < 5) {
                const nextInput = document.getElementById(`pin-input-${index + 1}`);
                if (nextInput) nextInput.focus();
            }

            setError('');
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !pin[index] && index > 0) {
            const prevInput = document.getElementById(`pin-input-${index - 1}`);
            if (prevInput) prevInput.focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text');
        const numbers = pastedData.replace(/\D/g, '').split('').slice(0, 6);

        const newPin = [...pin];
        numbers.forEach((num, index) => {
            if (index < 6) {
                newPin[index] = num;
            }
        });
        setPin(newPin);

        const lastFilledIndex = Math.min(numbers.length - 1, 5);
        const lastInput = document.getElementById(`pin-input-${lastFilledIndex}`);
        if (lastInput) lastInput.focus();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const pinCode = pin.join('');
        if (pinCode.length !== 6) {
            setError('Խնդրում ենք մուտքագրել 6-նիշ հաստատման կոդ');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const result = await verifyEmail(email, pinCode);

            if (result.success) {
                localStorage.removeItem('verificationEmail');
                localStorage.removeItem(`resendAttempts_${email}`);

                // Փակել հաստատման մոդալը
                if (isModal && onClose) {
                    onClose();
                }

                // Կանչել հաջողության callback-ը՝ մուտքի մոդալը բացելու համար HomePage-ում
                if (onVerificationSuccess) {
                    onVerificationSuccess();
                }
            } else {
                setError(result.message || 'Հաստատումը ձախողվեց: Խնդրում ենք կրկին փորձել:');
            }
        } catch (err) {
            console.error('Հաստատման սխալ:', err);
            setError('Հաստատումը ձախողվեց: Խնդրում ենք կրկին փորձել:');
        } finally {
            setLoading(false);
        }
    };

    const handleResendCode = async () => {
        if (resendAttempts >= MAX_RESEND_ATTEMPTS) {
            handleMaxAttemptsReached();
            return;
        }

        setResendLoading(true);
        setError('');

        try {
            const newAttempts = resendAttempts + 1;
            setResendAttempts(newAttempts);
            localStorage.setItem(`resendAttempts_${email}`, newAttempts.toString());

            const response = await fetch('/api/public/user/resend-verification', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email })
            });

            if (!response.ok) {
                throw new Error('Կոդի վերաուղարկումը ձախողվեց');
            }

            setPin(['', '', '', '', '', '']);

            if (newAttempts === MAX_RESEND_ATTEMPTS) {
                setError('Սա ձեր վերջին փորձն է: Դրանից հետո դուք կվերահղվեք գրանցման էջ:');
            }

        } catch (err) {
            setError('Կոդի վերաուղարկումը ձախողվեց: Խնդրում ենք կրկին փորձել:');
        } finally {
            setResendLoading(false);
        }
    };

    if (!email && !isModal) {
        return (
            <Box sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #D7CCC8 0%, #BCAAA4 100%)'
            }}>
                <CircularProgress sx={{ color: '#A0522D' }} />
            </Box>
        );
    }

    const content = (
        <>
            <GlobalStyles styles={scrollbarStyles} />
            <Box sx={isModal ? {} : {
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #D7CCC8 0%, #BCAAA4 100%)',
                fontFamily: "'Inter', sans-serif",
                padding: '20px',
                position: 'relative',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    background: `radial-gradient(circle at ${backgroundPosition.x * 100}% ${backgroundPosition.y * 100}%, rgba(160, 82, 45, 0.03) 0%, transparent 50%)`,
                    pointerEvents: 'none'
                }
            }}>
                <Backdrop
                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={loading}
                >
                    <CircularProgress sx={{ color: '#A0522D' }} />
                </Backdrop>

                <Box sx={{
                    width: '100%',
                    maxWidth: isModal ? '100%' : '520px',
                    margin: isModal ? 0 : '0 auto',
                    position: 'relative',
                    background: isModal ? 'transparent' : 'linear-gradient(135deg, #D7CCC8 0%, #BCAAA4 100%)',
                    borderRadius: '32px',
                    overflow: 'hidden',
                    fontFamily: 'Inter, sans-serif'
                }}>
                    <Box sx={{ position: 'relative', zIndex: 2 }}>
                        <Paper elevation={0} sx={{
                            borderRadius: '32px',
                            background: alpha('#FFFFFF', 0.95),
                            backdropFilter: 'blur(10px)',
                            boxShadow: isModal ? 'none' : '0 20px 40px rgba(0,0,0,0.08)',
                            border: isModal ? 'none' : '1px solid rgba(160, 82, 45, 0.15)',
                            overflow: 'hidden',
                            padding: isModal ? '0' : { xs: '30px 20px', sm: '40px 30px', md: '50px 40px' },
                            position: 'relative'
                        }}>
                            {/* Փակման կոճակ - Ցուցադրվում է միայն մոդալ ռեժիմում */}
                            {isModal && onClose && (
                                <IconButton
                                    onClick={onClose}
                                    sx={{
                                        position: 'absolute',
                                        top: 16,
                                        right: 16,
                                        zIndex: 10,
                                        backgroundColor: alpha('#000', 0.5),
                                        color: '#FFF',
                                        '&:hover': {
                                            backgroundColor: alpha('#000', 0.7)
                                        }
                                    }}
                                >
                                    <CloseIcon />
                                </IconButton>
                            )}

                            <Box sx={{
                                textAlign: 'center',
                                mb: 3,
                                pt: { xs: 4, sm: 5 },
                                px: { xs: 3, sm: 5 }
                            }}>
                                <Box sx={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: 1.5,
                                    mb: 2
                                }}>
                                    <Box sx={{
                                        width: 42,
                                        height: 42,
                                        borderRadius: '12px',
                                        background: 'linear-gradient(135deg, #A0522D 0%, #D4A373 100%)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        animation: `${pulse} 2s ease-in-out infinite`
                                    }}>
                                        <MarkEmailRead sx={{ color: 'white', fontSize: 24 }} />
                                    </Box>
                                    <Typography variant="h5" sx={{
                                        fontWeight: 800,
                                        background: 'linear-gradient(135deg, #A0522D 0%, #D4A373 100%)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        letterSpacing: '-0.5px'
                                    }}>
                                        Թանգարան
                                    </Typography>
                                </Box>
                                <Typography variant="h4" sx={{
                                    fontSize: { xs: '28px', sm: '32px' },
                                    fontWeight: 700,
                                    color: '#3E2723',
                                    mb: 1
                                }}>
                                    Հաստատեք Ձեր Էլ.փոստը
                                </Typography>
                                <Typography sx={{
                                    color: '#6B4C3A',
                                    fontSize: '14px',
                                    mb: 2
                                }}>
                                    Մուտքագրեք 6-նիշ կոդը, որն ուղարկվել է
                                </Typography>
                                <Typography sx={{
                                    color: '#A0522D',
                                    fontSize: '15px',
                                    fontWeight: 600,
                                    mb: 2,
                                    padding: '6px 16px',
                                    background: alpha('#A0522D', 0.05),
                                    borderRadius: '20px',
                                    display: 'inline-block'
                                }}>
                                    {email}
                                </Typography>
                                <Box sx={{
                                    width: 50,
                                    height: 3,
                                    background: 'linear-gradient(90deg, #A0522D, #D4A373)',
                                    borderRadius: 2,
                                    mx: 'auto',
                                    mt: 1
                                }} />
                            </Box>

                            {/* Փորձերի հաշվիչ */}
                            <Box sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                gap: '8px',
                                marginBottom: '24px'
                            }}>
                                <Typography sx={{
                                    color: '#6B4C3A',
                                    fontSize: '13px',
                                    padding: '4px 16px',
                                    background: alpha('#A0522D', 0.05),
                                    borderRadius: '20px',
                                    border: '1px solid rgba(160, 82, 45, 0.15)',
                                    fontWeight: 500
                                }}>
                                    Փորձեր: <span style={{ color: '#A0522D', fontWeight: 700 }}>{resendAttempts}</span>/{MAX_RESEND_ATTEMPTS}
                                </Typography>
                            </Box>

                            {error && (
                                <Fade in={!!error}>
                                    <Alert
                                        severity="error"
                                        sx={{
                                            marginBottom: '20px',
                                            borderRadius: '16px',
                                            fontSize: '13px',
                                            padding: '8px 16px',
                                            bgcolor: alpha('#D32F2F', 0.05),
                                            color: '#D32F2F',
                                            border: '1px solid rgba(211, 47, 47, 0.15)',
                                            '& .MuiAlert-icon': {
                                                color: '#D32F2F'
                                            }
                                        }}
                                    >
                                        {error}
                                    </Alert>
                                </Fade>
                            )}

                            <Box component="form" onSubmit={handleSubmit} sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '24px',
                                p: { xs: 3, sm: 5 },
                                pt: { xs: 2, sm: 3 }
                            }}>
                                {/* PIN Մուտքագրման Դաշտեր */}
                                <Box sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    gap: { xs: '8px', sm: '12px' },
                                    marginBottom: '10px'
                                }}>
                                    {pin.map((digit, index) => (
                                        <TextField
                                            key={index}
                                            id={`pin-input-${index}`}
                                            type="text"
                                            inputMode="numeric"
                                            value={digit}
                                            onChange={(e) => handlePinChange(index, e.target.value)}
                                            onKeyDown={(e) => handleKeyDown(index, e)}
                                            onPaste={index === 0 ? handlePaste : undefined}
                                            disabled={resendAttempts >= MAX_RESEND_ATTEMPTS}
                                            inputProps={{
                                                maxLength: 1,
                                                style: {
                                                    textAlign: 'center',
                                                    fontSize: '24px',
                                                    fontWeight: 600,
                                                    padding: '12px',
                                                    color: '#A0522D'
                                                }
                                            }}
                                            sx={{
                                                width: { xs: '45px', sm: '56px' },
                                                height: { xs: '45px', sm: '56px' },
                                                '& .MuiOutlinedInput-root': {
                                                    background: '#FAFAFA',
                                                    borderRadius: '12px',
                                                    '& fieldset': {
                                                        borderColor: 'rgba(160, 82, 45, 0.15)',
                                                        borderWidth: '1px',
                                                    },
                                                    '&:hover fieldset': {
                                                        borderColor: '#D4A373 !important',
                                                    },
                                                    '&.Mui-focused fieldset': {
                                                        borderColor: '#A0522D !important',
                                                        borderWidth: '2px',
                                                    },
                                                    '&.Mui-focused': {
                                                        boxShadow: '0 0 10px rgba(160, 82, 45, 0.15)',
                                                    }
                                                },
                                                '& .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: 'rgba(160, 82, 45, 0.15)',
                                                },
                                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: '#D4A373',
                                                },
                                                '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: '#A0522D',
                                                }
                                            }}
                                        />
                                    ))}
                                </Box>

                                {/* Կոճակներ կողք-կողքի */}
                                <Stack direction="row" spacing={2}>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        disabled={loading || pin.join('').length !== 6 || resendAttempts >= MAX_RESEND_ATTEMPTS}
                                        sx={{
                                            flex: 1,
                                            background: 'linear-gradient(135deg, #A0522D 0%, #D4A373 100%)',
                                            color: '#FFFFFF',
                                            padding: '12px',
                                            borderRadius: '12px',
                                            fontSize: '16px',
                                            fontWeight: 700,
                                            textTransform: 'none',
                                            height: '48px',
                                            boxShadow: '0 4px 12px rgba(160, 82, 45, 0.25)',
                                            '&:hover': {
                                                transform: 'translateY(-2px)',
                                                boxShadow: '0 6px 16px rgba(160, 82, 45, 0.35)',
                                                background: 'linear-gradient(135deg, #8B4513 0%, #C49A6C 100%)'
                                            },
                                            '&:disabled': {
                                                background: '#E0E0E0',
                                                color: '#9E9E9E',
                                                boxShadow: 'none',
                                                transform: 'none'
                                            },
                                            transition: 'all 0.3s'
                                        }}
                                    >
                                        {loading ? (
                                            <CircularProgress size={24} sx={{ color: '#FFFFFF' }} />
                                        ) : (
                                            'Հաստատել Էլ.փոստը'
                                        )}
                                    </Button>

                                    <Button
                                        onClick={handleResendCode}
                                        variant="outlined"
                                        disabled={resendLoading || resendAttempts >= MAX_RESEND_ATTEMPTS}
                                        startIcon={resendLoading ? <CircularProgress size={20} sx={{ color: '#A0522D' }} /> : <Refresh />}
                                        sx={{
                                            flex: 1,
                                            color: '#A0522D',
                                            textTransform: 'none',
                                            fontSize: '16px',
                                            fontWeight: 600,
                                            padding: '12px',
                                            borderRadius: '12px',
                                            border: '1px solid rgba(160, 82, 45, 0.5)',
                                            height: '48px',
                                            '&:hover': {
                                                backgroundColor: alpha('#A0522D', 0.05),
                                                borderColor: '#A0522D',
                                                transform: 'translateY(-2px)'
                                            },
                                            '&:disabled': {
                                                color: '#BDBDBD',
                                                borderColor: '#E0E0E0'
                                            },
                                            transition: 'all 0.3s'
                                        }}
                                    >
                                        {resendLoading ? 'Ուղարկվում է...' : (resendAttempts >= MAX_RESEND_ATTEMPTS ? 'Փորձերի առավելագույն քանակ' : 'Վերաուղարկել Կոդը')}
                                    </Button>
                                </Stack>
                            </Box>
                        </Paper>
                    </Box>
                </Box>
            </Box>
        </>
    );

    return content;
};

export default VerifyCodePage;