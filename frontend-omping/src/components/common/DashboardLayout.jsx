// ============================================================
// DashboardLayout.jsx - Layout wrapper untuk halaman admin
// Menggabungkan Sidebar dan Navbar admin
// Mengelola state collapsed sidebar
// Menggunakan AuthContext untuk data user & logout
// ============================================================
import React, { memo, useState, useCallback, useEffect } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * Helper: capitalize first letter
 * 'owner' -> 'Owner', 'kasir' -> 'Kasir', 'dapur' -> 'Dapur'
 */
function capitalizeRole(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Komponen DashboardLayout
 * Layout utama untuk semua halaman admin (Owner, Kasir, Dapur)
 * Mengatur sidebar + navbar + area konten utama
 *
 * @param {React.ReactNode} children - Konten halaman
 */
const DashboardLayout = memo(function DashboardLayout({ children }) {
  const { karyawan, role, logout } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Nama pengguna dari data karyawan
  const userName = karyawan?.Nama_Karyawan || '';

  // Role lowercase untuk sidebar, capitalized untuk display
  const roleLower = (role || 'owner').toLowerCase();
  const roleDisplay = capitalizeRole(role || 'owner');

  // Deteksi layar kecil & auto-collapse sidebar
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarCollapsed(true);
      }
    };

    // Set awal
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Toggle sidebar
  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed((prev) => !prev);
  }, []);

  // Handler logout: panggil auth logout lalu navigasi ke /login
  const handleLogout = useCallback(() => {
    logout();
    navigate('/login');
  }, [logout, navigate]);

  // Lebar sidebar
  const sidebarWidth = sidebarCollapsed ? 0 : 260;

  return (
    <div
      className="dashboard-layout"
      style={{
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: '#F5F7FA',
      }}
    >
      {/* === Sidebar === */}
      <Sidebar
        role={roleLower}
        activePath={location.pathname}
        collapsed={sidebarCollapsed}
        onCollapse={toggleSidebar}
        userName={userName}
        onLogout={handleLogout}
      />

      {/* Overlay saat sidebar terbuka di mobile */}
      {!sidebarCollapsed && window.innerWidth < 1024 && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            zIndex: 199,
          }}
          onClick={toggleSidebar}
        />
      )}

      {/* === Area konten utama === */}
      <div
        className="dashboard-main"
        style={{
          flex: 1,
          marginLeft: window.innerWidth >= 1024 ? `${sidebarWidth}px` : '0',
          transition: 'margin-left 0.3s ease',
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          minWidth: 0,
        }}
      >
        {/* Navbar atas */}
        <Navbar
          variant="admin"
          userName={userName}
          userRole={roleDisplay}
          onLogout={handleLogout}
          onToggleSidebar={toggleSidebar}
          sidebarCollapsed={sidebarCollapsed}
        />

        {/* Konten halaman */}
        <main
          className="dashboard-content"
          style={{
            flex: 1,
            padding: '24px',
            overflowY: 'auto',
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
});

export default DashboardLayout;
