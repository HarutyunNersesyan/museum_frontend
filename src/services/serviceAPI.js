import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
    };
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

// ==================== SERVICE API ====================
export const serviceAPI = {
    // Get all available services
    getAllServices: async (page = 0, size = 20) => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/services?page=${page}&size=${size}`,
                { headers: getAuthHeaders() }
            );
            return response;
        } catch (error) {
            console.error('Get all services error:', error);
            throw error;
        }
    },

    // Get service by ID
    getServiceById: async (serviceId) => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/services/${serviceId}`,
                { headers: getAuthHeaders() }
            );
            return response;
        } catch (error) {
            console.error('Get service by ID error:', error);
            throw error;
        }
    },

    // Search services
    searchServices: async (searchParams) => {
        try {
            const response = await axios.post(
                `${API_BASE_URL}/services/search`,
                searchParams,
                { headers: getAuthHeaders() }
            );
            return response;
        } catch (error) {
            console.error('Search services error:', error);
            throw error;
        }
    },

    // Get all categories
    getCategories: async () => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/services/categories`,
                { headers: getAuthHeaders() }
            );
            return response;
        } catch (error) {
            console.error('Get categories error:', error);
            throw error;
        }
    },

    // ==================== Favorites ====================
    addToFavorites: async (serviceId) => {
        try {
            const response = await axios.post(
                `${API_BASE_URL}/services/${serviceId}/favorite`,
                {},
                { headers: getAuthHeaders() }
            );
            return response;
        } catch (error) {
            console.error('Add to favorites error:', error);
            throw error;
        }
    },

    removeFromFavorites: async (serviceId) => {
        try {
            const response = await axios.delete(
                `${API_BASE_URL}/services/${serviceId}/favorite`,
                { headers: getAuthHeaders() }
            );
            return response;
        } catch (error) {
            console.error('Remove from favorites error:', error);
            throw error;
        }
    },

    getFavorites: async (page = 0, size = 20) => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/services/favorites?page=${page}&size=${size}`,
                { headers: getAuthHeaders() }
            );
            return response;
        } catch (error) {
            console.error('Get favorites error:', error);
            throw error;
        }
    },

    isFavorited: async (serviceId) => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/services/${serviceId}/favorite/check`,
                { headers: getAuthHeaders() }
            );
            return response;
        } catch (error) {
            console.error('Check favorite status error:', error);
            throw error;
        }
    },

    getFavoriteCount: async (serviceId) => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/services/${serviceId}/favorite/count`,
                { headers: getAuthHeaders() }
            );
            return response;
        } catch (error) {
            console.error('Get favorite count error:', error);
            throw error;
        }
    },

    // ==================== Cart ====================
    addToCart: async (serviceId, quantity = 1) => {
        try {
            const response = await axios.post(
                `${API_BASE_URL}/services/cart/${serviceId}?quantity=${quantity}`,
                {},
                { headers: getAuthHeaders() }
            );
            return response;
        } catch (error) {
            console.error('Add to cart error:', error);
            throw error;
        }
    },

    removeFromCart: async (serviceId) => {
        try {
            const response = await axios.delete(
                `${API_BASE_URL}/services/cart/${serviceId}`,
                { headers: getAuthHeaders() }
            );
            return response;
        } catch (error) {
            console.error('Remove from cart error:', error);
            throw error;
        }
    },

    updateCartQuantity: async (serviceId, quantity) => {
        try {
            const response = await axios.put(
                `${API_BASE_URL}/services/cart/${serviceId}?quantity=${quantity}`,
                {},
                { headers: getAuthHeaders() }
            );
            return response;
        } catch (error) {
            console.error('Update cart quantity error:', error);
            throw error;
        }
    },

    getCart: async () => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/services/cart`,
                { headers: getAuthHeaders() }
            );
            return response;
        } catch (error) {
            console.error('Get cart error:', error);
            throw error;
        }
    },

    getCartTotal: async () => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/services/cart/total`,
                { headers: getAuthHeaders() }
            );
            return response;
        } catch (error) {
            console.error('Get cart total error:', error);
            throw error;
        }
    },

    clearCart: async () => {
        try {
            const response = await axios.delete(
                `${API_BASE_URL}/services/cart`,
                { headers: getAuthHeaders() }
            );
            return response;
        } catch (error) {
            console.error('Clear cart error:', error);
            throw error;
        }
    },

    // ==================== Inquiries ====================
    sendInquiry: async (serviceId, inquiryData) => {
        try {
            const response = await axios.post(
                `${API_BASE_URL}/services/${serviceId}/inquiry`,
                inquiryData,
                { headers: getAuthHeaders() }
            );
            return response;
        } catch (error) {
            console.error('Send inquiry error:', error);
            throw error;
        }
    },

    getUserInquiries: async (page = 0, size = 20) => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/services/inquiries?page=${page}&size=${size}`,
                { headers: getAuthHeaders() }
            );
            return response;
        } catch (error) {
            console.error('Get inquiries error:', error);
            throw error;
        }
    }
};

export default serviceAPI;