import React, { useState, useEffect } from 'react';
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
    Checkbox,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions
} from '@mui/material';
import {
    Visibility,
    VisibilityOff
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/public';

const LoginPage = ({ isModal = false, onClose, onSwitchToSignup }) => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [rememberMe, setRememberMe] = useState(false);

    // Forgot Password Dialog State
    const [forgotPasswordDialogOpen, setForgotPasswordDialogOpen] = useState(false);
    const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
    const [forgotPasswordMessage, setForgotPasswordMessage] = useState('');
    const [forgotPasswordError, setForgotPasswordError] = useState('');

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
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
        if (!formData.email) {
            setError('Email is required');
            return false;
        }

        if (!formData.password) {
            setError('Password is required');
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
            console.log('Attempting login for:', formData.email);

            const result = await login(formData.email, formData.password);

            console.log('Login result:', result);

            if (result.success) {
                setSuccess('Login successful! Redirecting...');

                if (isModal && onClose) {
                    onClose();
                }

                navigate('/', { replace: true });
            } else {
                setError(result.message || 'Invalid email or password');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Open Forgot Password Dialog
    const handleForgotPasswordClick = () => {
        // Use the email from form if available
        setForgotPasswordEmail(formData.email || '');
        setForgotPasswordDialogOpen(true);
        setForgotPasswordMessage('');
        setForgotPasswordError('');
    };

    // Close Forgot Password Dialog
    const handleForgotPasswordClose = () => {
        setForgotPasswordDialogOpen(false);
        setForgotPasswordEmail('');
        setForgotPasswordMessage('');
        setForgotPasswordError('');
    };

    // Handle Forgot Password Submit
    const handleForgotPasswordSubmit = async () => {
        if (!forgotPasswordEmail) {
            setForgotPasswordError('Please enter your email');
            return;
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(forgotPasswordEmail)) {
            setForgotPasswordError('Please enter a valid email address');
            return;
        }

        setForgotPasswordLoading(true);
        setForgotPasswordError('');
        setForgotPasswordMessage('');

        try {
            console.log('Sending forgot password request for:', forgotPasswordEmail);

            const forgotPasswordData = {
                email: forgotPasswordEmail
            };

            const response = await axios.put(
                `${API_BASE_URL}/user/forgotPassword`,
                forgotPasswordData,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            console.log('Forgot password response:', response.data);

            // Show success message
            setForgotPasswordMessage('New password has been sent to your email');

            // Clear the dialog after 3 seconds and close
            setTimeout(() => {
                handleForgotPasswordClose();
                // Show success message on main form
                setSuccess('New password has been sent to your email');
            }, 3000);

        } catch (error) {
            console.error('Forgot password error:', error);
            console.error('Error response:', error.response);

            if (error.response) {
                // Server responded with error
                const status = error.response.status;
                const errorMessage = error.response.data || 'An error occurred';

                console.log('Error status:', status);
                console.log('Error message:', errorMessage);

                // Handle different error scenarios
                if (status === 404) {
                    setForgotPasswordError('User not found with this email. Please check your email or sign up.');
                } else if (status === 403) {
                    setForgotPasswordError('Email is not verified. Please verify your email first.');
                } else if (status === 400) {
                    setForgotPasswordError(errorMessage || 'Invalid request. Please try again.');
                } else if (status === 500) {
                    // For 500 error with "User not found" message
                    if (errorMessage && errorMessage.includes('User not found')) {
                        setForgotPasswordError('User not found with this email. Please check your email or sign up.');
                    } else {
                        setForgotPasswordError('Server error. Please try again later.');
                    }
                } else {
                    setForgotPasswordError(errorMessage);
                }
            } else if (error.request) {
                // Request made but no response
                setForgotPasswordError('Cannot connect to server. Please check your internet connection.');
            } else {
                // Something else happened
                setForgotPasswordError('An unexpected error occurred. Please try again.');
            }
        } finally {
            setForgotPasswordLoading(false);
        }
    };

    const handleRememberMeChange = (event) => {
        setRememberMe(event.target.checked);
        if (event.target.checked) {
            localStorage.setItem('rememberEmail', formData.email);
        } else {
            localStorage.removeItem('rememberEmail');
        }
    };

    const handleSignUpClick = (e) => {
        e.preventDefault();
        if (isModal && onSwitchToSignup) {
            onSwitchToSignup();
        } else if (isModal && onClose) {
            onClose();
            setTimeout(() => navigate('/signup'), 100);
        } else {
            navigate('/signup');
        }
    };

    // Load remembered email on component mount
    useEffect(() => {
        const rememberedEmail = localStorage.getItem('rememberEmail');
        if (rememberedEmail) {
            setFormData(prev => ({ ...prev, email: rememberedEmail }));
            setRememberMe(true);
        }
    }, []);

    return (
        <>
            <Box sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                background: isModal ? '#121212' : '#0A0A0A',
                fontFamily: "'Inter', sans-serif",
                overflow: 'hidden',
            }}>
                {/* Login Form */}
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
                            marginBottom: { xs: '20px', md: '25px' },
                            textAlign: 'left',
                            fontFamily: "'Inter', sans-serif"
                        }}>
                            LogIn
                        </Typography>

                        {/* Alerts */}
                        {error && (
                            <Fade in={!!error}>
                                <Alert severity="error" sx={{
                                    marginBottom: '15px',
                                    borderRadius: '8px',
                                    fontSize: '12px',
                                    padding: '6px 12px',
                                    fontFamily: "'Inter', sans-serif"
                                }}>
                                    {error}
                                </Alert>
                            </Fade>
                        )}

                        {success && (
                            <Fade in={!!success}>
                                <Alert severity="success" sx={{
                                    marginBottom: '15px',
                                    borderRadius: '8px',
                                    fontSize: '12px',
                                    padding: '6px 12px',
                                    fontFamily: "'Inter', sans-serif"
                                }}>
                                    {success}
                                </Alert>
                            </Fade>
                        )}

                        {/* Login Form */}
                        <Box component="form" onSubmit={handleSubmit} sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: { xs: '12px', md: '16px' },
                            fontFamily: "'Inter', sans-serif"
                        }}>
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
                                    placeholder="Enter your email"
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
                                    placeholder="Enter your password"
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
                            </Box>

                            {/* Remember Me and Forgot Password */}
                            <Box sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginTop: '4px',
                                flexWrap: 'wrap',
                                gap: 1
                            }}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={rememberMe}
                                            onChange={handleRememberMeChange}
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
                                            Remember me
                                        </Typography>
                                    }
                                />

                                <Button
                                    onClick={handleForgotPasswordClick}
                                    sx={{
                                        color: '#009688',
                                        textTransform: 'none',
                                        fontSize: { xs: '12px', md: isModal ? '12px' : '14px' },
                                        fontWeight: 500,
                                        padding: '2px 6px',
                                        minWidth: 'auto',
                                        fontFamily: "'Inter', sans-serif"
                                    }}
                                >
                                    Forgot Password?
                                </Button>
                            </Box>

                            {/* Login Button */}
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
                                        width: { xs: '110px', md: '120px' },
                                        minWidth: { xs: '110px', md: '120px' },
                                        '&:hover': {
                                            background: 'linear-gradient(90deg, #008577 0%, #45a049 100%)',
                                        }
                                    }}
                                >
                                    {loading ? (
                                        <CircularProgress size={20} sx={{ color: '#FFFFFF' }} />
                                    ) : (
                                        'Sign In'
                                    )}
                                </Button>
                            </Box>

                            {/* Sign Up Link */}
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
                                    Don't have an account?
                                </Typography>
                                <Button
                                    onClick={handleSignUpClick}
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
                                    Sign Up
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Box>

            {/* Forgot Password Dialog */}
            <Dialog
                open={forgotPasswordDialogOpen}
                onClose={handleForgotPasswordClose}
                PaperProps={{
                    sx: {
                        background: '#1A1A1A',
                        borderRadius: '12px',
                        padding: '20px',
                        minWidth: { xs: '300px', sm: '400px' }
                    }
                }}
            >
                <DialogTitle sx={{
                    color: '#F3F4F6',
                    fontSize: '24px',
                    fontWeight: 700,
                    fontFamily: "'Inter', sans-serif",
                    padding: '0 0 10px 0'
                }}>
                    Forgot Password
                </DialogTitle>

                <DialogContent sx={{ padding: '10px 0' }}>
                    <DialogContentText sx={{
                        color: '#9CA3AF',
                        fontSize: '14px',
                        fontFamily: "'Inter', sans-serif",
                        marginBottom: '20px'
                    }}>
                        Enter your email address and we'll send you a new password.
                    </DialogContentText>

                    {forgotPasswordError && (
                        <Alert severity="error" sx={{
                            marginBottom: '15px',
                            borderRadius: '8px',
                            fontSize: '12px',
                            fontFamily: "'Inter', sans-serif"
                        }}>
                            {forgotPasswordError}
                        </Alert>
                    )}

                    {forgotPasswordMessage && (
                        <Alert severity="success" sx={{
                            marginBottom: '15px',
                            borderRadius: '8px',
                            fontSize: '12px',
                            fontFamily: "'Inter', sans-serif"
                        }}>
                            {forgotPasswordMessage}
                        </Alert>
                    )}

                    <TextField
                        fullWidth
                        type="email"
                        value={forgotPasswordEmail}
                        onChange={(e) => setForgotPasswordEmail(e.target.value)}
                        placeholder="Enter your email"
                        variant="outlined"
                        size="small"
                        disabled={forgotPasswordLoading || !!forgotPasswordMessage}
                        sx={{
                            fontFamily: "'Inter', sans-serif",
                            '& .MuiOutlinedInput-root': {
                                fontSize: '14px',
                                height: '44px',
                                background: '#121212',
                                color: '#808080',
                                fontFamily: "'Inter', sans-serif",
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#009688',
                                },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#4CAF50',
                                }
                            }
                        }}
                    />
                </DialogContent>

                <DialogActions sx={{
                    padding: '20px 0 0 0',
                    gap: '10px'
                }}>
                    <Button
                        onClick={handleForgotPasswordClose}
                        disabled={forgotPasswordLoading}
                        sx={{
                            color: '#9CA3AF',
                            textTransform: 'none',
                            fontSize: '14px',
                            fontWeight: 500,
                            fontFamily: "'Inter', sans-serif"
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleForgotPasswordSubmit}
                        variant="contained"
                        disabled={forgotPasswordLoading || !!forgotPasswordMessage}
                        sx={{
                            background: 'linear-gradient(90deg, #009688 0%, #4CAF50 100%)',
                            color: '#FFFFFF',
                            padding: '6px 20px',
                            borderRadius: '8px',
                            fontSize: '14px',
                            fontWeight: 600,
                            textTransform: 'none',
                            fontFamily: "'Inter', sans-serif",
                            '&:hover': {
                                background: 'linear-gradient(90deg, #008577 0%, #45a049 100%)',
                            },
                            '&.Mui-disabled': {
                                background: '#2A2A2A',
                                color: '#666'
                            }
                        }}
                    >
                        {forgotPasswordLoading ? (
                            <CircularProgress size={20} sx={{ color: '#FFFFFF' }} />
                        ) : (
                            'Send Reset Email'
                        )}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default LoginPage;