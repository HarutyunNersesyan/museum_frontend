// src/pages/AdminLoginPage.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Button,
    TextField,
    Typography,
    Alert,
    IconButton,
    InputAdornment,
    Fade,
    CircularProgress,
    Paper,
    Grid
} from '@mui/material';
import {
    Visibility,
    VisibilityOff,
    AdminPanelSettings as AdminIcon,
    Security as SecurityIcon,
    Museum as MuseumIcon,
    Event as EventIcon,
    People as PeopleIcon,
    Star as StarIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { alpha } from '@mui/material/styles';

const AdminLoginPage = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
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
            setError('Էլ.փոստը պարտադիր է');
            return false;
        }
        if (!formData.password) {
            setError('Գաղտնաբառը պարտադիր է');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError('');

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            const result = await login(formData.email, formData.password);

            if (result.success) {
                const token = localStorage.getItem('token');
                if (token) {
                    try {
                        const payload = JSON.parse(atob(token.split('.')[1]));
                        const roles = payload.roles || [];

                        if (roles.includes('ADMIN')) {
                            navigate('/admin/dashboard');
                        } else {
                            setError('Մուտքը մերժվեց: Պահանջվում են ադմինիստրատորի իրավունքներ:');
                            localStorage.removeItem('token');
                            localStorage.removeItem('user');
                            setFormData(prev => ({ ...prev, password: '' }));
                        }
                    } catch (decodeError) {
                        console.error('Token-ի վերծանման սխալ:', decodeError);
                        setError('Նույնականացման սխալ: Խնդրում ենք կրկին փորձել:');
                        localStorage.removeItem('token');
                        localStorage.removeItem('user');
                        setFormData(prev => ({ ...prev, password: '' }));
                    }
                } else {
                    setError('Նույնականացումը ձախողվեց: Խնդրում ենք կրկին փորձել:');
                    setFormData(prev => ({ ...prev, password: '' }));
                }
            } else {
                setError(result.message || 'Սխալ էլ.փոստ կամ գաղտնաբառ');
                setFormData(prev => ({ ...prev, password: '' }));
            }
        } catch (err) {
            console.error('Մուտքի սխալ:', err);
            setError('Ինչ-որ բան այն չէ: Խնդրում ենք ստուգել ձեր կապը և կրկին փորձել:');
            setFormData(prev => ({ ...prev, password: '' }));
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #5C3A1E 0%, #3D2514 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Անիմացիոն Ֆոն */}
            <Box sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: `
                    radial-gradient(circle at 20% 50%, rgba(139, 94, 60, 0.3) 0%, transparent 60%),
                    radial-gradient(circle at 80% 80%, rgba(107, 58, 42, 0.25) 0%, transparent 60%),
                    radial-gradient(circle at 40% 20%, rgba(212, 165, 116, 0.1) 0%, transparent 50%),
                    #3D2514
                `
            }} />

            {/* Լողացող անիմացիոն տարրեր */}
            <Box sx={{ position: 'absolute', top: '10%', left: '5%', opacity: 0.1, animation: 'float 8s infinite ease-in-out' }}>
                <MuseumIcon sx={{ fontSize: 120, color: '#D4A574' }} />
            </Box>
            <Box sx={{ position: 'absolute', bottom: '15%', right: '8%', opacity: 0.1, animation: 'float 6s infinite ease-in-out reverse' }}>
                <EventIcon sx={{ fontSize: 100, color: '#D4A574' }} />
            </Box>

            <style>{`
                @keyframes pulse {
                    0%, 100% { opacity: 0.6; transform: scale(1); }
                    50% { opacity: 1; transform: scale(1.05); }
                }
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
                    20%, 40%, 60%, 80% { transform: translateX(5px); }
                }
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-20px); }
                }
                @keyframes slideInLeft {
                    from {
                        opacity: 0;
                        transform: translateX(-50px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
                @keyframes slideInRight {
                    from {
                        opacity: 0;
                        transform: translateX(50px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
            `}</style>

            <Box sx={{
                width: '100%',
                maxWidth: '1200px',
                mx: 'auto',
                px: { xs: 2, sm: 3, md: 4 }
            }}>
                <Paper elevation={0} sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    background: alpha('#2A1A0E', 0.9),
                    backdropFilter: 'blur(12px)',
                    borderRadius: '32px',
                    border: `1px solid ${alpha('#D4A574', 0.3)}`,
                    overflow: 'hidden',
                    boxShadow: `0 25px 50px ${alpha('#000000', 0.5)}`
                }}>

                    {/* Ձախ կողմ - Hero Image & Բովանդակություն */}
                    <Box sx={{
                        flex: 1.2,
                        background: 'linear-gradient(135deg, #8B5E3C 0%, #6B3A2A 100%)',
                        p: { xs: 4, md: 6 },
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        {/* Դեկորատիվ նախշի ծածկույթ */}
                        <Box sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundImage: `radial-gradient(circle at 20% 40%, ${alpha('#FFFFFF', 0.08)} 1px, transparent 1px)`,
                            backgroundSize: '30px 30px'
                        }} />

                        {/* Hero Icon */}
                        <Box sx={{
                            position: 'relative',
                            zIndex: 2,
                            animation: 'slideInLeft 0.6s ease-out'
                        }}>
                            <Box sx={{
                                width: '80px',
                                height: '80px',
                                borderRadius: '24px',
                                background: alpha('#FFFFFF', 0.2),
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                mb: 4,
                                backdropFilter: 'blur(10px)'
                            }}>
                                <AdminIcon sx={{ fontSize: 48, color: '#FFFFFF' }} />
                            </Box>

                            <Typography variant="h3" sx={{
                                fontWeight: 800,
                                color: '#FFFFFF',
                                mb: 2,
                                fontSize: { xs: '2rem', md: '2.5rem' },
                                textShadow: '0 2px 10px rgba(0,0,0,0.2)'
                            }}>
                                Բարի Վերադարձ
                            </Typography>

                            <Typography variant="h6" sx={{
                                color: alpha('#FFFFFF', 0.9),
                                mb: 4,
                                fontWeight: 500,
                                lineHeight: 1.5
                            }}>
                                Մուտք գործեք՝ ձեր թանգարանները,<br />
                                միջոցառումները և բովանդակությունը մեկ վահանակից կառավարելու համար:
                            </Typography>

                            {/* Հնարավորությունների Ցանկ */}
                            <Box sx={{ mt: 4, space: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                    <Box sx={{
                                        width: '36px',
                                        height: '36px',
                                        borderRadius: '12px',
                                        background: alpha('#FFFFFF', 0.2),
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <MuseumIcon sx={{ fontSize: 20, color: '#FFFFFF' }} />
                                    </Box>
                                    <Typography variant="body1" sx={{ color: alpha('#FFFFFF', 0.85) }}>
                                        Կառավարել Թանգարաններն ու Ցուցահանդեսները
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                    <Box sx={{
                                        width: '36px',
                                        height: '36px',
                                        borderRadius: '12px',
                                        background: alpha('#FFFFFF', 0.2),
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <EventIcon sx={{ fontSize: 20, color: '#FFFFFF' }} />
                                    </Box>
                                    <Typography variant="body1" sx={{ color: alpha('#FFFFFF', 0.85) }}>
                                        Ստեղծել և Պլանավորել Միջոցառումներ
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                    <Box sx={{
                                        width: '36px',
                                        height: '36px',
                                        borderRadius: '12px',
                                        background: alpha('#FFFFFF', 0.2),
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <PeopleIcon sx={{ fontSize: 20, color: '#FFFFFF' }} />
                                    </Box>
                                    <Typography variant="body1" sx={{ color: alpha('#FFFFFF', 0.85) }}>
                                        Հետևել Այցելուների Ներգրավվածությանը
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Box sx={{
                                        width: '36px',
                                        height: '36px',
                                        borderRadius: '12px',
                                        background: alpha('#FFFFFF', 0.2),
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <StarIcon sx={{ fontSize: 20, color: '#FFFFFF' }} />
                                    </Box>
                                    <Typography variant="body1" sx={{ color: alpha('#FFFFFF', 0.85) }}>
                                        Վերլուծություններ և Պատկերացումներ
                                    </Typography>
                                </Box>
                            </Box>

                            {/* Վիճակագրություն */}
                            <Box sx={{
                                display: 'flex',
                                gap: 4,
                                mt: 6,
                                pt: 4,
                                borderTop: `1px solid ${alpha('#FFFFFF', 0.2)}`
                            }}>
                                <Box>
                                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#FFFFFF' }}>10+</Typography>
                                    <Typography variant="caption" sx={{ color: alpha('#FFFFFF', 0.7) }}>Թանգարաններ</Typography>
                                </Box>
                                <Box>
                                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#FFFFFF' }}>200+</Typography>
                                    <Typography variant="caption" sx={{ color: alpha('#FFFFFF', 0.7) }}>Միջոցառումներ</Typography>
                                </Box>
                                <Box>
                                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#FFFFFF' }}>10K+</Typography>
                                    <Typography variant="caption" sx={{ color: alpha('#FFFFFF', 0.7) }}>Այցելուներ</Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Box>

                    {/* Աջ կողմ - Մուտքի Ձևաթուղթ */}
                    <Box sx={{
                        flex: 0.9,
                        p: { xs: 4, sm: 5, md: 6 },
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        animation: 'slideInRight 0.6s ease-out'
                    }}>
                        {/* Անվտանգության Կրծքանշան */}
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 1,
                            mb: 3,
                            p: 1,
                            bgcolor: alpha('#8B5E3C', 0.2),
                            borderRadius: '30px',
                            width: 'fit-content',
                            mx: 'auto'
                        }}>
                            <SecurityIcon sx={{ fontSize: 16, color: '#D4A574' }} />
                            <Typography variant="caption" sx={{ color: '#D4A574', fontWeight: 500 }}>
                                Սահմանափակ Մուտք
                            </Typography>
                        </Box>

                        {/* Ձևաթղթի Վերնագիր */}
                        <Typography variant="h4" sx={{
                            fontWeight: 700,
                            color: '#FFFFFF',
                            textAlign: 'center',
                            mb: 1
                        }}>
                            Ադմինիստրատորի Մուտք
                        </Typography>
                        <Typography variant="body2" sx={{
                            color: alpha('#FFFFFF', 0.6),
                            textAlign: 'center',
                            mb: 4
                        }}>
                            Մուտքագրեք ձեր հավատարմագրերը ադմինիստրատորի վահանակ մուտք գործելու համար
                        </Typography>

                        {/* Սխալի Ծանուցում */}
                        {error && (
                            <Fade in={!!error}>
                                <Alert
                                    severity="error"
                                    sx={{
                                        mb: 3,
                                        borderRadius: '16px',
                                        bgcolor: alpha('#f44336', 0.15),
                                        color: '#FFFFFF',
                                        border: `1px solid ${alpha('#f44336', 0.5)}`,
                                        animation: 'shake 0.5s ease-in-out',
                                        '& .MuiAlert-icon': { color: '#f44336' }
                                    }}
                                    onClose={() => setError('')}
                                >
                                    {error}
                                </Alert>
                            </Fade>
                        )}

                        {/* Մուտքի Ձևաթուղթ */}
                        <Box component="form" onSubmit={handleSubmit}>
                            <TextField
                                fullWidth
                                type="email"
                                name="email"
                                label="Էլ.փոստի Հասցե"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="admin@museum.am"
                                required
                                variant="outlined"
                                sx={{
                                    mb: 3,
                                    '& .MuiOutlinedInput-root': {
                                        background: alpha('#1A0F08', 0.6),
                                        color: '#FFFFFF',
                                        borderRadius: '16px',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            background: alpha('#1A0F08', 0.8),
                                            '& .MuiOutlinedInput-notchedOutline': {
                                                borderColor: '#D4A574',
                                            }
                                        },
                                        '&.Mui-focused': {
                                            background: alpha('#1A0F08', 0.8),
                                            '& .MuiOutlinedInput-notchedOutline': {
                                                borderColor: '#D4A574',
                                                borderWidth: '2px'
                                            }
                                        }
                                    },
                                    '& .MuiInputLabel-root': {
                                        color: alpha('#FFFFFF', 0.7),
                                        '&.Mui-focused': {
                                            color: '#D4A574'
                                        }
                                    },
                                    '& .MuiOutlinedInput-notchedOutline': {
                                        borderColor: alpha('#D4A574', 0.3)
                                    }
                                }}
                            />

                            <TextField
                                fullWidth
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                label="Գաղտնաբառ"
                                value={formData.password}
                                onChange={handleInputChange}
                                placeholder="Մուտքագրեք ձեր գաղտնաբառը"
                                required
                                variant="outlined"
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={handleClickShowPassword}
                                                edge="end"
                                                sx={{
                                                    color: alpha('#FFFFFF', 0.6),
                                                    '&:hover': { color: '#D4A574' }
                                                }}
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    mb: 3,
                                    '& .MuiOutlinedInput-root': {
                                        background: alpha('#1A0F08', 0.6),
                                        color: '#FFFFFF',
                                        borderRadius: '16px',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            background: alpha('#1A0F08', 0.8),
                                            '& .MuiOutlinedInput-notchedOutline': {
                                                borderColor: '#D4A574',
                                            }
                                        },
                                        '&.Mui-focused': {
                                            background: alpha('#1A0F08', 0.8),
                                            '& .MuiOutlinedInput-notchedOutline': {
                                                borderColor: '#D4A574',
                                                borderWidth: '2px'
                                            }
                                        }
                                    },
                                    '& .MuiInputLabel-root': {
                                        color: alpha('#FFFFFF', 0.7),
                                        '&.Mui-focused': {
                                            color: '#D4A574'
                                        }
                                    },
                                    '& .MuiOutlinedInput-notchedOutline': {
                                        borderColor: alpha('#D4A574', 0.3)
                                    }
                                }}
                            />

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                disabled={loading}
                                sx={{
                                    py: 1.75,
                                    background: 'linear-gradient(135deg, #8B5E3C 0%, #6B3A2A 100%)',
                                    borderRadius: '16px',
                                    fontSize: '16px',
                                    fontWeight: 700,
                                    textTransform: 'none',
                                    transition: 'all 0.3s ease',
                                    mt: 2,
                                    '&:hover': {
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 8px 25px rgba(139, 94, 60, 0.4)',
                                        background: 'linear-gradient(135deg, #9B6E4C 0%, #7B4A3A 100%)'
                                    },
                                    '&:active': {
                                        transform: 'translateY(0)'
                                    }
                                }}
                            >
                                {loading ? (
                                    <CircularProgress size={24} sx={{ color: '#FFFFFF' }} />
                                ) : (
                                    'Մուտք Գործել որպես Ադմինիստրատոր'
                                )}
                            </Button>
                        </Box>

                        {/* Ստորին Ծանոթագրություն */}
                        <Box sx={{ mt: 4, textAlign: 'center' }}>
                            <Typography variant="caption" sx={{ color: alpha('#FFFFFF', 0.3) }}>
                                Պաշտպանված է արդյունաբերական ստանդարտ անվտանգությամբ
                            </Typography>
                        </Box>
                    </Box>
                </Paper>
            </Box>
        </Box>
    );
};

export default AdminLoginPage;