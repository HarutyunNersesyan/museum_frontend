// src/pages/MuseumsPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Typography,
    Box,
    Grid,
    Card,
    CardContent,
    CardMedia,
    IconButton,
    Menu,
    MenuItem,
    Avatar,
    Chip,
    Fade,
    Zoom,
    useMediaQuery,
    useTheme,
    Tooltip,
    alpha,
    keyframes,
    GlobalStyles,
    Button,
    Divider,
    Paper,
    Stack,
    Pagination
} from '@mui/material';
import {
    Museum as MuseumIcon,
    AccountCircle as AccountCircleIcon,
    Logout as LogoutIcon,
    Person as PersonIcon,
    AdminPanelSettings as AdminPanelSettingsIcon,
    Event as EventIcon,
    LocationOn as LocationOnIcon,
    AccessTime as AccessTimeIcon,
    Phone as PhoneIcon,
    Star as StarIcon,
    StarBorder as StarBorderIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

// Custom animations
const pulse = keyframes`
    0%, 100% { opacity: 0.4; transform: scale(1); }
    50% { opacity: 0.7; transform: scale(1.05); }
`;

// Warm brown color palette
const colors = {
    primary: '#C4A484',
    primaryDark: '#A0522D',
    primaryLight: '#D2B48C',
    secondary: '#8B7355',
    background: '#FFF8F0',
    surface: '#FFFDF7',
    text: '#4A3728',
    textLight: '#7A5C4A',
    border: '#E8D5B7',
    gradient: 'linear-gradient(135deg, #C4A484 0%, #D2B48C 50%, #DEB887 100%)'
};

// Armenian Museums Data with local backend image paths (1.jpg, 2.jpg, etc.)
const ARMENIAN_MUSEUMS = [
    {
        id: 1,
        name: 'History Museum of Armenia',
        nameArm: 'Հայաստանի Պատմության Թանգարան',
        location: 'Yerevan',
        address: '4 Republic Square, Yerevan',
        description: 'The History Museum of Armenia is a museum with departments of Archaeology, Numismatics, Ethnography, Modern History, and Restoration. It houses one of the richest collections of Armenian cultural heritage, with over 400,000 artifacts.',
        image: 'http://localhost:8080/uploads/1.jpg',
        hours: 'Tue-Sun: 11:00-18:00',
        phone: '+374 10 520-690',
        rating: 4.8,
        featured: true
    },
    {
        id: 2,
        name: 'Matenadaran',
        nameArm: 'Մատենադարան',
        location: 'Yerevan',
        address: '53 Mesrop Mashtots Ave, Yerevan',
        description: 'The Mesrop Mashtots Institute of Ancient Manuscripts, known as Matenadaran, is a repository of ancient manuscripts and a research institute. It holds over 23,000 manuscripts.',
        image: 'http://localhost:8080/uploads/2.jpg',
        hours: 'Tue-Sun: 10:00-17:00',
        phone: '+374 10 513-000',
        rating: 4.9,
        featured: true
    },
    {
        id: 3,
        name: 'Cafesjian Center for the Arts',
        nameArm: 'Գաֆէսճեանի արուեստի կենտրոն',
        location: 'Yerevan',
        address: '3 Tamanyan St, Yerevan',
        description: 'The Cafesjian Center for the Arts (CCA) is a contemporary art museum located in the heart of Yerevan. It features a diverse collection of modern and contemporary art.',
        image: 'http://localhost:8080/uploads/3.jpg',
        hours: 'Tue-Sun: 11:00-20:00',
        phone: '+374 10 541-932',
        rating: 4.7,
        featured: true
    },
    {
        id: 4,
        name: 'Erebuni Fortress & Museum',
        nameArm: 'Էրեբունի ամրոց և թանգարան',
        location: 'Yerevan',
        address: '38 Erebuni St, Yerevan',
        description: 'Erebuni Museum was established in 1968 to celebrate Yerevan\'s 2750th anniversary. The fortress was founded in 782 BC by King Argishti I of Urartu.',
        image: 'http://localhost:8080/uploads/4.jpg',
        hours: 'Tue-Sun: 10:30-17:30',
        phone: '+374 10 461-393',
        rating: 4.6,
        featured: false
    },
    {
        id: 5,
        name: 'Armenian Genocide Museum',
        nameArm: 'Հայոց Ցեղասպանության Թանգարան',
        location: 'Yerevan',
        address: '8 Tsitsernakaberd Hwy, Yerevan',
        description: 'The Armenian Genocide Museum-Institute is dedicated to preserving the memory of the Armenian Genocide of 1915. The museum features photographs, documents, and testimonies.',
        image: 'http://localhost:8080/uploads/5.jpg',
        hours: 'Mon-Sun: 11:00-16:00',
        phone: '+374 10 390-980',
        rating: 4.9,
        featured: true
    },
    {
        id: 6,
        name: 'Dilijan Local Lore Museum',
        nameArm: 'Դիլիջանի Երկրագիտական Թանգարան',
        location: 'Dilijan',
        address: '6 Myasnikyan St, Dilijan',
        description: 'The Dilijan Local Lore Museum showcases the natural history, ethnography, and cultural heritage of the Dilijan region.',
        image: 'http://localhost:8080/uploads/6.jpg',
        hours: 'Tue-Sun: 10:00-18:00',
        phone: '+374 268 2-42-07',
        rating: 4.5,
        featured: false
    },
    {
        id: 7,
        name: 'Gyumri Museum of Architecture',
        nameArm: 'Գյումրու Ճարտարապետության Թանգարան',
        location: 'Gyumri',
        address: '20 Haghtanaki St, Gyumri',
        description: 'The Museum of National Architecture and Urban Life of Gyumri is housed in a historic 19th-century mansion.',
        image: 'http://localhost:8080/uploads/7.jpg',
        hours: 'Tue-Sun: 11:00-17:00',
        phone: '+374 312 5-16-57',
        rating: 4.6,
        featured: false
    },
    {
        id: 8,
        name: 'Khor Virap Museum',
        nameArm: 'Խոր Վիրապի Թանգարան',
        location: 'Ararat',
        address: 'Near Khor Virap Monastery',
        description: 'The Khor Virap Museum tells the story of the historic Khor Virap monastery, where St. Gregory the Illuminator was imprisoned for 13 years.',
        image: 'http://localhost:8080/uploads/8.jpg',
        hours: 'Tue-Sun: 10:00-18:00',
        phone: '+374 10 000-000',
        rating: 4.7,
        featured: false
    },
    {
        id: 9,
        name: 'Sergey Parajanov Museum',
        nameArm: 'Սերգեյ Փարաջանովի Թանգարան',
        location: 'Yerevan',
        address: '15-17 Dzoragyugh St, Yerevan',
        description: 'The Sergey Parajanov Museum is dedicated to the legendary Armenian film director and artist. The museum displays over 1,400 works.',
        image: 'http://localhost:8080/uploads/9.jpg',
        hours: 'Tue-Sun: 11:00-17:00',
        phone: '+374 10 538-773',
        rating: 4.8,
        featured: true
    },
    {
        id: 10,
        name: 'Megerian Carpet Museum',
        nameArm: 'Մեգերյան Կարպետի Թանգարան',
        location: 'Yerevan',
        address: '9 Madoyan St, Yerevan',
        description: 'The Megerian Carpet Museum showcases the rich tradition of Armenian carpet weaving. Visitors can see antique carpets and watch master weavers at work.',
        image: 'http://localhost:8080/uploads/10.jpg',
        hours: 'Mon-Sat: 10:00-18:00',
        phone: '+374 10 000-000',
        rating: 4.6,
        featured: false
    }
];

// Scrollbar styles
const scrollbarStyles = {
    '*::-webkit-scrollbar': { width: '10px', height: '10px' },
    '*::-webkit-scrollbar-track': { background: '#E8D5B7', borderRadius: '10px' },
    '*::-webkit-scrollbar-thumb': { background: '#C4A484', borderRadius: '10px', '&:hover': { background: '#A0522D' } },
};

// Image component with proper sizing
const MuseumImage = ({ src, alt }) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);
    const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });

    useEffect(() => {
        if (!src) return;

        const img = new Image();
        img.onload = () => {
            setImageDimensions({ width: img.width, height: img.height });
            setImageLoaded(true);
        };
        img.onerror = () => {
            setImageError(true);
        };
        img.src = src;
    }, [src]);

    return (
        <Box sx={{
            position: 'relative',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#F5F0E8',
            overflow: 'hidden'
        }}>
            {!imageLoaded && !imageError && (
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '100%'
                }}>
                    <Box sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        border: `2px solid ${colors.primary}`,
                        borderTopColor: 'transparent',
                        animation: 'spin 1s linear infinite',
                        '@keyframes spin': {
                            '0%': { transform: 'rotate(0deg)' },
                            '100%': { transform: 'rotate(360deg)' }
                        }
                    }} />
                </Box>
            )}
            {imageError && (
                <Box sx={{ textAlign: 'center', p: 2 }}>
                    <MuseumIcon sx={{ fontSize: 48, color: alpha(colors.primary, 0.3), mb: 1 }} />
                    <Typography variant="caption" sx={{ color: colors.textLight, display: 'block' }}>
                        Image not available
                    </Typography>
                </Box>
            )}
            {imageLoaded && (
                <img
                    src={src}
                    alt={alt}
                    style={{
                        maxWidth: '100%',
                        maxHeight: '100%',
                        width: 'auto',
                        height: 'auto',
                        objectFit: 'contain',
                        display: 'block'
                    }}
                />
            )}
        </Box>
    );
};

function MuseumsPage() {
    const { user, logout, isAdmin } = useAuth();
    const navigate = useNavigate();

    const [anchorEl, setAnchorEl] = useState(null);
    const [backgroundPosition, setBackgroundPosition] = useState({ x: 0, y: 0 });
    const [page, setPage] = useState(1);
    const [userInitial, setUserInitial] = useState('');
    const itemsPerPage = 6;

    useEffect(() => {
        const handleMouseMove = (e) => {
            setBackgroundPosition({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    useEffect(() => {
        if (user && user.userName) {
            setUserInitial(user.userName.charAt(0).toUpperCase());
        }
    }, [user]);

    const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);

    const handleLogout = async () => {
        await logout();
        handleMenuClose();
        navigate('/');
    };

    const handleProfile = () => {
        handleMenuClose();
        navigate('/profile');
    };

    const handleAdminPanel = () => {
        handleMenuClose();
        navigate('/admin/dashboard');
    };

    const handleHomeClick = () => navigate('/');
    const handleEventsClick = () => navigate('/events');

    // Pagination
    const totalPages = Math.ceil(ARMENIAN_MUSEUMS.length / itemsPerPage);
    const paginatedMuseums = ARMENIAN_MUSEUMS.slice(
        (page - 1) * itemsPerPage,
        page * itemsPerPage
    );

    return (
        <Box sx={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #FFF8F0 0%, #F5EDE3 100%)',
            position: 'relative',
            overflowX: 'hidden',
            fontFamily: 'Inter, sans-serif'
        }}>
            <GlobalStyles styles={scrollbarStyles} />

            {/* Animated Background */}
            <Box sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 0,
                background: `
                    radial-gradient(circle at ${backgroundPosition.x * 100}% ${backgroundPosition.y * 100}%, rgba(196,164,132,0.08) 0%, transparent 50%),
                    radial-gradient(circle at ${100 - backgroundPosition.x * 100}% ${100 - backgroundPosition.y * 100}%, rgba(210,180,140,0.08) 0%, transparent 50%)
                `,
                transition: 'background 0.3s ease-out'
            }} />

            {/* Floating decorative circles */}
            <Box sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 1,
                pointerEvents: 'none',
                overflow: 'hidden'
            }}>
                {[...Array(12)].map((_, idx) => (
                    <Box key={`bg-circle-${idx}`} sx={{
                        position: 'absolute',
                        top: `${(idx * 13) % 100}%`,
                        left: `${(idx * 17) % 100}%`,
                        width: `${150 + (idx * 20)}px`,
                        height: `${150 + (idx * 20)}px`,
                        borderRadius: '50%',
                        background: `radial-gradient(circle, ${alpha(['#C4A484', '#D2B48C', '#DEB887', '#8B7355'][idx % 4], 0.06)} 0%, transparent 70%)`,
                        animation: `${pulse} ${8 + idx}s ease-in-out infinite`,
                        pointerEvents: 'none'
                    }} />
                ))}
            </Box>

            {/* Header */}
            <Box sx={{
                position: 'sticky',
                top: 0,
                zIndex: 100,
                backgroundColor: alpha('#FFFDF7', 0.95),
                backdropFilter: 'blur(10px)',
                borderBottom: `1px solid ${colors.border}`,
                boxShadow: '0 2px 20px rgba(0,0,0,0.03)'
            }}>
                <Container maxWidth="xl">
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 70 }}>
                        {/* Logo - Left side */}
                        <Box onClick={handleHomeClick} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, cursor: 'pointer' }}>
                            <Box sx={{
                                width: 38, height: 38, borderRadius: '12px', background: colors.gradient,
                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                                <MuseumIcon sx={{ color: 'white', fontSize: 22 }} />
                            </Box>
                            <Typography variant="h6" sx={{
                                fontWeight: 800, background: colors.gradient,
                                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
                            }}>
                                Museum
                            </Typography>
                        </Box>

                        {/* Right side - Navigation and User Menu */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            {/* Navigation Links */}
                            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
                                <Button
                                    startIcon={<MuseumIcon />}
                                    sx={{
                                        fontWeight: 500,
                                        color: colors.primary,
                                        borderBottom: `2px solid ${colors.primary}`,
                                        borderRadius: 0,
                                        fontSize: '0.9rem'
                                    }}
                                >
                                    Museums
                                </Button>
                                <Button
                                    startIcon={<EventIcon />}
                                    onClick={handleEventsClick}
                                    sx={{
                                        fontWeight: 500,
                                        color: colors.textLight,
                                        '&:hover': { color: colors.primary },
                                        fontSize: '0.9rem'
                                    }}
                                >
                                    Events
                                </Button>
                            </Box>

                            {/* User Menu */}
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                {user ? (
                                    <>
                                        <IconButton onClick={handleMenuOpen} sx={{ background: colors.gradient, width: 38, height: 38 }}>
                                            <Avatar sx={{ width: 38, height: 38, bgcolor: 'transparent', color: 'white' }}>
                                                {userInitial || <AccountCircleIcon />}
                                            </Avatar>
                                        </IconButton>
                                        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose} PaperProps={{ sx: { bgcolor: '#FFFDF7', borderRadius: '16px', minWidth: 200 } }}>
                                            <MenuItem onClick={handleProfile}><PersonIcon sx={{ mr: 2, color: colors.primary }} />Profile</MenuItem>
                                            {isAdmin && <MenuItem onClick={handleAdminPanel}><AdminPanelSettingsIcon sx={{ mr: 2, color: colors.primaryDark }} />Admin Panel</MenuItem>}
                                            <Divider />
                                            <MenuItem onClick={handleLogout}><LogoutIcon sx={{ mr: 2, color: colors.error }} />Logout</MenuItem>
                                        </Menu>
                                    </>
                                ) : (
                                    <>
                                        <Button onClick={() => navigate('/login')} sx={{ fontWeight: 500, color: colors.textLight }}>Sign In</Button>
                                        <Button variant="contained" onClick={() => navigate('/signup')} sx={{ fontWeight: 600, borderRadius: '12px', background: colors.gradient }}>Sign Up</Button>
                                    </>
                                )}
                            </Box>
                        </Box>
                    </Box>
                </Container>
            </Box>

            {/* Main Content */}
            <Box sx={{ position: 'relative', zIndex: 3, py: { xs: 4, md: 6 } }}>
                <Container maxWidth={false} sx={{ px: { xs: 2, sm: 3, md: 4, lg: 6 } }}>
                    {/* Museums Grid - 3 cards per row */}
                    <Grid container spacing={3}>
                        {paginatedMuseums.map((museum, index) => (
                            <Grid item xs={12} sm={6} md={4} key={museum.id}>
                                <Zoom in timeout={300 + index * 100}>
                                    <Paper elevation={0} sx={{
                                        borderRadius: '20px',
                                        overflow: 'hidden',
                                        transition: 'all 0.3s ease',
                                        background: alpha('#FFFDF7', 0.95),
                                        backdropFilter: 'blur(5px)',
                                        border: `1px solid ${alpha(colors.border, 0.5)}`,
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        '&:hover': {
                                            transform: 'translateY(-5px)',
                                            boxShadow: `0 15px 35px ${alpha(colors.primary, 0.12)}`,
                                            borderColor: alpha(colors.primary, 0.3)
                                        }
                                    }}>
                                        {/* Image Container - Fixed aspect ratio with flexible image sizing */}
                                        <Box sx={{
                                            position: 'relative',
                                            width: '100%',
                                            paddingTop: '66.67%', // 3:2 Aspect Ratio
                                            backgroundColor: '#F5F0E8',
                                            overflow: 'hidden'
                                        }}>
                                            <Box sx={{
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                width: '100%',
                                                height: '100%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}>
                                                <MuseumImage src={museum.image} alt={museum.name} />
                                            </Box>
                                            {museum.featured && (
                                                <Chip
                                                    label="Featured"
                                                    size="small"
                                                    sx={{
                                                        position: 'absolute',
                                                        bottom: 12,
                                                        left: 12,
                                                        bgcolor: colors.primary,
                                                        color: 'white',
                                                        fontWeight: 600,
                                                        fontSize: '0.7rem',
                                                        height: 24,
                                                        zIndex: 1
                                                    }}
                                                />
                                            )}
                                        </Box>

                                        <CardContent sx={{ p: 2, flexGrow: 1 }}>
                                            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: colors.text, mb: 0.5, fontSize: '1rem' }}>
                                                {museum.name}
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: colors.primary, fontStyle: 'italic', mb: 1, display: 'block', fontSize: '0.7rem' }}>
                                                {museum.nameArm}
                                            </Typography>
                                            <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mb: 1 }}>
                                                <LocationOnIcon sx={{ fontSize: 14, color: colors.primary }} />
                                                <Typography variant="caption" sx={{ color: colors.textLight, fontSize: '0.7rem' }}>
                                                    {museum.location}
                                                </Typography>
                                            </Stack>
                                            <Typography variant="body2" sx={{ color: colors.textLight, mb: 1.5, lineHeight: 1.4, fontSize: '0.75rem' }}>
                                                {museum.description.substring(0, 100)}...
                                            </Typography>
                                            <Divider sx={{ my: 1 }} />
                                            <Stack direction="row" spacing={1} sx={{ mt: 0.5, flexWrap: 'wrap', gap: 0.5 }}>
                                                <Stack direction="row" spacing={0.5} alignItems="center">
                                                    <AccessTimeIcon sx={{ fontSize: 12, color: colors.primary }} />
                                                    <Typography variant="caption" sx={{ color: colors.textLight, fontSize: '0.65rem' }}>{museum.hours}</Typography>
                                                </Stack>
                                                <Stack direction="row" spacing={0.5} alignItems="center">
                                                    <PhoneIcon sx={{ fontSize: 12, color: colors.primary }} />
                                                    <Typography variant="caption" sx={{ color: colors.textLight, fontSize: '0.65rem' }}>{museum.phone}</Typography>
                                                </Stack>
                                            </Stack>
                                            <Stack direction="row" alignItems="center" sx={{ mt: 1.5 }}>
                                                <Stack direction="row" spacing={0.3} alignItems="center">
                                                    {[...Array(5)].map((_, i) => (
                                                        i < Math.floor(museum.rating) ?
                                                            <StarIcon key={i} sx={{ fontSize: 12, color: '#FFB800' }} /> :
                                                            <StarBorderIcon key={i} sx={{ fontSize: 12, color: '#FFB800' }} />
                                                    ))}
                                                    <Typography variant="caption" sx={{ ml: 0.3, color: colors.textLight, fontSize: '0.65rem' }}>
                                                        ({museum.rating})
                                                    </Typography>
                                                </Stack>
                                            </Stack>
                                        </CardContent>
                                    </Paper>
                                </Zoom>
                            </Grid>
                        ))}
                    </Grid>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
                            <Pagination
                                count={totalPages}
                                page={page}
                                onChange={(e, value) => setPage(value)}
                                sx={{
                                    '& .MuiPaginationItem-root': {
                                        color: colors.textLight,
                                        '&.Mui-selected': {
                                            backgroundColor: colors.primary,
                                            color: 'white',
                                            '&:hover': {
                                                backgroundColor: colors.primaryDark
                                            }
                                        }
                                    }
                                }}
                            />
                        </Box>
                    )}
                </Container>
            </Box>

            {/* Footer */}
            <Box sx={{ py: 3, textAlign: 'center', background: '#FFFFFF', borderTop: `1px solid ${colors.border}` }}>
                <Container maxWidth="lg">
                    <Typography variant="body2" sx={{ color: colors.textLight, fontSize: '0.8rem' }}>
                        © 2026 Museum Events. All rights reserved.
                    </Typography>
                </Container>
            </Box>
        </Box>
    );
}

export default MuseumsPage;