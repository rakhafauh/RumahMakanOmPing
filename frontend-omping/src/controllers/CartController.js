/**
 * Cart Controller - Rumah Makan Om Ping
 * Business logic untuk keranjang belanja
 */

const CartController = {
  /**
   * Hitung total harga semua item di keranjang
   * @param {Array} items - Array of { menu: Object, quantity: number }
   * @returns {number} Total harga
   */
  calculateTotal: (items) => {
    if (!items || items.length === 0) return 0;
    return items.reduce((total, item) => {
      return total + (item.menu?.Harga_Menu || 0) * (item.quantity || 0);
    }, 0);
  },

  /**
   * Hitung total jumlah item di keranjang
   * @param {Array} items - Array of { menu, quantity }
   * @returns {number} Total jumlah item
   */
  calculateTotalItems: (items) => {
    if (!items || items.length === 0) return 0;
    return items.reduce((total, item) => total + (item.quantity || 0), 0);
  },

  /**
   * Validasi keranjang sebelum checkout
   * @param {Array} items - Item keranjang
   * @returns {{ valid: boolean, error?: string }}
   */
  validateCart: (items) => {
    if (!items || items.length === 0) {
      return { valid: false, error: 'Keranjang masih kosong' };
    }

    // Cek semua item punya quantity > 0
    const invalidItem = items.find((item) => !item.quantity || item.quantity <= 0);
    if (invalidItem) {
      return {
        valid: false,
        error: `Item "${invalidItem.menu?.Nama_Menu}" memiliki jumlah tidak valid`,
      };
    }

    // Cek semua item punya harga
    const noPriceItem = items.find(
      (item) => !item.menu?.Harga_Menu && item.menu?.Harga_Menu !== 0
    );
    if (noPriceItem) {
      return {
        valid: false,
        error: `Item "${noPriceItem.menu?.Nama_Menu}" tidak memiliki harga`,
      };
    }

    return { valid: true };
  },

  /**
   * Format data keranjang untuk pembuatan pesanan (API)
   * @param {Array} items - Item keranjang { menu, quantity }
   * @returns {Array} Array of { Id_Menu, Qty } untuk DetailPesan
   */
  formatCartForOrder: (items) => {
    if (!items || items.length === 0) return [];
    return items.map((item) => ({
      Id_Menu: item.menu.Id_Menu,
      Qty: item.quantity,
    }));
  },

  /**
   * Hitung subtotal per item
   * @param {Object} item - { menu, quantity }
   * @returns {number} Subtotal item
   */
  calculateItemSubtotal: (item) => {
    return (item.menu?.Harga_Menu || 0) * (item.quantity || 0);
  },

  /**
   * Format harga ke format Rupiah
   * @param {number} amount - Jumlah uang
   * @returns {string} Format Rupiah (misal: "Rp 25.000")
   */
  formatCurrency: (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0);
  },
};

export default CartController;
