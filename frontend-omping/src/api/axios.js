/**
 * axios.js - Base Axios Instance untuk Rumah Makan Om Ping
 * File ini adalah referensi utama untuk memanggil API backend
 * 
 * Base URL: https://backendomping-production.up.railway.app
 * 
 * Contoh penggunaan:
 *   import api from '../api/axios';
 *   const response = await api.get('/get/menu');
 *   const data = response.data;
 */
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://backendomping-production.up.railway.app',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Interceptor untuk menangani error secara global
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error('API Error:', error.response.status, error.response.data);
    } else if (error.request) {
      console.error('Network Error: Server tidak merespons');
    } else {
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
