/**
 * QRISPayment - Halaman pembayaran QRIS (Optimasi Lansia/Non-Tech)
 */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { ArrowLeft, Clock, ArrowRight } from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency';
import { useCart } from '../../context/CartContext';
import { useOrders } from '../../context/OrderContext';
import orderService from '../../services/orderService';
import Navbar from '../common/Navbar';
import '../../styles/customer.css';

function QRISPayment() {
  const navigate = useNavigate();
  const { totalPrice, items, clearCart } = useCart();
  const { currentOrder, setCurrentOrder } = useOrders();

  const [order, setOrder] = useState(currentOrder);
  const [loading, setLoading] = useState(!currentOrder);
  const [timeLeft, setTimeLeft] = useState(300); // 5 menit

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

  // Timer countdown
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 20px', fontSize: '1.5rem', fontWeight: '900', color: '#64748b' }}>
        Memuat Pembayaran QRIS...
      </div>
    );
  }

  const activeOrder = order || currentOrder;
  if (!activeOrder && items.length === 0) {
    navigate('/menu');
    return null;
  }

  const amount = activeOrder?.Total_Bayar || totalPrice;
  const orderId = activeOrder?.Id_Pesan || 'TEMP';
  const qrData = `OMPING-PAY-${orderId}-${amount}`;

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
    clearCart();
    navigate('/order-status');
  };

  return (
    <div className="payment-qris-page" style={{ padding: '16px', minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <Navbar variant="customer" onBack={handleBackAndCancelOrder} />

      <motion.div
        className="qris-container"
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
        <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#1e293b', margin: '0 0 6px 0' }}>Scan Kode QR</h2>
        <p className="qris-instruction" style={{ fontSize: '0.95rem', fontWeight: '500', color: '#64748b', margin: '0 0 20px 0', lineHeight: '1.4' }}>
          Gunakan aplikasi bank atau e-wallet (Gopay, OVO, Dana) Anda.
        </p>

        {/* Jumlah Pembayaran */}
        <div 
          className="qris-amount"
          style={{
            backgroundColor: '#f0fdf4',
            padding: '12px 16px',
            borderRadius: '10px',
            border: '1px solid #bbf7d0',
            marginBottom: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px'
          }}
        >
          <span style={{ fontSize: '0.95rem', fontWeight: '700', color: '#16a34a' }}>Jumlah yang Harus Dibayar:</span>
          <strong style={{ fontSize: '1.45rem', fontWeight: '800', color: '#16a34a' }}>{formatCurrency(amount)}</strong>
        </div>

        {/* QR Code */}
        <div 
          className="qris-code-wrapper"
          style={{
            display: 'inline-flex',
            padding: '12px',
            borderRadius: '10px',
            border: '1.5px solid #cbd5e1',
            backgroundColor: '#ffffff',
            marginBottom: '16px',
            boxShadow: '0 4px 10px rgba(0,0,0,0.02)'
          }}
        >
          <QRCodeSVG
            value={qrData}
            size={180}
            level="H"
            includeMargin
            bgColor="#ffffff"
            fgColor="#1e293b"
          />
        </div>

        {/* Timer */}
        <div 
          className="qris-timer"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            fontSize: '0.95rem',
            fontWeight: '700',
            color: '#e67e22',
            marginBottom: '20px'
          }}
        >
          <Clock size={16} strokeWidth={2.5} />
          <span>
            Sisa Waktu: {minutes} menit {seconds.toString().padStart(2, '0')} detik
          </span>
        </div>

        {/* Tombol Lanjutkan ke Status Pesanan */}
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
          className="btn-ghost btn-full"
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

export default QRISPayment;
