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
                window.location.href = '/'; // Redirect to home
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

// ==================== CONVENIENCE FUNCTIONS ====================

// Authentication exports
export const login = authAPI.login;
export const logout = authAPI.logout;
export const signUp = authAPI.signUp;
export const verifyEmail = authAPI.verifyEmail;
export const forgotPassword = authAPI.forgotPassword;
export const resendVerification = authAPI.resendVerification;
export const getProfile = authAPI.getProfile;
export const updateProfile = authAPI.updateProfile;

/**
 * JWT Utility Functions
 * For client-side token decoding (not verification)
 */

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

// ==================== CREATE DEFAULT EXPORT OBJECT ====================
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

    // Utilities
    isAuthenticated,
    getCurrentUser,
    setCurrentUser,
    clearAuthData,
    checkBackendHealth,
    testAPIConnection,
    formatErrorMessage,

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