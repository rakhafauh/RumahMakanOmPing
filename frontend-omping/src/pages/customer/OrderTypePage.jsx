/**
 * OrderTypePage - Pilihan Dine In / Takeaway (Optimasi Lansia/Non-Tech)
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Utensils, ShoppingBag } from 'lucide-react';
import Navbar from '../../components/common/Navbar';
import '../../styles/customer.css';

function OrderTypePage() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);

  const handleProceed = () => {
    if (!selected) return;
    sessionStorage.setItem('omping_order_type', selected);
    navigate('/payment');
  };

  return (
    <div className="order-type-page" style={{ padding: '16px', minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <Navbar variant="customer" onBack={() => navigate('/register')} />

      <motion.div
        className="order-type-container"
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
        <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#1e293b', margin: '0 0 8px 0', textAlign: 'center' }}>Pilih Cara Makan</h2>
        <p style={{ fontSize: '0.95rem', fontWeight: '500', color: '#64748b', textAlign: 'center', margin: '0 0 20px 0', lineHeight: '1.4' }}>
          Ketuk salah satu pilihan di bawah ini:
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Card Dine In */}
          <motion.div
            onClick={() => setSelected('dine_in')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{
              padding: '14px 16px',
              borderRadius: '12px',
              border: selected === 'dine_in' ? '2.5px solid #2ecc71' : '1.5px solid #cbd5e1',
              backgroundColor: selected === 'dine_in' ? '#e8f5e9' : '#ffffff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              transition: 'all 0.2s',
              boxShadow: selected === 'dine_in' ? '0 4px 8px rgba(46, 204, 113, 0.15)' : '0 2px 4px rgba(0,0,0,0.02)'
            }}
          >
            <div 
              style={{ 
                width: '48px', 
                height: '48px', 
                borderRadius: '8px', 
                backgroundColor: selected === 'dine_in' ? '#2ecc71' : '#f1f5f9', 
                color: selected === 'dine_in' ? '#ffffff' : '#475569', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <Utensils size={24} strokeWidth={2.5} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1e293b', margin: '0 0 2px 0' }}>Makan di Sini</h3>
              <p style={{ fontSize: '0.85rem', fontWeight: '500', color: '#64748b', margin: 0, lineHeight: '1.3' }}>
                Nikmati hidangan langsung di meja restoran
              </p>
            </div>
          </motion.div>

          {/* Card Takeaway */}
          <motion.div
            onClick={() => setSelected('takeaway')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{
              padding: '14px 16px',
              borderRadius: '12px',
              border: selected === 'takeaway' ? '2.5px solid #2ecc71' : '1.5px solid #cbd5e1',
              backgroundColor: selected === 'takeaway' ? '#e8f5e9' : '#ffffff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              transition: 'all 0.2s',
              boxShadow: selected === 'takeaway' ? '0 4px 8px rgba(46, 204, 113, 0.15)' : '0 2px 4px rgba(0,0,0,0.02)'
            }}
          >
            <div 
              style={{ 
                width: '48px', 
                height: '48px', 
                borderRadius: '8px', 
                backgroundColor: selected === 'takeaway' ? '#2ecc71' : '#f1f5f9', 
                color: selected === 'takeaway' ? '#ffffff' : '#475569', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <ShoppingBag size={24} strokeWidth={2.5} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1e293b', margin: '0 0 2px 0' }}>Bawa Pulang</h3>
              <p style={{ fontSize: '0.85rem', fontWeight: '500', color: '#64748b', margin: 0, lineHeight: '1.3' }}>
                Bungkus makanan untuk dinikmati di rumah
              </p>
            </div>
          </motion.div>
        </div>

        {/* Tombol Lanjutkan */}
        <button
          onClick={handleProceed}
          disabled={!selected}
          style={{ 
            marginTop: '24px',
            width: '100%',
            height: '48px',
            backgroundColor: selected ? '#2ecc71' : '#cbd5e1',
            color: '#ffffff',
            border: 'none',
            borderRadius: '10px',
            fontSize: '1.1rem',
            fontWeight: '700',
            cursor: selected ? 'pointer' : 'not-allowed',
            boxShadow: selected ? '0 4px 12px rgba(46, 204, 113, 0.25)' : 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s'
          }}
        >
          Lanjut ke Pembayaran
        </button>
      </motion.div>
    </div>
  );
}

export default OrderTypePage;
