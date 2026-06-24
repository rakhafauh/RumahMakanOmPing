/**
 * Customer Service - Rumah Makan Om Ping
 * Service untuk CRUD data pelanggan
 * NOTE: Membuat pelanggan baru otomatis membuat record Daftar di backend
 */
import axiosInstance from '../config/axiosInstance';

const customerService = {
  /**
   * Ambil semua pelanggan
   * @returns {Promise<Array>} Daftar pelanggan
   */
  getAll: async () => {
    try {
      const response = await axiosInstance.get('/get/pelanggan');
      return response.data;
    } catch (error) {
      console.error('Error mengambil data pelanggan:', error);
      throw new Error('Gagal mengambil data pelanggan');
    }
  },

  /**
   * Ambil pelanggan berdasarkan ID
   * @param {number} id - Id_pelanggan
   * @returns {Promise<Object>} Data pelanggan
   */
  getById: async (id) => {
    try {
      const response = await axiosInstance.get(`/get/pelanggan/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error mengambil detail pelanggan:', error);
      throw new Error('Gagal mengambil detail pelanggan');
    }
  },

  /**
   * Buat pelanggan baru
   * NOTE: Backend otomatis membuat record Daftar
   * @param {Object} data - { Nama_Pelanggan, No_Hp, Tanggal_Registrasi }
   * @returns {Promise<Object>} Pelanggan yang baru dibuat
   */
  create: async (data) => {
    try {
      const response = await axiosInstance.post('/create/pelanggan', {
        Nama_Pelanggan: data.Nama_Pelanggan,
        No_Hp: Number(data.No_Hp),
        Tanggal_Registrasi:
          data.Tanggal_Registrasi ||
          new Date().toISOString().split('T')[0],
      });
      return response.data;
    } catch (error) {
      console.error('Error membuat pelanggan:', error);
      throw new Error('Gagal membuat pelanggan');
    }
  },

  /**
   * Update data pelanggan
   * @param {number} id - Id_pelanggan
   * @param {Object} data - Data yang akan diupdate
   * @returns {Promise<Object>} Pelanggan yang diupdate
   */
  update: async (id, data) => {
    try {
      const response = await axiosInstance.put(
        `/update/pelanggan/${id}`,
        data
      );
      return response.data;
    } catch (error) {
      console.error('Error mengupdate pelanggan:', error);
      throw new Error('Gagal mengupdate pelanggan');
    }
  },

  /**
   * Hapus pelanggan
   * @param {number} id - Id_pelanggan
   * @returns {Promise<Object>} Konfirmasi penghapusan
   */
  delete: async (id) => {
    try {
      const response = await axiosInstance.delete(
        `/delete/pelanggan/${id}`
      );
      return response.data;
    } catch (error) {
      console.error('Error menghapus pelanggan:', error);
      throw new Error('Gagal menghapus pelanggan');
    }
  },

  /**
   * Cari pelanggan berdasarkan nama atau no HP
   * @param {string} query - Kata kunci pencarian
   * @returns {Promise<Array>} Daftar pelanggan yang cocok
   */
  search: async (query) => {
    try {
      // API mode: gunakan getAll lalu filter di client
      const response = await axiosInstance.get('/get/pelanggan');
      const lowerQuery = query.toLowerCase();
      return response.data.filter(
        (c) =>
          c.Nama_Pelanggan.toLowerCase().includes(lowerQuery) ||
          String(c.No_Hp).includes(query)
      );
    } catch (error) {
      console.error('Error mencari pelanggan:', error);
      throw new Error('Gagal mencari pelanggan');
    }
  },
};

export default customerService;
