import axios from "axios";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

// Додаємо інтерцептор перед відправкою кожного запиту
axios.interceptors.request.use(config => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

export default {
    async get(url, signal) {
        try {
            const response = await axios.get(baseUrl + url, {signal: signal});
            return response.data;
        } catch (error) {
            if (error.response) {
                if (error.response.status === 401) {
                    throw new Error('AuthError');
                } else {
                    throw new Error(error.response.data.error);
                }
            } else {
                throw new Error(error.message);
            }
        }
    },
    async post(url, data, signal) {
        try {
            const response = await axios.post(baseUrl + url, data, {signal: signal});
            return response.data;
        } catch (error) {
            if (error.response) {
                if (error.response.status === 401) {
                    throw new Error('AuthError');
                } else {
                    throw new Error(error.response.data.error);
                }
            } else {
                throw new Error(error.message);
            }
        }
    },
    async delete(url, signal) {
        try {
            const response = await axios.delete(baseUrl + url, {signal: signal});
            return response.data;
        } catch (error) {
            if (error.response) {
                if (error.response.status === 401) {
                    throw new Error('AuthError');
                } else {
                    throw new Error(error.response.data.error);
                }
            } else {
                throw new Error(error.message);
            }
        }

    },
    async put(url, data, signal) {
        try {
            const response = await axios.put(baseUrl + url, data, {signal: signal});
            return response.data;
        } catch (error) {
            if (error.response) {
                if (error.response.status === 401) {
                    throw new Error('AuthError');
                } else {
                    throw new Error(error.response.data.error);
                }
            } else {
                throw new Error(error.message);
            }
        }
    },
};