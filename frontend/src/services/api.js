import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    withCredentials: true
});

export const authAPI = {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (userData) => api.post('/auth/register', userData),
    logout: () => api.post('/auth/logout'),
    verifySession: () => api.get('/auth/me'),
    updateProfile: (data) => api.put('/auth/profile', data),
};

export const expenseAPI = {
    getAll: () => api.get('/expenses'),
    create: (data) => api.post('/expenses', data),
    delete: (id) => api.delete(`/expenses/${id}`),
};

export default api;
