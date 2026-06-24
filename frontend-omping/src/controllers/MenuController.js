/**
 * Menu Controller - Rumah Makan Om Ping
 * Business logic untuk manajemen menu
 */
import { MENU_CATEGORIES } from '../config/api';

const MenuController = {
  /**
   * Validasi data menu sebelum create/update
   * @param {Object} data - { Nama_Menu, Harga_Menu, Kategori_Menu }
   * @returns {{ valid: boolean, errors: Object }}
   */
  validateMenu: (data) => {
    const errors = {};

    // Validasi nama menu
    if (!data.Nama_Menu || !data.Nama_Menu.trim()) {
      errors.Nama_Menu = 'Nama menu harus diisi';
    } else if (data.Nama_Menu.trim().length < 3) {
      errors.Nama_Menu = 'Nama menu minimal 3 karakter';
    }

    // Validasi harga
    if (!data.Harga_Menu && data.Harga_Menu !== 0) {
      errors.Harga_Menu = 'Harga menu harus diisi';
    } else if (isNaN(data.Harga_Menu) || Number(data.Harga_Menu) <= 0) {
      errors.Harga_Menu = 'Harga menu harus berupa angka positif';
    }

    // Validasi kategori
    const validCategories = Object.values(MENU_CATEGORIES);
    if (!data.Kategori_Menu) {
      errors.Kategori_Menu = 'Kategori menu harus dipilih';
    } else if (!validCategories.includes(data.Kategori_Menu)) {
      errors.Kategori_Menu = `Kategori harus salah satu dari: ${validCategories.join(', ')}`;
    }

    return {
      valid: Object.keys(errors).length === 0,
      errors,
    };
  },

  /**
   * Filter menu berdasarkan kategori
   * @param {Array} menus - Daftar menu
   * @param {string} category - Kategori ('makanan', 'minuman', atau 'semua')
   * @returns {Array} Menu yang difilter
   */
  filterByCategory: (menus, category) => {
    if (!menus) return [];
    if (!category || category === 'semua') return menus;
    return menus.filter((menu) => menu.Kategori_Menu === category);
  },

  /**
   * Cari menu berdasarkan nama
   * @param {Array} menus - Daftar menu
   * @param {string} query - Kata kunci pencarian
   * @returns {Array} Menu yang cocok
   */
  searchMenu: (menus, query) => {
    if (!menus) return [];
    if (!query || !query.trim()) return menus;
    const lowerQuery = query.toLowerCase().trim();
    return menus.filter((menu) =>
      menu.Nama_Menu.toLowerCase().includes(lowerQuery)
    );
  },

  /**
   * Urutkan menu
   * @param {Array} menus - Daftar menu
   * @param {string} sortBy - 'nama_asc', 'nama_desc', 'harga_asc', 'harga_desc'
   * @returns {Array} Menu yang diurutkan
   */
  sortMenu: (menus, sortBy) => {
    if (!menus) return [];
    const sorted = [...menus];

    switch (sortBy) {
      case 'nama_asc':
        return sorted.sort((a, b) =>
          a.Nama_Menu.localeCompare(b.Nama_Menu)
        );
      case 'nama_desc':
        return sorted.sort((a, b) =>
          b.Nama_Menu.localeCompare(a.Nama_Menu)
        );
      case 'harga_asc':
        return sorted.sort((a, b) => a.Harga_Menu - b.Harga_Menu);
      case 'harga_desc':
        return sorted.sort((a, b) => b.Harga_Menu - a.Harga_Menu);
      default:
        return sorted;
    }
  },

  /**
   * Kelompokkan menu berdasarkan kategori
   * @param {Array} menus - Daftar menu
   * @returns {Object} { makanan: [...], minuman: [...] }
   */
  groupByCategory: (menus) => {
    if (!menus) return { makanan: [], minuman: [] };
    return menus.reduce(
      (groups, menu) => {
        const category = menu.Kategori_Menu || 'makanan';
        if (!groups[category]) groups[category] = [];
        groups[category].push(menu);
        return groups;
      },
      { makanan: [], minuman: [] }
    );
  },
};

export default MenuController;
