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

        // Add token to headers if exists
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

            // Handle 401 Unauthorized (token expired)
            if (error.response.status === 401) {
                console.log('Token expired or invalid. Redirecting to login...');
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/admin/auth';
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
            const response = await api.post('/api/public/user/resendVerification', { email });
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

// ==================== MUSEUM API (Admin) ====================
export const museumAPI = {
    // Get all museums with pagination
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

    // Get museum by ID
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

    // Create new museum
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

    // Update museum
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

    // Delete museum
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
    // Get all events with pagination
    getAllEvents: async (page = 0, size = 20) => {
        try {
            const response = await api.get(`/api/private/admin/events?page=${page}&size=${size}`, {
                headers: getAuthHeaders()
            });
            return response;
        } catch (error) {
            console.error('Get all events error:', error);
            throw error;
        }
    },

    // Get event by ID
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

    // Get events by museum ID
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

    // Create new event (JSON only)
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

    // Create new event with image upload
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

    // Update event (JSON only)
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

    // Update event images
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

    // Upload new images to existing event
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

    // Delete event
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
    // Get dashboard statistics (total museums and events)
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

// ==================== PUBLIC SERVICE API ====================
export const serviceAPI = {
    // Get all available services (public)
    getAllServices: async (page = 0, size = 20) => {
        try {
            const response = await api.get(`/api/services?page=${page}&size=${size}`);
            return response;
        } catch (error) {
            console.error('Get all services error:', error);
            throw error;
        }
    },

    // Get service by ID (public)
    getServiceById: async (serviceId) => {
        try {
            const response = await api.get(`/api/services/${serviceId}`);
            return response;
        } catch (error) {
            console.error('Get service by ID error:', error);
            throw error;
        }
    },

    // Search services
    searchServices: async (searchParams) => {
        try {
            const params = {
                page: searchParams.page || 0,
                size: searchParams.size || 12
            };

            if (searchParams.query?.trim()) params.query = searchParams.query.trim();
            if (searchParams.category) params.category = searchParams.category;
            if (searchParams.location) params.location = searchParams.location;
            if (searchParams.minPrice) params.minPrice = parseFloat(searchParams.minPrice);
            if (searchParams.maxPrice) params.maxPrice = parseFloat(searchParams.maxPrice);
            if (searchParams.sortBy) {
                params.sortBy = searchParams.sortBy;
                params.sortDirection = searchParams.sortDirection || 'ASC';
            }

            const response = await api.post(`/api/services/search`, params);
            return response;
        } catch (error) {
            console.error('Search services error:', error);
            throw error;
        }
    },

    // Get all categories
    getCategories: async () => {
        try {
            const response = await api.get(`/api/services/categories`);
            return response;
        } catch (error) {
            console.error('Get categories error:', error);
            throw error;
        }
    },

    // Get all locations
    getLocations: async () => {
        try {
            const response = await api.get(`/api/services/locations`);
            return response;
        } catch (error) {
            console.error('Get locations error:', error);
            throw error;
        }
    },

    // Add to favorites
    addToFavorites: async (serviceId) => {
        try {
            const response = await api.post(`/api/services/${serviceId}/favorite`, {}, {
                headers: getAuthHeaders()
            });
            return response;
        } catch (error) {
            console.error('Add to favorites error:', error);
            throw error;
        }
    },

    // Remove from favorites
    removeFromFavorites: async (serviceId) => {
        try {
            const response = await api.delete(`/api/services/${serviceId}/favorite`, {
                headers: getAuthHeaders()
            });
            return response;
        } catch (error) {
            console.error('Remove from favorites error:', error);
            throw error;
        }
    },

    // Get user's favorites
    getFavorites: async (page = 0, size = 20) => {
        try {
            const response = await api.get(`/api/services/favorites?page=${page}&size=${size}`, {
                headers: getAuthHeaders()
            });
            return response;
        } catch (error) {
            console.error('Get favorites error:', error);
            throw error;
        }
    },

    // Check if service is favorited
    isFavorited: async (serviceId) => {
        try {
            const response = await api.get(`/api/services/${serviceId}/favorite/check`, {
                headers: getAuthHeaders()
            });
            return response;
        } catch (error) {
            console.error('Check favorite status error:', error);
            throw error;
        }
    },

    // Get favorite count
    getFavoriteCount: async (serviceId) => {
        try {
            const response = await api.get(`/api/services/${serviceId}/favorite/count`);
            return response;
        } catch (error) {
            console.error('Get favorite count error:', error);
            throw error;
        }
    },

    // Like a service
    likeService: async (serviceId) => {
        try {
            const response = await api.post(`/api/services/${serviceId}/like`, {}, {
                headers: getAuthHeaders()
            });
            return response;
        } catch (error) {
            console.error('Like service error:', error);
            throw error;
        }
    },

    // Unlike a service
    unlikeService: async (serviceId) => {
        try {
            const response = await api.delete(`/api/services/${serviceId}/like`, {
                headers: getAuthHeaders()
            });
            return response;
        } catch (error) {
            console.error('Unlike service error:', error);
            throw error;
        }
    },

    // Send inquiry
    sendInquiry: async (serviceId, inquiryData) => {
        try {
            const response = await api.post(`/api/services/${serviceId}/inquiry`, inquiryData, {
                headers: getAuthHeaders()
            });
            return response;
        } catch (error) {
            console.error('Send inquiry error:', error);
            throw error;
        }
    },

    // Get user's inquiries
    getUserInquiries: async (page = 0, size = 20) => {
        try {
            const response = await api.get(`/api/services/inquiries?page=${page}&size=${size}`, {
                headers: getAuthHeaders()
            });
            return response;
        } catch (error) {
            console.error('Get inquiries error:', error);
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
    // Axios instance
    api,

    // Auth
    authAPI,
    login: authAPI.login,
    logout: authAPI.logout,
    signUp: authAPI.signUp,
    verifyEmail: authAPI.verifyEmail,
    forgotPassword: authAPI.forgotPassword,
    resendVerification: authAPI.resendVerification,
    getProfile: authAPI.getProfile,
    updateProfile: authAPI.updateProfile,

    // Admin APIs
    museumAPI,
    eventAPI,
    statsAPI,

    // Public APIs
    serviceAPI,

    // Combined admin object for backward compatibility
    adminAPI: {
        // Museum endpoints
        getAllMuseums: museumAPI.getAllMuseums,
        getMuseumById: museumAPI.getMuseumById,
        createMuseum: museumAPI.createMuseum,
        updateMuseum: museumAPI.updateMuseum,
        deleteMuseum: museumAPI.deleteMuseum,

        // Event endpoints
        getAllEvents: eventAPI.getAllEvents,
        getEventById: eventAPI.getEventById,
        getEventsByMuseumId: eventAPI.getEventsByMuseumId,
        createEvent: eventAPI.createEvent,
        createEventWithImages: eventAPI.createEventWithImages,
        updateEvent: eventAPI.updateEvent,
        updateEventImages: eventAPI.updateEventImages,
        uploadEventImages: eventAPI.uploadEventImages,
        deleteEvent: eventAPI.deleteEvent,

        // Stats endpoints
        getStats: statsAPI.getDashboardStats
    },

    // Utilities
    isAuthenticated,
    getCurrentUser,
    setCurrentUser,
    clearAuthData,
    formatPriceAMD,

    // JWT Utilities
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