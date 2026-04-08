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
    DialogActions,
    Paper,
    Container,
    useMediaQuery,
    useTheme,
    GlobalStyles
} from '@mui/material';
import {
    Visibility,
    VisibilityOff,
    Close as CloseIcon,
    Lock,
    Email,
    Person
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { alpha, keyframes } from '@mui/material/styles';

const API_BASE_URL = 'http://localhost:8080/api/public';

const float = keyframes`
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
`;

const pulse = keyframes`
    0%, 100% { opacity: 0.6; transform: scale(1); }
    50% { opacity: 1; transform: scale(1.05); }
`;

const slideInRight = keyframes`
    from { opacity: 0; transform: translateX(50px); }
    to { opacity: 1; transform: translateX(0); }
`;

const scrollbarStyles = {
    '*::-webkit-scrollbar': {
        width: '8px',
    },
    '*::-webkit-scrollbar-track': {
        background: '#F5F0E8',
        borderRadius: '10px',
    },
    '*::-webkit-scrollbar-thumb': {
        background: '#FF6B35',
        borderRadius: '10px',
        '&:hover': { background: '#E55A2B' },
    },
};

const LoginPage = ({ isModal = false, onClose, onSwitchToSignup }) => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [backgroundPosition, setBackgroundPosition] = useState({ x: 0, y: 0 });

    const [forgotPasswordDialogOpen, setForgotPasswordDialogOpen] = useState(false);
    const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
    const [forgotPasswordMessage, setForgotPasswordMessage] = useState('');
    const [forgotPasswordError, setForgotPasswordError] = useState('');

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    useEffect(() => {
        const handleMouseMove = (e) => {
            const x = e.clientX / window.innerWidth;
            const y = e.clientY / window.innerHeight;
            setBackgroundPosition({ x, y });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleMouseDownPassword = (event) => event.preventDefault();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
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
        if (!validateForm()) return;

        setLoading(true);
        setError('');

        try {
            const result = await login(formData.email, formData.password);
            if (result.success) {
                setSuccess('Login successful! Redirecting...');
                if (isModal && onClose) onClose();
                setTimeout(() => {
                    navigate('/', { replace: true });
                }, 1500);
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

    const handleForgotPasswordClick = () => {
        setForgotPasswordEmail(formData.email || '');
        setForgotPasswordDialogOpen(true);
        setForgotPasswordMessage('');
        setForgotPasswordError('');
    };

    const handleForgotPasswordClose = () => {
        setForgotPasswordDialogOpen(false);
        setForgotPasswordEmail('');
        setForgotPasswordMessage('');
        setForgotPasswordError('');
    };

    const handleForgotPasswordSubmit = async () => {
        if (!forgotPasswordEmail) {
            setForgotPasswordError('Please enter your email');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(forgotPasswordEmail)) {
            setForgotPasswordError('Please enter a valid email address');
            return;
        }

        setForgotPasswordLoading(true);
        setForgotPasswordError('');
        setForgotPasswordMessage('');

        try {
            const response = await axios.put(
                `${API_BASE_URL}/user/forgotPassword`,
                { email: forgotPasswordEmail },
                { headers: { 'Content-Type': 'application/json' } }
            );

            setForgotPasswordMessage('New password has been sent to your email');
            setTimeout(() => {
                handleForgotPasswordClose();
                setSuccess('New password has been sent to your email');
            }, 3000);
        } catch (error) {
            if (error.response) {
                const status = error.response.status;
                if (status === 404) {
                    setForgotPasswordError('User not found with this email. Please check your email or sign up.');
                } else if (status === 403) {
                    setForgotPasswordError('Email is not verified. Please verify your email first.');
                } else {
                    setForgotPasswordError(error.response.data || 'An error occurred');
                }
            } else {
                setForgotPasswordError('Cannot connect to server. Please check your internet connection.');
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

    useEffect(() => {
        const rememberedEmail = localStorage.getItem('rememberEmail');
        if (rememberedEmail) {
            setFormData(prev => ({ ...prev, email: rememberedEmail }));
            setRememberMe(true);
        }
    }, []);

    const formContent = (
        <Box sx={{
            width: '100%',
            maxWidth: '480px',
            margin: '0 auto',
            position: 'relative',
            background: 'linear-gradient(135deg, #FFF9F0 0%, #F5F0E8 100%)',
            borderRadius: '32px',
            overflow: 'hidden',
            fontFamily: 'Inter, sans-serif'
        }}>
            <GlobalStyles styles={scrollbarStyles} />

            {/* Main Content */}
            <Box sx={{ position: 'relative', zIndex: 2 }}>
                <Paper elevation={0} sx={{
                    borderRadius: '32px',
                    background: alpha('#FFFFFF', 0.95),
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
                    border: '1px solid rgba(255,107,53,0.15)',
                    overflow: 'hidden'
                }}>
                    {/* Header with logo */}
                    <Box sx={{
                        textAlign: 'center',
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
                                background: 'linear-gradient(135deg, #FF6B35 0%, #FFB347 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <Lock sx={{ color: 'white', fontSize: 24 }} />
                            </Box>
                            <Typography variant="h5" sx={{
                                fontWeight: 800,
                                background: 'linear-gradient(135deg, #FF6B35 0%, #FFB347 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                letterSpacing: '-0.5px'
                            }}>
                                Festivy
                            </Typography>
                        </Box>
                        <Typography variant="h4" sx={{
                            fontSize: { xs: '28px', sm: '32px' },
                            fontWeight: 700,
                            color: '#2C2C2C',
                            mb: 1
                        }}>
                            Welcome Back
                        </Typography>
                        <Typography sx={{
                            color: '#6B6B6B',
                            fontSize: '14px',
                            mb: 3
                        }}>
                            Sign in to continue to your account
                        </Typography>
                        <Box sx={{
                            width: 50,
                            height: 3,
                            background: 'linear-gradient(90deg, #FF6B35, #FFB347)',
                            borderRadius: 2,
                            mx: 'auto'
                        }} />
                    </Box>

                    {/* Form */}
                    <Box component="form" onSubmit={handleSubmit} sx={{
                        p: { xs: 3, sm: 5 },
                        pt: { xs: 2, sm: 3 }
                    }}>
                        {error && (
                            <Fade in={!!error}>
                                <Alert severity="error" sx={{
                                    mb: 3,
                                    borderRadius: '16px',
                                    fontSize: '13px',
                                    bgcolor: alpha('#FF6B35', 0.05),
                                    color: '#D32F2F',
                                    '& .MuiAlert-icon': { color: '#D32F2F' }
                                }}>
                                    {error}
                                </Alert>
                            </Fade>
                        )}

                        {success && (
                            <Fade in={!!success}>
                                <Alert severity="success" sx={{
                                    mb: 3,
                                    borderRadius: '16px',
                                    fontSize: '13px',
                                    bgcolor: alpha('#4CAF50', 0.05),
                                    color: '#2E7D32',
                                    '& .MuiAlert-icon': { color: '#2E7D32' }
                                }}>
                                    {success}
                                </Alert>
                            </Fade>
                        )}

                        {/* Email Field */}
                        <TextField
                            fullWidth
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="Enter your email"
                            label="Email"
                            variant="outlined"
                            sx={{
                                mb: 3,
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '12px',
                                    background: '#FAFAFA',
                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                        borderColor: '#FFB347'
                                    },
                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                        borderColor: '#FF6B35',
                                        borderWidth: '2px'
                                    }
                                },
                                '& .MuiInputLabel-root': {
                                    color: '#8A8A8A',
                                    '&.Mui-focused': { color: '#FF6B35' }
                                }
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Email sx={{ color: '#FF6B35', fontSize: 20 }} />
                                    </InputAdornment>
                                )
                            }}
                        />

                        {/* Password Field */}
                        <TextField
                            fullWidth
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            placeholder="Enter your password"
                            label="Password"
                            variant="outlined"
                            sx={{
                                mb: 2,
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '12px',
                                    background: '#FAFAFA',
                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                        borderColor: '#FFB347'
                                    },
                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                        borderColor: '#FF6B35',
                                        borderWidth: '2px'
                                    }
                                },
                                '& .MuiInputLabel-root': {
                                    color: '#8A8A8A',
                                    '&.Mui-focused': { color: '#FF6B35' }
                                }
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Person sx={{ color: '#FF6B35', fontSize: 20 }} />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            edge="end"
                                            sx={{ color: '#8A8A8A' }}
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                        />

                        {/* Remember Me & Forgot Password */}
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            mb: 3,
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
                                            color: '#FFB347',
                                            '&.Mui-checked': {
                                                color: '#FF6B35',
                                            }
                                        }}
                                    />
                                }
                                label={
                                    <Typography sx={{ color: '#6B6B6B', fontSize: '13px', fontWeight: 500 }}>
                                        Remember me
                                    </Typography>
                                }
                            />
                            <Button
                                onClick={handleForgotPasswordClick}
                                sx={{
                                    color: '#FF6B35',
                                    textTransform: 'none',
                                    fontSize: '13px',
                                    fontWeight: 600,
                                    '&:hover': { bgcolor: alpha('#FF6B35', 0.05) }
                                }}
                            >
                                Forgot Password?
                            </Button>
                        </Box>

                        {/* Login Button */}
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            disabled={loading}
                            sx={{
                                background: 'linear-gradient(135deg, #FF6B35 0%, #FFB347 100%)',
                                borderRadius: '12px',
                                py: 1.5,
                                fontSize: '16px',
                                fontWeight: 600,
                                textTransform: 'none',
                                boxShadow: '0 4px 12px rgba(255,107,53,0.25)',
                                '&:hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 6px 16px rgba(255,107,53,0.35)'
                                },
                                transition: 'all 0.3s'
                            }}
                        >
                            {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Sign In'}
                        </Button>

                        {/* Sign Up Link */}
                        <Box sx={{
                            textAlign: 'center',
                            mt: 3,
                            pt: 2,
                            borderTop: '1px solid rgba(0,0,0,0.06)'
                        }}>
                            <Typography sx={{ color: '#6B6B6B', fontSize: '14px' }}>
                                Don't have an account?{' '}
                                <Button
                                    onClick={handleSignUpClick}
                                    sx={{
                                        color: '#FF6B35',
                                        textTransform: 'none',
                                        fontWeight: 700,
                                        fontSize: '14px',
                                        '&:hover': { bgcolor: alpha('#FF6B35', 0.05) }
                                    }}
                                >
                                    Sign Up
                                </Button>
                            </Typography>
                        </Box>
                    </Box>
                </Paper>
            </Box>

            {/* Forgot Password Dialog */}
            <Dialog
                open={forgotPasswordDialogOpen}
                onClose={handleForgotPasswordClose}
                PaperProps={{
                    sx: {
                        background: '#FFFFFF',
                        borderRadius: '24px',
                        padding: '8px',
                        maxWidth: '450px',
                        width: '90%'
                    }
                }}
            >
                <DialogTitle sx={{
                    color: '#2C2C2C',
                    fontSize: '24px',
                    fontWeight: 700,
                    fontFamily: "'Inter', sans-serif",
                    pb: 1
                }}>
                    Forgot Password?
                </DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{
                        color: '#6B6B6B',
                        fontSize: '14px',
                        fontFamily: "'Inter', sans-serif",
                        mb: 3
                    }}>
                        Enter your email address and we'll send you a new password.
                    </DialogContentText>

                    {forgotPasswordError && (
                        <Alert severity="error" sx={{
                            mb: 2,
                            borderRadius: '12px',
                            fontSize: '13px'
                        }}>
                            {forgotPasswordError}
                        </Alert>
                    )}

                    {forgotPasswordMessage && (
                        <Alert severity="success" sx={{
                            mb: 2,
                            borderRadius: '12px',
                            fontSize: '13px'
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
                        label="Email Address"
                        variant="outlined"
                        disabled={forgotPasswordLoading || !!forgotPasswordMessage}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '12px',
                                background: '#FAFAFA',
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#FFB347'
                                },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#FF6B35'
                                }
                            },
                            '& .MuiInputLabel-root': {
                                '&.Mui-focused': { color: '#FF6B35' }
                            }
                        }}
                    />
                </DialogContent>
                <DialogActions sx={{ p: 3, pt: 0, gap: 2 }}>
                    <Button
                        onClick={handleForgotPasswordClose}
                        disabled={forgotPasswordLoading}
                        sx={{
                            color: '#8A8A8A',
                            textTransform: 'none',
                            fontWeight: 500,
                            borderRadius: '40px',
                            px: 3,
                            '&:hover': { bgcolor: alpha('#8A8A8A', 0.05) }
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleForgotPasswordSubmit}
                        variant="contained"
                        disabled={forgotPasswordLoading || !!forgotPasswordMessage}
                        sx={{
                            background: 'linear-gradient(135deg, #FF6B35 0%, #FFB347 100%)',
                            borderRadius: '40px',
                            px: 3,
                            textTransform: 'none',
                            fontWeight: 600,
                            '&:hover': {
                                transform: 'translateY(-1px)',
                                boxShadow: '0 4px 12px rgba(255,107,53,0.25)'
                            }
                        }}
                    >
                        {forgotPasswordLoading ? <CircularProgress size={20} sx={{ color: 'white' }} /> : 'Send Reset Email'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );

    if (isModal) {
        return formContent;
    }

    return formContent;
};

export default LoginPage;