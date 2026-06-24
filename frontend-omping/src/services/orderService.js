/**
 * Order Service - Rumah Makan Om Ping
 * Service untuk CRUD pesanan (Pesan + DetailPesan)
 */
import axiosInstance from '../config/axiosInstance';

const orderService = {
  /**
   * Ambil semua pesanan (termasuk Pelanggan + DetailPesan → Menu)
   * @returns {Promise<Array>} Daftar pesanan
   */
  getAll: async () => {
    try {
      const response = await axiosInstance.get('/get/pesan');
      return response.data;
    } catch (error) {
      console.error('Error mengambil data pesanan:', error);
      throw new Error('Gagal mengambil data pesanan');
    }
  },

  /**
   * Ambil pesanan berdasarkan ID
   * @param {number} id - Id_Pesan
   * @returns {Promise<Object>} Data pesanan
   */
  getById: async (id) => {
    try {
      const response = await axiosInstance.get(`/get/pesan/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error mengambil detail pesanan:', error);
      throw new Error('Gagal mengambil detail pesanan');
    }
  },

  /**
   * Buat pesanan baru
   * @param {Object} data - { Id_Pelanggan, Tanggal_Pesan, Total_Bayar, Status_Pesan }
   * @returns {Promise<Object>} Pesanan yang baru dibuat
   */
  create: async (data) => {
    try {
      const response = await axiosInstance.post('/create/pesan', {
        Id_Pelanggan: data.Id_Pelanggan,
        Tanggal_Pesan: data.Tanggal_Pesan,
        Total_Bayar: parseFloat(data.Total_Bayar),
        Status_Pesan: data.Status_Pesan !== undefined ? data.Status_Pesan : 'pesanan masuk',
      });
      return response.data;
    } catch (error) {
      console.error('Error membuat pesanan:', error);
      throw new Error('Gagal membuat pesanan');
    }
  },

  /**
   * Update pesanan
   * @param {number} id - Id_Pesan
   * @param {Object} data - Data yang akan diupdate
   * @returns {Promise<Object>} Pesanan yang diupdate
   */
  update: async (id, data) => {
    try {
      const response = await axiosInstance.put(`/update/pesan/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error mengupdate pesanan:', error);
      throw new Error('Gagal mengupdate pesanan');
    }
  },

  /**
   * Hapus pesanan
   * @param {number} id - Id_Pesan
   * @returns {Promise<Object>} Konfirmasi penghapusan
   */
  delete: async (id) => {
    try {
      const response = await axiosInstance.delete(`/delete/pesan/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error menghapus pesanan:', error);
      throw new Error('Gagal menghapus pesanan');
    }
  },

  /**
   * Tambah detail pesanan (item menu ke pesanan)
   * @param {Object} data - { Id_Pesan, Id_Menu, Qty }
   * @returns {Promise<Object>} Detail pesanan yang dibuat
   */
  createDetail: async (data) => {
    try {
      const response = await axiosInstance.post('/create/detail-pesan', {
        Id_Pesan: data.Id_Pesan,
        Id_Menu: data.Id_Menu,
        Qty: Number(data.Qty),
      });
      return response.data;
    } catch (error) {
      console.error('Error menambah detail pesanan:', error);
      throw new Error('Gagal menambah detail pesanan');
    }
  },

  /**
   * Update detail pesanan
   * @param {number} pesanId - Id_Pesan
   * @param {number} menuId - Id_Menu
   * @param {Object} data - Data yang akan diupdate (Qty)
   * @returns {Promise<Object>}
   */
  updateDetail: async (pesanId, menuId, data) => {
    try {
      const response = await axiosInstance.put(
        `/update/detail-pesan/${pesanId}/${menuId}`,
        data
      );
      return response.data;
    } catch (error) {
      console.error('Error mengupdate detail pesanan:', error);
      throw new Error('Gagal mengupdate detail pesanan');
    }
  },

  /**
   * Hapus detail pesanan
   * @param {number} pesanId - Id_Pesan
   * @param {number} menuId - Id_Menu
   * @returns {Promise<Object>}
   */
  deleteDetail: async (pesanId, menuId) => {
    try {
      const response = await axiosInstance.delete(
        `/delete/detail-pesan/${pesanId}/${menuId}`
      );
      return response.data;
    } catch (error) {
      console.error('Error menghapus detail pesanan:', error);
      throw new Error('Gagal menghapus detail pesanan');
    }
  },
};

export default orderService;
