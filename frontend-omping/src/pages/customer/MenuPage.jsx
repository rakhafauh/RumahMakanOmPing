/**
 * MenuPage - Halaman browsing menu untuk pelanggan (Optimasi Lansia/Non-Tech)
 */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, ShoppingCart } from 'lucide-react';
import MenuCard from '../../components/customer/MenuCard';
import Navbar from '../../components/common/Navbar';
import { useCart } from '../../context/CartContext';
import menuService from '../../services/menuService';
import { formatCurrency } from '../../utils/formatCurrency';
import '../../styles/customer.css';

const categories = ['Semua', 'Makanan', 'Minuman'];

function MenuPage() {
  const navigate = useNavigate();
  const { addItem, updateQty, getItemQty, totalItems, totalPrice } = useCart();
  const [menus, setMenus] = useState([]);
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setLoading(true);
        const data = await menuService.getAll();
        setMenus(data);
      } catch (error) {
        console.error("Gagal memuat menu:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, []);

  const filtered = menus.filter((m) => {
    const matchCat = activeCategory === 'Semua' || m.Kategori_Menu === activeCategory.toLowerCase();
    const matchSearch = m.Nama_Menu.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="menu-page" style={{ padding: '16px', paddingBottom: totalItems > 0 ? '90px' : '40px', minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <Navbar variant="customer" cartCount={totalItems} onBack={() => navigate('/')} />

      <div className="menu-header" style={{ marginBottom: '16px' }}>
        <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#2c3e50', margin: '12px 0 4px 0' }}>Menu Kami</h2>
        
        {/* Search Bar - Optimized Size */}
        <div className="menu-search" style={{ height: '44px', borderRadius: '10px', display: 'flex', alignItems: 'center', backgroundColor: '#ffffff', border: '1.5px solid #cbd5e1', padding: '0 12px', position: 'relative', marginTop: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
          <Search size={20} style={{ color: '#64748b', marginRight: '8px' }} />
          <input
            type="text"
            placeholder="Cari makanan atau minuman..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              border: 'none',
              background: 'transparent',
              fontSize: '1rem',
              fontWeight: '600',
              width: '100%',
              color: '#1e293b',
              outline: 'none'
            }}
          />
        </div>
      </div>

      {/* Category Tabs - Clean Size */}
      <div className="category-tabs" style={{ display: 'flex', gap: '8px', margin: '14px 0', padding: '4px 0', overflowX: 'auto', scrollbarWidth: 'none' }}>
        {categories.map((cat) => (
          <button
            key={cat}
            className={`category-tab ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat)}
            style={{
              padding: '8px 16px',
              fontSize: '0.95rem',
              fontWeight: '700',
              borderRadius: '20px',
              border: activeCategory === cat ? '1.5px solid #2ecc71' : '1.5px solid #cbd5e1',
              backgroundColor: activeCategory === cat ? '#2ecc71' : '#ffffff',
              color: activeCategory === cat ? '#ffffff' : '#475569',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              boxShadow: activeCategory === cat ? '0 3px 6px rgba(46, 204, 113, 0.2)' : '0 2px 4px rgba(0,0,0,0.02)',
              transition: 'all 0.2s ease'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Menu Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', fontSize: '1.1rem', fontWeight: '600', color: '#64748b' }}>
          Memuat menu makanan...
        </div>
      ) : (
        <div className="menu-grid">
          {filtered.length > 0 ? (
            filtered.map((menu) => (
              <MenuCard
                key={menu.Id_Menu}
                menu={menu}
                qty={getItemQty(menu.Id_Menu)}
                onAdd={addItem}
                onUpdateQty={updateQty}
              />
            ))
          ) : (
            <div className="empty-menu" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <p style={{ fontSize: '1.1rem', fontWeight: '600', color: '#64748b' }}>Menu tidak ditemukan</p>
            </div>
          )}
        </div>
      )}

      {/* Floating Cart Button - Balanced Size */}
      {totalItems > 0 && (
        <motion.div
          className="floating-cart"
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          onClick={() => navigate('/cart')}
          style={{
            position: 'fixed',
            bottom: '16px',
            left: '16px',
            right: '16px',
            height: '54px',
            backgroundColor: '#e67e22',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 16px',
            color: '#ffffff',
            cursor: 'pointer',
            boxShadow: '0 6px 16px rgba(230, 126, 34, 0.4)',
            zIndex: 1000,
            border: '1px solid rgba(255,255,255,0.2)'
          }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <div className="floating-cart-info" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShoppingCart size={22} strokeWidth={2.5} />
            <span style={{ fontSize: '1.05rem', fontWeight: '700' }}>{totalItems} Porsi</span>
          </div>
          <span className="floating-cart-total" style={{ fontSize: '1.1rem', fontWeight: '700', backgroundColor: 'rgba(255,255,255,0.2)', padding: '6px 12px', borderRadius: '8px' }}>
            {formatCurrency(totalPrice)}
          </span>
        </motion.div>
      )}
    </div>
  );
}

export default MenuPage;
