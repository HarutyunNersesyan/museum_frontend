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
    Paper,
    Container,
    useMediaQuery,
    useTheme,
    GlobalStyles
} from '@mui/material';
import {
    Visibility,
    VisibilityOff,
    Lock,
    Email,
    Person,
    LockOutlined,
    Close as CloseIcon,
    Museum as MuseumIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { alpha, keyframes } from '@mui/material/styles';

const float = keyframes`
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
`;

const pulse = keyframes`
    0%, 100% { opacity: 0.6; transform: scale(1); }
    50% { opacity: 1; transform: scale(1.05); }
`;

const slideInLeft = keyframes`
    from { opacity: 0; transform: translateX(-50px); }
    to { opacity: 1; transform: translateX(0); }
`;

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

const SignUpPage = ({ isModal = false, onClose, onSwitchToLogin, onSuccess }) => {
    const navigate = useNavigate();
    const { signup } = useAuth();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [backgroundPosition, setBackgroundPosition] = useState({ x: 0, y: 0 });

    const [formData, setFormData] = useState({
        userName: '',
        email: '',
        password: '',
        repeatPassword: ''
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
    const handleClickShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);
    const handleMouseDownPassword = (event) => event.preventDefault();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError('');
    };

    const validateForm = () => {
        if (!formData.userName.trim()) {
            setError('Օգտանունը պարտադիր է');
            return false;
        }
        if (formData.userName.length < 3) {
            setError('Օգտանունը պետք է պարունակի առնվազն 3 նիշ');
            return false;
        }
        if (formData.userName.length > 20) {
            setError('Օգտանունը պետք է լինի 20 նիշից պակաս');
            return false;
        }
        if (!formData.email) {
            setError('Էլ.փոստը պարտադիր է');
            return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError('Խնդրում ենք մուտքագրել վավեր էլ.փոստի հասցե');
            return false;
        }
        if (!formData.email.endsWith('@gmail.com')) {
            setError('Խնդրում ենք օգտագործել Gmail հասցե (օրինակ@gmail.com)');
            return false;
        }
        if (!formData.password) {
            setError('Գաղտնաբառը պարտադիր է');
            return false;
        }
        if (formData.password.length < 6) {
            setError('Գաղտնաբառը պետք է պարունակի առնվազն 6 նիշ');
            return false;
        }
        if (!formData.repeatPassword) {
            setError('Խնդրում ենք հաստատել ձեր գաղտնաբառը');
            return false;
        }
        if (formData.password !== formData.repeatPassword) {
            setError('Գաղտնաբառերը չեն համընկնում');
            return false;
        }
        if (!acceptTerms) {
            setError('Խնդրում ենք ընդունել կանոնները և պայմանները');
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
            const result = await signup(formData);
            if (result.success) {
                setSuccess('Հաշիվը ստեղծված է: Խնդրում ենք ստուգել ձեր էլ.փոստը հաստատման կոդի համար:');
                if (onSuccess) {
                    onSuccess(formData.email);
                } else if (isModal && onClose) {
                    onClose();
                    setTimeout(() => {
                        navigate('/verify-code', {
                            state: { email: formData.email, autoSend: true, fromSignUp: true }
                        });
                    }, 300);
                } else {
                    navigate('/verify-code', {
                        state: { email: formData.email, autoSend: true, fromSignUp: true }
                    });
                }
            } else {
                setError(result.message || 'Ինչ-որ բան այն չէ: Խնդրում ենք կրկին փորձել:');
            }
        } catch (err) {
            console.error('Ուղարկման սխալ:', err);
            if (err.response && err.response.status === 409) {
                setError('Խնդրում ենք օգտագործել միայն անգլերեն տառեր');
            } else if (err.message && err.message.includes('409')) {
                setError('Խնդրում ենք օգտագործել միայն անգլերեն տառեր');
            } else if (err.status === 409) {
                setError('Խնդրում ենք օգտագործել միայն անգլերեն տառեր');
            } else {
                setError('Ինչ-որ բան այն չէ: Խնդրում ենք կրկին փորձել:');
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

    const formContent = (
        <Box sx={{
            width: '100%',
            maxWidth: '500px',
            margin: '0 auto',
            position: 'relative',
            background: 'linear-gradient(135deg, #D7CCC8 0%, #BCAAA4 100%)',
            borderRadius: '32px',
            overflow: 'hidden',
            fontFamily: 'Inter, sans-serif'
        }}>
            <GlobalStyles styles={scrollbarStyles} />

            <Box sx={{ position: 'relative', zIndex: 2 }}>
                <Paper elevation={0} sx={{
                    borderRadius: '32px',
                    background: alpha('#FFFFFF', 0.95),
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
                    border: '1px solid rgba(160, 82, 45, 0.15)',
                    overflow: 'hidden',
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
                                justifyContent: 'center'
                            }}>
                                <MuseumIcon sx={{ color: 'white', fontSize: 24 }} />
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
                            Ստեղծել Հաշիվ
                        </Typography>
                        <Box sx={{
                            width: 50,
                            height: 3,
                            background: 'linear-gradient(90deg, #A0522D, #D4A373)',
                            borderRadius: 2,
                            mx: 'auto'
                        }} />
                    </Box>

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
                                    bgcolor: alpha('#D32F2F', 0.05),
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

                        <TextField
                            fullWidth
                            type="text"
                            name="userName"
                            value={formData.userName}
                            onChange={handleInputChange}
                            placeholder="Մուտքագրեք ձեր օգտանունը (3-20 նիշ)"
                            label="Օգտանուն"
                            variant="outlined"
                            sx={{
                                mb: 2.5,
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '12px',
                                    background: '#FAFAFA',
                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                        borderColor: '#D4A373'
                                    },
                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                        borderColor: '#A0522D',
                                        borderWidth: '2px'
                                    }
                                },
                                '& .MuiInputLabel-root': {
                                    color: '#8A8A8A',
                                    '&.Mui-focused': { color: '#A0522D' }
                                }
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Person sx={{ color: '#A0522D', fontSize: 20 }} />
                                    </InputAdornment>
                                )
                            }}
                        />

                        <TextField
                            fullWidth
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="օրինակ@gmail.com"
                            label="Էլ.փոստ"
                            variant="outlined"
                            sx={{
                                mb: 2.5,
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '12px',
                                    background: '#FAFAFA',
                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                        borderColor: '#D4A373'
                                    },
                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                        borderColor: '#A0522D',
                                        borderWidth: '2px'
                                    }
                                },
                                '& .MuiInputLabel-root': {
                                    color: '#8A8A8A',
                                    '&.Mui-focused': { color: '#A0522D' }
                                }
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Email sx={{ color: '#A0522D', fontSize: 20 }} />
                                    </InputAdornment>
                                )
                            }}
                        />

                        <TextField
                            fullWidth
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            placeholder="Առնվազն 6 նիշ"
                            label="Գաղտնաբառ"
                            variant="outlined"
                            sx={{
                                mb: 2.5,
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '12px',
                                    background: '#FAFAFA',
                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                        borderColor: '#D4A373'
                                    },
                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                        borderColor: '#A0522D',
                                        borderWidth: '2px'
                                    }
                                },
                                '& .MuiInputLabel-root': {
                                    color: '#8A8A8A',
                                    '&.Mui-focused': { color: '#A0522D' }
                                }
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <LockOutlined sx={{ color: '#A0522D', fontSize: 20 }} />
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
                        <Typography sx={{
                            fontSize: '11px',
                            color: '#8A8A8A',
                            mt: -1.5,
                            mb: 2,
                            ml: 1
                        }}>
                            Գաղտնաբառը պետք է պարունակի առնվազն 6 նիշ
                        </Typography>

                        <TextField
                            fullWidth
                            type={showConfirmPassword ? 'text' : 'password'}
                            name="repeatPassword"
                            value={formData.repeatPassword}
                            onChange={handleInputChange}
                            placeholder="Հաստատեք ձեր գաղտնաբառը"
                            label="Հաստատել Գաղտնաբառը"
                            variant="outlined"
                            sx={{
                                mb: 2.5,
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '12px',
                                    background: '#FAFAFA',
                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                        borderColor: '#D4A373'
                                    },
                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                        borderColor: '#A0522D',
                                        borderWidth: '2px'
                                    }
                                },
                                '& .MuiInputLabel-root': {
                                    color: '#8A8A8A',
                                    '&.Mui-focused': { color: '#A0522D' }
                                }
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <LockOutlined sx={{ color: '#A0522D', fontSize: 20 }} />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={handleClickShowConfirmPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            edge="end"
                                            sx={{ color: '#8A8A8A' }}
                                        >
                                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                        />

                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={acceptTerms}
                                    onChange={handleAcceptTermsChange}
                                    size="small"
                                    sx={{
                                        color: '#D4A373',
                                        '&.Mui-checked': {
                                            color: '#A0522D',
                                        }
                                    }}
                                />
                            }
                            label={
                                <Typography sx={{ color: '#6B4C3A', fontSize: '12px', fontWeight: 500 }}>
                                    Ես համաձայն եմ{' '}
                                    <Button
                                        component="span"
                                        sx={{
                                            color: '#A0522D',
                                            textDecoration: 'none',
                                            fontWeight: 600,
                                            fontSize: '12px',
                                            padding: 0,
                                            minWidth: 'auto',
                                            textTransform: 'none',
                                            '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' }
                                        }}
                                    >
                                        Ծառայության Կանոններին
                                    </Button>{' '}
                                    և{' '}
                                    <Button
                                        component="span"
                                        sx={{
                                            color: '#A0522D',
                                            textDecoration: 'none',
                                            fontWeight: 600,
                                            fontSize: '12px',
                                            padding: 0,
                                            minWidth: 'auto',
                                            textTransform: 'none',
                                            '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' }
                                        }}
                                    >
                                        Գաղտնիության Քաղաքականությանը
                                    </Button>
                                </Typography>
                            }
                            sx={{ mb: 3 }}
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            disabled={loading}
                            sx={{
                                background: 'linear-gradient(135deg, #A0522D 0%, #D4A373 100%)',
                                borderRadius: '12px',
                                py: 1.5,
                                fontSize: '16px',
                                fontWeight: 600,
                                textTransform: 'none',
                                boxShadow: '0 4px 12px rgba(160, 82, 45, 0.25)',
                                '&:hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 6px 16px rgba(160, 82, 45, 0.35)'
                                },
                                transition: 'all 0.3s'
                            }}
                        >
                            {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Ստեղծել Հաշիվ'}
                        </Button>

                        <Box sx={{
                            textAlign: 'center',
                            mt: 3,
                            pt: 2,
                            borderTop: '1px solid rgba(0,0,0,0.06)'
                        }}>
                            <Typography sx={{ color: '#6B4C3A', fontSize: '14px' }}>
                                Արդեն հաշիվ ունե՞ք:{' '}
                                <Button
                                    onClick={handleSignInClick}
                                    sx={{
                                        color: '#A0522D',
                                        textTransform: 'none',
                                        fontWeight: 700,
                                        fontSize: '14px',
                                        '&:hover': { bgcolor: alpha('#A0522D', 0.05) }
                                    }}
                                >
                                    Մուտք գործել
                                </Button>
                            </Typography>
                        </Box>
                    </Box>
                </Paper>
            </Box>
        </Box>
    );

    if (isModal) {
        return formContent;
    }

    return formContent;
};

export default SignUpPage;