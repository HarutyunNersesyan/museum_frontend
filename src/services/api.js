import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

// Request interceptor
api.interceptors.request.use(
    config => {
        console.log(`📤 ${config.method.toUpperCase()} ${config.url}`);
        console.log('Request data:', config.data);

        // Add token to headers if exists
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            console.log('Token added to request');
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
        console.log('Response data:', response.data);
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
                window.location.href = '/';
            }
        } else if (error.request) {
            console.error('🔌 No response from server. Is backend running on port 8080?');
            throw new Error('Cannot connect to server. Please check if backend is running on port 8080.');
        } else {
            console.error('⚠️ Request setup error:', error.message);
        }
        return Promise.reject(error);
    }
);

// ==================== AUTHENTICATION API ====================
export const authAPI = {
    // SignUp - Fixed according to backend SignUp DTO
    signUp: async (userData) => {
        try {
            console.log('Sending signup data:', userData);

            // Backend SignUp DTO expects: userName, email, password, repeatPassword
            const signupData = {
                userName: userData.userName.trim(),
                email: userData.email.trim().toLowerCase(),
                password: userData.password,
                repeatPassword: userData.repeatPassword
            };

            console.log('Final signup data being sent to backend:', signupData);

            const response = await api.post('/api/public/user/signUp', signupData);

            // Store email for verification page
            if (response.data?.success) {
                localStorage.setItem('verificationEmail', signupData.email);
            }

            return response;
        } catch (error) {
            console.error('Signup API error:', error);
            // Add more specific error handling
            if (error.response?.data) {
                console.error('Backend error details:', error.response.data);
            }
            throw error;
        }
    },

    // Login
    login: async (credentials) => {
        try {
            console.log('Login credentials:', credentials);
            const response = await api.post('/account/auth', credentials);

            // If login successful, store token
            if (response.data && response.data.token) {
                localStorage.setItem('token', response.data.token);
                // Also store user info
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
            // Clear tokens on login error
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            throw error;
        }
    },

    // Verify Email
    verifyEmail: async (email, pin) => {
        try {
            console.log('Verifying email:', email, 'PIN:', pin);
            const verifyData = {
                email: email,
                pin: pin.toString()
            };

            // Use PUT method as per your backend endpoint
            const response = await api.put('/api/public/user/verify', verifyData);

            // Clear stored email after successful verification
            localStorage.removeItem('verificationEmail');

            return response;
        } catch (error) {
            console.error('Verify email API error:', error);
            throw error;
        }
    },

    // Forgot Password
    forgotPassword: async (email) => {
        try {
            const response = await api.post('/api/public/user/forgotPassword', { email });
            return response;
        } catch (error) {
            console.error('Forgot password API error:', error);
            throw error;
        }
    },

    // Logout
    logout: async () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                await api.get('/account/profile/logout');
            } catch (error) {
                console.warn('Logout API error:', error);
            }
        }
        // Always clear local storage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('verificationEmail');
        localStorage.removeItem('rememberEmail');
    },

    // Get User Profile
    getProfile: async () => {
        try {
            const response = await api.get('/account/profile');
            return response;
        } catch (error) {
            console.error('Get profile API error:', error);
            throw error;
        }
    },

    // Resend verification code
    resendVerification: async (email) => {
        try {
            const response = await api.post('/api/public/user/resendVerification', { email });
            return response;
        } catch (error) {
            console.error('Resend verification API error:', error);
            throw error;
        }
    },

    // Update user profile
    updateProfile: async (profileData) => {
        try {
            const response = await api.put('/account/profile', profileData);
            return response;
        } catch (error) {
            console.error('Update profile API error:', error);
            throw error;
        }
    },

    // Get user by email
    getUserByEmail: async (email) => {
        try {
            const response = await api.get(`/api/public/user/get/${email}`);
            return response;
        } catch (error) {
            console.error('Get user by email error:', error);
            throw error;
        }
    },

    // Get user by username
    getUserByUserName: async (userName) => {
        try {
            const response = await api.get(`/api/public/user/username/${userName}`);
            return response;
        } catch (error) {
            console.error('Get user by username error:', error);
            throw error;
        }
    },

    // Get username by email
    getUserNameByEmail: async (email) => {
        try {
            const response = await api.get(`/api/public/user/get/userName/${email}`);
            return response;
        } catch (error) {
            console.error('Get username by email error:', error);
            throw error;
        }
    },

    // Change password
    changePassword: async (email, oldPassword, newPassword, newPasswordRepeat) => {
        try {
            const response = await api.put('/api/public/user/changePassword', null, {
                params: { email },
                data: {
                    oldPassword,
                    newPassword,
                    newPasswordRepeat
                }
            });
            return response;
        } catch (error) {
            console.error('Change password error:', error);
            throw error;
        }
    },

    // Delete account
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

    // Cancel verification (delete unverified account)
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

// ==================== SERVICE API (Public) ====================
export const serviceAPI = {
    // Get all available services
    getAllServices: async (page = 0, size = 20) => {
        try {
            const response = await api.get(`/api/services?page=${page}&size=${size}`);
            return response;
        } catch (error) {
            console.error('Get all services error:', error);
            throw error;
        }
    },

    // Get service by ID
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
            const response = await api.post('/api/services/search', searchParams);
            return response;
        } catch (error) {
            console.error('Search services error:', error);
            throw error;
        }
    },

    // Get all categories
    getCategories: async () => {
        try {
            const response = await api.get('/api/services/categories');
            return response;
        } catch (error) {
            console.error('Get categories error:', error);
            throw error;
        }
    },

    // Get all locations
    getLocations: async () => {
        try {
            const response = await api.get('/api/services/locations');
            return response;
        } catch (error) {
            console.error('Get locations error:', error);
            throw error;
        }
    },

    // ==================== Favorites ====================
    addToFavorites: async (serviceId) => {
        try {
            const response = await api.post(`/api/services/${serviceId}/favorite`);
            return response;
        } catch (error) {
            console.error('Add to favorites error:', error);
            throw error;
        }
    },

    removeFromFavorites: async (serviceId) => {
        try {
            const response = await api.delete(`/api/services/${serviceId}/favorite`);
            return response;
        } catch (error) {
            console.error('Remove from favorites error:', error);
            throw error;
        }
    },

    getFavorites: async (page = 0, size = 20) => {
        try {
            const response = await api.get(`/api/services/favorites?page=${page}&size=${size}`);
            return response;
        } catch (error) {
            console.error('Get favorites error:', error);
            throw error;
        }
    },

    isFavorited: async (serviceId) => {
        try {
            const response = await api.get(`/api/services/${serviceId}/favorite/check`);
            return response;
        } catch (error) {
            console.error('Check favorite status error:', error);
            throw error;
        }
    },

    getFavoriteCount: async (serviceId) => {
        try {
            const response = await api.get(`/api/services/${serviceId}/favorite/count`);
            return response;
        } catch (error) {
            console.error('Get favorite count error:', error);
            throw error;
        }
    },

    // ==================== Inquiries ====================
    sendInquiry: async (serviceId, inquiryData) => {
        try {
            const response = await api.post(`/api/services/${serviceId}/inquiry`, inquiryData);
            return response;
        } catch (error) {
            console.error('Send inquiry error:', error);
            throw error;
        }
    },

    getUserInquiries: async (page = 0, size = 20) => {
        try {
            const response = await api.get(`/api/services/inquiries?page=${page}&size=${size}`);
            return response;
        } catch (error) {
            console.error('Get inquiries error:', error);
            throw error;
        }
    }
};

// ==================== ADMIN API (Private) - UPDATED ====================
export const adminAPI = {
    // ==================== Service Management ====================
    getAllServices: async (page = 0, size = 20) => {
        try {
            const response = await api.get(`/api/private/admin/services?page=${page}&size=${size}`);
            return response;
        } catch (error) {
            console.error('Get all services error:', error);
            throw error;
        }
    },

    // Create service with JSON only - UPDATED with date/time
    createServiceJSON: async (serviceData) => {
        try {
            // Make sure date/time are in the correct format
            const dataToSend = {
                ...serviceData,
                startDate: serviceData.startDate || null,
                startTime: serviceData.startTime || null
            };

            const response = await api.post('/api/private/admin/services', dataToSend);
            return response;
        } catch (error) {
            console.error('Create service JSON error:', error);
            throw error;
        }
    },

    // Create service with image upload - UPDATED with date/time
    createService: async (serviceData, imageFiles = []) => {
        try {
            const formData = new FormData();

            // Add each field individually
            formData.append('name', serviceData.name);
            formData.append('description', serviceData.description);
            formData.append('price', serviceData.price.toString());
            formData.append('category', serviceData.category);
            formData.append('location', serviceData.location);

            if (serviceData.duration) {
                formData.append('duration', serviceData.duration.toString());
            }
            if (serviceData.maxParticipants) {
                formData.append('maxParticipants', serviceData.maxParticipants.toString());
            }
            if (serviceData.tags) {
                formData.append('tags', serviceData.tags);
            }

            // ✅ ADD DATE AND TIME FIELDS
            if (serviceData.startDate) {
                formData.append('startDate', serviceData.startDate);
                console.log('Adding startDate to formData:', serviceData.startDate);
            }
            if (serviceData.startTime) {
                formData.append('startTime', serviceData.startTime);
                console.log('Adding startTime to formData:', serviceData.startTime);
            }

            // Add image files
            imageFiles.forEach((file) => {
                formData.append('images', file);
            });

            const response = await api.post('/api/private/admin/services/with-images', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response;
        } catch (error) {
            console.error('Create service error:', error);
            throw error;
        }
    },

    // Update service with JSON only - UPDATED with date/time
    updateServiceJSON: async (serviceId, serviceData) => {
        try {
            const dataToSend = {
                ...serviceData,
                startDate: serviceData.startDate || null,
                startTime: serviceData.startTime || null
            };

            const response = await api.put(`/api/private/admin/services/${serviceId}`, dataToSend);
            return response;
        } catch (error) {
            console.error('Update service JSON error:', error);
            throw error;
        }
    },

    // Update service with images - UPDATED with date/time
    updateService: async (serviceId, serviceData, imageFiles = [], existingImageUrls = []) => {
        try {
            const formData = new FormData();

            // Add each field individually
            formData.append('name', serviceData.name);
            formData.append('description', serviceData.description);
            formData.append('price', serviceData.price.toString());
            formData.append('category', serviceData.category);
            formData.append('location', serviceData.location);

            if (serviceData.duration) {
                formData.append('duration', serviceData.duration.toString());
            }
            if (serviceData.maxParticipants) {
                formData.append('maxParticipants', serviceData.maxParticipants.toString());
            }
            if (serviceData.tags) {
                formData.append('tags', serviceData.tags);
            }

            // ✅ ADD DATE AND TIME FIELDS
            if (serviceData.startDate) {
                formData.append('startDate', serviceData.startDate);
                console.log('Adding startDate to formData:', serviceData.startDate);
            }
            if (serviceData.startTime) {
                formData.append('startTime', serviceData.startTime);
                console.log('Adding startTime to formData:', serviceData.startTime);
            }

            // Add existing image URLs
            existingImageUrls.forEach((url) => {
                formData.append('existingImageUrls', url);
            });

            // Add new image files
            imageFiles.forEach((file) => {
                formData.append('images', file);
            });

            const response = await api.put(`/api/private/admin/services/${serviceId}/with-images`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response;
        } catch (error) {
            console.error('Update service error:', error);
            throw error;
        }
    },

    deleteService: async (serviceId) => {
        try {
            const response = await api.delete(`/api/private/admin/services/${serviceId}`);
            return response;
        } catch (error) {
            console.error('Delete service error:', error);
            throw error;
        }
    },

    toggleAvailability: async (serviceId) => {
        try {
            const response = await api.patch(`/api/private/admin/services/${serviceId}/toggle-availability`);
            return response;
        } catch (error) {
            console.error('Toggle availability error:', error);
            throw error;
        }
    },

    // ==================== Image Management ====================
    deleteImage: async (serviceId, imageUrl) => {
        try {
            const response = await api.delete(`/api/private/admin/services/${serviceId}/images`, {
                params: { imageUrl }
            });
            return response;
        } catch (error) {
            console.error('Delete image error:', error);
            throw error;
        }
    },

    // ==================== Inquiry Management ====================
    getAllInquiries: async (page = 0, size = 20, status = null) => {
        try {
            const url = status
                ? `/api/private/admin/inquiries?page=${page}&size=${size}&status=${status}`
                : `/api/private/admin/inquiries?page=${page}&size=${size}`;
            const response = await api.get(url);
            return response;
        } catch (error) {
            console.error('Get inquiries error:', error);
            throw error;
        }
    },

    respondToInquiry: async (inquiryId, responseData) => {
        try {
            const response = await api.post(`/api/private/admin/inquiries/${inquiryId}/respond`, responseData);
            return response;
        } catch (error) {
            console.error('Respond to inquiry error:', error);
            throw error;
        }
    },

    // ==================== Dashboard Stats ====================
    getStats: async () => {
        try {
            const response = await api.get('/api/private/admin/stats');
            return response;
        } catch (error) {
            console.error('Get stats error:', error);
            throw error;
        }
    }
};

// ==================== UTILITY FUNCTIONS ====================

// Check if user is authenticated
export const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    return !!token;
};

// Get current user from localStorage
export const getCurrentUser = () => {
    try {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
        console.error('Error parsing user from localStorage:', error);
        return null;
    }
};

// Set current user
export const setCurrentUser = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
};

// Clear all auth data
export const clearAuthData = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('verificationEmail');
    localStorage.removeItem('rememberEmail');
};

// Check if backend is running
export const checkBackendHealth = async () => {
    try {
        const response = await api.get('/health');
        return response.status === 200;
    } catch (error) {
        console.error('Backend health check failed:', error);
        return false;
    }
};

// Test API connection
export const testAPIConnection = async () => {
    try {
        const response = await api.get('/api/test');
        return {
            success: true,
            data: response.data,
            status: response.status
        };
    } catch (error) {
        return {
            success: false,
            error: error.message,
            status: error.response?.status
        };
    }
};

// Format error message
export const formatErrorMessage = (error) => {
    if (!error) return 'An unknown error occurred';

    if (error.response?.data) {
        const data = error.response.data;

        // Handle different error formats
        if (typeof data === 'string') return data;
        if (data.message) return data.message;
        if (data.error) return data.error;
        if (data.errors && Array.isArray(data.errors)) {
            return data.errors.join(', ');
        }
    }

    return error.message || 'An error occurred';
};

// Format price to AMD (Armenian Dram)
export const formatPriceAMD = (price) => {
    if (!price && price !== 0) return '֏0';
    return new Intl.NumberFormat('hy-AM', {
        style: 'currency',
        currency: 'AMD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(price);
};

// ==================== JWT UTILITY FUNCTIONS ====================

/**
 * Decode JWT token without verification
 * Only for client-side display purposes
 */
export const decodeJWT = (token) => {
    try {
        if (!token) return null;

        // Split the token into parts
        const parts = token.split('.');
        if (parts.length !== 3) {
            console.error('Invalid token format');
            return null;
        }

        // Decode the payload (second part)
        const payload = parts[1];

        // Base64 decode (handle URL-safe base64)
        const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
        const decodedPayload = decodeBase64(base64);

        // Parse JSON
        return JSON.parse(decodedPayload);
    } catch (error) {
        console.error('Error decoding JWT:', error);
        return null;
    }
};

/**
 * Base64 decode helper
 */
const decodeBase64 = (base64) => {
    try {
        // Try regular atob first
        return atob(base64);
    } catch (e) {
        // Handle Unicode characters
        const binaryString = atob(base64);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        return new TextDecoder().decode(bytes);
    }
};

/**
 * Check if token is expired
 */
export const isTokenExpired = (token) => {
    const payload = decodeJWT(token);
    if (!payload || !payload.exp) return true;

    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
};

/**
 * Get roles from token
 */
export const getRolesFromToken = (token) => {
    const payload = decodeJWT(token);
    return payload?.roles || [];
};

/**
 * Check if user has specific role
 */
export const hasRole = (token, role) => {
    const roles = getRolesFromToken(token);
    return roles.includes(role);
};

/**
 * Check if user is admin
 */
export const isAdmin = (token) => {
    return hasRole(token, 'ADMIN');
};

/**
 * Check if user is regular user
 */
export const isUser = (token) => {
    return hasRole(token, 'USER');
};

/**
 * Get user email from token
 */
export const getEmailFromToken = (token) => {
    const payload = decodeJWT(token);
    return payload?.sub || payload?.email || null;
};

/**
 * Get username from token
 */
export const getUsernameFromToken = (token) => {
    const payload = decodeJWT(token);
    return payload?.username || payload?.userName || null;
};

/**
 * Get token expiration time
 */
export const getTokenExpiration = (token) => {
    const payload = decodeJWT(token);
    return payload?.exp || null;
};

/**
 * Check if token is valid and not expired
 */
export const isValidToken = (token) => {
    if (!token) return false;
    return !isTokenExpired(token);
};

// ==================== CONVENIENCE EXPORTS ====================

// Authentication exports
export const login = authAPI.login;
export const logout = authAPI.logout;
export const signUp = authAPI.signUp;
export const verifyEmail = authAPI.verifyEmail;
export const forgotPassword = authAPI.forgotPassword;
export const resendVerification = authAPI.resendVerification;
export const getProfile = authAPI.getProfile;
export const updateProfile = authAPI.updateProfile;

// ==================== DEFAULT EXPORT ====================
const apiService = {
    api,

    // Auth
    authAPI,
    login,
    logout,
    signUp,
    verifyEmail,
    forgotPassword,
    resendVerification,
    getProfile,
    updateProfile,

    // Services
    serviceAPI,

    // Admin
    adminAPI,

    // Utilities
    isAuthenticated,
    getCurrentUser,
    setCurrentUser,
    clearAuthData,
    checkBackendHealth,
    testAPIConnection,
    formatErrorMessage,
    formatPriceAMD,

    // JWT Utilities
    decodeJWT,
    isTokenExpired,
    getRolesFromToken,
    hasRole,
    isAdmin,
    isUser,
    getEmailFromToken,
    getUsernameFromToken,
    getTokenExpiration,
    isValidToken
};

export default apiService;