// src/services/bookingAPI.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

const bookingAPI = {
    createBooking: async (bookingData) => {
        try {
            const response = await axios.post(
                `${API_BASE_URL}/api/public/bookings/create`,
                bookingData,
                { headers: { 'Content-Type': 'application/json' } }
            );
            return response;
        } catch (error) {
            console.error('Create booking error:', error);
            throw error;
        }
    }
};

export default bookingAPI;