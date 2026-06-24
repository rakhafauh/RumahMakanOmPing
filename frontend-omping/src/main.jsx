// ============================================================
// main.jsx - Entry point aplikasi Rumah Makan Om Ping
// Membungkus App dengan semua Context Provider
// Urutan: BrowserRouter > NotificationProvider > AuthProvider > CartProvider > OrderProvider
// ============================================================
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

// Context Providers
import { NotificationProvider } from './context/NotificationContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { OrderProvider } from './context/OrderContext';

// Komponen utama
import App from './App';

// Global styles
import './index.css';
import './styles/print.css';

/**
 * Render aplikasi dengan urutan provider:
 * 1. BrowserRouter - routing
 * 2. NotificationProvider - toast/notifikasi global
 * 3. AuthProvider - autentikasi & user state
 * 4. CartProvider - keranjang belanja pelanggan
 * 5. OrderProvider - state pemesanan
 */
createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <NotificationProvider>
        <AuthProvider>
          <CartProvider>
            <OrderProvider>
              <App />
            </OrderProvider>
          </CartProvider>
        </AuthProvider>
      </NotificationProvider>
    </BrowserRouter>
  </React.StrictMode>
);
