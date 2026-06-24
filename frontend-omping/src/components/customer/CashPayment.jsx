/**
 * CashPayment - Halaman instruksi pembayaran tunai (Optimasi Lansia/Non-Tech)
 */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Wallet, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency';
import { useCart } from '../../context/CartContext';
import { useOrders } from '../../context/OrderContext';
import orderService from '../../services/orderService';
import Navbar from '../common/Navbar';
import '../../styles/customer.css';

function CashPayment() {
  const navigate = useNavigate();
  const { totalPrice, clearCart } = useCart();
  const { currentOrder, setCurrentOrder } = useOrders();

  const [order, setOrder] = useState(currentOrder);
  const [loading, setLoading] = useState(!currentOrder);

  // Ambil detail order dari API jika tidak ada di context
  useEffect(() => {
    if (currentOrder) {
      setOrder(currentOrder);
      setLoading(false);
      return;
    }

    const orderId = sessionStorage.getItem('omping_id_pesan');
    if (orderId) {
      const fetchOrder = async () => {
        try {
          const data = await orderService.getById(orderId);
          setOrder(data);
          setCurrentOrder(data);
        } catch (err) {
          console.error("Gagal memuat detail pesanan:", err);
        } finally {
          setLoading(false);
        }
      };
      fetchOrder();
    } else {
      setLoading(false);
    }
  }, [currentOrder, setCurrentOrder]);

  const activeOrder = order || currentOrder;
  const amount = activeOrder?.Total_Bayar || totalPrice;
  const orderId = activeOrder?.Id_Pesan || 'TEMP';

  const handleBackAndCancelOrder = async () => {
    const activeOrderId = activeOrder?.Id_Pesan || orderId;
    const status = activeOrder?.Status_Pesan;

    if (activeOrderId && activeOrderId !== 'TEMP' && (!status || status === 'pesanan masuk')) {
      try {
        await orderService.delete(activeOrderId);
      } catch (err) {
        console.error("Gagal menghapus pesanan saat kembali:", err);
      }
    }
    sessionStorage.removeItem('omping_id_pesan');
    setCurrentOrder(null);
    navigate('/payment');
  };

  const handleProceedToStatus = () => {
    // Kosongkan keranjang belanja setelah checkout selesai
    clearCart();
    navigate('/order-status');
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 20px', fontSize: '1.5rem', fontWeight: '900', color: '#64748b' }}>
        Memuat detail pembayaran...
      </div>
    );
  }

  return (
    <div className="payment-cash-page" style={{ padding: '16px', minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <Navbar variant="customer" onBack={handleBackAndCancelOrder} />

      <motion.div
        className="cash-container"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          maxWidth: '440px',
          margin: '20px auto 40px auto',
          backgroundColor: '#ffffff',
          padding: '24px',
          borderRadius: '16px',
          border: '1.5px solid #cbd5e1',
          boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
          textAlign: 'center'
        }}
      >
        <motion.div
          className="cash-icon"
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            backgroundColor: '#dcfce7',
            color: '#16a34a',
            marginBottom: '16px'
          }}
        >
          <Wallet size={32} strokeWidth={2} />
        </motion.div>

        <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#1e293b', margin: '0 0 12px 0' }}>Bayar di Kasir</h2>

        {/* Info Pesanan */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
          {/* ID Pesan */}
          <div style={{ backgroundColor: '#f1f5f9', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#475569', display: 'block', textTransform: 'uppercase' }}>Nomor Pesanan Anda:</span>
            <strong style={{ fontSize: '1.35rem', fontWeight: '800', color: '#0f172a' }}>{orderId}</strong>
          </div>

          {/* Nominal */}
          <div style={{ backgroundColor: '#fff7ed', padding: '10px', borderRadius: '8px', border: '1px solid #fed7aa' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#ea580c', display: 'block' }}>Total Harga Pesanan:</span>
            <strong style={{ fontSize: '1.45rem', fontWeight: '800', color: '#ea580c' }}>{formatCurrency(amount)}</strong>
          </div>
        </div>

        {/* Petunjuk Bayar Tunai */}
        <div 
          style={{ 
            textAlign: 'left', 
            backgroundColor: '#f8fafc', 
            padding: '14px', 
            borderRadius: '10px', 
            border: '1px solid #e2e8f0', 
            marginBottom: '20px' 
          }}
        >
          <h4 style={{ fontSize: '1rem', fontWeight: '700', color: '#1e293b', margin: '0 0 8px 0' }}>Langkah Pembayaran:</h4>
          <ol style={{ fontSize: '0.9rem', fontWeight: '500', color: '#475569', paddingLeft: '18px', margin: 0, display: 'flex', flexDirection: 'column', gap: '8px', lineHeight: '1.4' }}>
            <li>Silakan berjalan ke meja <strong>Kasir</strong>.</li>
            <li>Sebutkan <strong>Nomor Pesanan</strong> di atas ke kasir: <span style={{ color: '#000', fontSize: '0.95rem', fontWeight: '700' }}>{orderId}</span></li>
            <li>Bayar uang tunai sebesar <strong style={{ color: '#ea580c' }}>{formatCurrency(amount)}</strong>.</li>
            <li>Setelah dibayar, ketuk tombol di bawah ini untuk melihat status pesanan.</li>
          </ol>
        </div>

        {/* Tombol Lanjutkan */}
        <button
          onClick={handleProceedToStatus}
          style={{
            width: '100%',
            height: '48px',
            backgroundColor: '#2ecc71',
            color: '#ffffff',
            border: 'none',
            borderRadius: '10px',
            fontSize: '1.1rem',
            fontWeight: '700',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(46, 204, 113, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            transition: 'all 0.2s'
          }}
        >
          Lihat Status Pesanan <ArrowRight size={18} strokeWidth={2.5} />
        </button>

        {/* Tombol Batal */}
        <button
          onClick={handleBackAndCancelOrder}
          style={{
            width: '100%',
            background: 'none',
            border: 'none',
            color: '#64748b',
            fontSize: '0.95rem',
            fontWeight: '600',
            marginTop: '12px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px'
          }}
        >
          <ArrowLeft size={16} strokeWidth={2.5} /> Kembali ke Pilihan Pembayaran
        </button>

      </motion.div>
    </div>
  );
}

export default CashPayment;
