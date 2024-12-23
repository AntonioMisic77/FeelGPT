// src/api/axiosInstance.js
import axios from "axios";
import Cookies from 'js-cookie';

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5001/api/v1";

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
});

axiosInstance.interceptors.request.use(
    async (config) => {
        let token = localStorage.getItem("authToken") || Cookies.get('authToken');

        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        } else {
            try {
                const response = await axiosInstance.get("/verify");
                if (response.data && response.data.token) {
                    token = response.data.token;
                    localStorage.setItem("authToken", token);
                    Cookies.set('authToken', token, { expires: 10 });
                    config.headers["Authorization"] = `Bearer ${token}`;
                }
            } catch (error) {
                window.location.href = "/login";
                return Promise.reject(error);
            }
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        const originalRequest = error.config;

        if (
            error.response &&
            error.response.status === 401 &&
            !originalRequest._retry &&
            !originalRequest.url.endsWith('/login') &&
            !originalRequest.url.endsWith('/verify')
        ) {
            originalRequest._retry = true;
            localStorage.removeItem("authToken");
            Cookies.remove('authToken');

            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
