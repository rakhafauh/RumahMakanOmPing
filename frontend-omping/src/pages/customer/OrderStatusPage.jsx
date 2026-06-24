/**
 * OrderStatusPage - Halaman status pesanan dengan polling API (Optimasi Lansia/Non-Tech)
 */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, ChefHat, PartyPopper, ArrowLeft, CheckCircle } from 'lucide-react';
import { CookingAnimation, ReadyAnimation } from '../../components/customer/OrderAnimation';
import Navbar from '../../components/common/Navbar';
import { useOrders } from '../../context/OrderContext';
import orderService from '../../services/orderService';
import '../../styles/customer.css';

const steps = [
  { key: 'pesanan masuk', label: 'Pesanan Diterima', icon: Check },
  { key: 'diproses', label: 'Sedang Disiapkan', icon: ChefHat },
  { key: 'pesanan selesai', label: 'Pesanan Siap!', icon: PartyPopper },
];

const mapStatusToStep = (status) => {
  if (!status) return 0;
  const statusLower = status.toLowerCase();
  if (statusLower === 'diproses') return 1;
  if (statusLower === 'pesanan selesai') return 2;
  return 0; // default / pesanan masuk
};

function OrderStatusPage() {
  const navigate = useNavigate();
  const { currentOrder, updateOrderStatus } = useOrders();
  const [currentStep, setCurrentStep] = useState(0);
  const [order, setOrder] = useState(currentOrder);
  const [error, setError] = useState(null);

  // Ambil ID Pesan dari Session Storage atau Context
  const orderId = sessionStorage.getItem('omping_id_pesan') || currentOrder?.Id_Pesan;

  useEffect(() => {
    if (!orderId) {
      setError("Nomor pesanan tidak ditemukan di sistem.");
      return;
    }

    const fetchOrderStatus = async () => {
      try {
        const data = await orderService.getById(orderId);
        if (data) {
          setError(null);
          setOrder(data);
          const step = mapStatusToStep(data.Status_Pesan);
          setCurrentStep(step);

          // Sinkronisasi status dengan context jika berubah
          if (currentOrder && currentOrder.Status_Pesan !== data.Status_Pesan) {
            updateOrderStatus(orderId, data.Status_Pesan);
          }
        }
      } catch (err) {
        console.error("Gagal mengambil status pesanan dari backend:", err);
        setError("Gagal memantau status pesanan secara real-time. Mohon hubungi kasir jika status tidak berubah.");
      }
    };

    // Ambil status pertama kali
    fetchOrderStatus();

    // Polling setiap 4 detik
    const interval = setInterval(fetchOrderStatus, 4000);
    return () => clearInterval(interval);
  }, [orderId, currentOrder, updateOrderStatus]);

  const isComplete = currentStep >= 2;

  // Mendapatkan deskripsi status ramah lansia
  const getStatusDescription = () => {
    if (currentStep === 0) {
      return "Pesanan Anda sudah diterima. Kami sedang meneruskan pesanan Anda ke dapur untuk segera dimasak.";
    }
    if (currentStep === 1) {
      return "Dapur sedang memasak pesanan Anda! Mohon tunggu sebentar, hidangan lezat akan segera siap.";
    }
    return "Pesanan Anda SUDAH SIAP! Silakan ambil hidangan Anda di meja kasir atau hubungi pelayan terdekat.";
  };

  return (
    <div className="order-status-page" style={{ padding: '16px', minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <Navbar variant="customer" />

      <motion.div
        className="status-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
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
        <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#1e293b', margin: '0 0 8px 0' }}>Status Pesanan</h2>
        
        {/* Info No Pesanan */}
        {orderId && (
          <div style={{ backgroundColor: '#f1f5f9', padding: '8px 12px', borderRadius: '8px', display: 'inline-block', marginBottom: '20px', border: '1px solid #cbd5e1' }}>
            <span style={{ fontSize: '0.95rem', fontWeight: '700', color: '#475569' }}>Nomor Pesanan: <strong style={{ color: '#0f172a' }}>{orderId}</strong></span>
          </div>
        )}

        {error && (
          <div style={{ color: '#ef4444', fontSize: '0.85rem', fontWeight: '700', margin: '14px 0', padding: '10px', backgroundColor: '#fef2f2', borderRadius: '8px', border: '1px solid #fecaca', textAlign: 'left', lineHeight: '1.4' }}>
            ⚠️ {error}
          </div>
        )}

        {/* Progress Steps - Clean, legible icons and lines */}
        <div 
          className="status-steps" 
          style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            position: 'relative', 
            marginBottom: '24px',
            padding: '0 10px'
          }}
        >
          {steps.map((step, i) => (
            <div 
              key={step.key} 
              style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                position: 'relative', 
                zIndex: 2,
                flex: 1
              }}
            >
              {/* Dot */}
              <div 
                style={{ 
                  width: '38px', 
                  height: '38px', 
                  borderRadius: '50%', 
                  backgroundColor: i <= currentStep ? '#2ecc71' : '#e2e8f0', 
                  color: i <= currentStep ? '#ffffff' : '#94a3b8', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  border: i === currentStep ? '3px solid #bbf7d0' : '3px solid transparent',
                  boxShadow: i === currentStep ? '0 0 8px rgba(46, 204, 113, 0.3)' : 'none',
                  transition: 'all 0.3s ease'
                }}
              >
                {i < currentStep ? (
                  <Check size={18} strokeWidth={3} />
                ) : i === currentStep ? (
                  <motion.div
                    animate={{ scale: [1, 1.15, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    <step.icon size={18} strokeWidth={3} />
                  </motion.div>
                ) : (
                  <span style={{ fontSize: '1rem', fontWeight: '800' }}>{i + 1}</span>
                )}
              </div>

              {/* Line Connector */}
              {i < steps.length - 1 && (
                <div 
                  style={{ 
                    position: 'absolute', 
                    top: '19px', 
                    left: '50%', 
                    right: '-50%', 
                    height: '3px', 
                    backgroundColor: i < currentStep ? '#2ecc71' : '#e2e8f0',
                    zIndex: -1,
                    transition: 'all 0.3s ease'
                  }} 
                />
              )}

              {/* Label */}
              <span 
                style={{ 
                  fontSize: '0.8rem', 
                  fontWeight: i <= currentStep ? '700' : '600', 
                  color: i <= currentStep ? '#1e293b' : '#94a3b8', 
                  marginTop: '8px',
                  textAlign: 'center',
                  lineHeight: '1.2'
                }}
              >
                {step.label}
              </span>
            </div>
          ))}
        </div>

        {/* Animation Area */}
        <div className="status-animation" style={{ minHeight: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
          {currentStep === 1 && <CookingAnimation />}
          {currentStep >= 2 && <ReadyAnimation />}
          {currentStep === 0 && (
            <motion.div
              className="order-animation"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                color: '#2ecc71',
                gap: '10px'
              }}
            >
              <CheckCircle size={48} strokeWidth={2.5} />
            </motion.div>
          )}
        </div>

        {/* Deskripsi Status */}
        <div 
          style={{ 
            backgroundColor: '#f8fafc', 
            padding: '14px', 
            borderRadius: '10px', 
            border: '1px solid #e2e8f0', 
            marginBottom: '24px' 
          }}
        >
          <p style={{ fontSize: '0.95rem', fontWeight: '600', color: '#334155', margin: 0, lineHeight: '1.4' }}>
            {getStatusDescription()}
          </p>
        </div>

        {isComplete && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <button
              className="btn-primary btn-lg btn-full"
              onClick={() => {
                // Bersihkan data lama saat kembali ke halaman utama
                sessionStorage.removeItem('omping_id_pesan');
                sessionStorage.removeItem('omping_customer');
                sessionStorage.removeItem('omping_order_type');
                navigate('/');
              }}
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
                gap: '6px'
              }}
            >
              <ArrowLeft size={18} strokeWidth={2.5} />
              Kembali ke Halaman Utama
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

export default OrderStatusPage;
