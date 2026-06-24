/**
 * Auth Service - Rumah Makan Om Ping
 * Service untuk autentikasi pengguna (login)
 */
import axiosInstance from '../config/axiosInstance';

const authService = {
  /**
   * Login pengguna
   * @param {string} username - Nama_User
   * @param {string} password - Password
   * @returns {Promise<{user: Object, karyawan: Object}>}
   */
  login: async (username, password) => {
    try {
      // === MODE API ===
      const response = await axiosInstance.post('/login', {
        Nama_User: username,
        Password: password,
      });

      const apiData = response.data.data;
      return {
        user: {
          Id_User: apiData.Id_User,
          Nama_User: apiData.Nama_User,
        },
        karyawan: {
          Id_Karyawan: apiData.Id_Karyawan,
          Nama_Karyawan: apiData.Nama_Karyawan,
          Posisi_Karyawan: apiData.Posisi_Karyawan,
          No_Hp_Karyawan: apiData.No_Hp_Karyawan,
        },
      };
    } catch (error) {
      // Error dari API
      const message =
        error.response?.data?.error ||
        error.response?.data?.message ||
        'Gagal login. Silakan coba lagi.';
      throw new Error(message);
    }
  },
};

export default authService;
