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
    Backdrop
} from '@mui/material';
import { useAuth } from '../context/AuthContext';

const VerifyCodePage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { verifyEmail } = useAuth();

    const [pin, setPin] = useState(['', '', '', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [countdown, setCountdown] = useState(120); // 2 minutes (120 seconds)
    const [resendAttempts, setResendAttempts] = useState(0); // Track resend attempts
    const MAX_RESEND_ATTEMPTS = 3;
    const [isAutoResending, setIsAutoResending] = useState(false);

    // Get email from location state or localStorage
    const email = location.state?.email || localStorage.getItem('verificationEmail') || '';

    // Load saved resend attempts from localStorage
    useEffect(() => {
        if (email) {
            const savedAttempts = localStorage.getItem(`resendAttempts_${email}`);
            if (savedAttempts) {
                setResendAttempts(parseInt(savedAttempts, 10));
            }

            // Check if already exceeded max attempts
            const attempts = savedAttempts ? parseInt(savedAttempts, 10) : 0;
            if (attempts >= MAX_RESEND_ATTEMPTS) {
                handleMaxAttemptsReached();
            }
        }
    }, [email]);

    useEffect(() => {
        if (!email) {
            navigate('/signup');
        } else {
            localStorage.setItem('verificationEmail', email);
        }

        // Auto send first verification code if specified
        if (location.state?.autoSend) {
            handleManualResendCode();
        }
    }, [email, location.state]);

    // Auto resend when countdown reaches 0
    useEffect(() => {
        if (countdown === 0 && resendAttempts < MAX_RESEND_ATTEMPTS && !isAutoResending) {
            handleAutoResendCode();
        }
    }, [countdown]);

    // Countdown timer
    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => {
                setCountdown(countdown - 1);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    const handleMaxAttemptsReached = () => {
        setError('Maximum verification attempts reached. Redirecting to signup...');

        // Clear stored data
        localStorage.removeItem('verificationEmail');
        localStorage.removeItem(`resendAttempts_${email}`);

        // Auto redirect to signup after 2 seconds
        setTimeout(() => {
            navigate('/signup', {
                state: {
                    message: 'Maximum verification attempts reached. Please sign up again.'
                }
            });
        }, 2000);
    };

    const handleAutoResendCode = async () => {
        if (resendAttempts >= MAX_RESEND_ATTEMPTS) {
            handleMaxAttemptsReached();
            return;
        }

        setIsAutoResending(true);

        try {
            const newAttempts = resendAttempts + 1;
            setResendAttempts(newAttempts);
            localStorage.setItem(`resendAttempts_${email}`, newAttempts.toString());

            // Make API call to resend code
            const response = await fetch('/api/public/user/resend-verification', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email })
            });

            if (!response.ok) {
                throw new Error('Failed to resend code');
            }

            setSuccess(`New verification code sent automatically (Attempt ${newAttempts}/${MAX_RESEND_ATTEMPTS})`);
            setCountdown(120); // Reset to 2 minutes
            setPin(['', '', '', '', '', '']); // Clear PIN inputs

            // If this was the last attempt, show warning
            if (newAttempts === MAX_RESEND_ATTEMPTS) {
                setError('This is your last attempt. After this, you will be redirected to signup.');
            }

        } catch (err) {
            setError('Failed to auto-resend code. Please try manually.');
        } finally {
            setIsAutoResending(false);
        }
    };

    const handlePinChange = (index, value) => {
        if (value.length <= 1 && /^\d*$/.test(value)) {
            const newPin = [...pin];
            newPin[index] = value;
            setPin(newPin);

            // Auto focus next input
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

        // Focus the last filled input
        const lastFilledIndex = Math.min(numbers.length - 1, 5);
        const lastInput = document.getElementById(`pin-input-${lastFilledIndex}`);
        if (lastInput) lastInput.focus();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const pinCode = pin.join('');
        if (pinCode.length !== 6) {
            setError('Please enter a 6-digit verification code');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const result = await verifyEmail(email, pinCode);

            if (result.success) {
                setSuccess('Email verified successfully! Redirecting to login...');

                // Clear stored data
                localStorage.removeItem('verificationEmail');
                localStorage.removeItem(`resendAttempts_${email}`);

                // Redirect to login after delay
                setTimeout(() => {
                    navigate('/login', {
                        state: {
                            message: 'Email verified successfully! Please login.',
                            verifiedEmail: email
                        }
                    });
                }, 2000);
            } else {
                setError(result.message || 'Verification failed. Please try again.');
            }
        } catch (err) {
            setError('Verification failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleManualResendCode = async () => {
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
                throw new Error('Failed to resend code');
            }

            setSuccess(`Verification code resent manually (Attempt ${newAttempts}/${MAX_RESEND_ATTEMPTS})`);
            setCountdown(120); // Reset to 2 minutes
            setPin(['', '', '', '', '', '']); // Clear PIN inputs

        } catch (err) {
            setError('Failed to resend code. Please try again.');
        } finally {
            setResendLoading(false);
        }
    };

    const handleBackToSignup = () => {
        // Clear stored data
        localStorage.removeItem('verificationEmail');
        localStorage.removeItem(`resendAttempts_${email}`);
        navigate('/signup');
    };

    if (!email) {
        return (
            <Box sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#0A0A0A'
            }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#0A0A0A',
            fontFamily: "'Inter', sans-serif",
            padding: '20px'
        }}>
            {/* Backdrop for loading */}
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={loading || isAutoResending}
            >
                <CircularProgress color="inherit" />
            </Backdrop>

            {/* VerifyEmail Block */}
            <Box sx={{
                width: '100%',
                maxWidth: '500px',
                background: '#121212',
                borderRadius: '16px',
                padding: { xs: '30px 20px', sm: '40px 30px', md: '50px 40px' },
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                position: 'relative',
                border: '1px solid #2A2A2A'
            }}>
                {/* Close button */}
                <Box
                    onClick={handleBackToSignup}
                    sx={{
                        position: 'absolute',
                        top: '20px',
                        right: '20px',
                        width: '32px',
                        height: '32px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '50%',
                        background: '#1A1A1A',
                        cursor: 'pointer',
                        border: '1px solid #2A2A2A',
                        '&:hover': {
                            background: '#2A2A2A',
                            borderColor: '#4ADE80'
                        }
                    }}
                >
                    <Typography sx={{
                        color: '#9CA3AF',
                        fontSize: '20px',
                        fontWeight: 300,
                        lineHeight: 1,
                        '&:hover': {
                            color: '#4ADE80'
                        }
                    }}>
                        ×
                    </Typography>
                </Box>

                {/* Header */}
                <Typography variant="h4" sx={{
                    fontSize: { xs: '28px', sm: '32px', md: '36px' },
                    fontWeight: 700,
                    color: '#F3F4F6',
                    marginBottom: '8px',
                    textAlign: 'center'
                }}>
                    Verify Your Email
                </Typography>

                <Typography sx={{
                    fontSize: '16px',
                    color: '#9CA3AF',
                    marginBottom: '30px',
                    textAlign: 'center'
                }}>
                    Enter the 6-digit code sent to
                    <br />
                    <Typography component="span" sx={{
                        color: '#4ADE80',
                        fontWeight: 600,
                        textShadow: '0 0 10px rgba(74, 222, 128, 0.3)'
                    }}>
                        {email}
                    </Typography>
                </Typography>

                {/* Attempts counter and auto-resend info */}
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '20px'
                }}>
                    <Typography sx={{
                        color: '#9CA3AF',
                        fontSize: '14px',
                        padding: '4px 12px',
                        background: '#1A1A1A',
                        borderRadius: '16px',
                        border: '1px solid #2A2A2A'
                    }}>
                        Attempts: {resendAttempts}/{MAX_RESEND_ATTEMPTS}
                    </Typography>

                    {resendAttempts < MAX_RESEND_ATTEMPTS && countdown > 0 && (
                        <Typography sx={{
                            color: '#4ADE80',
                            fontSize: '13px',
                            fontStyle: 'italic',
                            textShadow: '0 0 8px rgba(74, 222, 128, 0.3)'
                        }}>
                            Next code will be sent automatically in {Math.floor(countdown / 60)}:{String(countdown % 60).padStart(2, '0')}
                        </Typography>
                    )}
                </Box>

                {/* Alerts */}
                {error && (
                    <Fade in={!!error}>
                        <Alert
                            severity="error"
                            sx={{
                                marginBottom: '20px',
                                borderRadius: '8px',
                                fontSize: '14px',
                                padding: '8px 16px',
                                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                                color: '#FCA5A5',
                                border: '1px solid rgba(239, 68, 68, 0.3)',
                                '& .MuiAlert-icon': {
                                    color: '#EF4444'
                                }
                            }}
                        >
                            {error}
                        </Alert>
                    </Fade>
                )}

                {success && (
                    <Fade in={!!success}>
                        <Alert
                            severity="success"
                            sx={{
                                marginBottom: '20px',
                                borderRadius: '8px',
                                fontSize: '14px',
                                padding: '8px 16px',
                                backgroundColor: 'rgba(74, 222, 128, 0.1)',
                                color: '#4ADE80',
                                border: '1px solid rgba(74, 222, 128, 0.3)',
                                '& .MuiAlert-icon': {
                                    color: '#4ADE80'
                                }
                            }}
                        >
                            {success}
                        </Alert>
                    </Fade>
                )}

                {/* PIN Input Form */}
                <Box component="form" onSubmit={handleSubmit} sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '24px'
                }}>
                    {/* PIN Inputs */}
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '12px',
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
                                        color: '#4ADE80'
                                    }
                                }}
                                sx={{
                                    width: '56px',
                                    height: '56px',
                                    '& .MuiOutlinedInput-root': {
                                        background: '#1A1A1A',
                                        borderRadius: '8px',
                                        border: '1px solid #2A2A2A',
                                        '&:hover .MuiOutlinedInput-notchedOutline': {
                                            borderColor: '#4ADE80',
                                        },
                                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                            borderColor: '#4ADE80',
                                            borderWidth: '2px',
                                            boxShadow: '0 0 10px rgba(74, 222, 128, 0.3)'
                                        }
                                    }
                                }}
                            />
                        ))}
                    </Box>

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={loading || pin.join('').length !== 6 || resendAttempts >= MAX_RESEND_ATTEMPTS}
                        sx={{
                            background: 'linear-gradient(90deg, #22C55E 0%, #4ADE80 100%)',
                            color: '#FFFFFF',
                            padding: '12px',
                            borderRadius: '8px',
                            fontSize: '16px',
                            fontWeight: 700,
                            textTransform: 'none',
                            height: '48px',
                            boxShadow: '0 4px 15px rgba(74, 222, 128, 0.3)',
                            '&:hover': {
                                background: 'linear-gradient(90deg, #16A34A 0%, #22C55E 100%)',
                                boxShadow: '0 6px 20px rgba(74, 222, 128, 0.4)',
                            },
                            '&:disabled': {
                                background: '#374151',
                                color: '#9CA3AF',
                                boxShadow: 'none'
                            }
                        }}
                    >
                        {loading ? (
                            <CircularProgress size={24} sx={{ color: '#FFFFFF' }} />
                        ) : (
                            'Verify Email'
                        )}
                    </Button>

                    {/* Manual Resend Button */}
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '12px',
                        marginTop: '10px'
                    }}>
                        <Button
                            onClick={handleManualResendCode}
                            disabled={resendLoading || resendAttempts >= MAX_RESEND_ATTEMPTS}
                            sx={{
                                color: '#4ADE80',
                                textTransform: 'none',
                                fontSize: '14px',
                                fontWeight: 600,
                                padding: '4px 12px',
                                border: '1px solid rgba(74, 222, 128, 0.3)',
                                borderRadius: '20px',
                                '&:hover': {
                                    backgroundColor: 'rgba(74, 222, 128, 0.1)',
                                    borderColor: '#4ADE80',
                                },
                                '&:disabled': {
                                    color: '#6B7280',
                                    borderColor: '#374151'
                                }
                            }}
                        >
                            {resendLoading ? (
                                <CircularProgress size={16} sx={{ color: '#4ADE80' }} />
                            ) : resendAttempts >= MAX_RESEND_ATTEMPTS ? (
                                'Max attempts reached'
                            ) : (
                                'Manual Resend'
                            )}
                        </Button>
                    </Box>
                </Box>

                {/* Info Message */}
                <Box sx={{
                    marginTop: '30px',
                    padding: '16px',
                    background: 'rgba(74, 222, 128, 0.05)',
                    borderRadius: '8px',
                    borderLeft: '4px solid #4ADE80',
                    border: '1px solid rgba(74, 222, 128, 0.2)'
                }}>
                    <Typography sx={{
                        color: '#D1D5DB',
                        fontSize: '13px',
                        lineHeight: 1.5
                    }}>
                        <strong style={{ color: '#4ADE80' }}>Auto-Resend Active:</strong> A new code will be automatically sent every 2 minutes.
                        You have <span style={{ color: '#4ADE80', fontWeight: 600 }}>{MAX_RESEND_ATTEMPTS - resendAttempts}</span> attempts remaining.
                        {resendAttempts === MAX_RESEND_ATTEMPTS - 1 && ' This is your last attempt!'}
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
};

export default VerifyCodePage;