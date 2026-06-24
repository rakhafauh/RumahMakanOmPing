/**
 * CartPage - Halaman keranjang belanja pelanggan (Optimasi Lansia/Non-Tech)
 */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Trash2, ArrowLeft } from 'lucide-react';
import CartItem from '../../components/customer/CartItem';
import Navbar from '../../components/common/Navbar';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../utils/formatCurrency';
import '../../styles/customer.css';

function CartPage() {
  const navigate = useNavigate();
  const { items, totalItems, totalPrice, updateQty, removeItem, clearCart } = useCart();

  return (
    <div className="cart-page" style={{ padding: '16px', paddingBottom: items.length > 0 ? '110px' : '40px', minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <Navbar variant="customer" onBack={() => navigate('/menu')} />

      {/* Header Halaman */}
      <div 
        className="cart-header" 
        style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          margin: '16px 0',
          paddingBottom: '8px',
          borderBottom: '1.5px solid #cbd5e1'
        }}
      >
        <h2 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#2c3e50', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
          <ShoppingCart size={22} style={{ color: '#2ecc71' }} /> Keranjang Belanja
        </h2>
        {items.length > 0 && (
          <button 
            className="btn-ghost btn-sm" 
            onClick={clearCart}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              backgroundColor: '#fee2e2',
              border: '1px solid #fca5a5',
              color: '#dc2626',
              padding: '6px 12px',
              borderRadius: '6px',
              fontSize: '0.85rem',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            <Trash2 size={15} /> Kosongkan
          </button>
        )}
      </div>

      {/* Daftar Item Keranjang */}
      {items.length === 0 ? (
        <motion.div
          className="cart-empty"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            textAlign: 'center',
            padding: '40px 16px',
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            border: '1.5px dashed #cbd5e1',
            marginTop: '20px'
          }}
        >
          <ShoppingCart size={52} style={{ color: '#94a3b8', marginBottom: '16px', opacity: 0.7 }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>Keranjang Masih Kosong</h3>
          <p style={{ fontSize: '0.95rem', fontWeight: '500', color: '#64748b', marginBottom: '20px' }}>Silakan pilih menu lezat kami terlebih dahulu</p>
          <button 
            className="btn-primary" 
            onClick={() => navigate('/menu')}
            style={{
              padding: '10px 24px',
              fontSize: '0.95rem',
              fontWeight: '700',
              backgroundColor: '#4CAF50',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(76, 175, 80, 0.2)'
            }}
          >
            PILIH MENU SEKARANG
          </button>
        </motion.div>
      ) : (
        <>
          <div className="cart-list" style={{ marginTop: '12px' }}>
            <AnimatePresence>
              {items.map((item) => (
                <CartItem
                  key={item.menu.Id_Menu}
                  item={item}
                  onUpdateQty={updateQty}
                  onRemove={removeItem}
                />
              ))}
            </AnimatePresence>
          </div>

          {/* Prominent & Simple Checkout Sticky Bottom Bar */}
          <div 
            style={{
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: '#ffffff',
              borderTop: '1.5px solid #cbd5e1',
              padding: '14px 20px',
              boxShadow: '0 -6px 20px rgba(0,0,0,0.06)',
              zIndex: 1000,
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '1rem', fontWeight: '700', color: '#475569' }}>Total ({totalItems} Porsi)</span>
              <span style={{ fontSize: '1.45rem', fontWeight: '800', color: '#e67e22' }}>{formatCurrency(totalPrice)}</span>
            </div>
            
            <button 
              onClick={() => navigate('/register')}
              style={{
                width: '100%',
                backgroundColor: '#2ecc71',
                color: '#ffffff',
                border: 'none',
                borderRadius: '10px',
                padding: '12px 16px',
                fontSize: '1.1rem',
                fontWeight: '700',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(46, 204, 113, 0.25)',
                transition: 'all 0.2s',
                textAlign: 'center'
              }}
            >
              Lanjutkan Pesanan
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default CartPage;
