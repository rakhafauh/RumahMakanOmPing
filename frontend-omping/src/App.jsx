// ============================================================
// App.jsx - Router utama aplikasi Rumah Makan Om Ping
// Mengatur semua rute: pelanggan, owner, kasir, dapur
// Termasuk proteksi rute berdasarkan role & animasi transisi
// ============================================================
import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Hook autentikasi
import { useAuth } from './context/AuthContext';

// Komponen common
import ToastContainer from './components/common/Toast';
import LoadingSpinner from './components/common/LoadingSpinner';

// ========================
// Halaman Pelanggan
// ========================
import HomePage from './pages/HomePage';
import MenuPage from './pages/customer/MenuPage';
import CartPage from './pages/customer/CartPage';
import RegisterPage from './pages/customer/RegisterPage';
import OrderTypePage from './pages/customer/OrderTypePage';
import PaymentPage from './pages/customer/PaymentPage';
import OrderStatusPage from './pages/customer/OrderStatusPage';

// Komponen pembayaran (dirender sebagai halaman)
import QRISPayment from './components/customer/QRISPayment';
import CashPayment from './components/customer/CashPayment';

// ========================
// Halaman Login
// ========================
import LoginPage from './pages/LoginPage';

// ========================
// Halaman Owner
// ========================
import OwnerDashboard from './pages/owner/OwnerDashboard';
import OwnerOrders from './pages/owner/OwnerOrders';
import OwnerMenu from './pages/owner/OwnerMenu';
import OwnerUsers from './pages/owner/OwnerUsers';
import OwnerTransactions from './pages/owner/OwnerTransactions';

// ========================
// Halaman Kasir
// ========================
import KasirDashboard from './pages/kasir/KasirDashboard';
import KasirOrders from './pages/kasir/KasirOrders';
import KasirMenu from './pages/kasir/KasirMenu';
import KasirHistory from './pages/kasir/KasirHistory';

// ========================
// Halaman Dapur
// ========================
import DapurDashboard from './pages/dapur/DapurDashboard';
import DapurMenu from './pages/dapur/DapurMenu';

// Styles
import './App.css';

// ============================================================
// ProtectedRoute - Komponen proteksi rute berdasarkan role
// Cek autentikasi dan role user sebelum mengizinkan akses
// ============================================================

/**
 * Mapping role ke path dashboard masing-masing
 * Digunakan untuk redirect ketika user mengakses halaman yang bukan haknya
 */
const roleDashboardMap = {
  owner: '/owner',
  kasir: '/kasir',
  dapur: '/dapur',
};

/**
 * ProtectedRoute Component
 * @param {React.ReactNode} children - Komponen halaman yang dilindungi
 * @param {string[]} allowedRoles - Daftar role yang diizinkan ('owner' | 'kasir' | 'dapur')
 */
function ProtectedRoute({ children, allowedRoles }) {
  const { user, role, isAuthenticated, loading } = useAuth();

  // Tampilkan loading saat mengecek status autentikasi
  if (loading) {
    return <LoadingSpinner text="Memverifikasi akses..." />;
  }

  // Redirect ke login jika belum terautentikasi
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Cek apakah role user termasuk dalam daftar yang diizinkan
  const userRole = (role || user?.role || '').toLowerCase();

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    // Redirect ke dashboard sesuai role user
    const redirectPath = roleDashboardMap[userRole] || '/login';
    return <Navigate to={redirectPath} replace />;
  }

  return children;
}

// ============================================================
// App - Komponen utama dengan routing
// ============================================================
function App() {
  const location = useLocation();

  return (
    <>
      {/* Toast notifikasi global - selalu tampil di semua halaman */}
      <ToastContainer />

      {/* AnimatePresence untuk transisi antar halaman */}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>

          {/* ============================== */}
          {/* Rute Pelanggan (Customer)      */}
          {/* ============================== */}
          <Route path="/" element={<HomePage />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/order-type" element={<OrderTypePage />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/payment/qris" element={<QRISPayment />} />
          <Route path="/payment/cash" element={<CashPayment />} />
          <Route path="/order-status" element={<OrderStatusPage />} />

          {/* ============================== */}
          {/* Rute Login                     */}
          {/* ============================== */}
          <Route path="/login" element={<LoginPage />} />

          {/* ============================== */}
          {/* Rute Owner (Pemilik)           */}
          {/* ============================== */}
          <Route
            path="/owner"
            element={
              <ProtectedRoute allowedRoles={['owner']}>
                <OwnerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/owner/orders"
            element={
              <ProtectedRoute allowedRoles={['owner']}>
                <OwnerOrders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/owner/menu"
            element={
              <ProtectedRoute allowedRoles={['owner']}>
                <OwnerMenu />
              </ProtectedRoute>
            }
          />
          <Route
            path="/owner/users"
            element={
              <ProtectedRoute allowedRoles={['owner']}>
                <OwnerUsers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/owner/transactions"
            element={
              <ProtectedRoute allowedRoles={['owner']}>
                <OwnerTransactions />
              </ProtectedRoute>
            }
          />

          {/* ============================== */}
          {/* Rute Kasir                     */}
          {/* ============================== */}
          <Route
            path="/kasir"
            element={
              <ProtectedRoute allowedRoles={['kasir']}>
                <KasirDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/kasir/orders"
            element={
              <ProtectedRoute allowedRoles={['kasir']}>
                <KasirOrders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/kasir/menu"
            element={
              <ProtectedRoute allowedRoles={['kasir']}>
                <KasirMenu />
              </ProtectedRoute>
            }
          />
          <Route
            path="/kasir/history"
            element={
              <ProtectedRoute allowedRoles={['kasir']}>
                <KasirHistory />
              </ProtectedRoute>
            }
          />

          {/* ============================== */}
          {/* Rute Dapur                     */}
          {/* ============================== */}
          <Route
            path="/dapur"
            element={
              <ProtectedRoute allowedRoles={['dapur']}>
                <DapurDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dapur/menu"
            element={
              <ProtectedRoute allowedRoles={['dapur']}>
                <DapurMenu />
              </ProtectedRoute>
            }
          />

          {/* ============================== */}
          {/* Fallback - redirect ke beranda */}
          {/* ============================== */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </>
  );
}

export default App;
