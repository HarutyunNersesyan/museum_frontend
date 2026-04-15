// src/services/eventAPI.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
    };
};

const eventAPI = {
    getAllEvents: async (page = 0, size = 10, sortBy = 'eventDate', direction = 'asc') => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/api/public/events?page=${page}&size=${size}&sortBy=${sortBy}&direction=${direction}`,
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
                `${API_BASE_URL}/api/public/events/${id}`,
                { headers: getAuthHeaders() }
            );
            return response;
        } catch (error) {
            console.error('Get event by ID error:', error);
            throw error;
        }
    },

    getEventsByMuseumId: async (museumId, page = 0, size = 10) => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/api/public/events/museum/${museumId}?page=${page}&size=${size}`,
                { headers: getAuthHeaders() }
            );
            return response;
        } catch (error) {
            console.error('Get events by museum error:', error);
            throw error;
        }
    },

    getUpcomingEvents: async (page = 0, size = 10) => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/api/public/events/upcoming?page=${page}&size=${size}`,
                { headers: getAuthHeaders() }
            );
            return response;
        } catch (error) {
            console.error('Get upcoming events error:', error);
            throw error;
        }
    }
};

export default eventAPI;