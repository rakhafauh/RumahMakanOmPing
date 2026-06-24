/**
 * User Service - Rumah Makan Om Ping
 * Service untuk CRUD User dan Karyawan
 */
import axiosInstance from '../config/axiosInstance';

const userService = {
  // ==================== USER ====================

  /**
   * Ambil semua user
   * @returns {Promise<Array>} Daftar user
   */
  getAllUsers: async () => {
    try {
      const response = await axiosInstance.get('/get/user');
      return response.data;
    } catch (error) {
      console.error('Error mengambil data user:', error);
      throw new Error('Gagal mengambil data user');
    }
  },

  /**
   * Buat user baru
   * @param {Object} data - { Nama_User, Password }
   * @returns {Promise<Object>} User yang baru dibuat
   */
  createUser: async (data) => {
    try {
      const response = await axiosInstance.post('/create/user', {
        Nama_User: data.Nama_User,
        Password: data.Password,
      });
      return response.data;
    } catch (error) {
      console.error('Error membuat user:', error);
      throw new Error('Gagal membuat user');
    }
  },

  /**
   * Update user
   * @param {number} id - Id_User
   * @param {Object} data - Data yang akan diupdate
   * @returns {Promise<Object>} User yang diupdate
   */
  updateUser: async (id, data) => {
    try {
      const response = await axiosInstance.put(`/update/user/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error mengupdate user:', error);
      throw new Error('Gagal mengupdate user');
    }
  },

  /**
   * Hapus user
   * @param {number} id - Id_User
   * @returns {Promise<Object>} Konfirmasi penghapusan
   */
  deleteUser: async (id) => {
    try {
      const response = await axiosInstance.delete(`/delete/user/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error menghapus user:', error);
      throw new Error('Gagal menghapus user');
    }
  },

  // ==================== KARYAWAN ====================

  /**
   * Ambil semua karyawan
   * @returns {Promise<Array>} Daftar karyawan
   */
  getAllKaryawan: async () => {
    try {
      const response = await axiosInstance.get('/get/karyawan');
      return response.data;
    } catch (error) {
      console.error('Error mengambil data karyawan:', error);
      throw new Error('Gagal mengambil data karyawan');
    }
  },

  /**
   * Ambil karyawan berdasarkan ID
   * @param {number} id - Id_Karyawan
   * @returns {Promise<Object>} Data karyawan
   */
  getKaryawanById: async (id) => {
    try {
      const response = await axiosInstance.get(`/get/karyawan/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error mengambil detail karyawan:', error);
      throw new Error('Gagal mengambil detail karyawan');
    }
  },

  /**
   * Buat karyawan baru
   * @param {Object} data - { Id_User, Nama_Karyawan, Posisi_Karyawan, No_Hp_Karyawan }
   * @returns {Promise<Object>} Karyawan yang baru dibuat
   */
  createKaryawan: async (data) => {
    try {
      const response = await axiosInstance.post('/create/karyawan', {
        Id_User: data.Id_User,
        Nama_Karyawan: data.Nama_Karyawan,
        Posisi_Karyawan: data.Posisi_Karyawan,
        No_Hp_Karyawan: Number(data.No_Hp_Karyawan),
      });
      return response.data;
    } catch (error) {
      console.error('Error membuat karyawan:', error);
      throw new Error('Gagal membuat karyawan');
    }
  },

  /**
   * Update karyawan
   * @param {number} id - Id_Karyawan
   * @param {Object} data - Data yang akan diupdate
   * @returns {Promise<Object>} Karyawan yang diupdate
   */
  updateKaryawan: async (id, data) => {
    try {
      const response = await axiosInstance.put(
        `/update/karyawan/${id}`,
        data
      );
      return response.data;
    } catch (error) {
      console.error('Error mengupdate karyawan:', error);
      throw new Error('Gagal mengupdate karyawan');
    }
  },

  /**
   * Hapus karyawan
   * @param {number} id - Id_Karyawan
   * @returns {Promise<Object>} Konfirmasi penghapusan
   */
  deleteKaryawan: async (id) => {
    try {
      const response = await axiosInstance.delete(
        `/delete/karyawan/${id}`
      );
      return response.data;
    } catch (error) {
      console.error('Error menghapus karyawan:', error);
      throw new Error('Gagal menghapus karyawan');
    }
  },
};

export default userService;
