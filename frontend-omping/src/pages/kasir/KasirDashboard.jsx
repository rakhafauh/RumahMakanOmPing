/**
 * KasirDashboard - Dashboard utama Kasir
 */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Clock, CheckCircle } from 'lucide-react';
import DashboardLayout from '../../components/common/DashboardLayout';
import Badge from '../../components/common/Badge';
import { useAuth } from '../../context/AuthContext';
import orderService from '../../services/orderService';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDateTime, isInPeriod } from '../../utils/formatDate';
import '../../styles/dashboard.css';

function KasirDashboard() {
  const navigate = useNavigate();
  const { karyawan } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await orderService.getAll();
        setOrders(data || []);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Gagal memuat data pesanan');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getNumericId = (id) => {
    if (typeof id === 'number') return id;
    const num = parseInt(String(id).replace(/\D/g, ''), 10);
    return isNaN(num) ? 0 : num;
  };

  const todayOrders = orders.filter((o) => isInPeriod(o.Tanggal_Pesan, 'hari'));
  const pendingOrders = orders
    .filter((o) => !o.Status_Pesan || o.Status_Pesan === 'pesanan masuk')
    .sort((a, b) => getNumericId(b.Id_Pesan) - getNumericId(a.Id_Pesan));
  const processingOrders = orders.filter((o) => o.Status_Pesan === 'diproses');

  return (
    <DashboardLayout role="kasir">
      <div className="dashboard-header">
        <div>
          <h1>Dashboard Kasir</h1>
          <p>Halo, {karyawan?.Nama_Karyawan || 'Kasir'}</p>
        </div>
      </div>

      {loading ? (
        <p className="empty-text">Memuat data...</p>
      ) : error ? (
        <p className="empty-text" style={{ color: '#FF8B8B' }}>{error}</p>
      ) : (
        <>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon" style={{ background: '#E8F5E9' }}>
                <ShoppingBag size={24} color="#4CAF50" />
              </div>
              <div className="stat-info">
                <span>Pesanan Hari Ini</span>
                <h3>{todayOrders.length}</h3>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: '#FFF3E0' }}>
                <Clock size={24} color="#FF9800" />
              </div>
              <div className="stat-info">
                <span>Menunggu Konfirmasi</span>
                <h3>{pendingOrders.length}</h3>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: '#E3F2FD' }}>
                <CheckCircle size={24} color="#2196F3" />
              </div>
              <div className="stat-info">
                <span>Sedang Diproses</span>
                <h3>{processingOrders.length}</h3>
              </div>
            </div>
          </div>

          {/* Recent Pending Orders */}
          <div className="section-card" style={{ marginTop: '24px' }}>
            <h3 style={{ marginBottom: '16px', fontSize: '1.25rem', fontWeight: '700', color: '#2D3436' }}>
              Pesanan Masuk Terbaru
            </h3>
            {pendingOrders.length > 0 ? (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '16px',
                marginTop: '12px'
              }}>
                {pendingOrders.slice(0, 6).map((o) => (
                  <div
                    key={o.Id_Pesan}
                    style={{
                      background: 'white',
                      borderRadius: '12px',
                      padding: '20px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                      border: '1px solid #E0E0E0',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      cursor: 'pointer'
                    }}
                    onClick={() => navigate('/kasir/orders')}
                  >
                    <div>
                      {/* Top row: Order ID & Badge */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <span style={{ fontWeight: '700', fontSize: '1.1rem', color: '#2D3436' }}>#{o.Id_Pesan}</span>
                        <Badge text="Menunggu" variant="warning" />
                      </div>
                      
                      {/* Customer info */}
                      <div style={{ padding: '8px 12px', background: '#F6FAF7', borderRadius: '8px', marginBottom: '12px' }}>
                        <div style={{ fontSize: '0.95rem', fontWeight: '600', color: '#2D3436' }}>
                          {o.Pelanggan?.Nama_Pelanggan || '-'}
                        </div>
                        <div style={{ fontSize: '0.85rem', color: '#6B7280', marginTop: '2px' }}>
                          Tipe: {o.tipe_pesanan === 'takeaway' ? 'Takeaway' : 'Dine In'}
                        </div>
                      </div>

                      {/* Items brief */}
                      {o.DetailPesans && o.DetailPesans.length > 0 && (
                        <div style={{ fontSize: '0.85rem', color: '#636E72', marginBottom: '12px' }}>
                          <span style={{ fontWeight: '600' }}>Detail Pesanan:</span>
                          <div style={{ marginTop: '4px', maxHeight: '60px', overflowY: 'auto' }}>
                            {o.DetailPesans.map((d, idx) => (
                              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                                <span>{d.Menu?.Nama_Menu}</span>
                                <span style={{ color: '#9CA3AF' }}>x{d.Qty}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Total Bayar & Action */}
                    <div style={{
                      borderTop: '1px solid #F0F0F0',
                      paddingTop: '12px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginTop: '8px'
                    }}>
                      <div>
                        <span style={{ fontSize: '0.75rem', color: '#9CA3AF', display: 'block' }}>Total Bayar</span>
                        <span style={{ fontWeight: '700', fontSize: '1.1rem', color: '#5E9E7D' }}>
                          {formatCurrency(o.Total_Bayar)}
                        </span>
                      </div>
                      <span style={{
                        fontSize: '0.85rem',
                        fontWeight: '600',
                        color: '#82C39B',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        Kelola &rarr;
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="empty-text">Tidak ada pesanan menunggu</p>
            )}
          </div>
        </>
      )}
    </DashboardLayout>
  );
}

export default KasirDashboard;
