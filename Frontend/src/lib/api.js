import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api', // Adjust if backend port changes
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        const refreshToken = localStorage.getItem('refreshToken');

        if (token) {
            config.headers.Authorization = `JWT ${token}`;
        }
        if (refreshToken) {
            config.headers['x-refresh-token'] = refreshToken;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => {
        const newAccessToken = response.headers['x-access-token'];
        const newRefreshToken = response.headers['x-refresh-token'];

        if (newAccessToken) {
            localStorage.setItem('token', newAccessToken);
        }
        if (newRefreshToken) {
            localStorage.setItem('refreshToken', newRefreshToken);
        }

        return response;
    },
    (error) => {
        // Handle global auth errors if needed
        return Promise.reject(error);
    }
);

export default api;
