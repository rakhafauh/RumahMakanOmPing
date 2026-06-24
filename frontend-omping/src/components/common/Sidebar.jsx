// ============================================================
// Sidebar.jsx - Sidebar navigasi dashboard
// Fixed sidebar untuk desktop, collapsible pada layar kecil
// Mendukung role: owner, kasir, dapur
// ============================================================
import React, { memo } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import logoResto from '../../assets/logoResto.png';

import {
  LayoutDashboard,
  ClipboardList,
  UtensilsCrossed,
  Users,
  Receipt,
  CreditCard,
  LogOut,
  X,
} from 'lucide-react';

/**
 * Konfigurasi navigasi berdasarkan role (lowercase keys)
 * Path harus sesuai dengan route di App.jsx
 */
const navigationConfig = {
  owner: [
    { path: '/owner', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { path: '/owner/orders', label: 'Pesanan', icon: ClipboardList },
    { path: '/owner/menu', label: 'Menu', icon: UtensilsCrossed },
    { path: '/owner/users', label: 'Karyawan', icon: Users },
    { path: '/owner/transactions', label: 'Riwayat Transaksi', icon: Receipt },
  ],
  kasir: [
    { path: '/kasir', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { path: '/kasir/orders', label: 'Pesanan', icon: ClipboardList },
    { path: '/kasir/menu', label: 'Menu', icon: UtensilsCrossed },
    { path: '/kasir/history', label: 'Riwayat Pembayaran', icon: CreditCard },
  ],
  dapur: [
    { path: '/dapur', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { path: '/dapur/menu', label: 'Menu', icon: UtensilsCrossed },
  ],
};

/**
 * Warna-warna sidebar (pastel green theme)
 */
const COLORS = {
  bg: '#5E9E7D',
  bgHover: '#6FAF8B',
  bgActive: '#4A8565',
  accent: '#FFD966',
  text: 'rgba(255, 255, 255, 0.85)',
  textActive: '#ffffff',
  border: 'rgba(255, 255, 255, 0.15)',
};

/**
 * Komponen Sidebar dashboard
 * @param {string} role - Role pengguna (lowercase): owner, kasir, dapur
 * @param {string} activePath - Path aktif saat ini
 * @param {boolean} collapsed - Status collapsed sidebar
 * @param {function} onCollapse - Handler toggle collapse
 * @param {string} userName - Nama pengguna
 * @param {function} onLogout - Handler logout
 */
const Sidebar = memo(function Sidebar({
  role = 'owner',
  activePath = '',
  collapsed = false,
  onCollapse,
  userName = '',
  onLogout,
}) {
  const navigate = useNavigate();
  const roleLower = role.toLowerCase();
  const navItems = navigationConfig[roleLower] || navigationConfig.owner;

  // Style dasar sidebar
  const sidebarStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: collapsed ? '0px' : '260px',
    height: '100vh',
    backgroundColor: COLORS.bg,
    display: 'flex',
    flexDirection: 'column',
    transition: 'width 0.3s ease',
    overflow: 'hidden',
    zIndex: 200,
    boxShadow: '2px 0 8px rgba(0, 0, 0, 0.1)',
  };

  return (
    <aside className="sidebar" style={sidebarStyle}>
      {/* === Header: Logo & nama restoran === */}
      <div
        style={{
          padding: '20px',
          borderBottom: `1px solid ${COLORS.border}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            cursor: 'pointer',
            minWidth: 0,
          }}
          onClick={() => navigate(`/${roleLower}`)}
        >
          {/* Logo ikon */}
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              backgroundColor: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              flexShrink: 0,
              boxShadow: 'var(--shadow)',
            }}
          >
            <img src={logoResto} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>

          {/* Nama restoran */}
          <div style={{ minWidth: 0 }}>
            <h2
              style={{
                margin: 0,
                fontSize: '15px',
                fontWeight: '700',
                color: '#ffffff',
                whiteSpace: 'nowrap',
                lineHeight: '1.2',
              }}
            >
              Om Ping
            </h2>
            <span
              style={{
                fontSize: '11px',
                color: COLORS.accent,
                fontWeight: '500',
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
              }}
            >
              Rumah Makan
            </span>
          </div>
        </div>

        {/* Tombol tutup di mobile */}
        {onCollapse && (
          <motion.button
            onClick={onCollapse}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '28px',
              height: '28px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              color: COLORS.text,
              cursor: 'pointer',
            }}
            whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
            whileTap={{ scale: 0.9 }}
          >
            <X size={16} />
          </motion.button>
        )}
      </div>

      {/* === Menu navigasi === */}
      <nav
        style={{
          flex: 1,
          padding: '16px 12px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
        }}
      >
        {/* Label kategori */}
        <span
          style={{
            fontSize: '11px',
            fontWeight: '600',
            color: COLORS.text,
            textTransform: 'uppercase',
            letterSpacing: '0.8px',
            padding: '0 10px',
            marginBottom: '8px',
          }}
        >
          Menu Utama
        </span>

        {/* Link navigasi */}
        {navItems.map((item) => {
          const IconComponent = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end || false}
              style={{ textDecoration: 'none' }}
            >
              {({ isActive }) => (
                <motion.div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    backgroundColor: isActive ? COLORS.bgActive : 'transparent',
                    color: isActive ? COLORS.textActive : COLORS.text,
                    cursor: 'pointer',
                    position: 'relative',
                    fontSize: '14px',
                    fontWeight: isActive ? '600' : '500',
                    transition: 'background-color 0.2s',
                    whiteSpace: 'nowrap',
                  }}
                  whileHover={{
                    backgroundColor: isActive ? COLORS.bgActive : COLORS.bgHover,
                  }}
                >
                  {/* Indikator aktif */}
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active"
                      style={{
                        position: 'absolute',
                        left: '0',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: '3px',
                        height: '20px',
                        borderRadius: '0 4px 4px 0',
                        backgroundColor: COLORS.accent,
                      }}
                      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    />
                  )}

                  <IconComponent
                    size={20}
                    style={{
                      color: isActive ? COLORS.accent : 'inherit',
                      flexShrink: 0,
                    }}
                  />
                  <span>{item.label}</span>
                </motion.div>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* === Footer: User name & logout === */}
      <div
        style={{
          padding: '16px',
          borderTop: `1px solid ${COLORS.border}`,
          flexShrink: 0,
        }}
      >
        {/* User name */}
        {userName && (
          <div
            style={{
              marginBottom: '12px',
              padding: '8px 12px',
              borderRadius: '10px',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: '13px',
                fontWeight: '600',
                color: '#ffffff',
                textAlign: 'center',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {userName}
            </p>
          </div>
        )}

        {/* Tombol logout */}
        <motion.button
          onClick={onLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            width: '100%',
            padding: '10px',
            borderRadius: '10px',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            backgroundColor: 'rgba(239, 68, 68, 0.08)',
            color: '#FCA5A5',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: '600',
            fontFamily: 'inherit',
            transition: 'background-color 0.2s',
          }}
          whileHover={{
            backgroundColor: 'rgba(239, 68, 68, 0.15)',
          }}
          whileTap={{ scale: 0.97 }}
        >
          <LogOut size={16} />
          <span>Keluar</span>
        </motion.button>
      </div>
    </aside>
  );
});

export default Sidebar;
