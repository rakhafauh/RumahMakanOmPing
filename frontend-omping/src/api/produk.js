/**
 * produk.js - Contoh file routing API untuk produk/menu
 * File ini adalah referensi/contoh utama
 * 
 * Daftar endpoint Menu:
 *   GET    /get/menu        - Ambil semua menu
 *   GET    /get/menu/:id    - Ambil menu berdasarkan ID
 *   POST   /create/menu     - Tambah menu baru
 *   PUT    /update/menu/:id - Update menu
 *   DELETE /delete/menu/:id - Hapus menu
 * 
 * Contoh penggunaan:
 *   import { getSemuaMenu, tambahMenu } from '../api/produk';
 *   const menus = await getSemuaMenu();
 */
import api from './axios';

// Ambil semua menu
export const getSemuaMenu = async () => {
  const response = await api.get('/get/menu');
  return response.data;
};

// Ambil menu berdasarkan ID
export const getMenuById = async (id) => {
  const response = await api.get(`/get/menu/${id}`);
  return response.data;
};

// Tambah menu baru
export const tambahMenu = async (data) => {
  // data = { Nama_Menu: string, Harga_Menu: number, Kategori_Menu: 'makanan'|'minuman' }
  const response = await api.post('/create/menu', data);
  return response.data;
};

// Update menu
export const updateMenu = async (id, data) => {
  const response = await api.put(`/update/menu/${id}`, data);
  return response.data;
};

// Hapus menu
export const hapusMenu = async (id) => {
  const response = await api.delete(`/delete/menu/${id}`);
  return response.data;
};
