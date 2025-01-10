// src/api/axiosInstance.js

import axios from "axios";
import Cookies from "js-cookie"; // Import js-cookie

// Base URL for the API
const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5001/api/v1";

// Create an Axios instance
const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    // Uncomment the next line if your backend requires credentials (cookies) to be sent with requests
    // withCredentials: true,
});

// Request interceptor to add the Authorization header
axiosInstance.interceptors.request.use(
    (config) => {
        const token = Cookies.get("authToken"); // Retrieve token from cookies

        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle unauthorized errors
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        const originalRequest = error.config;

        if (
            error.response &&
            error.response.status === 401 &&
            !originalRequest.url.endsWith('login')
        ) {
            Cookies.remove("authToken", { path: '/' }); // Remove token from cookies
            window.location.href = "/login"; // Redirect to login page
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
