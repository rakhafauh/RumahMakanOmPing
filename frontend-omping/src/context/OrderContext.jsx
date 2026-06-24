/**
 * OrderContext - Konteks untuk manajemen pemesanan
 * Mengelola state pesanan: buat, update status, ambil daftar
 */
import React, { createContext, useContext, useState, useCallback } from 'react';
import orderService from '../services/orderService';
import customerService from '../services/customerService';

const OrderContext = createContext(null);

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState([]);
  const [currentOrder, setCurrentOrder] = useState(null);

  // Refresh orders dari API
  const refreshOrders = useCallback(async () => {
    try {
      const data = await orderService.getAll();
      setOrders(data);
    } catch (error) {
      console.error('Error mengambil data pesanan:', error);
    }
  }, []);

  // Buat pesanan baru
  const createOrder = useCallback(async (orderData) => {
    try {
      let customer = orderData.Pelanggan || null;
      let Id_pelanggan = orderData.Id_Pelanggan;

      if (!Id_pelanggan) {
        // register/create the customer via customerService.create to get the customer's Id_pelanggan
        customer = await customerService.create({
          Nama_Pelanggan: orderData.Pelanggan?.Nama_Pelanggan || orderData.Nama_Pelanggan,
          No_Hp: orderData.Pelanggan?.No_Hp || orderData.No_Hp,
          Tanggal_Registrasi: orderData.Pelanggan?.Tanggal_Registrasi || new Date().toISOString().split('T')[0],
        });
        Id_pelanggan = customer.Id_pelanggan;
      }

      // 2. call orderService.create using Id_pelanggan with status 'diproses'
      const order = await orderService.create({
        Id_Pelanggan: Id_pelanggan,
        Tanggal_Pesan: new Date().toISOString(),
        Total_Bayar: orderData.Total_Bayar,
        Status_Pesan: orderData.Status_Pesan !== undefined ? orderData.Status_Pesan : 'pesanan masuk',
      });

      // 3. call orderService.createDetail for each item in the detail list
      const details = orderData.DetailPesans || [];
      const createdDetails = [];
      for (const item of details) {
        const detail = await orderService.createDetail({
          Id_Pesan: order.Id_Pesan,
          Id_Menu: item.Id_Menu,
          Qty: item.Qty || item.qty,
        });
        createdDetails.push({
          ...detail,
          Menu: item.Menu || item.menu || null,
        });
      }

      const completedOrder = {
        ...order,
        Pelanggan: customer,
        DetailPesans: createdDetails,
      };

      setCurrentOrder(completedOrder);
      setOrders((prev) => [completedOrder, ...prev]);

      return completedOrder;
    } catch (error) {
      console.error('Error membuat pesanan di context:', error);
      throw error;
    }
  }, []);

  // Update status pesanan
  const updateOrderStatus = useCallback(async (orderId, newStatus) => {
    try {
      const updatedOrder = await orderService.update(orderId, {
        Status_Pesan: newStatus,
      });

      setOrders((prev) =>
        prev.map((o) => (o.Id_Pesan === orderId ? { ...o, Status_Pesan: newStatus } : o))
      );

      if (currentOrder?.Id_Pesan === orderId) {
        setCurrentOrder((prev) => (prev ? { ...prev, Status_Pesan: newStatus } : null));
      }

      return updatedOrder;
    } catch (error) {
      console.error('Error mengupdate status pesanan:', error);
      throw error;
    }
  }, [currentOrder]);

  // Ambil pesanan berdasarkan ID
  const getOrderById = useCallback(async (orderId) => {
    try {
      const order = await orderService.getById(orderId);
      return order;
    } catch (error) {
      console.error('Error mengambil detail pesanan:', error);
      throw error;
    }
  }, []);

  // Ambil pesanan berdasarkan status
  const getOrdersByStatus = useCallback(async (status) => {
    try {
      const allOrders = await orderService.getAll();
      return allOrders.filter((o) => o.Status_Pesan === status);
    } catch (error) {
      console.error('Error mengambil pesanan berdasarkan status:', error);
      throw error;
    }
  }, []);

  const value = {
    orders,
    currentOrder,
    setCurrentOrder,
    createOrder,
    updateOrderStatus,
    getOrderById,
    getOrdersByStatus,
    refreshOrders,
  };

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
}

export function useOrders() {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders harus digunakan di dalam OrderProvider');
  }
  return context;
}

export default OrderContext;
