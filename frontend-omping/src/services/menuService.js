/**
 * Menu Service - Rumah Makan Om Ping
 * Service untuk CRUD data menu makanan & minuman
 */
import axiosInstance from '../config/axiosInstance';

const menuService = {
  /**
   * Ambil semua menu
   * @returns {Promise<Array>} Daftar menu
   */
  getAll: async () => {
    try {
      const response = await axiosInstance.get('/get/menu');
      return response.data;
    } catch (error) {
      console.error('Error mengambil data menu:', error);
      throw new Error('Gagal mengambil data menu');
    }
  },

  /**
   * Ambil menu berdasarkan ID
   * @param {number} id - Id_Menu
   * @returns {Promise<Object>} Data menu
   */
  getById: async (id) => {
    try {
      const response = await axiosInstance.get(`/get/menu/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error mengambil detail menu:', error);
      throw new Error('Gagal mengambil detail menu');
    }
  },

  /**
   * Tambah menu baru
   * @param {Object} data - { Nama_Menu, Harga_Menu, Kategori_Menu }
   * @returns {Promise<Object>} Menu yang baru dibuat
   */
  create: async (data) => {
    try {
      const response = await axiosInstance.post('/create/menu', {
        Nama_Menu: data.Nama_Menu,
        Harga_Menu: parseFloat(data.Harga_Menu),
        Kategori_Menu: data.Kategori_Menu,
        Gambar_Menu: data.Gambar_Menu,
      });
      return response.data;

    } catch (error) {
      console.error('Error menambah menu:', error);
      throw new Error('Gagal menambah menu');
    }
  },

  /**
   * Update menu
   * @param {number} id - Id_Menu
   * @param {Object} data - Data yang akan diupdate
   * @returns {Promise<Object>} Menu yang diupdate
   */
  update: async (id, data) => {
    try {
      const response = await axiosInstance.put(`/update/menu/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error mengupdate menu:', error);
      throw new Error('Gagal mengupdate menu');
    }
  },

  /**
   * Hapus menu
   * @param {number} id - Id_Menu
   * @returns {Promise<Object>} Konfirmasi penghapusan
   */
  delete: async (id) => {
    try {
      const response = await axiosInstance.delete(`/delete/menu/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error menghapus menu:', error);
      throw new Error('Gagal menghapus menu');
    }
  },
};

export default menuService;
