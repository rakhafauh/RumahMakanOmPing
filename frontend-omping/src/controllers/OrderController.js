/**
 * Order Controller - Rumah Makan Om Ping
 * Business logic untuk manajemen pesanan
 */
import orderService from '../services/orderService';
import customerService from '../services/customerService';
import CartController from './CartController';
import { ORDER_STATUS } from '../config/api';

const OrderController = {
  /**
   * Proses pesanan baru (flow lengkap)
   * 1. Buat/cari pelanggan
   * 2. Buat pesanan (Pesan)
   * 3. Buat detail pesanan (DetailPesan) untuk setiap item
   * 
   * @param {Object} customerData - { Nama_Pelanggan, No_Hp }
   * @param {Array} cartItems - Array of { menu, quantity }
   * @param {string} orderType - Tipe pesanan (dine-in/takeaway)
   * @param {string} paymentMethod - Metode pembayaran
   * @returns {Promise<Object>} { success, data: { order, customer }, error }
   */
  processNewOrder: async (customerData, cartItems, orderType, paymentMethod) => {
    try {
      // Validasi keranjang
      const cartValidation = CartController.validateCart(cartItems);
      if (!cartValidation.valid) {
        return { success: false, error: cartValidation.error };
      }

      // Validasi data pelanggan
      if (!customerData.Nama_Pelanggan || !customerData.Nama_Pelanggan.trim()) {
        return { success: false, error: 'Nama pelanggan harus diisi' };
      }

      // Hitung total
      const totalBayar = CartController.calculateTotal(cartItems);

      // Step 1: Buat pelanggan baru
      const customer = await customerService.create({
        Nama_Pelanggan: customerData.Nama_Pelanggan.trim(),
        No_Hp: customerData.No_Hp || 0,
        Tanggal_Registrasi: new Date().toISOString().split('T')[0],
      });

      // Step 2: Buat pesanan
      const order = await orderService.create({
        Id_Pelanggan: customer.Id_pelanggan,
        Tanggal_Pesan: new Date().toISOString(),
        Total_Bayar: totalBayar,
        Status_Pesan: ORDER_STATUS.MASUK,
      });

      // Step 3: Buat detail pesanan untuk setiap item
      const orderDetails = CartController.formatCartForOrder(cartItems);
      for (const detail of orderDetails) {
        await orderService.createDetail({
          Id_Pesan: order.Id_Pesan,
          Id_Menu: detail.Id_Menu,
          Qty: detail.Qty,
        });
      }

      return {
        success: true,
        data: {
          order,
          customer,
          totalBayar,
          orderType,
          paymentMethod,
        },
      };
    } catch (error) {
      console.error('Error memproses pesanan:', error);
      return {
        success: false,
        error: error.message || 'Gagal memproses pesanan',
      };
    }
  },

  /**
   * Kasir menerima pesanan (update status ke 'diproses')
   * @param {number} orderId - Id_Pesan
   * @returns {Promise<Object>} { success, data, error }
   */
  acceptOrder: async (orderId) => {
    try {
      const updatedOrder = await orderService.update(orderId, {
        Status_Pesan: ORDER_STATUS.DIPROSES,
      });
      return { success: true, data: updatedOrder };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Gagal menerima pesanan',
      };
    }
  },

  /**
   * Kasir menolak pesanan (hapus pesanan)
   * @param {number} orderId - Id_Pesan
   * @returns {Promise<Object>} { success, error }
   */
  rejectOrder: async (orderId) => {
    try {
      await orderService.delete(orderId);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Gagal menolak pesanan',
      };
    }
  },

  /**
   * Dapur menandai pesanan siap (update status ke 'pesanan selesai')
   * @param {number} orderId - Id_Pesan
   * @returns {Promise<Object>} { success, data, error }
   */
  markAsReady: async (orderId) => {
    try {
      const updatedOrder = await orderService.update(orderId, {
        Status_Pesan: ORDER_STATUS.SELESAI,
      });
      return { success: true, data: updatedOrder };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Gagal menandai pesanan siap',
      };
    }
  },

  /**
   * Selesaikan pesanan (update status ke 'pesanan selesai')
   * @param {number} orderId - Id_Pesan
   * @returns {Promise<Object>} { success, data, error }
   */
  completeOrder: async (orderId) => {
    try {
      const updatedOrder = await orderService.update(orderId, {
        Status_Pesan: ORDER_STATUS.SELESAI,
      });
      return { success: true, data: updatedOrder };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Gagal menyelesaikan pesanan',
      };
    }
  },

  /**
   * Filter pesanan berdasarkan status
   * @param {Array} orders - Daftar pesanan
   * @param {string} status - Status filter
   * @returns {Array} Pesanan yang difilter
   */
  filterByStatus: (orders, status) => {
    if (!orders) return [];
    if (!status || status === 'semua') return orders;
    return orders.filter((order) => order.Status_Pesan === status);
  },

  /**
   * Urutkan pesanan dari terbaru
   * @param {Array} orders - Daftar pesanan
   * @returns {Array} Pesanan terurut
   */
  sortByNewest: (orders) => {
    if (!orders) return [];
    return [...orders].sort(
      (a, b) => new Date(b.Tanggal_Pesan) - new Date(a.Tanggal_Pesan)
    );
  },

  /**
   * Hitung ringkasan pesanan per status
   * @param {Array} orders - Daftar pesanan
   * @returns {Object} { masuk: n, diproses: n, selesai: n, total: n }
   */
  getOrderSummary: (orders) => {
    if (!orders) return { masuk: 0, diproses: 0, selesai: 0, total: 0 };
    return {
      masuk: orders.filter((o) => o.Status_Pesan === ORDER_STATUS.MASUK).length,
      diproses: orders.filter((o) => o.Status_Pesan === ORDER_STATUS.DIPROSES).length,
      selesai: orders.filter((o) => o.Status_Pesan === ORDER_STATUS.SELESAI).length,
      total: orders.length,
    };
  },
};

export default OrderController;
