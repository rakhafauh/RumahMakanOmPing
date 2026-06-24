/**
 * CartSummary - Ringkasan keranjang (sticky bottom)
 */
import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency';

function CartSummary({ totalItems, totalPrice, onProceed, label = 'Lanjutkan' }) {
  return (
    <motion.div
      className="cart-summary"
      initial={{ y: 50 }}
      animate={{ y: 0 }}
    >
      <div className="cart-summary-info">
        <div className="cart-summary-count">
          <ShoppingBag size={18} />
          <span>{totalItems} item</span>
        </div>
        <p className="cart-summary-total">{formatCurrency(totalPrice)}</p>
      </div>
      <button className="btn-primary btn-lg" onClick={onProceed} disabled={totalItems === 0}>
        {label}
      </button>
    </motion.div>
  );
}

export default CartSummary;
