import axios from 'axios';

const API_URL = 'http://localhost:5000/api/projects';

// Helper function to grab the Keycard and tape it to the request header
const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        headers: { Authorization: `Bearer ${token}` }
    };
};

export const apiService = {
    getAll: async () => {
        // Notice how we pass getAuthHeaders() as the configuration object!
        const response = await axios.get(API_URL, getAuthHeaders());
        return response.data;
    },

    create: async (name) => {
        const response = await axios.post(API_URL, { name }, getAuthHeaders());
        return response.data;
    },

    update: async (id, name,status) => {
        const response = await axios.put(`${API_URL}/${id}`, { name,status }, getAuthHeaders());
        return response.data;
    },

    delete: async (id) => {
        await axios.delete(`${API_URL}/${id}`, getAuthHeaders());
    },

    // NEW: Fetch all users (Admins only!)
    getUsers: async () => {
        const response = await axios.get('http://localhost:5000/api/users', getAuthHeaders());
        return response.data;
    }
};