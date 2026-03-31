import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
    VisibilityOff,
    ArrowBack
} from '@mui/icons-material';

const LoginPage = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [rememberMe, setRememberMe] = useState(false);

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
            await new Promise(resolve => setTimeout(resolve, 1500));
            setSuccess('Login successful! Redirecting...');
            setTimeout(() => navigate('/'), 1500);
        } catch (err) {
            setError('Invalid email or password');
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = () => {
        if (!formData.email) {
            setError('Please enter your email first');
            return;
        }

        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setSuccess(`Password reset link sent to ${formData.email}`);
        }, 1500);
    };

    const handleRememberMeChange = (event) => {
        setRememberMe(event.target.checked);
    };

    return (
        <div className="login-page-container">
            {/* Background Gradients */}
            <div className="login-gradients">
                <div className="login-ellipse ellipse-right"></div>
                <div className="login-ellipse ellipse-left"></div>
            </div>

            <Box sx={{
                minHeight: '100vh',
                display: 'flex',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* Left Side - Image Section */}
                <Box className="login-image-section">
                    {/* Back Button */}
                    <IconButton
                        className="login-back-button"
                        onClick={() => navigate('/')}
                        sx={{
                            position: 'absolute',
                            top: 24,
                            left: 24,
                            zIndex: 10,
                            color: 'white',
                            background: 'rgba(0, 0, 0, 0.3)',
                            '&:hover': {
                                background: 'rgba(0, 0, 0, 0.5)'
                            }
                        }}
                    >
                        <ArrowBack />
                    </IconButton>

                    {/* Image Container */}
                    <Box className="image-container">
                        {/* Your Image */}
                        <img
                            src="/images/login.png"
                            alt="LogoForge Login"
                            className="login-main-image"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "https://images.unsplash.com/photo-1634942537034-2531766767d1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80";
                            }}
                        />

                        {/* Image Overlay for better text visibility */}
                        <Box className="image-overlay"></Box>
                    </Box>

                    {/* Decorative Elements */}
                    <div className="image-decoration-1"></div>
                    <div className="image-decoration-2"></div>
                    <div className="image-decoration-3"></div>
                </Box>

                {/* Right Side - Login Form */}
                <Box className="login-form-section">
                    {/* Logo */}
                    <Box className="login-logo-container">
                        <div className="login-logo-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="white"/>
                                <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2"/>
                                <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2"/>
                            </svg>
                        </div>
                        <Typography variant="h5" className="login-logo-text">
                            LogIx
                        </Typography>
                    </Box>

                    {/* Main Form Container */}
                    <Box className="login-form-container">
                        {/* Alerts */}
                        {error && (
                            <Fade in={!!error}>
                                <Alert severity="error" className="login-alert">
                                    {error}
                                </Alert>
                            </Fade>
                        )}

                        {success && (
                            <Fade in={!!success}>
                                <Alert severity="success" className="login-alert">
                                    {success}
                                </Alert>
                            </Fade>
                        )}

                        {/* Login Form */}
                        <Box component="form" onSubmit={handleSubmit} className="login-form">
                            {/* Email Field */}
                            <Box className="form-field-group">
                                <Typography className="form-field-label">
                                    Email Address
                                </Typography>
                                <TextField
                                    fullWidth
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="Enter Your Email"
                                    required
                                    variant="outlined"
                                    className="form-input-field"
                                />
                            </Box>

                            {/* Password Field */}
                            <Box className="form-field-group">
                                <Typography className="form-field-label">
                                    Password
                                </Typography>
                                <TextField
                                    fullWidth
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    placeholder="Enter Your Password"
                                    required
                                    variant="outlined"
                                    className="form-input-field"
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleClickShowPassword}
                                                    onMouseDown={handleMouseDownPassword}
                                                    edge="end"
                                                    className="password-toggle"
                                                >
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Box>

                            {/* Remember Me and Forgot Password */}
                            <Box className="form-options">
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={rememberMe}
                                            onChange={handleRememberMeChange}
                                            className="remember-checkbox"
                                        />
                                    }
                                    label="Remember me"
                                />

                                <Button
                                    onClick={handleForgotPassword}
                                    className="forgot-password-link"
                                >
                                    Forgot Password?
                                </Button>
                            </Box>

                            {/* Login Button */}
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={loading}
                                className="login-submit-button"
                            >
                                {loading ? (
                                    <CircularProgress size={24} className="login-spinner" />
                                ) : (
                                    'Sign In'
                                )}
                            </Button>

                            {/* Sign Up Link */}
                            <Box className="signup-link-container">
                                <Typography variant="body2" className="signup-text">
                                    Don't have an account?
                                </Typography>
                                <Button
                                    component={Link}
                                    to="/signup"
                                    className="signup-link-button"
                                >
                                    Create Account
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </div>
    );
};

export default LoginPage;