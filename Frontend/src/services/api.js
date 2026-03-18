import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000'
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  const refreshToken = localStorage.getItem('refreshToken');
  if (token) config.headers['Authorization'] = `JWT ${token}`;
  if (refreshToken) config.headers['x-refresh-token'] = refreshToken;
  return config;
});

api.interceptors.response.use(
  (response) => {
    const newAccess = response.headers['x-access-token'];
    const newRefresh = response.headers['x-refresh-token'];
    if (newAccess) localStorage.setItem('token', newAccess);
    if (newRefresh) localStorage.setItem('refreshToken', newRefresh);
    return response;
  },
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const res = await axios.post(
            `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/auth/refresh`,
            { token: refreshToken }
          );
          localStorage.setItem('token', res.data.token);
          localStorage.setItem('refreshToken', res.data.refreshToken);
          original.headers['Authorization'] = `JWT ${res.data.token}`;
          return api(original);
        } catch {
          localStorage.clear();
          window.location.href = '/login';
        }
      } else {
        localStorage.clear();
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
