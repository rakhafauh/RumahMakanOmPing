/**
 * Transaction Service - Rumah Makan Om Ping
 * Service untuk analitik & riwayat transaksi
 * Menggabungkan data Bayar + Pesan untuk statistik
 */
import { USE_MOCK } from '../config/api';
import paymentService from './paymentService';
import orderService from './orderService';

const transactionService = {
  /**
   * Ambil riwayat transaksi dengan filter
   * Menggabungkan data pembayaran dan pesanan
   * @param {Object} filters - { startDate, endDate, method, status }
   * @returns {Promise<Array>} Daftar transaksi lengkap
   */
  getTransactionHistory: async (filters = {}) => {
    try {
      const [payments, orders] = await Promise.all([
        paymentService.getAll(),
        orderService.getAll(),
      ]);

      // Gabungkan data pembayaran dengan pesanan
      let transactions = payments.map((payment) => {
        const order = orders.find(
          (o) => o.Id_Pesan === payment.Id_Pesan
        );
        return {
          ...payment,
          orderDetail: order || null,
          items: order?.DetailPesans || [],
        };
      });

      // Terapkan filter
      if (filters.startDate) {
        const start = new Date(filters.startDate);
        transactions = transactions.filter(
          (t) => new Date(t.Tanggal_Bayar) >= start
        );
      }
      if (filters.endDate) {
        const end = new Date(filters.endDate);
        end.setHours(23, 59, 59, 999);
        transactions = transactions.filter(
          (t) => new Date(t.Tanggal_Bayar) <= end
        );
      }
      if (filters.method) {
        transactions = transactions.filter(
          (t) => t.Metode_Bayar === filters.method
        );
      }
      if (filters.status) {
        transactions = transactions.filter(
          (t) => t.orderDetail?.Status_Pesan === filters.status
        );
      }

      // Urutkan dari terbaru
      transactions.sort(
        (a, b) => new Date(b.Tanggal_Bayar) - new Date(a.Tanggal_Bayar)
      );

      return transactions;
    } catch (error) {
      console.error('Error mengambil riwayat transaksi:', error);
      throw new Error('Gagal mengambil riwayat transaksi');
    }
  },

  /**
   * Hitung statistik pendapatan berdasarkan periode
   * @param {string} period - 'hari' | 'minggu' | 'bulan' | 'tahun'
   * @returns {Promise<Object>} { totalTransaksi, totalPendapatan, rataRata, menuTerlaris, chartData }
   */
  getRevenueStats: async (period = 'bulan') => {
    try {
      const [payments, orders] = await Promise.all([
        paymentService.getAll(),
        orderService.getAll(),
      ]);

      const now = new Date();
      let startDate;

      // Tentukan tanggal awal berdasarkan periode
      switch (period) {
        case 'hari':
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          break;
        case 'minggu':
          startDate = new Date(now);
          startDate.setDate(now.getDate() - 7);
          break;
        case 'bulan':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        case 'tahun':
          startDate = new Date(now.getFullYear(), 0, 1);
          break;
        default:
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      }

      // Filter pembayaran dalam periode
      const filteredPayments = payments.filter(
        (p) => new Date(p.Tanggal_Bayar) >= startDate
      );

      // Hitung total transaksi & pendapatan
      const totalTransaksi = filteredPayments.length;
      const totalPendapatan = filteredPayments.reduce(
        (sum, p) => sum + (p.Grand_Bayar || 0),
        0
      );
      const rataRata =
        totalTransaksi > 0 ? totalPendapatan / totalTransaksi : 0;

      // Hitung menu terlaris dari semua pesanan dalam periode
      const menuCount = {};
      const filteredOrders = orders.filter(
        (o) => new Date(o.Tanggal_Pesan) >= startDate
      );

      filteredOrders.forEach((order) => {
        if (order.DetailPesans) {
          order.DetailPesans.forEach((detail) => {
            const menuName = detail.Menu?.Nama_Menu || `Menu #${detail.Id_Menu}`;
            if (!menuCount[menuName]) {
              menuCount[menuName] = { nama: menuName, qty: 0 };
            }
            menuCount[menuName].qty += detail.Qty;
          });
        }
      });

      // Urutkan menu berdasarkan qty terbanyak
      const menuTerlaris = Object.values(menuCount)
        .sort((a, b) => b.qty - a.qty)
        .slice(0, 5); // Top 5

      // Data untuk chart berdasarkan periode
      const chartData = _generateChartData(filteredPayments, period);

      return {
        totalTransaksi,
        totalPendapatan,
        rataRata,
        menuTerlaris,
        chartData,
        period,
      };
    } catch (error) {
      console.error('Error menghitung statistik pendapatan:', error);
      throw new Error('Gagal menghitung statistik pendapatan');
    }
  },

  /**
   * Cari transaksi berdasarkan nama pelanggan atau no HP
   * @param {string} query - Kata kunci pencarian
   * @returns {Promise<Array>} Daftar transaksi yang cocok
   */
  searchByNameOrPhone: async (query) => {
    try {
      const transactions = await transactionService.getTransactionHistory();
      const lowerQuery = query.toLowerCase();

      return transactions.filter((t) => {
        const namaMatch =
          t.Pelanggan?.Nama_Pelanggan?.toLowerCase().includes(lowerQuery);
        const hpMatch = String(
          t.Pelanggan?.No_Hp || ''
        ).includes(query);
        const karyawanMatch =
          t.Karyawan?.Nama_Karyawan?.toLowerCase().includes(lowerQuery);
        return namaMatch || hpMatch || karyawanMatch;
      });
    } catch (error) {
      console.error('Error mencari transaksi:', error);
      throw new Error('Gagal mencari transaksi');
    }
  },
};

/**
 * Helper: Generate data chart berdasarkan periode
 * @private
 */
function _generateChartData(payments, period) {
  const dataMap = {};

  payments.forEach((p) => {
    const date = new Date(p.Tanggal_Bayar);
    let key;

    switch (period) {
      case 'hari':
        // Per jam
        key = `${date.getHours().toString().padStart(2, '0')}:00`;
        break;
      case 'minggu':
        // Per hari dalam minggu
        const days = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
        key = days[date.getDay()];
        break;
      case 'bulan':
        // Per tanggal
        key = `${date.getDate()}`;
        break;
      case 'tahun':
        // Per bulan
        const months = [
          'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
          'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des',
        ];
        key = months[date.getMonth()];
        break;
      default:
        key = date.toLocaleDateString('id-ID');
    }

    if (!dataMap[key]) {
      dataMap[key] = { label: key, pendapatan: 0, transaksi: 0 };
    }
    dataMap[key].pendapatan += p.Grand_Bayar || 0;
    dataMap[key].transaksi += 1;
  });

  return Object.values(dataMap);
}

export default transactionService;
