/**
 * KasirOrders - Kelola pesanan untuk Kasir
 * Terima/Tolak pesanan, lihat status, cetak struk
 */
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, CheckCircle, XCircle, Printer } from 'lucide-react';
import DashboardLayout from '../../components/common/DashboardLayout';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import orderService from '../../services/orderService';
import paymentService from '../../services/paymentService';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDateTime } from '../../utils/formatDate';
import '../../styles/dashboard.css';

const statusTabs = [
  { value: 'semua', label: 'Semua' },
  { value: 'pesanan masuk', label: 'Pesanan Masuk' },
  { value: 'diproses', label: 'Diproses' },
  { value: 'pesanan selesai', label: 'Selesai' },
];

function KasirOrders() {
  const { karyawan } = useAuth();
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('semua');
  const [receiptOrder, setReceiptOrder] = useState(null);

  const getNumericId = (id) => {
    if (typeof id === 'number') return id;
    const num = parseInt(String(id).replace(/\D/g, ''), 10);
    return isNaN(num) ? 0 : num;
  };

  const loadOrders = async () => {
    try {
      const data = await orderService.getAll();
      const sorted = (data || []).sort((a, b) => getNumericId(b.Id_Pesan) - getNumericId(a.Id_Pesan));
      setOrders(sorted);
    } catch (err) {
      console.error('Gagal memuat pesanan:', err);
      setOrders([]);
    }
  };

  useEffect(() => {
    loadOrders();
    const interval = setInterval(loadOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  const updateStatus = async (id, status) => {
    try {
      const order = orders.find(o => o.Id_Pesan === id);
      if (status === 'diproses' && order) {
        // Create payment record when accepted
        await paymentService.create({
          Tanggal_Bayar: new Date().toISOString().split('T')[0],
          Metode_Bayar: order.metode_bayar === 'QRIS' ? 'QRIS' : 'cash',
          Grand_Bayar: order.Total_Bayar,
          Id_Pelanggan: order.Id_Pelanggan,
          Id_Karyawan: karyawan?.Id_Karyawan || null,
          Id_Pesan: order.Id_Pesan,
        });
      }

      if (status === 'ditolak') {
        await orderService.delete(id);
        setOrders((prev) => prev.filter((o) => o.Id_Pesan !== id));
      } else {
        await orderService.update(id, { Status_Pesan: status });
        setOrders((prev) =>
          prev.map((o) =>
            o.Id_Pesan === id ? { ...o, Status_Pesan: status } : o
          )
        );
      }
    } catch (err) {
      console.error('Gagal mengubah status:', err);
    }
  };

  const filtered =
    activeTab === 'semua'
      ? orders
      : activeTab === 'pesanan masuk'
      ? orders.filter((o) => !o.Status_Pesan || o.Status_Pesan === 'pesanan masuk')
      : orders.filter((o) => o.Status_Pesan === activeTab);

  const statusBadge = (status) => {
    const displayStatus = !status ? 'pesanan masuk' : status;
    const map = {
      'pesanan masuk': 'warning',
      diproses: 'info',
      'pesanan selesai': 'success',
      ditolak: 'danger',
    };
    return <Badge text={displayStatus} variant={map[displayStatus] || 'default'} />;
  };

  /* ============ Styles ============ */
  const tabContainerStyle = {
    display: 'flex',
    gap: '8px',
    marginBottom: '20px',
    flexWrap: 'wrap',
  };

  const tabBtnStyle = (isActive) => ({
    padding: '8px 20px',
    borderRadius: '20px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'all 0.2s',
    background: isActive ? '#82C39B' : '#EBF7F0',
    color: isActive ? 'white' : '#5E9E7D',
  });

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
    gap: '16px',
  };

  const cardStyle = {
    background: 'white',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    border: '1px solid #E0E0E0',
  };

  const cardHeaderStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  };

  const orderIdStyle = {
    fontSize: '16px',
    fontWeight: '700',
    color: '#2D3436',
  };

  const customerInfoStyle = {
    marginBottom: '12px',
    padding: '8px 12px',
    background: '#F6FAF7',
    borderRadius: '8px',
  };

  const itemRowStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '6px 0',
    borderBottom: '1px solid #f0f0f0',
    fontSize: '14px',
  };

  const totalStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '12px 0',
    marginTop: '8px',
    borderTop: '2px solid #E0E0E0',
    fontWeight: '700',
    fontSize: '16px',
  };

  const dateStyle = {
    fontSize: '12px',
    color: '#9CA3AF',
    marginTop: '8px',
  };

  const actionsStyle = {
    display: 'flex',
    gap: '8px',
    marginTop: '12px',
  };

  const actionBtnBase = {
    border: 'none',
    padding: '8px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '13px',
    fontWeight: '600',
    color: 'white',
  };

  const btnTerima = { ...actionBtnBase, background: '#7BC69B' };
  const btnTolak = { ...actionBtnBase, background: '#FF8B8B' };
  const btnCetak = { ...actionBtnBase, background: '#82C39B' };

  const statusTextStyle = {
    fontSize: '13px',
    color: '#FFD966',
    fontWeight: '500',
    fontStyle: 'italic',
  };

  /* ============ Receipt helpers ============ */
  const receiptLineStyle = {
    margin: '4px 0',
    fontSize: '14px',
    fontFamily: 'monospace',
  };

  const receiptCenterStyle = {
    ...receiptLineStyle,
    textAlign: 'center',
  };

  const separator = '================================';

  return (
    <DashboardLayout role="kasir">
      <div className="dashboard-header">
        <h1>
          <Package size={24} /> Pesanan
        </h1>
      </div>

      {/* Tab filter buttons */}
      <div style={tabContainerStyle}>
        {statusTabs.map((tab) => (
          <button
            key={tab.value}
            style={tabBtnStyle(activeTab === tab.value)}
            onClick={() => setActiveTab(tab.value)}
            onMouseEnter={(e) => {
              if (activeTab !== tab.value) {
                e.currentTarget.style.background = '#d4edda';
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== tab.value) {
                e.currentTarget.style.background = '#EBF7F0';
              }
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Order Cards */}
      <div style={gridStyle}>
        <AnimatePresence>
          {filtered.map((order) => (
            <motion.div
              key={order.Id_Pesan}
              style={cardStyle}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              {/* Header */}
              <div style={cardHeaderStyle}>
                <span style={orderIdStyle}>#{order.Id_Pesan}</span>
                {statusBadge(order.Status_Pesan)}
              </div>

              {/* Customer info */}
              <div style={customerInfoStyle}>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#2D3436' }}>
                  {order.Pelanggan?.Nama_Pelanggan || '-'}
                </div>
                <div style={{ fontSize: '13px', color: '#6B7280', marginTop: '2px' }}>
                  {order.Pelanggan?.No_Hp || '-'}
                </div>
              </div>

              {/* Badges: tipe & metode bayar */}
              <div style={{ display: 'flex', gap: '6px', marginBottom: '12px', flexWrap: 'wrap' }}>
                <Badge
                  text={order.tipe_pesanan === 'takeaway' ? 'Takeaway' : 'Dine In'}
                  variant="info"
                />
                <Badge
                  text={order.metode_bayar === 'QRIS' ? 'QRIS' : 'Tunai'}
                  variant="default"
                />
              </div>

              {/* Items list */}
              <div>
                {(order.DetailPesans || []).map((d, i) => (
                  <div key={i} style={itemRowStyle}>
                    <span>{d.Menu?.Nama_Menu}</span>
                    <span style={{ color: '#6B7280' }}>x{d.Qty}</span>
                    <span style={{ fontWeight: '600' }}>
                      {formatCurrency((d.Menu?.Harga_Menu || 0) * d.Qty)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div style={totalStyle}>
                <span>Total</span>
                <span>{formatCurrency(order.Total_Bayar)}</span>
              </div>

              {/* Date */}
              <div style={dateStyle}>{formatDateTime(order.Tanggal_Pesan)}</div>

              {/* Actions */}
              <div style={actionsStyle}>
                {(order.Status_Pesan === 'pesanan masuk' || !order.Status_Pesan) && (
                  <>
                    <button
                      style={btnTerima}
                      onClick={() => updateStatus(order.Id_Pesan, 'diproses')}
                    >
                      <CheckCircle size={14} /> Terima
                    </button>
                    <button
                      style={btnTolak}
                      onClick={() => updateStatus(order.Id_Pesan, 'ditolak')}
                    >
                      <XCircle size={14} /> Tolak
                    </button>
                  </>
                )}
                {order.Status_Pesan === 'diproses' && (
                  <span style={statusTextStyle}>Menunggu dapur...</span>
                )}
                {order.Status_Pesan === 'pesanan selesai' && (
                  <button
                    style={btnCetak}
                    onClick={() => setReceiptOrder(order)}
                  >
                    <Printer size={14} /> Cetak Struk
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Receipt Modal */}
      <Modal
        isOpen={!!receiptOrder}
        onClose={() => setReceiptOrder(null)}
        title="Struk Pembayaran"
        size="sm"
      >
        {receiptOrder && (
          <div>
            {/* Receipt content — gets the print-only class for window.print() */}
            <div className="print-receipt-content" style={{ fontFamily: 'monospace' }}>
              <p style={{ ...receiptCenterStyle, fontSize: '18px', fontWeight: '700' }}>
                Rumah Makan Om Ping
              </p>
              <p style={receiptCenterStyle}>{separator}</p>
              <p style={receiptLineStyle}>No: #{receiptOrder.Id_Pesan}</p>
              <p style={receiptLineStyle}>
                Tanggal: {formatDateTime(receiptOrder.Tanggal_Pesan)}
              </p>
              <p style={receiptLineStyle}>
                Pelanggan: {receiptOrder.Pelanggan?.Nama_Pelanggan || '-'}
              </p>
              <p style={receiptLineStyle}>
                Telepon: {receiptOrder.Pelanggan?.No_Hp || '-'}
              </p>
              <p style={receiptLineStyle}>
                Tipe: {receiptOrder.tipe_pesanan === 'takeaway' ? 'Takeaway' : 'Dine In'}
              </p>
              <p style={receiptLineStyle}>
                Bayar: {receiptOrder.metode_bayar === 'QRIS' ? 'QRIS' : 'Tunai'}
              </p>
              <p style={receiptCenterStyle}>{separator}</p>

              {(receiptOrder.DetailPesans || []).map((d, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    margin: '4px 0',
                    fontSize: '13px',
                    fontFamily: 'monospace',
                  }}
                >
                  <span>
                    {d.Menu?.Nama_Menu} x{d.Qty}
                  </span>
                  <span>{formatCurrency((d.Menu?.Harga_Menu || 0) * d.Qty)}</span>
                </div>
              ))}

              <p style={receiptCenterStyle}>{separator}</p>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontWeight: '700',
                  fontSize: '16px',
                  margin: '8px 0',
                  fontFamily: 'monospace',
                }}
              >
                <span>TOTAL</span>
                <span>{formatCurrency(receiptOrder.Total_Bayar)}</span>
              </div>
              <p style={receiptCenterStyle}>{separator}</p>
              <p style={{ ...receiptCenterStyle, marginTop: '12px', fontWeight: '600' }}>
                Terima Kasih!
              </p>
            </div>

            {/* Modal action buttons */}
            <div
              style={{
                display: 'flex',
                gap: '10px',
                marginTop: '20px',
                justifyContent: 'flex-end',
              }}
            >
              <button
                style={{
                  padding: '10px 24px',
                  borderRadius: '8px',
                  border: '1px solid #E0E0E0',
                  background: 'white',
                  color: '#4B5563',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                }}
                onClick={() => setReceiptOrder(null)}
              >
                Tutup
              </button>
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
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
                onClick={() => window.print()}
              >
                <Printer size={16} /> Cetak
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Area Cetak Struk (Hanya terlihat saat print) */}
      {createPortal(
        <div id="print-area">
          {receiptOrder && (
            <div className="receipt">
              <div className="receipt__header">
                <div className="receipt__restaurant-name">Rumah Makan Om Ping</div>
                <div className="receipt__address">Jl. Raya Makanan No. 12</div>
                <div className="receipt__phone">Telp: 0812-3456-7890</div>
              </div>
              <div className="receipt__separator"></div>
              <div className="receipt__info">
                <div className="receipt__info-row">
                  <span>No. Pesan:</span>
                  <span>#{receiptOrder.Id_Pesan}</span>
                </div>
                <div className="receipt__info-row">
                  <span>Tanggal:</span>
                  <span>{formatDateTime(receiptOrder.Tanggal_Pesan)}</span>
                </div>
                <div className="receipt__info-row">
                  <span>Pelanggan:</span>
                  <span>{receiptOrder.Pelanggan?.Nama_Pelanggan || '-'}</span>
                </div>
                <div className="receipt__info-row">
                  <span>Tipe:</span>
                  <span>{receiptOrder.tipe_pesanan === 'takeaway' ? 'Takeaway' : 'Dine In'}</span>
                </div>
                <div className="receipt__info-row">
                  <span>Bayar:</span>
                  <span>{receiptOrder.metode_bayar === 'QRIS' ? 'QRIS' : 'Tunai'}</span>
                </div>
              </div>
              <div className="receipt__separator"></div>
              <div className="receipt__items">
                {(receiptOrder.DetailPesans || []).map((d, i) => (
                  <div key={i} className="receipt__item">
                    <div className="receipt__item-name">{d.Menu?.Nama_Menu}</div>
                    <div className="receipt__item-detail">
                      <span>{d.Qty} x {formatCurrency(d.Menu?.Harga_Menu || 0)}</span>
                      <span>{formatCurrency((d.Menu?.Harga_Menu || 0) * d.Qty)}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="receipt__separator"></div>
              <div className="receipt__totals">
                <div className="receipt__total-row grand">
                  <span>TOTAL:</span>
                  <span>{formatCurrency(receiptOrder.Total_Bayar)}</span>
                </div>
              </div>
              <div className="receipt__separator"></div>
              <div className="receipt__footer">
                <div className="receipt__footer-thanks">TERIMA KASIH</div>
                <div className="receipt__footer-info">Silakan datang kembali!</div>
              </div>
            </div>
          )}
        </div>,
        document.body
      )}
    </DashboardLayout>
  );
}

export default KasirOrders;
