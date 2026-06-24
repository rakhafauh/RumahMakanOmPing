/**
 * Axios instance terkonfigurasi untuk Rumah Makan Om Ping
 * Semua request API menggunakan instance ini
 */
import axios from 'axios';
import { BASE_URL } from './api';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // 15 detik timeout
});

// Interceptor request - bisa ditambahkan token auth di sini
axiosInstance.interceptors.request.use(
  (config) => {
    // Bisa tambahkan Authorization header jika diperlukan
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor response - handle error global
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server merespons dengan error status
      console.error('API Error:', error.response.status, error.response.data);
    } else if (error.request) {
      // Request dibuat tapi tidak ada respons
      console.error('Network Error: Tidak ada respons dari server');
    } else {
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
