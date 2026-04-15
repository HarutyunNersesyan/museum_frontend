// src/services/adminAPI.js

import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/private/admin';

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
        try {
            const response = await axios.get(
                `${API_BASE_URL}/museums?page=${page}&size=${size}`,
                { headers: getAuthHeaders() }
            );
            return response;
        } catch (error) {
            console.error('Get all museums error:', error);
            throw error;
        }
    },

    getMuseumById: async (id) => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/museums/${id}`,
                { headers: getAuthHeaders() }
            );
            return response;
        } catch (error) {
            console.error('Get museum by ID error:', error);
            throw error;
        }
    },

    createMuseum: async (museumData) => {
        try {
            const response = await axios.post(
                `${API_BASE_URL}/museums`,
                museumData,
                { headers: getAuthHeaders() }
            );
            return response;
        } catch (error) {
            console.error('Create museum error:', error);
            throw error;
        }
    },

    updateMuseum: async (id, museumData) => {
        try {
            const response = await axios.put(
                `${API_BASE_URL}/museums/${id}`,
                museumData,
                { headers: getAuthHeaders() }
            );
            return response;
        } catch (error) {
            console.error('Update museum error:', error);
            throw error;
        }
    },

    deleteMuseum: async (id) => {
        try {
            const response = await axios.delete(
                `${API_BASE_URL}/museums/${id}`,
                { headers: getAuthHeaders() }
            );
            return response;
        } catch (error) {
            console.error('Delete museum error:', error);
            throw error;
        }
    }
};

// ==================== EVENT API ====================
export const adminEventAPI = {
    getAllEvents: async (page = 0, size = 20) => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/events?page=${page}&size=${size}`,
                { headers: getAuthHeaders() }
            );
            return response;
        } catch (error) {
            console.error('Get all events error:', error);
            throw error;
        }
    },

    getEventById: async (id) => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/events/${id}`,
                { headers: getAuthHeaders() }
            );
            return response;
        } catch (error) {
            console.error('Get event by ID error:', error);
            throw error;
        }
    },

    getEventsByMuseumId: async (museumId, page = 0, size = 20) => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/events/museum/${museumId}?page=${page}&size=${size}`,
                { headers: getAuthHeaders() }
            );
            return response;
        } catch (error) {
            console.error('Get events by museum ID error:', error);
            throw error;
        }
    },

    createEvent: async (eventData) => {
        try {
            const response = await axios.post(
                `${API_BASE_URL}/events`,
                eventData,
                { headers: getAuthHeaders() }
            );
            return response;
        } catch (error) {
            console.error('Create event error:', error);
            throw error;
        }
    },

    createEventWithImages: async (eventData, imageFiles = []) => {
        try {
            const formData = new FormData();

            // Add basic fields
            formData.append('name', eventData.name);
            formData.append('description', eventData.description);
            formData.append('eventCategory', eventData.eventCategory);
            formData.append('eventType', eventData.eventType);
            formData.append('eventDate', eventData.eventDate);
            formData.append('guidePrice', eventData.guidePrice.toString());
            formData.append('ticketPrice', eventData.ticketPrice.toString());
            formData.append('location', eventData.location);
            formData.append('museumId', eventData.museumId.toString());

            // Add optional fields
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

            // Add image files
            if (imageFiles && imageFiles.length > 0) {
                imageFiles.forEach(file => {
                    formData.append('images', file);
                });
            }

            // Debug logging
            console.log('Creating event with FormData:');
            for (let pair of formData.entries()) {
                console.log(pair[0] + ':', pair[1]);
            }

            const token = localStorage.getItem('token');
            const response = await axios.post(
                `${API_BASE_URL}/events/with-images`,
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                        // Do NOT set Content-Type - let browser set it with boundary
                    }
                }
            );
            return response;
        } catch (error) {
            console.error('Create event with images error:', error);
            console.error('Error response:', error.response?.data);
            throw error;
        }
    },

    updateEvent: async (id, eventData) => {
        try {
            const response = await axios.put(
                `${API_BASE_URL}/events/${id}`,
                eventData,
                { headers: getAuthHeaders() }
            );
            return response;
        } catch (error) {
            console.error('Update event error:', error);
            throw error;
        }
    },

    updateEventImages: async (eventId, imageUrls) => {
        try {
            const response = await axios.put(
                `${API_BASE_URL}/events/${eventId}/images`,
                { imageUrls },
                { headers: getAuthHeaders() }
            );
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

            const token = localStorage.getItem('token');
            const response = await axios.post(
                `${API_BASE_URL}/events/${eventId}/images`,
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            return response;
        } catch (error) {
            console.error('Upload event images error:', error);
            throw error;
        }
    },

    deleteEvent: async (id) => {
        try {
            const response = await axios.delete(
                `${API_BASE_URL}/events/${id}`,
                { headers: getAuthHeaders() }
            );
            return response;
        } catch (error) {
            console.error('Delete event error:', error);
            throw error;
        }
    }
};

// ==================== STATS API ====================
export const adminStatsAPI = {
    getDashboardStats: async () => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/stats`,
                { headers: getAuthHeaders() }
            );
            return response;
        } catch (error) {
            console.error('Get dashboard stats error:', error);
            throw error;
        }
    }
};

// ==================== COMBINED EXPORT for backward compatibility ====================
const adminAPI = {
    // Museum endpoints
    getAllMuseums: adminMuseumAPI.getAllMuseums,
    getMuseumById: adminMuseumAPI.getMuseumById,
    createMuseum: adminMuseumAPI.createMuseum,
    updateMuseum: adminMuseumAPI.updateMuseum,
    deleteMuseum: adminMuseumAPI.deleteMuseum,

    // Event endpoints
    getAllEvents: adminEventAPI.getAllEvents,
    getEventById: adminEventAPI.getEventById,
    getEventsByMuseumId: adminEventAPI.getEventsByMuseumId,
    createEvent: adminEventAPI.createEvent,
    createEventWithImages: adminEventAPI.createEventWithImages,
    updateEvent: adminEventAPI.updateEvent,
    updateEventImages: adminEventAPI.updateEventImages,
    uploadEventImages: adminEventAPI.uploadEventImages,
    deleteEvent: adminEventAPI.deleteEvent,

    // Stats endpoints
    getStats: adminStatsAPI.getDashboardStats
};

export default adminAPI;

// REMOVED the duplicate export line below
// The exports are already defined above with 'export const'