/**
 * Auth Controller - Rumah Makan Om Ping
 * Business logic untuk autentikasi
 */
import authService from '../services/authService';

const AUTH_STORAGE_KEY = 'omping_auth';

const AuthController = {
  /**
   * Handle login
   * Validasi input, panggil service, simpan ke localStorage
   * @param {string} username - Username
   * @param {string} password - Password
   * @returns {Promise<Object>} { success, data: { user, karyawan, role }, error }
   */
  handleLogin: async (username, password) => {
    try {
      // Validasi input
      if (!username || !username.trim()) {
        return { success: false, error: 'Username harus diisi' };
      }
      if (!password || !password.trim()) {
        return { success: false, error: 'Password harus diisi' };
      }

      // Panggil auth service
      const result = await authService.login(username.trim(), password);

      // Tentukan role dari Posisi_Karyawan
      const role = result.karyawan?.Posisi_Karyawan?.toLowerCase() || 'kasir';

      const authData = {
        user: result.user,
        karyawan: result.karyawan,
        role: role,
        loginTime: new Date().toISOString(),
      };

      // Simpan ke localStorage
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData));

      return {
        success: true,
        data: authData,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Gagal login',
      };
    }
  },

  /**
   * Handle logout
   * Hapus session dari localStorage
   */
  handleLogout: () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  },

  /**
   * Ambil data auth dari localStorage
   * @returns {Object|null} Data auth atau null jika belum login
   */
  getStoredAuth: () => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (!stored) return null;
      return JSON.parse(stored);
    } catch {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      return null;
    }
  },

  /**
   * Validasi apakah user memiliki role yang diperlukan
   * @param {string} currentRole - Role user saat ini
   * @param {string|string[]} requiredRole - Role yang diperlukan
   * @returns {boolean} true jika user memiliki role yang sesuai
   */
  validateRole: (currentRole, requiredRole) => {
    if (!currentRole) return false;

    // Owner bisa akses semua
    if (currentRole === 'owner') return true;

    // Jika requiredRole adalah array, cek apakah currentRole ada di dalamnya
    if (Array.isArray(requiredRole)) {
      return requiredRole.includes(currentRole);
    }

    return currentRole === requiredRole;
  },

  /**
   * Cek apakah session masih valid (belum expired)
   * @param {Object} authData - Data auth dari localStorage
   * @returns {boolean}
   */
  isSessionValid: (authData) => {
    if (!authData || !authData.loginTime) return false;

    // Session berlaku 24 jam
    const loginTime = new Date(authData.loginTime);
    const now = new Date();
    const hoursDiff = (now - loginTime) / (1000 * 60 * 60);

    return hoursDiff < 24;
  },
};

export default AuthController;
