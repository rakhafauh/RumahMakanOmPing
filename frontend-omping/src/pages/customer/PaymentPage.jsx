/**
 * PaymentPage - Halaman pilihan metode pembayaran (Optimasi Lansia/Non-Tech)
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { QrCode, Banknote } from 'lucide-react';
import Navbar from '../../components/common/Navbar';
import { useCart } from '../../context/CartContext';
import { useOrders } from '../../context/OrderContext';
import customerService from '../../services/customerService';
import { formatCurrency } from '../../utils/formatCurrency';
import '../../styles/customer.css';

function PaymentPage() {
  const navigate = useNavigate();
  const { items, totalPrice, totalItems } = useCart();
  const { createOrder } = useOrders();
  const [loading, setLoading] = useState(false);

  if (items.length === 0) {
    navigate('/menu');
    return null;
  }

  // Buat order sebelum ke halaman pembayaran
  const handleSelectPayment = async (method) => {
    if (loading) return;
    try {
      setLoading(true);
      const customerStr = sessionStorage.getItem('omping_customer');
      const orderType = sessionStorage.getItem('omping_order_type') || 'dine_in';
      const customer = customerStr ? JSON.parse(customerStr) : { nama: 'Guest', noHp: '0' };

      // 1. Register customer via customerService.create
      const registeredCustomer = await customerService.create({
        Nama_Pelanggan: customer.nama,
        No_Hp: customer.noHp,
      });

      const customerId = registeredCustomer.Id_pelanggan;

      // 2. Create order via OrderContext.createOrder (uses status null)
      const order = await createOrder({
        Id_Pelanggan: customerId,
        Total_Bayar: totalPrice,
        tipe_pesanan: orderType,
        metode_bayar: method,
        Status_Pesan: null,
        Pelanggan: registeredCustomer,
        DetailPesans: items.map((item) => ({
          Id_Menu: item.menu.Id_Menu,
          Qty: item.qty,
          Menu: item.menu,
        })),
      });

      // 3. Save the resulting Id_Pesan to sessionStorage
      sessionStorage.setItem('omping_id_pesan', order.Id_Pesan);

      if (method === 'QRIS') {
        navigate('/payment/qris');
      } else {
        navigate('/payment/cash');
      }
    } catch (error) {
      console.error('Error memproses pembayaran:', error);
      alert('Gagal memproses pesanan Anda. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-page" style={{ padding: '16px', minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <Navbar variant="customer" onBack={() => navigate('/order-type')} />

      {loading && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(255,255,255,0.9)',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px'
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            border: '6px solid #f3f3f3',
            borderTop: '6px solid #2ecc71',
            animation: 'spin 1s linear infinite'
          }} />
          <p style={{ fontSize: '1.4rem', fontWeight: '900', color: '#2c3e50', textAlign: 'center', padding: '0 20px' }}>
            Sedang menyiapkan pesanan Anda...<br/>Mohon tunggu sebentar.
          </p>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      )}

      <motion.div
        className="payment-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          maxWidth: '440px',
          margin: '20px auto 40px auto',
          backgroundColor: '#ffffff',
          padding: '24px',
          borderRadius: '16px',
          border: '1.5px solid #cbd5e1',
          boxShadow: '0 8px 24px rgba(0,0,0,0.05)'
        }}
      >
        <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#1e293b', margin: '0 0 8px 0', textAlign: 'center' }}>Pilih Cara Bayar</h2>
        <p style={{ fontSize: '0.95rem', fontWeight: '500', color: '#64748b', textAlign: 'center', margin: '0 0 20px 0', lineHeight: '1.4' }}>
          Ketuk salah satu metode pembayaran:
        </p>

        {/* Ringkasan Biaya */}
        <div 
          className="payment-summary"
          style={{
            backgroundColor: '#fff7ed',
            padding: '12px 16px',
            borderRadius: '10px',
            border: '1px solid #fed7aa',
            marginBottom: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <span style={{ fontSize: '1rem', fontWeight: '700', color: '#ea580c' }}>Total Bayar ({totalItems} Porsi)</span>
          <strong style={{ fontSize: '1.35rem', fontWeight: '800', color: '#ea580c' }}>{formatCurrency(totalPrice)}</strong>
        </div>

        {/* Pilihan Cara Bayar */}
        <div className="payment-methods" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* QRIS Card */}
          <motion.div
            className="payment-method-card"
            onClick={() => handleSelectPayment('QRIS')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{
              padding: '14px 16px',
              borderRadius: '12px',
              border: '1.5px solid #cbd5e1',
              backgroundColor: '#ffffff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              transition: 'all 0.2s',
              boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
            }}
          >
            <div 
              style={{ 
                width: '48px', 
                height: '48px', 
                borderRadius: '8px', 
                backgroundColor: '#e0f2fe', 
                color: '#0284c7', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <QrCode size={24} strokeWidth={2.5} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1e293b', margin: '0 0 2px 0' }}>Bayar QRIS (Non-Tunai)</h3>
              <p style={{ fontSize: '0.85rem', fontWeight: '500', color: '#64748b', margin: 0, lineHeight: '1.3' }}>
                Scan kode QR dengan HP Anda
              </p>
            </div>
          </motion.div>

          {/* Cash Card */}
          <motion.div
            className="payment-method-card"
            onClick={() => handleSelectPayment('cash')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{
              padding: '14px 16px',
              borderRadius: '12px',
              border: '1.5px solid #cbd5e1',
              backgroundColor: '#ffffff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              transition: 'all 0.2s',
              boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
            }}
          >
            <div 
              style={{ 
                width: '48px', 
                height: '48px', 
                borderRadius: '8px', 
                backgroundColor: '#dcfce7', 
                color: '#16a34a', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <Banknote size={24} strokeWidth={2.5} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1e293b', margin: '0 0 2px 0' }}>Bayar Tunai (Cash)</h3>
              <p style={{ fontSize: '0.85rem', fontWeight: '500', color: '#64748b', margin: 0, lineHeight: '1.3' }}>
                Bayar langsung di meja kasir kami
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

export default PaymentPage;
