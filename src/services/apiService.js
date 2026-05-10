// src/services/apiService.js

import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

// Request interceptor
api.interceptors.request.use(
    config => {
        console.log(`📤 ${config.method?.toUpperCase()} ${config.url}`);

        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        console.error('📛 Request error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor
api.interceptors.response.use(
    response => {
        console.log(`📥 Response ${response.status} from ${response.config.url}`);
        return response;
    },
    error => {
        if (error.code === 'ECONNABORTED') {
            console.error('⏰ Request timeout');
            throw new Error('Request timeout. Please check if backend is running.');
        } else if (error.response) {
            console.error(`❌ Server error ${error.response.status}:`, error.response.data);

            if (error.response.status === 401) {
                console.log('Token expired or invalid. Redirecting to login...');
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/login';
            }
        } else if (error.request) {
            console.error('🔌 No response from server. Is backend running on port 8080?');
            throw new Error('Cannot connect to server. Please check if backend is running on port 8080.');
        }
        return Promise.reject(error);
    }
);

// ==================== HELPER FUNCTIONS ====================

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
    };
};

const getMultipartHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'multipart/form-data',
        ...(token && { 'Authorization': `Bearer ${token}` })
    };
};

// ==================== AUTHENTICATION API ====================
export const authAPI = {
    signUp: async (userData) => {
        try {
            const signupData = {
                userName: userData.userName.trim(),
                email: userData.email.trim().toLowerCase(),
                password: userData.password,
                repeatPassword: userData.repeatPassword
            };
            const response = await api.post('/api/public/user/signUp', signupData);
            if (response.data?.success) {
                localStorage.setItem('verificationEmail', signupData.email);
            }
            return response;
        } catch (error) {
            console.error('Signup API error:', error);
            throw error;
        }
    },

    login: async (credentials) => {
        try {
            const response = await api.post('/account/auth', credentials);
            if (response.data && response.data.token) {
                localStorage.setItem('token', response.data.token);
                const userInfo = {
                    email: credentials.email,
                    userName: response.data.userName || credentials.email.split('@')[0],
                    token: response.data.token
                };
                localStorage.setItem('user', JSON.stringify(userInfo));
            }
            return response;
        } catch (error) {
            console.error('Login API error:', error);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            throw error;
        }
    },

    verifyEmail: async (email, pin) => {
        try {
            const response = await api.put('/api/public/user/verify', { email, pin: pin.toString() });
            localStorage.removeItem('verificationEmail');
            return response;
        } catch (error) {
            console.error('Verify email API error:', error);
            throw error;
        }
    },

    forgotPassword: async (email) => {
        try {
            const response = await api.post('/api/public/user/forgotPassword', { email });
            return response;
        } catch (error) {
            console.error('Forgot password API error:', error);
            throw error;
        }
    },

    logout: async () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                await api.get('/account/profile/logout');
            } catch (error) {
                console.warn('Logout API error:', error);
            }
        }
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('verificationEmail');
        localStorage.removeItem('rememberEmail');
    },

    getProfile: async () => {
        try {
            const response = await api.get('/account/profile');
            return response;
        } catch (error) {
            console.error('Get profile API error:', error);
            throw error;
        }
    },

    resendVerification: async (email) => {
        try {
            const response = await api.post('/api/public/user/resend-verification', { email });
            return response;
        } catch (error) {
            console.error('Resend verification API error:', error);
            throw error;
        }
    },

    updateProfile: async (profileData) => {
        try {
            const response = await api.put('/account/profile', profileData);
            return response;
        } catch (error) {
            console.error('Update profile API error:', error);
            throw error;
        }
    },

    getUserByEmail: async (email) => {
        try {
            const response = await api.get(`/api/public/user/get/${email}`);
            return response;
        } catch (error) {
            console.error('Get user by email error:', error);
            throw error;
        }
    },

    getUserByUserName: async (userName) => {
        try {
            const response = await api.get(`/api/public/user/username/${userName}`);
            return response;
        } catch (error) {
            console.error('Get user by username error:', error);
            throw error;
        }
    },

    getUserNameByEmail: async (email) => {
        try {
            const response = await api.get(`/api/public/user/get/userName/${email}`);
            return response;
        } catch (error) {
            console.error('Get username by email error:', error);
            throw error;
        }
    },

    changePassword: async (email, oldPassword, newPassword, newPasswordRepeat) => {
        try {
            const response = await api.put('/api/public/user/changePassword', null, {
                params: { email },
                data: { oldPassword, newPassword, newPasswordRepeat }
            });
            return response;
        } catch (error) {
            console.error('Change password error:', error);
            throw error;
        }
    },

    deleteAccount: async (email, password) => {
        try {
            const response = await api.delete('/api/public/user/delete/account', {
                data: { email, password }
            });
            return response;
        } catch (error) {
            console.error('Delete account error:', error);
            throw error;
        }
    },

    cancelVerification: async (email) => {
        try {
            const response = await api.delete(`/api/public/user/delete/verify/${email}`);
            return response;
        } catch (error) {
            console.error('Cancel verification error:', error);
            throw error;
        }
    }
};

// ==================== EMAIL API (WITHOUT AUTH HEADERS - permitAll) ====================
export const emailAPI = {
    sendTicketConfirmation: async (bookingData) => {
        try {
            // Օգտագործել նոր URL-ը
            const response = await axios.post(
                'http://localhost:8080/api/booking/send-ticket-email',  // ՆՈՐ URL
                {
                    email: bookingData.email,
                    bookingId: bookingData.bookingId,
                    eventName: bookingData.eventName,
                    museumName: bookingData.museumName,
                    location: bookingData.location,
                    eventDate: bookingData.eventDate,
                    ticketQuantity: bookingData.ticketQuantity,
                    ticketPrice: bookingData.ticketPrice,
                    guidePrice: bookingData.guidePrice,
                    includeGuide: bookingData.includeGuide,
                    totalAmount: bookingData.totalAmount,
                    phoneNumber: bookingData.phoneNumber,
                    fullName: bookingData.fullName
                },
                {
                    headers: {
                        'Content-Type': 'application/json'
                        // ԿԱՐԵՎՈՐ: ԱՌԱՆՑ Authorization header-ի
                    }
                }
            );
            return response;
        } catch (error) {
            console.error('Send ticket confirmation error:', error);
            throw error;
        }
    }
};

// ==================== MUSEUM API (Admin) ====================
export const museumAPI = {
    getAllMuseums: async (page = 0, size = 20) => {
        try {
            const response = await api.get(`/api/private/admin/museums?page=${page}&size=${size}`, {
                headers: getAuthHeaders()
            });
            return response;
        } catch (error) {
            console.error('Get all museums error:', error);
            throw error;
        }
    },

    getMuseumById: async (id) => {
        try {
            const response = await api.get(`/api/private/admin/museums/${id}`, {
                headers: getAuthHeaders()
            });
            return response;
        } catch (error) {
            console.error('Get museum by ID error:', error);
            throw error;
        }
    },

    createMuseum: async (museumData) => {
        try {
            const response = await api.post(`/api/private/admin/museums`, museumData, {
                headers: getAuthHeaders()
            });
            return response;
        } catch (error) {
            console.error('Create museum error:', error);
            throw error;
        }
    },

    updateMuseum: async (id, museumData) => {
        try {
            const response = await api.put(`/api/private/admin/museums/${id}`, museumData, {
                headers: getAuthHeaders()
            });
            return response;
        } catch (error) {
            console.error('Update museum error:', error);
            throw error;
        }
    },

    deleteMuseum: async (id) => {
        try {
            const response = await api.delete(`/api/private/admin/museums/${id}`, {
                headers: getAuthHeaders()
            });
            return response;
        } catch (error) {
            console.error('Delete museum error:', error);
            throw error;
        }
    }
};

// ==================== EVENT API (Admin) ====================
export const eventAPI = {
    getAllEvents: async (page = 0, size = 20, sortBy = 'eventDate', direction = 'asc') => {
        try {
            const response = await api.get(`/api/private/admin/events?page=${page}&size=${size}&sortBy=${sortBy}&direction=${direction}`, {
                headers: getAuthHeaders()
            });
            return response;
        } catch (error) {
            console.error('Get all events error:', error);
            throw error;
        }
    },

    getEventById: async (id) => {
        try {
            const response = await api.get(`/api/private/admin/events/${id}`, {
                headers: getAuthHeaders()
            });
            return response;
        } catch (error) {
            console.error('Get event by ID error:', error);
            throw error;
        }
    },

    getEventsByMuseumId: async (museumId, page = 0, size = 20) => {
        try {
            const response = await api.get(`/api/private/admin/events/museum/${museumId}?page=${page}&size=${size}`, {
                headers: getAuthHeaders()
            });
            return response;
        } catch (error) {
            console.error('Get events by museum ID error:', error);
            throw error;
        }
    },

    createEvent: async (eventData) => {
        try {
            const response = await api.post(`/api/private/admin/events`, eventData, {
                headers: getAuthHeaders()
            });
            return response;
        } catch (error) {
            console.error('Create event error:', error);
            throw error;
        }
    },

    createEventWithImages: async (eventData, imageFiles = []) => {
        try {
            const formData = new FormData();

            formData.append('name', eventData.name);
            formData.append('description', eventData.description);
            formData.append('eventCategory', eventData.eventCategory);
            formData.append('eventType', eventData.eventType);
            formData.append('eventDate', eventData.eventDate);
            formData.append('guidePrice', eventData.guidePrice.toString());
            formData.append('ticketPrice', eventData.ticketPrice.toString());
            formData.append('location', eventData.location);
            formData.append('museumId', eventData.museumId.toString());

            if (eventData.duration) {
                formData.append('duration', eventData.duration.toString());
            }

            if (eventData.phoneNumbers && eventData.phoneNumbers.length > 0) {
                eventData.phoneNumbers.forEach(phone => {
                    formData.append('phoneNumbers', phone);
                });
            }

            if (eventData.contactEmail) {
                formData.append('contactEmail', eventData.contactEmail);
            }

            if (imageFiles && imageFiles.length > 0) {
                imageFiles.forEach(file => {
                    formData.append('images', file);
                });
            }

            const response = await api.post(`/api/private/admin/events/with-images`, formData, {
                headers: getMultipartHeaders()
            });
            return response;
        } catch (error) {
            console.error('Create event with images error:', error);
            throw error;
        }
    },

    updateEvent: async (id, eventData) => {
        try {
            const response = await api.put(`/api/private/admin/events/${id}`, eventData, {
                headers: getAuthHeaders()
            });
            return response;
        } catch (error) {
            console.error('Update event error:', error);
            throw error;
        }
    },

    updateEventImages: async (eventId, imageUrls) => {
        try {
            const response = await api.put(`/api/private/admin/events/${eventId}/images`, { imageUrls }, {
                headers: getAuthHeaders()
            });
            return response;
        } catch (error) {
            console.error('Update event images error:', error);
            throw error;
        }
    },

    uploadEventImages: async (eventId, imageFiles) => {
        try {
            const formData = new FormData();
            imageFiles.forEach(file => {
                formData.append('images', file);
            });

            const response = await api.post(`/api/private/admin/events/${eventId}/images`, formData, {
                headers: getMultipartHeaders()
            });
            return response;
        } catch (error) {
            console.error('Upload event images error:', error);
            throw error;
        }
    },

    deleteEvent: async (id) => {
        try {
            const response = await api.delete(`/api/private/admin/events/${id}`, {
                headers: getAuthHeaders()
            });
            return response;
        } catch (error) {
            console.error('Delete event error:', error);
            throw error;
        }
    }
};

// ==================== STATS API (Admin) ====================
export const statsAPI = {
    getDashboardStats: async () => {
        try {
            const response = await api.get(`/api/private/admin/stats`, {
                headers: getAuthHeaders()
            });
            return response;
        } catch (error) {
            console.error('Get dashboard stats error:', error);
            throw error;
        }
    }
};

// ==================== PUBLIC EVENT API ====================
export const publicEventAPI = {
    getAllEvents: async (page = 0, size = 10, sortBy = 'eventDate', direction = 'asc') => {
        try {
            const response = await api.get(`/api/public/events?page=${page}&size=${size}&sortBy=${sortBy}&direction=${direction}`);
            return response;
        } catch (error) {
            console.error('Get all events error:', error);
            throw error;
        }
    },

    getEventById: async (id) => {
        try {
            const response = await api.get(`/api/public/events/${id}`);
            return response;
        } catch (error) {
            console.error('Get event by ID error:', error);
            throw error;
        }
    },

    getEventsByMuseumId: async (museumId, page = 0, size = 10) => {
        try {
            const response = await api.get(`/api/public/events/museum/${museumId}?page=${page}&size=${size}`);
            return response;
        } catch (error) {
            console.error('Get events by museum error:', error);
            throw error;
        }
    },

    getUpcomingEvents: async (page = 0, size = 10) => {
        try {
            const response = await api.get(`/api/public/events/upcoming?page=${page}&size=${size}`);
            return response;
        } catch (error) {
            console.error('Get upcoming events error:', error);
            throw error;
        }
    },

    searchEvents: async (searchDTO, page = 0, size = 10, sortBy = 'eventDate', direction = 'asc') => {
        try {
            const response = await api.post(`/api/public/events/search?page=${page}&size=${size}&sortBy=${sortBy}&direction=${direction}`, searchDTO);
            return response;
        } catch (error) {
            console.error('Search events error:', error);
            throw error;
        }
    },

    getEventsByCategory: async (category, page = 0, size = 10) => {
        try {
            const response = await api.get(`/api/public/events/search/category/${category}?page=${page}&size=${size}`);
            return response;
        } catch (error) {
            console.error('Get events by category error:', error);
            throw error;
        }
    },

    getEventsByLocation: async (location, page = 0, size = 10) => {
        try {
            const response = await api.get(`/api/public/events/search/location/${location}?page=${page}&size=${size}`);
            return response;
        } catch (error) {
            console.error('Get events by location error:', error);
            throw error;
        }
    }
};

// ==================== UTILITY FUNCTIONS ====================

export const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    return !!token;
};

export const getCurrentUser = () => {
    try {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
        console.error('Error parsing user from localStorage:', error);
        return null;
    }
};

export const setCurrentUser = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
};

export const clearAuthData = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('verificationEmail');
    localStorage.removeItem('rememberEmail');
};

export const formatPriceAMD = (price) => {
    if (!price && price !== 0) return '֏0';
    return new Intl.NumberFormat('hy-AM', {
        style: 'currency',
        currency: 'AMD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(price);
};

// JWT Utility Functions
export const decodeJWT = (token) => {
    try {
        if (!token) return null;
        const parts = token.split('.');
        if (parts.length !== 3) return null;
        const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
        const decodedPayload = atob(base64);
        return JSON.parse(decodedPayload);
    } catch (error) {
        console.error('Error decoding JWT:', error);
        return null;
    }
};

export const isTokenExpired = (token) => {
    const payload = decodeJWT(token);
    if (!payload || !payload.exp) return true;
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
};

export const getRolesFromToken = (token) => {
    const payload = decodeJWT(token);
    return payload?.roles || [];
};

export const hasRole = (token, role) => {
    const roles = getRolesFromToken(token);
    return roles.includes(role);
};

export const isAdmin = (token) => {
    return hasRole(token, 'ADMIN');
};

export const isUser = (token) => {
    return hasRole(token, 'USER');
};

export const getEmailFromToken = (token) => {
    const payload = decodeJWT(token);
    return payload?.sub || payload?.email || null;
};

export const isValidToken = (token) => {
    if (!token) return false;
    return !isTokenExpired(token);
};

// ==================== COMBINED EXPORT ====================
const apiService = {
    api,
    authAPI,
    emailAPI,
    museumAPI,
    eventAPI,
    statsAPI,
    publicEventAPI,
    login: authAPI.login,
    logout: authAPI.logout,
    signUp: authAPI.signUp,
    verifyEmail: authAPI.verifyEmail,
    forgotPassword: authAPI.forgotPassword,
    resendVerification: authAPI.resendVerification,
    getProfile: authAPI.getProfile,
    updateProfile: authAPI.updateProfile,
    adminAPI: {
        getAllMuseums: museumAPI.getAllMuseums,
        getMuseumById: museumAPI.getMuseumById,
        createMuseum: museumAPI.createMuseum,
        updateMuseum: museumAPI.updateMuseum,
        deleteMuseum: museumAPI.deleteMuseum,
        getAllEvents: eventAPI.getAllEvents,
        getEventById: eventAPI.getEventById,
        getEventsByMuseumId: eventAPI.getEventsByMuseumId,
        createEvent: eventAPI.createEvent,
        createEventWithImages: eventAPI.createEventWithImages,
        updateEvent: eventAPI.updateEvent,
        updateEventImages: eventAPI.updateEventImages,
        uploadEventImages: eventAPI.uploadEventImages,
        deleteEvent: eventAPI.deleteEvent,
        getStats: statsAPI.getDashboardStats
    },
    isAuthenticated,
    getCurrentUser,
    setCurrentUser,
    clearAuthData,
    formatPriceAMD,
    decodeJWT,
    isTokenExpired,
    getRolesFromToken,
    hasRole,
    isAdmin,
    isUser,
    getEmailFromToken,
    isValidToken
};

export default apiService;