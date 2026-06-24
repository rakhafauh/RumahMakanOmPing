/**
 * NotificationContext - Rumah Makan Om Ping
 * Context untuk manajemen notifikasi toast global
 */
import React, { createContext, useState, useCallback } from 'react';

export const NotificationContext = createContext(null);

let toastIdCounter = 0;

export function NotificationProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  /**
   * Tambah toast baru
   * @param {string} type - 'success' | 'error' | 'warning' | 'info'
   * @param {string} message - Pesan notifikasi
   * @param {string} title - Judul notifikasi (opsional)
   * @param {number} duration - Durasi tampil dalam ms (default 4000)
   */
  const addToast = useCallback((type, message, title = '', duration = 4000) => {
    const id = ++toastIdCounter;
    setToasts((prev) => [...prev, { id, type, message, title, duration }]);
    return id;
  }, []);

  /**
   * Hapus toast berdasarkan ID
   */
  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Shortcut methods
  const success = useCallback((msg, title) => addToast('success', msg, title), [addToast]);
  const error = useCallback((msg, title) => addToast('error', msg, title), [addToast]);
  const warning = useCallback((msg, title) => addToast('warning', msg, title), [addToast]);
  const info = useCallback((msg, title) => addToast('info', msg, title), [addToast]);

  const value = {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export default NotificationContext;
