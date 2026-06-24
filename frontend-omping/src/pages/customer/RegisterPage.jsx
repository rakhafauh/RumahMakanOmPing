/**
 * RegisterPage - Halaman registrasi pelanggan (Nama & No HP) (Optimasi Lansia/Non-Tech)
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../../components/common/Navbar';
import RegistrationForm from '../../components/customer/RegistrationForm';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../utils/formatCurrency';
import '../../styles/customer.css';

function RegisterPage() {
  const navigate = useNavigate();
  const { items, totalPrice, totalItems } = useCart();
  const [loading, setLoading] = useState(false);

  if (items.length === 0) {
    navigate('/menu');
    return null;
  }

  const handleSubmit = (data) => {
    setLoading(true);
    // Simpan data pelanggan sementara di sessionStorage
    sessionStorage.setItem('omping_customer', JSON.stringify(data));
    setLoading(false);
    navigate('/order-type');
  };

  return (
    <div className="register-page" style={{ padding: '16px', minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <Navbar variant="customer" onBack={() => navigate('/cart')} />

      <motion.div
        className="register-container"
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
        {/* Ringkasan pesanan */}
        <div 
          className="register-summary"
          style={{
            backgroundColor: '#f8fafc',
            padding: '12px 16px',
            borderRadius: '10px',
            border: '1px solid #e2e8f0',
            marginBottom: '20px'
          }}
        >
          <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#475569', margin: '0 0 4px 0' }}>Ringkasan Pesanan:</h3>
          <p style={{ fontSize: '1.2rem', fontWeight: '800', color: '#e67e22', margin: 0 }}>
            {totalItems} Porsi • {formatCurrency(totalPrice)}
          </p>
        </div>

        <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#1e293b', margin: '0 0 8px 0', textAlign: 'center', lineHeight: '1.2' }}>Isi Nama Anda</h2>
        <p className="register-subtitle" style={{ fontSize: '0.95rem', fontWeight: '500', color: '#64748b', textAlign: 'center', margin: '0 0 20px 0', lineHeight: '1.4' }}>
          Lengkapi data diri singkat Anda untuk mulai memesan makanan.
        </p>

        <RegistrationForm onSubmit={handleSubmit} loading={loading} />
      </motion.div>
    </div>
  );
}

export default RegisterPage;
