// src/services/serviceAPI.js

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

    // Get popular services (sorted by like count)
    getPopularServices: async (page = 0, size = 10) => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/services/popular?page=${page}&size=${size}`,
                { headers: getAuthHeaders() }
            );
            return response;
        } catch (error) {
            console.error('Get popular services error:', error);
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

    // Search services with full filtering support and sorting
    searchServices: async (searchParams) => {
        try {
            const params = {
                page: searchParams.page || 0,
                size: searchParams.size || 12
            };

            // Add search query if provided
            if (searchParams.query && searchParams.query.trim() !== '') {
                params.query = searchParams.query.trim();
            }

            // Add category filter if provided
            if (searchParams.category && searchParams.category !== '') {
                params.category = searchParams.category;
            }

            // Add location filter if provided
            if (searchParams.location && searchParams.location !== '') {
                params.location = searchParams.location;
            }

            // Add price filters if provided
            if (searchParams.minPrice !== undefined && searchParams.minPrice !== null && searchParams.minPrice !== '') {
                params.minPrice = parseFloat(searchParams.minPrice);
            }
            if (searchParams.maxPrice !== undefined && searchParams.maxPrice !== null && searchParams.maxPrice !== '') {
                params.maxPrice = parseFloat(searchParams.maxPrice);
            }

            // Add date filters if provided
            if (searchParams.startDateFrom) {
                params.startDateFrom = searchParams.startDateFrom;
            }
            if (searchParams.startDateTo) {
                params.startDateTo = searchParams.startDateTo;
            }

            // Add participants filter if provided
            if (searchParams.minParticipants) {
                params.minParticipants = searchParams.minParticipants;
            }

            // Add sorting parameters if provided
            // For All Services tab: sortBy: 'startDate', sortDirection: 'ASC'
            // For Popular tab: this is handled by getPopularServices method
            if (searchParams.sortBy) {
                params.sortBy = searchParams.sortBy;
                params.sortDirection = searchParams.sortDirection || 'ASC';
            }

            console.log('Searching services with params:', params);

            const response = await axios.post(
                `${API_BASE_URL}/services/search`,
                params,
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

    // Get all locations
    getLocations: async () => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/services/locations`,
                { headers: getAuthHeaders() }
            );
            return response;
        } catch (error) {
            console.error('Get locations error:', error);
            throw error;
        }
    },

    // ==================== Favorites / Likes ====================
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

// ==================== ADMIN API ====================
export const adminAPI = {
    getAllServices: async (page = 0, size = 20) => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/private/admin/services?page=${page}&size=${size}`,
                { headers: getAuthHeaders() }
            );
            return response;
        } catch (error) {
            console.error('Get all services error:', error);
            throw error;
        }
    },

    createService: async (serviceData, imageFiles = []) => {
        try {
            const formData = new FormData();

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
            if (serviceData.startDate) {
                formData.append('startDate', serviceData.startDate);
            }
            if (serviceData.startTime) {
                formData.append('startTime', serviceData.startTime);
            }

            imageFiles.forEach((file) => {
                formData.append('images', file);
            });

            const response = await axios.post(
                `${API_BASE_URL}/private/admin/services/with-images`,
                formData,
                {
                    headers: {
                        ...getAuthHeaders(),
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );
            return response;
        } catch (error) {
            console.error('Create service error:', error);
            throw error;
        }
    },

    updateService: async (serviceId, serviceData, imageFiles = [], existingImageUrls = []) => {
        try {
            const formData = new FormData();

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
            if (serviceData.startDate) {
                formData.append('startDate', serviceData.startDate);
            }
            if (serviceData.startTime) {
                formData.append('startTime', serviceData.startTime);
            }

            existingImageUrls.forEach((url) => {
                formData.append('existingImageUrls', url);
            });

            imageFiles.forEach((file) => {
                formData.append('images', file);
            });

            const response = await axios.put(
                `${API_BASE_URL}/private/admin/services/${serviceId}/with-images`,
                formData,
                {
                    headers: {
                        ...getAuthHeaders(),
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );
            return response;
        } catch (error) {
            console.error('Update service error:', error);
            throw error;
        }
    },

    deleteService: async (serviceId) => {
        try {
            const response = await axios.delete(
                `${API_BASE_URL}/private/admin/services/${serviceId}`,
                { headers: getAuthHeaders() }
            );
            return response;
        } catch (error) {
            console.error('Delete service error:', error);
            throw error;
        }
    },

    toggleAvailability: async (serviceId) => {
        try {
            const response = await axios.patch(
                `${API_BASE_URL}/private/admin/services/${serviceId}/toggle-availability`,
                {},
                { headers: getAuthHeaders() }
            );
            return response;
        } catch (error) {
            console.error('Toggle availability error:', error);
            throw error;
        }
    },

    getAllInquiries: async (page = 0, size = 20, status = null) => {
        try {
            const url = status
                ? `${API_BASE_URL}/private/admin/inquiries?page=${page}&size=${size}&status=${status}`
                : `${API_BASE_URL}/private/admin/inquiries?page=${page}&size=${size}`;
            const response = await axios.get(url, { headers: getAuthHeaders() });
            return response;
        } catch (error) {
            console.error('Get inquiries error:', error);
            throw error;
        }
    },

    respondToInquiry: async (inquiryId, responseData) => {
        try {
            const response = await axios.post(
                `${API_BASE_URL}/private/admin/inquiries/${inquiryId}/respond`,
                responseData,
                { headers: getAuthHeaders() }
            );
            return response;
        } catch (error) {
            console.error('Respond to inquiry error:', error);
            throw error;
        }
    },

    getStats: async () => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/private/admin/stats`,
                { headers: getAuthHeaders() }
            );
            return response;
        } catch (error) {
            console.error('Get stats error:', error);
            throw error;
        }
    }
};

// Default export for backward compatibility
const apiService = {
    ...serviceAPI,
    adminAPI,
    formatPriceAMD
};

export default apiService;