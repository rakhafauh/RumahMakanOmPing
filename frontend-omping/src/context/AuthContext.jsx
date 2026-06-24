/**
 * AuthContext - Rumah Makan Om Ping
 * Context untuk manajemen autentikasi (login/logout)
 * Menyimpan data user dan karyawan ke localStorage
 */
import React, { createContext, useState, useEffect, useCallback } from 'react';
import authService from '../services/authService';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [karyawan, setKaryawan] = useState(null);
  const [loading, setLoading] = useState(true);

  // Muat data dari localStorage saat pertama kali
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('omping_user');
      const storedKaryawan = localStorage.getItem('omping_karyawan');
      if (storedUser && storedKaryawan) {
        setUser(JSON.parse(storedUser));
        setKaryawan(JSON.parse(storedKaryawan));
      }
    } catch (err) {
      console.error('Error membaca auth dari localStorage:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Login - panggil authService lalu simpan ke state & localStorage
   * @param {string} username
   * @param {string} password
   * @returns {string} role (posisi karyawan)
   */
  const login = useCallback(async (username, password) => {
    const result = await authService.login(username, password);
    setUser(result.user);
    setKaryawan(result.karyawan);
    localStorage.setItem('omping_user', JSON.stringify(result.user));
    localStorage.setItem('omping_karyawan', JSON.stringify(result.karyawan));
    return result.karyawan.Posisi_Karyawan;
  }, []);

  /**
   * Logout - hapus state & localStorage
   */
  const logout = useCallback(() => {
    setUser(null);
    setKaryawan(null);
    localStorage.removeItem('omping_user');
    localStorage.removeItem('omping_karyawan');
  }, []);

  // Role shortcut
  const role = karyawan?.Posisi_Karyawan || null;
  const isAuthenticated = !!user && !!karyawan;

  const value = {
    user,
    karyawan,
    role,
    isAuthenticated,
    loading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook useAuth - akses AuthContext dari komponen manapun
 */
export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth harus digunakan di dalam AuthProvider');
  }
  return context;
}

export default AuthContext;
