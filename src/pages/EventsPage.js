// src/pages/EventsPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Container,
    Typography,
    Box,
    Grid,
    Button,
    IconButton,
    Chip,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Pagination,
    Skeleton,
    Alert,
    Snackbar,
    Menu,
    Divider,
    Avatar,
    GlobalStyles,
    Fade,
    Grow,
    Paper,
    CircularProgress,
    InputAdornment,
    Stack,
    Tooltip,
    Collapse,
    Slider
} from '@mui/material';
import {
    LocationOn as LocationIcon,
    AccessTime as AccessTimeIcon,
    Event as EventIcon,
    AccountCircle as AccountCircleIcon,
    Logout as LogoutIcon,
    Person as PersonIcon,
    Celebration as CelebrationIcon,
    AdminPanelSettings as AdminIcon,
    Info as InfoIcon,
    HowToReg as HowToRegIcon,
    ChevronLeft as ChevronLeftIcon,
    ChevronRight as ChevronRightIcon,
    Image as ImageIcon,
    Phone as PhoneIcon,
    Email as EmailIcon,
    Search as SearchIcon,
    FilterAlt as FilterIcon,
    Clear as ClearIcon,
    Museum as MuseumIcon,
    Category as CategoryIcon,
    CalendarToday as CalendarIcon,
    AttachMoney as PriceIcon,
    LocalOffer as TicketIcon,
    Star as StarIcon
} from '@mui/icons-material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/hy-am';
import { useAuth } from '../context/AuthContext';
import eventAPI from '../services/eventAPI';
import { alpha, styled } from '@mui/material/styles';

// Սահմանել dayjs-ի locale-ը հայերեն
dayjs.locale('hy-am');

// Ջերմ շագանակագույն գունային համակարգ
const colors = {
    primary: '#C4A484',
    primaryDark: '#A0522D',
    primaryLight: '#D2B48C',
    secondary: '#8B7355',
    background: '#FFF8F0',
    surface: '#FFFDF7',
    text: '#4A3728',
    textLight: '#7A5C4A',
    accent: '#DEB887',
    border: '#E8D5B7',
    success: '#6B8E23',
    warning: '#CD853F',
    error: '#BC544B',
    gradient: 'linear-gradient(135deg, #C4A484 0%, #D2B48C 50%, #DEB887 100%)'
};

const scrollbarStyles = {
    '*::-webkit-scrollbar': { width: '10px', height: '10px' },
    '*::-webkit-scrollbar-track': { background: '#E8D5B7', borderRadius: '10px' },
    '*::-webkit-scrollbar-thumb': { background: '#C4A484', borderRadius: '10px', '&:hover': { background: '#A0522D' } },
};

const EventImage = styled('img')({
    maxWidth: '100%',
    maxHeight: '100%',
    width: 'auto',
    height: 'auto',
    objectFit: 'contain',
    borderRadius: '12px'
});

const DetailItem = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '12px',
    '&:last-child': { marginBottom: 0 }
}));

const DetailIcon = styled(Box)(({ theme }) => ({
    width: '36px',
    height: '36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: alpha('#C4A484', 0.12),
    borderRadius: '12px',
    color: '#C4A484'
}));

const DetailText = styled(Box)(({ theme }) => ({
    flex: 1,
    '& .label': {
        fontSize: '0.7rem',
        color: '#8A7A6A',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        marginBottom: '2px'
    },
    '& .value': {
        fontSize: '0.95rem',
        color: '#4A3728',
        fontWeight: 700
    }
}));

// ========== ԹԱՐԳՄԱՆՈՒԹՅԱՆ MAP-ԵՐ ==========
// Կատեգորիաներ - անգլերենից հայերեն
const categoryToArmenian = {
    'ART': 'Արվեստ',
    'HISTORY': 'Պատմություն',
    'SCIENCE': 'Գիտություն',
    'NATURAL_HISTORY': 'Բնական Պատմություն',
    'TECHNOLOGY': 'Տեխնոլոգիա',
    'MILITARY': 'Ռազմական',
    'ARCHAEOLOGY': 'Հնագիտություն',
    'CULTURAL': 'Մշակութային',
    'MARITIME': 'Ծովային',
    'SPACE': 'Տիեզերք',
    'TRANSPORT': 'Տրանսպորտ',
    'RELIGIOUS': 'Կրոնական',
    'ETHNOGRAPHIC': 'Ազգագրական',
    'OPEN_AIR': 'Բաց Երկնքի Տակ'
};

// Կատեգորիաներ - հայերենից անգլերեն
const armenianToCategory = {
    'Արվեստ': 'ART',
    'Պատմություն': 'HISTORY',
    'Գիտություն': 'SCIENCE',
    'Բնական Պատմություն': 'NATURAL_HISTORY',
    'Տեխնոլոգիա': 'TECHNOLOGY',
    'Ռազմական': 'MILITARY',
    'Հնագիտություն': 'ARCHAEOLOGY',
    'Մշակութային': 'CULTURAL',
    'Ծովային': 'MARITIME',
    'Տիեզերք': 'SPACE',
    'Տրանսպորտ': 'TRANSPORT',
    'Կրոնական': 'RELIGIOUS',
    'Ազգագրական': 'ETHNOGRAPHIC',
    'Բաց Երկնքի Տակ': 'OPEN_AIR'
};

// Քաղաքներ - անգլերենից հայերեն
const cityToArmenian = {
    'YEREVAN': 'Երևան',
    'GYUMRI': 'Գյումրի',
    'VANADZOR': 'Վանաձոր',
    'VAGHARSHAPAT': 'Վաղարշապատ',
    'ABOVYAN': 'Աբովյան',
    'KAPAN': 'Կապան',
    'HRAZDAN': 'Հրազդան',
    'ARMAVIR': 'Արմավիր',
    'ARTASHAT': 'Արտաշատ',
    'IJEVAN': 'Իջևան',
    'GAVAR': 'Գավառ',
    'GORIS': 'Գորիս',
    'CHARENTSAVAN': 'Չարենցավան',
    'ARARAT': 'Արարատ',
    'MASIS': 'Մասիս',
    'SEVAN': 'Սևան',
    'ASHTARAK': 'Աշտարակ',
    'DILIJAN': 'Դիլիջան',
    'SISIAN': 'Սիսիան',
    'ALAVERDI': 'Ալավերդի',
    'STEPANAVAN': 'Ստեփանավան',
    'MARTUNI': 'Մարտունի',
    'VARDENIS': 'Վարդենիս',
    'YEGHVARD': 'Եղվարդ',
    'METSAMOR': 'Մեծամոր',
    'BERD': 'Բերդ',
    'TASHIR': 'Տաշիր',
    'APARAN': 'Ապարան',
    'VAYK': 'Վայք',
    'JERMUK': 'Ջերմուկ'
};

// Քաղաքներ - հայերենից անգլերեն
const armenianToCity = {
    'Երևան': 'YEREVAN',
    'Գյումրի': 'GYUMRI',
    'Վանաձոր': 'VANADZOR',
    'Վաղարշապատ': 'VAGHARSHAPAT',
    'Աբովյան': 'ABOVYAN',
    'Կապան': 'KAPAN',
    'Հրազդան': 'HRAZDAN',
    'Արմավիր': 'ARMAVIR',
    'Արտաշատ': 'ARTASHAT',
    'Իջևան': 'IJEVAN',
    'Գավառ': 'GAVAR',
    'Գորիս': 'GORIS',
    'Չարենցավան': 'CHARENTSAVAN',
    'Արարատ': 'ARARAT',
    'Մասիս': 'MASIS',
    'Սևան': 'SEVAN',
    'Աշտարակ': 'ASHTARAK',
    'Դիլիջան': 'DILIJAN',
    'Սիսիան': 'SISIAN',
    'Ալավերդի': 'ALAVERDI',
    'Ստեփանավան': 'STEPANAVAN',
    'Մարտունի': 'MARTUNI',
    'Վարդենիս': 'VARDENIS',
    'Եղվարդ': 'YEGHVARD',
    'Մեծամոր': 'METSAMOR',
    'Բերդ': 'BERD',
    'Տաշիր': 'TASHIR',
    'Ապարան': 'APARAN',
    'Վայք': 'VAYK',
    'Ջերմուկ': 'JERMUK'
};

// Թանգարանների անուններ - անգլերենից հայերեն
const museumToArmenian = {
    'History Museum of Armenia': 'Հայաստանի Պատմության Թանգարան',
    'Matenadaran': 'Մատենադարան',
    'Cafesjian Center for the Arts': 'Գաֆեսճյան Արվեստի Կենտրոն',
    'Erebuni Fortress & Museum': 'Էրեբունի Ամրոց և Թանգարան',
    'Armenian Genocide Museum': 'Հայոց Ցեղասպանության Թանգարան',
    'Dilijan Local Lore Museum': 'Դիլիջանի Երկրագիտական Թանգարան',
    'Megerian Carpet Museum': 'Մեգերյան Կարպետի Թանգարան',
    'Sergey Parajanov Museum': 'Սերգեյ Փարաջանովի Թանգարան',
    'Khor Virap Museum': 'Խոր Վիրապի Թանգարան',
    'Gyumri Museum of Architecture': 'Գյումրու Ճարտարապետության Թանգարան',
    'Louvre': 'Լուվրի Թանգարան',
    'British Museum': 'Բրիտանական Թանգարան',
    'Metropolitan Museum of Art': 'Մետրոպոլիտեն Արվեստի Թանգարան'
};

// Թանգարաններ - հայերենից անգլերեն
const armenianToMuseum = {
    'Հայաստանի Պատմության Թանգարան': 'History Museum of Armenia',
    'Մատենադարան': 'Matenadaran',
    'Գաֆեսճյան Արվեստի Կենտրոն': 'Cafesjian Center for the Arts',
    'Էրեբունի Ամրոց և Թանգարան': 'Erebuni Fortress & Museum',
    'Հայոց Ցեղասպանության Թանգարան': 'Armenian Genocide Museum',
    'Դիլիջանի Երկրագիտական Թանգարան': 'Dilijan Local Lore Museum',
    'Մեգերյան Կարպետի Թանգարան': 'Megerian Carpet Museum',
    'Սերգեյ Փարաջանովի Թանգարան': 'Sergey Parajanov Museum',
    'Խոր Վիրապի Թանգարան': 'Khor Virap Museum',
    'Գյումրու Ճարտարապետության Թանգարան': 'Gyumri Museum of Architecture',
    'Լուվրի Թանգարան': 'Louvre',
    'Բրիտանական Թանգարան': 'British Museum',
    'Մետրոպոլիտեն Արվեստի Թանգարան': 'Metropolitan Museum of Art'
};

// Միջոցառման տեսակներ - անգլերենից հայերեն
const eventTypeToArmenian = {
    'MOBILE': 'Շրջիկ',
    'FIXED': 'Ստացիոնար',
    'ONLINE': 'Առցանց',
    'EXHIBITION': 'Ցուցահանդես',
    'WORKSHOP': 'Սեմինար',
    'LECTURE': 'Դասախոսություն',
    'TOUR': 'Էքսկուրսիա',
    'CONCERT': 'Համերգ',
    'FESTIVAL': 'Փառատոն',
    'CONFERENCE': 'Համաժողով',
    'SEMINAR': 'Սեմինար'
};

// ========== UI-ՈՒՄ ՕԳՏԱԳՈՐԾՎՈՂ ՑԱՆԿԵՐ (ՀԱՅԵՐԵՆ) ==========
const EVENT_CATEGORIES_DISPLAY = [
    { value: 'Արվեստ', label: '🎨 Արվեստ' },
    { value: 'Պատմություն', label: '📜 Պատմություն' },
    { value: 'Գիտություն', label: '🔬 Գիտություն' },
    { value: 'Բնական Պատմություն', label: '🌿 Բնական Պատմություն' },
    { value: 'Տեխնոլոգիա', label: '💻 Տեխնոլոգիա' },
    { value: 'Ռազմական', label: '⚔️ Ռազմական' },
    { value: 'Հնագիտություն', label: '🏺 Հնագիտություն' },
    { value: 'Մշակութային', label: '🎭 Մշակութային' },
    { value: 'Ծովային', label: '⚓ Ծովային' },
    { value: 'Տիեզերք', label: '🚀 Տիեզերք' },
    { value: 'Տրանսպորտ', label: '🚗 Տրանսպորտ' },
    { value: 'Կրոնական', label: '⛪ Կրոնական' },
    { value: 'Ազգագրական', label: '👥 Ազգագրական' },
    { value: 'Բաց Երկնքի Տակ', label: '🌳 Բաց Երկնքի Տակ' }
];

const ARMENIAN_MUSEUMS_DISPLAY = [
    { value: 'Հայաստանի Պատմության Թանգարան', label: '🏛️ Հայաստանի Պատմության Թանգարան' },
    { value: 'Մատենադարան', label: '📜 Մատենադարան' },
    { value: 'Գաֆեսճյան Արվեստի Կենտրոն', label: '🎨 Գաֆեսճյան Արվեստի Կենտրոն' },
    { value: 'Էրեբունի Ամրոց և Թանգարան', label: '🏺 Էրեբունի Ամրոց և Թանգարան' },
    { value: 'Հայոց Ցեղասպանության Թանգարան', label: '🕯️ Հայոց Ցեղասպանության Թանգարան' },
    { value: 'Դիլիջանի Երկրագիտական Թանգարան', label: '🌲 Դիլիջանի Երկրագիտական Թանգարան' },
    { value: 'Մեգերյան Կարպետի Թանգարան', label: '🪢 Մեգերյան Կարպետի Թանգարան' },
    { value: 'Սերգեյ Փարաջանովի Թանգարան', label: '🎬 Սերգեյ Փարաջանովի Թանգարան' },
    { value: 'Խոր Վիրապի Թանգարան', label: '⛪ Խոր Վիրապի Թանգարան' },
    { value: 'Գյումրու Ճարտարապետության Թանգարան', label: '🏛️ Գյումրու Ճարտարապետության Թանգարան' },
    { value: 'Լուվրի Թանգարան', label: '🇫🇷 Լուվրի Թանգարան' },
    { value: 'Բրիտանական Թանգարան', label: '🇬🇧 Բրիտանական Թանգարան' },
    { value: 'Մետրոպոլիտեն Արվեստի Թանգարան', label: '🇺🇸 Մետրոպոլիտեն Արվեստի Թանգարան' }
];

const ARMENIAN_LOCATIONS_DISPLAY = [
    { value: 'Երևան', label: 'Երևան' },
    { value: 'Գյումրի', label: 'Գյումրի' },
    { value: 'Վանաձոր', label: 'Վանաձոր' },
    { value: 'Վաղարշապատ', label: 'Վաղարշապատ (Էջմիածին)' },
    { value: 'Աբովյան', label: 'Աբովյան' },
    { value: 'Կապան', label: 'Կապան' },
    { value: 'Հրազդան', label: 'Հրազդան' },
    { value: 'Արմավիր', label: 'Արմավիր' },
    { value: 'Արտաշատ', label: 'Արտաշատ' },
    { value: 'Իջևան', label: 'Իջևան' },
    { value: 'Գավառ', label: 'Գավառ' },
    { value: 'Գորիս', label: 'Գորիս' },
    { value: 'Չարենցավան', label: 'Չարենցավան' },
    { value: 'Արարատ', label: 'Արարատ' },
    { value: 'Մասիս', label: 'Մասիս' },
    { value: 'Սևան', label: 'Սևան' },
    { value: 'Աշտարակ', label: 'Աշտարակ' },
    { value: 'Դիլիջան', label: 'Դիլիջան' },
    { value: 'Սիսիան', label: 'Սիսիան' },
    { value: 'Ալավերդի', label: 'Ալավերդի' },
    { value: 'Ստեփանավան', label: 'Ստեփանավան' },
    { value: 'Մարտունի', label: 'Մարտունի' },
    { value: 'Վարդենիս', label: 'Վարդենիս' },
    { value: 'Եղվարդ', label: 'Եղվարդ' },
    { value: 'Մեծամոր', label: 'Մեծամոր' },
    { value: 'Բերդ', label: 'Բերդ' },
    { value: 'Տաշիր', label: 'Տաշիր' },
    { value: 'Ապարան', label: 'Ապարան' },
    { value: 'Վայք', label: 'Վայք' },
    { value: 'Ջերմուկ', label: 'Ջերմուկ' }
];

// ========== ԹԱՐԳՄԱՆՈՒԹՅԱՆ ՕԳՆԱԿԱՆ ՖՈՒՆԿՑԻԱՆԵՐ ==========
const translateCategoryToArmenian = (engValue) => categoryToArmenian[engValue] || engValue;
const translateCategoryToEnglish = (armValue) => armenianToCategory[armValue] || armValue;
const translateCityToArmenian = (engValue) => cityToArmenian[engValue] || engValue;
const translateCityToEnglish = (armValue) => armenianToCity[armValue] || armValue;
const translateMuseumToArmenian = (engValue) => museumToArmenian[engValue] || engValue;
const translateMuseumToEnglish = (armValue) => armenianToMuseum[armValue] || armValue;
const translateEventTypeToArmenian = (engValue) => eventTypeToArmenian[engValue] || engValue;

// ========== EVENT-Ը ԹԱՐԳՄԱՆՈՂ ՖՈՒՆԿՑԻԱ ==========
// Այս ֆունկցիան ստանում է backend-ից եկած event-ը և վերադարձնում ամբողջությամբ թարգմանված տարբերակը
const translateEventToArmenian = (event) => {
    if (!event) return event;

    return {
        ...event,
        // Պահպանել բնօրինակ անգլերեն արժեքները ֆիլտրման համար
        originalCategory: event.eventCategory,
        originalLocation: event.location,
        originalMuseumName: event.museumName,
        originalEventType: event.eventType,
        // Ավելացնել թարգմանված արժեքներ ցուցադրման համար
        eventCategoryArm: translateCategoryToArmenian(event.eventCategory),
        locationArm: translateCityToArmenian(event.location),
        museumNameArm: translateMuseumToArmenian(event.museumName),
        eventTypeArm: translateEventTypeToArmenian(event.eventType)
    };
};

// Օժանդակ ֆունկցիա միջոցառման ամսաթիվը ձևաչափելու համար
const formatEventDate = (eventDate) => {
    if (!eventDate) return null;

    try {
        let date;

        if (dayjs.isDayjs(eventDate)) {
            date = eventDate;
        }
        else if (typeof eventDate === 'string') {
            date = dayjs(eventDate);
        }
        else if (Array.isArray(eventDate) && eventDate.length >= 3) {
            const [year, month, day, hour = 0, minute = 0] = eventDate;
            date = dayjs(new Date(year, month - 1, day, hour, minute));
        }
        else if (eventDate instanceof Date) {
            date = dayjs(eventDate);
        }
        else if (typeof eventDate === 'object' && eventDate !== null) {
            if (eventDate.date) {
                date = dayjs(eventDate.date);
            } else {
                date = dayjs(eventDate);
            }
        }
        else {
            date = dayjs(eventDate);
        }

        if (date && date.isValid()) {
            return date.locale('hy-am').format('MMMM D, YYYY, HH:mm');
        }

        return null;
    } catch (error) {
        console.error('Ամսաթվի ձևաչափման սխալ:', error);
        return null;
    }
};

const formatPriceAMD = (price) => {
    if (!price && price !== 0) return '֏0';
    return new Intl.NumberFormat('hy-AM', { style: 'currency', currency: 'AMD', minimumFractionDigits: 0 }).format(price);
};

const EventsPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout, isAdmin } = useAuth();

    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [anchorEl, setAnchorEl] = useState(null);
    const [activeImageIndex, setActiveImageIndex] = useState({});
    const [sortBy, setSortBy] = useState('eventDate');
    const [sortDirection, setSortDirection] = useState('asc');

    // Ֆիլտրերի վիճակներ - UI-ում ցուցադրվում են հայերեն
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedLocation, setSelectedLocation] = useState('');
    const [selectedMuseum, setSelectedMuseum] = useState('');
    const [showFilters, setShowFilters] = useState(false);

    // Գնային ֆիլտրի վիճակներ
    const [minTicketPrice, setMinTicketPrice] = useState('');
    const [maxTicketPrice, setMaxTicketPrice] = useState('');
    const [ticketPriceRange, setTicketPriceRange] = useState([0, 1000000]);

    // Դրոշակ՝ հետևելու համար, թե արդյոք որոնում է կատարվել
    const [hasSearched, setHasSearched] = useState(false);

    // ՈՐՈՆՄԱՆ ՀԻՄՆԱԿԱՆ ՖՈՒՆԿՑԻԱ - միշտ օգտագործում է ընթացիկ state-ները
    const performSearch = async () => {
        setLoading(true);
        try {
            const response = await eventAPI.getAllEvents(0, 10, sortBy, sortDirection);
            let filteredEvents = response.data.content || [];

            // Օգտագործել ընթացիկ filter արժեքները
            const currentSearchQuery = searchQuery;
            const currentSelectedCategory = selectedCategory;
            const currentSelectedLocation = selectedLocation;
            const currentSelectedMuseum = selectedMuseum;
            const currentMinTicketPrice = minTicketPrice;
            const currentMaxTicketPrice = maxTicketPrice;

            if (currentSearchQuery) {
                filteredEvents = filteredEvents.filter(event =>
                    event.name?.toLowerCase().includes(currentSearchQuery.toLowerCase()) ||
                    event.description?.toLowerCase().includes(currentSearchQuery.toLowerCase())
                );
            }

            if (currentSelectedCategory) {
                const englishCategory = translateCategoryToEnglish(currentSelectedCategory);
                filteredEvents = filteredEvents.filter(event => event.eventCategory === englishCategory);
            }

            if (currentSelectedLocation) {
                const englishLocation = translateCityToEnglish(currentSelectedLocation);
                filteredEvents = filteredEvents.filter(event => event.location === englishLocation);
            }

            if (currentSelectedMuseum) {
                const englishMuseum = translateMuseumToEnglish(currentSelectedMuseum);
                filteredEvents = filteredEvents.filter(event => event.museumName === englishMuseum);
            }

            if (currentMinTicketPrice && !isNaN(parseInt(currentMinTicketPrice))) {
                filteredEvents = filteredEvents.filter(event =>
                    event.ticketPrice >= parseInt(currentMinTicketPrice)
                );
            }
            if (currentMaxTicketPrice && !isNaN(parseInt(currentMaxTicketPrice))) {
                filteredEvents = filteredEvents.filter(event =>
                    event.ticketPrice <= parseInt(currentMaxTicketPrice)
                );
            }

            // Թարգմանել բոլոր event-երը հայերեն
            const translatedEvents = filteredEvents.map(event => translateEventToArmenian(event));

            setEvents(translatedEvents);
            setTotalPages(response.data.totalPages);
            setTotalElements(translatedEvents.length);

            const newIndices = {};
            translatedEvents.forEach(event => {
                newIndices[event.id] = 0;
            });
            setActiveImageIndex(newIndices);
        } catch (error) {
            console.error('Որոնման սխալ:', error);
            setSnackbar({ open: true, message: 'Որոնումը ձախողվեց', severity: 'error' });
        } finally {
            setLoading(false);
        }
    };

    // Բեռնել բոլոր միջոցառումները առանց ֆիլտրերի
    const loadAllEvents = async () => {
        setLoading(true);
        try {
            const response = await eventAPI.getAllEvents(0, 10, sortBy, sortDirection);
            // Թարգմանել բոլոր event-երը հայերեն
            const translatedEvents = (response.data.content || []).map(event => translateEventToArmenian(event));
            setEvents(translatedEvents);
            setTotalPages(response.data.totalPages);
            setTotalElements(translatedEvents.length);

            const newIndices = {};
            translatedEvents.forEach(event => {
                newIndices[event.id] = 0;
            });
            setActiveImageIndex(newIndices);
        } catch (error) {
            console.error('Միջոցառումների բեռնման սխալ:', error);
            setSnackbar({ open: true, message: 'Միջոցառումների բեռնումը ձախողվեց', severity: 'error' });
        } finally {
            setLoading(false);
        }
    };

    // Որոնման կոճակի սեղմում
    const handleSearch = () => {
        setPage(0);
        setHasSearched(true);
        performSearch();
    };

    // Մաքրել ֆիլտրերը
    const handleClearFilters = () => {
        setSearchQuery('');
        setSelectedCategory('');
        setSelectedLocation('');
        setSelectedMuseum('');
        setMinTicketPrice('');
        setMaxTicketPrice('');
        setTicketPriceRange([0, 1000000]);
        setPage(0);
        setHasSearched(false);
        loadAllEvents();
    };

    const handlePriceRangeChange = (event, newValue) => {
        setTicketPriceRange(newValue);
        setMinTicketPrice(newValue[0].toString());
        setMaxTicketPrice(newValue[1].toString());
    };

    const handleSortChange = (e) => {
        setSortBy(e.target.value);
        setPage(0);
        if (hasSearched) {
            performSearch();
        } else {
            loadAllEvents();
        }
    };

    const handleSortDirectionToggle = () => {
        setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
        setPage(0);
        if (hasSearched) {
            performSearch();
        } else {
            loadAllEvents();
        }
    };

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

    const handleNextImage = (eventId, totalImages, e) => {
        e.stopPropagation();
        setActiveImageIndex(prev => ({
            ...prev,
            [eventId]: ((prev[eventId] || 0) + 1) % totalImages
        }));
    };

    const handlePrevImage = (eventId, totalImages, e) => {
        e.stopPropagation();
        setActiveImageIndex(prev => ({
            ...prev,
            [eventId]: ((prev[eventId] || 0) - 1 + totalImages) % totalImages
        }));
    };

    // Սկզբնական բեռնում
    useEffect(() => {
        const savedParams = sessionStorage.getItem('eventsSearchParams');
        if (savedParams) {
            const params = JSON.parse(savedParams);
            if (params.query) setSearchQuery(params.query);
            if (params.category) setSelectedCategory(translateCategoryToArmenian(params.category));
            if (params.location) setSelectedLocation(translateCityToArmenian(params.location));
            if (params.museum) setSelectedMuseum(translateMuseumToArmenian(params.museum));
            if (params.minTicketPrice) setMinTicketPrice(params.minTicketPrice);
            if (params.maxTicketPrice) setMaxTicketPrice(params.maxTicketPrice);
            if (params.minTicketPrice && params.maxTicketPrice) {
                setTicketPriceRange([parseInt(params.minTicketPrice), parseInt(params.maxTicketPrice)]);
            }
            sessionStorage.removeItem('eventsSearchParams');
            setHasSearched(true);
            setTimeout(() => performSearch(), 100);
        } else {
            loadAllEvents();
        }

        const urlParams = new URLSearchParams(location.search);
        const queryFromUrl = urlParams.get('query');
        const categoryFromUrl = urlParams.get('category');
        const locationFromUrl = urlParams.get('location');
        const museumFromUrl = urlParams.get('museum');
        const minPriceFromUrl = urlParams.get('minTicketPrice');
        const maxPriceFromUrl = urlParams.get('maxTicketPrice');

        if (queryFromUrl || categoryFromUrl || locationFromUrl || museumFromUrl || minPriceFromUrl || maxPriceFromUrl) {
            if (queryFromUrl) setSearchQuery(queryFromUrl);
            if (categoryFromUrl) setSelectedCategory(translateCategoryToArmenian(categoryFromUrl));
            if (locationFromUrl) setSelectedLocation(translateCityToArmenian(locationFromUrl));
            if (museumFromUrl) setSelectedMuseum(translateMuseumToArmenian(museumFromUrl));
            if (minPriceFromUrl) setMinTicketPrice(minPriceFromUrl);
            if (maxPriceFromUrl) setMaxTicketPrice(maxPriceFromUrl);
            if (minPriceFromUrl && maxPriceFromUrl) {
                setTicketPriceRange([parseInt(minPriceFromUrl), parseInt(maxPriceFromUrl)]);
            }
            setHasSearched(true);
            setTimeout(() => performSearch(), 100);
        }
    }, []);

    const userInitial = user?.userName ? user.userName.charAt(0).toUpperCase() : '';
    const activeFiltersCount = [searchQuery, selectedCategory, selectedLocation, selectedMuseum, minTicketPrice, maxTicketPrice].filter(Boolean).length;

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box sx={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #FFF8F0 0%, #F5EDE3 100%)',
                fontFamily: 'Inter, sans-serif',
                position: 'relative'
            }}>
                <GlobalStyles styles={scrollbarStyles} />

                {/* Վերնագիր */}
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
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            height: 70,
                        }}>
                            {/* Լոգո - ձախ կողմ */}
                            <Box onClick={handleHomeClick} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, cursor: 'pointer' }}>
                                <Box sx={{
                                    width: 38,
                                    height: 38,
                                    borderRadius: '12px',
                                    background: colors.gradient,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <MuseumIcon sx={{ color: 'white', fontSize: 22 }} />
                                </Box>
                                <Typography variant="h6" sx={{
                                    fontWeight: 800,
                                    background: colors.gradient,
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent'
                                }}>
                                    Թանգարան
                                </Typography>
                            </Box>

                            {/* Աջ կողմ - Նավիգացիա և Օգտատիրոջ մենյու */}
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                {/* Նավիգացիոն հղումներ */}
                                <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
                                    <Button
                                        startIcon={<EventIcon />}
                                        onClick={handleEventsClick}
                                        sx={{
                                            fontWeight: 500,
                                            color: colors.primary,
                                            borderBottom: `2px solid ${colors.primary}`,
                                            borderRadius: 0,
                                            fontSize: '0.9rem'
                                        }}
                                    >
                                        Միջոցառումներ
                                    </Button>
                                </Box>

                                {/* Օգտատիրոջ մենյու */}
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    {user ? (
                                        <>
                                            <IconButton onClick={handleMenuOpen} sx={{ background: colors.gradient, width: 38, height: 38 }}>
                                                <Avatar sx={{ width: 38, height: 38, bgcolor: 'transparent', color: 'white' }}>
                                                    {userInitial || <AccountCircleIcon />}
                                                </Avatar>
                                            </IconButton>
                                            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose} PaperProps={{ sx: { bgcolor: '#FFFDF7', borderRadius: '16px', minWidth: 200 } }}>
                                                <MenuItem onClick={handleProfile}><PersonIcon sx={{ mr: 2, color: colors.primary }} />Անձնական էջ</MenuItem>
                                                {isAdmin && <MenuItem onClick={handleAdminPanel}><AdminIcon sx={{ mr: 2, color: colors.primaryDark }} />Ադմինիստրատորի վահանակ</MenuItem>}
                                                <Divider />
                                                <MenuItem onClick={handleLogout}><LogoutIcon sx={{ mr: 2, color: colors.error }} />Դուրս գալ</MenuItem>
                                            </Menu>
                                        </>
                                    ) : (
                                        <>
                                            <Button onClick={() => navigate('/login')} sx={{ fontWeight: 500, color: colors.textLight }}>Մուտք</Button>
                                            <Button variant="contained" onClick={() => navigate('/signup')} sx={{ fontWeight: 600, borderRadius: '12px', background: colors.gradient, '&:hover': { transform: 'translateY(-2px)' } }}>Գրանցվել</Button>
                                        </>
                                    )}
                                </Box>
                            </Box>
                        </Box>
                    </Container>
                </Box>

                {/* Հիմնական բովանդակություն */}
                <Box sx={{ py: 4, px: { xs: 2, sm: 3, md: 4, lg: 6 } }}>
                    {/* Որոնում և Ֆիլտրեր */}
                    <Paper elevation={0} sx={{
                        background: alpha('#FFFDF7', 0.95),
                        borderRadius: '20px',
                        p: 2.5,
                        mb: 3,
                        border: `1px solid ${alpha(colors.primary, 0.2)}`,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.04)'
                    }}>
                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs={12} md={3}>
                                <TextField
                                    fullWidth
                                    placeholder="Որոնել միջոցառումներ ըստ անվան կամ նկարագրության..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: colors.primary }} /></InputAdornment>,
                                        sx: {
                                            borderRadius: '40px',
                                            bgcolor: '#FAFAFA',
                                            '& .MuiOutlinedInput-root': {
                                                '& fieldset': { borderColor: colors.border },
                                                '&:hover fieldset': { borderColor: colors.primary },
                                                '&.Mui-focused fieldset': { borderColor: colors.primary }
                                            }
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} md={2}>
                                <FormControl fullWidth>
                                    <InputLabel sx={{ color: colors.textLight }}>Կատեգորիա</InputLabel>
                                    <Select
                                        value={selectedCategory}
                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                        label="Կատեգորիա"
                                        sx={{
                                            borderRadius: '40px',
                                            bgcolor: '#FAFAFA',
                                            '& .MuiOutlinedInput-notchedOutline': { borderColor: colors.border },
                                            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: colors.primary }
                                        }}
                                    >
                                        <MenuItem value=""><em>Բոլոր Կատեգորիաները</em></MenuItem>
                                        {EVENT_CATEGORIES_DISPLAY.map((cat) => (
                                            <MenuItem key={cat.value} value={cat.value}>{cat.label}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={2}>
                                <FormControl fullWidth>
                                    <InputLabel sx={{ color: colors.textLight }}>Վայր</InputLabel>
                                    <Select
                                        value={selectedLocation}
                                        onChange={(e) => setSelectedLocation(e.target.value)}
                                        label="Վայր"
                                        sx={{
                                            borderRadius: '40px',
                                            bgcolor: '#FAFAFA',
                                            '& .MuiOutlinedInput-notchedOutline': { borderColor: colors.border },
                                            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: colors.primary }
                                        }}
                                    >
                                        <MenuItem value=""><em>Բոլոր Վայրերը</em></MenuItem>
                                        {ARMENIAN_LOCATIONS_DISPLAY.map((loc) => (
                                            <MenuItem key={loc.value} value={loc.value}>{loc.label}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <FormControl fullWidth>
                                    <InputLabel sx={{ color: colors.textLight }}>Թանգարան</InputLabel>
                                    <Select
                                        value={selectedMuseum}
                                        onChange={(e) => setSelectedMuseum(e.target.value)}
                                        label="Թանգարան"
                                        sx={{
                                            borderRadius: '40px',
                                            bgcolor: '#FAFAFA',
                                            '& .MuiOutlinedInput-notchedOutline': { borderColor: colors.border },
                                            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: colors.primary }
                                        }}
                                    >
                                        <MenuItem value=""><em>Բոլոր Թանգարանները</em></MenuItem>
                                        {ARMENIAN_MUSEUMS_DISPLAY.map((museum) => (
                                            <MenuItem key={museum.value} value={museum.value}>{museum.label}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={2}>
                                <Stack direction="row" spacing={1}>
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        onClick={handleSearch}
                                        sx={{
                                            borderRadius: '40px',
                                            background: colors.gradient,
                                            height: '56px',
                                            textTransform: 'none',
                                            fontWeight: 600,
                                            '&:hover': {
                                                transform: 'translateY(-1px)',
                                                boxShadow: '0 4px 12px rgba(196, 164, 132, 0.3)'
                                            }
                                        }}
                                    >
                                        Որոնել
                                    </Button>
                                    <Tooltip title="Ֆիլտրեր">
                                        <IconButton onClick={() => setShowFilters(!showFilters)} sx={{ height: '56px', width: '56px', border: `1px solid ${colors.border}`, borderRadius: '40px', bgcolor: '#FAFAFA', color: showFilters ? colors.primary : colors.textLight }}>
                                            <FilterIcon />
                                        </IconButton>
                                    </Tooltip>
                                </Stack>
                            </Grid>
                        </Grid>

                        <Collapse in={showFilters}>
                            <Box sx={{ mt: 3, pt: 3, borderTop: `1px solid ${colors.border}` }}>
                                {/* Տոմսի գնի ֆիլտրի բաժին */}
                                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: colors.text }}>
                                    💰 Տոմսի Գնի Միջակայք (֏)
                                </Typography>

                                <Box sx={{ px: 2, mb: 3 }}>
                                    <Box sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        mb: 2,
                                        p: 1.5,
                                        background: alpha(colors.primary, 0.05),
                                        borderRadius: '12px'
                                    }}>
                                        <Box sx={{ textAlign: 'center', flex: 1 }}>
                                            <Typography variant="caption" sx={{ color: colors.textLight }}>Նվազագույն Գին</Typography>
                                            <Typography variant="h6" sx={{ fontWeight: 700, color: colors.primary }}>{ticketPriceRange[0].toLocaleString('hy-AM')} ֏</Typography>
                                        </Box>
                                        <Box sx={{ width: 30, height: 2, background: colors.gradient }} />
                                        <Box sx={{ textAlign: 'center', flex: 1 }}>
                                            <Typography variant="caption" sx={{ color: colors.textLight }}>Առավելագույն Գին</Typography>
                                            <Typography variant="h6" sx={{ fontWeight: 700, color: colors.primary }}>{ticketPriceRange[1].toLocaleString('hy-AM')} ֏</Typography>
                                        </Box>
                                    </Box>

                                    <Slider
                                        value={ticketPriceRange}
                                        onChange={handlePriceRangeChange}
                                        valueLabelDisplay="on"
                                        valueLabelFormat={(value) => `${value.toLocaleString('hy-AM')} ֏`}
                                        min={0}
                                        max={1000000}
                                        step={10000}
                                        sx={{
                                            color: colors.primary,
                                            height: 8,
                                            '& .MuiSlider-track': {
                                                background: colors.gradient,
                                                border: 'none',
                                            },
                                            '& .MuiSlider-thumb': {
                                                width: 20,
                                                height: 20,
                                                backgroundColor: '#FFFFFF',
                                                border: `2px solid ${colors.primary}`,
                                            },
                                            '& .MuiSlider-valueLabel': {
                                                backgroundColor: colors.primary,
                                                borderRadius: '12px',
                                                padding: '4px 12px',
                                                fontSize: '0.75rem',
                                                fontWeight: 600,
                                            }
                                        }}
                                    />

                                    {/* Արագ գնային կոճակներ */}
                                    <Box sx={{ display: 'flex', gap: 1, mt: 3, flexWrap: 'wrap' }}>
                                        {[
                                            { label: '10,000֏-ից ցածր', min: 0, max: 10000 },
                                            { label: '10,000֏ - 50,000֏', min: 10000, max: 50000 },
                                            { label: '50,000֏ - 100,000֏', min: 50000, max: 100000 },
                                            { label: '100,000֏ - 300,000֏', min: 100000, max: 300000 },
                                            { label: '300,000֏+', min: 300000, max: 1000000 }
                                        ].map((preset) => (
                                            <Button
                                                key={preset.label}
                                                size="small"
                                                variant="outlined"
                                                onClick={() => {
                                                    setTicketPriceRange([preset.min, preset.max]);
                                                    setMinTicketPrice(preset.min.toString());
                                                    setMaxTicketPrice(preset.max.toString());
                                                }}
                                                sx={{
                                                    borderRadius: '20px',
                                                    textTransform: 'none',
                                                    fontSize: '0.7rem',
                                                    borderColor: alpha(colors.primary, 0.3),
                                                    color: colors.textLight,
                                                    '&:hover': {
                                                        borderColor: colors.primary,
                                                        backgroundColor: alpha(colors.primary, 0.05),
                                                        color: colors.primary
                                                    }
                                                }}
                                            >
                                                {preset.label}
                                            </Button>
                                        ))}
                                    </Box>
                                </Box>

                                {/* Տեսակավորման կառավարում */}
                                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap', mt: 2 }}>
                                    <FormControl size="small" sx={{ minWidth: 150 }}>
                                        <InputLabel sx={{ color: colors.textLight }}>Տեսակավորել Ըստ</InputLabel>
                                        <Select value={sortBy} onChange={handleSortChange} label="Տեսակավորել Ըստ" sx={{ '& .MuiOutlinedInput-notchedOutline': { borderColor: colors.border } }}>
                                            <MenuItem value="eventDate">Միջոցառման Ամսաթիվ</MenuItem>
                                            <MenuItem value="guidePrice">Ուղեցույցի Գին</MenuItem>
                                            <MenuItem value="ticketPrice">Տոմսի Գին</MenuItem>
                                            <MenuItem value="name">Անվանում</MenuItem>
                                        </Select>
                                    </FormControl>
                                    <Button onClick={handleSortDirectionToggle} variant="outlined" size="small" sx={{ borderRadius: '20px', borderColor: colors.border, color: colors.text, '&:hover': { borderColor: colors.primary, color: colors.primary } }}>
                                        {sortDirection === 'asc' ? '↑ Աճման' : '↓ Նվազման'}
                                    </Button>
                                </Box>

                                {activeFiltersCount > 0 && (
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                                        <Button startIcon={<ClearIcon />} onClick={handleClearFilters} sx={{ color: colors.primary }}>
                                            Մաքրել բոլոր ֆիլտրերը ({activeFiltersCount})
                                        </Button>
                                    </Box>
                                )}
                            </Box>
                        </Collapse>
                    </Paper>

                    {/* Արդյունքների քանակ */}
                    {!loading && events.length > 0 && hasSearched && (
                        <Box sx={{ mb: 3 }}>
                            <Typography sx={{ color: colors.textLight }}>Գտնվել է <strong style={{ color: colors.primary }}>{totalElements}</strong> միջոցառում</Typography>
                        </Box>
                    )}

                    {!loading && events.length > 0 && !hasSearched && (
                        <Box sx={{ mb: 3 }}>
                            <Typography sx={{ color: colors.textLight }}>Ցուցադրվում է <strong style={{ color: colors.primary }}>{events.length}</strong> միջոցառում - Օգտագործեք ֆիլտրերը և սեղմեք Որոնել արդյունքները ճշգրտելու համար</Typography>
                        </Box>
                    )}

                    {/* Միջոցառումների ցանկ */}
                    {loading ? (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                            {[1, 2, 3].map(i => (
                                <Box key={i}>
                                    <Grid container>
                                        <Grid item xs={12} md={5}><Skeleton variant="rectangular" height={280} sx={{ borderRadius: '16px', bgcolor: '#E8D5B7' }} /></Grid>
                                        <Grid item xs={12} md={7}>
                                            <Skeleton height={40} width="60%" sx={{ bgcolor: '#E8D5B7' }} />
                                            <Skeleton height={20} width="90%" sx={{ bgcolor: '#E8D5B7' }} />
                                            <Skeleton height={20} width="80%" sx={{ bgcolor: '#E8D5B7' }} />
                                            <Skeleton height={20} width="50%" sx={{ bgcolor: '#E8D5B7' }} />
                                        </Grid>
                                    </Grid>
                                    <Divider sx={{ my: 4, borderColor: colors.border }} />
                                </Box>
                            ))}
                        </Box>
                    ) : events.length === 0 ? (
                        <Box sx={{ textAlign: 'center', py: 8 }}>
                            <Typography variant="h6" sx={{ color: colors.textLight }}>
                                Միջոցառումներ չեն գտնվել
                            </Typography>
                            <Typography variant="body2" sx={{ color: colors.textLight, mt: 1 }}>
                                Փորձեք փոխել ֆիլտրերը կամ որոնման հարցումը
                            </Typography>
                            <Button onClick={handleClearFilters} sx={{ mt: 2, color: colors.primary }}>
                                Մաքրել բոլոր ֆիլտրերը
                            </Button>
                        </Box>
                    ) : (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                            {events.map((event, index) => {
                                const eventDate = formatEventDate(event.eventDate);
                                const images = event.imageUrls || [];
                                const currentIndex = activeImageIndex[event.id] || 0;

                                return (
                                    <Grow in={true} style={{ transitionDelay: `${index * 50}ms` }} key={event.id}>
                                        <Box sx={{
                                            py: 3,
                                            borderBottom: index < events.length - 1 ? `1px solid ${colors.border}` : 'none'
                                        }}>
                                            <Grid container spacing={3}>
                                                {/* Նկարների Carousel */}
                                                <Grid item xs={12} md={5}>
                                                    <Box sx={{
                                                        position: 'relative',
                                                        minHeight: 280,
                                                        bgcolor: '#FFFFFF',
                                                        borderRadius: '16px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        overflow: 'hidden',
                                                        border: `1px solid ${colors.border}`,
                                                        boxShadow: '0 4px 12px rgba(0,0,0,0.04)'
                                                    }}>
                                                        {images.length > 0 ? (
                                                            <>
                                                                <EventImage src={images[currentIndex]} alt={event.name} />
                                                                {images.length > 1 && (
                                                                    <>
                                                                        <IconButton onClick={(e) => handlePrevImage(event.id, images.length, e)} sx={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', bgcolor: alpha('#000', 0.5), color: 'white', '&:hover': { bgcolor: alpha('#000', 0.7) } }}>
                                                                            <ChevronLeftIcon />
                                                                        </IconButton>
                                                                        <IconButton onClick={(e) => handleNextImage(event.id, images.length, e)} sx={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', bgcolor: alpha('#000', 0.5), color: 'white', '&:hover': { bgcolor: alpha('#000', 0.7) } }}>
                                                                            <ChevronRightIcon />
                                                                        </IconButton>
                                                                        <Chip label={`${currentIndex + 1}/${images.length}`} size="small" sx={{ position: 'absolute', bottom: 8, right: 8, bgcolor: alpha('#000', 0.7), color: 'white' }} />
                                                                    </>
                                                                )}
                                                            </>
                                                        ) : (
                                                            <Box sx={{ textAlign: 'center' }}>
                                                                <ImageIcon sx={{ fontSize: 60, color: alpha(colors.primary, 0.3) }} />
                                                                <Typography variant="body2" sx={{ color: colors.textLight, mt: 1 }}>Նկարներ չկան</Typography>
                                                            </Box>
                                                        )}
                                                    </Box>
                                                </Grid>

                                                {/* Միջոցառման մանրամասներ */}
                                                <Grid item xs={12} md={7}>
                                                    <Typography variant="h5" sx={{ fontWeight: 700, color: colors.text, mb: 2 }}>
                                                        {event.name}
                                                    </Typography>

                                                    <Typography variant="body2" sx={{
                                                        color: colors.textLight,
                                                        mb: 3,
                                                        lineHeight: 1.6,
                                                        textAlign: 'justify'
                                                    }}>
                                                        {event.description}
                                                    </Typography>

                                                    {/* Գնային բաժին */}
                                                    <Grid container spacing={2} sx={{ mb: 3 }}>
                                                        <Grid item xs={12} sm={6}>
                                                            <DetailItem>
                                                                <DetailIcon><PriceIcon sx={{ fontSize: 20 }} /></DetailIcon>
                                                                <DetailText>
                                                                    <div className="label">Ուղեցույցի Գին</div>
                                                                    <div className="value" style={{ color: colors.primary }}>{formatPriceAMD(event.guidePrice)}</div>
                                                                </DetailText>
                                                            </DetailItem>
                                                        </Grid>
                                                        <Grid item xs={12} sm={6}>
                                                            <DetailItem>
                                                                <DetailIcon><TicketIcon sx={{ fontSize: 20 }} /></DetailIcon>
                                                                <DetailText>
                                                                    <div className="label">Տոմսի Գին</div>
                                                                    <div className="value" style={{ color: colors.success }}>{formatPriceAMD(event.ticketPrice)}</div>
                                                                </DetailText>
                                                            </DetailItem>
                                                        </Grid>
                                                    </Grid>

                                                    {/* Միջոցառման մանրամասների ցանց - ՕԳՏԱԳՈՐԾԵԼ ԹԱՐԳՄԱՆՎԱԾ ԱՐԺԵՔՆԵՐԸ */}
                                                    <Grid container spacing={2} sx={{ mb: 3 }}>
                                                        <Grid item xs={12} sm={6}>
                                                            <DetailItem>
                                                                <DetailIcon><CategoryIcon sx={{ fontSize: 20 }} /></DetailIcon>
                                                                <DetailText>
                                                                    <div className="label">Կատեգորիա</div>
                                                                    <div className="value">{event.eventCategoryArm || event.eventCategory}</div>
                                                                </DetailText>
                                                            </DetailItem>
                                                        </Grid>
                                                        <Grid item xs={12} sm={6}>
                                                            <DetailItem>
                                                                <DetailIcon><LocationIcon sx={{ fontSize: 20 }} /></DetailIcon>
                                                                <DetailText>
                                                                    <div className="label">Վայր</div>
                                                                    <div className="value">{event.locationArm || event.location}</div>
                                                                </DetailText>
                                                            </DetailItem>
                                                        </Grid>
                                                        <Grid item xs={12} sm={6}>
                                                            <DetailItem>
                                                                <DetailIcon><MuseumIcon sx={{ fontSize: 20 }} /></DetailIcon>
                                                                <DetailText>
                                                                    <div className="label">Թանգարան</div>
                                                                    <div className="value">{event.museumNameArm || event.museumName || '-'}</div>
                                                                </DetailText>
                                                            </DetailItem>
                                                        </Grid>
                                                        <Grid item xs={12} sm={6}>
                                                            <DetailItem>
                                                                <DetailIcon><CalendarIcon sx={{ fontSize: 20 }} /></DetailIcon>
                                                                <DetailText>
                                                                    <div className="label">Միջոցառման Ամսաթիվ</div>
                                                                    <div className="value">{eventDate || 'Ամսաթիվ նշված չէ'}</div>
                                                                </DetailText>
                                                            </DetailItem>
                                                        </Grid>
                                                        {event.duration && (
                                                            <Grid item xs={12} sm={6}>
                                                                <DetailItem>
                                                                    <DetailIcon><AccessTimeIcon sx={{ fontSize: 20 }} /></DetailIcon>
                                                                    <DetailText>
                                                                        <div className="label">Տևողություն</div>
                                                                        <div className="value">{event.duration} ժամ</div>
                                                                    </DetailText>
                                                                </DetailItem>
                                                            </Grid>
                                                        )}
                                                        {event.eventType && (
                                                            <Grid item xs={12} sm={6}>
                                                                <DetailItem>
                                                                    <DetailIcon><StarIcon sx={{ fontSize: 20 }} /></DetailIcon>
                                                                    <DetailText>
                                                                        <div className="label">Միջոցառման Տեսակ</div>
                                                                        <div className="value">{event.eventTypeArm || event.eventType}</div>
                                                                    </DetailText>
                                                                </DetailItem>
                                                            </Grid>
                                                        )}
                                                    </Grid>

                                                    {/* Կոնտակտային տվյալներ */}
                                                    {(event.contactEmail || event.phoneNumber) && (
                                                        <Box sx={{ mt: 2, p: 2, bgcolor: alpha(colors.primary, 0.04), borderRadius: '16px', border: `1px solid ${alpha(colors.primary, 0.15)}` }}>
                                                            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: colors.text, mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                📞 Կոնտակտային Տվյալներ
                                                            </Typography>
                                                            {event.contactEmail && (
                                                                <DetailItem sx={{ mb: 1 }}>
                                                                    <DetailIcon sx={{ width: '28px', height: '28px', backgroundColor: alpha(colors.primary, 0.08) }}>
                                                                        <EmailIcon sx={{ fontSize: 16 }} />
                                                                    </DetailIcon>
                                                                    <DetailText>
                                                                        <div className="value" style={{ fontSize: '0.85rem', fontWeight: 500 }}>{event.contactEmail}</div>
                                                                    </DetailText>
                                                                </DetailItem>
                                                            )}
                                                            {event.phoneNumber && (
                                                                <DetailItem>
                                                                    <DetailIcon sx={{ width: '28px', height: '28px', backgroundColor: alpha(colors.primary, 0.08) }}>
                                                                        <PhoneIcon sx={{ fontSize: 16 }} />
                                                                    </DetailIcon>
                                                                    <DetailText>
                                                                        <div className="value" style={{ fontSize: '0.85rem', fontWeight: 500 }}>{event.phoneNumber}</div>
                                                                    </DetailText>
                                                                </DetailItem>
                                                            )}
                                                        </Box>
                                                    )}
                                                </Grid>
                                            </Grid>
                                        </Box>
                                    </Grow>
                                );
                            })}
                        </Box>
                    )}
                </Box>

                <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
                    <Alert severity={snackbar.severity} sx={{ borderRadius: '12px', bgcolor: '#FFFDF7', color: colors.text }}>{snackbar.message}</Alert>
                </Snackbar>
            </Box>
        </LocalizationProvider>
    );
};

export default EventsPage;