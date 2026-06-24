/**
 * Konfigurasi API untuk Rumah Makan Om Ping
 * 
 * USE_MOCK: jika true, semua service menggunakan data mock (localStorage)
 * BASE_URL: URL backend API
 */

// Flag untuk menggunakan mock data (tanpa backend)
export const USE_MOCK = false;


// Base URL backend API
export const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

// Prefix ID auto-generation (sesuai backend)
export const ID_PREFIX = {
  USER: 11,
  KARYAWAN: 22,
  DAFTAR: 33,
  MENU: 44,
  PESAN: 55,
  BAYAR: 66,
  PELANGGAN: 99,
};

// Status pesanan
export const ORDER_STATUS = {
  MASUK: 'pesanan masuk',
  DIPROSES: 'diproses',
  SELESAI: 'pesanan selesai',
};

// Metode pembayaran
export const PAYMENT_METHODS = {
  CASH: 'cash',
  QRIS: 'QRIS',
};

// Kategori menu
export const MENU_CATEGORIES = {
  MAKANAN: 'makanan',
  MINUMAN: 'minuman',
};

// Posisi karyawan / role
export const ROLES = {
  OWNER: 'owner',
  KASIR: 'kasir',
  DAPUR: 'dapur',
};
