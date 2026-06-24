// ============================================================
// Navbar.jsx - Navigasi bar responsif
// Mendukung variant customer (mobile-first) dan admin (desktop)
// ============================================================
import React, { memo } from 'react';
import { motion } from 'framer-motion';
import {
  ShoppingCart,
  ArrowLeft,
  Menu as MenuIcon,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Badge from './Badge';
import logoResto from '../../assets/logoResto.png';

/**
 * Mapping role ke label dan variant badge
 */
const roleBadgeConfig = {
  Owner: { text: 'Owner', variant: 'info' },
  Kasir: { text: 'Kasir', variant: 'success' },
  Dapur: { text: 'Dapur', variant: 'warning' },
};

/**
 * Komponen Navbar responsif
 * @param {string} variant - 'customer' atau 'admin'
 * @param {number} cartCount - Jumlah item di keranjang (customer)
 * @param {function} onBack - Handler tombol kembali (customer)
 * @param {function} onCartClick - Handler klik keranjang (customer)
 * @param {string} userName - Nama user (admin)
 * @param {string} userRole - Role user (admin): Owner, Kasir, Dapur
 * @param {function} onLogout - Handler logout (admin)
 * @param {function} onToggleSidebar - Handler toggle sidebar (admin)
 * @param {boolean} sidebarCollapsed - Status sidebar collapsed (admin)
 */
const Navbar = memo(function Navbar({
  variant = 'customer',
  cartCount = 0,
  onBack,
  onCartClick,
  userName = '',
  userRole = '',
  onLogout,
  onToggleSidebar,
  sidebarCollapsed = false,
}) {
  const navigate = useNavigate();

  // ======================== CUSTOMER NAVBAR ========================
  if (variant === 'customer') {
    return (
      <nav
        className="navbar navbar-customer"
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #F0F0F0',
          boxShadow: '0 1px 4px rgba(0, 0, 0, 0.04)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 16px',
            maxWidth: '480px',
            margin: '0 auto',
            width: '100%',
            boxSizing: 'border-box',
          }}
        >
          {/* Kiri: Tombol kembali atau logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {onBack ? (
              <motion.button
                onClick={onBack}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  border: 'none',
                  backgroundColor: '#F3F4F6',
                  cursor: 'pointer',
                  color: '#374151',
                }}
                whileTap={{ scale: 0.9 }}
              >
                <ArrowLeft size={20} />
              </motion.button>
            ) : null}

            {/* Logo dan nama restoran */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
              }}
              onClick={() => navigate('/')}
            >
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  backgroundColor: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  boxShadow: 'var(--shadow)',
                }}
              >
                <img src={logoResto} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </div>
              <span
                style={{
                  fontSize: '16px',
                  fontWeight: '700',
                  color: '#1F2937',
                  letterSpacing: '-0.3px',
                }}
              >
                Om Ping
              </span>
            </div>
          </div>

          {/* Kanan: Keranjang belanja */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <motion.button
              onClick={onCartClick || (() => navigate('/cart'))}
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                border: 'none',
                backgroundColor: cartCount > 0 ? 'rgba(76, 175, 80, 0.1)' : '#F3F4F6',
                cursor: 'pointer',
                color: cartCount > 0 ? '#4CAF50' : '#6B7280',
              }}
              whileTap={{ scale: 0.9 }}
            >
              <ShoppingCart size={20} />

              {/* Badge jumlah item */}
              {cartCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '-4px',
                    minWidth: '18px',
                    height: '18px',
                    borderRadius: '9px',
                    backgroundColor: '#EF4444',
                    color: '#ffffff',
                    fontSize: '11px',
                    fontWeight: '700',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0 4px',
                    lineHeight: 1,
                  }}
                >
                  {cartCount > 99 ? '99+' : cartCount}
                </motion.span>
              )}
            </motion.button>
          </div>
        </div>
      </nav>
    );
  }

  // ======================== ADMIN NAVBAR ========================
  const roleConfig = roleBadgeConfig[userRole] || { text: userRole, variant: 'default' };

  return (
    <nav
      className="navbar navbar-admin"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #F0F0F0',
        boxShadow: '0 1px 4px rgba(0, 0, 0, 0.04)',
        padding: '0 24px',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      {/* Kiri: Toggle sidebar + tanggal */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Tombol toggle sidebar */}
        {onToggleSidebar && (
          <motion.button
            onClick={onToggleSidebar}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: '#F3F4F6',
              cursor: 'pointer',
              color: '#374151',
            }}
            whileTap={{ scale: 0.9 }}
          >
            <MenuIcon size={20} />
          </motion.button>
        )}

        {/* Info tanggal */}
        <div>
          <p
            style={{
              margin: 0,
              fontSize: '13px',
              color: '#9CA3AF',
            }}
          >
            {new Date().toLocaleDateString('id-ID', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
      </div>

      {/* Kanan: Role badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Role badge */}
        <Badge text={roleConfig.text} variant={roleConfig.variant} />
      </div>
    </nav>
  );
});

export default Navbar;
