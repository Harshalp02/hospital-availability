import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://hospital-availability-server-production.up.railway.app',
});

instance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default instance;
