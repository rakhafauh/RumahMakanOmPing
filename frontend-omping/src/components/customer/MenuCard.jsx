/**
 * MenuCard - Kartu menu untuk halaman pelanggan (Optimasi Lansia/Non-Tech)
 */
import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Minus, Utensils } from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency';
import { BASE_URL } from '../../config/api';

function MenuCard({ menu, qty, onAdd, onUpdateQty }) {
  const isMakanan = menu.Kategori_Menu === 'makanan';

  // Helper untuk memformat URL gambar
  const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) return path;
    return `${BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
  };

  const imageUrl = getImageUrl(menu.Gambar_Menu);


  return (
    <motion.div
      className="menu-card"
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      style={{
        borderRadius: '16px',
        overflow: 'hidden',
        border: '2.5px solid #e0e0e0',
        backgroundColor: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 8px 16px rgba(0,0,0,0.06)'
      }}
    >
      {/* Product Image Container */}
      {imageUrl ? (
        <div style={{ width: '100%', height: '150px', overflow: 'hidden', position: 'relative', borderBottom: '2px solid #e0e0e0' }}>
          <img 
            src={imageUrl} 
            alt={menu.Nama_Menu} 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            onError={(e) => {
              e.target.onerror = null;
              e.target.style.display = 'none';
              e.target.parentNode.style.backgroundColor = '#E8F5E9';
              // Tampilkan icon fallback
              const fallbackEl = document.createElement('div');
              fallbackEl.style.display = 'flex';
              fallbackEl.style.alignItems = 'center';
              fallbackEl.style.justifyContent = 'center';
              fallbackEl.style.height = '100%';
              fallbackEl.style.color = '#4CAF50';
              fallbackEl.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>';
              e.target.parentNode.appendChild(fallbackEl);
            }}
          />
        </div>
      ) : (
        <div 
          className="menu-card-image-placeholder" 
          style={{ 
            width: '100%', 
            height: '150px', 
            backgroundColor: '#e2f0d9', // Soft pastel green
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            color: '#2e7d32',
            borderBottom: '2px solid #e0e0e0'
          }}
        >
          <Utensils size={52} strokeWidth={2.5} />
        </div>
      )}

      <div className="menu-card-body" style={{ padding: '12px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <span 
            className={`menu-badge ${menu.Kategori_Menu}`}
            style={{
              fontSize: '0.75rem',
              fontWeight: '700',
              padding: '3px 8px',
              borderRadius: '4px',
              backgroundColor: isMakanan ? '#ffebee' : '#e3f2fd',
              color: isMakanan ? '#c62828' : '#1565c0',
              textTransform: 'uppercase',
              display: 'inline-block',
              marginBottom: '6px'
            }}
          >
            {isMakanan ? 'Makanan' : 'Minuman'}
          </span>
          <h3 
            className="menu-card-name" 
            style={{ 
              fontSize: '1rem', 
              fontWeight: '700', 
              color: '#2c3e50', 
              marginBottom: '4px',
              lineHeight: '1.3'
            }}
          >
            {menu.Nama_Menu}
          </h3>
          <p 
            className="menu-card-price" 
            style={{ 
              fontSize: '1.15rem', 
              fontWeight: '700', 
              color: '#e67e22',
              marginBottom: '12px'
            }}
          >
            {formatCurrency(menu.Harga_Menu)}
          </p>
        </div>

        {qty > 0 ? (
          <div 
            className="menu-card-qty" 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              backgroundColor: '#f5f6fa',
              borderRadius: '8px',
              padding: '4px',
              border: '1.5px solid #dcdde1'
            }}
          >
            <motion.button
              className="qty-btn"
              onClick={() => onUpdateQty(menu.Id_Menu, qty - 1)}
              whileTap={{ scale: 0.85 }}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '6px',
                backgroundColor: '#e74c3c',
                color: '#ffffff',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <Minus size={18} strokeWidth={3} />
            </motion.button>
            
            <span 
              className="qty-value" 
              style={{ 
                fontSize: '1.2rem', 
                fontWeight: '700', 
                color: '#2f3640',
                minWidth: '24px',
                textAlign: 'center'
              }}
            >
              {qty}
            </span>

            <motion.button
              className="qty-btn qty-btn-add"
              onClick={() => onUpdateQty(menu.Id_Menu, qty + 1)}
              whileTap={{ scale: 0.85 }}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '6px',
                backgroundColor: '#2ecc71',
                color: '#ffffff',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <Plus size={18} strokeWidth={3} />
            </motion.button>
          </div>
        ) : (
          <motion.button
            className="btn-add-cart"
            onClick={() => onAdd(menu)}
            whileTap={{ scale: 0.9 }}
            style={{
              width: '100%',
              padding: '10px',
              fontSize: '0.95rem',
              fontWeight: '750',
              backgroundColor: '#4CAF50',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(76, 175, 80, 0.2)'
            }}
          >
            <Plus size={18} strokeWidth={3} />
            TAMBAH
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}

export default MenuCard;
