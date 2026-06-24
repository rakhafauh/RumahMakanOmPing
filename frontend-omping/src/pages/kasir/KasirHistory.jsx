/**
 * KasirHistory - Riwayat pembayaran untuk Kasir
 */
import React, { useState, useEffect } from 'react';
import { FileText, Search } from 'lucide-react';
import DashboardLayout from '../../components/common/DashboardLayout';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import paymentService from '../../services/paymentService';
import orderService from '../../services/orderService';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDateTime } from '../../utils/formatDate';
import '../../styles/dashboard.css';

function KasirHistory() {
  const [payments, setPayments] = useState([]);
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const [paymentsData, ordersData] = await Promise.all([
        paymentService.getAll(),
        orderService.getAll(),
      ]);
      setPayments(paymentsData || []);
      setOrders(ordersData || []);
    } catch (err) {
      console.error('Gagal memuat data riwayat pembayaran:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filtered = payments.filter(
    (p) =>
      search === '' ||
      (p.Pelanggan?.Nama_Pelanggan || '').toLowerCase().includes(search.toLowerCase()) ||
      String(p.Pelanggan?.No_Hp || '').includes(search)
  );

  /**
   * Ambil detail items dari pesanan terkait
   */
  const getOrderItems = (payment) => {
    const order = orders.find((o) => o.Id_Pesan === payment.Id_Pesan);
    return order?.DetailPesans || [];
  };

  /* ============ Detail row style ============ */
  const detailRowStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '8px 0',
    borderBottom: '1px solid #f5f5f5',
    fontSize: '14px',
  };

  const detailLabelStyle = {
    color: '#6B7280',
    fontWeight: '500',
  };

  const detailValueStyle = {
    color: '#2D3436',
    fontWeight: '600',
  };

  const sectionTitleStyle = {
    fontSize: '14px',
    fontWeight: '700',
    color: '#2D3436',
    marginBottom: '8px',
    marginTop: '16px',
  };

  const itemRowStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '6px 0',
    borderBottom: '1px solid #f0f0f0',
    fontSize: '13px',
  };

  return (
    <DashboardLayout role="kasir">
      <div className="dashboard-header">
        <h1>
          <FileText size={24} /> Riwayat Pembayaran
        </h1>
      </div>

      <div className="toolbar">
        <div className="search-wrapper">
          <Search size={18} />
          <input
            placeholder="Cari nama atau No HP..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="data-table">
        {loading ? (
          <p style={{ textAlign: 'center', padding: '24px', color: '#636E72' }}>Memuat data riwayat...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Tanggal</th>
                <th>Pelanggan</th>
                <th>Total</th>
                <th>Metode</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? (
                filtered.map((p) => (
                  <tr key={p.Id_Bayar}>
                    <td>{formatDateTime(p.Tanggal_Bayar)}</td>
                    <td>{p.Pelanggan?.Nama_Pelanggan || '-'}</td>
                    <td>
                      <strong>{formatCurrency(p.Grand_Bayar)}</strong>
                    </td>
                    <td>
                      <span
                        style={{ cursor: 'pointer' }}
                        onClick={() => setSelectedPayment(p)}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.opacity = '0.75';
                          e.currentTarget.style.transform = 'scale(1.05)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.opacity = '1';
                          e.currentTarget.style.transform = 'scale(1)';
                        }}
                      >
                        <Badge
                          text={p.Metode_Bayar === 'QRIS' ? 'QRIS' : 'Tunai'}
                          variant={p.Metode_Bayar === 'QRIS' ? 'info' : 'default'}
                          style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                        />
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="empty-cell">
                    Belum ada riwayat pembayaran
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Detail Modal */}
      <Modal
        isOpen={!!selectedPayment}
        onClose={() => setSelectedPayment(null)}
        title="Detail Transaksi"
        size="md"
      >
        {selectedPayment && (
          <div>
            {/* Info card */}
            <div
              style={{
                background: '#F6FAF7',
                borderRadius: '12px',
                padding: '16px 20px',
                marginBottom: '8px',
              }}
            >
              <div style={detailRowStyle}>
                <span style={detailLabelStyle}>ID Transaksi</span>
                <span style={detailValueStyle}>{selectedPayment.Id_Bayar}</span>
              </div>
              <div style={detailRowStyle}>
                <span style={detailLabelStyle}>Tanggal</span>
                <span style={detailValueStyle}>
                  {formatDateTime(selectedPayment.Tanggal_Bayar)}
                </span>
              </div>
              <div style={detailRowStyle}>
                <span style={detailLabelStyle}>Pelanggan</span>
                <span style={detailValueStyle}>
                  {selectedPayment.Pelanggan?.Nama_Pelanggan || '-'}
                </span>
              </div>
              <div style={detailRowStyle}>
                <span style={detailLabelStyle}>Telepon</span>
                <span style={detailValueStyle}>
                  {selectedPayment.Pelanggan?.No_Hp || '-'}
                </span>
              </div>
              <div style={detailRowStyle}>
                <span style={detailLabelStyle}>Metode Bayar</span>
                <span style={detailValueStyle}>
                  <Badge
                    text={selectedPayment.Metode_Bayar === 'QRIS' ? 'QRIS' : 'Tunai'}
                    variant={selectedPayment.Metode_Bayar === 'QRIS' ? 'info' : 'default'}
                  />
                </span>
              </div>
              <div style={detailRowStyle}>
                <span style={detailLabelStyle}>ID Pesanan</span>
                <span style={detailValueStyle}>{selectedPayment.Id_Pesan}</span>
              </div>
              <div style={{ ...detailRowStyle, borderBottom: 'none' }}>
                <span style={detailLabelStyle}>Grand Total</span>
                <span
                  style={{
                    ...detailValueStyle,
                    fontSize: '16px',
                    color: '#82C39B',
                  }}
                >
                  {formatCurrency(selectedPayment.Grand_Bayar)}
                </span>
              </div>
            </div>

            {/* Items ordered */}
            {(() => {
              const items = getOrderItems(selectedPayment);
              if (items.length === 0) return null;
              return (
                <div>
                  <p style={sectionTitleStyle}>Item yang Dipesan</p>
                  <div
                    style={{
                      background: 'white',
                      border: '1px solid #E0E0E0',
                      borderRadius: '10px',
                      padding: '12px 16px',
                    }}
                  >
                    {items.map((d, i) => (
                      <div key={i} style={itemRowStyle}>
                        <span style={{ color: '#2D3436' }}>
                          {d.Menu?.Nama_Menu || `Menu #${d.Id_Menu}`}
                        </span>
                        <span style={{ color: '#6B7280' }}>x{d.Qty}</span>
                        <span style={{ fontWeight: '600', color: '#2D3436' }}>
                          {formatCurrency((d.Menu?.Harga_Menu || 0) * d.Qty)}
                        </span>
                      </div>
                    ))}

                    {/* Total line */}
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '10px 0 4px 0',
                        marginTop: '6px',
                        borderTop: '2px solid #E0E0E0',
                        fontWeight: '700',
                        fontSize: '15px',
                      }}
                    >
                      <span>Total</span>
                      <span style={{ color: '#82C39B' }}>
                        {formatCurrency(selectedPayment.Grand_Bayar)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Close button */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
              <button
                style={{
                  padding: '10px 24px',
                  borderRadius: '8px',
                  border: 'none',
                  background: '#82C39B',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                }}
                onClick={() => setSelectedPayment(null)}
              >
                Tutup
              </button>
            </div>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
}

export default KasirHistory;
