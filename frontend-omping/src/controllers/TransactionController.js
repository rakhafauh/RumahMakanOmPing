/**
 * Transaction Controller - Rumah Makan Om Ping
 * Business logic untuk analitik & laporan transaksi
 */
import transactionService from '../services/transactionService';
import CartController from './CartController';

const TransactionController = {
  /**
   * Ambil data pendapatan berdasarkan periode
   * @param {string} period - 'hari' | 'minggu' | 'bulan' | 'tahun'
   * @returns {Promise<Object>} { success, data, error }
   */
  getRevenueByPeriod: async (period = 'bulan') => {
    try {
      const validPeriods = ['hari', 'minggu', 'bulan', 'tahun'];
      if (!validPeriods.includes(period)) {
        return {
          success: false,
          error: `Periode tidak valid. Gunakan: ${validPeriods.join(', ')}`,
        };
      }

      const stats = await transactionService.getRevenueStats(period);

      return {
        success: true,
        data: {
          ...stats,
          // Format angka untuk tampilan
          totalPendapatanFormatted: CartController.formatCurrency(
            stats.totalPendapatan
          ),
          rataRataFormatted: CartController.formatCurrency(stats.rataRata),
        },
      };
    } catch (error) {
      console.error('Error mengambil data pendapatan:', error);
      return {
        success: false,
        error: error.message || 'Gagal mengambil data pendapatan',
      };
    }
  },

  /**
   * Ambil menu terlaris dari data transaksi
   * @param {Array} transactions - Daftar transaksi (dari getTransactionHistory)
   * @returns {Array} Top menu items { nama, qty, pendapatan }
   */
  getTopMenu: (transactions) => {
    if (!transactions || transactions.length === 0) return [];

    const menuMap = {};

    transactions.forEach((trx) => {
      const items = trx.items || trx.orderDetail?.DetailPesans || [];
      items.forEach((detail) => {
        const menuName = detail.Menu?.Nama_Menu || `Menu #${detail.Id_Menu}`;
        const harga = detail.Menu?.Harga_Menu || 0;

        if (!menuMap[menuName]) {
          menuMap[menuName] = {
            nama: menuName,
            qty: 0,
            pendapatan: 0,
          };
        }
        menuMap[menuName].qty += detail.Qty || 0;
        menuMap[menuName].pendapatan += (detail.Qty || 0) * harga;
      });
    });

    return Object.values(menuMap)
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 10); // Top 10
  },

  /**
   * Filter transaksi berdasarkan rentang tanggal
   * @param {Array} transactions - Daftar transaksi
   * @param {string} startDate - Tanggal awal (ISO string atau date string)
   * @param {string} endDate - Tanggal akhir
   * @returns {Array} Transaksi yang difilter
   */
  filterTransactionsByDate: (transactions, startDate, endDate) => {
    if (!transactions) return [];

    let filtered = [...transactions];

    if (startDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      filtered = filtered.filter(
        (t) => new Date(t.Tanggal_Bayar) >= start
      );
    }

    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      filtered = filtered.filter(
        (t) => new Date(t.Tanggal_Bayar) <= end
      );
    }

    return filtered;
  },

  /**
   * Cari transaksi berdasarkan kata kunci
   * @param {string} query - Kata kunci (nama pelanggan, no HP, dll)
   * @returns {Promise<Object>} { success, data, error }
   */
  searchTransactions: async (query) => {
    try {
      if (!query || !query.trim()) {
        return { success: false, error: 'Kata kunci pencarian harus diisi' };
      }

      const results = await transactionService.searchByNameOrPhone(
        query.trim()
      );

      return {
        success: true,
        data: results,
        count: results.length,
      };
    } catch (error) {
      console.error('Error mencari transaksi:', error);
      return {
        success: false,
        error: error.message || 'Gagal mencari transaksi',
      };
    }
  },

  /**
   * Hitung ringkasan transaksi untuk dashboard
   * @param {Array} transactions - Daftar transaksi
   * @returns {Object} Ringkasan statistik
   */
  calculateSummary: (transactions) => {
    if (!transactions || transactions.length === 0) {
      return {
        totalTransaksi: 0,
        totalPendapatan: 0,
        totalPendapatanFormatted: CartController.formatCurrency(0),
        rataRata: 0,
        rataRataFormatted: CartController.formatCurrency(0),
        metodeCash: 0,
        metodeQRIS: 0,
      };
    }

    const totalTransaksi = transactions.length;
    const totalPendapatan = transactions.reduce(
      (sum, t) => sum + (t.Grand_Bayar || 0),
      0
    );
    const rataRata = totalPendapatan / totalTransaksi;
    const metodeCash = transactions.filter(
      (t) => t.Metode_Bayar === 'cash'
    ).length;
    const metodeQRIS = transactions.filter(
      (t) => t.Metode_Bayar === 'QRIS'
    ).length;

    return {
      totalTransaksi,
      totalPendapatan,
      totalPendapatanFormatted: CartController.formatCurrency(totalPendapatan),
      rataRata,
      rataRataFormatted: CartController.formatCurrency(rataRata),
      metodeCash,
      metodeQRIS,
    };
  },
};

export default TransactionController;
