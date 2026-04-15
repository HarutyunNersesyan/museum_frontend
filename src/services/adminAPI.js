// src/services/adminAPI.js
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api/private/admin';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
    };
};

// ==================== MUSEUM API ====================
export const adminMuseumAPI = {
    getAllMuseums: async (page = 0, size = 20) => {
        const response = await axios.get(
            `${API_BASE_URL}/museums?page=${page}&size=${size}`,
            { headers: getAuthHeaders() }
        );
        return response;
    },

    getMuseumById: async (id) => {
        const response = await axios.get(
            `${API_BASE_URL}/museums/${id}`,
            { headers: getAuthHeaders() }
        );
        return response;
    },

    createMuseum: async (museumData) => {
        const response = await axios.post(
            `${API_BASE_URL}/museums`,
            museumData,
            { headers: getAuthHeaders() }
        );
        return response;
    },

    updateMuseum: async (id, museumData) => {
        const response = await axios.put(
            `${API_BASE_URL}/museums/${id}`,
            museumData,
            { headers: getAuthHeaders() }
        );
        return response;
    },

    deleteMuseum: async (id) => {
        const response = await axios.delete(
            `${API_BASE_URL}/museums/${id}`,
            { headers: getAuthHeaders() }
        );
        return response;
    }
};

// ==================== EVENT API ====================
export const adminEventAPI = {
    getAllEvents: async (page = 0, size = 20) => {
        const response = await axios.get(
            `${API_BASE_URL}/events?page=${page}&size=${size}`,
            { headers: getAuthHeaders() }
        );
        return response;
    },

    getEventById: async (id) => {
        const response = await axios.get(
            `${API_BASE_URL}/events/${id}`,
            { headers: getAuthHeaders() }
        );
        return response;
    },

    getEventsByMuseumId: async (museumId, page = 0, size = 20) => {
        const response = await axios.get(
            `${API_BASE_URL}/events/museum/${museumId}?page=${page}&size=${size}`,
            { headers: getAuthHeaders() }
        );
        return response;
    },

    createEvent: async (eventData) => {
        const response = await axios.post(
            `${API_BASE_URL}/events`,
            eventData,
            { headers: getAuthHeaders() }
        );
        return response;
    },

    createEventWithImages: async (eventData, imageFiles = []) => {
        const formData = new FormData();

        // Basic fields
        formData.append('name', eventData.name);
        formData.append('description', eventData.description);
        formData.append('eventCategory', eventData.eventCategory);
        formData.append('eventType', eventData.eventType);
        formData.append('eventDate', eventData.eventDate);
        formData.append('guidePrice', eventData.guidePrice.toString());
        formData.append('ticketPrice', eventData.ticketPrice.toString());
        formData.append('location', eventData.location);
        formData.append('museumId', eventData.museumId.toString());

        // Optional fields
        if (eventData.duration) {
            formData.append('duration', eventData.duration.toString());
        }

        // Single phone number (not a list)
        if (eventData.phoneNumber) {
            formData.append('phoneNumber', eventData.phoneNumber);
        }

        if (eventData.contactEmail) {
            formData.append('contactEmail', eventData.contactEmail);
        }

        // Images
        if (imageFiles && imageFiles.length > 0) {
            imageFiles.forEach(file => {
                formData.append('images', file);
            });
        }

        const token = localStorage.getItem('token');
        const response = await axios.post(
            `${API_BASE_URL}/events/with-images`,
            formData,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        return response;
    },

    updateEvent: async (id, eventData) => {
        const response = await axios.put(
            `${API_BASE_URL}/events/${id}`,
            eventData,
            { headers: getAuthHeaders() }
        );
        return response;
    },

    updateEventWithImages: async (id, eventData, imageFiles = [], existingImageUrls = []) => {
        const formData = new FormData();

        // Basic fields
        formData.append('name', eventData.name);
        formData.append('description', eventData.description);
        formData.append('eventCategory', eventData.eventCategory);
        formData.append('eventType', eventData.eventType);
        formData.append('eventDate', eventData.eventDate);
        formData.append('guidePrice', eventData.guidePrice.toString());
        formData.append('ticketPrice', eventData.ticketPrice.toString());
        formData.append('location', eventData.location);
        formData.append('museumId', eventData.museumId.toString());

        // Optional fields
        if (eventData.duration) {
            formData.append('duration', eventData.duration.toString());
        }

        // Single phone number
        if (eventData.phoneNumber) {
            formData.append('phoneNumber', eventData.phoneNumber);
        }

        if (eventData.contactEmail) {
            formData.append('contactEmail', eventData.contactEmail);
        }

        // Existing images
        if (existingImageUrls && existingImageUrls.length > 0) {
            existingImageUrls.forEach(url => {
                formData.append('existingImageUrls', url);
            });
        }

        // New images
        if (imageFiles && imageFiles.length > 0) {
            imageFiles.forEach(file => {
                formData.append('images', file);
            });
        }

        const token = localStorage.getItem('token');
        const response = await axios.put(
            `${API_BASE_URL}/events/${id}/with-images`,
            formData,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        return response;
    },

    deleteEvent: async (id) => {
        const response = await axios.delete(
            `${API_BASE_URL}/events/${id}`,
            { headers: getAuthHeaders() }
        );
        return response;
    }
};

// ==================== STATS API ====================
export const adminStatsAPI = {
    getDashboardStats: async () => {
        const response = await axios.get(
            `${API_BASE_URL}/stats`,
            { headers: getAuthHeaders() }
        );
        return response;
    }
};

// Default export for backward compatibility
const adminAPI = {
    getAllMuseums: adminMuseumAPI.getAllMuseums,
    getMuseumById: adminMuseumAPI.getMuseumById,
    createMuseum: adminMuseumAPI.createMuseum,
    updateMuseum: adminMuseumAPI.updateMuseum,
    deleteMuseum: adminMuseumAPI.deleteMuseum,
    getAllEvents: adminEventAPI.getAllEvents,
    getEventById: adminEventAPI.getEventById,
    getEventsByMuseumId: adminEventAPI.getEventsByMuseumId,
    createEvent: adminEventAPI.createEvent,
    createEventWithImages: adminEventAPI.createEventWithImages,
    updateEvent: adminEventAPI.updateEvent,
    updateEventWithImages: adminEventAPI.updateEventWithImages,
    deleteEvent: adminEventAPI.deleteEvent,
    getStats: adminStatsAPI.getDashboardStats
};

export default adminAPI;