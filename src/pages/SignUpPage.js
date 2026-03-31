import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    TextField,
    Button,
    Typography,
    Box,
    Alert,
    IconButton,
    InputAdornment,
    Fade,
    CircularProgress,
    FormControlLabel,
    Checkbox
} from '@mui/material';
import {
    Visibility,
    VisibilityOff
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const SignUpPage = ({ isModal = false, onClose, onSwitchToLogin, onSuccess }) => {
    const navigate = useNavigate();
    const { signup } = useAuth();

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [acceptTerms, setAcceptTerms] = useState(false);

    const [formData, setFormData] = useState({
        userName: '',
        email: '',
        password: '',
        repeatPassword: ''
    });

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleClickShowConfirmPassword = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setError('');
    };

    const validateForm = () => {
        // Username validation
        if (!formData.userName.trim()) {
            setError('Username is required');
            return false;
        }

        if (formData.userName.length < 3) {
            setError('Username must be at least 3 characters');
            return false;
        }

        if (formData.userName.length > 20) {
            setError('Username must be less than 20 characters');
            return false;
        }

        // Email validation
        if (!formData.email) {
            setError('Email is required');
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError('Please enter a valid email address');
            return false;
        }

        // Check if it's Gmail (backend requirement)
        if (!formData.email.endsWith('@gmail.com')) {
            setError('Please use a Gmail address (example@gmail.com)');
            return false;
        }

        // Password validation
        if (!formData.password) {
            setError('Password is required');
            return false;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return false;
        }

        // Confirm password
        if (!formData.repeatPassword) {
            setError('Please confirm your password');
            return false;
        }

        if (formData.password !== formData.repeatPassword) {
            setError('Passwords do not match');
            return false;
        }

        // Terms acceptance
        if (!acceptTerms) {
            setError('Please accept the terms and conditions');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);
        setError('');

        try {
            console.log('Submitting form data:', formData);

            const result = await signup(formData);

            if (result.success) {
                setSuccess('Account created! Please check your email for verification code.');

                if (onSuccess) {
                    onSuccess(formData.email);
                } else if (isModal && onClose) {
                    onClose();
                    // Navigate to verify page after modal closes
                    setTimeout(() => {
                        navigate('/verify-code', {
                            state: {
                                email: formData.email,
                                autoSend: true,
                                fromSignUp: true
                            }
                        });
                    }, 300);
                } else {
                    // Navigate directly to verify page with email
                    navigate('/verify-code', {
                        state: {
                            email: formData.email,
                            autoSend: true,
                            fromSignUp: true
                        }
                    });
                }
            } else {
                // Show backend error message
                setError(result.message || 'Something went wrong. Please try again.');
            }
        } catch (err) {
            console.error('Submit error:', err);

            // Handle 409 error - show user-friendly message
            if (err.response && err.response.status === 409) {
                setError('Please use English letters only');
            } else if (err.message && err.message.includes('409')) {
                setError('Please use English letters only');
            } else if (err.status === 409) {
                setError('Please use English letters only');
            } else {
                setError('Something went wrong. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleAcceptTermsChange = (event) => {
        setAcceptTerms(event.target.checked);
    };

    const handleSignInClick = (e) => {
        e.preventDefault();
        if (isModal && onSwitchToLogin) {
            onSwitchToLogin();
        } else if (isModal && onClose) {
            onClose();
            setTimeout(() => navigate('/login'), 100);
        } else {
            navigate('/login');
        }
    };

    return (
        <Box sx={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            background: isModal ? '#121212' : '#0A0A0A',
            fontFamily: "'Inter', sans-serif",
            overflow: 'hidden',
        }}>
            {/* Signup Form */}
            <Box sx={{
                flex: '0 0 100%',
                height: '100%',
                background: '#121212',
                display: 'flex',
                flexDirection: 'column',
                padding: isModal
                    ? { xs: '30px 20px', sm: '40px 40px', md: '50px 60px' }
                    : { xs: '40px 20px', sm: '50px 30px', md: '60px 40px' },
                position: 'relative',
                overflow: 'hidden',
                fontFamily: "'Inter', sans-serif",
                width: '100%',
            }}>
                {/* Main Form Container */}
                <Box sx={{
                    width: '100%',
                    maxWidth: { xs: '320px', sm: '350px', md: isModal ? '400px' : '380px' },
                    margin: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    background: 'transparent',
                    fontFamily: "'Inter', sans-serif"
                }}>
                    <Typography variant="h4" sx={{
                        fontSize: { xs: '28px', sm: '32px', md: isModal ? '36px' : '36px' },
                        fontWeight: 700,
                        color: '#F3F4F6',
                        marginBottom: { xs: '20px', md: '30px' },
                        textAlign: 'left',
                        fontFamily: "'Inter', sans-serif"
                    }}>
                        Sign Up
                    </Typography>

                    {/* Alerts */}
                    {error && (
                        <Fade in={!!error}>
                            <Alert severity="error" sx={{
                                marginBottom: '20px',
                                borderRadius: '8px',
                                fontSize: '14px',
                                padding: '8px 16px',
                                fontFamily: "'Inter', sans-serif",
                                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                                color: '#FCA5A5',
                                border: '1px solid rgba(239, 68, 68, 0.3)',
                                '& .MuiAlert-icon': {
                                    color: '#EF4444'
                                }
                            }}>
                                {error}
                            </Alert>
                        </Fade>
                    )}

                    {success && (
                        <Fade in={!!success}>
                            <Alert severity="success" sx={{
                                marginBottom: '20px',
                                borderRadius: '8px',
                                fontSize: '14px',
                                padding: '8px 16px',
                                fontFamily: "'Inter', sans-serif",
                                backgroundColor: 'rgba(74, 222, 128, 0.1)',
                                color: '#4ADE80',
                                border: '1px solid rgba(74, 222, 128, 0.3)',
                                '& .MuiAlert-icon': {
                                    color: '#4ADE80'
                                }
                            }}>
                                {success}
                            </Alert>
                        </Fade>
                    )}

                    {/* Signup Form */}
                    <Box component="form" onSubmit={handleSubmit} sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: { xs: '12px', md: '16px' },
                        fontFamily: "'Inter', sans-serif"
                    }}>
                        {/* Username Field */}
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <Typography sx={{
                                fontSize: { xs: '16px', md: isModal ? '16px' : '18px' },
                                fontWeight: 700,
                                color: '#F3F4F6',
                                textTransform: 'none',
                                letterSpacing: 'normal',
                                fontFamily: "'Inter', sans-serif",
                                marginBottom: '8px'
                            }}>
                                Username
                            </Typography>
                            <TextField
                                fullWidth
                                type="text"
                                name="userName"
                                value={formData.userName}
                                onChange={handleInputChange}
                                placeholder="Enter your username (3-20 characters)"
                                required
                                variant="outlined"
                                size="small"
                                sx={{
                                    fontFamily: "'Inter', sans-serif",
                                    '& .MuiOutlinedInput-root': {
                                        fontSize: { xs: '14px', md: isModal ? '14px' : '16px' },
                                        height: { xs: '44px', md: isModal ? '44px' : '48px' },
                                        background: '#1A1A1A',
                                        color: '#808080',
                                        fontFamily: "'Inter', sans-serif",
                                        '&:hover .MuiOutlinedInput-notchedOutline': {
                                            borderColor: '#009688',
                                        },
                                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                            borderColor: '#4CAF50',
                                        }
                                    },
                                    '& .MuiOutlinedInput-input': {
                                        fontFamily: "'Inter', sans-serif",
                                    }
                                }}
                            />
                        </Box>

                        {/* Email Field */}
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <Typography sx={{
                                fontSize: { xs: '16px', md: isModal ? '16px' : '18px' },
                                fontWeight: 700,
                                color: '#F3F4F6',
                                textTransform: 'none',
                                letterSpacing: 'normal',
                                fontFamily: "'Inter', sans-serif",
                                marginBottom: '8px'
                            }}>
                                Email
                            </Typography>
                            <TextField
                                fullWidth
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="example@gmail.com"
                                required
                                variant="outlined"
                                size="small"
                                sx={{
                                    fontFamily: "'Inter', sans-serif",
                                    '& .MuiOutlinedInput-root': {
                                        fontSize: { xs: '14px', md: isModal ? '14px' : '16px' },
                                        height: { xs: '44px', md: isModal ? '44px' : '48px' },
                                        background: '#1A1A1A',
                                        color: '#808080',
                                        fontFamily: "'Inter', sans-serif",
                                        '&:hover .MuiOutlinedInput-notchedOutline': {
                                            borderColor: '#009688',
                                        },
                                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                            borderColor: '#4CAF50',
                                        }
                                    },
                                    '& .MuiOutlinedInput-input': {
                                        fontFamily: "'Inter', sans-serif",
                                    }
                                }}
                            />
                        </Box>

                        {/* Password Field */}
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <Typography sx={{
                                fontSize: { xs: '16px', md: isModal ? '16px' : '18px' },
                                fontWeight: 700,
                                color: '#F3F4F6',
                                textTransform: 'none',
                                letterSpacing: 'normal',
                                fontFamily: "'Inter', sans-serif",
                                marginBottom: '8px'
                            }}>
                                Password
                            </Typography>
                            <TextField
                                fullWidth
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                placeholder="Minimum 6 characters"
                                required
                                variant="outlined"
                                size="small"
                                sx={{
                                    fontFamily: "'Inter', sans-serif",
                                    '& .MuiOutlinedInput-root': {
                                        fontSize: { xs: '14px', md: isModal ? '14px' : '16px' },
                                        height: { xs: '44px', md: isModal ? '44px' : '48px' },
                                        background: '#1A1A1A',
                                        color: '#808080',
                                        fontFamily: "'Inter', sans-serif",
                                        '&:hover .MuiOutlinedInput-notchedOutline': {
                                            borderColor: '#009688',
                                        },
                                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                            borderColor: '#4CAF50',
                                        }
                                    },
                                    '& .MuiOutlinedInput-input': {
                                        fontFamily: "'Inter', sans-serif",
                                    }
                                }}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={handleClickShowPassword}
                                                onMouseDown={handleMouseDownPassword}
                                                edge="end"
                                                size="small"
                                                sx={{ color: '#9CA3AF' }}
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <Typography sx={{
                                fontSize: '12px',
                                color: '#9CA3AF',
                                marginTop: '4px'
                            }}>
                                Password must be at least 6 characters long
                            </Typography>
                        </Box>

                        {/* Confirm Password Field */}
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <Typography sx={{
                                fontSize: { xs: '16px', md: isModal ? '16px' : '18px' },
                                fontWeight: 700,
                                color: '#F3F4F6',
                                textTransform: 'none',
                                letterSpacing: 'normal',
                                fontFamily: "'Inter', sans-serif",
                                marginBottom: '8px'
                            }}>
                                Confirm Password
                            </Typography>
                            <TextField
                                fullWidth
                                type={showConfirmPassword ? 'text' : 'password'}
                                name="repeatPassword"
                                value={formData.repeatPassword}
                                onChange={handleInputChange}
                                placeholder="Confirm your password"
                                required
                                variant="outlined"
                                size="small"
                                sx={{
                                    fontFamily: "'Inter', sans-serif",
                                    '& .MuiOutlinedInput-root': {
                                        fontSize: { xs: '14px', md: isModal ? '14px' : '16px' },
                                        height: { xs: '44px', md: isModal ? '44px' : '48px' },
                                        background: '#1A1A1A',
                                        color: '#808080',
                                        fontFamily: "'Inter', sans-serif",
                                        '&:hover .MuiOutlinedInput-notchedOutline': {
                                            borderColor: '#009688',
                                        },
                                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                            borderColor: '#4CAF50',
                                        }
                                    },
                                    '& .MuiOutlinedInput-input': {
                                        fontFamily: "'Inter', sans-serif",
                                    }
                                }}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={handleClickShowConfirmPassword}
                                                onMouseDown={handleMouseDownPassword}
                                                edge="end"
                                                size="small"
                                                sx={{ color: '#9CA3AF' }}
                                            >
                                                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Box>

                        {/* Terms and Conditions */}
                        <Box sx={{ marginTop: '4px' }}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={acceptTerms}
                                        onChange={handleAcceptTermsChange}
                                        size="small"
                                        sx={{
                                            color: '#9CA3AF',
                                            '&.Mui-checked': {
                                                color: '#4CAF50',
                                            },
                                        }}
                                    />
                                }
                                label={
                                    <Typography sx={{
                                        color: '#9CA3AF',
                                        fontSize: { xs: '12px', md: isModal ? '12px' : '14px' },
                                        fontFamily: "'Inter', sans-serif",
                                        fontWeight: 500
                                    }}>
                                        I agree to the{' '}
                                        <Button
                                            component="span"
                                            sx={{
                                                color: '#009688',
                                                textDecoration: 'none',
                                                fontWeight: 600,
                                                fontSize: 'inherit',
                                                padding: 0,
                                                minWidth: 'auto',
                                                textTransform: 'none',
                                                verticalAlign: 'baseline'
                                            }}
                                        >
                                            Terms of Service
                                        </Button>{' '}
                                        and{' '}
                                        <Button
                                            component="span"
                                            sx={{
                                                color: '#009688',
                                                textDecoration: 'none',
                                                fontWeight: 600,
                                                fontSize: 'inherit',
                                                padding: 0,
                                                minWidth: 'auto',
                                                textTransform: 'none',
                                                verticalAlign: 'baseline'
                                            }}
                                        >
                                            Privacy Policy
                                        </Button>
                                    </Typography>
                                }
                            />
                        </Box>

                        {/* Create Account Button */}
                        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={loading}
                                sx={{
                                    background: 'linear-gradient(90deg, #009688 0%, #4CAF50 100%)',
                                    color: '#FFFFFF',
                                    padding: { xs: '6px 20px', md: '8px 24px' },
                                    borderRadius: '8px',
                                    fontSize: isModal ? '16px' : '17px',
                                    fontWeight: 700,
                                    textTransform: 'none',
                                    height: { xs: '44px', md: '48px' },
                                    fontFamily: "'Inter', sans-serif",
                                    width: { xs: '160px', md: '180px' },
                                    minWidth: { xs: '160px', md: '180px' },
                                    '&:hover': {
                                        background: 'linear-gradient(90deg, #008577 0%, #45a049 100%)',
                                    }
                                }}
                            >
                                {loading ? (
                                    <CircularProgress size={20} sx={{ color: '#FFFFFF' }} />
                                ) : (
                                    'Sign Up'
                                )}
                            </Button>
                        </Box>

                        {/* Already have an account Link */}
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px',
                            marginTop: '20px',
                            flexWrap: 'wrap'
                        }}>
                            <Typography sx={{
                                color: '#9CA3AF',
                                fontSize: { xs: '14px', md: isModal ? '14px' : '16px' },
                                fontFamily: "'Inter', sans-serif",
                                fontWeight: 700,
                                textAlign: 'center'
                            }}>
                                Already have an account?
                            </Typography>
                            <Button
                                onClick={handleSignInClick}
                                sx={{
                                    color: '#4CAF50',
                                    textTransform: 'none',
                                    fontSize: { xs: '14px', md: isModal ? '14px' : '16px' },
                                    fontWeight: 700,
                                    padding: 0,
                                    minWidth: 'auto',
                                    fontFamily: "'Inter', sans-serif"
                                }}
                            >
                                Sign In
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default SignUpPage;