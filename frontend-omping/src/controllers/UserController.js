/**
 * User Controller - Rumah Makan Om Ping
 * Business logic untuk manajemen user & karyawan
 */
import userService from '../services/userService';
import { ROLES } from '../config/api';

const UserController = {
  /**
   * Buat staff baru (User + Karyawan sekaligus)
   * 1. Buat User (akun login)
   * 2. Buat Karyawan (data profil + posisi)
   * 
   * @param {Object} userData - { username, password, namaKaryawan, posisi, noHp }
   * @returns {Promise<Object>} { success, data: { user, karyawan }, error }
   */
  createStaffUser: async (userData) => {
    try {
      // Validasi data
      const validation = UserController.validateUserData(userData);
      if (!validation.valid) {
        return { success: false, errors: validation.errors };
      }

      // Step 1: Buat User
      const user = await userService.createUser({
        Nama_User: userData.username.trim(),
        Password: userData.password,
      });

      // Step 2: Buat Karyawan dengan Id_User dari user yang baru dibuat
      const karyawan = await userService.createKaryawan({
        Id_User: user.Id_User,
        Nama_Karyawan: userData.namaKaryawan.trim(),
        Posisi_Karyawan: userData.posisi,
        No_Hp_Karyawan: userData.noHp,
      });

      return {
        success: true,
        data: { user, karyawan },
      };
    } catch (error) {
      console.error('Error membuat staff:', error);
      return {
        success: false,
        error: error.message || 'Gagal membuat akun staff',
      };
    }
  },

  /**
   * Hapus staff (User + Karyawan)
   * @param {number} userId - Id_User
   * @param {number} karyawanId - Id_Karyawan
   * @returns {Promise<Object>} { success, error }
   */
  deleteStaffUser: async (userId, karyawanId) => {
    try {
      // Hapus karyawan dulu (karena ada FK ke User)
      if (karyawanId) {
        await userService.deleteKaryawan(karyawanId);
      }

      // Hapus user
      if (userId) {
        await userService.deleteUser(userId);
      }

      return { success: true };
    } catch (error) {
      console.error('Error menghapus staff:', error);
      return {
        success: false,
        error: error.message || 'Gagal menghapus akun staff',
      };
    }
  },

  /**
   * Validasi data user/karyawan
   * @param {Object} data - { username, password, namaKaryawan, posisi, noHp }
   * @returns {{ valid: boolean, errors: Object }}
   */
  validateUserData: (data) => {
    const errors = {};

    // Validasi username
    if (!data.username || !data.username.trim()) {
      errors.username = 'Username harus diisi';
    } else if (data.username.trim().length < 3) {
      errors.username = 'Username minimal 3 karakter';
    } else if (/\s/.test(data.username.trim())) {
      errors.username = 'Username tidak boleh mengandung spasi';
    }

    // Validasi password
    if (!data.password) {
      errors.password = 'Password harus diisi';
    } else if (data.password.length < 6) {
      errors.password = 'Password minimal 6 karakter';
    }

    // Validasi nama karyawan
    if (!data.namaKaryawan || !data.namaKaryawan.trim()) {
      errors.namaKaryawan = 'Nama karyawan harus diisi';
    }

    // Validasi posisi
    const validPositions = Object.values(ROLES);
    if (!data.posisi) {
      errors.posisi = 'Posisi harus dipilih';
    } else if (!validPositions.includes(data.posisi)) {
      errors.posisi = `Posisi harus salah satu dari: ${validPositions.join(', ')}`;
    }

    // Validasi no HP (opsional tapi jika diisi harus valid)
    if (data.noHp && isNaN(data.noHp)) {
      errors.noHp = 'Nomor HP harus berupa angka';
    }

    return {
      valid: Object.keys(errors).length === 0,
      errors,
    };
  },

  /**
   * Ambil daftar staff (gabungan User + Karyawan)
   * @returns {Promise<Array>} Daftar staff dengan data lengkap
   */
  getStaffList: async () => {
    try {
      const [users, karyawanList] = await Promise.all([
        userService.getAllUsers(),
        userService.getAllKaryawan(),
      ]);

      // Gabungkan data user dan karyawan
      return karyawanList.map((k) => {
        const user = users.find((u) => u.Id_User === k.Id_User);
        return {
          ...k,
          Nama_User: user?.Nama_User || '-',
        };
      });
    } catch (error) {
      console.error('Error mengambil daftar staff:', error);
      throw new Error('Gagal mengambil daftar staff');
    }
  },
};

export default UserController;
