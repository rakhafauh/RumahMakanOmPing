/**
 * DapurDashboard - Dashboard Dapur (Koki)
 * Menampilkan pesanan yang sudah diterima kasir untuk disiapkan
 * Pesanan baru muncul setelah kasir menekan "Terima"
 */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChefHat, Clock, CheckCircle, Flame } from 'lucide-react';
import DashboardLayout from '../../components/common/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import orderService from '../../services/orderService';
import '../../styles/dashboard.css';

function DapurDashboard() {
  const { karyawan } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    try {
      const data = await orderService.getAll();
      setOrders(data || []);
    } catch (err) {
      console.error('Gagal memuat pesanan:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
    // Polling setiap 5 detik untuk update pesanan baru
    const interval = setInterval(loadOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  // Hanya tampilkan pesanan yang sudah diterima kasir (status: diproses)
  const activeOrders = orders.filter((o) => o.Status_Pesan === 'diproses');
  const completedToday = orders.filter((o) => o.Status_Pesan === 'pesanan selesai');

  const handleReady = async (orderId) => {
    try {
      await orderService.update(orderId, { Status_Pesan: 'pesanan selesai' });
      setOrders((prev) =>
        prev.map((o) =>
          o.Id_Pesan === orderId ? { ...o, Status_Pesan: 'pesanan selesai' } : o
        )
      );
    } catch (err) {
      console.error('Gagal mengupdate status pesanan:', err);
    }
  };

  // Hitung waktu berlalu sejak pesanan
  const getElapsedTime = (dateStr) => {
    if (!dateStr) return '0m';
    const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 60000);
    if (diff < 1) return 'Baru saja';
    if (diff < 60) return `${diff} menit`;
    return `${Math.floor(diff / 60)}j ${diff % 60}m`;
  };

  return (
    <DashboardLayout role="dapur">
      <div className="dashboard-header">
        <div>
          <h1><ChefHat size={24} /> Dapur</h1>
          <p>Halo, {karyawan?.Nama_Karyawan || 'Koki'}</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#FFF9E6' }}>
            <Flame size={24} color="#CC8800" />
          </div>
          <div className="stat-info">
            <span>Pesanan Aktif</span>
            <h3>{activeOrders.length}</h3>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#EBF7F0' }}>
            <CheckCircle size={24} color="#5E9E7D" />
          </div>
          <div className="stat-info">
            <span>Selesai Hari Ini</span>
            <h3>{completedToday.length}</h3>
          </div>
        </div>
      </div>

      {/* Order Queue */}
      <div className="section-card">
        <h3><Flame size={18} /> Antrian Pesanan</h3>

        {loading && orders.length === 0 ? (
          <p className="empty-text">Memuat antrian...</p>
        ) : activeOrders.length === 0 ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '48px 24px',
            textAlign: 'center',
            gap: '12px'
          }}>
            <ChefHat size={56} style={{ opacity: 0.25, color: '#636E72' }} />
            <p style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#2D3436',
              opacity: 0.6,
              margin: 0
            }}>
              Belum ada pesanan aktif
            </p>
            <span style={{
              fontSize: '13px',
              color: '#636E72',
              opacity: 0.5,
              maxWidth: '280px',
              lineHeight: '1.5'
            }}>
              Pesanan akan muncul setelah kasir menerima pesanan pelanggan
            </span>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '16px'
          }}>
            <AnimatePresence>
              {activeOrders.map((order) => (
                <motion.div
                  key={order.Id_Pesan}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, x: 200, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    background: 'white',
                    borderRadius: '12px',
                    padding: '20px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    border: '1px solid #E0E0E0',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
                  }}
                >
                  {/* Card Header */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div>
                      <div style={{ fontSize: '16px', fontWeight: '700', color: '#2D3436' }}>
                        #{order.Id_Pesan}
                      </div>
                      <div style={{ fontSize: '14px', color: '#636E72' }}>
                        {order.Pelanggan?.Nama_Pelanggan || 'Pelanggan'}
                      </div>
                    </div>
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '4px 10px',
                      background: '#FFF9E6',
                      color: '#CC8800',
                      borderRadius: '16px',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>
                      <Clock size={14} />
                      <span>{getElapsedTime(order.Tanggal_Pesan)}</span>
                    </div>
                  </div>

                  {/* Items Section */}
                  <div style={{
                    background: '#F6FAF7',
                    borderRadius: '8px',
                    padding: '12px'
                  }}>
                    <div style={{
                      fontSize: '13px',
                      fontWeight: '600',
                      color: '#5E9E7D',
                      marginBottom: '8px'
                    }}>
                      Item yang harus disiapkan:
                    </div>
                    {(order.DetailPesans || []).map((d, i) => (
                      <div key={i} style={{
                        display: 'flex',
                        gap: '8px',
                        padding: '4px 0',
                        fontSize: '14px'
                      }}>
                        <span style={{
                          background: '#EBF7F0',
                          color: '#5E9E7D',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          fontWeight: '700',
                          fontSize: '13px'
                        }}>
                          {d.Qty}x
                        </span>
                        <span>{d.Menu?.Nama_Menu || '-'}</span>
                      </div>
                    ))}
                  </div>

                  {/* Pesanan Siap Button */}
                  <motion.button
                    onClick={() => handleReady(order.Id_Pesan)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: '#82C39B',
                      color: 'white',
                      border: 'none',
                      borderRadius: '10px',
                      fontSize: '15px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                  >
                    <CheckCircle size={18} />
                    Pesanan Siap
                  </motion.button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default DapurDashboard;
