/**
 * Payment Service - Rumah Makan Om Ping
 * Service untuk CRUD pembayaran (Bayar)
 */
import axiosInstance from '../config/axiosInstance';

const paymentService = {
  /**
   * Ambil semua data pembayaran (termasuk Pelanggan + Karyawan + Pesan)
   * @returns {Promise<Array>} Daftar pembayaran
   */
  getAll: async () => {
    try {
      const response = await axiosInstance.get('/get/bayar');
      return response.data;
    } catch (error) {
      console.error('Error mengambil data pembayaran:', error);
      throw new Error('Gagal mengambil data pembayaran');
    }
  },

  /**
   * Ambil pembayaran berdasarkan ID
   * @param {number} id - Id_Bayar
   * @returns {Promise<Object>} Data pembayaran
   */
  getById: async (id) => {
    try {
      const response = await axiosInstance.get(`/get/bayar/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error mengambil detail pembayaran:', error);
      throw new Error('Gagal mengambil detail pembayaran');
    }
  },

  /**
   * Buat pembayaran baru
   * @param {Object} data - { Tanggal_Bayar, Metode_Bayar, Grand_Bayar, Id_Pelanggan, Id_Karyawan, Id_Pesan }
   * @returns {Promise<Object>} Pembayaran yang baru dibuat
   */
  create: async (data) => {
    try {
      const response = await axiosInstance.post('/create/bayar', {
        Tanggal_Bayar: data.Tanggal_Bayar,
        Metode_Bayar: data.Metode_Bayar,
        Grand_Bayar: parseFloat(data.Grand_Bayar),
        Id_Pelanggan: data.Id_Pelanggan,
        Id_Karyawan: data.Id_Karyawan,
        Id_Pesan: data.Id_Pesan,
      });
      return response.data;
    } catch (error) {
      console.error('Error membuat pembayaran:', error);
      throw new Error('Gagal membuat pembayaran');
    }
  },

  /**
   * Update pembayaran
   * @param {number} id - Id_Bayar
   * @param {Object} data - Data yang akan diupdate
   * @returns {Promise<Object>} Pembayaran yang diupdate
   */
  update: async (id, data) => {
    try {
      const response = await axiosInstance.put(`/update/bayar/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error mengupdate pembayaran:', error);
      throw new Error('Gagal mengupdate pembayaran');
    }
  },

  /**
   * Hapus pembayaran
   * @param {number} id - Id_Bayar
   * @returns {Promise<Object>} Konfirmasi penghapusan
   */
  delete: async (id) => {
    try {
      const response = await axiosInstance.delete(`/delete/bayar/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error menghapus pembayaran:', error);
      throw new Error('Gagal menghapus pembayaran');
    }
  },
};

export default paymentService;
