import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:9000',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response) {
            console.error('Error response:', error.response);
        } else if (error.request) {
            console.error('Error request:', error.request);
        } else {
            console.error('Error message:', error.message);
        }
        return Promise.reject(error);
    }
);

export default axiosInstance; 