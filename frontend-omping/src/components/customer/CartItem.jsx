/**
 * CartItem - Baris item di halaman keranjang (Optimasi Lansia/Non-Tech)
 */
import React from 'react';
import { motion } from 'framer-motion';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency';

function CartItem({ item, onUpdateQty, onRemove }) {
  const { menu, qty } = item;
  const subtotal = menu.Harga_Menu * qty;

  return (
    <motion.div
      className="cart-item"
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50, height: 0 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        padding: '14px',
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        border: '1.5px solid #cbd5e1',
        marginBottom: '12px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.02)'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h4 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#1e293b', margin: 0 }}>
            {menu.Nama_Menu}
          </h4>
          <p style={{ fontSize: '0.85rem', fontWeight: '600', color: '#64748b', margin: '4px 0 0 0' }}>
            {formatCurrency(menu.Harga_Menu)} / porsi
          </p>
        </div>
        <button 
          onClick={() => onRemove(menu.Id_Menu)}
          style={{
            background: 'none',
            border: 'none',
            color: '#ef4444',
            padding: '8px',
            cursor: 'pointer',
            borderRadius: '50%',
            backgroundColor: '#fee2e2',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s'
          }}
        >
          <Trash2 size={18} />
        </button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px dashed #e2e8f0', paddingTop: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#f8fafc', padding: '2px', borderRadius: '8px', border: '1.5px solid #cbd5e1' }}>
          <button 
            onClick={() => onUpdateQty(menu.Id_Menu, qty - 1)}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: '#e2e8f0',
              color: '#475569',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <Minus size={18} strokeWidth={3} />
          </button>
          
          <span style={{ fontSize: '1.1rem', fontWeight: '700', minWidth: '24px', textAlign: 'center', color: '#0f172a' }}>
            {qty}
          </span>
          
          <button 
            onClick={() => onUpdateQty(menu.Id_Menu, qty + 1)}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: '#2ecc71',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <Plus size={18} strokeWidth={3} />
          </button>
        </div>

        <div>
          <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0, textAlign: 'right', fontWeight: 'bold' }}>Total Harga</p>
          <p style={{ fontSize: '1.15rem', fontWeight: '700', color: '#e67e22', margin: 0, textAlign: 'right' }}>
            {formatCurrency(subtotal)}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default CartItem;
