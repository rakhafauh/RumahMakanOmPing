/**
 * Payment Controller - Rumah Makan Om Ping
 * Business logic untuk pembayaran
 */
import paymentService from '../services/paymentService';
import orderService from '../services/orderService';
import { PAYMENT_METHODS, ORDER_STATUS } from '../config/api';

const PaymentController = {
  /**
   * Proses pembayaran pesanan
   * @param {Object} params - { orderId, method, amount, customerId, karyawanId }
   * @returns {Promise<Object>} { success, data, error }
   */
  processPayment: async ({ orderId, method, amount, customerId, karyawanId }) => {
    try {
      // Validasi metode pembayaran
      const validMethods = Object.values(PAYMENT_METHODS);
      if (!validMethods.includes(method)) {
        return {
          success: false,
          error: `Metode pembayaran tidak valid. Gunakan: ${validMethods.join(', ')}`,
        };
      }

      // Validasi jumlah bayar
      if (!amount || amount <= 0) {
        return { success: false, error: 'Jumlah pembayaran tidak valid' };
      }

      // Buat record pembayaran
      const payment = await paymentService.create({
        Tanggal_Bayar: new Date().toISOString(),
        Metode_Bayar: method,
        Grand_Bayar: parseFloat(amount),
        Id_Pelanggan: customerId,
        Id_Karyawan: karyawanId,
        Id_Pesan: orderId,
      });

      // Update status pesanan jadi selesai
      await orderService.update(orderId, {
        Status_Pesan: ORDER_STATUS.SELESAI,
      });

      return { success: true, data: payment };
    } catch (error) {
      console.error('Error memproses pembayaran:', error);
      return {
        success: false,
        error: error.message || 'Gagal memproses pembayaran',
      };
    }
  },

  /**
   * Generate data string untuk QR Code QRIS
   * Menggunakan format sederhana untuk simulasi
   * @param {number} amount - Jumlah yang harus dibayar
   * @param {number} orderId - ID pesanan (opsional)
   * @returns {string} Data string untuk QR Code
   */
  generateQRISData: (amount, orderId = null) => {
    const timestamp = Date.now();
    const formattedAmount = parseFloat(amount).toFixed(0);
    // Format simulasi QRIS: RMOMPING|<amount>|<orderId>|<timestamp>
    return `RMOMPING|${formattedAmount}|${orderId || 'N/A'}|${timestamp}`;
  },

  /**
   * Konfirmasi pembayaran QRIS (simulasi)
   * @param {number} paymentId - Id_Bayar
   * @returns {Promise<Object>} { success, data, error }
   */
  confirmQRISPayment: async (paymentId) => {
    try {
      // Dalam mode mock/simulasi, langsung update status pembayaran
      const payment = await paymentService.getById(paymentId);
      if (!payment) {
        return { success: false, error: 'Pembayaran tidak ditemukan' };
      }

      // Update pesanan jadi selesai jika belum
      if (payment.Id_Pesan) {
        await orderService.update(payment.Id_Pesan, {
          Status_Pesan: ORDER_STATUS.SELESAI,
        });
      }

      return {
        success: true,
        data: {
          ...payment,
          confirmed: true,
          confirmedAt: new Date().toISOString(),
        },
      };
    } catch (error) {
      console.error('Error mengkonfirmasi QRIS:', error);
      return {
        success: false,
        error: error.message || 'Gagal mengkonfirmasi pembayaran QRIS',
      };
    }
  },

  /**
   * Hitung kembalian (untuk pembayaran cash)
   * @param {number} totalBayar - Total yang harus dibayar
   * @param {number} jumlahDiberikan - Jumlah uang yang diberikan
   * @returns {{ valid: boolean, kembalian: number, error?: string }}
   */
  calculateChange: (totalBayar, jumlahDiberikan) => {
    if (jumlahDiberikan < totalBayar) {
      return {
        valid: false,
        kembalian: 0,
        error: 'Jumlah uang kurang dari total bayar',
      };
    }
    return {
      valid: true,
      kembalian: jumlahDiberikan - totalBayar,
    };
  },

  /**
   * Format nomor pembayaran
   * @param {number} id - Id_Bayar
   * @returns {string} Format: "INV-006601"
   */
  formatInvoiceNumber: (id) => {
    return `INV-${String(id).padStart(6, '0')}`;
  },
};

export default PaymentController;
