import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/private/admin';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        ...(token && { 'Authorization': `Bearer ${token}` })
    };
};

const getJsonHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
    };
};

export const adminAPI = {
    // Service Management
    getAllServices: async (page = 0, size = 20) => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/services?page=${page}&size=${size}`,
                { headers: getJsonHeaders() }
            );
            return response;
        } catch (error) {
            console.error('Get all services error:', error);
            throw error;
        }
    },

    // Create service with image upload - UPDATED with date/time
    createService: async (serviceData, imageFiles = []) => {
        try {
            const formData = new FormData();

            // Add each field individually (not as JSON)
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

            const response = await axios.post(
                `${API_BASE_URL}/services/with-images`,
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

            const response = await axios.put(
                `${API_BASE_URL}/services/${serviceId}/with-images`,
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
                `${API_BASE_URL}/services/${serviceId}`,
                { headers: getJsonHeaders() }
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
                `${API_BASE_URL}/services/${serviceId}/toggle-availability`,
                {},
                { headers: getJsonHeaders() }
            );
            return response;
        } catch (error) {
            console.error('Toggle availability error:', error);
            throw error;
        }
    },

    // Inquiry Management
    getAllInquiries: async (page = 0, size = 20, status = null) => {
        try {
            const url = status
                ? `${API_BASE_URL}/inquiries?page=${page}&size=${size}&status=${status}`
                : `${API_BASE_URL}/inquiries?page=${page}&size=${size}`;
            const response = await axios.get(url, { headers: getJsonHeaders() });
            return response;
        } catch (error) {
            console.error('Get inquiries error:', error);
            throw error;
        }
    },

    respondToInquiry: async (inquiryId, responseData) => {
        try {
            const response = await axios.post(
                `${API_BASE_URL}/inquiries/${inquiryId}/respond`,
                responseData,
                { headers: getJsonHeaders() }
            );
            return response;
        } catch (error) {
            console.error('Respond to inquiry error:', error);
            throw error;
        }
    },

    // Dashboard Stats
    getStats: async () => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/stats`,
                { headers: getJsonHeaders() }
            );
            return response;
        } catch (error) {
            console.error('Get stats error:', error);
            throw error;
        }
    }
};

export default adminAPI;